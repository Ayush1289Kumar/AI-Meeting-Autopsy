"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function GroupedBarChart({
  data,
  bars,
  height = 240,
}: {
  data: Record<string, string | number>[];
  bars: { key: string; color: string; name: string }[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="#2a2b3d" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{ background: "#12131c", border: "1px solid #2a2b3d", borderRadius: 8, fontSize: 12 }}
          />
          {bars.length > 1 ? <Legend wrapperStyle={{ fontSize: 11, color: "#8b8d9e" }} /> : null}
          {bars.map((bar) => (
            <Bar key={bar.key} dataKey={bar.key} name={bar.name} fill={bar.color} radius={[4, 4, 0, 0]} />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
