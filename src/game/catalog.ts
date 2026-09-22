import type {
  ClassDef,
  ClassId,
  Difficulty,
  LegendaryDef,
  MonsterDef,
  QuestDef,
  SetDef,
  Slot,
  StatId,
} from "./types";

export const GAME_TITLE = "VEILBREAK";
export const TOWN_NAME = "Thornwatch";
export const WORLD_NAME = "Aeloria";
export const SEASON_NAME = "Season 1 — The First Tear";
export const MAX_LEVEL = 60;
export const INVENTORY_SIZE = 60;
export const STASH_SIZE = 80;

export const DIFFICULTY: Record<
  Difficulty,
  { name: string; hp: number; dmg: number; magic: number; gold: number; unlock: number }
> = {
  normal: { name: "Adventurer", hp: 1, dmg: 1, magic: 1, gold: 1, unlock: 1 },
  hell1: { name: "Hell I", hp: 2.2, dmg: 1.6, magic: 1.2, gold: 1.3, unlock: 20 },
  hell2: { name: "Hell II", hp: 4, dmg: 2.4, magic: 1.4, gold: 1.6, unlock: 30 },
  hell3: { name: "Hell III", hp: 7, dmg: 3.4, magic: 1.6, gold: 2, unlock: 40 },
  hell4: { name: "Hell IV", hp: 12, dmg: 4.8, magic: 1.9, gold: 2.5, unlock: 50 },
  inferno: { name: "Inferno", hp: 22, dmg: 7, magic: 2.3, gold: 3.2, unlock: 60 },
};

export const SLOTS: Slot[] = [
  "helm",
  "chest",
  "shoulders",
  "gloves",
  "pants",
  "boots",
  "belt",
  "amulet",
  "ring",
  "main",
  "off",
];

export const SLOT_LABEL: Record<Slot, string> = {
  helm: "Helm",
  chest: "Chest",
  shoulders: "Shoulders",
  gloves: "Gloves",
  pants: "Pants",
  boots: "Boots",
  belt: "Belt",
  amulet: "Amulet",
  ring: "Ring",
  main: "Main Hand",
  off: "Off Hand",
};

export const STAT_LABEL: Record<StatId, string> = {
  str: "Strength",
  dex: "Dexterity",
  int: "Intelligence",
  vit: "Vitality",
  crit: "Critical Chance",
  critDmg: "Critical Damage",
  cdr: "Cooldown Reduction",
  area: "Area Damage",
  eliteDmg: "Elite Damage",
  armor: "Armor",
  allRes: "All Resistance",
  life: "Life",
  lifeOnHit: "Life on Hit",
  goldFind: "Gold Find",
  pickup: "Pickup Radius",
  dodge: "Dodge",
  socket: "Socket",
};

const barbSkills: ClassDef["skills"] = [
  { id: "cleave", name: "Cleave", key: "LMB", slot: -1, kind: "melee", role: "primary", resource: 0, cooldown: 0.42, range: 2.8, radius: 2.4, duration: 0, dash: 0, damage: 1.2, unlock: 1, runeName: "Blood Bath", runeUnlock: 15, desc: "Cone smash that leaves a light bleed.", runeDesc: "Bleed lasts longer and ticks harder.", color: "#c44", icon: "/game/icons/cleave.png" },
  { id: "lacerate", name: "Lacerate", key: "LMB", slot: -1, kind: "melee", role: "primary", resource: 0, cooldown: 0.38, range: 2.5, radius: 1.35, duration: 0, dash: 0, damage: 1.5, unlock: 1, runeName: "Blood Drinker", runeUnlock: 15, desc: "A single-target bite that heals a sliver of life.", runeDesc: "Heal is doubled.", color: "#a22", icon: "/game/icons/lacerate.png" },
  { id: "hota", name: "Hammer of the Ancients", key: "1", slot: 0, kind: "aoe", role: "skill", resource: 0, cooldown: 6, range: 6.5, radius: 3.1, duration: 0.4, dash: 0, damage: 2.9, unlock: 1, runeName: "Rolling Thunder", runeUnlock: 15, desc: "Ancestral hammer slams the ground.", runeDesc: "Shockwave pulses a second time.", color: "#c80", icon: "/game/icons/hota.png" },
  { id: "whirlwind", name: "Whirlwind", key: "2", slot: 1, kind: "channel", role: "skill", resource: 0, cooldown: 8, range: 0, radius: 2.55, duration: 4.2, dash: 0, damage: 0.72, ticks: 1, unlock: 1, runeName: "Hurricane", runeUnlock: 18, desc: "Spin, striking all nearby. Other skills lock until you stop.", runeDesc: "Move faster while spinning.", color: "#e33", icon: "/game/icons/whirlwind.png" },
  { id: "charge", name: "Furious Charge", key: "3", slot: 2, kind: "dash", role: "skill", resource: 0, cooldown: 5.5, range: 9, radius: 1.7, duration: 0.22, dash: 8.2, damage: 1.75, unlock: 1, runeName: "Stampede", runeUnlock: 16, desc: "Shoulder-charge a line. Three charges.", runeDesc: "Carry the first foe along.", color: "#fb5", icon: "/game/icons/charge.png", charges: 3, chargeCd: 5.5 },
  { id: "leap", name: "Leap", key: "4", slot: 3, kind: "dash", role: "skill", resource: 0, cooldown: 7, range: 9, radius: 2.7, duration: 0.28, dash: 8, damage: 1.85, unlock: 1, runeName: "Aftershock", runeUnlock: 16, desc: "Leap with i-frames and crash down.", runeDesc: "Landing quake pulses a second time.", color: "#fb5", icon: "/game/icons/leap.png" },
  { id: "sprint", name: "Sprint", key: "1", slot: 4, kind: "buff", role: "skill", resource: 0, cooldown: 10, range: 0, radius: 0, duration: 3.2, dash: 0, damage: 0, unlock: 4, runeName: "Gangway", runeUnlock: 18, desc: "Brief move-speed. Pass through enemies.", runeDesc: "Also knocks foes aside.", color: "#da4", icon: "/game/icons/sprint.png" },
  { id: "stomp", name: "Ground Stomp", key: "2", slot: 5, kind: "nova", role: "skill", resource: 0, cooldown: 8, range: 0, radius: 3.4, duration: 0.4, dash: 0, damage: 1.5, unlock: 8, runeName: "Deafening", runeUnlock: 20, desc: "Stomp that stuns a pack.", runeDesc: "Stun lasts longer.", color: "#c80", icon: "/game/icons/stomp.png" },
  { id: "demoralize", name: "Demoralize", key: "3", slot: 6, kind: "aoe", role: "skill", resource: 0, cooldown: 12, range: 0, radius: 5.5, duration: 4, dash: 0, damage: 0.25, unlock: 12, runeName: "Dread Cry", runeUnlock: 22, desc: "A shout that slows and weakens nearby demons.", runeDesc: "Foes cower longer.", color: "#da4", icon: "/game/icons/demoralize.png" },
  { id: "wrath", name: "Wrath of the Berserker", key: "4", slot: 7, kind: "buff", role: "skill", resource: 0, cooldown: 22, range: 0, radius: 0, duration: 6, dash: 0, damage: 0, unlock: 16, runeName: "Insanity", runeUnlock: 28, desc: "A rage burst. Not the Ultimate — a skill.", runeDesc: "Duration increased.", color: "#f62", icon: "/game/icons/wrath.png" },
  { id: "ancestral", name: "Call of the Ancients", key: "Q", slot: 99, kind: "buff", role: "ultimate", resource: 0, cooldown: 0, range: 0, radius: 0, duration: 12, dash: 0, damage: 0, unlock: 1, runeName: "Gold Fire", runeUnlock: 30, desc: "Supercharges your Primary for 12 seconds. Gold fire on every swing.", runeDesc: "Duration increased.", color: "#f62", icon: "/game/icons/ultimate.png" },
];


