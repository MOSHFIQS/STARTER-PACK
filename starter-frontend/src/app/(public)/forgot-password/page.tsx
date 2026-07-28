"use client";
import { authApi } from "@/redux/api/authApi";
import { store } from "@/redux/store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
     const [email, setEmail] = useState("");
     const [sent, setSent] = useState(false);
     const [isPending, startTransition] = useTransition();

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          startTransition(async () => {
               try {
                    await store.dispatch(authApi.endpoints.forgotPassword.initiate({ email: email })).unwrap();
                    setSent(true);
                    toast.success("Password reset OTP sent to your email");
               } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : "Failed to send reset email";
                    toast.error(msg);
               }
          });
     };

     return (
          <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center p-6 md:p-10">
               <div className="w-full max-w-sm">
                    <Card>
                         <CardHeader>
                              <CardTitle className="text-2xl">Forgot Password</CardTitle>
                              <CardDescription>
                                   Enter your email address and we'll send you an OTP to reset your password.
                              </CardDescription>
                         </CardHeader>
                         <CardContent>
                              {sent ? (
                                   <div className="space-y-4 text-center">
                                        <p className="text-sm text-muted-foreground">
                                             We've sent a password reset OTP to <strong>{email}</strong>. Please check
                                             your email and use the OTP to reset your password.
                                        </p>
                                        <Button asChild variant="outline" className="w-full">
                                             <Link href="/reset-password">
                                                  <ArrowLeft className="mr-2 h-4 w-4" />
                                                  Reset Password
                                             </Link>
                                        </Button>
                                   </div>
                              ) : (
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
                                             <Button type="submit" className="w-full" disabled={isPending}>
                                                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                  {isPending ? "Sending..." : "Send Reset OTP"}
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
                              )}
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
