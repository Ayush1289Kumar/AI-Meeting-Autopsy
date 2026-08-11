"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/meeting/upload-dialog";
import { MeetingSelector, type MeetingOption } from "@/components/meeting/meeting-selector";
import { initials } from "@/lib/utils";

export function Header({
  title,
  subtitle,
  meetings,
  activeMeetingId,
  userName,
}: {
  title: string;
  subtitle: string;
  meetings: MeetingOption[];
  activeMeetingId?: string;
  userName: string;
}) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-canvas/95 px-4 py-3 backdrop-blur md:px-6">
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {meetings.length > 0 ? <MeetingSelector meetings={meetings} activeMeetingId={activeMeetingId} /> : null}

        <Button onClick={() => setUploadOpen(true)}>
          <Sparkles size={15} />
          Upload New Meeting
        </Button>

        {activeMeetingId ? (
          <a
            href={`/api/meetings/${activeMeetingId}/export?format=pdf`}
            target="_blank"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm text-white hover:bg-card-hover"
          >
            <Download size={15} />
            Export Report
          </a>
        ) : null}

        <Link
          href="/settings"
          aria-label="Settings"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted hover:text-white"
        >
          <SettingsIcon size={16} />
        </Link>

        <div className="relative">
          <button
            type="button"
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white"
          >
            {initials(userName)}
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-11 w-44 rounded-lg border border-border bg-card p-1 shadow-xl">
              <p className="px-3 py-2 text-xs text-muted">{userName}</p>
              <Link href="/settings" className="block rounded px-3 py-2 text-sm text-white hover:bg-white/5">
                Settings
              </Link>
              <a href="/api/auth/logout" className="block rounded px-3 py-2 text-sm text-white hover:bg-white/5">
                Sign out
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </header>
  );
}
