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
          <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#8b8d9e", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{ background: "#0E151D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
          />
          {bars.length > 1 ? <Legend wrapperStyle={{ fontSize: 11, color: "#8b8d9e" }} /> : null}
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color}
              radius={[6, 6, 0, 0]}
              animationDuration={900}
              animationEasing="ease-out"
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
