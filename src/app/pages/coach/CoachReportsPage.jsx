"use client";

import React from "react";
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
const CoachReportsPage = () => {
  const isLoading = false;
  const stats = {
    activeClients: 3,
    activePrograms: 6,
    pendingCheckIns: 3,
  };
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  const [historicalData, sethistoricalData] = useState([
    {
      month: 1,
      checkIns: 54,
      avgWeight: 22,
    },
    {
      month: 2,
      checkIns: 31,
      avgWeight: 52,
    },
    {
      month: 3,
      checkIns: 61,
      avgWeight: 21,
    },
  ]);
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
            <div className="text-2xl font-bold">
              {stats?.activeClients || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.activeClients || 0}
            </div>
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
            <div className="text-2xl font-bold">
              {stats?.activePrograms || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.pendingCheckIns || 0}
            </div>
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
