"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   Graph Data
   ═══════════════════════════════════════════════════════════ */

type NodeType = "hub" | "speaker" | "topic" | "decision" | "action" | "risk";

interface NodeDef {
  id: number;
  label: string | null;
  type: NodeType;
  hex: string;
  pos: [number, number, number];
  radius: number; // sprite scale
}

const NODES: NodeDef[] = [
  // Central hub — the meeting itself
  { id: 0,  label: null,             type: "hub",      hex: "#8b5cf6", pos: [ 0.00,  0.00,  0.00], radius: 0.58 },
  // Speakers — inner ring
  { id: 1,  label: "Sarah K.",       type: "speaker",  hex: "#8b5cf6", pos: [-1.05,  0.72,  0.30], radius: 0.32 },
  { id: 2,  label: "Marcus W.",      type: "speaker",  hex: "#3d8bff", pos: [ 1.20,  0.50, -0.20], radius: 0.28 },
  { id: 3,  label: "Priya S.",       type: "speaker",  hex: "#8b5cf6", pos: [ 0.10, -1.05,  0.52], radius: 0.28 },
  { id: 4,  label: "Alex R.",        type: "speaker",  hex: "#3d8bff", pos: [-0.78, -0.65, -0.72], radius: 0.26 },
  // Topics — mid ring (cyan)
  { id: 5,  label: "Q4 Roadmap",     type: "topic",    hex: "#22d3ee", pos: [-1.80,  1.28, -0.38], radius: 0.24 },
  { id: 6,  label: "API Design",     type: "topic",    hex: "#22d3ee", pos: [ 1.90, -0.30,  0.22], radius: 0.22 },
  { id: 7,  label: "Timeline",       type: "topic",    hex: "#22d3ee", pos: [ 0.72,  1.62,  0.60], radius: 0.22 },
  { id: 8,  label: "Budget",         type: "topic",    hex: "#22d3ee", pos: [-1.42, -1.20,  0.10], radius: 0.20 },
  // Decisions — outer (emerald)
  { id: 9,  label: "Approved \u2713", type: "decision", hex: "#10b981", pos: [ 1.32,  1.34,  0.42], radius: 0.20 },
  { id: 10, label: "Ship v2.1 \u2713", type: "decision", hex: "#10b981", pos: [-0.38, -1.62, -0.28], radius: 0.18 },
  // Action items — outer (warning gold)
  { id: 11, label: "\u2192 PR Review",   type: "action",   hex: "#f5b94b", pos: [ 2.05,  0.80, -0.52], radius: 0.18 },
  { id: 12, label: "\u2192 Docs Update", type: "action",   hex: "#f5b94b", pos: [-2.12,  0.28,  0.52], radius: 0.18 },
  // Risks — outer (soft red)
  { id: 13, label: "\u26a0 Off-Topic",   type: "risk",     hex: "#f87171", pos: [ 0.30,  1.02, -1.52], radius: 0.16 },
  { id: 14, label: "\u26a0 Time Lost",   type: "risk",     hex: "#f87171", pos: [-0.88,  0.18,  1.62], radius: 0.16 },
];

const EDGES: [number, number][] = [
  // Hub -> Speakers
  [0, 1], [0, 2], [0, 3], [0, 4],
  // Speakers -> Topics
  [1, 5], [1, 7], [2, 6], [2, 7],
  [3, 8], [3, 6], [4, 5], [4, 8],
  // Topics -> Decisions
  [5, 9], [7, 9], [6, 10], [8, 10],
  // Topics -> Actions
  [5, 12], [6, 11], [8, 12],
  // Risk connections
  [1, 13], [3, 14], [7, 13], [6, 14],
  // Speaker cross-links (inner ring)
  [1, 2], [2, 3], [3, 4], [4, 1],
];

// Build adjacency list once
const ADJ: number[][] = NODES.map(() => []);
EDGES.forEach(([a, b]) => { ADJ[a].push(b); ADJ[b].push(a); });

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

interface Signal {
  from: number;
  to: number;
  t: number;      // 0 -> 1 travel progress
  speed: number;  // t-units per second
  col: THREE.Color;
}

