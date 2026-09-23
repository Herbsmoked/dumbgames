import { ACT_BOSSES, BIOME_MONSTERS } from "./catalog";
import { Rng } from "./loot";
import type { Biome, ChampionAffix } from "./types";
import { CHAMPION_AFFIXES } from "./catalog";

export type AABB = { x: number; z: number; w: number; d: number };
export type RoomKind = "start" | "combat" | "elite" | "shrine" | "treasure" | "secret" | "boss" | "event";

export interface Room {
  kind: RoomKind;
  x: number;
  z: number;
  w: number;
  d: number;
  biome: Biome;
}

export interface Spawn {
  x: number;
  z: number;
  monster: string;
  champion?: ChampionAffix[];
  elite?: boolean;
  boss?: boolean;
}

export interface PropSpot {
  kind: "chest" | "shrine" | "portal" | "npc" | "riftstone" | "stash" | "blacksmith" | "vendor" | "mystic" | "bounty" | "exit";
  x: number;
  z: number;
  npcId?: string;
  shrine?: string;
}

export interface Level {
  name: string;
  biome: Biome;
  rooms: Room[];
  walls: AABB[];
  spawns: Spawn[];
  props: PropSpot[];
  playerX: number;
  playerZ: number;
  bounds: AABB;
  fog: number;
  ambient: number;
  seed: number;
  isRift?: boolean;
  riftTier?: number;
  isTown?: boolean;
  corridors?: AABB[];
}

function rectWalls(x: number, z: number, w: number, d: number, t = 0.7): AABB[] {
  return [
    { x: x, z: z - d / 2, w: w + t * 2, d: t },
    { x: x, z: z + d / 2, w: w + t * 2, d: t },
    { x: x - w / 2, z: z, w: t, d },
    { x: x + w / 2, z: z, w: t, d },
  ];
}

function carveDoor(walls: AABB[], from: Room, to: Room) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const gap = 1.85;
  if (Math.abs(dx) > Math.abs(dz)) {
    const side = dx > 0 ? 1 : -1;
    const x = from.x + side * (from.w / 2);
    for (let i = walls.length - 1; i >= 0; i--) {
      const w = walls[i]!;
      if (Math.abs(w.x - x) < 1.2 && Math.abs(w.z - from.z) < from.d / 2 && w.d > w.w) {
        walls.splice(i, 1);
        const half = w.d / 2;
        const wing = half - gap;
        if (wing > 0.35) {
          walls.push({ x: w.x, z: from.z - gap - wing / 2, w: w.w, d: wing });
          walls.push({ x: w.x, z: from.z + gap + wing / 2, w: w.w, d: wing });
        }
      }
    }
  } else {
    const side = dz > 0 ? 1 : -1;
    const z = from.z + side * (from.d / 2);
    for (let i = walls.length - 1; i >= 0; i--) {
      const w = walls[i]!;
      if (Math.abs(w.z - z) < 1.2 && Math.abs(w.x - from.x) < from.w / 2 && w.w > w.d) {
        walls.splice(i, 1);
        const half = w.w / 2;
        const wing = half - gap;
        if (wing > 0.35) {
          walls.push({ x: from.x - gap - wing / 2, z: w.z, w: wing, d: w.d });
          walls.push({ x: from.x + gap + wing / 2, z: w.z, w: wing, d: w.d });
        }
      }
    }
  }
}

