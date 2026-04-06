import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Host from "@/lib/models/Host";
import Property from "@/lib/models/Property";
import Job from "@/lib/models/Job";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let host = await Host.findOne({ email: session.user.email });
    if (!host) {
      host = await Host.create({ email: session.user.email });
    }

    const properties = await Property.find({ hostId: host._id });
    const propertyIds = properties.map((p: any) => p._id);
    const jobs = await Job.find({ propertyId: { $in: propertyIds } }).sort({ checkoutTime: -1 });

    return NextResponse.json({ properties, jobs });
  } catch (error) {
    console.error("Properties error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    let host = await Host.findOne({ email: session.user.email });
    if (!host) {
      host = await Host.create({ email: session.user.email });
    }

    const data = await req.json();
    const property = await Property.create({
      ...data,
      hostId: host._id,
    });

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Create property error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
