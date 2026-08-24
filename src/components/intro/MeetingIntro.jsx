"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "./MeetingIntro.css";

/* ============================================================
   MeetingIntro.jsx
   Plays a cinematic "Meeting → AI Analysis → Insight" intro
   over the existing AI Meeting Autopsy dashboard, then calls
   onComplete() and unmounts itself. The dashboard is untouched
   underneath — the intro simply sits above it (opaque curtain,
   high z-index) and fades away at the end, leaving the existing
   UI fully intact and interactive.
   ============================================================ */

const TOTAL_MS = 3900; // CSS timeline base (matches MeetingIntro.css 3.9s)
const EXIT_MS = 380; // quick fade on skip / finish
const TAU = Math.PI * 2;

const PARTICLE_COLORS = [
  "139, 92, 246", // violet (brand)
  "61, 139, 255", // blue
  "34, 211, 238", // cyan accent
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function MeetingIntro({ onComplete = () => {} }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const skipTimerRef = useRef(null);
  const doneTimerRef = useRef(null);
  const lastDrawRef = useRef(0);
  const startRef = useRef(0);
  const sceneRef = useRef({ particles: [], w: 0, h: 0, cx: 0, cy: 0 });

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [reduced, setReduced] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  // Play the intro at most once per browser session.
  // IMPORTANT: this decision happens AFTER mount (never during SSR) — reading
  // sessionStorage in useState's initializer made the server render the full
  // overlay while the client rendered null -> hydration mismatch -> an
  // orphaned, click-blocking fullscreen layer no timer could remove.
  //
  // The "played" flag is also written only WHEN THE INTRO FINISHES (not up
  // front): under React StrictMode dev, effects double-fire, so marking it
  // during the decision effect would immediately cancel the intro.
  const INTRO_KEY = "ai-ma-intro-played";
  const [phase, setPhase] = useState("pending"); // "pending" | "play" | "skipped"

  useEffect(() => {
    let played = false;
    try {
      played = sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      /* private-mode / storage unavailable: just play the intro */
    }
    setPhase(played ? "skipped" : "play");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!done) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }
  }, [done]);

  // --- detect prefers-reduced-motion ------------------------------------
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => {
      setReduced(e.matches);
      // If the user flips to reduced mid-intro, stop heavy canvas work.
      cancelAnimationFrame(rafRef.current);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange); // older Safari
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else if (mq.removeListener) mq.removeListener(onChange);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // --- exit helper ------------------------------------------------------
  const beginExit = useCallback(() => {
    setLeaving(() => {
      if (!leaving) cancelAnimationFrame(rafRef.current);
      return true;
    });
    skipTimerRef.current = setTimeout(() => {
      try {
        onCompleteRef.current?.();
      } finally {
        setDone(true);
      }
    }, EXIT_MS);
  }, [leaving]);
  // Keep a stable handle so the auto-finish timer below can always call the
  // latest beginExit without depending on its (changing) identity.
  const beginExitRef = useRef(beginExit);
  beginExitRef.current = beginExit;

  // --- lightweight particle scene ---------------------------------------
  const setupScene = useCallback((w, h) => {
    const count = clamp(Math.round((w * h) / 24000), 14, 36);
    const base = clamp(Math.min(w, h) * 0.42, 90, 300);
    const orbitTarget = clamp(Math.min(w, h) * 0.06, 20, 44);
    const particles = [];
    for (let i = 0; i < count; i++) {
      const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
      particles.push({
        angle: Math.random() * TAU,
        rStart: base * (0.55 + Math.random() * 0.45),
        rTarget: orbitTarget * (0.75 + Math.random() * 0.5),
        speed: (Math.random() < 0.5 ? -1 : 1) * (0.15 + Math.random() * 0.4),
        size: 0.8 + Math.random() * 1.5,
        opacity: 0.45 + Math.random() * 0.45,
        color,
      });
    }
    sceneRef.current = { particles, w, h, cx: w / 2, cy: h / 2 };
  }, []);

  const draw = useCallback((elapsed) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { particles, w, h, cx, cy } = sceneRef.current;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);

    // subtle central bloom (supplement to the CSS glow)
    const bloom =
      clamp((elapsed - 0.3) / 0.9, 0, 1) * (1 - clamp((elapsed - 3.1) / 0.7, 0, 1));
    if (bloom > 0) {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
      g.addColorStop(0, "rgba(139, 92, 246, " + 0.16 * bloom + ")");
      g.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // timeline phase factors (seconds)
    const converge = easeInOutCubic(clamp((elapsed - 0.55) / 1.15, 0, 1)); // 0.55 -> 1.7
    const orbitRamp = clamp((elapsed - 1.2) / 0.9, 0, 1); // 1.2 -> 2.1
    const fadeOut = clamp((elapsed - 3.15) / 0.72, 0, 1); // 3.15 -> 3.87
    const earlyFade = clamp(elapsed / 0.5, 0, 1);

    const sweep = clamp(converge * (0.6 + 0.4 * orbitRamp), 0, 1);

    for (const p of particles) {
      const r = lerp(p.rStart, p.rTarget, converge);
      const ang = p.angle + p.speed * Math.max(0, elapsed - 0.4) * sweep;
      const x = cx + Math.cos(ang) * r;
      const y = cy + Math.sin(ang) * r * 0.92;

      const alpha =
        p.opacity *
        earlyFade *
        (1 - fadeOut) *
        (0.18 + 0.35 * converge + 0.35 * orbitRamp);

      if (alpha <= 0.01) continue;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, TAU);
      ctx.fillStyle = "rgba(" + p.color + ", " + alpha + ")";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2.6, 0, TAU);
      ctx.fillStyle = "rgba(" + p.color + ", " + alpha * 0.14 + ")";
      ctx.fill();
    }
  }, []);

  const loop = useCallback(() => {
    // Throttle to ~30fps (and pause when the tab is hidden): the cinematic
    // effect reads the same at half the canvas work, which softens the
    // first-paint cost while the dashboard is also mounting underneath.
    const now = performance.now();
    if (!document.hidden && now - lastDrawRef.current >= 33) {
      lastDrawRef.current = now;
      const elapsed = (performance.now() - startRef.current) / 1000;
      draw(elapsed);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);
// --- canvas setup + resize + render loop -----------------------------
  useEffect(() => {
    if (reduced) return; // handled by reduced variant
    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) return; // pure CSS visuals still run

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setupScene(w, h);
    };

    resize();
    window.addEventListener("resize", resize);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, setupScene, loop]);

  // --- auto-finish: full timeline (or short fade for reduced motion) ---
  // Runs ONCE per reduced-motion change. Depending on `beginExit` here (its
  // identity changes when `leaving` flips) made this effect re-run on skip,
  // and its cleanup then destroyed the 380ms completion timer that skip had
  // just scheduled — so the intro could never actually dismiss.
  useEffect(() => {
    doneTimerRef.current = setTimeout(() => beginExitRef.current(), reduced ? 1150 : TOTAL_MS);
    return () => {
      if (doneTimerRef.current) clearTimeout(doneTimerRef.current);
    };
  }, [reduced]);

  // Unmount-only cleanup: cancel the canvas loop and any in-flight exit timer.
  useEffect(() => {
    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (phase !== "play" || done) return null;

  // ----- Reduced motion: elegant, minimal, short -----
  if (reduced) {
    return (
      <div
        className={"mi-reduced-root" + (leaving ? " mi-exit" : "")}
        role="status"
        aria-live="polite"
      >
        <div>
          <div className="mi-reduced-pulse" aria-hidden="true" />
          <div className="mi-reduced-mark">
            AI MEETING <span>AUTOPSY</span>
          </div>
        </div>
        <button
          type="button"
          className="mi-reduced-skip"
          onClick={beginExit}
          aria-label="Skip intro"
        >
          Skip intro
        </button>
      </div>
    );
  }

  // ----- Full intro -----
  return (
    <div className={"mi-root" + (leaving ? " mi-exit" : "")}>
      <div className="mi-curtain" aria-hidden="true" />
      <div className="mi-grid" aria-hidden="true" />
      <canvas ref={canvasRef} className="mi-canvas" aria-hidden="true" />

      <div className="mi-scene" aria-hidden="true">
        <div className="mi-glow" />
        <div className="mi-core" />
        <div className="mi-ring" />
        <div className="mi-ring mi-ring-b" />
        <div className="mi-scan" />
        <div className="mi-expand" />

        <span className="mi-label mi-lbl-speech">Speech</span>
        <span className="mi-label mi-lbl-participation">Participation</span>
        <span className="mi-label mi-lbl-decisions">Decisions</span>
        <span className="mi-label mi-lbl-flow">Topic Flow</span>
      </div>

      <div className="mi-text" aria-hidden="true">
        <span className="mi-t1">MEETING DETECTED</span>
        <span className="mi-t2">ANALYZING…</span>
        <span className="mi-t3">INSIGHTS READY</span>
      </div>

      <button type="button" className="mi-skip" onClick={beginExit} aria-label="Skip intro">
        Skip intro
      </button>
    </div>
  );
}