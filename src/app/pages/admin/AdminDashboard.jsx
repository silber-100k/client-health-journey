"use client"
import { Button } from "../../components/ui/button";
import { RefreshCw } from "lucide-react";
import DashboardStats from "../../components/admin/dashboard/DashboardStats";
import ClinicsTable from "../../components/admin/dashboard/ClinicsTable";
import ActivityList from "../../components/admin/dashboard/ActivityList";
import { useAuth } from "@/app/context/AuthContext";

const AdminDashboard = () => {
  const {user} = useAuth();

  const dashboardStats = {
    activeClinicCount: 5,
    totalCoachCount: 3,
    weeklyActivitiesCount: 3,
    clinicsSummary: [
      {
        id: "234234",
        name: "alexsya",
        coaches: "clinic1",
        clients: "client1",
        status: "active",
      },
      {
        id: "23423we4",
        name: "bbbbbb",
        coaches: "clinic2",
        clients: "client2",
        status: "inactive",
      },
      {
        id: "23423d3232324",
        name: "cccccc",
        coaches: "clinic3",
        clients: "client3",
        status: "active",
      },
    ],
  };

  const recentActivities = [
    {
      id: "1",
      type: "check_in",
      description: "client1 submitted a check-in",
      timestamp: "2023-10-01T12:34:56Z",
    },
    {
      id: "2",
      type: "clinic_signup",
      description: "client1 submitted a  added: 23 to qwe-in",
      timestamp: "2023-2-01T12:34:56Z",
    },
    {
      id: "3",
      type: "coach_added",
      description: "client1 submitted a  added: 23 to qwe added: 23 to qwe-in",
      timestamp: "2023-10-01T12:34:33",
    },
  ];
  const isLoadingStats = false;
  const isStatsError = false;
  const isLoadingActivities = false;
  const isActivitiesError = false;
  const isClinicAdmin = false;
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {user?.name || "Admin User"}!
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-1">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <DashboardStats
        stats={dashboardStats}
        isLoading={isLoadingStats}
        isClinicAdmin={isClinicAdmin}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClinicsTable
            dashboardStats={dashboardStats}
            isLoading={isLoadingStats}
            isError={isStatsError}
            isClinicAdmin={isClinicAdmin}
          />
        </div>

        <div>
          <ActivityList
            activities={recentActivities}
            isLoading={isLoadingActivities}
            isError={isActivitiesError}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
