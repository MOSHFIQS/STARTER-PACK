"use client";

import React, { useEffect } from "react";
import LoginForm from "@/features/auth/LoginForm";
import { BRAND_CONFIG } from "@/config/brand";
import { useAppSelector } from "@/hooks/useRedux";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Instant redirect if the session is already authenticated
  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
    }
  }, [token, router]);

  if (token) {
    return null;
  }

  return (
    <div className="grid min-h-[calc(100vh-14rem)] lg:grid-cols-12 bg-background border rounded-2xl overflow-hidden shadow-xl select-none relative">
      {/* Visual Accent Panel (Left) */}
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-zinc-950 items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-zinc-950 opacity-90" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="z-10 text-center max-w-lg px-8 space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl">
            <span className="text-3xl font-extrabold text-white">{BRAND_CONFIG.shortName}</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl uppercase leading-none">
              {BRAND_CONFIG.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
              {BRAND_CONFIG.description}
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-850">
            <div className="text-center">
              <span className="block text-xl font-bold text-white">100%</span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">Secure JWT</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-white">O(1)</span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">RTK Query</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-white">V4</span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase">Tailwind</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Signin Form (Right) */}
      <div className="flex flex-col col-span-12 lg:col-span-5 p-8 sm:p-12 items-center justify-center bg-card">
        <div className="w-full max-w-sm space-y-8">
          <div className="flex justify-center lg:hidden">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border">
              <span className="text-lg font-bold">{BRAND_CONFIG.shortName}</span>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