/**
 * NeuralWeb — Option 1 hero visual.
 *
 * A 3D network graph representing the AI's understanding of a meeting:
 * nodes are meeting entities (participants, topics, decisions, actions, risks)
 * connected by luminous filaments. Signal pulses travel along edges
 * automatically every ~3 s and burst from any hovered node.
 *
 * Purely decorative (aria-hidden). Must be client-rendered (no SSR).
 * Uses Three.js — already a project dependency via AutopsyScan.
 */
export function NeuralWeb({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const labelRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas     = canvasRef.current;
    const labelLayer = labelRef.current;
    if (!canvas || !labelLayer) return;

    /* ── Renderer ── */
    const W = canvas.clientWidth  || 500;
    const H = canvas.clientHeight || 500;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    canvas.appendChild(renderer.domElement);

    /* ── Scene & Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 6.8);

    const root = new THREE.Group();
    scene.add(root);

    /* ── Shared radial-glow texture ── */
    const glowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0,    "rgba(255,255,255,1)");
      g.addColorStop(0.20, "rgba(255,255,255,0.85)");
      g.addColorStop(0.50, "rgba(255,255,255,0.20)");
      g.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();

    /* ── Ambient background haze ── */
    const haze = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color("#8b5cf6"),
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.06,
    }));
    haze.scale.setScalar(8);
    root.add(haze);

    /* ── Edges — vertex-coloured LineSegments ── */
    const ePos: number[] = [];
    const eCol: number[] = [];
    EDGES.forEach(([a, b]) => {
      const ca = new THREE.Color(NODES[a].hex);
      const cb = new THREE.Color(NODES[b].hex);
      ePos.push(...NODES[a].pos, ...NODES[b].pos);
      eCol.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b);
    });
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(ePos, 3));
    edgeGeo.setAttribute("color",    new THREE.Float32BufferAttribute(eCol, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending,
    });
    root.add(new THREE.LineSegments(edgeGeo, edgeMat));

    /* ── Node sprites (billboards — always face camera) ── */
    const sprites: THREE.Sprite[] = [];
    const proxies: THREE.Mesh[]   = []; // invisible, for raycasting only

    NODES.forEach((node) => {
      const mat = new THREE.SpriteMaterial({
        map: glowTex, color: new THREE.Color(node.hex),
        blending: THREE.AdditiveBlending, transparent: true,
        opacity: node.type === "hub" ? 1.0 : 0.82,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(...node.pos);
      sprite.scale.setScalar(node.radius);
      root.add(sprite);
      sprites.push(sprite);

      // Invisible proxy sphere for hover raycasting
      const proxy = new THREE.Mesh(
        new THREE.SphereGeometry(node.type === "hub" ? 0.38 : 0.24, 6, 6),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      proxy.position.set(...node.pos);
      proxy.userData.nodeId = node.id;
      root.add(proxy);
      proxies.push(proxy);
    });

    /* ── Signal particles with trail ── */
    const signals: Signal[]   = [];
    const TRAIL        = 6;   // trailing glow particles per signal head
    const SIGNAL_SLOTS = 32;  // max simultaneous signal instances
    const TOTAL_VERTS  = SIGNAL_SLOTS * (TRAIL + 1);

    const sigPos = new Float32Array(TOTAL_VERTS * 3);
    const sigCol = new Float32Array(TOTAL_VERTS * 3);
    // Park all particles off-screen initially
    for (let i = 0; i < TOTAL_VERTS; i++) sigPos[i * 3 + 2] = -1000;

    const sigGeo = new THREE.BufferGeometry();
    sigGeo.setAttribute("position", new THREE.BufferAttribute(sigPos, 3));
    sigGeo.setAttribute("color",    new THREE.BufferAttribute(sigCol, 3));
    const sigMat = new THREE.PointsMaterial({
      size: 0.22, vertexColors: true, transparent: true, opacity: 0.90,
      map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    root.add(new THREE.Points(sigGeo, sigMat));

    /* ── HTML label chips ── */
    const labelEls: (HTMLDivElement | null)[] = NODES.map((node) => {
      if (!node.label) return null;
      const el = document.createElement("div");
      el.style.cssText = [
        "position:absolute",
        "pointer-events:none",
        "transform:translate(-50%,calc(-100% - 8px)) scale(1)",
        "padding:2px 9px 3px",
        "border-radius:999px",
        "font-size:10.5px",
        "font-weight:600",
        "font-family:var(--font-display,system-ui,sans-serif)",
        "letter-spacing:0.025em",
        "white-space:nowrap",
        `border:1px solid ${node.hex}50`,
        "background:rgba(8,11,28,0.82)",
        `color:${node.hex}`,
        "opacity:0",
        "will-change:opacity,transform",
        "backdrop-filter:blur(6px)",
        "user-select:none",
        "transition:opacity 0.22s ease,transform 0.22s ease",
      ].join(";");
      el.textContent = node.label;
      labelLayer.appendChild(el);
      return el;
    });

    /* ── Mouse / hover ── */
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();
    const mouse     = { x: 0, y: 0, tx: 0, ty: 0 };
    let hoveredId: number | null = null;

    const pushSignal = (from: number, to: number, speed?: number) => {
      if (signals.length >= SIGNAL_SLOTS) return;
      signals.push({
        from, to, t: 0,
        speed: speed ?? 0.70 + Math.random() * 0.30,
        col: new THREE.Color(NODES[from].hex),
      });
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right ||
          e.clientY < rect.top  || e.clientY > rect.bottom) return;

      const rx = (e.clientX - rect.left) / rect.width;
      const ry = (e.clientY - rect.top)  / rect.height;
      mouse.tx = rx * 2 - 1;
      mouse.ty = -(ry * 2 - 1);
      pointer.set(mouse.tx, mouse.ty);

      raycaster.setFromCamera(pointer, camera);
      const hits  = raycaster.intersectObjects(proxies);
      const newId = hits.length > 0 ? (hits[0].object.userData.nodeId as number) : null;

      if (newId !== hoveredId) {
        hoveredId = newId;
        if (newId !== null) {
          // Burst signals from hovered node to all neighbours
          ADJ[newId].slice(0, 8).forEach((nbr) =>
            pushSignal(newId, nbr, 1.0 + Math.random() * 0.5)
          );
          canvas.style.cursor = "crosshair";
        } else {
          canvas.style.cursor = "default";
        }
      }
    };

    const onLeave = () => {
      mouse.tx = 0; mouse.ty = 0;
      hoveredId = null;
      canvas.style.cursor = "default";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    /* ── Animation loop ── */
    const projVec = new THREE.Vector3();
    const fa      = new THREE.Vector3();
    const fb      = new THREE.Vector3();
    let elapsed   = 0;
    let lastFire  = -3;
    let animId    = 0;
    const clock   = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      /* Parallax + slow global rotation */
      mouse.x += (mouse.tx - mouse.x) * 0.09;
      mouse.y += (mouse.ty - mouse.y) * 0.09;
      root.rotation.y = elapsed * 0.14 + mouse.x * 0.45;
      root.rotation.x = mouse.y * 0.22;

      /* Hub breathing pulse */
      sprites[0].scale.setScalar(NODES[0].radius * (1 + Math.sin(elapsed * 3.2) * 0.12));

      /* Per-node hover/connected state */
      sprites.forEach((sp, i) => {
        if (i === 0) return;
        const n        = NODES[i];
        const isHov    = hoveredId === n.id;
        const isConn   = hoveredId !== null && ADJ[hoveredId].includes(n.id);
        const targetSz = isHov ? n.radius * 2.3 : isConn ? n.radius * 1.6 : n.radius;
        sp.scale.setScalar(sp.scale.x + (targetSz - sp.scale.x) * 0.13);
        const mat      = sp.material as THREE.SpriteMaterial;
        const targetOp = isHov ? 1 : isConn ? 0.95 : 0.82;
        mat.opacity   += (targetOp - mat.opacity) * 0.13;
      });

      /* Edge gentle opacity pulse */
      edgeMat.opacity = 0.12 + Math.sin(elapsed * 1.1) * 0.07;

      /* Auto-fire: hub -> random speaker -> linked topic, every ~3 s */
      if (elapsed - lastFire > 1.4) {
        lastFire = elapsed;
        const spks = [1, 2, 3, 4];
        const sp   = spks[Math.floor(Math.random() * spks.length)];
        pushSignal(0, sp, 0.65 + Math.random() * 0.25);
        // Chain: speaker -> topic with slight head-start delay (negative t offset)
        const topicNbr = ADJ[sp].find((n) => NODES[n].type === "topic");
        if (topicNbr !== undefined && signals.length < SIGNAL_SLOTS) {
          signals.push({
            from: sp, to: topicNbr, t: -0.35,
            speed: 0.70 + Math.random() * 0.20,
            col: new THREE.Color(NODES[sp].hex),
          });
        }
      }

      /* Advance & prune signals */
      for (let i = signals.length - 1; i >= 0; i--) {
        signals[i].t += dt * signals[i].speed;
        if (signals[i].t >= 1) signals.splice(i, 1);
      }

      /* Write signal + trail positions into geometry */
      const N = Math.min(signals.length, SIGNAL_SLOTS);
      for (let si = 0; si < SIGNAL_SLOTS; si++) {
        const base = si * (TRAIL + 1);
        if (si >= N) {
          // Park this slot's particles off-screen
          for (let tr = 0; tr <= TRAIL; tr++) sigPos[(base + tr) * 3 + 2] = -1000;
          continue;
        }
        const sig = signals[si];
        fa.set(...NODES[sig.from].pos);
        fb.set(...NODES[sig.to].pos);

        for (let tr = 0; tr <= TRAIL; tr++) {
          const tAt = Math.max(0, sig.t - tr * 0.055);
          const p   = fa.clone().lerp(fb, tAt);
          const idx = (base + tr) * 3;
          sigPos[idx]     = p.x;
          sigPos[idx + 1] = p.y;
          sigPos[idx + 2] = p.z;

          // Fade in at head of journey, fade out at tail; exponential trail decay
          const lifeFade  = sig.t < 0.12 ? sig.t / 0.12 : sig.t > 0.82 ? (1 - sig.t) / 0.18 : 1;
          const trailFade = 1 - (tr / (TRAIL + 1)) * 0.92;
          const bright    = Math.max(0, lifeFade * trailFade);
          sigCol[idx]     = sig.col.r * bright;
          sigCol[idx + 1] = sig.col.g * bright;
          sigCol[idx + 2] = sig.col.b * bright;
        }
      }
      (sigGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (sigGeo.attributes.color    as THREE.BufferAttribute).needsUpdate = true;

      /* Render */
      renderer.render(scene, camera);

      /* Project node world positions -> 2-D and update label DOM elements */
      root.updateMatrixWorld();
      const cW = canvas.clientWidth;
      const cH = canvas.clientHeight;

      NODES.forEach((node, i) => {
        const el = labelEls[i];
        if (!el) return;
        projVec.set(...node.pos).applyMatrix4(root.matrixWorld).project(camera);
        if (projVec.z > 1) { el.style.opacity = "0"; return; }
        el.style.left = `${(projVec.x  * 0.5 + 0.5) * cW}px`;
        el.style.top  = `${(-projVec.y * 0.5 + 0.5) * cH}px`;
        const isHov  = hoveredId === node.id;
        const isConn = hoveredId !== null && ADJ[hoveredId].includes(node.id);
        el.style.opacity   = isHov ? "1" : isConn ? "0.88" : "0.52";
        el.style.transform = `translate(-50%,calc(-100% - 8px)) scale(${isHov ? 1.1 : 1})`;
      });

      animId = requestAnimationFrame(tick);
    };

    /* ── Resize ── */
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      root.scale.setScalar(Math.max(0.55, Math.min(1, Math.min(w / 520, h / 580))));
    };
    window.addEventListener("resize", onResize);
    onResize();
    tick();

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mouseleave", onLeave);
      labelEls.forEach((el) => el?.remove());
      glowTex.dispose();
      edgeGeo.dispose();
      sigGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === canvas) canvas.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Three.js canvas */}
      <div ref={canvasRef} aria-hidden className="absolute inset-0" />
      {/* HTML label overlay */}
      <div ref={labelRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
}

export default NeuralWeb;
