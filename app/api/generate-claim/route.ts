import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Photo from "@/lib/models/Photo";
import Claim from "@/lib/models/Claim";
import Job from "@/lib/models/Job";
import Property from "@/lib/models/Property";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { jobId, guestName, checkIn, checkOut, itemizedCosts } = await req.json();

    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const property = await Property.findById(job.propertyId);
    const damagePhotos = await Photo.find({ jobId, damageFlagged: true });

    const damageDescriptions = damagePhotos.map(
      (p: any) => `${p.room}: ${p.aiNotes}`
    ).join("\n");

    const costBreakdown = itemizedCosts
      .map((c: any) => `- ${c.item}: $${c.cost}`)
      .join("\n");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Write a formal Airbnb AirCover insurance claim narrative for the following damage found after guest checkout.

Property: ${property?.name || "Airbnb Property"}
Guest Name: ${guestName}
Check-in: ${checkIn}
Check-out: ${checkOut}

Damage found:
${damageDescriptions}

Itemized costs:
${costBreakdown}

Write a professional, factual narrative suitable for an insurance claim. Include timeline, description of damage, and total cost. Be specific and formal.`,
        },
      ],
    });

    const narrative =
      message.content[0].type === "text" ? message.content[0].text : "";

    const claim = await Claim.create({
      jobId,
      guestName,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      narrative,
      itemizedCosts,
      status: "draft",
    });

    return NextResponse.json({ success: true, claim });
  } catch (error) {
    console.error("Generate claim error:", error);
    return NextResponse.json({ error: "Failed to generate claim" }, { status: 500 });
  }
}
