import { z } from "zod";
import { MEETING_TYPES } from "@/lib/constants";

export const registerSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createMeetingSchema = z.object({
  title: z.string().min(1).max(200).default("Untitled Meeting"),
  type: z.enum(MEETING_TYPES).default("Team Sync"),
  date: z.string().optional(),
  participants: z.array(z.string().min(1)).default([]),
  transcript: z.string().optional(),
  audioUrl: z.string().url().optional(),
  fileName: z.string().optional(),
});

export const decisionSchema = z.object({
  text: z.string().min(1),
  owner: z.string().nullish(),
  timestamp: z.number().int().min(0).default(0),
  confidence: z.number().min(0).max(1).default(0.8),
  context: z.string().nullish(),
});

export const decisionUpdateSchema = decisionSchema.partial();

export const actionItemSchema = z.object({
  task: z.string().min(1),
  owner: z.string().nullish(),
  dueDate: z.string().nullish(),
  priority: z.enum(["high", "medium", "low"]).nullish(),
  status: z.enum(["todo", "in_progress", "done", "no_owner"]).default("todo"),
  source: z.string().nullish(),
});

export const actionItemUpdateSchema = actionItemSchema.partial();

export const settingsSchema = z.object({
  defaultMeetingType: z.string().optional(),
  defaultParticipants: z.string().nullish(),
  scoringWeights: z.string().nullish(),
  llmModel: z.string().optional(),
  transcriptionLang: z.string().optional(),
  customPrompt: z.string().nullish(),
  theme: z.enum(["dark", "light"]).optional(),
  accentColor: z.string().optional(),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
