import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/lazy";
import { TOPIC_COLORS } from "@/lib/constants";
import { formatDuration, formatTimestamp } from "@/lib/utils";

export interface TopicSlice {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  isDrift: boolean;
}

export function TopicsTimelineChart({
  topics,
  totalDuration,
  driftTime,
  href,
}: {
  topics: TopicSlice[];
  totalDuration: number;
  driftTime: number;
  href: string;
}) {
  const data = topics.map((topic, index) => ({
    name: topic.name,
    value: Math.max(topic.duration, 1),
    color: topic.isDrift ? "#f87171" : TOPIC_COLORS[index % TOPIC_COLORS.length],
    label: formatDuration(topic.duration),
  }));

  const driftPct = totalDuration ? Math.round((driftTime / totalDuration) * 100) : 0;

  return (
    <Card>
      <CardHeader
        title="Topics Timeline"
        info="How the meeting time was distributed across topics. Segments classified as drift are shown in red."
      />
      <DonutChart data={data} centerTop={formatDuration(totalDuration)} centerBottom="total" />
      <ul className="mt-3 space-y-2">
        {topics.map((topic, index) => (
          <li key={topic.id} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: topic.isDrift ? "#f87171" : TOPIC_COLORS[index % TOPIC_COLORS.length] }}
            />
            <span className="flex-1 text-white">{topic.name}</span>
            <span className="text-muted">
              {formatTimestamp(topic.startTime)} – {formatTimestamp(topic.endTime)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-danger">
        Off-topic / drift: {formatDuration(driftTime)} ({driftPct}%)
      </p>
      <CardFooterLink href={href} label="View Full Timeline" />
    </Card>
  );
}
