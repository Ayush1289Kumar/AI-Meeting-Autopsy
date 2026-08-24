"use client";

import { BrainCircuit } from "lucide-react";

/**
 * AI brand-signature orb — calm, premium, GPU-only motion.
 *
 * Animation contract (huashu-style motion language: transform/opacity only):
 *  1. mounts with a 1.2s "activation" settle (expo-out),
 *  2. then rests calm: one composited scan arc rotating around a breathing
 *     halo and a gentle core pulse. No ring stacks, no per-dot animations.
 * Purely decorative (aria-hidden).
 */
export function AiOrb() {
  return (
    <div aria-hidden className="da-orb-activate flex flex-col items-center">
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        {/* breathing halo */}
        <div className="da-halo absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.26),rgba(34,211,238,0.10)_52%,transparent_72%)] blur-xl" />

        {/* static guide ring (no animation — pure structure) */}
        <div className="absolute inset-8 rounded-full border border-white/[0.07]" />

        {/* single GPU-composited scan arc */}
        <div className="da-scan-ring absolute inset-3 rounded-full" />

        {/* AI core */}
        <div className="da-core-pulse absolute inset-12 flex items-center justify-center rounded-full bg-gradient-to-br from-brand/30 via-brand/10 to-accent/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_0_46px_-8px_rgba(139,92,246,0.85)]">
          <BrainCircuit
            size={64}
            className="text-white/90 drop-shadow-[0_0_18px_rgba(139,92,246,0.8)]"
            strokeWidth={1.1}
          />
        </div>
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