"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Activity, UploadCloud } from "lucide-react";
import { AnimatedGradientText } from "@/components/motion/animated-gradient-text";
import { BlurFade } from "@/components/motion/blur-fade";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { CountUp } from "@/components/motion/count-up";
// AutopsyScan - AI scan plane sweeping a meeting-data cluster (client-only, no SSR).

const AutopsyScan = dynamic(
  () => import("@/components/common/autopsy-scan").then((m) => m.AutopsyScan),
  { ssr: false }
);




const TRUST_STATS = [
  { value: 2400, suffix: "+", label: "Meetings analyzed" },
  { value: 98, suffix: "%", label: "AI accuracy" },
  { value: 47, suffix: "", label: "Signals per meeting" },
];

export function LandingHero() {
  return (
    <section
      className="noise-overlay relative overflow-hidden px-6 pb-16 pt-20 lg:pb-24 lg:pt-28"
      aria-label="Hero"
    >
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-[640px] w-[640px] rounded-full bg-brand/20 blur-[160px]" />
        <div className="absolute -right-32 top-1/3 h-[480px] w-[480px] rounded-full bg-blue/15 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-accent/8 blur-[130px]" />
        <div className="grid-overlay absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
          {/* Left: Copy */}
          <div className="relative z-10 flex flex-col">
            {/* Eyebrow pill */}
            <BlurFade delay={0} inView>
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow shadow-[0_0_8px_2px_rgba(16,185,129,0.8)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                  AI-Powered Meeting Intelligence
                </span>
              </div>
            </BlurFade>

            {/* Headline */}
            <BlurFade delay={80} inView>
              <h1 className="font-display text-5xl font-black leading-[1.04] tracking-[-0.03em] text-white lg:text-6xl xl:text-7xl">
                The meeting is over.
                <br />
                The{" "}
                <AnimatedGradientText>insight</AnimatedGradientText>
                {" "}begins.
              </h1>
            </BlurFade>

            {/* Subheadline */}
            <BlurFade delay={160} inView>
              <p className="mt-5 text-lg leading-relaxed text-white/75 lg:max-w-lg">
                AI-powered post-mortems that give your team back their time.
                Upload a recording or transcript — get a health score, decision log,
                wasted-time heatmap, and actionable recommendations in seconds.
              </p>
            </BlurFade>

            {/* CTAs */}
            <BlurFade delay={240} inView>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <MagneticButton
                  as="a"
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_-8px_rgba(139,92,246,0.9)] transition-shadow hover:shadow-[0_0_52px_-8px_rgba(139,92,246,1)]"
                >
                  <UploadCloud size={16} />
                  Analyze Your First Meeting
                </MagneticButton>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/8 hover:text-white"
                >
                  <Activity size={16} className="text-accent" />
                  See how it works ↓
                </Link>
              </div>
            </BlurFade>

            {/* Trust checklist */}
            <BlurFade delay={320} inView>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                {["No credit card required", "Any transcript format", "Results in seconds"].map(
                  (t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span className="text-success">✓</span>
                      {t}
                    </span>
                  )
                )}
              </div>
            </BlurFade>

            {/* Mini stats strip */}
            <BlurFade delay={400} inView>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {TRUST_STATS.map((s, i) => (
                  <div key={s.label} className="text-center">
                    <p className="font-display text-2xl font-black tabular text-white">
                      <CountUp to={s.value} suffix={s.suffix} duration={1600 + i * 200} />
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>

          {/* Right: Visual - AutopsyScan (AI scan plane dissecting the meeting-data cluster) */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-[460px] w-full sm:h-[560px]">
              {/* Reactive orb (WebGL particles) - behind the brain core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AutopsyScan className="h-[500px] w-full max-w-[640px] sm:h-[620px]" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
