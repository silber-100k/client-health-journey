import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const email = session.user.email;
  const user = await userRepo.getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  
  try {
    const progress = await clientRepo.getProgressdata(email);
    return NextResponse.json({ status: true, progress });
  } catch (error) {
    return NextResponse.json({ status: false, message: error.message });
  }
}