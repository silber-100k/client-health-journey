import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

const NutritionTab = ({ register, errors, formData, setValue, getValues }) => {
  const addNutrition = () => {
    const currentNutrition = getValues("nutrition") || [];
    setValue("nutrition", [
      ...currentNutrition,
      {
        protein: "",
        proteinPortion: "",
        fruit: "",
        fruitPortion: "",
        vegetables: "",
        vegetablesPortion: "",
        carbs: "",
        carbsPortion: "",
        fats: "",
        fatsPortion: "",
        other: "",
        otherPortion: "",
      },
    ], { shouldValidate: true, shouldDirty: true });
  };

  const removeNutrition = (index) => {
    const currentNutrition = getValues("nutrition") || [];
    const newNutrition = currentNutrition.filter((_, i) => i !== index);
    setValue("nutrition", newNutrition, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Nutrition</h3>
          <Button type="button" onClick={addNutrition}>
            <Plus className="mr-2 h-4 w-4" /> Add Nutrition Entry
          </Button>
        </div>
        
        {(formData.nutrition || []).map((item, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 relative">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeNutrition(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Protein</Label>
                <Textarea
                  {...register(`nutrition.${index}.protein`)}
                  placeholder="What protein did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.proteinPortion`)}
                  type="number"
                  placeholder="Portion (oz)"
                />
              </div>

              <div>
                <Label>Fruit</Label>
                <Textarea
                  {...register(`nutrition.${index}.fruit`)}
                  placeholder="What fruit did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.fruitPortion`)}
                  type="number"
                  placeholder="Portion (oz)"
                />
              </div>

              <div>
                <Label>Vegetables</Label>
                <Textarea
                  {...register(`nutrition.${index}.vegetables`)}
                  placeholder="What vegetables did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.vegetablesPortion`)}
                  type="number"
                  placeholder="Portion (oz)"
                />
              </div>

              <div>
                <Label>Carbs</Label>
                <Textarea
                  {...register(`nutrition.${index}.carbs`)}
                  placeholder="What carbs did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.carbsPortion`)}
                  type="number"
                  placeholder="Portion (oz)"
                />
              </div>

              <div>
                <Label>Fats</Label>
                <Textarea
                  {...register(`nutrition.${index}.fats`)}
                  placeholder="What fats did you have?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.fatsPortion`)}
                  type="number"
                  placeholder="Portion (oz)"
                />
              </div>

              <div>
                <Label>Other</Label>
                <Textarea
                  {...register(`nutrition.${index}.other`)}
                  placeholder="Any other food items?"
                  className="mb-2"
                />
                <Input
                  {...register(`nutrition.${index}.otherPortion`)}
                  type="number"
                  placeholder="Portion (oz)"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionTab;
