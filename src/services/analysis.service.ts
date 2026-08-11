import { prisma } from "@/lib/db";
import { SPEAKER_COLORS } from "@/lib/constants";
import { extractActionItems } from "@/services/action-item-extraction.service";
import { extractDecisions } from "@/services/decision-extraction.service";
import { healthBreakdown, healthScore } from "@/services/health-scoring.service";
import { detectProblems, detectWasteSegments } from "@/services/problem-detection.service";
import { generateSummary } from "@/services/summary.service";
import { extractTopics } from "@/services/topic-extraction.service";
import type { AnalysisResult, TranscriptSegmentInput } from "@/types";

function speakerStats(segments: TranscriptSegmentInput[], declared: string[]) {
  const times = new Map<string, number>();
  for (const name of declared) times.set(name, 0);
  for (const segment of segments) {
    const spoken = Math.max(0, segment.end - segment.start);
    times.set(segment.speaker, (times.get(segment.speaker) ?? 0) + spoken);
  }
  const total = [...times.values()].reduce((sum, value) => sum + value, 0) || 1;
  return [...times.entries()]
    .map(([name, speakingTime]) => ({
      name,
      speakingTime,
      speakingPct: (speakingTime / total) * 100,
      sentiment: "neutral",
    }))
    .sort((a, b) => b.speakingTime - a.speakingTime);
}

/** Runs the full analysis pipeline over parsed transcript segments. */
export async function analyzeTranscript(input: {
  title: string;
  segments: TranscriptSegmentInput[];
  declaredParticipants: string[];
}): Promise<AnalysisResult> {
  const { segments, declaredParticipants } = input;
  const duration = segments.length ? segments[segments.length - 1].end : 0;

  const [topics, decisions, actionItems] = await Promise.all([
    extractTopics(segments),
    extractDecisions(segments),
    extractActionItems(segments),
  ]);

  const wasteSegments = detectWasteSegments(segments, topics);
  const participants = speakerStats(segments, declaredParticipants);

  const problems = detectProblems({
    segments,
    topics,
    decisions,
    actionItems,
    waste: wasteSegments,
    speakingTimes: participants.map((p) => ({ name: p.name, speakingTime: p.speakingTime })),
    duration,
  });

  const breakdown = healthBreakdown({
    decisions,
    actionItems,
    topics,
    waste: wasteSegments,
    speakingTimes: participants.map((p) => p.speakingTime),
    duration,
  });
  const score = healthScore(breakdown);

  const wastedTime = wasteSegments.reduce(
    (sum, segment) => sum + (segment.endTime - segment.startTime) * (1 - segment.valueLevel),
    0
  );

  const summary = await generateSummary({
    title: input.title,
    duration,
    healthScore: score,
    decisions,
    actionItems,
    problems,
    topics,
    wastedTime,
  });

  return {
    transcript: segments,
    topics,
    decisions,
    actionItems,
    problems,
    wasteSegments,
    recommendations: summary.recommendations,
    summary: summary.summary,
    narrative: summary.narrative,
    strengths: summary.strengths,
    weaknesses: summary.weaknesses,
    healthScore: score,
    duration,
    participants,
  };
}

/** Percentile of this score against the user's previous meetings (business rule: dashboard subtext). */
export async function healthPercentile(userId: string, score: number, excludeMeetingId?: string) {
  const previous = await prisma.meeting.findMany({
    where: {
      uploadedById: userId,
      healthScore: { not: null },
      ...(excludeMeetingId ? { id: { not: excludeMeetingId } } : {}),
    },
    select: { healthScore: true },
  });
  if (!previous.length) return 50;
  const better = previous.filter((m) => (m.healthScore ?? 0) < score).length;
  return Math.round((better / previous.length) * 100);
}

/** Persists a completed analysis onto an existing meeting row and marks it ready. */
export async function persistAnalysis(meetingId: string, userId: string, analysis: AnalysisResult) {
  const percentile = await healthPercentile(userId, analysis.healthScore, meetingId);

  await prisma.$transaction([
    prisma.participant.deleteMany({ where: { meetingId } }),
    prisma.topic.deleteMany({ where: { meetingId } }),
    prisma.decision.deleteMany({ where: { meetingId } }),
    prisma.actionItem.deleteMany({ where: { meetingId } }),
    prisma.problem.deleteMany({ where: { meetingId } }),
    prisma.recommendation.deleteMany({ where: { meetingId } }),
    prisma.transcriptSegment.deleteMany({ where: { meetingId } }),
    prisma.wasteSegment.deleteMany({ where: { meetingId } }),
    prisma.participant.createMany({
      data: analysis.participants.map((participant, index) => ({
        meetingId,
        name: participant.name,
        speakingTime: participant.speakingTime,
        speakingPct: participant.speakingPct,
        sentiment: participant.sentiment,
        color: SPEAKER_COLORS[index % SPEAKER_COLORS.length],
      })),
    }),
    prisma.topic.createMany({
      data: analysis.topics.map((topic) => ({
        meetingId,
        name: topic.name,
        startTime: topic.startTime,
        endTime: topic.endTime,
        duration: topic.endTime - topic.startTime,
        valueRating: topic.valueRating,
        keyPoints: JSON.stringify(topic.keyPoints ?? []),
        isDrift: Boolean(topic.isDrift),
      })),
    }),
    prisma.decision.createMany({
      data: analysis.decisions.map((decision) => ({
        meetingId,
        text: decision.text,
        owner: decision.owner ?? null,
        timestamp: decision.timestamp,
        confidence: decision.confidence,
        context: decision.context ?? null,
      })),
    }),
    prisma.actionItem.createMany({
      data: analysis.actionItems.map((item) => ({
        meetingId,
        task: item.task,
        owner: item.owner ?? null,
        dueDate: item.dueDate ? new Date(item.dueDate) : null,
        priority: item.priority ?? "medium",
        status: item.owner ? item.status ?? "todo" : "no_owner",
        source: item.source ?? null,
      })),
    }),
    prisma.problem.createMany({
      data: analysis.problems.map((problem) => ({
        meetingId,
        description: problem.description,
        severity: problem.severity,
        timeImpact: problem.timeImpact ?? null,
        evidence: problem.evidence ?? null,
        recommendation: problem.recommendation ?? null,
      })),
    }),
    prisma.recommendation.createMany({
      data: analysis.recommendations.map((recommendation) => ({
        meetingId,
        text: recommendation.text,
        category: recommendation.category ?? null,
      })),
    }),
    prisma.transcriptSegment.createMany({
      data: analysis.transcript.map((segment) => ({
        meetingId,
        speaker: segment.speaker,
        text: segment.text,
        startTime: segment.start,
        endTime: segment.end,
      })),
    }),
    prisma.wasteSegment.createMany({
      data: analysis.wasteSegments.map((segment) => ({
        meetingId,
        startTime: segment.startTime,
        endTime: segment.endTime,
        type: segment.type,
        description: segment.description ?? null,
        valueLevel: segment.valueLevel,
      })),
    }),
    prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: "ready",
        duration: analysis.duration,
        healthScore: analysis.healthScore,
        healthPercentile: percentile,
        aiSummary: analysis.summary,
        aiNarrative: analysis.narrative,
        strengths: JSON.stringify(analysis.strengths),
        weaknesses: JSON.stringify(analysis.weaknesses),
      },
    }),
  ]);
}
