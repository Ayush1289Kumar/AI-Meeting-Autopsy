import { ArrowDownRight, ArrowUpRight, CheckSquare, ListChecks, Timer, Tornado, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
  blue: "text-blue",
  green: "text-success",
  yellow: "text-warning",
  red: "text-danger",
  orange: "text-orange",
};

/* Flat translucent icon-chip fills (kept subtle — no hard gradients) */
const CHIP = {
  blue: "bg-blue/15",
  green: "bg-success/15",
  yellow: "bg-warning/15",
  red: "bg-danger/15",
  orange: "bg-orange/15",
};

const GLOW = {
  blue: "shadow-[0_0_20px_-6px_rgba(61,139,255,0.7)]",
  green: "shadow-[0_0_20px_-6px_rgba(16,185,129,0.7)]",
  yellow: "shadow-[0_0_20px_-6px_rgba(245,185,75,0.55)]",
  red: "shadow-[0_0_20px_-6px_rgba(248,113,113,0.6)]",
  orange: "shadow-[0_0_20px_-6px_rgba(251,176,100,0.6)]",
};

export function StatsRow({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = ICONS[stat.icon];
        return (
          <div key={stat.label} className="card-surface overflow-hidden">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${CHIP[stat.tone]} ${GLOW[stat.tone]}`}
                >
                  <Icon size={15} className={TONES[stat.tone]} />
                </span>
                <span className="text-xs font-medium text-muted">{stat.label}</span>
              </span>
            </div>
            <p
              className={`font-display text-2xl font-bold tabular-nums tracking-tight ${TONES[stat.tone]} drop-shadow-[0_0_14px_rgba(255,255,255,0.18)]`}
            >
              {stat.value}
            </p>
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
          </div>
        );
      })}
    </div>
  );
}
