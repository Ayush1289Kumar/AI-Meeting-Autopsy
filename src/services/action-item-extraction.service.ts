import { jsonCompletion } from "@/lib/openai";
import type { ActionItemInput, TranscriptSegmentInput } from "@/types";
import { sentencesMatching, transcriptToText } from "@/services/utils";

const ACTION_KEYWORDS = [
  "will send",
  "will follow up",
  "action item",
  "todo",
  "to-do",
  "take care of",
  "by friday",
  "by monday",
  "next week",
  "can you",
  "please ",
];

const OWNERLESS_HINTS = ["someone", "somebody", "we should", "we need to"];

export function heuristicActionItems(segments: TranscriptSegmentInput[]): ActionItemInput[] {
  return sentencesMatching(segments, ACTION_KEYWORDS)
    .slice(0, 12)
    .map((segment) => {
      const ownerless = OWNERLESS_HINTS.some((hint) => segment.text.toLowerCase().includes(hint));
      const owner = ownerless ? null : segment.speaker;
      return {
        task: segment.text,
        owner,
        dueDate: null,
        priority: "medium" as const,
        status: owner ? ("todo" as const) : ("no_owner" as const),
        source: segment.text,
      };
    });
}

export async function extractActionItems(segments: TranscriptSegmentInput[]): Promise<ActionItemInput[]> {
  const result = await jsonCompletion<{ actionItems: ActionItemInput[] }>(
    "Extract action items. Respond with JSON {\"actionItems\":[{task,owner,dueDate,priority,status,source}]}. priority is high|medium|low; status is todo|in_progress|done|no_owner; dueDate is ISO date or null.",
    transcriptToText(segments)
  );
  const items = result?.actionItems?.length ? result.actionItems : heuristicActionItems(segments);
  // Business rule 3: items without an owner are always no_owner.
  return items.map((item) => ({ ...item, status: item.owner ? item.status ?? "todo" : "no_owner" }));
}
