import * as React from "react";
import { ServerStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Sliders, Play, Square } from "lucide-react";

interface ControlPanelProps {
  status: ServerStatus;
  onStart: () => void;
  onStop: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  operationType?: "starting" | "stopping" | null;
}

export function ControlPanel({
  status,
  onStart,
  onStop,
  onRefresh,
  isRefreshing = false,
  operationType = null,
}: ControlPanelProps) {
  const { ec2, minecraft } = status;

  return (
    <Card className="bg-card/40 border-border backdrop-blur-md h-full flex flex-col justify-between rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider">Operations</span>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight text-foreground">Server Controls</CardTitle>
        <CardDescription className="text-xs text-muted-foreground/80 font-normal leading-relaxed">
          Trigger virtual machine actions and automation controls.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-2 pb-6">
        {/* Dynamic status helper panel */}
        <div className="p-4 rounded-xl bg-neutral-100/50 dark:bg-neutral-950/40 border border-border flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 tracking-wider">Infrastructure state</span>
            <span className="text-sm font-semibold text-foreground/90 capitalize">
              EC2: {ec2.state} | MC: {minecraft.state}
            </span>
          </div>
          <span className="text-xs text-muted-foreground/60 font-mono hidden sm:inline">
            Region: ap-south-1
          </span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Start Server Button */}
          <Button
            onClick={onStart}
            disabled={ec2.state !== "stopped" || isRefreshing || operationType !== null}
            className="h-11 bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-neutral-200 dark:disabled:bg-neutral-800/80 disabled:text-neutral-400 dark:disabled:text-neutral-500 transition-all font-semibold gap-2 rounded-lg cursor-pointer"
          >
            {operationType === "starting" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Server
              </>
            )}
          </Button>

          {/* Stop Server Button */}
          <Button
            onClick={onStop}
            disabled={ec2.state !== "running" || minecraft.state !== "online" || isRefreshing || operationType !== null}
            variant="destructive"
            className="h-11 bg-rose-600/90 hover:bg-rose-500 text-white disabled:bg-neutral-200 dark:disabled:bg-neutral-800/80 disabled:text-neutral-400 dark:disabled:text-neutral-500 transition-all font-semibold gap-2 rounded-lg cursor-pointer"
          >
            {operationType === "stopping" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Stopping...
              </>
            ) : (
              <>
                <Square className="w-4 h-4" />
                Stop Server
              </>
            )}
          </Button>

          {/* Refresh Button */}
          <Button
            onClick={onRefresh}
            disabled={isRefreshing || operationType !== null}
            variant="outline"
            className="h-11 col-span-2 border-border bg-card/50 hover:bg-accent text-foreground hover:text-accent-foreground transition-all font-semibold gap-2 rounded-lg cursor-pointer disabled:bg-neutral-200 dark:disabled:bg-neutral-800/80 disabled:text-neutral-400 dark:disabled:text-neutral-500"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
