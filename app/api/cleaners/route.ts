import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Host from "@/lib/models/Host";
import Cleaner from "@/lib/models/Cleaner";

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

    const cleaners = await Cleaner.find({ hostId: host._id }).sort({ createdAt: -1 });

    return NextResponse.json({ cleaners });
  } catch (error) {
    console.error("Cleaners error:", error);
    return NextResponse.json({ error: "Failed to fetch cleaners" }, { status: 500 });
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
    const cleaner = await Cleaner.create({
      hostId: host._id,
      name: data.name,
      phone: data.phone,
      email: data.email || "",
    });

    return NextResponse.json({ cleaner });
  } catch (error) {
    console.error("Create cleaner error:", error);
    return NextResponse.json({ error: "Failed to create cleaner" }, { status: 500 });
  }
}
