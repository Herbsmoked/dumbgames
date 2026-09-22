export type ClassId =
  | "barbarian"
  | "wizard"
  | "demonhunter"
  | "monk"
  | "necromancer"
  | "crusader";

export type RosterId = ClassId | "bloodknight" | "tempest" | "druid";

export type Slot =
  | "helm"
  | "chest"
  | "shoulders"
  | "gloves"
  | "pants"
  | "boots"
  | "belt"
  | "amulet"
  | "ring"
  | "main"
  | "off";

export type Rarity = "normal" | "magic" | "rare" | "legendary" | "set";
export type StatId =
  | "str"
  | "dex"
  | "int"
  | "vit"
  | "crit"
  | "critDmg"
  | "cdr"
  | "area"
  | "eliteDmg"
  | "armor"
  | "allRes"
  | "life"
  | "lifeOnHit"
  | "goldFind"
  | "pickup"
  | "dodge"
  | "socket";

export type SkillKind =
  | "melee"
  | "aoe"
  | "projectile"
  | "dash"
  | "buff"
  | "channel"
  | "nova"
  | "summon"
  | "beam";

export type SkillRole = "primary" | "skill" | "ultimate";

export type Biome = "town" | "cathedral" | "crypt" | "wilds" | "ice" | "hell" | "flood" | "rift";
export type Difficulty = "normal" | "hell1" | "hell2" | "hell3" | "hell4" | "inferno";
export type Screen = "title" | "select" | "intro" | "playing" | "dead";
export type Panel =
  | "none"
  | "inventory"
  | "stash"
  | "vendor"
  | "blacksmith"
  | "mystic"
  | "quests"
  | "skills"
  | "map"
  | "pause"
  | "dialogue"
  | "bounties"
  | "rifts"
  | "codex";

export type ChampionAffix =
  | "extraLife"
  | "fast"
  | "molten"
  | "jailer"
  | "vortex"
  | "electrified"
  | "frozen"
  | "teleporter";

export type CCType = "stun" | "freeze" | "snare" | "knock" | "pull";

export interface AffixRoll {
  id: StatId;
  value: number;
}

export interface Item {
  uid: string;
  baseId: string;
  name: string;
  slot: Slot;
  rarity: Rarity;
  ilvl: number;
  reqLevel: number;
  affixes: AffixRoll[];
  sockets: number;
  gems: (string | null)[];
  legendaryId?: string;
  setId?: string;
  identified: boolean;
}

export interface GemItem {
  id: string;
  name: string;
  rank: number;
  copies: number;
}

export interface SkillDef {
  id: string;
  name: string;
  key: string;
  slot: number;
  kind: SkillKind;
  role?: SkillRole;
  resource: number;
  cooldown: number;
  range: number;
  radius: number;
  duration: number;
  dash: number;
  damage: number;
  ticks?: number;
  unlock: number;
  runeName: string;
  runeUnlock: number;
  desc: string;
  runeDesc: string;
  color: string;
  icon?: string;
  charges?: number;
  chargeCd?: number;
}

export interface ClassDef {
  id: ClassId;
  name: string;
  title: string;
  resource: string;
  primary: "str" | "dex" | "int";
  lore: string;
  portrait: string;
  sprite: string;
  attackSprite?: string;
  color: string;
  base: { str: number; dex: number; int: number; vit: number; speed: number };
  skills: SkillDef[];
}

export interface MonsterDef {
  id: string;
  name: string;
  sprite: string;
  hp: number;
  dmg: number;
  speed: number;
  radius: number;
  xp: number;
  elite: boolean;
  boss?: boolean;
  scale: number;
  frames: number;
  rows: number;
  cols: number;
  loot: number;
}

export interface QuestDef {
  id: string;
  act: number;
  name: string;
  giver: string;
  steps: { id: string; text: string; kind: "talk" | "kill" | "enter" | "boss" | "collect" | "turnin"; target?: string; count?: number }[];
  rewardGold: number;
  rewardXp: number;
  lore: string;
}

