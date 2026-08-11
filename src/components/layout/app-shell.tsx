"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Sidebar, MobileNav } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export interface ShellMeeting {
  id: string;
  title: string;
  date: string;
  decisions: number;
  actionItems: number;
}

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "AI-powered insights from your meeting" },
  "/meeting-autopsy": { title: "Meeting Autopsy", subtitle: "The full diagnosis of what happened" },
  "/transcript": { title: "Transcript", subtitle: "Search, filter and inspect what was said" },
  "/decisions": { title: "Decisions", subtitle: "Every decision extracted from the meeting" },
  "/action-items": { title: "Action Items", subtitle: "Follow-ups, owners and due dates" },
  "/speakers": { title: "Speakers", subtitle: "Who spoke, how much, and about what" },
  "/topics-timeline": { title: "Topics Timeline", subtitle: "How meeting time was spent" },
  "/reports": { title: "Reports", subtitle: "Trends across your meeting history" },
  "/settings": { title: "Settings", subtitle: "Profile, AI configuration and appearance" },
};

function ShellInner({
  meetings,
  userName,
  children,
}: {
  meetings: ShellMeeting[];
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const requested = useSearchParams().get("meeting");
  const active = meetings.find((meeting) => meeting.id === requested) ?? meetings[0];
  const meta = PAGE_META[pathname] ?? { title: "AI Meeting Autopsy", subtitle: "Analyze. Diagnose. Improve." };

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar counts={{ decisions: active?.decisions ?? 0, actionItems: active?.actionItems ?? 0 }} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={`${meta.subtitle}${active ? ` — ${active.title}` : ""}`}
          meetings={meetings.map(({ id, title, date }) => ({ id, title, date }))}
          activeMeetingId={active?.id}
          userName={userName}
        />
        <main className="flex-1 px-4 pb-24 pt-5 md:px-6 md:pb-8">{children}</main>
        <MobileNav />
      </div>
    </div>
  );
}

export function AppShell(props: { meetings: ShellMeeting[]; userName: string; children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <ShellInner {...props} />
    </Suspense>
  );
}
