"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardRoute } from "@/lib/roleRoutes";
import { useAppSelector } from "@/redux/store";
import { Loader2, Eye, EyeOff, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function LoginPage() {
     const { login } = useAuth();
     const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
     const router = useRouter();
     const [email, setEmail] = useState("");
     const [password, setPassword] = useState("");
     const [showPassword, setShowPassword] = useState(false);
     const [isPending, startTransition] = useTransition();
     const [error, setError] = useState("");

     // Redirect if already authenticated
     useEffect(() => {
          if (!isLoading && isAuthenticated && user) {
               router.push(getDashboardRoute(user.role));
          }
     }, [isLoading, isAuthenticated, user, router]);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setError("");
          startTransition(async () => {
               try {
                    await login(email, password);
                    toast.success("Login successful!");
               } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : "Invalid credentials";
                    setError(msg);
                    toast.error(msg);
               }
          });
     };

     return (
          <div className="min-h-[calc(100vh-4rem)] bg-background grid lg:grid-cols-2 p-4 md:p-6 lg:p-8 gap-8 items-center">
               {/* Left Column: Form Section */}
               <div className="max-w-md w-full mx-auto flex flex-col justify-center py-6">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2 mb-8 select-none">
                         <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
                              <Building2 className="size-5" />
                         </div>
                         <span className="text-xl font-black text-foreground tracking-tight">
                              StarterApp<span className="text-primary">.</span>
                         </span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                         <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight mb-3">
                              This is where incredible experiences start.
                         </h1>
                         <p className="text-sm text-muted-foreground leading-relaxed">
                              Welcome to StarterApp. Sign in to access your administrative and customer dashboard.
                         </p>
                    </div>

                    {/* Social Logins */}
                    <div className="flex items-center gap-4 mb-8">
                         <button type="button" className="border border-border hover:border-neutral-500/30 bg-card hover:bg-muted rounded-full size-12 flex items-center justify-center transition-all hover:scale-105 shadow-sm">
                              {/* Twitter/X icon */}
                              <svg className="size-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                                   <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                              </svg>
                         </button>
                         <button type="button" className="bg-[#4285F4] hover:bg-[#357ae8] text-white rounded-full size-12 flex items-center justify-center transition-all hover:scale-105 shadow-md shadow-[#4285F4]/20">
                              {/* Google icon */}
                              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                   <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.111 4.113-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.7 0 3.03.69 4.02 1.64l3.15-3.15C19.26 2.03 16.02 1 12.24 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.9 0 11.24-4.85 11.24-11.24 0-.76-.07-1.46-.2-2.14H12.24z" />
                              </svg>
                         </button>
                         <button type="button" className="border border-border hover:border-neutral-500/30 bg-card hover:bg-muted rounded-full size-12 flex items-center justify-center transition-all hover:scale-105 shadow-sm">
                              {/* Github icon */}
                              <svg className="size-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                                   <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                              </svg>
                         </button>
                    </div>

                    {/* Or Divider */}
                    <div className="relative flex items-center justify-center mb-8">
                         <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t border-border" />
                         </div>
                         <span className="relative bg-background px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                              Or
                         </span>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                         {/* Email Input */}
                         <div className="relative border border-border rounded-2xl px-4 py-2.5 bg-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
                              <label htmlFor="email" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                                   Email
                              </label>
                              <input
                                   id="email"
                                   type="email"
                                   placeholder="you@example.com"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="w-full text-sm font-semibold text-foreground bg-transparent outline-none border-none p-0 focus:ring-0"
                                   required
                              />
                         </div>

                         {/* Password Input */}
                         <div className="relative border border-border rounded-2xl px-4 py-2.5 bg-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm flex items-center justify-between">
                              <div className="flex-1">
                                   <div className="flex items-center justify-between pr-2">
                                        <label htmlFor="password" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                                             Password
                                        </label>
                                        <Link href="/forgot-password" className="text-[10px] font-semibold text-muted-foreground transition-colors hover:text-primary">
                                             Forgot password?
                                        </Link>
                                   </div>
                                   <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full text-sm font-semibold text-foreground bg-transparent outline-none border-none p-0 focus:ring-0"
                                        required
                                   />
                              </div>
                              <button
                                   type="button"
                                   onClick={() => setShowPassword(!showPassword)}
                                   className="text-muted-foreground hover:text-foreground p-1"
                              >
                                   {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </button>
                         </div>

                         {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                         <Button type="submit" className="w-full rounded-2xl py-6 font-bold shadow-md shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all bg-primary text-primary-foreground hover:bg-primary/95" disabled={isPending}>
                              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                              {isPending ? "Logging in..." : "Start Journey"}
                         </Button>

                         <div className="text-center text-sm text-muted-foreground mt-6">
                              Don't have an account?{" "}
                              <Link href="/signup" className="font-bold text-primary transition-colors hover:underline">
                                   Sign up now!
                              </Link>
                         </div>
                    </form>
               </div>

               {/* Right Column: Split Image & Stat Overlay */}
               <div className="hidden lg:block relative h-[calc(100vh-6rem)] rounded-[2.5rem] overflow-hidden bg-muted shadow-xl shadow-border/20">
                    <Image
                         src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                         alt="StarterApp Modern Tech"
                         fill
                         className="object-cover"
                         priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                    {/* Top Right Glassmorphic Stats Badge */}
                    <div className="absolute top-6 right-6 max-w-[240px] rounded-3xl bg-card/70 dark:bg-neutral-950/70 backdrop-blur-md border border-border p-5 shadow-lg">
                         <div className="text-3xl font-black text-foreground mb-1">+89%</div>
                         <div className="text-xs text-muted-foreground leading-normal font-medium mb-3">
                              Positive response from developers.
                         </div>
                         <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/95 text-xs w-full py-2">
                              <Link href="/about">Start Now</Link>
                         </Button>
                    </div>

                    {/* Bottom Content Overlay */}
                    <div className="absolute bottom-10 left-10 right-10">
                         <div className="max-w-lg">
                              <h2 className="text-3xl font-black text-white mb-2.5">
                                   We are a Family
                              </h2>
                              <p className="text-sm text-neutral-200/90 leading-relaxed font-medium mb-6">
                                   Connecting you with verified properties and trusted realtors for a seamless property search experience.
                              </p>
                              
                              {/* Colored tags */}
                              <div className="flex flex-wrap gap-2.5">
                                   <span className="inline-flex items-center rounded-xl bg-orange-500/20 border border-orange-500/30 px-3.5 py-1 text-xs font-bold text-orange-200 backdrop-blur-md">
                                        # Luxury
                                   </span>
                                   <span className="inline-flex items-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-200 backdrop-blur-md">
                                        # Verified
                                   </span>
                                   <span className="inline-flex items-center rounded-xl bg-blue-500/20 border border-blue-500/30 px-3.5 py-1 text-xs font-bold text-blue-200 backdrop-blur-md">
                                        # EasyRent
                                   </span>
                                   <span className="inline-flex items-center rounded-xl bg-pink-500/20 border border-pink-500/30 px-3.5 py-1 text-xs font-bold text-pink-200 backdrop-blur-md">
                                        # Support
                                   </span>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}
