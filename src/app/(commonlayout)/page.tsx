import React from "react";
import Link from "next/link";
import { BRAND_CONFIG } from "@/config/brand";
import { 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Layers, 
  Activity, 
  ArrowRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: `${BRAND_CONFIG.name} - Next-Gen E-Commerce Control Center`,
  description: BRAND_CONFIG.description,
};

export default function LandingPage() {
  const features = [
    {
      title: "State Architecture",
      desc: "Robust state tracking powered by Redux Toolkit and fully synchronized SSR-safe persistence.",
      icon: Layers,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "RTK Query Core",
      desc: "Zero-latency data fetching with predictive automated cache invalidation.",
      icon: Zap,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "TypeScript Verified",
      desc: "End-to-end strongly typed API structures, request validation models, and schemas.",
      icon: ShieldCheck,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Dynamic Tailwinds",
      desc: "Beautiful styling built on the new Tailwind v4 engine utilizing sleek variable tokens.",
      icon: Sparkles,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  const highlights = [
    { label: "Client Queries", value: "O(1) Cache" },
    { label: "Theme Adapters", value: "Auto HSL" },
    { label: "Data Validations", value: "Zod Engine" },
  ];

  return (
    <div className="space-y-20 py-8">
      {/* Premium Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8 select-none relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/40 text-xs font-semibold text-muted-foreground">
          <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          System Framework Fully Functional
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
          Next-Gen Operations Board for{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 animate-gradient">
            {BRAND_CONFIG.name}
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Accelerate your dashboard layout designs, state monitoring, and routing integrations using our elite, offline-fallback React boilerplate ecosystem.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <button className="h-12 px-6 rounded-full bg-foreground text-background font-bold text-sm tracking-wide shadow-xl shadow-foreground/5 hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="/about">
            <button className="h-12 px-6 rounded-full border bg-card text-foreground font-bold text-sm tracking-wide hover:bg-muted/30 active:scale-95 transition-all cursor-pointer">
              Learn Architecture
            </button>
          </Link>
        </div>
      </section>

      {/* Decorative Mockup Board Grid */}
      <section className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden max-w-5xl mx-auto select-none group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:16px_26px]" />
        
        {/* Mockup Header bar */}
        <div className="h-12 border-b bg-muted/20 px-4 flex items-center gap-2 select-none relative z-20">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="text-[10px] text-muted-foreground font-mono ml-4 truncate">
            https://nexus-wear-dashboard.app/dashboard
          </span>
        </div>

        {/* Mockup Core Visual Content */}
        <div className="p-8 grid md:grid-cols-3 gap-6 relative z-20 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
          {/* Main Visual Board Panel */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-xl border bg-muted/40 p-5 space-y-3">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">
                Core Platform response latency
              </span>
              <div className="text-3xl font-extrabold">14ms Average</div>
              <p className="text-xs text-muted-foreground">
                Verified dynamically via asynchronous server-sent telemetry polling loops.
              </p>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-11/12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border p-4 space-y-1">
                <span className="text-[10px] text-muted-foreground font-mono">SYSTEM UPTIME</span>
                <div className="text-xl font-bold">99.98% Threads</div>
              </div>
              <div className="rounded-xl border p-4 space-y-1">
                <span className="text-[10px] text-muted-foreground font-mono">SECURITY GATES</span>
                <div className="text-xl font-bold text-emerald-500 flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5" /> Active
                </div>
              </div>
            </div>
          </div>

          {/* Quick Sidebar Preview inside mockup */}
          <div className="rounded-xl border bg-muted/30 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">
                System Health Details
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Network State:</span>
                  <span className="font-semibold text-emerald-500">Connected</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Persist Module:</span>
                  <span className="font-semibold text-foreground">Active</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-muted-foreground">Active Load:</span>
                  <span className="font-semibold text-foreground">Minimal</span>
                </div>
              </div>
            </div>
            
            <Link href="/dashboard" className="w-full">
              <button className="w-full h-10 text-xs rounded-lg bg-foreground text-background font-bold shadow-md hover:opacity-90 cursor-pointer">
                Enter Control Room
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions / Key Features */}
      <section className="max-w-5xl mx-auto space-y-10 select-none">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Platform Capabilities & Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Engineered specifically to support massive datasets, granular security, and rapid development speed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="bg-card text-card-foreground shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className={`p-2 w-10 h-10 rounded-xl border flex items-center justify-center ${feat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">{feat.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Metrics Highlights Section */}
      <section className="bg-muted/20 border rounded-2xl p-8 max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6 select-none relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        {highlights.map((hl, idx) => (
          <div key={idx} className="text-center space-y-1">
            <span className="block text-3xl font-extrabold text-foreground font-mono tracking-tight">
              {hl.value}
            </span>
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              {hl.label}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
