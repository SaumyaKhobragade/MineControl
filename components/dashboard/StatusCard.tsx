import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatusCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  indicatorColor?: string; // e.g. "bg-emerald-500", "bg-rose-500", "bg-amber-500"
}

export function StatusCard({
  title,
  value,
  description,
  icon,
  badge,
  indicatorColor,
}: StatusCardProps) {
  return (
    <Card className="bg-card/40 border-border hover:border-neutral-400/30 dark:hover:border-neutral-700/50 backdrop-blur-md transition-all duration-300 group rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {title}
        </span>
        <div className="group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {indicatorColor && (
              <span
                className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] animate-pulse shrink-0 ${indicatorColor}`}
              />
            )}
            <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums truncate leading-none">
              {value}
            </span>
            {badge && <div className="ml-1.5 shrink-0">{badge}</div>}
          </div>
          <span className="text-xs text-muted-foreground/80 font-normal leading-relaxed truncate">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
