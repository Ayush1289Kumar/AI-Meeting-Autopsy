"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function DashboardStatusStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-wrap items-center justify-between gap-2 px-1"
    >
      <div className="flex items-center gap-2">
        <Sparkles size={13} className="text-brand-2" />
        <span className="text-xs font-semibold uppercase tracking-wider text-white">AI Meeting Autopsy</span>
        <span className="text-xs text-muted">Analyze · Diagnose · Improve</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted">
        <span>Analysis Complete</span>
        <span className="flex items-center gap-1 font-medium text-success">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Live
        </span>
      </div>
    </motion.div>
  );
}
