import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

declare const require: any;

const ALLOWED_GOOGLE_EMAIL = "khobragadesaumya@gmail.com";

function isEmailAllowed(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  if (normalized === ALLOWED_GOOGLE_EMAIL) return true;
  const envEmail = process.env.ALLOWED_GOOGLE_EMAIL?.toLowerCase().trim();
  if (envEmail && normalized === envEmail) return true;

  try {
    const { loadConfig } = require("@/lib/config");
    const config = loadConfig();
    const authorizedEmails = config.permissions?.authorized_emails || [];
    if (Array.isArray(authorizedEmails) && authorizedEmails.map((e: string) => e.toLowerCase().trim()).includes(normalized)) {
      return true;
    }
  } catch {
    // Config file load optional
  }

  return false;
}

// Load monorepo root .env file manually ONLY in Node.js server runtime
if (typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge") {
  try {
    const fs = require("fs");
    const path = require("path");
    const paths = [
      path.resolve(process.cwd(), "../../.env"),
      path.resolve(process.cwd(), ".env")
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        content.split("\n").forEach((line: string) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) return;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.substring(0, eqIdx).trim();
            const val = trimmed.substring(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
            process.env[key] = val;
          }
        });
        break;
      }
    }
  } catch (err: any) {
    console.error("[auth] Error loading manual env:", err.message);
  }
}

// Environment Variable Checks (only warn in Node.js environment)
if (process.env.NEXT_RUNTIME !== "edge") {
  if (!process.env.DISCORD_CLIENT_ID) {
    console.warn("[auth] Warning: DISCORD_CLIENT_ID is not configured in the environment.");
  }
  if (!process.env.DISCORD_CLIENT_SECRET) {
    console.warn("[auth] Warning: DISCORD_CLIENT_SECRET is not configured in the environment.");
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn("[auth] Warning: GOOGLE_CLIENT_ID is not configured in the environment.");
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("[auth] Warning: GOOGLE_CLIENT_SECRET is not configured in the environment.");
  }
  if (!process.env.NEXTAUTH_SECRET) {
    console.warn("[auth] Warning: NEXTAUTH_SECRET is not configured in the environment. Using fallback for local development.");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email"
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Enforce email restriction on Google OAuth
      if (account?.provider === "google") {
        const email = user?.email || (profile as any)?.email;
        if (!isEmailAllowed(email)) {
          console.warn(`[auth] Unauthorized Google login attempt: ${email}`);
          return false;
        }
      }

      // Fire-and-forget audit log on every successful OAuth login
      try {
        const { logUserLogin } = await import("@/lib/discord/webhook");
        const displayName =
          user?.email ||
          user?.name ||
          (profile && "username" in profile ? (profile as any).username : null) ||
          profile?.name ||
          "Unknown";
        logUserLogin(displayName);
      } catch {
        // Never block login
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account) {
        token.provider = account.provider;
      }

      if (account?.provider === "google" || token.provider === "google") {
        const email = (user?.email || token.email || (profile as any)?.email) as string | undefined;
        if (email) {
          token.email = email;
        }
        token.isAuthorized = isEmailAllowed(email || token.email);
      } else if (account?.provider === "discord" || (profile && "id" in profile && (!token.provider || token.provider === "discord"))) {
        const discordId = ((profile as any)?.id || (user as any)?.id) as string;
        if (discordId) {
          token.discordId = discordId;
          try {
            const { loadConfig } = await import("@/lib/config");
            const config = loadConfig();
            const authorizedUsers = config.permissions.authorized_users;
            token.isAuthorized = authorizedUsers.includes(discordId);
          } catch (error: any) {
            console.error("[auth] Failed config validation in jwt callback:", error.message);
            token.isAuthorized = false;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.discordId) {
          session.user.discordId = token.discordId as string;
        }
        if (token.provider) {
          session.user.provider = token.provider as string;
        }
        session.user.isAuthorized = !!token.isAuthorized;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "default_local_secret_placeholder_32_chars_long",
});
