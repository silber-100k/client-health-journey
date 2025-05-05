import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";

export async function POST(request) {
  const { id } = await request.json();

  try {
      const checkIns = await clientRepo.getCheckInsbyId(id);

      return NextResponse.json({ status: true, checkIns });
    } catch (error) {
      return NextResponse.json({ status: false, message: error.message });
    }
}