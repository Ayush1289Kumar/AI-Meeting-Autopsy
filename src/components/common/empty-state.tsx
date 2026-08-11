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
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-card/50 p-12 text-center">
      <FileQuestion className="mb-3 text-muted" size={32} />
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
      <Link href="/dashboard" className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white">
        Go to dashboard
      </Link>
    </div>
  );
}
