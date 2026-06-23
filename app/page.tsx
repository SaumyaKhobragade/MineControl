"use client";

import * as React from "react";
import { Server } from "lucide-react";
import { useServerStatus } from "@/hooks/useServerStatus";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { ControlPanel } from "@/components/dashboard/ControlPanel";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { UserMenu } from "@/components/user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const {
    status,
    isLoading,
    operationType,
    error,
    toasts,
    removeToast,
    startServer,
    stopServer,
    refresh,
  } = useServerStatus();

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground bg-gradient-to-r from-neutral-800 to-neutral-500 dark:from-neutral-50 dark:to-neutral-400 bg-clip-text">
              MineControl
            </h1>
            <p className="text-xs text-muted-foreground font-normal">Minecraft Server Management Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6 md:gap-8 relative z-10">
        
        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 bg-neutral-900/10 border border-neutral-850 rounded-2xl backdrop-blur-sm">
            <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Server className="w-8 h-8" />
            </div>
            <p className="text-rose-400 font-medium">{error}</p>
            <button
              onClick={refresh}
              className="mt-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-neutral-50 rounded-lg border border-neutral-700 hover:border-neutral-600 transition-all font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : !status ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* 6 Statistics Cards Grid */}
            <DashboardGrid status={status} />

            {/* Bottom Controls & Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left/Middle: Server Controls */}
              <div className="lg:col-span-2">
                <ControlPanel
                  status={status}
                  onStart={startServer}
                  onStop={stopServer}
                  onRefresh={refresh}
                  isRefreshing={isLoading}
                  operationType={operationType}
                />
              </div>

              {/* Right: Overview Info Card */}
              <div>
                <OverviewPanel status={status} />
              </div>
            </div>
          </>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/20 py-6 px-6 text-center text-xs text-muted-foreground relative z-10">
        <p>© 2026 MineControl Minecraft Platform. Production-Ready UI. All rights reserved.</p>
      </footer>
      {/* Floating toast notifications container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`p-4 rounded-xl border shadow-xl flex items-center justify-between pointer-events-auto cursor-pointer transition-all duration-300 transform translate-y-0 opacity-100 hover:scale-[1.02] ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/30 text-rose-400"
                : toast.type === "warning"
                ? "bg-amber-950/90 border-amber-500/30 text-amber-400"
                : "bg-cyan-950/90 border-cyan-500/30 text-cyan-400"
            }`}
          >
            <span className="text-sm font-semibold">{toast.message}</span>
            <button className="ml-3 text-xs opacity-60 hover:opacity-100 font-bold font-mono">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
