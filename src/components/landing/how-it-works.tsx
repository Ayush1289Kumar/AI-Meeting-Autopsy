import { UploadCloud, BrainCircuit, TrendingUp } from "lucide-react";
import { AnimatedGradientText } from "@/components/motion/animated-gradient-text";
import { BlurFade } from "@/components/motion/blur-fade";

const STEPS = [
  {
    number: "01",
    Icon: UploadCloud,
    title: "Upload or Paste",
    body: "Drop an audio file, video, or paste a raw transcript. Zoom, Teams, Google Meet — any format works.",
    color: "text-brand",
    chipBg: "bg-brand/15",
    glow: "shadow-[0_0_20px_-6px_rgba(139,92,246,0.8)]",
    borderColor: "border-brand/20",
  },
  {
    number: "02",
    Icon: BrainCircuit,
    title: "AI Analyzes",
    body: "Scores 7 health dimensions, extracts every decision, maps speaking balance, and detects wasted time — in seconds.",
    color: "text-accent",
    chipBg: "bg-accent/15",
    glow: "shadow-[0_0_20px_-6px_rgba(34,211,238,0.8)]",
    borderColor: "border-accent/20",
  },
  {
    number: "03",
    Icon: TrendingUp,
    title: "Act on Insights",
    body: "Get a full autopsy report: prioritized recommendations, action items with owners, and trend comparison against past meetings.",
    color: "text-success",
    chipBg: "bg-success/15",
    glow: "shadow-[0_0_20px_-6px_rgba(16,185,129,0.8)]",
    borderColor: "border-success/20",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-pad px-6"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Eyebrow + Headline */}
        <BlurFade>
          <div className="mb-16 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              How It Works
            </p>
            <h2 className="font-display text-3xl font-black tracking-tight text-white lg:text-4xl">
              From meeting to mastery{" "}
              <AnimatedGradientText>in three steps.</AnimatedGradientText>
            </h2>
          </div>
        </BlurFade>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.Icon;
            return (
              <BlurFade key={step.number} delay={i * 150}>
                <div className={`relative rounded-2xl border ${step.borderColor} bg-card/50 p-6 text-center`}>
                  {/* Icon chip */}
                  <div
                    className={`relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${step.chipBg} ${step.glow}`}
                  >
                    <Icon size={24} className={step.color} />
                  </div>

                  <h3 className={`font-display text-xl font-bold tracking-tight ${step.color}`}>
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
