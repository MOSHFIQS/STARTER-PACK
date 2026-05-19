"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { loginUser, selectAuth } from "@/redux/features/authSlice";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

// Validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading } = useAppSelector(selectAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      toast.success(`Welcome back, ${result.data.name}! 🎉`);
      router.replace("/dashboard");
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      toast.error(apiErr?.message || "Failed to sign in. Please verify credentials.");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm text-muted-foreground">
          Access your premium enterprise sales and operations panel
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="relative">
          <Mail className="absolute left-3 top-10 h-4 w-4 text-muted-foreground/70" />
          <FormField
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            className="pl-9 h-11"
            {...register("email")}
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <Lock className="absolute left-3 top-10 h-4 w-4 text-muted-foreground/70" />
          <FormField
            label="Account Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password?.message}
            className="pl-9 pr-10 h-11"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Submit button with loading state */}
        <Button type="submit" disabled={loading} className="w-full h-11 mt-2 text-sm font-semibold">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing you in...
            </>
          ) : (
            "Access Panel"
          )}
        </Button>
      </form>

      {/* Helpful Hint Block */}
      <div className="rounded-lg bg-muted/60 p-4 border text-xs text-muted-foreground space-y-1">
        <span className="font-semibold text-foreground">Quick Setup Demo:</span>
        <p>Use any formatted email and standard password above. The boilerplate handles persistent credentials dynamically.</p>
      </div>
    </div>
  );
}

export default LoginForm;
