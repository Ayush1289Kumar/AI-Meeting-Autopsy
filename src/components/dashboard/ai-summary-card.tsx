import { BrainCircuit } from "lucide-react";
import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";

export function AiSummaryCard({ summary, href }: { summary: string; href: string }) {
  return (
    <Card>
      <CardHeader title="AI Autopsy Summary" icon={<BrainCircuit size={15} className="text-ai" />} />
      <p className="text-sm leading-relaxed text-muted">{summary}</p>
      <CardFooterLink href={href} label="View Full Autopsy" />
    </Card>
  );
}
