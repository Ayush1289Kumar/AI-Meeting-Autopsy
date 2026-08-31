"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * AutopsyScan — "The Scan": a translucent AI scan plane sweeping vertically
 * through a cluster of raw meeting-data particles.
 *
 * - The cluster represents the meeting: a dim, slowly rotating cloud of
 *   violet data points (idle / pre-analysis).
 * - The scan plane (cyan particle grid) sweeps up and down like a CT scanner.
 * - Particles ignite (violet -> cyan -> white flash) as the plane passes
 *   through them, then cool back to idle — the AI dissecting the meeting.
 *
 * Palette matches the project brand (violet #8b5cf6, blue #3d8bff,
 * cyan #22d3ee, warning-gold sparks). Purely decorative (aria-hidden).
 * Must be client-rendered only.
 */
export function AutopsyScan({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.1, 6.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const isSmallScreen = window.innerWidth < 640;

    // Shared glowing-dot texture
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255, 255, 255, 1)");
      g.addColorStop(0.4, "rgba(255, 255, 255, 0.8)");
      g.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };
    const dotTexture = createCircleTexture();

    const makePointsMaterial = (size: number, opacity: number) =>
      new THREE.PointsMaterial({
        size,
        vertexColors: true,
        transparent: true,
        opacity,
        map: dotTexture,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

    // ── Root group (slow spin + cursor parallax) ──
    const root = new THREE.Group();
    scene.add(root);

    // ══════════ Layer 1: The meeting-data cluster ══════════
    // Gaussian ellipsoid cloud of "raw meeting data" points
    const clusterCount = isSmallScreen ? 700 : 1400;
    const clusterPositions = new Float32Array(clusterCount * 3);
    const baseColors = new Float32Array(clusterCount * 3); // idle color per particle
    const idleColor = new THREE.Color("#8b5cf6");
    const activeColor = new THREE.Color("#22d3ee");
    const flashColor = new THREE.Color("#ffffff");

    // Box-Muller-ish gaussian helper
    const gauss = () =>
      (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;

    for (let i = 0; i < clusterCount; i++) {
      clusterPositions[i * 3] = gauss() * 1.7; // x
      clusterPositions[i * 3 + 1] = gauss() * 2.1; // y (taller: voice-like)
      clusterPositions[i * 3 + 2] = gauss() * 1.7; // z

      // Idle tint varies subtly: violet core, some blue
      const c = idleColor.clone();
      if (Math.random() < 0.25) c.lerp(new THREE.Color("#3d8bff"), 0.5);
      baseColors[i * 3] = c.r;
      baseColors[i * 3 + 1] = c.g;
      baseColors[i * 3 + 2] = c.b;
    }

    const clusterGeo = new THREE.BufferGeometry();
    clusterGeo.setAttribute("position", new THREE.BufferAttribute(clusterPositions, 3));
    clusterGeo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(baseColors), 3));
    const clusterMat = makePointsMaterial(0.075, 0.9);
    const cluster = new THREE.Points(clusterGeo, clusterMat);
    root.add(cluster);

    // ══════════ Layer 2: The AI scan plane ══════════
    // A translucent particle grid sweeping vertically through the cluster
    const planeSpan = 4.4;
    const planeSegs = isSmallScreen ? 26 : 38;
    const planePositions: number[] = [];
    const planeColors: number[] = [];
    const planeColor = new THREE.Color("#22d3ee");
    const planeEdge = new THREE.Color("#a5f3fc");

    for (let ix = 0; ix <= planeSegs; ix++) {
      for (let iz = 0; iz <= planeSegs; iz++) {
        const x = (ix / planeSegs - 0.5) * planeSpan;
        const z = (iz / planeSegs - 0.5) * planeSpan;
        planePositions.push(x, 0, z);
        // edges brighter, center fainter (like a scanner aperture)
        const edgeDist = Math.max(Math.abs(x), Math.abs(z)) / (planeSpan / 2);
        const c = planeColor.clone().lerp(planeEdge, Math.max(edgeDist - 0.7, 0) / 0.3);
        planeColors.push(c.r, c.g, c.b);
      }
    }
    const planeGeo = new THREE.BufferGeometry();
    planeGeo.setAttribute("position", new THREE.Float32BufferAttribute(planePositions, 3));
    planeGeo.setAttribute("color", new THREE.Float32BufferAttribute(planeColors, 3));
    const planeMat = makePointsMaterial(0.05, 0.35);
    const scanPlane = new THREE.Points(planeGeo, planeMat);
    root.add(scanPlane);

    // Soft glow bar at the plane's leading edge (a brighter horizontal line)
    const edgeCount = isSmallScreen ? 40 : 70;
    const edgeGeo = new THREE.BufferGeometry();
    const edgePositions = new Float32Array(edgeCount * 3);
    const edgeColors = new Float32Array(edgeCount * 3);
    for (let i = 0; i < edgeCount; i++) {
      edgeColors[i * 3] = planeEdge.r;
      edgeColors[i * 3 + 1] = planeEdge.g;
      edgeColors[i * 3 + 2] = planeEdge.b;
    }
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    edgeGeo.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3));
    const edgeMat = makePointsMaterial(0.11, 0.85);
    const edgeLine = new THREE.Points(edgeGeo, edgeMat);
    root.add(edgeLine);

    // ── Gentle cursor parallax ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!isInside) return;
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const handleMouseLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    // ── Animation Loop ──
    let animId = 0;
    const clock = new THREE.Clock();

    // Scan cycle: plane sweeps top -> bottom -> top over ~10s
    const SCAN_HALF_PERIOD = 5;
    const ignite = new Float32Array(clusterCount); // 0..1 ignition energy per particle

    const animate = () => {
      const time = clock.getElapsedTime();

      // Parallax + slow clinical rotation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      root.rotation.y = time * 0.08 + mouse.x * 0.15;
      root.rotation.x = mouse.y * 0.1;

      // Scan plane height: triangle wave between -2.2 and +2.2
      const cycle = (time % (SCAN_HALF_PERIOD * 2)) / SCAN_HALF_PERIOD; // 0..2
      const planeY = (cycle < 1 ? cycle : 2 - cycle) * 2.2 - 0; // -2.2..+2.2 sweep
      scanPlane.position.y = planeY;
      edgeLine.position.y = planeY;

      // Update particles: ignite near the plane, cool elsewhere
      const cPos = clusterGeo.attributes.position as THREE.BufferAttribute;
      const cArr = cPos.array as Float32Array;
      const cCol = clusterGeo.attributes.color as THREE.BufferAttribute;
      const cColArr = cCol.array as Float32Array;

      const dt = 1 / 60;
      for (let i = 0; i < clusterCount; i++) {
        const px = clusterPositions[i * 3];
        const py = clusterPositions[i * 3 + 1];
        const pz = clusterPositions[i * 3 + 2];

        // Distance from the scan plane
        const dist = Math.abs(py - planeY);
        if (dist < 0.22) {
          ignite[i] = Math.min(ignite[i] + (0.22 - dist) * 0.5, 1.6);
        }

        // Cool-down
        if (ignite[i] > 0) {
          ignite[i] = Math.max(ignite[i] - dt * 0.55, 0);
        }

        // Write position (slight jitter animation while ignited)
        const jitter = ignite[i] * 0.015;
        cArr[i * 3] = px + (Math.random() - 0.5) * jitter;
        cArr[i * 3 + 1] = py + (Math.random() - 0.5) * jitter;
        cArr[i * 3 + 2] = pz + (Math.random() - 0.5) * jitter;

        // Color: idle -> active cyan -> white flash
        const e = ignite[i];
        const r = baseColors[i * 3];
        const g = baseColors[i * 3 + 1];
        const b = baseColors[i * 3 + 2];
        if (e <= 0) {
          cColArr[i * 3] = r;
          cColArr[i * 3 + 1] = g;
          cColArr[i * 3 + 2] = b;
        } else {
          const flash = Math.max(e - 1, 0); // only the hottest particles flash white
          const mixed = activeColor.clone().multiplyScalar(Math.min(e, 1));
          cColArr[i * 3] = r + mixed.r + flash;
          cColArr[i * 3 + 1] = g + mixed.g + flash;
          cColArr[i * 3 + 2] = b + mixed.b + flash;
        }
      }
      cPos.needsUpdate = true;
      cCol.needsUpdate = true;

      // Scan plane edge line: distribute along x
      const ePos = edgeGeo.attributes.position as THREE.BufferAttribute;
      const eArr = ePos.array as Float32Array;
      for (let i = 0; i < edgeCount; i++) {
        eArr[i * 3] = (i / (edgeCount - 1) - 0.5) * planeSpan;
        eArr[i * 3 + 1] = 0;
        eArr[i * 3 + 2] = 0;
      }
      ePos.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // ── Resize Handling ──
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ── Cleanup ──
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
      clusterGeo.dispose();
      clusterMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      edgeGeo.dispose();
      edgeMat.dispose();
      dotTexture.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`}
    />
  );
}

export default AutopsyScan;
