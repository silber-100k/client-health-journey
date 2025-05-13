"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ProgressChart from "../../components/progress/ProgressChart";
const ClientProgress = () => {

  const [progressData, setProgressData] = useState([]);
  const { user } = useAuth();

  const fetchProgressdata = async () => {
    try {
      const response = await fetch("/api/client/progress", {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();
      setProgressData(data.progress);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProgressdata();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">My Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ProgressChart progressData={progressData} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckInHistoryTable progressData={progressData} />
        </CardContent>
      </Card>
    </div>
  );
};

// Component to display a table of check-in history
const CheckInHistoryTable = ({ progressData }) => {
  if (progressData.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No check-ins recorded yet. Start tracking your progress!
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2">Date</th>
            <th className="text-left py-3 px-2">Weight</th>
            <th className="text-left py-3 px-2">Waist</th>
            <th className="text-left py-3 px-2">Energy</th>
            <th className="text-left py-3 px-2">Mood</th>
            <th className="text-left py-3 px-2">Sleep</th>
          </tr>
        </thead>
        <tbody>
          {progressData.map((checkIn) => (
            <tr key={checkIn.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2">
                {new Date(checkIn.selectedDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-2">
                {checkIn.weight ? `${checkIn.weight} lbs` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.waist ? `${checkIn.waist} in` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.energyLevel ? `${checkIn.energyLevel}/10` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.moodLevel ? `${checkIn.moodLevel}/10` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.sleepHours ? `${checkIn.sleepHours} hrs` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientProgress;
