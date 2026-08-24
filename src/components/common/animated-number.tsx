"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * Animates a number counting up from 0 (or its previous value) to `value`
 * on mount / whenever `value` changes. Respects prefers-reduced-motion by
 * snapping straight to the final value.
 */
export function AnimatedNumber({
  value,
  duration = 1.1,
  decimals = 0,
  suffix = "",
  prefix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);
  const first = useRef(true);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const from = first.current ? 0 : display;
    first.current = false;
    const controls = animate(from, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion]);

  return (
    <span>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
