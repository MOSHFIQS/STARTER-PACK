"use client";

import * as React from "react";
import {
  ShoppingCart,
  Package,
  Users,
  Layers,
  Settings,
  Shield,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/hooks/useRedux";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { BRAND_CONFIG } from "@/config/brand";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useAppSelector(selectCurrentUser);

  const sidebarUser = {
    name: currentUser?.name || "System Admin",
    email: currentUser?.email || BRAND_CONFIG.adminDefaultEmail,
    avatar: currentUser?.avatarUrl || BRAND_CONFIG.defaultAvatar,
  };

  const teams = [
    {
      name: BRAND_CONFIG.company,
      logo: LayoutDashboard,
      plan: "Enterprise Suite",
    },
  ];

  const mainNavigation = [
    { name: "Overview Board", url: "/dashboard", icon: LayoutDashboard },
  ];

  const administrationNavigation = [
    { name: "Roles & Policies", url: "/dashboard/roles", icon: Shield },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        {/* Main Section */}
        <NavProjects title="Dashboard" items={mainNavigation} />
        
        {/* Scalable settings and roles */}
        <NavProjects title="Administration" items={administrationNavigation} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
