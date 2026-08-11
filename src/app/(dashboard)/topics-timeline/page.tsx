import { EmptyState } from "@/components/common/empty-state";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ValueAreaChart } from "@/components/charts/area-chart";
import { TOPIC_COLORS } from "@/lib/constants";
import { resolvePageMeeting } from "@/lib/page-data";
import { formatDuration, formatTimestamp } from "@/lib/utils";
import { driftTime, wastedTime } from "@/services/meeting.service";

export const dynamic = "force-dynamic";

function parsePoints(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export default async function TopicsTimelinePage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolvePageMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  const total = Math.max(meeting.duration, 1);
  const drift = driftTime(meeting);
  const waste = wastedTime(meeting);

  const series = Array.from({ length: 25 }, (_, index) => {
    const at = Math.round((index * total) / 24);
    const band = meeting.wasteSegments.find((segment) => at >= segment.startTime && at <= segment.endTime);
    return { label: formatTimestamp(at), value: Math.round((band ? band.valueLevel : 0.85) * 100) };
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Full Timeline" info="Each topic as a proportional band; drift segments are striped red." />
        <div className="flex h-10 w-full overflow-hidden rounded-lg">
          {meeting.topics.map((topic, index) => (
            <div
              key={topic.id}
              title={`${topic.name} · ${formatTimestamp(topic.startTime)}–${formatTimestamp(topic.endTime)}`}
              className="flex items-center justify-center text-[10px] text-white/90"
              style={{
                width: `${(topic.duration / total) * 100}%`,
                backgroundColor: topic.isDrift ? "#ef4444" : TOPIC_COLORS[index % TOPIC_COLORS.length],
                backgroundImage: topic.isDrift
                  ? "repeating-linear-gradient(45deg, rgba(0,0,0,0.25) 0 6px, transparent 6px 12px)"
                  : undefined,
              }}
            >
              {topic.duration / total > 0.08 ? topic.name : ""}
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[11px] text-muted">
          <span>0:00</span>
          <span>{formatTimestamp(total)}</span>
        </div>
      </Card>

      <Card>
        <CardHeader title="Meeting Value Over Time" info="Low points mark wasted or off-topic time." />
        <ValueAreaChart data={series} height={200} />
        <p className="mt-2 text-xs text-danger">
          Total wasted time: {formatDuration(waste)} ({Math.round((waste / total) * 100)}%) · Drift: {formatDuration(drift)}
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {meeting.topics.map((topic) => {
          const topicDecisions = meeting.decisions.filter(
            (decision) => decision.timestamp >= topic.startTime && decision.timestamp <= topic.endTime
          );
          return (
            <Card key={topic.id}>
              <CardHeader
                title={topic.name}
                action={
                  <div className="flex gap-2">
                    {topic.isDrift ? <Badge tone="red">Drift</Badge> : null}
                    <Badge tone={topic.valueRating === "high" ? "green" : topic.valueRating === "low" ? "red" : "yellow"}>
                      {topic.valueRating ?? "medium"} value
                    </Badge>
                  </div>
                }
              />
              <p className="text-xs text-muted">
                {formatTimestamp(topic.startTime)} – {formatTimestamp(topic.endTime)} · {formatDuration(topic.duration)}
              </p>
              <ul className="mt-3 space-y-1 text-sm text-white">
                {parsePoints(topic.keyPoints).map((point, index) => (
                  <li key={index}>• {point}</li>
                ))}
              </ul>
              {topicDecisions.length ? (
                <p className="mt-3 text-xs text-brand">
                  {topicDecisions.length} decision{topicDecisions.length > 1 ? "s" : ""} made during this topic
                </p>
              ) : null}
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader title="Drift / Off-Topic Segments" />
        {meeting.wasteSegments.length ? (
          <ul className="space-y-2 text-sm">
            {meeting.wasteSegments.map((segment) => (
              <li key={segment.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
                <span className="text-white">{segment.description ?? segment.type.replace("_", " ")}</span>
                <span className="text-xs text-muted">
                  {formatTimestamp(segment.startTime)} – {formatTimestamp(segment.endTime)} ·{" "}
                  {formatDuration(segment.endTime - segment.startTime)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">No off-topic segments detected.</p>
        )}
      </Card>
    </div>
  );
}