function corridorWalls(from: Room, to: Room, width = 3.6, t = 0.65): AABB[] {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const walls: AABB[] = [];
  if (Math.abs(dx) >= Math.abs(dz)) {
    const dir = dx >= 0 ? 1 : -1;
    const x0 = from.x + dir * (from.w / 2);
    const x1 = to.x - dir * (to.w / 2);
    const z0 = from.z;
    const z1 = to.z;
    const midX = (x0 + x1) / 2;
    const len = Math.max(1.2, Math.abs(x1 - x0));
    walls.push({ x: midX, z: z0 - width / 2, w: len + t, d: t });
    walls.push({ x: midX, z: z0 + width / 2, w: len + t, d: t });
    if (Math.abs(z1 - z0) > 0.8) {
      const midZ = (z0 + z1) / 2;
      const zlen = Math.abs(z1 - z0);
      walls.push({ x: x1 - width / 2, z: midZ, w: t, d: zlen + t });
      walls.push({ x: x1 + width / 2, z: midZ, w: t, d: zlen + t });
    }
  } else {
    const dir = dz >= 0 ? 1 : -1;
    const z0 = from.z + dir * (from.d / 2);
    const z1 = to.z - dir * (to.d / 2);
    const x0 = from.x;
    const x1 = to.x;
    const midZ = (z0 + z1) / 2;
    const len = Math.max(1.2, Math.abs(z1 - z0));
    walls.push({ x: x0 - width / 2, z: midZ, w: t, d: len + t });
    walls.push({ x: x0 + width / 2, z: midZ, w: t, d: len + t });
    if (Math.abs(x1 - x0) > 0.8) {
      const midX = (x0 + x1) / 2;
      const xlen = Math.abs(x1 - x0);
      walls.push({ x: midX, z: z1 - width / 2, w: xlen + t, d: t });
      walls.push({ x: midX, z: z1 + width / 2, w: xlen + t, d: t });
    }
  }
  return walls;
}

function corridorInterior(from: Room, to: Room, width = 3.4): AABB {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  if (Math.abs(dx) >= Math.abs(dz)) {
    const dir = dx >= 0 ? 1 : -1;
    const x0 = from.x + dir * (from.w / 2);
    const x1 = to.x - dir * (to.w / 2);
    return { x: (x0 + x1) / 2, z: from.z, w: Math.max(1.4, Math.abs(x1 - x0) + 1.2), d: width };
  }
  const dir = dz >= 0 ? 1 : -1;
  const z0 = from.z + dir * (from.d / 2);
  const z1 = to.z - dir * (to.d / 2);
  return { x: from.x, z: (z0 + z1) / 2, w: width, d: Math.max(1.4, Math.abs(z1 - z0) + 1.2) };
}

