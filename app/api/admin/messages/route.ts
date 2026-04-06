import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Message from "@/lib/models/Message";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "hostiq-admin-2024";

export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const messages = await Message.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ messages });
}
