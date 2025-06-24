"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Banknote, Activity, TrendingUp, Users, Calendar } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import ProgressChart from "@/app/components/progress/ProgressChart";

const ReportsPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  // const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [clients, setClients] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("month");

  // Calculate revenue (assuming $100 per check-in)
  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/report/revenue");
      const data = await response.json();
      setRevenueData(data.revenueData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch revenueData");
    }
  };

  const fetchsubscriptionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/report/subscription");
      const data = await response.json();
      setSubscriptionData(data.subscriptionData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch subscriptionData");
    }
  };
  //totalcheckIn*100
  // const fetchTotalRevenue = async () => {
  //   try {
  //     const response = await fetch("/api/clinic/report/totalRevenue");
  //     const data = await response.json();
  //     setTotalRevenue(data.totalRevenue);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchTotalClients = async () => {
    try {
      const response = await fetch("/api/clinic/client");
      const data = await response.json();
      setTotalClients(data.clients.length);
      setClients(data.clients);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRevenueData();
    fetchsubscriptionData();
    // fetchTotalRevenue();
    fetchTotalClients();
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
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const dashboardTitle = "Clinic Reports";
  const dashboardDescription = "Overview of your clinic performance";

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
        <p className="text-gray-500">{dashboardDescription}</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Your Subscription
            </CardTitle>
            <Activity className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData[0]?.plan || "N/A"}
            </div>
            <p className="text-xs text-green-500">Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            {/* <p className="text-xs text-green-500">+1 from last month</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Subscription Price</CardTitle>
            <Banknote className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionData[0]?.price ? `$${subscriptionData[0]?.price}/month` : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Subscription Start Date
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(subscriptionData[0]?.startDate).toLocaleDateString() || "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 overflow-x-auto">
        <CardHeader className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-4">
            <CardTitle className="text-xl">Client Progress</CardTitle>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
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

      {/* Subscriptions Table */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-[24px]">Your Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Clinic</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Since</th>
                  <th className="text-left py-3 px-4 font-medium">Clients</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionData.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{sub.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4">{sub.price}</td>
                    <td className="py-3 px-4">{sub.startDate}</td>
                    <td className="py-3 px-4">{sub.clients}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default ReportsPage;
