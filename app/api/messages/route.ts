import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Host from "@/lib/models/Host";
import Message from "@/lib/models/Message";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const host = await Host.findOne({ email: session.user.email });
    if (!host) return NextResponse.json({ messages: [] });

    const messages = await Message.find({ hostId: host._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
