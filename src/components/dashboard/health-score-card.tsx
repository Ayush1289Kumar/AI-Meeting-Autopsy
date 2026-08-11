import { Card, CardHeader } from "@/components/ui/card";
import { GaugeChart } from "@/components/charts/gauge-chart";
import { healthColor, healthLabel } from "@/lib/constants";
import { Activity } from "lucide-react";

export function HealthScoreCard({ score, percentile }: { score: number; percentile: number | null }) {
  return (
    <Card>
      <CardHeader
        title="Meeting Health Score"
        icon={<Activity size={15} className="text-brand" />}
        info="A weighted score: decision clarity 20%, action item quality 20%, speaking balance 15%, time efficiency 15%, topic coverage 10%, engagement 10%, duration 10%."
      />
      <GaugeChart score={score} color={healthColor(score)} />
      <p className="text-center text-sm font-semibold" style={{ color: healthColor(score) }}>
        {healthLabel(score)}
      </p>
      <p className="mt-1 text-center text-xs text-muted">
        {percentile === null ? "First meeting analyzed" : `Better than ${Math.round(percentile)}% of your meetings`}
      </p>
    </Card>
  );
}
