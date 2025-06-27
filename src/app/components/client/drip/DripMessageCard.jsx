"use client"
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";

const DripMessageCard = () => {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/client/daily-drip-message")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Welcome!"));
  }, []);

  return (
    <Card className="mb-6 border-l-4 border-l-primary w-full max-w-full">
      <CardContent className="px-2 sm:px-4">
        <h3 className="font-medium text-base sm:text-lg mb-2">👋 Daily Motivation</h3>
        <p className="text-gray-700 text-sm sm:text-base">{message}</p>
      </CardContent>
    </Card>
  );
};

export default DripMessageCard;
