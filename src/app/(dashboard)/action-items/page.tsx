import { EmptyState } from "@/components/common/empty-state";
import { PageHero } from "@/components/common/page-hero";
import { ActionItemsManager } from "@/components/action-items/action-items-manager";
import { resolvePageMeeting } from "@/lib/page-data";

export const dynamic = "force-dynamic";

export default async function ActionItemsPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolvePageMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  return (
    <div className="space-y-4">
      <PageHero
        icon="list-checks"
        eyebrow="What happens next"
        title="Action Items"
        subtitle="Tasks and follow-ups generated from this meeting, tracked to completion."
      />
      <ActionItemsManager
        meetingId={meeting.id}
        owners={meeting.participants.map((participant) => participant.name)}
        items={meeting.actionItems.map((item) => ({
          id: item.id,
          task: item.task,
          owner: item.owner,
          dueDate: item.dueDate ? item.dueDate.toISOString().slice(0, 10) : null,
          priority: item.priority,
          status: item.status,
          source: item.source,
        }))}
      />
    </div>
  );
}
