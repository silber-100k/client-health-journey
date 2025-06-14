import { NextResponse } from "next/server";
import { clientRepo } from "@/app/lib/db/clientRepo";
import { programRepo } from "@/app/lib/db/programRepo";
import { AIReviewRepo } from "@/app/lib/db/aiReviewRepo"
import OpenAI from 'openai';

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
    notes,
    current,
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
    const program = await programRepo.getProgrambyClientEmail(email);
    const jsonProgram = JSON.stringify(program);
    const jsonCheckIn = JSON.stringify({
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
    });
    const progressData = await clientRepo.getProgressbyClient(email, current);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const prompt = `
You are a world-class digital health coach AI. Your task is to analyze a client’s daily and weekly check-in data alongside their selected health program details, then generate a detailed, personalized review. The review must align with the program’s goals and tone preferences, providing actionable advice, motivational feedback, and clear recommendations.

1. Input Data:
- Client’s Submitted Today Check-In Data (JSON): ${jsonCheckIn}
- Client’s Submitted Weekly Check-In Data (JSON): ${JSON.stringify(progressData)}
- Program Details (JSON): ${jsonProgram}

2. Instructions:
- Analyze all client health metrics (weight, sleep, mood, exercise, hydration, etc.) comparing them against the program’s goals and guidelines.
- Evaluate meal portions (protein, carbs, fats, vegetables) for alignment with program nutrition guidelines.
- Identify strengths and areas needing improvement.
- Generate personalized feedback with:
- Positive yet realistic daily and weekly evaluation sentences.
- Meal evaluation comments using emojis and symbols for clarity.
- Exercise and activity feedback with encouragement.
- Actionable, varied recommendations for sleep, hydration, exercise, and nutrition improvements.
- Specific meal swap suggestions aligned with program portion guidelines.
- Positive reinforcement if client is doing well.
- Calculate a compliance score (0 to 10) based on weekly check-in data adherence to the program.
- Provide a structured JSON output including the following fields, formatted with a dash "-" at the beginning of each sentence and each sentence on a new line:
- json
{
  "weeklyTrend": string,
  "todaySummary": string,
  "today_Review_and_Recommendation": string, // Reference meals as "Meal 1", "Meal 2", etc., and include detailed numbers (grams, ounces, servings, etc.) in your feedback.
  "complianceScore": number,
  "mealReview": [string],  // Each item in this array is a single sentence reviewing one meal (labeled as "Meal 1", "Meal 2", etc.), considering its protein, carbohydrates, fats, and vegetables. The number of meal reviews must match the number of meals in the client's check-in data.
  "mealRecommendation": [
    {
      "proteinPortion": string,
      "carbsPortion": string,
      "fatsPortion": string,
      "foodnames": string
    }
  ],
  "message": string
}
  -The number of items in the mealRecommendation array must be the same as the number of portion guidelines defined in the program (not just the check-in), and each recommendation must strictly follow the program’s portion and food guidelines.
3. Additional Notes:
- Include numerical results wherever possible (e.g., grams, ounces, hours).
- Highlight achievements (e.g., hitting protein goals, consistent exercise) and weak points.
- Use emojis and icons to make feedback engaging and clear.
- Mention any major differences between check-in data and program targets explicitly(for example, the number of meals in today_Review_and_Recommendation).
- Ensure recommendations vary each time for freshness.
- End with a motivational message encouraging the client to keep progressing.
All checkIn review and recommendation must be based on program totally.
4. Formatting:
Please provide the output strictly as a JSON object with the structure above, formatted exactly as specified.
    `;
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
    });
    const aiReview = completion.choices[0].message.content || '';
    const saveReview = await AIReviewRepo.createAIReview(email, aiReview);
    console.log("aiReview", aiReview);
    return NextResponse.json({ status: true, checkin });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ status: false, message: "wrong" });
  }
}
