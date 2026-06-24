import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatusCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  indicatorColor?: string;
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
      <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
        <span className="text-[10px] sm:text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {title}
        </span>
        <div className="group-hover:scale-110 transition-transform duration-200 shrink-0">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pb-4 sm:pb-5">
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {/* Value row — flex-wrap prevents truncation at any width */}
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {indicatorColor && (
              <span
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-[0_0_10px_currentColor] animate-pulse shrink-0 ${indicatorColor}`}
              />
            )}
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground tabular-nums leading-none break-all">
              {value}
            </span>
            {badge && <div className="ml-1 shrink-0">{badge}</div>}
          </div>
          <span className="text-[11px] sm:text-xs text-muted-foreground/80 font-normal leading-relaxed">
            {description}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
