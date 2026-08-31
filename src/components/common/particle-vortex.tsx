"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════
   Sizing constants
   ═══════════════════════════════════════════════════════════ */

const N_CHAOS      = 420;  // turbulent outer cloud
const N_SPIRAL     = 2200; // helical funnel flow
const N_BEAMS      = 6;    // organised output beams
const N_PER_BEAM   = 85;   // particles per beam
const N_BEAM_TOTAL = N_BEAMS * N_PER_BEAM;

/* ═══════════════════════════════════════════════════════════
   Beam / output-stream definitions
   ═══════════════════════════════════════════════════════════ */

interface BeamDef { angle: number; hex: string; label: string }

const BEAMS: BeamDef[] = [
  { angle: 0,                        hex: "#10b981", label: "Health Score" },
  { angle: (Math.PI * 1) / 3,        hex: "#3d8bff", label: "Decisions"    },
  { angle: (Math.PI * 2) / 3,        hex: "#f5b94b", label: "Action Items" },
  { angle: Math.PI,                   hex: "#f87171", label: "Risk Flags"   },
  { angle: (Math.PI * 4) / 3,        hex: "#8b5cf6", label: "Speaker Data" },
  { angle: (Math.PI * 5) / 3,        hex: "#22d3ee", label: "Timeline"     },
];

/* ═══════════════════════════════════════════════════════════
   Helper — indexed ring line
   ═══════════════════════════════════════════════════════════ */

function makeRing(
  radius: number, y: number, hex: string, opacity: number, segs = 80
): THREE.Line {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius));
  }
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({
      color: new THREE.Color(hex),
      transparent: true, opacity,
      blending: THREE.AdditiveBlending,
    })
  );
}

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */

/**
 * ParticleVortex — Option 5 hero visual.
 *
 * Three cooperating particle sets tell a "chaos → insight" story:
 *  1. CHAOS cloud  — warm-coloured turbulent particles orbiting the funnel mouth
 *  2. SPIRAL funnel — helical stream that accelerates toward the apex, colour
 *     morphing from violet to cyan as order emerges
 *  3. BEAM output — 6 categorised data streams erupting from the apex
 *     (Health, Decisions, Actions, Risks, Speakers, Timeline)
 *
 * Mouse proximity drives turbulence. X/Y parallax tilts the whole vortex.
 * HTML label chips at beam endpoints — all bounds-clamped with edge fade.
 */
