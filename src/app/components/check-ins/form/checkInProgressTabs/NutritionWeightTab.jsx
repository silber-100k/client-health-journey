"use client";
import { TrendingUp } from "lucide-react";
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
import { arrowRight, BalanceIcon, goalIcon } from "./Icon";
import MealHistoryComponent from "./MealHistoryComponent";

const NutritionWeightTab = ({ checkIns }) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-[24px] font-semibold ml-[20px]">
            Weight Trends
          </CardTitle>
        </CardHeader>
        <div className="p-[16px] flex gap-[16px]">
          <div className="flex gap-[16px] items-center bg-[#F8FAFC] rounded-[18px] p-[16px] w-[33%]">
            <div className="items-center">
              <span className="w-[20px] h-[20px]">{BalanceIcon}</span>
            </div>
            <div>
              <div className="text-[#6B7280] text-[14px]">Starting Weight</div>
              <div className="text-[#020817] font-bold text-[20px]">
                {checkIns?.weight?.initialWeight}
              </div>
            </div>
          </div>
          <div className="flex gap-[16px] items-center bg-[#F8FAFC] rounded-[8px] p-[16px] w-[33%]">
            <div className="items-center">
              <span className="w-[20px] h-[20px]">{arrowRight}</span>
            </div>
            <div>
              <div className="text-[#6B7280] text-[14px]">Current Weight</div>
              <div className="text-[#020817] font-bold text-[20px]">
                {checkIns?.weight?.currentWeight}
              </div>
              <div
                className={`${
                  checkIns?.weight?.currentWeight -
                    checkIns?.weight?.initialWeight >
                  0
                    ? "text-[#e90f0f]"
                    : "text-[#16A34A]"
                } text-[14px]`}
              >
                {checkIns?.weight?.currentWeight -
                  checkIns?.weight?.initialWeight >
                0
                  ? `+${
                      checkIns?.weight?.currentWeight -
                      checkIns?.weight?.initialWeight
                    }`
                  : `-${
                      checkIns?.weight?.initialWeight -
                      checkIns?.weight?.currentWeight
                    }`}
                &nbsp;lbs
              </div>
            </div>
          </div>
          <div className="flex gap-[16px] items-center bg-[#F8FAFC] rounded-[8px] p-[16px] flex-1">
            <div className="items-center">
              <span className="w-[20px] h-[20px]">{goalIcon}</span>
            </div>
            <div>
              <div className="text-[#6B7280] text-[14px]">Goal Weight</div>
              <div className="text-[#020817] font-bold text-[20px]">weight</div>
              <div className="text-[#6B7280] text-[14px]">30 lbs to go</div>
            </div>
          </div>
        </div>
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
                    });
                  }}
                />
                <YAxis
                  dataKey="weight"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  tickFormatter={(value) => `${value} lbs`}
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
                  dataKey="weight"
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
      <Card className="mt-[16px]">
        <CardHeader className=" pl-[20px]">
          <CardTitle className="text-[24px] font-semibold">
            Meal History
          </CardTitle>
        </CardHeader>
        {checkIns?.checkIns?.length === 0 ? (
          <CardContent className="text-[14px] pb-[24px]">
            <div className="text-[#020817] font-bold mb-[4px]">
              No meal history
            </div>
          </CardContent>
        ) : (
          checkIns?.checkIns
            ?.slice() // create a copy to avoid mutating original array
            .sort((a, b) => new Date(b.selectedDate) - new Date(a.selectedDate))
            .map((checkIn, index) => (
              <MealHistoryComponent checkIn={checkIn} key={index} />
            ))
        )}
      </Card>
    </div>
  );
};
export default NutritionWeightTab;
