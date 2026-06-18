/* ═══════════════════════════════════════════════════════════════
   Three.js Mountain Scene
   – Procedural terrain via fBm noise
   – CatmullRom camera path driven by GSAP ScrollTrigger
   – Snow particles + star field + aurora lighting
═══════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { milestones } from './data.js';

gsap.registerPlugin(ScrollTrigger);

/* ── Module-level refs ── */
let renderer, scene, camera;
let snowParticles, animId;
let currentLookAt = new THREE.Vector3(0, 20, 0);
let milestoneBeacons = [];
let ambientLight, sunLight, peakLight, frostLight, baseLight;
let scrollProgress = 0;

/* ────────────────────────────────────────────────
   fBm (Fractal Brownian Motion) noise — no deps
──────────────────────────────────────────────── */
function hash(n) {
  return Math.abs(Math.sin(n) * 43758.5453123) % 1;
}
function smoothNoise(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uz = fz * fz * (3 - 2 * fz);
  const a = hash(ix + iz * 57);
  const b = hash(ix + 1 + iz * 57);
  const c = hash(ix + (iz + 1) * 57);
  const d = hash(ix + 1 + (iz + 1) * 57);
  return a + (b - a) * ux + (c - a) * uz + (d - a) * ux * uz - 0.5;
}
function fBm(x, z, octaves = 6) {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    v += smoothNoise(x * freq, z * freq) * amp;
    max += amp; amp *= 0.48; freq *= 2.1;
  }
  return v / max;
}

/* ────────────────────────────────────────────────
   Mountain Terrain
──────────────────────────────────────────────── */
function buildTerrain() {
  const SIZE = 220, SEGS = 160;
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGS, SEGS);
  geo.rotateX(-Math.PI / 2);

  const pos    = geo.attributes.position.array;
  const colors = [];
  const col    = new THREE.Color();

  for (let i = 0; i < pos.length; i += 3) {
    const wx = pos[i] / 22;
    const wz = pos[i + 2] / 22;

    // Radial mountain bias — tallest at centre
    const dist = Math.sqrt(wx * wx + wz * wz);
    const radial = Math.max(0, 1 - dist * 0.09) ** 2.2;

    const n = fBm(wx * 0.9, wz * 0.9, 7);
    const h = radial * 52 + n * 18 + fBm(wx * 3, wz * 3, 3) * 4;

    pos[i + 1] = Math.max(h, -1.5);
    const elevation = pos[i + 1];

    // Vertex colours — Arctic Frost ice palette
    if (elevation > 44)       col.setHSL(0.59, 0.10, 0.96);   // bright snow white-blue
    else if (elevation > 30)  col.setHSL(0.60, 0.12, 0.58);   // ice shelf blue-grey
    else if (elevation > 16)  col.setHSL(0.60, 0.15, 0.32);   // cold dark rock
    else if (elevation > 5)   col.setHSL(0.62, 0.18, 0.18);   // frozen base
    else if (elevation > 0)   col.setHSL(0.63, 0.20, 0.10);   // dark valley ice
    else                       col.setHSL(0.63, 0.25, 0.06);   // deep crevasse

    colors.push(col.r, col.g, col.b);
  }

  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshLambertMaterial({
    vertexColors: true,
  });

  return new THREE.Mesh(geo, mat);
}

/* ────────────────────────────────────────────────
   Snow Particles
──────────────────────────────────────────────── */
function buildSnow(count = 2200) {
  const pos    = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const offsets= new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i*3]     = (Math.random() - 0.5) * 200;
    pos[i*3 + 1] = Math.random() * 90 - 5;
    pos[i*3 + 2] = (Math.random() - 0.5) * 200;
    speeds[i]    = 0.012 + Math.random() * 0.025;
    offsets[i]   = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.userData.speeds  = speeds;
  geo.userData.offsets = offsets;

  const mat = new THREE.PointsMaterial({
    color: 0xeef6ff, size: 0.4, transparent: true, opacity: 0.85, sizeAttenuation: true,
  });

  return new THREE.Points(geo, mat);
}

/* ────────────────────────────────────────────────
   Star Field
──────────────────────────────────────────────── */
function buildStars(count = 3500) {
  const pos = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 380 + Math.random() * 120;
    pos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: 0xddeeff, size: 0.42, transparent: true, opacity: 0.85 });
  return new THREE.Points(geo, mat);
}

