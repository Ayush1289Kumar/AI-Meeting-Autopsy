import { EmptyState } from "@/components/common/empty-state";
import { DecisionsManager } from "@/components/decisions/decisions-manager";
import { resolvePageMeeting } from "@/lib/page-data";

export const dynamic = "force-dynamic";

export default async function DecisionsPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolvePageMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  return (
    <DecisionsManager
      meetingId={meeting.id}
      decisions={meeting.decisions}
      owners={meeting.participants.map((participant) => participant.name)}
    />
  );
}
