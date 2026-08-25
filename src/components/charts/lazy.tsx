"use client";

import dynamic from "next/dynamic";

/**
 * Lazily-loaded chart wrappers.
 *
 * Recharts (~400 kB minified) was the single biggest contributor to the
 * dashboard's hydration blocking time (TBT). Charts render below the fold,
 * so they are code-split out of the initial bundle and hydrated after the
 * interactive content is ready. A skeleton placeholder prevents layout shift.
 */

const Loading = () => <div className="h-56 w-full animate-pulse rounded-lg bg-white/5" aria-hidden />;

export const DonutChart = dynamic(
  () => import("@/components/charts/donut-chart").then((m) => m.DonutChart),
  { ssr: false, loading: Loading }
);

export const ValueAreaChart = dynamic(
  () => import("@/components/charts/area-chart").then((m) => m.ValueAreaChart),
  { ssr: false, loading: Loading }
);

export const GroupedBarChart = dynamic(
  () => import("@/components/charts/bar-chart").then((m) => m.GroupedBarChart),
  { ssr: false, loading: Loading }
);

export const TrendLineChart = dynamic(
  () => import("@/components/charts/line-chart").then((m) => m.TrendLineChart),
  { ssr: false, loading: Loading }
);

export const GaugeChart = dynamic(
  () => import("@/components/charts/gauge-chart").then((m) => m.GaugeChart),
  { ssr: false, loading: Loading }
);
