import * as THREE from "three";
import type { Level } from "../dungeon";
import type { TextureKit } from "./textures";
import type { Quality } from "./quality";
import type { VfxWorld } from "./vfx";

const box = new THREE.BoxGeometry(1, 1, 1);
const cyl = new THREE.CylinderGeometry(0.5, 0.5, 1, 10);
const cylT = new THREE.CylinderGeometry(0.28, 0.5, 1, 8);
const cone = new THREE.ConeGeometry(0.5, 1, 4);
const sph = new THREE.SphereGeometry(0.5, 10, 8);
const plane = new THREE.PlaneGeometry(1, 1);
const tor = new THREE.TorusGeometry(0.5, 0.1, 6, 14);
const octa = new THREE.OctahedronGeometry(0.5, 0);

function peakedRoofGeo() {
  const hw = 0.5,
    hd = 0.5,
    h = 1;
  const pos = new Float32Array([-hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd, 0, h, -hd, 0, h, hd]);
  const idx = [0, 5, 4, 0, 3, 5, 1, 4, 5, 1, 5, 2, 0, 4, 1, 3, 2, 5];
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 0.5, 1, 0.5, 0]);
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}
const roofGeo = peakedRoofGeo();

function mistTex(warm: boolean) {
  const cv = document.createElement("canvas");
  cv.width = 128;
  cv.height = 128;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
  g.addColorStop(0, warm ? "rgba(210,140,80,0.4)" : "rgba(160,170,180,0.32)");
  g.addColorStop(0.55, warm ? "rgba(80,40,20,0.12)" : "rgba(30,40,50,0.1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(cv);
  t.needsUpdate = true;
  return t;
}

export class WorldKit {
  scene: THREE.Scene;
  wallsGroup: THREE.Group;
  decorGroup: THREE.Group;
  kit: TextureKit;
  quality: Quality;
  ground: THREE.Mesh | null = null;
  hemi: THREE.HemisphereLight | null = null;
  dir: THREE.DirectionalLight | null = null;
  rim: THREE.DirectionalLight | null = null;
  lights: THREE.Light[] = [];
  torches: { flame: THREE.Object3D; light: THREE.PointLight | null; x: number; z: number; base: number }[] = [];
  playerLight: THREE.PointLight | null = null;
  fillWarm: THREE.PointLight | null = null;
  fillCool: THREE.PointLight | null = null;
  private backdrop = new THREE.Group();

  constructor(scene: THREE.Scene, wallsGroup: THREE.Group, decorGroup: THREE.Group, kit: TextureKit, quality: Quality) {
    this.scene = scene;
    this.wallsGroup = wallsGroup;
    this.decorGroup = decorGroup;
    this.kit = kit;
    this.quality = quality;
    scene.add(this.backdrop);
  }

  clear() {
    while (this.wallsGroup.children.length) this.wallsGroup.remove(this.wallsGroup.children[0]!);
    while (this.decorGroup.children.length) this.decorGroup.remove(this.decorGroup.children[0]!);
    while (this.backdrop.children.length) this.backdrop.remove(this.backdrop.children[0]!);
    if (this.ground) {
      this.scene.remove(this.ground);
      this.ground.geometry.dispose();
      this.ground = null;
    }
    for (const l of this.lights) this.scene.remove(l);
    this.lights = [];
    this.torches = [];
    this.hemi = null;
    this.dir = null;
    this.rim = null;
    this.playerLight = null;
    this.fillWarm = null;
    this.fillCool = null;
  }

  private put(
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
    group: THREE.Group = this.decorGroup,
  ) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.scale.set(sx, sy, sz);
    m.rotation.set(rx, ry, rz);
    m.castShadow = shadow;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }

  dress(level: Level, vfx: VfxWorld) {
    this.clear();
    const hell = level.biome === "hell" || level.biome === "rift";
    const ice = level.biome === "ice" || level.biome === "flood";
    const fogCol = hell ? 0x2c140e : ice ? 0x142028 : 0x1c1814;
    this.scene.fog = new THREE.FogExp2(fogCol, level.fog * (hell ? 0.48 : 0.55));
    this.scene.background = new THREE.Color(fogCol);

    const floorMat = this.kit.floorFor(level.biome).clone();
    if (hell) {
      floorMat.color.setRGB(1.45, 1.12, 0.92);
      floorMat.emissive = new THREE.Color(0x3a1408);
      floorMat.emissiveIntensity = 0.18;
    }
    if (floorMat.map) {
      const rep = Math.max(5, Math.round(Math.max(level.bounds.w, level.bounds.d) / 5.5));
      floorMat.map = floorMat.map.clone();
      floorMat.map.wrapS = floorMat.map.wrapT = THREE.RepeatWrapping;
      floorMat.map.repeat.set(rep, rep);
      if (floorMat.normalMap) {
        floorMat.normalMap = floorMat.normalMap.clone();
        floorMat.normalMap.wrapS = floorMat.normalMap.wrapT = THREE.RepeatWrapping;
        floorMat.normalMap.repeat.set(rep, rep);
      }
    }
    const geo = new THREE.PlaneGeometry(level.bounds.w + 36, level.bounds.d + 36, 1, 1);
    geo.rotateX(-Math.PI / 2);
    const ground = new THREE.Mesh(geo, floorMat);
    ground.position.set(level.bounds.x, 0, level.bounds.z);
    ground.receiveShadow = true;
    this.ground = ground;
    this.scene.add(ground);

    this.hemi = new THREE.HemisphereLight(hell ? 0xffc8a0 : ice ? 0xc8d8e8 : 0xe8e4dc, hell ? 0x4a2214 : 0x2e261c, hell ? 1.05 : 1.12);
    this.dir = new THREE.DirectionalLight(hell ? 0xffb07a : ice ? 0xd0dcec : 0xffe2c0, hell ? 1.45 : 1.58);
    this.dir.position.set(8, 14, 8);
    this.dir.castShadow = this.quality.shadows;
    this.dir.shadow.mapSize.set(this.quality.shadowMap, this.quality.shadowMap);
    const s = 18;
    this.dir.shadow.camera.left = -s;
    this.dir.shadow.camera.right = s;
    this.dir.shadow.camera.top = s;
    this.dir.shadow.camera.bottom = -s;
    this.dir.shadow.camera.near = 2;
    this.dir.shadow.camera.far = 60;
    this.dir.shadow.bias = -0.0006;
    this.dir.shadow.normalBias = 0.032;
    this.dir.shadow.intensity = 0.48;
    this.dir.shadow.radius = 3.2;
    this.dir.shadow.camera.updateProjectionMatrix();
    this.rim = new THREE.DirectionalLight(hell ? 0xff6644 : 0xe8d0a0, 0.72);
    this.rim.position.set(-8, 7, -8);
    const amb = new THREE.AmbientLight(hell ? 0x3a2418 : 0x3c342c, Math.max(0.58, level.ambient * 1.35));
    this.scene.add(this.hemi, this.dir, this.dir.target, this.rim, amb);
    this.lights.push(this.hemi, this.dir, this.rim, amb);

    this.playerLight = new THREE.PointLight(0xffc090, 14, 13, 1.45);
    this.playerLight.position.set(level.playerX, 2.4, level.playerZ);
    this.scene.add(this.playerLight);
    this.lights.push(this.playerLight);

    this.fillWarm = new THREE.PointLight(hell ? 0xff8844 : 0xffd2a8, 9, 16, 1.5);
    this.fillWarm.position.set(level.playerX + 4.2, 3.4, level.playerZ + 3.2);
    this.scene.add(this.fillWarm);
    this.lights.push(this.fillWarm);

    if (!this.quality.low) {
      this.fillCool = new THREE.PointLight(hell ? 0xff6622 : 0xa8b8c8, 5.5, 15, 1.5);
      this.fillCool.position.set(level.playerX - 4.4, 3.0, level.playerZ - 3.4);
      this.scene.add(this.fillCool);
      this.lights.push(this.fillCool);
    }

    const wallMat = this.kit.mats.wall!;
    const trim = this.kit.mats.iron!;
    const gold = this.kit.mats.gold!;
    for (const w of level.walls) {
      const long = Math.max(w.w, w.d);
      const isBuilding = !!level.isTown && w.w > 3 && w.d > 3;
      const isCurb = long > 18 && !isBuilding;
      if (isBuilding) {
        const cathedral = Math.abs(w.x) < 1 && w.z < -8;
        this.gothicBuilding(w.x, w.z, w.w, w.d, cathedral);
        continue;
      }
      if (isCurb) {
        this.plazaCurb(w);
        continue;
      }
      this.dungeonWall(w, hell, ice);
    }

    this.backdropBuildings(level, hell, ice);
    this.groundFog(level, hell, ice);
    this.floorDecals(level, hell, ice);

    if (level.isTown) this.dressTown(level, vfx, gold, trim);
    else this.dressDungeon(level, vfx, trim, hell, ice);

    vfx.seedMotes(level.biome, level.bounds.x, level.bounds.z);
  }

  followShadows(x: number, z: number) {
    if (!this.dir) return;
    this.dir.position.set(x + 8, 14, z + 8);
    this.dir.target.position.set(x, 0.6, z);
    this.dir.target.updateMatrixWorld();
    if (this.rim) this.rim.position.set(x - 8, 7, z - 8);
    if (this.playerLight) this.playerLight.position.set(x + 0.6, 2.45, z + 0.55);
    if (this.fillWarm) this.fillWarm.position.set(x + 4.2, 3.4, z + 3.2);
    if (this.fillCool) this.fillCool.position.set(x - 4.4, 3.0, z - 3.4);
  }

  flicker(t: number, px: number, pz: number) {
    let n = 0;
    for (const tr of this.torches) {
      const d = Math.hypot(tr.x - px, tr.z - pz);
      const near = d < 20;
      tr.flame.scale.setScalar(0.88 + Math.sin(t * 12 + tr.x) * 0.14);
      tr.flame.rotation.y = Math.sin(t * 7 + tr.z) * 0.15;
      if (tr.light) {
        tr.light.visible = near && n < this.quality.maxLights;
        if (tr.light.visible) {
          tr.light.intensity = tr.base * (0.9 + Math.sin(t * 9 + tr.z) * 0.1);
          n++;
        }
      }
    }
  }

  private gothicBuilding(x: number, z: number, w: number, d: number, cathedral: boolean) {
    const wall = this.kit.mats.wall!;
    const iron = this.kit.mats.iron!;
    const gold = this.kit.mats.gold!;
    const roof = this.kit.mats.roof!;
    const h = cathedral ? 6.4 : 4.7;
    this.put(box, wall, x, 0.18, z, w + 0.4, 0.36, d + 0.4);
    this.put(box, wall, x, h / 2, z, w, h, d);
    this.put(box, iron, x, h, z, w + 0.32, 0.16, d + 0.32);
    this.put(box, wall, x, h + 0.38, z, w * 0.9, 0.72, d * 0.9);
    this.put(box, iron, x, h * 0.52, z, w + 0.18, 0.12, d + 0.18, 0, 0, 0, false);
    const roofMesh = this.put(roofGeo, roof, x, h + 0.7, z, w + 0.7, cathedral ? 2.6 : 1.85, d + 0.7);
    roofMesh.castShadow = true;
    const corners: [number, number][] = [
      [x - w / 2, z - d / 2],
      [x + w / 2, z - d / 2],
      [x - w / 2, z + d / 2],
      [x + w / 2, z + d / 2],
    ];
    for (const [cx, cz] of corners) {
      this.put(cylT, wall, cx, 1.7, cz, 0.7, 3.4, 0.7);
      this.put(box, iron, cx, 3.45, cz, 0.85, 0.14, 0.85, 0, 0, 0, false);
    }
    const glow = new THREE.MeshStandardMaterial({
      color: 0xffd8a0,
      emissive: 0xffcc88,
      emissiveIntensity: 1.15,
      roughness: 0.35,
    });
    const faces: [number, number, number, number][] = [
      [x, 2.15, z + d / 2 + 0.04, 0],
      [x, 2.15, z - d / 2 - 0.04, Math.PI],
      [x + w / 2 + 0.04, 2.15, z, Math.PI / 2],
      [x - w / 2 - 0.04, 2.15, z, -Math.PI / 2],
    ];
    for (const [wx, wy, wz, ry] of faces) {
      this.put(box, glow, wx, wy, wz, 0.55, 0.95, 0.08, 0, ry, 0, false);
      this.put(box, iron, wx, wy, wz, 0.7, 1.15, 0.05, 0, ry, 0, false);
      this.put(box, glow, wx, wy + 1.35, wz, 0.42, 0.7, 0.07, 0, ry, 0, false);
    }
    this.put(box, this.kit.mats.wood!, x, 1.15, z + d / 2 + 0.06, 0.85, 2.1, 0.1);
    this.put(tor, iron, x, 2.05, z + d / 2 + 0.08, 0.9, 0.9, 0.35, Math.PI / 2, 0, 0, false);
    if (cathedral) {
      this.put(cyl, wall, x - w * 0.42, 4.4, z - d * 0.15, 1.15, 5.2, 1.15);
      this.put(cyl, wall, x + w * 0.42, 4.4, z - d * 0.15, 1.15, 5.2, 1.15);
      this.put(cone, roof, x - w * 0.42, 7.4, z - d * 0.15, 1.6, 2.4, 1.6);
      this.put(cone, roof, x + w * 0.42, 7.4, z - d * 0.15, 1.6, 2.4, 1.6);
      this.put(box, gold, x - w * 0.42, 8.7, z - d * 0.15, 0.12, 0.5, 0.12, 0, 0, 0, false);
      this.put(box, gold, x + w * 0.42, 8.7, z - d * 0.15, 0.12, 0.5, 0.12, 0, 0, 0, false);
      this.put(sph, glow, x, 3.4, z + d / 2 + 0.05, 1.15, 1.15, 0.12, 0, 0, 0, false);
      this.put(tor, gold, x, 3.4, z + d / 2 + 0.08, 1.4, 1.4, 0.4, 0, 0, 0, false);
    }
    const battlements = Math.max(3, Math.round(w / 1.4));
    for (let i = 0; i < battlements; i++) {
      const t = (i + 0.5) / battlements - 0.5;
      this.put(box, wall, x + t * w, h + 0.95, z + d / 2 - 0.12, 0.38, 0.55, 0.28, 0, 0, 0, false);
    }
    this.hangBanner(x + w * 0.28, z + d / 2 + 0.08, 2.6);
    this.addTorch(x + w * 0.42, z + d * 0.42, 2.35);
  }

  private plazaCurb(w: { x: number; z: number; w: number; d: number }) {
    const wall = this.kit.mats.wall!;
    const iron = this.kit.mats.iron!;
    const alongX = w.w >= w.d;
    this.put(box, wall, w.x, 0.38, w.z, w.w, 0.76, w.d, 0, 0, 0, false, this.wallsGroup);
    const len = alongX ? w.w : w.d;
    const n = Math.max(4, Math.round(len / 4.2));
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n - 0.5;
      const x = alongX ? w.x + t * w.w : w.x;
      const z = alongX ? w.z : w.z + t * w.d;
      this.put(cyl, wall, x, 1.15, z, 0.55, 2.3, 0.55);
      this.put(box, iron, x, 2.32, z, 0.7, 0.12, 0.7, 0, 0, 0, false);
      this.put(sph, this.kit.mats.gold!, x, 2.5, z, 0.22, 0.22, 0.22, 0, 0, 0, false);
    }
  }

  private dungeonWall(w: { x: number; z: number; w: number; d: number }, hell: boolean, ice: boolean) {
    const wall = hell ? this.kit.mats.hell! : ice ? this.kit.mats.ice! : this.kit.mats.wall!;
    const h = 3.15;
    this.put(box, wall, w.x, h / 2, w.z, w.w, h, w.d, 0, 0, 0, true, this.wallsGroup);
    this.put(box, this.kit.mats.iron!, w.x, h + 0.08, w.z, w.w + 0.08, 0.14, w.d + 0.08, 0, 0, 0, false);
  }

  private hangBanner(x: number, z: number, y: number) {
    const pole = this.put(cyl, this.kit.mats.iron!, x, y + 0.15, z, 0.08, 0.7, 0.08, 0, 0, 0, false);
    void pole;
    this.put(plane, this.kit.mats.banner!, x, y - 0.55, z + 0.02, 0.7, 1.15, 1, 0, 0, 0, false);
  }

  private addTorch(x: number, z: number, y = 1.7) {
    const iron = this.kit.mats.iron!;
    const ember = this.kit.mats.ember!;
    this.put(box, iron, x, y, z, 0.1, 0.55, 0.1, 0, 0, 0, false);
    this.put(cyl, iron, x, y + 0.28, z, 0.3, 0.12, 0.3, 0, 0, 0, false);
    const flame = this.put(cone, ember, x, y + 0.52, z, 0.22, 0.48, 0.22, 0, 0, 0, false);
    this.put(sph, ember, x, y + 0.42, z, 0.18, 0.18, 0.18, 0, 0, 0, false);
    let light: THREE.PointLight | null = null;
    const base = 16;
    if (this.torches.length < this.quality.maxLights + 8) {
      light = new THREE.PointLight(0xff8844, base, 11, 1.5);
      light.position.set(x, y + 0.58, z);
      this.scene.add(light);
      this.lights.push(light);
    }
    this.torches.push({ flame, light, x, z, base });
  }

  private groundFog(level: Level, hell: boolean, ice: boolean) {
    const mat = new THREE.MeshBasicMaterial({
      map: mistTex(hell),
      transparent: true,
      opacity: hell ? 0.16 : ice ? 0.14 : 0.12,
      depthWrite: false,
      fog: true,
    });
    const b = level.bounds;
    const spots: [number, number][] = [
      [b.x - b.w * 0.38, b.z - b.d * 0.38],
      [b.x + b.w * 0.38, b.z - b.d * 0.38],
      [b.x - b.w * 0.38, b.z + b.d * 0.38],
      [b.x + b.w * 0.38, b.z + b.d * 0.38],
    ];
    for (const [x, z] of spots) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(11, 11), mat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.14, z);
      this.decorGroup.add(m);
    }
  }

  private floorDecals(level: Level, hell: boolean, ice: boolean) {
    const blood = new THREE.MeshBasicMaterial({ color: 0x6a1810, transparent: true, opacity: 0.22, depthWrite: false });
    const scorch = new THREE.MeshBasicMaterial({ color: 0x4a3024, transparent: true, opacity: 0.16, depthWrite: false });
    const moss = new THREE.MeshBasicMaterial({ color: 0x3a4a30, transparent: true, opacity: 0.18, depthWrite: false });
    const n = this.quality.low ? 8 : 16;
    for (let i = 0; i < n; i++) {
      const x = level.bounds.x + (Math.sin(i * 2.7 + level.seed) * level.bounds.w) / 2.6;
      const z = level.bounds.z + (Math.cos(i * 1.9 + level.seed) * level.bounds.d) / 2.6;
      const mat = hell ? scorch : ice ? moss : i % 3 === 0 ? blood : moss;
      const s = 0.8 + (i % 5) * 0.35;
      this.put(plane, mat, x, 0.03, z, s, s * 0.7, 1, -Math.PI / 2, i, 0, false);
    }
    if (hell) {
      for (let i = 0; i < 7; i++) {
        const x = level.bounds.x + (i - 3) * 2.4;
        const z = level.bounds.z + Math.sin(i * 1.3) * 4;
        this.put(box, this.kit.mats.ember!, x, 0.02, z, 0.12 + (i % 3) * 0.08, 0.04, 2.2 + (i % 2), 0, i * 0.4, 0, false);
      }
    }
  }

  private dressTown(level: Level, vfx: VfxWorld, gold: THREE.Material, trim: THREE.Material) {
    this.brazier(0, -1.2);
    this.saintStatue(-5.4, -4.6);
    this.fountain(4.6, -4.4);
    this.crateStack(-6.2, 6.4);
    this.crateStack(6.4, 6.2);
    this.crateStack(-7.5, -6.8);
    this.addTorch(-3.8, 6.2, 1.6);
    this.addTorch(3.8, 6.2, 1.6);
    this.addTorch(-8.4, 0.2, 1.6);
    this.addTorch(8.4, 0.2, 1.6);
    this.lamp(-4.2, 3.6);
    this.lamp(4.2, 3.6);
    this.lamp(-4.2, -6.5);
    this.lamp(4.2, -6.5);
    vfx.windowShaft(0, 4.2, -9.4, 0);
    vfx.windowShaft(-12, 3.4, -5.2, 0);
    vfx.windowShaft(12, 3.4, -5.2, 0);
    this.put(cyl, this.kit.mats.stone!, 0, 0.08, 0, 9.5, 0.1, 9.5, 0, 0, 0, false);
    this.put(tor, gold, 0, 0.12, 0, 8.4, 8.4, 0.6, Math.PI / 2, 0, 0, false);
    void level;
    void trim;
  }

  private lamp(x: number, z: number) {
    this.put(cyl, this.kit.mats.iron!, x, 1.15, z, 0.12, 2.3, 0.12);
    this.put(box, this.kit.mats.iron!, x, 2.35, z, 0.38, 0.12, 0.38, 0, 0, 0, false);
    const flame = this.put(sph, this.kit.mats.ember!, x, 2.55, z, 0.22, 0.22, 0.22, 0, 0, 0, false);
    const light = new THREE.PointLight(0xff8844, 12, 10, 1.5);
    light.position.set(x, 2.6, z);
    this.scene.add(light);
    this.lights.push(light);
    this.torches.push({ flame, light, x, z, base: 12 });
  }

  private brazier(x: number, z: number) {
    this.put(cyl, this.kit.mats.iron!, x, 0.22, z, 1.35, 0.44, 1.35);
    this.put(cylT, this.kit.mats.iron!, x, 0.7, z, 1.15, 0.55, 1.15);
    const fire = this.put(sph, this.kit.mats.ember!, x, 1.15, z, 0.7, 0.7, 0.7, 0, 0, 0, false);
    this.put(cone, this.kit.mats.ember!, x, 1.45, z, 0.45, 0.7, 0.45, 0, 0, 0, false);
    const blaze = new THREE.PointLight(0xff7733, 26, 16, 1.45);
    blaze.position.set(x, 1.7, z);
    this.scene.add(blaze);
    this.lights.push(blaze);
    this.torches.push({ flame: fire, light: blaze, x, z, base: 26 });
  }

  private saintStatue(x: number, z: number) {
    this.put(cyl, this.kit.mats.stone!, x, 0.2, z, 1.1, 0.4, 1.1);
    this.put(box, this.kit.mats.stone!, x, 1.15, z, 0.55, 1.5, 0.4);
    this.put(sph, this.kit.mats.stone!, x, 2.05, z, 0.42, 0.48, 0.4);
    this.put(box, this.kit.mats.iron!, x + 0.28, 1.35, z, 0.12, 1.1, 0.08, 0, 0, -0.4);
    this.put(box, this.kit.mats.gold!, x, 2.38, z, 0.22, 0.16, 0.22, 0, 0, 0, false);
  }

  private fountain(x: number, z: number) {
    this.put(cyl, this.kit.mats.stone!, x, 0.18, z, 1.8, 0.36, 1.8);
    this.put(cyl, this.kit.mats.iron!, x, 0.55, z, 0.45, 0.9, 0.45);
    this.put(sph, this.kit.mats.ice!, x, 1.15, z, 0.45, 0.28, 0.45, 0, 0, 0, false);
    this.put(tor, this.kit.mats.gold!, x, 0.42, z, 1.5, 1.5, 0.35, Math.PI / 2, 0, 0, false);
  }

  stall(x: number, z: number, ry: number) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    const wood = this.kit.mats.wood!;
    const cloth = this.kit.mats.banner!;
    const body = new THREE.Mesh(box, wood);
    body.position.y = 0.55;
    body.scale.set(1.8, 0.7, 1.1);
    body.castShadow = true;
    g.add(body);
    const roof = new THREE.Mesh(box, cloth);
    roof.position.set(0, 1.45, 0);
    roof.scale.set(2.0, 0.08, 1.3);
    roof.rotation.x = -0.15;
    g.add(roof);
    const pole = new THREE.Mesh(cyl, this.kit.mats.iron!);
    pole.position.set(-0.85, 1.05, -0.45);
    pole.scale.set(0.08, 1.1, 0.08);
    g.add(pole);
    const pole2 = pole.clone();
    pole2.position.x = 0.85;
    g.add(pole2);
    this.decorGroup.add(g);
  }

  private crateStack(x: number, z: number) {
    this.put(box, this.kit.mats.wood!, x, 0.28, z, 0.7, 0.55, 0.55);
    this.put(box, this.kit.mats.wood!, x + 0.4, 0.22, z + 0.15, 0.5, 0.42, 0.45, 0, 0.4, 0);
    this.put(cyl, this.kit.mats.wood!, x - 0.45, 0.32, z + 0.1, 0.5, 0.62, 0.5);
  }

  anvil(x: number, z: number) {
    this.put(box, this.kit.mats.wood!, x, 0.28, z, 1.15, 0.55, 0.7);
    this.put(box, this.kit.mats.iron!, x, 0.72, z, 0.85, 0.28, 0.35);
    this.put(box, this.kit.mats.iron!, x + 0.35, 0.78, z, 0.35, 0.16, 0.18);
    this.put(sph, this.kit.mats.ember!, x - 0.55, 0.22, z + 0.4, 0.18, 0.18, 0.18, 0, 0, 0, false);
  }

  mysticTable(x: number, z: number) {
    this.put(cyl, this.kit.mats.wood!, x, 0.45, z, 1.1, 0.9, 1.1);
    this.put(octa, this.kit.mats.crystal!, x, 1.15, z, 0.45, 0.7, 0.45);
    const l = new THREE.PointLight(0x66aaff, 10, 8, 1.5);
    l.position.set(x, 1.4, z);
    this.scene.add(l);
    this.lights.push(l);
  }

  private dressDungeon(level: Level, vfx: VfxWorld, trim: THREE.Material, hell: boolean, ice: boolean) {
    const glowCol = ice ? 0x88ccee : hell ? 0xff6622 : 0xffd8a0;
    const glowEmi = ice ? 0x226688 : hell ? 0xff3311 : 0xffcc88;
    const glow = new THREE.MeshStandardMaterial({ color: glowCol, emissive: glowEmi, emissiveIntensity: 1.15, roughness: 0.4 });
    for (const r of level.rooms) {
      const inset = 1.05;
      const pts: [number, number][] = [
        [r.x - r.w / 2 + inset, r.z - r.d / 2 + inset],
        [r.x + r.w / 2 - inset, r.z - r.d / 2 + inset],
        [r.x - r.w / 2 + inset, r.z + r.d / 2 - inset],
        [r.x + r.w / 2 - inset, r.z + r.d / 2 - inset],
      ];
      for (const [px, pz] of pts) {
        this.put(cylT, this.kit.mats.wall!, px, 1.55, pz, 0.7, 3.1, 0.7);
        this.put(box, this.kit.mats.gold!, px, 3.2, pz, 0.85, 0.16, 0.85, 0, 0, 0, false);
        this.put(cyl, this.kit.mats.iron!, px, 0.18, pz, 0.95, 0.36, 0.95, 0, 0, 0, false);
      }
      this.addTorch(r.x + r.w * 0.28, r.z - r.d * 0.28, 2.2);
      this.addTorch(r.x - r.w * 0.28, r.z + r.d * 0.22, 2.2);
      if (r.kind === "boss" || r.kind === "elite") {
        const l = new THREE.PointLight(r.kind === "boss" ? 0xff4422 : 0xffaa55, 14, 14, 1.5);
        l.position.set(r.x, 2.8, r.z);
        this.scene.add(l);
        this.lights.push(l);
        this.put(tor, hell ? this.kit.mats.ember! : this.kit.mats.gold!, r.x, 0.06, r.z, 4.2, 4.2, 0.8, Math.PI / 2, 0, 0, false);
      }
      const wx = r.x;
      const wz = r.z - r.d / 2 + 0.1;
      this.put(box, glow, wx, 2.2, wz, 1.15, 1.4, 0.12, 0, 0, 0, false);
      vfx.windowShaft(wx, 2.6, wz + 0.7, 0);
      this.put(tor, trim, r.x, 2.9, r.z - r.d / 2 + 0.2, 2.2, 1.4, 0.55, 0, 0, 0, false);
      if (r.kind === "combat" || r.kind === "elite") {
        this.put(box, this.kit.mats.bone!, r.x - r.w * 0.32, 0.18, r.z + r.d * 0.28, 0.7, 0.28, 0.45, 0, 0.5, 0, false);
        this.put(cyl, this.kit.mats.iron!, r.x + r.w * 0.3, 1.4, r.z - r.d * 0.2, 0.55, 0.9, 0.55);
        this.put(box, this.kit.mats.wall!, r.x + r.w * 0.18, 0.55, r.z + r.d * 0.22, 1.4, 1.1, 0.45, 0, 0.3, 0);
        this.put(box, this.kit.mats.wall!, r.x - r.w * 0.22, 0.35, r.z - r.d * 0.18, 0.9, 0.7, 0.7, 0, -0.4, 0);
      }
      if (hell) {
        const lava = new THREE.MeshStandardMaterial({
          color: 0xc42810,
          emissive: 0xff3311,
          emissiveIntensity: 0.7,
          roughness: 0.55,
        });
        this.put(cyl, lava, r.x + 1.6, 0.03, r.z - 1.1, 1.5, 0.05, 1.0, 0, 0.4, 0, false);
        this.put(cyl, lava, r.x - 2.1, 0.025, r.z + 1.4, 1.0, 0.04, 1.6, 0, -0.5, 0, false);
      }
      const scorch = new THREE.MeshBasicMaterial({
        color: hell ? 0x4a2818 : 0x4a3828,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      });
      this.put(plane, scorch, r.x, 0.025, r.z, 4.2, 3.4, 1, -Math.PI / 2, 0.3, 0, false);
    }
    for (const c of level.corridors ?? []) {
      this.put(box, this.kit.mats.iron!, c.x, 2.85, c.z, Math.min(c.w, 1.2), 0.18, Math.min(c.d, 1.2), 0, 0, 0, false);
    }
  }

  makeChest(x: number, z: number): THREE.Group {
    const g = new THREE.Group();
    const wood = this.kit.mats.wood!;
    const iron = this.kit.mats.iron!;
    const gold = this.kit.mats.gold!;
    const body = new THREE.Mesh(box, wood);
    body.position.y = 0.28;
    body.scale.set(0.9, 0.52, 0.58);
    body.castShadow = true;
    g.add(body);
    const lid = new THREE.Mesh(box, wood);
    lid.position.set(0, 0.58, 0);
    lid.scale.set(0.94, 0.16, 0.62);
    g.add(lid);
    const band = new THREE.Mesh(box, iron);
    band.position.set(0, 0.32, 0.3);
    band.scale.set(0.96, 0.12, 0.06);
    g.add(band);
    const lock = new THREE.Mesh(box, gold);
    lock.position.set(0, 0.42, 0.32);
    lock.scale.set(0.14, 0.16, 0.08);
    g.add(lock);
    g.position.set(x, 0, z);
    return g;
  }

  makeShrine(x: number, z: number): THREE.Group {
    const g = new THREE.Group();
    const base = new THREE.Mesh(cyl, this.kit.mats.iron!);
    base.position.y = 0.2;
    base.scale.set(0.85, 0.4, 0.85);
    g.add(base);
    const crystal = new THREE.Mesh(octa, this.kit.mats.crystal!);
    crystal.position.y = 0.9;
    g.add(crystal);
    const ring = new THREE.Mesh(tor, this.kit.mats.gold!);
    ring.position.y = 0.7;
    ring.rotation.x = Math.PI / 2;
    ring.scale.set(1.1, 1.1, 0.7);
    g.add(ring);
    g.position.set(x, 0, z);
    return g;
  }

  makePortal(x: number, z: number, color: number): THREE.Group {
    const g = new THREE.Group();
    const iron = this.kit.mats.iron!;
    const arch = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.13, 8, 20, Math.PI), iron);
    arch.position.y = 1.2;
    arch.rotation.y = Math.PI / 4;
    g.add(arch);
    const colL = new THREE.Mesh(cyl, iron);
    colL.position.set(-0.72, 0.7, 0.72);
    colL.scale.set(0.22, 1.4, 0.22);
    g.add(colL);
    const colR = colL.clone();
    colR.position.set(0.72, 0.7, -0.72);
    g.add(colR);
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.52,
      side: THREE.DoubleSide,
    });
    const veil = new THREE.Mesh(new THREE.CircleGeometry(1.0, 20), mat);
    veil.position.y = 1.2;
    veil.rotation.y = Math.PI / 4;
    g.add(veil);
    const l = new THREE.PointLight(color, 12, 12, 1.5);
    l.position.set(0, 1.45, 0);
    g.add(l);
    g.position.set(x, 0, z);
    return g;
  }

  makeRiftstone(x: number, z: number): THREE.Group {
    const g = new THREE.Group();
    const base = new THREE.Mesh(cyl, this.kit.mats.iron!);
    base.position.y = 0.16;
    base.scale.set(1.2, 0.32, 1.2);
    g.add(base);
    const crystal = new THREE.Mesh(octa, this.kit.mats.crystal!);
    crystal.position.y = 1.2;
    crystal.scale.set(1.05, 1.75, 1.05);
    g.add(crystal);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.06, 8, 22), this.kit.mats.gold!);
    ring.position.y = 1.1;
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    const l = new THREE.PointLight(0xff5522, 16, 13, 1.5);
    l.position.set(0, 1.65, 0);
    g.add(l);
    g.position.set(x, 0, z);
    return g;
  }

  makeBarrel(x: number, z: number): THREE.Group {
    const g = new THREE.Group();
    const body = new THREE.Mesh(cyl, this.kit.mats.wood!);
    body.scale.set(0.64, 0.72, 0.64);
    body.castShadow = true;
    g.add(body);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.04, 6, 12), this.kit.mats.iron!);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.14;
    g.add(ring);
    const ring2 = ring.clone();
    ring2.position.y = -0.14;
    g.add(ring2);
    g.position.set(x, 0.36, z);
    return g;
  }

  private backdropBuildings(level: Level, hell: boolean, ice: boolean) {
    const mat = hell ? this.kit.mats.hell! : ice ? this.kit.mats.iron! : this.kit.mats.wall!;
    const roof = this.kit.mats.roof!;
    const b = level.bounds;
    const spots: [number, number, number, number][] = [
      [b.x - b.w * 0.92, b.z - b.d * 1.22, 8, 13],
      [b.x + b.w * 0.95, b.z - b.d * 1.28, 7, 11],
      [b.x, b.z - b.d * 1.45, 12, 16],
      [b.x - b.w * 1.22, b.z + b.d * 0.1, 7, 10],
      [b.x + b.w * 1.25, b.z + b.d * 0.08, 8, 12],
      [b.x - b.w * 0.55, b.z - b.d * 1.55, 5, 9],
      [b.x + b.w * 0.5, b.z - b.d * 1.5, 6, 14],
    ];
    for (const [x, z, w, h] of spots) {
      const m = new THREE.Mesh(box, mat);
      m.position.set(x, h / 2, z);
      m.scale.set(w, h, w * 0.65);
      this.backdrop.add(m);
      const r = new THREE.Mesh(roofGeo, roof);
      r.position.set(x, h, z);
      r.scale.set(w * 1.15, 3.4, w * 0.8);
      this.backdrop.add(r);
      if (h > 12) {
        const spire = new THREE.Mesh(cone, roof);
        spire.position.set(x, h + 3.6, z);
        spire.scale.set(w * 0.35, 5.5, w * 0.35);
        this.backdrop.add(spire);
      }
    }
  }
}
