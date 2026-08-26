"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Stethoscope, Gauge, FolderKanban, FileBarChart, ListChecks, Users, BarChart3, Plug, Settings } from "lucide-react";
import { initials, cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/meeting-autopsy", label: "Meetings", icon: FolderKanban },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/action-items", label: "Actions", icon: ListChecks },
  { href: "/speakers", label: "Insights", icon: Users },
  { href: "/topics-timeline", label: "Analytics", icon: BarChart3 },
  { href: "/integrations", label: "Integrations", icon: Plug },
];

export function Header({ userName }: { userName: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const meetingId = useSearchParams().get("meeting");
  const withMeeting = (href: string) => (meetingId ? `${href}?meeting=${meetingId}` : href);

  const first = userName?.trim() ? userName.split(" ")[0] : "Buddy";

  return (
    <header className="sticky top-4 z-40 mx-4 md:mx-auto md:max-w-7xl flex items-center justify-between gap-3 lg:gap-6 rounded-full border border-white/10 bg-white/5 px-4 lg:px-6 py-2 lg:py-3 shadow-lg backdrop-blur-xl transition-all">
      {/* Brand (Left) */}
      <Link href={withMeeting("/dashboard")} className="flex shrink-0 items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-[0_0_12px_-3px_rgba(139,92,246,0.8)]">
          <Stethoscope size={16} className="text-white" />
        </span>
        <span className="hidden lg:block font-display text-sm font-bold leading-tight tracking-tight text-white">
          AI Autopsy
        </span>
      </Link>

      {/* Main Nav (Center) */}
      <nav aria-label="Main navigation" className="hidden md:flex min-w-0 flex-1 items-center justify-center gap-2 lg:gap-6 overflow-x-auto no-scrollbar px-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={withMeeting(item.href)}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-200",
                active
                  ? "bg-brand/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                size={14}
                className={cn("shrink-0 transition-colors", active ? "text-brand" : "text-muted group-hover:text-white/80")}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right controls */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1 pr-3 transition-colors hover:border-white/20"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-accent text-[11px] font-bold text-white shadow-[0_0_10px_-3px_rgba(139,92,246,0.8)]">
            {initials(first)}
          </span>
          <span className="hidden text-left leading-tight lg:block">
            <span className="block text-[13px] font-semibold text-white">{first}</span>
          </span>
        </button>

        {menuOpen ? (
          <div className="absolute right-4 top-14 w-44 rounded-xl border border-white/10 bg-card/90 p-1 shadow-xl backdrop-blur-xl">
            <a href="/settings" className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
              Settings
            </a>
            <a href="/api/auth/logout" className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10">
              Sign out
            </a>
          </div>
        ) : null}
      </div>
    </header>
  );
}
