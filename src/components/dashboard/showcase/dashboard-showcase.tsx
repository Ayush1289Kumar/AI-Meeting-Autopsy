"use client";

import { HeroSection } from "./hero-section";
import { AnalysisSection } from "./analysis-section";
import { KeyHighlights } from "./key-highlights";
import { ConversationTimeline } from "./conversation-timeline";
import { BottomSection } from "./bottom-section";
import { Reveal } from "@/components/motion/reveal";

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