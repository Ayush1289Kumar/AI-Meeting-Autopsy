"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
  label?: string;
}

export function DonutChart({
  data,
  centerTop,
  centerBottom,
  height = 190,
}: {
  data: DonutDatum[];
  centerTop?: string;
  centerBottom?: string;
  height?: number;
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius="62%" outerRadius="90%" paddingAngle={2} stroke="none">
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.color}
                style={{ filter: `drop-shadow(0 0 5px ${entry.color}55)` }}
              />
            ))}
          </Pie>
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
            formatter={(value, name) => {
              const datum = data.find((item) => item.name === name);
              return [datum?.label ?? String(value), String(name)];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerTop ? <span className="font-display text-lg font-bold tracking-tight text-white">{centerTop}</span> : null}
        {centerBottom ? <span className="text-[11px] text-muted">{centerBottom}</span> : null}
      </div>
    </div>
  );
}
