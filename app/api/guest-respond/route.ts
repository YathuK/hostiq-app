import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Property from "@/lib/models/Property";
import Message from "@/lib/models/Message";
import Host from "@/lib/models/Host";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

function buildSystemPrompt(property: any) {
  const ctx = property.guestContext || {};
  let prompt = `You are a friendly, professional Airbnb host assistant for the property "${property.name}".
You respond to guest messages on behalf of the host. Be warm, helpful, and concise.
Keep responses under 200 words. Never make up information — only use what's provided below.
If you don't know the answer, say you'll check with the host and get back to them.

PROPERTY INFORMATION:
- Property Name: ${property.name}
- Access Code: ${property.accessCode || "Not provided"}`;

  if (ctx.checkInInstructions) prompt += `\n- Check-in Instructions: ${ctx.checkInInstructions}`;
  if (ctx.checkOutInstructions) prompt += `\n- Check-out Instructions: ${ctx.checkOutInstructions}`;
  if (ctx.wifiName) prompt += `\n- WiFi Network: ${ctx.wifiName}`;
  if (ctx.wifiPassword) prompt += `\n- WiFi Password: ${ctx.wifiPassword}`;
  if (ctx.parkingInfo) prompt += `\n- Parking: ${ctx.parkingInfo}`;
  if (ctx.houseRules) prompt += `\n- House Rules: ${ctx.houseRules}`;
  if (ctx.nearbyAttractions) prompt += `\n- Nearby Attractions: ${ctx.nearbyAttractions}`;
  if (ctx.emergencyContact) prompt += `\n- Emergency Contact: ${ctx.emergencyContact}`;
  if (ctx.customNotes) prompt += `\n- Additional Notes: ${ctx.customNotes}`;

  return prompt;
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { propertyId, guestMessage, guestName } = await req.json();
    if (!guestMessage) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const session = await getServerSession();
    let hostId = null;
    if (session?.user?.email) {
      const host = await Host.findOne({ email: session.user.email });
      hostId = host?._id;
    }

    const property = propertyId ? await Property.findById(propertyId) : null;

    const systemPrompt = property
      ? buildSystemPrompt(property)
      : `You are a friendly, professional Airbnb host assistant. Respond to guest messages warmly and helpfully. Keep responses under 200 words.`;

    const anthropic = getAnthropic();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Guest message: "${guestMessage}"`,
        },
      ],
    });

    const aiResponse = message.content[0].type === "text" ? message.content[0].text : "";

    const saved = await Message.create({
      propertyId: propertyId || undefined,
      hostId,
      guestName: guestName || "Guest",
      guestMessage,
      aiResponse,
      channel: "manual",
    });

    return NextResponse.json({ success: true, response: aiResponse, messageId: saved._id });
  } catch (error: any) {
    console.error("Guest respond error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
