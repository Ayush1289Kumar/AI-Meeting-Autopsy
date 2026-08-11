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
    <Card>
      <CardHeader title="AI Recommendations" icon={<Sparkles size={15} className="text-ai" />} />
      <ul className="space-y-2.5">
        {recommendations.slice(0, 7).map((recommendation) => (
          <li key={recommendation.id} className="flex items-start gap-2 text-sm text-white">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-success" />
            {recommendation.text}
          </li>
        ))}
      </ul>
      <CardFooterLink href={href} label="View full recommendations" />
    </Card>
  );
}
