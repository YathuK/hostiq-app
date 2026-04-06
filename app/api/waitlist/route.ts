import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/lib/models/Waitlist";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, propertyCount } = await req.json();
    await Waitlist.create({ name, email, propertyCount });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 });
  }
}
