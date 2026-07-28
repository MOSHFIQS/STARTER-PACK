"use client";

import {
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarGroup,
     SidebarGroupContent,
     SidebarHeader,
     SidebarMenu,
     SidebarMenuItem,
     SidebarMenuButton,
     SidebarRail,
} from "@/components/ui/sidebar";
import { ROLES } from "@/constants/roles";
import { adminRoutes } from "@/routes/adminRoutes";
import { customerRoutes } from "@/routes/customerRoutes";
import { superadminRoutes } from "@/routes/superadminRoutes";
import { Route } from "@/types/routes.type";
import { cn } from "@/lib/utils";
import {
     Bell,
     User,
     LayoutDashboard,
     Users,
     Activity,
     Settings,
     Lock,
     ChevronDown,
     Search,
     ChevronsUpDown,
     MoreVertical,
     LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<any>> = {
     "Overview": LayoutDashboard,
     "Profile": User,
     "Users": Users,
     "Audit Logs": Activity,
     "Settings": Settings,
     "Notifications": Bell,
     "Change Password": Lock
};

export function AppSidebar({
     user,
     ...props
}: { user: { role: string; name?: string } } & React.ComponentProps<typeof Sidebar>) {
     let routes: Route[] = [];
     const pathname = usePathname();

     switch (user.role) {
          case ROLES.SUPER_ADMIN:
               routes = superadminRoutes;
               break;
          case ROLES.ADMIN:
               routes = adminRoutes;
               break;
          case ROLES.CUSTOMER:
               routes = customerRoutes;
               break;
          default:
               routes = [];
               break;
     }

     const userInitials = user.name
          ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
          : "U";

     const { logout } = useAuth();
     const handleLogout = async () => {
          await logout();
     };

     return (
          <Sidebar className="border-r border-sidebar-border bg-sidebar" {...props}>
               {/* Header Area with Brand Selector and Search Bar */}
               <SidebarHeader className="p-4 space-y-4">
                    {/* Brand Selector Card */}
                    <div className="flex items-center gap-3 px-3 py-2.5 border border-sidebar-border bg-card hover:bg-sidebar-accent cursor-pointer transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-2xl select-none">
                         <div className="size-9 rounded-xl bg-gradient-to-tr from-orange-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-sm">
                              S
                         </div>
                         <div className="flex-1 text-left min-w-0">
                              <h2 className="text-xs font-black text-foreground tracking-tight truncate">StarterApp</h2>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SaaS Boilerplate</p>
                         </div>
                    </div>

                  
               </SidebarHeader>

               {/* Content Menu Area */}
               <SidebarContent className="px-3 py-2 space-y-5 overflow-y-auto">
                    {routes.map((item) => (
                         <SidebarGroup key={item.title} className="p-0 space-y-1.5">
                              {/* Group labels with clean size & tracking */}
                              <div className="flex items-center justify-between px-3 pt-3 pb-1 text-[10px] font-black text-muted-foreground/90 tracking-widest uppercase select-none">
                                   <span>{item.title}</span>
                                   <ChevronDown className="size-3.5 text-muted-foreground/70" />
                              </div>
                              <SidebarGroupContent className="p-0">
                                   <SidebarMenu className="space-y-1">
                                        {item.items.map((subItem) => {
                                             const isActive =
                                                  pathname === subItem.url ||
                                                  (subItem.url !== "/dashboard" && pathname.startsWith(subItem.url));
                                             const IconComponent = iconMap[subItem.title] || Settings;

                                             return (
                                                  <SidebarMenuItem key={subItem.title}>
                                                       <SidebarMenuButton
                                                            asChild
                                                            isActive={isActive}
                                                            size="lg"
                                                            className={cn(
                                                                 "flex items-center justify-between px-3 rounded-xl transition-all w-full text-[13.5px] hover:bg-sidebar-accent/50",
                                                                 isActive
                                                                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold shadow-[0_1px_2px_rgba(0,0,0,0.03)] border border-sidebar-border"
                                                                      : "font-semibold text-sidebar-foreground hover:text-sidebar-accent-foreground"
                                                            )}
                                                       >
                                                            <Link href={subItem.url} className="flex items-center justify-between w-full h-full">
                                                                 <div className="flex items-center gap-3">
                                                                      <IconComponent className={cn("size-4.5 shrink-0", isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70")} />
                                                                      <span>{subItem.title}</span>
                                                                 </div>
                                                            </Link>
                                                       </SidebarMenuButton>
                                                  </SidebarMenuItem>
                                             );
                                        })}
                                   </SidebarMenu>
                               </SidebarGroupContent>
                         </SidebarGroup>
                    ))}
               </SidebarContent>

                {/* Footer Area with Profile Card */}
                <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar">
                     <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 px-1 py-0.5 select-none">
                               <div className="size-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xs">
                                    {userInitials}
                               </div>
                               <div className="flex-1 text-left min-w-0">
                                    <h3 className="text-xs font-bold text-sidebar-foreground truncate">{user.name || "User Name"}</h3>
                                    <p className="text-[9px] font-bold text-muted-foreground capitalize truncate">
                                         {user.role?.toLowerCase().replace("_", " ")}
                                    </p>
                               </div>
                          </div>
                          <Button
                               onClick={handleLogout}
                               variant="outline"
                               size="sm"
                               className="w-full justify-center gap-2 rounded-xl h-9 border-sidebar-border hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-semibold text-xs transition-all"
                          >
                               <LogOut className="size-3.5" />
                               Logout
                          </Button>
                     </div>
                </SidebarFooter>
                <SidebarRail />
          </Sidebar>
     );
}
