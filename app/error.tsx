"use client";

import { useEffect } from "react";
import { Server } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[MineControl] Application error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <Server className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred. Try refreshing the page.
          </p>
        </div>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-all font-semibold cursor-pointer text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
