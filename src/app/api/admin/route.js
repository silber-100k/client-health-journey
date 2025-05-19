import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET() {
  const users = await userRepo.getAdminUsers();
  return NextResponse.json({ status: true, users });
}

export async function POST(request) {
  const { fullName, email, phone, role, password, clinicId } = await request.json();
  if (role !== "admin" && role !== "clinic_admin") {
    return NextResponse.json({ status: false, message: "Invalid role" });
  }

  if (role === "clinic_admin" && !clinicId) {
    return NextResponse.json({ status: false, message: "Clinic ID is required" });
  }
  try {
    const user = await userRepo.createAdminUser(fullName, email, phone, role, password, clinicId);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: false, message: error.message });
  }
}
