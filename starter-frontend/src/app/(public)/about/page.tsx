import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
     Award,
     Code2,
     Heart,
     Shield,
     Target,
     Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const values = [
     {
          icon: Shield,
          title: "Production Ready",
          description: "Configured with best practices for security, database, and state management out of the box.",
     },
     {
          icon: Target,
          title: "Developer Centric",
          description: "Designed to minimize boilerplate code so you can focus entirely on adding value.",
     },
     {
          icon: Zap,
          title: "High Performance",
          description: "Leverages NestJS modules, Next.js App Router compilation, and RTK query caching policies.",
     },
     {
          icon: Heart,
          title: "Highly Scalable",
          description: "Easily supports multiple user roles, database models, and microservice integrations.",
     },
];

const milestones = [
     { year: "Phase 1", title: "Core Architecture", description: "Design the base NestJS and Next.js layout configurations." },
     { year: "Phase 2", title: "Security & Guarding", description: "Implement JWT, HTTP cookies, and global Exception Filters." },
     { year: "Phase 3", title: "State & Caching", description: "Configure Redux Toolkit and raw API caching structures." },
     { year: "Phase 4", title: "Scale Release", description: "Provide a reusable dashboard boilerplate template for developers." },
];

export default function AboutPage() {
     return (
          <main className="min-h-screen bg-background">
               {/* Hero Section */}
               <section className="relative py-28 md:py-36 overflow-hidden bg-neutral-950 text-white">
                    <div className="absolute inset-0 z-0">
                         <Image
                              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
                              alt="Modern tech office skyscraper"
                              fill
                              className="object-cover opacity-30"
                              priority
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
                    </div>
                    <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
                         <span className="inline-flex items-center rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 backdrop-blur-md">
                              About Us
                         </span>
                         <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                              Building the Future of <span className="text-indigo-400">Web Templates</span>
                         </h1>
                         <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                              StarterApp is an enterprise-grade boilerplate connecting backend services and frontend interfaces, built to facilitate modern full-stack development.
                         </p>
                    </div>
               </section>

               {/* Mission & Vision */}
               <section className="py-20 md:py-28 bg-background">
                    <div className="max-w-5xl mx-auto px-4">
                         <div className="grid md:grid-cols-2 gap-8">
                              <Card className="border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] rounded-2xl p-8">
                                   <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 mb-5">
                                        <Target className="h-6 w-6 text-indigo-500" />
                                   </div>
                                   <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                                   <p className="text-muted-foreground leading-relaxed">
                                        To make full-stack web application development simple, robust, and
                                        reusable for developers worldwide. We aim to decrease setup overheads by
                                        shipping pre-configured core modules.
                                   </p>
                              </Card>
                              <Card className="border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] rounded-2xl p-8">
                                   <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 mb-5">
                                        <Code2 className="h-6 w-6 text-indigo-500" />
                                   </div>
                                   <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                                   <p className="text-muted-foreground leading-relaxed">
                                        To become the default template architecture for developers building custom SaaS solutions, dashboards, e-commerce applications, and custom panels.
                                   </p>
                              </Card>
                         </div>
                    </div>
               </section>

               {/* Core Values */}
               <section className="py-20 md:py-28 bg-muted/30 border-y border-border">
                    <div className="max-w-7xl mx-auto px-4">
                         <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                              <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                                   Our Core Philosophy
                              </h2>
                              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                                   We design boilerplates based on simplicity, strict typing, and high testability.
                              </p>
                         </div>

                         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                              {values.map((val) => (
                                   <div key={val.title} className="bg-card p-8 rounded-2xl border border-border shadow-[0_8px_30px_rgba(0,0,0,0.015)]">
                                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 mb-4">
                                             <val.icon className="h-5 w-5 text-indigo-500" />
                                        </div>
                                        <h4 className="font-bold text-foreground mb-2">{val.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{val.description}</p>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* Timeline / Milestones */}
               <section className="py-20 md:py-28 bg-background">
                    <div className="max-w-5xl mx-auto px-4">
                         <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                              <h2 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
                                   Development Timeline
                              </h2>
                              <p className="text-muted-foreground">
                                   A history of the architectural layout iterations.
                              </p>
                         </div>

                         <div className="relative border-l-2 border-indigo-500/30 ml-4 md:ml-32 space-y-12">
                              {milestones.map((ms) => (
                                   <div key={ms.year} className="relative pl-8 md:pl-12">
                                        <span className="absolute -left-[9px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-950" />
                                        <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-8">
                                             <span className="text-sm font-black text-indigo-500 md:-ml-40 md:w-28 md:text-right shrink-0">
                                                  {ms.year}
                                             </span>
                                             <div>
                                                  <h4 className="font-bold text-foreground text-base mb-1 tracking-tight">{ms.title}</h4>
                                                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                                                       {ms.description}
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </section>

               {/* CTA */}
               <section className="py-16 bg-neutral-950 text-white border-t">
                    <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                         <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                              Build Your Product with StarterApp
                         </h2>
                         <p className="text-neutral-400 text-sm max-w-md mx-auto">
                              Clone the repository and launch your custom database services immediately.
                         </p>
                         <Button asChild size="lg" className="rounded-xl px-8 font-bold bg-indigo-600 hover:bg-indigo-700">
                              <Link href="/signup">Get Started Now</Link>
                         </Button>
                    </div>
               </section>
          </main>
     );
}
