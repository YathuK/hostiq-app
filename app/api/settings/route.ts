import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Host from "@/lib/models/Host";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const host = await Host.findOne({ email: session.user.email });
    if (!host) return NextResponse.json({ error: "Host not found" }, { status: 404 });

    return NextResponse.json({
      emailSettings: {
        enabled: host.emailSettings?.enabled || false,
        imapHost: host.emailSettings?.imapHost || "imap.gmail.com",
        imapPort: host.emailSettings?.imapPort || 993,
        smtpHost: host.emailSettings?.smtpHost || "smtp.gmail.com",
        smtpPort: host.emailSettings?.smtpPort || 587,
        emailAddress: host.emailSettings?.emailAddress || "",
        appPassword: host.emailSettings?.appPassword ? "••••••••" : "",
        responseTone: host.emailSettings?.responseTone || "friendly",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const host = await Host.findOne({ email: session.user.email });
    if (!host) return NextResponse.json({ error: "Host not found" }, { status: 404 });

    const data = await req.json();

    if (!host.emailSettings) {
      host.emailSettings = {};
    }

    if (data.enabled !== undefined) host.emailSettings.enabled = data.enabled;
    if (data.imapHost) host.emailSettings.imapHost = data.imapHost;
    if (data.imapPort) host.emailSettings.imapPort = data.imapPort;
    if (data.smtpHost) host.emailSettings.smtpHost = data.smtpHost;
    if (data.smtpPort) host.emailSettings.smtpPort = data.smtpPort;
    if (data.emailAddress) host.emailSettings.emailAddress = data.emailAddress;
    if (data.appPassword && data.appPassword !== "••••••••") {
      host.emailSettings.appPassword = data.appPassword;
    }
    if (data.responseTone) host.emailSettings.responseTone = data.responseTone;

    await host.save();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
