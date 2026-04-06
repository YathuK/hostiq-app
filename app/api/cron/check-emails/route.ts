import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Host from "@/lib/models/Host";
import { processHostEmails } from "@/lib/email-responder";

export const maxDuration = 60; // Allow up to 60 seconds for this endpoint

export async function GET(req: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Also allow without secret for manual triggers during dev
    const url = new URL(req.url);
    if (!url.searchParams.get("secret") || url.searchParams.get("secret") !== process.env.CRON_SECRET) {
      // If no CRON_SECRET is set, allow the request (dev mode)
      if (process.env.CRON_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
  }

  try {
    await dbConnect();

    // Find all hosts with email auto-responder enabled
    const hosts = await Host.find({
      "emailSettings.enabled": true,
      "emailSettings.appPassword": { $ne: "" },
    });

    const results = [];
    for (const host of hosts) {
      try {
        const result = await processHostEmails(host._id.toString());
        results.push({
          hostId: host._id,
          email: host.email,
          ...result,
        });
      } catch (error: any) {
        results.push({
          hostId: host._id,
          email: host.email,
          processed: 0,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      hostsProcessed: hosts.length,
      results,
    });
  } catch (error: any) {
    console.error("Cron check-emails error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
