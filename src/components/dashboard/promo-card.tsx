import { CalendarPlus, Sparkles } from "lucide-react";

export function PromoCard() {
  return (
    <section className="shimmer-border relative overflow-hidden rounded-card border border-brand/25 bg-gradient-to-br from-brand/30 via-accent/15 to-transparent p-5 shadow-[0_0_45px_-18px_rgba(139,92,246,0.8)]">
      {/* decorative glow orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/15 blur-2xl animate-float"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-16 h-16 w-16 rounded-full bg-accent/25 blur-xl animate-float"
        style={{ animationDelay: "-2s" }}
      />

      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
        <CalendarPlus className="text-white" size={22} />
      </span>
      <h2 className="mt-3 flex items-center gap-2 text-base font-semibold text-white">
        Next Meeting
        <Sparkles size={14} className="text-warning" />
      </h2>
      <p className="mt-1 text-sm text-white/80">
        Better Meetings, <span className="text-gradient font-semibold">Better Results.</span>
      </p>
      <p className="mt-3 max-w-xs text-xs leading-relaxed text-white/60">
        Apply the recommendations above to your next agenda and compare the health score afterwards.
      </p>
    </section>
  );
}