export interface LegendaryDef {
  id: string;
  name: string;
  slot: Slot;
  setId?: string;
  power: string;
  desc: string;
}

export interface SetDef {
  id: string;
  name: string;
  slots: Slot[];
  bonuses: Record<number, string>;
}

export interface QuestState {
  id: string;
  step: number;
  progress: number;
  done: boolean;
}

export interface Bounty {
  id: string;
  text: string;
  kind: "kill" | "elite" | "chest" | "rift";
  target?: string;
  count: number;
  progress: number;
  gold: number;
  done: boolean;
}

export interface SaveData {
  version: number;
  characters: HeroSave[];
  active: number;
  settings: {
    shake: number;
    numbers: boolean;
    autoPickup: number;
    music: number;
    sfx: number;
    autoLoot: "off" | "white" | "blue" | "yellow" | "all";
  };
  season: { id: number; name: string; challenges: Record<string, number> };
  riftBest: Record<string, number>;
  weekly: { id: string; bounties: Bounty[]; cacheClaimed: boolean };
}

export interface HeroSave {
  name: string;
  classId: ClassId;
  level: number;
  xp: number;
  paragon: number;
  paragonSpent: { core: number; offense: number; defense: number; utility: number };
  gold: number;
  materials: { scrap: number; dust: number; crystal: number };
  difficulty: Difficulty;
  inventory: Item[];
  stash: Item[];
  equipped: Partial<Record<Slot, Item | Item[]>>;
  gems: GemItem[];
  skillRanks: Record<string, number>;
  skillRunes: Record<string, boolean>;
  primaryId: string;
  loadout: string[];
  potionCount: number;
  quests: QuestState[];
  flags: Record<string, boolean>;
  act: number;
  pity: number;
  stats: { kills: number; elites: number; legendaries: number; deaths: number };
}

export interface SkillSnap {
  id: string;
  name: string;
  key: string;
  cd: number;
  maxCd: number;
  charges: number;
  maxCharges: number;
  locked: boolean;
  icon: string;
  channel: number;
}

export interface TargetSnap {
  name: string;
  hp: number;
  maxHp: number;
  level: number;
  elite: boolean;
  boss: boolean;
  type: string;
  affixes: string[];
}

export interface GroundLootSnap {
  uid: string;
  name: string;
  rarity: Rarity | "gold" | "globe";
  gold?: number;
}

export interface UiSnapshot {
  screen: Screen;
  panel: Panel;
  classId: ClassId | null;
  name: string;
  level: number;
  xp: number;
  xpNext: number;
  paragon: number;
  hp: number;
  maxHp: number;
  hpChase: number;
  resource: number;
  maxResource: number;
  resourceName: string;
  gold: number;
  materials: HeroSave["materials"];
  difficulty: Difficulty;
  areaName: string;
  biome: Biome;
  questText: string;
  buffs: { id: string; name: string; t: number }[];
  skills: SkillSnap[];
  primary: SkillSnap | null;
  ultimate: SkillSnap | null;
  ultCharge: number;
  ultReady: boolean;
  ultActive: number;
  potionCd: number;
  potionCount: number;
  potionMax: number;
  potionHot: number;
  inventory: Item[];
  stash: Item[];
  equipped: Partial<Record<Slot, Item | Item[]>>;
  vendor: Item[];
  groundCompare: Item | null;
  groundLoot: GroundLootSnap[];
  target: TargetSnap | null;
  toasts: { id: string; item?: Item; text: string; t: number }[];
  dialogue: { speaker: string; text: string; options?: { id: string; label: string }[] } | null;
  minimap: { w: number; h: number; px: number; pz: number; ents: { x: number; z: number; c: string }[] };
  dead: boolean;
  rift: { active: boolean; tier: number; time: number; progress: number; goal: number } | null;
  worldBossIn: number;
  ping: string;
  interact: string | null;
  legendaryFlash: string | null;
  loading: boolean;
  loadPct: number;
  combatRating: number;
  channel: { id: string; t: number; max: number } | null;
  lowHp: boolean;
  portrait: string;
}
