import {
  BASES,
  CLASSES,
  GEMS,
  LEGENDARIES,
  PRIMARY_AFFIXES,
  SECONDARY_AFFIXES,
  SETS,
  SLOTS,
} from "./catalog";
import type { ClassId, Item, Rarity, Slot, StatId } from "./types";

export class Rng {
  s: number;
  constructor(seed = Date.now() % 2147483647) {
    this.s = seed || 1;
  }
  next() {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  int(a: number, b: number) {
    return a + Math.floor(this.next() * (b - a + 1));
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)]!;
  }
  chance(p: number) {
    return this.next() < p;
  }
  weighted<T extends { w: number }>(arr: T[]): T {
    let t = 0;
    for (const x of arr) t += x.w;
    let r = this.next() * t;
    for (const x of arr) {
      r -= x.w;
      if (r <= 0) return x;
    }
    return arr[arr.length - 1]!;
  }
}

let uid = 1;
export function uidStr() {
  uid += 1;
  return "i" + uid.toString(36) + Date.now().toString(36).slice(-4);
}

export function rarityFor(magicFind: number, elite: boolean, boss: boolean, pity: number, rng: Rng): Rarity {
  let leg = 0.012 * magicFind + (elite ? 0.04 : 0) + (boss ? 0.18 : 0);
  if (pity >= 12) leg += 0.55;
  if (rng.chance(leg)) return rng.chance(0.22) ? "set" : "legendary";
  if (rng.chance(0.18 * magicFind + (elite ? 0.12 : 0))) return "rare";
  if (rng.chance(0.45 * magicFind)) return "magic";
  return "normal";
}

export function rollItem(opts: {
  rng: Rng;
  level: number;
  classId: ClassId;
  rarity?: Rarity;
  slot?: Slot;
  forceLegendary?: boolean;
}): Item {
  const { rng, level, classId } = opts;
  const rarity: Rarity = opts.forceLegendary ? (rng.chance(0.25) ? "set" : "legendary") : (opts.rarity ?? "rare");
  const cls = CLASSES[classId];
  let slot = opts.slot ?? rng.pick(SLOTS);
  if (rarity === "legendary" || rarity === "set") {
    /* keep */
  }
  let legendaryId: string | undefined;
  let setId: string | undefined;
  let name: string;
  let base = rng.pick(BASES.filter((b) => b.slot === slot));
  if (!base) {
    slot = "main";
    base = BASES.find((b) => b.slot === "main")!;
  }
  if (rarity === "legendary") {
    const pool = LEGENDARIES.filter((l) => !opts.slot || l.slot === opts.slot);
    const L = rng.pick(pool.length ? pool : LEGENDARIES);
    legendaryId = L.id;
    slot = L.slot;
    name = L.name;
    base = BASES.find((b) => b.slot === slot) ?? base;
  } else if (rarity === "set") {
    const set = rng.pick(SETS);
    setId = set.id;
    slot = rng.pick(set.slots);
    name = `${set.name} ${slot}`;
    base = BASES.find((b) => b.slot === slot) ?? base;
  } else {
    name = base.name;
    if (rarity === "magic") name = "Blessed " + name;
    if (rarity === "rare") name = "Riven " + name;
  }
  const nAff =
    rarity === "normal" ? rng.int(0, 1) : rarity === "magic" ? rng.int(2, 3) : rarity === "rare" ? rng.int(4, 5) : rng.int(5, 6);
  const affixes: { id: StatId; value: number }[] = [];
  const used = new Set<string>();
  const scale = 0.35 + level / 80;
  for (let i = 0; i < nAff; i++) {
    const pool = i < Math.ceil(nAff * 0.65) ? PRIMARY_AFFIXES : SECONDARY_AFFIXES;
    let a = rng.weighted(pool);
    let guard = 0;
    while (used.has(a.id) && guard++ < 8) a = rng.weighted(pool);
    if (used.has(a.id)) continue;
    used.add(a.id);
    let id: StatId = a.id;
    if ((id === "str" || id === "dex" || id === "int") && rng.chance(0.8)) id = cls.primary;
    const v = a.min + (a.max - a.min) * scale * (0.65 + rng.next() * 0.35);
    affixes.push({ id, value: Math.round(v * 10) / 10 });
  }
  const sockets =
    rarity === "normal" ? 0 : rarity === "magic" ? (rng.chance(0.2) ? 1 : 0) : rarity === "rare" ? rng.int(0, 2) : rng.int(1, 3);
  return {
    uid: uidStr(),
    baseId: base.id,
    name,
    slot,
    rarity,
    ilvl: Math.max(1, level + rng.int(-2, 3)),
    reqLevel: Math.max(1, level - 4),
    affixes,
    sockets,
    gems: Array.from({ length: sockets }, () => null),
    legendaryId,
    setId,
    identified: rarity !== "rare" && rarity !== "legendary" && rarity !== "set" ? true : rng.chance(0.35),
  };
}

