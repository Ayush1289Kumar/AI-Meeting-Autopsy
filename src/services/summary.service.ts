import { jsonCompletion } from "@/lib/openai";
import { formatDuration } from "@/lib/utils";
import type {
  ActionItemInput,
  DecisionInput,
  ProblemInput,
  RecommendationInput,
  TopicInput,
} from "@/types";

export interface SummaryResult {
  summary: string;
  narrative: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: RecommendationInput[];
}

export async function generateSummary(input: {
  title: string;
  duration: number;
  healthScore: number;
  decisions: DecisionInput[];
  actionItems: ActionItemInput[];
  problems: ProblemInput[];
  topics: TopicInput[];
  wastedTime: number;
}): Promise<SummaryResult> {
  const prompt = JSON.stringify({
    title: input.title,
    durationSeconds: input.duration,
    healthScore: input.healthScore,
    decisions: input.decisions.map((d) => d.text),
    actionItems: input.actionItems.map((a) => ({ task: a.task, owner: a.owner })),
    problems: input.problems.map((p) => p.description),
    topics: input.topics.map((t) => t.name),
    wastedSeconds: input.wastedTime,
  });

  const result = await jsonCompletion<SummaryResult>(
    'You are a meeting analyst. Respond with JSON {"summary": string (2-3 sentences), "narrative": string (3 paragraphs), "strengths": string[], "weaknesses": string[], "recommendations": [{"text": string, "category": "time"|"participation"|"decisions"|"action_items"}]} with 5-7 recommendations.',
    prompt
  );
  if (result?.summary) return result;

  return heuristicSummary(input);
}

function heuristicSummary(input: {
  title: string;
  duration: number;
  healthScore: number;
  decisions: DecisionInput[];
  actionItems: ActionItemInput[];
  problems: ProblemInput[];
  topics: TopicInput[];
  wastedTime: number;
}): SummaryResult {
  const ownerless = input.actionItems.filter((a) => !a.owner).length;
  const wastePct = input.duration ? Math.round((input.wastedTime / input.duration) * 100) : 0;

  const summary = `${input.title} scored ${input.healthScore}/100 with ${input.decisions.length} decision${
    input.decisions.length === 1 ? "" : "s"
  } and ${input.actionItems.length} action item${input.actionItems.length === 1 ? "" : "s"} across ${
    input.topics.length
  } topics. About ${formatDuration(input.wastedTime)} (${wastePct}%) of the ${formatDuration(
    input.duration
  )} was low value.${ownerless ? ` ${ownerless} action item${ownerless === 1 ? "" : "s"} still lack an owner.` : ""}`;

  const narrative = [
    summary,
    `The conversation covered ${input.topics.map((t) => t.name).join(", ") || "no clearly separable topics"}. ${
      input.decisions.length
        ? `Decisions were reached on: ${input.decisions.slice(0, 3).map((d) => d.text).join("; ")}.`
        : "No firm decisions were reached, which is the single biggest drag on this meeting's score."
    }`,
    input.problems.length
      ? `The main problems detected were: ${input.problems.slice(0, 3).map((p) => p.description).join("; ")}. Addressing these would raise the health score of the next meeting of this type.`
      : "No significant structural problems were detected — keep the current format.",
  ].join("\n\n");

  const strengths: string[] = [];
  if (input.decisions.length >= 3) strengths.push(`${input.decisions.length} clear decisions were captured`);
  if (input.actionItems.length - ownerless > 0)
    strengths.push(`${input.actionItems.length - ownerless} action items have named owners`);
  if (wastePct < 20) strengths.push(`Only ${wastePct}% of the meeting was low-value time`);
  if (input.duration <= 3600) strengths.push("The meeting stayed within an hour");
  if (!strengths.length) strengths.push("Participants stayed engaged throughout the call");

  const weaknesses = input.problems.slice(0, 5).map((p) => p.description);
  if (!weaknesses.length) weaknesses.push("Minor: no explicit agenda was shared beforehand");

  const recommendations: RecommendationInput[] = [
    { text: "Limit status updates to 10 minutes and move detail async.", category: "time" },
    { text: "Ensure every action item has an owner before the meeting ends.", category: "action_items" },
    { text: "Avoid repeating the same discussion — decide and move forward.", category: "decisions" },
    { text: "End each agenda item with a clear, stated decision.", category: "decisions" },
    { text: "Share the meeting agenda in advance.", category: "time" },
    { text: "Invite quieter participants to contribute directly.", category: "participation" },
  ];

  return { summary, narrative, strengths, weaknesses, recommendations };
}
