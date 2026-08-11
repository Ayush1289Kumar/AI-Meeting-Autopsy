import { jsonCompletion } from "@/lib/openai";
import type { TopicInput, TranscriptSegmentInput } from "@/types";
import { transcriptToText } from "@/services/utils";

const DRIFT_KEYWORDS = ["weekend", "lunch", "coffee", "football", "vacation", "netflix", "weather"];
const HIGH_VALUE_KEYWORDS = ["decide", "decision", "design", "architecture", "plan", "roadmap", "risk"];

/** Splits the transcript into contiguous topic segments and rates each one. */
export function heuristicTopics(segments: TranscriptSegmentInput[]): TopicInput[] {
  if (!segments.length) return [];

  const total = segments[segments.length - 1].end;
  const chunkCount = Math.min(6, Math.max(3, Math.round(total / 900)));
  const chunkSize = Math.ceil(segments.length / chunkCount);
  const topics: TopicInput[] = [];

  for (let i = 0; i < segments.length; i += chunkSize) {
    const chunk = segments.slice(i, i + chunkSize);
    if (!chunk.length) continue;
    const text = chunk.map((s) => s.text).join(" ").toLowerCase();
    const isDrift = DRIFT_KEYWORDS.some((k) => text.includes(k));
    const isHighValue = HIGH_VALUE_KEYWORDS.some((k) => text.includes(k));

    topics.push({
      name: topicName(chunk, i === 0, isDrift),
      startTime: chunk[0].start,
      endTime: chunk[chunk.length - 1].end,
      valueRating: isDrift ? "low" : isHighValue ? "high" : "medium",
      keyPoints: chunk.slice(0, 3).map((s) => s.text.slice(0, 140)),
      isDrift,
    });
  }

  return topics;
}

function topicName(chunk: TranscriptSegmentInput[], isFirst: boolean, isDrift: boolean): string {
  if (isDrift) return "Off-topic Conversation";
  if (isFirst) return "Introductions & Agenda";
  const words = chunk
    .map((s) => s.text)
    .join(" ")
    .split(/\s+/)
    .filter((w) => w.length > 5 && /^[A-Za-z]+$/.test(w));
  const counts = new Map<string, number>();
  for (const word of words) {
    const key = word.toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([w]) => w);
  if (!top.length) return "Discussion";
  return `${top.map((w) => w[0].toUpperCase() + w.slice(1)).join(" & ")} Discussion`;
}

export async function extractTopics(segments: TranscriptSegmentInput[]): Promise<TopicInput[]> {
  const result = await jsonCompletion<{ topics: TopicInput[] }>(
    "You segment meeting transcripts into topics. Respond with JSON {\"topics\":[{name,startTime,endTime,valueRating,keyPoints,isDrift}]} where times are seconds from the start and valueRating is high|medium|low.",
    transcriptToText(segments)
  );
  if (result?.topics?.length) {
    return result.topics.map((t) => ({ ...t, keyPoints: t.keyPoints ?? [], isDrift: Boolean(t.isDrift) }));
  }
  return heuristicTopics(segments);
}
