import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { userRepo } from "@/app/lib/db/userRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const template = await programRepo.getTemplateDescription(id);
    return NextResponse.json({ status: true, template });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function PUT(request, { params }) {
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

  const { id } = await params;
  const { description, type } = await request.json();
  try {
    const template = await programRepo.updateTemplate(id, description, type);
    return NextResponse.json({ status: true, template });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
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

  try {
    const template = await programRepo.deleteTemplate(id);
    return NextResponse.json({ status: true, template });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}