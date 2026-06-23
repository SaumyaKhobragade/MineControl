"use client";

import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-50 relative overflow-hidden px-4">
      {/* Decorative red/rose radial gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <Card className="w-full max-w-md bg-neutral-900/40 border-neutral-800 backdrop-blur-md shadow-2xl relative z-10 hover:border-neutral-750 transition-all duration-300">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-rose-400">
            Access Denied
          </CardTitle>
          <CardDescription className="text-neutral-400 text-sm mt-1.5 font-normal">
            You do not have access to this dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="py-6 px-8 flex flex-col gap-5 text-center">
          {session?.user && (
            <div className="p-3.5 rounded-lg bg-black/30 border border-neutral-850 text-xs text-neutral-400 font-mono space-y-1">
              <p>Logged in as: <span className="text-neutral-200 font-semibold">{session.user.name || session.user.email}</span></p>
              {session.user.discordId && (
                <p>Discord ID: <span className="text-neutral-300">{session.user.discordId}</span></p>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="default"
              className="w-full h-11 bg-rose-600/90 hover:bg-rose-600 text-white font-semibold transition-all duration-200 gap-2.5 rounded-lg active:scale-[0.98]"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
            
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
              className="w-full h-11 border-neutral-850 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-50 transition-all duration-200 gap-2.5 rounded-lg active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back To Login
            </Button>
          </div>
        </CardContent>

        <CardFooter className="border-t border-neutral-900 bg-black/20 p-4 text-center text-xs text-neutral-500 rounded-b-xl flex items-center justify-center">
          Contact system admin to authorize your Discord ID.
        </CardFooter>
      </Card>
    </div>
  );
}
