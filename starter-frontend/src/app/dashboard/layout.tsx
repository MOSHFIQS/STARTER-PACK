"use client";
import { notificationApi } from "@/redux/api/notificationApi";
import { store } from "@/redux/store";

import { AppSidebar } from "@/components/app-sidebar";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
     SidebarInset,
     SidebarProvider,
     SidebarTrigger,
} from "@/components/ui/sidebar";
import { ROLES } from "@/constants/roles";
import { useAuth } from "@/hooks/useAuth";


import { useAppSelector } from "@/redux/store";
import type { AppNotification } from "@/types";
import { Bell, CheckCheck, Home, LayoutDashboard, LogOut, UserRound, Sun, Moon, Search, Mail, Settings } from "lucide-react";
import Link from "next/link";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { cn, getInitials } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";

function ThemeToggleSwitch() {
     const { theme, setTheme } = useTheme();
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     if (!mounted) {
          return <div className="w-[84px] h-5 bg-muted/40 animate-pulse rounded-full" />;
     }

     const isDark = theme === "dark";

     return (
          <div className="flex items-center gap-1 sm:gap-2 select-none">
               <Sun className={cn("hidden sm:block size-4 transition-colors", !isDark ? "text-amber-500" : "text-muted-foreground/60")} />
               <button
                    type="button"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-slate-200 dark:bg-zinc-800 transition-colors focus:outline-none"
                    aria-label="Toggle Theme"
               >
                    <span
                         className={cn(
                              "pointer-events-none block h-4 w-4 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-md ring-0 transition-transform duration-200",
                              isDark ? "translate-x-4.5" : "translate-x-0.5"
                         )}
                    />
               </button>
               <Moon className={cn("hidden sm:block size-4 transition-colors", isDark ? "text-indigo-400" : "text-muted-foreground/60")} />
          </div>
     );
}

function DashboardNotifications() {
     const [mounted, setMounted] = useState(false);
     const [notifications, setNotifications] = useState<AppNotification[]>([]);
     const [unread, setUnread] = useState(0);
     const [loading, setLoading] = useState(false);

     const loadNotifications = useCallback(async () => {
          setLoading(true);
          try {
               const data = await store.dispatch(notificationApi.endpoints.getNotifications.initiate({ limit: 5 }, { forceRefetch: true })).unwrap();
               setNotifications(data.data || []);
               const unreadData = await store.dispatch(notificationApi.endpoints.getUnreadCount.initiate(undefined, { forceRefetch: true })).unwrap();
               setUnread(unreadData.count || 0);
          } catch {
               setNotifications([]);
               setUnread(0);
          } finally {
               setLoading(false);
          }
     }, []);

     useEffect(() => {
          setMounted(true);
          loadNotifications();
     }, [loadNotifications]);

     const markRead = async (notification: AppNotification) => {
          if (!notification.isRead) {
               await store.dispatch(notificationApi.endpoints.markNotificationAsRead.initiate(notification.id)).unwrap();
          }
          await loadNotifications();
     };

     const markAllRead = async () => {
          if (!unread) return;
          await store.dispatch(notificationApi.endpoints.markAllNotificationsAsRead.initiate()).unwrap();
          await loadNotifications();
     };

     if (!mounted) {
          return (
               <button className="relative p-2 text-muted-foreground/40 rounded-full" aria-label="Open notifications" disabled>
                    <Bell className="size-5" />
               </button>
          );
     }

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-all duration-300" aria-label="Open notifications">
                         <Bell className="size-5" />
                         {unread > 0 ? (
                              <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#E5D9F2] px-1 text-[9px] font-black text-[#7F27FF] dark:bg-violet-950 dark:text-violet-300">
                                   {unread > 9 ? "9+" : unread}
                              </span>
                         ) : null}
                    </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                         <DropdownMenuLabel className="p-0 text-sm font-semibold">Notifications</DropdownMenuLabel>
                         <Button variant="ghost" size="sm" onClick={markAllRead} disabled={!unread} className="h-7 text-xs">
                              <CheckCheck className="size-3" />
                              Read all
                         </Button>
                    </div>
                    <DropdownMenuSeparator className="m-0" />
                    {loading ? (
                         <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                              Loading notifications...
                         </div>
                    ) : notifications.length ? (
                         notifications.map((notification) => (
                              <DropdownMenuItem
                                   key={notification.id}
                                   className="flex cursor-pointer flex-col items-start gap-1 whitespace-normal rounded-none px-3 py-2.5"
                                   onSelect={(event) => {
                                        event.preventDefault();
                                        markRead(notification);
                                   }}
                              >
                                   <div className="flex w-full items-start justify-between gap-2">
                                        <span className="text-sm font-medium">{notification.title}</span>
                                        {!notification.isRead ? (
                                             <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                                        ) : null}
                                   </div>
                                   <span className="line-clamp-2 text-xs text-muted-foreground">
                                        {notification.message}
                                   </span>
                                   <span className="text-[11px] text-muted-foreground/70">
                                        {new Date(notification.createdAt).toLocaleString()}
                                   </span>
                              </DropdownMenuItem>
                         ))
                    ) : (
                         <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                              No notifications yet
                         </div>
                    )}
               </DropdownMenuContent>
          </DropdownMenu>
     );
}

