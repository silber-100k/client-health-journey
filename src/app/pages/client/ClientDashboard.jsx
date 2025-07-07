"use client";
import { useEffect, useState } from "react";
import ClientDailyDrip from "../../components/client/ClientDailyDrip";
import ProgramProgress from "../../components/client/ProgramProgress";
import LatestStats from "../../components/client/LatestStats";
import QuickActions from "../../components/client/QuickActions";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";

const TUTORIAL_LINK = "https://wellness-journey-guide-w2hnbup.gamma.site/";

const ClientDashboard = () => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("client_welcome_seen");
      if (!seen) setShowWelcome(true);
    }
  }, []);

  const handleDismiss = () => {
    setShowWelcome(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("client_welcome_seen", "1");
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      <Dialog open={showWelcome} onOpenChange={handleDismiss}>
        <DialogContent className="max-w-md">
          <DialogHeader className="flex flex-row items-center gap-2">
            <Info className="text-blue-500 w-6 h-6" />
            <DialogTitle>Welcome to your Dashboard!</DialogTitle>
          </DialogHeader>
          <DialogDescription className="mb-2">
            To help you get started, check out our <b>Quick Start Tutorial</b>.<br />
            <a
              href={TUTORIAL_LINK}
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Go to Tutorial
            </a>
          </DialogDescription>
          <div className="text-sm text-gray-700 mb-2">
            You can always find the tutorial and more helpful resources under the <b>Resources</b> tab.
          </div>
          <div className="flex gap-2 mt-2">
            <Button onClick={handleDismiss} variant="secondary">Skip</Button>
            <Button asChild variant="default" onClick={handleDismiss}>
              <a href={TUTORIAL_LINK} target="_blank" rel="noopener noreferrer">Start Tutorial</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Daily motivation message */}
      <ClientDailyDrip />
      {/* Program progress */}
      {/* <ProgramProgress /> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 gap-y-4 w-full">
        {/* Latest stats */}
        <LatestStats />
        {/* Quick actions */}
        <QuickActions />
      </div>
    </div>
  );
};

export default ClientDashboard;
