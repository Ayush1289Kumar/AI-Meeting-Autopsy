import { cn } from "@/lib/utils";

/** Spacious glass panel used across the showcase. */
export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("glass-card", className)}>{children}</div>;
}


/** Small uppercase overline label. */
export function Overline({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{children}</p>
  );
}

/** Neon glowing status pill. */
export function StatusPill({
  tone = "brand",
  children,
}: {
  tone?: "brand" | "success" | "warning" | "danger";
  children: React.ReactNode;
}) {
  const map = {
    brand: "border-brand/40 bg-brand/10 text-brand shadow-[0_0_18px_-6px_rgba(139,92,246,0.7)]",
    success:
      "border-success/40 bg-success/10 text-success shadow-[0_0_18px_-6px_rgba(16,185,129,0.7)]",
    warning:
      "border-warning/40 bg-warning/10 text-warning shadow-[0_0_18px_-6px_rgba(245,185,75,0.6)]",
    danger: "border-danger/40 bg-danger/10 text-danger shadow-[0_0_18px_-6px_rgba(248,113,113,0.6)]",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        map[tone]
      )}
    >
      {children}
    </span>
  );
}