"use client";

import { Bot, Sparkles } from "lucide-react";

export function CopilotCard() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-card border border-brand/25 bg-gradient-to-br from-brand/20 via-ai/10 to-transparent p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/20 blur-2xl animate-pulse-glow"
      />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand shadow-[0_0_16px_-4px_rgba(139,92,246,0.9)]">
            <Bot size={16} className="text-white" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold tracking-tight text-white">AI Copilot</p>
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_2px_rgba(16,185,129,0.8)] animate-pulse-glow" />
              Active
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/70">
          Analyzing conversation patterns.
          <br />
          Turning talk into clear actions.
        </p>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-[11px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand hover:shadow-[0_0_20px_-6px_rgba(139,92,246,0.9)]"
        >
          <Sparkles size={13} className="text-accent" />
          View Insights
        </button>
      </div>
    </div>
  );
}