import Link from "next/link";
import { FileQuestion } from "lucide-react";

export function EmptyState({
  title = "No meeting yet",
  message = "Upload a recording or paste a transcript to generate your first autopsy.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong bg-white/[0.02] p-12 text-center backdrop-blur-xl">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient-soft">
        <FileQuestion className="text-brand-2" size={26} />
      </span>
      <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      <Link
        href="/dashboard"
        className="mt-5 rounded-lg bg-brand-gradient px-4 py-2 text-sm font-medium text-white shadow-glow-soft transition-shadow hover:shadow-glow-brand"
      >
        Go to dashboard
      </Link>
    </div>
  );
}
