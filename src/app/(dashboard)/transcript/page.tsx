import { EmptyState } from "@/components/common/empty-state";
import { TranscriptViewer, type Highlight } from "@/components/transcript/transcript-viewer";
import { resolveTranscriptMeeting } from "@/lib/page-data";



export default async function TranscriptPage({ searchParams }: { searchParams?: { meeting?: string } }) {
  const { meeting } = await resolveTranscriptMeeting(searchParams);
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
    <TranscriptViewer
      segments={meeting.transcript}
      speakers={meeting.participants.map((participant) => ({ name: participant.name, color: participant.color }))}
      highlights={highlights}
      audioUrl={meeting.audioUrl}
    />
  );
}
