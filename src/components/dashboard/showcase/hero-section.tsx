"use client";

import { useState } from "react";
import { Activity, UploadCloud } from "lucide-react";
import { AiOrb } from "./ai-orb";
import { GlassCard, Overline } from "./primitives";
import { UploadDialog } from "@/components/meeting/upload-dialog";

const METRICS = [
  { value: "12", label: "Meetings Analyzed" },
  { value: "92%", label: "Avg. Agenda Completion" },
  { value: "48", label: "Signals Detected" },
  { value: "6.2h", label: "Time Saved" },
];

/** Small floating metrics card (upper-right on desktop, stacked on mobile). */
function StatMetrics({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mb-3 font-display text-base font-semibold tracking-tight text-white">
        Better meetings build better teams.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-white/10 bg-[#0a0d1f]/80 p-3 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-[#0a0d1f]/90"
          >
            <p className="font-display text-xl font-bold tracking-tight text-white">{m.value}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-muted">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <GlassCard className="relative overflow-hidden !p-6 md:!p-8">
      {/* soft ambient wash behind hero (static — see app-shell comment) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        {/* left: copy + actions (z-layered above the orb glow so text never sits on it) */}
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_10px_2px_rgba(16,185,129,0.7)] animate-pulse-glow" />
            <Overline>AI Meeting Autopsy · Online</Overline>
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.08] tracking-tight text-white md:text-4xl">
            The meeting is over.
            <br />
            The <span className="text-gradient">insight</span> begins.
          </h2>
          <p className="mt-1 font-display text-lg font-semibold tracking-tight text-white/85">
            Your meeting just got <span className="text-gradient font-bold">smarter</span>
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Upload. Analyze. Get insights. Turn talk into action.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className="group inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_-8px_rgba(139,92,246,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand/90 hover:shadow-[0_0_36px_-8px_rgba(139,92,246,1)]"
            >
              <UploadCloud size={16} className="transition-transform group-hover:-translate-y-0.5" />
              Upload Meeting
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_22px_-10px_rgba(34,211,238,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent/15 hover:shadow-[0_0_30px_-10px_rgba(34,211,238,1)]"
            >
              <Activity size={16} />
              Start Live Analysis
            </button>
          </div>

          {/* subtle AI-intelligence status strip */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            <span className="inline-flex items-center gap-1.5 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(34,211,238,0.8)] animate-pulse-glow" />
              AI Analysis Active
            </span>
            <span className="text-white/15">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand/70" />
              48 signals detected
            </span>
            <span className="text-white/15">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-brand/70" />
              12 meetings analyzed
            </span>
          </div>
        </div>

        {/* right: AI brand-signature visual + floating metrics */}
        <div className="relative">
          <AiOrb />
          <StatMetrics className="mt-6 w-full md:absolute md:-top-10 md:right-0 md:mt-0 md:w-72 lg:-right-3" />
        </div>
      </div>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </GlassCard>
  );
}