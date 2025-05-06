"use client";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import ClinicsOverview from "../../components/clinics/ClinicsOverview";
import CoachesPage from "./CoachesPage";
import ClientsPage from "./ClientsPage";
import AddClinicDialog from "../../components/clinics/AddClinicDialog";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { Skeleton } from "../../components/ui/skeleton";

const ClinicsPage = () => {
  const [isAddClinicDialogOpen, setIsAddClinicDialogOpen] = useState(false);
  const { user } = useAuth();
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (data) => {
    console.log("data", data);
  };

  const fetchClinics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/clinic");
      const data = await response.json();
      setClinics(data.clinics);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch clinics");
    }
  };
  useEffect(() => {
    fetchClinics();
  }, []);
  const handleAddlclinicdialogue = () => {
    setIsAddClinicDialogOpen(true);
  };
  const handleClinicSelect = (clinic) => {
    console.log("clinic", clinic);
  };
  const isClinicAdmin = user?.role === "clinic_admin";
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        {isClinicAdmin ? "Clinic Management" : "Clinics Management"}
      </h1>

      {/* {isClinicAdmin ? (
        <div>
          <Tabs defaultValue="coaches">
            <TabsList className="mb-6">
              <TabsTrigger value="coaches">Coaches</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>
            <TabsContent value="coaches">
              <CoachesPage />
            </TabsContent>
            <TabsContent value="clients">
              <ClientsPage />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Tabs defaultValue="clinics">
          <TabsList className="mb-6">
            <TabsTrigger value="clinics">Clinics</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          <TabsContent value="clinics">

            <ClinicsOverview
              clinics={clinics}
              getStatusColor={getStatusColor}
              onClinicSelect={handleClinicSelect}
              fetchClinics={fetchClinics}
              isLoading={isLoading}
              onAddClinic={handleAddlclinicdialogue}
            />

          </TabsContent>
          <TabsContent value="coaches">
            <CoachesPage />
          </TabsContent>
          <TabsContent value="clients">
            <ClientsPage />
          </TabsContent>
        </Tabs>
      )}
       */}
      <ClinicsOverview
        clinics={clinics}
        getStatusColor={getStatusColor}
        onClinicSelect={handleClinicSelect}
        fetchClinics={fetchClinics}
        isLoading={isLoading}
        onAddClinic={handleAddlclinicdialogue}
      />

      <AddClinicDialog
        open={isAddClinicDialogOpen}
        onSubmit={handleSubmit}
        setOpen={setIsAddClinicDialogOpen}
      />
    </div>
  );
};

export default ClinicsPage;