export default function DashboardLayout({
     superadmin,
     admin,
     customer,
}: {
     superadmin: ReactNode;
     admin: ReactNode;
     customer: ReactNode;
}) {
     const { user } = useAppSelector((state) => state.auth);
     const { logout } = useAuth();
     const role = user?.role || ROLES.CUSTOMER;
     const dashboardPath = "/dashboard";
     const profilePath = `${dashboardPath}/profile`;

     const content =
          role === ROLES.SUPER_ADMIN
               ? superadmin
               : role === ROLES.ADMIN
                    ? admin
                    : customer;

     const displayName = useMemo(() => {
          if (user?.firstName || user?.lastName) {
               return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
          }
          return user?.email || "";
     }, [user]);

     const handleLogout = async () => {
          await logout();
     };

     return (
          <ProtectedRoute>
               <AuthInitializer>
                    <SidebarProvider>
                         <AppSidebar user={{ role, name: displayName }} />
                         <SidebarInset>
                              <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/80 px-3 md:px-6 backdrop-blur-md">
                                   <div className="flex items-center gap-1.5 md:gap-4 flex-1">
                                        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground size-8 md:size-9" />
                                        
                                        {/* Search Input Capsule - Collapses to circular icon button on mobile */}
                                        <div className="w-9 h-9 sm:w-[160px] md:w-[240px] lg:w-[280px] rounded-full border border-border bg-card relative flex items-center justify-center sm:justify-start transition-all duration-300 shadow-sm shrink-0">
                                             <Search className="absolute left-2.5 sm:left-3.5 size-4 text-muted-foreground/60" />
                                             <input
                                                  type="text"
                                                  placeholder="Search"
                                                  className="hidden sm:block w-full pl-10 pr-4 py-1.5 h-full rounded-full bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
                                             />
                                        </div>
                                   </div>
                                   
                                   <div className="flex items-center gap-1 md:gap-1.5">
                                        {/* Theme Switching Controls */}
                                        <div className="flex items-center">
                                             <ThemeToggleSwitch />
                                        </div>
                                        
                                        {/* Divider - hidden on mobile */}
                                        <div className="hidden sm:block h-5 w-px bg-border mx-1 md:mx-2" />
                                        
                                        {/* Navigation, Messaging, and Home Icons */}
                                        <Link href="/" className="p-1.5 md:p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-all duration-300 shrink-0" title="Go to Homepage">
                                             <Home className="size-4.5 md:size-5" />
                                        </Link>
                                        <DashboardNotifications />
                                        <Link href="/dashboard/notifications" className="p-1.5 md:p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-all duration-300 shrink-0" title="Messages">
                                             <Mail className="size-4.5 md:size-5" />
                                        </Link>
                                        
                                        {/* Divider - hidden on mobile */}
                                        <div className="hidden sm:block h-5 w-px bg-border mx-1 md:mx-2" />
                                        
                                        {/* User block & Settings */}
                                        <div className="flex items-center gap-1.5 md:gap-3">
                                             <div className="hidden md:flex flex-col items-end text-right">
                                                  <span className="text-sm font-bold text-foreground leading-none mb-0.5">{displayName}</span>
                                                  <div className="flex items-center gap-1">
                                                       <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                       <span className="text-[10px] font-medium text-muted-foreground">Online</span>
                                                  </div>
                                             </div>
                                             
                                             {/* Avatar circle */}
                                             <Link href={profilePath} className="hidden md:flex relative size-8 md:size-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/20 items-center justify-center font-bold text-xs md:text-sm shrink-0 transition-colors">
                                                  {getInitials(displayName)}
                                             </Link>
                                             
                                             {/* Circular Settings Gear Button */}
                                             <Link 
                                                  href="/dashboard/settings" 
                                                  className="hidden md:flex size-8 md:size-9 rounded-full border border-border items-center justify-center bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm shrink-0"
                                                  title="Settings"
                                             >
                                                  <Settings className="size-4 md:size-4.5" />
                                             </Link>
                                             
                                             {/* Logout button */}
                                             <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8 md:size-9 shrink-0" title="Logout">
                                                  <LogOut className="size-4 md:size-5" />
                                             </Button>
                                        </div>
                                   </div>
                              </header>
                              <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
                                   {content}
                              </div>
                         </SidebarInset>
                    </SidebarProvider>
               </AuthInitializer>
          </ProtectedRoute>
     );
}
