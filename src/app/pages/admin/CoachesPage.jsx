"use clients";

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
import { useState } from "react";
import CoachesFilter from "../../components/admin/coaches/CoachesFilter";
const CoachesPage = () => {
  const [filterText, setFilterText] = useState("");
  const [isAddCoachDialogOpen, setIsAddCoachDialogOpen] = useState(false);
  const handleAddcoachdialogue = () => {
    setIsAddCoachDialogOpen(true);
  };
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  const filteredCoaches = [
    {
      id: "aaa",
      name: "string",
      email: "string",
      phone: "13213123",
      status: "active",
      clinicId: "asdfasdf",
      clinicName: "sdf",
      clients: 2,
    },
    {
      id: "aasdfa",
      name: "stsdfring",
      email: "strsdfweing",
      phone: "1323242313123",
      status: "active",
      clinicId: "asdfasdsfdf",
      clinicName: "sdf23",
      clients: 22,
    },
    {
      id: "aawerwerwea",
      name: "strwerweing",
      email: "strwering",
      phone: "13213123233",
      status: "active",
      clinicId: "asdfsdfasdf",
      clinicName: "sfffffdf",
      clients: 2,
    },
  ];
  const isClinicAdmin = true;
  const selectedCoach = true;

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
          >
            <RefreshCw size={16} />
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={handleAddcoachdialogue}
          >
            <UserPlus size={16} />
            <span>Add Coach</span>
          </Button>
        </div>
      </div>

      {isClinicAdmin && (
        <Alert className="bg-primary-50 border-primary-200">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle>Clinic Admin View</AlertTitle>
          <AlertDescription>
            You are viewing coaches for {user?.name || "your clinic"} only. As a
            clinic administrator, you can manage all coaches and clients within
            your clinic.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Manage Coaches</CardTitle>
          <CardDescription>
            {isClinicAdmin
              ? `Manage coaches for ${user?.name || "your clinic"}`
              : "View and manage all coaches across clinics"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoachesFilter
            filterText={filterText}
            setFilterText={setFilterText}
            count={filteredCoaches.length}
          />

          <CoachesTable coaches={filteredCoaches} />
        </CardContent>
      </Card>

      <AddCoachDialog open={isAddCoachDialogOpen} />

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
