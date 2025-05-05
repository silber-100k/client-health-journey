"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { toast } from "sonner";
import { unreadCount } from "@/app/store";

export default function NotificationBadge({
  isMessage,
  email,
}) {
  const [unread, setUnread] = useAtom(unreadCount);

  useEffect(() => {
    // Initial load
    const number = async (email) => {
      try {
        const response = await fetch("/api/message/notification", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        console.log("data", data);
        setUnread(data?.getNumber || 0);
      } catch (error) {
        toast.error("Unable to get number");
      }
    };
    number(email);
    socket.on("msg-recieve", (data) => {
      if (!isMessage) {
        console.log("msg-recieve", data);
        setUnread((prev) => prev + 1);
      }
    });

    return () => {
      socket.off("msg-recieve");
    };
  }, [email]);

  useEffect(() => {
    console.log("countaaaaaaaaaaaaaaaa", unread);
    console.log("ismessageeeeeeeeeeeeeeee", isMessage);
  }, [unread, isMessage]);

  return unread > 0 ? (
    <div className="w-[20px] h-[20px] rounded-full bg-red-500 text-white text-center">
      {unread}
    </div>
  ) : null;
}