export function generateDungeon(opts: {
  seed: number;
  biome: Biome;
  name: string;
  level: number;
  act: number;
  isRift?: boolean;
  riftTier?: number;
  wantBoss?: boolean;
}): Level {
  const rng = new Rng(opts.seed);
  const rooms: Room[] = [];
  const kinds: RoomKind[] = opts.isRift
    ? ["start", "combat", "elite", "boss"]
    : ["start", "combat", "elite", "combat", "boss"];
  const spacing = 16;
  let x = 0,
    z = 0;
  const used = new Set<string>(["0,0"]);
  for (let i = 0; i < kinds.length; i++) {
    const w = 13 + rng.int(0, 3);
    const d = 12 + rng.int(0, 3);
    rooms.push({ kind: kinds[i]!, x, z, w, d, biome: opts.biome });
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    rng.pick(dirs);
    let placed = false;
    for (let t = 0; t < 8 && !placed; t++) {
      const [dx, dz] = rng.pick(dirs);
      const nx = x + dx * spacing;
      const nz = z + dz * spacing;
      const key = `${Math.round(nx / spacing)},${Math.round(nz / spacing)}`;
      if (!used.has(key)) {
        used.add(key);
        x = nx;
        z = nz;
        placed = true;
      }
    }
    if (!placed) {
      x += spacing;
      z += rng.int(-1, 1) * spacing;
    }
  }

  const walls: AABB[] = [];
  const halls: AABB[] = [];
  for (const r of rooms) walls.push(...rectWalls(r.x, r.z, r.w, r.d));
  for (let i = 0; i < rooms.length - 1; i++) {
    const a = rooms[i]!;
    const b = rooms[i + 1]!;
    carveDoor(walls, a, b);
    carveDoor(walls, b, a);
    walls.push(...corridorWalls(a, b));
    halls.push(corridorInterior(a, b));
  }

  const mons = BIOME_MONSTERS[opts.biome] ?? BIOME_MONSTERS.cathedral!;
  const spawns: Spawn[] = [];
  const props: PropSpot[] = [];
  const start = rooms[0]!;
  for (const r of rooms) {
    if (r.kind === "start") {
      props.push({ kind: "portal", x: r.x, z: r.z - r.d / 2 + 2 });
      for (let i = 0; i < 9; i++) {
        const a = rng.next() * Math.PI * 2;
        const rad = 2.2 + rng.next() * 3.4;
        spawns.push({ x: r.x + Math.cos(a) * rad, z: r.z + Math.sin(a) * rad, monster: rng.pick(mons) });
      }
      continue;
    }
    if (r.kind === "boss") {
      const bossId = opts.isRift ? "guardian" : (ACT_BOSSES[Math.max(0, opts.act - 1)] ?? "maltheon");
      spawns.push({ x: r.x, z: r.z, monster: bossId, boss: true, elite: true });
      props.push({ kind: "exit", x: r.x, z: r.z + r.d / 2 - 2.5 });
      continue;
    }
    if (r.kind === "shrine") {
      props.push({ kind: "shrine", x: r.x, z: r.z, shrine: rng.pick(["speed", "damage", "loot", "res"]) });
    }
    if (r.kind === "treasure" || r.kind === "secret") {
      props.push({ kind: "chest", x: r.x, z: r.z });
      if (r.kind === "secret") props.push({ kind: "chest", x: r.x + 2, z: r.z });
    }
    const pack = r.kind === "elite" ? rng.int(8, 12) : r.kind === "event" ? rng.int(14, 20) : rng.int(10, 16);
    for (let i = 0; i < pack; i++) {
      const a = rng.next() * Math.PI * 2;
      const rad = 1.5 + rng.next() * Math.min(r.w, r.d) * 0.28;
      const champ: ChampionAffix[] | undefined =
        r.kind === "elite" && i === 0
          ? [rng.pick([...CHAMPION_AFFIXES]), rng.chance(0.5) ? rng.pick([...CHAMPION_AFFIXES]) : "extraLife"]
          : undefined;
      spawns.push({
        x: r.x + Math.cos(a) * rad,
        z: r.z + Math.sin(a) * rad,
        monster: r.kind === "elite" && i === 0 ? "brute" : rng.pick(mons),
        elite: r.kind === "elite" && i < 2,
        champion: champ,
      });
    }
    if (r.kind === "combat" && rooms.indexOf(r) === 1)
      props.push({ kind: "shrine", x: r.x - 3.2, z: r.z, shrine: "damage" });
    if (r.kind === "combat" && rng.chance(0.4)) props.push({ kind: "chest", x: r.x + r.w / 2 - 2, z: r.z });
  }

  let minx = Infinity,
    maxx = -Infinity,
    minz = Infinity,
    maxz = -Infinity;
  for (const r of rooms) {
    minx = Math.min(minx, r.x - r.w / 2);
    maxx = Math.max(maxx, r.x + r.w / 2);
    minz = Math.min(minz, r.z - r.d / 2);
    maxz = Math.max(maxz, r.z + r.d / 2);
  }

  return {
    name: opts.name,
    biome: opts.biome,
    rooms,
    walls,
    spawns,
    props,
    playerX: start.x,
    playerZ: start.z,
    bounds: { x: (minx + maxx) / 2, z: (minz + maxz) / 2, w: maxx - minx + 8, d: maxz - minz + 8 },
    fog: opts.biome === "hell" ? 0.022 : opts.biome === "ice" ? 0.012 : 0.016,
    ambient: opts.biome === "hell" ? 0.62 : 0.52,
    seed: opts.seed,
    isRift: opts.isRift,
    riftTier: opts.riftTier,
    corridors: halls,
  };
}

export function generateTown(): Level {
  const walls: AABB[] = [...rectWalls(0, 0, 42, 32, 1.35)];
  const buildings: AABB[] = [
    { x: -12, z: -8, w: 7, d: 6 },
    { x: 12, z: -8, w: 7, d: 6 },
    { x: -12, z: 8, w: 7, d: 6 },
    { x: 12, z: 8, w: 7, d: 6 },
    { x: 0, z: -12, w: 8, d: 5 },
  ];
  walls.push(...buildings);
  const props: PropSpot[] = [
    { kind: "npc", x: -2.2, z: -0.4, npcId: "ryn" },
    { kind: "blacksmith", x: -12, z: 3.4 },
    { kind: "npc", x: -12, z: 4.8, npcId: "kael" },
    { kind: "mystic", x: 12, z: 3.4 },
    { kind: "npc", x: 12, z: 4.8, npcId: "maera" },
    { kind: "vendor", x: 12, z: -3.6 },
    { kind: "npc", x: 12, z: -2.2, npcId: "vesh" },
    { kind: "stash", x: -12, z: -3.6 },
    { kind: "npc", x: -12, z: -2.2, npcId: "brann" },
    { kind: "riftstone", x: 0, z: 1.6 },
    { kind: "npc", x: 2.4, z: 1.6, npcId: "io" },
    { kind: "portal", x: 0, z: -10.2 },
    { kind: "bounty", x: -5.5, z: 5.5 },
  ];
  return {
    name: "Thornwatch",
    biome: "town",
    rooms: [{ kind: "start", x: 0, z: 0, w: 48, d: 36, biome: "town" }],
    walls,
    spawns: [],
    props,
    playerX: 0,
    playerZ: 3.2,
    bounds: { x: 0, z: 0, w: 42, d: 32 },
    fog: 0.008,
    ambient: 0.58,
    seed: 1,
    isTown: true,
  };
}