export function ParticleVortex({ className = "" }: { className?: string }) {
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

    /* ── Scene / Camera — 3/4 elevated view to see chaos + beams ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, W / H, 0.1, 100);
    camera.position.set(0, 2.2, 8.5);
    camera.lookAt(0, -0.4, 0);

    const root = new THREE.Group();
    scene.add(root);

    /* ── Shared glow texture ── */
    const glowTex = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0,    "rgba(255,255,255,1)");
      g.addColorStop(0.25, "rgba(255,255,255,0.75)");
      g.addColorStop(0.55, "rgba(255,255,255,0.18)");
      g.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();

    /* ── Ambient haze ── */
    const haze = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color("#8b5cf6"),
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.065,
    }));
    haze.scale.setScalar(10);
    haze.position.set(0, 0.2, 0);
    root.add(haze);

    /* ── Vortex apex glow (bright cyan at funnel bottom) ── */
    const apexGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color("#22d3ee"),
      blending: THREE.AdditiveBlending, transparent: true, opacity: 0.70,
    }));
    apexGlow.scale.setScalar(1.3);
    apexGlow.position.set(0, -2.0, 0);
    root.add(apexGlow);

    /* ── Structural rings ── */
    // Top intake ring
    const topRing    = makeRing(2.3, 2.1, "#8b5cf6", 0.22);
    const topRingMat = topRing.material as THREE.LineBasicMaterial;
    root.add(topRing);

    // Bottom discharge ring — in its own group so it can spin independently
    const botRingGroup = new THREE.Group();
    botRingGroup.position.y = -2.0;
    root.add(botRingGroup);
    const botRing    = makeRing(0.55, 0, "#22d3ee", 0.85);
    const botRingMat = botRing.material as THREE.LineBasicMaterial;
    botRingGroup.add(botRing);

    /* ── CHAOS particles ── */
    const chaosPos = new Float32Array(N_CHAOS * 3);
    const chaosCol = new Float32Array(N_CHAOS * 3);
    const chaosGeo = new THREE.BufferGeometry();
    chaosGeo.setAttribute("position", new THREE.BufferAttribute(chaosPos, 3));
    chaosGeo.setAttribute("color",    new THREE.BufferAttribute(chaosCol, 3));
    root.add(new THREE.Points(chaosGeo, new THREE.PointsMaterial({
      size: 0.072, vertexColors: true, transparent: true, opacity: 0.78,
      map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    // Pre-compute per-particle seeds (avoids recomputing golden ratios each frame)
    const cSeedA   = new Float32Array(N_CHAOS); // angle seed
    const cSeedR   = new Float32Array(N_CHAOS); // radius seed
    const cSeedY   = new Float32Array(N_CHAOS); // height seed
    const cSeedP   = new Float32Array(N_CHAOS); // phase seed
    const cBaseCol = new Float32Array(N_CHAOS * 3); // pre-baked colors

    {
      const tmp = new THREE.Color();
      for (let i = 0; i < N_CHAOS; i++) {
        const g1 = i * 2.399963;
        const g2 = i * 1.732050;
        cSeedA[i] = g1;
        cSeedR[i] = 1.85 + (Math.sin(g2 * 0.5) * 0.5 + 0.5) * 0.95; // 1.85 → 2.80
        cSeedY[i] = 0.55 + (Math.sin(g2 * 0.9) * 0.5 + 0.5) * 1.45; // 0.55 → 2.00
        cSeedP[i] = g2;
        // Hue: violet (0.72) → pink/red (0.95..1.0) — looks chaotic, warm
        const hue = ((Math.sin(g2 * 0.7) * 0.5 + 0.5) * 0.28 + 0.72) % 1.0;
        tmp.setHSL(hue, 0.92, 0.58);
        cBaseCol[i * 3] = tmp.r; cBaseCol[i * 3 + 1] = tmp.g; cBaseCol[i * 3 + 2] = tmp.b;
      }
    }

    /* ── SPIRAL particles ── */
    const spiralPos = new Float32Array(N_SPIRAL * 3);
    const spiralCol = new Float32Array(N_SPIRAL * 3);
    const spiralGeo = new THREE.BufferGeometry();
    spiralGeo.setAttribute("position", new THREE.BufferAttribute(spiralPos, 3));
    spiralGeo.setAttribute("color",    new THREE.BufferAttribute(spiralCol, 3));
    root.add(new THREE.Points(spiralGeo, new THREE.PointsMaterial({
      size: 0.060, vertexColors: true, transparent: true, opacity: 0.88,
      map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    const spiralTopColor = new THREE.Color("#8b5cf6");
    const spiralBotColor = new THREE.Color("#22d3ee");
    const tmpC           = new THREE.Color();

    /* ── BEAM particles ── */
    const beamPos = new Float32Array(N_BEAM_TOTAL * 3);
    const beamCol = new Float32Array(N_BEAM_TOTAL * 3);
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPos, 3));
    beamGeo.setAttribute("color",    new THREE.BufferAttribute(beamCol, 3));
    root.add(new THREE.Points(beamGeo, new THREE.PointsMaterial({
      size: 0.068, vertexColors: true, transparent: true, opacity: 0.92,
      map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    const beamColors = BEAMS.map(b => new THREE.Color(b.hex));

    /* ── HTML label chips at beam tips ── */
    const labelEls = BEAMS.map(b => {
      const el = document.createElement("div");
      el.style.cssText = [
        "position:absolute",
        "pointer-events:none",
        "transform:translate(-50%,-50%)",
        "padding:3px 10px 4px",
        "border-radius:999px",
        "font-size:10.5px",
        "font-weight:600",
        "font-family:var(--font-display,system-ui,sans-serif)",
        "letter-spacing:0.025em",
        "white-space:nowrap",
        `border:1px solid ${b.hex}55`,
        "background:rgba(8,11,28,0.88)",
        `color:${b.hex}`,
        "opacity:0",
        "will-change:opacity,transform",
        "backdrop-filter:blur(8px)",
        "-webkit-backdrop-filter:blur(8px)",
        "user-select:none",
        "transition:opacity 0.3s",
      ].join(";");
      el.textContent = b.label;
      labelLayer.appendChild(el);
      return el;
    });

    /* ── Mouse ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let turbulence = 0;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      mouse.tx = ((e.clientX - r.left) / r.width)  * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => { mouse.tx = 0; mouse.ty = 0; };
    window.addEventListener("mousemove", onMove, { passive: true });
    canvas.addEventListener("mouseleave", onLeave);

    /* ── Reusable vectors ── */
    const projVec = new THREE.Vector3();
    const tipVec  = new THREE.Vector3();

    /* ── Animation loop ── */
    let elapsed = 0;
    let animId  = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;

      /* Parallax tilt */
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      root.rotation.y = elapsed * 0.08 + mouse.x * 0.28;
      root.rotation.x = mouse.y * 0.14;

      /* Turbulence level tracks cursor distance from canvas centre */
      turbulence += ((Math.abs(mouse.tx) + Math.abs(mouse.ty)) * 0.5 - turbulence) * 0.05;

      /* Structural ring animations */
      botRingGroup.rotation.y = elapsed * 2.6;
      botRingMat.opacity = 0.68 + Math.sin(elapsed * 3.1) * 0.24;
      topRingMat.opacity = 0.16 + Math.sin(elapsed * 0.65) * 0.08;
      apexGlow.scale.setScalar(1.3 * (1 + Math.sin(elapsed * 2.9) * 0.13));

      /* ─── CHAOS ─── */
      const cpAttr = chaosGeo.attributes.position as THREE.BufferAttribute;
      const ccAttr = chaosGeo.attributes.color    as THREE.BufferAttribute;
      for (let i = 0; i < N_CHAOS; i++) {
        const angle = cSeedA[i] + elapsed * (0.10 + Math.sin(cSeedP[i] * 0.5) * 0.04);
        const turb  = turbulence * 0.72;
        const tx    = Math.sin(elapsed * 1.4 + cSeedP[i] * 3.1) * turb;
        const ty    = Math.cos(elapsed * 1.0 + cSeedP[i] * 2.3) * turb * 0.45;
        const tz    = Math.sin(elapsed * 1.2 + cSeedP[i] * 4.0 + 1) * turb;
        cpAttr.setXYZ(i,
          Math.cos(angle) * cSeedR[i] + tx,
          cSeedY[i] + ty,
          Math.sin(angle) * cSeedR[i] + tz
        );
        const bright = 0.68 + Math.sin(elapsed * 2.6 + cSeedP[i] * 7) * 0.32;
        ccAttr.setXYZ(i,
          cBaseCol[i * 3] * bright, cBaseCol[i * 3 + 1] * bright, cBaseCol[i * 3 + 2] * bright
        );
      }
      cpAttr.needsUpdate = true;
      ccAttr.needsUpdate = true;

      /* ─── SPIRAL ─── */
      const spAttr = spiralGeo.attributes.position as THREE.BufferAttribute;
      const scAttr = spiralGeo.attributes.color    as THREE.BufferAttribute;
      const FLOW   = 0.17;
      for (let i = 0; i < N_SPIRAL; i++) {
        const t     = ((i / N_SPIRAL) + elapsed * FLOW) % 1.0; // 0 = top, 1 = apex
        const y     = 2.1 - t * 4.35;                          // 2.1 → -2.25
        const r     = 2.3 * Math.pow(Math.max(0, 1 - t), 1.22) + 0.05; // wide → narrow
        // Spin accelerates toward apex (conservation of angular momentum feel)
        const omega = 2.2 + t * 5.8;
        const angle = (i / N_SPIRAL) * Math.PI * 2 + elapsed * omega;
        spAttr.setXYZ(i, Math.cos(angle) * r, y, Math.sin(angle) * r);
        // Colour: violet → cyan, gamma-corrected blend
        tmpC.copy(spiralTopColor).lerp(spiralBotColor, Math.pow(t, 0.55));
        const bright = 0.42 + t * 0.72;
        scAttr.setXYZ(i, tmpC.r * bright, tmpC.g * bright, tmpC.b * bright);
      }
      spAttr.needsUpdate = true;
      scAttr.needsUpdate = true;

      /* ─── BEAMS ─── */
      const bpAttr  = beamGeo.attributes.position as THREE.BufferAttribute;
      const bcAttr  = beamGeo.attributes.color    as THREE.BufferAttribute;
      const BSPEED  = 0.40;
      for (let b = 0; b < N_BEAMS; b++) {
        const bAngle = BEAMS[b].angle;
        const bc     = beamColors[b];
        for (let j = 0; j < N_PER_BEAM; j++) {
          const t   = ((j / N_PER_BEAM) + elapsed * BSPEED + b * 0.167) % 1.0;
          const dist = t * 2.55;
          const idx  = b * N_PER_BEAM + j;
          bpAttr.setXYZ(idx,
            Math.cos(bAngle) * dist,
            -2.0 - t * 0.28,          // subtle downward flare
            Math.sin(bAngle) * dist
          );
          // Head bright, exponential fade toward tip
          const bright = (1 - Math.pow(t, 0.55)) * 0.82 + 0.18;
          bcAttr.setXYZ(idx, bc.r * bright, bc.g * bright, bc.b * bright);
        }
      }
      bpAttr.needsUpdate = true;
      bcAttr.needsUpdate = true;

      /* Render */
      renderer.render(scene, camera);

      /* ─── Label chip 2-D positioning ─── */
      root.updateMatrixWorld();
      const cW = canvas.clientWidth;
      const cH = canvas.clientHeight;
      const PAD_X = 62, PAD_Y = 16;

      BEAMS.forEach((b, i) => {
        tipVec.set(Math.cos(b.angle) * 2.85, -2.05, Math.sin(b.angle) * 2.85);
        projVec.copy(tipVec).applyMatrix4(root.matrixWorld).project(camera);
        const el = labelEls[i];
        if (projVec.z > 1) { el.style.opacity = "0"; return; }

        const rawX = (projVec.x  * 0.5 + 0.5) * cW;
        const rawY = (-projVec.y * 0.5 + 0.5) * cH;
        const sx   = Math.max(PAD_X, Math.min(cW - PAD_X, rawX));
        const sy   = Math.max(PAD_Y, Math.min(cH - PAD_Y, rawY));

        // Fade as chip nears the clamped boundary
        const edgeT = Math.min(
          (rawX - PAD_X) / 25, (cW - PAD_X - rawX) / 25,
          (rawY - PAD_Y) / 25, (cH - PAD_Y - rawY) / 25,
          1
        );
        const depth = (1 - projVec.z) * 0.5 + 0.5;
        el.style.left      = `${sx}px`;
        el.style.top       = `${sy}px`;
        el.style.opacity   = String(Math.max(0, Math.min(0.48 + depth * 0.52, 1) * Math.max(0, edgeT)));
        el.style.transform = `translate(-50%,-50%) scale(${0.84 + depth * 0.20})`;
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
      root.scale.setScalar(Math.max(0.55, Math.min(1, Math.min(w / 500, h / 560))));
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
      chaosGeo.dispose();
      spiralGeo.dispose();
      beamGeo.dispose();
      topRing.geometry.dispose();
      botRing.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === canvas) canvas.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Three.js canvas */}
      <div ref={canvasRef} aria-hidden className="absolute inset-0" />
      {/* Label overlay */}
      <div ref={labelRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" />
    </div>
  );
}

export default ParticleVortex;
