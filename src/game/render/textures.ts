import * as THREE from "three";
import type { Quality } from "./quality";

/** HMR of this module still requires a full page reload — textures are not reloaded every frame. */

export type MatId =
  | "floor"
  | "stone"
  | "wall"
  | "hell"
  | "ice"
  | "dirt"
  | "leather"
  | "hide"
  | "bone"
  | "iron"
  | "gold"
  | "cloth"
  | "banner"
  | "skin"
  | "fur"
  | "ember"
  | "wood"
  | "roof"
  | "crystal";

type Maps = { map?: THREE.Texture; normal?: THREE.Texture; rough?: THREE.Texture; ao?: THREE.Texture };

const ALBEDO: Record<string, string> = {
  floor: "/game/textures/plaza-cobble.jpg",
  stone: "/game/textures/floor-limestone.jpg",
  wall: "/game/textures/wall-soot.jpg",
  hell: "/game/textures/hell-basalt.jpg",
  ice: "/game/textures/ice-crust.jpg",
  dirt: "/game/textures/blood-dirt.jpg",
  leather: "/game/textures/armor-leather.jpg",
  hide: "/game/textures/demon-hide.jpg",
  bone: "/game/textures/bone-dry.jpg",
  iron: "/game/textures/iron-worn.jpg",
  gold: "/game/textures/gold-filigree.jpg",
  cloth: "/game/textures/cloth-ragged.jpg",
  banner: "/game/textures/banner-crimson.jpg",
  roof: "/game/textures/roof-slate.jpg",
  wood: "/game/textures/wood-dark.jpg",
};

function loadTex(src: string, srgb: boolean): Promise<THREE.Texture | null> {
  return new Promise((res) => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    const tmo = window.setTimeout(() => res(null), 6000);
    loader.load(
      src,
      (t) => {
        window.clearTimeout(tmo);
        t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = 8;
        t.needsUpdate = true;
        res(t);
      },
      undefined,
      () => {
        window.clearTimeout(tmo);
        res(null);
      },
    );
  });
}

function deriveMaps(albedo: THREE.Texture, bump = 2.4): { normal: THREE.Texture; rough: THREE.Texture; ao: THREE.Texture } {
  const img = albedo.image as HTMLImageElement | HTMLCanvasElement | undefined;
  const w = Math.min(256, (img && "width" in img ? img.width : 256) || 256);
  const h = Math.min(256, (img && "height" in img ? img.height : 256) || 256);
  const src = document.createElement("canvas");
  src.width = w;
  src.height = h;
  const sctx = src.getContext("2d")!;
  if (img) sctx.drawImage(img, 0, 0, w, h);
  const px = sctx.getImageData(0, 0, w, h).data;
  const lum = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const o = i * 4;
    lum[i] = (px[o]! * 0.3 + px[o + 1]! * 0.59 + px[o + 2]! * 0.11) / 255;
  }
  const ncv = document.createElement("canvas");
  ncv.width = w;
  ncv.height = h;
  const nctx = ncv.getContext("2d")!;
  const nimg = nctx.createImageData(w, h);
  const rcv = document.createElement("canvas");
  rcv.width = w;
  rcv.height = h;
  const rctx = rcv.getContext("2d")!;
  const rimg = rctx.createImageData(w, h);
  const acv = document.createElement("canvas");
  acv.width = w;
  acv.height = h;
  const actx = acv.getContext("2d")!;
  const aimg = actx.createImageData(w, h);
  const at = (x: number, y: number) => lum[((y + h) % h) * w + ((x + w) % w)]!;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * bump;
      const dy = (at(x, y + 1) - at(x, y - 1)) * bump;
      const inv = 1 / Math.hypot(dx, dy, 1);
      const i = (y * w + x) * 4;
      nimg.data[i] = Math.round((-dx * inv) * 127 + 128);
      nimg.data[i + 1] = Math.round((-dy * inv) * 127 + 128);
      nimg.data[i + 2] = Math.round(1 * inv * 127 + 128);
      nimg.data[i + 3] = 255;
      const L = at(x, y);
      const rough = Math.max(0.16, Math.min(0.97, 0.9 - L * 0.5 + (1 - L) * 0.14));
      rimg.data[i] = rimg.data[i + 1] = rimg.data[i + 2] = Math.round(rough * 255);
      rimg.data[i + 3] = 255;
      const ao = Math.max(0.28, Math.min(1, 0.48 + L * 0.55));
      aimg.data[i] = aimg.data[i + 1] = aimg.data[i + 2] = Math.round(ao * 255);
      aimg.data[i + 3] = 255;
    }
  }
  nctx.putImageData(nimg, 0, 0);
  rctx.putImageData(rimg, 0, 0);
  actx.putImageData(aimg, 0, 0);
  const mk = (cv: HTMLCanvasElement, srgb: boolean) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  };
  return { normal: mk(ncv, false), rough: mk(rcv, false), ao: mk(acv, false) };
}

