"use client";
import { authApi } from "@/redux/api/authApi";
import { store } from "@/redux/store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
     const router = useRouter();
     const [email, setEmail] = useState("");
     const [otp, setOtp] = useState("");
     const [newPassword, setNewPassword] = useState("");
     const [confirmPassword, setConfirmPassword] = useState("");
     const [isPending, startTransition] = useTransition();

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (newPassword.length < 6) {
               toast.error("Password must be at least 6 characters");
               return;
          }

          if (newPassword !== confirmPassword) {
               toast.error("Passwords do not match");
               return;
          }

          startTransition(async () => {
               try {
                    await store.dispatch(authApi.endpoints.resetPassword.initiate({ email: email, otp: otp, newPassword: newPassword })).unwrap();
                    toast.success("Password reset successfully! Please log in.");
                    router.push("/login");
               } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : "Failed to reset password";
                    toast.error(msg);
               }
          });
     };

     return (
          <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
               <div className="w-full max-w-sm">
                    <Card>
                         <CardHeader>
                              <CardTitle className="text-2xl">Reset Password</CardTitle>
                              <CardDescription>
                                   Enter the OTP sent to your email along with your new password.
                              </CardDescription>
                         </CardHeader>
                         <CardContent>
                              <form onSubmit={handleSubmit}>
                                   <div className="flex flex-col gap-4">
                                        <div className="grid gap-2">
                                             <Label htmlFor="email">Email</Label>
                                             <Input
                                                  id="email"
                                                  type="email"
                                                  placeholder="m@example.com"
                                                  value={email}
                                                  onChange={(e) => setEmail(e.target.value)}
                                                  required
                                             />
                                        </div>
                                        <div className="grid gap-2">
                                             <Label htmlFor="otp">OTP Code</Label>
                                             <Input
                                                  id="otp"
                                                  type="text"
                                                  placeholder="Enter 6-digit OTP"
                                                  value={otp}
                                                  onChange={(e) => setOtp(e.target.value)}
                                                  required
                                             />
                                        </div>
                                        <div className="grid gap-2">
                                             <Label htmlFor="newPassword">New Password</Label>
                                             <Input
                                                  id="newPassword"
                                                  type="password"
                                                  placeholder="At least 6 characters"
                                                  value={newPassword}
                                                  onChange={(e) => setNewPassword(e.target.value)}
                                                  required
                                             />
                                        </div>
                                        <div className="grid gap-2">
                                             <Label htmlFor="confirmPassword">Confirm Password</Label>
                                             <Input
                                                  id="confirmPassword"
                                                  type="password"
                                                  placeholder="Re-enter new password"
                                                  value={confirmPassword}
                                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                                  required
                                             />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isPending}>
                                             {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                             {isPending ? "Resetting..." : "Reset Password"}
                                        </Button>
                                        <div className="text-center">
                                             <Link
                                                  href="/login"
                                                  className="text-sm text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1"
                                             >
                                                  <ArrowLeft className="h-3 w-3" />
                                                  Back to login
                                             </Link>
                                        </div>
                                   </div>
                              </form>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
