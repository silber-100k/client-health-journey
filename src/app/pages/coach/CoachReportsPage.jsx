"use client";

import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
const CoachReportsPage = () => {
  const { user } = useAuth();
  const [activeClients, setActiveClients] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [programs, setPrograms] = useState(0);
  const [checkIns, setCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalData, sethistoricalData] = useState([]);
  const fetchActiveClients = async () => {
    try {
      const response = await fetch("/api/coach/reports/activeClients");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setActiveClients(data.activeClients);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  const Totalclients = async () => {
    try {
      const response = await fetch("/api/coach/reports/totalClients");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setTotalClients(data.numclients);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch("/api/coach/reports/programs");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setPrograms(data.numprograms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  const fetchCheckIns = async () => {
    try {
      const response = await fetch("/api/coach/reports/checkins");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setCheckIns(data.checkIns);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch("/api/coach/reports/historicalData");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        sethistoricalData(data.historicalData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get data");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchActiveClients();
    Totalclients();
    fetchPrograms();
    fetchCheckIns();
    setIsLoading(false);
    fetchHistoricalData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Client Reports</h1>
        <p className="text-gray-500">Overview of your clients' performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Clients with check-ins in the last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkIns || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Check-ins Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Clinic Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={historicalData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="checkIns"
                  name="checkIns ($)"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="avgWeight"
                  name="avgWeight"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachReportsPage;
