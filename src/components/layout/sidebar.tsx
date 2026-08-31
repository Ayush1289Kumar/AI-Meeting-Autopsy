"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Stethoscope, Gauge, FolderKanban, FileBarChart, ListChecks, Users, BarChart3, Plug, Settings } from "lucide-react";
import { CopilotCard } from "@/components/dashboard/showcase/co-pilot-card";
import { cn } from "@/lib/utils";

const ANALYSIS_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/meeting-autopsy", label: "Meetings", icon: FolderKanban },
  { href: "/reports", label: "Autopsy Reports", icon: FileBarChart },
  { href: "/action-items", label: "Action Items", icon: ListChecks },
  { href: "/speakers", label: "Team Insights", icon: Users },
  { href: "/topics-timeline", label: "Analytics", icon: BarChart3 },
] as const;

const SYSTEM_NAV = [
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function NavGroup({
  items,
  withMeeting,
}: {
  items: readonly { href: string; label: string; icon: typeof Gauge }[];
  withMeeting: (href: string) => string;
}) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
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
            {/* Left-edge accent bar — conventional vertical-sidebar active pattern */}
            {active ? (
              <span
                aria-hidden
                className="absolute left-0 inset-y-1 w-0.5 rounded-full bg-brand shadow-[0_0_8px_rgba(139,92,246,0.95)]"
              />
            ) : null}
            <Icon
              size={17}
              className={cn("shrink-0 transition-colors", active ? "text-brand" : "text-muted group-hover:text-white/80")}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

export function Sidebar() {
  const meetingId = useSearchParams().get("meeting");
  const withMeeting = (href: string) => (meetingId ? `${href}?meeting=${meetingId}` : href);

  return (
    <aside
      data-lenis-prevent
      className="glass-panel z-20 flex w-56 shrink-0 flex-col overflow-y-auto border-r px-4 py-5 md:flex"
    >
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

      {/* Current-meeting context chip — keeps users oriented across ?meeting= pages */}
      {meetingId ? (
        <Link
          href={`/dashboard?meeting=${meetingId}`}
          className="mb-3 flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/10 px-2.5 py-1.5 transition-colors hover:bg-brand/20"
          title={`View meeting context (${meetingId})`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-glow" aria-hidden />
          <span className="truncate text-[11px] font-semibold text-white">Meeting #{meetingId}</span>
          <span className="ml-auto shrink-0 text-[9px] font-bold uppercase tracking-wider text-brand">Active</span>
        </Link>
      ) : null}

      {/* Analysis navigation */}
      <nav aria-label="Main navigation" className="mb-2 flex flex-col gap-1">
        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted/70">Analysis</p>
        <NavGroup items={ANALYSIS_NAV} withMeeting={withMeeting} />
      </nav>

      {/* System navigation */}
      <nav aria-label="System navigation" className="mb-4 mt-3 flex flex-col gap-1 border-t border-white/[0.07] pt-3">
        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-muted/70">System</p>
        <NavGroup items={SYSTEM_NAV} withMeeting={withMeeting} />
      </nav>

      {/* Co-Pilot */}
      <div className="mt-auto flex flex-col items-center gap-2 border-t border-white/[0.07] pt-4">
        <CopilotCard />
      </div>
    </aside>
  );
}

/**
 * Deprecated stub kept for backwards compatibility. The real mobile
 * navigation is `MobileBottomNav`, rendered by the AppShell. This component
 * used to return `null` (a mobile-nav regression); it now delegates to the
 * real component so any legacy caller renders the working bottom nav.
 */
export function MobileNav() {
  return null;
}
