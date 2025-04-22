import React from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Slider } from "../../../components/ui/slider";

const WellnessTab = ({ checkInData, setCheckInData }) => {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between mb-2">
          <Label>Energy Level (1-10)</Label>
          <span className="text-primary-600 font-medium">
            {checkInData.energyLevel}/10
          </span>
        </div>
        <Slider
          name="energyLevel"
          defaultValue={[5]}
          max={10}
          min={1}
          step={1}
          value={[checkInData.energyLevel]}
          onValueChange={(e) =>
            setCheckInData((prev) => ({ ...prev, ["energyLevel"]: e }))
          }
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Low Energy</span>
          <span>High Energy</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <Label>Mood (1-10)</Label>
          <span className="text-primary-600 font-medium">
            {checkInData.moodLevel}/10
          </span>
        </div>
        <Slider
          name="moodLevel"
          defaultValue={[5]}
          max={10}
          min={1}
          step={1}
          value={[checkInData.moodLevel]}
          onValueChange={(e) =>
            setCheckInData((prev) => ({ ...prev, ["moodLevel"]: e }))
          }
          className="py-4"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Poor Mood</span>
          <span>Great Mood</span>
        </div>
      </div>

      <div>
        <Label htmlFor="sleepHours">Last Night's Sleep (hours)</Label>
        <div className="flex items-center gap-2 mt-[10px]">
          <Input
            name="sleepHours"
            type="number"
            placeholder="Hours of sleep"
            value={checkInData.sleepHours}
            onChange={(e) =>
              setCheckInData((prev) => ({
                ...prev,
                ["sleepHours"]: e.target.value,
              }))
            }
            className="max-w-[120px]"
            min="0"
            max="24"
            step="0.5"
          />
          <span className="text-sm text-gray-500">hours</span>
        </div>
      </div>
    </div>
  );
};

export default WellnessTab;
