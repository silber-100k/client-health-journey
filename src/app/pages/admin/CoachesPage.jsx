"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserPlus, RefreshCw, AlertCircle } from "lucide-react";
import CoachesTable from "../../components/admin/coaches/CoachesTable";
import { AddCoachDialog } from "../../components/coaches/add/AddCoachDialog";
import { EditCoachDialog } from "../../components/coaches/edit/EditCoachDialog";
import { DeleteCoachDialog } from "../../components/coaches/delete/DeleteCoachDialog";
import { ResetCoachPasswordDialog } from "../../components/coaches/reset-password/ResetCoachPasswordDialog";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import CoachesFilter from "../../components/admin/coaches/CoachesFilter";
import { Skeleton } from "../../components/ui/skeleton";

const CoachesPage = () => {
  const [filterText, setFilterText] = useState("");
  const [isAddCoachDialogOpen, setIsAddCoachDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleAddcoachdialogue = () => {
    setIsAddCoachDialogOpen(true);
  };
  const {user} = useAuth();
  const [coaches, setCoaches] = useState([]);
  const fetchCoaches = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/coach");
      const data = await response.json();
      setIsLoading(false);
      if (data.status) {
        setCoaches(data.coaches);
      } else {
        console.error("Error fetching coaches:", data.message);
      }
    } catch (error) {
      console.error("Error fetching coaches:", error);
    }

  };
  useEffect(() => {
    fetchCoaches();
  }, []);
  const filteredCoaches = coaches.filter((coach) => {
    if (!coach) return false;
    const searchText = filterText.toLowerCase();
    return (
      (coach.name && coach.name.toLowerCase().includes(searchText)) ||
      (coach.email && coach.email.toLowerCase().includes(searchText)) ||
      (coach.phone && coach.phone.includes(searchText)) ||
      (coach.clinicName && coach.clinicName.toLowerCase().includes(searchText))
    );
  });

  const isClinicAdmin = true;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Coaches</h1>
        <div className="flex space-x-2">
        <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center"
            title="Refresh coaches"
            onClick={fetchCoaches}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
          {/* <Button
            className="flex items-center gap-2"
            onClick={handleAddcoachdialogue}
          >
            <UserPlus size={16} />
            <span>Add Coach</span>
          </Button> */}
        </div>
      </div>

      {isClinicAdmin && user && (
        <Alert className="bg-primary-50 border-primary-200">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle>Clinic Admin View</AlertTitle>
          <AlertDescription>
            You are viewing coaches for {user.name || "your clinic"} only. As a
            clinic administrator, you can manage all coaches and clients within
            your clinic.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Coaches</CardTitle>
          <CardDescription>
            {isClinicAdmin && user
              ? `Manage coaches for ${user.name || "your clinic"}`
              : "View and manage all coaches across clinics"}
          </CardDescription>
        </CardHeader>
        <CardContent>
        <CoachesFilter
            filterText={filterText}
            setFilterText={setFilterText}
            count={filteredCoaches.length}
          />
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
          <CoachesTable coaches={filteredCoaches} />
          )}
        </CardContent>
      </Card>

      <AddCoachDialog 
        open={isAddCoachDialogOpen} 
        onOpenChange={setIsAddCoachDialogOpen}
      />

      {/* {selectedCoach && (
        <>
          <EditCoachDialog />

          <DeleteCoachDialog />

          <ResetCoachPasswordDialog />
        </>
      )} */}
    </div>
  );
};

export default CoachesPage;
