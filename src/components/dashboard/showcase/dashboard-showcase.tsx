"use client";

import { HeroSection } from "./hero-section";
import { AnalysisSection } from "./analysis-section";
import { KeyHighlights } from "./key-highlights";
import { ConversationTimeline } from "./conversation-timeline";
import { BottomSection } from "./bottom-section";

export function DashboardShowcase() {
  return (
    <div className="animate-fade-in space-y-5">
      <HeroSection />
      <AnalysisSection />
      <KeyHighlights />
      <ConversationTimeline />
      <BottomSection />
    </div>
  );
}