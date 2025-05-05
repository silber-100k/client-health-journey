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
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

const ClientsPage = () => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isClinicAdmin = true;
  const isCoach = false;
  const { user } = useAuth();
  const handleAddlclientdialogue = () => {
    setIsAddClientDialogOpen(true);
  };
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/client");
      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      toast.error("Failed to fetch clients");
      console.log(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isLoading} onClick = {fetchClients}>
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button onClick={handleAddlclientdialogue}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      <Alert className="mb-6 bg-primary-50 border-primary-200">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle>Clinic Admin View</AlertTitle>
        <AlertDescription>
          You are viewing all clients for {user?.name || "your clinic"}. This
          includes clients assigned to all coaches in your clinic. Your clinic
          ID is: {user?.clinic._id || "unknown"}
        </AlertDescription>
      </Alert>

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
          {isCoach ? <CoachClientList /> : <ClientList clients={clients} />}
        </CardContent>
      </Card>

      <AddClientDialog
        open={isAddClientDialogOpen}
        onOpenChange={setIsAddClientDialogOpen}
        fetchClients={fetchClients}
      />
    </div>
  );
};

export default ClientsPage;
