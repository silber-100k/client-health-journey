"use client";

import { useEffect, useState } from "react";
import { socket } from "@/socket";

export default function NotificationBadge({
  isMessage,
  email,
  unreadCount,
  setUnreadCount,
}) {
  useEffect(() => {
    // Initial load
    const number = async (email) => {
      try {
        const response = await fetch("/api/message/notification", {
          method: "POST",
          body: JSON.stringify(email),
        });
        const data = await response.json();
        setUnreadCount(data?.getNumber);
      } catch (error) {
        toast.error("Unable to get number");
      }
    };
    number(email);
    console.log("ismessageeeeeeeeeeeeeeee", isMessage);
    socket.on("msg-recieve", (data) => {
      if (!isMessage) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("msg-recieve");
    };
  }, [email]);

  useEffect(() => {
    console.log("countaaaaaaaaaaaaaaaa", unreadCount);
    console.log("ismessageeeeeeeeeeeeeeee", isMessage);
  }, [unreadCount, isMessage]);

  return unreadCount > 0 ? (
    <div className="w-[20px] h-[20px] rounded-full bg-red-500 text-white text-center">
      {unreadCount}
    </div>
  ) : null;
}
