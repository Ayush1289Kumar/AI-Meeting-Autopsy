"use client";

import dynamic from "next/dynamic";

/**
 * Client-only wrappers for the WebGL hero visuals in `common/`.
 *
 * These components use Three.js and must never render on the server, so they
 * are loaded via `next/dynamic` with `ssr: false`. Each wrapper is placed in a
 * sized, `overflow-hidden` container by its consumer so the canvas can never
 * overflow its section on any breakpoint.
 */

const loading = () => (
  <div className="h-full w-full animate-pulse rounded-xl bg-white/5" aria-hidden />
);

export const DashboardGlobeVisual = dynamic(
  () => import("./dashboard-globe").then((m) => m.DashboardGlobe),
  { ssr: false, loading }
);

export const AutopsyScanVisual = dynamic(
  () => import("./autopsy-scan").then((m) => m.AutopsyScan),
  { ssr: false, loading }
);

export const NeuralWebVisual = dynamic(
  () => import("./neural-web").then((m) => m.NeuralWeb),
  { ssr: false, loading }
);

export const ParticleVortexVisual = dynamic(
  () => import("./particle-vortex").then((m) => m.ParticleVortex),
  { ssr: false, loading }
);
