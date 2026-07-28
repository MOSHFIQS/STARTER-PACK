"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/redux/store";
import { ReactNode } from "react";

interface AuthInitializerProps {
     children: ReactNode;
     skeleton?: ReactNode;
}

/**
 * AuthInitializer shows a skeleton loader while the app checks
 * authentication status on startup (isLoading === true).
 *
 * This prevents UI blinking where the login page briefly flashes
 * before redirecting, or dashboard shows "no data" before user loads.
 *
 * Usage: Wrap protected route layouts with this component.
 */
export function AuthInitializer({
     children,
     skeleton,
}: AuthInitializerProps) {
     const isLoading = useAppSelector((state) => state.auth.isLoading);

     if (isLoading) {
          return skeleton ?? <DashboardSkeleton />;
     }

     return <>{children}</>;
}

/**
 * Default dashboard skeleton — mimics the layout structure
 * with sidebar, navbar, and content areas.
 */
function DashboardSkeleton() {
     return (
          <div className="flex min-h-screen">
               {/* Sidebar Skeleton */}
               <div className="hidden md:flex w-64 flex-col border-r bg-background p-4 gap-4">
                    <div className="flex items-center gap-2 px-2">
                         <Skeleton className="h-8 w-8 rounded-full" />
                         <Skeleton className="h-5 w-28" />
                    </div>
                    <div className="px-2">
                         <Skeleton className="h-4 w-20" />
                    </div>
                    {Array.from({ length: 4 }).map((_, i) => (
                         <div key={i} className="space-y-2 px-2">
                              <Skeleton className="h-4 w-16" />
                              <div className="space-y-1 pl-2">
                                   {Array.from({ length: 3 }).map((_, j) => (
                                        <Skeleton key={j} className="h-8 w-full" />
                                   ))}
                              </div>
                         </div>
                    ))}
               </div>

               {/* Main Content */}
               <div className="flex-1 flex flex-col">
                    {/* Navbar Skeleton */}
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                         <Skeleton className="h-6 w-6" />
                         <Skeleton className="h-6 w-6" />
                         <div className="flex-1" />
                         <Skeleton className="h-8 w-8 rounded-full" />
                    </header>

                    {/* Content Skeleton */}
                    <div className="flex-1 p-6 space-y-6">
                         {/* Header */}
                         <div className="space-y-2">
                              <Skeleton className="h-8 w-48" />
                              <Skeleton className="h-4 w-64" />
                         </div>

                         {/* Stats Cards */}
                         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                              {Array.from({ length: 6 }).map((_, i) => (
                                   <div key={i} className="rounded-lg border p-6 space-y-3">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-8 w-16" />
                                   </div>
                              ))}
                         </div>

                         {/* Table / Card Area */}
                         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {Array.from({ length: 3 }).map((_, i) => (
                                   <div key={i} className="rounded-lg border p-6 space-y-3">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     );
}

/**
 * Minimal skeleton for inline use (e.g., inside login page redirect).
 */
export function MinimalAuthSkeleton() {
     return (
          <div className="flex min-h-svh items-center justify-center">
               <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-32" />
               </div>
          </div>
     );
}
