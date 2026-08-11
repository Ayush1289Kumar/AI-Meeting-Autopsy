import { prisma } from "@/lib/db";
import { balanceRating } from "@/lib/constants";
import { giniCoefficient } from "@/services/health-scoring.service";

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
    where: { uploadedById: userId },
    orderBy: { date: "desc" },
    include: fullMeetingInclude,
  });
}

export async function listMeetings(userId: string) {
  return prisma.meeting.findMany({
    where: { uploadedById: userId },
    orderBy: { date: "desc" },
    select: { id: true, title: true, date: true, type: true, healthScore: true, status: true, duration: true },
  });
}

export function wastedTime(meeting: FullMeeting): number {
  return Math.round(
    meeting.wasteSegments.reduce(
      (sum, segment) => sum + (segment.endTime - segment.startTime) * (1 - segment.valueLevel),
      0
    )
  );
}

export function driftTime(meeting: FullMeeting): number {
  return meeting.topics.filter((topic) => topic.isDrift).reduce((sum, topic) => sum + topic.duration, 0);
}

export function speakingBalanceRating(meeting: FullMeeting) {
  const gini = giniCoefficient(meeting.participants.map((p) => p.speakingTime ?? 0));
  return { gini, rating: balanceRating(gini) };
}

/** Compares a metric against the previous meeting of the same type (business rule 7). */
export async function previousMeeting(meeting: FullMeeting) {
  return prisma.meeting.findFirst({
    where: {
      uploadedById: meeting.uploadedById,
      type: meeting.type,
      date: { lt: meeting.date },
      status: "ready",
    },
    orderBy: { date: "desc" },
    include: fullMeetingInclude,
  });
}

export function trend(current: number, previous: number | null | undefined) {
  if (previous === null || previous === undefined || previous === 0) return null;
  const change = ((current - previous) / previous) * 100;
  return { change: Math.round(change), direction: change >= 0 ? ("up" as const) : ("down" as const) };
}
