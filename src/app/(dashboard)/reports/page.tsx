import { EmptyState } from "@/components/common/empty-state";
import { Card, CardHeader } from "@/components/ui/card";
import { GroupedBarChart } from "@/components/charts/lazy";
import { TrendLineChart } from "@/components/charts/lazy";
import { ReportFilters } from "@/components/reports/report-filters";
import { Suspense } from "react";
import { getActiveUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDuration } from "@/lib/utils";
import { giniCoefficient } from "@/services/health-scoring.service";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams?: { from?: string; to?: string; type?: string };
}) {
  const user = await getActiveUser();
  if (!user) return <EmptyState />;

  const dateFilter = {
    ...(searchParams?.from ? { gte: new Date(searchParams.from) } : {}),
    ...(searchParams?.to ? { lte: new Date(searchParams.to) } : {}),
  };
  const hasDateFilter = searchParams?.from || searchParams?.to;
  const typeFilter = searchParams?.type && searchParams.type !== "all" ? searchParams.type : undefined;

  const where = {
    uploadedById: user.id,
    status: "ready" as const,
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(hasDateFilter ? { date: dateFilter } : {}),
  };

  // --- Parallel lightweight queries instead of one massive fullMeetingInclude ---
  const [
    meetingsBase,
    allTypes,
    aggregateStats,
  ] = await Promise.all([
    // Core meeting data + only the counts/lightweight relations we need
    prisma.meeting.findMany({
      where,
      orderBy: { date: "asc" },
      select: {
        id: true,
        date: true,
        title: true,
        type: true,
        duration: true,
        healthScore: true,
        participants: { select: { speakingTime: true } },
        wasteSegments: { select: { startTime: true, endTime: true, valueLevel: true } },
        _count: { select: { decisions: true, actionItems: true } },
      },
    }),
    // All types for filter dropdown
    prisma.meeting.findMany({
      where: { uploadedById: user.id, status: "ready" },
      select: { type: true },
      distinct: ["type"],
    }),
    // Aggregate stats
    prisma.meeting.aggregate({
      where,
      _count: true,
      _sum: { duration: true },
    }),
  ]);

  // Problems and action items — separate lean queries
  const [problemRows, actionItemRows] = await Promise.all([
    prisma.problem.findMany({
      where: { meeting: where },
      select: { description: true },
    }),
    prisma.actionItem.findMany({
      where: { meeting: where },
      select: { status: true, dueDate: true },
    }),
  ]);

  const types = allTypes.map((t) => t.type);

  if (!meetingsBase.length) {
    return (
      <div className="space-y-4">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-white/5" />}>
          <ReportFilters types={types} />
        </Suspense>
        <EmptyState title="No meetings in range" message="Adjust the filters or analyze a meeting first." />
      </div>
    );
  }

  const healthTrend = meetingsBase.map((m) => ({
    label: m.date.toISOString().slice(5, 10),
    score: m.healthScore ?? 0,
  }));

  const durationTrend = meetingsBase.map((m) => ({
    label: m.date.toISOString().slice(5, 10),
    minutes: Math.round(m.duration / 60),
  }));

  const balanceTrend = meetingsBase.map((m) => ({
    label: m.date.toISOString().slice(5, 10),
    fairness: Math.round((1 - giniCoefficient(m.participants.map((p) => p.speakingTime ?? 0))) * 100),
  }));

  const wasteTrend = meetingsBase.map((m) => {
    const waste = m.wasteSegments.reduce(
      (sum, s) => sum + (s.endTime - s.startTime) * (1 - s.valueLevel),
      0
    );
    return {
      label: m.date.toISOString().slice(5, 10),
      waste: m.duration ? Math.round((waste / m.duration) * 100) : 0,
    };
  });

  const frequency = new Map<string, number>();
  for (const m of meetingsBase) {
    const key = m.date.toISOString().slice(0, 7);
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
  }

  const problemCounts = new Map<string, number>();
  for (const p of problemRows) {
    const key = p.description.replace(/\(.*?\)/g, "").replace(/\d+/g, "N").trim();
    problemCounts.set(key, (problemCounts.get(key) ?? 0) + 1);
  }

  const decisionTrend = meetingsBase.map((m) => ({
    label: m.date.toISOString().slice(5, 10),
    decisions: m._count.decisions,
    actionItems: m._count.actionItems,
  }));

  const done = actionItemRows.filter((item) => item.status === "done").length;
  const overdue = actionItemRows.filter(
    (item) => item.dueDate && item.status !== "done" && item.dueDate < new Date()
  ).length;
  const averageDuration = Math.round(
    (aggregateStats._sum.duration ?? 0) / Math.max(meetingsBase.length, 1)
  );

  return (
    <div className="space-y-4">
      <Suspense fallback={<div className="h-10 animate-pulse rounded-lg bg-white/5" />}>
        <ReportFilters types={types} />
      </Suspense>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Meetings analyzed", value: String(meetingsBase.length) },
          { label: "Average duration", value: formatDuration(averageDuration) },
          {
            label: "Action item completion",
            value: actionItemRows.length ? `${Math.round((done / actionItemRows.length) * 100)}%` : "—",
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
