"use client";

import { motion } from "framer-motion";
import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { SPEAKER_COLORS } from "@/lib/constants";

export interface SpeakerBar {
  id: string;
  name: string;
  speakingPct: number;
  color: string | null;
  isCurrentUser?: boolean;
}

export function SpeakingBalanceBars({ speakers, href }: { speakers: SpeakerBar[]; href: string }) {
  const sorted = [...speakers].sort((a, b) => b.speakingPct - a.speakingPct);

  return (
    <Card>
      <CardHeader title="Speaking Balance" subtitle="Contribution across participants" />
      <ul className="space-y-3">
        {sorted.map((speaker, i) => {
          const color = speaker.color ?? SPEAKER_COLORS[i % SPEAKER_COLORS.length];
          return (
            <li key={speaker.id} className="flex items-center gap-3 text-sm">
              <span className="w-20 shrink-0 truncate text-muted">
                {speaker.name}
                {speaker.isCurrentUser ? " (You)" : ""}
              </span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                <motion.span
                  className="block h-full rounded-full"
                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}55` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${speaker.speakingPct}%` }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                />
              </span>
              <span className="w-10 shrink-0 text-right font-medium text-white">
                {Math.round(speaker.speakingPct)}%
              </span>
            </li>
          );
        })}
      </ul>
      <CardFooterLink href={href} label="View Speaker Insights" />
    </Card>
  );
}
