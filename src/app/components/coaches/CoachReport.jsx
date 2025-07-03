"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Utensils,
  BarChart3,
  Bot,
  Heart,
  Target,
  Droplet,
  Activity,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from "@/app/components/ui/dialog";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/app/components/ui/skeleton";
import { Popover, PopoverTrigger, PopoverContent } from "@/app/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/app/components/ui/calendar";
import { format } from "date-fns";
import { EnhancedMicronutrientReport } from "../reports/micronutrients";

// Skeleton Components
const NutrientSkeleton = () => (
  <div className="p-4 rounded-md bg-gray-100">
    <Skeleton className="h-6 w-16 mb-2" />
    <Skeleton className="h-4 w-24" />
  </div>
);

const MacroBarSkeleton = () => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="h-4 w-16" />
  </div>
);

const MealCardSkeleton = () => (
  <Card className="p-4 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </Card>
);


const WelcomeCardSkeleton = () => (
  <Card className="space-y-4">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-8" />
      </CardTitle>
      <Skeleton className="h-4 w-48" />
    </CardHeader>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((index) => (
        <div key={index} className="text-center">
          <Skeleton className="h-8 w-24 mx-auto mb-1" />
          <Skeleton className="h-3 w-16 mx-auto mb-1" />
          <Skeleton className="h-3 w-20 mx-auto" />
        </div>
      ))}
    </div>
  </Card>
);

