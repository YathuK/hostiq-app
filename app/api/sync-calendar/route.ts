import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Property from "@/lib/models/Property";
import Job from "@/lib/models/Job";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { propertyId } = await req.json();
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Fetch iCal
    const res = await fetch(property.icalUrl);
    const icalText = await res.text();

    // Simple iCal parsing - extract DTEND values (checkout times)
    const events: { summary: string; dtend: Date }[] = [];
    const eventBlocks = icalText.split("BEGIN:VEVENT");

    for (const block of eventBlocks.slice(1)) {
      const dtendMatch = block.match(/DTEND[^:]*:(\d{8}(?:T\d{6}Z?)?)/);
      const summaryMatch = block.match(/SUMMARY:(.*)/);
      if (dtendMatch) {
        const raw = dtendMatch[1];
        let date: Date;
        if (raw.length === 8) {
          date = new Date(`${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T11:00:00Z`);
        } else {
          date = new Date(
            `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T${raw.slice(9, 11)}:${raw.slice(11, 13)}:${raw.slice(13, 15)}Z`
          );
        }
        // Only future checkouts within 30 days
        const now = new Date();
        const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (date > now && date < thirtyDays) {
          events.push({
            summary: summaryMatch ? summaryMatch[1].trim() : "Guest",
            dtend: date,
          });
        }
      }
    }

    // Create job documents for checkouts not already in DB
    const newJobs = [];
    for (const event of events) {
      const existing = await Job.findOne({
        propertyId: property._id,
        checkoutTime: event.dtend,
      });
      if (!existing) {
        const cleanerToken = crypto.randomBytes(16).toString("hex");
        const job = await Job.create({
          propertyId: property._id,
          hostId: property.hostId,
          checkoutTime: event.dtend,
          cleanerPhone: property.primaryCleaner?.phone,
          cleanerToken,
          status: "pending",
        });
        newJobs.push(job);

        // Auto-dispatch if checkout within 2 hours
        const twoHours = new Date(Date.now() + 2 * 60 * 60 * 1000);
        if (event.dtend < twoHours) {
          try {
            await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/dispatch-cleaner`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jobId: job._id.toString() }),
            });
          } catch (e) {
            console.error("Auto-dispatch failed:", e);
          }
        }
      }
    }

    const allJobs = await Job.find({ propertyId: property._id }).sort({ checkoutTime: 1 });
    return NextResponse.json({ jobs: allJobs, newJobs: newJobs.length });
  } catch (error) {
    console.error("Sync calendar error:", error);
    return NextResponse.json({ error: "Failed to sync calendar" }, { status: 500 });
  }
}
