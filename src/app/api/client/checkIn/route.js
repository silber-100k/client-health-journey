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
    breakfastProtein,
    breakfastProteinPortion,
    breakfastFruit,
    breakfastFruitPortion,
    breakfastVegetable,
    breakfastVegetablePortion,
    lunchProtein,
    lunchProteinPortion,
    lunchFruit,
    lunchFruitPortion,
    lunchVegetable,
    lunchVegetablePortion,
    dinnerProtein,
    dinnerProteinPortion,
    dinnerFruit,
    dinnerFruitPortion,
    dinnerVegetable,
    dinnerVegetablePortion,
    snacks,
    snackPortion,
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
      breakfastProtein,
      breakfastProteinPortion,
      breakfastFruit,
      breakfastFruitPortion,
      breakfastVegetable,
      breakfastVegetablePortion,
      lunchProtein,
      lunchProteinPortion,
      lunchFruit,
      lunchFruitPortion,
      lunchVegetable,
      lunchVegetablePortion,
      dinnerProtein,
      dinnerProteinPortion,
      dinnerFruit,
      dinnerFruitPortion,
      dinnerVegetable,
      dinnerVegetablePortion,
      snacks,
      snackPortion,
      supplements,
      notes
    );
    return NextResponse.json({ status: true, checkin });
  } catch (error) {
    return NextResponse.json({ status: false, message: "wrong" });
  }
}
