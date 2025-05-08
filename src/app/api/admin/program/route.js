import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";

export async function GET() {
  const programs = await programRepo.getAllProgramsAdmin();
  return NextResponse.json({ status: true, programs });
}