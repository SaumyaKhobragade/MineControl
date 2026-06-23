export type EC2State = "pending" | "running" | "stopping" | "stopped" | "shutting-down" | "terminated";
export type MinecraftState = "online" | "offline" | "starting" | "stopping";
export interface DashboardStatus {
    ec2State: EC2State;
    minecraftState: MinecraftState;
    playerCount: number;
    maxPlayers: number;
    pingMs: number | null;
    uptimeSeconds: number;
}
export interface AutoStopConfig {
    enabled: boolean;
    maxIdleTicks: number;
}
