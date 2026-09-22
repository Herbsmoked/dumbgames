import { CLASSES, MAX_LEVEL, SEASON_NAME, defaultLoadout, defaultPrimary } from "./catalog";
import type { ClassId, Difficulty, HeroSave, SaveData } from "./types";

const KEY = "veilbreak-save-v1";
const SAVE_VERSION = 2;

function emptyHero(classId: ClassId, name: string): HeroSave {
  const c = CLASSES[classId];
  const ranks: Record<string, number> = {};
  const runes: Record<string, boolean> = {};
  for (const s of c.skills) {
    ranks[s.id] = s.unlock <= 1 ? 1 : 0;
    runes[s.id] = false;
  }
  return {
    name,
    classId,
    level: 1,
    xp: 0,
    paragon: 0,
    paragonSpent: { core: 0, offense: 0, defense: 0, utility: 0 },
    gold: 40,
    materials: { scrap: 0, dust: 0, crystal: 0 },
    difficulty: "normal",
    inventory: [],
    stash: [],
    equipped: {},
    gems: [],
    skillRanks: ranks,
    skillRunes: runes,
    primaryId: defaultPrimary(classId),
    loadout: defaultLoadout(classId),
    potionCount: 3,
    quests: [{ id: "a1q1", step: 0, progress: 0, done: false }],
    flags: {},
    act: 1,
    pity: 0,
    stats: { kills: 0, elites: 0, legendaries: 0, deaths: 0 },
  };
}

function defaultSave(): SaveData {
  return {
    version: SAVE_VERSION,
    characters: [],
    active: 0,
    settings: { shake: 0.7, numbers: true, autoPickup: 2.4, music: 0.35, sfx: 0.8, autoLoot: "yellow" },
    season: { id: 1, name: SEASON_NAME, challenges: {} },
    riftBest: {},
    weekly: { id: weekId(), bounties: makeBounties(), cacheClaimed: false },
  };
}

export function weekId() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((+d - +onejan) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-w${week}`;
}

export function makeBounties() {
  return [
    { id: "b1", text: "Slay 80 Choir spawn", kind: "kill" as const, count: 80, progress: 0, gold: 400, done: false },
    { id: "b2", text: "Hunt 8 elites", kind: "elite" as const, count: 8, progress: 0, gold: 500, done: false },
    { id: "b3", text: "Open 6 chests", kind: "chest" as const, count: 6, progress: 0, gold: 300, done: false },
    { id: "b4", text: "Close 2 Challenge Rifts", kind: "rift" as const, count: 2, progress: 0, gold: 700, done: false },
  ];
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultSave();
    const parsed = JSON.parse(raw) as SaveData;
    const base = defaultSave();
    const s: SaveData = { ...base, ...parsed, settings: { ...base.settings, ...parsed.settings } };
    if (s.weekly.id !== weekId()) {
      s.weekly = { id: weekId(), bounties: makeBounties(), cacheClaimed: false };
    }
    s.version = SAVE_VERSION;
    s.settings.autoLoot = s.settings.autoLoot ?? "yellow";
    for (const h of s.characters) {
      const c = CLASSES[h.classId];
      for (const sk of c.skills) {
        if (h.skillRanks[sk.id] == null) h.skillRanks[sk.id] = sk.unlock <= Math.max(1, h.level) ? 1 : 0;
      }
      if (!h.primaryId || !c.skills.some((sk) => sk.id === h.primaryId)) h.primaryId = defaultPrimary(h.classId);
      if (!h.loadout || h.loadout.length < 4 || h.loadout.some((id) => !c.skills.some((sk) => sk.id === id))) h.loadout = defaultLoadout(h.classId);
      if (h.potionCount == null) h.potionCount = 3;
    }
    return s;
  } catch {
    return defaultSave();
  }
}

export function persistSave(data: SaveData) {
  try {
    const backup = localStorage.getItem(KEY);
    if (backup) localStorage.setItem(KEY + ":prev", backup);
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* quota / private */
  }
}

export function createHero(save: SaveData, classId: ClassId, name: string): HeroSave {
  const h = emptyHero(classId, name || CLASSES[classId].name);
  save.characters.push(h);
  save.active = save.characters.length - 1;
  persistSave(save);
  return h;
}

export function addXp(hero: HeroSave, amount: number): { leveled: boolean; paragon: boolean } {
  hero.xp += amount;
  let leveled = false;
  let paragon = false;
  if (hero.level < MAX_LEVEL) {
    const need = (l: number) => Math.floor(80 * Math.pow(1.14, l - 1) + 40);
    while (hero.level < MAX_LEVEL && hero.xp >= need(hero.level)) {
      hero.xp -= need(hero.level);
      hero.level += 1;
      leveled = true;
      const c = CLASSES[hero.classId];
      for (const s of c.skills) {
        if (s.unlock <= hero.level && (hero.skillRanks[s.id] ?? 0) < 1) hero.skillRanks[s.id] = 1;
      }
    }
  }
  if (hero.level >= MAX_LEVEL) {
    const pNeed = 1200 + hero.paragon * 80;
    while (hero.xp >= pNeed) {
      hero.xp -= pNeed;
      hero.paragon += 1;
      paragon = true;
    }
  }
  return { leveled, paragon };
}

export type { Difficulty };
