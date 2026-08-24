"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BarChart3,
  FileBarChart,
  FolderKanban,
  Gauge,
  ListChecks,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/meeting-autopsy", label: "Meetings", icon: FolderKanban },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/action-items", label: "Actions", icon: ListChecks },
  { href: "/speakers", label: "Team", icon: Users },
  { href: "/topics-timeline", label: "Analytics", icon: BarChart3 },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const meetingId = useSearchParams().get("meeting");

  return (
    <nav className="glass-panel fixed inset-x-0 bottom-0 z-40 flex justify-around border-t py-2 md:hidden">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={`mob-${item.href}`}
            href={meetingId ? `${item.href}?meeting=${meetingId}` : item.href}
            aria-label={item.label}
            className={cn(
              "flex flex-col items-center gap-1 px-2 text-[10px] transition-colors",
              active ? "text-brand drop-shadow-[0_0_6px_rgba(139,92,246,0.8)]" : "text-muted"
            )}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}