import { CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardFooterLink, CardHeader } from "@/components/ui/card";

export function AiRecommendationsCard({
  recommendations,
  href,
}: {
  recommendations: { id: string; text: string }[];
  href: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader
        title="AI Recommendations"
        icon={
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-ai to-brand shadow-[0_0_14px_-3px_rgba(34,211,238,0.8)]">
            <Sparkles size={14} className="text-white" />
          </span>
        }
      />
      <ul className="space-y-2.5">
        {recommendations.slice(0, 7).map((recommendation) => (
          <li key={recommendation.id} className="flex items-start gap-2.5 rounded-lg bg-white/[0.02] px-2 py-1.5 text-sm text-white/85 transition-colors hover:bg-white/[0.05]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
            {recommendation.text}
          </li>
        ))}
      </ul>
      <CardFooterLink href={href} label="View full recommendations" />
    </Card>
  );
}
