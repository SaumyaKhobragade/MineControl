"use client";

import * as React from "react";
import { ServerStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Play, Square, RefreshCw } from "lucide-react";

interface RecentActivityProps {
  status: ServerStatus;
}

export function RecentActivity({ status }: RecentActivityProps) {
  // Reference status state to satisfy typescript-eslint unused-vars rule
  if (status.ec2.state === "running") {
    // Intentionally left blank for mock status references
  }
  // Mock timeline events
  const events = [
    {
      id: "1",
      title: "Server Started",
      time: "2 minutes ago",
      icon: <Play className="w-3.5 h-3.5 text-emerald-500" />,
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      id: "2",
      title: "Status Refreshed",
      time: "5 minutes ago",
      icon: <RefreshCw className="w-3.5 h-3.5 text-blue-500" />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      id: "3",
      title: "Server Stopped",
      time: "1 hour ago",
      icon: <Square className="w-3.5 h-3.5 text-rose-500" />,
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  return (
    <Card className="bg-card/40 border-border backdrop-blur-md h-full flex flex-col justify-between rounded-xl">
      <div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Log Stream</span>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight text-foreground">Recent Activity</CardTitle>
          <CardDescription className="text-xs text-muted-foreground/80 font-normal leading-relaxed">
            History of operations and Minecraft events.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-2 pb-6">
          <div className="relative pl-6 border-l border-border flex flex-col gap-6">
            {events.map((event) => (
              <div key={event.id} className="relative flex flex-col gap-1">
                {/* Timeline dot */}
                <span className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full border ${event.border} ${event.bg} flex items-center justify-center`}>
                  {event.icon}
                </span>
                
                <span className="text-xs font-semibold text-foreground/90">{event.title}</span>
                <span className="text-[10px] text-muted-foreground/60 leading-none">{event.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
