"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ProgressChart from "../../components/progress/ProgressChart";
const ClientProgress = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">My Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ProgressChart />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Measurement History</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckInHistoryTable />
        </CardContent>
      </Card>
    </div>
  );
};

// Component to display a table of check-in history
const CheckInHistoryTable = () => {
  // Properly use the context type
  const checkIns = [
    {
      id: "1",
      date: "4/19/2025",
      weight: "23",
      waist: "3",
      energy_score: "3",
      mood_score: "3",
      sleep_hours: "5",
    },
    {
      id: "2",
      date: "4/20/2025",
      weight: "25",
      waist: "2",
      energy_score: "2",
      mood_score: "3",
      sleep_hours: "2",
    },
    {
      id: "3",
      date: "4/24/2025",
      weight: "4",
      waist: "3",
      energy_score: "5",
      mood_score: "3",
      sleep_hours: "5",
    },
  ];

  if (checkIns.length === 0) {
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
          {checkIns.map((checkIn) => (
            <tr key={checkIn.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-2">
                {new Date(checkIn.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-2">
                {checkIn.weight ? `${checkIn.weight} lbs` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.waist ? `${checkIn.waist} in` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.energy_score ? `${checkIn.energy_score}/10` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.mood_score ? `${checkIn.mood_score}/10` : "-"}
              </td>
              <td className="py-3 px-2">
                {checkIn.sleep_hours ? `${checkIn.sleep_hours} hrs` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientProgress;
