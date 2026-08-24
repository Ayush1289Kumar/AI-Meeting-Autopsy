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
const MAX_NODES = 32;
const MAX_PARTICLES = 36;
const CONNECTION_REFRESH_INTERVAL = 4; // frames between O(n²) connection rescans
const TARGET_FPS = 30; // ambient background needs ~half the frames
const FRAME_MS = 1000 / TARGET_FPS;
const COLORS = { node: "139, 92, 246", nodeAlt: "61, 139, 255", particle: "34, 211, 238" };
let nodeColorId = 0;
function altColor() { nodeColorId++; return nodeColorId % 3 === 0 ? COLORS.nodeAlt : COLORS.node; }
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const connectionsRef = useRef<Array<{ from: number; to: number; dist: number }>>([]);
  const dimsRef = useRef({ w: 0, h: 0 });
  const gradientRef = useRef<CanvasGradient | null>(null);
  const lastFrameRef = useRef(0);
  const frameRef = useRef(0);
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
    const count = Math.max(14, Math.min(MAX_NODES, Math.floor((w * h) / 52000)));
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

  // Rebuild the connection list (O(n²) scan). Called periodically (see loop),
  // not every frame — nodes drift slowly, so links barely change frame to frame.
  const updateConnections = useCallback(() => {
    const nodes = nodesRef.current;
    const connections: Array<{ from: number; to: number; dist: number }> = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) connections.push({ from: i, to: j, dist });
      }
    }
    connectionsRef.current = connections;
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

    // 1. cached subtle radial glow behind hero area (allocated once per resize)
    if (gradientRef.current) {
      ctx.fillStyle = gradientRef.current;
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

    // 3. cached connections (O(n²) rescan happens every few frames, not per frame)
    const connections = connectionsRef.current;
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
    if (connections.length > 0 && Math.random() < 0.035 && particles.length < MAX_PARTICLES) {
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
  const loop = useCallback((now: number) => {
    // Throttle to ~30fps — an ambient background does not need 60fps and this
    // roughly halves the GPU/compositor cost on every dashboard page.
    if (now - lastFrameRef.current >= FRAME_MS && !document.hidden) {
      lastFrameRef.current = now;
      frameRef.current++;
      if (frameRef.current % CONNECTION_REFRESH_INTERVAL === 0) updateConnections();
      draw();
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, updateConnections]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      // Cap the backing-store size at 1.5x DPR — a subtle ambient effect does
      // not need 2x/3x Retina buffers, and this keeps fill-rate low.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Pre-build the radial glow so draw() never allocates a gradient.
        const gx = w * 0.5;
        const gy = h * 0.15;
        const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, w * 0.55);
        gr.addColorStop(0, "rgba(139, 92, 246, 0.04)");
        gr.addColorStop(0.35, "rgba(61, 139, 255, 0.02)");
        gr.addColorStop(1, "rgba(139, 92, 246, 0)");
        gradientRef.current = gr;
      }
      dimsRef.current = { w, h };
      initScene(w, h);
      updateConnections();
      if (reducedMotion) { draw(); }
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reducedMotion) {
      lastFrameRef.current = 0;
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      gradientRef.current = null;
    };
  }, [reducedMotion, initScene, draw, loop, updateConnections]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
