import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Photo from "@/lib/models/Photo";
import Job from "@/lib/models/Job";
import Anthropic from "@anthropic-ai/sdk";

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { jobId } = await req.json();

    const photos = await Photo.find({ jobId });
    if (photos.length === 0) {
      return NextResponse.json({ error: "No photos found" }, { status: 404 });
    }

    let hasDamage = false;

    for (const photo of photos) {
      try {
        const base64 = photo.imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const mediaType = photo.imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";

        const message = await getAnthropic().messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType,
                    data: base64,
                  },
                },
                {
                  type: "text",
                  text: `Analyze this Airbnb unit photo from ${photo.room} after guest checkout. Identify any damage, stains, broken items, or cleanliness issues. Be specific. Return JSON only: { "damageFlagged": boolean, "notes": string }`,
                },
              ],
            },
          ],
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const result = JSON.parse(jsonMatch[0]);
          photo.damageFlagged = result.damageFlagged;
          photo.aiNotes = result.notes;
          if (result.damageFlagged) hasDamage = true;
        }
      } catch (e) {
        console.error("AI analysis failed for photo:", photo._id, e);
        photo.aiNotes = "Analysis failed";
      }
      await photo.save();
    }

    const job = await Job.findById(jobId);
    if (job) {
      job.status = hasDamage ? "damage_flagged" : "complete";
      await job.save();
    }

    const updatedPhotos = await Photo.find({ jobId });
    return NextResponse.json({
      success: true,
      hasDamage,
      photos: updatedPhotos.map((p: any) => ({
        _id: p._id,
        room: p.room,
        damageFlagged: p.damageFlagged,
        aiNotes: p.aiNotes,
      })),
    });
  } catch (error) {
    console.error("Analyze photos error:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}
