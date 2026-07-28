"use client";

import { ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/utils";


export default function CustomerChangePasswordPage() {
     return (
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
               <CustomerChangePasswordContent />
          </ProtectedRoute>
     );
}

function CustomerChangePasswordContent() {
     const { changePassword } = useAuth();

     const [currentPassword, setCurrentPassword] = useState("");
     const [newPassword, setNewPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");
     const [savingPassword, setSavingPassword] = useState(false);

     const handleChangePassword = async () => {
          if (!currentPassword || !newPassword || !confirmPassword) {
               toast.error("All password fields are required");
               return;
          }
          if (newPassword !== confirmPassword) {
               toast.error("New passwords do not match");
               return;
          }
          if (newPassword.length < 8) {
               toast.error("Password must be at least 8 characters");
               return;
          }
          setSavingPassword(true);
          try {
               await changePassword(currentPassword, newPassword);
               toast.success("Password changed successfully");
               setCurrentPassword("");
               setNewPassword("");
               setConfirmPassword("");
          } catch (err) {
               toast.error(extractErrorMessage(err, "Failed to change password"));
          } finally {
               setSavingPassword(false);
          }
     };

     return (
          <div className="space-y-6 p-6">
               <PageHeader
                    title="Change Password"
                    description="Update your account password to keep your account secure"
                    action={
                         <Button asChild variant="outline">
                              <Link href="/dashboard/profile">
                                   <ArrowLeft className="mr-2 h-4 w-4" />
                                   Back to Profile
                              </Link>
                         </Button>
                    }
               />

               <div className="mx-auto max-w-lg">
                    <Card>
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <KeyRound className="h-5 w-5" />
                                   Set a New Password
                              </CardTitle>
                              <CardDescription>
                                   Choose a strong password that you don't use elsewhere
                              </CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                   <Label htmlFor="currentPassword">Current Password</Label>
                                   <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                   />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="newPassword">New Password</Label>
                                   <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                   />
                                   <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                   <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                   />
                              </div>
                              <Button
                                   onClick={handleChangePassword}
                                   disabled={savingPassword}
                                   className="w-full"
                              >
                                   {savingPassword ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                   ) : (
                                        <KeyRound className="mr-2 h-4 w-4" />
                                   )}
                                   Change Password
                              </Button>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
