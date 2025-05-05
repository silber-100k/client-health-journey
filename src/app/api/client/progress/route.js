import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";

export async function POST(request) {
  const { email} = await request.json();
  try {
    const progress = await clientRepo.getProgressdata(email);
    console.log("updated", progress)
    return NextResponse.json({ status: true, progress });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}

