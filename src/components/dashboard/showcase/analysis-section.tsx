import { Activity, BrainCircuit, CheckCircle2, Sparkles } from "lucide-react";
import { GlassCard, Overline, StatusPill } from "./primitives";

const HEALTH_METRICS = [
  { label: "Engagement", value: 88, color: "#22d3ee" },
  { label: "Clarity", value: 92, color: "#10b981" },
  { label: "Participation", value: 81, color: "#8b5cf6" },
  { label: "Efficiency", value: 86, color: "#3d8bff" },
];

/** Glowing circular score ring. */
function ScoreRing({ score, size = 172 }: { score: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
  const color = "#10b981";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)` }}
      />
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          filter="url(#ring-glow)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="flex items-end font-display text-4xl font-bold tracking-tight text-white">
          {score}
          <span className="mb-1 ml-0.5 text-base font-semibold text-muted">/100</span>
        </span>
        <StatusPill tone="success">HEALTHY</StatusPill>
      </div>
    </div>
  );
}

export function AnalysisSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Meeting Health Score */}
      <GlassCard>
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-accent" />
          <h3 className="font-display text-base font-semibold tracking-tight text-white">
            Meeting Health Score
          </h3>
        </div>
        <div className="mt-4 flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
          <ScoreRing score={87} />
          <div className="grid w-full max-w-xs gap-3 sm:grid-cols-2">
            {HEALTH_METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:bg-white/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted">{m.label}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${m.value}%`, backgroundColor: m.color, boxShadow: `0 0 8px ${m.color}` }}
                  />
                </div>
                <p className="mt-1.5 font-display text-sm font-bold tracking-tight" style={{ color: m.color }}>
                  {m.value}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* AI Autopsy Report */}
      <GlassCard className="relative flex flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-ai/15 blur-[90px] animate-aurora"
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-ai to-brand shadow-[0_0_16px_-4px_rgba(34,211,238,0.9)]">
              <BrainCircuit size={15} className="text-white" />
            </span>
            <Overline>AI Autopsy Report</Overline>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <StatusPill tone="success">
              <CheckCircle2 size={12} /> Overall Diagnosis
            </StatusPill>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-success">
              Healthy Meeting
            </span>
          </div>

          <h4 className="mt-4 font-display text-xl font-bold tracking-tight text-white">
            Productive, focused, and result-driven.
          </h4>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            The discussion stayed mostly on track, with clear decisions and well-distributed
            participation. A few moments of topic drift and brief low engagement were detected, but
            the team recovered quickly and closed every open item.
          </p>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/20 hover:shadow-[0_0_28px_-10px_rgba(139,92,246,0.9)]"
          >
            <Sparkles size={15} className="text-accent" />
            View Full Report
          </button>
        </div>
      </GlassCard>
    </div>
  );
}