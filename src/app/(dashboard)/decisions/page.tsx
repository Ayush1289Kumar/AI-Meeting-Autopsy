import { EmptyState } from "@/components/common/empty-state";
import { PageHero } from "@/components/common/page-hero";
import { DecisionsManager } from "@/components/decisions/decisions-manager";
import { resolvePageMeeting } from "@/lib/page-data";

export const dynamic = "force-dynamic";

export default async function DecisionsPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolvePageMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  return (
    <div className="space-y-4">
      <PageHero
        icon="gavel"
        eyebrow="What got decided"
        title="Decisions"
        subtitle="Every decision made during this meeting, with confidence and source."
      />
      <DecisionsManager
        meetingId={meeting.id}
        decisions={meeting.decisions}
        owners={meeting.participants.map((participant) => participant.name)}
      />
    </div>
  );
}
