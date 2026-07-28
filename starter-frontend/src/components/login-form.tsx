"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth";

import { getDashboardRoute } from "@/lib/roleRoutes"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/redux/store"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

export function LoginForm({
     className,
     ...props
}: React.ComponentPropsWithoutRef<"div">) {
     const { login } = useAuth()
     const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth)
     const router = useRouter()
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     const [isPending, startTransition] = useTransition()
     const [error, setError] = useState("")

     // Redirect if already authenticated
     useEffect(() => {
          if (!isLoading && isAuthenticated && user) {
               router.push(getDashboardRoute(user.role))
          }
     }, [isLoading, isAuthenticated, user, router])

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")
          startTransition(async () => {
               try {
                    await login(email, password)
                    toast.success("Login successful!")
               } catch (err: unknown) {
                    const msg = err instanceof Error ? err.message : "Invalid credentials"
                    setError(msg)
                    toast.error(msg)
               }
          })
     }

     return (
          <div className={cn("flex flex-col gap-6", className)} {...props}>
               <Card>
                    <CardHeader className="space-y-1.5">
                         <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
                         <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleSubmit}>
                              <div className="flex flex-col gap-5">
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
                                        <div className="flex items-center justify-between">
                                             <Label htmlFor="password">Password</Label>
                                             <Link href="/forgot-password" className="text-xs text-muted-foreground transition-colors hover:text-primary">
                                                  Forgot password?
                                             </Link>
                                        </div>
                                        <Input
                                             id="password"
                                             type="password"
                                             value={password}
                                             onChange={(e) => setPassword(e.target.value)}
                                             required
                                        />
                                   </div>
                                   {error && <p className="text-sm text-destructive">{error}</p>}
                                   <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                                        {isPending ? "Logging in..." : "Login"}
                                   </Button>
                                   <div className="text-center text-sm text-muted-foreground">
                                        Don't have an account?{" "}
                                        <Link href="/signup" className="font-medium text-primary transition-colors hover:underline">
                                             Sign up
                                        </Link>
                                   </div>
                              </div>
                         </form>
                    </CardContent>
               </Card>
          </div>
     )
}
