"use client";

import { useEffect, useRef } from "react";

/**
 * Signature "AI intelligence visualization": layered rotating elliptical
 * rings with a sparse node mesh, restrained glow. Timing is driven by real
 * elapsed time (not a fixed per-frame step) so speed stays consistent
 * across refresh rates and never stalls. Used behind the Health Score in
 * the dashboard hero and (smaller) on other pages' AI-analysis moments.
 */
export function NeuralMesh({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let t = 0;
    let pulse = 0;
    let lastTime = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodeCount = 16;
    const nodes = Array.from({ length: nodeCount }, (_, i) => {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      return {
        baseX: Math.cos(theta) * Math.sin(phi),
        baseY: Math.sin(theta) * Math.sin(phi),
        baseZ: Math.cos(phi),
      };
    });

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    function onScroll() {
      scrollRef.current = window.scrollY;
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    function drawRing(cx: number, cy: number, rx: number, ry: number, rotation: number, color: string, alpha: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1.2 * dpr;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const dt = Math.min(now - lastTime, 48); // clamp to avoid jumps on tab refocus
      lastTime = now;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.4;

      // Reduced motion means gentler, not frozen — a hard stop reads as a
      // broken/static visual, which is worse than a slow, subtle motion.
      const motionScale = reduceMotion ? 0.25 : 1;
      // Real-time-based increment (radians/ms) — speed no longer tied to frame rate.
      t += (dt * 0.0007 + scrollRef.current * 0.000006) * motionScale;
      pulse += dt * 0.0016 * motionScale;
      const rotY = t;
      const rotX = Math.sin(t * 0.6) * 0.3;
      const breathe = 0.5 + Math.sin(pulse) * 0.5; // 0..1 pulsing factor, always animates

      // --- layered orbital rings (restrained, premium) ---
      drawRing(cx, cy, radius * 0.98, radius * 0.34, t * 0.8, "#3B82F6", 0.3 + breathe * 0.08);
      drawRing(cx, cy, radius * 0.82, radius * 0.82 * 0.34, -t * 0.55 + 1.1, "#8B5CF6", 0.22 + breathe * 0.06);
      drawRing(cx, cy, radius * 1.12, radius * 1.12 * 0.34, t * 0.35 + 2.2, "#22D3EE", 0.16 + breathe * 0.05);

      // --- sparse node mesh (depth cue, subtle) ---
      const projected = nodes.map((n) => {
        const x = n.baseX * Math.cos(rotY) - n.baseZ * Math.sin(rotY);
        let z = n.baseX * Math.sin(rotY) + n.baseZ * Math.cos(rotY);
        let y = n.baseY;
        const y2 = y * Math.cos(rotX) - z * Math.sin(rotX);
        const z2 = y * Math.sin(rotX) + z * Math.cos(rotX);
        y = y2;
        z = z2;
        const scale = 1 / (1.9 - z * 0.75);
        return { x: cx + x * radius * 0.78 * scale, y: cy + y * radius * 0.78 * scale, z, scale };
      });

      ctx.lineWidth = 1 * dpr;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < radius * 0.62) {
            const opacity = (1 - dist / (radius * 0.62)) * 0.18 * ((a.scale + b.scale) / 2);
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      projected
        .slice()
        .sort((a, b) => a.z - b.z)
        .forEach((p) => {
          const r = (1.6 + p.scale * 1.6) * dpr;
          const glowAlpha = (0.2 + p.scale * 0.22) * (0.7 + breathe * 0.3);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2);
          grad.addColorStop(0, `rgba(139, 92, 246, ${glowAlpha})`);
          grad.addColorStop(1, "rgba(139, 92, 246, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(255, 255, 255, ${0.55 + p.scale * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        });

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
