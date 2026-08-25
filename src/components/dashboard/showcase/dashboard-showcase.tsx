"use client";

import dynamic from "next/dynamic";
import { HeroSection } from "./hero-section";
import { AnalysisSection } from "./analysis-section";
import { KeyHighlights } from "./key-highlights";
import { ConversationTimeline } from "./conversation-timeline";
import { Reveal } from "@/components/motion/reveal";

// BottomSection pulls in Recharts; load it off the critical path.
const BottomSection = dynamic(() => import("./bottom-section").then((m) => m.BottomSection), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse rounded-xl bg-white/5" aria-hidden />,
});

export function DashboardShowcase() {
  return (
    <div className="animate-fade-in space-y-5">
      <HeroSection />
      <Reveal>
        <AnalysisSection />
      </Reveal>
      <Reveal delay={80}>
        <KeyHighlights />
      </Reveal>
      <Reveal delay={60}>
        <ConversationTimeline />
      </Reveal>
      <Reveal delay={100} variant="scale">
        <BottomSection />
      </Reveal>
    </div>
  );
}