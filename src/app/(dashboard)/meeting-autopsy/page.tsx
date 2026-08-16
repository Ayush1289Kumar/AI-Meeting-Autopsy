import { EmptyState } from "@/components/common/empty-state";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { resolveAutopsyMeeting } from "@/lib/page-data";
import { formatDuration } from "@/lib/utils";
import { healthColor } from "@/lib/constants";
import { previousMeeting, wastedTime } from "@/services/meeting.service";

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export default async function MeetingAutopsyPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolveAutopsyMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  const previous = await previousMeeting(meeting);
  const strengths = parseList(meeting.strengths);
  const weaknesses = parseList(meeting.weaknesses);
  const score = meeting.healthScore ?? 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Full AI Narrative Summary" />
        <div className="space-y-3 text-sm leading-relaxed text-muted">
          {(meeting.aiNarrative ?? meeting.aiSummary ?? "No narrative available.").split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Strengths" />
          <ul className="space-y-2 text-sm">
            {strengths.length ? (
              strengths.map((item) => (
                <li key={item} className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-success">
                  {item}
                </li>
              ))
            ) : (
              <li className="text-muted">No notable strengths detected.</li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Weaknesses" />
          <ul className="space-y-2 text-sm">
            {weaknesses.length ? (
              weaknesses.map((item) => (
                <li key={item} className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-danger">
                  {item}
                </li>
              ))
            ) : (
              <li className="text-muted">No notable weaknesses detected.</li>
            )}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Problem Breakdown" />
        <div className="space-y-3">
          {meeting.problems.length ? (
            meeting.problems.map((problem) => (
              <article key={problem.id} className="rounded-lg border border-border bg-[#15161f] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-white">{problem.description}</h3>
                  <div className="flex items-center gap-2">
                    <Badge tone={severityTone(problem.severity)}>{problem.severity}</Badge>
                    {problem.timeImpact ? (
                      <span className="text-xs text-muted">{formatDuration(problem.timeImpact)} impact</span>
                    ) : null}
                  </div>
                </div>
                {problem.evidence ? (
                  <p className="mt-2 border-l-2 border-border pl-3 text-xs italic text-muted">{problem.evidence}</p>
                ) : null}
                {problem.recommendation ? (
                  <p className="mt-2 text-xs text-brand">Recommendation: {problem.recommendation}</p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="text-sm text-muted">No problems detected.</p>
          )}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Meeting Comparison" info="Compared against your previous meeting of the same type." />
          {previous ? (
            <div className="space-y-4 text-sm">
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>This meeting</span>
                  <span>{score}/100</span>
                </div>
                <Progress value={score} color={healthColor(score)} />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>{previous.title}</span>
                  <span>{previous.healthScore ?? 0}/100</span>
                </div>
                <Progress value={previous.healthScore ?? 0} color={healthColor(previous.healthScore ?? 0)} />
              </div>
              <ul className="space-y-1 text-xs text-muted">
                <li>
                  Decisions: {previous._count.decisions} → {meeting.decisions.length}
                </li>
                <li>
                  Action items: {previous._count.actionItems} → {meeting.actionItems.length}
                </li>
                <li>
                  Wasted time: {formatDuration(wastedTime(previous))} → {formatDuration(wastedTime(meeting))}
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted">No previous meeting of this type to compare against yet.</p>
          )}
        </Card>

        <Card>
          <CardHeader title="AI Recommendations" />
          <ul className="space-y-2 text-sm text-white">
            {meeting.recommendations.map((recommendation) => (
              <li key={recommendation.id} className="flex items-start gap-2">
                <span className="text-success">✓</span>
                {recommendation.text}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Overall Assessment" />
        <p className="text-sm leading-relaxed text-muted">{meeting.aiSummary}</p>
      </Card>
    </div>
  );
}
