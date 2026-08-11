import { Calendar, Clock, Tag, Users } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/utils";

export function MeetingOverviewCard({
  duration,
  date,
  participants,
  type,
}: {
  duration: number;
  date: Date;
  participants: number;
  type: string;
}) {
  const rows = [
    { icon: <Clock size={14} className="text-brand" />, label: "Duration", value: formatDuration(duration) },
    { icon: <Calendar size={14} className="text-success" />, label: "Date", value: formatDate(date) },
    { icon: <Users size={14} className="text-warning" />, label: "Participants", value: String(participants) },
    { icon: <Tag size={14} className="text-ai" />, label: "Type", value: type },
  ];

  return (
    <Card>
      <CardHeader title="Meeting Overview" />
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-xs text-muted">
              {row.icon}
              {row.label}
            </dt>
            <dd className="text-sm font-medium text-white">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