/** Short outdoor road: three packs, one elite, a shrine, then the cathedral gate. */
export function generateMarches(seed = 7): Level {
  const rng = new Rng(seed);
  const w = 18;
  const d = 48;
  const mons = ["imp", "cultist", "skeleton"];
  const spawns: Spawn[] = [];
  const packs = [12, 4, -6, -16];
  packs.forEach((z, pi) => {
    const n = pi === 2 ? 8 : 6;
    for (let i = 0; i < n; i++) {
      const a = rng.next() * Math.PI * 2;
      const rad = 1.2 + rng.next() * 3.2;
      spawns.push({
        x: Math.cos(a) * rad,
        z: z + Math.sin(a) * rad * 0.65,
        monster: pi === 2 && i === 0 ? "brute" : rng.pick(mons),
        elite: pi === 2 && i < 2,
      });
    }
  });
  return {
    name: "The Shattered Road",
    biome: "wilds",
    rooms: [{ kind: "start", x: 0, z: 0, w, d, biome: "wilds" }],
    walls: [...rectWalls(0, 0, w, d, 1.1)],
    spawns,
    props: [
      { kind: "portal", x: 0, z: 20 },
      { kind: "shrine", x: 5.2, z: 8, shrine: "speed" },
      { kind: "exit", x: 0, z: -21 },
    ],
    playerX: 0,
    playerZ: 18,
    bounds: { x: 0, z: 0, w, d },
    fog: 0.01,
    ambient: 0.62,
    seed,
    corridors: [],
  };
}

export function isWalkable(level: Level, x: number, z: number) {
  if (level.isTown) {
    const b = level.bounds;
    return Math.abs(x - b.x) <= b.w / 2 - 0.9 && Math.abs(z - b.z) <= b.d / 2 - 0.9;
  }
  for (const r of level.rooms) {
    if (Math.abs(x - r.x) <= r.w / 2 - 0.4 && Math.abs(z - r.z) <= r.d / 2 - 0.4) return true;
  }
  for (const c of level.corridors ?? []) {
    if (Math.abs(x - c.x) <= c.w / 2 && Math.abs(z - c.z) <= c.d / 2) return true;
  }
  return false;
}

export function circleHitsAABB(x: number, z: number, r: number, b: AABB) {
  const nx = Math.max(b.x - b.w / 2, Math.min(x, b.x + b.w / 2));
  const nz = Math.max(b.z - b.d / 2, Math.min(z, b.z + b.d / 2));
  const dx = x - nx;
  const dz = z - nz;
  return dx * dx + dz * dz < r * r;
}

export function resolveWalls(x: number, z: number, r: number, walls: AABB[]) {
  let px = x,
    pz = z;
  for (let i = 0; i < 3; i++) {
    for (const b of walls) {
      if (!circleHitsAABB(px, pz, r, b)) continue;
      const nx = Math.max(b.x - b.w / 2, Math.min(px, b.x + b.w / 2));
      const nz = Math.max(b.z - b.d / 2, Math.min(pz, b.z + b.d / 2));
      let dx = px - nx;
      let dz = pz - nz;
      const m = Math.hypot(dx, dz) || 0.0001;
      const push = r - m + 0.01;
      if (push > 0) {
        px += (dx / m) * push;
        pz += (dz / m) * push;
      }
    }
  }
  return { x: px, z: pz };
}
