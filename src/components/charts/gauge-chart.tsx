"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export function GaugeChart({ score, color }: { score: number; color: string }) {
  const data = [
    { name: "score", value: score },
    { name: "rest", value: Math.max(0, 100 - score) },
  ];

  return (
    <div className="relative h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={220}
            endAngle={-40}
            innerRadius="70%"
            outerRadius="95%"
            stroke="none"
            cornerRadius={6}
            isAnimationActive={false}
          >
            <Cell fill={color} style={{ filter: `drop-shadow(0 0 6px ${color}aa)` }} />
            <Cell fill="#1b2540" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display text-3xl font-bold tracking-tight text-white"
          style={{ textShadow: `0 0 22px ${color}99` }}
        >
          {score}
        </span>
        <span className="text-xs font-medium text-muted">/ 100</span>
      </div>
    </div>
  );
}