/* ────────────────────────────────────────────────
   Milestone Beacons
──────────────────────────────────────────────── */
function buildMilestoneBeacons() {
  const group = new THREE.Group();
  milestoneBeacons = []; // reset

  // Timeline markers coordinates match data.js position attributes
  const targetTValues = [0.22, 0.35, 0.48, 0.60, 0.72, 0.85];

  // Progressive platform sizes representing growth (Radius, Height)
  const platformSizes = [
    { r: 1.5, h: 0.3 }, // 2022 (Beginner)
    { r: 2.5, h: 0.4 }, // 2023 (Intermediate)
    { r: 3.4, h: 0.5 }, // 2024 (Advanced)
    { r: 4.8, h: 0.6 }, // 2025 (MERN Development)
    { r: 5.6, h: 0.7 }, // 2025 (SDE Internship)
    { r: 6.8, h: 0.9 }  // 2026 (Mastery & Summit)
  ];

  milestones.forEach((m, idx) => {
    const p = m.pos;
    if (!p) return;

    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(p.x, p.y, p.z);

    // Glowing core sphere
    const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.9 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    beaconGroup.add(sphere);

    // Pulsing outer ring
    const ringGeo = new THREE.TorusGeometry(1.0, 0.08, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    beaconGroup.add(ring);

    // 3D Stone Platform - Tapered cylinder, larger platforms at higher altitudes
    const size = platformSizes[idx] || { r: 1.5, h: 0.3 };
    const platformGeo = new THREE.CylinderGeometry(size.r, size.r + 0.4, size.h, 18);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x141e2d,
      roughness: 0.85,
      metalness: 0.25
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -size.h / 2 - 0.2;
    beaconGroup.add(platform);

    // Light line extending down to ground (anchor line)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -18, 0)
    ]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x4db8ff, transparent: true, opacity: 0.35 });
    const line = new THREE.Line(lineGeo, lineMat);
    beaconGroup.add(line);

    group.add(beaconGroup);
    milestoneBeacons.push({
      group: beaconGroup,
      ring,
      sphere,
      targetT: targetTValues[idx] || 0.5,
      pos: new THREE.Vector3(p.x, p.y, p.z)
    });
  });

  return group;
}

/* ────────────────────────────────────────────────
   Camera Path Waypoints
   (valley base → summit, each scene = one step)
──────────────────────────────────────────────── */
const CAM_PATH = [
  new THREE.Vector3(65, 18, 65),   // Scene 1 – Arrival   (wide valley view)
  new THREE.Vector3(35, 28, 52),   // Scene 2 – Discovery
  new THREE.Vector3(18, 38, 36),   // Scene 3 – Journey
  new THREE.Vector3(6,  48, 22),   // Scene 4 – Projects
  new THREE.Vector3(0,  64, 6),    // Scene 5 – Summit
];
const LOOK_PATH = [
  new THREE.Vector3(0, 12, 0),
  new THREE.Vector3(0, 18, 0),
  new THREE.Vector3(0, 24, 0),
  new THREE.Vector3(0, 30, 0),
  new THREE.Vector3(0, 42, 0),
];

/* ────────────────────────────────────────────────
   PUBLIC — initScene
──────────────────────────────────────────────── */
export function initScene(canvas) {
  /* Renderer */
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.toneMapping       = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  /* Scene — foggy early morning basecamp */
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080a10);
  scene.fog = new THREE.FogExp2(0x080a10, 0.020); // High fog density at start

  /* Camera */
  camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 900);
  camera.position.copy(CAM_PATH[0]);
  camera.lookAt(LOOK_PATH[0]);

  /* Lighting — Arctic */
  ambientLight = new THREE.AmbientLight(0x0a1220, 1.2);       // dim cool twilight ambient
  scene.add(ambientLight);

  sunLight = new THREE.DirectionalLight(0x9ab7d3, 0.8);   // dim morning sun
  sunLight.position.set(60, 90, 40);
  scene.add(sunLight);

  // Primary peak light
  peakLight = new THREE.PointLight(0x4db8ff, 6, 120);
  peakLight.position.set(0, 80, 0);
  scene.add(peakLight);

  // Secondary silver-white frost light
  frostLight = new THREE.PointLight(0xd0eaff, 3, 100);
  frostLight.position.set(-35, 55, -20);
  scene.add(frostLight);

  // Subtle cool base fill
  baseLight = new THREE.PointLight(0x102840, 2.5, 80);
  baseLight.position.set(40, 5, 40);
  scene.add(baseLight);

  /* Objects */
  scene.add(buildStars());
  scene.add(buildTerrain());
  scene.add(buildMilestoneBeacons());
  snowParticles = buildSnow();
  scene.add(snowParticles);

  /* Resize */
  window.addEventListener('resize', onResize);

  /* Scroll-driven camera */
  setupScrollCamera();

  /* Loop */
  animate();
}

