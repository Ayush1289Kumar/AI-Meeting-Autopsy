"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  FileText,
  Gavel,
  ListChecks,
  Users,
  Waves,
  LineChart,
  Settings2,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  stethoscope: Stethoscope,
  transcript: FileText,
  gavel: Gavel,
  "list-checks": ListChecks,
  users: Users,
  waves: Waves,
  "line-chart": LineChart,
  settings: Settings2,
} satisfies Record<string, LucideIcon>;

export type PageHeroIcon = keyof typeof ICONS;

export function PageHero({
  icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: PageHeroIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const Icon = ICONS[icon];
  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="noise-overlay relative overflow-hidden rounded-card border border-border bg-gradient-to-br from-white/[0.04] to-white/[0.01] px-6 py-6 shadow-glass backdrop-blur-xl sm:px-8 sm:py-7"
    >
      <div className="relative z-10 flex items-center gap-4">
        <motion.span
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow-brand sm:h-14 sm:w-14"
        >
          <Icon size={22} className="text-white" />
          <span className="absolute inset-0 -z-10 animate-drift rounded-2xl bg-brand-gradient opacity-40 blur-xl" />
        </motion.span>
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-brand-2">{eyebrow}</span>
          <h2 className="font-display text-xl font-medium leading-tight text-white sm:text-2xl">{title}</h2>
          <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
        </div>
      </div>

      {/* ambient accent line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
    </motion.section>
  );
}
