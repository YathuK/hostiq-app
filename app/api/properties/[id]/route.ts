import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Host from "@/lib/models/Host";
import Property from "@/lib/models/Property";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const host = await Host.findOne({ email: session.user.email });
    if (!host) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    const property = await Property.findOne({ _id: params.id, hostId: host._id });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Get property error:", error);
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const host = await Host.findOne({ email: session.user.email });
    if (!host) {
      return NextResponse.json({ error: "Host not found" }, { status: 404 });
    }

    const property = await Property.findOne({ _id: params.id, hostId: host._id });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const data = await req.json();

    // Update allowed fields
    property.name = data.name ?? property.name;
    property.icalUrl = data.icalUrl ?? property.icalUrl;
    property.accessCode = data.accessCode ?? property.accessCode;
    property.cleaningFee = data.cleaningFee ?? property.cleaningFee;
    property.primaryCleaner = data.primaryCleaner ?? property.primaryCleaner;
    property.backupCleaner = data.backupCleaner ?? property.backupCleaner;
    property.checklist = data.checklist ?? property.checklist;
    property.guestContext = data.guestContext ?? property.guestContext;
    property.autoRespond = data.autoRespond ?? property.autoRespond;

    await property.save();

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Update property error:", error);
    return NextResponse.json({ error: "Failed to update property" }, { status: 500 });
  }
}
