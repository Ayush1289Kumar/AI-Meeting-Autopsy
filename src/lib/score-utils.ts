/**
 * Scoring & classification helpers.
 * Extracted from lib/constants.ts so that file only exports pure data constants.
 *
 * All existing imports from "@/lib/constants" still work — constants.ts
 * re-exports everything from here for backward compatibility.
 */

/** Human-readable label for a meeting health score (0-100). */
export function healthLabel(score: number): string {
  if (score >= 90) return "Excellent Meeting";
  if (score >= 70) return "Good Meeting";
  if (score >= 50) return "Fair Meeting";
  return "Poor Meeting";
}

/** Hex colour matching a health score tier. */
export function healthColor(score: number): string {
  if (score >= 90) return "#34d399";
  if (score >= 70) return "#4f7cff";
  if (score >= 50) return "#fbbf24";
  return "#ef4444";
}

/**
 * Traffic-light colour for a confidence value.
 * Accepts either 0-1 fractions or 0-100 percentages.
 */
export function confidenceColor(confidence: number): "green" | "yellow" | "red" {
  const pct = confidence <= 1 ? confidence * 100 : confidence;
  if (pct >= 90) return "green";
  if (pct >= 70) return "yellow";
  return "red";
}

/**
 * Speaking-balance quality label derived from a Gini coefficient.
 * Business rule 4 from the PRD.
 */
export function balanceRating(gini: number): "Excellent" | "Good" | "Fair" | "Poor" {
  if (gini < 0.15) return "Excellent";
  if (gini < 0.25) return "Good";
  if (gini < 0.4) return "Fair";
  return "Poor";
}
