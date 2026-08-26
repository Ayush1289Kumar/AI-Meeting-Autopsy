"use client";

import { Suspense } from "react";

import { Header } from "@/components/layout/header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

function ShellInner({ userName, children }: { userName: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-canvas">
      {/* Ambient futuristic background — static aurora glows + grid (pure CSS,
          zero per-frame work). The former neural-network canvas was removed:
          a full-viewport repainting canvas behind blurred layers forced
          constant recompositing and made scrolling feel rough. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grid-overlay absolute inset-0" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/25 blur-[140px]" />
        <div className="absolute -right-32 top-1/3 h-[440px] w-[440px] rounded-full bg-blue/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col pt-4">
        <Header userName={userName} />
        <main id="main-content" tabIndex={-1} className="relative flex-1 px-4 pb-24 pt-12 outline-none md:px-6 md:pb-8">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}

export function AppShell(props: { userName: string; children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <ShellInner {...props} />
    </Suspense>
  );
}
