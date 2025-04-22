"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { MessageSquare, Send, User } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";

const ClientMessages = () => {
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  const [newMessage, setNewMessage] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long", // e.g. "April"
      day: "numeric", // e.g. 21
      hour: "numeric", // e.g. 10 PM
      minute: "2-digit", // e.g. 15
      hour12: true, // 12-hour clock with AM/PM
    }).format(date);
  };

  const isLoading = false;
  const error = null;
  const messages = [
    {
      id: "1",
      senderId: "a",
      senderName: "coach1",
      message: "hello",
      timestamp: "2025-04-21T21:14:00",
      isRead: false,
    },
    {
      id: "2",
      senderId: "a",
      senderName: "coach1",
      message: "how are you",
      timestamp: "2025-04-21T21:14:01",
      isRead: false,
    },
    {
      id: "3",
      senderId: "b",
      senderName: "coach2",
      message: "hello nice to meet you",
      timestamp: "2025-04-21T21:14:02",
      isRead: false,
    },
  ];
  const handleSendMessage = () => {
    console.log(newMessage);
  };
  return (
    <Card className="h-[calc(100vh-220px)] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          Messages
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto mb-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-60" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground">
              {error}
              <br />
              <span className="text-sm">
                Contact your administrator for support
              </span>
            </p>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${
                    msg.senderId === user?.id ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {msg.senderAvatar ? (
                      <AvatarImage
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                      />
                    ) : (
                      <AvatarFallback>
                        <User size={16} />
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <div
                      className={`px-4 py-2 rounded-lg text-sm ${
                        msg.senderId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.message}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground">
              No messages yet. Send your first message to your coach!
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="flex w-full items-center gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={!newMessage.trim() || isLoading}
          >
            <Send size={18} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClientMessages;
