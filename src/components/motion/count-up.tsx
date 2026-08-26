"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CountUp — spring-feel numeric counter that animates 0 → `to` when the
 * element enters the viewport. Hand-ported from animate-ui's CountUp pattern.
 *
 * - Respects `prefers-reduced-motion`: renders final value immediately.
 * - Triggers once (IntersectionObserver, threshold 0.3).
 * - Easing: ease-out-expo feel (physical deceleration curve).
 */
export function CountUp({
  to,
  from = 0,
  decimals = 0,
  duration = 1400,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  decimals?: number;
  /** Animation duration in ms. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // Respect reduced motion: skip straight to final value.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(to);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            io.disconnect();
            animate();
          }
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();

    function animate() {
      const start = performance.now();
      function tick(now: number) {
        const elapsed = now - start;
        // Ease-out-expo: 1 - 2^(-10 * t) — feels like spring deceleration
        const t = Math.min(elapsed / duration, 1);
        const progress = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(from + (to - from) * progress);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }, [to, from, duration]);

  const display =
    prefix +
    (decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()) +
    suffix;

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
