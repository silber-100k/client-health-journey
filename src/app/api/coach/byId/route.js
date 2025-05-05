import { NextResponse } from "next/server";
import { userRepo } from "@/app/lib/db/userRepo";

export async function POST(request) {
  const { id } = await request.json();

  try {
      const user = await userRepo.getUserById(id);
      return NextResponse.json({ status: true, user });
    } catch (error) {
      return NextResponse.json({ status: false, message: error.message });
    }
}