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
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#0E151D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
            formatter={(value) => [`${value}% value`, "Value level"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#34d399"
            fill="url(#valueGradient)"
            strokeWidth={2.5}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
