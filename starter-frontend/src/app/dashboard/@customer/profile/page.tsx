"use client";

import { KeyRound } from "lucide-react";
import Link from "next/link";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { Button } from "@/components/ui/button";

export default function CustomerProfilePage() {
     return (
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
               <ProfileEditor
                    headerAction={
                         <Button asChild variant="outline">
                              <Link href="/dashboard/change-password">
                                   <KeyRound className="mr-2 size-4" />
                                   Change Password
                              </Link>
                         </Button>
                    }
               />
          </ProtectedRoute>
     );
}
