// TODO: Implement AWS EC2 instance management logic (start, stop, describe)
export async function startInstance(instanceId: string): Promise<void> {
  console.log("TODO: Start EC2 instance:", instanceId);
}

export async function stopInstance(instanceId: string): Promise<void> {
  console.log("TODO: Stop EC2 instance:", instanceId);
}

export async function getInstanceStatus(instanceId: string): Promise<string> {
  console.log("TODO: Get EC2 status for:", instanceId);
  return "stopped";
}
