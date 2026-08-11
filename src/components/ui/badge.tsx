import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-white/5 text-muted border-white/10",
  blue: "bg-brand/15 text-brand border-brand/30",
  green: "bg-success/15 text-success border-success/30",
  yellow: "bg-warning/15 text-warning border-warning/30",
  orange: "bg-orange/15 text-orange border-orange/30",
  red: "bg-danger/15 text-danger border-danger/30",
  purple: "bg-ai/15 text-ai border-ai/30",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): BadgeTone {
  switch (status) {
    case "done":
      return "green";
    case "in_progress":
      return "blue";
    case "no_owner":
      return "red";
    default:
      return "neutral";
  }
}

export function statusLabel(status: string): string {
  switch (status) {
    case "done":
      return "Done";
    case "in_progress":
      return "In Progress";
    case "no_owner":
      return "No Owner";
    default:
      return "To Do";
  }
}

export function severityTone(severity: string): BadgeTone {
  switch (severity) {
    case "critical":
      return "red";
    case "high":
      return "orange";
    case "medium":
      return "yellow";
    default:
      return "neutral";
  }
}
