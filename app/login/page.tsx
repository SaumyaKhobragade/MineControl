"use client";

import * as React from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Server, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function LoginCardContent() {
  const [activeProvider, setActiveProvider] = React.useState<"google" | "discord" | null>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = async (provider: "google" | "discord") => {
    setActiveProvider(provider);
    try {
      await signIn(provider, { redirectTo: "/" });
    } catch (err) {
      console.error(`Login with ${provider} failed:`, err);
      setActiveProvider(null);
    }
  };

  let errorMessage: string | null = null;
  if (error === "AccessDenied") {
    errorMessage = "Access denied: Only authorized accounts (khobragadesaumya@gmail.com) are permitted.";
  } else if (error) {
    errorMessage = `Authentication failed (${error}). Please try again.`;
  }

  return (
    <CardContent className="py-6 px-8 flex flex-col gap-4">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Google Login Button */}
      <Button
        onClick={() => handleLogin("google")}
        disabled={activeProvider !== null}
        className="w-full h-11 bg-white hover:bg-neutral-100 active:bg-neutral-200 text-neutral-900 font-medium transition-all duration-200 gap-3 rounded-lg shadow-sm active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        {activeProvider === "google" ? (
          <span className="w-4 h-4 border-2 border-neutral-400 border-t-neutral-900 rounded-full animate-spin" />
        ) : (
          <GoogleIcon className="w-4 h-4 shrink-0" />
        )}
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="border-t border-neutral-800 w-full" />
        <span className="bg-neutral-900/40 px-3 text-[11px] uppercase tracking-wider text-neutral-500 font-semibold absolute">
          or
        </span>
      </div>

      {/* Discord Login Button */}
      <Button
        onClick={() => handleLogin("discord")}
        disabled={activeProvider !== null}
        className="w-full h-11 bg-[#5865F2] hover:bg-[#4752C4] active:bg-[#3c45a5] text-white font-medium transition-all duration-200 gap-3 rounded-lg shadow-sm active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        {activeProvider === "discord" ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <DiscordIcon className="w-4 h-4 shrink-0" />
        )}
        Continue with Discord
      </Button>
    </CardContent>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-50 relative overflow-hidden px-4">
      {/* Decorative radial gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md bg-neutral-900/40 border-neutral-800 backdrop-blur-md shadow-2xl relative z-10 hover:border-neutral-750 transition-all duration-300">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Server className="w-6 h-6 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
            MineControl
          </CardTitle>
          <CardDescription className="text-neutral-400 text-sm mt-1.5 font-normal">
            Manage your Minecraft server.
          </CardDescription>
        </CardHeader>

        <React.Suspense
          fallback={
            <CardContent className="py-6 px-8 flex justify-center">
              <span className="w-6 h-6 border-2 border-neutral-600 border-t-neutral-200 rounded-full animate-spin" />
            </CardContent>
          }
        >
          <LoginCardContent />
        </React.Suspense>

        <CardFooter className="border-t border-neutral-900 bg-black/20 p-4 text-center text-xs text-neutral-500 rounded-b-xl flex items-center justify-center">
          Secure OAuth access controlled by permissions allowlist.
        </CardFooter>
      </Card>
    </div>
  );
}

