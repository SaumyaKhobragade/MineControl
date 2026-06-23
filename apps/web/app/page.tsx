"use client";

import * as React from "react";
import {
  Server,
  Power,
  RefreshCw,
  Users,
  Activity,
  Clock,
  Terminal,
  Cpu,
  Sliders,
  Database,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { UserMenu } from "@/components/user-menu";

export default function Dashboard() {
  // Simulator States
  const [ec2State, setEc2State] = React.useState<"stopped" | "pending" | "running" | "stopping">("running");
  const [minecraftState, setMinecraftState] = React.useState<"offline" | "starting" | "online" | "stopping">("online");
  const [players, setPlayers] = React.useState<number>(5);
  const [maxPlayers] = React.useState<number>(20);
  const [ping, setPing] = React.useState<number | null>(42);
  const [uptime, setUptime] = React.useState<number>(9912); // seconds (2h 45m 12s)
  const [autoStop, setAutoStop] = React.useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);
  
  // Terminal commands mock
  const [commandInput, setCommandInput] = React.useState<string>("");
  const [terminalLogs, setTerminalLogs] = React.useState<Array<{ time: string; text: string; type: "info" | "success" | "command" }>>([
    { time: "13:40:02", text: "Minecraft server started successfully", type: "success" },
    { time: "13:40:05", text: "Discord bot registered status command hooks", type: "info" },
    { time: "13:45:00", text: "Auto-shutdown checklist: 5 active players. Idle ticks reset to 0/3", type: "info" }
  ]);

  // Uptime tick
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (minecraftState === "online") {
      timer = setInterval(() => {
        setUptime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [minecraftState]);

  // Simulate Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      if (minecraftState === "online") {
        setPing(Math.floor(Math.random() * 15) + 35);
        setPlayers((prev) => {
          const change = Math.floor(Math.random() * 3) - 1;
          const newVal = prev + change;
          return newVal >= 0 && newVal <= maxPlayers ? newVal : prev;
        });
      }
    }, 800);
  };

  // Simulate Copy IP
  const copyAddress = () => {
    navigator.clipboard.writeText("13.205.205.48:31121");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulate Start Server
  const handleStart = () => {
    if (ec2State !== "stopped" || minecraftState !== "offline") return;
    
    setEc2State("pending");
    setTerminalLogs((prev) => [
      ...prev,
      { time: new Date().toTimeString().split(" ")[0], text: "Executing AWS EC2 StartInstance request...", type: "info" }
    ]);

    setTimeout(() => {
      setEc2State("running");
      setMinecraftState("starting");
      setTerminalLogs((prev) => [
        ...prev,
        { time: new Date().toTimeString().split(" ")[0], text: "EC2 instance transition: running. Launching Minecraft Server wrapper...", type: "info" }
      ]);

      setTimeout(() => {
        setMinecraftState("online");
        setPing(45);
        setPlayers(0);
        setUptime(0);
        setTerminalLogs((prev) => [
          ...prev,
          { time: new Date().toTimeString().split(" ")[0], text: "Minecraft server loaded. Listening on port 25565.", type: "success" }
        ]);
      }, 3000);
    }, 2000);
  };

  // Simulate Stop Server
  const handleStop = () => {
    if (ec2State !== "running" || minecraftState !== "online") return;

    setMinecraftState("stopping");
    setPing(null);
    setPlayers(0);
    setTerminalLogs((prev) => [
      ...prev,
      { time: new Date().toTimeString().split(" ")[0], text: "Sending save-all and stop command to MC server via AWS SSM...", type: "info" }
    ]);

    setTimeout(() => {
      setMinecraftState("offline");
      setEc2State("stopping");
      setTerminalLogs((prev) => [
        ...prev,
        { time: new Date().toTimeString().split(" ")[0], text: "Minecraft server stopped. Initiating EC2 shutdown sequence...", type: "info" }
      ]);

      setTimeout(() => {
        setEc2State("stopped");
        setTerminalLogs((prev) => [
          ...prev,
          { time: new Date().toTimeString().split(" ")[0], text: "EC2 instance stopped. Current status: offline.", type: "info" }
        ]);
      }, 2000);
    }, 3000);
  };

  // Simulate Sending command
  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim() || minecraftState !== "online") return;

    const cmd = commandInput.trim();
    const now = new Date().toTimeString().split(" ")[0];
    
    setTerminalLogs((prev) => [
      ...prev,
      { time: now, text: `Command sent: ${cmd}`, type: "command" }
    ]);
    
    setCommandInput("");

    setTimeout(() => {
      let response = "Command processed successfully.";
      if (cmd.startsWith("/say")) {
        response = `[Server] ${cmd.replace("/say", "").trim()}`;
      } else if (cmd === "/list") {
        response = `There are ${players} of a max ${maxPlayers} players online.`;
      }
      setTerminalLogs((prev) => [
        ...prev,
        { time: new Date().toTimeString().split(" ")[0], text: response, type: "info" }
      ]);
    }, 500);
  };

  // Format seconds to readable uptime
  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="flex-1 flex flex-col w-full min-h-screen bg-neutral-950 text-neutral-50 relative overflow-hidden">
      {/* Background radial gradient decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Main Navigation Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              MineControl
            </h1>
            <p className="text-xs text-neutral-500 font-medium">MC Server Panel</p>
          </div>
        </div>

        {/* Header Right / Server quick stats */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-neutral-400 font-mono text-xs">13.205.205.48:31121</span>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 ml-1 text-neutral-400 hover:text-neutral-50"
              onClick={copyAddress}
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-50 gap-2 transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <UserMenu />
        </div>
      </header>

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6 md:gap-8">
        
        {/* Stats Grid - 4 Columns */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Status */}
          <Card className="bg-neutral-900/30 border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Status</span>
              <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${
                    minecraftState === "online" ? "bg-emerald-500 text-emerald-500" :
                    minecraftState === "starting" ? "bg-amber-500 text-amber-500" :
                    "bg-rose-500 text-rose-500"
                  }`} />
                  <span className="text-2xl font-bold tracking-tight capitalize">{minecraftState}</span>
                </div>
                <span className="text-xs text-neutral-500">
                  EC2 Instance: <span className="font-mono text-neutral-400">{ec2State}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Players */}
          <Card className="bg-neutral-900/30 border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Players</span>
              <Users className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold tracking-tight">
                  {minecraftState === "online" ? `${players} / ${maxPlayers}` : "0 / --"}
                </span>
                <span className="text-xs text-neutral-500">
                  {minecraftState === "online" && players > 0 ? "Steve, Alex, Notch" : "No active players"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Ping */}
          <Card className="bg-neutral-900/30 border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Ping</span>
              <Cpu className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold tracking-tight">
                  {minecraftState === "online" && ping ? `${ping} ms` : "N/A"}
                </span>
                <span className="text-xs text-neutral-500">
                  {minecraftState === "online" ? "Latency connection stable" : "Server offline"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Uptime */}
          <Card className="bg-neutral-900/30 border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">Uptime</span>
              <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-bold tracking-tight font-mono">
                  {minecraftState === "online" ? formatUptime(uptime) : "00h 00m 00s"}
                </span>
                <span className="text-xs text-neutral-500">
                  {minecraftState === "online" ? "Continuous runtime execution" : "Server stopped"}
                </span>
              </div>
            </CardContent>
          </Card>

        </section>

        {/* Main Interface Layout - 2 Columns */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left/Middle area - EC2 and Command Terminal */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* EC2 Instance Card */}
            <Card className="bg-neutral-900/20 border-neutral-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wide">AWS Infrastructure</span>
                </div>
                <CardTitle className="text-lg">EC2 Instance Control</CardTitle>
                <CardDescription>
                  Manage the underlying AWS EC2 virtual machine hosting the server.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex flex-col gap-6">
                {/* Instance properties details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-850">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Instance ID</span>
                    <span className="font-mono text-sm text-neutral-300">i-054fc6ad1aec4fd94</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Type</span>
                    <span className="text-sm text-neutral-300">t3.medium</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Region</span>
                    <span className="text-sm text-neutral-300">ap-south-1</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-500 block">Public IP</span>
                    <span className="font-mono text-sm text-neutral-300">13.205.205.48</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-neutral-400">Current VM State:</span>
                    <Badge variant={
                      ec2State === "running" ? "default" :
                      ec2State === "pending" ? "outline" :
                      "destructive"
                    } className={`capitalize ${
                      ec2State === "running" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      ec2State === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" :
                      "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}>
                      {ec2State}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:ml-auto">
                    <Button 
                      onClick={handleStart} 
                      disabled={ec2State !== "stopped"}
                      className="flex-1 sm:flex-initial h-10 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all font-semibold gap-2"
                    >
                      <Power className="w-4 h-4" />
                      Start Server
                    </Button>
                    <Button 
                      onClick={handleStop} 
                      disabled={ec2State !== "running" || minecraftState !== "online"}
                      variant="destructive"
                      className="flex-1 sm:flex-initial h-10 px-5 bg-rose-600/90 hover:bg-rose-500 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all font-semibold gap-2"
                    >
                      <Power className="w-4 h-4" />
                      Stop Server
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Minecraft Terminal Console */}
            <Card className="bg-neutral-900/20 border-neutral-800 backdrop-blur-sm flex-1 flex flex-col min-h-[350px]">
              <CardHeader className="pb-3 border-b border-neutral-900">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wide">Live Console Wrapper</span>
                </div>
                <CardTitle className="text-lg">Minecraft Command Logs</CardTitle>
                <CardDescription>
                  Send RCON commands and monitor standard output wrappers.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-4 bg-black/40 font-mono text-sm leading-relaxed overflow-y-auto min-h-[200px] max-h-[300px]">
                <div className="flex flex-col gap-2">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-neutral-500 select-none">[{log.time}]</span>
                      <span className={`flex-1 ${
                        log.type === "success" ? "text-emerald-400" :
                        log.type === "command" ? "text-blue-400 font-bold" :
                        "text-neutral-300"
                      }`}>
                        {log.type === "command" ? `> ${log.text}` : log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-3 bg-neutral-950/80 border-t border-neutral-900">
                <form onSubmit={handleSendCommand} className="flex w-full gap-2 items-center">
                  <span className="text-neutral-500 font-mono pl-2">{">"}</span>
                  <input
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder={minecraftState === "online" ? "Enter command (e.g. /list, /say Hello)..." : "Server is offline"}
                    disabled={minecraftState !== "online"}
                    className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-neutral-200 placeholder-neutral-600 font-mono text-sm disabled:cursor-not-allowed"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={minecraftState !== "online" || !commandInput.trim()}
                    className="h-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
                  >
                    Send
                  </Button>
                </form>
              </CardFooter>
            </Card>

          </div>

          {/* Right Column - Side panels: Minecraft Server status details & Auto Stop config */}
          <div className="flex flex-col gap-6">

            {/* Minecraft Server Details */}
            <Card className="bg-neutral-900/20 border-neutral-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wide">Server Details</span>
                </div>
                <CardTitle className="text-lg">Minecraft Server</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-neutral-850">
                  <span className="text-neutral-400">Server Software</span>
                  <span className="font-semibold text-neutral-200">Paper-MC</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-850">
                  <span className="text-neutral-400">Version</span>
                  <span className="font-mono text-neutral-200">1.20.4</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-850">
                  <span className="text-neutral-400">RCON Port</span>
                  <span className="font-mono text-neutral-200">25575</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-400">Max Players</span>
                  <span className="font-mono text-neutral-200">20</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Auto Stop Card */}
            <Card className="bg-neutral-900/20 border-neutral-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wide">Automation Settings</span>
                </div>
                <CardTitle className="text-lg">Auto Stop</CardTitle>
                <CardDescription>
                  Automatically stop EC2 instance when server has been empty.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/40 border border-neutral-850">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">Enable Auto Stop</span>
                    <span className="text-xs text-neutral-500">Lambda & EventBridge cron check</span>
                  </div>
                  <Switch 
                    checked={autoStop} 
                    onCheckedChange={setAutoStop}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 font-semibold uppercase tracking-wider">Max Idle Ticks</span>
                    <span className="font-mono font-bold text-purple-400">3 Ticks</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[100%] rounded-full" />
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Each tick corresponds to 15 minutes. Instantly stops server after 45 minutes of idle.
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 pb-6">
                <div className="flex items-start gap-2 bg-purple-950/20 border border-purple-900/30 p-3 rounded-lg text-xs w-full text-purple-300">
                  <span className="font-bold">Info:</span>
                  <span>Currently monitored via EventBridge Rule every 15 minutes.</span>
                </div>
              </CardFooter>
            </Card>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/40 py-6 px-6 text-center text-xs text-neutral-600">
        <p>© 2026 MineControl Monorepo Platform. Initial Project Bootstrap. All rights reserved.</p>
      </footer>
    </div>
  );
}
