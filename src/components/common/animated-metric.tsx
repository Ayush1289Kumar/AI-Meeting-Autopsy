"use client";

import { AnimatedNumber } from "@/components/common/animated-number";

/**
 * Renders a formatted value like "14m", "3m 12s", "68%", or "7" with its
 * leading number animated as a count-up, preserving the rest of the string
 * as a static suffix. Falls back to plain text if no leading number is found.
 */
export function AnimatedMetric({ value, duration = 0.9 }: { value: string; duration?: number }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return <>{value}</>;
  const [, numStr, suffix] = match;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return <AnimatedNumber value={Number(numStr)} decimals={decimals} suffix={suffix} duration={duration} />;
}
