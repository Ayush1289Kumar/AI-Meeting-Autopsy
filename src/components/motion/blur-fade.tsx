"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * BlurFade — staggered entrance animation (animate-ui BlurFade pattern).
 * Children fade in with blur + translateY motion on viewport entry.
 * Stagger via the `delay` prop (index * baseDelay from parent).
 *
 * - Respects prefers-reduced-motion: renders fully visible with no transition.
 * - Triggers once per element.
 */
export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 600,
  yOffset = 8,
  blur = "6px",
  inView = false,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: string;
  /** If true, animate immediately (no IO trigger — useful for above-fold content). */
  inView?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(inView);

  useEffect(() => {
    if (inView) return; // Already visible
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -4% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  const style: CSSProperties = {
    "--blur-fade-duration": `${duration}ms`,
    "--blur-fade-delay": `${delay}ms`,
    "--blur-fade-y": `${yOffset}px`,
    "--blur-fade-blur": blur,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={[
        "blur-fade-root",
        visible ? "blur-fade-visible" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
