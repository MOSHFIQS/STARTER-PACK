import React from "react";
import { BRAND_CONFIG } from "@/config/brand";
import { Compass, Shield, Users, ShieldCheck, Cpu, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: `About Us - ${BRAND_CONFIG.name}`,
  description: "Learn more about the infrastructure and goals behind the Nexus Wear management platform.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Corporate Mission",
      desc: "Providing enterprises with microsecond query precision, structured cache contexts, and high-performance operations metrics.",
      icon: Compass,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Data Stewardship",
      desc: "Every record is verified locally via structured Zod models before sending to distributed services, safeguarding transactional consistency.",
      icon: Shield,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Collaboration First",
      desc: "Enabling role-based dashboards where administrators, stock managers, and operations planners interact seamlessly over shared state.",
      icon: Users,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  const milestones = [
    { year: "2024", title: "Boilerplate Inception", desc: "Crafting standard Next-gen architectures." },
    { year: "2025", title: "Enterprise Scaling", desc: "Adding RTK-Query offline synchronization." },
    { year: "2026", title: "Multi-Role Launch", desc: "Providing modular, role-based dashboards." },
  ];

  return (
    <div className="space-y-16 py-8 select-none">
      {/* Header Panel */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground uppercase">
          About Our Platform
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Nexus Wear represents an elite operational ecosystem crafted to scale SaaS dashboard architectures, design control panels, and operations ledgers.
        </p>
      </section>

      {/* Core Values / Pillars Grid */}
      <section className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {values.map((v, idx) => {
          const Icon = v.icon;
          return (
            <Card key={idx} className="bg-card text-card-foreground border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className={`p-2.5 w-11 h-11 rounded-xl border flex items-center justify-center ${v.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-foreground">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Technology Specifications Panel */}
      <section className="rounded-2xl border bg-muted/20 p-8 max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-mono">
              Operational Purity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Elite System Architecture
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our codebase is organized to prevent performance bottlenecks. By separating the public presentation layout from the private transactional layout, we minimize initial page load sizes and enforce strict security parameters on internal pages.
          </p>
          <div className="flex flex-col gap-3 font-mono text-xs text-foreground">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-500" />
              <span>Next.js 15 App Router & Server Components</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span>Redux Persist Offline-First Store Context</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-purple-500" />
              <span>Strict Role-Based Page Access Gates</span>
            </div>
          </div>
        </div>

        {/* Milestone Timeline Panel (Right) */}
        <div className="space-y-6 relative z-10">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">
            Platform Evolution
          </span>
          <div className="space-y-6 border-l pl-4 relative">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative space-y-1">
                {/* Neon Timeline Point */}
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-background shadow-lg shadow-emerald-500/40" />
                <span className="text-[10px] font-extrabold text-emerald-500 font-mono tracking-wider">
                  {m.year} &mdash; {m.title}
                </span>
                <p className="text-xs text-muted-foreground leading-normal">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
