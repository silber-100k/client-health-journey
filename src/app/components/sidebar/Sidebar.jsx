"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { BookMarked, User } from "lucide-react";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";
import {
  adminNavItems,
  clinicAdminNavItems,
  coachNavItems,
  clientNavItems,
} from "./sidebardata";
import { useAuth } from "@/app/context/AuthContext";
import { Loader2 } from "lucide-react";

export function Sidebar() {
  const { user } = useAuth();

  return (
    !user ? (
      <div className="flex items-center justify-center h-screen w-72">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ) : (
      <div className={cn("flex flex-col h-screen border-r bg-background w-72")}>
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <span className="font-semibold">Client Health Tracker™</span>
          </Link>
        </div>
        <SidebarNav
          items={
            user.role === "admin" ?
              adminNavItems :
              user.role === "clinic_admin" ?
                clinicAdminNavItems :
                user.role === "coach" ?
                  coachNavItems :
                  clientNavItems
          }
        />
        <SidebarProfile
          user={user}
          userRole={user.role}
          roleIcon={User}
        />
      </div>
    )
  );
}
