import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const user = await userRepo.getUserById(id);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const { full_name, email, phone, role, is_active } = await request.json();
  try {
    const user = await userRepo.updateAdminUser(id, full_name, email, phone, role, is_active);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const user = await userRepo.deleteAdminUser(id);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}