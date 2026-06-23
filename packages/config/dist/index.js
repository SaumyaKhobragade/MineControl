"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSchema = void 0;
exports.validateConfig = validateConfig;
exports.parseJsonPreservingLargeNumbers = parseJsonPreservingLargeNumbers;
exports.loadConfig = loadConfig;
const zod_1 = require("zod");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Support both string and number inputs for ID fields, converting all to strings
const IdCoerceSchema = zod_1.z.union([zod_1.z.number(), zod_1.z.string()]).transform((val) => String(val));
exports.ConfigSchema = zod_1.z.object({
    autostop: zod_1.z.object({
        enabled: zod_1.z.boolean(),
        max_idle_ticks: zod_1.z.number().int().nonnegative(),
    }),
    minecraft: zod_1.z.object({
        bot_id: IdCoerceSchema,
        chat_channel: IdCoerceSchema,
        command_channel: IdCoerceSchema,
        server_address: zod_1.z.string(),
    }),
    discord: zod_1.z.object({
        control_panel_channel: IdCoerceSchema,
        log_channel: IdCoerceSchema,
    }),
    permissions: zod_1.z.object({
        authorized_users: zod_1.z.array(IdCoerceSchema),
    }),
    timeouts: zod_1.z.object({
        startup_wait_seconds: zod_1.z.number().int().positive(),
        ssm_wait_seconds: zod_1.z.number().int().positive(),
    }),
});
function validateConfig(config) {
    const result = exports.ConfigSchema.safeParse(config);
    if (!result.success) {
        throw new Error(`Config validation failed: ${result.error.format()}`);
    }
    return result.data;
}
// Custom JSON parser to prevent JS float precision loss on large 64-bit Discord ID integers
function parseJsonPreservingLargeNumbers(content) {
    // Matches any integer of 15 to 22 digits that is not already enclosed in quotes or decimals
    const normalized = content.replace(/(?<!["'\d])\b(\d{15,22})\b(?!["'\d])/g, '"$1"');
    return JSON.parse(normalized);
}
function loadConfig(configPath) {
    let resolvedPath = "";
    if (configPath) {
        resolvedPath = path.resolve(configPath);
    }
    else {
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
    }
    catch (error) {
        throw new Error(`Failed loading config from ${resolvedPath}: ${error.message}`);
    }
}