/* ────────────────────────────────────────────────
   Scroll Camera
──────────────────────────────────────────────── */
function setupScrollCamera() {
  const camCurve  = new THREE.CatmullRomCurve3(CAM_PATH,  false, 'catmullrom', 0.5);
  const lookCurve = new THREE.CatmullRomCurve3(LOOK_PATH, false, 'catmullrom', 0.5);

  ScrollTrigger.create({
    trigger:  '#scroll-container',
    start:    'top top',
    end:      'bottom bottom',
    onUpdate: (self) => {
      const t = self.progress;
      scrollProgress = t;

      /* Evolve environment lighting & fog based on scroll progress t */
      let fogD, fogCol, bgCol, ambCol, ambInt, sunCol, sunInt, peakCol;

      const cBaseFog = new THREE.Color(0x080a10);
      const cBaseBg  = new THREE.Color(0x080a10);
      const cBaseAmb = new THREE.Color(0x0a1220);
      const cBaseSun = new THREE.Color(0x9ab7d3);
      const cBasePeak = new THREE.Color(0x4db8ff);

      const cMidFog = new THREE.Color(0x0a1828);
      const cMidBg  = new THREE.Color(0x0a1828);
      const cMidAmb = new THREE.Color(0x1a2d45);
      const cMidSun = new THREE.Color(0xd5eaff);
      const cMidPeak = new THREE.Color(0x4db8ff);

      const cSummitFog = new THREE.Color(0x180b06);
      const cSummitBg  = new THREE.Color(0x180b06);
      const cSummitAmb = new THREE.Color(0x2c160b);
      const cSummitSun = new THREE.Color(0xffa844);
      const cSummitPeak = new THREE.Color(0xffaa44);

      if (t < 0.5) {
        const factor = t / 0.5;
        fogD   = THREE.MathUtils.lerp(0.020, 0.003, factor);
        fogCol = new THREE.Color().copy(cBaseFog).lerp(cMidFog, factor);
        bgCol  = new THREE.Color().copy(cBaseBg).lerp(cMidBg, factor);
        ambCol = new THREE.Color().copy(cBaseAmb).lerp(cMidAmb, factor);
        ambInt = THREE.MathUtils.lerp(1.2, 2.6, factor);
        sunCol = new THREE.Color().copy(cBaseSun).lerp(cMidSun, factor);
        sunInt = THREE.MathUtils.lerp(0.8, 3.0, factor);
        peakCol = new THREE.Color().copy(cBasePeak).lerp(cMidPeak, factor);
      } else {
        const factor = (t - 0.5) / 0.5;
        fogD   = THREE.MathUtils.lerp(0.003, 0.007, factor);
        fogCol = new THREE.Color().copy(cMidFog).lerp(cSummitFog, factor);
        bgCol  = new THREE.Color().copy(cMidBg).lerp(cSummitBg, factor);
        ambCol = new THREE.Color().copy(cMidAmb).lerp(cSummitAmb, factor);
        ambInt = THREE.MathUtils.lerp(2.6, 3.0, factor);
        sunCol = new THREE.Color().copy(cMidSun).lerp(cSummitSun, factor);
        sunInt = THREE.MathUtils.lerp(3.0, 4.2, factor);
        peakCol = new THREE.Color().copy(cMidPeak).lerp(cSummitPeak, factor);
      }

      /* Apply transitions */
      if (scene && renderer) {
        scene.fog.color.copy(fogCol);
        scene.fog.density = fogD;
        scene.background.copy(bgCol);
        
        if (ambientLight) {
          ambientLight.color.copy(ambCol);
          ambientLight.intensity = ambInt;
        }
        if (sunLight) {
          sunLight.color.copy(sunCol);
          sunLight.intensity = sunInt;
        }
        if (peakLight) {
          peakLight.color.copy(peakCol);
        }
      }

      /* Camera position */
      const tPos = camCurve.getPoint(Math.min(t, 0.999));
      gsap.to(camera.position, {
        x: tPos.x, y: tPos.y, z: tPos.z,
        duration: 1.4, ease: 'power2.out', overwrite: 'auto',
      });

      /* Look-at target */
      const tLook = lookCurve.getPoint(Math.min(t, 0.999));
      
      // Look for the closest milestone beacon to shift camera focus briefly
      let activeBeaconPos = null;
      let maxWeight = 0;
      milestoneBeacons.forEach(b => {
        const dist = Math.abs(t - b.targetT);
        if (dist < 0.06) {
          const w = 1 - (dist / 0.06);
          if (w > maxWeight) {
            maxWeight = w;
            activeBeaconPos = b.pos;
          }
        }
      });

      const finalLook = new THREE.Vector3().copy(tLook);
      if (activeBeaconPos && maxWeight > 0) {
        // smoothstep/sine ease for focus transition
        const easeW = gsap.utils.sineInOut(maxWeight);
        finalLook.lerp(activeBeaconPos, easeW * 0.75); // Blend up to 75% gaze focus
      }

      gsap.to(currentLookAt, {
        x: finalLook.x, y: finalLook.y, z: finalLook.z,
        duration: 1.2, ease: 'power2.out', overwrite: 'auto',
      });

      /* Elevation meter */
      const elevFill = document.getElementById('elevation-fill');
      const elevText = document.getElementById('elevation-value');
      const pBar     = document.getElementById('scroll-progress-fill');
      if (elevFill) elevFill.style.height = `${t * 100}%`;
      if (elevText) elevText.textContent  = `${Math.round(t * 8848).toLocaleString()}m`;
      if (pBar)     pBar.style.width      = `${t * 100}%`;

      /* Nav dots */
      const idx = Math.min(Math.floor(t * 5), 4);
      document.querySelectorAll('.nav-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
      });
      
      // Dispatch scroll event for HUD triggers in main.js
      window.dispatchEvent(new CustomEvent('portfolio-scroll', { detail: { t } }));
    },
  });
}

