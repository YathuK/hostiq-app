import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Property from "@/lib/models/Property";
import Job from "@/lib/models/Job";
import Message from "@/lib/models/Message";
import Anthropic from "@anthropic-ai/sdk";
import twilio from "twilio";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function getTwilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Twilio sends form-encoded data
export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;

    if (!from || !body) {
      return new Response("<Response><Message>Sorry, something went wrong.</Message></Response>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Find which property this phone number is associated with
    // Check if it's a cleaner first (from jobs), then check if it could be a guest
    const job = await Job.findOne({ cleanerPhone: from }).sort({ createdAt: -1 });
    let property = null;

    if (job) {
      property = await Property.findById(job.propertyId);
    } else {
      // Try to find any property with auto-respond enabled
      const properties = await Property.find({ autoRespond: true });
      if (properties.length === 1) {
        property = properties[0];
      } else if (properties.length > 1) {
        // Use the most recently created property as default
        property = properties[properties.length - 1];
      }
    }

    // Build context for AI
    const ctx = property?.guestContext || {};
    let systemPrompt = `You are a friendly Airbnb host assistant. Respond to this SMS message helpfully and concisely. Keep responses under 160 characters if possible (SMS limit). Be warm and professional.`;

    if (property) {
      systemPrompt = `You are a friendly Airbnb host assistant for "${property.name}". Respond to SMS messages helpfully. Keep responses under 300 characters for SMS.

PROPERTY INFO:
- Name: ${property.name}
- Access Code: ${property.accessCode || "N/A"}`;
      if (ctx.checkInInstructions) systemPrompt += `\n- Check-in: ${ctx.checkInInstructions}`;
      if (ctx.wifiName && ctx.wifiPassword) systemPrompt += `\n- WiFi: ${ctx.wifiName} / ${ctx.wifiPassword}`;
      if (ctx.parkingInfo) systemPrompt += `\n- Parking: ${ctx.parkingInfo}`;
      if (ctx.houseRules) systemPrompt += `\n- Rules: ${ctx.houseRules}`;
      if (ctx.emergencyContact) systemPrompt += `\n- Emergency: ${ctx.emergencyContact}`;
      if (ctx.customNotes) systemPrompt += `\n- Notes: ${ctx.customNotes}`;
    }

    const anthropic = getAnthropic();
    const aiMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: "user", content: body }],
    });

    const aiResponse = aiMsg.content[0].type === "text" ? aiMsg.content[0].text : "Thanks for your message! The host will get back to you soon.";

    // Save to messages collection
    await Message.create({
      propertyId: property?._id,
      hostId: property?.hostId,
      guestMessage: body,
      aiResponse,
      channel: "sms",
      phone: from,
      sent: true,
    });

    // Reply via Twilio SMS
    const client = getTwilioClient();
    await client.messages.create({
      body: aiResponse,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: from,
    });

    // Return TwiML empty response (we already sent via API)
    return new Response("<Response></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("SMS webhook error:", error);
    return new Response("<Response><Message>Sorry, something went wrong. The host has been notified.</Message></Response>", {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
