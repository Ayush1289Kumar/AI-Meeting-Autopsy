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
  blue: "text-brand",
  green: "text-success",
  yellow: "text-warning",
  red: "text-danger",
  orange: "text-orange",
};

export function StatsRow({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = ICONS[stat.icon];
        return (
          <div key={stat.label} className="card-surface">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted">{stat.label}</span>
              <Icon size={15} className={TONES[stat.tone]} />
            </div>
            <p className="text-xl font-semibold text-white">{stat.value}</p>
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
