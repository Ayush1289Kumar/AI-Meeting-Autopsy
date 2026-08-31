# 🎮 3D Components — Size & Customization Guide

> All components live in `src/components/common/`. Each is a Three.js scene rendered into a `<div>` via WebGL.

---

## How Size Works (applies to ALL components)

The key formula inside every component's `onResize` callback:

```ts
root.scale.setScalar(Math.max(minScale, Math.min(1, Math.min(w / REF_W, h / REF_H))));
```

The scene fits to whichever dimension is **smaller** relative to the reference size.
- **Bigger container = bigger scene** (up to scale `1.0`)
- Container height matters most — it's usually the limiting dimension

### Container Sizing (where you use the component)

| Container size | Effective scale | Look |
|---|---|---|
| `h-40` (160px) | ~0.28 | Tiny — decorative dot |
| `h-56` (224px) | ~0.40 | Small |
| `h-72` (288px) | ~0.51 | Medium-small |
| `h-96` (384px) | ~0.68 | Medium |
| `h-[28rem]` (448px) | ~0.80 | Large |
| `h-[32rem]` (512px) | ~0.91 | Near full-size |
| `h-[36rem]` (576px) | ~1.00 | Full size (max) |

> Beyond the max the scene doesn't grow — increase `camera.position.z` to zoom out further instead.

---

