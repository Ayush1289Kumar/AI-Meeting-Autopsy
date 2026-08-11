import { HEALTH_WEIGHTS, balanceRating } from "@/lib/constants";
import type { ActionItemInput, DecisionInput, TopicInput, WasteSegmentInput } from "@/types";

/** Gini coefficient of speaking times: 0 = perfectly even, 1 = one person spoke. */
export function giniCoefficient(values: number[]): number {
  const positive = values.filter((v) => v >= 0);
  const total = positive.reduce((sum, v) => sum + v, 0);
  if (!positive.length || total === 0) return 0;
  const sorted = [...positive].sort((a, b) => a - b);
  let cumulative = 0;
  for (let i = 0; i < sorted.length; i += 1) {
    cumulative += (2 * (i + 1) - sorted.length - 1) * sorted[i];
  }
  return Math.min(1, Math.max(0, cumulative / (sorted.length * total)));
}

export function speakingBalance(speakingTimes: number[]) {
  const gini = giniCoefficient(speakingTimes);
  return { gini, rating: balanceRating(gini) };
}

export interface HealthBreakdown {
  decisionClarity: number;
  actionItemQuality: number;
  speakingBalance: number;
  timeEfficiency: number;
  topicCoverage: number;
  engagement: number;
  duration: number;
}

export function healthBreakdown(input: {
  decisions: DecisionInput[];
  actionItems: ActionItemInput[];
  topics: TopicInput[];
  waste: WasteSegmentInput[];
  speakingTimes: number[];
  duration: number;
}): HealthBreakdown {
  const { decisions, actionItems, topics, waste, speakingTimes, duration } = input;

  const ownedDecisions = decisions.filter((d) => d.owner).length;
  const decisionClarity = decisions.length
    ? (0.6 * Math.min(1, decisions.length / 4) + 0.4 * (ownedDecisions / decisions.length)) * 100
    : 20;

  const owned = actionItems.filter((a) => a.owner).length;
  const dated = actionItems.filter((a) => a.dueDate).length;
  const actionItemQuality = actionItems.length
    ? ((owned / actionItems.length) * 0.6 + (dated / actionItems.length) * 0.4) * 100
    : 25;

  const balance = (1 - giniCoefficient(speakingTimes)) * 100;

  const wastedTime = waste.reduce((sum, w) => sum + (w.endTime - w.startTime) * (1 - w.valueLevel), 0);
  const timeEfficiency = duration ? Math.max(0, 1 - wastedTime / duration) * 100 : 50;

  const onTopic = topics.filter((t) => !t.isDrift);
  const topicCoverage = topics.length ? (onTopic.length / topics.length) * 100 : 50;

  const contributors = speakingTimes.filter((t) => t > 0).length;
  const engagement = speakingTimes.length ? (contributors / speakingTimes.length) * 100 : 50;

  const minutes = duration / 60;
  const durationScore =
    minutes <= 30 ? 100 : minutes <= 60 ? 90 : minutes <= 90 ? 75 : minutes <= 120 ? 55 : 35;

  return {
    decisionClarity,
    actionItemQuality,
    speakingBalance: balance,
    timeEfficiency,
    topicCoverage,
    engagement,
    duration: durationScore,
  };
}

export function healthScore(breakdown: HealthBreakdown): number {
  const total =
    breakdown.decisionClarity * HEALTH_WEIGHTS.decisionClarity +
    breakdown.actionItemQuality * HEALTH_WEIGHTS.actionItemQuality +
    breakdown.speakingBalance * HEALTH_WEIGHTS.speakingBalance +
    breakdown.timeEfficiency * HEALTH_WEIGHTS.timeEfficiency +
    breakdown.topicCoverage * HEALTH_WEIGHTS.topicCoverage +
    breakdown.engagement * HEALTH_WEIGHTS.engagement +
    breakdown.duration * HEALTH_WEIGHTS.duration;
  return Math.round(Math.min(100, Math.max(0, total)));
}
