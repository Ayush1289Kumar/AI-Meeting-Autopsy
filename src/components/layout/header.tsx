"use client";

import { useState } from "react";
import { initials } from "@/lib/utils";

export function Header({ userName }: { userName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const first = userName?.trim() ? userName.split(" ")[0] : "Buddy";

  return (
    <header className="glass-panel sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b px-4 py-3 md:px-6">
      {/* Right controls */}
      <div className="ml-auto flex items-center gap-2">
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