## 1. 🌐 Dashboard Globe
**File:** [`dashboard-globe.tsx`](file:///d:/Development/Hackathon%20Projects/AI-Meeting-Autopsy/src/components/common/dashboard-globe.tsx)

| Parameter | Line | Default | What it does |
|---|---|---|---|
| `camera.position.z` | ~122 | `7.5` | 🔍 Zoom level — lower = closer/bigger |
| `camera.fov` | ~121 | `45` | Wide angle — higher = wider view (smaller globe) |
| `RADIUS = 1.5` (sphere geo) | ~154 | `1.5` | Globe sphere radius |
| `RINGS[].radius` | ~28-31 | `2.00–2.55` | Orbit ring distances from center |
| `coreGlow.scale.setScalar` | ~143 | `2.5` | Size of the purple glow blob |
| `onResize` ref sizes | ~360 | `w/500, h/560` | **Scale reference** — lower = bigger scene |
| `root.rotation.y` speed | ~294 | `* 0.20` | Rotation speed |

```ts
// To make globe bigger → lower camera z:
camera.position.set(0, 1.0, 6.0);  // was 7.5

// Or lower reference sizes in onResize:
root.scale.setScalar(Math.max(0.58, Math.min(1, Math.min(w / 380, h / 420))));
//                                                              ↑ was 500    ↑ was 560
```

---

## 2. 🔬 Autopsy Scan
**File:** [`autopsy-scan.tsx`](file:///d:/Development/Hackathon%20Projects/AI-Meeting-Autopsy/src/components/common/autopsy-scan.tsx)

| Parameter | What it does |
|---|---|
| `camera.position.z` | Zoom — lower = bigger scan |
| Particle counts (`N_RING`, etc.) | Density of particles |
| Ring radii values | How wide the scan sweeps |
| `onResize` ref sizes | Global scale reference |

```ts
// Bigger scan:
camera.position.set(0, 0, 5.5);  // default is usually ~7–8

// In onResize, lower refs:
root.scale.setScalar(Math.max(0.5, Math.min(1, Math.min(w / 380, h / 420))));
```

---

## 3. 🕸️ Neural Web
**File:** [`neural-web.tsx`](file:///d:/Development/Hackathon%20Projects/AI-Meeting-Autopsy/src/components/common/neural-web.tsx)

| Parameter | Line | Default | What it does |
|---|---|---|---|
| `camera.position.z` | ~108 | `6.8` | Zoom — lower = bigger network |
| `camera.fov` | ~107 | `48` | Field of view |
| `NODES[].pos` values | ~21–43 | Various | Node positions (spread of network) |
| `NODES[].radius` | ~21–43 | `0.16–0.58` | Node glow sprite size |
| `root.rotation.y` speed | ~298 | `* 0.14` | Auto-rotation speed |
| `onResize` ref sizes | ~408 | `w/520, h/580` | **Scale reference** |

```ts
// Bigger network:
camera.position.set(0, 0.4, 5.2);  // was 6.8

// Or scale nodes up — change all pos values * 1.3 multiplier
// Or lower onResize refs:
root.scale.setScalar(Math.max(0.55, Math.min(1, Math.min(w / 390, h / 440))));
```

---

## 4. 🌀 Particle Vortex
**File:** [`particle-vortex.tsx`](file:///d:/Development/Hackathon%20Projects/AI-Meeting-Autopsy/src/components/common/particle-vortex.tsx)

| Parameter | Line | Default | What it does |
|---|---|---|---|
| `camera.position` | ~93 | `(0, 2.2, 8.5)` | Y = elevation, Z = zoom distance |
| `camera.fov` | ~92 | `46` | Field of view |
| `N_CHAOS` | ~10 | `420` | Outer turbulent particle count |
| `N_SPIRAL` | ~11 | `2200` | Helical funnel particles |
| `N_BEAMS` | ~12 | `6` | Number of output beams |
| Chaos radius `1.85 → 2.80` | ~170 | `cSeedR` | How wide chaos cloud spreads |
| Spiral `y = 2.1 - t * 4.35` | ~306 | height | Vortex height/length |
| `onResize` ref sizes | ~387 | `w/500, h/560` | **Scale reference** |

```ts
// Bigger vortex — move camera closer:
camera.position.set(0, 1.8, 6.5);  // was (0, 2.2, 8.5)

// Wider spread of chaos cloud:
cSeedR[i] = 2.5 + ...  // was 1.85 base

// More particles (denser):
const N_CHAOS  = 600;   // was 420
const N_SPIRAL = 3000;  // was 2200
```

---

## 5. 🔊 Waveform Sphere
**File:** [`waveform-sphere.tsx`](file:///d:/Development/Hackathon%20Projects/AI-Meeting-Autopsy/src/components/common/waveform-sphere.tsx)

| Parameter | Line | Default | What it does |
|---|---|---|---|
| `camera.position.z` | ~109 | `7.2` | Zoom — lower = bigger sphere |
| `camera.fov` | ~108 | `44` | Field of view |
| `RADIUS` | ~11 | `1.85` | Base sphere radius |
| `N` | ~10 | `4200` | Surface point count (density) |
| Wave amplitudes `w1–w4` | ~297–300 | `0.52, 0.32...` | How much the surface undulates |
| `disp * 0.165` | ~301 | `0.165` | Overall displacement strength |
| `coreGlow.scale` | ~142 | `3.0` | Central glow blob size |
| `onResize` ref sizes | ~383 | `w/500, h/560` | **Scale reference** |

```ts
// Bigger sphere:
camera.position.set(0, 0, 5.8);  // was 7.2
const RADIUS = 2.2;               // was 1.85

// More dramatic waves:
const w1 = 0.80 * Math.sin(...);  // was 0.52
const disp = (w1 + w2 + w3 + w4) * 0.22;  // was 0.165
```

---

## 📐 The Universal Resize Trick

Every component has an `onResize` function. **This is the single easiest knob:**

```ts
// ORIGINAL (in every component):
root.scale.setScalar(Math.max(0.58, Math.min(1, Math.min(w / 500, h / 560))));
//                              ↑ min scale              ↑ ref W   ↑ ref H

// BIGGER scene → lower ref sizes:
root.scale.setScalar(Math.max(0.58, Math.min(1, Math.min(w / 350, h / 380))));

// SMALLER scene → higher ref sizes:
root.scale.setScalar(Math.max(0.58, Math.min(1, Math.min(w / 700, h / 780))));

// ALWAYS fill (no scaling):
root.scale.setScalar(1.0);

// Raise the min clamp to ensure it's never too tiny:
root.scale.setScalar(Math.max(0.80, Math.min(1, Math.min(w / 500, h / 560))));
//                              ↑ was 0.58 → now guaranteed at least 80% size
```

---

## 🎨 Colors (same pattern in all components)

```ts
// Primary color (purple/brand):
color: new THREE.Color("#8b5cf6")   // change hex → changes glow color

// Accent color (cyan):
color: new THREE.Color("#22d3ee")   // scan arcs, equatorial rings

// Per-component — look for these strings and swap hex values:
"#8b5cf6"  // violet/brand
"#22d3ee"  // cyan/accent  
"#3d8bff"  // blue
"#10b981"  // green/success
"#f5b94b"  // gold/warning
"#f87171"  // red/danger
```

---

## ⚡ Speed / Animation

```ts
// All components — look for these patterns:
root.rotation.y = elapsed * 0.20   // 0.20 = speed multiplier → raise for faster spin
scanGroup.rotation.y = elapsed * 1.5   // scan arc independent spin speed
elapsed * 2.2  // breathing pulse frequency — lower = slower pulse
```

---

## 📦 Where Components Are Used

| Component | Dashboard section | Standalone page |
|---|---|---|
| `DashboardGlobeVisual` | Hero section | — |
| `AutopsyScanVisual` | Analytics section | `/topics-timeline` (Analytics nav) |
| `NeuralWebVisual` | Key Highlights section | `/speakers` (Insights nav) |
| `ParticleVortexVisual` | Bottom/Reports section | `/reports` |
| `WaveformSphereVisual` | — (available) | — |
