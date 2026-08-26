"use client";

import { Info } from "lucide-react";
import { useState } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={`More info: ${text}`}
        aria-expanded={open}
        className="rounded text-muted transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
        onClick={() => setOpen((v) => !v)}
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
          className="absolute left-1/2 top-6 z-30 w-64 -translate-x-1/2 rounded-lg border border-border bg-[#12131c] p-3 text-xs font-normal leading-relaxed text-muted shadow-xl"
          style={{
            animation: "fade-in 0.15s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
