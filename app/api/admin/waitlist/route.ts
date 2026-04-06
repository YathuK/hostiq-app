import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/lib/models/Waitlist";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "hostiq-admin-2024";

export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const entries = await Waitlist.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ entries, total: entries.length });
}
