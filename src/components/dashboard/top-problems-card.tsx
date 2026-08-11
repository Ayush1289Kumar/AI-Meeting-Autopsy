import { AlertTriangle } from "lucide-react";
import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";

const SEVERITY_DOT: Record<string, string> = {
  critical: "#ef4444",
  high: "#ef4444",
  medium: "#fb923c",
  low: "#fbbf24",
};

export function TopProblemsCard({
  problems,
  href,
}: {
  problems: { id: string; description: string; severity: string; timeImpact: number | null }[];
  href: string;
}) {
  return (
    <Card>
      <CardHeader title="Top Problems Found" icon={<AlertTriangle size={15} className="text-danger" />} />
      {problems.length ? (
        <ul className="space-y-2.5">
          {problems.slice(0, 5).map((problem) => (
            <li key={problem.id} className="flex items-start gap-2 text-sm text-white">
              <span
                aria-hidden
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: SEVERITY_DOT[problem.severity] ?? "#fbbf24" }}
              />
              <span>
                {problem.description}
                {problem.timeImpact ? (
                  <span className="text-muted"> ({formatDuration(problem.timeImpact)})</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No significant problems detected.</p>
      )}
      <CardFooterLink href={href} label="View all" />
    </Card>
  );
}
