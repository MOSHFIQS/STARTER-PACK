"use client";

import { useAppSelector } from "@/redux/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Bell, Key, ShieldAlert, User, ShieldCheck, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function CustomerOverviewPage() {
     const { user } = useAppSelector((state) => state.auth);

     const displayName = useMemo(() => {
          if (user?.firstName || user?.lastName) {
               return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
          }
          return user?.email || "";
     }, [user]);

     const userInitials = useMemo(() => {
          if (displayName) {
               return displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          }
          return "U";
     }, [displayName]);

     return (
          <div className="space-y-6 p-4 md:p-6">
               <PageHeader 
                    title={`Welcome back, ${user?.firstName || 'User'}!`} 
                    description="Here is an overview of your account status and configuration options." 
               />

               {/* Profile Info Summary Cards */}
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <StatsCard
                         title="Account Status"
                         value={user?.status || "ACTIVE"}
                         icon={user?.status === "ACTIVE" ? <ShieldCheck className="size-5 text-emerald-500" /> : <ShieldAlert className="size-5 text-amber-500" />}
                         description="Standard user clearance"
                    />
                    <StatsCard
                         title="Member Since"
                         value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A"}
                         icon={<User className="size-5 text-indigo-500" />}
                         description="Registration date"
                    />
                    <StatsCard
                         title="Assigned Role"
                         value={user?.role || "CUSTOMER"}
                         icon={<Key className="size-5 text-violet-500" />}
                         description="Access level configuration"
                    />
               </div>

               <div className="grid gap-6 md:grid-cols-3">
                    {/* User Profile Card */}
                    <Card className="md:col-span-2 rounded-3xl border-border shadow-sm overflow-hidden bg-card">
                         <CardHeader className="pb-4 border-b">
                              <CardTitle className="text-base font-bold">Profile Overview</CardTitle>
                              <CardDescription>Your registered details</CardDescription>
                         </CardHeader>
                         <CardContent className="pt-6 space-y-6">
                              <div className="flex flex-col sm:flex-row items-center gap-6">
                                   <div className="size-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
                                        {userInitials}
                                   </div>
                                   <div className="text-center sm:text-left space-y-1">
                                        <h3 className="text-lg font-bold text-foreground">{displayName}</h3>
                                        <p className="text-sm text-muted-foreground capitalize">{user?.role?.toLowerCase().replace("_", " ")} clearance</p>
                                        {user?.bio && <p className="text-sm text-muted-foreground italic max-w-md pt-1">"{user.bio}"</p>}
                                   </div>
                              </div>

                              <div className="grid gap-4 sm:grid-cols-2 pt-2 text-sm">
                                   <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-muted/30">
                                        <Mail className="size-4.5 text-muted-foreground shrink-0" />
                                        <div className="min-w-0">
                                             <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</p>
                                             <p className="font-semibold text-foreground truncate">{user?.email}</p>
                                        </div>
                                   </div>
                                   <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-muted/30">
                                        <MapPin className="size-4.5 text-muted-foreground shrink-0" />
                                        <div className="min-w-0">
                                             <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Location</p>
                                             <p className="font-semibold text-foreground truncate">
                                                  {[user?.city, user?.country].filter(Boolean).join(", ") || "Not Specified"}
                                              </p>
                                        </div>
                                    </div>
                              </div>
                         </CardContent>
                    </Card>

                    {/* Quick Links Card */}
                    <Card className="rounded-3xl border-border shadow-sm bg-card">
                         <CardHeader className="pb-4 border-b">
                              <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
                              <CardDescription>Configure account settings</CardDescription>
                         </CardHeader>
                         <CardContent className="pt-6 space-y-3">
                              <Button asChild variant="outline" className="w-full justify-start gap-3 rounded-2xl h-12 border-border hover:bg-muted font-bold text-foreground">
                                   <Link href="/dashboard/profile">
                                        <User className="size-4 text-muted-foreground" />
                                        Update Details
                                   </Link>
                              </Button>
                              <Button asChild variant="outline" className="w-full justify-start gap-3 rounded-2xl h-12 border-border hover:bg-muted font-bold text-foreground">
                                   <Link href="/dashboard/change-password">
                                        <Key className="size-4 text-muted-foreground" />
                                        Change Password
                                   </Link>
                              </Button>
                              <Button asChild variant="outline" className="w-full justify-start gap-3 rounded-2xl h-12 border-border hover:bg-muted font-bold text-foreground">
                                   <Link href="/dashboard/notifications">
                                        <Bell className="size-4 text-muted-foreground" />
                                        Notifications
                                   </Link>
                              </Button>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
