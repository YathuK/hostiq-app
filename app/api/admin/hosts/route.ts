import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Host from "@/lib/models/Host";
import Property from "@/lib/models/Property";
import Job from "@/lib/models/Job";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "hostiq-admin-2024";

export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const hosts = await Host.find().sort({ createdAt: -1 }).lean();

  const hostsWithCounts = await Promise.all(
    hosts.map(async (host) => {
      const [propertyCount, jobCount, properties] = await Promise.all([
        Property.countDocuments({ hostId: host._id }),
        Job.countDocuments({ hostId: host._id }),
        Property.find({ hostId: host._id }).select("name").lean(),
      ]);
      return { ...host, propertyCount, jobCount, properties };
    })
  );

  return NextResponse.json({ hosts: hostsWithCounts });
}
