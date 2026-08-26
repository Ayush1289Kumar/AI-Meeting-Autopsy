"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";

/**
 * MagneticButton — tracks cursor offset from the button centre and
 * applies a gentle spring-like transform so the button "pulls" toward
 * the cursor. The feel is magnetic without being cartoonish.
 *
 * Implementation uses CSS transitions (no spring library dep) because:
 *  - We want GPU-composited transform-only changes (no layout thrash).
 *  - CSS cubic-bezier gives the spring feel at zero runtime cost.
 *  - Matches the huashu-style motion language (transform/opacity only).
 *
 * Reduced-motion: the translate is skipped entirely (CSS handles it via
 * the existing global reduce-motion rule that sets transition-duration: 0.001ms).
 */
export function MagneticButton({
  children,
  className,
  onClick,
  href,
  maxOffset = 10,
  as: Tag = "button",
  type,
  "aria-label": ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  maxOffset?: number;
  as?: "button" | "a";
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / (rect.width / 2)) * maxOffset;
    const dy = ((e.clientY - cy) / (rect.height / 2)) * maxOffset;
    setOffset({ x: dx, y: dy });
  }

  function handleMouseLeave() {
    setOffset({ x: 0, y: 0 });
  }

  const style = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    display: "inline-flex",
  };

  const sharedProps = {
    ref: ref as React.RefObject<HTMLButtonElement & HTMLAnchorElement>,
    className,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    style,
    "aria-label": ariaLabel,
  };

  if (Tag === "a") {
    return (
      <a {...sharedProps} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button {...sharedProps} type={type ?? "button"}>
      {children}
    </button>
  );
}
