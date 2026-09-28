import * as THREE from "three";
import type { TextureKit } from "./textures";
import type { Quality } from "./quality";

type Burst = {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  t: number;
  spin: number;
  drag?: number;
};
type Shaft = { mesh: THREE.Mesh; light: THREE.PointLight | null; t: number; max: number; spin: number };
type Pulse = { mesh: THREE.Mesh; t: number; max: number; grow: number; fade?: number };
type Mote = { mesh: THREE.Mesh; x: number; y: number; z: number; vy: number; t: number };
type AimKind = "circle" | "cone" | "line";

const chunkGeo = new THREE.BoxGeometry(0.14, 0.1, 0.12);
const sparkGeo = new THREE.SphereGeometry(0.07, 6, 6);
const ringGeo = new THREE.TorusGeometry(1, 0.055, 6, 28);
const shaftGeo = new THREE.CylinderGeometry(0.16, 0.48, 3.8, 10, 1, true);
const coneGeo = new THREE.ConeGeometry(0.55, 2.6, 8, 1, true);
const wispGeo = new THREE.SphereGeometry(0.09, 6, 6);
const slashGeo = new THREE.TorusGeometry(0.78, 0.055, 5, 14, Math.PI * 1.15);
const slashWideGeo = new THREE.TorusGeometry(1.05, 0.07, 5, 18, Math.PI * 1.25);
const scuffGeo = new THREE.CircleGeometry(0.55, 12);
const decalGeo = new THREE.CircleGeometry(1, 16);
const warnRingGeo = new THREE.RingGeometry(0.82, 1, 40);
const aimCircleGeo = new THREE.RingGeometry(0.72, 1, 48);
const aimFillGeo = new THREE.CircleGeometry(1, 40);
const streakGeo = new THREE.PlaneGeometry(0.12, 0.55);

export class VfxWorld {
  group = new THREE.Group();
  kit: TextureKit;
  quality: Quality;
  bursts: Burst[] = [];
  shafts: Shaft[] = [];
  pulses: Pulse[] = [];
  motes: Mote[] = [];
  pool: THREE.Mesh[] = [];
  add: THREE.MeshBasicMaterial;
  ember: THREE.MeshStandardMaterial;
  gold: THREE.MeshBasicMaterial;
  blood: THREE.MeshBasicMaterial;
  dust: THREE.MeshStandardMaterial;
  spark: THREE.MeshBasicMaterial;
  ice: THREE.MeshBasicMaterial;
  arcane: THREE.MeshBasicMaterial;
  holy: THREE.MeshBasicMaterial;
  lightBudget = 0;
  private scene: THREE.Scene;
  private maxLights: number;
  private aimGroup = new THREE.Group();
  private aimFill: THREE.Mesh | null = null;
  private aimEdge: THREE.Mesh | null = null;
  private aimKind: AimKind | "" = "";
  private lockMesh: THREE.Mesh | null = null;
  private lockPulse = 0;
  private warn: { mesh: THREE.Mesh; t: number; pulse?: boolean }[] = [];
  crowdMul = 1;
  private maxBursts = 160;

