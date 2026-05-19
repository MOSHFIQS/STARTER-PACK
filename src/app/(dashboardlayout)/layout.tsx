"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";
import AdminLayout from "../AdminLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedDashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  // Authentication guard: redirect to sign-in page if no active session token is present
  useEffect(() => {
    if (!token) {
      router.replace("/signin");
    }
  }, [token, router]);

  // Prevent flashing private page fragments to unauthenticated guests during redirect transitions
  if (!token) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
