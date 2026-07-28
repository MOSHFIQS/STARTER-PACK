"use client"
import { authApi } from "@/redux/api/authApi";
import { store } from "@/redux/store";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (firstName.trim().length < 2) {
      setError("First name must be at least 2 characters")
      toast.error("First name must be at least 2 characters")
      return
    }

    if (lastName.trim().length < 2) {
      setError("Last name must be at least 2 characters")
      toast.error("Last name must be at least 2 characters")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      toast.error("Password must be at least 8 characters")
      return
    }

    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      setError("Password must contain at least one letter and one number")
      toast.error("Password must contain at least one letter and one number")
      return
    }

    // Phone is optional but must match the backend format when provided.
    if (phone && !/^\+?[0-9]{10,15}$/.test(phone.trim())) {
      setError("Phone must be 10-15 digits, optionally starting with +")
      toast.error("Phone must be 10-15 digits, optionally starting with +")
      return
    }

    startTransition(async () => {
      try {
        await store.dispatch(authApi.endpoints.register.initiate({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          password,
        })).unwrap()
        toast.success("Account created successfully! Please log in.")
        router.push("/login")
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Registration failed"
        setError(msg)
        toast.error(msg)
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl tracking-tight">Create your account</CardTitle>
          <CardDescription>Join PropertyChai to find your dream property</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters, with a letter & number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Min 8 characters, including at least one letter and one number.
                </p>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {isPending ? "Creating account..." : "Create Account"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary transition-colors hover:underline">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
