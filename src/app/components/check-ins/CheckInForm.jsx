"use client";
import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import refactored components
import MeasurementsTab from "./form/MeasurementsTab";
import WellnessTab from "./form/WellnessTab";
import NutritionTab from "./form/NutritionTab";
import SupplementsTab from "./form/SupplementsTab";
import CheckInFormTabs from "./form/CheckInFormTabs";
import CheckInNavigation from "./form/CheckInNavigation";

const checkInSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  coachId: z.string().min(1, "Coach ID is required"),
  clinic: z.string().min(1, "Clinic is required"),
  selectedDate: z.date(),
  weight: z.string().min(1, "Weight is required").transform((val) => parseFloat(val) || 0),
  waist: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  waterIntake: z.string().min(1, "Water intake is required").transform((val) => parseFloat(val) || 0),
  energyLevel: z.number().min(1).max(10).default(5),
  moodLevel: z.number().min(1).max(10).default(5),
  exerciseType: z.string().optional().default(""),
  exercise: z.string().optional().default(""),
  exerciseTime: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  sleepHours: z.string().min(1, "Sleep hours is required").transform((val) => parseFloat(val) || 0),
  breakfastProtein: z.string().optional().default(""),
  breakfastProteinPortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  breakfastFruit: z.string().optional().default(""),
  breakfastFruitPortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  breakfastVegetable: z.string().optional().default(""),
  breakfastVegetablePortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  lunchProtein: z.string().optional().default(""),
  lunchProteinPortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  lunchFruit: z.string().optional().default(""),
  lunchFruitPortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  lunchVegetable: z.string().optional().default(""),
  lunchVegetablePortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  dinnerProtein: z.string().optional().default(""),
  dinnerProteinPortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  dinnerFruit: z.string().optional().default(""),
  dinnerFruitPortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  dinnerVegetable: z.string().optional().default(""),
  dinnerVegetablePortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  snacks: z.string().optional().default(""),
  snackPortion: z.string().optional().default("").transform((val) => val ? parseFloat(val) : null),
  supplements: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

const CheckInForm = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("measurements");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      name: "",
      email: "",
      coachId: "",
      clinic: "",
      selectedDate: new Date(),
      weight: "",
      waist: "",
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
    },
  });

  const formData = watch();

  useEffect(() => {
    if (user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("coachId", user.coachId || "");
      setValue("clinic", user.clinic || "");
    }
  }, [user, setValue]);

  const handleDateChange = (date) => {
    setValue("selectedDate", date);
  };

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please log in to submit check-in data");
      return;
    }

    // Check for required fields based on current tab
    const requiredFields = {
      measurements: ["weight", "waterIntake"],
      wellness: ["energyLevel", "moodLevel", "sleepHours"],
      nutrition: [], // Optional fields
      supplements: [], // Optional fields
    };

    const currentTabRequiredFields = requiredFields[currentTab];
    const missingFields = currentTabRequiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      const fieldNames = {
        weight: "Weight",
        waterIntake: "Water Intake",
        energyLevel: "Energy Level",
        moodLevel: "Mood Level",
        sleepHours: "Sleep Hours",
      };

      const missingFieldNames = missingFields.map(field => fieldNames[field]).join(", ");
      toast.error(`Please fill in the required fields: ${missingFieldNames}`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Ensure all required fields have values and proper types
      const formData = {
        ...data,
        name: data.name || user.name,
        email: data.email || user.email,
        coachId: data.coachId || user.coachId,
        clinic: data.clinic || user.clinic,
        selectedDate: data.selectedDate || new Date(),
        weight: data.weight || 0,
        waist: data.waist || null,
        waterIntake: data.waterIntake || 0,
        energyLevel: data.energyLevel || 5,
        moodLevel: data.moodLevel || 5,
        exerciseType: data.exerciseType || "",
        exercise: data.exercise || "",
        exerciseTime: data.exerciseTime || null,
        sleepHours: data.sleepHours || 0,
        breakfastProtein: data.breakfastProtein || "",
        breakfastProteinPortion: data.breakfastProteinPortion || null,
        breakfastFruit: data.breakfastFruit || "",
        breakfastFruitPortion: data.breakfastFruitPortion || null,
        breakfastVegetable: data.breakfastVegetable || "",
        breakfastVegetablePortion: data.breakfastVegetablePortion || null,
        lunchProtein: data.lunchProtein || "",
        lunchProteinPortion: data.lunchProteinPortion || null,
        lunchFruit: data.lunchFruit || "",
        lunchFruitPortion: data.lunchFruitPortion || null,
        lunchVegetable: data.lunchVegetable || "",
        lunchVegetablePortion: data.lunchVegetablePortion || null,
        dinnerProtein: data.dinnerProtein || "",
        dinnerProteinPortion: data.dinnerProteinPortion || null,
        dinnerFruit: data.dinnerFruit || "",
        dinnerFruitPortion: data.dinnerFruitPortion || null,
        dinnerVegetable: data.dinnerVegetable || "",
        dinnerVegetablePortion: data.dinnerVegetablePortion || null,
        snacks: data.snacks || "",
        snackPortion: data.snackPortion || null,
        supplements: data.supplements || "",
        notes: data.notes || "",
      };

      const response = await fetch("/api/client/checkIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (responseData.status) {
        toast.success("clientCheckIndata added successfully");
        setIsSubmitting(false);
      } else {
        throw new Error(responseData.message);
      }

      const resActivity = await fetch("/api/activity/checkIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message || "Please fill in all required fields");
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
                  {format(formData.selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.selectedDate}
                  onSelect={(date) => date && handleDateChange(date)}
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
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Tabs value={currentTab} className="w-full">
              <CheckInFormTabs
                currentTab={currentTab}
                onTabChange={setCurrentTab}
              />

              <div>
                <TabsContent value="measurements" className="space-y-6">
                  <MeasurementsTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                  />
                </TabsContent>

                <TabsContent value="wellness" className="space-y-6">
                  <WellnessTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                  />
                </TabsContent>

                <TabsContent value="nutrition" className="space-y-6">
                  <NutritionTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                  />
                </TabsContent>

                <TabsContent value="supplements" className="space-y-6">
                  <SupplementsTab
                    register={register}
                    errors={errors}
                    formData={formData}
                    setValue={setValue}
                  />
                </TabsContent>

                <CheckInNavigation
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit(onSubmit, onError)}
                />
              </div>
            </Tabs>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInForm;
