"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, CheckSquare, ListChecks, Timer, Tornado, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/common/animated-number";

export interface StatCard {
  label: string;
  value: string;
  subtitle: string;
  tone: "blue" | "green" | "yellow" | "red" | "orange";
  icon: "decisions" | "actions" | "balance" | "waste" | "drift";
  trend?: { change: number; direction: "up" | "down" } | null;
}

const ICONS = {
  decisions: CheckSquare,
  actions: ListChecks,
  balance: Users,
  waste: Timer,
  drift: Tornado,
};

const TONES = {
  blue: "text-brand",
  green: "text-success",
  yellow: "text-warning",
  red: "text-danger",
  orange: "text-orange",
};

const ICON_BG = {
  blue: "bg-brand/10",
  green: "bg-success/10",
  yellow: "bg-warning/10",
  red: "bg-danger/10",
  orange: "bg-orange/10",
};

/** If the value is a plain integer (e.g. "7"), animate it as a count-up. Otherwise render as-is. */
function StatValue({ value }: { value: string }) {
  const asNumber = /^\d+$/.test(value.trim()) ? Number(value) : null;
  if (asNumber === null) {
    return <p className="font-display text-2xl font-semibold tabular-nums text-white">{value}</p>;
  }
  return (
    <p className="font-display text-2xl font-semibold tabular-nums text-white">
      <AnimatedNumber value={asNumber} duration={0.9} />
    </p>
  );
}

export function StatsRow({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat, i) => {
        const Icon = ICONS[stat.icon];
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2 }}
            className="card-surface"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs text-muted">{stat.label}</span>
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg", ICON_BG[stat.tone])}>
                <Icon size={14} className={TONES[stat.tone]} />
              </span>
            </div>
            <StatValue value={stat.value} />
            <p className={cn("mt-1 flex items-center gap-1 text-[11px]", TONES[stat.tone])}>
              {stat.trend ? (
                stat.trend.direction === "up" ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )
              ) : null}
              {stat.subtitle}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
