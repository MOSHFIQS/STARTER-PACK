"use client";

import React from "react";
import { useAppSelector } from "@/hooks/useRedux";
import { selectCurrentUser } from "@/redux/features/authSlice";

interface DashboardParallelLayoutProps {
  children: React.ReactNode;
  admin: React.ReactNode;
  more: React.ReactNode;
}

export default function DashboardParallelLayout({
  children,
  admin,
  more,
}: DashboardParallelLayoutProps) {
  const currentUser = useAppSelector(selectCurrentUser);

  // Parallel Routing decision logic based on verified user roles
  const isAdmin = currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "ADMIN";

  return (
    <div className="w-full">
      {children}
      {isAdmin ? admin : more}
    </div>
  );
}
