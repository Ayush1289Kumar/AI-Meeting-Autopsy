/**
 * Shared route-loading skeleton. Rendered instantly by Next.js while a
 * page's server component fetches data — the sidebar/header (in layout.tsx)
 * stay mounted and interactive the whole time, only this content area
 * shows the placeholder, so navigation feels immediate instead of blank.
 */
export function DashboardSkeleton({ variant = "default" }: { variant?: "default" | "hero" }) {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      {variant === "hero" ? (
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="h-72 rounded-card border border-border bg-white/[0.02] lg:col-span-3" />
          <div className="h-72 rounded-card border border-border bg-white/[0.02] lg:col-span-2" />
        </div>
      ) : (
        <div className="h-20 rounded-card border border-border bg-white/[0.02]" />
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-card border border-border bg-white/[0.02]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-card border border-border bg-white/[0.02]" />
        <div className="h-64 rounded-card border border-border bg-white/[0.02]" />
      </div>
    </div>
  );
}
