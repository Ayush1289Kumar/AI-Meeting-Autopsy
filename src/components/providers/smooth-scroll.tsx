"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

/**
 * Lenis smooth scrolling (root mode = it owns window scrolling).
 *
 * The Lenis runtime itself is code-split and only fetched once the browser is
 * idle, so smooth scrolling never competes with first-paint/hydration work.
 * Disabled entirely for users who prefer reduced motion — Lenis hijacks wheel
 * events, which is exactly the kind of sustained motion those users opt out of.
 */
const LazyReactLenis = dynamic(() => import("lenis/react").then((m) => m.ReactLenis), {
  ssr: false,
});

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Defer activation until the main thread has a free moment.
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const cancel =
      w.requestIdleCallback?.(() => setEnabled(true)) ??
      window.setTimeout(() => setEnabled(true), 1200);
    return () => {
      if ("cancelIdleCallback" in window && typeof cancel === "number") {
        window.cancelIdleCallback(cancel);
      } else {
        clearTimeout(cancel);
      }
    };
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <LazyReactLenis
      root
      options={{
        // Short + gentle: premium feel without making a data-dense dashboard feel floaty.
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </LazyReactLenis>
  );
}
