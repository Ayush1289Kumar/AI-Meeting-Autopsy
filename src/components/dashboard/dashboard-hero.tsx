"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AIOrbit } from "@/components/dashboard/ai-orbit";
import { AnimatedNumber } from "@/components/common/animated-number";
import { AnimatedMetric } from "@/components/common/animated-metric";
import { healthColor, healthLabel } from "@/lib/constants";

export interface HeroStat {
  label: string;
  value: string;
  tone: "green" | "blue" | "orange" | "red";
}

const TONE_TEXT: Record<HeroStat["tone"], string> = {
  green: "text-success",
  blue: "text-brand",
  orange: "text-orange",
  red: "text-danger",
};

export function DashboardHero({
  title,
  meta,
  score,
  diagnosis,
  diagnosisHref,
  stats,
}: {
  title: string;
  meta: string;
  score: number;
  diagnosis: string[];
  diagnosisHref: string;
  stats: HeroStat[];
}) {
  const color = healthColor(score);

  return (
    <motion.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card-surface flex flex-col"
    >
      <div className="mb-1">
        <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-xs text-muted">{meta}</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-around">
        <div className="relative flex h-48 w-48 shrink-0 items-center justify-center sm:h-52 sm:w-52">
          <AIOrbit color={color} className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none relative flex flex-col items-center">
            <span
              className="font-display text-5xl font-bold tabular-nums text-white"
              style={{ textShadow: `0 0 24px ${color}44` }}
            >
              <AnimatedNumber value={score} />
            </span>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted">
              Meeting Health
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
              {healthLabel(score)}
            </span>
          </div>
        </div>

        <div className="w-full max-w-xs rounded-lg border border-border bg-white/[0.03] p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-brand-2">AI Diagnosis</p>
          <ul className="space-y-1.5 text-sm leading-snug text-white">
            {diagnosis.map((line, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
              >
                {line}
              </motion.li>
            ))}
          </ul>
          <Link href={diagnosisHref} className="mt-2 inline-block text-xs font-medium text-brand-2 hover:underline">
            View full diagnosis →
          </Link>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.06 }}
            className="rounded-lg border border-border bg-white/[0.02] px-3 py-2.5"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted">{stat.label}</p>
            <p className={`mt-1 font-display text-xl font-semibold tabular-nums ${TONE_TEXT[stat.tone]}`}>
              <AnimatedMetric value={stat.value} />
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
