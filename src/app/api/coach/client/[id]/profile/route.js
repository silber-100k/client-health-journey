import { NextResponse } from "next/server";
import { clientProfileRepo } from "@/app/lib/db/clientProfileRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = session.user;
    if (user.role !== "coach" && user.role !== "clinic_admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const profile = await clientProfileRepo.getClientProfileByClientId(id);
    console.log("profile", profile)

    if (!profile) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ profile });
}

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = session.user;
    if (user.role !== "coach" && user.role !== "clinic_admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const { profileData, healthConditions, customRequests, coachingPrefs } = await req.json();
    const created = await clientProfileRepo.createClientProfile(id, profileData, healthConditions, customRequests, coachingPrefs);
    return NextResponse.json({ profile: created });
}

export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = session.user;
    if (user.role !== "coach" && user.role !== "clinic_admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    const { profileData, healthConditions, customRequests, coachingPrefs } = await req.json();
    const updated = await clientProfileRepo.updateClientProfile(id, profileData, healthConditions, customRequests, coachingPrefs);
    return NextResponse.json({ profile: updated });
}

export async function DELETE(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const user = session.user;
    if (user.role !== "coach" && user.role !== "clinic_admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = params;
    await clientProfileRepo.deleteClientProfile(id);
    return NextResponse.json({ success: true });
} 