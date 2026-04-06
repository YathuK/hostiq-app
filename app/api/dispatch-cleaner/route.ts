import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import Property from "@/lib/models/Property";
import twilio from "twilio";

function getTwilioClient() {
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const client = getTwilioClient();
    const { jobId } = await req.json();
    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const property = await Property.findById(job.propertyId);
    if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const cleanerUrl = `${baseUrl}/cleaner/${job.cleanerToken}`;

    // Send SMS to primary cleaner
    await client.messages.create({
      body: `HostIQ: New cleaning job for ${property.name}. Checkout at ${new Date(job.checkoutTime).toLocaleString()}. Access code: ${property.accessCode}. View job: ${cleanerUrl}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: property.primaryCleaner.phone,
    });

    job.status = "dispatched";
    job.dispatchedAt = new Date();
    await job.save();

    // Schedule backup cleaner dispatch in 45 minutes
    // In production, use a queue or cron. Here we use a simple timeout indicator.
    // The backup logic would be handled by a cron job checking for unconfirmed jobs.

    return NextResponse.json({ success: true, status: "dispatched" });
  } catch (error) {
    console.error("Dispatch error:", error);
    return NextResponse.json({ error: "Failed to dispatch" }, { status: 500 });
  }
}
