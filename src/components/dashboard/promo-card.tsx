import { CalendarPlus } from "lucide-react";

export function PromoCard() {
  return (
    <section className="relative overflow-hidden rounded-card border border-border bg-gradient-to-br from-brand/30 via-ai/20 to-transparent p-5">
      <CalendarPlus className="mb-3 text-white" size={22} />
      <h2 className="text-base font-semibold text-white">Next Meeting</h2>
      <p className="mt-1 text-sm text-white/70">Better Meetings, Better Results.</p>
      <p className="mt-3 max-w-xs text-xs text-white/60">
        Apply the recommendations above to your next agenda and compare the health score afterwards.
      </p>
    </section>
  );
}
