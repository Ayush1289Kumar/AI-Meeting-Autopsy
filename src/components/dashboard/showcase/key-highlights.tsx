import { CheckSquare, ListChecks, UserMinus, Wind } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: CheckSquare,
    value: "5",
    title: "Key Decisions",
    sub: "Clearly discussed and confirmed",
    color: "#10b981",
    text: "text-success",
    chip: "bg-success/15",
    glow: "shadow-[0_0_20px_-6px_rgba(16,185,129,0.7)]",
  },
  {
    icon: ListChecks,
    value: "8",
    title: "Action Items",
    sub: "With assigned owners",
    color: "#8b5cf6",
    text: "text-brand",
    chip: "bg-brand/15",
    glow: "shadow-[0_0_20px_-6px_rgba(139,92,246,0.7)]",
  },
  {
    icon: Wind,
    value: "1",
    title: "Topic Drift",
    sub: "Lasted 6m 24s",
    color: "#f5b94b",
    text: "text-warning",
    chip: "bg-warning/15",
    glow: "shadow-[0_0_20px_-6px_rgba(245,185,75,0.55)]",
  },
  {
    icon: UserMinus,
    value: "2",
    title: "Low Participation",
    sub: "Members spoke less than 5%",
    color: "#f87171",
    text: "text-danger",
    chip: "bg-danger/15",
    glow: "shadow-[0_0_20px_-6px_rgba(248,113,113,0.6)]",
  },
] as const;

export function KeyHighlights() {
  return (
    <section>
      <h3 className="mb-3 font-display text-base font-semibold tracking-tight text-white">
        Key Highlights
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h) => (
          <div
            key={h.title}
            className="card-surface flex items-start gap-3 !p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/35"
          >
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${h.chip} ${h.glow}`}>
              <h.icon size={16} className={h.text} />
            </span>
            <div className="min-w-0">
              <p className="flex items-baseline gap-1">
                <span className={`font-display text-xl font-bold tracking-tight ${h.text}`}>{h.value}</span>
                <span className="truncate text-xs font-medium text-white">{h.title}</span>
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-muted">{h.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}