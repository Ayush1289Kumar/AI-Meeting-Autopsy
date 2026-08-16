import { EmptyState } from "@/components/common/empty-state";
import { DecisionsManager } from "@/components/decisions/decisions-manager";
import { resolveDecisionsMeeting } from "@/lib/page-data";



export default async function DecisionsPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolveDecisionsMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  return (
    <DecisionsManager
      meetingId={meeting.id}
      decisions={meeting.decisions}
      owners={meeting.participants.map((participant) => participant.name)}
    />
  );
}
