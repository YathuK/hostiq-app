import { ImapFlow } from "imapflow";
import nodemailer from "nodemailer";
import Anthropic from "@anthropic-ai/sdk";
import dbConnect from "./mongodb";
import Host from "./models/Host";
import Property from "./models/Property";
import Message from "./models/Message";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// Parse Airbnb guest message from email body
function parseAirbnbMessage(subject: string, textBody: string): {
  guestName: string;
  guestMessage: string;
  isAirbnbMessage: boolean;
} {
  // Airbnb notification emails have patterns like:
  // Subject: "New message from [Guest Name]" or "[Guest Name] sent you a message"
  // Body contains the actual guest message

  const isAirbnb =
    subject.toLowerCase().includes("airbnb") ||
    subject.toLowerCase().includes("new message from") ||
    subject.toLowerCase().includes("sent you a message") ||
    textBody.toLowerCase().includes("airbnb") ||
    textBody.toLowerCase().includes("your reservation");

  if (!isAirbnb) {
    return { guestName: "", guestMessage: "", isAirbnbMessage: false };
  }

  // Extract guest name from subject
  let guestName = "Guest";
  const nameMatch =
    subject.match(/(?:New message from|message from)\s+(.+?)(?:\s*[-–—]|\s*$)/i) ||
    subject.match(/(.+?)\s+sent you a message/i);
  if (nameMatch) {
    guestName = nameMatch[1].trim();
  }

  // Extract the actual guest message from the email body
  // Airbnb emails have the message between specific markers
  let guestMessage = textBody;

  // Try to extract just the message portion
  // Common patterns in Airbnb notification emails
  const patterns = [
    /(?:wrote|says|message):\s*\n+([\s\S]*?)(?:\n\s*\n.*(?:Reply|Respond|View|airbnb))/i,
    /(?:sent you a message)\s*\n+([\s\S]*?)(?:\n\s*\n)/i,
    /"([\s\S]*?)"/,
  ];

  for (const pattern of patterns) {
    const match = textBody.match(pattern);
    if (match && match[1] && match[1].trim().length > 5) {
      guestMessage = match[1].trim();
      break;
    }
  }

  // Clean up the message - remove email footer/noise
  guestMessage = guestMessage
    .replace(/\s*---\s*[\s\S]*$/m, "")
    .replace(/\s*Sent from[\s\S]*$/im, "")
    .replace(/\s*View (message|listing|reservation)[\s\S]*$/im, "")
    .replace(/\s*Reply to this[\s\S]*$/im, "")
    .replace(/\s*©[\s\S]*$/m, "")
    .trim();

  // If message is too long or too short, it might not be parsed correctly
  if (guestMessage.length > 2000) {
    guestMessage = guestMessage.slice(0, 2000);
  }

  return {
    guestName,
    guestMessage: guestMessage || textBody.slice(0, 500),
    isAirbnbMessage: true,
  };
}

async function generateResponse(
  guestMessage: string,
  guestName: string,
  property: any,
  tone: string
): Promise<string> {
  const ctx = property?.guestContext || {};
  let systemPrompt = `You are a warm, ${tone} Airbnb host assistant for "${property?.name || "the property"}".
You're auto-responding to a guest message on behalf of the host.
Write as if you ARE the host — use "I" and "my", not "the host".
Be ${tone}, helpful, and natural. Keep responses concise (under 150 words).
Don't start with "Hi [name]" if the message is a follow-up. Match the formality of the guest's message.
Never reveal you are an AI. Never make up information you don't have.
If you genuinely don't know something, say "Let me check on that and get back to you!"

PROPERTY INFO:`;

  if (property?.accessCode) systemPrompt += `\n- Access: ${property.accessCode}`;
  if (ctx.checkInInstructions) systemPrompt += `\n- Check-in: ${ctx.checkInInstructions}`;
  if (ctx.checkOutInstructions) systemPrompt += `\n- Check-out: ${ctx.checkOutInstructions}`;
  if (ctx.wifiName) systemPrompt += `\n- WiFi: ${ctx.wifiName} / Password: ${ctx.wifiPassword}`;
  if (ctx.parkingInfo) systemPrompt += `\n- Parking: ${ctx.parkingInfo}`;
  if (ctx.houseRules) systemPrompt += `\n- House Rules: ${ctx.houseRules}`;
  if (ctx.nearbyAttractions) systemPrompt += `\n- Nearby: ${ctx.nearbyAttractions}`;
  if (ctx.emergencyContact) systemPrompt += `\n- Emergency: ${ctx.emergencyContact}`;
  if (ctx.customNotes) systemPrompt += `\n- Notes: ${ctx.customNotes}`;

  const anthropic = getAnthropic();
  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 400,
    system: systemPrompt,
    messages: [
      { role: "user", content: `Guest "${guestName}" says: "${guestMessage}"` },
    ],
  });

  return msg.content[0].type === "text" ? msg.content[0].text : "Thanks for your message! I'll get back to you shortly.";
}

