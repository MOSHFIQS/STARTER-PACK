import React from "react";
import { BRAND_CONFIG } from "@/config/brand";
import { 
  Cpu, 
  TrendingUp, 
  ShieldAlert, 
  Settings, 
  Terminal 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata = {
  title: `Explorer - ${BRAND_CONFIG.name}`,
  description: "Browse the modular architecture, APIs, and operational capabilities of the Nexus Wear system.",
};

export default function MorePage() {
  const modules = [
    {
      title: "Telemetry Engine",
      desc: "Comprehensive application tracing supporting performance metrics, error rates, logging contexts, and dynamic dashboard charts.",
      icon: Cpu,
      status: "Ready",
      colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Data Analytics",
      desc: "Real-time monitoring of active socket events, system request warnings, resource loads, and responsive operations log charts.",
      icon: TrendingUp,
      status: "Operational",
      colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Access Controller",
      desc: "Granular security rules mapped to role categories (Admins, Managers, and Users) governing secure dashboard layouts and policy permissions.",
      icon: ShieldAlert,
      status: "Guarded",
      colorClass: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Platform Presets",
      desc: "Adaptable company names, default API gateway targets, local storage themes, and persistent configuration utilities.",
      icon: Settings,
      status: "Configured",
      colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-16 py-8 select-none">
      {/* Header Panel */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground uppercase">
          System Capability Explorer
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Examine the modular frameworks, dynamic states, and design policies configured inside our premium dashboard portal.
        </p>
      </section>

      {/* Capabilities Grid */}
      <section className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} className="bg-card text-card-foreground border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-base font-bold text-foreground">
                  {m.title}
                </CardTitle>
                <div className={`p-2 rounded-lg border ${m.colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {m.desc}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-muted-foreground">Module State:</span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-500 font-bold border border-emerald-500/20">
                    {m.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Developer Terminal Specs */}
      <section className="border rounded-2xl bg-zinc-950 text-zinc-100 p-6 md:p-8 max-w-5xl mx-auto space-y-6 shadow-2xl relative overflow-hidden font-mono text-xs select-text">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-zinc-850 pb-4 select-none">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-500" />
            <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">
              nexus-wear-compiler-terminal v1.4
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-emerald-500 font-semibold uppercase">ONLINE</span>
          </div>
        </div>

        {/* Terminal Specs Body */}
        <div className="space-y-4 leading-relaxed">
          <div>
            <span className="text-zinc-500">$</span> <span className="text-emerald-400">nexus --inspect --verbose</span>
          </div>
          <div className="space-y-1.5 text-zinc-300 text-[11px]">
            <p className="text-zinc-500">&gt; Querying local system configuration models...</p>
            <p>1. Framework Version: <span className="text-amber-400">Next.js 15.4.6 (Turbopack Enabled)</span></p>
            <p>2. UI Components: <span className="text-purple-400">Radix UI Primitives, Lucide-React, Shadcn Tailwind Configs</span></p>
            <p>3. State Synchronizer: <span className="text-blue-400">Redux Persist Client Engine via LocalStorage Adapter</span></p>
            <p>4. Dynamic Layout Groups: <span className="text-emerald-400">(commonlayout) public-facing, (dashboardlayout) secure-gated</span></p>
            <p>5. Role Routing Strategy: <span className="text-rose-400">Next.js Parallel Route Slots (@admin | @more)</span></p>
          </div>
          <div>
            <span className="text-zinc-500">$</span> <span className="text-zinc-300">echo &quot;Platform operational checklist completed successfully.&quot;</span>
          </div>
          <div className="text-zinc-500">
            &gt; System check clean. Zero critical anomalies identified. Ready to proceed.
          </div>
        </div>
      </section>
    </div>
  );
}
