"use client";
import { Sidebar } from "../components/sidebar/Sidebar";
import TopBar from "../components/sidebar/TopBar";
import { Outlet } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import ClinicsPage from "./admin/ClinicsPage";
import ProgramsPage from "./admin/ProgramsPage";
import CheckInsPage from "./admin/CheckInsPage";
import ReportsPage from "./admin/ReportsPage";
import AdminActivitiesPage from "./admin/ActivitiesPage";
import ResourcesPage from "./admin/ResourcesPage";
import AdminUsersPage from "./admin/AdminUsersPage";
import SettingsPage from "./admin/SettingsPage";
import CoachDashboard from "./CoachDashboard";
import MealPlanGenerator from "./MealPlanGenerator";

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <MealPlanGenerator />
        </main>
      </div>
    </div>
  );
};

export default Layout;