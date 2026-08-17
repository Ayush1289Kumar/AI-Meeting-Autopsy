"use client";

import { Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { NeuralBackground } from "@/components/ui/neural-background";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

function ShellInner({ userName, children }: { userName: string; children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-canvas">
      {/* Ambient futuristic background — animated aurora glows + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <NeuralBackground />
        <div className="grid-overlay absolute inset-0" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand/25 blur-[140px] animate-aurora" />
        <div
          className="absolute -right-32 top-1/3 h-[440px] w-[440px] rounded-full bg-blue/20 blur-[140px] animate-aurora"
          style={{ animationDelay: "-4s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[150px] animate-aurora"
          style={{ animationDelay: "-8s" }}
        />
      </div>

      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Header userName={userName} />
        <main className="relative flex-1 px-4 pb-24 pt-5 md:px-6 md:pb-8">{children}</main>
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
