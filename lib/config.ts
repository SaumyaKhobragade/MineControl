import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

// Support both string and number inputs for ID fields, converting all to strings
const IdCoerceSchema = z.union([z.number(), z.string()]).transform((val) => String(val));

export const ConfigSchema = z.object({
  autostop: z.object({
    enabled: z.boolean(),
    max_idle_ticks: z.number().int().nonnegative(),
  }),
  minecraft: z.object({
    bot_id: IdCoerceSchema,
    chat_channel: IdCoerceSchema,
    command_channel: IdCoerceSchema,
    server_address: z.string(),
  }),
  discord: z.object({
    control_panel_channel: IdCoerceSchema,
    log_channel: IdCoerceSchema,
  }),
  permissions: z.object({
    authorized_users: z.array(IdCoerceSchema),
  }),
  timeouts: z.object({
    startup_wait_seconds: z.number().int().positive(),
    ssm_wait_seconds: z.number().int().positive(),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export function validateConfig(config: unknown): Config {
  const result = ConfigSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Config validation failed: ${result.error.format()}`);
  }
  return result.data;
}

// Custom JSON parser to prevent JS float precision loss on large 64-bit Discord ID integers
export function parseJsonPreservingLargeNumbers(content: string): unknown {
  // Matches any integer of 15 to 22 digits that is not already enclosed in quotes or decimals
  const normalized = content.replace(/(?<!["'\d])\b(\d{15,22})\b(?!["'\d])/g, '"$1"');
  return JSON.parse(normalized);
}

export function loadConfig(configPath?: string): Config {
  let resolvedPath = "";
  if (configPath) {
    resolvedPath = path.resolve(configPath);
  } else {
    // Try multiple levels to find config.json relative to cwd and directory hierarchy
    const pathsToTry = [
      path.resolve(process.cwd(), "config.json"),
      path.resolve(process.cwd(), "../config.json"),
      path.resolve(process.cwd(), "../../config.json"),
      path.resolve(process.cwd(), "minecraft-control/config.json"),
      path.resolve(__dirname, "../../../config.json"), // relative from build/src
      path.resolve(__dirname, "../../../../config.json"),
      path.resolve(__dirname, "../../config.json"),
      path.resolve(__dirname, "../config.json"),
    ];

    for (const p of pathsToTry) {
      if (fs.existsSync(p)) {
        resolvedPath = p;
        break;
      }
    }
  }

  if (!resolvedPath || !fs.existsSync(resolvedPath)) {
    throw new Error("Could not find config.json in root or search paths.");
  }

  try {
    const rawContent = fs.readFileSync(resolvedPath, "utf-8");
    const parsedData = parseJsonPreservingLargeNumbers(rawContent);
    return validateConfig(parsedData);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed loading config from ${resolvedPath}: ${message}`);
  }
}