const TabButtonsSkeleton = () => (
  <div className="flex gap-2 flex-wrap bg-white rounded-[4px] p-1 shadow-md">
    {[1, 2, 3, 4].map((index) => (
      <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-md">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);

const getComplianceScore = (aiReview) => {
  try {
    if (!aiReview?.[0]?.content) return "0";
    const parsed = JSON.parse(aiReview[0].content);
    return parsed.complianceScore || "0";
  } catch (error) {
    console.error("Error parsing compliance score:", error);
    return "0";
  }
};

const calculateCalories = (protein, carbs, fat) => {
  try {
    const proteinCal = Number(protein || 0) * 4;
    const carbsCal = Number(carbs || 0) * 4;
    const fatCal = Number(fat || 0) * 9;
    const totalCal = proteinCal + carbsCal + fatCal;
    return Math.round(totalCal * 28.35) || 0;
  } catch (error) {
    console.error("Error calculating calories:", error);
    return 0;
  }
};

// Static targets and units for each micronutrient
const MICRONUTRIENT_TARGETS = {
  fiber: { target: 25, unit: 'g' },
  sugar: { target: 36, unit: 'g' },
  sodium: { target: 2300, unit: 'mg' },
  vitaminA: { target: 3000, unit: 'mcg' },
  vitaminC: { target: 90, unit: 'mg' },
  vitaminD: { target: 20, unit: 'mcg' },
  vitaminE: { target: 15, unit: 'mg' },
  vitaminK: { target: 120, unit: 'mcg' },
  vitaminB1: { target: 1.2, unit: 'mg' },
  vitaminB2: { target: 1.3, unit: 'mg' },
  vitaminB3: { target: 16, unit: 'mg' },
  vitaminB6: { target: 1.7, unit: 'mg' },
  vitaminB12: { target: 2.4, unit: 'mcg' },
  folate: { target: 400, unit: 'mcg' },
  calcium: { target: 1300, unit: 'mg' },
  iron: { target: 18, unit: 'mg' },
  magnesium: { target: 420, unit: 'mg' },
  phosphorus: { target: 1250, unit: 'mg' },
  potassium: { target: 4700, unit: 'mg' },
  zinc: { target: 11, unit: 'mg' },
  selenium: { target: 55, unit: 'mcg' },
};

const formatNutrientName = (key) => {
  const nameMap = {
    fiber:        'Fiber',
    sugar:        'Sugar',
    sodium:       'Sodium',
    vitaminA:     'Vitamin A',
    vitaminC:     'Vitamin C',
    vitaminD:     'Vitamin D',
    vitaminE:     'Vitamin E',
    vitaminK:     'Vitamin K',
    vitaminB1:    'Vitamin B1 (Thiamin)',
    vitaminB2:    'Vitamin B2 (Riboflavin)',
    vitaminB3:    'Vitamin B3 (Niacin)',
    vitaminB6:    'Vitamin B6',
    vitaminB12:   'Vitamin B12',
    folate:       'Folate',
    calcium:      'Calcium',
    iron:         'Iron',
    magnesium:    'Magnesium',
    phosphorus:   'Phosphorus',
    potassium:    'Potassium',
    zinc:         'Zinc',
    selenium:     'Selenium'
  };
  
  return nameMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

const getColorForPercentage = (percentage) => {
  if (percentage >= 100) return '#22c55e'; // Green for meeting target
  if (percentage >= 75) return '#84cc16'; // Light green for close to target
  if (percentage >= 50) return '#eab308'; // Yellow for moderate
  if (percentage >= 25) return '#f97316'; // Orange for low
  return '#ef4444'; // Red for very low
};

function combineMicronutrientTotals(micronutrients) {
  const totals = {};
  Object.keys(MICRONUTRIENT_TARGETS).forEach(key => {
    totals[key] = {
      total: typeof micronutrients[key] === 'number' ? micronutrients[key] : 0,
      target: MICRONUTRIENT_TARGETS[key].target,
      unit: MICRONUTRIENT_TARGETS[key].unit,
    };
  });
  return totals;
}

function getMicronutrientData(micronutrientTotals) {
  return Object.entries(micronutrientTotals)
    .filter(([_, data]) => data.total > 0)
    .map(([nutrientKey, data]) => {
      const percentOfTarget = (data.total / data.target) * 100;
      const displayName = formatNutrientName(nutrientKey);
      return {
        name: displayName,
        value: Math.round(data.total * 10) / 10,
        unit: data.unit,
        percentOfTarget: Math.round(percentOfTarget),
        target: data.target,
        color: getColorForPercentage(percentOfTarget)
      };
    })
    .sort((a, b) => b.percentOfTarget - a.percentOfTarget);
}

export default function CoachReport({checkIns,loading,selectedClient}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useAuth();
  const [micronutrients, setMicronutrients] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [micronutrientLoading, setMicronutrientLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const handleSelect = (date) => {
    setSelectedDate(date);
  };

  const fetchMicronutrients = async () => {
    setMicronutrientLoading(true);
    const response = await fetch("/api/coach/micronutrients", {
      method: "POST",
      body: JSON.stringify({selectedDate,selectedClient}),
    });
    const data = await response.json();
    if (data.status) {
      setMicronutrients(data.totalMicronutrients);
    } else {
      setMicronutrients({});
    }
    setMicronutrientLoading(false);
  };
  const fetchImages = async () => {
    try{
      setLoadingImages(true);
      const response = await fetch("/api/coach/selfieImage  ", {
        method: "POST",
        body: JSON.stringify({selectedClient}),
      });
      const data = await response.json();
      if(data.status){
        setUploadedImages(data.selfieImages);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingImages(false);
    }
  }
  useEffect(()=> {
    fetchImages();
  },[selectedClient])

  useEffect(()=> {
    if(selectedClient){
      fetchMicronutrients();
    }
  },[selectedDate])

  useEffect(()=> {
    console.log("micronutrients",micronutrients)
  },[micronutrients])
  const micronutrientTotals = combineMicronutrientTotals(micronutrients);
  const micronutrientData = getMicronutrientData(micronutrientTotals);
  console.log("micronutrientData",micronutrientTotals)
  const portionRule = {};
  const currentPortion = {};
  const meals = (JSON.parse(checkIns?.progressData?.[checkIns?.progressData?.length - 1]?.nutrition || "[]")).map((item, idx) => {
    const mealString = [
      item.protein,
      item.fruit,
      item.vegetables,
      item.carbs,
      item.fats,
      item.other
    ].join(', ');
    const portion = {
      proteinPortion: item.proteinPortion,
      fruitPortion: item.fruitPortion,
      vegetablesPortion: item.vegetablesPortion,
      carbsPortion: item.carbsPortion,
      fatsPortion: item.fatsPortion,
      otherPortion: item.otherPortion
    };
    return { mealString,portion };
  });
  (JSON.parse(checkIns?.program?.portion_guidelines || "[]")).forEach(item => {
    for (const [key, value] of Object.entries(item)) {
      const num = value ? Number(value) : 0;
      portionRule[key] = (portionRule[key] || 0) + num;
    }
  });
  (JSON.parse(checkIns?.progressData?.[checkIns?.progressData?.length - 1]?.nutrition || "[]")).forEach(item => {
    for (const [key, value] of Object.entries(item)) {
      const num = value ? Number(value) : 0;
      currentPortion[key] = (currentPortion[key] || 0) + num;
    }
  });

  const portionsArray = checkIns?.progressData?.map(entry => {
    const currentPortion = {};
    // Parse the nutrition JSON string for this entry
    (JSON.parse(entry?.nutrition || "[]")).forEach(item => {
      for (const [key, value] of Object.entries(item)) {
        const num = value ? Number(value) : 0;
        currentPortion[key] = (currentPortion[key] || 0) + num;
      }
    });
    // Add selectedDate from entry (adjust property name if different)
    currentPortion.selectedDate = entry.selectedDate || null;
    return currentPortion;
  });

  console.log("portionArray",portionsArray)
  const weightTrend = checkIns?.progressData?.map(item => ({
    weight: item.weight,
    selectedDate: item.selectedDate || null
  }));

  console.log("checkIns",checkIns)
  const Nutrient = ({ value, label, color }) => {
    return (
      <div className={`p-4 rounded-md ${color}`}>
        <div className="text-xl font-bold">{value} g</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    );
  };
  const [mealData,setmeal] = useState({});
  const showDetails = (macros) => {
    setIsOpen(true);
    setmeal(macros);
  };
  // Tab Button Component
  const TabButton = ({ tab, icon: Icon, label, isActive }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 ${
        isActive ? "bg-blue-600 text-white" : "text-gray-600"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Button>
  );
  function getMacroIcon(label) {
    switch (label) {
      case "Protein":
        return <Target className="w-3 h-3  text-blue-400" />;
      case "Fruit":
        return <Target className="w-3 h-3 text-blue-500" />;
      case "Vegetables":
        return <Target className="w-3 h-3 text-orange-500" />;
      case "Carbs":
        return <Target className="w-3 h-3 text-purple-500" />;
      case "Fats":
        return <Activity className="w-3 h-3 text-red-500" />;
      case "Other":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  }
  function getMealIcon(meal) {
    switch (meal) {
      case "Meal 1":
        return <>🥗</>;
      case "Meal 2":
        return <>🥙</>;
      case "Meal 3":
        return <>🍝</>;
      case "Meal 4":
        return <>🥗</>;
      default:
        return null;
    }
  }

  // Macro Bar Component
  const MacroBar = ({ label, current, total, unit = "g" }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <div>{getMacroIcon(label)}</div>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium">
        {current}/{total}
        &nbsp;
        {unit}
      </span>
    </div>
  );

  // Meal Card Component
  const MealCard = ({
    meal,
    items,
    macros,
    color,
    review,
    bgColor,
  }) => (
    <>
      <Card
        className="p-4 space-y-3 hover:cursor-pointer"
        onClick={()=>showDetails(macros)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{meal}</h3>
            <p className="text-sm text-gray-700 mt-1">{items}</p>
          </div>
          <div className="text-right">
            <div>{getMealIcon(meal)}</div>
            <p className="text-sm font-medium">{Math.floor((macros.proteinPortion*4+macros.carbsPortion*4+macros.fatsPortion*9))} cal</p>
            <p className="text-sm font-medium">{macros.proteinPortion}g protein</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-100 rounded p-2 text-center">
            <p className="text-xs text-blue-600">Protein</p>
            <p className="text-sm font-medium text-blue-700">
              {macros.proteinPortion} g
            </p>
          </div>
          <div className="flex-1 bg-orange-100 rounded p-2 text-center">
            <p className="text-xs text-orange-600">Carbs</p>
            <p className="text-sm font-medium text-orange-700">
              {macros.carbsPortion} g
            </p>
          </div>
          <div className="flex-1 bg-purple-100 rounded p-2 text-center">
            <p className="text-xs text-purple-600">Fat</p>
            <p className="text-sm font-medium text-purple-700">{macros.fatsPortion} g</p>
          </div>
        </div>
        {
          review && <div className={` p-2 rounded text-xs ${color} ${bgColor}`}>
          {review}
        </div>
        }

      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogOverlay className="bg-gray-100/30" />
        <DialogContent
          className="w-full max-w-md shadow-lg"
          aria-describedby="meal-dialog-desc"
        >
          <DialogHeader>
            <DialogTitle className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl font-medium">{meal}</CardTitle>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Visually hidden description for accessibility */}
          <div id="meal-dialog-desc" className="sr-only">
            Nutrition breakdown and AI analysis for your selected meal.
          </div>

          <div>
            <h3 className="font-medium mb-2">Nutrition Breakdown:</h3>
            <div className="grid grid-cols-2 gap-3">
              <Nutrient value={mealData.proteinPortion} label="Protein" color="bg-blue-50 text-blue-600" />
              <Nutrient value={mealData.carbsPortion} label="Carbs" color="bg-orange-50 text-orange-600" />
              <Nutrient value={mealData.fatsPortion} label="Fat" color="bg-purple-50 text-purple-600" />
              <Nutrient value={mealData.vegetablesPortion} label="vegetables" color="bg-green-50 text-green-600" />
            </div>
          </div>

          {/* <div>
            <h3 className="font-medium mb-2">AI Analysis:</h3>
            <p className="text-sm text-gray-600">
            {review}
            </p>
          </div> */}

          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-orange-500">
              {Math.floor((mealData.proteinPortion * 4 + mealData.carbsPortion * 4 + mealData.fatsPortion * 9))}
            </div>
            <div className="text-sm text-gray-500">Total Calories</div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );

  // Recipe Card Component
  const RecipeCard = ({
    title,
    description,
    calories,
    protein,
    macros,
    ingredients,
  }) => (
    <Card className="p-4 flex flex-col gap-y-1">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{calories} cal</span>
        <span className="text-sm font-medium">{protein} g protein</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-blue-100 rounded p-2 text-center">
          <p className="text-xs text-blue-600">Protein</p>
          <p className="text-sm font-medium text-blue-700">{macros?.protein} g</p>
        </div>
        <div className="flex-1 bg-orange-100 rounded p-2 text-center">
          <p className="text-xs text-orange-600">Carbs</p>
          <p className="text-sm font-medium text-orange-700">{macros?.carbs} g</p>
        </div>
        <div className="flex-1 bg-purple-100 rounded p-2 text-center">
          <p className="text-xs text-purple-600">Fat</p>
          <p className="text-sm font-medium text-purple-700">{macros?.fat} g</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Ingredients:</p>
        <p className="text-sm text-gray-600">{ingredients}</p>
      </div>
      {/* <Button className="w-full bg-blue-600 hover:bg-blue-700">
        Get Full Recipe
      </Button> */}
    </Card>
  );

  // Trend Chart Component
  const TrendChart = ({ title, color,matrix, data }) => {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-[20px] font-semibold ml-[20px]">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[200px] overflow-x-auto">
              <div
                style={{
                  minWidth: `${data?.length * 40}px`,
                  height: "100%",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} accessibilityLayer>
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
          <Bar dataKey={matrix} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <>
            <WelcomeCardSkeleton />
            <TabButtonsSkeleton />
            <div className="space-y-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Skeleton className="h-5 w-5 mt-0.5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        ) : (
          <>
            <Card className="space-y-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#1F2937]">
                    Welcome back, {checkIns?.progressData?.[0].name}!
                  </h1>
                  <span className="text-2xl">👋</span>
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Started {new Date(checkIns?.start?.[0]?.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}             
                </p>
              </CardHeader>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{getComplianceScore(checkIns?.aiReview)}/10</div>
                  <div className="text-xs text-gray-500">Excellent</div>
                  <div className="text-xs text-gray-500">Weekly Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{checkIns?.progressData?.[checkIns?.progressData?.length - 1]?.weight}/
                    {checkIns?.start?.[0]?.initialWeight} lbs
                  </div>
                  <div className="text-xs text-gray-500">Current/Initial</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">{checkIns?.start?.[0]?.goalWeight} lbs</div>
                  <div className="text-xs text-gray-500">Goal Weight</div>
                </div>
                <div className="text-center">
                  <div 
                  className={`${
                      checkIns?.progressData?.[checkIns?.progressData?.length - 1]?.weight -
                        checkIns?.start?.[0]?.initialWeight >
                      0
                        ? "text-[#e90f0f]"
                        : "text-[#16A34A]"
                    } text-2xl font-bold`}>
                    {checkIns?.progressData?.[checkIns?.progressData?.length - 1]?.weight -
                      checkIns?.start?.[0]?.initialWeight >
                    0
                      ? `+${
                          checkIns?.progressData?.[checkIns?.progressData?.length - 1]?.weight -
                          checkIns?.start?.[0]?.initialWeight
                        }`
                      : `-${
                          checkIns?.start?.[0]?.initialWeight -
                          checkIns?.progressData?.[checkIns?.progressData?.length - 1]?.weight
                        }`}
                         &nbsp;lbs
                        </div>
                  <div className="text-xs text-gray-500">Current</div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 sm:flex w-full gap-2 bg-white rounded-[4px] p-1 shadow-md">
              <TabButton
                tab="overview"
                icon={BarChart3}
                label="Overview"
                isActive={activeTab === "overview"}
                className="w-full"
              />
              <TabButton
                tab="meals"
                icon={Utensils}
                label="Today's Meals"
                isActive={activeTab === "meals"}
                className="w-full"
              />
              <TabButton
                tab="trends"
                icon={TrendingUp}
                label="Trends"
                isActive={activeTab === "trends"}
                className="w-full"
              />
              {              
                  checkIns?.aiReview?.[0] &&
                  <TabButton
                  tab="recipes"
                  icon={Bot}
                  label="AI Recipes"
                  isActive={activeTab === "recipes"}
                  className="w-full"
                />
                
                }
                {
                checkIns?.aiReview?.[0]&&
              <TabButton
              tab="micronutrients"
              icon={Utensils}
              label="micronutrients"
              isActive={activeTab === "micronutrients"}
              className="w-full"
            />
              }
              <TabButton
              tab="selfieImages"
              icon= {Image}
              label="selfieImages"
              isActive={activeTab === "selfieImages"}
              className="w-full"
              />
            </div>

            {/* Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {
                  checkIns?.aiReview?.[0] &&
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="w-5 h-5" />
                    <h2 className="font-semibold">Your AI Health Assistant(weekly trend) 🤖</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <span className="w-[24px] h-[24px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-award w-5 h-5 text-yellow-500"
                      >
                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                        <circle cx="12" cy="8" r="6"></circle>
                      </svg>
                      </span>
                      <div>
                        {checkIns?.aiReview && JSON.parse(checkIns?.aiReview?.[0].content).weeklyTrend}
                      </div>
                      </div>
                  </div>
                </Card>
                }
                <Card className="p-4">
                  <h2 className="font-semibold mb-4">Today's Macros</h2>
                  <div className="space-y-2">
                    <MacroBar label="Protein" current={currentPortion?.proteinPortion} total={Math.floor(28.35*portionRule?.protein)} />
                    <MacroBar label="Fruit" current={currentPortion?.fruitPortion} total={Math.floor(28.35*portionRule?.fruit)} />
                    <MacroBar label="Vegetables" current={currentPortion?.vegetablesPortion} total={Math.floor(28.35*portionRule?.vegetables)} />
                    <MacroBar
                      label="Carbs"
                      current={Number(currentPortion?.carbsPortion?.toFixed(0))}
                      total={Math.floor(28.35*portionRule?.carbs)}
                      unit="g"
                    />
                    <MacroBar label="Fats" current={currentPortion?.fatsPortion} total={Math.floor(28.35*portionRule?.fats)} />
                    <MacroBar label="Other" current={currentPortion?.otherPortion} total={Math.floor(28.35*portionRule?.other)} />
                  </div>
                </Card>
              </div>
            )}
            {activeTab === "meals" && (
              <div className="space-y-4">
                {
                  checkIns?.aiReview?.[0]  &&
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="w-5 h-5" />
                    <h2 className="font-semibold">Today's Review 🤖</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex">
                      
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-award w-5 h-5 text-yellow-500"
                      >
                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
                        <circle cx="12" cy="8" r="6"></circle>
                      </svg>
                      <span>Summary</span>
                      </div>
                      <p>
                      {checkIns?.aiReview && JSON.parse(checkIns?.aiReview?.[0].content).todaySummary}
                      </p>
                       
                      
                      <div>
                        {checkIns?.aiReview && JSON.parse(checkIns?.aiReview?.[0].content).today_Review_and_Recommendation}
                      </div>
                      </div>
                  </div>
                </Card>
                }
                {
                  meals?.map((val,key)=>(
                  <MealCard
                    key={key}
                    meal={`Meal ${key+1}`}
                    items={val.mealString}
                    macros={val.portion}
                    color="text-green-700"
                    bgColor="bg-green-50"
                    review={                
                      checkIns?.aiReview?.[0] && JSON.parse(checkIns?.aiReview?.[0].content).mealReview[key]}
                  />))
                }
                
              </div>
            )}
            {activeTab === "trends" && (
              <div className="space-y-6">
                {/* Daily Averages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{Number((portionsArray?.reduce((sum, item) => {const val = Number(item.proteinPortion);
    return sum + (isNaN(val) ? 0 : val)}, 0) / (portionsArray?.length || 1)).toFixed(1))} g</div>
                      <div className="text-xs text-gray-500">Avg Daily Protein</div>
                      <div className="text-xs text-gray-500">7 day avg week</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">{Number((portionsArray?.reduce((sum, item) => {const val = Number(item.carbsPortion);
    return sum + (isNaN(val) ? 0 : val)}, 0) / (portionsArray?.length || 1)).toFixed(1))} g</div>
                      <div className="text-xs text-gray-500">Avg Daily Carbs</div>
                      <div className="text-xs text-gray-500">7 day avg week</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">{Number((portionsArray?.reduce((sum, item) => {const val = Number(item.fatsPortion);
    return sum + (isNaN(val) ? 0 : val)}, 0) / (portionsArray?.length || 1)).toFixed(1))} g</div>
                      <div className="text-xs text-gray-500">Avg Daily Fat</div>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{Number((portionsArray?.reduce((sum, item) => {const val = Number(item.vegetablesPortion);
    return sum + (isNaN(val) ? 0 : val)}, 0) / (portionsArray?.length || 1)).toFixed(1))} g</div>
                      <div className="text-xs text-gray-500">Avg Daily Vegetables</div>
                    </div>
                  </Card>
                </div>
                {/* Trend Charts */}
                <div className="grid grid-cols-1 gap-6">
                  <TrendChart
                    title="Weight Trend"
                    color="#2563eb"
                    matrix = "weight"
                    data={weightTrend}
                  />
                  <TrendChart
                    title="Calories Trend"
                    color="#1da95e"
                    matrix = "calories"
                    data={portionsArray}
                  />
                  <TrendChart
                    title="Protein Trend"
                    color="#1da95e"
                    matrix = "proteinPortion"
                    data={portionsArray}
                  />
                  <TrendChart
                    title="Carbs Trend"
                    color="#961be1"
                    matrix = "carbsPortion"
                    data={portionsArray}
                  />
                  <TrendChart
                    title="Fat Trend"
                    color="#e43b63"
                    matrix = "fatsPortion"
                    data={portionsArray}
                  />
                  <TrendChart
                    title="Vegetables Trend"
                    color="#5cae08"
                    matrix = "vegetablesPortion"
                    data={portionsArray}
                  />
                  <TrendChart
                    title="Fruit Trend"
                    color="#e89a0a"
                    matrix = "fruitPortion"
                    data={portionsArray}
                  />
                </div>
              </div>
            )}
            {activeTab === "recipes" && (
              <div className="space-y-6">
                {
                  checkIns?.aiReview &&
                  Array.isArray(checkIns.aiReview) &&
                  checkIns.aiReview[0]?.content &&
                  JSON.parse(checkIns.aiReview[0].content)?.mealRecommendation?.map((value, key) => (
                    <RecipeCard
                      key={key}
                      title={value.foodnames}
                      description={value.description || ""}
                      calories={calculateCalories(
                        value.proteinPortion,
                        value.carbsPortion,
                        value.fatsPortion
                      )}
                      protein={Number(28.35*value.proteinPortion) || 0}
                      macros={{
                        protein: Number(28.35*value.proteinPortion) || 0,
                        carbs: Number(28.35*value.carbsPortion) || 0,
                        fat: Number(28.35*value.fatsPortion) || 0
                      }}
                      ingredients={value.ingredients || ""}
                    />
                  ))
                }
                <div className="bg-orange-50 p-[10px] round-[5px]">
                {checkIns?.aiReview && JSON.parse(checkIns?.aiReview?.[0].content).message}
                </div>
              </div>
            )}

            {activeTab === "micronutrients" && (
              <div className="space-y-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 w-full md:w-auto"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && handleSelect(date)}
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
                <EnhancedMicronutrientReport data={micronutrientData} loading={micronutrientLoading} />
              </div>
            )}
            {activeTab === "selfieImages" && (
              <ImageCardForCoach uploadedImages={uploadedImages} loading={loadingImages}/>
            )}
          </>
        )}
      </div>
    </div>
  );
}
