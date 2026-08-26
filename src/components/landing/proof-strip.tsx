import { CountUp } from "@/components/motion/count-up";
import { BlurFade } from "@/components/motion/blur-fade";

const STATS = [
  { value: 2400, suffix: "+", label: "Meetings Analyzed", color: "text-brand" },
  { value: 98, suffix: "%", label: "AI Accuracy", color: "text-accent" },
  { value: 6, decimals: 1, suffix: "h", label: "Avg. Time Recovered", color: "text-success" },
  { value: 47, suffix: "", label: "Signals per Meeting", color: "text-warning" },
];

/**
 * ProofStrip — full-width stat strip immediately below the hero fold.
 * CountUp numbers trigger on viewport entry. No card box — just confident numbers.
 * (impeccable principle: hierarchy through size, not containers)
 */
export function ProofStrip() {
  return (
    <div className="border-y border-white/[0.06] bg-[#050816]/60">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <BlurFade key={s.label} delay={i * 60}>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className={`font-display text-4xl font-black tabular ${s.color} lg:text-5xl`}>
                  <CountUp
                    to={s.value}
                    suffix={s.suffix}
                    decimals={s.decimals ?? 0}
                    duration={1400 + i * 150}
                  />
                </p>
                <p className="text-xs font-medium text-muted">{s.label}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
  );
}
