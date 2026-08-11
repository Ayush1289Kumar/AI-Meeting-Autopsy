import { EmptyState } from "@/components/common/empty-state";
import { Card, CardHeader } from "@/components/ui/card";
import { GroupedBarChart } from "@/components/charts/bar-chart";
import { SpeakerDrilldown } from "@/components/speakers/speaker-drilldown";
import { resolvePageMeeting } from "@/lib/page-data";
import { formatDuration, formatTimestamp, initials } from "@/lib/utils";
import { speakingBalanceRating } from "@/services/meeting.service";

export const dynamic = "force-dynamic";

export default async function SpeakersPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolvePageMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  const balance = speakingBalanceRating(meeting);
  const idealPct = meeting.participants.length ? 100 / meeting.participants.length : 0;

  const chartData = meeting.participants.map((participant) => ({
    label: participant.name,
    actual: Math.round(participant.speakingPct ?? 0),
    ideal: Math.round(idealPct),
  }));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {meeting.participants.map((participant) => {
          const decisions = meeting.decisions.filter((decision) => decision.owner === participant.name).length;
          const actions = meeting.actionItems.filter((item) => item.owner === participant.name).length;
          return (
            <Card key={participant.id}>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: participant.color ?? "#4f7cff" }}
                >
                  {initials(participant.name)}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{participant.name}</p>
                  <p className="text-xs text-muted">
                    {formatDuration(participant.speakingTime ?? 0)} ({(participant.speakingPct ?? 0).toFixed(0)}%)
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white/5 p-2">
                  <dt className="text-muted">Decisions</dt>
                  <dd className="text-sm font-semibold text-white">{decisions}</dd>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <dt className="text-muted">Actions</dt>
                  <dd className="text-sm font-semibold text-white">{actions}</dd>
                </div>
                <div className="rounded-lg bg-white/5 p-2">
                  <dt className="text-muted">Sentiment</dt>
                  <dd className="text-sm font-semibold capitalize text-white">{participant.sentiment ?? "neutral"}</dd>
                </div>
              </dl>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader
          title={`Speaking Balance — ${balance.rating}`}
          info="Actual share of speaking time per person versus an even split. Rating uses the Gini coefficient of speaking times."
        />
        <GroupedBarChart
          data={chartData}
          bars={[
            { key: "actual", color: "#4f7cff", name: "Actual %" },
            { key: "ideal", color: "#2a2b3d", name: "Ideal %" },
          ]}
        />
      </Card>

      <Card>
        <CardHeader title="Speaker Timeline" info="When each participant spoke across the meeting." />
        <div className="space-y-2">
          {meeting.participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-xs text-muted">{participant.name}</span>
              <div className="relative h-4 flex-1 overflow-hidden rounded bg-white/5">
                {meeting.transcript
                  .filter((segment) => segment.speaker === participant.name)
                  .map((segment) => (
                    <span
                      key={segment.id}
                      title={`${formatTimestamp(segment.startTime)} – ${formatTimestamp(segment.endTime)}`}
                      className="absolute top-0 h-full"
                      style={{
                        left: `${(segment.startTime / Math.max(meeting.duration, 1)) * 100}%`,
                        width: `${Math.max(0.4, ((segment.endTime - segment.startTime) / Math.max(meeting.duration, 1)) * 100)}%`,
                        backgroundColor: participant.color ?? "#4f7cff",
                      }}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <SpeakerDrilldown
        participants={meeting.participants.map((participant) => participant.name)}
        segments={meeting.transcript.map((segment) => ({
          id: segment.id,
          speaker: segment.speaker,
          text: segment.text,
          startTime: segment.startTime,
        }))}
        decisions={meeting.decisions.map((decision) => ({
          id: decision.id,
          text: decision.text,
          owner: decision.owner,
        }))}
        actionItems={meeting.actionItems.map((item) => ({ id: item.id, task: item.task, owner: item.owner }))}
      />
    </div>
  );
}
