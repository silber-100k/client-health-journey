"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { CalendarIcon } from "lucide-react";

// Import refactored components
import MeasurementsTab from "./form/MeasurementsTab";
import WellnessTab from "./form/WellnessTab";
import NutritionTab from "./form/NutritionTab";
import SupplementsTab from "./form/SupplementsTab";
import CheckInFormTabs from "./form/CheckInFormTabs";
import CheckInNavigation from "./form/CheckInNavigation";

const CheckInForm = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTab, setCurrentTab] = useState("measurements");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInData, setCheckInData] = useState({
    weight: "",
    waterIntake: "",
    energyLevel: 5,
    moodLevel: 5,
    exerciseType: "",
    exercise: "",
    exerciseTime: "",
    sleepHours: "",
    breakfastProtein: "",
    breakfastProteinPortion: "",
    breakfastFruit: "",
    breakfastFruitPortion: "",
    breakfastVegetable: "",
    breakfastVegetablePortion: "",
    lunchProtein: "",
    lunchProteinPortion: "",
    lunchFruit: "",
    lunchFruitPortion: "",
    lunchVegetable: "",
    lunchVegetablePortion: "",
    dinnerProtein: "",
    dinnerProteinPortion: "",
    dinnerFruit: "",
    dinnerFruitPortion: "",
    dinnerVegetable: "",
    dinnerVegetablePortion: "",
    snacks: "",
    snackPortion: "",
    supplements: "",
    notes: "",
  });
  console.log(checkInData);
  const handleSubmit = () => {};

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Daily Check-in</CardTitle>
          <div className="mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  initialFocus
                  // Limit date selection to past 7 days and today
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    sevenDaysAgo.setHours(0, 0, 0, 0);

                    return date > today || date < sevenDaysAgo;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={currentTab} className="w-full">
            <CheckInFormTabs
              currentTab={currentTab}
              onTabChange={setCurrentTab}
            />

            <div>
              <TabsContent value="measurements" className="space-y-6">
                <MeasurementsTab
                  checkInData={checkInData}
                  setCheckInData={setCheckInData}
                />
              </TabsContent>

              <TabsContent value="wellness" className="space-y-6">
                <WellnessTab
                  checkInData={checkInData}
                  setCheckInData={setCheckInData}
                />
              </TabsContent>

              <TabsContent value="nutrition" className="space-y-6">
                <NutritionTab
                  checkInData={checkInData}
                  setCheckInData={setCheckInData}
                />
              </TabsContent>

              <TabsContent value="supplements" className="space-y-6">
                <SupplementsTab
                  checkInData={checkInData}
                  setCheckInData={setCheckInData}
                />
              </TabsContent>

              <CheckInNavigation
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInForm;
