"use client";

import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { BRAND_CONFIG } from "@/config/brand";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  // Format Pathnames to capitalize segments beautifully
  const getBreadcrumbLabel = () => {
    if (pathname === "/dashboard") return "Overview";
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Home";
    return segments[segments.length - 1].replace(/^./, (c) => c.toUpperCase());
  };

  return (
    <SidebarProvider>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="flex min-h-screen w-full bg-background text-foreground transition-colors duration-200">
        {/* Core Side Navigation */}
        <AppSidebar />

        {/* Primary Page Layout Panel */}
        <main className="flex-1 flex flex-col w-full min-w-0">
          {/* Dashboard Premium Top Header */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 sticky top-0 bg-background/95 backdrop-blur z-20 transition-all select-none">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 h-9 w-9" />
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <span className="text-muted-foreground text-xs font-semibold">{BRAND_CONFIG.name}</span>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-foreground text-xs font-bold font-mono">
                      {getBreadcrumbLabel()}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Quick Actions Header Tools */}
            <div className="flex items-center gap-3">
              {/* Role Permissions Metadata Badge */}
              {user && (
                <span className="hidden md:inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary select-none font-mono">
                  {user.role}
                </span>
              )}
              
              {/* Client Theme Switcher */}
              <ThemeToggle />
            </div>
          </header>

          {/* Primary Viewport Contents */}
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