const wizSkills: ClassDef["skills"] = [
  { id: "shards", name: "Arc Shards", key: "1", slot: 0, kind: "projectile", resource: 8, cooldown: 0.28, range: 13, radius: 0.45, duration: 0.7, dash: 0, damage: 1.05, unlock: 1, runeName: "Splinters", runeUnlock: 15, desc: "Hurl a burst of arcane glass.", runeDesc: "Shards pierce and fork.", color: "#6cf" },
  { id: "beam", name: "Disintegrate", key: "2", slot: 1, kind: "beam", resource: 14, cooldown: 0.1, range: 12, radius: 0.55, duration: 0.12, dash: 0, damage: 0.7, unlock: 2, runeName: "Entropy", runeUnlock: 15, desc: "A continuous beam of unmaking.", runeDesc: "Beam explodes at the far end.", color: "#b6f" },
  { id: "frostbloom", name: "Frostbloom", key: "3", slot: 2, kind: "nova", resource: 28, cooldown: 8, range: 0, radius: 4.2, duration: 2.2, dash: 0, damage: 1.6, unlock: 4, runeName: "Deep Freeze", runeUnlock: 18, desc: "Nova of rime that freezes.", runeDesc: "Frozen targets shatter for bonus damage.", color: "#9df" },
  { id: "comet", name: "Comet", key: "4", slot: 3, kind: "aoe", resource: 35, cooldown: 10, range: 11, radius: 3.2, duration: 0.7, dash: 0, damage: 3.2, unlock: 8, runeName: "Meteor Shower", runeUnlock: 20, desc: "Call a molten comet.", runeDesc: "Three smaller comets rain after.", color: "#f63" },
  { id: "ward", name: "Prism Ward", key: "q", slot: 4, kind: "buff", resource: 0, cooldown: 14, range: 0, radius: 0, duration: 5, dash: 0, damage: 0, unlock: 12, runeName: "Mirror", runeUnlock: 22, desc: "Absorb the next hits.", runeDesc: "Reflect a portion as arcane.", color: "#cef" },
  { id: "blink", name: "Blink", key: "e", slot: 5, kind: "dash", resource: 10, cooldown: 5, range: 8, radius: 1.8, duration: 0.16, dash: 8, damage: 0.6, unlock: 1, runeName: "Afterimage", runeUnlock: 16, desc: "Teleport with i-frames.", runeDesc: "Leave a damaging echo.", color: "#adf" },
  { id: "archon", name: "Ascendant Form", key: "r", slot: 6, kind: "buff", resource: 0, cooldown: 50, range: 0, radius: 5, duration: 6, dash: 0, damage: 1.2, unlock: 20, runeName: "Starfall", runeUnlock: 30, desc: "Invulnerable. Become a living rift.", runeDesc: "Comets fall around you.", color: "#e8f" },
];

const dhSkills: ClassDef["skills"] = [
  { id: "multishot", name: "Fan of Bolts", key: "1", slot: 0, kind: "projectile", resource: 10, cooldown: 0.32, range: 14, radius: 0.4, duration: 0.65, dash: 0, damage: 0.85, unlock: 1, runeName: "Widened", runeUnlock: 15, desc: "Loose a fan of bolts.", runeDesc: "Two extra bolts.", color: "#8c4" },
  { id: "impale", name: "Impale", key: "2", slot: 1, kind: "projectile", resource: 16, cooldown: 2.4, range: 16, radius: 0.35, duration: 0.55, dash: 0, damage: 2.6, unlock: 2, runeName: "Bleedwire", runeUnlock: 15, desc: "A heavy bolt that punches through.", runeDesc: "Leaves a bleeding trail.", color: "#c54" },
  { id: "caltrops", name: "Caltrops", key: "3", slot: 2, kind: "aoe", resource: 12, cooldown: 8, range: 6, radius: 2.4, duration: 5, dash: 0, damage: 0.4, unlock: 4, runeName: "Hooked", runeUnlock: 18, desc: "Seed the ground with snares.", runeDesc: "Enemies are pulled inward.", color: "#875" },
  { id: "rain", name: "Rain of Vengeance", key: "4", slot: 3, kind: "aoe", resource: 30, cooldown: 12, range: 10, radius: 3.6, duration: 2.4, dash: 0, damage: 0.7, ticks: 6, unlock: 8, runeName: "Dark Cloud", runeUnlock: 20, desc: "A storm of arrows from above.", runeDesc: "Larger radius, extra tick.", color: "#6a3" },
  { id: "smoke", name: "Smoke Veil", key: "q", slot: 4, kind: "buff", resource: 0, cooldown: 14, range: 0, radius: 3, duration: 3, dash: 0, damage: 0, unlock: 12, runeName: "Toxic", runeUnlock: 22, desc: "Vanish; next shot crits.", runeDesc: "Cloud poisons foes.", color: "#9a8" },
  { id: "vault", name: "Vault", key: "e", slot: 5, kind: "dash", resource: 0, cooldown: 5, range: 8, radius: 1.4, duration: 0.2, dash: 7.5, damage: 0.4, unlock: 1, runeName: "Tumble", runeUnlock: 16, desc: "Dash with i-frames.", runeDesc: "Drop caltrops at the start.", color: "#ad5" },
  { id: "vengeance", name: "Vengeance", key: "r", slot: 6, kind: "buff", resource: 0, cooldown: 45, range: 0, radius: 0, duration: 6, dash: 0, damage: 0.5, unlock: 20, runeName: "Side Guns", runeUnlock: 30, desc: "Invulnerable burst. Twin cannons.", runeDesc: "Rockets fire while active.", color: "#ee4" },
];

