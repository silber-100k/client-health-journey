"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import ProgressChart from "@/app/components/progress/ProgressChart";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import NutritionWeightTab from "./form/checkInProgressTabs/NutritionWeightTab";
import ExerciseTab from "./form/checkInProgressTabs/ExerciseTab";
import SleepTab from "./form/checkInProgressTabs/SleepTab";
import MoodTab from "./form/checkInProgressTabs/MoodTab";

const CoachReportsPage = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(false);

  const Totalclients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/coach/client");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setClients(data.clients);
        setIsLoading(false);
      } else {
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Unable to get data");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Totalclients();
  }, []);

  useEffect(() => {
    const fetchCoachCheckIns = async () => {
      setLoading(true);
      const response = await fetch("/api/coach/checkIn", {
        method: "POST",
        body: JSON.stringify({
          clientId: selectedClient,
          startDate,
          endDate,
        }),
      });
      const data = await response.json();
      if (data.status) {
        setCheckIns(data.result);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    };
    if (selectedClient && selectedTimeRange) {
      fetchCoachCheckIns();
    }
  }, [selectedClient, startDate, endDate]);

  useEffect(() => {
    const now = new Date();

    switch (selectedTimeRange) {
      case "month":
        setStartDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
        break;
      case "week":
        setStartDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        break;
      case "quarter":
        setStartDate(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000));
        break;
      case "half":
        setStartDate(new Date(now.getTime() - 182 * 24 * 60 * 60 * 1000));
        break;
      default:
        setStartDate(new Date());
    }
    setEndDate(new Date());
  }, [selectedTimeRange]);

  const handlechange1 = (date) => {
    setStartDate(date);
  };
  const handlechange2 = (date) => {
    setEndDate(date);
  };
console.log("checkIn",checkIns)
  return (
    <div>
      <div className="flex items-center gap-4">
        <Select
          value={selectedClient}
          onValueChange={(value) => setSelectedClient(value)}
          defaultValue={selectedClient}
          disabled={isLoading === true}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          defaultValue={selectedTimeRange}
          onValueChange={(value) => setSelectedTimeRange(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent className="w-[180px]">
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="quarter">Last 3 months</SelectItem>
            <SelectItem value="half">Last 6 months</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={selectedTimeRange !== "custom"}
            >
              <CalendarIcon className="h-4 w-4" />
              {startDate ? format(startDate, "MMMM d, yyyy") : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && handlechange1(date)}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date > today;
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="text-[#6B7280]">to</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              disabled={selectedTimeRange !== "custom"}
            >
              <CalendarIcon className="h-4 w-4" />
              {endDate ? format(endDate, "MMMM d, yyyy") : ""}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && handlechange2(date)}
              initialFocus
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                sevenDaysAgo.setHours(0, 0, 0, 0);

                return date > today || date < startDate;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {!isLoading ? (
        <Tabs defaultValue="Nutrition">
          <TabsList className="mt-6 mb-6 w-full">
            <TabsTrigger value="Nutrition" className="w-[25%]">
              Nutrition & Weight
            </TabsTrigger>
            <TabsTrigger value="Sleep" className="w-[25%]">
              Sleep
            </TabsTrigger>
            <TabsTrigger value="Exercise" className="w-[25%]">
              Exercise
            </TabsTrigger>
            <TabsTrigger value="Mood" className="w-[25%]">
              Mood
            </TabsTrigger>
          </TabsList>
          {!loading && checkIns?.length != 0 ? (
            <>
              <TabsContent value="Nutrition">
                <NutritionWeightTab checkIns={checkIns} />
              </TabsContent>
              <TabsContent value="Sleep">
                <SleepTab checkIns={checkIns} />
              </TabsContent>
              <TabsContent value="Exercise">
                <ExerciseTab checkIns={checkIns} />
              </TabsContent>
              <TabsContent value="Mood">
                <MoodTab checkIns={checkIns} />
              </TabsContent>
            </>
          ) : (
            "No check-ins found"
          )}
        </Tabs>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default CoachReportsPage;
