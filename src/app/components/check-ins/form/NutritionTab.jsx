import React from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import MealSection from "../../../components/check-ins/form/MealSection";

const NutritionTab = ({ checkInData, setCheckInData }) => {
  const handlechange = (e) => {
    setCheckInData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="space-y-6">
      {/* Breakfast */}
      <MealSection
        title="Breakfast"
        checkInData={checkInData}
        setCheckInData={setCheckInData}
      />

      {/* Lunch */}
      <MealSection
        title="Lunch"
        checkInData={checkInData}
        setCheckInData={setCheckInData}
      />

      {/* Dinner */}
      <MealSection
        title="Dinner"
        checkInData={checkInData}
        setCheckInData={setCheckInData}
      />

      {/* Snacks */}
      <div>
        <h3 className="font-medium mb-3">Snacks</h3>
        <div className="space-y-4">
          <div className="grname grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="snacks">Snacks</Label>
              <Textarea
                name="snacks"
                placeholder="List any snacks you had today"
                value={checkInData.snacks}
                onChange={(e) => handlechange(e)}
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="snackPortion">Portion (oz)</Label>
              <Input
                name="snackPortion"
                type="number"
                placeholder="Total snack portions"
                value={checkInData.snackPortion}
                onChange={(e) => handlechange(e)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTab;
