import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sessionEmail = session.user.email;
  const sessionUser = await userRepo.getUserByEmail(sessionEmail);
  if (!sessionUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const programs = await programRepo.getAllProgramsAdmin();
  return NextResponse.json({ status: true, programs });
}

export async function POST(request) {
  const { name, type, duration, checkInFrequency, description, tempId } = await request.json();
  const all = "all";
  if (!duration || !checkInFrequency || !description) {
    return NextResponse.json({ status: false, message: "Invalid request" });
  }
  try {
    const program = await programRepo.createProgramAdmin(name, type, duration, checkInFrequency, description, tempId, all);

    return NextResponse.json({ status: true, program });
  } catch (error) {
    return NextResponse.json({ status: false, message: "error to create program" });
  }
}
