"use client";

import { dashboardApi } from "@/redux/api/dashboardApi";
import { store } from "@/redux/store";
import { ChartCard, DonutChart, RadialChart } from "@/components/charts/dashboard-charts";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoadingCard } from "@/components/shared/LoadingStates";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/shared/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/constants/roles";
import { formatDate } from "@/lib/utils";
import type { AdminOverview, UserStats } from "@/types";
import type { User } from "@/types/user.types";
import {
     AlertCircle,
     Users,
     Shield,
     UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuperadminOverviewPage() {
     return (
          <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
               <SuperadminOverviewContent />
          </ProtectedRoute>
     );
}

function SuperadminOverviewContent() {
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [overview, setOverview] = useState<AdminOverview | null>(null);
     const [userStats, setUserStats] = useState<UserStats | null>(null);
     const [recentUsers, setRecentUsers] = useState<User[]>([]);

     useEffect(() => {
          const fetchOverview = async () => {
               try {
                    setLoading(true);
                    setError(null);
                    const [overviewData, statsData, recentData] = await Promise.all([
                         store.dispatch(dashboardApi.endpoints.getAdminOverview.initiate()).unwrap(),
                         store.dispatch(dashboardApi.endpoints.getAdminUsers.initiate()).unwrap(),
                         store.dispatch(dashboardApi.endpoints.getRecentUsers.initiate(5)).unwrap(),
                    ]);
                    setOverview(overviewData);
                    setUserStats(statsData);
                    setRecentUsers(recentData || []);
               } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : "Failed to load dashboard data.";
                    setError(message);
               } finally {
                    setLoading(false);
               }
          };
          fetchOverview();
     }, []);

     const counts = overview?.counts;

     return (
          <div className="space-y-6 p-4 md:p-6">
               <PageHeader
                    title="Super Admin Dashboard"
                    description="Full system overview and platform-wide user analytics"
               />

               {error ? (
                    <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                         <AlertCircle className="size-4 shrink-0" />
                         {error}
                    </div>
               ) : null}

               {/* Stat cards */}
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {loading ? (
                         Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
                    ) : (
                         <>
                              <StatsCard
                                   title="Total Users"
                                   value={(counts?.users ?? 0).toLocaleString()}
                                   icon={<Users className="size-5" />}
                                   description={`${counts?.customers ?? 0} customers`}
                              />
                              <StatsCard
                                   title="Active Accounts"
                                   value={(userStats?.active ?? 0).toLocaleString()}
                                   icon={<UserCheck className="size-5 text-emerald-500" />}
                                   description={`${userStats?.inactive ?? 0} inactive`}
                              />
                              <StatsCard
                                   title="Administrators"
                                   value={(counts?.admins ?? 0).toLocaleString()}
                                   icon={<Shield className="size-5 text-indigo-500" />}
                                   description="Standard administrators"
                              />
                              <StatsCard
                                   title="Super Admins"
                                   value={(counts?.superAdmins ?? 0).toLocaleString()}
                                   icon={<Shield className="size-5 text-violet-500" />}
                                   description="Full system control"
                              />
                         </>
                    )}
               </div>

               {/* Charts row */}
               <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard title="User Roles" description="Distribution by role">
                         {loading ? (
                              <div className="h-[220px] animate-pulse rounded-lg bg-muted/40" />
                         ) : (
                              <DonutChart
                                   data={[
                                        { label: "Customers", value: userStats?.customers ?? 0 },
                                        { label: "Admins", value: userStats?.admins ?? 0 },
                                        { label: "Super Admins", value: userStats?.superAdmins ?? 0 },
                                   ]}
                                   centerLabel="Total"
                                   centerValue={userStats?.total ?? 0}
                              />
                         )}
                    </ChartCard>

                    <ChartCard title="Active Users" description="Active vs inactive accounts">
                         {loading ? (
                              <div className="h-[220px] animate-pulse rounded-lg bg-muted/40" />
                         ) : (
                              <div className="flex h-[220px] items-center justify-center">
                                   <RadialChart
                                        value={userStats?.active ?? 0}
                                        max={userStats?.total ?? 0}
                                        label="Active accounts"
                                        color="hsl(142 71% 45%)"
                                   />
                              </div>
                         )}
                    </ChartCard>
               </div>

               {/* Recent users */}
               <Card className="rounded-3xl border-border bg-card shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                         <CardTitle className="text-base font-bold">Recent Registrations</CardTitle>
                         <Button asChild variant="ghost" size="sm" className="rounded-xl">
                              <Link href="/dashboard/users">View all</Link>
                         </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                         {loading ? (
                              <p className="py-8 text-center text-sm text-muted-foreground">Loading registrations...</p>
                         ) : recentUsers.length ? (
                              recentUsers.map((user) => (
                                   <div
                                        key={user.id}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4 bg-card hover:bg-muted/50 transition-colors duration-300"
                                   >
                                        <div className="min-w-0 space-y-0.5">
                                             <p className="truncate text-sm font-semibold text-foreground">
                                                  {user.fullName || user.email}
                                             </p>
                                             <p className="truncate text-xs text-muted-foreground">
                                                  {user.email} • {formatDate(user.createdAt)}
                                             </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <StatusBadge value={user.role} />
                                             <StatusBadge value={user.status} />
                                        </div>
                                   </div>
                              ))
                         ) : (
                              <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
                                   <Users className="size-8 text-muted-foreground/30" />
                                   <p className="text-sm">No recent users.</p>
                              </div>
                         )}
                    </CardContent>
               </Card>
          </div>
     );
}
