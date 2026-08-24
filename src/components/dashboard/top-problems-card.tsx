"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";
import { Badge, severityTone } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";

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
        <ul className="space-y-1.5">
          {problems.slice(0, 5).map((problem, i) => (
            <motion.li
              key={problem.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-white transition-colors hover:bg-white/[0.03]"
            >
              <span className="leading-snug">
                {problem.description}
                {problem.timeImpact ? (
                  <span className="text-muted"> ({formatDuration(problem.timeImpact)})</span>
                ) : null}
              </span>
              <Badge tone={severityTone(problem.severity)} className="shrink-0 capitalize">
                {problem.severity}
              </Badge>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No significant problems detected.</p>
      )}
      <CardFooterLink href={href} label="View all" />
    </Card>
  );
}
