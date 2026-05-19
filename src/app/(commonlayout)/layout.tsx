"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/useRedux";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { BRAND_CONFIG } from "@/config/brand";
import { Toaster } from "react-hot-toast";
import { LayoutDashboard, Compass, Info, ArrowUpRight, LogIn } from "lucide-react";

interface CommonLayoutProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  const pathname = usePathname();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const navItems = [
    { name: "Home", href: "/", icon: Compass },
    { name: "About Us", href: "/about", icon: Info },
    { name: "Explorer", href: "/more", icon: ArrowUpRight },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300 relative">
      <Toaster position="bottom-right" reverseOrder={false} />

      {/* Futuristic Background Accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Sticky Premium Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-xl transition-all select-none">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-extrabold text-sm font-mono">{BRAND_CONFIG.shortName}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-foreground text-sm uppercase leading-none">
                {BRAND_CONFIG.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono mt-0.5">Enterprise Portal</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/40 p-1 rounded-full border">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all select-none ${
                    isActive
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Tools (Right) */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Portal Action Trigger */}
            {isAuthenticated ? (
              <Link href="/dashboard">
                <button className="relative inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-foreground/5">
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </button>
              </Link>
            ) : (
              <Link href="/signin">
                <button className="relative inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-lg shadow-emerald-500/10 border border-emerald-400/20">
                  <LogIn className="h-3.5 w-3.5" />
                  Access Portal
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex flex-col justify-center animate-in fade-in duration-300">
        {children}
      </main>

      {/* Clean Premium Footer */}
      <footer className="border-t bg-muted/10 py-8 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-foreground tracking-wider uppercase font-mono">
              {BRAND_CONFIG.shortName}
            </span>
            <span>&copy; {new Date().getFullYear()} {BRAND_CONFIG.company}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded border bg-card">Next.js 15</span>
            <span className="px-2 py-0.5 rounded border bg-card">Redux Toolkit</span>
            <span className="px-2 py-0.5 rounded border bg-card">Tailwind v4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
