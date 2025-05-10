import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";

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
  try {
    const template = await programRepo.deleteTemplate(id);
    return NextResponse.json({ status: true, template });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}