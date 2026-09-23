import * as THREE from "three";
import type { TextureKit } from "./textures";
import type { Quality } from "./quality";
import type { Item, Slot } from "../types";

export type FigureKind =
  | "barbarian"
  | "skeleton"
  | "imp"
  | "cultist"
  | "brute"
  | "wight"
  | "boss"
  | "guardian"
  | "npc-ryn"
  | "npc-kael"
  | "npc-maera"
  | "npc-vesh"
  | "npc-brann"
  | "npc-io";

export type FigurePose = {
  moving: boolean;
  speed: number;
  attacking: boolean;
  whirlwind: boolean;
  dead: boolean;
  freeze: boolean;
  facing: number;
  dt: number;
  time: number;
};

function lathe(profile: [number, number][], segs = 12) {
  return new THREE.LatheGeometry(
    profile.map(([x, y]) => new THREE.Vector2(x, y)),
    segs,
  );
}

const box = new THREE.BoxGeometry(1, 1, 1);
const cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 14);
const cylT = new THREE.CylinderGeometry(0.32, 0.5, 1, 14);
const sph = new THREE.SphereGeometry(0.5, 18, 14);
const sphLo = new THREE.SphereGeometry(0.5, 10, 8);
const cone = new THREE.ConeGeometry(0.5, 1, 10);
const tor = new THREE.TorusGeometry(0.5, 0.12, 8, 16);
const cap = new THREE.CapsuleGeometry(0.5, 1, 4, 10);
const octa = new THREE.OctahedronGeometry(0.5, 1);
const torsoGeo = lathe(
  [
    [0.01, 0],
    [0.24, 0.02],
    [0.27, 0.14],
    [0.2, 0.3],
    [0.29, 0.48],
    [0.34, 0.64],
    [0.24, 0.76],
    [0.11, 0.84],
  ],
  14,
);
const robeGeo = lathe(
  [
    [0.44, 0],
    [0.42, 0.06],
    [0.34, 0.4],
    [0.22, 0.82],
    [0.15, 1.02],
    [0.1, 1.12],
  ],
  14,
);
const hoodGeo = lathe(
  [
    [0.24, 0],
    [0.26, 0.1],
    [0.2, 0.26],
    [0.08, 0.36],
    [0.02, 0.38],
  ],
  10,
);
const wingShape = new THREE.Shape();
wingShape.moveTo(0, 0);
wingShape.bezierCurveTo(0.18, 0.32, 0.52, 0.42, 0.92, 0.12);
wingShape.lineTo(0.72, -0.06);
wingShape.lineTo(0.38, -0.14);
wingShape.lineTo(0, -0.05);
const wingGeo = new THREE.ShapeGeometry(wingShape);
wingGeo.computeVertexNormals();

function add(
  parent: THREE.Object3D,
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
  sx: number,
  sy: number,
  sz: number,
  rx = 0,
  ry = 0,
  rz = 0,
  shadow = true,
): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.rotation.set(rx, ry, rz);
  m.castShadow = shadow;
  m.receiveShadow = shadow;
  parent.add(m);
  return m;
}

function tuft(parent: THREE.Object3D, mat: THREE.Material, x: number, y: number, z: number, k: number, n = 7) {
  add(parent, sphLo, mat, x, y, z, 0.28 * k, 0.2 * k, 0.28 * k);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 1.6 - 0.4;
    add(parent, cone, mat, x + Math.cos(a) * 0.1 * k, y - 0.06 * k, z + Math.sin(a) * 0.08 * k, 0.07 * k, 0.2 * k, 0.07 * k, 0.85, 0, a);
  }
}

function plates(torso: THREE.Object3D, iron: THREE.Material, gold: THREE.Material, rows = 4) {
  for (let r = 0; r < rows; r++) {
    for (let c = -1; c <= 1; c++) {
      add(torso, box, iron, c * 0.2, 0.18 - r * 0.11, 0.3, 0.2, 0.09, 0.045, 0.18, 0, 0, false);
    }
  }
  add(torso, box, gold, 0, 0.08, 0.34, 0.08, 0.42, 0.03, 0, 0, 0, false);
}

export class Figure {
  root = new THREE.Group();
  kind: FigureKind;
  height: number;
  parts: Record<string, THREE.Object3D> = {};
  flashMats: THREE.MeshStandardMaterial[] = [];
  attackT = 0;
  hitFlash = 0;
  dissolve = 1;
  deadT = 0;
  /** Local hit-shake. Never written into world X — the engine places the actor. */
  shakeX = 0;
  /** Death sink, applied by the engine on top of world Y. */
  sinkY = 0;
  private cloakX = 0.1;
  private walk = 0;
  iceShell: THREE.Mesh | null = null;
  gear: THREE.Group = new THREE.Group();
  private glowT = 0;
  private glowCol = 0x44ff88;
  private kit: TextureKit | null = null;

  constructor(kind: FigureKind, height: number) {
    this.kind = kind;
    this.height = height;
    this.root.add(this.gear);
  }

  playAttack() {
    this.attackT = 0.32;
  }

