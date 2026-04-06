import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Job from "@/lib/models/Job";
import Property from "@/lib/models/Property";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "hostiq-admin-2024";

export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // Ensure Property model is registered before populate
  void Property;

  const jobs = await Job.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("propertyId", "name")
    .lean();

  return NextResponse.json({ jobs });
}
