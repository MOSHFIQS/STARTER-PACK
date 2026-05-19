"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected exceptions to telemetry
    console.error("Router error caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full text-center space-y-6 p-8 border rounded-2xl bg-card shadow-lg animate-in fade-in duration-300">
        {/* Error Icon */}
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-10 w-10" />
        </div>

        {/* Messaging details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Something went wrong!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The layout route encountered a rendering crash. Clicking reset will re-attempt compilation.
          </p>
        </div>

        {/* Trace print for developers */}
        <div className="bg-muted text-left p-4 rounded-lg overflow-x-auto border">
          <p className="text-xs font-mono font-bold text-destructive">
            {error.name}: {error.message}
          </p>
          {error.digest && (
            <p className="text-[10px] text-muted-foreground font-mono mt-1 select-all">
              Digest signature: {error.digest}
            </p>
          )}
        </div>

        {/* Recovery action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={reset} className="flex-1 flex items-center justify-center gap-2 h-11 select-none">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="flex-1 flex items-center justify-center gap-2 h-11 select-none"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