const monkSkills: ClassDef["skills"] = [
  { id: "fists", name: "Thunder Fists", key: "1", slot: 0, kind: "melee", resource: 6, cooldown: 0.28, range: 2.2, radius: 1.8, duration: 0.2, dash: 0, damage: 1.15, unlock: 1, runeName: "Static", runeUnlock: 15, desc: "A lightning-laced combo.", runeDesc: "Chains to a nearby foe.", color: "#fd6" },
  { id: "sevenside", name: "Sevenfold Strike", key: "2", slot: 1, kind: "aoe", resource: 30, cooldown: 8, range: 8, radius: 3, duration: 0.9, dash: 0, damage: 2.8, unlock: 2, runeName: "Fulminating", runeUnlock: 15, desc: "Blink-strike many enemies.", runeDesc: "Explosions on each hit.", color: "#fa3" },
  { id: "sanctuary", name: "Inner Sanctuary", key: "3", slot: 2, kind: "aoe", resource: 20, cooldown: 12, range: 0, radius: 3.4, duration: 5, dash: 0, damage: 0, unlock: 4, runeName: "Forbidden", runeUnlock: 18, desc: "A circle of refuge.", runeDesc: "Foes inside take spirit burn.", color: "#fe8" },
  { id: "wave", name: "Wave of Light", key: "4", slot: 3, kind: "projectile", resource: 22, cooldown: 5, range: 12, radius: 1.2, duration: 0.7, dash: 0, damage: 2.1, unlock: 8, runeName: "Pillar", runeUnlock: 20, desc: "A traveling bell of force.", runeDesc: "Drops a damaging pillar.", color: "#ffd" },
  { id: "mantra", name: "Mantra of Warding", key: "q", slot: 4, kind: "buff", resource: 0, cooldown: 10, range: 0, radius: 6, duration: 8, dash: 0, damage: 0, unlock: 12, runeName: "Retaliation", runeUnlock: 22, desc: "Spirit armor and life.", runeDesc: "Attackers take a shock.", color: "#ed8" },
  { id: "dashing", name: "Dashing Strike", key: "e", slot: 5, kind: "dash", resource: 8, cooldown: 3.5, range: 8, radius: 1.6, duration: 0.16, dash: 8, damage: 1.1, unlock: 1, runeName: "Blinding", runeUnlock: 16, desc: "Dash through a foe with i-frames.", runeDesc: "End in a blinding flash.", color: "#fc6" },
  { id: "ally", name: "Mystic Ally", key: "r", slot: 6, kind: "summon", resource: 0, cooldown: 40, range: 0, radius: 5, duration: 8, dash: 0, damage: 1.4, unlock: 20, runeName: "Air Ally", runeUnlock: 30, desc: "Invulnerable. A spirit twin fights.", runeDesc: "Ally cyclones around you.", color: "#ffe" },
];

const necroSkills: ClassDef["skills"] = [
  { id: "bonespear", name: "Bone Spear", key: "1", slot: 0, kind: "projectile", resource: 12, cooldown: 0.4, range: 14, radius: 0.4, duration: 0.7, dash: 0, damage: 1.45, unlock: 1, runeName: "Shatter", runeUnlock: 15, desc: "A piercing spear of bone.", runeDesc: "Explodes after the last target.", color: "#cfc" },
  { id: "corpse", name: "Corpse Burst", key: "2", slot: 1, kind: "aoe", resource: 16, cooldown: 3, range: 8, radius: 2.6, duration: 0.3, dash: 0, damage: 2.2, unlock: 2, runeName: "Blight", runeUnlock: 15, desc: "Detonate a nearby corpse.", runeDesc: "Leaves a poison pool.", color: "#6a4" },
  { id: "armor", name: "Bone Armor", key: "3", slot: 2, kind: "buff", resource: 20, cooldown: 12, range: 0, radius: 2.2, duration: 6, dash: 0, damage: 0.4, unlock: 4, runeName: "Dislocation", runeUnlock: 18, desc: "Plates of bone absorb hits.", runeDesc: "Pulse a stun when struck.", color: "#edc" },
  { id: "army", name: "Army of the Dead", key: "4", slot: 3, kind: "summon", resource: 40, cooldown: 16, range: 0, radius: 6, duration: 6, dash: 0, damage: 0.55, unlock: 8, runeName: "Unstable", runeUnlock: 20, desc: "Skeletons claw up around you.", runeDesc: "Skeletons explode on death.", color: "#9b8" },
  { id: "bloodrush", name: "Blood Rush", key: "e", slot: 5, kind: "dash", resource: 10, cooldown: 5, range: 8, radius: 1.8, duration: 0.18, dash: 8, damage: 0.8, unlock: 1, runeName: "Hemorrhage", runeUnlock: 16, desc: "Dash in a smear of blood.", runeDesc: "Leave a damaging smear.", color: "#a22" },
  { id: "decrepify", name: "Decrepify", key: "q", slot: 4, kind: "aoe", resource: 14, cooldown: 9, range: 8, radius: 3.2, duration: 5, dash: 0, damage: 0.2, unlock: 12, runeName: "Enfeeble", runeUnlock: 22, desc: "Curse a pack: slow and frail.", runeDesc: "Cursed take extra crits.", color: "#738" },
  { id: "spirit", name: "Bone Spirit", key: "r", slot: 6, kind: "projectile", resource: 0, cooldown: 42, range: 16, radius: 3.5, duration: 1.1, dash: 0, damage: 6.5, unlock: 20, runeName: "Possession", runeUnlock: 30, desc: "Invulnerable. Unleash a seeking skull.", runeDesc: "Skull chains to extra victims.", color: "#efe" },
];

