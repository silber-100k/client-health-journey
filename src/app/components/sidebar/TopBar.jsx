"use client";

import React from "react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Bell, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
const TopBar = () => {
  const user = {
    id: "asdf",
    name: "okay man",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };

  const theme = {
    primaryColor: null,
    secondaryColor: null,
    logo: null,
    clinicName: null,
  };
  // Extract first name from user's full name
  const firstName = user?.name ? user.name.split(" ")[0] : "";

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {theme.logo ? (
            <img
              src={theme.logo}
              alt={theme.clinicName || "Clinic logo"}
              className="h-8 w-auto"
            />
          ) : (
            <h2 className="text-lg md:text-xl font-medium text-gray-800 mr-4">
              Client Health Tracker™
            </h2>
          )}
          <span className="hidden md:inline-block bg-primary-100 text-primary-800 text-xs font-medium py-1 px-2 rounded">
            {user?.role === "client" ? "Client Portal" : "Staff Portal"}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <Bell size={20} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`}
                    alt={firstName || "User"}
                  />
                  <AvatarFallback>
                    {firstName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Welcome, {firstName}</DropdownMenuLabel>
              <DropdownMenuItem className="flex items-center">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center text-red-500 focus:text-red-500 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