export function identify(item: Item) {
  item.identified = true;
}

export function itemPower(item: Item): number {
  let p = item.ilvl * 8;
  for (const a of item.affixes) p += a.value;
  if (item.rarity === "legendary") p += 80;
  if (item.rarity === "set") p += 70;
  return Math.round(p);
}

export function salvageValue(item: Item) {
  if (item.rarity === "normal") return { scrap: 2, dust: 0, crystal: 0 };
  if (item.rarity === "magic") return { scrap: 4, dust: 1, crystal: 0 };
  if (item.rarity === "rare") return { scrap: 8, dust: 4, crystal: 0 };
  if (item.rarity === "set") return { scrap: 12, dust: 8, crystal: 1 };
  return { scrap: 14, dust: 10, crystal: 2 };
}

export function formatAffix(a: { id: StatId; value: number }) {
  const pct = ["crit", "critDmg", "cdr", "area", "eliteDmg", "goldFind", "dodge"].includes(a.id);
  const n = pct ? `${a.value.toFixed(1)}%` : a.id === "pickup" ? a.value.toFixed(1) : String(Math.round(a.value));
  const labels: Record<string, string> = {
    str: "Strength",
    dex: "Dexterity",
    int: "Intelligence",
    vit: "Vitality",
    crit: "Critical Hit Chance",
    critDmg: "Critical Hit Damage",
    cdr: "Cooldown Reduction",
    area: "Area Damage",
    eliteDmg: "Damage to Elites",
    armor: "Armor",
    allRes: "Resistance to All",
    life: "Life",
    lifeOnHit: "Life on Hit",
    goldFind: "Gold Find",
    pickup: "Pickup Radius",
    dodge: "Dodge Chance",
    socket: "Socket",
  };
  return `+${n} ${labels[a.id] ?? a.id}`;
}

export function compareScore(item: Item, equipped?: Item) {
  if (!equipped) return 1;
  return itemPower(item) - itemPower(equipped);
}

export function itemDamage(item: Item): number {
  let v = item.ilvl * 2;
  for (const a of item.affixes) {
    if (a.id === "str" || a.id === "dex" || a.id === "int" || a.id === "crit" || a.id === "critDmg" || a.id === "eliteDmg" || a.id === "area")
      v += a.value;
  }
  if (item.rarity === "legendary" || item.rarity === "set") v += 24;
  if (item.rarity === "rare") v += 10;
  return Math.round(v);
}

export function itemLife(item: Item): number {
  let v = 0;
  for (const a of item.affixes) if (a.id === "vit" || a.id === "life") v += a.id === "life" ? a.value : a.value * 6;
  return Math.round(v);
}

export function itemCR(item: Item): number {
  return itemPower(item);
}

export function randomGem(rng: Rng, rank = 1) {
  const g = rng.pick(GEMS);
  return { id: g.id, name: g.name, rank, copies: 1 };
}
