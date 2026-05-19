"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { selectCurrentUser } from "@/redux/features/authSlice";
import {
  Cpu,
  Activity,
  Zap,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const currentUser = useAppSelector(selectCurrentUser);

  const stats = [
    {
      title: "System Request Volume",
      value: "124,580 Calls",
      description: "+14.2% activity increase this cycle",
      icon: Activity,
      colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Core CPU Health",
      value: "99.98% Up",
      description: "Turbopack server thread active",
      icon: Cpu,
      colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "API Queue Delays",
      value: "0.4 ms Average",
      description: "Low-latency RTK cache active",
      icon: Zap,
      colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Active Security Gates",
      value: "Verifying",
      description: `${currentUser?.role || "Admin"} scope authorized`,
      icon: ShieldCheck,
      colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] opacity-40" />
        <div className="relative z-10 space-y-4">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-0.5 text-xs font-semibold tracking-wider uppercase border border-white/20 select-none font-mono">
              Control Panel Active
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
              Welcome Back, {currentUser?.name || "Administrator"}!
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
              This enterprise-grade boilerplate starter is preconfigured with TypeScript, Redux Toolkit, custom Axios interceptors, Zod validations, and SSR-safe persistence.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/dashboard/roles">
              <Button className="bg-white hover:bg-zinc-100 text-zinc-900 font-semibold h-10 shadow-lg cursor-pointer">
                Audit Roles & Policies
                <ChevronRight className="ml-1.5 h-4 w-4 text-zinc-900" />
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

      {/* Core Onboarding Helper Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Next Steps Checklist</CardTitle>
            <CardDescription>Follow these tasks to adapt the boilerplate for your custom SaaS or ERP product.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-foreground">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold font-mono">1</div>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Connect Real API Server:</strong> Open <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-rose-500">.env</code> and configure your <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">NEXT_PUBLIC_BASE_URL</code> variable.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold font-mono">2</div>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Configure Domain Types:</strong> Define schema models in the <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">src/types/</code> folder and let RTK-Query typings adapt automatically.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold font-mono">3</div>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Orchestrate Sidebar Navigation:</strong> Add or modify routing layout items inside <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">src/components/app-sidebar.tsx</code> to scale navigation dynamically.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats side block */}
        <Card className="border bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Current Active Session</CardTitle>
            <CardDescription>Authentication scope detail indicators.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Logged Name:</span>
              <span className="font-semibold text-foreground">{currentUser?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Admin Mail:</span>
              <span className="font-semibold text-foreground">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Verify Level:</span>
              <span className="font-semibold text-primary">{currentUser?.role}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-muted-foreground">Token Persistence:</span>
              <span className="font-semibold text-emerald-500">SSR Safe Storage</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
