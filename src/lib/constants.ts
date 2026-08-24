export const MEETING_TYPES = [
  "Team Sync",
  "Sprint Planning",
  "1:1",
  "All-Hands",
  "Retrospective",
  "Custom",
] as const;

export const ACCEPTED_FILE_EXTENSIONS = [
  ".mp3",
  ".wav",
  ".m4a",
  ".mp4",
  ".webm",
  ".ogg",
  ".txt",
  ".vtt",
  ".srt",
];

export const AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".mp4", ".webm", ".ogg"];

import { MAX_FILE_SIZE_MB as MAX_FILE_SIZE } from "@/lib/env";

export const MAX_FILE_SIZE_MB = MAX_FILE_SIZE;

/** Health score weights, per PRD 5.2.1. Must sum to 1. */
export const HEALTH_WEIGHTS = {
  decisionClarity: 0.2,
  actionItemQuality: 0.2,
  speakingBalance: 0.15,
  timeEfficiency: 0.15,
  topicCoverage: 0.1,
  engagement: 0.1,
  duration: 0.1,
} as const;

export const SPEAKER_COLORS = [
  "#8b5cf6",
  "#10b981",
  "#22d3ee",
  "#3d8bff",
  "#f5b94b",
  "#f472b6",
  "#fbb064",
  "#f87171",
];

export const TOPIC_COLORS = ["#8b5cf6", "#10b981", "#22d3ee", "#3d8bff", "#f87171", "#f5b94b"];

export const PROCESSING_STAGES = [
  "Transcribing audio…",
  "Identifying speakers…",
  "Extracting topics…",
  "Detecting decisions & action items…",
  "Calculating meeting health…",
  "Generating AI recommendations…",
];

// ---------------------------------------------------------------------------
// Re-exports from lib/score-utils — kept here so every existing import path
// (`import { healthLabel } from "@/lib/constants"`) continues to work.
// New code should import directly from "@/lib/score-utils".
// ---------------------------------------------------------------------------
export {
  healthLabel,
  healthColor,
  confidenceColor,
  balanceRating,
} from "@/lib/score-utils";