/* ────────────────────────────────────────────────
   Animation Loop
──────────────────────────────────────────────── */
let frameCount = 0;
function animate() {
  animId = requestAnimationFrame(animate);
  frameCount++;

  const t   = performance.now() * 0.001;

  /* Snow — update every other frame for perf */
  if (snowParticles && frameCount % 2 === 0) {
    const pos     = snowParticles.geometry.attributes.position.array;
    const speeds  = snowParticles.geometry.userData.speeds;
    const offsets = snowParticles.geometry.userData.offsets;
    for (let i = 0; i < pos.length; i += 3) {
      const idx = i / 3;
      pos[i]     += Math.sin(t * 0.5 + offsets[idx]) * 0.015;
      pos[i + 1] -= speeds[idx];
      if (pos[i + 1] < -8) pos[i + 1] = 80;
    }
    snowParticles.geometry.attributes.position.needsUpdate = true;
  }

  /* Pulse milestone beacons */
  if (milestoneBeacons && milestoneBeacons.length > 0) {
    milestoneBeacons.forEach((b, idx) => {
      const pulse = Math.sin(t * 3.5 + idx * 1.5) * 0.22 + 1.0;
      b.ring.scale.set(pulse, pulse, pulse);
      b.ring.material.opacity = Math.max(0.1, (0.6 - (pulse - 0.78)) * 0.85);
      
      const bounce = Math.sin(t * 5 + idx * 2) * 0.08 + 0.95;
      b.sphere.scale.set(bounce, bounce, bounce);
    });
  }

  /* Camera look-at with cinematic horizontal sway */
  const swayX = Math.sin(t * 0.45) * (0.6 + scrollProgress * 1.6);
  const swayY = Math.cos(t * 0.3) * (0.3 + scrollProgress * 0.9);
  const cinematicLookAt = new THREE.Vector3()
    .copy(currentLookAt)
    .add(new THREE.Vector3(swayX, swayY, 0));

  camera.lookAt(cinematicLookAt);

  renderer.render(scene, camera);
}

/* ────────────────────────────────────────────────
   Resize
──────────────────────────────────────────────── */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  ScrollTrigger.refresh();
}

/* ────────────────────────────────────────────────
   Cleanup (optional)
──────────────────────────────────────────────── */
export function destroyScene() {
  cancelAnimationFrame(animId);
  window.removeEventListener('resize', onResize);
  renderer.dispose();
}
