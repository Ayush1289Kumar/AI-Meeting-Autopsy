import { prisma } from "@/lib/db";
import { balanceRating } from "@/lib/constants";
import { giniCoefficient } from "@/services/health-scoring.service";

// ---------------------------------------------------------------------------
// Full include (Dashboard only — it genuinely needs every relation)
// ---------------------------------------------------------------------------
export const fullMeetingInclude = {
  participants: { orderBy: { speakingTime: "desc" } },
  topics: { orderBy: { startTime: "asc" } },
  decisions: { orderBy: { timestamp: "asc" } },
  actionItems: { orderBy: { task: "asc" } },
  problems: { orderBy: { severity: "asc" } },
  recommendations: true,
  transcript: { orderBy: { startTime: "asc" } },
  wasteSegments: { orderBy: { startTime: "asc" } },
} as const;

export type FullMeeting = NonNullable<Awaited<ReturnType<typeof getMeeting>>>;

export async function getMeeting(id: string) {
  return prisma.meeting.findUnique({ where: { id }, include: fullMeetingInclude });
}

/** The meeting shown by default: the requested one, else the user's most recent ready meeting. */
export async function getActiveMeeting(userId: string, meetingId?: string) {
  if (meetingId) {
    const meeting = await getMeeting(meetingId);
    if (meeting) return meeting;
  }
  return prisma.meeting.findFirst({
    where: { uploadedById: userId, status: "ready" },
    orderBy: { date: "desc" },
    include: fullMeetingInclude,
  });
}

// ---------------------------------------------------------------------------
// Per-page selective includes — only fetch what each page actually renders
// ---------------------------------------------------------------------------

const transcriptInclude = {
  transcript: { orderBy: { startTime: "asc" } },
  participants: { orderBy: { speakingTime: "desc" } },
  decisions: { orderBy: { timestamp: "asc" } },
  wasteSegments: { orderBy: { startTime: "asc" } },
} as const;

export type TranscriptMeeting = NonNullable<Awaited<ReturnType<typeof getMeetingForTranscript>>>;

export async function getMeetingForTranscript(id: string) {
  return prisma.meeting.findUnique({ where: { id }, include: transcriptInclude });
}

export async function getActiveMeetingForTranscript(userId: string, meetingId?: string) {
  if (meetingId) {
    const m = await getMeetingForTranscript(meetingId);
    if (m) return m;
  }
  return prisma.meeting.findFirst({
    where: { uploadedById: userId, status: "ready" },
    orderBy: { date: "desc" },
    include: transcriptInclude,
  });
}

// --- Decisions page ---
const decisionsInclude = {
  decisions: { orderBy: { timestamp: "asc" } },
  participants: { orderBy: { speakingTime: "desc" } },
} as const;

export type DecisionsMeeting = NonNullable<Awaited<ReturnType<typeof getMeetingForDecisions>>>;

export async function getMeetingForDecisions(id: string) {
  return prisma.meeting.findUnique({ where: { id }, include: decisionsInclude });
}

export async function getActiveMeetingForDecisions(userId: string, meetingId?: string) {
  if (meetingId) {
    const m = await getMeetingForDecisions(meetingId);
    if (m) return m;
  }
  return prisma.meeting.findFirst({
    where: { uploadedById: userId, status: "ready" },
    orderBy: { date: "desc" },
    include: decisionsInclude,
  });
}

// --- Action Items page ---
const actionItemsInclude = {
  actionItems: { orderBy: { task: "asc" } },
  participants: { orderBy: { speakingTime: "desc" } },
} as const;

export type ActionItemsMeeting = NonNullable<Awaited<ReturnType<typeof getMeetingForActionItems>>>;

export async function getMeetingForActionItems(id: string) {
  return prisma.meeting.findUnique({ where: { id }, include: actionItemsInclude });
}

export async function getActiveMeetingForActionItems(userId: string, meetingId?: string) {
  if (meetingId) {
    const m = await getMeetingForActionItems(meetingId);
    if (m) return m;
  }
  return prisma.meeting.findFirst({
    where: { uploadedById: userId, status: "ready" },
    orderBy: { date: "desc" },
    include: actionItemsInclude,
  });
}

// --- Speakers page ---
const speakersInclude = {
  participants: { orderBy: { speakingTime: "desc" } },
  transcript: { orderBy: { startTime: "asc" } },
  decisions: { orderBy: { timestamp: "asc" } },
  actionItems: { orderBy: { task: "asc" } },
} as const;

export type SpeakersMeeting = NonNullable<Awaited<ReturnType<typeof getMeetingForSpeakers>>>;

