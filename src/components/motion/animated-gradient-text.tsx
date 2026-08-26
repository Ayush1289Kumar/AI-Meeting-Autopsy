"use client";

import { type ReactNode } from "react";

/**
 * AnimatedGradientText — wraps a span in the .animated-gradient-text CSS class
 * which uses @property --grad-angle for a smooth rotating conic gradient.
 *
 * The CSS animation lives in globals.css so it works without a JS runtime.
 * This component is a thin wrapper that makes the pattern composable in JSX.
 *
 * Reduced-motion fallback: CSS handles it (static gradient, animation: none).
 */
export function AnimatedGradientText({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  return (
    <Tag className={["animated-gradient-text", className].filter(Boolean).join(" ")}>
      {children}
    </Tag>
  );
}
