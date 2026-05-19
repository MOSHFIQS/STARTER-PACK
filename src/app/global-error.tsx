"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global system crash caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-sans antialiased p-6">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl animate-in fade-in duration-300">
          {/* Critical Error Alert Icon */}
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/25 shadow-lg animate-pulse">
            <AlertTriangle className="h-10 w-10" />
          </div>

          {/* Context Messaging */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Critical System Failure
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              A root-level application crash took place. The core layouts failed to execute correctly.
            </p>
          </div>

          {/* Development Trace Details */}
          <div className="bg-zinc-950 text-left p-4 rounded-lg overflow-x-auto border border-zinc-850">
            <p className="text-xs font-mono font-bold text-rose-400">
              {error.name}: {error.message}
            </p>
            {error.digest && (
              <p className="text-[10px] text-zinc-500 font-mono mt-1 select-all">
                Digest signature: {error.digest}
              </p>
            )}
          </div>

          {/* Recover button */}
          <button
            onClick={reset}
            className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-white text-zinc-950 hover:bg-zinc-150 font-bold transition-all select-none shadow-lg"
          >
            <RefreshCw className="h-4 w-4" />
            Re-Initialize Application
          </button>
        </div>
      </body>
    </html>
  );
}
