import { Card, CardHeader } from "@/components/ui/card";
import { GaugeChart } from "@/components/charts/lazy";
import { healthColor, healthLabel } from "@/lib/constants";
import { Activity } from "lucide-react";

export function HealthScoreCard({ score, percentile }: { score: number; percentile: number | null }) {
  const color = healthColor(score);
  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Meeting Health Score"
        icon={<Activity size={15} className="text-brand" />}
        info="A weighted score: decision clarity 20%, action item quality 20%, speaking balance 15%, time efficiency 15%, topic coverage 10%, engagement 10%, duration 10%."
      />
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: color, opacity: 0.18 }}
        />
        <GaugeChart score={score} color={color} />
      </div>
      <p
        className="text-center text-sm font-semibold uppercase tracking-wide"
        style={{ color, textShadow: `0 0 18px ${color}66` }}
      >
        {healthLabel(score)}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        {percentile === null ? "First meeting analyzed" : `Better than ${Math.round(percentile)}% of your meetings`}
      </p>
    </Card>
  );
}
