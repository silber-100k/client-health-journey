import { NextResponse } from "next/server";
import { activityRepo } from "@/app/lib/db/activityRepo";


export async function POST(request) {
  const {type,description,clinicId } = await request.json();

  try {
      const activity = await activityRepo.createActivity(type,description,clinicId);
      console.log("activity",activity);
      return NextResponse.json({ status: true, activity });
    } catch (error) {
      return NextResponse.json({ status: false, message: error.message });
    }
}