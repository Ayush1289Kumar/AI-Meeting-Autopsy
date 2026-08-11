"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-[#12131c] px-3 py-5 md:flex">
      <Link href={withMeeting("/dashboard")} className="mb-6 block px-2">
        <p className="text-sm font-semibold leading-tight text-white">AI Meeting Autopsy</p>
        <p className="text-[11px] text-muted">Analyze. Diagnose. Improve.</p>
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-brand/15 text-white" : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={16} />
              <span className="flex-1">{item.label}</span>
              {badge ? (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white">{badge}</span>
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
    <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-[#12131c] py-2 md:hidden">
      {NAV.slice(0, 5).map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={meetingId ? `${item.href}?meeting=${meetingId}` : item.href}
            aria-label={item.label}
            className={cn("flex flex-col items-center gap-1 px-2 text-[10px]", active ? "text-brand" : "text-muted")}
          >
            <Icon size={18} />
            {item.label.split(" ")[0]}
          </Link>
        );
      })}
    </nav>
  );
}
