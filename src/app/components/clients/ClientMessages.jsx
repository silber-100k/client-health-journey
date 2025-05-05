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
import { MessageSquare, Send, User, Users } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { socket } from "@/socket";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { tickIcon } from "../ui/Icon";

const ClientMessages = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [messages, setMessages] = useState([]);
  // const [userlist, setUserList] = useState([]);
  const [currentClient, setCurrentClient] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const [clients, setClients] = useState([]);
  const [coach, setCoach] = useState([]);
  const [msgHistory, setMsgHistory] = useState([]);
  const fetchMessageHistory = async ({ sender, receiver }) => {
    try {
      const response = await fetch("/api/message/history", {
        method: "POST",
        body: JSON.stringify({ sender, receiver }),
      });
      const data = await response.json();
      if (data.status) {
        toast.success("Message history is fetched successfully");
        setMessages(data.messageHistory);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Unable to get message history");
    }
  };
  const fetchClients = async () => {
    try {
      const response = await fetch("/api/coach/client");
      const data = await response.json();
      console.log("clients", data);
      setClients(data.clients);
      console.log("clients list", data.clients);
    } catch (error) {
      toast.error("Failed to fetch clients");
      console.log(error);
    }
  };

  const fetchCoachbyId = async () => {
    try {
      const response = await fetch("/api/coach/byId", {
        method: "POST",
        body: JSON.stringify({ id: user.coachId }),
      });
      const data = await response.json();
      setCoach(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.role === "coach" || user?.role === "clinic_admin") {
      fetchClients();
    }
    if (user?.role === "client") {
      fetchCoachbyId();
    }
    if (socket.connected) {
      onConnect();
    }

    fetchMessageHistory({ sender: user?.email, receiver: currentClient });

    const handleMessageRecieve = (data) => {
      //update state in database
      socket.emit("message_delivered", { messageId: data.id, from: data.from });
      const updateMessage = async (data) => {
        try {
          const response = await fetch("/api/message/update", {
            method: "POST",
            body: JSON.stringify({ id: data.id, status: "delivered",email:user.email }),
          });
          const jsondata = await response.json();
          if (jsondata.status) {
            toast.success("Message status updated successfully");
          } else {
            toast.error(jsondata.message);
          }
        } catch (error) {
          console.log("why not update", error);
          toast.error("Unable to update message");
        }
      };

      if (currentClient == data.from && (user?.role === "coach"|| user?.role === "clinic_admin")) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data, status: "delivered" },
        ]);
        updateMessage(data);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data, status: "delivered" },
        ]);
        updateMessage(data);
      }
    };

    socket.on("msg-recieve", handleMessageRecieve);
    socket.on("message-status", ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg))
      );
    });
    socket.emit("get_user_list");

    // socket.on("online_users", (users) => {
    //   setUserList(users);
    // });

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("msg-recieve", handleMessageRecieve);
      socket.off("disconnect", onDisconnect);
    };
  }, [currentClient, user]);

  useEffect(() => {
    console.log("coach", coach);
    if (coach) {
      fetchClients();
      fetchMessageHistory({ sender: user?.email, receiver: coach.email });
    }
  }, [coach]);

  useEffect(() => {
    const unseenMessageIds = messages
      .filter((msg) => msg.to === user?.email && msg.status === "sent")
      .map((msg) => msg.id);
    if (unseenMessageIds.length > 0) {
      socket.emit("messages_viewed", {
        messageIds: unseenMessageIds,
        viewerEmail: user?.email,
      });
    }
  }, [messages]);

  const firstUnreadIndex = messages.findIndex(
    (msg) => msg.status === "sent" && msg.to === user.email
  );

  const sendMessage = () => {
    if (!isConnected) {
      alert("Socket not connected");
      return;
    }
    const messageId = uuidv4();
    let receiverMail = currentClient;

    if (user?.role === "client") {
      receiverMail = coach.email;
    }
    const messageToSend = {
      id: messageId,
      from: user.email,
      to: receiverMail,
      message: newMessage,
      status: "sent",
      timestamp: new Date(),
    };
    socket.emit("send-message", messageToSend);
    setMessages((prev) => [...prev, messageToSend]);

    setNewMessage("");
    const savedata = {
      id: messageId,
      message: newMessage,
      receiver: receiverMail,
      sender: user.email,
      status: "sent",
    };
    const saveMessage = async (savedata) => {
      try {
        console.log("saved message1", savedata);
        const response = await fetch("/api/message/save", {
          method: "POST",
          body: JSON.stringify(savedata),
        });
        const data = await response.json();
        if (data.status) {
          toast.success("Message added successfully");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Unable to save message");
      }
    };
    saveMessage(savedata);
  };
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

  const handlechange = (e) => {
    setCurrentClient(e);
  };
  return (
    <>
      <div className="flex justify-between">
        <p>Status: {isConnected ? "connected" : "disconnected"}</p>
        <p>Transport: {transport}</p>
      </div>
      {user?.role === "coach" || user?.role === "clinic_admin" ? (
        <>
          <Label htmlFor="userList" className="mt-[20px] mb-[10px]">
            User List
          </Label>
          <Select
            name="userList"
            value={currentClient}
            onValueChange={handlechange}
          >
            <SelectTrigger className="mb-[20px]">
              <SelectValue placeholder="Select Users" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client, index) => (
                <SelectItem value={client.email} key={index}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : (
        ""
      )}
      <Card className="h-[calc(100vh-220px)] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Messages
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto mb-4">
          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <>
                  {idx === firstUnreadIndex && (
                    <>
                      <div className="text-[10px] text-[#aaaaaa] mt-0 mb-[5px]">
                        Unread messages
                        <hr
                          style={{ borderColor: "#e92450", borderWidth: 1 }}
                          className="mb-[15px]"
                        />
                      </div>
                    </>
                  )}
                  <div
                    key={idx}
                    className={`flex ${
                      msg.from === user.email ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${
                        msg.from === user.email
                          ? "flex-row-reverse"
                          : "flex-row"
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
                          className={`px-4 py-2 rounded-lg text-sm flex justify-between ${
                            msg.from === user.email
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.message}
                          <div className="ml-[10px] content-end">
                            {user.email === msg.from &&
                              msg.status === "sent" &&
                              tickIcon}
                            {user.email === msg.from &&
                              msg.status === "delivered" && (
                                <div className="flex">
                                  {tickIcon}
                                  {tickIcon}
                                </div>
                              )}
                          </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
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
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              size="icon"
              // disabled={!newMessage.trim() || isLoading}
            >
              <Send size={18} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default ClientMessages;
