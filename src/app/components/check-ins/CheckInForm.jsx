"use client";
import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
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
import { toast } from "sonner";

// Import refactored components
import MeasurementsTab from "./form/MeasurementsTab";
import WellnessTab from "./form/WellnessTab";
import NutritionTab from "./form/NutritionTab";
import SupplementsTab from "./form/SupplementsTab";
import CheckInFormTabs from "./form/CheckInFormTabs";
import CheckInNavigation from "./form/CheckInNavigation";

const CheckInForm = () => {
  const { user } = useAuth();
  console.log("user", user);
  const [currentTab, setCurrentTab] = useState("measurements");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInData, setCheckInData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    coachId: user?.coachId || "",
    clinic: user?.clinic || "",
    selectedDate: new Date(),
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

  const handlechange = (date) => {
    setCheckInData((prev) => ({ ...prev, selectedDate: date }));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please log in to submit check-in data");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/client/checkIn", {
        method: "POST",
        body: JSON.stringify(checkInData),
      });

      console.log("checkindata", checkInData);
      const responseData = await response.json();
      if (responseData.status) {
        toast.success("clientCheckIndata added successfully");
        setIsSubmitting(false);
      } else {
        throw new Error(responseData.message);
      }

      const resActivity = await fetch("/api/activity/checkIn", {
        method: "POST",
        body: JSON.stringify({
          type: "check_in",
          description: `Client ${user.name || 'Unknown'} completed weekly check-in`,
          clinicId: user.clinic || '',
        }),
      });
      const respond = await resActivity.json();
      if (respond.status) {
        toast.success("weekly check-in activity added successfully");
      } else {
        throw new Error(respond.message);
      }
    } catch (error) {
      console.log("Failed to add checkin", error);
      toast.error("Failed to submit check-in data");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Please Log In</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be logged in to submit check-in data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  {format(checkInData.selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInData.selectedDate}
                  onSelect={(date) => date && handlechange(date)}
                  initialFocus
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
