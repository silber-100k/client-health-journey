import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

const ExerciseTab = ({ checkIns }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-[24px] font-semibold ml-[20px]">
            Exercise Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px] overflow-x-auto">
            <div
              style={{
                minWidth: `${checkIns?.checkIns?.length * 50}px`,
                height: "100%",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
      <BarChart data={checkIns.checkIns} accessibilityLayer>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="selectedDate"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            // Format date string in UTC, e.g. "2025-05-22" -> "May 22"
            const date = new Date(value);
            return date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            });
          }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            border: "none",
            backgroundColor: "white",
            padding: "10px",
          }}
          labelFormatter={(label) => {
            if (!label) return "";
            const date = new Date(label);
            // Format label in UTC with weekday, year, month, day
            return date.toLocaleDateString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            });
          }}
          formatter={(value, name) => [value, name]} // optional: display value and name
        />
        <Bar dataKey="energyLevel" fill="#2563eb" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ExerciseTab;
