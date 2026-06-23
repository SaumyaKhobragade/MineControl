import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { loadConfig } from "@/lib/config";
import {
  getInstanceStatus,
  getMinecraftInfo
} from "@/lib/aws";
import { ServerStatusSchema } from "@/types";
import { formatUptime } from "@/lib/format-uptime";
import { operationLock } from "@/lib/operation-lock";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Session authorization verify
  const session = await auth();
  if (!session || !session.user?.isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Read parameters
    const rawInstanceId = process.env.INSTANCE_ID || "";
    const instanceId = rawInstanceId.replace(/^['"]|['"]$/g, "");
    if (!instanceId) {
      throw new Error("INSTANCE_ID environment variable is missing.");
    }

    const config = loadConfig();
    const serverAddress = config.minecraft.server_address;

    // 3. Parallel fetching of status metrics
    const [ec2Info, minecraftInfo] = await Promise.all([
      getInstanceStatus(instanceId),
      getMinecraftInfo(serverAddress, 4000),
    ]);

    // 4. Compute formatted uptime and map status object
    const uptime = ec2Info.state === "running" ? formatUptime(ec2Info.launchTime) : "0m";

    // Map minecraft status state
    const lock = operationLock.get();
    let minecraftState: "online" | "offline" | "starting" | "stopping" = "offline";
    if (lock === "starting") {
      minecraftState = "starting";
    } else if (lock === "stopping") {
      minecraftState = "stopping";
    } else {
      minecraftState = minecraftInfo.online ? "online" : "offline";
    }

    const statusData = {
      ec2: {
        state: ec2Info.state,
        uptime,
      },
      minecraft: {
        state: minecraftState,
        players: minecraftInfo.players,
        maxPlayers: minecraftInfo.maxPlayers,
        latency: minecraftInfo.latency,
      },
    };

    // 5. Strict schema validation
    const validated = ServerStatusSchema.parse(statusData);

    return NextResponse.json(validated);
  } catch (error) {
    const err = error as Error;
    console.error("[api/status] Error retrieving status metrics:", err.message, err);
    return NextResponse.json(
      { error: "Failed to retrieve status" },
      { status: 500 }
    );
  }
}

