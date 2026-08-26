"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Stethoscope, Gauge, FolderKanban, FileBarChart, ListChecks, Users, BarChart3, Plug, Settings } from "lucide-react";
import { CopilotCard } from "@/components/dashboard/showcase/co-pilot-card";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/meeting-autopsy", label: "Meetings", icon: FolderKanban },
  { href: "/reports", label: "Autopsy Reports", icon: FileBarChart },
  { href: "/action-items", label: "Action Items", icon: ListChecks },
  { href: "/speakers", label: "Team Insights", icon: Users },
  { href: "/topics-timeline", label: "Analytics", icon: BarChart3 },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const meetingId = useSearchParams().get("meeting");
  const withMeeting = (href: string) => (meetingId ? `${href}?meeting=${meetingId}` : href);

  return (
    <aside className="glass-panel z-20 flex w-56 shrink-0 flex-col overflow-y-auto border-r px-4 py-5 md:flex">
      {/* Brand */}
      <Link href={withMeeting("/dashboard")} className="mb-4 block rounded-lg px-2">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-[0_0_20px_-4px_rgba(139,92,246,0.95)]">
            <Stethoscope size={18} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
          </span>
          <span className="leading-tight">
            <p className="font-display text-sm font-bold leading-tight tracking-tight text-white">AI Meeting Autopsy</p>
            <p className="text-[11px] text-muted">Analyze. Diagnose. Improve.</p>
          </span>
        </div>
      </Link>

      {/* Main navigation */}
      <nav aria-label="Main navigation" className="mb-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={withMeeting(item.href)}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                size={17}
                className={cn("shrink-0 transition-colors", active ? "text-brand" : "text-muted group-hover:text-white/80")}
              />
              <span className="truncate">{item.label}</span>
              {active ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand shadow-[0_0_8px_rgba(139,92,246,0.95)]" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Co-Pilot */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <CopilotCard />
      </div>
    </aside>
  );
}

export function MobileNav() {
  return null;
}
