import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import Property from "@/lib/models/Property";
import Photo from "@/lib/models/Photo";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    await dbConnect();
    const job = await Job.findOne({ cleanerToken: params.token });
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const property = await Property.findById(job.propertyId);
    const photosWithImages = await Photo.find({ jobId: job._id });

    return NextResponse.json({
      _id: job._id,
      status: job.status,
      checkoutTime: job.checkoutTime,
      property: {
        name: property?.name || "",
        accessCode: property?.accessCode || "",
        checklist: property?.checklist || [],
      },
      photos: photosWithImages.map((p: any) => ({
        _id: p._id,
        room: p.room,
        imageBase64: p.imageBase64,
      })),
    });
  } catch (error) {
    console.error("Cleaner portal error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
