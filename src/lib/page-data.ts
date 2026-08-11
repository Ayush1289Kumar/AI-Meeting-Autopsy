import { getActiveUser } from "@/lib/auth";
import { getActiveMeeting } from "@/services/meeting.service";

export interface PageSearchParams {
  searchParams?: { meeting?: string };
}

/** Resolves the user + meeting a dashboard page should render. */
export async function resolvePageMeeting(searchParams?: { meeting?: string }) {
  const user = await getActiveUser();
  if (!user) return { user: null, meeting: null };
  const meeting = await getActiveMeeting(user.id, searchParams?.meeting);
  return { user, meeting };
}

export function withMeeting(href: string, meetingId?: string) {
  return meetingId ? `${href}?meeting=${meetingId}` : href;
}
