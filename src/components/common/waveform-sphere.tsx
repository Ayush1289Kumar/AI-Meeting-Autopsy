"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */

const N      = 4200;  // surface points — high enough for dense mesh, fast enough for 60 fps
const RADIUS = 1.85;  // base sphere radius (world units)
const MAX_RIPPLES = 4;

/* ═══════════════════════════════════════════════════════════
   Fibonacci sphere distribution (even spacing on unit sphere)
   ═══════════════════════════════════════════════════════════ */

interface SphereData {
  pos:   Float32Array; // base positions scaled to RADIUS
  theta: Float32Array; // polar angle [0, π]
  phi:   Float32Array; // azimuthal angle [-π, π]
}

function buildSphere(): SphereData {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pos    = new Float32Array(N * 3);
  const theta  = new Float32Array(N);
  const phi    = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const y   = 1 - (i / (N - 1)) * 2; // -1 → 1
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const a   = golden * i;
    const x   = Math.cos(a) * rad;
    const z   = Math.sin(a) * rad;
    pos[i * 3]     = x * RADIUS;
    pos[i * 3 + 1] = y * RADIUS;
    pos[i * 3 + 2] = z * RADIUS;
    theta[i] = Math.acos(Math.min(Math.max(y, -1), 1));
    phi[i]   = Math.atan2(z, x); // -π → π
  }
  return { pos, theta, phi };
}

/* ═══════════════════════════════════════════════════════════
   Floating label config
   ═══════════════════════════════════════════════════════════ */

interface LabelDef {
  text:  string;
  color: string;
  r:     number;   // orbit radius
  speed: number;   // rad / s
  tilt:  number;   // orbit-plane inclination (rad)
  phase: number;   // start angle
}

const LABELS: LabelDef[] = [
  { text: "● Voice Patterns", color: "#8b5cf6", r: 2.05, speed: 0.24, tilt:  0.35, phase: 0 },
  { text: "⚡ AI Analyzing",   color: "#22d3ee", r: 2.20, speed: 0.19, tilt: -0.48, phase: Math.PI * 0.5 },
  { text: "47 Signals",       color: "#3d8bff", r: 2.10, speed: 0.31, tilt:  0.68, phase: Math.PI },
  { text: "✓ Decision Made",  color: "#10b981", r: 2.15, speed: 0.21, tilt: -0.22, phase: Math.PI * 1.5 },
];

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

interface Ripple {
  cx: number; cy: number; cz: number; // hit point on unit sphere (normalised)
  t: number;                           // 0 → 1 decay progress
}

/**
 * WaveformSphere — Option 3 hero visual.
 *
 * A 4 200-point Fibonacci sphere whose surface undulates with layered
 * sinusoidal waveforms simulating audio analysis. Mouse hover fires
 * spreading ripples from the contact point. Colour transitions from
 * violet at the poles to cyan at the equator; displacement peaks
 * flash white. Four orbital label chips float around the sphere.
 *
 * Purely CPU-side — no GLSL shaders needed. Three.js (already a
 * project dep) handles rendering. ~0.8 ms per frame budget on a
 * modern device at 4 200 points.
 */
