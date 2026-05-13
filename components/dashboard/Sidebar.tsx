"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  Home,
  MessageSquare,
  TrendingUp,
  Settings,
  BookOpen,
  Trophy,
} from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // 1. ADD THIS IMPORT
export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Legal Assistant", href: "/chat", icon: MessageSquare },
    { name: "Course Modules", href: "/modules", icon: BookOpen }, // NEW
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy }, // NEW
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-lg tracking-tight">NyayaSetu</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SETTINGS AND AUTH AREA */}
      <div className="mt-auto p-4 flex flex-col gap-2 border-t border-border/50">
        <Link
          href="/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            pathname === "/settings"
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          }`}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <Show when="signed-in">
            {/* 2. UPDATE THIS COMPONENT */}
            <UserButton />
            <span className="text-sm font-medium text-muted-foreground">
              My Profile
            </span>
          </Show>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-primary hover:underline"
            >
              Sign In
            </Link>
          </Show>
        </div>
      </div>
    </aside>
  );
}
