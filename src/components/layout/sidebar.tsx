"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckSquare,
  Gauge,
  ListChecks,
  Settings,
  Stethoscope,
  Timer,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/meeting-autopsy", label: "Meeting Autopsy", icon: Stethoscope },
  { href: "/transcript", label: "Transcript", icon: FileText },
  { href: "/decisions", label: "Decisions", icon: CheckSquare, badge: "decisions" },
  { href: "/action-items", label: "Action Items", icon: ListChecks, badge: "actionItems" },
  { href: "/speakers", label: "Speakers", icon: Users },
  { href: "/topics-timeline", label: "Topics Timeline", icon: Timer },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar({ counts }: { counts: { decisions: number; actionItems: number } }) {
  const pathname = usePathname();
  const meetingId = useSearchParams().get("meeting");
  const withMeeting = (href: string) => (meetingId ? `${href}?meeting=${meetingId}` : href);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white/[0.02] px-3 py-5 backdrop-blur-xl md:flex">
      <Link href={withMeeting("/dashboard")} className="mb-7 flex items-center gap-2.5 px-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient shadow-glow-soft">
          <Stethoscope size={15} className="text-white" />
        </span>
        <span>
          <p className="font-display text-[15px] font-semibold leading-tight text-white">AI Meeting Autopsy</p>
          <p className="text-[10.5px] tracking-wide text-muted">Analyze. Diagnose. Improve.</p>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          const badge = "badge" in item ? counts[item.badge as keyof typeof counts] : undefined;
          return (
            <Link
              key={item.href}
              href={withMeeting(item.href)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                active ? "text-white" : "text-muted hover:bg-white/[0.04] hover:text-white"
              )}
            >
              {active ? (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg border border-brand/25 bg-brand-gradient-soft shadow-glow-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              ) : null}
              <Icon size={16} className="relative z-10" />
              <span className="relative z-10 flex-1">{item.label}</span>
              {badge ? (
                <span className="relative z-10 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white">
                  {badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const meetingId = useSearchParams().get("meeting");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-canvas/80 py-2 backdrop-blur-xl md:hidden">
      {NAV.slice(0, 5).map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={meetingId ? `${item.href}?meeting=${meetingId}` : item.href}
            aria-label={item.label}
            className={cn(
              "flex flex-col items-center gap-1 px-2 text-[10px] transition-colors",
              active ? "text-brand" : "text-muted"
            )}
          >
            <Icon size={18} />
            {item.label.split(" ")[0]}
          </Link>
        );
      })}
    </nav>
  );
}
