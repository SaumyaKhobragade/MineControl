"use client";

import * as React from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const name = session.user.name || session.user.email || "User";
  const avatarUrl = session.user.image;

  return (
    <div className="relative" ref={menuRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-neutral-800/10 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-800/20 dark:hover:border-neutral-800 transition-all focus:outline-none cursor-pointer shrink-0"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={name}
            className="w-7 h-7 rounded-full border border-border object-cover animate-in fade-in duration-300"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold uppercase shrink-0">
            {name.charAt(0)}
          </div>
        )}
        <span className="text-sm font-semibold text-foreground/90 hidden sm:inline-block">
          {name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Floating Menu Card */}
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-56 bg-white/95 dark:bg-neutral-900/95 border-border backdrop-blur-md shadow-xl py-2 z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 rounded-lg">
          <div className="px-4 py-2 border-b border-border flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground/60 uppercase tracking-wider font-semibold">Logged In As</span>
            <span className="text-sm font-semibold text-foreground truncate">{name}</span>
            {session.user.discordId && (
              <span className="text-[10px] text-muted-foreground/80 font-mono mt-0.5 truncate">
                ID: {session.user.discordId}
              </span>
            )}
          </div>
          
          <div className="p-1">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-xs font-semibold hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 text-rose-500/90 gap-2 h-9"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
