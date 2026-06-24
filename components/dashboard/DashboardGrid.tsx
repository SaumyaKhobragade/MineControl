import * as React from "react";
import { ServerStatus } from "@/types";
import { StatusCard } from "./StatusCard";
import {
  Server,
  Users,
  Activity,
  Clock
} from "lucide-react";

interface DashboardGridProps {
  status: ServerStatus;
}

export function DashboardGrid({ status }: DashboardGridProps) {
  const { ec2, minecraft } = status;

  // Helper to determine Minecraft status indicator dot color
  const getMinecraftIndicator = () => {
    switch (minecraft.state) {
      case "online":
        return "text-emerald-500 bg-emerald-500";
      case "starting":
        return "text-amber-500 bg-amber-500 animate-pulse";
      case "stopping":
        return "text-orange-500 bg-orange-500 animate-pulse";
      default:
        return "text-rose-500 bg-rose-500";
    }
  };

  // Helper to determine Minecraft state display string
  const getMinecraftStateDisplay = () => {
    switch (minecraft.state) {
      case "online":
        return "🟢 ONLINE";
      case "starting":
        return "🟡 STARTING";
      case "stopping":
        return "🟠 STOPPING";
      default:
        return "🔴 OFFLINE";
    }
  };

  return (
    // 1 col mobile → 2 col tablet → 4 col desktop
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
      {/* Card 1: Server Status */}
      <StatusCard
        title="Server Status"
        value={getMinecraftStateDisplay()}
        description={
          minecraft.state === "online"
            ? "Server operational"
            : minecraft.state === "starting"
            ? "Server starting"
            : minecraft.state === "stopping"
            ? "Server stopping"
            : "Server unavailable"
        }
        icon={<Server className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
        indicatorColor={getMinecraftIndicator()}
      />

      {/* Card 2: Players */}
      <StatusCard
        title="Players"
        value={minecraft.state === "online" ? `${minecraft.players} / ${minecraft.maxPlayers}` : "0 / --"}
        description={minecraft.state === "online" && minecraft.players > 0 ? "Players online" : "No players online"}
        icon={<Users className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
      />

      {/* Card 3: Ping */}
      <StatusCard
        title="Ping"
        value={minecraft.state === "online" && minecraft.latency ? `${minecraft.latency}ms` : "N/A"}
        description={minecraft.state === "online" ? "Latency connection stable" : "Server offline"}
        icon={<Activity className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />}
      />

      {/* Card 4: Uptime */}
      <StatusCard
        title="Uptime"
        value={minecraft.state === "online" ? ec2.uptime : "00h 00m 00s"}
        description={minecraft.state === "online" ? "Continuous game server loop" : "Instance stopped"}
        icon={<Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
      />
    </div>
  );
}
