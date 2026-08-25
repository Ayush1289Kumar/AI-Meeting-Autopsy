"use client";

import dynamic from "next/dynamic";

/**
 * The cinematic intro overlay (3.9s animation) plays once on dashboard entry.
 * It is purely decorative, so it's code-split and never blocks hydration of
 * the actual dashboard content.
 */
export const MeetingIntroLazy = dynamic(
  () => import("@/components/intro/MeetingIntro").then((m) => m.MeetingIntro),
  { ssr: false }
);
