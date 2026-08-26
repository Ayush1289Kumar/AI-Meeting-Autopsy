"use client";

import Link from "next/link";
import { Stethoscope, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/motion/magnetic-button";

/**
 * LandingNav — sticky glass navigation bar for the public landing page.
 * - Logo + brand name left
 * - "Dashboard" link + CTA right
 * - Border appears only after 80px scroll (useScroll threshold)
 * - Glass-panel style matches sidebar/header aesthetic
 */
export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl transition-all duration-300">
      <header
        className={`w-full rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "border-border/40 bg-canvas/80 backdrop-blur-md shadow-[0_12px_40px_-12px_rgba(0,0,0,0.7)] px-6 py-3"
            : "border-transparent bg-transparent px-4 py-4"
        }`}
        style={{
          boxShadow: scrolled ? "0 8px 32px 0 rgba(0, 0, 0, 0.37)" : "none",
        }}
      >
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-[0_0_20px_-4px_rgba(139,92,246,0.9)] transition-shadow group-hover:shadow-[0_0_28px_-4px_rgba(139,92,246,1)]">
              <Stethoscope size={18} className="text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
            </span>
            <span className="leading-tight">
              <p className="font-display text-sm font-bold leading-tight tracking-tight text-white">
                AI Meeting Autopsy
              </p>
              <p className="text-[11px] text-muted">Analyze. Diagnose. Improve.</p>
            </span>
          </Link>

          {/* Right actions */}
          <nav aria-label="Site navigation" className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-white sm:inline-flex"
            >
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
            <MagneticButton
              as="a"
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(139,92,246,0.8)] transition-shadow hover:shadow-[0_0_32px_-8px_rgba(139,92,246,1)]"
            >
              Get Started →
            </MagneticButton>
          </nav>
        </div>
      </header>
    </div>
  );
}

