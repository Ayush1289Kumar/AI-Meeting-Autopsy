import { Stethoscope } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/30 px-6 py-14" aria-label="Site footer">
      <div className="mx-auto max-w-7xl flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-[0_0_16px_-4px_rgba(139,92,246,0.9)]">
            <Stethoscope size={17} className="text-white" />
          </span>
          <span className="font-display text-sm font-bold text-white">AI Meeting Autopsy</span>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-muted">
          AI-powered post-mortems for your meetings. Health score, decisions, action items,
          speaking balance and wasted time — all in seconds.
        </p>
        <p className="mt-6 text-[11px] text-muted/60">
          © {new Date().getFullYear()} AI Meeting Autopsy. Built with AI ⚡
        </p>
      </div>
    </footer>
  );
}
