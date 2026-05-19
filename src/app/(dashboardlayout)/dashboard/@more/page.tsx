"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { selectCurrentUser } from "@/redux/features/authSlice";
import {
  Compass,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  MessageSquareCode
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MoreDashboardPage() {
  const currentUser = useAppSelector(selectCurrentUser);

  const stats = [
    {
      title: "Core API Status",
      value: "Online",
      description: "Gateway response verified",
      icon: Compass,
      colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Current Account Role",
      value: currentUser?.role || "Operations",
      description: "Permissions scope locked",
      icon: Briefcase,
      colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Session Persistence",
      value: "Active",
      description: "Token safely stored in memory",
      icon: Layers,
      colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "User Interface Mode",
      value: "Fluid CSS",
      description: "Fully responsive view active",
      icon: Sparkles,
      colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  const activities = [
    { time: "10 mins ago", event: "System Scope Query", detail: "Audited verified user role permissions" },
    { time: "2 hours ago", event: "Preferences Synced", detail: "Theme settings mapped to system default" },
    { time: "1 day ago", event: "Session Initialized", detail: "Secure login established from local web agent" },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Dynamic Welcome Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-40" />
        <div className="relative z-10 space-y-4">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold tracking-wider uppercase border border-white/20 select-none font-mono">
              Operations Control Board
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
              Hello, {currentUser?.name || "Operations Partner"}!
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Welcome to your dedicated operations dashboard workspace. Here you can explore core API response flags, audit active session logs, and run fast queries with our localized cache adapters.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/more">
              <Button className="bg-white hover:bg-zinc-100 text-zinc-900 font-semibold h-10 shadow-lg cursor-pointer">
                Explore Specifications
                <ArrowRight className="ml-1.5 h-4 w-4 text-zinc-900" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Stats Block */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="bg-card text-card-foreground shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg border ${stat.colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Operations Panel Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Activity feed panel */}
        <Card className="md:col-span-2 border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Recent Operations Log</CardTitle>
            <CardDescription>Track recently logged activities associated with your session scope.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((act, idx) => (
              <div key={idx} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col items-center select-none pt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20" />
                  <div className="w-0.5 h-full bg-muted mt-2" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{act.event}</span>
                    <span className="text-[10px] text-muted-foreground font-mono font-medium">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{act.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Self-service actions */}
        <Card className="border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Quick Action Center</CardTitle>
            <CardDescription>Operations shortcuts and utilities.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/about" className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/40 transition-colors text-xs font-semibold">
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                Learn Architecture
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <Link href="/more" className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-muted/40 transition-colors text-xs font-semibold">
              <span className="flex items-center gap-2">
                <MessageSquareCode className="h-4 w-4 text-purple-500" />
                Inspect Specifications
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 text-xs font-mono text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-500" />
                Operations Shift:
              </span>
              <span>Morning Cycle</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