const crusaderSkills: ClassDef["skills"] = [
  { id: "punish", name: "Punish", key: "1", slot: 0, kind: "melee", resource: 8, cooldown: 0.32, range: 2.4, radius: 1.9, duration: 0.2, dash: 0, damage: 1.2, unlock: 1, runeName: "Censure", runeUnlock: 15, desc: "Shield bash that builds wrath.", runeDesc: "Next hit is a guaranteed crit.", color: "#ed8" },
  { id: "hammer", name: "Blessed Hammer", key: "2", slot: 1, kind: "projectile", resource: 14, cooldown: 0.45, range: 8, radius: 0.7, duration: 1.4, dash: 0, damage: 1.1, unlock: 2, runeName: "Limitless", runeUnlock: 15, desc: "A spinning hammer orbits out.", runeDesc: "Hammer spirals farther.", color: "#fe6" },
  { id: "consecrate", name: "Consecration", key: "3", slot: 2, kind: "aoe", resource: 20, cooldown: 10, range: 0, radius: 3.6, duration: 6, dash: 0, damage: 0.45, ticks: 8, unlock: 4, runeName: "Shattered", runeUnlock: 18, desc: "Hallow the ground in fire.", runeDesc: "Foes are slowed in the light.", color: "#fc5" },
  { id: "fall", name: "Falling Sword", key: "4", slot: 3, kind: "aoe", resource: 28, cooldown: 9, range: 9, radius: 2.8, duration: 0.6, dash: 0, damage: 2.7, unlock: 8, runeName: "Part the Clouds", runeUnlock: 20, desc: "Leap and bring heaven down.", runeDesc: "A beam lingers after.", color: "#ffb" },
  { id: "aegis", name: "Aegis of Light", key: "q", slot: 4, kind: "buff", resource: 0, cooldown: 14, range: 0, radius: 4, duration: 5, dash: 0, damage: 0, unlock: 12, runeName: "Reprisal", runeUnlock: 22, desc: "A shield of faith.", runeDesc: "Blockers explode outward.", color: "#fea" },
  { id: "charge", name: "Shield Charge", key: "e", slot: 5, kind: "dash", resource: 12, cooldown: 6, range: 9, radius: 1.7, duration: 0.24, dash: 8.5, damage: 1.5, unlock: 1, runeName: "Stampede", runeUnlock: 16, desc: "Charge with i-frames.", runeDesc: "Carry the first enemy along.", color: "#ec6" },
  { id: "heavens", name: "Heaven's Fury", key: "r", slot: 6, kind: "beam", resource: 0, cooldown: 48, range: 12, radius: 2.2, duration: 4, dash: 0, damage: 2.2, unlock: 20, runeName: "Fissure of the Most High", runeUnlock: 30, desc: "Invulnerable. A column of judgment.", runeDesc: "Two extra columns.", color: "#fff6c8" },
];

export const CLASSES: Record<ClassId, ClassDef> = {
  barbarian: {
    id: "barbarian",
    name: "Barbarian",
    title: "Last of the North Clans",
    resource: "",
    primary: "str",
    lore: "When the Choir tore the high passes, only the blood-oaths remained. He answers with an axe older than the veil.",
    portrait: "/game/portraits/barbarian.jpg",
    sprite: "/game/sprites/barbarian-idle.png",
    attackSprite: "/game/sprites/barbarian-attack.png",
    color: "#c44",
    base: { str: 12, dex: 6, int: 4, vit: 12, speed: 6.4 },
    skills: barbSkills,
  },
  wizard: {
    id: "wizard",
    name: "Wizard",
    title: "Exiled of the Ivory Spire",
    resource: "Arcane",
    primary: "int",
    lore: "She stole the Spire's last unwritten theorem and used it to stitch the sky back together — poorly.",
    portrait: "/game/portraits/wizard.jpg",
    sprite: "/game/sprites/wizard-idle.png",
    color: "#7cf",
    base: { str: 4, dex: 6, int: 14, vit: 8, speed: 6.2 },
    skills: wizSkills,
  },
  demonhunter: {
    id: "demonhunter",
    name: "Demon Hunter",
    title: "Oath of the Green Quiet",
    resource: "Hatred",
    primary: "dex",
    lore: "Trained in the ash woods to kill what should not walk. The Quiet does not forgive. Neither does she.",
    portrait: "/game/portraits/demonhunter.jpg",
    sprite: "/game/sprites/demonhunter-idle.png",
    color: "#8c4",
    base: { str: 6, dex: 14, int: 5, vit: 9, speed: 6.8 },
    skills: dhSkills,
  },
  monk: {
    id: "monk",
    name: "Monk",
    title: "Fist of the Last Monastery",
    resource: "Spirit",
    primary: "dex",
    lore: "The monastery burned. The forms did not. He carries a hundred lives in the geometry of a strike.",
    portrait: "/game/portraits/monk.jpg",
    sprite: "/game/sprites/monk-idle.png",
    color: "#fc6",
    base: { str: 8, dex: 12, int: 6, vit: 10, speed: 6.7 },
    skills: monkSkills,
  },
  necromancer: {
    id: "necromancer",
    name: "Necromancer",
    title: "Speaker for the Unburied",
    resource: "Essence",
    primary: "int",
    lore: "Death is a language. The Choir screams it. He answers in grammar they have forgotten.",
    portrait: "/game/portraits/necromancer.jpg",
    sprite: "/game/sprites/necromancer-idle.png",
    color: "#9c8",
    base: { str: 5, dex: 6, int: 13, vit: 10, speed: 6.1 },
    skills: necroSkills,
  },
  crusader: {
    id: "crusader",
    name: "Crusader",
    title: "Knight of the Ashen Sun",
    resource: "Wrath",
    primary: "str",
    lore: "The Sun went out over Elara's nave. He did not. Faith, here, is a weapon you can hear coming.",
    portrait: "/game/portraits/crusader.jpg",
    sprite: "/game/sprites/crusader-idle.png",
    color: "#ed8",
    base: { str: 13, dex: 5, int: 6, vit: 12, speed: 6.0 },
    skills: crusaderSkills,
  },
};