export async function processHostEmails(hostId: string) {
  await dbConnect();

  const host = await Host.findById(hostId);
  if (!host?.emailSettings?.enabled || !host.emailSettings.appPassword) {
    return { processed: 0, error: "Auto-responder not enabled" };
  }

  const { emailAddress, appPassword, imapHost, imapPort, smtpHost, smtpPort, lastCheckedUid, responseTone } =
    host.emailSettings;

  // Get host's properties for context
  const properties = await Property.find({ hostId: host._id });
  const defaultProperty = properties[0]; // use first property as default context

  let processed = 0;

  const client = new ImapFlow({
    host: imapHost || "imap.gmail.com",
    port: imapPort || 993,
    secure: true,
    auth: {
      user: emailAddress,
      pass: appPassword,
    },
    logger: false,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");

    try {
      // Search for recent unread emails (last 24 hours)
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const messages = client.fetch(
        { seen: false, since },
        { uid: true, envelope: true, source: true }
      );

      for await (const msg of messages) {
        // Skip if we've already processed this UID
        if (lastCheckedUid && msg.uid <= parseInt(lastCheckedUid)) {
          continue;
        }

        const subject = msg.envelope?.subject || "";
        const from = msg.envelope?.from?.[0];
        const replyTo = msg.envelope?.replyTo?.[0] || from;
        const messageId = msg.envelope?.messageId;

        // Get full email body
        const source = msg.source?.toString() || "";

        // Extract text body (simple extraction)
        let textBody = "";
        const textMatch = source.match(
          /Content-Type: text\/plain[\s\S]*?\n\n([\s\S]*?)(?:\n--|\n\r\n--)/
        );
        if (textMatch) {
          textBody = textMatch[1];
        } else {
          // Fallback: try to get body after headers
          const bodyStart = source.indexOf("\n\n");
          if (bodyStart > -1) {
            textBody = source.slice(bodyStart + 2, bodyStart + 3000);
          }
        }

        // Check if this is an Airbnb guest message
        const parsed = parseAirbnbMessage(subject, textBody);
        if (!parsed.isAirbnbMessage || !parsed.guestMessage) {
          continue;
        }

        // Check if we already responded to this message
        const existing = await Message.findOne({
          hostId: host._id,
          guestMessage: parsed.guestMessage.slice(0, 100),
          channel: "email",
        });
        if (existing) continue;

        // Generate AI response
        const aiResponse = await generateResponse(
          parsed.guestMessage,
          parsed.guestName,
          defaultProperty,
          responseTone || "friendly"
        );

        // Send reply via SMTP
        const transporter = nodemailer.createTransport({
          host: smtpHost || "smtp.gmail.com",
          port: smtpPort || 587,
          secure: false,
          auth: {
            user: emailAddress,
            pass: appPassword,
          },
        });

        const replyToAddress = replyTo?.address || from?.address;
        if (replyToAddress) {
          await transporter.sendMail({
            from: emailAddress,
            to: replyToAddress,
            subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
            text: aiResponse,
            inReplyTo: messageId,
            references: messageId,
          });
        }

        // Save to messages collection
        await Message.create({
          propertyId: defaultProperty?._id,
          hostId: host._id,
          guestName: parsed.guestName,
          guestMessage: parsed.guestMessage,
          aiResponse,
          channel: "email",
          sent: true,
        });

        // Mark as read in IMAP
        await client.messageFlagsAdd(msg.uid, ["\\Seen"], { uid: true });

        // Update last checked UID
        host.emailSettings.lastCheckedUid = msg.uid.toString();
        await host.save();

        processed++;
      }
    } finally {
      lock.release();
    }

    await client.logout();
  } catch (error: any) {
    console.error("IMAP error for host:", hostId, error.message);
    try { await client.logout(); } catch {}
    return { processed, error: error.message };
  }

  return { processed, error: null };
}
