import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";

export async function POST(request) {
  const {
    name,
    email,
    coachId,
    clinic,
    selectedDate,
    weight,
    waist,
    waterIntake,
    energyLevel,
    moodLevel,
    exerciseType,
    exercise,
    exerciseTime,
    sleepHours,
    nutrition,
    supplements,
    notes
  } = await request.json();

  try {
    const checkin = await clientRepo.createCheckIn(
      name,
      email,
      coachId,
      clinic,
      selectedDate,
      weight,
      waist,
      waterIntake,
      energyLevel,
      moodLevel,
      exerciseType,
      exercise,
      exerciseTime,
      sleepHours,
      nutrition,
      supplements,
      notes
    );
    return NextResponse.json({ status: true, checkin });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ status: false, message: "wrong" });
  }
}
