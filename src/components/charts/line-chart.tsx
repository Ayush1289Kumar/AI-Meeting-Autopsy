"use client";

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function TrendLineChart({
  data,
  dataKey,
  color = "#8b5cf6",
  suffix = "",
  height = 220,
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  color?: string;
  suffix?: string;
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#1b2540" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#9aa3c4", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#9aa3c4", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "rgba(8,11,28,0.95)", border: "1px solid rgba(134,158,224,0.16)", borderRadius: 8, fontSize: 12 }}
            formatter={(value) => [`${value}${suffix}`, dataKey]}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
