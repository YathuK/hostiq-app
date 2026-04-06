import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import Photo from "@/lib/models/Photo";

export async function GET(req: Request, { params }: { params: { jobId: string } }) {
  try {
    await dbConnect();
    const job = await Job.findById(params.jobId);
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const photos = await Photo.find({ jobId: params.jobId });
    return NextResponse.json({ job, photos });
  } catch (error) {
    console.error("Job fetch error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
