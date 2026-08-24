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
          <Pie
            data={data}
            dataKey="value"
            innerRadius="62%"
            outerRadius="90%"
            paddingAngle={2}
            stroke="none"
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#0E151D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
            formatter={(value, name) => {
              const datum = data.find((item) => item.name === name);
              return [datum?.label ?? String(value), String(name)];
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerTop ? <span className="text-lg font-semibold text-white">{centerTop}</span> : null}
        {centerBottom ? <span className="text-[11px] text-muted">{centerBottom}</span> : null}
      </div>
    </div>
  );
}
