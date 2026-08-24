"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Download, Settings as SettingsIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeetingSelector, type MeetingOption } from "@/components/meeting/meeting-selector";
import { initials } from "@/lib/utils";

// Loaded on demand — the upload form (with its file/text/url modes and
// processing-status UI) isn't needed until the user actually opens it, so
// keeping it out of the header's initial bundle shaves JS off every page.
const UploadDialog = dynamic(
  () => import("@/components/meeting/upload-dialog").then((mod) => mod.UploadDialog),
  { ssr: false }
);

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
  const [uploadTouched, setUploadTouched] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-canvas/70 px-4 py-3 backdrop-blur-xl md:px-6">
      <div>
        <h1 className="font-display text-lg font-semibold tracking-tight text-white">{title}</h1>
        <p className="text-xs text-muted">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {meetings.length > 0 ? <MeetingSelector meetings={meetings} activeMeetingId={activeMeetingId} /> : null}

        <Button
          onClick={() => {
            setUploadTouched(true);
            setUploadOpen(true);
          }}
        >
          <Sparkles size={15} />
          Upload New Meeting
        </Button>

        {activeMeetingId ? (
          <a
            href={`/api/meetings/${activeMeetingId}/export?format=pdf`}
            target="_blank"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm text-white backdrop-blur-xl transition-all hover:border-border-strong hover:bg-card-hover"
          >
            <Download size={15} />
            Export Report
          </a>
        ) : null}

        <Link
          href="/settings"
          aria-label="Settings"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted backdrop-blur-xl transition-all hover:border-border-strong hover:text-white"
        >
          <SettingsIcon size={16} />
        </Link>

        <div className="relative">
          <button
            type="button"
            aria-label="Account menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-glow-soft transition-transform hover:scale-105"
          >
            {initials(userName)}
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-11 w-44 animate-fade-up rounded-lg border border-border bg-canvas-elevated/95 p-1 shadow-glass backdrop-blur-xl">
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

      {uploadTouched ? <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} /> : null}
    </header>
  );
}
