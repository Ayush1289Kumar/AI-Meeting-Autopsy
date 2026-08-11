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
  color = "#4f7cff",
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
          <CartesianGrid stroke="#2a2b3d" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ background: "#12131c", border: "1px solid #2a2b3d", borderRadius: 8, fontSize: 12 }}
            formatter={(value) => [`${value}${suffix}`, dataKey]}
          />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
