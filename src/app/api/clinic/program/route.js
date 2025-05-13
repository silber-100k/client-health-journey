import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { getServerSession } from "next-auth";
import { userRepo } from "@/app/lib/db/userRepo";
import authOptions from "@/app/lib/authoption";

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
    // if (user.role !== "clinic_admin") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }
    const clinicId = user.clinic._id;
    const programs = await programRepo.getPrograms(clinicId);
    return NextResponse.json({ status: true, programs });
  }
  catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }

}

export async function POST(request) {
  const { name, type, duration, checkInFrequency, description, tempId, clinicId } = await request.json();

  if (!duration || !checkInFrequency || !description || !clinicId) {
    return NextResponse.json({ status: false, message: "Invalid request" });
  }

  try {
    const program = await programRepo.createProgram(name, type, duration, checkInFrequency, description, tempId, clinicId);
    return NextResponse.json({ status: true, program });
  } catch (error) {
    return NextResponse.json({ status: false, message: "error to create program" });
  }
}
