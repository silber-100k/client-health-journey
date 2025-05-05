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

const MeasurementsTab = ({ checkInData, setCheckInData }) => {
  const handlechange = (e) => {
    setCheckInData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="weight">Weight (lbs)</Label>
        <Input
          name="weight"
          type="number"
          placeholder="Enter your current weight"
          value={checkInData.weight}
          onChange={(e) => handlechange(e)}
        />
      </div>
      <div>
        <Label htmlFor="waist">Waist</Label>
        <Input
          name="waist"
          type="number"
          placeholder="Enter your current waist"
          value={checkInData.waist}
          onChange={(e) => handlechange(e)}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="water">Water Intake (oz)</Label>
          <div className="flex items-center text-primary-600">
            <Droplets size={16} className="mr-1" />
            <span className="font-medium">{checkInData.waterIntake} oz</span>
          </div>
        </div>
        <Input
          name="waterIntake"
          type="number"
          value={checkInData.waterIntake}
          onChange={(e) => handlechange(e)}
        />
      </div>

      <div>
        <Label htmlFor="exerciseType">Exercise Type</Label>
        <Select
          name="exerciseType"
          value={checkInData.exerciseType}
          onValueChange={(e) =>
            setCheckInData((prev) => ({ ...prev, ["exerciseType"]: e }))
          }
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

      {checkInData.exerciseType === "steps" ? (
        <div>
          <Label htmlFor="steps">Daily Steps</Label>
          <Input
            name="exercise"
            type="number"
            placeholder="Enter your daily steps"
            value={exercise}
            onChange={(e) => handlechange(e)}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="exercise">Exercise Description</Label>
            <Textarea
              name="exercise"
              placeholder="Describe your exercise"
              value={checkInData.exercise}
              onChange={(e) => handlechange(e)}
            />
          </div>
          <div>
            <Label htmlFor="exerciseTime">Duration (minutes)</Label>
            <Input
              name="exerciseTime"
              type="number"
              placeholder="How long did you exercise?"
              value={checkInData.exerciseTime}
              onChange={(e) => handlechange(e)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsTab;
