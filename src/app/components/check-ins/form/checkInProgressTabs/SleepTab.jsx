import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

const SleepTab = ({ checkIns }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-[24px] font-semibold ml-[20px]">
            Sleep Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer height="100%">
              <LineChart
                accessibilityLayer
                data={checkIns.checkIns}
                margin={{
                  top: 40,
                  left: 12,
                  right: 12,
                  bottom: 40,
                }}
                height={300}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="selectedDate"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    // Format date string, e.g. "2025-05-22" -> "May 22"
                    const date = new Date(value);
                    return date.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    });
                  }}
                />
                <YAxis
                  dataKey="sleepHours"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    border: "none",
                  }}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Line
                  dataKey="sleepHours"
                  type="natural"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{
                    fill: "#2563eb",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default SleepTab;