function procAlbedo(seed: number, c0: string, c1: string): THREE.Texture {
  const cv = document.createElement("canvas");
  cv.width = 128;
  cv.height = 128;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = c0;
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = c1;
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < 80; i++) {
    ctx.globalAlpha = 0.08 + rnd() * 0.2;
    ctx.beginPath();
    ctx.arc(rnd() * 128, rnd() * 128, 4 + rnd() * 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.needsUpdate = true;
  return t;
}

function brightenMap(map: THREE.Texture, gain: number, lift = 0.08): THREE.Texture {
  const img = map.image as HTMLImageElement | HTMLCanvasElement | undefined;
  if (!img) return map;
  const w = Math.min(512, ("width" in img ? img.width : 512) || 512);
  const h = Math.min(512, ("height" in img ? img.height : 512) || 512);
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, d[i]! * gain + lift * 255);
    d[i + 1] = Math.min(255, d[i + 1]! * gain + lift * 255);
    d[i + 2] = Math.min(255, d[i + 2]! * gain + lift * 255);
  }
  ctx.putImageData(id, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

export class TextureKit {
  maps: Record<string, Maps> = {};
  mats: Record<string, THREE.MeshStandardMaterial> = {};
  envTex: THREE.Texture | null = null;
  quality: Quality;

  constructor(q: Quality) {
    this.quality = q;
  }

  async load() {
    const jobs = Object.entries(ALBEDO).map(async ([k, src]) => {
      const map = await loadTex(src, true);
      if (!map) {
        this.maps[k] = { map: procAlbedo(k.length * 17, "#3a3228", "#1a140f") };
        return;
      }
      map.repeat.set(1, 1);
      let albedo = map;
      if (k === "hell") albedo = brightenMap(map, 2.8, 0.12);
      else if (k === "hide" || k === "dirt" || k === "roof") albedo = brightenMap(map, 1.85, 0.06);
      const bump = k === "hell" || k === "wall" || k === "floor" ? 3.4 : k === "hide" ? 2.8 : 2.2;
      const derived = this.quality.low ? { normal: undefined, rough: undefined, ao: undefined } : deriveMaps(albedo, bump);
      this.maps[k] = { map: albedo, ...derived };
    });
    await Promise.all(jobs);
    this.maps.skin = { map: procAlbedo(9, "#c4a07a", "#8a6048") };
    this.maps.fur = { map: procAlbedo(13, "#3a2a1c", "#1a120c") };
    this.buildMats();
  }

  env(renderer: THREE.WebGLRenderer): THREE.Texture {
    if (this.envTex) return this.envTex;
    const sc = new THREE.Scene();
    sc.add(new THREE.HemisphereLight(0x7a90a8, 0x2a1408, 1.1));
    const warm = new THREE.Mesh(new THREE.SphereGeometry(6, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffb070 }));
    warm.position.set(10, 14, 6);
    sc.add(warm);
    const cool = new THREE.Mesh(new THREE.SphereGeometry(8, 8, 8), new THREE.MeshBasicMaterial({ color: 0x203040 }));
    cool.position.set(-12, 8, -10);
    sc.add(cool);
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.envTex = pmrem.fromScene(sc, 0.06).texture;
    pmrem.dispose();
    return this.envTex;
  }

  private buildMats() {
    const std = (key: string, color: number, rough: number, metal: number, opts?: { emissive?: number; emi?: number; repeat?: number; nrm?: number }) => {
      const maps = this.maps[key] ?? {};
      const mat = new THREE.MeshStandardMaterial({
        color,
        map: maps.map ?? null,
        normalMap: maps.normal ?? null,
        roughnessMap: maps.rough ?? null,
        aoMap: maps.ao ?? null,
        roughness: rough,
        metalness: metal,
        envMapIntensity: 0.78,
        aoMapIntensity: 0.48,
      });
      if (opts?.emissive != null) {
        mat.emissive = new THREE.Color(opts.emissive);
        mat.emissiveIntensity = opts.emi ?? 0.4;
      }
      const rep = opts?.repeat ?? 1;
      if (maps.map) maps.map.repeat.set(rep, rep);
      if (maps.normal) maps.normal.repeat.set(rep, rep);
      if (maps.rough) maps.rough.repeat.set(rep, rep);
      if (maps.ao) maps.ao.repeat.set(rep, rep);
      if (maps.normal) mat.normalScale.set(opts?.nrm ?? 0.85, opts?.nrm ?? 0.85);
      return mat;
    };
    this.mats.floor = std("floor", 0xddd0b8, 0.88, 0.04, { repeat: 8, nrm: 1.05 });
    this.mats.stone = std("stone", 0xd4c6b0, 0.86, 0.04, { repeat: 6, nrm: 0.85 });
    this.mats.wall = std("wall", 0xc8b8a4, 0.88, 0.05, { repeat: 2, nrm: 1.0 });
    this.mats.hell = std("hell", 0xe8c8a8, 0.68, 0.08, { emissive: 0x5a1c08, emi: 0.2, repeat: 6, nrm: 1.05 });
    this.mats.hide = std("hide", 0xc46a48, 0.4, 0.1, { emissive: 0x4a1408, emi: 0.12, nrm: 1.0 });
    this.mats.ice = std("ice", 0xd4e4f0, 0.32, 0.14, { repeat: 5 });
    this.mats.dirt = std("dirt", 0xb08a70, 0.92, 0.02, { repeat: 6 });
    this.mats.leather = std("leather", 0xb08a68, 0.72, 0.1, { nrm: 0.7 });
    this.mats.bone = std("bone", 0xeee4d0, 0.9, 0.02);
    this.mats.iron = std("iron", 0x9a9690, 0.42, 0.78, { nrm: 0.8 });
    this.mats.gold = std("gold", 0xd4b46a, 0.34, 0.88, { emissive: 0x5a3810, emi: 0.28 });
    this.mats.cloth = std("cloth", 0x6a6054, 0.88, 0.02);
    this.mats.banner = std("banner", 0xa42822, 0.8, 0.04, { emissive: 0x3a0804, emi: 0.1 });
    this.mats.roof = std("roof", 0x6a6a72, 0.78, 0.12, { repeat: 2, nrm: 1.0 });
    this.mats.skin = std("skin", 0xd4b090, 0.52, 0.02, { emissive: 0x4a2014, emi: 0.1 });
    this.mats.fur = std("fur", 0x5a4838, 0.94, 0.0);
    this.mats.wood = std("wood", 0x8a6a42, 0.86, 0.04, { nrm: 0.7 });
    this.mats.ember = new THREE.MeshStandardMaterial({
      color: 0xff7733,
      emissive: 0xff4411,
      emissiveIntensity: 1.6,
      roughness: 0.38,
      metalness: 0.05,
    });
    this.mats.crystal = new THREE.MeshStandardMaterial({
      color: 0xff7744,
      emissive: 0xff3308,
      emissiveIntensity: 1.35,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.92,
    });
  }

  clone(id: string): THREE.MeshStandardMaterial {
    const base = this.mats[id];
    return base ? base.clone() : new THREE.MeshStandardMaterial({ color: 0x888888 });
  }

  floorFor(biome: string): THREE.MeshStandardMaterial {
    if (biome === "hell" || biome === "rift") return this.mats.hell!;
    if (biome === "ice" || biome === "flood") return this.mats.ice!;
    if (biome === "wilds") return this.mats.dirt!;
    if (biome === "town") return this.mats.floor!;
    return this.mats.stone!;
  }
}
