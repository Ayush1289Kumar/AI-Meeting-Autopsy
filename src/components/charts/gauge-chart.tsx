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
          >
            <Cell fill={color} />
            <Cell fill="#2a2b3d" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-muted">/ 100</span>
      </div>
    </div>
  );
}
