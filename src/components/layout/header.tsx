"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Moon, Search } from "lucide-react";
import { initials } from "@/lib/utils";

export function Header({ userName }: { userName: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const first = userName?.trim() ? userName.split(" ")[0] : "Buddy";

  return (
    <header className="glass-panel sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b px-4 py-3 md:px-6">
      {/* Global search — row stays in place, the search itself is centred */}
      <div className="flex min-w-0 flex-1 justify-center">
        <div className="relative w-full max-w-xl">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search meetings, people, topics..."
            aria-label="Search"
            className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.04] pl-9 pr-16 text-sm text-white placeholder:text-muted transition-colors focus:border-brand/50 focus:bg-white/[0.05] focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted">
            Ctrl&nbsp;K
          </kbd>
        </div>
      </div>

      {/* Right controls */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-white/20 hover:text-white"
        >
          <Bell size={16} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_2px_rgba(34,211,238,0.8)] animate-pulse-glow" />
        </button>

        <button
          type="button"
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-white/20 hover:text-white"
        >
          <Moon size={16} />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-white/10 sm:block" />

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 pr-3 transition-colors hover:border-white/20"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-xs font-bold text-white shadow-[0_0_14px_-3px_rgba(139,92,246,0.8)]">
            {initials(first)}
          </span>
          <span className="hidden text-left leading-tight lg:block">
            <span className="block text-sm font-semibold text-white">Hi, {first}</span>
            <span className="block text-[11px] text-muted">Product Team</span>
          </span>
        </button>

        {menuOpen ? (
          <div className="absolute right-4 top-14 z-40 w-44 rounded-lg border border-white/10 glass-panel p-1 shadow-xl">
            <a href="/settings" className="block rounded px-3 py-2 text-sm text-white hover:bg-white/5">
              Settings
            </a>
            <a href="/api/auth/logout" className="block rounded px-3 py-2 text-sm text-white hover:bg-white/5">
              Sign out
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
