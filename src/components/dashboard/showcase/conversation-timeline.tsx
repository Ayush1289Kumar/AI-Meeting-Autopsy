import { GlassCard } from "./primitives";

type Segment = { start: number; end: number; kind: "discussion" | "decision" | "offtopic" | "action" };

const COLORS: Record<Segment["kind"], { fill: string; label: string }> = {
  discussion: { fill: "#8b5cf6", label: "Discussion" },
  decision: { fill: "#22d3ee", label: "Decision" },
  offtopic: { fill: "#f87171", label: "Off-topic" },
  action: { fill: "#10b981", label: "Action Item" },
};

const SEGMENTS: Segment[] = [
  { start: 0, end: 12, kind: "discussion" },
  { start: 12, end: 18, kind: "offtopic" },
  { start: 18, end: 38, kind: "discussion" },
  { start: 38, end: 45, kind: "decision" },
  { start: 45, end: 52, kind: "action" },
  { start: 52, end: 60, kind: "discussion" },
];

const MIN = 60;

const MARKERS = [
  { at: 4, label: "Great discussion", tone: "#8b5cf6" },
  { at: 14, label: "Topic drift", tone: "#f87171" },
  { at: 40, label: "Decision made", tone: "#22d3ee" },
  { at: 47, label: "Action item", tone: "#10b981" },
];

const TICKS = ["0:00", "15:00", "30:00", "45:00", "60:00"];

export function ConversationTimeline() {
  return (
    <GlassCard>
      <h3 className="mb-4 font-display text-base font-semibold tracking-tight text-white">
        Conversation Timeline
      </h3>

      {/* legend */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {(Object.keys(COLORS) as Segment["kind"][]).map((kind) => (
          <span key={kind} className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[kind].fill }} />
            {COLORS[kind].label}
          </span>
        ))}
      </div>

      {/* markers row */}
      <div className="relative mb-1 h-7">
        {MARKERS.map((m) => (
          <div
            key={m.label}
            className="absolute -translate-x-1/2 animate-float"
            style={{ left: `${(m.at / MIN) * 100}%` }}
          >
            <span
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-medium"
              style={{ color: m.tone, borderColor: `${m.tone}55`, backgroundColor: `${m.tone}14` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: m.tone }} />
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* timeline bar */}
      <div className="relative h-5 overflow-hidden rounded-full border border-white/8 bg-[#0a0d1f]">
        <div className="flex h-full w-full">
          {SEGMENTS.map((s, i) => (
            <div
              key={i}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all hover:opacity-80"
              style={{
                width: `${((s.end - s.start) / MIN) * 100}%`,
                backgroundColor: COLORS[s.kind].fill,
                boxShadow: `inset 0 -6px 10px -6px rgba(0,0,0,0.5), 0 0 18px -6px ${COLORS[s.kind].fill}`,
              }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>

      {/* ticks */}
      <div className="mt-2 flex justify-between text-[11px] text-muted">
        {TICKS.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </GlassCard>
  );
}