"use client";

import { useState } from "react";
import { Activity, UploadCloud } from "lucide-react";
import { AiOrb } from "./ai-orb";
import { DashboardGlobeVisual } from "@/components/common/visual-wrappers";
import { GlassCard, Overline } from "./primitives";
import { UploadDialog } from "@/components/meeting/upload-dialog";
import { AnimatedGradientText } from "@/components/motion/animated-gradient-text";
import { MagneticButton } from "@/components/motion/magnetic-button";




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
          <h2 className="mt-3 font-display text-4xl font-black leading-[1.04] tracking-[-0.03em] text-white md:text-5xl">
            The meeting is over.
            <br />
            The{" "}
            <AnimatedGradientText>insight</AnimatedGradientText>
            {" "}begins.
          </h2>
          <p className="mt-1 font-display text-lg font-semibold tracking-tight text-white/85">
            Your meeting just got <span className="text-gradient font-bold">smarter</span>
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Upload. Analyze. Get insights. Turn talk into action.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton
              type="button"
              onClick={() => setUploadOpen(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_32px_-8px_rgba(139,92,246,0.9)] transition-shadow hover:shadow-[0_0_44px_-8px_rgba(139,92,246,1)]"
            >
              <UploadCloud size={16} className="transition-transform group-hover:-translate-y-0.5" />
              Upload Meeting
            </MagneticButton>
            <MagneticButton
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_22px_-10px_rgba(34,211,238,0.8)] transition-shadow hover:shadow-[0_0_30px_-10px_rgba(34,211,238,1)]"
            >
              <Activity size={16} />
              Start Live Analysis
            </MagneticButton>
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

        {/* right: globe visual above the AI orb (brand signature) + floating metrics */}
        <div className="relative flex flex-col items-center justify-center py-10">
          {/* Dashboard globe background */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-65 mix-blend-screen">
            <div className="aspect-square h-[150%] sm:h-[180%] w-auto max-w-none">
              <DashboardGlobeVisual className="h-full w-full object-cover" />
            </div>
          </div>
          
          <div className="relative z-10">
            <AiOrb />
          </div>
          

        </div>
      </div>

      <UploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </GlassCard>
  );
}