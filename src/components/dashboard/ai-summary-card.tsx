import { BrainCircuit } from "lucide-react";
import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";

export function AiSummaryCard({ summary, href }: { summary: string; href: string }) {
  return (
    <Card>
      <CardHeader
        title="AI Autopsy Summary"
        icon={
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-ai to-brand shadow-[0_0_14px_-3px_rgba(34,211,238,0.8)]">
            <BrainCircuit size={14} className="text-white" />
          </span>
        }
      />
      <p className="text-sm leading-relaxed text-white/80 [text-wrap:pretty]">
        <span className="mr-1 inline-flex items-center rounded-md bg-ai/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ai">
          AI
        </span>
        {summary}
      </p>
      <CardFooterLink href={href} label="View Full Autopsy" />
    </Card>
  );
}
