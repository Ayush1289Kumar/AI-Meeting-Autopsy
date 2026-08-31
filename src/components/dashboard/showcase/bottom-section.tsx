"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { GlassCard } from "./primitives";
import { CountUp } from "@/components/motion/count-up";
import { BlurFade } from "@/components/motion/blur-fade";
import { ParticleVortexVisual } from "@/components/common/visual-wrappers";

/* ---------- Speaking Distribution ---------- */
const SPEAKERS = [
  { name: "Aditi", pct: 34, minutes: 20, color: "#8b5cf6" },
  { name: "Ayush", pct: 27, minutes: 16, color: "#22d3ee" },
  { name: "Riya", pct: 19, minutes: 11, color: "#3d8bff" },
  { name: "Rahul", pct: 12, minutes: 7, color: "#10b981" },
  { name: "Neha", pct: 8, minutes: 4, color: "#f5b94b" },
];

function SpeakingDonut() {
  const data = SPEAKERS.map((s) => ({ name: s.name, value: s.pct, color: s.color }));
  return (
    <GlassCard>
      <h3 className="mb-3 font-display text-base font-semibold tracking-tight text-white">
        Speaking Distribution
      </h3>
      <div className="relative h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="68%"
              outerRadius="96%"
              paddingAngle={2}
              stroke="none"
              cornerRadius={4}
              isAnimationActive={true}
              animationDuration={800}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} style={{ filter: `drop-shadow(0 0 5px ${d.color}66)` }} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted">Total</span>
          <span className="font-display text-2xl font-bold tracking-tight text-white flex items-baseline">
            <CountUp to={58} duration={1200} />
            <span className="ml-0.5 text-xs text-muted font-normal">min</span>
          </span>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {SPEAKERS.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}
            />
            <span className="flex-1 font-medium text-white">{s.name}</span>
            <span className="text-muted font-mono tabular">
              <CountUp to={s.minutes} duration={1000 + i * 100} />m · <CountUp to={s.pct} duration={1000 + i * 100} />%
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/* ---------- Top Topics ---------- */
const TOPICS = [
  { name: "Product Roadmap", minutes: 24 },
  { name: "Feature Prioritization", minutes: 18 },
  { name: "User Feedback", minutes: 12 },
  { name: "Q4 Planning", minutes: 8 },
  { name: "Team Alignment", minutes: 6 },
];

function TopTopics() {
  const max = Math.max(...TOPICS.map((t) => t.minutes));
  return (
    <GlassCard>
      <h3 className="mb-4 font-display text-base font-semibold tracking-tight text-white">Top Topics</h3>
      <ul className="space-y-3.5">
        {TOPICS.map((t, i) => (
          <li key={t.name}>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-2">
                <span className="font-display text-[11px] font-bold text-muted">{i + 1}</span>
                <span className="font-medium text-white">{t.name}</span>
              </span>
              <span className="font-semibold text-muted font-mono tabular">
                <CountUp to={t.minutes} duration={1100 + i * 100} /> min
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand via-ai to-accent transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${(t.minutes / max) * 100}%`, boxShadow: "0 0 10px rgba(139,92,246,0.6)" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

/* ---------- Action Items ---------- */
const ACTIONS = [
  { task: "Update PRD for feature X", owner: "Ayush", initials: "A", avatar: "#22d3ee", due: "Due Aug 16", status: "In Progress", tone: "blue" },
  { task: "Share user research summary", owner: "Riya", initials: "R", avatar: "#3d8bff", due: "Due Aug 18", status: "Assigned", tone: "brand" },
  { task: "Set up follow-up meeting", owner: "Rahul", initials: "R", avatar: "#10b981", due: "Due Aug 20", status: "Not Started", tone: "neutral" },
  { task: "Review analytics dashboard", owner: "Neha", initials: "N", avatar: "#8b5cf6", due: "Due Aug 22", status: "Assigned", tone: "brand" },
];

const STATUS_STYLES: Record<string, string> = {
  blue: "border-blue/30 bg-blue/15 text-blue",
  brand: "border-brand/30 bg-brand/15 text-brand",
  neutral: "border-white/12 bg-white/8 text-muted",
};

function ActionItems() {
  return (
    <GlassCard>
      <h3 className="mb-4 font-display text-base font-semibold tracking-tight text-white">Action Items</h3>
      <ul className="space-y-3">
        {ACTIONS.map((a) => (
          <li
            key={a.task}
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/25 hover:bg-white/[0.05]"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg"
              style={{ backgroundColor: a.avatar, boxShadow: `0 0 14px -3px ${a.avatar}` }}
            >
              {a.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{a.task}</p>
              <p className="text-[11px] text-muted">
                {a.owner} · <span className="font-mono tabular">{a.due}</span>
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLES[a.tone]}`}>
              {a.status}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export function BottomSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-0.5">
      {/* Background Effect — oversized so the vortex fills the space */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-visible flex items-center justify-center opacity-25">
        <div className="w-[130%] h-[220%]">
          <ParticleVortexVisual className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-10 grid gap-4 lg:grid-cols-3">
        <BlurFade delay={0}>
          <SpeakingDonut />
        </BlurFade>
        <BlurFade delay={80}>
          <TopTopics />
        </BlurFade>
        <BlurFade delay={160}>
          <ActionItems />
        </BlurFade>
      </div>
    </div>
  );
}