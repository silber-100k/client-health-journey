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
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useClinic } from "@/app/context/ClinicContext";
import { useRouter } from "next/navigation";

const ClientsPage = () => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isClinicAdmin = true;
  const isCoach = false;
  const [currentCoach, setCurrentCoach] = useState("");
  const { user } = useAuth();
  console.log(clientLimit)
  const { clientLimit } = useClinic();
  const router = useRouter();

  const handleAddlclientdialogue = () => {
    if (
      clientLimit !== false &&
      (clientLimit === 0 || clientLimit <= clients.length)
    ) {
      toast.custom(() => (
        <Alert>
          <AlertTitle>
            You have reached the maximum number of clients
          </AlertTitle>
          <AlertDescription>
            You have reached the maximum number of clients for your plan. Please
            upgrade to a higher plan to add more clients.
          </AlertDescription>
          <Button
            variant="outline"
            onClick={() => router.push("/clinic/settings")}
          >
            Upgrade
          </Button>
        </Alert>
      ));
      return;
    }
    setIsAddClientDialogOpen(true);
  };
  const handlechange = (e) => {
    setCurrentCoach(e);
    if (e === "all") {
      fetchClients();
    } else {
      fetchClientsByCoach(e);
    }
  };

  const fetchCoaches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/clinic/coach");
      const data = await response.json();
      if (data.coaches) {
        setCoaches(data.coaches);
      } else {
        toast.error("Failed to fetch coaches");
      }
    } catch (error) {
      toast.error("Failed to fetch coaches");
    } finally {
      setIsLoading(false);
    }
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

  const fetchClientsByCoach = async (coachId) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/clinic/client/bycoachId", {
        method: "POST",
        body: JSON.stringify({ coachId }),
      });
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
    fetchCoaches();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-2">
          <Button variant="outline" disabled={isLoading} onClick={fetchClients}>
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
          includes clients assigned to all coaches in your clinic.
          {/* Your clinic ID is: {user?.clinic.id || "unknown"} */}
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
          <div className="mb-4">
            <Label htmlFor="userList" className="mb-2">
              Select Coach
            </Label>
            <Select
              name="userList"
              value={currentCoach}
              onValueChange={handlechange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a coach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value={user?.id}>{user?.name}</SelectItem>
                {coaches?.map((coach, index) => (
                  <SelectItem value={coach.id} key={index}>
                    {coach.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {isCoach ? <CoachClientList /> : <ClientList clients={clients} />}
        </CardContent>
      </Card>

      <AddClientDialog
        open={isAddClientDialogOpen}
        onOpenChange={setIsAddClientDialogOpen}
        fetchClients={fetchClients}
        clientLimit={clientLimit}
        clientCount={clients.length}
      />
    </div>
  );
};

export default ClientsPage;
