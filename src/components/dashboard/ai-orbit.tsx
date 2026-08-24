"use client";

import { useEffect, useRef } from "react";

/**
 * "AI Orbit" visualization — matches the reference video: faint expanding
 * radar rings behind, a flower-like cluster of overlapping ellipses slowly
 * rotating as one rigid group, and small particle dots orbiting the center
 * independently. All timing is elapsed-time based so it never stalls.
 */
export function AIOrbit({ className, color = "#3B82F6" }: { className?: string; color?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let spin = 0;
    let orbit = 0;
    let radar = 0;
    let lastTime = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    resize();
    window.addEventListener("resize", resize);
    // Catches size changes that don't fire a window resize event — e.g. a
    // sidebar breakpoint flip, container query change, or tablet rotation
    // where the layout reflows without the viewport itself changing.
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const PETALS = 6;
    const PARTICLES = 6;

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const dt = Math.min(now - lastTime, 48);
      lastTime = now;

      // Reduced motion means gentler, not frozen — a full stop reads as a
      // broken/static visual, which is worse than a slow, subtle motion.
      const motionScale = reduceMotion ? 0.25 : 1;
      spin += dt * 0.0007 * motionScale; // group rotation of the flower/atom cluster
      orbit += dt * 0.00048 * motionScale; // particle orbit speed
      radar += dt * 0.00035 * motionScale; // radar ping cycle

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.46;

      // --- radar pulse rings (expanding + fading, staggered) ---
      for (let i = 0; i < 3; i++) {
        const phase = (radar + i / 3) % 1;
        const r = R * (0.55 + phase * 0.62);
        const alpha = (1 - phase) * 0.12;
        ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // --- flower / atom cluster: N ellipses sharing a center, evenly rotated ---
      const rx = R * 0.86;
      const ry = R * 0.34;
      ctx.lineWidth = 1.1 * dpr;
      for (let i = 0; i < PETALS; i++) {
        const angle = spin + (Math.PI / PETALS) * i;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.32;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;

      // --- orbiting particles (independent of the flower rotation) ---
      for (let i = 0; i < PARTICLES; i++) {
        const angle = orbit + (Math.PI * 2 * i) / PARTICLES;
        const wobble = Math.sin(orbit * 2 + i) * R * 0.04;
        const px = cx + Math.cos(angle) * (R * 0.98 + wobble);
        const py = cy + Math.sin(angle) * (R * 0.98 + wobble) * 0.55;
        const r = 2.2 * dpr;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 4);
        grad.addColorStop(0, `${color}66`);
        grad.addColorStop(1, `${color}00`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [color]);

  return <canvas ref={canvasRef} className={className} />;
}
