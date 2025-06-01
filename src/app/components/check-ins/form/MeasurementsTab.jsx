import { Input } from "../../..//components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Droplets } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const MeasurementsTab = ({ register, errors, formData, setValue }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="weight">Weight (lbs)</Label>
        <Input
          {...register("weight")}
          type="number"
          placeholder="Enter your current weight"
        />
        {errors.weight && (
          <span className="text-red-500 text-sm">{errors.weight.message}</span>
        )}
      </div>
      <div>
        <Label htmlFor="waist">Waist</Label>
        <Input
          {...register("waist")}
          type="number"
          placeholder="Enter your current waist"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="waterIntake">Water Intake (oz)</Label>
          <div className="flex items-center text-primary-600">
            <Droplets size={16} className="mr-1" />
            <span className="font-medium">{formData.waterIntake} oz</span>
          </div>
        </div>
        <Input
          {...register("waterIntake")}
          type="number"
        />
        {errors.waterIntake && (
          <span className="text-red-500 text-sm">{errors.waterIntake.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="exerciseType">Exercise Type</Label>
        <Select
          value={formData.exerciseType}
          onValueChange={(value) => setValue("exerciseType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exercise type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="steps">Steps</SelectItem>
            <SelectItem value="walking">Walking</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="cycling">Cycling</SelectItem>
            <SelectItem value="swimming">Swimming</SelectItem>
            <SelectItem value="hiking">Hiking</SelectItem>
            <SelectItem value="yoga">Yoga</SelectItem>
            <SelectItem value="strength">Strength Training</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.exerciseType === "steps" ? (
        <div>
          <Label htmlFor="exercise">Daily Steps</Label>
          <Input
            {...register("exercise")}
            type="number"
            placeholder="Enter your daily steps"
          />
          {errors.exercise && (
            <span className="text-red-500 text-sm">{errors.exercise.message}</span>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="exercise">Exercise Description</Label>
            <Textarea
              {...register("exercise")}
              placeholder="Describe your exercise"
            />
            {errors.exercise && (
              <span className="text-red-500 text-sm">{errors.exercise.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="exerciseTime">Duration (minutes)</Label>
            <Input
              {...register("exerciseTime")}
              type="number"
              placeholder="How long did you exercise?"
            />
            {errors.exerciseTime && (
              <span className="text-red-500 text-sm">{errors.exerciseTime.message}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsTab;
