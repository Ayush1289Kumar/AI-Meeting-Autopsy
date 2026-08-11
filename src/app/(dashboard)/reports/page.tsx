import { EmptyState } from "@/components/common/empty-state";
import { Card, CardHeader } from "@/components/ui/card";
import { GroupedBarChart } from "@/components/charts/bar-chart";
import { TrendLineChart } from "@/components/charts/line-chart";
import { ReportFilters } from "@/components/reports/report-filters";
import { getActiveUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fullMeetingInclude, wastedTime } from "@/services/meeting.service";
import { giniCoefficient } from "@/services/health-scoring.service";
import { formatDuration } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams?: { from?: string; to?: string; type?: string };
}) {
  const user = await getActiveUser();
  if (!user) return <EmptyState />;

  const meetings = await prisma.meeting.findMany({
    where: {
      uploadedById: user.id,
      status: "ready",
      ...(searchParams?.type && searchParams.type !== "all" ? { type: searchParams.type } : {}),
      ...(searchParams?.from || searchParams?.to
        ? {
            date: {
              ...(searchParams.from ? { gte: new Date(searchParams.from) } : {}),
              ...(searchParams.to ? { lte: new Date(searchParams.to) } : {}),
            },
          }
        : {}),
    },
    orderBy: { date: "asc" },
    include: fullMeetingInclude,
  });

  const types = [...new Set(meetings.map((meeting) => meeting.type))];

  if (!meetings.length) {
    return (
      <div className="space-y-4">
        <ReportFilters types={types} />
        <EmptyState title="No meetings in range" message="Adjust the filters or analyze a meeting first." />
      </div>
    );
  }

  const healthTrend = meetings.map((meeting) => ({
    label: meeting.date.toISOString().slice(5, 10),
    score: meeting.healthScore ?? 0,
  }));

  const durationTrend = meetings.map((meeting) => ({
    label: meeting.date.toISOString().slice(5, 10),
    minutes: Math.round(meeting.duration / 60),
  }));

  const balanceTrend = meetings.map((meeting) => ({
    label: meeting.date.toISOString().slice(5, 10),
    fairness: Math.round((1 - giniCoefficient(meeting.participants.map((p) => p.speakingTime ?? 0))) * 100),
  }));

  const wasteTrend = meetings.map((meeting) => ({
    label: meeting.date.toISOString().slice(5, 10),
    waste: meeting.duration ? Math.round((wastedTime(meeting) / meeting.duration) * 100) : 0,
  }));

  const frequency = new Map<string, number>();
  for (const meeting of meetings) {
    const key = meeting.date.toISOString().slice(0, 7);
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  }

  const problemCounts = new Map<string, number>();
  for (const meeting of meetings) {
    for (const problem of meeting.problems) {
      const key = problem.description.replace(/\(.*?\)/g, "").replace(/\d+/g, "N").trim();
      problemCounts.set(key, (problemCounts.get(key) ?? 0) + 1);
    }
  }

  const decisionTrend = meetings.map((meeting) => ({
    label: meeting.date.toISOString().slice(5, 10),
    decisions: meeting.decisions.length,
    actionItems: meeting.actionItems.length,
  }));

  const allActionItems = meetings.flatMap((meeting) => meeting.actionItems);
  const done = allActionItems.filter((item) => item.status === "done").length;
  const overdue = allActionItems.filter(
    (item) => item.dueDate && item.status !== "done" && item.dueDate < new Date()
  ).length;
  const averageDuration = Math.round(
    meetings.reduce((sum, meeting) => sum + meeting.duration, 0) / meetings.length
  );

  return (
    <div className="space-y-4">
      <ReportFilters types={types} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Meetings analyzed", value: String(meetings.length) },
          { label: "Average duration", value: formatDuration(averageDuration) },
          {
            label: "Action item completion",
            value: allActionItems.length ? `${Math.round((done / allActionItems.length) * 100)}%` : "—",
          },
          { label: "Overdue action items", value: String(overdue) },
        ].map((stat) => (
          <div key={stat.label} className="card-surface">
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-1 text-xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Meeting Health Trend" />
          <TrendLineChart data={healthTrend} dataKey="score" />
        </Card>
        <Card>
          <CardHeader title="Average Meeting Duration" />
          <TrendLineChart data={durationTrend} dataKey="minutes" color="#a78bfa" suffix=" min" />
        </Card>
        <Card>
          <CardHeader title="Speaking Balance Trend" info="100 = perfectly even speaking time." />
          <TrendLineChart data={balanceTrend} dataKey="fairness" color="#34d399" suffix="%" />
        </Card>
        <Card>
          <CardHeader title="Time Waste Trend" />
          <TrendLineChart data={wasteTrend} dataKey="waste" color="#ef4444" suffix="%" />
        </Card>
        <Card>
          <CardHeader title="Meeting Frequency" />
          <GroupedBarChart
            data={[...frequency.entries()].map(([label, count]) => ({ label, meetings: count }))}
            bars={[{ key: "meetings", color: "#4f7cff", name: "Meetings" }]}
          />
        </Card>
        <Card>
          <CardHeader title="Decisions & Action Items" />
          <GroupedBarChart
            data={decisionTrend}
            bars={[
              { key: "decisions", color: "#4f7cff", name: "Decisions" },
              { key: "actionItems", color: "#34d399", name: "Action items" },
            ]}
          />
        </Card>
      </div>

      <Card>
        <CardHeader title="Common Problems" />
        <GroupedBarChart
          data={[...problemCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([label, count]) => ({ label: label.slice(0, 28), count }))}
          bars={[{ key: "count", color: "#fb923c", name: "Occurrences" }]}
        />
      </Card>
    </div>
  );
}
