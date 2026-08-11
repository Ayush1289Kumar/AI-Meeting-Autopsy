export type Severity = "critical" | "high" | "medium" | "low";
export type ActionItemStatus = "todo" | "in_progress" | "done" | "no_owner";
export type ValueRating = "high" | "medium" | "low";
export type WasteType = "status_update" | "repeated_discussion" | "off_topic";

export interface TranscriptSegmentInput {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface TopicInput {
  name: string;
  startTime: number;
  endTime: number;
  valueRating: ValueRating;
  keyPoints?: string[];
  isDrift?: boolean;
}

export interface DecisionInput {
  text: string;
  owner?: string | null;
  timestamp: number;
  confidence: number;
  context?: string | null;
}

export interface ActionItemInput {
  task: string;
  owner?: string | null;
  dueDate?: string | null;
  priority?: "high" | "medium" | "low" | null;
  status?: ActionItemStatus;
  source?: string | null;
}

export interface ProblemInput {
  description: string;
  severity: Severity;
  timeImpact?: number | null;
  evidence?: string | null;
  recommendation?: string | null;
}

export interface WasteSegmentInput {
  startTime: number;
  endTime: number;
  type: WasteType;
  description?: string | null;
  valueLevel: number;
}

export interface RecommendationInput {
  text: string;
  category?: "time" | "participation" | "decisions" | "action_items" | null;
}

export interface AnalysisResult {
  transcript: TranscriptSegmentInput[];
  topics: TopicInput[];
  decisions: DecisionInput[];
  actionItems: ActionItemInput[];
  problems: ProblemInput[];
  wasteSegments: WasteSegmentInput[];
  recommendations: RecommendationInput[];
  summary: string;
  narrative: string;
  strengths: string[];
  weaknesses: string[];
  healthScore: number;
  duration: number;
  participants: { name: string; speakingTime: number; speakingPct: number; sentiment: string }[];
}
