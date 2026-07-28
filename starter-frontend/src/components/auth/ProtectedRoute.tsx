"use client"
import { getDashboardRoute } from "@/lib/roleRoutes";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ProtectedRouteProps {
     children: ReactNode;
     allowedRoles?: string[];
     fallback?: ReactNode;
}

/**
 * ProtectedRoute guards child content based on authentication and role.
 *
 * - If auth is still loading, renders nothing (use with AuthInitializer wrapper)
 * - If user is not authenticated, redirects to /login
 * - If allowedRoles is specified and user's role isn't included, redirects to dashboard
 * - Otherwise renders children
 */
export function ProtectedRoute({
     children,
     allowedRoles,
}: ProtectedRouteProps) {
     const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
     const router = useRouter();

     useEffect(() => {
          if (isLoading) return;

          if (!isAuthenticated) {
               router.replace('/login');
               return;
          }

          if (allowedRoles && user && !allowedRoles.includes(user.role)) {
               router.replace(getDashboardRoute(user.role));
          }
     }, [allowedRoles, isAuthenticated, isLoading, router, user]);

     // Still loading or redirecting — render nothing (AuthInitializer handles skeleton).
     if (isLoading || !isAuthenticated) return null;

     if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

     return <>{children}</>;
}
