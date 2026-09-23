// @ts-nocheck
import * as THREE from "three";
import { CLASSES, CLASS_LIST, DIFFICULTY, GEMS, INVENTORY_SIZE, LEGENDARIES, MAX_LEVEL, MONSTERS, NPCS, QUESTS, SETS, SHRINES, SLOT_LABEL, STASH_SIZE, TOWN_NAME, defaultLoadout, defaultPrimary, defaultUlt, iconFor, roleOf, xpToNext } from "./catalog";
import { GameAudio } from "./audio";
import { generateDungeon, generateMarches, generateTown, isWalkable, resolveWalls } from "./dungeon";
import { Input } from "./input";
import { formatAffix, identify, randomGem, rarityFor, rollItem, Rng, salvageValue } from "./loot";
import { isPc } from "./platform";
import { detectQuality, FigureFactory, figureKindFor, PaperdollView, PostPipeline, TextureKit, VfxWorld, WorldKit } from "./render";
import { addXp, createHero, loadSave, persistSave } from "./save";

const TEX = {
  town: "/game/textures/town.jpg",
  cathedral: "/game/textures/cathedral.jpg",
  crypt: "/game/textures/cathedral.jpg",
  wilds: "/game/textures/town.jpg",
  ice: "/game/textures/ice.jpg",
  hell: "/game/textures/hell.jpg",
  flood: "/game/textures/ice.jpg",
  rift: "/game/textures/hell.jpg",
};
function keyMagenta(ctx, w, h) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i],
      g = d[i + 1],
      b = d[i + 2];
    if (
      (r > 95 &&
        b > 95 &&
        g < 155 &&
        Math.abs(r - b) < 85 &&
        (r + b) / 2 - g > 28) ||
      (r > 170 && b > 130 && g < 70)
    ) {
      d[i] = 0;
      d[i + 1] = 0;
      d[i + 2] = 0;
      d[i + 3] = 0;
    } else if (d[i + 3] < 16) {
      d[i] = 0;
      d[i + 1] = 0;
      d[i + 2] = 0;
      d[i + 3] = 0;
    }
  }
  ctx.putImageData(img, 0, 0);
}
function cropOpaque(src) {
  const { data, width, height } = src
    .getContext("2d")
    .getImageData(0, 0, src.width, src.height);
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (data[(y * width + x) * 4 + 3] > 24) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
  if (maxX <= minX) return src;
  const pad = Math.floor(Math.max(width, height) * 0.03);
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  const s = Math.max(w, h);
  const out = document.createElement("canvas");
  out.width = s;
  out.height = s;
  out
    .getContext("2d")
    .drawImage(src, minX, minY, w, h, (s - w) / 2, s - h, w, h);
  return out;
}
function loadImage(src) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.crossOrigin = "anonymous";
    const t = window.setTimeout(
      () => rej(/* @__PURE__ */ new Error("timeout " + src)),
      8e3,
    );
    im.onload = () => {
      clearTimeout(t);
      res(im);
    };
    im.onerror = () => {
      clearTimeout(t);
      rej(new Error(src));
    };
    im.src = src;
  });
}
async function sheetTextures(src, rows, cols) {
  try {
    const im = await loadImage(src);
    const cw = Math.floor(im.width / cols);
    const ch = Math.floor(im.height / rows);
    const out = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const cv = document.createElement("canvas");
        cv.width = cw;
        cv.height = ch;
        const ctx = cv.getContext("2d");
        ctx.drawImage(im, c * cw, r * ch, cw, ch, 0, 0, cw, ch);
        keyMagenta(ctx, cw, ch);
        const cropped = cropOpaque(cv);
        const t = new THREE.CanvasTexture(cropped);
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.premultiplyAlpha = true;
        t.needsUpdate = true;
        out.push(t);
      }
    return out;
  } catch {
    return [];
  }
}
function expLerp(cur, target, k, dt) {
  return cur + (target - cur) * (1 - Math.exp(-k * dt));
}
let nid = 1;
const nextId = () => ++nid;
export class Veilbreak {
  renderer;
  scene = new THREE.Scene();
  camera;
  input;
  audio = new GameAudio();
  save;
  hero = null;
  screen = "title";
  panel = "none";
  level = null;
  ents = [];
  player = null;
  wallsGroup = new THREE.Group();
  decorGroup = new THREE.Group();
  ground = null;
  clock = new THREE.Clock();
  acc = 0;
  uiAcc = 0;
  running = false;
  raf = 0;
  canvas;
  overlay;
  octx;
  pushUI;
  frames = {};
  groundTex = {};
  particlePool = [];
  particles = [];
  numbers = [];
  dest = null;
  clickGo = null;
  dash = null;
  aim = new THREE.Vector3();
  tmp = new THREE.Vector3();
  ndc = new THREE.Vector2();
  aimHit = new THREE.Vector3();
  upTmp = new THREE.Vector3(0, 1, 0);
  ray = new THREE.Raycaster();
  plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  trauma = 0;
  hitstop = 0;
  timeScale = 1;
  toasts = [];
  dialogue = null;
  legendaryFlash = null;
  flashT = 0;
  interact = null;
  interactEnt = null;
  loadPct = 0;
  loading = false;
  potionCd = 0;
  potionHot = 0;
  potionHotLeft = 0;
  skillCd = {};
  skillCharges = {};
  skillChargeCd = {};
  resource = 0;
  maxResource = 100;
  hp = 0;
  maxHp = 200;
  hpChase = 0;
  buffs = [];
  channel = null;
  ultCharge = 0;
  ultActive = 0;
  target = null;
  skillHoldT = [0, 0, 0, 0];
  rift = null;
  worldBossIn = 180;
  yaw = 0;
  speed = 0;
  rng = new Rng();
  lights = [];
  hemi = null;
  dir = null;
  vendorStock = [];
  cube = null;
  reduced = false;
  touchStick = {
    x: 0,
    y: 0,
  };
  viewSize = 5.5;
  baseViewSize = 5.5;
  gemGeo = new THREE.OctahedronGeometry(0.22, 0);
  goldPileGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.16, 8);
  camFwd = new THREE.Vector3(-1, 0, -1).normalize();
  camRight = new THREE.Vector3();
  camOff = { x: 13.5, y: 15.5, z: 13.5 };
  camLagT = 0;
  aimingSlot = -1;
  aimHoldT = 0;
  camLookX = 0;
  camLookZ = 0;
  checkpoint = { x: 0, z: 0 };
  roomKey = "";
  paperdoll = null;
  quality = detectQuality();
  texKit = new TextureKit(detectQuality());
  post = null;
  figures = null;
  vfx = null;
  world = null;
  reticle = null;
  pc = true;
  crowdMul = 1;
  _pendingClass = null;
  _pendingContinue = null;
  constructor(canvas, overlay, pushUI) {
    this.canvas = canvas;
    this.overlay = overlay;
    this.octx = overlay.getContext("2d");
    this.pushUI = pushUI;
    this.save = loadSave();
    this.input = new Input(canvas);
    this.quality = detectQuality();
    this.texKit = new TextureKit(this.quality);
    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    const f = this.viewSize;
    this.camera = new THREE.OrthographicCamera(
      -f * aspect,
      f * aspect,
      f,
      -f,
      0.1,
      220,
    );
    this.camera.position.set(this.camOff.x, this.camOff.y, this.camOff.z);
    this.camera.lookAt(0, 0, 0);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.quality.low,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(this.quality.dpr);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.shadowMap.enabled = this.quality.shadows;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.38;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x1c1814, 1);
    this.scene.fog = new THREE.FogExp2(0x1c1814, 0.01);
    this.scene.add(this.wallsGroup);
    this.scene.add(this.decorGroup);
    const ret = new THREE.Mesh(
      new THREE.RingGeometry(0.16, 0.24, 28),
      new THREE.MeshBasicMaterial({
        color: 0xe6c87a,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    ret.rotation.x = -Math.PI / 2;
    ret.position.y = 0.07;
    ret.visible = false;
    this.scene.add(ret);
    this.reticle = ret;
    this.post = new PostPipeline(this.renderer, this.scene, this.camera, this.quality);
    this.reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    this.pc = isPc();
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVis);
    this.wireControlsTest();
  }
  async start() {
    this.loading = false;
    this.running = true;
    this.clock.start();
    this.loop();
    this.emit();
    await this.preload();
    this.loadPct = 1;
    this.emit();
    if (this._pendingClass) {
      const p = this._pendingClass;
      this._pendingClass = null;
      this.chooseClass(p.id, p.name);
    }
    if (this._pendingContinue != null) {
      const i = this._pendingContinue;
      this._pendingContinue = null;
      this.continueHero(i);
    }
  }
  dispose() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVis);
    this.input.dispose();
    this.audio.stopDrone();
    this.renderer.dispose();
    this.clearLevel();
    this.paperdoll?.dispose();
    this.paperdoll = null;
    if (window.__controlsTest) delete window.__controlsTest;
  }
  setStick(x, y) {
    this.input.setVirtualStick(x, y);
  }
  chooseClass(id, name) {
    if (!this.figures) {
      this._pendingClass = { id, name };
      this.toast("Binding the veil…");
      return;
    }
    this.audio.unlock();
    this.audio.ui();
    this.hero = createHero(this.save, id, name);
    this.screen = "intro";
    this.emit();
  }
  finishIntro() {
    if (!this.hero) return;
    this.screen = "playing";
    this.loadArea(generateTown());
    this.grantStarter();
    this.recompute();
    this.hp = this.maxHp;
    this.hpChase = this.maxHp;
    this.ultCharge = 0;
    this.ultActive = 0;
    this.initCharges();
    this.audio.startDrone(false);
    this.emit();
  }
  continueHero(i) {
    if (!this.figures) {
      this._pendingContinue = i;
      this.toast("Binding the veil…");
      return;
    }
    this.audio.unlock();
    const h = this.save.characters[i];
    if (!h) return;
    this.save.active = i;
    this.hero = h;
    this.screen = "playing";
    this.recompute();
    this.hp = this.maxHp;
    this.hpChase = this.maxHp;
    this.ultCharge = 0;
    this.ultActive = 0;
    this.initCharges();
    this.loadArea(generateTown());
    this.audio.startDrone(false);
    this.recompute();
    this.emit();
  }
  openPanel(p) {
    this.releaseInput();
    this.panel = this.panel === p ? "none" : p;
    if (p !== "dialogue") this.dialogue = null;
    this.emit(true);
  }
  releaseInput() {
    this.input.setHudPrimary(false);
    this.input.setHudUlt(false);
    this.input.setHudPotion(false);
    for (let i = 0; i < 4; i++) this.input.setHudSkill(i, false);
    this.input.pointer.down = false;
    this.input.pointer.right = false;
    this.aimingSlot = -1;
    this.aimHoldT = 0;
    this.channel = null;
    this.dest = null;
    this.clickGo = null;
    this.vfx?.clearAim();
    if (this.player) {
      this.player.vx = 0;
      this.player.vz = 0;
    }
  }
  snapCamera() {
    const p = this.player;
    if (!p) return;
    const off = this.camOff;
    this.camLookX = p.x;
    this.camLookZ = p.z;
    this.camLagT = 0;
    this.camera.position.set(p.x + off.x, off.y, p.z + off.z);
    this.camera.lookAt(p.x, 1.28, p.z);
  }
  equip(uid) {
    const h = this.hero;
    if (!h) return;
    const idx = h.inventory.findIndex((i) => i.uid === uid);
    if (idx < 0) return;
    const item = h.inventory[idx];
    if (!item.identified) identify(item);
    const slot = item.slot;
    const cur = h.equipped[slot];
    if (slot === "ring") {
      const rings = Array.isArray(cur) ? cur : cur ? [cur] : [];
      if (rings.length < 2) {
        rings.push(item);
        h.equipped.ring = rings;
        h.inventory.splice(idx, 1);
      } else {
        const old = rings[0];
        rings[0] = item;
        h.equipped.ring = rings;
        h.inventory[idx] = old;
      }
    } else {
      h.inventory.splice(idx, 1);
      if (cur && !Array.isArray(cur)) h.inventory.push(cur);
      h.equipped[slot] = item;
    }
    this.recompute();
    this.applyHeroGear();
    this.persist();
    this.emit(true);
  }
  equipTo(uid, slot, ringIndex = 0) {
    const h = this.hero;
    if (!h) return false;
    const item = h.inventory.find((i) => i.uid === uid);
    if (!item) return false;
    if (item.slot !== slot) {
      this.toast("Won't fit that slot");
      return false;
    }
    if (slot === "ring") {
      const idx = h.inventory.findIndex((i) => i.uid === uid);
      if (idx < 0) return false;
      if (!item.identified) identify(item);
      const rings = Array.isArray(h.equipped.ring)
        ? [...h.equipped.ring]
        : h.equipped.ring
          ? [h.equipped.ring]
          : [];
      const old = rings[ringIndex];
      rings[ringIndex] = item;
      h.equipped.ring = rings.filter(Boolean);
      if (old) h.inventory[idx] = old;
      else h.inventory.splice(idx, 1);
      this.recompute();
      this.applyHeroGear();
      this.persist();
      this.emit(true);
      return true;
    }
    this.equip(uid);
    return true;
  }
  unequip(slot, index = 0) {
    const h = this.hero;
    if (!h || h.inventory.length >= 60) return;
    const cur = h.equipped[slot];
    if (!cur) return;
    if (Array.isArray(cur)) {
      const it = cur[index];
      if (!it) return;
      cur.splice(index, 1);
      h.inventory.push(it);
    } else {
      h.inventory.push(cur);
      delete h.equipped[slot];
    }
    this.recompute();
    this.applyHeroGear();
    this.persist();
    this.emit(true);
  }
  salvage(uid) {
    const h = this.hero;
    if (!h) return;
    const idx = h.inventory.findIndex((i) => i.uid === uid);
    if (idx < 0) return;
    const v = salvageValue(h.inventory[idx]);
    h.materials.scrap += v.scrap;
    h.materials.dust += v.dust;
    h.materials.crystal += v.crystal;
    h.inventory.splice(idx, 1);
    this.persist();
    this.emit(true);
  }
  stashMove(uid, toStash) {
    const h = this.hero;
    if (!h) return;
    if (toStash) {
      if (h.stash.length >= 80) return;
      const i = h.inventory.findIndex((x) => x.uid === uid);
      if (i < 0) return;
      h.stash.push(h.inventory[i]);
      h.inventory.splice(i, 1);
    } else {
      if (h.inventory.length >= 60) return;
      const i = h.stash.findIndex((x) => x.uid === uid);
      if (i < 0) return;
      h.inventory.push(h.stash[i]);
      h.stash.splice(i, 1);
    }
    this.persist();
    this.emit(true);
  }
  buy(uid) {
    const h = this.hero;
    if (!h) return;
    const i = this.vendorStock.findIndex((x) => x.uid === uid);
    if (i < 0) return;
    const it = this.vendorStock[i];
    const cost = 40 + it.ilvl * 8;
    if (h.gold < cost || h.inventory.length >= 60) return;
    h.gold -= cost;
    h.inventory.push(it);
    this.vendorStock.splice(i, 1);
    this.persist();
    this.emit(true);
  }
  reforge(uid) {
    const h = this.hero;
    if (!h || h.materials.dust < 8) return;
    const it = h.inventory.find((x) => x.uid === uid);
    if (!it) return;
    h.materials.dust -= 8;
    it.affixes = rollItem({
      rng: this.rng,
      level: h.level,
      classId: h.classId,
      slot: it.slot,
      rarity: it.rarity,
    }).affixes;
    it.identified = true;
    this.persist();
    this.emit(true);
  }
  addSocket(uid) {
    const h = this.hero;
    if (!h || h.materials.crystal < 1) return;
    const it = h.inventory.find((x) => x.uid === uid);
    if (!it || it.sockets >= 3) return;
    h.materials.crystal -= 1;
    it.sockets += 1;
    it.gems.push(null);
    this.persist();
    this.emit(true);
  }
  extractPower(uid) {
    const h = this.hero;
    if (!h || h.materials.crystal < 2) return;
    const it = h.inventory.find((x) => x.uid === uid);
    if (!it?.legendaryId) return;
    h.materials.crystal -= 2;
    this.cube = {
      ...it,
      uid: it.uid + "x",
    };
    this.toast("Power extracted into the cube.", it);
    this.persist();
    this.emit(true);
  }
  socketGem(itemUid, gemId, slot = 0) {
    const h = this.hero;
    if (!h) return;
    const it = [
      ...h.inventory,
      ...Object.values(h.equipped).flatMap((x) =>
        Array.isArray(x) ? x : x ? [x] : [],
      ),
    ].find((x) => x.uid === itemUid);
    if (!it || slot >= it.sockets) return;
    if (!h.gems.find((x) => x.id === gemId)) return;
    it.gems[slot] = gemId;
    this.persist();
    this.emit(true);
  }
  spendParagon(tree) {
    const h = this.hero;
    if (!h) return;
    if (
      h.paragonSpent.core +
        h.paragonSpent.offense +
        h.paragonSpent.defense +
        h.paragonSpent.utility >=
      h.paragon
    )
      return;
    h.paragonSpent[tree] += 1;
    this.recompute();
    this.persist();
    this.emit(true);
  }
  toggleRune(skillId) {
    const h = this.hero;
    if (!h) return;
    const def = CLASSES[h.classId].skills.find((s) => s.id === skillId);
    if (!def || h.level < def.runeUnlock) return;
    h.skillRunes[skillId] = !h.skillRunes[skillId];
    this.persist();
    this.emit(true);
  }
  setDifficulty(d) {
    const h = this.hero;
    if (!h) return;
    const need = DIFFICULTY[d].unlock;
    if (h.level < need) return;
    h.difficulty = d;
    this.persist();
    this.emit(true);
  }
  enterPortal(kind, riftTier = 1) {
    const h = this.hero;
    if (!h) return;
    if (kind === "town") {
      this.loadArea(generateTown());
      this.rift = null;
      this.audio.startDrone(false);
      this.quest("enter", "town");
      return;
    }
    if (kind === "marches") {
      this.rift = null;
      this.loadArea(generateMarches((h.level * 13) ^ 7));
      this.audio.startDrone(false);
      this.quest("enter", "marches");
      return;
    }
    if (kind === "rift") {
      const lv = generateDungeon({
        seed: (Date.now() ^ h.level) >>> 0,
        biome: "rift",
        name: `First Tear T${riftTier}`,
        level: h.level,
        act: h.act,
        isRift: true,
        riftTier,
        wantBoss: true,
      });
      this.rift = {
        active: true,
        tier: riftTier,
        time: 180,
        progress: 0,
        goal: 24 + riftTier * 4,
      };
      this.loadArea(lv);
      this.audio.rift();
      this.audio.startDrone(true);
      this.quest("enter", "rift");
      return;
    }
    const isRaid = kind === "raid";
    const isWorld = kind === "world";
    const biome =
      kind === "cathedral"
        ? "cathedral"
        : kind === "ice"
          ? "ice"
          : isWorld
            ? "wilds"
            : "hell";
    const names = {
      cathedral: "Cathedral of Saint Elara",
      ice: "Frosthold Caverns",
      hell: isRaid ? "Choir Vault" : "The Burning Quarter",
      world: "The Marches",
      raid: "Choir Vault",
    };
    const lv = generateDungeon({
      seed: (Date.now() ^ (h.level * 17)) >>> 0,
      biome,
      name: names[kind] ?? "The Tear",
      level: h.level,
      act: kind === "ice" ? 2 : isRaid ? 4 : kind === "hell" ? 3 : 1,
      wantBoss: true,
    });
    if (isWorld)
      lv.spawns.push({
        x: 4,
        z: 4,
        monster: "worldboss",
        boss: true,
        elite: true,
      });
    if (isRaid) {
      lv.spawns = lv.spawns.filter((s) => !s.boss);
      lv.spawns.push({
        x: lv.rooms[lv.rooms.length - 1].x,
        z: lv.rooms[lv.rooms.length - 1].z,
        monster: "raid",
        boss: true,
        elite: true,
      });
    }
    this.rift = null;
    this.loadArea(lv);
    this.audio.startDrone(biome === "hell");
    this.quest("enter", biome);
  }
  talkChoice(id) {
    this.dialogue = null;
    if (id === "x") {
      this.panel = "none";
      this.dest = null;
      this.clickGo = null;
    }
    if (id.startsWith("enter:")) this.enterPortal(id.slice(6));
    if (id === "panel:blacksmith") this.panel = "blacksmith";
    if (id === "panel:mystic") this.panel = "mystic";
    if (id === "panel:vendor") {
      this.restockVendor();
      this.panel = "vendor";
    }
    if (id === "panel:stash") this.panel = "stash";
    if (id === "panel:rifts") this.panel = "rifts";
    if (id === "panel:bounties") this.panel = "bounties";
    if (id === "panel:quests") this.panel = "quests";
    this.emit(true);
  }
  goSelect() {
    this.screen = "select";
    this.emit(true);
  }
  pressSkill(i) {
    const { equipped } = this.kit();
    const s = equipped[i];
    if (s) this.castSkill(s, false);
  }
  holdSkill(i, down) {
    this.input.setHudSkill(i, down);
  }
  mountPaperdoll(canvas) {
    if (!canvas) {
      this.paperdoll?.dispose();
      this.paperdoll = null;
      return;
    }
    this.paperdoll?.dispose();
    this.paperdoll = new PaperdollView(canvas, this.texKit, this.quality);
    this.paperdoll.setGear(this.hero?.equipped ?? {});
  }
  paperdollYaw(d) {
    this.paperdoll?.addYaw(d);
  }
  applyHeroGear() {
    const h = this.hero;
    if (!h) return;
    this.player?.figure?.applyGear(h.equipped);
    this.paperdoll?.setGear(h.equipped);
  }
  holdPrimary(down) {
    this.input.setHudPrimary(down);
  }
  pressUltimate() {
    this.fireUlt();
  }
  drinkPotion() {
    this.drink();
  }
  pickupGround(uid) {
    const e = this.ents.find(
      (x) => x.uid === uid || (x.item && x.item.uid === uid),
    );
    if (e && e.kind === "pickup") this.collect(e);
  }
  useInteract() {
    this.interactScan();
    if (this.interactEnt) this.doInteract(this.interactEnt);
  }
  setPrimarySkill(id) {
    const h = this.hero;
    if (!h) return;
    const s = CLASSES[h.classId].skills.find((x) => x.id === id);
    if (!s || roleOf(s) !== "primary") return;
    h.primaryId = id;
    this.persist();
    this.emit(true);
  }
  setLoadoutSlot(slot, id) {
    const h = this.hero;
    if (!h) return;
    const s = CLASSES[h.classId].skills.find((x) => x.id === id);
    if (!s || roleOf(s) !== "skill") return;
    if ((h.skillRanks[id] ?? 0) < 1) return;
    const next = [...(h.loadout ?? defaultLoadout(h.classId))];
    const swap = next.indexOf(id);
    if (swap >= 0) next[swap] = next[slot];
    next[slot] = id;
    h.loadout = next.slice(0, 4);
    this.initCharges();
    this.persist();
    this.emit(true);
  }
  respawn(toTown = true) {
    if (!this.hero || !this.player) return;
    this.hero.stats.deaths += 1;
    this.releaseInput();
    this.hp = this.maxHp;
    this.resource = this.maxResource * 0.4;
    const stay = toTown === false && this.level && !this.level.isTown;
    this.player.dead = false;
    this.player.corpse = false;
    this.player.hp = this.hp;
    this.screen = "playing";
    if (!stay) {
      this.loadArea(generateTown());
    } else {
      this.player.x = this.checkpoint.x;
      this.player.z = this.checkpoint.z;
      this.player.vx = 0;
      this.player.vz = 0;
      this.player.figure?.revive();
      if (this.player.figure)
        this.player.figure.root.position.set(this.player.x, 0, this.player.z);
      this.snapCamera();
    }
    this.persist();
    this.emit(true);
  }
  onResize = () => {
    this.pc = isPc();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / Math.max(1, h);
    const f = this.viewSize;
    this.camera.left = -f * aspect;
    this.camera.right = f * aspect;
    this.camera.top = f;
    this.camera.bottom = -f;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.post?.setSize(w, h);
    this.overlay.width = w * (this.renderer.getPixelRatio?.() ?? 1);
    this.overlay.height = h * (this.renderer.getPixelRatio?.() ?? 1);
    this.overlay.style.width = w + "px";
    this.overlay.style.height = h + "px";
  };
  onVis = () => {
    if (!document.hidden) this.audio.unlock();
    else this.persist();
  };
  async preload() {
    await this.texKit.load();
    this.loadPct = 0.6;
    this.emit();
    if (this.quality.env) {
      this.scene.environment = this.texKit.env(this.renderer);
      this.scene.environmentIntensity = 0.55;
    }
    this.figures = new FigureFactory(this.texKit, this.quality);
    this.vfx = new VfxWorld(this.scene, this.texKit, this.quality);
    this.world = new WorldKit(
      this.scene,
      this.wallsGroup,
      this.decorGroup,
      this.texKit,
      this.quality,
    );
    this.loadPct = 1;
    this.onResize();
  }
  loadArea(level) {
    this.clearLevel();
    this.level = level;
    this.dest = null;
    this.clickGo = null;
    this.channel = null;
    this.dash = null;
    this.vfx?.clear();
    this.world.dress(level, this.vfx);
    this.ground = this.world.ground;
    this.hemi = this.world.hemi;
    this.dir = this.world.dir;
    this.lights = this.world.lights;
    for (const s of level.spawns)
      this.spawnMonster(s.x, s.z, s.monster, s.elite, s.boss, s.champion);
    for (const p of level.props) this.spawnProp(p);
    this.spawnPlayer(level.playerX, level.playerZ);
    this.dressLevel(level);
    this.recompute();
    if (level.isTown) this.restockVendor();
    if (this.hp <= 0) this.hp = this.maxHp;
    if (this.player) {
      this.player.hp = this.hp;
      this.player.maxHp = this.maxHp;
    }
    this.checkpoint = { x: level.playerX, z: level.playerZ };
    this.roomKey = "";
    this.snapCamera();
  }
  clearLevel() {
    for (const e of this.ents) {
      if (e.figure) this.scene.remove(e.figure.root);
      if (e.sprite) this.scene.remove(e.sprite);
      if (e.mesh && !e.figure) this.scene.remove(e.mesh);
      if (e.shadow) this.scene.remove(e.shadow);
      if (e.light) this.scene.remove(e.light);
      if (e.beam) this.vfx?.dropShaft(e.beam, e.light ?? null);
    }
    this.ents = [];
    this.player = null;
    this.world?.clear();
    this.vfx?.clear();
    this.ground = null;
    this.lights = [];
    for (const p of this.particles) this.scene.remove(p.s);
    this.particles = [];
  }
  spawnPlayer(x, z) {
    const h = this.hero;
    const cls = CLASSES[h.classId];
    const e = this.makeSprite("player", x, z, [], 0.01, 16777215);
    if (e.sprite) e.sprite.visible = false;
    if (e.shadow) e.shadow.visible = false;
    this.attachFigure(e, figureKindFor(cls.id), 1.05, false, false);
    e.team = 1;
    e.speed = cls.base.speed;
    e.r = 0.45;
    e.maxHp = this.maxHp || 200;
    e.hp = this.hp || e.maxHp;
    this.player = e;
    this.ents.push(e);
    this.applyHeroGear();
  }
  spawnMonster(x, z, id, elite, boss, champ) {
    const def = MONSTERS[id];
    if (!def) return;
    const h = this.hero;
    const diff = DIFFICULTY[h.difficulty];
    const scale = 1 + (h.level - 1) * 0.16;
    const e = this.makeSprite("monster", x, z, [], 0.01, 16777215);
    if (e.sprite) e.sprite.visible = false;
    if (e.shadow) e.shadow.visible = false;
    this.attachFigure(
      e,
      figureKindFor(id),
      Math.max(0.72, def.scale * 0.42),
      !!elite || def.elite,
      !!boss || !!def.boss,
    );
    e.monsterId = id;
    e.name = def.name;
    e.elite = !!elite || def.elite;
    e.boss = !!boss || !!def.boss;
    e.champion = champ;
    e.team = 2;
    e.r = def.radius;
    e.speed = def.speed * (champ?.includes("fast") ? 1.55 : e.boss ? 1 : 1.22);
    e.maxHp =
      def.hp *
      scale *
      diff.hp *
      4.2 *
      (e.elite ? 3.2 : 1) *
      (e.boss ? 2.4 : 1) *
      (champ?.includes("extraLife") ? 1.8 : 1);
    e.hp = e.maxHp;
    e.dmg =
      def.dmg *
      scale *
      diff.dmg *
      4.6 *
      (e.elite ? 1.85 : 1) *
      (champ ? 2.15 : 1) *
      (e.boss ? 2.4 : 1);
    e.scale = def.scale;
    e.spawnX = x;
    e.spawnZ = z;
    e.knockLock = 0;
    e.windup = 0;
    e.windupKind = "";
    e.leash = false;
    e.ranged = id === "cultist";
    if (e.boss) e.phase = 1;
    this.ents.push(e);
  }
  spawnProp(p) {
    const npcId =
      p.npcId ??
      {
        blacksmith: "kael",
        mystic: "maera",
        vendor: "vesh",
        stash: "brann",
        bounty: "ryn",
      }[p.kind];
    const npcSprite = {
      ryn: "crusader",
      kael: "barbarian",
      maera: "wizard",
      vesh: "demonhunter",
      io: "necromancer",
      brann: "monk",
    };
    if (
      ["blacksmith", "mystic", "vendor", "stash", "bounty"].includes(p.kind)
    ) {
      if (p.kind === "blacksmith") this.world.anvil(p.x, p.z);
      else if (p.kind === "mystic") this.world.mysticTable(p.x, p.z);
      else if (p.kind === "vendor") this.world.stall(p.x, p.z, 0);
      else if (p.kind === "stash") this.decorGroup.add(this.world.makeChest(p.x, p.z));
      else {
        const board = new THREE.Mesh(
          new THREE.BoxGeometry(1.15, 1.65, 0.12),
          this.texKit.mats.wood,
        );
        board.position.set(p.x, 0.92, p.z);
        board.castShadow = true;
        this.decorGroup.add(board);
      }
      return;
    }
    if (p.kind === "npc" && npcId) {
      const e = this.makeSprite("npc", p.x, p.z, [], 0.01, 16777215);
      if (e.sprite) e.sprite.visible = false;
      if (e.shadow) e.shadow.visible = false;
      this.attachFigure(e, figureKindFor(npcId, true), 0.95, false, false);
      e.kind = "npc";
      e.npcId = npcId;
      e.name = NPCS.find((n) => n.id === npcId)?.name ?? "Wanderer";
      e.r = 0.55;
      e.team = 0;
      this.ents.push(e);
      return;
    }
    const e = this.makeSprite("prop", p.x, p.z, [], 0.01, 16777215);
    if (e.sprite) e.sprite.visible = false;
    if (e.shadow) e.shadow.visible = false;
    e.kind =
      p.kind === "chest"
        ? "chest"
        : p.kind === "shrine"
          ? "shrine"
          : p.kind === "portal" || p.kind === "exit" || p.kind === "riftstone"
            ? "portal"
            : "prop";
    e.shrine = p.shrine;
    e.name = p.kind;
    e.r = 0.7;
    e.team = 0;
    if (p.kind === "chest") {
      const mesh = this.world.makeChest(p.x, p.z);
      this.scene.add(mesh);
      e.mesh = mesh;
    } else if (p.kind === "shrine") {
      const mesh = this.world.makeShrine(p.x, p.z);
      this.scene.add(mesh);
      e.mesh = mesh;
    } else if (p.kind === "riftstone") {
      const mesh = this.world.makeRiftstone(p.x, p.z);
      this.scene.add(mesh);
      e.mesh = mesh;
    } else if (p.kind === "portal" || p.kind === "exit") {
      const mesh = this.world.makePortal(p.x, p.z, 6728447);
      this.scene.add(mesh);
      e.mesh = mesh;
    }
    this.ents.push(e);
  }
  makeSprite(kind, x, z, frames, scale, color) {
    const solid = kind === "player" || kind === "monster" || kind === "npc";
    const mat = new THREE.SpriteMaterial({
      map: frames[0] ?? null,
      color,
      transparent: true,
      depthWrite: solid,
      alphaTest: 0.12,
    });
    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <alphatest_fragment>",
        `if (diffuseColor.r > 0.52 && diffuseColor.b > 0.52 && diffuseColor.g < 0.42) discard;
         #include <alphatest_fragment>`,
      );
    };
    const spr = new THREE.Sprite(mat);
    spr.center.set(0.5, 0);
    spr.position.set(x, 0.02, z);
    spr.scale.set(scale * 0.72, scale, 1);
    this.scene.add(spr);
    const shMat = new THREE.MeshBasicMaterial({
      color: 0,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    const sh = new THREE.Mesh(
      new THREE.CircleGeometry(scale * 0.22, 10),
      shMat,
    );
    sh.rotation.x = -Math.PI / 2;
    sh.position.set(x, 0.05, z);
    this.scene.add(sh);
    return {
      id: nextId(),
      kind,
      x,
      y: 0,
      z,
      vx: 0,
      vz: 0,
      r: 0.5,
      hp: 1,
      maxHp: 1,
      team: 0,
      speed: 0,
      facing: 0,
      sprite: spr,
      shadow: sh,
      frames,
      frame: 0,
      anim: 0,
      dead: false,
      hopY: 0,
      cc: {
        type: "",
        t: 0,
      },
      ccDR: {},
      atkCd: 0,
      iFrames: 0,
      invuln: 0,
      corpse: false,
      scale,
    };
  }
  attachFigure(e, kind, scale, elite, boss) {
    if (!this.figures) return;
    const fig = this.figures.create(kind, scale, elite, boss);
    fig.root.position.set(e.x, 0, e.z);
    this.scene.add(fig.root);
    e.figure = fig;
    e.mesh = fig.root;
    e.scale = fig.height;
  }
  dressLevel(level) {
    if (level.isTown) return;
    for (const r of level.rooms) {
      if (r.kind === "combat" || r.kind === "elite" || r.kind === "start") {
        const n = r.kind === "start" ? 2 : 3;
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + 0.4;
          this.spawnBarrel(
            r.x + Math.cos(a) * (Math.min(r.w, r.d) * 0.32),
            r.z + Math.sin(a) * (Math.min(r.w, r.d) * 0.32),
          );
        }
      }
    }
  }
  loop = () => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.loop);
    let dt = this.clock.getDelta();
    if (dt > 0.1) dt = 0.1;
    this.acc += dt;
    const step = 1 / 60;
    let n = 0;
    while (this.acc >= step && n < 5) {
      this.sim(step);
      this.acc -= step;
      n++;
    }
    this.draw(dt);
    this.uiAcc += dt;
    if (this.uiAcc > 0.09) {
      this.uiAcc = 0;
      this.emit();
    }
  };
  sim(dt) {
    if (this.screen !== "playing" || this.panel === "pause") {
      this.input.poll();
      if (this.input.actions.pauseJust && this.screen === "playing")
        this.openPanel(this.panel === "pause" ? "none" : "pause");
      return;
    }
    const a = this.input.poll();
    if (a.pauseJust) {
      this.openPanel("pause");
      return;
    }
    if (a.invJust)
      this.openPanel(this.panel === "inventory" ? "none" : "inventory");
    if (this.panel !== "none" && this.panel !== "dialogue") return;
    const p = this.player;
    const lv = this.level;
    const h = this.hero;
    if (!p || !lv || !h || p.dead) return;
    this.potionCd = Math.max(0, this.potionCd - dt);
    if (this.potionHot > 0) {
      const tick = Math.min(dt, this.potionHot);
      this.hp = Math.min(
        this.maxHp,
        this.hp + this.potionHotLeft * (tick / this.potionHot),
      );
      this.potionHotLeft = Math.max(
        0,
        this.potionHotLeft - this.potionHotLeft * (tick / this.potionHot),
      );
      this.potionHot -= tick;
    }
    for (const k of Object.keys(this.skillCd))
      this.skillCd[k] = Math.max(0, (this.skillCd[k] ?? 0) - dt);
    for (const k of Object.keys(this.skillChargeCd)) {
      const s = CLASSES[h.classId].skills.find((x) => x.id === k);
      if (!s?.charges) continue;
      if ((this.skillCharges[k] ?? 0) >= s.charges) {
        this.skillChargeCd[k] = 0;
        continue;
      }
      this.skillChargeCd[k] = (this.skillChargeCd[k] ?? 0) - dt;
      if ((this.skillChargeCd[k] ?? 0) <= 0) {
        this.skillCharges[k] = Math.min(
          s.charges,
          (this.skillCharges[k] ?? 0) + 1,
        );
        this.skillChargeCd[k] =
          (this.skillCharges[k] ?? 0) < s.charges
            ? (s.chargeCd ?? s.cooldown)
            : 0;
      }
    }
    for (const b of this.buffs) b.t -= dt;
    this.buffs = this.buffs.filter((b) => b.t > 0);
    p.iFrames = Math.max(0, p.iFrames - dt);
    p.invuln = Math.max(0, p.invuln - dt);
    p.atkCd = Math.max(0, p.atkCd - dt);
    this.ultActive = Math.max(0, this.ultActive - dt);
    if (this.hp < this.hpChase)
      this.hpChase = Math.max(this.hp, this.hpChase - this.maxHp * dt * 0.55);
    else this.hpChase = Math.min(this.hp, this.hpChase + this.maxHp * dt * 1.4);
    if (this.rift?.active) {
      this.rift.time -= dt;
      if (this.rift.time <= 0) {
        this.rift.active = false;
        this.toast("The tear collapses.");
        this.enterPortal("town");
        return;
      }
    }
    this.hitstop = Math.max(0, this.hitstop - dt);
    this.worldBossIn = Math.max(0, this.worldBossIn - dt);
    this.pc = isPc();
    let liveMons = 0;
    for (const e of this.ents)
      if (e.kind === "monster" && e.team === 2 && !e.dead && !e.corpse) liveMons++;
    this.crowdMul = liveMons > 12 ? 0.5 : 1;
    this.vfx?.setCrowd?.(this.crowdMul);
    const camFwd = this.camFwd.set(-1, 0, -1).normalize();
    const camRight = this.camRight
      .crossVectors(camFwd, this.upTmp.set(0, 1, 0))
      .normalize();
    this.pickAim(a);
    if (this.pc && a.pointerJust && this.aimingSlot < 0 && this.panel === "none")
      this.onWorldClick(this.pickAtAim(1.2));
    const hover = this.pickAtAim(1.4);
    if (hover?.kind === "monster" && hover.team === 2 && !hover.dead && !hover.corpse)
      this.target = hover;
    let mx = 0,
      mz = 0;
    const stickMag = Math.hypot(a.moveX, a.moveY);
    const steering = stickMag > 0.08;
    if (this.dash) {
      this.tickDash(dt);
    } else {
      if (steering) {
        mx = camRight.x * a.moveX + camFwd.x * -a.moveY;
        mz = camRight.z * a.moveX + camFwd.z * -a.moveY;
        this.dest = null;
        this.clickGo = null;
      } else if (a.forceMove)
        this.dest = {
          x: this.aim.x,
          z: this.aim.z,
        };
      else if (!this.pc && a.pointerDown && this.aimingSlot < 0)
        this.dest = {
          x: this.aim.x,
          z: this.aim.z,
        };
      if (this.clickGo?.ent && !this.clickGo.ent.dead) {
        const ce = this.clickGo.ent;
        this.dest = { x: ce.x, z: ce.z };
        const reach =
          ce.kind === "pickup" ? 1.5 : ce.kind === "npc" ? 2.6 : 3.4;
        if (Math.hypot(ce.x - p.x, ce.z - p.z) <= reach) {
          if (ce.kind === "pickup") this.collect(ce);
          else this.doInteract(ce);
          this.clickGo = null;
          this.dest = null;
        }
      }
      if (this.dest) {
        const dx = this.dest.x - p.x;
        const dz = this.dest.z - p.z;
        const m = Math.hypot(dx, dz);
        if (m < 0.35) this.dest = null;
        else {
          mx = dx / m;
          mz = dz / m;
        }
      }
      let moveMul = 1;
      if (this.channel?.id === "whirlwind" || this.channel?.id === "bloodspin") {
        const fast = h.skillRunes.whirlwind || h.skillRunes.bloodspin;
        moveMul *= fast ? 0.85 : 0.55;
      } else if (this.aimingSlot >= 0) moveMul *= 0.85;
      const spMul =
        (this.hasBuff("speed") || this.hasBuff("sprint") ? 1.4 : 1) *
        (this.hasBuff("archon") || this.hasBuff("wrath") || this.ultActive > 0
          ? 1.12
          : 1);
      const spd = p.speed * spMul * moveMul;
      let wantVx = 0,
        wantVz = 0;
      if (mx || mz) {
        const m = Math.hypot(mx, mz) || 1;
        wantVx = (mx / m) * spd;
        wantVz = (mz / m) * spd;
      }
      const tau = wantVx || wantVz ? 0.08 : 0.1;
      const k = 1 - Math.exp(-dt / tau);
      p.vx += (wantVx - p.vx) * k;
      p.vz += (wantVz - p.vz) * k;
      if (!wantVx && !wantVz && Math.hypot(p.vx, p.vz) < 0.08) {
        p.vx = 0;
        p.vz = 0;
      }
      if (this.aimingSlot >= 0) {
        const { ux, uz } = this.aimDir(true);
        p.facing = Math.atan2(-ux, -uz);
        this.yaw = p.facing;
      } else if (steering && (p.vx || p.vz)) {
        p.facing = Math.atan2(-p.vx, -p.vz);
        this.yaw = p.facing;
      } else if (a.primary) {
        const { ux, uz } = this.aimDir(true);
        p.facing = Math.atan2(-ux, -uz);
        this.yaw = p.facing;
      } else if (this.dest && (p.vx || p.vz)) {
        p.facing = Math.atan2(-p.vx, -p.vz);
        this.yaw = p.facing;
      }
      this.speed = Math.hypot(p.vx, p.vz);
      if (this.hitstop <= 0) this.moveEnt(p, dt);
    }
    if (a.potionJust) this.drink();
    if (a.ultimateJust) this.fireUlt();
    const { primary, equipped } = this.kit();
    const locked =
      !!this.channel &&
      (this.channel.id === "whirlwind" || this.channel.id === "bloodspin");
    for (let i = 0; i < 4; i++) {
      const sk = equipped[i];
      if (!sk) continue;
      if (sk.kind === "channel") {
        if (a.skills[i]) {
          if (!this.channel || this.channel.id !== sk.id)
            this.castSkill(sk, false, 1);
        } else if (this.channel?.id === sk.id) {
          this.channel = null;
          this.skillCd[sk.id] =
            sk.cooldown * (1 - Math.min(0.5, this.stat("cdr") / 100));
        }
      } else {
        if (a.skillJust[i] && !locked) {
          this.aimingSlot = i;
          this.aimHoldT = 0;
        }
        if (this.aimingSlot === i && a.skills[i]) {
          this.aimHoldT += dt;
          const chargeT = Math.max(0, this.aimHoldT - 0.12);
          const charged = chargeT >= 0.55;
          const { ux, uz } = this.aimDir(true);
          p.facing = Math.atan2(-ux, -uz);
          const shape =
            sk.kind === "dash" || sk.kind === "beam"
              ? "line"
              : sk.kind === "melee"
                ? "cone"
                : "circle";
          const hold = Math.min(1, chargeT / 0.55);
          const range = sk.range * (0.85 + hold * 0.25);
          const rad = (sk.radius || 2) * (0.9 + hold * 0.25);
          this.vfx?.setAim(
            shape,
            p.x,
            p.z,
            p.facing,
            range,
            rad,
            charged,
          );
        }
        if (a.skillReleased[i] && this.aimingSlot === i) {
          const chargeT = Math.max(0, this.aimHoldT - 0.12);
          const chargeMul =
            this.aimHoldT < 0.12
              ? 1
              : 1 + Math.min(1, chargeT / 0.55) * 0.35;
          this.castSkill(sk, true, chargeMul);
          this.aimingSlot = -1;
          this.aimHoldT = 0;
          this.vfx?.clearAim();
        }
      }
    }
    if (this.aimingSlot < 0) this.vfx?.clearAim();
    if (this.channel) {
      this.channel.t -= dt;
      if (this.channel.t <= 0) {
        const ch = CLASSES[h.classId].skills.find(
          (s) => s.id === this.channel.id,
        );
        if (ch)
          this.skillCd[ch.id] =
            ch.cooldown * (1 - Math.min(0.5, this.stat("cdr") / 100));
        this.channel = null;
      } else if (
        this.channel.id === "whirlwind" ||
        this.channel.id === "bloodspin"
      ) {
        const ch = CLASSES[h.classId].skills.find(
          (s) => s.id === this.channel.id,
        );
        if (ch)
          this.dealRadius(
            p.x,
            p.z,
            ch.radius * (this.ultActive > 0 ? 1.2 : 1),
            ch.damage * this.outDmg() * (dt / 0.16),
          );
      }
    }
    const wantAtk = a.primary && !a.forceMove && !this.dash;
    if (p.atkCd <= 0 && wantAtk) {
      const t =
        this.nearestInCone(primary.range + 1.2, p.facing, Math.PI / 4) ??
        this.nearestEnemy(primary.range + 1.2);
      if (t) {
        const d = Math.hypot(t.x - p.x, t.z - p.z);
        if (d < primary.range + 1.2)
          p.facing = Math.atan2(-(t.x - p.x), -(t.z - p.z));
        this.autoAttack(t, primary);
      }
    }
    if (this.potionHot > 0) p.figure?.glow(0x44ff88, 0.12);
    const look = this.nearestEnemy(10);
    this.target =
      look && Math.hypot(look.x - p.x, look.z - p.z) < 9
        ? look
        : this.target && !this.target.dead
          ? this.target
          : null;
    if (this.target?.dead) this.target = null;
    this.regen(dt);
    this.ai(dt);
    this.projectiles(dt);
    this.pickups(dt);
    this.bossLogic(dt);
    this.noteRoom();
    this.interactScan();
    if (a.interactJust && this.interactEnt) this.doInteract(this.interactEnt);
    this.trauma = Math.max(0, this.trauma - dt * 1.8);
    if (this.flashT > 0) this.flashT -= dt;
    else this.legendaryFlash = null;
    this.tickParticles(dt);
    this.numbers = this.numbers.filter((n) => (n.t -= dt) > 0);
    p.hp = this.hp;
    p.maxHp = this.maxHp;
  }
  pickAim(a) {
    this.ndc.set(a.pointerNdcX, a.pointerNdcY);
    this.ray.setFromCamera(this.ndc, this.camera);
    this.aimHit.set(0, 0, 0);
    if (this.ray.ray.intersectPlane(this.plane, this.aimHit)) this.aim.copy(this.aimHit);
  }
  pickAtAim(maxD) {
    let best = null;
    let bd = maxD;
    for (const e of this.ents) {
      if (e === this.player || e.dead) continue;
      if (e.corpse && e.kind === "monster") continue;
      if (
        !["npc", "chest", "shrine", "portal", "prop", "pickup", "monster"].includes(
          e.kind,
        )
      )
        continue;
      const d = Math.hypot(e.x - this.aim.x, e.z - this.aim.z);
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }
  inCombat() {
    const p = this.player;
    if (!p) return false;
    for (const e of this.ents) {
      if (e.kind !== "monster" || e.team !== 2 || e.dead || e.corpse) continue;
      if (Math.hypot(e.x - p.x, e.z - p.z) < 12) return true;
    }
    return false;
  }
  onWorldClick(picked) {
    const p = this.player;
    if (!p || !picked) return;
    if (picked.kind === "monster" && picked.team === 2 && !picked.dead) {
      this.target = picked;
      return;
    }
    if (picked.kind === "pickup") {
      if (Math.hypot(picked.x - p.x, picked.z - p.z) <= 1.5) this.collect(picked);
      else {
        this.clickGo = { x: picked.x, z: picked.z, ent: picked };
        this.dest = { x: picked.x, z: picked.z };
      }
      return;
    }
    if (this.inCombat()) return;
    if (["npc", "chest", "shrine", "portal"].includes(picked.kind)) {
      const reach = picked.kind === "npc" ? 2.6 : 3.4;
      if (Math.hypot(picked.x - p.x, picked.z - p.z) <= reach)
        this.doInteract(picked);
      else {
        this.clickGo = { x: picked.x, z: picked.z, ent: picked };
        this.dest = { x: picked.x, z: picked.z };
      }
    }
  }
  tickDash(dt) {
    const d = this.dash;
    const p = this.player;
    if (!d || !p || !this.level) {
      this.dash = null;
      return;
    }
    const prev = d.t / d.max;
    d.t += dt;
    const u = Math.min(1, d.t / d.max);
    const stepDist = d.dist * (u - prev);
    p.x += d.ux * stepDist;
    p.z += d.uz * stepDist;
    const r = resolveWalls(p.x, p.z, p.r, this.level.walls);
    p.x = r.x;
    p.z = r.z;
    if (!isWalkable(this.level, p.x, p.z)) {
      p.x -= d.ux * stepDist;
      p.z -= d.uz * stepDist;
      d.t = d.max;
    }
    p.hopY = d.peak * 4 * u * (1 - u);
    p.vx = d.ux * (d.dist / d.max);
    p.vz = d.uz * (d.dist / d.max);
    p.facing = Math.atan2(-d.ux, -d.uz);
    this.yaw = p.facing;
    this.speed = Math.hypot(p.vx, p.vz);
    p.iFrames = Math.max(0, d.max - d.t);
    if (p.figure) p.figure.root.position.set(p.x, p.hopY, p.z);
    else if (p.sprite) p.sprite.position.set(p.x, 0.02 + p.hopY, p.z);
    if (p.shadow) p.shadow.position.set(p.x, 0.05, p.z);
    if (u >= 1 || d.t >= d.max) {
      p.hopY = 0;
      p.iFrames = 0;
      p.vx = 0;
      p.vz = 0;
      this.dealRadius(p.x, p.z, d.radius, d.dmg, { knock: d.knock });
      if (d.rune && (d.skillId === "leap" || d.skillId === "warleap"))
        this.dealRadius(p.x, p.z, d.radius + 0.6, d.dmg * 0.5);
      this.trauma += d.skillId === "leap" || d.skillId === "warleap" ? 0.45 : 0.28;
      this.hitstop = Math.max(this.hitstop, 0.028);
      this.post?.punch(0.0024, 0.12);
      this.vfx?.leap(p.x, p.z);
      this.vfx?.shock(p.x, p.z, 0xffaa44);
      this.dash = null;
    }
  }
  moveEnt(e, dt) {
    if (!this.level) return;
    if (e.cc.t > 0) {
      e.cc.t -= dt;
      if (e.cc.type === "stun" || e.cc.type === "freeze") {
        e.vx = 0;
        e.vz = 0;
      } else if (e.cc.type === "snare") {
        e.vx *= 0.35;
        e.vz *= 0.35;
      }
    }
    let nx = e.x + e.vx * dt;
    let nz = e.z + e.vz * dt;
    const r = resolveWalls(nx, nz, e.r, this.level.walls);
    nx = r.x;
    nz = r.z;
    if (!isWalkable(this.level, nx, nz)) {
      if (isWalkable(this.level, nx, e.z)) nz = e.z;
      else if (isWalkable(this.level, e.x, nz)) nx = e.x;
      else {
        nx = e.x;
        nz = e.z;
      }
    }
    e.x = nx;
    e.z = nz;
    if (e.figure) e.figure.root.position.set(e.x, e.hopY ?? 0, e.z);
    else if (e.sprite) e.sprite.position.set(e.x, 0.02, e.z);
    if (e.shadow) e.shadow.position.set(e.x, 0.05, e.z);
    if (e.mesh && !e.figure) e.mesh.position.set(e.x, e.mesh.position.y, e.z);
    if (e.light && !e.figure) e.light.position.set(e.x, 2, e.z);
    e.anim += dt * (Math.hypot(e.vx, e.vz) > 0.2 ? 8 : 3);
    if (e.frames && e.frames.length && e.sprite && e.sprite.visible) {
      const i = Math.floor(e.anim) % e.frames.length;
      e.frame = i;
      const mat = e.sprite.material;
      mat.map = e.frames[i] ?? mat.map;
      const left = e.vx < -0.05 || (e.vx === 0 && Math.sin(e.facing) > 0.2);
      e.sprite.scale.set((left ? -1 : 1) * e.scale * 0.72, e.scale, 1);
    }
  }
  regen(dt) {
    const h = this.hero;
    const cls = CLASSES[h.classId];
    if (cls.resource === "Fury" || cls.resource === "Hatred")
      this.resource = Math.max(0, this.resource - dt * 8);
    else this.resource = Math.min(this.maxResource, this.resource + dt * 14);
    if (this.hasBuff("warcry") && cls.resource === "Fury")
      this.resource = Math.min(this.maxResource, this.resource + dt * 18);
  }
  drink() {
    const h = this.hero;
    if (this.potionCd > 0 || this.potionHot > 0) return;
    if (this.hp >= this.maxHp - 1) {
      this.toast("Already whole");
      return;
    }
    if ((h.potionCount ?? 0) <= 0) {
      this.toast("No potions");
      return;
    }
    h.potionCount -= 1;
    this.potionCd = 2.6;
    this.potionHot = 2.5;
    this.potionHotLeft = this.maxHp * 0.5;
    this.audio.potion();
    this.burst(this.player.x, 1, this.player.z, 16737860, 14);
    this.persist();
  }
  kit() {
    const h = this.hero;
    const cls = CLASSES[h.classId];
    return {
      cls,
      primary:
        cls.skills.find(
          (s) => s.id === (h.primaryId || defaultPrimary(h.classId)),
        ) ?? cls.skills[0],
      equipped: (h.loadout?.length === 4
        ? h.loadout
        : defaultLoadout(h.classId)
      )
        .map((id) => cls.skills.find((s) => s.id === id))
        .filter((s) => !!s),
      ult:
        cls.skills.find((s) => s.id === defaultUlt(h.classId)) ??
        cls.skills[cls.skills.length - 1],
    };
  }
  initCharges() {
    if (!this.hero) return;
    const { equipped } = this.kit();
    for (const s of equipped)
      if (s.charges) {
        this.skillCharges[s.id] = s.charges;
        this.skillChargeCd[s.id] = 0;
      }
  }
  fireUlt() {
    if (this.ultCharge < 1 || this.ultActive > 0) return;
    const { ult } = this.kit();
    this.ultCharge = 0;
    this.ultActive = ult.duration || 12;
    this.buffs.push({
      id: ult.id,
      name: ult.name,
      t: this.ultActive,
      mag: 1,
    });
    const p = this.player;
    this.burst(p.x, 1.3, p.z, 16763989, 28);
    this.vfx?.burst(p.x, 1.3, p.z, 0xffcc55, 22, "ember");
    this.vfx?.ring(p.x, p.z, 0xffcc66, 7, 0.5);
    this.post?.punch(0.0032, 0.18);
    this.trauma += 0.4;
    this.audio.swing();
  }
  aimDir(aimed) {
    const p = this.player;
    let ux = this.aim.x - p.x;
    let uz = this.aim.z - p.z;
    if (!aimed) {
      const t = this.nearestEnemy(12);
      if (t) {
        ux = t.x - p.x;
        uz = t.z - p.z;
        this.target = t;
      }
    }
    const mag = Math.hypot(ux, uz) || 1;
    return {
      ux: ux / mag,
      uz: uz / mag,
      mag,
    };
  }
  castSkill(skill, aimed, charge = 1) {
    const h = this.hero;
    const p = this.player;
    if ((h.skillRanks[skill.id] ?? 0) < 1) return;
    if (
      this.channel &&
      skill.id !== this.channel.id &&
      skill.kind !== "channel"
    )
      return;
    if (skill.charges) {
      if ((this.skillCharges[skill.id] ?? 0) <= 0) return;
    } else if ((this.skillCd[skill.id] ?? 0) > 0 && skill.kind !== "channel")
      return;
    const rank = h.skillRanks[skill.id] ?? 1;
    const rune = !!h.skillRunes[skill.id];
    const chargeMul = Math.max(1, charge);
    const dmgMul =
      (0.9 + rank * 0.12) *
      this.outDmg() *
      (this.ultActive > 0 ? 1.45 : 1) *
      chargeMul;
    const cdr = this.stat("cdr") / 100;
    if (skill.charges) {
      this.skillCharges[skill.id] =
        (this.skillCharges[skill.id] ?? skill.charges) - 1;
      if (!this.skillChargeCd[skill.id])
        this.skillChargeCd[skill.id] = skill.chargeCd ?? skill.cooldown;
    } else if (skill.kind !== "channel")
      this.skillCd[skill.id] = skill.cooldown * (1 - Math.min(0.5, cdr));
    const { ux, uz, mag } = this.aimDir(aimed);
    p.facing = Math.atan2(-ux, -uz);
    if (
      skill.kind === "dash" ||
      skill.id === "charge" ||
      skill.id === "leap" ||
      skill.id === "warleap"
    ) {
      const holdBoost = Math.max(0, chargeMul - 1);
      const dist =
        skill.dash *
        (rune ? 1.12 : 1) *
        (this.hasPower("dashIframes") ? 1.1 : 1) *
        (1 + holdBoost);
      const dur =
        skill.duration ||
        (skill.id === "leap" || skill.id === "warleap" ? 0.28 : 0.22);
      const peak =
        skill.id === "leap" || skill.id === "warleap" ? 1.1 : 0;
      this.dash = {
        ux,
        uz,
        dist,
        t: 0,
        max: dur,
        peak,
        radius: skill.radius * (0.85 + 0.3 * Math.min(1, chargeMul)),
        dmg: skill.damage * dmgMul,
        knock: skill.id === "charge" ? 5 : 3,
        skillId: skill.id,
        rune,
        landed: false,
      };
      p.iFrames = dur * (this.hasPower("dashIframes") ? 1.4 : 1);
      p.facing = Math.atan2(-ux, -uz);
      this.yaw = p.facing;
      this.camLagT = 0.16;
      this.dest = null;
      p.figure?.playAttack();
      this.audio.swing();
      return;
    }
    if (skill.id === "sprint") {
      this.buffs.push({
        id: "sprint",
        name: skill.name,
        t: skill.duration,
        mag: 1,
      });
      this.buffs.push({
        id: "speed",
        name: "Sprint",
        t: skill.duration,
        mag: 1,
      });
      p.iFrames = 0;
      this.audio.swing();
      return;
    }
    if (
      skill.kind === "buff" ||
      skill.id === "wrath" ||
      skill.id === "ancestral"
    ) {
      this.buffs.push({
        id: skill.id,
        name: skill.name,
        t: skill.duration + (rune ? 2 : 0),
        mag: 1,
      });
      if (skill.id === "wrath")
        this.buffs.push({
          id: "damage",
          name: skill.name,
          t: skill.duration,
          mag: 1,
        });
      if (skill.id === "demoralize")
        this.applyCCRadius(p.x, p.z, skill.radius || 5.5, "snare", 2.4);
      this.burst(p.x, 1.2, p.z, 16768392, 18);
      this.audio.swing();
      return;
    }
    if (skill.kind === "channel") {
      if (this.channel?.id === skill.id) return;
      this.channel = {
        id: skill.id,
        t: skill.duration || 4,
        max: skill.duration || 4,
      };
      this.dealRadius(p.x, p.z, skill.radius, skill.damage * dmgMul);
      if (this.hasPower("whirlwindTrail"))
        this.groundHazard(p.x, p.z, 1.4, 1.6, 10 * dmgMul);
      return;
    }
    if (skill.kind === "nova" || skill.id === "stomp") {
      this.dealRadius(p.x, p.z, skill.radius, skill.damage * dmgMul, {
        stun: skill.id === "stomp" ? 1.2 : 0,
        knock: 4,
      });
      this.burst(p.x, 1, p.z, 16737826, 24);
      this.vfx?.shock(p.x, p.z, 0xff6622);
      this.trauma += 0.4;
      this.hitstop = 0.032;
      this.post?.punch(0.002, 0.1);
      this.audio.hit(true);
      return;
    }
    if (skill.kind === "melee") {
      const hx = p.x + ux * 1.4;
      const hz = p.z + uz * 1.4;
      this.dealCone(
        p.x,
        p.z,
        p.facing,
        skill.range,
        Math.PI / 4,
        skill.damage * dmgMul,
        { knock: 2 },
      );
      if (skill.id === "cleave" || skill.id === "rend")
        this.applyDoTRadius(
          hx,
          hz,
          skill.radius,
          0.28 * dmgMul,
          rune ? 4.2 : 2.2,
        );
      if (skill.id === "lacerate") {
        const heal = this.maxHp * (rune ? 0.06 : 0.03);
        this.hp = Math.min(this.maxHp, this.hp + heal);
        this.floatNum(p.x, 2.2, p.z, Math.round(heal), false, false, "heal");
      }
      this.fxSlash(hx, hz);
      p.attackT = 0.28;
      p.figure?.playAttack();
      this.audio.swing();
      return;
    }
    if (skill.kind === "aoe") {
      const tx = p.x + ux * Math.min(skill.range, mag);
      const tz = p.z + uz * Math.min(skill.range, mag);
      this.dealRadius(tx, tz, skill.radius, skill.damage * dmgMul, {
        knock: 3,
        stun: skill.id === "hota" || skill.id === "earthsplitter" ? 0.7 : 0,
      });
      if (skill.id === "hota") {
        this.trauma += 0.55;
        this.hitstop = 0.032;
        this.vfx?.shock(tx, tz, 0xffaa44);
        this.post?.punch(0.0022, 0.1);
      }
      if (skill.id === "demoralize")
        this.applyCCRadius(tx, tz, skill.radius, "snare", 3);
      if (
        skill.id === "caltrops" ||
        skill.id === "consecrate" ||
        skill.id === "sanctuary" ||
        skill.id === "decrepify"
      )
        this.groundHazard(
          tx,
          tz,
          skill.radius,
          skill.duration,
          skill.damage * 8 * dmgMul,
          skill.id,
        );
      this.burst(tx, 0.6, tz, 16755268, 18);
      this.audio.hit(false);
      return;
    }
    if (skill.kind === "projectile" || skill.kind === "beam") {
      const n =
        skill.id === "multishot"
          ? this.hasPower("multishotPlus") || rune
            ? 7
            : 5
          : skill.id === "shards" && rune
            ? 5
            : 1;
      const spread = n > 1 ? 0.22 : 0;
      for (let i = 0; i < n; i++) {
        const ang = Math.atan2(uz, ux) + (i - (n - 1) / 2) * spread;
        this.fireProj(p, Math.cos(ang), Math.sin(ang), skill, dmgMul, rune);
      }
      if (skill.kind === "beam")
        this.dealBeam(
          p.x,
          p.z,
          ux,
          uz,
          skill.range,
          skill.radius,
          skill.damage * dmgMul,
        );
      this.audio.swing();
    }
  }
  cast(slot) {
    const { equipped, primary } = this.kit();
    const skill = equipped[slot] ?? primary;
    if (skill) this.castSkill(skill, false);
  }
  fireProj(owner, ux, uz, skill, dmgMul, rune) {
    const frames = this.frames.fire ?? this.frames.slash ?? [];
    const e = this.makeSprite(
      "projectile",
      owner.x + ux * 0.8,
      owner.z + uz * 0.8,
      frames,
      0.9,
      16777215,
    );
    e.kind = "projectile";
    e.vx = ux * 16;
    e.vz = uz * 16;
    e.r = skill.radius || 0.4;
    e.ttl = skill.duration + 0.3;
    e.dmg = skill.damage * dmgMul;
    e.team = owner.team;
    e.owner = owner.id;
    e.skillId = skill.id;
    e.pierce = skill.id === "bonespear" || skill.id === "impale" ? 4 : 0;
    e.homing = skill.id === "spirit";
    if (rune && skill.id === "hungering") e.ttl += 0.5;
    this.ents.push(e);
  }
  dealBeam(x, z, ux, uz, range, rad, dmg) {
    for (const e of this.ents) {
      if (e.team !== 2 || e.dead || e.corpse) continue;
      const dx = e.x - x;
      const dz = e.z - z;
      const along = dx * ux + dz * uz;
      if (along < 0 || along > range) continue;
      const px = x + ux * along;
      const pz = z + uz * along;
      if (Math.hypot(e.x - px, e.z - pz) < rad + e.r) this.hurt(e, dmg, false);
    }
  }
  groundHazard(x, z, r, dur, dps, id = "hz") {
    const e = this.makeSprite(
      "prop",
      x,
      z,
      this.frames.holy ?? [],
      r * 1.4,
      16755302,
    );
    e.kind = "prop";
    e.name = "hazard:" + id;
    e.ttl = dur;
    e.dmg = dps;
    e.r = r;
    e.team = 0;
    this.ents.push(e);
  }
  summonPets(id, rune) {
    const n = id === "army" ? 4 : 1;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      this.spawnMonster(
        this.player.x + Math.cos(a) * 2,
        this.player.z + Math.sin(a) * 2,
        "skeleton",
      );
      const e = this.ents[this.ents.length - 1];
      e.team = 1;
      e.kind = "monster";
      e.ttl = rune ? 9 : 6;
      e.name = "pet";
    }
  }
  autoAttack(t, skill) {
    const p = this.player;
    const prim = skill ?? this.kit().primary;
    const empowered = this.ultActive > 0;
    p.atkCd =
      (prim.cooldown || 0.42) *
      (1 - Math.min(0.4, this.stat("cdr") / 200)) *
      (empowered ? 0.82 : 1);
    const dmg = this.outDmg() * prim.damage * (empowered ? 1.55 : 1);
    this.dealCone(
      p.x,
      p.z,
      p.facing,
      prim.range,
      Math.PI / 4,
      dmg,
      { knock: 1.4 },
    );
    if (prim.id === "cleave")
      this.applyDoTRadius(p.x, p.z, prim.radius, dmg * 0.12, 2);
    if (prim.id === "lacerate") {
      const heal = this.maxHp * 0.03;
      this.hp = Math.min(this.maxHp, this.hp + heal);
      this.floatNum(p.x, 2.2, p.z, Math.round(heal), false, false, "heal");
    }
    this.fxSlash((p.x + t.x) / 2, (p.z + t.z) / 2);
    p.attackT = 0.28;
    p.figure?.playAttack();
    this.audio.swing();
    this.target = t;
    if (empowered) {
      this.burst((p.x + t.x) / 2, 0.9, (p.z + t.z) / 2, 16763989, 8);
      this.vfx?.burst((p.x + t.x) / 2, 0.9, (p.z + t.z) / 2, 0xffcc55, 8, "ember");
    }
    this.ultCharge = Math.min(1, this.ultCharge + (empowered ? 0 : 1 / 14));
  }
  ai(dt) {
    const p = this.player;
    const mons = this.ents.filter(
      (e) => e.kind === "monster" && !e.dead && e.team === 2,
    );
    for (const e of mons) {
      e.atkCd = Math.max(0, e.atkCd - dt);
      e.iFrames = Math.max(0, e.iFrames - dt);
      e.knockLock = Math.max(0, (e.knockLock ?? 0) - dt);
      e.windup = Math.max(0, (e.windup ?? 0) - dt);
      if (e.ttl != null) {
        e.ttl -= dt;
        if (e.ttl <= 0) {
          this.kill(e);
          continue;
        }
      }
      const spawnD = Math.hypot(e.x - (e.spawnX ?? e.x), e.z - (e.spawnZ ?? e.z));
      if (spawnD > 25) e.leash = true;
      if (e.leash) {
        const hx = (e.spawnX ?? e.x) - e.x;
        const hz = (e.spawnZ ?? e.z) - e.z;
        const hm = Math.hypot(hx, hz);
        if (hm < 0.45) {
          e.leash = false;
          e.hp = e.maxHp;
          e.vx = 0;
          e.vz = 0;
          this.moveEnt(e, 0);
          continue;
        }
        e.vx = (hx / hm) * e.speed;
        e.vz = (hz / hm) * e.speed;
        e.facing = Math.atan2(-e.vx, -e.vz);
        this.moveEnt(e, dt);
        continue;
      }
      let dx = p.x - e.x;
      let dz = p.z - e.z;
      const dist = Math.hypot(dx, dz) || 1;
      if (e.champion?.includes("vortex") && dist < 8) {
        p.x += (e.x - p.x) * dt * 0.35;
        p.z += (e.z - p.z) * dt * 0.35;
      }
      if (e.champion?.includes("teleporter") && this.rng.chance(dt * 0.25)) {
        this.vfx?.warnCircle(p.x, p.z, 1.6, 0.45);
        e.x = p.x + (this.rng.next() - 0.5) * 6;
        e.z = p.z + (this.rng.next() - 0.5) * 6;
      }
      if (e.champion?.includes("jailer") && dist < 7 && e.atkCd <= 0) {
        this.vfx?.warnCircle(p.x, p.z, 1.4, 0.7);
        this.applyCC(p, "snare", 1.2);
        e.atkCd = 4;
      }
      if (e.champion?.includes("molten") && dist < 2.2) this.hurtPlayer(8 * dt);
      if (e.champion?.includes("electrified") && dist < 3)
        this.hurtPlayer(6 * dt);
      if (e.champion?.includes("molten") && e.atkCd <= 0 && dist < 7) {
        this.vfx?.warnCircle(e.x, e.z, 2.6, 0.85);
        e.atkCd = 5;
        e.windup = 0.85;
        e.windupKind = "nova";
      }
      if (e.windupKind === "nova" && e.windup <= 0) {
        this.dealRadius(e.x, e.z, 2.6, (e.dmg ?? 12) * 0.8);
        e.windupKind = "";
      }
      const ranged = e.ranged || e.monsterId === "cultist";
      const stopAt = ranged ? 8.5 : 1.4;
      if (e.windup > 0) {
        e.vx = 0;
        e.vz = 0;
        if (e.windup <= 0.02) {
          if (e.windupKind === "ranged") {
            const ux = dx / dist,
              uz = dz / dist;
            this.fireEnemyBolt(e, ux, uz);
          } else if (e.windupKind === "swing") {
            if (dist < 2.2 && p.iFrames <= 0 && p.invuln <= 0) {
              this.hurtPlayer(e.dmg ?? 8);
              if (e.champion?.includes("frozen")) this.applyCC(p, "freeze", 0.6);
            }
          }
          e.windupKind = "";
        }
      } else if (dist > stopAt) {
        let sx = 0,
          sz = 0;
        for (const o of mons) {
          if (o === e) continue;
          const ddx = e.x - o.x;
          const ddz = e.z - o.z;
          const dm = Math.hypot(ddx, ddz) || 0.01;
          if (dm < 1.6) {
            sx += ddx / dm;
            sz += ddz / dm;
          }
        }
        e.vx = (dx / dist) * e.speed + sx * 1.2;
        e.vz = (dz / dist) * e.speed + sz * 1.2;
        e.facing = Math.atan2(-e.vx, -e.vz);
      } else {
        e.vx = 0;
        e.vz = 0;
        e.facing = Math.atan2(-dx, -dz);
        if (e.atkCd <= 0 && p.iFrames <= 0 && p.invuln <= 0) {
          const wind = 0.7 + this.rng.next() * 0.4;
          e.windup = wind;
          e.atkCd = (e.boss ? 1.8 : ranged ? 2.2 : 1.15) + wind;
          e.windupKind = ranged ? "ranged" : "swing";
          if (ranged) this.vfx?.warnCircle(p.x, p.z, 0.9, wind);
          else this.vfx?.warnCircle(e.x + (dx / dist) * 1.1, e.z + (dz / dist) * 1.1, 1.15, wind);
        }
      }
      this.moveEnt(e, dt);
    }
    for (const e of this.ents)
      if (e.kind === "monster" && e.team === 1 && !e.dead) {
        const t = this.nearestEnemyFrom(e, 12);
        if (t) {
          const dx = t.x - e.x,
            dz = t.z - e.z,
            m = Math.hypot(dx, dz) || 1;
          e.vx = (dx / m) * 4;
          e.vz = (dz / m) * 4;
          if (m < 1.4 && e.atkCd <= 0) {
            e.atkCd = 0.8;
            this.hurt(t, 12 * this.outDmg() * 0.3, false);
          }
          e.atkCd = Math.max(0, e.atkCd - dt);
        }
        this.moveEnt(e, dt);
      }
  }
  fireEnemyBolt(owner, ux, uz) {
    const frames = this.frames.fire ?? this.frames.slash ?? [];
    const e = this.makeSprite(
      "projectile",
      owner.x + ux * 0.8,
      owner.z + uz * 0.8,
      frames,
      0.7,
      16737826,
    );
    e.kind = "projectile";
    e.vx = ux * 9;
    e.vz = uz * 9;
    e.r = 0.35;
    e.ttl = 1.6;
    e.dmg = (owner.dmg ?? 10) * 0.85;
    e.team = 2;
    e.owner = owner.id;
    e.hostile = true;
    this.ents.push(e);
  }
  projectiles(dt) {
    for (const e of this.ents) {
      if (e.kind !== "projectile" || e.dead) continue;
      e.ttl = (e.ttl ?? 1) - dt;
      if (e.homing) {
        const t = this.nearestEnemyFrom(e, 16);
        if (t) {
          const dx = t.x - e.x,
            dz = t.z - e.z,
            m = Math.hypot(dx, dz) || 1;
          e.vx = expLerp(e.vx, (dx / m) * 14, 6, dt);
          e.vz = expLerp(e.vz, (dz / m) * 14, 6, dt);
        }
      }
      this.moveEnt(e, dt);
      if ((e.ttl ?? 0) <= 0) {
        e.dead = true;
        if (e.sprite) this.scene.remove(e.sprite);
        if (e.shadow) this.scene.remove(e.shadow);
        continue;
      }
      if (e.hostile && this.player && !this.player.dead) {
        if (Math.hypot(this.player.x - e.x, this.player.z - e.z) < this.player.r + e.r) {
          this.hurtPlayer(e.dmg ?? 10);
          e.dead = true;
          if (e.sprite) this.scene.remove(e.sprite);
          if (e.shadow) this.scene.remove(e.shadow);
          continue;
        }
      }
      for (const m of this.ents)
        if (
          m.team === 2 &&
          !m.dead &&
          !m.corpse &&
          Math.hypot(m.x - e.x, m.z - e.z) < m.r + e.r
        ) {
          this.hurt(m, e.dmg ?? 10, false);
          if (e.skillId === "hungering" && this.hero?.skillRunes.hungering) {
            e.vx *= -1;
            e.vz *= -1;
            e.pierce = 1;
          }
          if (!e.pierce) {
            e.dead = true;
            if (e.sprite) this.scene.remove(e.sprite);
            if (e.shadow) this.scene.remove(e.shadow);
            break;
          } else e.pierce -= 1;
        }
    }
    for (const e of this.ents)
      if (e.name?.startsWith("hazard:") && e.ttl != null) {
        e.ttl -= dt;
        if (e.ttl <= 0) {
          e.dead = true;
          if (e.sprite) this.scene.remove(e.sprite);
          if (e.shadow) this.scene.remove(e.shadow);
          continue;
        }
        this.dealRadius(
          e.x,
          e.z,
          e.r,
          (e.dmg ?? 8) * dt,
          e.name.includes("decrepify") ? { snare: 0.4 } : void 0,
        );
      }
    this.ents = this.ents.filter((e) => !e.dead || e.corpse);
  }
  pickups(dt) {
    const p = this.player;
    const rad = this.save.settings.autoPickup + this.stat("pickup");
    const rank =
      {
        off: -1,
        white: 0,
        blue: 1,
        yellow: 2,
        all: 4,
      }[this.save.settings.autoLoot ?? "yellow"] ?? 2;
    const rarityRank = (r) =>
      r === "normal" ? 0 : r === "magic" ? 1 : r === "rare" ? 2 : 3;
    for (const e of this.ents) {
      if (e.kind !== "pickup" || e.dead) continue;
      if (e.ttl != null) {
        e.ttl -= dt;
        if (e.ttl <= 0) {
          e.dead = true;
          if (e.beam) this.vfx?.dropShaft(e.beam, e.light ?? null);
          if (e.sprite) this.scene.remove(e.sprite);
          if (e.mesh) this.scene.remove(e.mesh);
          if (e.shadow) this.scene.remove(e.shadow);
          if (e.light) this.scene.remove(e.light);
          continue;
        }
      }
      const d = Math.hypot(e.x - p.x, e.z - p.z);
      const itemRank = e.item ? rarityRank(e.item.rarity) : e.gold || e.globe ? 0 : 0;
      const legendary = e.item && (e.item.rarity === "legendary" || e.item.rarity === "set");
      const autoOk =
        e.globe ||
        e.gold ||
        (e.item && itemRank <= rank && (!legendary || rank >= 4));
      const magnet = autoOk && d < rad;
      const walk = d < 1.5 && autoOk;
      if (magnet) {
        e.x = expLerp(e.x, p.x, 8, dt);
        e.z = expLerp(e.z, p.z, 8, dt);
        this.moveEnt(e, 0);
      }
      if (walk || (d < 0.7 && autoOk)) this.collect(e);
    }
  }
  collect(e) {
    if (!e || e.dead || e.taken) return;
    const h = this.hero;
    if (e.item && h.inventory.length >= 60) {
      if (!e.fullNoted) {
        this.toast("Inventory full");
        e.fullNoted = true;
      }
      return;
    }
    e.taken = true;
    if (e.globe) {
      const heal = this.maxHp * 0.14;
      this.hp = Math.min(this.maxHp, this.hp + heal);
      this.floatNum(
        this.player.x,
        2.2,
        this.player.z,
        Math.round(heal),
        false,
        false,
        "heal",
      );
      this.audio.potion();
    }
    if (e.gold) {
      const g = Math.floor(
        e.gold *
          (1 + this.stat("goldFind") / 100) *
          DIFFICULTY[h.difficulty].gold,
      );
      h.gold += g;
      this.toast("+" + g + " Gold");
      this.audio.pickup();
    }
    if (e.item) {
      if (h.inventory.length >= 60) {
        this.toast("Inventory full");
        return;
      }
      if (!e.item.identified && e.item.rarity !== "normal") {
      }
      h.inventory.push(e.item);
      this.toast(e.item.name, e.item);
      if (e.item.rarity === "legendary" || e.item.rarity === "set") {
        this.audio.legendary();
        this.legendaryFlash = e.item.name;
        this.flashT = 1.6;
        h.stats.legendaries += 1;
      } else this.audio.pickup();
    }
    e.dead = true;
    if (e.beam) this.vfx?.dropShaft(e.beam, e.light ?? null);
    if (e.sprite) this.scene.remove(e.sprite);
    if (e.mesh) this.scene.remove(e.mesh);
    if (e.shadow) this.scene.remove(e.shadow);
    if (e.light) this.scene.remove(e.light);
    this.persist();
  }
  bossLogic(dt) {
    const p = this.player;
    for (const e of this.ents) {
      if (!e.boss || e.dead) continue;
      e.telegraph = (e.telegraph ?? 0) - dt;
      if ((e.bossWind ?? 0) > 0) {
        e.bossWind -= dt;
        if (e.bossWind <= 0) {
          const pattern = e.bossPat ?? 0;
          const tx = e.bossTx ?? p.x;
          const tz = e.bossTz ?? p.z;
          if (!e.dead) {
            if (pattern === 0)
              this.dealRadius(tx, tz, 2.8, (e.dmg ?? 20) * 1.8, { stun: 0.5 });
            else if (pattern === 1)
              this.dealRadius(e.x, e.z, 4.2, (e.dmg ?? 20) * 1.4, { knock: 5 });
            else {
              const ux = p.x - e.x,
                uz = p.z - e.z,
                m = Math.hypot(ux, uz) || 1;
              this.fireEnemyBolt(e, ux / m, uz / m);
              this.dealRadius(tx, tz, 1.6, (e.dmg ?? 20) * 1.1);
            }
          }
          e.bossWind = 0;
        }
      }
      const hpPct = e.hp / e.maxHp;
      if (hpPct < 0.3 && !e.enraged) {
        e.enraged = true;
        e.speed *= 1.25;
        e.dmg *= 1.2;
        this.toast(e.name + " enrages.");
        this.vfx?.warnCircle(e.x, e.z, 4.5, 1.1);
      }
      if (hpPct < 0.66 && (e.phase ?? 1) === 1) {
        e.phase = 2;
        this.toast(e.name + " enters a second hymn.");
        this.spawnMonster(e.x + 3, e.z, "imp", true);
        this.spawnMonster(e.x - 3, e.z, "imp", true);
      }
      if (hpPct < 0.33 && (e.phase ?? 1) < 3) {
        e.phase = 3;
        this.toast(e.name + " tears the floor.");
        this.vfx?.warnCircle(e.x, e.z, 5.2, 0.7);
        e.bossPat = 1;
        e.bossTx = e.x;
        e.bossTz = e.z;
        e.bossWind = 0.7;
        e.telegraph = 1.5;
      }
      if ((e.telegraph ?? 0) <= 0 && (e.bossWind ?? 0) <= 0) {
        const pattern = (e.bossAtk ?? 0) % 3;
        e.bossAtk = (e.bossAtk ?? 0) + 1;
        e.bossPat = pattern;
        e.bossTx = p.x;
        e.bossTz = p.z;
        const wind = pattern === 0 ? 0.7 : pattern === 1 ? 0.8 : 0.62;
        e.bossWind = wind;
        e.telegraph = (e.enraged ? 0.4 : 0.65) + wind;
        if (pattern === 0) this.vfx?.warnCircle(p.x, p.z, 2.8, wind);
        else if (pattern === 1) this.vfx?.warnCircle(e.x, e.z, 4.2, wind);
        else this.vfx?.warnCircle(p.x, p.z, 1.6, wind);
      }
    }
  }
  noteRoom() {
    const lv = this.level;
    const p = this.player;
    if (!lv || !p || lv.isTown) return;
    for (const r of lv.rooms) {
      if (Math.abs(p.x - r.x) > r.w / 2 - 0.2 || Math.abs(p.z - r.z) > r.d / 2 - 0.2) continue;
      const key = r.x + "," + r.z;
      if (this.roomKey && this.roomKey !== key)
        this.checkpoint = { x: r.x, z: r.z };
      this.roomKey = key;
      return;
    }
  }
  pathQuest() {
    const h = this.hero;
    const p = this.player;
    if (!h || !p || this.screen !== "playing") return;
    const q = h.quests.find((x) => !x.done);
    const def = q ? QUESTS.find((x) => x.id === q.id) : null;
    const step = def && q ? def.steps[q.step] : null;
    let tx = null;
    let tz = null;
    const pick = (pred) => this.ents.find((e) => !e.dead && pred(e));
    if (step?.kind === "talk") {
      const n = pick((e) => e.npcId === step.target);
      if (n) {
        tx = n.x;
        tz = n.z;
      }
    } else if (step?.kind === "enter" && step.target === "rift") {
      const n = pick((e) => e.name === "riftstone");
      if (n) {
        tx = n.x;
        tz = n.z;
      }
    } else if (step?.kind === "enter") {
      const n = pick((e) => e.kind === "portal" && e.name !== "riftstone");
      if (n) {
        tx = n.x;
        tz = n.z;
      }
    } else if (step?.kind === "kill" || step?.kind === "collect") {
      const n = pick((e) => e.kind === "monster" && e.team === 2 && !e.corpse);
      if (n) {
        tx = n.x;
        tz = n.z;
      }
    }
    if (tx == null) return;
    this.clickGo = null;
    this.dest = { x: tx, z: tz };
  }
  interactScan() {
    const p = this.player;
    this.interact = null;
    this.interactEnt = null;
    if (!p) return;
    const labelOf = (e) => {
      const npc = NPCS.find((n) => n.id === e.npcId);
      if (npc) return `Talk — ${npc.name}`;
      if (e.kind === "chest") return "Open chest";
      if (e.kind === "shrine") return "Touch shrine";
      if (e.name === "riftstone") return "Enter the First Tear";
      if (this.level?.isTown) return "The Shattered Road";
      if (this.level?.biome === "wilds" && e.name === "exit") return "Enter the Cathedral";
      if (e.kind === "portal") return "Return to Thornwatch";
      return "Use";
    };
    const rangeOf = (e) => {
      if (e.kind === "npc") return 2.6;
      if (e.kind === "chest" || e.kind === "shrine" || e.kind === "portal") return 3.4;
      return 2.6;
    };
    const priOf = (e) => {
      if (e.kind === "chest" || e.kind === "shrine" || e.kind === "portal") return 0;
      if (e.kind === "npc") return 1;
      return 2;
    };
    let best = null;
    let bestPri = 9;
    let bestD = 99;
    for (const e of this.ents) {
      if (e === p || e.dead) continue;
      if (!["npc", "chest", "shrine", "portal", "prop"].includes(e.kind)) continue;
      const d = Math.hypot(e.x - p.x, e.z - p.z);
      if (d > rangeOf(e)) continue;
      const pri = priOf(e);
      if (pri < bestPri || (pri === bestPri && d < bestD)) {
        bestPri = pri;
        bestD = d;
        best = e;
      }
    }
    if (best) {
      this.interactEnt = best;
      this.interact = labelOf(best);
    }
  }
  doInteract(e) {
    if (e.kind === "chest") {
      this.openChest(e);
      return;
    }
    if (e.kind === "shrine") {
      this.useShrine(e);
      return;
    }
    if (e.kind === "portal") {
      if (e.name === "riftstone") this.enterPortal("rift");
      else if (this.level?.isTown) this.enterPortal("marches");
      else if (this.level?.biome === "wilds" && e.name === "exit") this.enterPortal("cathedral");
      else this.enterPortal("town");
      return;
    }
    const npc = e.npcId;
    if (!npc) return;
    this.dest = null;
    this.clickGo = null;
    if (this.player) {
      this.player.facing = Math.atan2(-(e.x - this.player.x), -(e.z - this.player.z));
      this.yaw = this.player.facing;
    }
    this.quest("talk", npc);
    if (npc === "ryn")
      this.dialogue = {
        speaker: "Captain Ryn",
        text: this.hero.flags.maltheon
          ? "The nave is quiet. The tears are not. Io can ride them. When you are ready, we march north."
          : "The cathedral opened like a mouth. Close it. Bring me Maltheon's silence.",
        options: [
          {
            id: "enter:cathedral",
            label: "Enter the Cathedral",
          },
          {
            id: "enter:ice",
            label: "Frosthold (Act II)",
          },
          {
            id: "panel:quests",
            label: "Quest log",
          },
          {
            id: "x",
            label: "Leave",
          },
        ],
      };
    else if (npc === "kael")
      this.dialogue = {
        speaker: "Forge-Father Kael",
        text: "Salvage the Choir. I will make the scraps remember they were weapons.",
        options: [
          {
            id: "panel:blacksmith",
            label: "Blacksmith",
          },
          {
            id: "enter:hell",
            label: "Burning Quarter (Act III)",
          },
          {
            id: "x",
            label: "Leave",
          },
        ],
      };
    else if (npc === "maera")
      this.dialogue = {
        speaker: "Sister Maera",
        text: "I can move a power from one relic to another. The hymns called it heresy. I call it Tuesday.",
        options: [
          {
            id: "panel:mystic",
            label: "Mystic",
          },
          {
            id: "enter:hell",
            label: "Prime Rift (Act IV)",
          },
          {
            id: "x",
            label: "Leave",
          },
        ],
      };
    else if (npc === "vesh")
      this.dialogue = {
        speaker: "Quartermaster Vesh",
        text: "Gold in. Steel out. Don't bleed on the counter.",
        options: [
          {
            id: "panel:vendor",
            label: "Vendor",
          },
          {
            id: "panel:bounties",
            label: "Bounties",
          },
          {
            id: "x",
            label: "Leave",
          },
        ],
      };
    else if (npc === "io")
      this.dialogue = {
        speaker: "Warden Io",
        text: "Challenge Rifts keep time like a blade. Higher tiers. Better sins. Your best is remembered.",
        options: [
          {
            id: "panel:rifts",
            label: "Open a Rift",
          },
          {
            id: "enter:raid",
            label: "Choir Vault",
          },
          {
            id: "x",
            label: "Leave",
          },
        ],
      };
    else if (npc === "brann")
      this.dialogue = {
        speaker: "Keeper Brann",
        text: "Leave what you cannot carry. The stash does not dream. Mostly.",
        options: [
          {
            id: "panel:stash",
            label: "Stash",
          },
          {
            id: "x",
            label: "Leave",
          },
        ],
      };
    this.panel = "dialogue";
    this.emit(true);
  }
  openChest(e) {
    if (e.corpse) return;
    e.corpse = true;
    const h = this.hero;
    const n = 2 + this.rng.int(0, 2);
    for (let i = 0; i < n; i++) this.dropLoot(e.x, e.z, false, false);
    this.dropGold(e.x, e.z, 20 + h.level * 3);
    this.quest("collect", "relic", 1);
    this.bounty("chest");
    this.audio.pickup();
  }
  useShrine(e) {
    if (e.corpse) return;
    e.corpse = true;
    const s = SHRINES.find((x) => x.id === e.shrine) ?? SHRINES[0];
    if (s.id === "res") {
      this.hp = this.maxHp;
      this.toast("Life restored.");
    } else {
      this.buffs.push({
        id: s.id,
        name: s.name,
        t: s.dur,
        mag: 1,
      });
      this.toast(s.name);
    }
    this.burst(e.x, 1, e.z, 16764006, 20);
  }
  dealRadius(x, z, r, dmg, extra) {
    for (const e of this.ents) {
      if (e.barrel && !e.dead && Math.hypot(e.x - x, e.z - z) <= r + e.r)
        this.smashBarrel(e);
      if (e.team !== 2 || e.dead || e.corpse) continue;
      if (Math.hypot(e.x - x, e.z - z) <= r + e.r) {
        this.hurt(e, dmg * (1 + this.stat("area") / 200), false);
        const locked = e.elite && (e.knockLock ?? 0) > 0;
        if (!locked) {
          if (extra?.knock) {
            const dx = e.x - x,
              dz = e.z - z,
              m = Math.hypot(dx, dz) || 1;
            e.x += (dx / m) * extra.knock * 0.15;
            e.z += (dz / m) * extra.knock * 0.15;
          }
          if (extra?.stun) this.applyCC(e, "stun", extra.stun);
          if (e.elite && (extra?.knock || extra?.stun)) e.knockLock = 3;
        }
        if (extra?.freeze) this.applyCC(e, "freeze", extra.freeze);
        if (extra?.snare) this.applyCC(e, "snare", extra.snare);
      }
    }
  }
  applyCCRadius(x, z, r, type, t) {
    for (const e of this.ents)
      if (e.team === 2 && !e.dead && Math.hypot(e.x - x, e.z - z) < r)
        this.applyCC(e, type, t);
  }
  applyDoTRadius(x, z, r, tick, dur) {
    for (const e of this.ents)
      if (e.team === 2 && !e.dead && Math.hypot(e.x - x, e.z - z) < r) {
        const n = Math.max(1, Math.floor(dur / 0.5));
        for (let i = 1; i <= n; i++)
          setTimeout(() => {
            if (!e.dead) this.hurt(e, tick, false);
          }, i * 500);
      }
  }
  applyCC(e, type, t) {
    const stacks = e.ccDR[type] ?? 0;
    const mul = stacks === 0 ? 1 : stacks === 1 ? 0.5 : stacks === 2 ? 0.25 : 0;
    if (mul <= 0) return;
    e.cc = {
      type,
      t: t * mul,
    };
    e.ccDR[type] = stacks + 1;
    setTimeout(() => {
      e.ccDR[type] = Math.max(0, (e.ccDR[type] ?? 1) - 1);
    }, 6e3);
  }
  hurt(e, raw, isDot) {
    if (e.dead || e.invuln > 0) return;
    this.hero;
    let dmg = raw * (e.elite || e.boss ? 1 + this.stat("eliteDmg") / 100 : 1);
    if (
      this.hasBuff("damage") ||
      this.hasBuff("archon") ||
      this.hasBuff("vengeance")
    )
      dmg *= 1.25;
    const critC =
      5 + this.stat("crit") + (this.hasSet(6, "ashen") && !isDot ? 0 : 0);
    const crit = !isDot && this.rng.chance(Math.min(0.75, critC / 100));
    if (crit) {
      dmg *= 1.5 + this.stat("critDmg") / 100;
      this.hitstop = Math.max(this.hitstop, 0.018);
      this.trauma += 0.16;
      this.vfx?.flash(e.x, e.z, 0xffcc55, 2.6, 0.1);
    }
    if (e.boss) this.trauma += 0.08;
    e.hp -= dmg;
    this.floatNum(e.x, (e.figure?.height ?? e.scale) + 0.4, e.z, Math.round(dmg), crit, isDot);
    this.burst(e.x, 0.8, e.z, 10031377, crit ? 10 : 5);
    this.vfx?.burst(e.x, 0.85, e.z, 0x991111, crit ? 10 : 5, "blood");
    this.audio.hit(crit);
    if (this.stat("lifeOnHit") && !isDot)
      this.hp = Math.min(this.maxHp, this.hp + this.stat("lifeOnHit") * 0.02);
    if (this.hasPower("furyOnHit") && this.hero?.classId === "barbarian")
      this.resource = Math.min(this.maxResource, this.resource + 3);
    e.figure?.flash();
    if (
      this.hasPower("eliteExecute") &&
      (e.elite || e.boss) &&
      e.hp / e.maxHp < 0.15
    ) {
      e.hp = 0;
      this.dealRadius(e.x, e.z, 3.5, dmg);
    }
    if (e.hp <= 0) this.kill(e);
  }
  hurtPlayer(raw) {
    const p = this.player;
    if (p.iFrames > 0 || p.invuln > 0) return;
    if (this.rng.chance(Math.min(0.4, this.stat("dodge") / 100))) {
      this.floatNum(p.x, 2, p.z, 0, false, false, "dodge");
      return;
    }
    const armor = 40 + this.stat("armor") + (this.hasBuff("warcry") ? 80 : 0);
    const red = armor / (armor + 400);
    const res = this.stat("allRes") / (this.stat("allRes") + 220);
    const dmg = raw * (1 - red) * (1 - res * 0.5);
    this.hp -= dmg;
    this.floatNum(p.x, 2.1, p.z, Math.round(dmg), false, false, "you");
    this.trauma += 0.28;
    this.audio.hit(false);
    if (this.hp <= 0) {
      this.hp = 0;
      p.dead = true;
      p.vx = 0;
      p.vz = 0;
      this.releaseInput();
      this.screen = "dead";
      this.audio.death();
      this.emit(true);
    }
  }
  kill(e) {
    if (e.dead) return;
    e.dead = true;
    e.corpse = true;
    const h = this.hero;
    const def = MONSTERS[e.monsterId ?? ""] ?? MONSTERS.skeleton;
    h.stats.kills += 1;
    if (e.elite) h.stats.elites += 1;
    this.quest("kill", e.monsterId ?? "any", 1);
    if (e.elite) this.quest("kill", "elite", 1);
    this.bounty("kill");
    if (e.elite) this.bounty("elite");
    const { leveled, paragon } = addXp(
      h,
      def.xp * (e.elite ? 3 : 1) * (e.boss ? 1 : 1),
    );
    if (leveled) this.toast(`Level ${h.level}`);
    if (paragon) this.toast(`Paragon ${h.paragon}`);
    this.dropGold(e.x, e.z, 4 + h.level + (e.elite ? 20 : 0));
    if (
      this.rng.chance(def.loot * DIFFICULTY[h.difficulty].magic) ||
      e.elite ||
      e.boss
    )
      this.dropLoot(e.x, e.z, !!e.elite, !!e.boss);
    if (this.rng.chance(e.elite || e.boss ? 0.7 : 0.28))
      this.dropGlobe(e.x, e.z);
    this.burst(e.x, 1, e.z, 7803153, e.elite || e.boss ? 36 : 22);
    this.vfx?.death(e.x, e.z, !!e.elite, !!e.boss);
    this.trauma += e.elite || e.boss ? 0.45 : 0.12;
    if (e.elite || e.boss) {
      this.post?.punch(0.0026, 0.16);
      this.hitstop = Math.max(this.hitstop, 0.032);
    }
    const extra = e.boss ? 4 + this.rng.int(0, 2) : e.elite ? 2 + this.rng.int(0, 2) : this.rng.chance(0.55) ? 1 : 0;
    for (let i = 0; i < extra; i++) this.dropLoot(e.x, e.z, !!e.elite, !!e.boss);
    if (e.boss && !this.level?.isRift && !this.level?.isTown)
      this.dropLoot(e.x, e.z, true, true, "legendary");
    if (e.boss && this.level?.isRift) {
      h.gems.push(
        randomGem(
          this.rng,
          Math.min(10, 1 + Math.floor((this.rift?.tier ?? 1) / 5)),
        ),
      );
      this.toast("The Tear closes. Thornwatch waits.");
      const key = h.classId;
      const t = this.rift?.tier ?? 1;
      if (t > (this.save.riftBest[key] ?? 0)) this.save.riftBest[key] = t;
      this.bounty("rift");
      this.rift = this.rift
        ? {
            ...this.rift,
            progress: this.rift.goal,
          }
        : this.rift;
      window.setTimeout(() => this.enterPortal("town"), 2800);
    }
    if (e.boss && e.monsterId) {
      h.flags[e.monsterId] = true;
      this.quest("boss", e.monsterId);
      if (e.monsterId === "maltheon") h.act = Math.max(h.act, 2);
      if (e.monsterId === "icewarden") h.act = Math.max(h.act, 3);
      if (e.monsterId === "flamechorus") h.act = Math.max(h.act, 4);
    }
    if (this.rift?.active && !e.boss) this.rift.progress += e.elite ? 4 : 1;
    this.audio.death();
    e.corpseT = 8;
    if (e.sprite) {
      const m = e.sprite.material;
      m.opacity = 0.35;
    }
    if (e.light) this.scene.remove(e.light);
    if (e.shadow) this.scene.remove(e.shadow);
    if (e.mesh && !e.figure) this.scene.remove(e.mesh);
    if (this.hasPower("dashReset")) {
      const dash = this.kit().equipped.find((s) => s.kind === "dash");
      if (dash) this.skillCd[dash.id] = 0;
    }
    this.recompute();
    this.persist();
  }
  scatterPos(x, z, i, n) {
    const ang = (i / Math.max(1, n)) * Math.PI * 2 + this.rng.next() * 0.4;
    const rad = 0.85 + this.rng.next() * 0.85;
    let nx = x + Math.cos(ang) * rad;
    let nz = z + Math.sin(ang) * rad;
    if (this.level) {
      const r = resolveWalls(nx, nz, 0.35, this.level.walls);
      nx = r.x;
      nz = r.z;
      if (!isWalkable(this.level, nx, nz)) {
        nx = x;
        nz = z;
      }
    }
    return { x: nx, z: nz };
  }
  dropLoot(x, z, elite, boss, force) {
    const h = this.hero;
    const magic = DIFFICULTY[h.difficulty].magic;
    let rarity = force || rarityFor(magic, elite, boss, h.pity, this.rng);
    if (!force && elite && rarity === "normal") rarity = "magic";
    if (!force && boss && (rarity === "normal" || rarity === "magic")) rarity = "rare";
    if (rarity === "legendary" || rarity === "set") h.pity = 0;
    else if (elite) h.pity += 1;
    const item = rollItem({
      rng: this.rng,
      level: h.level,
      classId: h.classId,
      rarity,
    });
    const col =
      rarity === "legendary"
        ? 16733457
        : rarity === "set"
          ? 3407718
          : rarity === "rare"
            ? 16763955
            : rarity === "magic"
              ? 6719743
              : 14540253;
    const pos = this.scatterPos(x, z, this.rng.int(0, 7), 8);
    const e = this.makeSprite("pickup", pos.x, pos.z, [], 0.01, col);
    e.kind = "pickup";
    e.item = item;
    e.uid = item.uid;
    e.r = 0.4;
    e.ttl = 20;
    e.dropVx = (pos.x - x) * 3.2;
    e.dropVz = (pos.z - z) * 3.2;
    e.dropY = 0.9;
    if (e.sprite) e.sprite.visible = false;
    const stand = new THREE.Group();
    const peg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.1, 0.28, 6),
      new THREE.MeshStandardMaterial({ color: 0x3a3228, roughness: 0.8 }),
    );
    peg.position.y = 0.14;
    stand.add(peg);
    const gem = new THREE.Mesh(
      item.slot === "main"
        ? new THREE.BoxGeometry(0.18, 0.55, 0.08)
        : this.gemGeo,
      new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: rarity === "normal" ? 0.45 : 1.6,
        roughness: 0.25,
        metalness: 0.45,
      }),
    );
    gem.position.y = item.slot === "main" ? 0.55 : 0.5;
    stand.add(gem);
    stand.position.set(e.x, 0, e.z);
    this.scene.add(stand);
    e.mesh = stand;
    const beam = this.vfx?.lootShaft(e.x, e.z, col, rarity);
    if (beam) e.beam = beam.mesh;
    if (rarity === "legendary" || rarity === "set" || rarity === "rare") {
      const l = new THREE.PointLight(col, rarity === "legendary" ? 16 : 8, 8, 1.5);
      l.position.set(e.x, 1.4, e.z);
      this.scene.add(l);
      e.light = l;
    }
    if (rarity === "legendary" || rarity === "set") {
      this.legendaryFlash = item.name;
      this.flashT = 1.4;
      this.post?.punch(0.003, 0.2);
      this.audio.legendary();
    }
    this.ents.push(e);
  }
  dropGold(x, z, amount) {
    const pos = this.scatterPos(x, z, this.rng.int(0, 5), 6);
    const e = this.makeSprite("pickup", pos.x, pos.z, [], 0.01, 16768341);
    e.kind = "pickup";
    e.gold = amount;
    e.uid = "gold-" + e.id;
    e.r = 0.3;
    e.ttl = 20;
    if (e.sprite) e.sprite.visible = false;
    const size = amount > 40 ? 1.35 : amount > 16 ? 1 : 0.7;
    const pile = new THREE.Group();
    const n = amount > 40 ? 5 : amount > 16 ? 3 : 2;
    const mat = new THREE.MeshStandardMaterial({
      color: 0xf0d15a,
      emissive: 0xaa8800,
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.7,
    });
    for (let i = 0; i < n; i++) {
      const c = new THREE.Mesh(this.goldPileGeo, mat);
      c.position.set((i % 2) * 0.12 - 0.06, 0.08 + Math.floor(i / 2) * 0.1, (i * 0.07) % 0.16);
      c.scale.setScalar(size * (0.7 + (i % 3) * 0.12));
      pile.add(c);
    }
    pile.position.set(e.x, 0, e.z);
    this.scene.add(pile);
    e.mesh = pile;
    this.ents.push(e);
  }
  dropGlobe(x, z) {
    const pos = this.scatterPos(x, z, this.rng.int(0, 4), 5);
    const e = this.makeSprite("pickup", pos.x, pos.z, [], 0.01, 16724804);
    e.kind = "pickup";
    e.globe = true;
    e.uid = "globe-" + e.id;
    e.r = 0.35;
    e.ttl = 20;
    if (e.sprite) e.sprite.visible = false;
    const gem = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 12),
      new THREE.MeshStandardMaterial({
        color: 13378099,
        emissive: 8917265,
        emissiveIntensity: 1.4,
        roughness: 0.25,
        metalness: 0.1,
      }),
    );
    gem.position.set(e.x, 0.45, e.z);
    this.scene.add(gem);
    e.mesh = gem;
    const l = new THREE.PointLight(16720435, 8, 5, 1.5);
    l.position.set(e.x, 1.1, e.z);
    this.scene.add(l);
    e.light = l;
    this.ents.push(e);
  }
  smashBarrel(e) {
    if (e.dead) return;
    e.dead = true;
    this.burst(e.x, 0.8, e.z, 11171652, 14);
    this.vfx?.shatter(e.x, e.z);
    this.audio.hit(false);
    if (this.rng.chance(0.55)) this.dropGold(e.x, e.z, 6 + this.hero.level);
    if (this.rng.chance(0.4)) this.dropGlobe(e.x, e.z);
    if (e.mesh) this.scene.remove(e.mesh);
    if (e.sprite) this.scene.remove(e.sprite);
    if (e.shadow) this.scene.remove(e.shadow);
  }
  spawnBarrel(x, z) {
    const g = this.world ? this.world.makeBarrel(x, z) : new THREE.Group();
    this.scene.add(g);
    const e = this.makeSprite("prop", x, z, [], 0.01, 16777215);
    e.kind = "prop";
    e.barrel = true;
    e.name = "barrel";
    e.r = 0.4;
    e.team = 0;
    e.mesh = g;
    if (e.sprite) e.sprite.visible = false;
    this.ents.push(e);
  }
  fxSlash(x, z) {
    const p = this.player;
    this.vfx?.slash(x, z, p?.facing ?? 0);
  }
  burst(x, y, z, color, n) {
    if (this.reduced) return;
    n = Math.max(1, Math.round(n * (this.quality.particles ?? 1) * this.crowdMul));
    for (let i = 0; i < n; i++) {
      let s = this.particlePool.pop();
      if (!s)
        s = new THREE.Sprite(
          new THREE.SpriteMaterial({
            color,
            transparent: true,
            depthWrite: false,
          }),
        );
      else s.material.color.setHex(color);
      s.position.set(x, y, z);
      s.scale.setScalar(0.18);
      this.scene.add(s);
      this.particles.push({
        s,
        vx: (Math.random() - 0.5) * 6,
        vy: 2 + Math.random() * 5,
        vz: (Math.random() - 0.5) * 6,
        t: 0.35 + Math.random() * 0.25,
      });
    }
  }
  tickParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.t -= dt;
      p.s.position.x += p.vx * dt;
      p.s.position.y += p.vy * dt;
      p.s.position.z += p.vz * dt;
      p.vy -= 12 * dt;
      p.s.material.opacity = Math.max(0, p.t * 3);
      if (p.t <= 0) {
        this.scene.remove(p.s);
        this.particlePool.push(p.s);
        this.particles.splice(i, 1);
      }
    }
  }
  floatNum(x, y, z, n, crit, _dot, kind) {
    if (!this.save.settings.numbers) return;
    if (this.numbers.length >= 12) this.numbers.shift();
    const text =
      kind === "dodge"
        ? "dodge"
        : kind === "you"
          ? String(-n)
          : kind === "heal"
            ? "+" + n
            : String(n);
    this.numbers.push({
      x,
      y,
      z,
      t: crit ? 0.9 : 0.65,
      text,
      color:
        kind === "you"
          ? "#f88"
          : kind === "heal"
            ? "#7dff8a"
            : crit
              ? "#ffa64d"
              : "#f4efe4",
      crit: crit || kind === "heal",
    });
  }
  nearestEnemy(r) {
    return this.nearestEnemyFrom(this.player, r);
  }
  nearestInCone(r, facing, half) {
    const p = this.player;
    if (!p) return null;
    const fx = -Math.sin(facing);
    const fz = -Math.cos(facing);
    let best = null;
    let bd = r;
    for (const e of this.ents) {
      if (e.team !== 2 || e.dead || e.corpse) continue;
      const dx = e.x - p.x;
      const dz = e.z - p.z;
      const d = Math.hypot(dx, dz);
      if (d >= bd || d < 0.05) continue;
      const dot = (dx * fx + dz * fz) / d;
      if (dot >= Math.cos(half)) {
        bd = d;
        best = e;
      }
    }
    return best;
  }
  dealCone(x, z, facing, range, half, dmg, extra) {
    const fx = -Math.sin(facing);
    const fz = -Math.cos(facing);
    for (const e of this.ents) {
      if (e.barrel && !e.dead && Math.hypot(e.x - x, e.z - z) <= range + e.r)
        this.smashBarrel(e);
      if (e.team !== 2 || e.dead || e.corpse) continue;
      const dx = e.x - x;
      const dz = e.z - z;
      const d = Math.hypot(dx, dz);
      if (d > range + e.r) continue;
      const dot = d < 0.08 ? 1 : (dx * fx + dz * fz) / d;
      if (dot < Math.cos(half)) continue;
      this.hurt(e, dmg * (1 + this.stat("area") / 200), false);
      const locked = e.elite && (e.knockLock ?? 0) > 0;
      if (!locked) {
        if (extra?.knock) {
          e.x += fx * extra.knock * 0.12;
          e.z += fz * extra.knock * 0.12;
        }
        if (extra?.stun) this.applyCC(e, "stun", extra.stun);
        if (e.elite && (extra?.knock || extra?.stun)) e.knockLock = 3;
      }
    }
  }
  nearestEnemyFrom(from, r) {
    let best = null;
    let bd = r;
    for (const e of this.ents) {
      if (e.team !== 2 || e.dead || e.corpse) continue;
      const d = Math.hypot(e.x - from.x, e.z - from.z);
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }
  hasBuff(id) {
    return this.buffs.some((b) => b.id === id);
  }
  hasPower(id) {
    if (!this.hero) return false;
    if (
      this.equippedList().some(
        (i) => LEGENDARIES.find((l) => l.id === i.legendaryId)?.power === id,
      )
    )
      return true;
    if (
      this.cube &&
      LEGENDARIES.find((l) => l.id === this.cube.legendaryId)?.power === id
    )
      return true;
    return false;
  }
  hasSet(n, id) {
    return this.equippedList().filter((i) => i.setId === id).length >= n;
  }
  equippedList() {
    const h = this.hero;
    const out = [];
    for (const v of Object.values(h.equipped))
      if (Array.isArray(v)) out.push(...v);
      else if (v) out.push(v);
    return out;
  }
  stat(id) {
    let v = 0;
    for (const it of this.equippedList())
      for (const a of it.affixes) if (a.id === id) v += a.value;
    const h = this.hero;
    if (id === "str") v += h.paragonSpent.core * 5;
    if (id === "vit") v += h.paragonSpent.core * 5;
    if (id === "crit") v += h.paragonSpent.offense * 0.4;
    if (id === "critDmg") v += h.paragonSpent.offense * 1.2;
    if (id === "armor") v += h.paragonSpent.defense * 8;
    if (id === "allRes") v += h.paragonSpent.defense * 4;
    if (id === "cdr") v += h.paragonSpent.utility * 0.3;
    if (id === "pickup") v += h.paragonSpent.utility * 0.05;
    if (this.hasSet(2, "thornwatch") && (id === "armor" || id === "vit"))
      v *= 1.15;
    return v;
  }
  outDmg() {
    const h = this.hero;
    const cls = CLASSES[h.classId];
    const prim =
      cls.base[cls.primary] * 4 + h.level * 3 + this.stat(cls.primary);
    return (
      (18 + h.level * 2.2) *
      (1 + prim / 140) *
      (this.hasSet(4, "thornwatch") && cls.id === "barbarian" ? 1.2 : 1)
    );
  }
  recompute() {
    const h = this.hero;
    if (!h) return;
    const cls = CLASSES[h.classId];
    const vit = cls.base.vit * 5 + h.level * 8 + this.stat("vit");
    this.maxHp = 140 + vit * 6 + this.stat("life");
    this.maxResource = 100 + h.level * 2;
    this.hp = Math.min(this.maxHp, this.hp || this.maxHp);
    this.resource = Math.min(this.maxResource, this.resource);
    if (this.player) {
      this.player.maxHp = this.maxHp;
      this.player.speed = cls.base.speed;
    }
  }
  grantStarter() {
    const h = this.hero;
    const worn = rollItem({
      rng: this.rng,
      level: 1,
      classId: h.classId,
      rarity: "magic",
      slot: "main",
    });
    worn.identified = true;
    worn.baseId = "main-axe";
    worn.name = "Blessed Greataxe";
    h.inventory.push(worn);
    this.equip(worn.uid);
    const rare = rollItem({
      rng: this.rng,
      level: 2,
      classId: h.classId,
      rarity: "rare",
      slot: "main",
    });
    rare.identified = true;
    rare.baseId = "main-axe";
    rare.name = "Riven Greataxe";
    h.inventory.push(rare);
    this.applyHeroGear();
  }
  restockVendor() {
    const h = this.hero;
    this.vendorStock = [];
    for (let i = 0; i < 8; i++)
      this.vendorStock.push(
        rollItem({
          rng: this.rng,
          level: h.level,
          classId: h.classId,
          rarity: i < 2 ? "rare" : "magic",
        }),
      );
  }
  quest(kind, target, n = 1) {
    const h = this.hero;
    if (!h) return;
    for (const q of h.quests) {
      if (q.done) continue;
      const def = QUESTS.find((x) => x.id === q.id);
      if (!def) continue;
      const step = def.steps[q.step];
      if (!step) continue;
      if (
        step.kind === kind &&
        (step.target === target ||
          step.target === "any" ||
          (kind === "kill" && step.target === "any"))
      ) {
        q.progress += n;
        if ((step.count ?? 1) <= q.progress) {
          q.step += 1;
          q.progress = 0;
          if (q.step >= def.steps.length) {
            q.done = true;
            h.gold += def.rewardGold;
            addXp(h, def.rewardXp);
            this.toast(`Quest complete: ${def.name}`);
            const next = QUESTS.find(
              (x) =>
                !h.quests.some((y) => y.id === x.id) &&
                (x.act <= h.act || h.flags.maltheon),
            );
            if (next)
              h.quests.push({
                id: next.id,
                step: 0,
                progress: 0,
                done: false,
              });
          }
        }
      }
    }
  }
  bounty(kind) {
    for (const b of this.save.weekly.bounties) {
      if (b.done) continue;
      if (b.kind === kind || (kind === "kill" && b.kind === "kill")) {
        b.progress += 1;
        if (b.progress >= b.count) {
          b.done = true;
          if (this.hero) this.hero.gold += b.gold;
          this.toast("Bounty complete");
        }
      }
    }
  }
  toast(text, item) {
    this.toasts.unshift({
      id: "t" + Date.now() + Math.random(),
      text,
      item,
      t: 4.5,
    });
    this.toasts = this.toasts.slice(0, 6);
  }
  persist() {
    if (this.hero) {
      const i = this.save.characters.findIndex((c) => c === this.hero);
      if (i >= 0) this.save.characters[i] = this.hero;
    }
    persistSave(this.save);
  }
  draw(dt) {
    const p = this.player;
    const off = this.camOff;
    const wantView = this.baseViewSize * (this.aimingSlot >= 0 ? 1.06 : 1);
    this.viewSize = expLerp(this.viewSize, wantView, 8, dt);
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / Math.max(1, h);
    const f = this.viewSize;
    this.camera.left = -f * aspect;
    this.camera.right = f * aspect;
    this.camera.top = f;
    this.camera.bottom = -f;
    this.camera.updateProjectionMatrix();
    if (p && this.screen === "playing") {
      const shake = this.reduced
        ? 0
        : this.trauma * this.trauma * (this.save.settings.shake ?? 0.7);
      const ox = (Math.random() - 0.5) * shake * 1.1;
      const oz = (Math.random() - 0.5) * shake * 1.1;
      const followK = this.camLagT > 0 ? 3.4 : 6.6;
      this.camLagT = Math.max(0, this.camLagT - dt);
      const lookX = expLerp(this.camera.position.x - off.x, p.x, followK, dt);
      const lookZ = expLerp(this.camera.position.z - off.z, p.z, followK, dt);
      this.camLookX = lookX;
      this.camLookZ = lookZ;
      this.camera.position.set(lookX + off.x + ox, off.y, lookZ + off.z + oz);
      this.camera.lookAt(lookX, 1.28, lookZ);
      this.world?.followShadows(p.x, p.z);
      this.world?.flicker(this.clock.elapsedTime, p.x, p.z);
    }
    if (this.reticle) {
      const show = this.pc && this.screen === "playing" && this.panel !== "pause";
      this.reticle.visible = show;
      if (show) this.reticle.position.set(this.aim.x, 0.07, this.aim.z);
    }
    const t = this.clock.elapsedTime;
    for (const e of this.ents) {
      if (e.kind === "pickup" && e.mesh) {
        e.mesh.position.x = e.x;
        e.mesh.position.z = e.z;
        if (e.item) {
          e.mesh.position.y = Math.sin(t * 3.4 + e.id) * 0.08;
          e.mesh.rotation.y += dt * 1.6;
        }
      }
      if (e.figure) {
        e.figure.update({
          moving: Math.hypot(e.vx, e.vz) > 0.25,
          speed: Math.hypot(e.vx, e.vz),
          attacking: (e.attackT ?? 0) > 0,
          whirlwind: !!(this.channel && e.kind === "player" && (this.channel.id === "whirlwind" || this.channel.id === "bloodspin")),
          dead: !!e.corpse || e.dead,
          freeze: e.cc?.type === "freeze" && e.cc.t > 0,
          facing: e.facing,
          dt,
          time: t,
        });
        e.figure.root.position.set(
          e.x + (e.figure.shakeX || 0),
          (e.hopY || 0) + (e.figure.sinkY || 0),
          e.z,
        );
        if (e.attackT > 0) e.attackT -= dt;
        if (e.corpse) {
          e.corpseT = (e.corpseT ?? 8) - dt;
          if (e.corpseT <= -1.5) {
            this.scene.remove(e.figure.root);
            e.corpse = false;
          }
        }
      }
    }
    this.ents = this.ents.filter((e) => !e.dead || e.corpse);
    if (this.channel?.id === "whirlwind" && p && Math.random() < 0.18)
      this.vfx?.whirl(p.x, p.z);
    this.vfx?.update(dt, t, p?.x ?? 0, p?.z ?? 0);
    if (this.post) this.post.render(dt);
    else this.renderer.render(this.scene, this.camera);
    this.paperdoll?.tick(dt);
    this.drawOverlay();
  }
  drawOverlay() {
    const ctx = this.octx;
    const w = this.overlay.width;
    const h = this.overlay.height;
    ctx.clearRect(0, 0, w, h);
    if (this.screen !== "playing" || !this.player) return;
    const pr = this.renderer.getPixelRatio();
    if (this.dest) {
      const steps = 6;
      ctx.fillStyle = "#e6c87a";
      for (let i = 1; i <= steps; i++) {
        const t = i / (steps + 0.4);
        this.tmp.set(
          this.player.x + (this.dest.x - this.player.x) * t,
          0.12,
          this.player.z + (this.dest.z - this.player.z) * t,
        ).project(this.camera);
        if (this.tmp.z > 1) continue;
        const sx = (this.tmp.x * 0.5 + 0.5) * w;
        const sy = (-this.tmp.y * 0.5 + 0.5) * h;
        ctx.globalAlpha = 0.35 + (i / steps) * 0.45;
        ctx.beginPath();
        ctx.arc(sx, sy, (2.2 + i * 0.35) * pr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    for (const n of this.numbers) {
      this.tmp.set(n.x, n.y + (0.65 - n.t) * 1.4, n.z);
      this.tmp.project(this.camera);
      if (this.tmp.x < -1.15 || this.tmp.x > 1.15 || this.tmp.y < -1.15 || this.tmp.y > 1.15)
        continue;
      const sx = (this.tmp.x * 0.5 + 0.5) * w;
      const sy = (-this.tmp.y * 0.5 + 0.5) * h;
      ctx.globalAlpha = Math.min(1, n.t * 2);
      ctx.font = `${n.crit ? 800 : 700} ${n.crit ? 24 * pr : 17 * pr}px Barlow, sans-serif`;
      ctx.textAlign = "center";
      ctx.lineWidth = 4 * pr;
      ctx.strokeStyle = "rgba(0,0,0,0.85)";
      ctx.strokeText(n.text, sx, sy);
      ctx.fillStyle = n.color;
      ctx.fillText(n.text, sx, sy);
    }
    ctx.globalAlpha = 1;
    if (this.player) {
      this.tmp
        .set(this.player.x, this.player.scale + 0.15, this.player.z)
        .project(this.camera);
      const sx = (this.tmp.x * 0.5 + 0.5) * w;
      const sy = (-this.tmp.y * 0.5 + 0.5) * h;
      const bw = 54 * pr;
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(sx - bw / 2, sy, bw, 5 * pr);
      ctx.fillStyle = "#9b1c1c";
      ctx.fillRect(sx - bw / 2, sy, bw * (this.hp / this.maxHp), 5 * pr);
    }
    for (const e of this.ents) {
      if (e.kind !== "monster" || e.dead || e.team !== 2) continue;
      this.tmp.set(e.x, e.scale + 0.2, e.z).project(this.camera);
      if (this.tmp.x < -1.15 || this.tmp.x > 1.15 || this.tmp.y < -1.15 || this.tmp.y > 1.15)
        continue;
      const sx = (this.tmp.x * 0.5 + 0.5) * w;
      const sy = (-this.tmp.y * 0.5 + 0.5) * h;
      const bw = (e.boss ? 90 : 44) * pr;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(sx - bw / 2, sy, bw, 4 * pr);
      ctx.fillStyle = e.elite ? "#e8a23a" : "#9b1c1c";
      ctx.fillRect(sx - bw / 2, sy, bw * (e.hp / e.maxHp), 4 * pr);
    }
    for (const e of this.ents) {
      if (e.kind !== "pickup" || !e.item) continue;
      this.tmp.set(e.x, 1.3, e.z).project(this.camera);
      if (this.tmp.x < -1.15 || this.tmp.x > 1.15 || this.tmp.y < -1.15 || this.tmp.y > 1.15)
        continue;
      const sx = (this.tmp.x * 0.5 + 0.5) * w;
      const sy = (-this.tmp.y * 0.5 + 0.5) * h;
      ctx.font = `600 ${12 * pr}px Barlow, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle =
        e.item.rarity === "legendary"
          ? "#ff7a18"
          : e.item.rarity === "set"
            ? "#6dcc5a"
            : e.item.rarity === "rare"
              ? "#f0d15a"
              : e.item.rarity === "magic"
                ? "#6ea0ff"
                : "#ddd";
      ctx.fillText(e.item.name, sx, sy);
    }
    for (const e of this.ents) {
      if (e.kind !== "pickup" || e.item || e.dead) continue;
      this.tmp.set(e.x, 1.05, e.z).project(this.camera);
      if (this.tmp.x < -1.15 || this.tmp.x > 1.15 || this.tmp.y < -1.15 || this.tmp.y > 1.15)
        continue;
      const sx = (this.tmp.x * 0.5 + 0.5) * w;
      const sy = (-this.tmp.y * 0.5 + 0.5) * h;
      ctx.font = `600 ${11 * pr}px Barlow, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = e.globe ? "#de624c" : "#f0d15a";
      ctx.fillText(e.globe ? "Globe" : `+${Math.floor(e.gold ?? 0)} Gold`, sx, sy);
    }
    for (const e of this.ents) {
      if (e.kind !== "npc" || !e.name) continue;
      if (!this.player) continue;
      if (Math.hypot(e.x - this.player.x, e.z - this.player.z) > 4.5) continue;
      this.tmp.set(e.x, (e.figure?.height ?? e.scale) + 0.2, e.z).project(this.camera);
      if (this.tmp.x < -1.15 || this.tmp.x > 1.15 || this.tmp.y < -1.15 || this.tmp.y > 1.15)
        continue;
      const sx = (this.tmp.x * 0.5 + 0.5) * w;
      const sy = (-this.tmp.y * 0.5 + 0.5) * h;
      ctx.font = `700 ${12 * pr}px Cinzel, serif`;
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,0.75)";
      ctx.lineWidth = 3 * pr;
      const quest = this.hero?.quests.some((q) => {
        const def = QUESTS.find((x) => x.id === q.id);
        return !q.done && def?.giver === e.npcId;
      });
      const label = (quest ? "!  " : "") + e.name;
      ctx.strokeText(label, sx, sy);
      ctx.fillStyle = quest ? "#f0d15a" : "#f4efe4";
      ctx.fillText(label, sx, sy);
    }
  }
  wireControlsTest() {
    window.__controlsTest = {
      getYaw: () => this.yaw,
      getSpeed: () => this.speed,
      getMesh: () => ({
        x: this.player?.x ?? 0,
        z: this.player?.z ?? 0,
        mx: this.player?.figure?.root.position.x ?? 0,
        mz: this.player?.figure?.root.position.z ?? 0,
        cx: this.camLookX,
        cz: this.camLookZ,
      }),
      setKeys: (codes) => this.input.setKeys(codes),
      setPos: (x, z) => {
        if (!this.player) return;
        this.player.x = x;
        this.player.z = z;
        if (this.player.figure) this.player.figure.root.position.set(x, 0, z);
        if (this.player.sprite) this.player.sprite.position.set(x, 0.02, z);
      },
      interact: () => {
        this.interactScan();
        if (this.interactEnt) this.doInteract(this.interactEnt);
      },
      enter: (kind) => this.enterPortal(kind),
    };
  }
  snapshot() {
    const h = this.hero;
    const cls = h ? CLASSES[h.classId] : CLASSES.barbarian;
    const q = h?.quests.find((x) => !x.done);
    const qdef = q ? QUESTS.find((x) => x.id === q.id) : void 0;
    const step = qdef && q ? qdef.steps[q.step] : void 0;
    const kit = h ? this.kit() : null;
    const locked =
      !!this.channel &&
      (this.channel.id === "whirlwind" || this.channel.id === "bloodspin");
    const snapSkill = (s, key) => ({
      id: s.id,
      name: s.name,
      key,
      cd: this.skillCd[s.id] ?? 0,
      maxCd: s.cooldown,
      charges: s.charges ? (this.skillCharges[s.id] ?? s.charges) : 0,
      maxCharges: s.charges ?? 0,
      locked: locked && s.kind !== "channel",
      icon: iconFor(s),
      channel:
        this.channel?.id === s.id && this.channel.max
          ? this.channel.t / this.channel.max
          : 0,
    });
    const tgt = this.target && !this.target.dead ? this.target : null;
    const groundLoot = this.ents
      .filter((e) => e.kind === "pickup" && !e.dead)
      .slice(0, 8)
      .map((e) => ({
        uid: e.uid ?? e.item?.uid ?? String(e.id),
        name: e.globe
          ? "Health Globe"
          : e.gold
            ? `+${Math.floor(e.gold)} Gold`
            : (e.item?.name ?? "Loot"),
        rarity: e.globe
          ? "globe"
          : e.gold
            ? "gold"
            : (e.item?.rarity ?? "normal"),
        gold: e.gold,
      }));
    return {
      screen: this.screen,
      panel: this.panel,
      classId: h?.classId ?? null,
      name: h?.name ?? "",
      level: h?.level ?? 1,
      xp: h?.xp ?? 0,
      xpNext: h ? xpToNext(h.level) : 100,
      paragon: h?.paragon ?? 0,
      hp: this.hp,
      maxHp: this.maxHp,
      hpChase: this.hpChase || this.hp,
      resource: this.resource,
      maxResource: this.maxResource,
      resourceName: cls.resource,
      gold: h?.gold ?? 0,
      materials: h?.materials ?? {
        scrap: 0,
        dust: 0,
        crystal: 0,
      },
      difficulty: h?.difficulty ?? "normal",
      areaName: this.level?.name ?? "Thornwatch",
      biome: this.level?.biome ?? "town",
      questText: step
        ? `${qdef.name}: ${step.text.replace("0/", `${q?.progress ?? 0}/`)}`
        : "The veil holds — for now.",
      buffs: this.buffs.map((b) => ({
        id: b.id,
        name: b.name,
        t: b.t,
      })),
      skills: kit
        ? kit.equipped.map((s, i) => snapSkill(s, String(i + 1)))
        : [],
      primary: kit ? snapSkill(kit.primary, "LMB") : null,
      ultimate: kit ? snapSkill(kit.ult, "Q") : null,
      ultCharge: this.ultCharge,
      ultReady: this.ultCharge >= 1 && this.ultActive <= 0,
      ultActive: this.ultActive,
      potionCd: this.potionCd,
      potionCount: h?.potionCount ?? 3,
      potionMax: 8,
      potionHot: this.potionHot,
      inventory: h?.inventory ?? [],
      stash: h?.stash ?? [],
      equipped: h?.equipped ?? {},
      vendor: this.vendorStock,
      groundCompare: null,
      groundLoot,
      target: tgt
        ? {
            name: tgt.name ?? MONSTERS[tgt.monsterId ?? ""]?.name ?? "Foe",
            hp: tgt.hp,
            maxHp: tgt.maxHp,
            level: h?.level ?? 1,
            elite: !!tgt.elite,
            boss: !!tgt.boss,
            type: tgt.boss
              ? "demon"
              : tgt.monsterId === "skeleton"
                ? "undead"
                : tgt.monsterId === "cultist"
                  ? "humanoid"
                  : "demon",
            affixes: tgt.champion ?? [],
          }
        : null,
      toasts: this.toasts,
      dialogue: this.dialogue,
      minimap: this.minimap(),
      dead: this.screen === "dead",
      rift: this.rift,
      worldBossIn: this.worldBossIn,
      ping: "",
      interact: this.interact,
      legendaryFlash: this.legendaryFlash,
      loading: this.loading,
      loadPct: this.loadPct,
      combatRating: h ? 80 + h.level * 12 + this.stat("str") : 0,
      channel: this.channel,
      lowHp: this.maxHp > 0 && this.hp / this.maxHp < 0.28,
      portrait: cls.portrait,
      pc: this.pc,
    };
  }
  minimap() {
    const lv = this.level;
    const p = this.player;
    if (!lv || !p)
      return {
        w: 1,
        h: 1,
        px: 0,
        pz: 0,
        ents: [],
      };
    return {
      w: lv.bounds.w,
      h: lv.bounds.d,
      px: p.x - lv.bounds.x,
      pz: p.z - lv.bounds.z,
      ents: this.ents
        .filter((e) => e.kind === "monster" && e.team === 2 && !e.dead)
        .slice(0, 40)
        .map((e) => ({
          x: e.x - lv.bounds.x,
          z: e.z - lv.bounds.z,
          c: e.boss ? "#f64" : e.elite ? "#fc6" : "#c44",
        })),
    };
  }
  emit(force = false) {
    this.toasts = this.toasts
      .map((t) => ({
        ...t,
        t: t.t - (force ? 0 : 0.09),
      }))
      .filter((t) => t.t > 0);
    this.pushUI(this.snapshot());
  }
}

export { formatAffix, SLOT_LABEL, GEMS, SETS, MAX_LEVEL };
