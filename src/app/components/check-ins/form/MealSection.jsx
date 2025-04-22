import React from "react";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

const MealSection = ({ title, checkInData, setCheckInData }) => {
  // Only show nutrition guidance for main meals, not snacks
  const mealType = title.toLowerCase();
  const showGuidance = mealType !== "snacks";

  const mealId = mealType.toLowerCase();

  return (
    <div className="space-y-4 mb-6">
      <h3 className="font-medium text-lg">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${mealId}-protein`}>Protein</Label>
          <Textarea
            name={`${mealId}Protein`}
            value={checkInData[`${mealId}Protein`]}
            onChange={(e) =>
              setCheckInData((prev) => ({
                ...prev,
                [`${mealId}Protein`]: e.target.value,
              }))
            }
            placeholder={`What protein did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor={`${mealId}-protein-portion`}>
            Protein Portion (oz)
          </Label>
          <Input
            name={`${mealId}ProteinPortion`}
            type="number"
            value={checkInData[`${mealId}ProteinPortion`]}
            onChange={(e) =>
              setCheckInData((prev) => ({
                ...prev,
                [`${mealId}ProteinPortion`]: e.target.value,
              }))
            }
            placeholder="Portion size"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${mealId}-fruit`}>Fruit</Label>
          <Textarea
            name={`${mealId}Fruit`}
            value={checkInData[`${mealId}Fruit`]}
            onChange={(e) =>
              setCheckInData((prev) => ({
                ...prev,
                [`${mealId}Fruit`]: e.target.value,
              }))
            }
            placeholder={`What fruit did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor={`${mealId}-fruit-portion`}>Fruit Portion (oz)</Label>
          <Input
            name={`${mealId}FruitPortion`}
            type="number"
            value={checkInData[`${mealId}FruitPortion`]}
            onChange={(e) =>
              setCheckInData((prev) => ({
                ...prev,
                [`${mealId}FruitPortion`]: e.target.value,
              }))
            }
            placeholder="Portion size"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${mealId}-vegetable`}>Vegetables</Label>
          <Textarea
            name={`${mealId}Vegetable`}
            value={checkInData[`${mealId}Vegetable`]}
            onChange={(e) =>
              setCheckInData((prev) => ({
                ...prev,
                [`${mealId}Vegetable`]: e.target.value,
              }))
            }
            placeholder={`What vegetables did you have for ${title.toLowerCase()}?`}
            rows={2}
          />
        </div>
        <div>
          <Label htmlFor={`${mealId}-vegetable-portion`}>
            Vegetable Portion (oz)
          </Label>
          <Input
            name={`${mealId}VegetablePortion`}
            type="number"
            value={checkInData[`${mealId}VegetablePortion`]}
            onChange={(e) =>
              setCheckInData((prev) => ({
                ...prev,
                [`${mealId}VegetablePortion`]: e.target.value,
              }))
            }
            placeholder="Portion size"
          />
        </div>
      </div>
    </div>
  );
};

export default MealSection;
