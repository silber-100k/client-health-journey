import { NextResponse } from "next/server";
import { programRepo } from "@/app/lib/db/programRepo";
import { getServerSession } from "next-auth";
import authOptions from "@/app/lib/authoption";
import { userRepo } from "@/app/lib/db/userRepo";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const sessionEmail = session.user.email;
  const sessionUser = await userRepo.getUserByEmail(sessionEmail);
  if (!sessionUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (sessionUser.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const programs = await programRepo.getAllProgramsAdmin();
  return NextResponse.json({ status: true, programs });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userEmail = session.user.email;
  const user = await userRepo.getUserByEmail(userEmail);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const {
    programName,
    programLength,
    programType,
    checkInFrequency,
    description,
    goals,
    foodRules,
    cookingMethods,
    recommendedProteins,
    recommendedVegetables,
    allowedFruits,
    healthyFats,
    foodsToAvoid,
    portionGuidelines,
    supplements,
    weeklySchedule,
    lifestyle,
    messagingPreferences
  } = await request.json();

  try {
    const program = await programRepo.createProgramAdmin({
      program_name: programName,
      program_length: programLength,
      program_type: programType,
      check_in_frequency: checkInFrequency,
      description,
      goals,
      food_rules: foodRules,
      cooking_methods: cookingMethods,
      recommended_proteins: recommendedProteins,
      recommended_vegetables: recommendedVegetables,
      allowed_fruits: allowedFruits,
      healthy_fats: healthyFats,
      foods_to_avoid: foodsToAvoid,
      portion_guidelines: portionGuidelines,
      supplements,
      weekly_schedule: weeklySchedule,
      lifestyle,
      messaging_preferences: messagingPreferences,
    });
    return NextResponse.json({ status: true, program });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: false, message: "error to create program" });
  }
}
