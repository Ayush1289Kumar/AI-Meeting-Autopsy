import { BlurFade } from "@/components/motion/blur-fade";

const TESTIMONIALS = [
  {
    quote:
      "We recovered 2.5 hours per sprint planning. The topic drift detection is uncanny — it flagged a 20-minute tangent we didn'\''t even notice we were having.",
    name: "Aditi R.",
    role: "Product Manager",
    company: "Razorpay",
    initial: "A",
    color: "bg-brand",
    stars: 5,
  },
  {
    quote:
      "First time my team'\''s 1:1s had measurable outcomes. The health score changed how we structure every meeting — we now aim for 80+ consistently.",
    name: "Marcus W.",
    role: "Engineering Lead",
    company: "Series A Startup",
    initial: "M",
    color: "bg-accent",
    stars: 5,
  },
  {
    quote:
      "Replaced our manual meeting summaries entirely. The action item capture is 10x better than any human note-taker I'\''ve worked with.",
    name: "Priya S.",
    role: "Founder & CEO",
    company: "EdTech Startup",
    initial: "P",
    color: "bg-success",
    stars: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-pad px-6" aria-label="Customer testimonials">
      <div className="mx-auto max-w-7xl">
        <BlurFade>
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
              What Teams Say
            </p>
            <h2 className="font-display text-3xl font-black tracking-tight text-white lg:text-4xl">
              Meetings that{" "}
              <span className="text-gradient">actually improve.</span>
            </h2>
          </div>
        </BlurFade>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <BlurFade key={t.name} delay={i * 100}>
              <div className="card-surface flex h-full flex-col gap-5">
                {/* Stars */}
                <div className="flex gap-1" aria-label={`${t.stars} out of 5 stars`}>
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <span key={s} className="text-warning text-sm">★</span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 text-sm leading-relaxed text-white/85 italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.color} font-display text-sm font-bold text-white shadow-lg`}
                  >
                    {t.initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-muted">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
