import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token, action } = await req.json();
    const job = await Job.findOne({ cleanerToken: token });
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const now = new Date();
    switch (action) {
      case "confirm":
        job.status = "confirmed";
        job.confirmedAt = now;
        break;
      case "start":
        job.status = "in_progress";
        break;
      case "complete":
        job.status = "complete";
        job.completedAt = now;
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await job.save();
    return NextResponse.json({ success: true, status: job.status });
  } catch (error) {
    console.error("Cleaner action error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
