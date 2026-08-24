export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-brand-2" />
      {label ?? "Loading…"}
    </div>
  );
}
