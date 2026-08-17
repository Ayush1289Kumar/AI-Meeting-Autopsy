"use client";

import { useRef, useEffect, useCallback, useState } from "react";

/* ------------------------------------------------------------------ */
/*  NeuralBackground - subtle live-AI network canvas effect          */
/*  Renders behind all dashboard content using fixed positioning and */
/*  a low z-index so the UI stays fully interactive.                */
/* ------------------------------------------------------------------ */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
}

interface Particle {
  progress: number;
  speed: number;
  fromIdx: number;
  toIdx: number;
  size: number;
  opacity: number;
}

const CONNECTION_DIST = 180;
const COLORS = { node: "139, 92, 246", nodeAlt: "61, 139, 255", particle: "34, 211, 238" };
let nodeColorId = 0;
function altColor() { nodeColorId++; return nodeColorId % 3 === 0 ? COLORS.nodeAlt : COLORS.node; }
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dimsRef = useRef({ w: 0, h: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const initScene = useCallback((w: number, h: number) => {
    nodeColorId = 0;
    const count = Math.max(18, Math.min(50, Math.floor((w * h) / 42000)));
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      const upper = Math.random() < 0.55;
      const y = upper ? Math.random() * h * 0.35 : h * 0.35 + Math.random() * h * 0.65;
      const x = Math.random() * w;
      const density = Math.max(0.3, 1 - (y / h) * 0.6);
      nodes.push({ x, y,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.12 - 0.04,
        radius: 0.5 + Math.random() * 1.6,
        baseOpacity: (0.08 + Math.random() * 0.22) * density,
      });
    }
    nodesRef.current = nodes;
    particlesRef.current = [];
    dimsRef.current = { w, h };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = dimsRef.current;
    if (w === 0 || h === 0) return;
    ctx.clearRect(0, 0, w, h);
    const nodes = nodesRef.current;
    if (nodes.length < 2) return;

    // 1. subtle radial glow behind hero area
    {
      const gx = w * 0.5;
      const gy = h * 0.15;
      const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.55);
      gr.addColorStop(0, "rgba(139, 92, 246, 0.04)");
      gr.addColorStop(0.35, "rgba(61, 139, 255, 0.02)");
      gr.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. update node positions (slow drift)
    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      node.vx += (Math.random() - 0.5) * 0.008;
      node.vy += (Math.random() - 0.5) * 0.006;
      node.vx = Math.max(-0.4, Math.min(0.4, node.vx));
      node.vy = Math.max(-0.25, Math.min(0.25, node.vy));
      if (node.x < -30) node.x = w + 30;
      else if (node.x > w + 30) node.x = -30;
      if (node.y < -30) node.y = h + 30;
      else if (node.y > h + 30) node.y = -30;
    }

    // 3. find nearby connections & draw edges
    const connections = [] as Array<{from:number;to:number;dist:number}>;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) connections.push({ from: i, to: j, dist });
      }
    }
    for (const conn of connections) {
      const from = nodes[conn.from];
      const to = nodes[conn.to];
      const alpha = (1 - conn.dist / CONNECTION_DIST) * 0.12;
      if (alpha < 0.005) continue;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = "rgba(" + COLORS.node + ", " + alpha + ")";
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }

    // 4. traveling particles (information flow)
    const particles = particlesRef.current;
    if (connections.length > 0 && Math.random() < 0.035) {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      particles.push({
        progress: 0, speed: 0.008 + Math.random() * 0.014,
        fromIdx: conn.from, toIdx: conn.to,
        size: 1 + Math.random() * 1.2,
        opacity: 0.25 + Math.random() * 0.35,
      });
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.progress += p.speed;
      if (p.progress >= 1) { particles.splice(i, 1); continue; }
      const from = nodes[p.fromIdx];
      const to = nodes[p.toIdx];
      if (!from || !to) { particles.splice(i, 1); continue; }
      const x = from.x + (to.x - from.x) * p.progress;
      const y = from.y + (to.y - from.y) * p.progress;
      const fade = Math.sin(p.progress * Math.PI) * p.opacity;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + COLORS.particle + ", " + fade + ")";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + COLORS.particle + ", " + (fade * 0.12) + ")";
      ctx.fill();
    }

    // 5. draw nodes on top
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const color = altColor();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + color + ", " + node.baseOpacity + ")";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + color + ", " + (node.baseOpacity * 0.18) + ")";
      ctx.fill();
    }
  }, []);
  const loop = useCallback(() => {
    if (document.hidden) {
      rafRef.current = requestAnimationFrame(loop);
      return;
    }
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      dimsRef.current = { w, h };
      initScene(w, h);
      if (reducedMotion) { draw(); }
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reducedMotion) { rafRef.current = requestAnimationFrame(loop); }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, initScene, draw, loop]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