export const CLASS_LIST = Object.values(CLASSES);

export const ROSTER: {
  id: string;
  name: string;
  title: string;
  lore: string;
  portrait: string;
  locked: boolean;
  playable?: ClassId;
}[] = [
  {
    id: "barbarian",
    name: "Barbarian",
    title: "Last of the North Clans",
    lore: "When the Choir tore the high passes, only the blood-oaths remained. He answers with an axe older than the veil.",
    portrait: "/game/portraits/barbarian.jpg",
    locked: false,
    playable: "barbarian",
  },
  {
    id: "crusader",
    name: "Crusader",
    title: "Knight of the Ashen Sun",
    lore: "The Sun went out over Elara's nave. He did not. Faith, here, is a weapon you can hear coming.",
    portrait: "/game/portraits/crusader.jpg",
    locked: true,
  },
  {
    id: "demonhunter",
    name: "Demon Hunter",
    title: "Oath of the Green Quiet",
    lore: "Trained in the ash woods to kill what should not walk. The Quiet does not forgive. Neither does she.",
    portrait: "/game/portraits/demonhunter.jpg",
    locked: true,
  },
  {
    id: "monk",
    name: "Monk",
    title: "Fist of the Last Monastery",
    lore: "The monastery burned. The forms did not. He carries a hundred lives in the geometry of a strike.",
    portrait: "/game/portraits/monk.jpg",
    locked: true,
  },
  {
    id: "necromancer",
    name: "Necromancer",
    title: "Speaker for the Unburied",
    lore: "Death is a language. The Choir screams it. He answers in grammar they have forgotten.",
    portrait: "/game/portraits/necromancer.jpg",
    locked: true,
  },
  {
    id: "wizard",
    name: "Wizard",
    title: "Exiled of the Ivory Spire",
    lore: "She stole the Spire's last unwritten theorem and used it to stitch the sky back together — poorly.",
    portrait: "/game/portraits/wizard.jpg",
    locked: true,
  },
  {
    id: "bloodknight",
    name: "Blood Knight",
    title: "Oath of the Crimson Chalice",
    lore: "He drinks what the Choir spills. The thirst is a weapon. The weapon is a prayer.",
    portrait: "/game/portraits/bloodknight.jpg",
    locked: true,
  },
  {
    id: "tempest",
    name: "Tempest",
    title: "Storm of the Torn Coast",
    lore: "The sea learned to scream. She taught it how to aim.",
    portrait: "/game/portraits/tempest.jpg",
    locked: true,
  },
  {
    id: "druid",
    name: "Druid",
    title: "Last of the Rotwood Circle",
    lore: "The forest did not die. It changed its teeth.",
    portrait: "/game/portraits/druid.jpg",
    locked: true,
  },
];

export function roleOf(s: ClassDef["skills"][number]): "primary" | "skill" | "ultimate" {
  if (s.role) return s.role;
  if (s.slot < 0 || s.slot === 0) return "primary";
  if (s.slot >= 6) return "ultimate";
  return "skill";
}

export function defaultPrimary(classId: ClassId): string {
  const cls = CLASSES[classId];
  return cls.skills.find((s) => roleOf(s) === "primary")?.id ?? cls.skills[0]!.id;
}

export function defaultLoadout(classId: ClassId): string[] {
  const cls = CLASSES[classId];
  return cls.skills.filter((s) => roleOf(s) === "skill").slice(0, 4).map((s) => s.id);
}

export function defaultUlt(classId: ClassId): string {
  const cls = CLASSES[classId];
  return cls.skills.find((s) => roleOf(s) === "ultimate")?.id ?? cls.skills[cls.skills.length - 1]!.id;
}

export function iconFor(s: ClassDef["skills"][number]): string {
  return s.icon ?? `/game/icons/${s.id}.png`;
}


