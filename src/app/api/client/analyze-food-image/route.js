import { NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const formData = await request.formData();
        const images = formData.getAll('images');

        if (!images || images.length === 0) {
            return NextResponse.json(
                { error: 'No images provided' },
                { status: 400 }
            );
        }

        // Convert images to base64
        const imagePromises = images.map(async (image) => {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            return buffer.toString('base64');
        });

        const base64Images = await Promise.all(imagePromises);

        // Prepare the messages for OpenAI
        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `
You are a food nutrition analysis AI. For the provided food image(s), analyze the foods and estimate the nutrition portions using the following rules:

- For "proteinPortion", report the total pure protein mass in ounces (not the total weight of the protein foods; estimate the actual protein mass by multiplying the typical protein percentage for each food by its weight).
- For "carbsPortion", report the total pure carbohydrate mass in ounces (not the total weight of the carbohydrate foods; estimate the actual carbohydrate mass by multiplying the typical carbohydrate percentage for each food by its weight).
- For "fatsPortion", report the total pure fat mass in ounces (not the total weight of the fat foods; estimate the actual fat mass by multiplying the typical fat percentage for each food by its weight).
- For "vegetablesPortion", "fruitPortion", and "otherPortion", report the total edible portion in ounces (excluding inedible parts like skin, bone, peel, etc.).
- If a food cannot be identified, use "" as the description and 0 for the portion.
- For multiple images, sum up the nutrition portions from all images, category by category.
- Do not include any explanation or text outside the JSON. Output the JSON object only.

Return the result in this exact format:
{
    "protein": "combined list of all protein foods",
    "proteinPortion": total protein mass in ounces,
    "carbs": "combined list of all carbohydrate foods",
    "carbsPortion": total carbohydrate mass in ounces,
    "fats": "combined list of all fat foods",
    "fatsPortion": total fat mass in ounces,
    "vegetables": "combined list of all vegetables",
    "vegetablesPortion": total edible portion in ounces of all vegetables,
    "fruit": "combined list of all fruits",
    "fruitPortion": total edible portion in ounces of all fruits,
    "other": "combined list of any other foods not categorized above",
    "otherPortion": total edible portion in ounces of all other foods
}


                          `
                    },
                    ...base64Images.map(base64 => ({
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${base64}`
                        }
                    }))
                ]
            }
        ];

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 800,
            response_format: { type: "json_object" }
        });

        // Parse the response
        const responseText = completion.choices[0].message.content;
        let nutritionData;
        try {
            nutritionData = JSON.parse(responseText);

            // Ensure all portions are numbers
            nutritionData.proteinPortion = parseFloat(nutritionData.proteinPortion) || 0;
            nutritionData.carbsPortion = parseFloat(nutritionData.carbsPortion) || 0;
            nutritionData.fatsPortion = parseFloat(nutritionData.fatsPortion) || 0;
            nutritionData.vegetablesPortion = parseFloat(nutritionData.vegetablesPortion) || 0;
            nutritionData.fruitPortion = parseFloat(nutritionData.fruitPortion) || 0;
            nutritionData.otherPortion = parseFloat(nutritionData.otherPortion) || 0;

            // Round all portions to 2 decimal places
            nutritionData.proteinPortion = Math.round(nutritionData.proteinPortion * 100) / 100;
            nutritionData.carbsPortion = Math.round(nutritionData.carbsPortion * 100) / 100;
            nutritionData.fatsPortion = Math.round(nutritionData.fatsPortion * 100) / 100;
            nutritionData.vegetablesPortion = Math.round(nutritionData.vegetablesPortion * 100) / 100;
            nutritionData.fruitPortion = Math.round(nutritionData.fruitPortion * 100) / 100;
            nutritionData.otherPortion = Math.round(nutritionData.otherPortion * 100) / 100;

        } catch (error) {
            console.error('Error parsing OpenAI response:', error);
            // Return a default structure if parsing fails
            nutritionData = {
                protein: "",
                proteinPortion: 0,
                carbs: "",
                carbsPortion: 0,
                fats: "",
                fatsPortion: 0,
                vegetables: "",
                vegetablesPortion: 0,
                fruit: "",
                fruitPortion: 0,
                other: "",
                otherPortion: 0
            };
        }

        return NextResponse.json(nutritionData);
    } catch (error) {
        console.error('Error analyzing food images:', error);
        return NextResponse.json(
            { error: 'Failed to analyze food images' },
            { status: 500 }
        );
    }
} 