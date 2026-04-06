import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Photo from "@/lib/models/Photo";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { jobId, room, imageBase64 } = await req.json();
    const photo = await Photo.create({ jobId, room, imageBase64 });
    return NextResponse.json({ success: true, photoId: photo._id });
  } catch (error) {
    console.error("Upload photo error:", error);
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}
