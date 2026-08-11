import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { ValueAreaChart } from "@/components/charts/area-chart";
import { formatDuration, formatTimestamp } from "@/lib/utils";

export interface WasteBand {
  startTime: number;
  endTime: number;
  type: string;
  description: string | null;
  valueLevel: number;
}

const BUCKETS = 24;

/** Samples the meeting into equal buckets and scores each by the waste overlapping it. */
function buildSeries(duration: number, waste: WasteBand[]) {
  if (!duration) return [];
  const size = duration / BUCKETS;
  return Array.from({ length: BUCKETS + 1 }, (_, index) => {
    const at = Math.round(index * size);
    const overlapping = waste.filter((band) => at >= band.startTime && at <= band.endTime);
    const value = overlapping.length
      ? Math.min(...overlapping.map((band) => band.valueLevel))
      : 0.85;
    return { label: formatTimestamp(at), value: Math.round(value * 100) };
  });
}

export function WasteHeatmapChart({
  duration,
  waste,
  wastedTime,
  href,
}: {
  duration: number;
  waste: WasteBand[];
  wastedTime: number;
  href: string;
}) {
  const series = buildSeries(duration, waste);
  const wastePct = duration ? Math.round((wastedTime / duration) * 100) : 0;

  return (
    <Card>
      <CardHeader
        title="Meeting Waste Heatmap"
        info="Estimated value of each moment of the meeting. Dips mark status updates, repeated discussions and off-topic stretches."
      />
      <ValueAreaChart data={series} />
      <ul className="mt-3 flex flex-wrap gap-2">
        {waste.slice(0, 4).map((band) => (
          <li key={`${band.type}-${band.startTime}`} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
            {band.description ?? band.type} · {formatTimestamp(band.startTime)}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-danger">
        Total wasted time: {formatDuration(wastedTime)} ({wastePct}%)
      </p>
      <CardFooterLink href={href} label="View Full Timeline" />
    </Card>
  );
}
