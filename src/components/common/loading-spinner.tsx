export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-brand" />
      {label ?? "Loading…"}
    </div>
  );
}
