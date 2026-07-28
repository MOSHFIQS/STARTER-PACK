"use client";

import { KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { Button } from "@/components/ui/button";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/useAuth";
import { extractErrorMessage } from "@/lib/utils";

export default function ProfilePage() {
     return (
          <ProtectedRoute>
               <ProfileContent />
          </ProtectedRoute>
     );
}

function ProfileContent() {
     const { changePassword } = useAuth();

     // All password fields are always strings — keeps inputs controlled.
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
          <div className="space-y-6">
               <div className="p-4 md:p-6">
                    <PageHeader
                         title="My Profile"
                         description="Manage your account information and security"
                    />
               </div>

               <ProfileEditor showHeader={false} />

               {/* Security / change password */}
               <div className="px-4 pb-8 md:px-6">
                    <Card className="mx-auto max-w-xl">
                         <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                   <ShieldCheck className="size-5" />
                                   Security
                              </CardTitle>
                              <CardDescription>Update your account password</CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                   <Label htmlFor="currentPassword">Current password</Label>
                                   <Input
                                        id="currentPassword"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                   />
                              </div>
                              <div className="space-y-2">
                                   <Label htmlFor="newPassword">New password</Label>
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
                                   <Label htmlFor="confirmPassword">Confirm new password</Label>
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
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                   ) : (
                                        <KeyRound className="mr-2 size-4" />
                                   )}
                                   Change Password
                              </Button>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