export const MONSTERS: Record<string, MonsterDef> = {
  skeleton: { id: "skeleton", name: "Riven Skeleton", sprite: "/game/sprites/skeleton-idle.png", hp: 48, dmg: 12, speed: 3.4, radius: 0.55, xp: 18, elite: false, scale: 1.7, frames: 4, rows: 2, cols: 2, loot: 0.35 },
  imp: { id: "imp", name: "Choir Imp", sprite: "/game/sprites/imp-idle.png", hp: 32, dmg: 14, speed: 4.6, radius: 0.45, xp: 14, elite: false, scale: 1.35, frames: 4, rows: 2, cols: 2, loot: 0.28 },
  cultist: { id: "cultist", name: "Veil Cultist", sprite: "/game/sprites/cultist-idle.png", hp: 62, dmg: 16, speed: 3.1, radius: 0.55, xp: 24, elite: false, scale: 1.75, frames: 4, rows: 2, cols: 2, loot: 0.4 },
  brute: { id: "brute", name: "Hell Brute", sprite: "/game/sprites/brute-idle.png", hp: 220, dmg: 28, speed: 2.6, radius: 0.85, xp: 80, elite: true, scale: 2.25, frames: 4, rows: 2, cols: 2, loot: 1 },
  wight: { id: "wight", name: "Frost Wight", sprite: "/game/sprites/imp-idle.png", hp: 70, dmg: 13, speed: 3.7, radius: 0.55, xp: 28, elite: false, scale: 1.5, frames: 4, rows: 2, cols: 2, loot: 0.38 },
  maltheon: { id: "maltheon", name: "Maltheon, Choir Vicar", sprite: "/game/sprites/boss-idle.png", hp: 2400, dmg: 28, speed: 2.4, radius: 1.2, xp: 900, elite: true, boss: true, scale: 3.2, frames: 9, rows: 3, cols: 3, loot: 3 },
  icewarden: { id: "icewarden", name: "The Pale Warden", sprite: "/game/sprites/boss-idle.png", hp: 3200, dmg: 32, speed: 2.5, radius: 1.2, xp: 1100, elite: true, boss: true, scale: 3.1, frames: 9, rows: 3, cols: 3, loot: 3 },
  flamechorus: { id: "flamechorus", name: "The Flame Chorus", sprite: "/game/sprites/boss-idle.png", hp: 4000, dmg: 36, speed: 2.6, radius: 1.25, xp: 1400, elite: true, boss: true, scale: 3.3, frames: 9, rows: 3, cols: 3, loot: 3 },
  nihl: { id: "nihl", name: "Nihl, the Unmade", sprite: "/game/sprites/boss-idle.png", hp: 6200, dmg: 44, speed: 2.7, radius: 1.35, xp: 2200, elite: true, boss: true, scale: 3.6, frames: 9, rows: 3, cols: 3, loot: 4 },
  guardian: { id: "guardian", name: "Rift Guardian", sprite: "/game/sprites/brute-idle.png", hp: 1800, dmg: 30, speed: 2.8, radius: 1.05, xp: 700, elite: true, boss: true, scale: 2.6, frames: 4, rows: 2, cols: 2, loot: 2.4 },
  worldboss: { id: "worldboss", name: "Azreth the First Betrayal", sprite: "/game/sprites/boss-idle.png", hp: 9000, dmg: 48, speed: 2.3, radius: 1.5, xp: 3000, elite: true, boss: true, scale: 3.8, frames: 9, rows: 3, cols: 3, loot: 5 },
  raid: { id: "raid", name: "Vorath, Hunger of Hatred", sprite: "/game/sprites/boss-idle.png", hp: 16000, dmg: 55, speed: 2.2, radius: 1.6, xp: 5000, elite: true, boss: true, scale: 4.1, frames: 9, rows: 3, cols: 3, loot: 6 },
};

export const BIOME_MONSTERS: Record<string, string[]> = {
  cathedral: ["skeleton", "cultist", "imp"],
  crypt: ["skeleton", "cultist", "brute"],
  wilds: ["imp", "cultist", "skeleton"],
  ice: ["wight", "skeleton", "brute"],
  hell: ["imp", "brute", "cultist"],
  flood: ["cultist", "wight", "skeleton"],
  rift: ["imp", "skeleton", "cultist", "brute"],
};

export const ACT_BOSSES = ["maltheon", "icewarden", "flamechorus", "nihl"] as const;

export const BASES: { id: string; name: string; slot: Slot; twoHand?: boolean }[] = [
  { id: "helm-hide", name: "Hide Casque", slot: "helm" },
  { id: "helm-iron", name: "Iron Casque", slot: "helm" },
  { id: "chest-hide", name: "Hide Jerkin", slot: "chest" },
  { id: "chest-mail", name: "Riven Mail", slot: "chest" },
  { id: "shoulders-hide", name: "Fur Pauldrons", slot: "shoulders" },
  { id: "shoulders-plate", name: "Plate Pauldrons", slot: "shoulders" },
  { id: "gloves-hide", name: "Wraps", slot: "gloves" },
  { id: "gloves-mail", name: "Mail Gauntlets", slot: "gloves" },
  { id: "pants-hide", name: "Hide Leggings", slot: "pants" },
  { id: "pants-plate", name: "Plate Greaves", slot: "pants" },
  { id: "boots-hide", name: "Trail Boots", slot: "boots" },
  { id: "boots-iron", name: "Iron Sabatons", slot: "boots" },
  { id: "belt-cord", name: "War Cord", slot: "belt" },
  { id: "belt-plate", name: "Plated Belt", slot: "belt" },
  { id: "amulet-bone", name: "Bone Talisman", slot: "amulet" },
  { id: "amulet-gold", name: "Ashen Amulet", slot: "amulet" },
  { id: "ring-iron", name: "Iron Band", slot: "ring" },
  { id: "ring-sigil", name: "Sigil Ring", slot: "ring" },
  { id: "main-axe", name: "Greataxe", slot: "main", twoHand: true },
  { id: "main-sword", name: "Longsword", slot: "main" },
  { id: "main-staff", name: "Rift Staff", slot: "main", twoHand: true },
  { id: "main-bow", name: "Repeating Crossbow", slot: "main", twoHand: true },
  { id: "main-fist", name: "Knuckle Wraps", slot: "main" },
  { id: "main-scythe", name: "Bone Scythe", slot: "main", twoHand: true },
  { id: "main-flail", name: "War Flail", slot: "main" },
  { id: "off-shield", name: "Heater Shield", slot: "off" },
  { id: "off-orb", name: "Focus Orb", slot: "off" },
  { id: "off-quiver", name: "Quiver", slot: "off" },
  { id: "off-tome", name: "Grimoire", slot: "off" },
];

export const PRIMARY_AFFIXES: { id: StatId; min: number; max: number; w: number }[] = [
  { id: "str", min: 18, max: 85, w: 1 },
  { id: "dex", min: 18, max: 85, w: 1 },
  { id: "int", min: 18, max: 85, w: 1 },
  { id: "vit", min: 18, max: 90, w: 1.1 },
  { id: "crit", min: 3, max: 12, w: 0.7 },
  { id: "critDmg", min: 15, max: 55, w: 0.7 },
  { id: "cdr", min: 4, max: 12, w: 0.55 },
  { id: "area", min: 8, max: 24, w: 0.5 },
  { id: "eliteDmg", min: 8, max: 22, w: 0.5 },
];

