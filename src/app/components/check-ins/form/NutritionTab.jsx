import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import MealSection from "../../../components/check-ins/form/MealSection";

const NutritionTab = ({ register, errors, formData, setValue }) => {
  return (
    <div className="space-y-6">
      {/* Breakfast */}
      <MealSection
        title="Breakfast"
        register={register}
        errors={errors}
        formData={formData}
        setValue={setValue}
        prefix="breakfast"
      />

      {/* Lunch */}
      <MealSection
        title="Lunch"
        register={register}
        errors={errors}
        formData={formData}
        setValue={setValue}
        prefix="lunch"
      />

      {/* Dinner */}
      <MealSection
        title="Dinner"
        register={register}
        errors={errors}
        formData={formData}
        setValue={setValue}
        prefix="dinner"
      />

      {/* Snacks */}
      <div>
        <h3 className="font-medium mb-3">Snacks</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="snacks">Snacks</Label>
              <Textarea
                {...register("snacks")}
                placeholder="List any snacks you had today"
                rows={2}
              />
              {errors.snacks && (
                <span className="text-red-500 text-sm">{errors.snacks.message}</span>
              )}
            </div>
            <div>
              <Label htmlFor="snackPortion">Portion (oz)</Label>
              <Input
                {...register("snackPortion")}
                type="number"
                placeholder="Total snack portions"
              />
              {errors.snackPortion && (
                <span className="text-red-500 text-sm">{errors.snackPortion.message}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTab;
