import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (handles conflicts). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// Re-exports from lib/date-utils — kept here so every existing import path
// (`import { formatDuration } from "@/lib/utils"`) continues to work.
// New code should import directly from "@/lib/date-utils".
// ---------------------------------------------------------------------------
export {
  formatDuration,
  formatTimestamp,
  formatPercent,
  formatDate,
  initials,
} from "@/lib/date-utils";
