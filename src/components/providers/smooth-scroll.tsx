"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Lenis smooth scrolling (root mode = it owns window scrolling).
 *
 * Disabled entirely for users who prefer reduced motion — Lenis hijacks wheel
 * events, which is exactly the kind of sustained motion those users opt out of.
 * Rendered on the server too (wrapper present in SSR output) so there is no
 * hydration mismatch; the reduced-motion opt-out happens after mount.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnabled(false);
    }
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
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
    </ReactLenis>
  );
}
