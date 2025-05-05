import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";

export async function POST(request, { params }) {
  const { id } = await params;
  const { name, email, phone} = await request.json();
  try {
    const user = await userRepo.updateCoach(id, name,email, phone);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const user = await userRepo.deleteCoach(id);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const user = await userRepo.resetPassword(id);
    return NextResponse.json({ status: true, user });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}