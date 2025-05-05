import { NextResponse } from "next/server";
import { messageRepo } from "@/app/lib/db/messageRepo";

export async function POST(request) {
  const { sender,receiver } = await request.json();

  try {
    const messageHistory = await messageRepo.readMessageHistory(sender,receiver);
    return NextResponse.json({ status: true, messageHistory });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}