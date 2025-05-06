import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import authOptions from "@/app/lib/authoption";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import { sendClientRegistrationEmail } from "@/app/lib/api/email";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const email = session.user.email;
    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.role !== "clinic_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const clinicId = user.clinic._id;
    const clients = await clientRepo.getclientsbyclinicId(clinicId);
    return NextResponse.json({ status: true, clients });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email;
    const user = await userRepo.getUserByEmail(userEmail);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.role !== "clinic_admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const clinic = user.clinic._id;

    const { name, email, phone, programId, programCategory, startDate, notes, coachId, weightDate, initialWeight, goals } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ status: false, message: "Invalid request" });
    }
    const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const client = await clientRepo.createClient(name, email, randomPassword, phone, programId, programCategory, startDate, notes, coachId, clinic, weightDate, initialWeight, goals);
    const clientUser = await userRepo.createClientUser(
      name,
      email,
      phone,
      "client",
      randomPassword,
      clinic,
      coachId
    );
    await sendClientRegistrationEmail({ name, email, phone }, user.clinic.name, randomPassword);
    const clientsnum = await clientRepo.updateClientNum(clinic);
    console.log("randompassword", randomPassword);
    return NextResponse.json({ status: true, client });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });


  }
}