export const SECONDARY_AFFIXES: { id: StatId; min: number; max: number; w: number }[] = [
  { id: "armor", min: 40, max: 220, w: 1 },
  { id: "allRes", min: 20, max: 90, w: 0.9 },
  { id: "life", min: 120, max: 900, w: 1 },
  { id: "lifeOnHit", min: 80, max: 420, w: 0.6 },
  { id: "goldFind", min: 10, max: 40, w: 0.5 },
  { id: "pickup", min: 0.4, max: 2.2, w: 0.4 },
  { id: "dodge", min: 2, max: 8, w: 0.4 },
];

export const LEGENDARIES: LegendaryDef[] = [
  { id: "ancients-grip", name: "Grip of the Unbroken", slot: "gloves", power: "whirlwindTrail", desc: "Bloodspin leaves a burning trail." },
  { id: "earth-crown", name: "Crown of Broken Hills", slot: "helm", power: "leapQuake", desc: "Warleap slams twice." },
  { id: "fury-heart", name: "Heart of the Clan", slot: "chest", power: "furyOnHit", desc: "Hits generate extra Fury." },
  { id: "rift-lens", name: "Lens of the Spire", slot: "off", power: "beamFork", desc: "Disintegrate forks on kill." },
  { id: "comet-band", name: "Band of Falling Suns", slot: "ring", power: "cometEcho", desc: "Comet leaves a second delayed strike." },
  { id: "hunter-hood", name: "Hood of the Green Quiet", slot: "helm", power: "vaultCaltrops", desc: "Vault seeds caltrops." },
  { id: "venge-mail", name: "Mail of Unquiet Dead", slot: "chest", power: "multishotPlus", desc: "Fan of Bolts fires two extra." },
  { id: "spirit-sash", name: "Sash of One Hundred Forms", slot: "belt", power: "dashReset", desc: "Dashing Strike cooldown reset on kill." },
  { id: "bone-circlet", name: "Circlet of Unburied Kings", slot: "helm", power: "spearExplode", desc: "Bone Spear explodes at max range." },
  { id: "sun-aegis", name: "Aegis of the Ashen Sun", slot: "off", power: "consecrateHeal", desc: "Consecration also heals." },
  { id: "choir-eye", name: "Eye of the Black Choir", slot: "amulet", power: "eliteExecute", desc: "Elites below 15% life explode." },
  { id: "veil-step", name: "Treads of the Torn Veil", slot: "boots", power: "dashIframes", desc: "Dashes last 40% longer." },
];

export const SETS: SetDef[] = [
  {
    id: "thornwatch",
    name: "Thornwatch Plate",
    slots: ["helm", "chest", "shoulders", "gloves", "pants", "boots"],
    bonuses: { 2: "+15% armor and vitality", 4: "Warcry also increases damage 20%", 6: "Cataclysm cooldown reduced 30%" },
  },
  {
    id: "choir",
    name: "Shroud of the Choir",
    slots: ["helm", "chest", "shoulders", "gloves", "pants", "boots"],
    bonuses: { 2: "+15% intelligence and crit", 4: "Projectiles pierce once", 6: "Ultimates deal 40% more damage" },
  },
  {
    id: "ashen",
    name: "Ashen Hunt",
    slots: ["helm", "chest", "shoulders", "gloves", "pants", "boots"],
    bonuses: { 2: "+15% dexterity and dodge", 4: "Dash cooldown -1.5s", 6: "Every 4th attack is a guaranteed crit" },
  },
];

export const GEMS = [
  { id: "gem-blood", name: "Heart of Unmaking", effect: "Heal 2% of damage dealt." },
  { id: "gem-storm", name: "Bottled Thunder", effect: "Skills chain lightning on crit." },
  { id: "gem-veil", name: "Splintered Veil", effect: "After dash, gain 20% damage for 3s." },
  { id: "gem-grave", name: "Grave-Star", effect: "Kills have a chance to raise a skeleton." },
  { id: "gem-sun", name: "Ashen Sunshard", effect: "Every 8s, a holy nova." },
];

