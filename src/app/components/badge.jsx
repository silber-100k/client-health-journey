"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { socket } from "@/socket";
import { toast } from "sonner";
import { unreadCount } from "@/app/store";

export default function NotificationBadge({ isMessage, email }) {
  const [unread, setUnread] = useAtom(unreadCount);

  useEffect(() => {
    const number = async (email) => {
      try {
        const response = await fetch("/api/message/notification", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setUnread(data?.getNumber || 0);
      } catch (error) {
        toast.error("Unable to get number");
      }
    };
    number(email);
    console.log("unread", unread);
    socket.on("msg-recieve", (data) => {
      if (!isMessage) {
        setUnread((prev) => prev + 1);
        toast.success("new message");
      }
    });
    return () => {
      socket.off("msg-recieve");
    };
  }, [email]);
  useEffect(() => {
    if (unread > 0) {
      toast.success(`You have ${unread} new messages.`);
    }
  }, [unread]);
  return unread > 0 ? (
    <div className="w-[20px] h-[20px] rounded-full bg-red-500 text-white text-center">
      {unread}
    </div>
  ) : null;
}
