"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

export function GaugeChart({ score, color }: { score: number; color: string }) {
  const [displayScore, setDisplayScore] = useState(0);
  const progress = useMotionValue(0);

  const size = 176;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // 260 degree arc, matching the original gauge's visual span
  const arcFraction = 260 / 360;
  const arcLength = circumference * arcFraction;
  const gapLength = circumference - arcLength;

  useEffect(() => {
    const controls = animate(progress, score / 100, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v * 100)),
    });
    return () => controls.stop();
  }, [score, progress]);

  return (
    <div className="relative flex h-40 items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-[130deg]"
        style={{ filter: `drop-shadow(0 0 14px ${color}55)` }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * arcLength }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold text-white">{displayScore}</span>
        <span className="text-xs text-muted">/ 100</span>
      </div>
    </div>
  );
}
