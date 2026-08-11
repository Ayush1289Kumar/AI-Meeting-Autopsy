"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — covers the FULL viewport always */}
      <div className="fixed inset-0 z-40 bg-black/70" aria-hidden="true" onClick={onClose} />

      {/* Scroll container — sits above backdrop, transparent */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center px-4 py-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="w-full max-w-2xl rounded-card border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
              </div>
              <button type="button" aria-label="Close" onClick={onClose} className="text-muted hover:text-white">
                <X size={18} />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
