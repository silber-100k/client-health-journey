import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";

export async function GET() {
  const programs=await programRepo.getPrograms();
  return NextResponse.json({ status: true, programs });

  
}

export async function POST(request) {
  const { name, type, duration, checkInFrequency, description,tempId, clinicId } = await request.json();

  if (!duration || !checkInFrequency || !description || !clinicId) {
    return NextResponse.json({ status: false, message: "Invalid request" });
  }
  
  try {
    const program = await programRepo.createProgram(name, type, duration, checkInFrequency, description,tempId, clinicId);
    return NextResponse.json({ status: true, program });
  } catch (error) {
    return NextResponse.json({ status: false, message:"error to create program" });


  }
}
