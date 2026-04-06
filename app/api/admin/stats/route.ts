import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Waitlist from "@/lib/models/Waitlist";
import Host from "@/lib/models/Host";
import Property from "@/lib/models/Property";
import Job from "@/lib/models/Job";
import Photo from "@/lib/models/Photo";
import Claim from "@/lib/models/Claim";
import Message from "@/lib/models/Message";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "hostiq-admin-2024";

export async function GET(req: Request) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalWaitlist,
    totalHosts,
    totalProperties,
    totalJobs,
    totalPhotos,
    totalClaims,
    totalMessages,
    jobsByStatus,
    signupsThisWeek,
    hostsThisWeek,
    recentWaitlist,
    recentHosts,
  ] = await Promise.all([
    Waitlist.countDocuments(),
    Host.countDocuments(),
    Property.countDocuments(),
    Job.countDocuments(),
    Photo.countDocuments(),
    Claim.countDocuments(),
    Message.countDocuments(),
    Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Waitlist.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Host.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Waitlist.find().sort({ createdAt: -1 }).limit(5).lean(),
    Host.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return NextResponse.json({
    totalWaitlist,
    totalHosts,
    totalProperties,
    totalJobs,
    totalPhotos,
    totalClaims,
    totalMessages,
    jobsByStatus,
    signupsThisWeek,
    hostsThisWeek,
    recentWaitlist,
    recentHosts,
  });
}