export async function getMeetingForSpeakers(id: string) {
  return prisma.meeting.findUnique({ where: { id }, include: speakersInclude });
}

export async function getActiveMeetingForSpeakers(userId: string, meetingId?: string) {
  if (meetingId) {
    const m = await getMeetingForSpeakers(meetingId);
    if (m) return m;
  }
  return prisma.meeting.findFirst({
    where: { uploadedById: userId, status: "ready" },
    orderBy: { date: "desc" },
    include: speakersInclude,
  });
}

// --- Topics Timeline page ---
const topicsInclude = {
  topics: { orderBy: { startTime: "asc" } },
  decisions: { orderBy: { timestamp: "asc" } },
  wasteSegments: { orderBy: { startTime: "asc" } },
} as const;

export type TopicsMeeting = NonNullable<Awaited<ReturnType<typeof getMeetingForTopics>>>;

export async function getMeetingForTopics(id: string) {
  return prisma.meeting.findUnique({ where: { id }, include: topicsInclude });
}

export async function getActiveMeetingForTopics(userId: string, meetingId?: string) {
  if (meetingId) {
    const m = await getMeetingForTopics(meetingId);
    if (m) return m;
  }
  return prisma.meeting.findFirst({
    where: { uploadedById: userId, status: "ready" },
    orderBy: { date: "desc" },
    include: topicsInclude,
  });
}

// --- Meeting Autopsy page ---
const autopsyInclude = {
  problems: { orderBy: { severity: "asc" } },
  recommendations: true,
  decisions: { orderBy: { timestamp: "asc" } },
  actionItems: { orderBy: { task: "asc" } },
  wasteSegments: { orderBy: { startTime: "asc" } },
  participants: { orderBy: { speakingTime: "desc" } },
} as const;

export type AutopsyMeeting = NonNullable<Awaited<ReturnType<typeof getMeetingForAutopsy>>>;

export async function getMeetingForAutopsy(id: string) {
  return prisma.meeting.findUnique({ where: { id }, include: autopsyInclude });
}

export async function getActiveMeetingForAutopsy(userId: string, meetingId?: string) {
  if (meetingId) {
    const m = await getMeetingForAutopsy(meetingId);
    if (m) return m;
  }
  return prisma.meeting.findFirst({
    where: { uploadedById: userId, status: "ready" },
    orderBy: { date: "desc" },
    include: autopsyInclude,
  });
}

// ---------------------------------------------------------------------------
// Listing & utility functions
// ---------------------------------------------------------------------------

export async function listMeetings(userId: string) {
  return prisma.meeting.findMany({
    where: { uploadedById: userId },
    orderBy: { date: "desc" },
    select: { id: true, title: true, date: true, type: true, healthScore: true, status: true, duration: true },
  });
}

export function wastedTime(meeting: { wasteSegments: { startTime: number; endTime: number; valueLevel: number }[] }): number {
  return Math.round(
    meeting.wasteSegments.reduce(
      (sum, segment) => sum + (segment.endTime - segment.startTime) * (1 - segment.valueLevel),
      0
    )
  );
}

export function driftTime(meeting: { topics: { isDrift: boolean; duration: number }[] }): number {
  return meeting.topics.filter((topic) => topic.isDrift).reduce((sum, topic) => sum + topic.duration, 0);
}

export function speakingBalanceRating(meeting: { participants: { speakingTime: number | null }[] }) {
  const gini = giniCoefficient(meeting.participants.map((p) => p.speakingTime ?? 0));
  return { gini, rating: balanceRating(gini) };
}

/**
 * Lean comparison against the previous meeting of the same type.
 * Only fetches counts + healthScore — no full relation data.
 */
export async function previousMeeting(meeting: { uploadedById: string; type: string; date: Date }) {
  return prisma.meeting.findFirst({
    where: {
      uploadedById: meeting.uploadedById,
      type: meeting.type,
      date: { lt: meeting.date },
      status: "ready",
    },
    orderBy: { date: "desc" },
    select: {
      id: true,
      title: true,
      healthScore: true,
      duration: true,
      _count: { select: { decisions: true, actionItems: true } },
      wasteSegments: { select: { startTime: true, endTime: true, valueLevel: true } },
    },
  });
}

export type LeanPreviousMeeting = NonNullable<Awaited<ReturnType<typeof previousMeeting>>>;

export function trend(current: number, previous: number | null | undefined) {
  if (previous === null || previous === undefined || previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return { change: Math.round(change), direction: change >= 0 ? ("up" as const) : ("down" as const) };
}
