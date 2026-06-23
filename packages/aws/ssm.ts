// TODO: Implement AWS Systems Manager (SSM) SendCommand logic to interact with MC server
export async function sendMinecraftCommand(instanceId: string, command: string): Promise<string> {
  console.log("TODO: Send command to Minecraft via SSM:", command, "on", instanceId);
  return "Command sent";
}
