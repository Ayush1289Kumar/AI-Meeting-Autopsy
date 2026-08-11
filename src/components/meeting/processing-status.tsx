"use client";

import { PROCESSING_STAGES } from "@/lib/constants";
import { Progress } from "@/components/ui/progress";

export function ProcessingStatus({ stage }: { stage: number }) {
  return (
    <div className="space-y-3">
      <Progress value={((stage + 1) / PROCESSING_STAGES.length) * 100} />
      <ul className="space-y-1.5 text-xs">
        {PROCESSING_STAGES.map((label, index) => (
          <li
            key={label}
            className={
              index < stage ? "text-success" : index === stage ? "text-white" : "text-muted"
            }
          >
            {index < stage ? "✓ " : index === stage ? "• " : "  "}
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
