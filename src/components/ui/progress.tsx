"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Progress({ value, color = "#3B82F6", className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-white/[0.06]", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="h-full rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}66` }}
      />
    </div>
  );
}
