import { jsonCompletion } from "@/lib/openai";
import type { DecisionInput, TranscriptSegmentInput } from "@/types";
import { sentencesMatching, transcriptToText } from "@/services/utils";

const DECISION_KEYWORDS = [
  "we will",
  "we'll",
  "let's go with",
  "decided",
  "decision",
  "agreed",
  "we are going to",
  "final call",
  "approved",
];

export function heuristicDecisions(segments: TranscriptSegmentInput[]): DecisionInput[] {
  return sentencesMatching(segments, DECISION_KEYWORDS)
    .slice(0, 10)
    .map((segment) => ({
      text: segment.text,
      owner: segment.speaker,
      timestamp: segment.start,
      confidence: segment.text.toLowerCase().includes("agreed") ? 0.92 : 0.78,
      context: `${segment.speaker} stated this at ${segment.start}s.`,
    }));
}

export async function extractDecisions(segments: TranscriptSegmentInput[]): Promise<DecisionInput[]> {
  const result = await jsonCompletion<{ decisions: DecisionInput[] }>(
    "Extract decisions made in this meeting. Respond with JSON {\"decisions\":[{text,owner,timestamp,confidence,context}]}, timestamp in seconds, confidence 0-1.",
    transcriptToText(segments)
  );
  if (result?.decisions?.length) return result.decisions;
  return heuristicDecisions(segments);
}
