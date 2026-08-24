"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
      <ul className="space-y-1">
        {recommendations.slice(0, 7).map((recommendation, i) => (
          <motion.li
            key={recommendation.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm text-white transition-colors hover:bg-white/[0.03]"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-gradient-soft font-display text-[10px] font-semibold text-brand-2">
              {String(i + 1).padStart(2, "0")}
            </span>
            {recommendation.text}
          </motion.li>
        ))}
      </ul>
      <CardFooterLink href={href} label="View full recommendations" />
    </Card>
  );
}
