"use client";

import { Info } from "lucide-react";
import { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={text}
        className="text-muted transition-colors hover:text-white"
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Info size={14} />
      </button>
      {open ? (
        <span
          role="tooltip"
          className="absolute left-1/2 top-6 z-30 w-64 -translate-x-1/2 rounded-lg border border-border bg-canvas-elevated/95 backdrop-blur-xl p-3 text-xs font-normal leading-relaxed text-muted shadow-xl"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
