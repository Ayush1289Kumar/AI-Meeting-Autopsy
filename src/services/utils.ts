import { formatTimestamp } from "@/lib/utils";
import type { TranscriptSegmentInput } from "@/types";

/** Renders transcript segments as "[mm:ss] Speaker: text" lines for LLM prompts. */
export function transcriptToText(segments: TranscriptSegmentInput[], limit = 400): string {
  return segments
    .slice(0, limit)
    .map((s) => `[${formatTimestamp(s.start)}] ${s.speaker}: ${s.text}`)
    .join("\n");
}

export function sentencesMatching(segments: TranscriptSegmentInput[], keywords: string[]) {
  return segments.filter((segment) => {
    const text = segment.text.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword));
  });
}
