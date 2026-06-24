import Link from "next/link";
import { Server } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <div className="p-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Server className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg border border-neutral-700 transition-all font-semibold text-sm"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
