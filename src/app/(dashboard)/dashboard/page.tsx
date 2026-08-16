import { EmptyState } from "@/components/common/empty-state";
import { AiRecommendationsCard } from "@/components/dashboard/ai-recommendations-card";
import { AiSummaryCard } from "@/components/dashboard/ai-summary-card";
import { ActionItemsTable } from "@/components/dashboard/action-items-table";
import { DecisionsTable } from "@/components/dashboard/decisions-table";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";
import { MeetingOverviewCard } from "@/components/dashboard/meeting-overview-card";
import { PromoCard } from "@/components/dashboard/promo-card";
import { SpeakingBalanceChart } from "@/components/dashboard/speaking-balance-chart";
import { StatsRow, type StatCard } from "@/components/dashboard/stats-row";
import { TopProblemsCard } from "@/components/dashboard/top-problems-card";
import { TopicsTimelineChart } from "@/components/dashboard/topics-timeline-chart";
import { WasteHeatmapChart } from "@/components/dashboard/waste-heatmap-chart";
import { resolvePageMeeting, withMeeting } from "@/lib/page-data";
import { formatDuration } from "@/lib/utils";
import { driftTime, previousMeeting, speakingBalanceRating, trend, wastedTime } from "@/services/meeting.service";



export default async function DashboardPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { user, meeting } = await resolvePageMeeting(searchParams);
  if (!meeting || !user) return <EmptyState />;

  const previous = await previousMeeting(meeting);
  const waste = wastedTime(meeting);
  const drift = driftTime(meeting);
  const balance = speakingBalanceRating(meeting);
  const link = (href: string) => withMeeting(href, meeting.id);

  const wastePct = meeting.duration ? Math.round((waste / meeting.duration) * 100) : 0;
  const driftPct = meeting.duration ? Math.round((drift / meeting.duration) * 100) : 0;
  const decisionTrend = trend(meeting.decisions.length, previous?._count.decisions);
  const actionTrend = trend(meeting.actionItems.length, previous?._count.actionItems);

  const stats: StatCard[] = [
    {
      label: "Decisions Made",
      value: String(meeting.decisions.length),
      subtitle: decisionTrend
        ? `${decisionTrend.change >= 0 ? "↑" : "↓"} ${Math.abs(decisionTrend.change)}% vs last meeting`
        : "No comparable meeting yet",
      tone: "green",
      icon: "decisions",
      trend: decisionTrend,
    },
    {
      label: "Action Items",
      value: String(meeting.actionItems.length),
      subtitle: actionTrend
        ? `${actionTrend.change >= 0 ? "↑" : "↓"} ${Math.abs(actionTrend.change)}% vs last meeting`
        : "No comparable meeting yet",
      tone: "blue",
      icon: "actions",
      trend: actionTrend,
    },
    {
      label: "Avg. Speaking Balance",
      value: balance.rating,
      subtitle: balance.rating === "Excellent" ? "Well balanced" : "Needs improvement",
      tone: balance.rating === "Excellent" || balance.rating === "Good" ? "green" : "yellow",
      icon: "balance",
    },
    {
      label: "Wasted Time",
      value: formatDuration(waste),
      subtitle: `${wastePct}% of total meeting`,
      tone: "red",
      icon: "waste",
    },
    {
      label: "Topic Drift",
      value: formatDuration(drift),
      subtitle: `${driftPct}% of total meeting`,
      tone: "orange",
      icon: "drift",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <HealthScoreCard score={meeting.healthScore ?? 0} percentile={meeting.healthPercentile} />
        <MeetingOverviewCard
          duration={meeting.duration}
          date={meeting.date}
          participants={meeting.participants.length}
          type={meeting.type}
        />
        <AiSummaryCard
          summary={meeting.aiSummary ?? "No summary available for this meeting yet."}
          href={link("/meeting-autopsy")}
        />
        <TopProblemsCard problems={meeting.problems} href={link("/meeting-autopsy")} />
      </div>

      <StatsRow stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <SpeakingBalanceChart
          href={link("/speakers")}
          speakers={meeting.participants.map((participant) => ({
            id: participant.id,
            name: participant.name,
            speakingTime: participant.speakingTime ?? 0,
            speakingPct: participant.speakingPct ?? 0,
            color: participant.color,
            isCurrentUser: participant.name === user.name,
          }))}
        />
        <TopicsTimelineChart
          topics={meeting.topics}
          totalDuration={meeting.duration}
          driftTime={drift}
          href={link("/topics-timeline")}
        />
        <WasteHeatmapChart
          duration={meeting.duration}
          waste={meeting.wasteSegments}
          wastedTime={waste}
          href={link("/topics-timeline")}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DecisionsTable decisions={meeting.decisions} href={link("/decisions")} />
        <ActionItemsTable actionItems={meeting.actionItems} href={link("/action-items")} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <PromoCard />
        <div className="lg:col-span-2">
          <AiRecommendationsCard recommendations={meeting.recommendations} href={link("/meeting-autopsy")} />
        </div>
      </div>
    </div>
  );
}
