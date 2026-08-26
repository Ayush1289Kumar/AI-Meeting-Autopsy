import {
  Activity,
  CheckSquare,
  ListChecks,
  Users,
  Timer,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { AnimatedGradientText } from "@/components/motion/animated-gradient-text";
import { BlurFade } from "@/components/motion/blur-fade";

const FEATURES = [
  {
    id: "health",
    Icon: Activity,
    title: "AI Health Score",
    body: "A weighted 7-dimension score covering decision clarity, speaking balance, time efficiency, engagement, topic coverage, action quality, and duration.",
    color: "text-brand",
    chipBg: "bg-brand/15",
    glow: "shadow-[0_0_20px_-6px_rgba(139,92,246,0.75)]",
    badge: "87/100",
    badgeColor: "text-success",
    span: "lg:col-span-2",
  },
  {
    id: "decisions",
    Icon: CheckSquare,
    title: "Decision Clarity",
    body: "Every decision extracted, logged, and attributed to the right speaker with timestamp and confidence score.",
    color: "text-accent",
    chipBg: "bg-accent/15",
    glow: "shadow-[0_0_20px_-6px_rgba(34,211,238,0.75)]",
    span: "lg:col-span-1",
  },
  {
    id: "balance",
    Icon: Users,
    title: "Speaking Balance",
    body: "Gini coefficient-based fairness scoring. Know exactly who dominated and who stayed silent.",
    color: "text-blue",
    chipBg: "bg-blue/15",
    glow: "shadow-[0_0_20px_-6px_rgba(61,139,255,0.75)]",
    span: "lg:col-span-2",
  },
  {
    id: "waste",
    Icon: Timer,
    title: "Wasted Time",
    body: "Segment-level heatmap identifying tangents, repeated discussions, and off-topic rabbit holes — with exact timestamps.",
    color: "text-warning",
    chipBg: "bg-warning/15",
    glow: "shadow-[0_0_20px_-6px_rgba(245,185,75,0.6)]",
    span: "lg:col-span-1",
  },
  {
    id: "actions",
    Icon: ListChecks,
    title: "Action Items",
    body: "Every commitment captured: who owns it, what the deadline is, and whether it was clearly stated or implied.",
    color: "text-success",
    chipBg: "bg-success/15",
    glow: "shadow-[0_0_20px_-6px_rgba(16,185,129,0.75)]",
    span: "lg:col-span-1",
  },
  {
    id: "analytics",
    Icon: BarChart3,
    title: "Topic Analytics",
    body: "Full topic timeline: drift detection, coverage percentage, when each topic started and ended, and how long each consumed.",
    color: "text-orange",
    chipBg: "bg-orange/15",
    glow: "shadow-[0_0_20px_-6px_rgba(251,176,100,0.65)]",
    span: "lg:col-span-2",
  },
];

export function FeatureGrid() {
  return (
    <section className="section-pad px-6" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl">
        {/* Eyebrow + Headline */}
        <BlurFade>
          <div className="mb-14 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              What We Detect
            </p>
            <h2
              id="features-heading"
              className="font-display text-3xl font-black tracking-tight text-white lg:text-4xl"
            >
              Everything hiding in{" "}
              <AnimatedGradientText>your meetings.</AnimatedGradientText>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Six dimensions of analysis — each powered by a dedicated AI model tuned
              specifically for meeting dynamics.
            </p>
          </div>
        </BlurFade>

        {/* Asymmetric grid: 2+1 / 2+1+2 pattern */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.Icon;
            return (
              <BlurFade key={f.id} delay={i * 80}>
                <div className="group card-surface flex h-full flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${f.chipBg} ${f.glow}`}
                    >
                      <Icon size={18} className={f.color} />
                    </span>
                    <div>
                      <h3 className={`font-display text-base font-bold tracking-tight ${f.color}`}>
                        {f.title}
                      </h3>
                    </div>
                    {f.badge && (
                      <span
                        className={`ml-auto shrink-0 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 font-mono text-xs font-bold tabular ${f.badgeColor}`}
                      >
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted/90">{f.body}</p>
                  <div className="mt-auto flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted opacity-0 transition-opacity group-hover:opacity-100">
                    <Sparkles size={11} className={f.color} />
                    AI-Powered
                  </div>
                </div>
              </BlurFade>
            );
          })}
        </div>
      </div>
    </section>
  );
}
