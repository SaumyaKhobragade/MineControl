import type { NextConfig } from "next";
import * as fs from "fs";
import * as path from "path";

// Load root .env manually to ensure workspace next dev task gets access to parent environment variables
const rootEnvPath = path.resolve(process.cwd(), "../../.env");
if (fs.existsSync(rootEnvPath)) {
  const envContent = fs.readFileSync(rootEnvPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.substring(0, eqIdx).trim();
      const val = trimmed.substring(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
      process.env[key] = val;
    }
  });
}

const nextConfig: NextConfig = {
  // Prevents Next.js from attempting to statically pre-render server-only pages
  // (e.g. /500 error page) which conflicts with runtime-only auth/headers usage
  experimental: {
    // Treat all pages as dynamic unless explicitly opted into static
  },
  // Packages that must stay server-side (use Node.js fs, path, aws-sdk etc.)
  serverExternalPackages: ["fs", "path"],
};

export default nextConfig;
