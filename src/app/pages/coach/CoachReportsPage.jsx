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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import ProgressChart from "@/app/components/progress/ProgressChart";

const CoachReportsPage = () => {
  const { user } = useAuth();
  const [activeClients, setActiveClients] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState(0);
  const [checkIns, setCheckIns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historicalData, sethistoricalData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("month");
  const [progressData, setProgressData] = useState([]);

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
      const response = await fetch("/api/coach/client");
      const data = await response.json();
      if (data.status) {
        toast.success("Fetched successfully");
        setTotalClients(data.clients.length);
        setClients(data.clients);
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

  useEffect(() => {
    const fetchProgressData = async () => {
      const response = await fetch(`/api/coach/reports/progress?clientId=${selectedClient}&timeRange=${selectedTimeRange}`);
      const data = await response.json();
      if (data.status) {
        setProgressData(data.progress);
      } else {
        toast.error(data.message);
      }
    }
    if (selectedClient && selectedTimeRange) {
      fetchProgressData();
    }
  }, [selectedClient, selectedTimeRange]);

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
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Client Progress</CardTitle>
            <div className="flex items-center gap-4">
              <Select onValueChange={(value) => setSelectedClient(value)} defaultValue={selectedClient}>
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
              <Select defaultValue={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ProgressChart progressData={progressData} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachReportsPage;