  constructor(scene: THREE.Scene, kit: TextureKit, quality: Quality) {
    this.scene = scene;
    this.kit = kit;
    this.quality = quality;
    this.maxLights = quality.maxLights;
    this.maxBursts = quality.low ? 70 : 160;
    scene.add(this.group);
    this.add = new THREE.MeshBasicMaterial({
      color: 0xffaa55,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.ember = kit.mats.ember!;
    this.gold = new THREE.MeshBasicMaterial({
      color: 0xffcc66,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.blood = new THREE.MeshBasicMaterial({ color: 0x991111, transparent: true, opacity: 0.9, depthWrite: false });
    this.dust = new THREE.MeshStandardMaterial({ color: 0x6a5a48, roughness: 0.95, transparent: true, opacity: 0.85 });
    this.spark = new THREE.MeshBasicMaterial({
      color: 0xffe8a0,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.ice = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.arcane = new THREE.MeshBasicMaterial({
      color: 0xaa66ff,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.holy = new THREE.MeshBasicMaterial({
      color: 0xffe8aa,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.group.add(this.aimGroup);
    this.aimGroup.visible = false;
  }

  setCrowd(mul: number) {
    this.crowdMul = mul;
  }

  clear() {
    for (const b of this.bursts) this.recycle(b.mesh);
    for (const s of this.shafts) {
      this.group.remove(s.mesh);
      if (s.light) this.scene.remove(s.light);
    }
    for (const p of this.pulses) this.group.remove(p.mesh);
    for (const m of this.motes) this.recycle(m.mesh);
    this.bursts = [];
    this.shafts = [];
    this.pulses = [];
    this.motes = [];
    this.lightBudget = 0;
    this.clearAim();
    for (const w of this.warn) this.group.remove(w.mesh);
    this.warn = [];
  }

  private take(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh {
    const m = this.pool.pop() ?? new THREE.Mesh(geo, mat);
    m.geometry = geo;
    m.material = mat;
    m.visible = true;
    m.scale.set(1, 1, 1);
    m.rotation.set(0, 0, 0);
    this.group.add(m);
    return m;
  }

  private recycle(m: THREE.Mesh) {
    this.group.remove(m);
    if (this.pool.length < 120) this.pool.push(m);
  }

  private trimBursts() {
    while (this.bursts.length > this.maxBursts) {
      const b = this.bursts.shift();
      if (b) this.recycle(b.mesh);
    }
  }

  private tinted(base: THREE.MeshBasicMaterial, color: number, opacity = 0.7): THREE.MeshBasicMaterial {
    const m = base.clone();
    m.color.setHex(color);
    m.opacity = opacity;
    return m;
  }

  burst(x: number, y: number, z: number, color: number, n: number, mode: "blood" | "ember" | "chunk" | "soul" | "spark" = "blood") {
    const count = Math.max(3, Math.round(n * this.quality.particles * this.crowdMul));
    for (let i = 0; i < count; i++) {
      let mat: THREE.Material =
        mode === "ember"
          ? this.ember
          : mode === "soul"
            ? this.gold
            : mode === "chunk"
              ? this.dust
              : mode === "spark"
                ? this.spark
                : this.blood;
      if (mode === "spark" || mode === "soul") {
        mat = this.tinted(mode === "spark" ? this.spark : this.gold, color, mode === "spark" ? 0.95 : 0.7);
      } else if (mode === "blood" && color !== 0x991111) {
        mat = this.tinted(this.blood, color, 0.9);
      }
      const geo = mode === "chunk" ? chunkGeo : mode === "soul" ? wispGeo : mode === "spark" ? streakGeo : sparkGeo;
      const mesh = this.take(geo, mat);
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(mode === "spark" ? 0.7 + Math.random() * 1.1 : 0.55 + Math.random() * 1.5);
      if (mode === "spark") {
        mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      }
      const speed = mode === "soul" ? 1.1 : mode === "spark" ? 7.5 : 5.8;
      this.bursts.push({
        mesh,
        vx: (Math.random() - 0.5) * speed,
        vy: (mode === "soul" ? 1.9 : mode === "spark" ? 1.2 : 2.4) + Math.random() * (mode === "soul" ? 2.2 : mode === "spark" ? 4.2 : 5.2),
        vz: (Math.random() - 0.5) * speed,
        t: mode === "chunk" ? 0.95 : mode === "spark" ? 0.18 + Math.random() * 0.16 : 0.32 + Math.random() * 0.32,
        spin: (Math.random() - 0.5) * (mode === "spark" ? 14 : 9),
        drag: mode === "spark" ? 3.2 : 0,
      });
    }
    this.trimBursts();
  }

  ring(x: number, z: number, color: number, grow = 6, life = 0.38) {
    const mat = this.add.clone();
    mat.color.setHex(color);
    const mesh = new THREE.Mesh(ringGeo, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, 0.07, z);
    mesh.scale.setScalar(0.28);
    this.group.add(mesh);
    this.pulses.push({ mesh, t: life, max: life, grow });
  }

  decal(x: number, z: number, color: number, scale = 1.2, life = 1.1, opacity = 0.42) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(decalGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.035, z);
    mesh.scale.setScalar(scale * 0.55);
    this.group.add(mesh);
    this.pulses.push({ mesh, t: life, max: life, grow: scale * 0.35, fade: opacity });
  }

  /** Hit-point impact: blood spray + bright sparks + tiny ring. */
  impact(x: number, y: number, z: number, opts?: { crit?: boolean; heavy?: boolean; color?: number }) {
    const crit = !!opts?.crit;
    const heavy = !!opts?.heavy || crit;
    const bloodCol = opts?.color ?? 0xaa1515;
    this.burst(x, y, z, bloodCol, crit ? 14 : heavy ? 10 : 6, "blood");
    this.burst(x, y + 0.05, z, crit ? 0xffe066 : 0xffe8a0, crit ? 12 : heavy ? 8 : 5, "spark");
    if (crit) {
      this.burst(x, y + 0.1, z, 0xffcc55, 8, "ember");
      this.burst(x, y + 0.15, z, 0xffe8aa, 6, "soul");
      this.ring(x, z, 0xffd24a, 4.2, 0.22);
      this.flash(x, z, 0xffe066, 2.6, 0.11);
    } else {
      this.ring(x, z, 0xff8866, heavy ? 2.4 : 1.7, heavy ? 0.14 : 0.1);
      this.flash(x, z, 0xffaa88, heavy ? 1.9 : 1.35, heavy ? 0.08 : 0.055);
    }
    if (heavy) this.decal(x, z, 0x3a1010, crit ? 1.4 : 0.95, crit ? 1.35 : 0.85, 0.38);
  }

  critHit(x: number, z: number) {
    this.impact(x, 0.95, z, { crit: true });
    this.ring(x, z, 0xfff2c8, 4.0, 0.2);
  }

  shock(x: number, z: number, color = 0xffaa44) {
    this.ring(x, z, color, 6.2, 0.32);
    this.ring(x, z, 0xfff2c8, 4.0, 0.18);
    this.ring(x, z, color, 2.8, 0.12);
    this.burst(x, 0.4, z, color, 12, "chunk");
    this.burst(x, 0.55, z, color, 10, "ember");
    this.burst(x, 0.7, z, 0xffe8a0, 7, "spark");
    this.flash(x, z, color, 2.6, 0.14);
    this.decal(x, z, 0x2a1810, 1.6, 1.0, 0.42);
    const scuff = new THREE.MeshBasicMaterial({ color: 0x2a1810, transparent: true, opacity: 0.55, depthWrite: false });
    const mesh = new THREE.Mesh(scuffGeo, scuff);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.04, z);
    this.group.add(mesh);
    this.pulses.push({ mesh, t: 1.15, max: 1.15, grow: 2.2 });
  }

  nova(x: number, z: number, color = 0xff6622) {
    this.shock(x, z, color);
    this.ring(x, z, color, 14, 0.55);
    this.burst(x, 0.9, z, color, 20, "ember");
    this.burst(x, 1.1, z, 0xffe8aa, 12, "soul");
    this.flash(x, z, color, 5.5, 0.26);
  }

  whirl(x: number, z: number) {
    // Dust spin only — no additive white/gold wash over Tear combat
    this.ring(x, z, 0x5a2818, 1.6, 0.1);
    this.burst(x, 0.28, z, 0x4a3020, 3, "chunk");
  }

  leap(x: number, z: number) {
    this.ring(x, z, 0xc4a35a, 6.4, 0.38);
    this.ring(x, z, 0xffe8c0, 3.8, 0.2);
    this.burst(x, 0.2, z, 0x8a6a40, 14, "chunk");
    this.burst(x, 0.45, z, 0xffe8a0, 8, "spark");
    this.flash(x, z, 0xffd8a0, 2.8, 0.14);
    this.decal(x, z, 0x3a2818, 1.8, 1.1, 0.4);
  }

  slash(x: number, z: number, facing: number, opts?: { color?: number; heavy?: boolean }) {
    const color = opts?.color ?? 0xffe4b0;
    const heavy = !!opts?.heavy;
    const mat = this.add.clone();
    mat.color.setHex(color);
    mat.opacity = 0.62;
    const mesh = new THREE.Mesh(heavy ? slashWideGeo : slashGeo, mat);
    const fwd = 0.42;
    mesh.position.set(x + Math.sin(facing) * fwd, 0.95, z + Math.cos(facing) * fwd);
    mesh.rotation.set(0.35, facing, 0.95);
    this.group.add(mesh);
    this.pulses.push({ mesh, t: heavy ? 0.24 : 0.2, max: heavy ? 0.24 : 0.2, grow: heavy ? 4.2 : 3.4 });

    // Secondary ghost arc for readability
    const mat2 = this.add.clone();
    mat2.color.setHex(0xe8c090);
    mat2.opacity = 0.22;
    const ghost = new THREE.Mesh(slashGeo, mat2);
    ghost.position.set(x + Math.sin(facing) * 0.28, 1.05, z + Math.cos(facing) * 0.28);
    ghost.rotation.set(0.5, facing + 0.15, 1.05);
    this.group.add(ghost);
    this.pulses.push({ mesh: ghost, t: 0.14, max: 0.14, grow: 2.6 });

    this.burst(x, 0.85, z, color, heavy ? 12 : 8, "ember");
    this.burst(x, 0.9, z, 0xfff2d0, heavy ? 8 : 5, "spark");
    this.flash(x, z, color, heavy ? 1.6 : 1.2, heavy ? 0.07 : 0.05);
  }

  beam(x: number, z: number, ux: number, uz: number, range: number, color = 0xaaccff) {
    const steps = Math.max(4, Math.round(range * 1.6 * this.quality.particles));
    for (let i = 0; i < steps; i++) {
      const t = (i + 0.5) / steps;
      const px = x + ux * range * t;
      const pz = z + uz * range * t;
      this.burst(px, 0.85 + Math.sin(i) * 0.1, pz, color, 2, "spark");
      if (i % 2 === 0) this.burst(px, 1.0, pz, color, 1, "soul");
    }
    this.ring(x + ux * range * 0.5, z + uz * range * 0.5, color, 3.2, 0.2);
    this.flash(x + ux * range * 0.55, z + uz * range * 0.55, color, 3.5, 0.14);
    this.decal(x + ux * range * 0.5, z + uz * range * 0.5, color, 0.8, 0.55, 0.22);
  }

  trail(x: number, y: number, z: number, color = 0xffcc88) {
    if (this.bursts.length > this.maxBursts * 0.85) return;
    this.burst(x, y, z, color, 2, "spark");
  }

  /** Running scuffs — DI ground chatter under the boots. */
  footDust(x: number, z: number, speed = 3) {
    const n = speed > 4.5 ? 5 : 3;
    this.burst(x, 0.08, z, 0x6a5a48, n, "chunk");
    if (speed > 3.5) this.decal(x, z, 0x3a2a1c, 0.55 + speed * 0.04, 0.45, 0.22);
  }


  death(x: number, z: number, elite: boolean, boss: boolean) {
    const n = boss ? 1.7 : elite ? 1.35 : 1;
    this.burst(x, 0.8, z, 0x771111, Math.round((elite || boss ? 28 : 16) * n), "blood");
    this.burst(x, 0.9, z, 0x442211, Math.round((elite || boss ? 22 : 10) * n), "chunk");
    this.burst(x, 1.15, z, 0xffcc88, Math.round((elite || boss ? 20 : 8) * n), "soul");
    this.burst(x, 1.0, z, 0xffe8a0, Math.round((elite || boss ? 16 : 6) * n), "spark");
    this.ring(x, z, elite || boss ? 0xff6633 : 0x991111, elite || boss ? 8 : 4.5, elite || boss ? 0.42 : 0.28);
    if (elite || boss) {
      this.ring(x, z, boss ? 0xff2200 : 0xff8844, 12, 0.55);
      this.flash(x, z, boss ? 0xff2200 : 0xff6633, boss ? 8 : 5.2, 0.32);
      this.decal(x, z, boss ? 0x4a0808 : 0x3a1010, boss ? 3.2 : 2.2, boss ? 2.2 : 1.6, 0.55);
      this.burst(x, 1.4, z, boss ? 0xff4400 : 0xffaa44, 14, "ember");
    } else {
      this.flash(x, z, 0x771111, 2.6, 0.14);
      this.decal(x, z, 0x2a1010, 1.1, 0.9, 0.35);
    }
  }

  lootShaft(x: number, z: number, color: number, rarity: string): { mesh: THREE.Object3D; light: THREE.PointLight | null } {
    const tall = rarity === "legendary" || rarity === "set";
    const mat = this.gold.clone();
    mat.color.setHex(color);
    mat.opacity = tall ? 0.55 : rarity === "rare" ? 0.32 : 0.12;
    const mesh = new THREE.Mesh(shaftGeo, mat);
    mesh.position.set(x, tall ? 2.1 : 1.15, z);
    mesh.scale.set(tall ? 1.15 : 0.55, tall ? 1.35 : 0.65, tall ? 1.15 : 0.55);
    this.group.add(mesh);
    let light: THREE.PointLight | null = null;
    if ((tall || rarity === "rare") && this.lightBudget < this.maxLights) {
      light = new THREE.PointLight(color, tall ? 14 : 8, tall ? 10 : 7, 1.5);
      light.position.set(x, 1.65, z);
      this.scene.add(light);
      this.lightBudget++;
    }
    if (tall) {
      for (let i = 0; i < 5; i++) {
        const spark = this.take(wispGeo, this.gold);
        spark.position.set(x, 0.6 + i * 0.45, z);
        spark.scale.setScalar(0.4);
        this.motes.push({ mesh: spark, x, y: 0.6 + i * 0.45, z, vy: 0.55, t: 8 });
      }
      this.ring(x, z, color, 5, 0.6);
      this.burst(x, 1.2, z, color, 10, "soul");
    }
    this.shafts.push({ mesh, light, t: 999, max: 999, spin: tall ? 0.65 : 1.35 });
    return { mesh, light };
  }

  dropShaft(mesh: THREE.Object3D, light: THREE.PointLight | null) {
    this.shafts = this.shafts.filter((s) => {
      if (s.mesh === mesh) {
        this.group.remove(s.mesh);
        if (s.light) {
          this.scene.remove(s.light);
          this.lightBudget = Math.max(0, this.lightBudget - 1);
        }
        return false;
      }
      return true;
    });
    if (light && !this.shafts.some((s) => s.light === light)) this.scene.remove(light);
  }

  flash(x: number, z: number, color: number, dist: number, life: number) {
    if (this.lightBudget >= this.maxLights) return;
    // Soft punch — keep Tear readable (no white flood over lava)
    const l = new THREE.PointLight(color, 1.55, Math.min(dist, 1.45), 2.35);
    l.position.set(x, 1.05, z);
    this.scene.add(l);
    this.lightBudget++;
    window.setTimeout(() => {
      this.scene.remove(l);
      this.lightBudget = Math.max(0, this.lightBudget - 1);
    }, life * 1000);
  }

  shatter(x: number, z: number) {
    this.burst(x, 0.4, z, 0x6a4a28, 20, "chunk");
    this.burst(x, 0.5, z, 0xffcc88, 8, "spark");
    this.ring(x, z, 0xaa7744, 4.5, 0.28);
  }

  /** High-contrast red enemy windup ring. Stays put until life expires. */
  warnCircle(x: number, z: number, r: number, life = 0.9) {
    // Hot magenta/red threat — reads on Tear charcoal, not lava-orange
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(warnRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.09, z);
    mesh.scale.setScalar(Math.max(0.4, r));
    this.group.add(mesh);
    this.warn.push({ mesh, t: life, pulse: true });
    const fill = new THREE.MeshBasicMaterial({
      color: 0xff1166,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(aimFillGeo, fill);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(x, 0.06, z);
    disc.scale.setScalar(Math.max(0.4, r));
    this.group.add(disc);
    this.warn.push({ mesh: disc, t: life, pulse: true });
    // Outer danger halo — cool pink, never orange-on-lava
    const halo = new THREE.MeshBasicMaterial({
      color: 0xff88cc,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(warnRingGeo, halo);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.1, z);
    ring.scale.setScalar(Math.max(0.45, r * 1.08));
    this.group.add(ring);
    this.warn.push({ mesh: ring, t: life, pulse: true });
  }

  /** Melee swing telegraph cone on the ground. */
  warnCone(x: number, z: number, facing: number, range: number, half = Math.PI / 3.2, life = 0.55) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    const segs = 12;
    for (let i = 0; i <= segs; i++) {
      const a = -half + (i / segs) * half * 2;
      shape.lineTo(Math.sin(a) * range, -Math.cos(a) * range);
    }
    shape.lineTo(0, 0);
    const geo = new THREE.ShapeGeometry(shape);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff0055,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.07, z);
    mesh.rotation.z = facing;
    this.group.add(mesh);
    this.warn.push({ mesh, t: life, pulse: true });
    const tipX = x - Math.sin(facing) * range * 0.7;
    const tipZ = z - Math.cos(facing) * range * 0.7;
    this.warnCircle(tipX, tipZ, Math.max(0.55, range * 0.28), life);
  }

  /** Soft player AoE ground indicator (friendly telegraph). */
  softGround(x: number, z: number, r: number, color = 0xffe8aa, life = 0.35) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(aimFillGeo, mat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(x, 0.05, z);
    disc.scale.setScalar(Math.max(0.5, r));
    this.group.add(disc);
    this.pulses.push({ mesh: disc, t: life, max: life, grow: 0.15, fade: 0.16 });
    const edge = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(aimCircleGeo, edge);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.06, z);
    ring.scale.setScalar(Math.max(0.5, r));
    this.group.add(ring);
    this.pulses.push({ mesh: ring, t: life, max: life, grow: 0.2, fade: 0.7 });
  }

  setAim(kind: AimKind, x: number, z: number, facing: number, range: number, radius: number, charged: boolean) {
    if (this.aimKind !== kind) {
      this.clearAim();
      this.aimKind = kind;
      const fillMat = new THREE.MeshBasicMaterial({
        color: charged ? 0xffcc55 : 0xff5533,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const edgeMat = new THREE.MeshBasicMaterial({
        color: charged ? 0xffe088 : 0xff3311,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      if (kind === "circle") {
        this.aimFill = new THREE.Mesh(aimFillGeo, fillMat);
        this.aimEdge = new THREE.Mesh(aimCircleGeo, edgeMat);
        this.aimFill.rotation.x = -Math.PI / 2;
        this.aimEdge.rotation.x = -Math.PI / 2;
      } else if (kind === "cone") {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        const half = Math.PI / 4;
        const segs = 10;
        for (let i = 0; i <= segs; i++) {
          const a = -half + (i / segs) * half * 2;
          shape.lineTo(Math.sin(a) * range, -Math.cos(a) * range);
        }
        shape.lineTo(0, 0);
        const geo = new THREE.ShapeGeometry(shape);
        this.aimFill = new THREE.Mesh(geo, fillMat);
        this.aimFill.rotation.x = -Math.PI / 2;
        this.aimEdge = new THREE.Mesh(aimCircleGeo, edgeMat);
        this.aimEdge.rotation.x = -Math.PI / 2;
      } else {
        const geo = new THREE.PlaneGeometry(radius * 1.4, range);
        this.aimFill = new THREE.Mesh(geo, fillMat);
        this.aimFill.rotation.x = -Math.PI / 2;
        this.aimEdge = new THREE.Mesh(aimCircleGeo, edgeMat);
        this.aimEdge.rotation.x = -Math.PI / 2;
      }
      if (this.aimFill) this.aimGroup.add(this.aimFill);
      if (this.aimEdge) this.aimGroup.add(this.aimEdge);
    }
    this.aimGroup.visible = true;
    this.aimGroup.position.set(x, 0.07, z);
    this.aimGroup.rotation.y = facing;
    const gold = charged;
    for (const m of [this.aimFill, this.aimEdge]) {
      if (!m) continue;
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.color.setHex(gold ? (m === this.aimEdge ? 0xffe088 : 0xffcc55) : m === this.aimEdge ? 0xff3311 : 0xff5533);
      mat.opacity = gold ? (m === this.aimEdge ? 1 : 0.38) : m === this.aimEdge ? 0.92 : 0.28;
    }
    if (kind === "circle" && this.aimFill && this.aimEdge) {
      const s = Math.max(0.6, radius);
      this.aimFill.scale.setScalar(s);
      this.aimEdge.scale.setScalar(s);
    } else if (kind === "line" && this.aimFill) {
      this.aimFill.position.set(0, 0, -range * 0.5);
      if (this.aimEdge) {
        this.aimEdge.position.set(0, 0, -range);
        this.aimEdge.scale.setScalar(Math.max(0.35, radius));
      }
    } else if (kind === "cone" && this.aimEdge) {
      this.aimEdge.position.set(0, 0, -range);
      this.aimEdge.scale.setScalar(Math.max(0.4, radius * 0.55));
    }
  }

  /** DI soft-lock ring under the current hostile. */
  setSoftLock(x: number, z: number, on: boolean) {
    if (!on) {
      if (this.lockMesh) this.lockMesh.visible = false;
      return;
    }
    if (!this.lockMesh) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffcc55,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      this.lockMesh = new THREE.Mesh(aimCircleGeo, mat);
      this.lockMesh.rotation.x = -Math.PI / 2;
      this.group.add(this.lockMesh);
    }
    this.lockMesh.visible = true;
    this.lockMesh.position.set(x, 0.08, z);
    const s = 0.72 + Math.sin(this.lockPulse * 6.5) * 0.06;
    this.lockMesh.scale.setScalar(s);
    const mat = this.lockMesh.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.55 + Math.sin(this.lockPulse * 8) * 0.25;
  }

  clearAim() {
    while (this.aimGroup.children.length) this.aimGroup.remove(this.aimGroup.children[0]!);
    this.aimFill = null;
    this.aimEdge = null;
    this.aimKind = "";
    this.aimGroup.visible = false;
  }

  seedMotes(biome: string, cx: number, cz: number) {
    const n = Math.round((biome === "hell" || biome === "rift" ? 34 : 22) * this.quality.particles);
    const col = biome === "ice" ? 0xaaccee : biome === "hell" || biome === "rift" ? 0xff6622 : 0xc4a070;
    const mat = this.add.clone();
    mat.color.setHex(col);
    mat.opacity = 0.32;
    for (let i = 0; i < n; i++) {
      const mesh = this.take(wispGeo, mat);
      const x = cx + (Math.random() - 0.5) * 28;
      const z = cz + (Math.random() - 0.5) * 28;
      const y = 0.35 + Math.random() * 3.4;
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(0.32 + Math.random() * 0.55);
      this.motes.push({ mesh, x, y, z, vy: 0.12 + Math.random() * 0.42, t: 4 + Math.random() * 6 });
    }
  }

  windowShaft(x: number, y: number, z: number, rotY: number) {
    const mat = this.gold.clone();
    mat.color.setHex(0xffd8a0);
    mat.opacity = 0.11;
    const mesh = new THREE.Mesh(coneGeo, mat);
    mesh.position.set(x, y, z);
    mesh.rotation.x = Math.PI;
    mesh.rotation.y = rotY;
    mesh.scale.set(1.25, 1.65, 1.25);
    this.group.add(mesh);
  }

  update(dt: number, t: number, px: number, pz: number) {
    this.lockPulse += dt;
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]!;
      b.t -= dt;
      if (b.drag) {
        b.vx *= Math.max(0, 1 - b.drag * dt);
        b.vz *= Math.max(0, 1 - b.drag * dt);
      }
      b.mesh.position.x += b.vx * dt;
      b.mesh.position.y += b.vy * dt;
      b.mesh.position.z += b.vz * dt;
      b.vy -= (b.vy > 0 && b.mesh.material === this.gold ? 1.2 : 11) * dt;
      b.mesh.rotation.x += b.spin * dt;
      b.mesh.rotation.z += b.spin * 0.6 * dt;
      const mat = b.mesh.material as THREE.MeshBasicMaterial;
      if ("opacity" in mat) mat.opacity = Math.max(0, b.t * 2.6);
      if (b.t <= 0) {
        this.recycle(b.mesh);
        this.bursts.splice(i, 1);
      }
    }
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i]!;
      p.t -= dt;
      const u = 1 - p.t / p.max;
      const s = 0.3 + u * p.grow;
      p.mesh.scale.set(s, s, s);
      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      if ("opacity" in mat) {
        const base = p.fade ?? 0.65;
        mat.opacity = Math.max(0, (1 - u) * base);
      }
      if (p.t <= 0) {
        this.group.remove(p.mesh);
        this.pulses.splice(i, 1);
      }
    }
    for (const s of this.shafts) {
      s.mesh.rotation.y += dt * s.spin;
      const mat = s.mesh.material as THREE.MeshBasicMaterial;
      if ("opacity" in mat) mat.opacity = (mat.opacity > 0.3 ? 0.45 : 0.22) + Math.sin(t * 2.2 + s.mesh.position.x) * 0.06;
    }
    for (const m of this.motes) {
      m.y += m.vy * dt;
      if (m.y > 4.2) m.y = 0.3;
      m.mesh.position.set(m.x + Math.sin(t * 0.6 + m.x) * 0.4, m.y, m.z + Math.cos(t * 0.5 + m.z) * 0.4);
      const dx = m.x - px;
      const dz = m.z - pz;
      m.mesh.visible = dx * dx + dz * dz < 240;
    }
    for (let i = this.warn.length - 1; i >= 0; i--) {
      const w = this.warn[i]! as { mesh: THREE.Mesh; t: number; pulse?: boolean };
      w.t -= dt;
      const mat = w.mesh.material as THREE.MeshBasicMaterial;
      if ("opacity" in mat) {
        const pulse = w.pulse ? 0.55 + Math.sin(w.t * 22) * 0.35 : 1;
        mat.opacity = Math.max(0.1, (w.t < 0.2 ? w.t / 0.2 : 1) * pulse * (mat.opacity > 0.5 ? 0.95 : 0.85));
      }
      w.mesh.scale.x *= 1 + dt * 0.05;
      w.mesh.scale.z *= 1 + dt * 0.05;
      if (w.t <= 0) {
        this.group.remove(w.mesh);
        this.warn.splice(i, 1);
      }
    }
  }
}
