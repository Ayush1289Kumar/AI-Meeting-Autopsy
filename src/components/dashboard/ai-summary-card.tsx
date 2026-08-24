"use client";

import { useState } from "react";
import { BrainCircuit } from "lucide-react";
import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";

export function AiSummaryCard({ summary, href }: { summary: string; href: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = summary.length > 220;
  const shown = expanded || !isLong ? summary : `${summary.slice(0, 220).trimEnd()}…`;

  return (
    <Card>
      <CardHeader
        title="AI Autopsy Summary"
        icon={
          <span className="relative flex h-4 w-4 items-center justify-center">
            <BrainCircuit size={15} className="text-ai" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-ai" />
          </span>
        }
      />
      <p className="text-sm leading-relaxed text-muted">{shown}</p>
      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-medium text-brand-2 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
      <CardFooterLink href={href} label="View Full Autopsy" />
    </Card>
  );
}
