"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserPlus, AlertCircle, RefreshCw } from "lucide-react";
import ClientList from "../../components/clients/ClientList";
import CoachClientList from "../../components/clients/CoachClientList";
import AddClientDialog from "../../components/clients/AddClientDialog";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useState } from "react";

const ClientsPage = () => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const isClinicAdmin = false;
  const isCoach = true;
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  const handleAddlclientdialogue = () => {
    setIsAddClientDialogOpen(true);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddlclientdialogue}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {isClinicAdmin && (
        <Alert className="mb-6 bg-primary-50 border-primary-200">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertTitle>Clinic Admin View</AlertTitle>
          <AlertDescription>
            You are viewing all clients for {user?.name || "your clinic"}. This
            includes clients assigned to all coaches in your clinic. Your clinic
            ID is: {user?.clinicId || "unknown"}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {isCoach
              ? "Your Clients"
              : isClinicAdmin
              ? `${user?.name || "Clinic"} Clients`
              : "All Clients"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCoach ? <CoachClientList /> : <ClientList />}
        </CardContent>
      </Card>

      <AddClientDialog open={isAddClientDialogOpen} />
    </div>
  );
};

export default ClientsPage;
