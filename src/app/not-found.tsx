import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, MoveLeft } from "lucide-react";

import { BRAND_CONFIG } from "@/config/brand";

export const metadata = {
  title: `404 Page Not Found - ${BRAND_CONFIG.name}`,
  description: "The requested route resource could not be loaded or is offline.",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 select-none animate-in fade-in duration-300">
      <div className="max-w-md w-full text-center space-y-6 p-8 border rounded-2xl bg-card shadow-lg">
        {/* Visual Accent Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground border">
          <Compass className="h-10 w-10 animate-bounce" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground font-mono">404</h1>
          <h2 className="text-xl font-bold text-foreground">Route Not Found</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you are looking for doesn&apos;t exist, has been archived, or you have accessed an unconfigured boilerplate path.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link href="/dashboard">
            <Button className="w-full flex items-center justify-center gap-2 h-11 font-semibold select-none">
              <MoveLeft className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
