"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { TOPIC_COLORS } from "@/lib/constants";
import { formatTimestamp } from "@/lib/utils";

export interface FlowTopic {
  id: string;
  name: string;
  duration: number;
  isDrift: boolean;
}

export interface FlowRow {
  label: string;
  value: string;
  color: string;
  linkLabel: string;
  href: string;
}

export function MeetingFlowCard({
  topics,
  totalDuration,
  rows,
}: {
  topics: FlowTopic[];
  totalDuration: number;
  rows: FlowRow[];
}) {
  const total = Math.max(totalDuration, 1);

  return (
    <Card>
      <CardHeader title="Meeting Flow" subtitle="A visual map of where attention went" />

      <div className="flex overflow-hidden rounded-lg border border-border">
        {topics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center justify-center overflow-hidden whitespace-nowrap px-2 py-1.5 text-center text-[11px] font-medium text-white"
            style={{
              width: `${(topic.duration / total) * 100}%`,
              backgroundColor: topic.isDrift ? "#EF444426" : `${TOPIC_COLORS[i % TOPIC_COLORS.length]}26`,
              color: topic.isDrift ? "#F87171" : TOPIC_COLORS[i % TOPIC_COLORS.length],
              borderRight: i < topics.length - 1 ? "1px solid rgba(148,163,184,0.12)" : undefined,
            }}
            title={topic.name}
          >
            {topic.name}
          </motion.div>
        ))}
      </div>

      <div className="relative mt-2 h-3">
        <motion.div
          className="absolute top-0 h-full w-px bg-brand-2"
          style={{ boxShadow: "0 0 6px #8B5CF6" }}
          initial={{ left: "0%" }}
          animate={{ left: ["0%", "100%", "0%"] }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted">
        <span>00:00</span>
        <span>{formatTimestamp(totalDuration)}</span>
      </div>

      <ul className="mt-4 space-y-3 border-t border-border pt-4">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-muted">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: row.color }} />
              {row.label}
            </span>
            <span className="flex items-center gap-3">
              <span className="font-medium text-white">{row.value}</span>
              <Link href={row.href} className="text-xs font-medium text-brand-2 hover:underline">
                {row.linkLabel} →
              </Link>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
