import { MagneticButton } from "@/components/motion/magnetic-button";
import { BlurFade } from "@/components/motion/blur-fade";
import { UploadCloud } from "lucide-react";

export function FinalCta() {
  return (
    <section className="section-pad px-6" aria-label="Get started">
      <div className="mx-auto max-w-3xl">
        <BlurFade>
          <div className="shimmer-border noise-overlay relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand/15 via-card to-accent/10 p-12 text-center shadow-[0_0_80px_-20px_rgba(139,92,246,0.4)]">
            {/* Ambient glows inside the card */}
            <div aria-hidden className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-brand/30 blur-[80px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-accent/20 blur-[80px]" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl font-black tracking-tight text-white lg:text-4xl">
                Your next meeting is waiting
                <br />
                <span className="text-gradient">to be understood.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">
                Join teams who turned their meeting data into a competitive advantage.
                Analysis takes seconds. Improvement lasts.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <MagneticButton
                  as="a"
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_-8px_rgba(139,92,246,0.9)] transition-shadow hover:shadow-[0_0_56px_-8px_rgba(139,92,246,1)]"
                >
                  <UploadCloud size={16} />
                  Analyze Your First Meeting →
                </MagneticButton>
                <p className="text-xs text-muted">Free · No credit card · Instant results</p>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
