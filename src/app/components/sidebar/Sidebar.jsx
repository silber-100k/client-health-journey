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

export function Sidebar() {
  const user = {
    id: "asdf",
    name: "okay",
    email: "steven@gmail.com",
    role: "admin",
    phone: "123-123-123",
  };
  let navItems = adminNavItems; // Default fallback
  let userRole = user.role;
  let displayRoleText = userRole;
  let roleIcon = User;
  return (
    <div className={cn("flex flex-col h-screen border-r bg-background w-72")}>
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <span className="font-semibold">Client Health Tracker™</span>
        </Link>
      </div>
      <SidebarNav items={navItems} />
      <SidebarProfile
        user={user}
        userRole={displayRoleText}
        roleIcon={roleIcon}
      />
    </div>
  );
}
