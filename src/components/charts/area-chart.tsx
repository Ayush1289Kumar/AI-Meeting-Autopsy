"use client";

import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface AreaPoint {
  label: string;
  value: number;
}

export function ValueAreaChart({ data, height = 180 }: { data: AreaPoint[]; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <defs>
            <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#2a2b3d" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
            contentStyle={{
              background: "rgba(15,17,26,0.92)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              fontSize: 12,
              boxShadow: "0 12px 40px -12px rgba(0,0,0,0.8), 0 0 24px -12px rgba(79,124,255,0.6)",
              backdropFilter: "blur(10px)",
            }}
            formatter={(value) => [`${value}% value`, "Value level"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#34d399"
            strokeWidth={2.5}
            fill="url(#valueGradient)"
            style={{ filter: "drop-shadow(0 0 6px rgba(52,211,153,0.6))" }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
