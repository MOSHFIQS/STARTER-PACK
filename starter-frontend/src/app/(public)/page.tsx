"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
     ArrowRight,
     Cpu,
     Database,
     FileText,
     LayoutDashboard,
     Lock,
     Shield,
     Layers,
     Sparkles,
     Code2,
     Server,
     Smartphone,
     Flame,
     CheckCircle,
     Users,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardRoute } from "@/lib/roleRoutes";

export default function LandingPage() {
     const { user } = useAuth();
     const dashboardUrl = getDashboardRoute(user?.role ?? null);

     return (
          <div className="flex flex-col min-h-screen bg-slate-50/50">
               {/* Hero Section */}
               <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-br from-indigo-50 via-white to-sky-50/60">
                    <div className="absolute inset-0 bg-[grid-fade] opacity-5 select-none pointer-events-none" />
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                         <div className="mx-auto max-w-3xl animate-fade-in-up space-y-8">
                              <Badge variant="secondary" className="gap-1.5 px-3 py-1 rounded-full text-indigo-700 bg-indigo-50 border border-indigo-100/80 shadow-sm text-xs font-semibold">
                                   <Sparkles className="size-3.5 fill-indigo-100" />
                                   Enterprise-Grade Full-Stack Template
                              </Badge>
                              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                                   Launch Your Next SaaS App in{" "}
                                   <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                                        Record Time
                                    </span>
                              </h1>
                              <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl">
                                   A fully-configured starter boilerplate featuring Next.js 15, NestJS, Prisma, Redux Toolkit, and a role-ready dashboard layout. Stop coding auth and layout from scratch.
                              </p>
                              <div className="flex flex-wrap justify-center gap-4 pt-4">
                                   {user?.id ? (
                                        <Button asChild size="lg" className="rounded-2xl px-8 font-bold shadow-md bg-indigo-600 hover:bg-indigo-700">
                                             <Link href={dashboardUrl} className="flex items-center gap-1.5">
                                                  Go to Dashboard
                                                  <ArrowRight className="size-5" />
                                             </Link>
                                        </Button>
                                   ) : (
                                        <>
                                             <Button asChild size="lg" className="rounded-2xl px-8 font-bold shadow-md bg-indigo-600 hover:bg-indigo-700">
                                                  <Link href="/signup" className="flex items-center gap-1.5">
                                                       Get Started
                                                       <ArrowRight className="size-5" />
                                                  </Link>
                                             </Button>
                                             <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 font-bold bg-card text-foreground border-border hover:bg-muted">
                                                  <Link href="/login">Sign In</Link>
                                             </Button>
                                        </>
                                   )}
                              </div>
                         </div>
                    </div>
               </section>

               {/* Core Tech Stack Section */}
               <section className="py-20 bg-background border-y border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                         <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                              <h2 className="text-3xl font-bold text-foreground tracking-tight sm:text-4xl">
                                   Built with Modern Technologies
                              </h2>
                              <p className="text-muted-foreground">
                                   A robust and reliable stack optimized for developer experience, security, and scalability.
                              </p>
                         </div>

                         <div className="grid gap-8 md:grid-cols-3">
                              <Card className="rounded-3xl border-border bg-card hover:shadow-md transition-shadow duration-300">
                                   <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                                             <Code2 className="size-6" />
                                        </div>
                                        <div>
                                             <CardTitle className="text-lg text-foreground">Frontend (Next.js)</CardTitle>
                                             <CardDescription>TypeScript & App Router</CardDescription>
                                        </div>
                                   </CardHeader>
                                   <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                        Fully modular layout, Tailwind CSS, shadcn/ui components, custom hooks, global loaders, theme system, dynamic layouts, and protected/public routing.
                                   </CardContent>
                              </Card>

                              <Card className="rounded-3xl border-border bg-card hover:shadow-md transition-shadow duration-300">
                                   <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl">
                                             <Server className="size-6" />
                                        </div>
                                        <div>
                                             <CardTitle className="text-lg text-foreground">Backend (NestJS)</CardTitle>
                                             <CardDescription>Modular Architecture</CardDescription>
                                        </div>
                                   </CardHeader>
                                   <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                        JWT auth guards, role-based decorators, global exception filters, request logger, configuration module, input validations, Swagger docs, and exception handling.
                                   </CardContent>
                              </Card>

                              <Card className="rounded-3xl border-border bg-card hover:shadow-md transition-shadow duration-300">
                                   <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                             <Database className="size-6" />
                                        </div>
                                        <div>
                                             <CardTitle className="text-lg text-foreground">Database & Auth</CardTitle>
                                             <CardDescription>Prisma ORM & JWT</CardDescription>
                                        </div>
                                   </CardHeader>
                                   <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                        PostgreSQL database integration with Prisma client, automated schema seed scripts, token validation guards, and full audit logs tracking system actions.
                                   </CardContent>
                              </Card>
                         </div>
                    </div>
               </section>

               {/* Features Section */}
               <section className="py-20 bg-muted/30 border-y border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                         <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                              <Badge variant="outline" className="px-3 py-1 rounded-full text-indigo-500 border-indigo-500/30 font-bold text-[10px] uppercase tracking-wider bg-card">
                                   Features List
                              </Badge>
                              <h2 className="text-3xl font-bold text-foreground tracking-tight sm:text-4xl">
                                   Out-Of-The-Box Infrastructure
                              </h2>
                              <p className="text-muted-foreground">
                                   Save weeks of work. All basic features are configured and fully integrated.
                              </p>
                         </div>

                         <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                              <div className="flex gap-4">
                                   <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                        <Lock className="size-5" />
                                   </div>
                                   <div className="space-y-1.5">
                                        <h4 className="font-bold text-foreground">Advanced Authentication</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Sign In, Sign Up, JWT handling, change password, profile updates, and cookies token logic.</p>
                                   </div>
                              </div>

                              <div className="flex gap-4">
                                   <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                        <LayoutDashboard className="size-5" />
                                   </div>
                                   <div className="space-y-1.5">
                                        <h4 className="font-bold text-foreground">Role-Based Sidebars</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Parallel slots layout optimized to render views dynamically based on Admin, Super Admin, and Customer roles.</p>
                                   </div>
                              </div>

                              <div className="flex gap-4">
                                   <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                        <Users className="size-5" />
                                   </div>
                                   <div className="space-y-1.5">
                                        <h4 className="font-bold text-foreground">User Management</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Full user CRUD operations, role selection, status activation toggle, and secure validations.</p>
                                   </div>
                              </div>

                              <div className="flex gap-4">
                                   <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                        <Cpu className="size-5" />
                                   </div>
                                   <div className="space-y-1.5">
                                        <h4 className="font-bold text-foreground">Redux Toolkit Integration</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Fully structured global store, api caching policies, and hook queries to maintain absolute sync with NestJS.</p>
                                   </div>
                              </div>

                              <div className="flex gap-4">
                                   <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                        <Shield className="size-5" />
                                   </div>
                                   <div className="space-y-1.5">
                                        <h4 className="font-bold text-foreground">System Audit Logs</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Keeps track of important administrative modifications, logins, and settings updates in a filterable table.</p>
                                   </div>
                              </div>

                              <div className="flex gap-4">
                                   <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                        <Layers className="size-5" />
                                   </div>
                                   <div className="space-y-1.5">
                                        <h4 className="font-bold text-foreground">Cloudinary File Uploads</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">Generic service with multi-upload, file validations, and folder mapping configured for easy storage usage.</p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </section>

               {/* CTA Section */}
               <section className="py-20 bg-indigo-600 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none select-none" />
                    <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in">
                         <Flame className="size-12 mx-auto text-amber-300 animate-bounce" />
                         <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                              Ready to build your application?
                         </h2>
                         <p className="mx-auto max-w-xl text-indigo-100 text-base sm:text-lg">
                              Download this starter template, configure your PostgreSQL database credentials, and start adding your business-specific logic immediately.
                         </p>
                         <div className="flex justify-center">
                              {user?.id ? (
                                   <Button asChild size="lg" className="rounded-2xl px-10 font-bold bg-white text-indigo-600 hover:bg-neutral-50 shadow-lg">
                                        <Link href={dashboardUrl}>Go to Dashboard</Link>
                                   </Button>
                              ) : (
                                   <Button asChild size="lg" className="rounded-2xl px-10 font-bold bg-white text-indigo-600 hover:bg-neutral-50 shadow-lg">
                                        <Link href="/signup">Register Now</Link>
                                   </Button>
                              )}
                         </div>
                    </div>
               </section>

               {/* Footer */}
               <footer className="py-12 bg-card border-t border-border">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
                         <div className="flex justify-center items-center gap-2 font-black text-foreground">
                              <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs">S</div>
                              StarterApp Template
                         </div>
                         <p className="text-xs text-muted-foreground">
                              &copy; {new Date().getFullYear()} StarterApp. All rights reserved. Clean, robust Full-Stack boilerplate.
                         </p>
                    </div>
               </footer>
          </div>
     );
}
