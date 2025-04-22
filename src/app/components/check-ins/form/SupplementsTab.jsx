import React from "react";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import SupplementsList from "./SupplementsList";

const SupplementsTab = ({ setCheckInData, checkInData }) => {
  const loading = false;
  const programSupplements = [];
  const handlechange = (e) => {
    setCheckInData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-gray-500">Loading your supplements...</p>
      ) : programSupplements.length > 0 ? (
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Supplements Taken Today</CardTitle>
            </CardHeader>
            <CardContent>
              <SupplementsList />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <Label htmlFor="supplements">Supplements Taken Today</Label>
          <Textarea
            name="supplements"
            placeholder="List supplements and time taken (e.g., Multivitamin - morning, Magnesium - evening)"
            value={checkInData.supplements}
            onChange={(e) => handlechange(e)}
            rows={4}
          />
        </div>
      )}

      <div>
        <Label htmlFor="generalNotes">Additional Notes</Label>
        <Textarea
          name="notes"
          placeholder="Any additional notes about your progress for this day?"
          value={checkInData.notes}
          onChange={(e) => handlechange(e)}
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          You can record check-ins for up to 7 previous days. Make sure the
          correct date is selected.
        </p>
      </div>
    </div>
  );
};

export default SupplementsTab;
