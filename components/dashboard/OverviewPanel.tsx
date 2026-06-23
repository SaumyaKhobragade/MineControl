import * as React from "react";
import { ServerStatus } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OverviewPanelProps {
  status: ServerStatus;
}

export function OverviewPanel({ status }: OverviewPanelProps) {
  const { ec2, minecraft } = status;

  return (
    <Card className="bg-card/40 border-border backdrop-blur-md h-full flex flex-col justify-between rounded-xl">
      <div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Infrastructure</span>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight text-foreground">Status Overview</CardTitle>
          <CardDescription className="text-xs text-muted-foreground/80 font-normal leading-relaxed">
            High-level configuration status values mapping.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 text-sm mt-2 pb-6">
          {/* EC2 Instance State */}
          <div className="flex justify-between items-center py-3 border-b border-border">
            <span className="text-muted-foreground font-normal">EC2 Instance</span>
            <Badge
              className={`capitalize border font-medium ${
                ec2.state === "running"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : ec2.state === "pending"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {ec2.state}
            </Badge>
          </div>

          {/* Minecraft Server State */}
          <div className="flex justify-between items-center py-3">
            <span className="text-muted-foreground font-normal">Minecraft Server</span>
            <Badge
              className={`capitalize border font-medium ${
                minecraft.state === "online"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : minecraft.state === "starting"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse"
                  : minecraft.state === "stopping"
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}
            >
              {minecraft.state}
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
