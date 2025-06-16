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
     You are a professional nutritionist and food analysis expert. Analyze the food image and provide detailed nutritional information in JSON format.

CRITICAL REQUIREMENTS:
1. You MUST respond with valid JSON only - no markdown, no explanations, no code blocks
2. All numeric values must be actual numbers, not strings
3. Include ALL the fields specified in the schema below
4. BE CONSISTENT - same foods should get similar nutritional values
5. Use standard portion sizes and established nutritional databases for consistency
Required JSON Schema:
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
  "description": "string - detailed description of the food",
  "calories": number,
  "fiber": number,
  "sugar": number,
  "sodium": number,
  "vitaminA": number,
  "vitaminC": number,
  "vitaminD": number,
  "vitaminE": number,
  "vitaminK": number,
  "vitaminB1": number,
  "vitaminB2": number,
  "vitaminB3": number,
  "vitaminB6": number,
  "vitaminB12": number,
  "folate": number,
  "calcium": number,
  "iron": number,
  "magnesium": number,
  "phosphorus": number,
  "potassium": number,
  "zinc": number,
  "confidence": number,
  "foodItems": [
    {
      "name": "string",
      "portion": "string",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "plateBalance": {
    "protein": number,
    "carbs": number,
    "fruits": number,
    "vegetables": number,
    "fats": number
  },
  "micronutrientSources": [
    {
      "nutrient": "string",
      "amount": "string",
      "unit": "string",
      "sources": ["string"],
      "benefits": "string"
    }
  ]
}
CONSISTENCY GUIDELINES:
- Use USDA nutritional data as your reference
- For common foods, stick to standard serving sizes
- Round calories to nearest 10, protein/carbs/fat to nearest 5g
- Be consistent with portion size estimates (e.g., chicken breast = 6oz, apple = medium)

MICRONUTRIENT ANALYSIS REQUIREMENTS:
- ALWAYS estimate all vitamins and minerals based on visible food items
- Use standard nutritional values for common foods from USDA database
- Provide realistic estimates for portion sizes shown
- Include micronutrient sources array with detailed breakdown
- Focus on significant nutrient contributors (>5% daily value)
- For fruits/vegetables: emphasize vitamin C, folate, potassium
- For proteins: emphasize iron, B vitamins, zinc
- For dairy: emphasize calcium, vitamin D, B12

UNITS TO USE:
- Calories: kcal
- Macronutrients (protein, carbs, fat, fiber): grams (g)
- Sugar, sodium, calcium, iron, magnesium, phosphorus, potassium: milligrams (mg)
- Vitamin A, folate, vitamin D, vitamin K, vitamin B12: micrograms (mcg)
- Vitamin C, vitamin E, B vitamins (B1,B2,B3,B6), zinc: milligrams (mg)

EXAMPLE MICRONUTRIENTS FOR COMMON FOODS:
- Chicken breast (6oz): iron=1.5mg, vitaminB6=1.2mg, vitaminB12=0.8mcg
- Broccoli (1 cup): vitaminC=80mg, folate=60mcg, vitaminK=220mcg
- Apple (medium): vitaminC=8mg, fiber=4g, potassium=200mg
- Salmon (4oz): vitaminD=15mcg, vitaminB12=4mcg, iron=1mg

Provide accurate nutritional analysis based on visual assessment of the food items, portions, and preparation methods visible in the image.
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