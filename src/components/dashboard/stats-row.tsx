import Link from "next/link";
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

/** Deep-dive route each stat card links to when clicked. */
const LINKS: Record<StatCard["icon"], string> = {
  decisions: "/decisions",
  actions: "/action-items",
  balance: "/speakers",
  waste: "/topics-timeline",
  drift: "/topics-timeline",
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
          <Link
            key={stat.label}
            href={LINKS[stat.icon]}
            className="card-surface group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:ring-1 hover:ring-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
          >
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
            {/* Trend is secondary info — rendered in a lighter muted tone */}
            <p className={cn("mt-1 flex items-center gap-1 text-[11px] text-muted transition-colors group-hover:text-white/70")}>
              {stat.trend ? (
                <span className={TONES[stat.tone]}>
                  {stat.trend.direction === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </span>
              ) : null}
              {stat.subtitle}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
