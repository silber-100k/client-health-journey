"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import ClientDashboard from "./ClientDashboard";
import ClientMessages from "../../components/clients/ClientMessages";
import ClientResources from "../../components/clients/ClientResources";
import ClientJournal from "../../components/clients/ClientJournal";
import MyProgram from "./MyProgram";
import MyProfile from "./MyProfile";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  User,
  LineChart,
  Book,
  MessageSquare,
  Calendar,
  FileText,
  Utensils,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const ClientPortal = () => {
  const currentPath = usePathname();
  const router = useRouter();
  const {user} = useAuth();
  // Determine which tab should be active based on the current path
  const getDefaultTab = () => {
    if (currentPath.includes("/messages")) return "messages";
    if (currentPath.includes("/journal")) return "journal";
    if (currentPath.includes("/resources")) return "resources";
    if (currentPath.includes("/program")) return "program";
    if (currentPath.includes("/profile")) return "profile";
    return "dashboard";
  };

  const handleTabChange = (value) => {
    switch (value) {
      case "dashboard":
        router.push("/client/dashboard");
        break;
      case "messages":
        router.push("/client/messages");
        break;
      case "resources":
        router.push("/client/resources");
        break;
      case "journal":
        router.push("/client/journal");
        break;
      case "program":
        router.push("/client/program");
        break;
      case "profile":
        router.push("/client/profile");
        break;
      default:
        router.push("/client/dashboard");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Portal</h1>
        <p className="text-gray-500">Welcome back, {user?.name}!</p>
      </div>

      <Tabs
        defaultValue={getDefaultTab()}
        value={getDefaultTab()}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LineChart size={16} />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare size={16} />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="program" className="flex items-center gap-2">
            <Book size={16} />
            <span>My Program</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Food Journal</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Resources</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="meal-plan-generator"
            className="flex items-center gap-2"
          >
            <Utensils size={16} />
            <span>Meal Plans</span>
          </TabsTrigger> */}
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ClientDashboard />
        </TabsContent>

        <TabsContent value="messages">
          <ClientMessages />
        </TabsContent>

        <TabsContent value="resources">
          <ClientResources />
        </TabsContent>

        <TabsContent value="journal">
          <ClientJournal />
        </TabsContent>

        <TabsContent value="program">
          <MyProgram />
        </TabsContent>

        {/* <TabsContent value="meal-plan-generator">
          <MealPlanGenerator />
        </TabsContent> */}

        <TabsContent value="profile">
          <MyProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;