export function WaveformSphere({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const labelRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas     = canvasRef.current;
    const labelLayer = labelRef.current;
    if (!canvas || !labelLayer) return;

    const W = canvas.clientWidth  || 520;
    const H = canvas.clientHeight || 520;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      alpha: true, antialias: true, powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    canvas.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, W / H, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const root = new THREE.Group();
    scene.add(root);

    /* ── Radial glow texture ── */
    const glowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0,    "rgba(255,255,255,1)");
      g.addColorStop(0.28, "rgba(255,255,255,0.72)");
      g.addColorStop(0.55, "rgba(255,255,255,0.18)");
      g.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();

    /* ── Ambient outer haze ── */
    const haze = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color("#8b5cf6"),
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.065,
    }));
    haze.scale.setScalar(9.5);
    root.add(haze);

    /* ── Layered core glows ── */
    const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color("#8b5cf6"),
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.50,
    }));
    coreGlow.scale.setScalar(3.0);
    root.add(coreGlow);

    const coreCyan = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color("#22d3ee"),
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.18,
    }));
    coreCyan.scale.setScalar(1.4);
    root.add(coreCyan);

    /* ── Main sphere point cloud ── */
    const { pos: basePos, theta: baseTheta, phi: basePhi } = buildSphere();

    const livePos  = new Float32Array(N * 3);
    const liveCol  = new Float32Array(N * 3);

    const poleColor = new THREE.Color("#8b5cf6");
    const eqColor   = new THREE.Color("#22d3ee");
    const white     = new THREE.Color(1, 1, 1);
    const tmpC      = new THREE.Color();

    const sphereGeo = new THREE.BufferGeometry();
    sphereGeo.setAttribute("position", new THREE.BufferAttribute(livePos,  3));
    sphereGeo.setAttribute("color",    new THREE.BufferAttribute(liveCol,  3));
    root.add(new THREE.Points(sphereGeo, new THREE.PointsMaterial({
      size: 0.068, vertexColors: true, transparent: true, opacity: 0.90,
      map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    /* ── Sparse outer halo (sparser, larger radius) ── */
    const haloN   = 480;
    const { pos: haloBase } = buildSphere();
    const haloBuf = new Float32Array(haloN * 3);
    const haloCol = new Float32Array(haloN * 3);
    for (let i = 0; i < haloN; i++) {
      haloBuf[i * 3]     = haloBase[i * 3]     * 1.28;
      haloBuf[i * 3 + 1] = haloBase[i * 3 + 1] * 1.28;
      haloBuf[i * 3 + 2] = haloBase[i * 3 + 2] * 1.28;
      haloCol[i * 3] = poleColor.r; haloCol[i * 3 + 1] = poleColor.g; haloCol[i * 3 + 2] = poleColor.b;
    }
    const haloGeo = new THREE.BufferGeometry();
    haloGeo.setAttribute("position", new THREE.BufferAttribute(haloBuf, 3));
    haloGeo.setAttribute("color",    new THREE.BufferAttribute(haloCol, 3));
    root.add(new THREE.Points(haloGeo, new THREE.PointsMaterial({
      size: 0.052, vertexColors: true, transparent: true, opacity: 0.20,
      map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    /* ── Invisible proxy sphere for hover raycasting ── */
    const proxyMesh = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.15, 16, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    root.add(proxyMesh);

    /* ── HTML floating label chips ── */
    const labelAngles = LABELS.map(l => l.phase);
    const labelEls = LABELS.map(l => {
      const el = document.createElement("div");
      el.style.cssText = [
        "position:absolute",
        "pointer-events:none",
        "transform:translate(-50%,-50%) scale(1)",
        "padding:3px 11px 4px",
        "border-radius:999px",
        "font-size:10.5px",
        "font-weight:600",
        "font-family:var(--font-display,system-ui,sans-serif)",
        "letter-spacing:0.025em",
        "white-space:nowrap",
        `border:1px solid ${l.color}55`,
        "background:rgba(8,11,28,0.84)",
        `color:${l.color}`,
        "opacity:0",
        "will-change:opacity,transform",
        "backdrop-filter:blur(8px)",
        "-webkit-backdrop-filter:blur(8px)",
        "user-select:none",
        "transition:opacity 0.28s",
      ].join(";");
      el.textContent = l.text;
      labelLayer.appendChild(el);
      return el;
    });

    /* ── Mouse / ripple state ── */
    const ripples: Ripple[] = [];
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();
    const mouse     = { x: 0, y: 0, tx: 0, ty: 0 };
    const invMat    = new THREE.Matrix4();
    const lPos      = new THREE.Vector3();
    const projVec   = new THREE.Vector3();
    let lastRipple  = -1;

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => { mouse.tx = 0; mouse.ty = 0; };
    window.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    /* ── Animation loop ── */
    let elapsed = 0;
    let animId  = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      /* Slow parallax rotation */
      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;
      root.rotation.y = elapsed * 0.13 + mouse.x * 0.35;
      root.rotation.x = mouse.y * 0.22;

      /* Advance + prune ripples */
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].t += dt * 0.75;
        if (ripples[i].t >= 1) ripples.splice(i, 1);
      }

      /* Spawn ripple from cursor on sphere surface, throttled to 0.5 s */
      if ((Math.abs(mouse.tx) > 0.02 || Math.abs(mouse.ty) > 0.02) && elapsed - lastRipple > 0.5 && ripples.length < MAX_RIPPLES) {
        pointer.set(mouse.tx, mouse.ty);
        raycaster.setFromCamera(pointer, camera);
        root.updateMatrixWorld();
        const hits = raycaster.intersectObject(proxyMesh);
        if (hits.length > 0) {
          lastRipple = elapsed;
          invMat.copy(root.matrixWorld).invert();
          const hp = hits[0].point.clone().applyMatrix4(invMat).normalize();
          ripples.push({ cx: hp.x, cy: hp.y, cz: hp.z, t: 0 });
        }
      }

      /* Global breathe (subtle uniform scale oscillation) */
      const breathe = 1 + Math.sin(elapsed * 1.15) * 0.016;

      /* ─────── Per-point displacement + colour update ─────── */
      const posAttr = sphereGeo.attributes.position as THREE.BufferAttribute;
      const colAttr = sphereGeo.attributes.color    as THREE.BufferAttribute;

      for (let i = 0; i < N; i++) {
        const bx = basePos[i * 3];
        const by = basePos[i * 3 + 1];
        const bz = basePos[i * 3 + 2];
        const th = baseTheta[i];
        const ph = basePhi[i];

        /* Four layered waveform harmonics (voice-waveform metaphor) */
        const w1 = 0.52 * Math.sin(3.0 * th + elapsed * 1.10 + Math.sin(ph * 2.0 + elapsed * 0.40));
        const w2 = 0.32 * Math.sin(6.0 * ph + elapsed * 0.82 + Math.cos(th * 3.0 + elapsed * 0.55));
        const w3 = 0.22 * Math.sin(4.5 * th + 5.2 * ph + elapsed * 1.42);
        const w4 = 0.16 * Math.sin(8.0 * ph - elapsed * 1.85 + th * 2.2);
        let disp = (w1 + w2 + w3 + w4) * 0.165; // keeps displacement in ≈ ±0.19 range

        /* Ripple contributions */
        for (const rp of ripples) {
          const dot   = (bx * rp.cx + by * rp.cy + bz * rp.cz) / RADIUS;
          const angle = Math.acos(Math.min(Math.max(dot, -1), 1));
          const wave  =
            Math.sin(angle * 7.5 - rp.t * 11) *
            Math.exp(-angle * 2.4) *
            Math.exp(-rp.t * 1.9);
          disp += wave * 0.42;
        }

        const s = breathe * (1 + disp);
        posAttr.setXYZ(i, bx * s, by * s, bz * s);

        /* Colour: latitude → violet(pole) / cyan(equator), brightness by displacement */
        const equatorT = 1 - Math.abs(th / Math.PI - 0.5) * 2; // 0 at poles, 1 at equator
        tmpC.copy(poleColor).lerp(eqColor, equatorT);
        const dn = Math.min(Math.max((disp + 0.5) * 0.85, 0), 1); // normalised 0→1
        tmpC.multiplyScalar(0.50 + dn * 0.82);
        if (dn > 0.86) tmpC.lerp(white, (dn - 0.86) / 0.14); // white flash at peaks
        colAttr.setXYZ(i, tmpC.r, tmpC.g, tmpC.b);
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      /* Core glow breathing */
      coreGlow.scale.setScalar(3.0 * (1 + Math.sin(elapsed * 2.1) * 0.09));

      /* Render */
      renderer.render(scene, camera);

      /* ─────── Update floating label 2-D positions ─────── */
      root.updateMatrixWorld();
      const cW = canvas.clientWidth;
      const cH = canvas.clientHeight;

      LABELS.forEach((lbl, i) => {
        labelAngles[i] += dt * lbl.speed;
        const a  = labelAngles[i];
        const zf = lbl.r * Math.sin(a);
        lPos.set(lbl.r * Math.cos(a), zf * Math.sin(lbl.tilt), zf * Math.cos(lbl.tilt));
        projVec.copy(lPos).applyMatrix4(root.matrixWorld).project(camera);
        const el = labelEls[i];
        if (projVec.z > 1) { el.style.opacity = "0"; return; }

        // Clamp 2-D screen position so chips never leave the canvas
        const PAD_X = 64; // half max chip width + margin
        const PAD_Y = 18;
        const rawX  = (projVec.x  * 0.5 + 0.5) * cW;
        const rawY  = (-projVec.y * 0.5 + 0.5) * cH;
        const sx    = Math.max(PAD_X, Math.min(cW - PAD_X, rawX));
        const sy    = Math.max(PAD_Y, Math.min(cH - PAD_Y, rawY));

        el.style.left = `${sx}px`;
        el.style.top  = `${sy}px`;

        // Fade out as chip approaches the clamped boundary
        const edgeT = Math.min(
          (rawX - PAD_X) / 30,
          (cW - PAD_X - rawX) / 30,
          (rawY - PAD_Y) / 30,
          (cH - PAD_Y - rawY) / 30,
          1
        );
        const depth  = (1 - projVec.z) * 0.5 + 0.5;
        el.style.opacity   = String(Math.max(0, Math.min(0.42 + depth * 0.58, 1) * Math.max(0, edgeT)));
        el.style.transform = `translate(-50%,-50%) scale(${0.82 + depth * 0.22})`;
      });

      animId = requestAnimationFrame(tick);
    };

    /* ── Resize ── */
    const onResize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      root.scale.setScalar(Math.max(0.58, Math.min(1, Math.min(w / 500, h / 560))));
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
      labelEls.forEach(el => el?.remove());
      glowTex.dispose();
      sphereGeo.dispose();
      haloGeo.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === canvas) canvas.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Three.js WebGL canvas */}
      <div ref={canvasRef} aria-hidden className="absolute inset-0" />
      {/* Floating label overlay */}
      <div ref={labelRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
}

export default WaveformSphere;
