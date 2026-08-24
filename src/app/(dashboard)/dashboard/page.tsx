import { EmptyState } from "@/components/common/empty-state";
import { DashboardStatusStrip } from "@/components/dashboard/status-strip";
import { DashboardHero, type HeroStat } from "@/components/dashboard/dashboard-hero";
import { MeetingFlowCard, type FlowRow } from "@/components/dashboard/meeting-flow-card";
import { SpeakingBalanceBars } from "@/components/dashboard/speaking-balance-bars";
import { AiRecommendationsCard } from "@/components/dashboard/ai-recommendations-card";
import { AiSummaryCard } from "@/components/dashboard/ai-summary-card";
import { ActionItemsTable } from "@/components/dashboard/action-items-table";
import { DecisionsTable } from "@/components/dashboard/decisions-table";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";
import { MeetingOverviewCard } from "@/components/dashboard/meeting-overview-card";
import { PromoCard } from "@/components/dashboard/promo-card";
import { TopProblemsCard } from "@/components/dashboard/top-problems-card";
import { TopicsTimelineChart } from "@/components/dashboard/topics-timeline-chart";
import { WasteHeatmapChart } from "@/components/dashboard/waste-heatmap-chart";
import { resolvePageMeeting, withMeeting } from "@/lib/page-data";
import { formatDuration } from "@/lib/utils";
import { driftTime, speakingBalanceRating, wastedTime } from "@/services/meeting.service";

export const dynamic = "force-dynamic";

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export default async function DashboardPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { user, meeting } = await resolvePageMeeting(searchParams);
  if (!meeting || !user) return <EmptyState />;

  const waste = wastedTime(meeting);
  const drift = driftTime(meeting);
  const balance = speakingBalanceRating(meeting);
  const link = (href: string) => withMeeting(href, meeting.id);

  const wastePct = meeting.duration ? Math.round((waste / meeting.duration) * 100) : 0;
  const driftPct = meeting.duration ? Math.round((drift / meeting.duration) * 100) : 0;

  const strengths = parseList(meeting.strengths);
  const weaknesses = parseList(meeting.weaknesses);
  const avgConfidence = meeting.decisions.length
    ? meeting.decisions.reduce((sum, d) => sum + d.confidence, 0) / meeting.decisions.length
    : 0;
  const decisionClarity = avgConfidence >= 0.8 ? "High" : avgConfidence >= 0.5 ? "Medium" : "Low";

  const diagnosis = [
    strengths[0] ?? "Meeting proceeded smoothly with clear structure.",
    `${driftPct}% topic drift detected across the meeting.`,
    weaknesses[0] ?? "No major concerns flagged by the AI.",
  ];

  const heroStats: HeroStat[] = [
    { label: "Decisions", value: String(meeting.decisions.length), tone: "green" },
    { label: "Actions", value: String(meeting.actionItems.length), tone: "blue" },
    { label: "Wasted Time", value: `${formatDuration(waste)} (${wastePct}%)`, tone: "orange" },
    { label: "Topic Drift", value: `${formatDuration(drift)} (${driftPct}%)`, tone: "red" },
  ];

  const flowRows: FlowRow[] = [
    {
      label: "Topic Drift",
      value: formatDuration(drift),
      color: "#F59E0B",
      linkLabel: "Inspect",
      href: link("/topics-timeline"),
    },
    {
      label: "Decision Clarity",
      value: decisionClarity,
      color: "#22C55E",
      linkLabel: "View",
      href: link("/decisions"),
    },
    {
      label: "Speaking Balance",
      value: balance.rating,
      color: "#3B82F6",
      linkLabel: "Explore",
      href: link("/speakers"),
    },
  ];

  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-4">
      <p className="px-1 text-sm text-muted">
        Hello, <span className="font-medium text-white">{firstName}</span> 👋 Welcome back to AI Meeting Autopsy.
      </p>
      <DashboardStatusStrip />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DashboardHero
            title={meeting.title}
            meta={`${meeting.type} · ${formatDuration(meeting.duration)} · ${meeting.participants.length} participants`}
            score={meeting.healthScore ?? 0}
            diagnosis={diagnosis}
            diagnosisHref={link("/meeting-autopsy")}
            stats={heroStats}
          />
        </div>
        <div className="lg:col-span-2">
          <MeetingFlowCard topics={meeting.topics} totalDuration={meeting.duration} rows={flowRows} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SpeakingBalanceBars
          href={link("/speakers")}
          speakers={meeting.participants.map((participant) => ({
            id: participant.id,
            name: participant.name,
            speakingPct: participant.speakingPct ?? 0,
            color: participant.color,
            isCurrentUser: participant.name === user.name,
          }))}
        />
        <AiRecommendationsCard recommendations={meeting.recommendations} href={link("/meeting-autopsy")} />
      </div>

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

      <div className="grid gap-4 lg:grid-cols-2">
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

      <PromoCard />
    </div>
  );
}
