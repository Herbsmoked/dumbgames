import { i as __toESM } from "../_runtime.mjs";
import { I as require_jsx_runtime, L as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Hand, i as Map, n as Swords, o as Backpack, r as Menu } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BbfSKTYF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var GAME_TITLE = "VEILBREAK";
var TOWN_NAME = "Thornwatch";
var SEASON_NAME = "Season 1 — The First Tear";
var DIFFICULTY = {
	normal: {
		name: "Adventurer",
		hp: 1,
		dmg: 1,
		magic: 1,
		gold: 1,
		unlock: 1
	},
	hell1: {
		name: "Hell I",
		hp: 2.2,
		dmg: 1.6,
		magic: 1.2,
		gold: 1.3,
		unlock: 20
	},
	hell2: {
		name: "Hell II",
		hp: 4,
		dmg: 2.4,
		magic: 1.4,
		gold: 1.6,
		unlock: 30
	},
	hell3: {
		name: "Hell III",
		hp: 7,
		dmg: 3.4,
		magic: 1.6,
		gold: 2,
		unlock: 40
	},
	hell4: {
		name: "Hell IV",
		hp: 12,
		dmg: 4.8,
		magic: 1.9,
		gold: 2.5,
		unlock: 50
	},
	inferno: {
		name: "Inferno",
		hp: 22,
		dmg: 7,
		magic: 2.3,
		gold: 3.2,
		unlock: 60
	}
};
var SLOTS = [
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
	"off"
];
var SLOT_LABEL = {
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
	off: "Off Hand"
};
var CLASSES = {
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
		base: {
			str: 12,
			dex: 6,
			int: 4,
			vit: 12,
			speed: 6.4
		},
		skills: [
			{
				id: "cleave",
				name: "Cleave",
				key: "LMB",
				slot: -1,
				kind: "melee",
				role: "primary",
				resource: 0,
				cooldown: .42,
				range: 2.8,
				radius: 2.4,
				duration: 0,
				dash: 0,
				damage: 1.2,
				unlock: 1,
				runeName: "Blood Bath",
				runeUnlock: 15,
				desc: "Cone smash that leaves a light bleed.",
				runeDesc: "Bleed lasts longer and ticks harder.",
				color: "#c44",
				icon: "/game/icons/cleave.png"
			},
			{
				id: "lacerate",
				name: "Lacerate",
				key: "LMB",
				slot: -1,
				kind: "melee",
				role: "primary",
				resource: 0,
				cooldown: .38,
				range: 2.5,
				radius: 1.35,
				duration: 0,
				dash: 0,
				damage: 1.5,
				unlock: 1,
				runeName: "Blood Drinker",
				runeUnlock: 15,
				desc: "A single-target bite that heals a sliver of life.",
				runeDesc: "Heal is doubled.",
				color: "#a22",
				icon: "/game/icons/lacerate.png"
			},
			{
				id: "hota",
				name: "Hammer of the Ancients",
				key: "1",
				slot: 0,
				kind: "aoe",
				role: "skill",
				resource: 0,
				cooldown: 6,
				range: 6.5,
				radius: 3.1,
				duration: .4,
				dash: 0,
				damage: 2.9,
				unlock: 1,
				runeName: "Rolling Thunder",
				runeUnlock: 15,
				desc: "Ancestral hammer slams the ground.",
				runeDesc: "Shockwave pulses a second time.",
				color: "#c80",
				icon: "/game/icons/hota.png"
			},
			{
				id: "whirlwind",
				name: "Whirlwind",
				key: "2",
				slot: 1,
				kind: "channel",
				role: "skill",
				resource: 0,
				cooldown: 8,
				range: 0,
				radius: 2.55,
				duration: 4.2,
				dash: 0,
				damage: .72,
				ticks: 1,
				unlock: 1,
				runeName: "Hurricane",
				runeUnlock: 18,
				desc: "Spin, striking all nearby. Other skills lock until you stop.",
				runeDesc: "Move faster while spinning.",
				color: "#e33",
				icon: "/game/icons/whirlwind.png"
			},
			{
				id: "charge",
				name: "Furious Charge",
				key: "3",
				slot: 2,
				kind: "dash",
				role: "skill",
				resource: 0,
				cooldown: 5.5,
				range: 9,
				radius: 1.7,
				duration: .22,
				dash: 8.2,
				damage: 1.75,
				unlock: 1,
				runeName: "Stampede",
				runeUnlock: 16,
				desc: "Shoulder-charge a line. Three charges.",
				runeDesc: "Carry the first foe along.",
				color: "#fb5",
				icon: "/game/icons/charge.png",
				charges: 3,
				chargeCd: 5.5
			},
			{
				id: "leap",
				name: "Leap",
				key: "4",
				slot: 3,
				kind: "dash",
				role: "skill",
				resource: 0,
				cooldown: 7,
				range: 9,
				radius: 2.7,
				duration: .28,
				dash: 8,
				damage: 1.85,
				unlock: 1,
				runeName: "Aftershock",
				runeUnlock: 16,
				desc: "Leap with i-frames and crash down.",
				runeDesc: "Landing quake pulses a second time.",
				color: "#fb5",
				icon: "/game/icons/leap.png"
			},
			{
				id: "sprint",
				name: "Sprint",
				key: "1",
				slot: 4,
				kind: "buff",
				role: "skill",
				resource: 0,
				cooldown: 10,
				range: 0,
				radius: 0,
				duration: 3.2,
				dash: 0,
				damage: 0,
				unlock: 4,
				runeName: "Gangway",
				runeUnlock: 18,
				desc: "Brief move-speed. Pass through enemies.",
				runeDesc: "Also knocks foes aside.",
				color: "#da4",
				icon: "/game/icons/sprint.png"
			},
			{
				id: "stomp",
				name: "Ground Stomp",
				key: "2",
				slot: 5,
				kind: "nova",
				role: "skill",
				resource: 0,
				cooldown: 8,
				range: 0,
				radius: 3.4,
				duration: .4,
				dash: 0,
				damage: 1.5,
				unlock: 8,
				runeName: "Deafening",
				runeUnlock: 20,
				desc: "Stomp that stuns a pack.",
				runeDesc: "Stun lasts longer.",
				color: "#c80",
				icon: "/game/icons/stomp.png"
			},
			{
				id: "demoralize",
				name: "Demoralize",
				key: "3",
				slot: 6,
				kind: "aoe",
				role: "skill",
				resource: 0,
				cooldown: 12,
				range: 0,
				radius: 5.5,
				duration: 4,
				dash: 0,
				damage: .25,
				unlock: 12,
				runeName: "Dread Cry",
				runeUnlock: 22,
				desc: "A shout that slows and weakens nearby demons.",
				runeDesc: "Foes cower longer.",
				color: "#da4",
				icon: "/game/icons/demoralize.png"
			},
			{
				id: "wrath",
				name: "Wrath of the Berserker",
				key: "4",
				slot: 7,
				kind: "buff",
				role: "skill",
				resource: 0,
				cooldown: 22,
				range: 0,
				radius: 0,
				duration: 6,
				dash: 0,
				damage: 0,
				unlock: 16,
				runeName: "Insanity",
				runeUnlock: 28,
				desc: "A rage burst. Not the Ultimate — a skill.",
				runeDesc: "Duration increased.",
				color: "#f62",
				icon: "/game/icons/wrath.png"
			},
			{
				id: "ancestral",
				name: "Call of the Ancients",
				key: "Q",
				slot: 99,
				kind: "buff",
				role: "ultimate",
				resource: 0,
				cooldown: 0,
				range: 0,
				radius: 0,
				duration: 12,
				dash: 0,
				damage: 0,
				unlock: 1,
				runeName: "Gold Fire",
				runeUnlock: 30,
				desc: "Supercharges your Primary for 12 seconds. Gold fire on every swing.",
				runeDesc: "Duration increased.",
				color: "#f62",
				icon: "/game/icons/ultimate.png"
			}
		]
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
		base: {
			str: 4,
			dex: 6,
			int: 14,
			vit: 8,
			speed: 6.2
		},
		skills: [
			{
				id: "shards",
				name: "Arc Shards",
				key: "1",
				slot: 0,
				kind: "projectile",
				resource: 8,
				cooldown: .28,
				range: 13,
				radius: .45,
				duration: .7,
				dash: 0,
				damage: 1.05,
				unlock: 1,
				runeName: "Splinters",
				runeUnlock: 15,
				desc: "Hurl a burst of arcane glass.",
				runeDesc: "Shards pierce and fork.",
				color: "#6cf"
			},
			{
				id: "beam",
				name: "Disintegrate",
				key: "2",
				slot: 1,
				kind: "beam",
				resource: 14,
				cooldown: .1,
				range: 12,
				radius: .55,
				duration: .12,
				dash: 0,
				damage: .7,
				unlock: 2,
				runeName: "Entropy",
				runeUnlock: 15,
				desc: "A continuous beam of unmaking.",
				runeDesc: "Beam explodes at the far end.",
				color: "#b6f"
			},
			{
				id: "frostbloom",
				name: "Frostbloom",
				key: "3",
				slot: 2,
				kind: "nova",
				resource: 28,
				cooldown: 8,
				range: 0,
				radius: 4.2,
				duration: 2.2,
				dash: 0,
				damage: 1.6,
				unlock: 4,
				runeName: "Deep Freeze",
				runeUnlock: 18,
				desc: "Nova of rime that freezes.",
				runeDesc: "Frozen targets shatter for bonus damage.",
				color: "#9df"
			},
			{
				id: "comet",
				name: "Comet",
				key: "4",
				slot: 3,
				kind: "aoe",
				resource: 35,
				cooldown: 10,
				range: 11,
				radius: 3.2,
				duration: .7,
				dash: 0,
				damage: 3.2,
				unlock: 8,
				runeName: "Meteor Shower",
				runeUnlock: 20,
				desc: "Call a molten comet.",
				runeDesc: "Three smaller comets rain after.",
				color: "#f63"
			},
			{
				id: "ward",
				name: "Prism Ward",
				key: "q",
				slot: 4,
				kind: "buff",
				resource: 0,
				cooldown: 14,
				range: 0,
				radius: 0,
				duration: 5,
				dash: 0,
				damage: 0,
				unlock: 12,
				runeName: "Mirror",
				runeUnlock: 22,
				desc: "Absorb the next hits.",
				runeDesc: "Reflect a portion as arcane.",
				color: "#cef"
			},
			{
				id: "blink",
				name: "Blink",
				key: "e",
				slot: 5,
				kind: "dash",
				resource: 10,
				cooldown: 5,
				range: 8,
				radius: 1.8,
				duration: .16,
				dash: 8,
				damage: .6,
				unlock: 1,
				runeName: "Afterimage",
				runeUnlock: 16,
				desc: "Teleport with i-frames.",
				runeDesc: "Leave a damaging echo.",
				color: "#adf"
			},
			{
				id: "archon",
				name: "Ascendant Form",
				key: "r",
				slot: 6,
				kind: "buff",
				resource: 0,
				cooldown: 50,
				range: 0,
				radius: 5,
				duration: 6,
				dash: 0,
				damage: 1.2,
				unlock: 20,
				runeName: "Starfall",
				runeUnlock: 30,
				desc: "Invulnerable. Become a living rift.",
				runeDesc: "Comets fall around you.",
				color: "#e8f"
			}
		]
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
		base: {
			str: 6,
			dex: 14,
			int: 5,
			vit: 9,
			speed: 6.8
		},
		skills: [
			{
				id: "multishot",
				name: "Fan of Bolts",
				key: "1",
				slot: 0,
				kind: "projectile",
				resource: 10,
				cooldown: .32,
				range: 14,
				radius: .4,
				duration: .65,
				dash: 0,
				damage: .85,
				unlock: 1,
				runeName: "Widened",
				runeUnlock: 15,
				desc: "Loose a fan of bolts.",
				runeDesc: "Two extra bolts.",
				color: "#8c4"
			},
			{
				id: "impale",
				name: "Impale",
				key: "2",
				slot: 1,
				kind: "projectile",
				resource: 16,
				cooldown: 2.4,
				range: 16,
				radius: .35,
				duration: .55,
				dash: 0,
				damage: 2.6,
				unlock: 2,
				runeName: "Bleedwire",
				runeUnlock: 15,
				desc: "A heavy bolt that punches through.",
				runeDesc: "Leaves a bleeding trail.",
				color: "#c54"
			},
			{
				id: "caltrops",
				name: "Caltrops",
				key: "3",
				slot: 2,
				kind: "aoe",
				resource: 12,
				cooldown: 8,
				range: 6,
				radius: 2.4,
				duration: 5,
				dash: 0,
				damage: .4,
				unlock: 4,
				runeName: "Hooked",
				runeUnlock: 18,
				desc: "Seed the ground with snares.",
				runeDesc: "Enemies are pulled inward.",
				color: "#875"
			},
			{
				id: "rain",
				name: "Rain of Vengeance",
				key: "4",
				slot: 3,
				kind: "aoe",
				resource: 30,
				cooldown: 12,
				range: 10,
				radius: 3.6,
				duration: 2.4,
				dash: 0,
				damage: .7,
				ticks: 6,
				unlock: 8,
				runeName: "Dark Cloud",
				runeUnlock: 20,
				desc: "A storm of arrows from above.",
				runeDesc: "Larger radius, extra tick.",
				color: "#6a3"
			},
			{
				id: "smoke",
				name: "Smoke Veil",
				key: "q",
				slot: 4,
				kind: "buff",
				resource: 0,
				cooldown: 14,
				range: 0,
				radius: 3,
				duration: 3,
				dash: 0,
				damage: 0,
				unlock: 12,
				runeName: "Toxic",
				runeUnlock: 22,
				desc: "Vanish; next shot crits.",
				runeDesc: "Cloud poisons foes.",
				color: "#9a8"
			},
			{
				id: "vault",
				name: "Vault",
				key: "e",
				slot: 5,
				kind: "dash",
				resource: 0,
				cooldown: 5,
				range: 8,
				radius: 1.4,
				duration: .2,
				dash: 7.5,
				damage: .4,
				unlock: 1,
				runeName: "Tumble",
				runeUnlock: 16,
				desc: "Dash with i-frames.",
				runeDesc: "Drop caltrops at the start.",
				color: "#ad5"
			},
			{
				id: "vengeance",
				name: "Vengeance",
				key: "r",
				slot: 6,
				kind: "buff",
				resource: 0,
				cooldown: 45,
				range: 0,
				radius: 0,
				duration: 6,
				dash: 0,
				damage: .5,
				unlock: 20,
				runeName: "Side Guns",
				runeUnlock: 30,
				desc: "Invulnerable burst. Twin cannons.",
				runeDesc: "Rockets fire while active.",
				color: "#ee4"
			}
		]
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
		base: {
			str: 8,
			dex: 12,
			int: 6,
			vit: 10,
			speed: 6.7
		},
		skills: [
			{
				id: "fists",
				name: "Thunder Fists",
				key: "1",
				slot: 0,
				kind: "melee",
				resource: 6,
				cooldown: .28,
				range: 2.2,
				radius: 1.8,
				duration: .2,
				dash: 0,
				damage: 1.15,
				unlock: 1,
				runeName: "Static",
				runeUnlock: 15,
				desc: "A lightning-laced combo.",
				runeDesc: "Chains to a nearby foe.",
				color: "#fd6"
			},
			{
				id: "sevenside",
				name: "Sevenfold Strike",
				key: "2",
				slot: 1,
				kind: "aoe",
				resource: 30,
				cooldown: 8,
				range: 8,
				radius: 3,
				duration: .9,
				dash: 0,
				damage: 2.8,
				unlock: 2,
				runeName: "Fulminating",
				runeUnlock: 15,
				desc: "Blink-strike many enemies.",
				runeDesc: "Explosions on each hit.",
				color: "#fa3"
			},
			{
				id: "sanctuary",
				name: "Inner Sanctuary",
				key: "3",
				slot: 2,
				kind: "aoe",
				resource: 20,
				cooldown: 12,
				range: 0,
				radius: 3.4,
				duration: 5,
				dash: 0,
				damage: 0,
				unlock: 4,
				runeName: "Forbidden",
				runeUnlock: 18,
				desc: "A circle of refuge.",
				runeDesc: "Foes inside take spirit burn.",
				color: "#fe8"
			},
			{
				id: "wave",
				name: "Wave of Light",
				key: "4",
				slot: 3,
				kind: "projectile",
				resource: 22,
				cooldown: 5,
				range: 12,
				radius: 1.2,
				duration: .7,
				dash: 0,
				damage: 2.1,
				unlock: 8,
				runeName: "Pillar",
				runeUnlock: 20,
				desc: "A traveling bell of force.",
				runeDesc: "Drops a damaging pillar.",
				color: "#ffd"
			},
			{
				id: "mantra",
				name: "Mantra of Warding",
				key: "q",
				slot: 4,
				kind: "buff",
				resource: 0,
				cooldown: 10,
				range: 0,
				radius: 6,
				duration: 8,
				dash: 0,
				damage: 0,
				unlock: 12,
				runeName: "Retaliation",
				runeUnlock: 22,
				desc: "Spirit armor and life.",
				runeDesc: "Attackers take a shock.",
				color: "#ed8"
			},
			{
				id: "dashing",
				name: "Dashing Strike",
				key: "e",
				slot: 5,
				kind: "dash",
				resource: 8,
				cooldown: 3.5,
				range: 8,
				radius: 1.6,
				duration: .16,
				dash: 8,
				damage: 1.1,
				unlock: 1,
				runeName: "Blinding",
				runeUnlock: 16,
				desc: "Dash through a foe with i-frames.",
				runeDesc: "End in a blinding flash.",
				color: "#fc6"
			},
			{
				id: "ally",
				name: "Mystic Ally",
				key: "r",
				slot: 6,
				kind: "summon",
				resource: 0,
				cooldown: 40,
				range: 0,
				radius: 5,
				duration: 8,
				dash: 0,
				damage: 1.4,
				unlock: 20,
				runeName: "Air Ally",
				runeUnlock: 30,
				desc: "Invulnerable. A spirit twin fights.",
				runeDesc: "Ally cyclones around you.",
				color: "#ffe"
			}
		]
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
		base: {
			str: 5,
			dex: 6,
			int: 13,
			vit: 10,
			speed: 6.1
		},
		skills: [
			{
				id: "bonespear",
				name: "Bone Spear",
				key: "1",
				slot: 0,
				kind: "projectile",
				resource: 12,
				cooldown: .4,
				range: 14,
				radius: .4,
				duration: .7,
				dash: 0,
				damage: 1.45,
				unlock: 1,
				runeName: "Shatter",
				runeUnlock: 15,
				desc: "A piercing spear of bone.",
				runeDesc: "Explodes after the last target.",
				color: "#cfc"
			},
			{
				id: "corpse",
				name: "Corpse Burst",
				key: "2",
				slot: 1,
				kind: "aoe",
				resource: 16,
				cooldown: 3,
				range: 8,
				radius: 2.6,
				duration: .3,
				dash: 0,
				damage: 2.2,
				unlock: 2,
				runeName: "Blight",
				runeUnlock: 15,
				desc: "Detonate a nearby corpse.",
				runeDesc: "Leaves a poison pool.",
				color: "#6a4"
			},
			{
				id: "armor",
				name: "Bone Armor",
				key: "3",
				slot: 2,
				kind: "buff",
				resource: 20,
				cooldown: 12,
				range: 0,
				radius: 2.2,
				duration: 6,
				dash: 0,
				damage: .4,
				unlock: 4,
				runeName: "Dislocation",
				runeUnlock: 18,
				desc: "Plates of bone absorb hits.",
				runeDesc: "Pulse a stun when struck.",
				color: "#edc"
			},
			{
				id: "army",
				name: "Army of the Dead",
				key: "4",
				slot: 3,
				kind: "summon",
				resource: 40,
				cooldown: 16,
				range: 0,
				radius: 6,
				duration: 6,
				dash: 0,
				damage: .55,
				unlock: 8,
				runeName: "Unstable",
				runeUnlock: 20,
				desc: "Skeletons claw up around you.",
				runeDesc: "Skeletons explode on death.",
				color: "#9b8"
			},
			{
				id: "bloodrush",
				name: "Blood Rush",
				key: "e",
				slot: 5,
				kind: "dash",
				resource: 10,
				cooldown: 5,
				range: 8,
				radius: 1.8,
				duration: .18,
				dash: 8,
				damage: .8,
				unlock: 1,
				runeName: "Hemorrhage",
				runeUnlock: 16,
				desc: "Dash in a smear of blood.",
				runeDesc: "Leave a damaging smear.",
				color: "#a22"
			},
			{
				id: "decrepify",
				name: "Decrepify",
				key: "q",
				slot: 4,
				kind: "aoe",
				resource: 14,
				cooldown: 9,
				range: 8,
				radius: 3.2,
				duration: 5,
				dash: 0,
				damage: .2,
				unlock: 12,
				runeName: "Enfeeble",
				runeUnlock: 22,
				desc: "Curse a pack: slow and frail.",
				runeDesc: "Cursed take extra crits.",
				color: "#738"
			},
			{
				id: "spirit",
				name: "Bone Spirit",
				key: "r",
				slot: 6,
				kind: "projectile",
				resource: 0,
				cooldown: 42,
				range: 16,
				radius: 3.5,
				duration: 1.1,
				dash: 0,
				damage: 6.5,
				unlock: 20,
				runeName: "Possession",
				runeUnlock: 30,
				desc: "Invulnerable. Unleash a seeking skull.",
				runeDesc: "Skull chains to extra victims.",
				color: "#efe"
			}
		]
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
		base: {
			str: 13,
			dex: 5,
			int: 6,
			vit: 12,
			speed: 6
		},
		skills: [
			{
				id: "punish",
				name: "Punish",
				key: "1",
				slot: 0,
				kind: "melee",
				resource: 8,
				cooldown: .32,
				range: 2.4,
				radius: 1.9,
				duration: .2,
				dash: 0,
				damage: 1.2,
				unlock: 1,
				runeName: "Censure",
				runeUnlock: 15,
				desc: "Shield bash that builds wrath.",
				runeDesc: "Next hit is a guaranteed crit.",
				color: "#ed8"
			},
			{
				id: "hammer",
				name: "Blessed Hammer",
				key: "2",
				slot: 1,
				kind: "projectile",
				resource: 14,
				cooldown: .45,
				range: 8,
				radius: .7,
				duration: 1.4,
				dash: 0,
				damage: 1.1,
				unlock: 2,
				runeName: "Limitless",
				runeUnlock: 15,
				desc: "A spinning hammer orbits out.",
				runeDesc: "Hammer spirals farther.",
				color: "#fe6"
			},
			{
				id: "consecrate",
				name: "Consecration",
				key: "3",
				slot: 2,
				kind: "aoe",
				resource: 20,
				cooldown: 10,
				range: 0,
				radius: 3.6,
				duration: 6,
				dash: 0,
				damage: .45,
				ticks: 8,
				unlock: 4,
				runeName: "Shattered",
				runeUnlock: 18,
				desc: "Hallow the ground in fire.",
				runeDesc: "Foes are slowed in the light.",
				color: "#fc5"
			},
			{
				id: "fall",
				name: "Falling Sword",
				key: "4",
				slot: 3,
				kind: "aoe",
				resource: 28,
				cooldown: 9,
				range: 9,
				radius: 2.8,
				duration: .6,
				dash: 0,
				damage: 2.7,
				unlock: 8,
				runeName: "Part the Clouds",
				runeUnlock: 20,
				desc: "Leap and bring heaven down.",
				runeDesc: "A beam lingers after.",
				color: "#ffb"
			},
			{
				id: "aegis",
				name: "Aegis of Light",
				key: "q",
				slot: 4,
				kind: "buff",
				resource: 0,
				cooldown: 14,
				range: 0,
				radius: 4,
				duration: 5,
				dash: 0,
				damage: 0,
				unlock: 12,
				runeName: "Reprisal",
				runeUnlock: 22,
				desc: "A shield of faith.",
				runeDesc: "Blockers explode outward.",
				color: "#fea"
			},
			{
				id: "charge",
				name: "Shield Charge",
				key: "e",
				slot: 5,
				kind: "dash",
				resource: 12,
				cooldown: 6,
				range: 9,
				radius: 1.7,
				duration: .24,
				dash: 8.5,
				damage: 1.5,
				unlock: 1,
				runeName: "Stampede",
				runeUnlock: 16,
				desc: "Charge with i-frames.",
				runeDesc: "Carry the first enemy along.",
				color: "#ec6"
			},
			{
				id: "heavens",
				name: "Heaven's Fury",
				key: "r",
				slot: 6,
				kind: "beam",
				resource: 0,
				cooldown: 48,
				range: 12,
				radius: 2.2,
				duration: 4,
				dash: 0,
				damage: 2.2,
				unlock: 20,
				runeName: "Fissure of the Most High",
				runeUnlock: 30,
				desc: "Invulnerable. A column of judgment.",
				runeDesc: "Two extra columns.",
				color: "#fff6c8"
			}
		]
	}
};
Object.values(CLASSES);
var ROSTER = [
	{
		id: "barbarian",
		name: "Barbarian",
		title: "Last of the North Clans",
		lore: "When the Choir tore the high passes, only the blood-oaths remained. He answers with an axe older than the veil.",
		portrait: "/game/portraits/barbarian.jpg",
		locked: false,
		playable: "barbarian"
	},
	{
		id: "crusader",
		name: "Crusader",
		title: "Knight of the Ashen Sun",
		lore: "The Sun went out over Elara's nave. He did not. Faith, here, is a weapon you can hear coming.",
		portrait: "/game/portraits/crusader.jpg",
		locked: true
	},
	{
		id: "demonhunter",
		name: "Demon Hunter",
		title: "Oath of the Green Quiet",
		lore: "Trained in the ash woods to kill what should not walk. The Quiet does not forgive. Neither does she.",
		portrait: "/game/portraits/demonhunter.jpg",
		locked: true
	},
	{
		id: "monk",
		name: "Monk",
		title: "Fist of the Last Monastery",
		lore: "The monastery burned. The forms did not. He carries a hundred lives in the geometry of a strike.",
		portrait: "/game/portraits/monk.jpg",
		locked: true
	},
	{
		id: "necromancer",
		name: "Necromancer",
		title: "Speaker for the Unburied",
		lore: "Death is a language. The Choir screams it. He answers in grammar they have forgotten.",
		portrait: "/game/portraits/necromancer.jpg",
		locked: true
	},
	{
		id: "wizard",
		name: "Wizard",
		title: "Exiled of the Ivory Spire",
		lore: "She stole the Spire's last unwritten theorem and used it to stitch the sky back together — poorly.",
		portrait: "/game/portraits/wizard.jpg",
		locked: true
	},
	{
		id: "bloodknight",
		name: "Blood Knight",
		title: "Oath of the Crimson Chalice",
		lore: "He drinks what the Choir spills. The thirst is a weapon. The weapon is a prayer.",
		portrait: "/game/portraits/bloodknight.jpg",
		locked: true
	},
	{
		id: "tempest",
		name: "Tempest",
		title: "Storm of the Torn Coast",
		lore: "The sea learned to scream. She taught it how to aim.",
		portrait: "/game/portraits/tempest.jpg",
		locked: true
	},
	{
		id: "druid",
		name: "Druid",
		title: "Last of the Rotwood Circle",
		lore: "The forest did not die. It changed its teeth.",
		portrait: "/game/portraits/druid.jpg",
		locked: true
	}
];
function roleOf(s) {
	if (s.role) return s.role;
	if (s.slot < 0 || s.slot === 0) return "primary";
	if (s.slot >= 6) return "ultimate";
	return "skill";
}
function defaultPrimary(classId) {
	const cls = CLASSES[classId];
	return cls.skills.find((s) => roleOf(s) === "primary")?.id ?? cls.skills[0].id;
}
function defaultLoadout(classId) {
	return CLASSES[classId].skills.filter((s) => roleOf(s) === "skill").slice(0, 4).map((s) => s.id);
}
function defaultUlt(classId) {
	const cls = CLASSES[classId];
	return cls.skills.find((s) => roleOf(s) === "ultimate")?.id ?? cls.skills[cls.skills.length - 1].id;
}
function iconFor(s) {
	return s.icon ?? `/game/icons/${s.id}.png`;
}
var MONSTERS = {
	skeleton: {
		id: "skeleton",
		name: "Riven Skeleton",
		sprite: "/game/sprites/skeleton-idle.png",
		hp: 48,
		dmg: 12,
		speed: 3.4,
		radius: .55,
		xp: 18,
		elite: false,
		scale: 1.7,
		frames: 4,
		rows: 2,
		cols: 2,
		loot: .35
	},
	imp: {
		id: "imp",
		name: "Choir Imp",
		sprite: "/game/sprites/imp-idle.png",
		hp: 32,
		dmg: 14,
		speed: 4.6,
		radius: .45,
		xp: 14,
		elite: false,
		scale: 1.35,
		frames: 4,
		rows: 2,
		cols: 2,
		loot: .28
	},
	cultist: {
		id: "cultist",
		name: "Veil Cultist",
		sprite: "/game/sprites/cultist-idle.png",
		hp: 62,
		dmg: 16,
		speed: 3.1,
		radius: .55,
		xp: 24,
		elite: false,
		scale: 1.75,
		frames: 4,
		rows: 2,
		cols: 2,
		loot: .4
	},
	brute: {
		id: "brute",
		name: "Hell Brute",
		sprite: "/game/sprites/brute-idle.png",
		hp: 220,
		dmg: 28,
		speed: 2.6,
		radius: .85,
		xp: 80,
		elite: true,
		scale: 2.25,
		frames: 4,
		rows: 2,
		cols: 2,
		loot: 1
	},
	wight: {
		id: "wight",
		name: "Frost Wight",
		sprite: "/game/sprites/imp-idle.png",
		hp: 70,
		dmg: 13,
		speed: 3.7,
		radius: .55,
		xp: 28,
		elite: false,
		scale: 1.5,
		frames: 4,
		rows: 2,
		cols: 2,
		loot: .38
	},
	maltheon: {
		id: "maltheon",
		name: "Maltheon, Choir Vicar",
		sprite: "/game/sprites/boss-idle.png",
		hp: 2400,
		dmg: 28,
		speed: 2.4,
		radius: 1.2,
		xp: 900,
		elite: true,
		boss: true,
		scale: 3.2,
		frames: 9,
		rows: 3,
		cols: 3,
		loot: 3
	},
	icewarden: {
		id: "icewarden",
		name: "The Pale Warden",
		sprite: "/game/sprites/boss-idle.png",
		hp: 3200,
		dmg: 32,
		speed: 2.5,
		radius: 1.2,
		xp: 1100,
		elite: true,
		boss: true,
		scale: 3.1,
		frames: 9,
		rows: 3,
		cols: 3,
		loot: 3
	},
	flamechorus: {
		id: "flamechorus",
		name: "The Flame Chorus",
		sprite: "/game/sprites/boss-idle.png",
		hp: 4e3,
		dmg: 36,
		speed: 2.6,
		radius: 1.25,
		xp: 1400,
		elite: true,
		boss: true,
		scale: 3.3,
		frames: 9,
		rows: 3,
		cols: 3,
		loot: 3
	},
	nihl: {
		id: "nihl",
		name: "Nihl, the Unmade",
		sprite: "/game/sprites/boss-idle.png",
		hp: 6200,
		dmg: 44,
		speed: 2.7,
		radius: 1.35,
		xp: 2200,
		elite: true,
		boss: true,
		scale: 3.6,
		frames: 9,
		rows: 3,
		cols: 3,
		loot: 4
	},
	guardian: {
		id: "guardian",
		name: "Rift Guardian",
		sprite: "/game/sprites/brute-idle.png",
		hp: 1800,
		dmg: 30,
		speed: 2.8,
		radius: 1.05,
		xp: 700,
		elite: true,
		boss: true,
		scale: 2.6,
		frames: 4,
		rows: 2,
		cols: 2,
		loot: 2.4
	},
	worldboss: {
		id: "worldboss",
		name: "Azreth the First Betrayal",
		sprite: "/game/sprites/boss-idle.png",
		hp: 9e3,
		dmg: 48,
		speed: 2.3,
		radius: 1.5,
		xp: 3e3,
		elite: true,
		boss: true,
		scale: 3.8,
		frames: 9,
		rows: 3,
		cols: 3,
		loot: 5
	},
	raid: {
		id: "raid",
		name: "Vorath, Hunger of Hatred",
		sprite: "/game/sprites/boss-idle.png",
		hp: 16e3,
		dmg: 55,
		speed: 2.2,
		radius: 1.6,
		xp: 5e3,
		elite: true,
		boss: true,
		scale: 4.1,
		frames: 9,
		rows: 3,
		cols: 3,
		loot: 6
	}
};
var BIOME_MONSTERS = {
	cathedral: [
		"skeleton",
		"cultist",
		"imp"
	],
	crypt: [
		"skeleton",
		"cultist",
		"brute"
	],
	wilds: [
		"imp",
		"cultist",
		"skeleton"
	],
	ice: [
		"wight",
		"skeleton",
		"brute"
	],
	hell: [
		"imp",
		"brute",
		"cultist"
	],
	flood: [
		"cultist",
		"wight",
		"skeleton"
	],
	rift: [
		"imp",
		"skeleton",
		"cultist",
		"brute"
	]
};
var ACT_BOSSES = [
	"maltheon",
	"icewarden",
	"flamechorus",
	"nihl"
];
var BASES = [
	{
		id: "helm-hide",
		name: "Hide Casque",
		slot: "helm"
	},
	{
		id: "helm-iron",
		name: "Iron Casque",
		slot: "helm"
	},
	{
		id: "chest-hide",
		name: "Hide Jerkin",
		slot: "chest"
	},
	{
		id: "chest-mail",
		name: "Riven Mail",
		slot: "chest"
	},
	{
		id: "shoulders-hide",
		name: "Fur Pauldrons",
		slot: "shoulders"
	},
	{
		id: "shoulders-plate",
		name: "Plate Pauldrons",
		slot: "shoulders"
	},
	{
		id: "gloves-hide",
		name: "Wraps",
		slot: "gloves"
	},
	{
		id: "gloves-mail",
		name: "Mail Gauntlets",
		slot: "gloves"
	},
	{
		id: "pants-hide",
		name: "Hide Leggings",
		slot: "pants"
	},
	{
		id: "pants-plate",
		name: "Plate Greaves",
		slot: "pants"
	},
	{
		id: "boots-hide",
		name: "Trail Boots",
		slot: "boots"
	},
	{
		id: "boots-iron",
		name: "Iron Sabatons",
		slot: "boots"
	},
	{
		id: "belt-cord",
		name: "War Cord",
		slot: "belt"
	},
	{
		id: "belt-plate",
		name: "Plated Belt",
		slot: "belt"
	},
	{
		id: "amulet-bone",
		name: "Bone Talisman",
		slot: "amulet"
	},
	{
		id: "amulet-gold",
		name: "Ashen Amulet",
		slot: "amulet"
	},
	{
		id: "ring-iron",
		name: "Iron Band",
		slot: "ring"
	},
	{
		id: "ring-sigil",
		name: "Sigil Ring",
		slot: "ring"
	},
	{
		id: "main-axe",
		name: "Greataxe",
		slot: "main",
		twoHand: true
	},
	{
		id: "main-sword",
		name: "Longsword",
		slot: "main"
	},
	{
		id: "main-staff",
		name: "Rift Staff",
		slot: "main",
		twoHand: true
	},
	{
		id: "main-bow",
		name: "Repeating Crossbow",
		slot: "main",
		twoHand: true
	},
	{
		id: "main-fist",
		name: "Knuckle Wraps",
		slot: "main"
	},
	{
		id: "main-scythe",
		name: "Bone Scythe",
		slot: "main",
		twoHand: true
	},
	{
		id: "main-flail",
		name: "War Flail",
		slot: "main"
	},
	{
		id: "off-shield",
		name: "Heater Shield",
		slot: "off"
	},
	{
		id: "off-orb",
		name: "Focus Orb",
		slot: "off"
	},
	{
		id: "off-quiver",
		name: "Quiver",
		slot: "off"
	},
	{
		id: "off-tome",
		name: "Grimoire",
		slot: "off"
	}
];
var PRIMARY_AFFIXES = [
	{
		id: "str",
		min: 18,
		max: 85,
		w: 1
	},
	{
		id: "dex",
		min: 18,
		max: 85,
		w: 1
	},
	{
		id: "int",
		min: 18,
		max: 85,
		w: 1
	},
	{
		id: "vit",
		min: 18,
		max: 90,
		w: 1.1
	},
	{
		id: "crit",
		min: 3,
		max: 12,
		w: .7
	},
	{
		id: "critDmg",
		min: 15,
		max: 55,
		w: .7
	},
	{
		id: "cdr",
		min: 4,
		max: 12,
		w: .55
	},
	{
		id: "area",
		min: 8,
		max: 24,
		w: .5
	},
	{
		id: "eliteDmg",
		min: 8,
		max: 22,
		w: .5
	}
];
var SECONDARY_AFFIXES = [
	{
		id: "armor",
		min: 40,
		max: 220,
		w: 1
	},
	{
		id: "allRes",
		min: 20,
		max: 90,
		w: .9
	},
	{
		id: "life",
		min: 120,
		max: 900,
		w: 1
	},
	{
		id: "lifeOnHit",
		min: 80,
		max: 420,
		w: .6
	},
	{
		id: "goldFind",
		min: 10,
		max: 40,
		w: .5
	},
	{
		id: "pickup",
		min: .4,
		max: 2.2,
		w: .4
	},
	{
		id: "dodge",
		min: 2,
		max: 8,
		w: .4
	}
];
var LEGENDARIES = [
	{
		id: "ancients-grip",
		name: "Grip of the Unbroken",
		slot: "gloves",
		power: "whirlwindTrail",
		desc: "Bloodspin leaves a burning trail."
	},
	{
		id: "earth-crown",
		name: "Crown of Broken Hills",
		slot: "helm",
		power: "leapQuake",
		desc: "Warleap slams twice."
	},
	{
		id: "fury-heart",
		name: "Heart of the Clan",
		slot: "chest",
		power: "furyOnHit",
		desc: "Hits generate extra Fury."
	},
	{
		id: "rift-lens",
		name: "Lens of the Spire",
		slot: "off",
		power: "beamFork",
		desc: "Disintegrate forks on kill."
	},
	{
		id: "comet-band",
		name: "Band of Falling Suns",
		slot: "ring",
		power: "cometEcho",
		desc: "Comet leaves a second delayed strike."
	},
	{
		id: "hunter-hood",
		name: "Hood of the Green Quiet",
		slot: "helm",
		power: "vaultCaltrops",
		desc: "Vault seeds caltrops."
	},
	{
		id: "venge-mail",
		name: "Mail of Unquiet Dead",
		slot: "chest",
		power: "multishotPlus",
		desc: "Fan of Bolts fires two extra."
	},
	{
		id: "spirit-sash",
		name: "Sash of One Hundred Forms",
		slot: "belt",
		power: "dashReset",
		desc: "Dashing Strike cooldown reset on kill."
	},
	{
		id: "bone-circlet",
		name: "Circlet of Unburied Kings",
		slot: "helm",
		power: "spearExplode",
		desc: "Bone Spear explodes at max range."
	},
	{
		id: "sun-aegis",
		name: "Aegis of the Ashen Sun",
		slot: "off",
		power: "consecrateHeal",
		desc: "Consecration also heals."
	},
	{
		id: "choir-eye",
		name: "Eye of the Black Choir",
		slot: "amulet",
		power: "eliteExecute",
		desc: "Elites below 15% life explode."
	},
	{
		id: "veil-step",
		name: "Treads of the Torn Veil",
		slot: "boots",
		power: "dashIframes",
		desc: "Dashes last 40% longer."
	}
];
var SETS = [
	{
		id: "thornwatch",
		name: "Thornwatch Plate",
		slots: [
			"helm",
			"chest",
			"shoulders",
			"gloves",
			"pants",
			"boots"
		],
		bonuses: {
			2: "+15% armor and vitality",
			4: "Warcry also increases damage 20%",
			6: "Cataclysm cooldown reduced 30%"
		}
	},
	{
		id: "choir",
		name: "Shroud of the Choir",
		slots: [
			"helm",
			"chest",
			"shoulders",
			"gloves",
			"pants",
			"boots"
		],
		bonuses: {
			2: "+15% intelligence and crit",
			4: "Projectiles pierce once",
			6: "Ultimates deal 40% more damage"
		}
	},
	{
		id: "ashen",
		name: "Ashen Hunt",
		slots: [
			"helm",
			"chest",
			"shoulders",
			"gloves",
			"pants",
			"boots"
		],
		bonuses: {
			2: "+15% dexterity and dodge",
			4: "Dash cooldown -1.5s",
			6: "Every 4th attack is a guaranteed crit"
		}
	}
];
var GEMS = [
	{
		id: "gem-blood",
		name: "Heart of Unmaking",
		effect: "Heal 2% of damage dealt."
	},
	{
		id: "gem-storm",
		name: "Bottled Thunder",
		effect: "Skills chain lightning on crit."
	},
	{
		id: "gem-veil",
		name: "Splintered Veil",
		effect: "After dash, gain 20% damage for 3s."
	},
	{
		id: "gem-grave",
		name: "Grave-Star",
		effect: "Kills have a chance to raise a skeleton."
	},
	{
		id: "gem-sun",
		name: "Ashen Sunshard",
		effect: "Every 8s, a holy nova."
	}
];
var QUESTS = [
	{
		id: "a1q1",
		act: 1,
		name: "The Tear at Thornwatch",
		giver: "ryn",
		steps: [
			{
				id: "tear",
				text: "Enter the First Tear in the plaza.",
				kind: "enter",
				target: "rift"
			},
			{
				id: "meet",
				text: "Speak with Captain Ryn in Thornwatch.",
				kind: "talk",
				target: "ryn"
			},
			{
				id: "gate",
				text: "Enter the Cathedral of Saint Elara.",
				kind: "enter",
				target: "cathedral"
			},
			{
				id: "nave",
				text: "Purge the nave — slay Choir spawn (0/25).",
				kind: "kill",
				target: "any",
				count: 25
			},
			{
				id: "turn",
				text: "Return to Captain Ryn.",
				kind: "talk",
				target: "ryn"
			}
		],
		rewardGold: 180,
		rewardXp: 400,
		lore: "Last night the nave split. A red wound hangs where the altar was. Ryn wants it closed before the Choir learns our names."
	},
	{
		id: "a1q2",
		act: 1,
		name: "Relics of Elara",
		giver: "maera",
		steps: [
			{
				id: "talk",
				text: "Sister Maera needs three Elaran relics.",
				kind: "talk",
				target: "maera"
			},
			{
				id: "get",
				text: "Collect relics from cathedral chests (0/3).",
				kind: "collect",
				target: "relic",
				count: 3
			},
			{
				id: "turn",
				text: "Deliver the relics to Maera.",
				kind: "talk",
				target: "maera"
			}
		],
		rewardGold: 220,
		rewardXp: 520,
		lore: "Elara bound the first veil-tear with three iron hymns. The hymns are metal now, and they remember."
	},
	{
		id: "a1q3",
		act: 1,
		name: "Bells of the Fallen",
		giver: "ryn",
		steps: [{
			id: "elite",
			text: "Hunt cathedral elites (0/3).",
			kind: "kill",
			target: "elite",
			count: 3
		}, {
			id: "turn",
			text: "Report to Captain Ryn.",
			kind: "talk",
			target: "ryn"
		}],
		rewardGold: 260,
		rewardXp: 640,
		lore: "The bell-towers walk. That is not a metaphor."
	},
	{
		id: "a1q4",
		act: 1,
		name: "The Vicar",
		giver: "ryn",
		steps: [
			{
				id: "enter",
				text: "Descend to the inner sanctuary.",
				kind: "enter",
				target: "cathedral"
			},
			{
				id: "boss",
				text: "Slay Maltheon, Choir Vicar.",
				kind: "boss",
				target: "maltheon"
			},
			{
				id: "turn",
				text: "Return to Thornwatch.",
				kind: "talk",
				target: "ryn"
			}
		],
		rewardGold: 800,
		rewardXp: 1800,
		lore: "Maltheon kept the nave for forty years. Then he opened the door from the other side."
	},
	{
		id: "a1q5",
		act: 1,
		name: "Ash on the Wind",
		giver: "vesh",
		steps: [
			{
				id: "talk",
				text: "Quartermaster Vesh has a bounty.",
				kind: "talk",
				target: "vesh"
			},
			{
				id: "kill",
				text: "Slay Choir Imps (0/20).",
				kind: "kill",
				target: "imp",
				count: 20
			},
			{
				id: "turn",
				text: "Collect the bounty from Vesh.",
				kind: "talk",
				target: "vesh"
			}
		],
		rewardGold: 200,
		rewardXp: 360,
		lore: "Imps nest in the granary eaves. The grain is screaming. Vesh would like that to stop."
	},
	{
		id: "a1q6",
		act: 1,
		name: "The First Greater Tear",
		giver: "io",
		steps: [
			{
				id: "talk",
				text: "Speak with Warden Io at the rift stone.",
				kind: "talk",
				target: "io"
			},
			{
				id: "rift",
				text: "Close a Challenge Rift.",
				kind: "enter",
				target: "rift"
			},
			{
				id: "turn",
				text: "Return to Io.",
				kind: "talk",
				target: "io"
			}
		],
		rewardGold: 400,
		rewardXp: 900,
		lore: "Io claims the tears can be ridden like weather. She has not yet been proven wrong."
	},
	{
		id: "a2q1",
		act: 2,
		name: "The White Silence",
		giver: "ryn",
		steps: [
			{
				id: "talk",
				text: "Captain Ryn has word from the north.",
				kind: "talk",
				target: "ryn"
			},
			{
				id: "enter",
				text: "Enter the Frosthold Caverns.",
				kind: "enter",
				target: "ice"
			},
			{
				id: "kill",
				text: "Slay frost spawn (0/30).",
				kind: "kill",
				target: "any",
				count: 30
			},
			{
				id: "boss",
				text: "Defeat the Pale Warden.",
				kind: "boss",
				target: "icewarden"
			}
		],
		rewardGold: 900,
		rewardXp: 2200,
		lore: "The passes froze in a single night. Scouts came back without mouths."
	},
	{
		id: "a3q1",
		act: 3,
		name: "Cinderwake",
		giver: "kael",
		steps: [
			{
				id: "talk",
				text: "Forge-Father Kael smells a city burning.",
				kind: "talk",
				target: "kael"
			},
			{
				id: "enter",
				text: "Enter the Burning Quarter.",
				kind: "enter",
				target: "hell"
			},
			{
				id: "kill",
				text: "Slay hellspawn (0/35).",
				kind: "kill",
				target: "any",
				count: 35
			},
			{
				id: "boss",
				text: "Silence the Flame Chorus.",
				kind: "boss",
				target: "flamechorus"
			}
		],
		rewardGold: 1200,
		rewardXp: 2800,
		lore: "Iskara's hymn is fire. The Quarter sings it whether it wants to or not."
	},
	{
		id: "a4q1",
		act: 4,
		name: "The Unmade Gate",
		giver: "maera",
		steps: [
			{
				id: "talk",
				text: "Maera has seen the last door in her sleep.",
				kind: "talk",
				target: "maera"
			},
			{
				id: "enter",
				text: "Step through the Prime Rift.",
				kind: "enter",
				target: "hell"
			},
			{
				id: "kill",
				text: "Cut a path (0/40).",
				kind: "kill",
				target: "any",
				count: 40
			},
			{
				id: "boss",
				text: "Unmake Nihl.",
				kind: "boss",
				target: "nihl"
			}
		],
		rewardGold: 2e3,
		rewardXp: 4e3,
		lore: "Nihl is not a demon. Nihl is the place a name used to be."
	}
];
var NPCS = [
	{
		id: "ryn",
		name: "Captain Ryn",
		role: "Commander",
		line: "The veil does not care that we are tired."
	},
	{
		id: "kael",
		name: "Forge-Father Kael",
		role: "Blacksmith",
		line: "Steel remembers. Bring me the Choir's mistakes."
	},
	{
		id: "maera",
		name: "Sister Maera",
		role: "Mystic",
		line: "Powers can be moved. That is the heresy that saves us."
	},
	{
		id: "vesh",
		name: "Quartermaster Vesh",
		role: "Vendor",
		line: "I buy blood. I sell better blood."
	},
	{
		id: "io",
		name: "Warden Io",
		role: "Rift Warden",
		line: "Count the heartbeats. The tear counts them too."
	},
	{
		id: "brann",
		name: "Keeper Brann",
		role: "Stash",
		line: "Nothing left here is innocent. Including the chests."
	}
];
var INTRO = [
	"Aeloria did not fall in a day. It leaked.",
	"First the bells of Saint Elara rang without ringers. Then the nave opened like a mouth.",
	"Thornwatch is the last lantern on the Shattered Marches. The Black Choir wants it dark.",
	"You are what the veil spat back. Go and make it regret that."
];
function xpToNext(level) {
	if (level >= 60) return 1200 + Math.floor(level * 80);
	return Math.floor(80 * Math.pow(1.14, level - 1) + 40);
}
var CHAMPION_AFFIXES = [
	"extraLife",
	"fast",
	"molten",
	"jailer",
	"vortex",
	"electrified",
	"frozen",
	"teleporter"
];
var SHRINES = [
	{
		id: "speed",
		name: "Shrine of Haste",
		dur: 30
	},
	{
		id: "damage",
		name: "Shrine of Wrath",
		dur: 30
	},
	{
		id: "loot",
		name: "Shrine of Fortune",
		dur: 20
	},
	{
		id: "res",
		name: "Resurrection Shrine",
		dur: 0
	}
];
var Rng = class {
	s;
	constructor(seed = Date.now() % 2147483647) {
		this.s = seed || 1;
	}
	next() {
		this.s = this.s * 16807 % 2147483647;
		return (this.s - 1) / 2147483646;
	}
	int(a, b) {
		return a + Math.floor(this.next() * (b - a + 1));
	}
	pick(arr) {
		return arr[Math.floor(this.next() * arr.length)];
	}
	chance(p) {
		return this.next() < p;
	}
	weighted(arr) {
		let t = 0;
		for (const x of arr) t += x.w;
		let r = this.next() * t;
		for (const x of arr) {
			r -= x.w;
			if (r <= 0) return x;
		}
		return arr[arr.length - 1];
	}
};
var uid = 1;
function uidStr() {
	uid += 1;
	return "i" + uid.toString(36) + Date.now().toString(36).slice(-4);
}
function rarityFor(magicFind, elite, boss, pity, rng) {
	let leg = .012 * magicFind + (elite ? .04 : 0) + (boss ? .18 : 0);
	if (pity >= 12) leg += .55;
	if (rng.chance(leg)) return rng.chance(.22) ? "set" : "legendary";
	if (rng.chance(.18 * magicFind + (elite ? .12 : 0))) return "rare";
	if (rng.chance(.45 * magicFind)) return "magic";
	return "normal";
}
function rollItem(opts) {
	const { rng, level, classId } = opts;
	const rarity = opts.forceLegendary ? rng.chance(.25) ? "set" : "legendary" : opts.rarity ?? "rare";
	const cls = CLASSES[classId];
	let slot = opts.slot ?? rng.pick(SLOTS);
	if (rarity === "legendary" || rarity === "set") {}
	let legendaryId;
	let setId;
	let name;
	let base = rng.pick(BASES.filter((b) => b.slot === slot));
	if (!base) {
		slot = "main";
		base = BASES.find((b) => b.slot === "main");
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
	const nAff = rarity === "normal" ? rng.int(0, 1) : rarity === "magic" ? rng.int(2, 3) : rarity === "rare" ? rng.int(4, 5) : rng.int(5, 6);
	const affixes = [];
	const used = /* @__PURE__ */ new Set();
	const scale = .35 + level / 80;
	for (let i = 0; i < nAff; i++) {
		const pool = i < Math.ceil(nAff * .65) ? PRIMARY_AFFIXES : SECONDARY_AFFIXES;
		let a = rng.weighted(pool);
		let guard = 0;
		while (used.has(a.id) && guard++ < 8) a = rng.weighted(pool);
		if (used.has(a.id)) continue;
		used.add(a.id);
		let id = a.id;
		if ((id === "str" || id === "dex" || id === "int") && rng.chance(.8)) id = cls.primary;
		const v = a.min + (a.max - a.min) * scale * (.65 + rng.next() * .35);
		affixes.push({
			id,
			value: Math.round(v * 10) / 10
		});
	}
	const sockets = rarity === "normal" ? 0 : rarity === "magic" ? rng.chance(.2) ? 1 : 0 : rarity === "rare" ? rng.int(0, 2) : rng.int(1, 3);
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
		identified: rarity !== "rare" && rarity !== "legendary" && rarity !== "set" ? true : rng.chance(.35)
	};
}
function identify(item) {
	item.identified = true;
}
function itemPower(item) {
	let p = item.ilvl * 8;
	for (const a of item.affixes) p += a.value;
	if (item.rarity === "legendary") p += 80;
	if (item.rarity === "set") p += 70;
	return Math.round(p);
}
function salvageValue(item) {
	if (item.rarity === "normal") return {
		scrap: 2,
		dust: 0,
		crystal: 0
	};
	if (item.rarity === "magic") return {
		scrap: 4,
		dust: 1,
		crystal: 0
	};
	if (item.rarity === "rare") return {
		scrap: 8,
		dust: 4,
		crystal: 0
	};
	if (item.rarity === "set") return {
		scrap: 12,
		dust: 8,
		crystal: 1
	};
	return {
		scrap: 14,
		dust: 10,
		crystal: 2
	};
}
function formatAffix(a) {
	return `+${[
		"crit",
		"critDmg",
		"cdr",
		"area",
		"eliteDmg",
		"goldFind",
		"dodge"
	].includes(a.id) ? `${a.value.toFixed(1)}%` : a.id === "pickup" ? a.value.toFixed(1) : String(Math.round(a.value))} ${{
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
		socket: "Socket"
	}[a.id] ?? a.id}`;
}
function itemDamage(item) {
	let v = item.ilvl * 2;
	for (const a of item.affixes) if (a.id === "str" || a.id === "dex" || a.id === "int" || a.id === "crit" || a.id === "critDmg" || a.id === "eliteDmg" || a.id === "area") v += a.value;
	if (item.rarity === "legendary" || item.rarity === "set") v += 24;
	if (item.rarity === "rare") v += 10;
	return Math.round(v);
}
function itemLife(item) {
	let v = 0;
	for (const a of item.affixes) if (a.id === "vit" || a.id === "life") v += a.id === "life" ? a.value : a.value * 6;
	return Math.round(v);
}
function itemCR(item) {
	return itemPower(item);
}
function randomGem(rng, rank = 1) {
	const g = rng.pick(GEMS);
	return {
		id: g.id,
		name: g.name,
		rank,
		copies: 1
	};
}
/** Fine pointer + hover + wide viewport → desktop WASD/mouse scheme.
*  Headless / automation often reports neither fine nor hover; a wide
*  non-coarse viewport is treated as PC so the desktop HUD is what QA sees.
*/
function isPc() {
	if (typeof window === "undefined") return true;
	if (window.innerWidth < 900) return false;
	const fine = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
	const hover = window.matchMedia?.("(hover: hover)")?.matches ?? false;
	const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
	if (fine || hover) return true;
	if (coarse) return false;
	return true;
}
var empty = {
	screen: "title",
	panel: "none",
	classId: null,
	name: "",
	level: 1,
	xp: 0,
	xpNext: 100,
	paragon: 0,
	hp: 1,
	maxHp: 1,
	hpChase: 1,
	resource: 0,
	maxResource: 100,
	resourceName: "",
	gold: 0,
	materials: {
		scrap: 0,
		dust: 0,
		crystal: 0
	},
	difficulty: "normal",
	areaName: TOWN_NAME,
	biome: "town",
	questText: "",
	buffs: [],
	skills: [],
	primary: null,
	ultimate: null,
	ultCharge: 0,
	ultReady: false,
	ultActive: 0,
	potionCd: 0,
	potionCount: 3,
	potionMax: 8,
	potionHot: 0,
	inventory: [],
	stash: [],
	equipped: {},
	vendor: [],
	groundCompare: null,
	groundLoot: [],
	target: null,
	toasts: [],
	dialogue: null,
	minimap: {
		w: 1,
		h: 1,
		px: 0,
		pz: 0,
		ents: []
	},
	dead: false,
	rift: null,
	worldBossIn: 180,
	ping: "",
	interact: null,
	legendaryFlash: null,
	loading: false,
	loadPct: 0,
	combatRating: 0,
	channel: null,
	lowHp: false,
	portrait: "/game/portraits/barbarian.jpg",
	pc: typeof window === "undefined" ? true : isPc()
};
function GameApp() {
	const worldRef = (0, import_react.useRef)(null);
	const overlayRef = (0, import_react.useRef)(null);
	const game = (0, import_react.useRef)(null);
	const [ui, setUi] = (0, import_react.useState)(empty);
	const [sel, setSel] = (0, import_react.useState)("barbarian");
	const [name, setName] = (0, import_react.useState)("Ashen");
	const [intro, setIntro] = (0, import_react.useState)(0);
	const [hover, setHover] = (0, import_react.useState)(null);
	const [saves, setSaves] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const world = worldRef.current;
		const overlay = overlayRef.current;
		if (!world || !overlay) return;
		let g = null;
		let dead = false;
		import("./engine-BTs81K4A.mjs").then(({ Veilbreak }) => {
			if (dead) return;
			g = new Veilbreak(world, overlay, setUi);
			game.current = g;
			g.start();
			try {
				const raw = localStorage.getItem("veilbreak-save-v1");
				if (raw) {
					const p = JSON.parse(raw);
					setSaves(p.characters ?? []);
				}
			} catch {}
		});
		const unlock = () => g?.audio.unlock();
		window.addEventListener("pointerdown", unlock, { once: true });
		return () => {
			dead = true;
			g?.dispose();
			game.current = null;
		};
	}, []);
	const g = game.current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-void text-bone font-sans",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: worldRef,
				className: `absolute inset-0 h-full w-full touch-none ${ui.pc && ui.screen === "playing" ? "cursor-none" : ""}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: overlayRef,
				className: "pointer-events-none absolute inset-0 h-full w-full"
			}),
			ui.loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadGate, { pct: ui.loadPct }),
			ui.screen === "title" && !ui.loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title, {
				saves,
				onNew: () => game.current?.goSelect(),
				onContinue: (i) => game.current?.continueHero(i)
			}),
			ui.screen === "select" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
				sel,
				name,
				onSel: setSel,
				onName: setName,
				onStart: () => g?.chooseClass(sel, name),
				onBack: () => setUi({
					...ui,
					screen: "title"
				})
			}),
			ui.screen === "intro" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Intro, {
				i: intro,
				onNext: () => intro < INTRO.length - 1 ? setIntro(intro + 1) : (setIntro(0), g?.finishIntro())
			}),
			ui.screen === "playing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hud, {
				ui,
				hover,
				setHover,
				onPanel: (p) => g?.openPanel(p),
				onEquip: (id) => g?.equip(id),
				onEquipTo: (id, s, r) => g?.equipTo(id, s, r),
				onUnequip: (s, i) => g?.unequip(s, i),
				onSalvage: (id) => g?.salvage(id),
				onStash: (id, t) => g?.stashMove(id, t),
				onBuy: (id) => g?.buy(id),
				onReforge: (id) => g?.reforge(id),
				onSocket: (id) => g?.addSocket(id),
				onExtract: (id) => g?.extractPower(id),
				onRune: (id) => g?.toggleRune(id),
				onDiff: (d) => g?.setDifficulty(d),
				onTalk: (id) => g?.talkChoice(id),
				onRift: (t) => g?.enterPortal("rift", t),
				onParagon: (k) => g?.spendParagon(k),
				onStick: (x, y) => g?.setStick(x, y),
				onSkill: (i) => game.current?.pressSkill(i),
				onSkillHold: (i, d) => game.current?.holdSkill(i, d),
				onPrimary: (d) => game.current?.holdPrimary(d),
				onUlt: () => game.current?.pressUltimate(),
				onPotion: () => game.current?.drinkPotion(),
				onLoot: (id) => game.current?.pickupGround(id),
				onInteract: () => game.current?.useInteract(),
				onSetPrimary: (id) => game.current?.setPrimarySkill(id),
				onSetLoadout: (slot, id) => game.current?.setLoadoutSlot(slot, id),
				onPaperdoll: (el) => game.current?.mountPaperdoll(el),
				onDollYaw: (d) => game.current?.paperdollYaw(d)
			}),
			ui.screen === "dead" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-40 flex flex-col items-center justify-center bg-void/80",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tracking-widest text-blood",
						children: "Fallen"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-sm text-center text-muted",
						children: "The Choir does not keep what it kills. Thornwatch still has a bed for you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-8 rounded-md bg-bone px-8 py-3 text-sm font-semibold text-void",
						onClick: () => g?.respawn(),
						children: "Return to Thornwatch"
					})
				]
			}),
			ui.legendaryFlash && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-void/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-legend/40 bg-ash/90 px-10 py-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.3em] text-legend uppercase",
						children: "Legendary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl text-bone",
						children: ui.legendaryFlash
					})]
				})
			})
		]
	});
}
function LoadGate({ pct }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col items-center justify-center bg-void",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-8 size-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 animate-spin rounded-full border-2 border-gold/70",
						style: { boxShadow: "0 0 24px #c4a35a55, inset 0 0 18px #c4a35a33" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-3 animate-spin rounded-full border border-gold-lo",
						style: {
							animationDirection: "reverse",
							animationDuration: "4s"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-[22%] rounded-full bg-gradient-to-br from-gold-hi/40 to-blood/40" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl tracking-[0.4em]",
				children: GAME_TITLE
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 h-1 w-48 overflow-hidden bg-stone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-gold-hi transition-all duration-300",
					style: { width: `${Math.round(pct * 100)}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs tracking-[0.35em] text-muted uppercase",
				children: "Binding the veil"
			})
		]
	});
}
function Title({ saves, onNew, onContinue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-20 flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/game/title.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/30" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-auto flex flex-col items-center px-6 pb-16 pt-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.45em] text-muted uppercase",
						children: "The Shattered Marches of Aeloria"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-5xl tracking-[0.28em] sm:text-7xl",
						children: GAME_TITLE
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-center text-sm text-muted",
						children: "The veil is torn. Thornwatch is the last lantern. You are what the wound spat back."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-10 min-h-11 rounded-md bg-bone px-10 py-3 text-sm font-semibold tracking-wide text-void",
						onClick: onNew,
						children: "New Wanderer"
					}),
					saves.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-2",
						children: saves.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "rounded-sm border border-border bg-ash/80 px-4 py-2 text-xs",
							onClick: () => onContinue(i),
							children: [
								s.name,
								" · ",
								CLASSES[s.classId].name,
								" · ",
								s.level
							]
						}, s.name + i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-[11px] text-faint",
						children: "WASD move · hold LMB / Space to strike · 1–4 skills · Q ultimate · R potion · F force-move"
					})
				]
			})
		]
	});
}
function Select({ sel, name, onSel, onName, onStart, onBack }) {
	const picked = ROSTER.find((r) => (r.playable ?? r.id) === sel) ?? ROSTER[0];
	const c = CLASSES.barbarian;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 overflow-y-auto bg-void",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.35em] text-muted uppercase",
						children: "Choose your wound"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl tracking-widest",
						children: "The Nine"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-muted",
						onClick: onBack,
						children: "Back"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-3 lg:grid-cols-9",
					children: ROSTER.map((cl) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							if (!cl.locked && cl.playable) onSel(cl.playable);
						},
						className: `relative overflow-hidden rounded-lg border text-left ${sel === (cl.playable ?? cl.id) ? "border-gold" : "border-border"} ${cl.locked ? "opacity-55" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: cl.portrait,
								alt: cl.name,
								className: "aspect-[2/3] w-full object-cover object-top"
							}),
							cl.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 flex flex-col items-center justify-end bg-void/50 pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-sm border border-gold-lo bg-ash/80 px-2 py-0.5 text-[9px] tracking-widest text-gold uppercase",
									children: "Locked"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-[11px] leading-tight sm:text-sm",
									children: cl.name
								})
							})
						]
					}, cl.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-[280px_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: picked.portrait,
						alt: "",
						className: "hidden h-80 w-full rounded-lg object-cover object-top lg:block"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "menu-sheet rounded-xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl",
								children: picked.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: picked.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-2xl text-sm leading-relaxed text-bone/90",
								children: picked.lore
							}),
							!picked.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4",
								children: c.skills.filter((s) => roleOf(s) !== "ultimate").slice(0, 6).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-md border border-gold-lo bg-stone/60 px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted",
										children: s.key
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: s.name
									})]
								}, s.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap items-end gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex flex-col gap-1 text-xs text-muted",
									children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: name,
										onChange: (e) => onName(e.target.value.slice(0, 16)),
										className: "min-h-11 rounded-md border border-gold-lo bg-ash px-3 text-sm text-bone"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: picked.locked,
									className: "min-h-11 rounded-md bg-bone px-8 text-sm font-semibold text-void disabled:opacity-40",
									onClick: onStart,
									children: picked.locked ? "Sealed" : "Enter Thornwatch"
								})]
							})
						]
					})]
				})
			]
		})
	});
}
function Intro({ i, onNext }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "absolute inset-0 z-20 flex flex-col items-center justify-center bg-void px-8 text-center",
		onClick: onNext,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/game/title.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover opacity-30"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative max-w-xl font-display text-2xl leading-snug sm:text-3xl",
				children: INTRO[i]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mt-10 text-xs tracking-[0.3em] text-muted uppercase",
				children: "Touch to continue"
			})
		]
	});
}
function Hud(props) {
	const { ui, onPanel } = props;
	const hp = ui.maxHp ? ui.hp / ui.maxHp : 0;
	const chase = ui.maxHp ? ui.hpChase / ui.maxHp : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		ui.lowHp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "low-vignette" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute left-3 top-3 z-10 flex items-start gap-2 sm:left-4 sm:top-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `portrait-ring size-16 sm:size-[4.6rem] ${ui.lowHp ? "is-low" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: ui.portrait,
						alt: "",
						className: "size-full rounded-full object-cover object-top"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-sm border border-gold bg-stone px-1.5 text-[10px] font-bold tabular-nums text-bone",
					children: ui.level
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hp-well w-[148px] sm:w-[210px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hp-chase",
								style: { width: `${Math.max(hp, chase) * 100}%` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hp-fill",
								style: { width: `${hp * 100}%` }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums text-bone",
								style: { textShadow: "0 1px 2px #000" },
								children: [
									Math.ceil(ui.hp),
									" / ",
									Math.ceil(ui.maxHp)
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[10px] tracking-wide text-muted",
						children: [
							ui.name,
							" · CR ",
							Math.round(ui.combatRating)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 flex gap-1",
						children: ui.buffs.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "rounded-sm border border-gold-lo bg-ash px-1.5 py-0.5 text-[9px] text-gold-hi",
							children: [
								b.name,
								" ",
								Math.ceil(b.t)
							]
						}, b.id + b.t))
					})
				]
			})]
		}),
		ui.target && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute left-1/2 top-3 z-10 w-[min(280px,70vw)] -translate-x-1/2 sm:top-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 px-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] tabular-nums text-muted",
							children: ui.target.level
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: `font-display text-sm ${ui.target.elite || ui.target.boss ? "text-gold-hi" : "text-bone"}`,
							children: [ui.target.boss ? "☠ " : ui.target.elite ? "✦ " : "", ui.target.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase text-muted",
							children: ui.target.type
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hp-well mt-0.5 h-3 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hp-fill",
						style: { width: `${(ui.target.maxHp ? ui.target.hp / ui.target.maxHp : 0) * 100}%` }
					})
				}),
				ui.target.affixes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-center text-[9px] uppercase tracking-wider text-gold",
					children: ui.target.affixes.join(" · ")
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute right-3 top-3 z-10 flex items-start gap-1.5 sm:right-4 sm:top-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-auto flex flex-col gap-1",
				children: [
					[
						"inventory",
						Backpack,
						"Bag"
					],
					[
						"skills",
						Swords,
						"Skills"
					],
					[
						"map",
						Map,
						"Map"
					],
					[
						"pause",
						Menu,
						"Menu"
					]
				].map(([p, Icon, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "stone-btn size-9 rounded-sm",
					onClick: () => onPanel(p),
					"aria-label": label,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-gold-hi" })
				}, p))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "pointer-events-auto",
				onClick: () => onPanel("map"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
					map: ui.minimap,
					zone: ui.areaName
				})
			})]
		}),
		ui.rift?.active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `pointer-events-none absolute left-1/2 z-10 w-[min(260px,70vw)] -translate-x-1/2 ${ui.target ? "top-[5.8rem]" : "top-3"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-center text-[10px] tracking-[0.2em] text-gold uppercase",
					children: ["First Tear · T", ui.rift.tier]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hp-well mt-0.5 h-2 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hp-fill",
						style: {
							width: `${Math.min(100, ui.rift.progress / ui.rift.goal * 100)}%`,
							background: "linear-gradient(180deg,#e6c87a,#c45a12)"
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-center text-[10px] tabular-nums text-muted",
					children: [
						Math.floor(ui.rift.time / 60),
						":",
						String(Math.floor(ui.rift.time % 60)).padStart(2, "0"),
						" · ",
						ui.rift.progress,
						"/",
						ui.rift.goal
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute left-3 top-24 z-10 max-w-[200px] sm:top-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "quest-parchment rounded-sm px-3 py-2 text-[11px] leading-snug",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-0.5 text-[10px] tracking-widest text-gold uppercase",
					children: "!"
				}), ui.questText]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none absolute bottom-36 left-1/2 z-10 flex w-[min(280px,70vw)] -translate-x-1/2 flex-col items-center gap-1",
			children: [ui.interact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "hand-btn pointer-events-auto flex items-center justify-center",
				onClick: props.onInteract,
				"aria-label": ui.interact,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hand, { className: "size-6 text-gold-hi" })
			}), ui.groundLoot.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: `loot-plate pointer-events-auto rounded-sm px-3 py-1.5 text-xs rarity-${g.rarity}`,
				onClick: () => props.onLoot(g.uid),
				children: g.name
			}, g.uid))]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillCluster, {
			ui,
			pc: ui.pc,
			onSkill: props.onSkill,
			onSkillHold: props.onSkillHold,
			onPrimary: props.onPrimary,
			onUlt: props.onUlt,
			onPotion: props.onPotion
		}),
		!ui.pc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stick, { onStick: props.onStick }),
		ui.panel === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inv, { ...props }),
		ui.panel === "stash" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stash, { ...props }),
		ui.panel === "vendor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Vendor, { ...props }),
		ui.panel === "blacksmith" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smith, { ...props }),
		ui.panel === "mystic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mystic, { ...props }),
		ui.panel === "skills" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skills, {
			ui,
			onRune: props.onRune,
			onPrimary: props.onSetPrimary,
			onLoadout: props.onSetLoadout,
			onClose: () => onPanel("none")
		}),
		ui.panel === "quests" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quests, {
			ui,
			onClose: () => onPanel("none")
		}),
		ui.panel === "rifts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rifts, {
			ui,
			onRift: props.onRift,
			onClose: () => onPanel("none")
		}),
		ui.panel === "bounties" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bounties, { onClose: () => onPanel("none") }),
		ui.panel === "pause" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {
			ui,
			onDiff: props.onDiff,
			onParagon: props.onParagon,
			onClose: () => onPanel("none")
		}),
		ui.panel === "map" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseMenu, {
			ui,
			onDiff: props.onDiff,
			onParagon: props.onParagon,
			onClose: () => onPanel("none")
		}),
		ui.panel === "dialogue" && ui.dialogue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-void via-void/95 to-transparent px-4 pb-8 pt-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl menu-sheet rounded-xl p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: ui.dialogue.speaker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-bone/90",
						children: ui.dialogue.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: (ui.dialogue.options ?? [{
							id: "x",
							label: "Leave"
						}]).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 rounded-md border border-gold-lo bg-stone px-4 text-sm",
							onClick: () => props.onTalk(o.id),
							children: o.label
						}, o.id))
					})
				]
			})
		}),
		props.hover && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {
			item: props.hover,
			eq: equippedIn(ui, props.hover.slot)
		})
	] });
}
function SkillCluster({ ui, pc, onSkillHold, onPrimary, onUlt, onPotion }) {
	const s = ui.skills;
	if (pc) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute bottom-3 right-3 z-20 flex items-end gap-1.5 sm:bottom-4 sm:right-4",
		children: [
			ui.ultReady && ui.ultimate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
				skill: ui.ultimate,
				size: 42,
				onDown: () => onUlt(),
				pulse: true
			}),
			s[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
				skill: s[0],
				size: 44,
				onDown: () => onSkillHold(0, true),
				onUp: () => onSkillHold(0, false)
			}),
			s[1] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
				skill: s[1],
				size: 44,
				onDown: () => onSkillHold(1, true),
				onUp: () => onSkillHold(1, false)
			}),
			s[2] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
				skill: s[2],
				size: 44,
				onDown: () => onSkillHold(2, true),
				onUp: () => onSkillHold(2, false)
			}),
			s[3] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
				skill: s[3],
				size: 44,
				onDown: () => onSkillHold(3, true),
				onUp: () => onSkillHold(3, false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `medallion size-10 ${ui.hp / ui.maxHp < .55 ? "animate-pulse" : ""}`,
				onClick: onPotion,
				"aria-label": "Potion",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/game/icons/potion.png",
						alt: ""
					}),
					ui.potionCd > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cd-sweep",
						style: { ["--cd"]: String(Math.min(1, ui.potionCd / 2.6)) }
					}),
					ui.potionCd > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cd-num text-sm",
						children: Math.ceil(ui.potionCd)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -right-1 -top-1 rounded-sm border border-gold bg-stone px-1 text-[10px] font-bold tabular-nums",
						children: ui.potionCount
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute bottom-2 right-2 z-20 h-[200px] w-[220px] sm:bottom-4 sm:right-4",
		children: [
			ui.ultReady && ui.ultimate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-2 left-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
					skill: ui.ultimate,
					size: 54,
					onDown: () => onUlt(),
					pulse: true
				})
			}),
			s[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-[44px] left-[8px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
					skill: s[0],
					size: 54,
					onDown: () => onSkillHold(0, true),
					onUp: () => onSkillHold(0, false)
				})
			}),
			s[1] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-[102px] left-[44px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
					skill: s[1],
					size: 54,
					onDown: () => onSkillHold(1, true),
					onUp: () => onSkillHold(1, false)
				})
			}),
			s[2] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-[102px] right-[52px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
					skill: s[2],
					size: 54,
					onDown: () => onSkillHold(2, true),
					onUp: () => onSkillHold(2, false)
				})
			}),
			s[3] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-1 right-[100px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
					skill: s[3],
					size: 54,
					onDown: () => onSkillHold(3, true),
					onUp: () => onSkillHold(3, false)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 right-0",
				children: ui.primary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ult-arc",
						style: { ["--ult"]: String(ui.ultCharge) }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Medallion, {
						skill: ui.primary,
						size: 96,
						onDown: () => onPrimary(true),
						onUp: () => onPrimary(false)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: `medallion absolute right-3 top-0 size-11 ${ui.hp / ui.maxHp < .55 ? "animate-pulse" : ""}`,
				onClick: onPotion,
				"aria-label": "Potion",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/game/icons/potion.png",
						alt: ""
					}),
					ui.potionCd > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cd-sweep",
						style: { ["--cd"]: String(Math.min(1, ui.potionCd / 2.6)) }
					}),
					ui.potionCd > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "cd-num text-sm",
						children: Math.ceil(ui.potionCd)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -right-1 -top-1 rounded-sm border border-gold bg-stone px-1 text-[10px] font-bold tabular-nums",
						children: ui.potionCount
					})
				]
			})
		]
	});
}
function Medallion({ skill, size, k, onDown, onUp, pulse }) {
	const cd = skill.maxCd > 0 ? Math.min(1, skill.cd / skill.maxCd) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: `medallion ${skill.cd > 0 ? "is-cd" : ""} ${skill.locked ? "opacity-40" : ""} ${pulse ? "animate-pulse" : ""}`,
		style: {
			width: size,
			height: size
		},
		onPointerDown: (e) => {
			e.preventDefault();
			onDown();
		},
		onPointerUp: onUp,
		onPointerLeave: onUp,
		disabled: skill.locked,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: skill.icon,
				alt: skill.name
			}),
			cd > .02 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cd-sweep",
				style: { ["--cd"]: String(cd) }
			}),
			skill.cd > .15 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "cd-num text-sm tabular-nums",
				children: skill.cd >= 1 ? Math.ceil(skill.cd) : skill.cd.toFixed(1)
			}),
			skill.channel > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-void",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block h-full bg-gold-hi",
					style: { width: `${skill.channel * 100}%` }
				})
			}),
			skill.maxCharges > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pip-row",
				children: Array.from({ length: skill.maxCharges }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pip ${i < skill.charges ? "on" : ""}` }, i))
			}),
			k && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-1/2 top-full mt-0.5 -translate-x-1/2 text-[9px] text-muted",
				children: k
			})
		]
	});
}
function equippedIn(ui, slot) {
	const v = ui.equipped[slot];
	if (Array.isArray(v)) return v[0];
	return v;
}
function Mini({ map, zone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "minimap-rect h-[92px] w-[124px] sm:h-[110px] sm:w-[148px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: `${-map.w / 2} ${-map.h / 2} ${map.w} ${map.h}`,
			className: "h-[72px] w-full bg-void sm:h-[88px]",
			children: [map.ents.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: e.x,
				cy: e.z,
				r: 1.1,
				fill: e.c
			}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: `${map.px},${map.pz - 2.2} ${map.px + 1.6},${map.pz + 1.4} ${map.px - 1.6},${map.pz + 1.4}`,
				fill: "#e8dcc8"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "truncate px-2 py-0.5 text-center text-[9px] tracking-wider text-gold uppercase",
			children: zone
		})]
	});
}
var DOLL = [
	{
		key: "helm",
		slot: "helm",
		label: "Head",
		x: "42%",
		y: "2%"
	},
	{
		key: "shoulders",
		slot: "shoulders",
		label: "Shoulders",
		x: "6%",
		y: "16%"
	},
	{
		key: "chest",
		slot: "chest",
		label: "Chest",
		x: "42%",
		y: "16%"
	},
	{
		key: "amulet",
		slot: "amulet",
		label: "Neck",
		x: "78%",
		y: "16%"
	},
	{
		key: "main",
		slot: "main",
		label: "Main Hand",
		x: "6%",
		y: "38%"
	},
	{
		key: "off",
		slot: "off",
		label: "Off Hand",
		x: "78%",
		y: "38%"
	},
	{
		key: "gloves",
		slot: "gloves",
		label: "Hands",
		x: "6%",
		y: "58%"
	},
	{
		key: "ring0",
		slot: "ring",
		ring: 0,
		label: "Ring",
		x: "78%",
		y: "58%"
	},
	{
		key: "belt",
		slot: "belt",
		label: "Waist",
		x: "42%",
		y: "58%"
	},
	{
		key: "ring1",
		slot: "ring",
		ring: 1,
		label: "Ring",
		x: "78%",
		y: "74%"
	},
	{
		key: "pants",
		slot: "pants",
		label: "Legs",
		x: "6%",
		y: "78%"
	},
	{
		key: "boots",
		slot: "boots",
		label: "Feet",
		x: "42%",
		y: "78%"
	}
];
function wornIn(ui, slot, ring = 0) {
	const v = ui.equipped[slot];
	if (Array.isArray(v)) return v[ring];
	return v;
}
function ItemCell({ item, onEnter, onLeave, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onMouseEnter: onEnter,
		onMouseLeave: onLeave,
		onClick,
		className: `flex h-12 items-center truncate rounded-sm border border-border bg-stone px-2 text-left text-[11px] rarity-${item.rarity}`,
		children: item.name
	});
}
function Inv(p) {
	const [tab, setTab] = (0, import_react.useState)("eq");
	const [sel, setSel] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [err, setErr] = (0, import_react.useState)("");
	const dollRef = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)({
		uid: "",
		t: 0
	});
	const dragUid = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const c = dollRef.current;
		const id = window.requestAnimationFrame(() => p.onPaperdoll(c));
		return () => {
			window.cancelAnimationFrame(id);
			p.onPaperdoll(null);
		};
	}, []);
	const items = p.ui.inventory.filter((it) => {
		if (filter === "all") return true;
		if (filter === "magic" || filter === "rare" || filter === "legendary" || filter === "normal" || filter === "set") return it.rarity === filter;
		return it.slot === filter;
	});
	const cells = Array.from({ length: 60 }, (_, i) => items[i] ?? null);
	const dropOnSlot = (slot, ring) => {
		const uid = dragUid.current || sel?.uid;
		if (!uid) return;
		const it = p.ui.inventory.find((x) => x.uid === uid);
		if (!it) return;
		if (it.slot !== slot) {
			setErr("Won't fit that slot");
			window.setTimeout(() => setErr(""), 900);
			return;
		}
		p.onEquipTo(uid, slot, ring);
		setSel(null);
		dragUid.current = null;
	};
	const tapItem = (it) => {
		const now = performance.now();
		if (lastTap.current.uid === it.uid && now - lastTap.current.t < 380) {
			p.onEquip(it.uid);
			setSel(null);
			lastTap.current = {
				uid: "",
				t: 0
			};
			return;
		}
		lastTap.current = {
			uid: it.uid,
			t: now
		};
		setSel(it);
		p.setHover(it);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-start justify-center bg-void/78 p-2 pt-12 pb-36 sm:items-center sm:pb-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "menu-sheet flex max-h-[min(88dvh,820px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border-b border-gold-lo px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl tracking-wide text-gold-hi",
							children: "Inventory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 text-[11px] text-gold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.ui.gold, " gold"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.ui.materials.scrap, " scrap"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.ui.materials.dust, " dust"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.ui.materials.crystal, " crystal"] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-sm text-muted",
							onClick: () => p.onPanel("none"),
							children: "Close"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 border-b border-gold-lo px-4 py-2 text-[11px] uppercase tracking-wider",
					children: [[
						"eq",
						"gems",
						"mats"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(t),
						className: `rounded-sm px-3 py-1 ${tab === t ? "border border-gold text-gold-hi" : "text-muted"}`,
						children: t === "eq" ? "Equipment" : t === "gems" ? "Gems" : "Materials"
					}, t)), tab === "eq" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "ml-auto rounded-sm border border-gold-lo bg-ash px-2 py-1 text-[11px] text-bone",
						value: filter,
						onChange: (e) => setFilter(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All"
							}),
							SLOTS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: SLOT_LABEL[s]
							}, s)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rare",
								children: "Rare"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "legendary",
								children: "Legendary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "magic",
								children: "Magic"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid min-h-0 flex-1 gap-3 overflow-y-auto p-4 lg:grid-cols-[minmax(240px,320px)_1fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-[min(52dvh,440px)] w-full overflow-hidden rounded-md border border-gold-lo bg-[#1c1712]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
							ref: dollRef,
							className: "absolute inset-0 h-full w-full touch-none",
							onPointerDown: (e) => {
								e.currentTarget.setPointerCapture(e.pointerId);
								let last = e.clientX;
								const move = (ev) => {
									p.onDollYaw((ev.clientX - last) * .008);
									last = ev.clientX;
								};
								const up = () => {
									window.removeEventListener("pointermove", move);
									window.removeEventListener("pointerup", up);
								};
								window.addEventListener("pointermove", move);
								window.addEventListener("pointerup", up);
							}
						}), DOLL.map((d) => {
							const it = wornIn(p.ui, d.slot, d.ring ?? 0);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								style: {
									position: "absolute",
									left: d.x,
									top: d.y,
									zIndex: 10
								},
								className: `inv-socket ${it ? `rarity-${it.rarity}` : ""}`,
								onClick: () => {
									if (sel && sel.slot === d.slot) dropOnSlot(d.slot, d.ring);
									else if (it) p.onUnequip(d.slot, d.ring);
								},
								onDragOver: (e) => e.preventDefault(),
								onDrop: (e) => {
									e.preventDefault();
									const uid = e.dataTransfer.getData("text/uid") || dragUid.current || sel?.uid;
									if (uid) {
										dragUid.current = uid;
										dropOnSlot(d.slot, d.ring);
									}
								},
								onMouseEnter: () => it && p.setHover(it),
								onMouseLeave: () => p.setHover(null),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inv-sil",
									children: it ? it.name.slice(0, 10) : d.label
								})
							}, d.key);
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 flex-col",
						children: [
							sel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm rarity-${sel.rarity}`,
										children: sel.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "rounded-md border border-gold bg-stone px-3 py-2 text-xs",
										onClick: () => p.onEquip(sel.uid),
										children: "Equip"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "rounded-md border border-gold-lo px-3 py-2 text-xs",
										onClick: () => p.setHover(sel),
										children: "Compare"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "rounded-md border border-border px-3 py-2 text-xs text-muted",
										onClick: () => {
											if (sel.rarity === "legendary" || sel.rarity === "set") {
												setErr("Locked — cannot salvage");
												window.setTimeout(() => setErr(""), 900);
												return;
											}
											p.onSalvage(sel.uid);
											setSel(null);
										},
										children: "Salvage"
									})
								]
							}),
							tab === "eq" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inv-grid overflow-y-auto",
								children: cells.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `inv-cell ${it ? `rarity-b-${it.rarity}` : ""} ${sel?.uid === it?.uid ? "is-sel" : ""}`,
									draggable: !!it,
									onDragStart: (e) => {
										if (!it) return;
										dragUid.current = it.uid;
										e.dataTransfer.setData("text/uid", it.uid);
										e.dataTransfer.effectAllowed = "move";
									},
									onClick: () => it && tapItem(it),
									onMouseEnter: () => it && p.setHover(it),
									onMouseLeave: () => p.setHover(null),
									children: it ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-[10px] leading-tight rarity-${it.rarity}`,
										children: it.name
									}) : null
								}, it?.uid ?? "e" + i))
							}),
							tab === "gems" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-1",
								children: [p.ui.inventory.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "No gems yet."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "Socket gems at the Forge-Father. Ranked stones drop from rifts."
								})]
							}),
							tab === "mats" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Scrap · ", p.ui.materials.scrap] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Veil Dust · ", p.ui.materials.dust] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Tear Crystal · ", p.ui.materials.crystal] })
								]
							}),
							err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-blood",
								children: err
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[10px] text-faint",
								children: "Double-tap or drop onto a socket. Drag the paperdoll to turn."
							})
						]
					})]
				})
			]
		})
	});
}
function Stash(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "Stash",
		onClose: () => p.onPanel("none"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs text-muted",
				children: "Carried"
			}), p.ui.inventory.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCell, {
				item: it,
				onEnter: () => p.setHover(it),
				onLeave: () => p.setHover(null),
				onClick: () => p.onStash(it.uid, true)
			}, it.uid))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs text-muted",
				children: "Kept"
			}), p.ui.stash.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCell, {
				item: it,
				onEnter: () => p.setHover(it),
				onLeave: () => p.setHover(null),
				onClick: () => p.onStash(it.uid, false)
			}, it.uid))] })]
		})
	});
}
function Vendor(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Quartermaster",
		onClose: () => p.onPanel("none"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-sm text-muted",
			children: ["Gold: ", p.ui.gold]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-1",
			children: [p.ui.vendor.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Talk to Vesh in town to restock."
			}), p.ui.vendor.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCell, {
				item: it,
				onEnter: () => p.setHover(it),
				onLeave: () => p.setHover(null),
				onClick: () => p.onBuy(it.uid)
			}, it.uid))]
		})]
	});
}
function Smith(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Forge-Father",
		onClose: () => p.onPanel("none"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-xs text-muted",
			children: [
				"Scrap ",
				p.ui.materials.scrap,
				" · Dust ",
				p.ui.materials.dust,
				" · Crystal ",
				p.ui.materials.crystal
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-2",
			children: p.ui.inventory.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCell, {
						item: it,
						onEnter: () => p.setHover(it),
						onLeave: () => p.setHover(null),
						onClick: () => p.onSalvage(it.uid)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-[11px] text-muted",
						onClick: () => p.onReforge(it.uid),
						children: "Reforge"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-[11px] text-muted",
						onClick: () => p.onSocket(it.uid),
						children: "Socket"
					})
				]
			}, it.uid))
		})]
	});
}
function Mystic(p) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Sister Maera",
		onClose: () => p.onPanel("none"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Extract a legendary power into the cube (2 crystal)."
		}), p.ui.inventory.filter((i) => i.legendaryId).map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCell, {
			item: it,
			onEnter: () => p.setHover(it),
			onLeave: () => p.setHover(null),
			onClick: () => p.onExtract(it.uid)
		}, it.uid))]
	});
}
function Skills({ ui, onRune, onPrimary, onLoadout, onClose }) {
	const c = ui.classId ? CLASSES[ui.classId] : CLASSES.barbarian;
	const primaries = c.skills.filter((s) => roleOf(s) === "primary");
	const skills = c.skills.filter((s) => roleOf(s) === "skill");
	const equipped = new Set(ui.skills.map((s) => s.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Skills",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[11px] uppercase tracking-wider text-gold",
				children: "Primary Attack"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-2",
				children: primaries.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPrimary(s.id),
					className: `flex items-center gap-2 rounded-md border px-3 py-2 ${ui.primary?.id === s.id ? "border-gold" : "border-border"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.icon,
						alt: "",
						className: "size-10 rounded-full"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-left text-sm",
						children: s.name
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[11px] uppercase tracking-wider text-gold",
				children: "Loadout — tap to equip"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2",
				children: skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						if (equipped.has(s.id)) return;
						onLoadout(0, s.id);
					},
					className: `flex items-center gap-3 rounded-md border bg-ash px-3 py-2 text-left ${equipped.has(s.id) ? "border-gold" : "border-border"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.icon,
							alt: "",
							className: "size-11 rounded-full"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-display",
								children: [
									s.name,
									" ",
									equipped.has(s.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-gold",
										children: "Equipped"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: s.desc
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-muted",
							onClick: (e) => {
								e.stopPropagation();
								onRune(s.id);
							},
							children: "Rune"
						})
					]
				}, s.id))
			})
		]
	});
}
function Quests({ ui, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Codex & Quests",
		onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed",
			children: ui.questText
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs text-muted",
			children: "Act of Thornwatch. The Black Choir still sings."
		})]
	});
}
function Rifts({ ui, onRift, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Challenge Rifts",
		onClose,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-sm text-muted",
				children: "Ten minutes. Density. A guardian. Your best is local to this lantern."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: Array.from({ length: 10 }, (_, i) => i + 1).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "min-h-11 rounded-md border border-border bg-stone px-3 text-sm",
					onClick: () => onRift(t),
					children: ["T", t]
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted",
				children: [
					"World boss in ",
					Math.ceil(ui.worldBossIn),
					"s · Choir Vault via Io"
				]
			})
		]
	});
}
function Bounties({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: "Weekly Board",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Season 1 — The First Tear. Bounties refresh with the week. Turn them in by completing the work in the field."
		})
	});
}
function PauseMenu({ ui, onDiff, onParagon, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: "Pause",
		onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase text-muted",
				children: "Difficulty"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: Object.keys(DIFFICULTY).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `rounded-md border px-2 py-1 text-xs ${ui.difficulty === d ? "border-bone" : "border-border"}`,
					onClick: () => onDiff(d),
					children: DIFFICULTY[d].name
				}, d))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs uppercase text-muted",
				children: ["Paragon ", ui.paragon]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: [
					"core",
					"offense",
					"defense",
					"utility"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-md border border-border px-2 py-1 text-xs capitalize",
					onClick: () => onParagon(k),
					children: k
				}, k))
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs text-faint",
			children: "Shake, numbers, and pickup live in the save. The veil does not pause for long."
		})]
	});
}
function Tip({ item, eq }) {
	const dmg = itemDamage(item);
	const life = itemLife(item);
	const cr = itemCR(item);
	const dmgE = eq ? itemDamage(eq) : 0;
	const lifeE = eq ? itemLife(eq) : 0;
	const crE = eq ? itemCR(eq) : 0;
	const row = (label, a, b) => {
		const d = a - b;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [a, eq ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: d > 0 ? "text-emerald-400" : d < 0 ? "text-blood" : "text-muted",
				children: [d > 0 ? " ↑" : d < 0 ? " ↓" : "", d !== 0 ? Math.abs(d) : ""]
			}) : null] })]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pointer-events-none absolute right-4 top-24 z-40 w-72 hud-panel rounded-lg p-3 text-xs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `font-display text-sm rarity-${item.rarity}`,
				children: item.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted",
				children: [
					SLOT_LABEL[item.slot],
					" · Barbarian",
					item.sockets ? ` · ${item.sockets} sockets` : ""
				]
			}),
			!item.identified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 italic text-muted",
				children: "Unidentified"
			}),
			item.identified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 space-y-0.5",
				children: [
					row("Damage", dmg, dmgE),
					row("Life", life, lifeE),
					row("Combat Rating", cr, crE),
					item.affixes.slice(0, 3).map((a, i) => {
						const ev = eq?.affixes.find((x) => x.id === a.id)?.value ?? 0;
						const d = a.value - ev;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatAffix(a) }), eq && d !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: d > 0 ? "text-emerald-400" : "text-blood",
								children: d > 0 ? "↑" : "↓"
							})]
						}, i);
					})
				]
			}),
			item.legendaryId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-legend",
				children: LEGENDARIES.find((l) => l.id === item.legendaryId)?.desc
			}),
			item.reqLevel > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-muted",
				children: ["Required level ", item.reqLevel]
			})
		]
	});
}
function Modal({ title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-start justify-center bg-void/70 p-3 pt-14 pb-40 sm:items-center sm:pb-36",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "menu-sheet max-h-[min(82dvh,720px)] w-full max-w-3xl overflow-y-auto rounded-xl p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl tracking-wide text-gold-hi",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-sm text-muted",
					onClick: onClose,
					children: "Close"
				})]
			}), children]
		})
	});
}
function Stick({ onStick }) {
	const ref = (0, import_react.useRef)(null);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const apply = (e) => {
		const el = ref.current;
		if (!el) return;
		const r = el.getBoundingClientRect();
		const x = (e.clientX - r.left) / r.width * 2 - 1;
		const y = (e.clientY - r.top) / r.height * 2 - 1;
		const m = Math.hypot(x, y) || 1;
		const s = Math.min(1, m);
		const nx = x / m * s;
		const ny = y / m * s;
		setKnob({
			x: nx,
			y: ny
		});
		onStick(nx, ny);
	};
	const clear = () => {
		setKnob({
			x: 0,
			y: 0
		});
		onStick(0, 0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: "stick-well absolute bottom-5 left-4 z-20 size-32 touch-none sm:bottom-7 sm:left-6",
		onPointerDown: (e) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			apply(e);
		},
		onPointerMove: (e) => e.buttons && apply(e),
		onPointerUp: clear,
		onPointerCancel: clear,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "stick-knob",
			style: { transform: `translate(${knob.x * 36}px, ${knob.y * 36}px)` }
		})
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {});
}
//#endregion
export { iconFor as D, defaultUlt as E, roleOf as O, SHRINES as S, defaultPrimary as T, MONSTERS as _, identify as a, SEASON_NAME as b, rollItem as c, BIOME_MONSTERS as d, CHAMPION_AFFIXES as f, LEGENDARIES as g, xpToNext as k, salvageValue as l, DIFFICULTY as m, isPc as n, randomGem as o, CLASSES as p, Rng as r, rarityFor as s, routes_exports as t, ACT_BOSSES as u, NPCS as v, defaultLoadout as w, QUESTS as y };
