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

export default function HealthTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkIns, setCheckIns] = useState([]);

  const fetchCheckInsbyClient = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/client/progress", {
        method: "POST",
        body: JSON.stringify({ clientId: user?.id, current: new Date() }),
      });
      const data = await response.json();
      if (data.status) {
        setCheckIns(data.progress);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  
  useEffect(()=> {
    fetchCheckInsbyClient();
  },[user])
  console.log("checkIn",checkIns)
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
    return currentPortion;
  });

  const weightTrend = checkIns?.progressData?.map(item => item.weight);

  console.log("checkIns",checkIns)
  const Nutrient = ({ value, label, color }) => {
    return (
      <div className={`p-4 rounded-md ${color}`}>
        <div className="text-xl font-bold">{value} oz</div>
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
  const MacroBar = ({ label, current, total, unit = "oz" }) => (
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
            <p className="text-sm font-medium">{Math.floor(28.3495*(macros.proteinPortion*4+macros.carbsPortion*4+macros.fatsPortion*9))} cal</p>
            <p className="text-sm font-medium">{macros.proteinPortion}oz protein</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-100 rounded p-2 text-center">
            <p className="text-xs text-blue-600">Protein</p>
            <p className="text-sm font-medium text-blue-700">
              {macros.proteinPortion} oz
            </p>
          </div>
          <div className="flex-1 bg-orange-100 rounded p-2 text-center">
            <p className="text-xs text-orange-600">Carbs</p>
            <p className="text-sm font-medium text-orange-700">
              {macros.carbsPortion} oz
            </p>
          </div>
          <div className="flex-1 bg-purple-100 rounded p-2 text-center">
            <p className="text-xs text-purple-600">Fat</p>
            <p className="text-sm font-medium text-purple-700">{macros.fatsPortion} oz</p>
          </div>
        </div>
        <div className={` p-2 rounded text-xs ${color} ${bgColor}`}>
          {review}
        </div>
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

          <div>
            <h3 className="font-medium mb-2">AI Analysis:</h3>
            <p className="text-sm text-gray-600">
              Excellent protein start to your day! The probiotics in Greek yogurt support gut health.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-md text-center">
            <div className="text-2xl font-bold text-orange-500">
              {Math.floor(28.3495 * (mealData.proteinPortion * 4 + mealData.carbsPortion * 4 + mealData.fatsPortion * 9))}
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
    mealData,
    ingredients,
  }) => (
    <Card className="p-4 flex flex-col gap-y-1">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{calories} cal</span>
        <span className="text-sm font-medium">{protein}g protein</span>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 bg-blue-100 rounded p-2 text-center">
          <p className="text-xs text-blue-600">Protein</p>
          <p className="text-sm font-medium text-blue-700">g</p>
        </div>
        <div className="flex-1 bg-orange-100 rounded p-2 text-center">
          <p className="text-xs text-orange-600">Carbs</p>
          <p className="text-sm font-medium text-orange-700">g</p>
        </div>
        <div className="flex-1 bg-purple-100 rounded p-2 text-center">
          <p className="text-xs text-purple-600">Fat</p>
          <p className="text-sm font-medium text-purple-700">g</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-1">Ingredients:</p>
        <p className="text-sm text-gray-600">{ingredients}</p>
      </div>
      <Button className="w-full bg-blue-600 hover:bg-blue-700">
        Get Full Recipe
      </Button>
    </Card>
  );

  // Trend Chart Component
  const TrendChart = ({ title, color, data }) => {
    // Process and validate data
    const processedData = React.useMemo(() => {
      if (!Array.isArray(data)) {
        return Array(7).fill(null);
      }

      // Convert undefined to null and ensure 7 days
      const normalizedData = data.map(value => 
        value === undefined ? null : Number(value)
      );

      // Pad or trim to 7 days
      while (normalizedData.length < 7) {
        normalizedData.push(null);
      }
      return normalizedData.slice(0, 7);
    }, [data]);

    // Calculate max value excluding nulls
    const maxValue = React.useMemo(() => {
      const validValues = processedData.filter(value => value !== null);
      if (validValues.length === 0) return 1;
      return Math.max(...validValues);
    }, [processedData]);

    // Get day labels
    const dayLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

    return (
      <Card className="pl-2 pr-2 pt-4 pb-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">{title}</h4>
          <div className="flex gap-1 h-16 items-end">
            {processedData.map((value, index) => (
              <div
                key={index}
                className={`flex-1 ${value === null ? 'bg-gray-100' : color} rounded-sm transition-all duration-300 relative group`}
                style={{ 
                  height: value === null ? '4px' : `${(value / maxValue) * 100}%`,
                  minHeight: value !== null && value > 0 ? '14px' : '0'
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {value === null ? 'No data' : value}
                </div>
                
                {/* Bar label */}
                {value !== null && value > 0 && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    {value}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            {dayLabels.map((day, index) => (
              <span key={day} className="w-8 text-center">
                {day}
              </span>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#1F2937]">
                Welcome back, {user?.name}!
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">8.2/10</div>
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
              <div className="text-2xl font-bold text-gray-700">135 lbs</div>
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

        <div className="flex gap-2 flex-wrap bg-white rounded-[4px] p-1 shadow-md">
          <TabButton
            tab="overview"
            icon={BarChart3}
            label="Overview"
            isActive={activeTab === "overview"}
          />
          <TabButton
            tab="meals"
            icon={Utensils}
            label="Today's Meals"
            isActive={activeTab === "meals"}
          />
          <TabButton
            tab="trends"
            icon={TrendingUp}
            label="Trends"
            isActive={activeTab === "trends"}
          />
          <TabButton
            tab="recipes"
            icon={Bot}
            label="AI Recipes"
            isActive={activeTab === "recipes"}
          />
        </div>
        {/* Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* AI Health Assistant */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-5 h-5" />
                <h2 className="font-semibold">Your AI Health Assistant 🤖</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
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
                  <p className="text-sm">
                    You've hit your protein goals 5 days this week! 🎉
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm">
                    Your hydration drops on weekends. Try setting phone
                    reminders!
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                  <Heart className="w-4 h-4 text-pink-600 mt-0.5" />
                  <p className="text-sm">
                    Progress, not perfection. You're doing more than you think!
                    💪
                  </p>
                </div>
              </div>
            </Card>
            {/* Today's Macros */}
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Today's Macros</h2>
              <div className="space-y-2">
                {/* <MacroBar label="Water" current={6} total={8} unit=" glasses" /> */}
                <MacroBar label="Protein" current={currentPortion?.proteinPortion} total={portionRule?.protein} />
                <MacroBar label="Fruit" current={currentPortion?.fruitPortion} total={portionRule?.fruit} />
                <MacroBar label="Vegetables" current={currentPortion?.vegetablesPortion} total={portionRule?.vegetables} />
                <MacroBar
                  label="Carbs"
                  current={currentPortion?.carbsPortion}
                  total={portionRule?.carbs}
                  unit="oz"
                />
                <MacroBar label="Fats" current={currentPortion?.fatsPortion} total={portionRule?.fats} />
                <MacroBar label="Other" current={currentPortion?.otherPortion} total={portionRule?.other} />

              </div>
            </Card>
          </div>
        )}
        {activeTab === "meals" && (
          <div className="space-y-4">
            {
              meals?.map((val,key)=>(
              <MealCard
                key={key}
                meal={`Meal ${key+1}`}
                items={val.mealString}
                macros={val.portion}
                color="text-green-700"
                bgColor="bg-green-50"
                review="Excellent protein start to your day! The probiotics in Greek yogurt
          support gut health."
              />))
            }
            
          </div>
        )}
        {activeTab === "trends" && (
          <div className="space-y-6">
            {/* Daily Averages */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{Math.floor((portionsArray?.reduce((sum, item) => sum + item.proteinPortion, 0) || 0) / (portionsArray?.length || 1))} oz</div>
                  <div className="text-xs text-gray-500">Avg Daily Protein</div>
                  <div className="text-xs text-gray-500">7 day avg week</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{Math.floor((portionsArray?.reduce((sum, item) => sum + item.carbsPortion, 0) || 0) / (portionsArray?.length || 1))} oz</div>
                  <div className="text-xs text-gray-500">Avg Daily Carbs</div>
                  <div className="text-xs text-gray-500">7 day avg week</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{Math.floor((portionsArray?.reduce((sum, item) => sum + item.fatsPortion, 0) || 0) / (portionsArray?.length || 1))} oz</div>
                  <div className="text-xs text-gray-500">Avg Daily Fat</div>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{Math.floor((portionsArray?.reduce((sum, item) => sum + item.vegetablesPortion, 0) || 0) / (portionsArray?.length || 1))} oz</div>
                  <div className="text-xs text-gray-500">Avg Daily Vegetables</div>
                </div>
              </Card>
            </div>
            {/* Trend Charts */}
            <div className="grid grid-cols-1 gap-6">
              <TrendChart
                title="Weight Trend"
                color="bg-blue-400"
                data={weightTrend}

              />
              <TrendChart
                title="Protein Trend"
                color="bg-blue-500"
                data={portionsArray?.map(item => item.proteinPortion)}
              />
              <TrendChart
                title="Carbs Trend"
                color="bg-orange-400"
                data={portionsArray?.map(item => item.carbsPortion)}
              />
              <TrendChart
                title="Fat Trend"
                color="bg-purple-400"
                data={portionsArray?.map(item => item.fatsPortion)}
              />
              <TrendChart
                title="Vegetables Trend"
                color="bg-green-400"
                data={portionsArray?.map(item => item.vegetablesPortion)}
              />
              <TrendChart
                title="Fruit Trend"
                color="bg-indigo-400"
                data={portionsArray?.map(item => item.fruitPortion)}
              />
            </div>
          </div>
        )}
        {activeTab === "recipes" && (
          <div className="space-y-6">
            <RecipeCard
              title="Protein-Packed Breakfast Bowl"
              description="Based on your love for morning protein!"
              calories={340}
              protein={32}
              macros={{ protein: 32, carbs: 24, fat: 12 }}
              ingredients="Greek yogurt, Chia seeds, Berries, Protein powder"
            />
            <RecipeCard
              title="Zucchini Noodle Alfredo"
              description="Healthier swap for tonight's pasta craving"
              calories={385}
              protein={38}
              macros={{ protein: 38, carbs: 15, fat: 22 }}
              ingredients="Zucchini, Chicken breast, Light alfredo, Broccoli"
            />
          </div>
        )}
      </div>
    </div>
  );
}