  /** Death clip must not leave a live ghost after a checkpoint revive. */
  revive() {
    this.deadT = 0;
    this.dissolve = 1;
    this.sinkY = 0;
    this.shakeX = 0;
    this.attackT = 0;
    this.root.rotation.x = 0;
    this.root.scale.y = 1;
    this.root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (mat && "opacity" in mat) {
        mat.opacity = 1;
        mat.transparent = false;
      }
    });
  }

  flash() {
    this.hitFlash = 0.14;
  }

  glow(color: number, t: number) {
    this.glowCol = color;
    this.glowT = t;
  }

  bindKit(kit: TextureKit) {
    this.kit = kit;
  }

  applyGear(equipped: Partial<Record<Slot, Item | Item[]>>) {
    while (this.gear.children.length) this.gear.remove(this.gear.children[0]!);
    if (this.kind !== "barbarian") return;
    const kit = this.kit;
    const iron = kit?.clone("iron") ?? new THREE.MeshStandardMaterial({ color: 0x8a8074, metalness: 0.7, roughness: 0.35 });
    const gold = kit?.clone("gold") ?? new THREE.MeshStandardMaterial({ color: 0xc4a35a, metalness: 0.85, roughness: 0.28 });
    const leather = kit?.clone("leather") ?? new THREE.MeshStandardMaterial({ color: 0x5a3a28, roughness: 0.7 });
    const k = this.height / 2.02;
    const main = equipped.main;
    const wep = !Array.isArray(main) ? main : undefined;
    if (wep && this.parts.weapon) {
      const rare = wep.rarity === "rare" || wep.rarity === "legendary" || wep.rarity === "set";
      const col = wep.rarity === "legendary" ? gold : wep.rarity === "rare" ? gold : iron;
      add(this.gear, box, col, 0.42 * k, 1.15 * k, 0.22 * k, 0.08 * k, 0.08 * k, 0.08 * k, 0, 0, 0, false);
      if (rare) {
        add(this.parts.weapon, box, gold, 0.14 * k, 0.7 * k, 0.07 * k, 0.18 * k, 0.32 * k, 0.03 * k, 0, 0, 0, false);
        add(this.parts.weapon, cone, gold, 0.4 * k, 0.7 * k, 0.02 * k, 0.12 * k, 0.22 * k, 0.04 * k, 0, 0, Math.PI / 2, false);
      }
    }
    const helm = !Array.isArray(equipped.helm) ? equipped.helm : undefined;
    if (helm && this.parts.head) {
      const mat = helm.rarity === "normal" ? leather : helm.rarity === "magic" ? iron : gold;
      add(this.parts.head, box, mat, 0, 0.18, 0.02, 0.95, 0.42, 0.95, 0, 0, 0, false);
      add(this.parts.head, box, iron, 0, 0.02, 0.38, 0.7, 0.16, 0.18, 0, 0, 0, false);
      if (helm.rarity === "rare" || helm.rarity === "legendary")
        add(this.parts.head, box, gold, 0, 0.22, 0.42, 0.18, 0.1, 0.08, 0, 0, 0, false);
    }
    const chest = !Array.isArray(equipped.chest) ? equipped.chest : undefined;
    if (chest && this.parts.torso) {
      const mat = chest.rarity === "legendary" || chest.rarity === "rare" ? gold : iron;
      add(this.parts.torso, box, mat, 0, 0.42, 0.36, 0.62, 0.14, 0.08, 0.1, 0, 0, false);
      add(this.parts.torso, box, iron, -0.22, 0.28, 0.34, 0.22, 0.28, 0.06, 0.12, 0, 0, false);
      add(this.parts.torso, box, iron, 0.22, 0.28, 0.34, 0.22, 0.28, 0.06, 0.12, 0, 0, false);
    }
  }

  update(pose: FigurePose) {
    const dt = pose.dt;
    this.shakeX = 0;
    this.sinkY = 0;
    if (pose.whirlwind) this.root.rotation.y += dt * 16;
    else this.root.rotation.y = pose.facing + Math.PI;
    if (this.hitFlash > 0) {
      this.hitFlash -= dt;
      const on = this.hitFlash > 0.04;
      for (const m of this.flashMats) {
        m.emissive.setHex(on ? 0xfff2e0 : 0x000000);
        m.emissiveIntensity = on ? 0.85 : (m.userData.emi0 ?? 0);
      }
      this.shakeX = Math.sin(this.hitFlash * 48) * 0.035;
    }
    if (this.glowT > 0) {
      this.glowT -= dt;
      for (const m of this.flashMats) {
        m.emissive.setHex(this.glowCol);
        m.emissiveIntensity = 0.35 + Math.sin(pose.time * 8) * 0.12;
      }
    }
    if (this.iceShell) this.iceShell.visible = pose.freeze;
    if (pose.dead) {
      this.deadT += dt;
      const k = Math.min(1, this.deadT / 0.5);
      this.root.rotation.x = k * 1.25;
      this.sinkY = -k * 0.18;
      if (this.deadT > 8) {
        this.dissolve = Math.max(0, this.dissolve - dt * 0.7);
        this.root.scale.y = Math.max(0.05, this.dissolve);
        this.root.traverse((o) => {
          const mesh = o as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
          if (mat && "opacity" in mat) {
            mat.transparent = true;
            mat.opacity = this.dissolve;
            mat.needsUpdate = true;
          }
        });
      }
      return;
    }
    this.deadT = 0;
    this.root.rotation.x = 0;
    const torso = this.parts.torso;
    const lThigh = this.parts.lThigh;
    const rThigh = this.parts.rThigh;
    const lShin = this.parts.lShin;
    const rShin = this.parts.rShin;
    const lArm = this.parts.lArm;
    const rArm = this.parts.rArm;
    const weapon = this.parts.weapon;
    const cloak = this.parts.cloak;
    const head = this.parts.head;
    const lWing = this.parts.lWing;
    const rWing = this.parts.rWing;
    if (pose.attacking || this.attackT > 0) {
      this.attackT = Math.max(0, this.attackT - dt);
      const u = 1 - this.attackT / 0.32;
      const swing = u < 0.4 ? u / 0.4 : 1 - (u - 0.4) / 0.6;
      if (rArm) rArm.rotation.x = -2.05 * swing;
      if (lArm) lArm.rotation.x = 0.35 * swing;
      if (weapon) weapon.rotation.z = -0.55 * swing;
      if (torso) torso.rotation.x = -0.12 * swing;
    } else if (rArm) {
      rArm.rotation.x *= Math.max(0, 1 - dt * 8);
      if (torso) torso.rotation.x *= Math.max(0, 1 - dt * 8);
    }
    if (pose.moving) {
      this.walk += dt * (6.4 + pose.speed * 0.85);
      const s = Math.sin(this.walk);
      const c = Math.cos(this.walk);
      if (lThigh) lThigh.rotation.x = s * 0.78;
      if (rThigh) rThigh.rotation.x = -s * 0.78;
      if (lShin) lShin.rotation.x = Math.max(0, -c) * 0.5;
      if (rShin) rShin.rotation.x = Math.max(0, c) * 0.5;
      if (lArm && this.attackT <= 0) lArm.rotation.x = -s * 0.58;
      if (rArm && this.attackT <= 0 && !pose.whirlwind) rArm.rotation.x = s * 0.48;
      if (torso) {
        torso.position.y = (torso.userData.y0 ?? torso.position.y) + Math.abs(s) * 0.035;
        torso.rotation.y = s * 0.08;
      }
      this.cloakX = THREE.MathUtils.damp(this.cloakX, 0.48, 8, dt);
    } else {
      this.walk += dt * 2;
      const b = Math.sin(pose.time * 2.05) * 0.014;
      if (torso) {
        torso.position.y = (torso.userData.y0 ?? torso.position.y) + b;
        torso.rotation.y *= Math.max(0, 1 - dt * 6);
      }
      if (head) head.rotation.y = Math.sin(pose.time * 0.65) * 0.1;
      if (lThigh) lThigh.rotation.x *= Math.max(0, 1 - dt * 8);
      if (rThigh) rThigh.rotation.x *= Math.max(0, 1 - dt * 8);
      if (lShin) lShin.rotation.x *= Math.max(0, 1 - dt * 8);
      if (rShin) rShin.rotation.x *= Math.max(0, 1 - dt * 8);
      if (lArm && this.attackT <= 0) lArm.rotation.x = Math.sin(pose.time * 1.35) * 0.06;
      this.cloakX = THREE.MathUtils.damp(this.cloakX, 0.12, 6, dt);
    }
    if (cloak) cloak.rotation.x = this.cloakX;
    if (pose.whirlwind) {
      if (lArm) lArm.rotation.z = 1.15;
      if (rArm) rArm.rotation.z = -1.15;
    } else {
      if (lArm) lArm.rotation.z = THREE.MathUtils.damp(lArm.rotation.z, 0.14, 8, dt);
      if (rArm) rArm.rotation.z = THREE.MathUtils.damp(rArm.rotation.z, -0.14, 8, dt);
    }
    if (lWing && rWing) {
      const flap = Math.sin(pose.time * (pose.moving ? 16 : 5.5)) * 0.32;
      lWing.rotation.y = 0.45 + flap;
      rWing.rotation.y = -0.45 - flap;
      lWing.rotation.z = 0.25 + flap * 0.4;
      rWing.rotation.z = -0.25 - flap * 0.4;
    }
    // NPC work loops — not a shared T-pose.
    if (this.kind === "npc-kael" && this.attackT <= 0) {
      const swing = Math.max(0, Math.sin(pose.time * 2.4));
      if (rArm) rArm.rotation.x = -1.7 * swing;
      if (weapon) weapon.rotation.z = -0.4 * swing;
    } else if (this.kind === "npc-maera") {
      if (lArm) lArm.rotation.x = Math.sin(pose.time * 1.15) * 0.28 - 0.45;
      if (rArm) rArm.rotation.x = Math.sin(pose.time * 1.15 + 1.2) * 0.2 - 0.2;
      if (head) head.rotation.y = Math.sin(pose.time * 0.5) * 0.18;
    } else if (this.kind === "npc-vesh") {
      if (head) head.rotation.y = Math.sin(pose.time * 0.35) * 0.4;
      if (rArm && this.attackT <= 0) rArm.rotation.x = -0.35;
    } else if (this.kind === "npc-ryn") {
      if (head) head.rotation.y = Math.sin(pose.time * 0.28) * 0.22;
    } else if (this.kind === "npc-brann") {
      if (lArm) lArm.rotation.z = 0.55 + Math.sin(pose.time * 1.6) * 0.08;
      if (rArm) rArm.rotation.z = -0.55 - Math.sin(pose.time * 1.6) * 0.08;
    } else if (this.kind === "npc-io") {
      if (weapon) weapon.rotation.y = pose.time * 0.6;
    }
  }
}