export const QUESTS: QuestDef[] = [
  {
    id: "a1q1",
    act: 1,
    name: "The Tear at Thornwatch",
    giver: "ryn",
    steps: [
      { id: "tear", text: "Enter the First Tear in the plaza.", kind: "enter", target: "rift" },
      { id: "meet", text: "Speak with Captain Ryn in Thornwatch.", kind: "talk", target: "ryn" },
      { id: "gate", text: "Enter the Cathedral of Saint Elara.", kind: "enter", target: "cathedral" },
      { id: "nave", text: "Purge the nave — slay Choir spawn (0/25).", kind: "kill", target: "any", count: 25 },
      { id: "turn", text: "Return to Captain Ryn.", kind: "talk", target: "ryn" },
    ],
    rewardGold: 180,
    rewardXp: 400,
    lore: "Last night the nave split. A red wound hangs where the altar was. Ryn wants it closed before the Choir learns our names.",
  },
  {
    id: "a1q2",
    act: 1,
    name: "Relics of Elara",
    giver: "maera",
    steps: [
      { id: "talk", text: "Sister Maera needs three Elaran relics.", kind: "talk", target: "maera" },
      { id: "get", text: "Collect relics from cathedral chests (0/3).", kind: "collect", target: "relic", count: 3 },
      { id: "turn", text: "Deliver the relics to Maera.", kind: "talk", target: "maera" },
    ],
    rewardGold: 220,
    rewardXp: 520,
    lore: "Elara bound the first veil-tear with three iron hymns. The hymns are metal now, and they remember.",
  },
  {
    id: "a1q3",
    act: 1,
    name: "Bells of the Fallen",
    giver: "ryn",
    steps: [
      { id: "elite", text: "Hunt cathedral elites (0/3).", kind: "kill", target: "elite", count: 3 },
      { id: "turn", text: "Report to Captain Ryn.", kind: "talk", target: "ryn" },
    ],
    rewardGold: 260,
    rewardXp: 640,
    lore: "The bell-towers walk. That is not a metaphor.",
  },
  {
    id: "a1q4",
    act: 1,
    name: "The Vicar",
    giver: "ryn",
    steps: [
      { id: "enter", text: "Descend to the inner sanctuary.", kind: "enter", target: "cathedral" },
      { id: "boss", text: "Slay Maltheon, Choir Vicar.", kind: "boss", target: "maltheon" },
      { id: "turn", text: "Return to Thornwatch.", kind: "talk", target: "ryn" },
    ],
    rewardGold: 800,
    rewardXp: 1800,
    lore: "Maltheon kept the nave for forty years. Then he opened the door from the other side.",
  },
  {
    id: "a1q5",
    act: 1,
    name: "Ash on the Wind",
    giver: "vesh",
    steps: [
      { id: "talk", text: "Quartermaster Vesh has a bounty.", kind: "talk", target: "vesh" },
      { id: "kill", text: "Slay Choir Imps (0/20).", kind: "kill", target: "imp", count: 20 },
      { id: "turn", text: "Collect the bounty from Vesh.", kind: "talk", target: "vesh" },
    ],
    rewardGold: 200,
    rewardXp: 360,
    lore: "Imps nest in the granary eaves. The grain is screaming. Vesh would like that to stop.",
  },
  {
    id: "a1q6",
    act: 1,
    name: "The First Greater Tear",
    giver: "io",
    steps: [
      { id: "talk", text: "Speak with Warden Io at the rift stone.", kind: "talk", target: "io" },
      { id: "rift", text: "Close a Challenge Rift.", kind: "enter", target: "rift" },
      { id: "turn", text: "Return to Io.", kind: "talk", target: "io" },
    ],
    rewardGold: 400,
    rewardXp: 900,
    lore: "Io claims the tears can be ridden like weather. She has not yet been proven wrong.",
  },
  {
    id: "a2q1",
    act: 2,
    name: "The White Silence",
    giver: "ryn",
    steps: [
      { id: "talk", text: "Captain Ryn has word from the north.", kind: "talk", target: "ryn" },
      { id: "enter", text: "Enter the Frosthold Caverns.", kind: "enter", target: "ice" },
      { id: "kill", text: "Slay frost spawn (0/30).", kind: "kill", target: "any", count: 30 },
      { id: "boss", text: "Defeat the Pale Warden.", kind: "boss", target: "icewarden" },
    ],
    rewardGold: 900,
    rewardXp: 2200,
    lore: "The passes froze in a single night. Scouts came back without mouths.",
  },
  {
    id: "a3q1",
    act: 3,
    name: "Cinderwake",
    giver: "kael",
    steps: [
      { id: "talk", text: "Forge-Father Kael smells a city burning.", kind: "talk", target: "kael" },
      { id: "enter", text: "Enter the Burning Quarter.", kind: "enter", target: "hell" },
      { id: "kill", text: "Slay hellspawn (0/35).", kind: "kill", target: "any", count: 35 },
      { id: "boss", text: "Silence the Flame Chorus.", kind: "boss", target: "flamechorus" },
    ],
    rewardGold: 1200,
    rewardXp: 2800,
    lore: "Iskara's hymn is fire. The Quarter sings it whether it wants to or not.",
  },
  {
    id: "a4q1",
    act: 4,
    name: "The Unmade Gate",
    giver: "maera",
    steps: [
      { id: "talk", text: "Maera has seen the last door in her sleep.", kind: "talk", target: "maera" },
      { id: "enter", text: "Step through the Prime Rift.", kind: "enter", target: "hell" },
      { id: "kill", text: "Cut a path (0/40).", kind: "kill", target: "any", count: 40 },
      { id: "boss", text: "Unmake Nihl.", kind: "boss", target: "nihl" },
    ],
    rewardGold: 2000,
    rewardXp: 4000,
    lore: "Nihl is not a demon. Nihl is the place a name used to be.",
  },
];

export const NPCS = [
  { id: "ryn", name: "Captain Ryn", role: "Commander", line: "The veil does not care that we are tired." },
  { id: "kael", name: "Forge-Father Kael", role: "Blacksmith", line: "Steel remembers. Bring me the Choir's mistakes." },
  { id: "maera", name: "Sister Maera", role: "Mystic", line: "Powers can be moved. That is the heresy that saves us." },
  { id: "vesh", name: "Quartermaster Vesh", role: "Vendor", line: "I buy blood. I sell better blood." },
  { id: "io", name: "Warden Io", role: "Rift Warden", line: "Count the heartbeats. The tear counts them too." },
  { id: "brann", name: "Keeper Brann", role: "Stash", line: "Nothing left here is innocent. Including the chests." },
];

export const INTRO = [
  "Aeloria did not fall in a day. It leaked.",
  "First the bells of Saint Elara rang without ringers. Then the nave opened like a mouth.",
  "Thornwatch is the last lantern on the Shattered Marches. The Black Choir wants it dark.",
  "You are what the veil spat back. Go and make it regret that.",
];

export const CODEX = [
  { id: "choir", title: "The Black Choir", body: "Not a host. A chord. Each Hunger sings a different ruin: Vorath hatred, Iskara fire, Nihl absence." },
  { id: "elara", title: "Saint Elara", body: "She bound the first tear with three iron hymns and a life. The hymns rusted. The life did not stay dead." },
  { id: "veil", title: "The Veil", body: "A skin between Aeloria and the Unmade. It was never meant to be a door. Someone taught it how." },
];

export function xpToNext(level: number): number {
  if (level >= MAX_LEVEL) return 1200 + Math.floor(level * 80);
  return Math.floor(80 * Math.pow(1.14, level - 1) + 40);
}

export function monsterLevelScale(level: number): number {
  return 1 + (level - 1) * 0.18;
}

export const CHAMPION_AFFIXES = [
  "extraLife",
  "fast",
  "molten",
  "jailer",
  "vortex",
  "electrified",
  "frozen",
  "teleporter",
] as const;

export const SHRINES = [
  { id: "speed", name: "Shrine of Haste", dur: 30 },
  { id: "damage", name: "Shrine of Wrath", dur: 30 },
  { id: "loot", name: "Shrine of Fortune", dur: 20 },
  { id: "res", name: "Resurrection Shrine", dur: 0 },
] as const;
