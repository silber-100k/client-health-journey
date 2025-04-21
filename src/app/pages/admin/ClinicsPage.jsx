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
const ClinicsPage = () => {
  const [isAddClinicDialogOpen, setIsAddClinicDialogOpen] = useState(false);
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  const clinics = [
    {
      id: "1",
      name: "a",
      coaches: 4,
      clients: 2,
      city: "asdfasdf",
      state: "new york",
      status: "active",
    },
    {
      id: "2",
      name: "awe",
      coaches: 3,
      clients: 6,
      city: "asdfasddf",
      state: "neork",
      status: "pending",
    },
    {
      id: "3",
      name: "ag",
      coaches: 24,
      clients: 22,
      city: "asasdfdfasdf",
      state: "new dsfyork",
      status: "inactive",
    },
  ];
  console.log(isAddClinicDialogOpen);
  const handleAddlclinicdialogue = () => {
    setIsAddClinicDialogOpen(true);
  };
  const isClinicAdmin = user?.role === "clinic_admin";
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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

      {isClinicAdmin ? (
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
        <Tabs>
          <TabsList className="mb-6">
            <TabsTrigger value="clinics">Clinics</TabsTrigger>
            <TabsTrigger value="coaches">Coaches</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          <TabsContent value="clinics">
            <ClinicsOverview
              clinics={clinics}
              getStatusColor={getStatusColor}
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

      <AddClinicDialog open={isAddClinicDialogOpen} />
    </div>
  );
};

export default ClinicsPage;
