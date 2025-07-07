"use client"
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";

const WELCOME_MESSAGE = `👋 Welcome to Client Health Tracker!

Start strong:
 1. Tap Profile to update your password
 2. Track meals, weight & more daily
 3. Message your coach anytime
 4. The more you log, the better your results

You've got this — let's make today count!`;

const DripMessageCard = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem("daily_drip_message_seen");
      if (!seen) {
        setMessage(WELCOME_MESSAGE);
        localStorage.setItem("daily_drip_message_seen", "1");
        return;
      }
    }
    fetch("/api/client/daily-drip-message")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Welcome!"));
  }, []);

  return (
    <Card className="mb-6 border-l-4 border-l-primary w-full max-w-full">
      <CardContent className="px-2 sm:px-4">
        <h3 className="font-medium text-base sm:text-lg mb-2">👋 Daily Motivation</h3>
        <p className="text-gray-700 text-sm sm:text-base whitespace-pre-wrap">{message}</p>
      </CardContent>
    </Card>
  );
};

export default DripMessageCard;
