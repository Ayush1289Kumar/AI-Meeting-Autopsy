"use client";

import { X } from "lucide-react";
import { useEffect, useReducer } from "react";
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
  // Use a reducer so we can track two independent flags cleanly:
  // `mounted` — has the component mounted in the browser (portal safe)?
  // `visible` — is the dialog currently showing (drives animation class)?
  const [{ mounted, visible }, dispatch] = useReducer(
    (
      state: { mounted: boolean; visible: boolean },
      action: { type: "mount" } | { type: "open" } | { type: "close" }
    ) => {
      if (action.type === "mount") return { ...state, mounted: true };
      if (action.type === "open") return { ...state, visible: true };
      if (action.type === "close") return { ...state, visible: false };
      return state;
    },
    { mounted: false, visible: false }
  );

  // Effect 1: mark as mounted on first render (browser-only)
  useEffect(() => {
    dispatch({ type: "mount" });
  }, []);

  // Effect 2: sync open prop → visible state + escape key listener
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      dispatch({ type: "open" });
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    } else {
      dispatch({ type: "close" });
    }
  }, [open, onClose, mounted]);

  if (!mounted || !open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 animate-[fade-in_0.2s_ease_both]"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Scroll container */}
      <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-start justify-center px-4 py-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            className={`w-full max-w-2xl rounded-card border border-border bg-card p-6 shadow-2xl ${
              visible
                ? "animate-[dialog-in_0.3s_cubic-bezier(0.16,1,0.3,1)_both]"
                : "opacity-0"
            }`}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="dialog-title" className="text-lg font-semibold text-white">
                  {title}
                </h2>
                {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="rounded-md p-1 text-muted transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
              >
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
