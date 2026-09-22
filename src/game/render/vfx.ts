import * as THREE from "three";
import type { TextureKit } from "./textures";
import type { Quality } from "./quality";

type Burst = { mesh: THREE.Mesh; vx: number; vy: number; vz: number; t: number; spin: number };
type Shaft = { mesh: THREE.Mesh; light: THREE.PointLight | null; t: number; max: number; spin: number };
type Pulse = { mesh: THREE.Mesh; t: number; max: number; grow: number };
type Mote = { mesh: THREE.Mesh; x: number; y: number; z: number; vy: number; t: number };
type AimKind = "circle" | "cone" | "line";


const chunkGeo = new THREE.BoxGeometry(0.14, 0.1, 0.12);
const sparkGeo = new THREE.SphereGeometry(0.07, 6, 6);
const ringGeo = new THREE.TorusGeometry(1, 0.055, 6, 28);
const shaftGeo = new THREE.CylinderGeometry(0.16, 0.48, 3.8, 10, 1, true);
const coneGeo = new THREE.ConeGeometry(0.55, 2.6, 8, 1, true);
const wispGeo = new THREE.SphereGeometry(0.09, 6, 6);
const slashGeo = new THREE.TorusGeometry(0.78, 0.055, 5, 14, Math.PI * 1.15);
const scuffGeo = new THREE.CircleGeometry(0.55, 12);
const warnRingGeo = new THREE.RingGeometry(0.82, 1, 40);
const aimCircleGeo = new THREE.RingGeometry(0.72, 1, 48);
const aimFillGeo = new THREE.CircleGeometry(1, 40);


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
  lightBudget = 0;
  private scene: THREE.Scene;
  private maxLights: number;
  private aimGroup = new THREE.Group();
  private aimFill: THREE.Mesh | null = null;
  private aimEdge: THREE.Mesh | null = null;
  private aimKind: AimKind | "" = "";
  private warn: { mesh: THREE.Mesh; t: number }[] = [];


  constructor(scene: THREE.Scene, kit: TextureKit, quality: Quality) {
    this.scene = scene;
    this.kit = kit;
    this.quality = quality;
    this.maxLights = quality.maxLights;
    scene.add(this.group);
    this.add = new THREE.MeshBasicMaterial({
      color: 0xffaa55,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.ember = kit.mats.ember!;
    this.gold = new THREE.MeshBasicMaterial({
      color: 0xffcc66,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.blood = new THREE.MeshBasicMaterial({ color: 0x991111, transparent: true, opacity: 0.9, depthWrite: false });
    this.dust = new THREE.MeshStandardMaterial({ color: 0x6a5a48, roughness: 0.95, transparent: true, opacity: 0.85 });
    this.group.add(this.aimGroup);
    this.aimGroup.visible = false;
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
    if (this.pool.length < 90) this.pool.push(m);
  }

  burst(x: number, y: number, z: number, color: number, n: number, mode: "blood" | "ember" | "chunk" | "soul" = "blood") {
    const count = Math.max(3, Math.round(n * this.quality.particles));
    for (let i = 0; i < count; i++) {
      const mat = mode === "ember" ? this.ember : mode === "soul" ? this.gold : mode === "chunk" ? this.dust : this.blood;
      const geo = mode === "chunk" ? chunkGeo : mode === "soul" ? wispGeo : sparkGeo;
      const mesh = this.take(geo, mat);
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(0.55 + Math.random() * 1.5);
      this.bursts.push({
        mesh,
        vx: (Math.random() - 0.5) * (mode === "soul" ? 1.1 : 5.8),
        vy: (mode === "soul" ? 1.9 : 2.4) + Math.random() * (mode === "soul" ? 2.2 : 5.2),
        vz: (Math.random() - 0.5) * (mode === "soul" ? 1.1 : 5.8),
        t: mode === "chunk" ? 0.95 : 0.32 + Math.random() * 0.32,
        spin: (Math.random() - 0.5) * 9,
      });
    }
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

  shock(x: number, z: number, color = 0xffaa44) {
    this.ring(x, z, color, 9, 0.44);
    this.ring(x, z, 0xfff2c8, 5.5, 0.22);
    this.burst(x, 0.4, z, color, 16, "chunk");
    this.burst(x, 0.55, z, color, 12, "ember");
    this.flash(x, z, color, 3.4, 0.2);
    const scuff = new THREE.MeshBasicMaterial({ color: 0x2a1810, transparent: true, opacity: 0.45, depthWrite: false });
    const mesh = new THREE.Mesh(scuffGeo, scuff);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.04, z);
    this.group.add(mesh);
    this.pulses.push({ mesh, t: 0.55, max: 0.55, grow: 3.2 });
  }

  whirl(x: number, z: number) {
    this.ring(x, z, 0xddaa66, 3.8, 0.2);
    this.burst(x, 0.35, z, 0x8a6a40, 6, "chunk");
  }

  leap(x: number, z: number) {
    this.ring(x, z, 0xc4a35a, 5.8, 0.34);
    this.burst(x, 0.2, z, 0x8a6a40, 12, "chunk");
    this.flash(x, z, 0xffd8a0, 2.4, 0.12);
  }

  slash(x: number, z: number, facing: number) {
    const mat = this.add.clone();
    mat.color.setHex(0xffe4b0);
    const mesh = new THREE.Mesh(slashGeo, mat);
    mesh.position.set(x + Math.sin(facing) * 0.35, 0.95, z + Math.cos(facing) * 0.35);
    mesh.rotation.set(0.35, facing, 0.95);
    this.group.add(mesh);
    this.pulses.push({ mesh, t: 0.16, max: 0.16, grow: 3.6 });
    this.burst(x, 0.9, z, 0xffcc88, 4, "ember");
  }

  death(x: number, z: number, elite: boolean, boss: boolean) {
    this.burst(x, 0.8, z, 0x771111, elite || boss ? 24 : 14, "blood");
    this.burst(x, 0.9, z, 0x442211, elite || boss ? 18 : 9, "chunk");
    this.burst(x, 1.15, z, 0xffcc88, elite || boss ? 16 : 7, "soul");
    if (boss) this.flash(x, z, 0xff2200, 8, 0.5);
  }

  lootShaft(x: number, z: number, color: number, rarity: string): { mesh: THREE.Object3D; light: THREE.PointLight | null } {
    const tall = rarity === "legendary" || rarity === "set";
    const mat = this.gold.clone();
    mat.color.setHex(color);
    mat.opacity = tall ? 0.58 : rarity === "rare" ? 0.42 : 0.22;
    const mesh = new THREE.Mesh(shaftGeo, mat);
    mesh.position.set(x, tall ? 2.25 : 1.45, z);
    mesh.scale.set(tall ? 1.25 : 0.78, tall ? 1.45 : 0.88, tall ? 1.25 : 0.78);
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
    const l = new THREE.PointLight(color, 12, dist, 1.6);
    l.position.set(x, 1.4, z);
    this.scene.add(l);
    this.lightBudget++;
    window.setTimeout(() => {
      this.scene.remove(l);
      this.lightBudget = Math.max(0, this.lightBudget - 1);
    }, life * 1000);
  }

  shatter(x: number, z: number) {
    this.burst(x, 0.4, z, 0x6a4a28, 18, "chunk");
    this.ring(x, z, 0xaa7744, 4, 0.25);
  }

  /** High-contrast red enemy windup ring. Stays put until life expires. */
  warnCircle(x: number, z: number, r: number, life = 0.9) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(warnRingGeo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.08, z);
    mesh.scale.setScalar(Math.max(0.4, r));
    this.group.add(mesh);
    this.warn.push({ mesh, t: life });
    const fill = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const disc = new THREE.Mesh(aimFillGeo, fill);
    disc.rotation.x = -Math.PI / 2;
    disc.position.set(x, 0.06, z);
    disc.scale.setScalar(Math.max(0.4, r));
    this.group.add(disc);
    this.warn.push({ mesh: disc, t: life });
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
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i]!;
      b.t -= dt;
      b.mesh.position.x += b.vx * dt;
      b.mesh.position.y += b.vy * dt;
      b.mesh.position.z += b.vz * dt;
      b.vy -= (b.vy > 0 && b.mesh.material === this.gold ? 1.2 : 11) * dt;
      b.mesh.rotation.x += b.spin * dt;
      b.mesh.rotation.z += b.spin * 0.6 * dt;
      const mat = b.mesh.material as THREE.MeshBasicMaterial;
      if ("opacity" in mat) mat.opacity = Math.max(0, b.t * 2.4);
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
      if ("opacity" in mat) mat.opacity = Math.max(0, (1 - u) * 0.65);
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
      const w = this.warn[i]!;
      w.t -= dt;
      const mat = w.mesh.material as THREE.MeshBasicMaterial;
      if ("opacity" in mat) mat.opacity = Math.max(0.08, mat.opacity * (w.t < 0.18 ? 0.92 : 1));
      w.mesh.scale.x *= 1 + dt * 0.08;
      w.mesh.scale.z *= 1 + dt * 0.08;
      if (w.t <= 0) {
        this.group.remove(w.mesh);
        this.warn.splice(i, 1);
      }
    }
  }
}