export class FigureFactory {
  kit: TextureKit;
  quality: Quality;
  private eyeWhite: THREE.MeshStandardMaterial;
  private eyeDark: THREE.MeshStandardMaterial;
  private eyeGlow: THREE.MeshStandardMaterial;

  constructor(kit: TextureKit, quality: Quality) {
    this.kit = kit;
    this.quality = quality;
    this.eyeWhite = new THREE.MeshStandardMaterial({ color: 0xe8dcc8, roughness: 0.4 });
    this.eyeDark = new THREE.MeshStandardMaterial({ color: 0x1a120c, roughness: 0.35 });
    this.eyeGlow = new THREE.MeshStandardMaterial({ color: 0xff3311, emissive: 0xff2200, emissiveIntensity: 2.2, roughness: 0.3 });
  }

  create(kind: FigureKind, scale = 1, elite = false, boss = false): Figure {
    const h =
      (kind === "imp" ? 1.22 : kind === "brute" || kind === "guardian" ? 2.45 : kind === "boss" ? 3.15 : 2.02) * scale;
    const fig = new Figure(kind, h);
    const k = h / 2.02;
    const leather = this.kit.clone("leather");
    const iron = this.kit.clone("iron");
    const gold = this.kit.clone("gold");
    const hide = this.kit.clone("hide");
    const bone = this.kit.clone("bone");
    const cloth = this.kit.clone("cloth");
    const skin = this.kit.clone("skin");
    const fur = this.kit.clone("fur");
    const wood = this.kit.clone("wood");
    const banner = this.kit.clone("banner");
    const ember = this.kit.mats.ember!;
    fig.flashMats.push(leather, hide, skin, bone, cloth);
    for (const m of fig.flashMats) m.userData.emi0 = m.emissiveIntensity;
    fig.bindKit(this.kit);

    if (kind === "barbarian" || kind === "npc-kael") this.barb(fig, k, { leather, iron, gold, skin, fur, cloth, wood }, kind === "npc-kael");
    else if (kind === "imp") this.imp(fig, k, { hide, bone, ember, iron });
    else if (kind === "skeleton" || kind === "wight") this.skel(fig, k, { bone, iron, cloth, ice: this.kit.mats.ice! }, kind === "wight");
    else if (kind === "cultist" || kind === "npc-vesh" || kind === "npc-io" || kind === "npc-maera")
      this.robe(fig, k, { cloth, skin, iron, gold, bone, hide, banner }, kind);
    else if (kind === "brute" || kind === "guardian") this.brute(fig, k, { hide, bone, iron, ember }, kind === "guardian");
    else if (kind === "boss") this.boss(fig, k, { hide, iron, gold, bone, ember, cloth, banner });
    else if (kind === "npc-ryn") this.plate(fig, k, { iron, gold, cloth, skin, leather, banner });
    else if (kind === "npc-brann") this.monk(fig, k, { cloth, skin, leather, banner });
    else this.barb(fig, k, { leather, iron, gold, skin, fur, cloth, wood }, false);

    if (elite || boss) {
      const vein = new THREE.MeshStandardMaterial({
        color: 0xff3311,
        emissive: 0xff2200,
        emissiveIntensity: boss ? 1.8 : 1.2,
        roughness: 0.35,
      });
      add(fig.root, box, vein, 0, h * 0.58, 0.18 * k, 0.07 * k, 0.7 * k, 0.04 * k, 0, 0, 0, false);
      add(fig.root, box, vein, -0.12 * k, h * 0.55, 0.16 * k, 0.04 * k, 0.45 * k, 0.03 * k, 0, 0, 0.4, false);
      if (boss) add(fig.root, tor, vein, 0, h * 0.98, 0, 1.15 * k, 1.15 * k, 1.15 * k, Math.PI / 2);
    }

    const ice = new THREE.MeshStandardMaterial({
      color: 0xaadfff,
      transparent: true,
      opacity: 0.26,
      roughness: 0.18,
      metalness: 0.12,
      depthWrite: false,
    });
    const shell = add(fig.root, cap, ice, 0, h * 0.5, 0, 0.85 * k, h * 0.55, 0.7 * k);
    shell.visible = false;
    fig.iceShell = shell;

    const shMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2, depthWrite: false });
    const sh = new THREE.Mesh(new THREE.CircleGeometry(0.3 * k, 14), shMat);
    sh.rotation.x = -Math.PI / 2;
    sh.position.y = 0.03;
    fig.root.add(sh);
    fig.parts.shadow = sh;
    return fig;
  }

  private eyes(head: THREE.Object3D, glow = false, k = 1) {
    const mat = glow ? this.eyeGlow : this.eyeWhite;
    const pupil = glow ? this.eyeGlow : this.eyeDark;
    add(head, sphLo, mat, -0.14, 0.04, 0.32, 0.1 * k, 0.08 * k, 0.06 * k, 0, 0, 0, false);
    add(head, sphLo, mat, 0.14, 0.04, 0.32, 0.1 * k, 0.08 * k, 0.06 * k, 0, 0, 0, false);
    add(head, sphLo, pupil, -0.14, 0.04, 0.36, 0.05 * k, 0.05 * k, 0.04 * k, 0, 0, 0, false);
    add(head, sphLo, pupil, 0.14, 0.04, 0.36, 0.05 * k, 0.05 * k, 0.04 * k, 0, 0, 0, false);
  }

  private limb(
    fig: Figure,
    side: "l" | "r",
    x: number,
    y: number,
    k: number,
    mat: THREE.Material,
    thighLen = 0.48,
  ) {
    const thigh = new THREE.Group();
    thigh.position.set(x, y, 0);
    fig.root.add(thigh);
    fig.parts[side === "l" ? "lThigh" : "rThigh"] = thigh;
    add(thigh, cylT, mat, 0, -thighLen * 0.5 * k, 0, 0.18 * k, thighLen * k, 0.18 * k);
    add(thigh, sphLo, mat, 0, -thighLen * k, 0, 0.16 * k, 0.16 * k, 0.16 * k, 0, 0, 0, false);
    const shin = new THREE.Group();
    shin.position.set(0, -thighLen * k, 0);
    thigh.add(shin);
    fig.parts[side === "l" ? "lShin" : "rShin"] = shin;
    add(shin, cylT, mat, 0, -0.22 * k, 0, 0.14 * k, 0.42 * k, 0.14 * k);
    return { thigh, shin };
  }

  private arms(fig: Figure, x: number, y: number, k: number, mat: THREE.Material, hand?: THREE.Material) {
    const lArm = new THREE.Group();
    lArm.position.set(-x, y, 0);
    fig.root.add(lArm);
    fig.parts.lArm = lArm;
    add(lArm, cylT, mat, 0, -0.24 * k, 0, 0.15 * k, 0.48 * k, 0.15 * k);
    add(lArm, sphLo, hand ?? mat, 0, -0.5 * k, 0, 0.16 * k, 0.16 * k, 0.16 * k);
    const rArm = new THREE.Group();
    rArm.position.set(x, y, 0);
    fig.root.add(rArm);
    fig.parts.rArm = rArm;
    add(rArm, cylT, mat, 0, -0.24 * k, 0, 0.15 * k, 0.48 * k, 0.15 * k);
    add(rArm, sphLo, hand ?? mat, 0, -0.5 * k, 0, 0.16 * k, 0.16 * k, 0.16 * k);
    const weapon = new THREE.Group();
    weapon.position.set(0.02 * k, -0.52 * k, 0.06 * k);
    rArm.add(weapon);
    fig.parts.weapon = weapon;
    return { lArm, rArm, weapon };
  }

  private barb(
    fig: Figure,
    k: number,
    m: {
      leather: THREE.Material;
      iron: THREE.Material;
      gold: THREE.Material;
      skin: THREE.Material;
      fur: THREE.Material;
      cloth: THREE.Material;
      wood: THREE.Material;
    },
    smith: boolean,
  ) {
    add(fig.root, sph, m.leather, 0, 0.72 * k, 0, 0.46 * k, 0.28 * k, 0.34 * k);
    const torso = add(fig.root, torsoGeo, m.leather, 0, 0.7 * k, 0, 1.05 * k, 1.05 * k, 0.95 * k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    plates(torso, m.iron, m.gold, 5);
    add(torso, box, m.iron, 0, 0.55, 0.22, 0.7, 0.18, 0.2, -0.2);
    add(torso, box, m.leather, -0.28, 0.22, 0.18, 0.12, 0.42, 0.04, 0.1, 0, 0, false);
    add(torso, box, m.leather, 0.28, 0.22, 0.18, 0.12, 0.42, 0.04, 0.1, 0, 0, false);
    tuft(fig.root, m.fur, -0.42 * k, 1.48 * k, 0.04 * k, k, 10);
    tuft(fig.root, m.fur, 0.42 * k, 1.48 * k, 0.04 * k, k, 10);
    const head = add(fig.root, sph, m.skin, 0, 1.68 * k, 0.06 * k, 0.34 * k, 0.38 * k, 0.32 * k);
    fig.parts.head = head;
    this.eyes(head, false, 1);
    add(head, sphLo, m.skin, 0, -0.02, 0.28, 0.14, 0.16, 0.14, 0.4, 0, 0, false);
    add(head, sphLo, m.fur, 0, 0.28, -0.04, 0.78, 0.5, 0.75);
    add(head, sphLo, m.fur, 0, -0.22, 0.26, 0.55, 0.38, 0.4);
    add(head, cone, m.fur, -0.12, 0.42, -0.12, 0.16, 0.32, 0.16, 0.5);
    add(head, cone, m.fur, 0.12, 0.42, -0.12, 0.16, 0.32, 0.16, 0.5);
    add(head, cone, m.fur, 0, 0.46, -0.18, 0.18, 0.38, 0.18, 0.65);
    const { weapon } = this.arms(fig, 0.44 * k, 1.42 * k, k, m.skin, m.leather);
    if (smith) {
      add(weapon, cyl, m.wood, 0, 0.12 * k, 0, 0.08 * k, 0.72 * k, 0.08 * k);
      add(weapon, box, m.iron, 0, 0.5 * k, 0, 0.34 * k, 0.2 * k, 0.14 * k);
    } else {
      add(weapon, cyl, m.wood, 0, 0.22 * k, 0, 0.055 * k, 1.05 * k, 0.055 * k);
      add(weapon, cyl, m.leather, 0, 0.02 * k, 0, 0.075 * k, 0.22 * k, 0.075 * k, 0, 0, 0, false);
      add(weapon, box, m.iron, 0.14 * k, 0.7 * k, 0, 0.42 * k, 0.28 * k, 0.08 * k);
      add(weapon, cone, m.iron, 0.36 * k, 0.7 * k, 0, 0.22 * k, 0.4 * k, 0.06 * k, 0, 0, Math.PI / 2);
      add(weapon, cone, m.iron, 0, 0.96 * k, 0, 0.05 * k, 0.22 * k, 0.05 * k);
      add(weapon, box, m.gold, 0.14 * k, 0.7 * k, 0.05 * k, 0.1 * k, 0.2 * k, 0.02 * k, 0, 0, 0, false);
      add(weapon, box, m.iron, 0.14 * k, 0.7 * k, -0.05 * k, 0.38 * k, 0.04 * k, 0.02 * k, 0, 0, 0, false);
      add(weapon, box, m.gold, 0, 0.18 * k, 0, 0.1 * k, 0.04 * k, 0.1 * k, 0, 0, 0, false);
    }
    const { shin: lShin } = this.limb(fig, "l", -0.15 * k, 0.68 * k, k, m.leather);
    const { shin: rShin } = this.limb(fig, "r", 0.15 * k, 0.68 * k, k, m.leather);
    add(lShin, box, m.iron, 0, -0.4 * k, 0.06 * k, 0.2 * k, 0.14 * k, 0.3 * k);
    add(rShin, box, m.iron, 0, -0.4 * k, 0.06 * k, 0.2 * k, 0.14 * k, 0.3 * k);
    add(fig.root, box, m.cloth, 0, 0.78 * k, 0.04 * k, 0.52 * k, 0.22 * k, 0.24 * k);
    add(fig.root, box, m.iron, 0, 0.86 * k, 0.14 * k, 0.5 * k, 0.08 * k, 0.1 * k);
    add(fig.root, box, m.gold, 0, 0.86 * k, 0.2 * k, 0.12 * k, 0.1 * k, 0.04 * k, 0, 0, 0, false);
    const cloak = add(fig.root, box, m.fur, 0, 1.15 * k, -0.24 * k, 0.58 * k, 0.78 * k, 0.08 * k);
    fig.parts.cloak = cloak;
  }

  private imp(fig: Figure, k: number, m: { hide: THREE.Material; bone: THREE.Material; ember: THREE.Material; iron: THREE.Material }) {
    const torso = add(fig.root, sph, m.hide, 0, 0.72 * k, 0.08 * k, 0.62 * k, 0.52 * k, 0.48 * k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    const head = add(fig.root, sph, m.hide, 0, 1.12 * k, 0.18 * k, 0.4 * k, 0.34 * k, 0.38 * k);
    fig.parts.head = head;
    this.eyes(head, true, 0.9);
    add(head, cone, m.bone, -0.22, 0.38, -0.02, 0.1 * k, 0.34 * k, 0.1 * k, 0.25);
    add(head, cone, m.bone, 0.22, 0.38, -0.02, 0.1 * k, 0.34 * k, 0.1 * k, 0.25);
    add(head, cone, m.bone, 0, 0.28, -0.2, 0.08 * k, 0.22 * k, 0.08 * k, 0.8);
    const lWing = new THREE.Group();
    lWing.position.set(-0.12 * k, 0.82 * k, -0.12 * k);
    fig.root.add(lWing);
    fig.parts.lWing = lWing;
    const wingMat = (m.hide as THREE.MeshStandardMaterial).clone();
    wingMat.transparent = true;
    wingMat.opacity = 0.82;
    wingMat.side = THREE.DoubleSide;
    add(lWing, wingGeo, wingMat, 0, 0, 0, 0.85 * k, 0.7 * k, 1, 0.2, 0.2, 0.4);
    const rWing = new THREE.Group();
    rWing.position.set(0.12 * k, 0.82 * k, -0.12 * k);
    fig.root.add(rWing);
    fig.parts.rWing = rWing;
    add(rWing, wingGeo, wingMat, 0, 0, 0, -0.85 * k, 0.7 * k, 1, 0.2, -0.2, -0.4);
    this.arms(fig, 0.3 * k, 0.82 * k, k * 0.85, m.hide);
    this.limb(fig, "l", -0.12 * k, 0.48 * k, k * 0.85, m.hide, 0.36);
    this.limb(fig, "r", 0.12 * k, 0.48 * k, k * 0.85, m.hide, 0.36);
    add(fig.root, cylT, m.hide, 0, 0.38 * k, -0.28 * k, 0.07 * k, 0.5 * k, 0.07 * k, 0.7);
    add(fig.root, sphLo, m.hide, 0, 0.18 * k, -0.48 * k, 0.12 * k, 0.1 * k, 0.12 * k, 0, 0, 0, false);
  }

  private skel(fig: Figure, k: number, m: { bone: THREE.Material; iron: THREE.Material; cloth: THREE.Material; ice: THREE.Material }, wight: boolean) {
    const bone = wight ? m.ice : m.bone;
    add(fig.root, sph, bone, 0, 0.72 * k, 0, 0.34 * k, 0.18 * k, 0.24 * k);
    const torso = add(fig.root, box, bone, 0, 1.12 * k, 0, 0.32 * k, 0.58 * k, 0.2 * k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    add(torso, cyl, bone, 0, 0.02, 0, 0.16, 0.95, 0.16);
    for (let i = 0; i < 4; i++) add(torso, cyl, bone, 0, 0.28 - i * 0.14, 0.12, 0.55, 0.05, 0.08, 0, 0, 0, false);
    const head = add(fig.root, sph, bone, 0, 1.58 * k, 0.04 * k, 0.3 * k, 0.32 * k, 0.28 * k);
    fig.parts.head = head;
    this.eyes(head, true, 0.85);
    add(head, box, bone, 0, -0.08, 0.2, 0.42, 0.18, 0.16, 0, 0, 0, false);
    this.arms(fig, 0.28 * k, 1.34 * k, k, bone);
    const w = fig.parts.weapon;
    if (w) {
      add(w, cyl, m.iron, 0, 0.22 * k, 0, 0.04 * k, 0.85 * k, 0.04 * k);
      add(w, box, m.iron, 0, 0.66 * k, 0, 0.04 * k, 0.22 * k, 0.18 * k);
    }
    this.limb(fig, "l", -0.1 * k, 0.64 * k, k, bone, 0.42);
    this.limb(fig, "r", 0.1 * k, 0.64 * k, k, bone, 0.42);
    if (wight) {
      const cloak = add(fig.root, box, m.cloth, 0, 1.08 * k, -0.14 * k, 0.42 * k, 0.7 * k, 0.08 * k);
      fig.parts.cloak = cloak;
    }
  }

  private robe(
    fig: Figure,
    k: number,
    m: { cloth: THREE.Material; skin: THREE.Material; iron: THREE.Material; gold: THREE.Material; bone: THREE.Material; hide: THREE.Material; banner: THREE.Material },
    kind: FigureKind,
  ) {
    const mystic = kind === "npc-maera";
    const dark = kind === "npc-vesh" || kind === "cultist";
    const robeMat = mystic ? m.banner : dark ? m.hide : m.cloth;
    const torso = add(fig.root, robeGeo, robeMat, 0, 0.08 * k, 0, k, k, k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    add(torso, box, mystic ? m.gold : m.iron, 0, 0.72, 0.12, 0.28, 0.08, 0.08, 0, 0, 0, false);
    const head = add(fig.root, sph, m.skin, 0, 1.62 * k, 0.05 * k, 0.3 * k, 0.32 * k, 0.28 * k);
    fig.parts.head = head;
    this.eyes(head, dark, 0.9);
    add(fig.root, hoodGeo, robeMat, 0, 1.52 * k, -0.02 * k, 1.15 * k, 1.05 * k, 1.15 * k);
    this.arms(fig, 0.28 * k, 1.3 * k, k, robeMat, m.skin);
    const w = fig.parts.weapon;
    if (w) {
      add(w, cyl, mystic ? m.gold : m.bone, 0, 0.32 * k, 0, 0.045 * k, 1.15 * k, 0.045 * k);
      add(w, octa, mystic ? m.gold : m.iron, 0, 0.95 * k, 0, 0.22 * k, 0.28 * k, 0.22 * k);
    }
    this.limb(fig, "l", -0.1 * k, 0.42 * k, k, robeMat, 0.28);
    this.limb(fig, "r", 0.1 * k, 0.42 * k, k, robeMat, 0.28);
    const cloak = add(fig.root, box, robeMat, 0, 1.08 * k, -0.22 * k, 0.55 * k, 0.95 * k, 0.08 * k);
    fig.parts.cloak = cloak;
  }

  private brute(fig: Figure, k: number, m: { hide: THREE.Material; bone: THREE.Material; iron: THREE.Material; ember: THREE.Material }, guardian: boolean) {
    const torso = add(fig.root, torsoGeo, m.hide, 0, 0.72 * k, 0.04 * k, 1.45 * k, 1.2 * k, 1.2 * k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    add(torso, box, m.bone, 0, 0.42, 0.32, 0.7, 0.45, 0.16);
    const head = add(fig.root, sph, m.hide, 0, 1.78 * k, 0.2 * k, 0.46 * k, 0.4 * k, 0.44 * k);
    fig.parts.head = head;
    this.eyes(head, true, 1.1);
    add(head, cone, m.bone, -0.24, 0.36, 0.08, 0.14 * k, 0.4 * k, 0.14 * k, 0.2);
    add(head, cone, m.bone, 0.24, 0.36, 0.08, 0.14 * k, 0.4 * k, 0.14 * k, 0.2);
    this.arms(fig, 0.55 * k, 1.4 * k, k * 1.15, m.hide);
    const w = fig.parts.weapon;
    if (w) {
      add(w, cyl, m.iron, 0, 0.22 * k, 0, 0.1 * k, 1.15 * k, 0.1 * k);
      add(w, box, m.bone, 0, 0.82 * k, 0, 0.32 * k, 0.38 * k, 0.24 * k);
    }
    this.limb(fig, "l", -0.2 * k, 0.72 * k, k, m.hide, 0.5);
    this.limb(fig, "r", 0.2 * k, 0.72 * k, k, m.hide, 0.5);
    if (guardian) add(fig.root, tor, m.ember, 0, 1.45 * k, 0, 1.25 * k, 1.25 * k, 1.25 * k, Math.PI / 2);
  }

  private boss(
    fig: Figure,
    k: number,
    m: { hide: THREE.Material; iron: THREE.Material; gold: THREE.Material; bone: THREE.Material; ember: THREE.Material; cloth: THREE.Material; banner: THREE.Material },
  ) {
    const torso = add(fig.root, torsoGeo, m.hide, 0, 0.85 * k, 0.06 * k, 1.55 * k, 1.4 * k, 1.3 * k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    plates(torso, m.iron, m.gold, 5);
    const head = add(fig.root, sph, m.hide, 0, 2.18 * k, 0.16 * k, 0.52 * k, 0.52 * k, 0.48 * k);
    fig.parts.head = head;
    this.eyes(head, true, 1.2);
    add(head, cone, m.bone, -0.3, 0.45, 0.04, 0.16 * k, 0.58 * k, 0.16 * k, 0.15);
    add(head, cone, m.bone, 0.3, 0.45, 0.04, 0.16 * k, 0.58 * k, 0.16 * k, 0.15);
    add(head, cone, m.iron, 0, 0.52, -0.08, 0.18 * k, 0.48 * k, 0.18 * k, 0.2);
    const lWing = new THREE.Group();
    lWing.position.set(-0.2 * k, 1.7 * k, -0.18 * k);
    fig.root.add(lWing);
    fig.parts.lWing = lWing;
    const wingMat = (m.banner as THREE.MeshStandardMaterial).clone();
    wingMat.side = THREE.DoubleSide;
    wingMat.transparent = true;
    wingMat.opacity = 0.88;
    add(lWing, wingGeo, wingMat, 0, 0, 0, 1.6 * k, 1.3 * k, 1, 0.15, 0.15, 0.35);
    const rWing = new THREE.Group();
    rWing.position.set(0.2 * k, 1.7 * k, -0.18 * k);
    fig.root.add(rWing);
    fig.parts.rWing = rWing;
    add(rWing, wingGeo, wingMat, 0, 0, 0, -1.6 * k, 1.3 * k, 1, 0.15, -0.15, -0.35);
    this.arms(fig, 0.6 * k, 1.75 * k, k * 1.15, m.hide);
    const w = fig.parts.weapon;
    if (w) {
      add(w, cyl, m.iron, 0, 0.32 * k, 0, 0.08 * k, 1.45 * k, 0.08 * k);
      add(w, box, m.gold, 0.1 * k, 1.08 * k, 0, 0.42 * k, 0.4 * k, 0.1 * k);
      add(w, cone, m.gold, 0.34 * k, 1.08 * k, 0, 0.22 * k, 0.48 * k, 0.08 * k, 0, 0, Math.PI / 2);
    }
    this.limb(fig, "l", -0.22 * k, 0.88 * k, k, m.hide, 0.55);
    this.limb(fig, "r", 0.22 * k, 0.88 * k, k, m.hide, 0.55);
    const cloak = add(fig.root, box, m.cloth, 0, 1.4 * k, -0.34 * k, 0.85 * k, 1.25 * k, 0.1 * k);
    fig.parts.cloak = cloak;
  }

  private plate(
    fig: Figure,
    k: number,
    m: { iron: THREE.Material; gold: THREE.Material; cloth: THREE.Material; skin: THREE.Material; leather: THREE.Material; banner: THREE.Material },
  ) {
    const torso = add(fig.root, torsoGeo, m.iron, 0, 0.7 * k, 0, 1.05 * k, 1.02 * k, 0.95 * k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    plates(torso, m.iron, m.gold, 4);
    const head = add(fig.root, sph, m.skin, 0, 1.64 * k, 0.04 * k, 0.3 * k, 0.32 * k, 0.28 * k);
    fig.parts.head = head;
    this.eyes(head, false, 0.9);
    add(head, box, m.iron, 0, 0.12, 0.04, 0.92, 0.55, 0.95);
    add(head, box, m.gold, 0, 0.08, 0.42, 0.18, 0.12, 0.08, 0, 0, 0, false);
    this.arms(fig, 0.4 * k, 1.36 * k, k, m.iron, m.leather);
    const w = fig.parts.weapon;
    if (w) {
      add(w, box, m.iron, 0.12 * k, 0.02 * k, 0.1 * k, 0.48 * k, 0.62 * k, 0.08 * k);
      add(w, box, m.gold, 0.12 * k, 0.02 * k, 0.15 * k, 0.18 * k, 0.55 * k, 0.04 * k, 0, 0, 0, false);
    }
    this.limb(fig, "l", -0.14 * k, 0.7 * k, k, m.iron);
    this.limb(fig, "r", 0.14 * k, 0.7 * k, k, m.iron);
    const cloak = add(fig.root, box, m.banner, 0, 1.08 * k, -0.24 * k, 0.52 * k, 0.88 * k, 0.08 * k);
    fig.parts.cloak = cloak;
  }

  private monk(fig: Figure, k: number, m: { cloth: THREE.Material; skin: THREE.Material; leather: THREE.Material; banner: THREE.Material }) {
    const torso = add(fig.root, robeGeo, m.cloth, 0, 0.12 * k, 0, 0.85 * k, 0.92 * k, 0.85 * k);
    torso.userData.y0 = torso.position.y;
    fig.parts.torso = torso;
    const head = add(fig.root, sph, m.skin, 0, 1.58 * k, 0.04 * k, 0.3 * k, 0.32 * k, 0.28 * k);
    fig.parts.head = head;
    this.eyes(head, false, 0.9);
    this.arms(fig, 0.3 * k, 1.3 * k, k, m.skin);
    this.limb(fig, "l", -0.12 * k, 0.7 * k, k, m.cloth, 0.4);
    this.limb(fig, "r", 0.12 * k, 0.7 * k, k, m.cloth, 0.4);
    add(fig.root, box, m.leather, 0, 0.88 * k, 0.12 * k, 0.42 * k, 0.08 * k, 0.08 * k);
    add(fig.root, box, m.banner, 0, 1.2 * k, 0.14 * k, 0.12 * k, 0.22 * k, 0.04 * k, 0, 0, 0, false);
  }
}

export function figureKindFor(id: string, isNpc = false): FigureKind {
  if (isNpc) {
    if (id === "ryn") return "npc-ryn";
    if (id === "kael") return "npc-kael";
    if (id === "maera") return "npc-maera";
    if (id === "vesh") return "npc-vesh";
    if (id === "brann") return "npc-brann";
    if (id === "io") return "npc-io";
    return "npc-ryn";
  }
  if (id === "barbarian") return "barbarian";
  if (id === "imp") return "imp";
  if (id === "skeleton") return "skeleton";
  if (id === "cultist") return "cultist";
  if (id === "brute") return "brute";
  if (id === "wight") return "wight";
  if (id === "guardian") return "guardian";
  if (id === "maltheon" || id === "icewarden" || id === "flamechorus" || id === "nihl" || id === "worldboss" || id === "raid") return "boss";
  return "barbarian";
}
