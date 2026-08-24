import { EmptyState } from "@/components/common/empty-state";
import { PageHero } from "@/components/common/page-hero";
import { TranscriptViewer, type Highlight } from "@/components/transcript/transcript-viewer";
import { resolvePageMeeting } from "@/lib/page-data";

export const dynamic = "force-dynamic";

export default async function TranscriptPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolvePageMeeting(searchParams);
  if (!meeting) return <EmptyState />;

  const highlights: Highlight[] = [
    ...meeting.decisions.map((decision) => ({
      type: "decision" as const,
      startTime: decision.timestamp,
      endTime: decision.timestamp + 10,
      detail: `Decision: ${decision.text}`,
    })),
    ...meeting.wasteSegments.map((segment) => ({
      type: "waste" as const,
      startTime: segment.startTime,
      endTime: segment.endTime,
      detail: segment.description ?? segment.type,
    })),
  ];

  return (
    <div className="space-y-4">
      <PageHero
        icon="transcript"
        eyebrow="Word for word"
        title="Full Transcript"
        subtitle="Every segment, speaker-tagged, with decisions and wasted time highlighted inline."
      />
      <TranscriptViewer
      segments={meeting.transcript}
      speakers={meeting.participants.map((participant) => ({ name: participant.name, color: participant.color }))}
      highlights={highlights}
      audioUrl={meeting.audioUrl}
    />
    </div>
  );
}
