import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { DonutChart } from "@/components/charts/lazy";
import { SPEAKER_COLORS } from "@/lib/constants";
import { formatDuration } from "@/lib/utils";

export interface SpeakerSlice {
  id: string;
  name: string;
  speakingTime: number;
  speakingPct: number;
  color: string | null;
  isCurrentUser?: boolean;
}

export function SpeakingBalanceChart({ speakers, href }: { speakers: SpeakerSlice[]; href: string }) {
  const data = speakers.map((speaker, index) => ({
    name: speaker.name,
    value: Math.max(speaker.speakingTime, 1),
    color: speaker.color ?? SPEAKER_COLORS[index % SPEAKER_COLORS.length],
    label: `${formatDuration(speaker.speakingTime)} (${speaker.speakingPct.toFixed(0)}%)`,
  }));
  const top = speakers[0];

  return (
    <Card>
      <CardHeader
        title="Speaking Balance"
        info="Share of total speaking time per participant. A balanced meeting keeps any single speaker well under half the time."
      />
      <DonutChart
        data={data}
        centerTop={top ? `${top.speakingPct.toFixed(0)}%` : "—"}
        centerBottom={top ? top.name : undefined}
      />
      <ul className="mt-3 space-y-2">
        {speakers.map((speaker, index) => (
          <li key={speaker.id} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: speaker.color ?? SPEAKER_COLORS[index % SPEAKER_COLORS.length] }}
            />
            <span className="flex-1 text-white">
              {speaker.name}
              {speaker.isCurrentUser ? " (You)" : ""}
            </span>
            <span className="text-muted">
              {formatDuration(speaker.speakingTime)} ({speaker.speakingPct.toFixed(0)}%)
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted">Ideal balance: Everyone gets a chance to speak.</p>
      <CardFooterLink href={href} label="View Speaker Insights" />
    </Card>
  );
}
