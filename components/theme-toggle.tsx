"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full border border-transparent shrink-0" />
    );
  }

  const getThemeIcon = (t: string | undefined) => {
    switch (t) {
      case "light":
        return <Sun className="w-4 h-4 text-amber-500" />;
      case "dark":
        return <Moon className="w-4 h-4 text-indigo-400" />;
      default:
        return <Monitor className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-800/20 border border-neutral-800/10 dark:border-neutral-800/30 hover:border-neutral-800/30 dark:hover:border-neutral-700/50 transition-all focus:outline-none cursor-pointer shrink-0"
        aria-label="Toggle theme"
      >
        {getThemeIcon(theme)}
      </button>

      {isOpen && (
        <Card className="absolute right-0 mt-2 w-32 bg-white/95 dark:bg-neutral-900/95 border-border backdrop-blur-md shadow-xl py-1 z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 rounded-lg">
          <button
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold w-full text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/40 ${
              theme === "light" ? "text-amber-500" : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Light
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold w-full text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/40 ${
              theme === "dark" ? "text-indigo-400" : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            Dark
          </button>
          <button
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold w-full text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/40 ${
              theme === "system" ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-500 dark:text-neutral-400"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            System
          </button>
        </Card>
      )}
    </div>
  );
}
