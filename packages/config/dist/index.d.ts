import { z } from "zod";
export declare const ConfigSchema: z.ZodObject<{
    autostop: z.ZodObject<{
        enabled: z.ZodBoolean;
        max_idle_ticks: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        max_idle_ticks: number;
    }, {
        enabled: boolean;
        max_idle_ticks: number;
    }>;
    minecraft: z.ZodObject<{
        bot_id: z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, string, string | number>;
        chat_channel: z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, string, string | number>;
        command_channel: z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, string, string | number>;
        server_address: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        bot_id: string;
        chat_channel: string;
        command_channel: string;
        server_address: string;
    }, {
        bot_id: string | number;
        chat_channel: string | number;
        command_channel: string | number;
        server_address: string;
    }>;
    discord: z.ZodObject<{
        control_panel_channel: z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, string, string | number>;
        log_channel: z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, string, string | number>;
    }, "strip", z.ZodTypeAny, {
        control_panel_channel: string;
        log_channel: string;
    }, {
        control_panel_channel: string | number;
        log_channel: string | number;
    }>;
    permissions: z.ZodObject<{
        authorized_users: z.ZodArray<z.ZodEffects<z.ZodUnion<[z.ZodNumber, z.ZodString]>, string, string | number>, "many">;
    }, "strip", z.ZodTypeAny, {
        authorized_users: string[];
    }, {
        authorized_users: (string | number)[];
    }>;
    timeouts: z.ZodObject<{
        startup_wait_seconds: z.ZodNumber;
        ssm_wait_seconds: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        startup_wait_seconds: number;
        ssm_wait_seconds: number;
    }, {
        startup_wait_seconds: number;
        ssm_wait_seconds: number;
    }>;
}, "strip", z.ZodTypeAny, {
    autostop: {
        enabled: boolean;
        max_idle_ticks: number;
    };
    minecraft: {
        bot_id: string;
        chat_channel: string;
        command_channel: string;
        server_address: string;
    };
    discord: {
        control_panel_channel: string;
        log_channel: string;
    };
    permissions: {
        authorized_users: string[];
    };
    timeouts: {
        startup_wait_seconds: number;
        ssm_wait_seconds: number;
    };
}, {
    autostop: {
        enabled: boolean;
        max_idle_ticks: number;
    };
    minecraft: {
        bot_id: string | number;
        chat_channel: string | number;
        command_channel: string | number;
        server_address: string;
    };
    discord: {
        control_panel_channel: string | number;
        log_channel: string | number;
    };
    permissions: {
        authorized_users: (string | number)[];
    };
    timeouts: {
        startup_wait_seconds: number;
        ssm_wait_seconds: number;
    };
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare function validateConfig(config: unknown): Config;
export declare function parseJsonPreservingLargeNumbers(content: string): any;
export declare function loadConfig(configPath?: string): Config;
