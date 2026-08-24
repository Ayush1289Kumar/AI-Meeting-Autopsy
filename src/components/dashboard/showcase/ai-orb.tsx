"use client";

import { BrainCircuit } from "lucide-react";

/**
 * AI brand-signature orb — concentric diagnostic rings, an orbiting data node,
 * floating signal particles and a calm breathing core.
 *
 * Animation contract (subtle, premium, low-energy):
 *  1. mounts with a 1.4s "activation" settle (signals wake → rings scale in → core lights),
 *  2. then rests calm: slow ring rotation, gentle pulsing core and drifting nodes.
 * Purely decorative (aria-hidden).
 */
export function AiOrb() {
  return (
    <div aria-hidden className="da-orb-activate flex flex-col items-center">
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        {/* soft outer halo (kept gentle so it never fights adjacent copy) */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.28),rgba(34,211,238,0.10)_52%,transparent_72%)] blur-xl" />

        {/* thin technical rings — slow, reliable rotation via explicit keyframes */}
        <div className="da-orbit-a absolute inset-1 rounded-full border border-brand/35" />
        <div className="da-orbit-b absolute inset-6 rounded-full border border-dashed border-accent/30" />
        <div className="absolute inset-10 rounded-full border border-white/8" />

        {/* fine diagnostic spokes */}
        <div className="absolute left-1/2 top-1/2 h-[82%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-brand/15 to-transparent" />
        <div className="absolute left-1/2 top-1/2 h-[82%] w-px -translate-x-1/2 -translate-y-1/2 rotate-90 bg-gradient-to-b from-transparent via-accent/10 to-transparent" />

        {/* orbiting data node — travels with the outer ring */}
        <div className="da-orbit-a absolute inset-1">
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(34,211,238,0.8)]" />
          <span className="absolute bottom-4 -left-0.5 h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_9px_2px_rgba(139,92,246,0.7)]" />
        </div>

        {/* floating signal particles */}
        <div className="absolute bottom-3 right-6 h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_3px_rgba(139,92,246,0.8)] animate-float" />
        <div
          className="absolute bottom-8 left-4 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(34,211,238,0.8)] animate-float"
          style={{ animationDelay: "-3.5s" }}
        />

        {/* AI core — glows, then stays calm */}
        <div className="da-core-pulse absolute inset-11 flex items-center justify-center rounded-full bg-gradient-to-br from-brand/30 via-brand/10 to-accent/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_46px_-8px_rgba(139,92,246,0.85)]">
          <BrainCircuit
            size={64}
            className="text-white/90 drop-shadow-[0_0_18px_rgba(139,92,246,0.8)]"
            strokeWidth={1.1}
          />
        </div>

        {/* inner neural dots */}
        <div className="absolute left-1/2 bottom-6 h-2 w-2 -translate-x-1/2 rounded-full bg-brand/80 shadow-[0_0_10px_2px_rgba(139,92,246,0.6)] animate-pulse-glow" />
        <div className="absolute bottom-12 left-10 h-1.5 w-1.5 rounded-full bg-accent/80 animate-pulse-glow" />
        <div className="absolute bottom-12 right-10 h-2 w-2 rounded-full bg-white/50 shadow-[0_0_8px_2px_rgba(255,255,255,0.3)] animate-pulse-glow" />
      </div>

      {/* brand tagline */}
      <p className="mt-5 flex items-center gap-1.5 text-center font-display text-base font-semibold tracking-tight text-white/90">
        <BrainCircuit size={15} className="text-accent" />
        Not just recording.
        <span className="text-gradient font-bold">We understand.</span>
      </p>
    </div>
  );
}