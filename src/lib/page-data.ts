import { getActiveUser } from "@/lib/auth";
import {
  getActiveMeeting,
  getActiveMeetingForTranscript,
  getActiveMeetingForDecisions,
  getActiveMeetingForActionItems,
  getActiveMeetingForSpeakers,
  getActiveMeetingForTopics,
  getActiveMeetingForAutopsy,
} from "@/services/meeting.service";

export interface PageSearchParams {
  searchParams?: { meeting?: string };
}

/** Resolves the user + full meeting (Dashboard only). */
export async function resolvePageMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeeting(user.id, searchParams?.meeting);
  return { user, meeting };
}

/** Transcript page — transcript, participants, decisions, waste only. */
export async function resolveTranscriptMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeetingForTranscript(user.id, searchParams?.meeting);
  return { user, meeting };
}

/** Decisions page — decisions + participants only. */
export async function resolveDecisionsMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeetingForDecisions(user.id, searchParams?.meeting);
  return { user, meeting };
}

/** Action Items page — actionItems + participants only. */
export async function resolveActionItemsMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeetingForActionItems(user.id, searchParams?.meeting);
  return { user, meeting };
}

/** Speakers page — participants, transcript, decisions, actionItems. */
export async function resolveSpeakersMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeetingForSpeakers(user.id, searchParams?.meeting);
  return { user, meeting };
}

/** Topics Timeline page — topics, decisions, waste. */
export async function resolveTopicsMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeetingForTopics(user.id, searchParams?.meeting);
  return { user, meeting };
}

/** Meeting Autopsy page — problems, recommendations, decisions, actionItems, waste, participants. */
export async function resolveAutopsyMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeetingForAutopsy(user.id, searchParams?.meeting);
  return { user, meeting };
}

export function withMeeting(href: string, meetingId?: string) {
  return meetingId ? `${href}?meeting=${meetingId}` : href;
}
