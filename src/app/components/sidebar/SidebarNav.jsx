"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../components/ui/scroll-area";

const SidebarNav = ({ items }) => {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1 py-2">
      <nav className="grid gap-1 px-2">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href && "bg-accent text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>
    </ScrollArea>
  );
};

export default SidebarNav;
