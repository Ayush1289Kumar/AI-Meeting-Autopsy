"use client";

import { usePathname, useRouter } from "next/navigation";
import { Select } from "@/components/ui/input";

export interface MeetingOption {
  id: string;
  title: string;
  date: string;
}

export function MeetingSelector({
  meetings,
  activeMeetingId,
}: {
  meetings: MeetingOption[];
  activeMeetingId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      aria-label="Select meeting"
      className="h-9 w-40 py-0 sm:w-52"
      value={activeMeetingId ?? ""}
      onChange={(event) => router.push(`${pathname}?meeting=${event.target.value}`)}
    >
      {meetings.map((meeting) => (
        <option key={meeting.id} value={meeting.id}>
          {meeting.title} — {meeting.date}
        </option>
      ))}
    </Select>
  );
}
