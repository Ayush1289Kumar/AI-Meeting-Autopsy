import { formatDuration } from "@/lib/utils";
import type {
  ActionItemInput,
  DecisionInput,
  ProblemInput,
  TopicInput,
  TranscriptSegmentInput,
  WasteSegmentInput,
} from "@/types";

const STATUS_KEYWORDS = ["status update", "quick update", "my update", "last week i", "i worked on"];
const OFF_TOPIC_KEYWORDS = ["weekend", "lunch", "coffee", "football", "vacation", "netflix", "weather"];

/** Detects low-value stretches of the meeting: status updates, repeats and off-topic chatter. */
export function detectWasteSegments(
  segments: TranscriptSegmentInput[],
  topics: TopicInput[]
): WasteSegmentInput[] {
  const waste: WasteSegmentInput[] = [];
  const seenTopics = new Map<string, number>();

  for (const topic of topics) {
    const key = topic.name.toLowerCase();
    const previous = seenTopics.get(key);
    if (previous !== undefined) {
      waste.push({
        startTime: topic.startTime,
        endTime: topic.endTime,
        type: "repeated_discussion",
        description: `Repeated discussion on "${topic.name}"`,
        valueLevel: 0.25,
      });
    }
    seenTopics.set(key, (previous ?? 0) + 1);

    if (topic.isDrift) {
      waste.push({
        startTime: topic.startTime,
        endTime: topic.endTime,
        type: "off_topic",
        description: "Off-topic conversation",
        valueLevel: 0.1,
      });
    }
  }

  const statusRun = segments.filter((segment) =>
    STATUS_KEYWORDS.some((keyword) => segment.text.toLowerCase().includes(keyword))
  );
  if (statusRun.length >= 2) {
    waste.push({
      startTime: statusRun[0].start,
      endTime: statusRun[statusRun.length - 1].end,
      type: "status_update",
      description: "Extended status updates",
      valueLevel: 0.35,
    });
  }

  const offTopic = segments.filter((segment) =>
    OFF_TOPIC_KEYWORDS.some((keyword) => segment.text.toLowerCase().includes(keyword))
  );
  for (const segment of offTopic.slice(0, 3)) {
    waste.push({
      startTime: segment.start,
      endTime: segment.end,
      type: "off_topic",
      description: "Off-topic conversation",
      valueLevel: 0.1,
    });
  }

  return dedupe(waste);
}

function dedupe(segments: WasteSegmentInput[]): WasteSegmentInput[] {
  const seen = new Set<string>();
  return segments.filter((segment) => {
    const key = `${segment.type}:${segment.startTime}:${segment.endTime}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function detectProblems(input: {
  segments: TranscriptSegmentInput[];
  topics: TopicInput[];
  decisions: DecisionInput[];
  actionItems: ActionItemInput[];
  waste: WasteSegmentInput[];
  speakingTimes: { name: string; speakingTime: number }[];
  duration: number;
}): ProblemInput[] {
  const problems: ProblemInput[] = [];
  const { topics, decisions, actionItems, waste, speakingTimes, duration } = input;

  const statusTime = waste
    .filter((w) => w.type === "status_update")
    .reduce((total, w) => total + (w.endTime - w.startTime), 0);
  if (statusTime > 300) {
    problems.push({
      description: `Too much time on status updates (${formatDuration(statusTime)})`,
      severity: statusTime > 1200 ? "critical" : "high",
      timeImpact: statusTime,
      evidence: "Consecutive per-person updates with no decisions attached.",
      recommendation: "Timebox status updates to 10 minutes or move them async.",
    });
  }

  const ownerless = actionItems.filter((item) => !item.owner);
  if (ownerless.length) {
    problems.push({
      description: `${ownerless.length} action item${ownerless.length > 1 ? "s have" : " has"} no owner`,
      severity: ownerless.length >= 3 ? "high" : "medium",
      timeImpact: null,
      evidence: ownerless.slice(0, 3).map((item) => item.task).join(" | "),
      recommendation: "Assign a named owner before closing each agenda item.",
    });
  }

  const repeated = waste.filter((w) => w.type === "repeated_discussion");
  for (const segment of repeated.slice(0, 2)) {
    problems.push({
      description: segment.description ?? "Repeated discussion",
      severity: "high",
      timeImpact: segment.endTime - segment.startTime,
      evidence: "The same topic was reopened after it had already been discussed.",
      recommendation: "Close each topic with an explicit decision before moving on.",
    });
  }

  const driftTime = topics.filter((t) => t.isDrift).reduce((total, t) => total + (t.endTime - t.startTime), 0);
  if (driftTime > 120) {
    problems.push({
      description: `Topic drift consumed ${formatDuration(driftTime)}`,
      severity: driftTime > 900 ? "high" : "medium",
      timeImpact: driftTime,
      evidence: "Conversation moved away from the agenda.",
      recommendation: "Use a parking lot for tangents and return to the agenda.",
    });
  }

  const total = speakingTimes.reduce((sum, s) => sum + s.speakingTime, 0);
  const top = [...speakingTimes].sort((a, b) => b.speakingTime - a.speakingTime)[0];
  if (top && total > 0 && top.speakingTime / total > 0.4 && speakingTimes.length > 2) {
    problems.push({
      description: `Speaking time is unbalanced — ${top.name} spoke ${Math.round((top.speakingTime / total) * 100)}% of the time`,
      severity: "medium",
      timeImpact: null,
      evidence: `${top.name}: ${formatDuration(top.speakingTime)} of ${formatDuration(total)}`,
      recommendation: "Invite quieter participants directly and round-robin key questions.",
    });
  }

  const silent = speakingTimes.filter((s) => s.speakingTime === 0);
  if (silent.length) {
    problems.push({
      description: `${silent.length} participant${silent.length > 1 ? "s" : ""} never spoke`,
      severity: "medium",
      timeImpact: null,
      evidence: silent.map((s) => s.name).join(", "),
      recommendation: "Only invite people who need to contribute, or ask them directly.",
    });
  }

  if (!decisions.length) {
    problems.push({
      description: "No clear decisions were made",
      severity: "critical",
      timeImpact: duration,
      evidence: "No decision-like statements were detected in the transcript.",
      recommendation: "End every agenda item with an explicit decision and owner.",
    });
  }

  return problems.sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
}

function severityRank(severity: ProblemInput["severity"]): number {
  return { critical: 4, high: 3, medium: 2, low: 1 }[severity];
}
