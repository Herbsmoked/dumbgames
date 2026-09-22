import { C as defaultLoadout, D as roleOf, E as iconFor, O as xpToNext, T as defaultUlt, _ as NPCS, a as randomGem, c as salvageValue, d as CHAMPION_AFFIXES, f as CLASSES, g as MONSTERS, h as LEGENDARIES, i as identify, l as ACT_BOSSES, n as Rng, o as rarityFor, p as DIFFICULTY, s as rollItem, u as BIOME_MONSTERS, v as QUESTS, w as defaultPrimary, x as SHRINES, y as SEASON_NAME } from "./routes-Csje0xVT.mjs";
import { A as OrthographicCamera, B as ShapeGeometry, C as HemisphereLight, D as MeshBasicMaterial, E as Mesh, F as RepeatWrapping, G as TorusGeometry, H as Sprite, I as RingGeometry, K as Vector2, L as SRGBColorSpace, M as PlaneGeometry, N as PointLight, O as MeshStandardMaterial, P as Raycaster, R as Scene, S as Group, T as MathUtils, U as SpriteMaterial, V as SphereGeometry, W as TextureLoader, _ as Color, a as EffectComposer, b as DirectionalLight, c as WebGLRenderer, d as BufferAttribute, f as BufferGeometry, g as Clock, h as CircleGeometry, i as RenderPass, j as Plane, k as OctahedronGeometry, l as AmbientLight, m as CapsuleGeometry, n as FXAAPass, o as ShaderPass, p as CanvasTexture, q as Vector3, r as UnrealBloomPass, s as PMREMGenerator, t as OutputPass, u as BoxGeometry, v as ConeGeometry, w as LatheGeometry, x as FogExp2, y as CylinderGeometry, z as Shape } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine-DMerrHZ_.js
var GameAudio = class {
	ctx = null;
	master = null;
	sfx = null;
	music = null;
	muted = false;
	sfxVol = .8;
	musicVol = .35;
	drone = null;
	drone2 = null;
	unlock() {
		if (!this.ctx) {
			const Ctx = window.AudioContext || window.webkitAudioContext;
			this.ctx = new Ctx({ latencyHint: "interactive" });
			this.master = this.ctx.createGain();
			this.sfx = this.ctx.createGain();
			this.music = this.ctx.createGain();
			this.sfx.connect(this.master);
			this.music.connect(this.master);
			this.master.connect(this.ctx.destination);
			this.apply();
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	apply() {
		if (!this.master || !this.sfx || !this.music || !this.ctx) return;
		const t = this.ctx.currentTime;
		this.master.gain.setTargetAtTime(this.muted ? 0 : 1, t, .03);
		this.sfx.gain.setTargetAtTime(this.sfxVol * this.sfxVol, t, .03);
		this.music.gain.setTargetAtTime(this.musicVol * this.musicVol, t, .03);
	}
	hit(crit = false) {
		this.noise(.05, crit ? .35 : .22, crit ? 900 : 280, crit ? .08 : .05);
		this.tone(crit ? 520 : 180, crit ? .12 : .07, "square", crit ? .08 : .05);
	}
	swing() {
		this.noise(.04, .12, 700, .06);
	}
	death() {
		this.noise(.18, .4, 140, .16);
		this.tone(90, .2, "sawtooth", .12);
	}
	legendary() {
		this.tone(220, .45, "sine", .12);
		this.tone(330, .5, "sine", .1);
		this.tone(440, .55, "sine", .08);
		this.tone(554, .7, "sine", .07);
	}
	potion() {
		this.tone(320, .15, "sine", .06);
		this.tone(480, .18, "sine", .05);
	}
	pickup() {
		this.tone(660, .08, "square", .04);
	}
	rift() {
		this.tone(55, .6, "sawtooth", .16);
		this.noise(.3, .25, 80, .2);
	}
	ui() {
		this.tone(420, .05, "square", .03);
	}
	startDrone(hell = false) {
		this.stopDrone();
		if (!this.ctx || !this.music) return;
		const o = this.ctx.createOscillator();
		const o2 = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		g.gain.value = .04;
		o.type = "sine";
		o2.type = "sine";
		o.frequency.value = hell ? 46 : 58;
		o2.frequency.value = hell ? 92.2 : 87.5;
		o.connect(g);
		o2.connect(g);
		g.connect(this.music);
		o.start();
		o2.start();
		this.drone = o;
		this.drone2 = o2;
	}
	stopDrone() {
		try {
			this.drone?.stop();
			this.drone2?.stop();
		} catch {}
		this.drone = null;
		this.drone2 = null;
	}
	tone(freq, dur, type, vol) {
		if (!this.ctx || !this.sfx) return;
		const o = this.ctx.createOscillator();
		const g = this.ctx.createGain();
		o.type = type;
		o.frequency.value = freq * (.96 + Math.random() * .08);
		g.gain.setValueAtTime(vol, this.ctx.currentTime);
		g.gain.exponentialRampToValueAtTime(1e-4, this.ctx.currentTime + dur);
		o.connect(g);
		g.connect(this.sfx);
		o.start();
		o.stop(this.ctx.currentTime + dur + .02);
	}
	noise(dur, vol, hp, release) {
		if (!this.ctx || !this.sfx) return;
		const n = this.ctx.sampleRate * dur;
		const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
		const d = buf.getChannelData(0);
		for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
		const src = this.ctx.createBufferSource();
		src.buffer = buf;
		const f = this.ctx.createBiquadFilter();
		f.type = "bandpass";
		f.frequency.value = hp;
		const g = this.ctx.createGain();
		g.gain.setValueAtTime(vol, this.ctx.currentTime);
		g.gain.exponentialRampToValueAtTime(1e-4, this.ctx.currentTime + release);
		src.connect(f);
		f.connect(g);
		g.connect(this.sfx);
		src.start();
	}
};
function rectWalls(x, z, w, d, t = .7) {
	return [
		{
			x,
			z: z - d / 2,
			w: w + t * 2,
			d: t
		},
		{
			x,
			z: z + d / 2,
			w: w + t * 2,
			d: t
		},
		{
			x: x - w / 2,
			z,
			w: t,
			d
		},
		{
			x: x + w / 2,
			z,
			w: t,
			d
		}
	];
}
function carveDoor(walls, from, to) {
	const dx = to.x - from.x;
	const dz = to.z - from.z;
	const gap = 1.85;
	if (Math.abs(dx) > Math.abs(dz)) {
		const side = dx > 0 ? 1 : -1;
		const x = from.x + side * (from.w / 2);
		for (let i = walls.length - 1; i >= 0; i--) {
			const w = walls[i];
			if (Math.abs(w.x - x) < 1.2 && Math.abs(w.z - from.z) < from.d / 2 && w.d > w.w) {
				walls.splice(i, 1);
				const wing = w.d / 2 - gap;
				if (wing > .35) {
					walls.push({
						x: w.x,
						z: from.z - gap - wing / 2,
						w: w.w,
						d: wing
					});
					walls.push({
						x: w.x,
						z: from.z + gap + wing / 2,
						w: w.w,
						d: wing
					});
				}
			}
		}
	} else {
		const side = dz > 0 ? 1 : -1;
		const z = from.z + side * (from.d / 2);
		for (let i = walls.length - 1; i >= 0; i--) {
			const w = walls[i];
			if (Math.abs(w.z - z) < 1.2 && Math.abs(w.x - from.x) < from.w / 2 && w.w > w.d) {
				walls.splice(i, 1);
				const wing = w.w / 2 - gap;
				if (wing > .35) {
					walls.push({
						x: from.x - gap - wing / 2,
						z: w.z,
						w: wing,
						d: w.d
					});
					walls.push({
						x: from.x + gap + wing / 2,
						z: w.z,
						w: wing,
						d: w.d
					});
				}
			}
		}
	}
}
function corridorWalls(from, to, width = 3.6, t = .65) {
	const dx = to.x - from.x;
	const dz = to.z - from.z;
	const walls = [];
	if (Math.abs(dx) >= Math.abs(dz)) {
		const dir = dx >= 0 ? 1 : -1;
		const x0 = from.x + dir * (from.w / 2);
		const x1 = to.x - dir * (to.w / 2);
		const z0 = from.z;
		const z1 = to.z;
		const midX = (x0 + x1) / 2;
		const len = Math.max(1.2, Math.abs(x1 - x0));
		walls.push({
			x: midX,
			z: z0 - width / 2,
			w: len + t,
			d: t
		});
		walls.push({
			x: midX,
			z: z0 + width / 2,
			w: len + t,
			d: t
		});
		if (Math.abs(z1 - z0) > .8) {
			const midZ = (z0 + z1) / 2;
			const zlen = Math.abs(z1 - z0);
			walls.push({
				x: x1 - width / 2,
				z: midZ,
				w: t,
				d: zlen + t
			});
			walls.push({
				x: x1 + width / 2,
				z: midZ,
				w: t,
				d: zlen + t
			});
		}
	} else {
		const dir = dz >= 0 ? 1 : -1;
		const z0 = from.z + dir * (from.d / 2);
		const z1 = to.z - dir * (to.d / 2);
		const x0 = from.x;
		const x1 = to.x;
		const midZ = (z0 + z1) / 2;
		const len = Math.max(1.2, Math.abs(z1 - z0));
		walls.push({
			x: x0 - width / 2,
			z: midZ,
			w: t,
			d: len + t
		});
		walls.push({
			x: x0 + width / 2,
			z: midZ,
			w: t,
			d: len + t
		});
		if (Math.abs(x1 - x0) > .8) {
			const midX = (x0 + x1) / 2;
			const xlen = Math.abs(x1 - x0);
			walls.push({
				x: midX,
				z: z1 - width / 2,
				w: xlen + t,
				d: t
			});
			walls.push({
				x: midX,
				z: z1 + width / 2,
				w: xlen + t,
				d: t
			});
		}
	}
	return walls;
}
function corridorInterior(from, to, width = 3.4) {
	const dx = to.x - from.x;
	const dz = to.z - from.z;
	if (Math.abs(dx) >= Math.abs(dz)) {
		const dir = dx >= 0 ? 1 : -1;
		const x0 = from.x + dir * (from.w / 2);
		const x1 = to.x - dir * (to.w / 2);
		return {
			x: (x0 + x1) / 2,
			z: from.z,
			w: Math.max(1.4, Math.abs(x1 - x0) + 1.2),
			d: width
		};
	}
	const dir = dz >= 0 ? 1 : -1;
	const z0 = from.z + dir * (from.d / 2);
	const z1 = to.z - dir * (to.d / 2);
	return {
		x: from.x,
		z: (z0 + z1) / 2,
		w: width,
		d: Math.max(1.4, Math.abs(z1 - z0) + 1.2)
	};
}
function generateDungeon(opts) {
	const rng = new Rng(opts.seed);
	const rooms = [];
	const n = opts.isRift ? 7 + Math.min(6, opts.riftTier ?? 1) : 6 + rng.int(0, 3);
	const kinds = ["start"];
	for (let i = 1; i < n - 1; i++) {
		const roll = rng.next();
		if (roll < .12) kinds.push("shrine");
		else if (roll < .22) kinds.push("treasure");
		else if (roll < .4) kinds.push("elite");
		else if (roll < .5) kinds.push("event");
		else kinds.push("combat");
	}
	kinds.push(opts.wantBoss !== false ? "boss" : "combat");
	if (rng.chance(.7)) kinds.splice(Math.max(2, n - 3), 0, "secret");
	const spacing = 22;
	let x = 0, z = 0;
	const used = /* @__PURE__ */ new Set("0,0");
	for (let i = 0; i < kinds.length; i++) {
		const w = 14 + rng.int(0, 6);
		const d = 12 + rng.int(0, 6);
		rooms.push({
			kind: kinds[i],
			x,
			z,
			w,
			d,
			biome: opts.biome
		});
		const dirs = [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
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
	const walls = [];
	const halls = [];
	for (const r of rooms) walls.push(...rectWalls(r.x, r.z, r.w, r.d));
	for (let i = 0; i < rooms.length - 1; i++) {
		const a = rooms[i];
		const b = rooms[i + 1];
		carveDoor(walls, a, b);
		carveDoor(walls, b, a);
		walls.push(...corridorWalls(a, b));
		halls.push(corridorInterior(a, b));
	}
	const mons = BIOME_MONSTERS[opts.biome] ?? BIOME_MONSTERS.cathedral;
	const spawns = [];
	const props = [];
	const start = rooms[0];
	for (const r of rooms) {
		if (r.kind === "start") {
			props.push({
				kind: "portal",
				x: r.x,
				z: r.z - r.d / 2 + 2
			});
			for (let i = 0; i < 9; i++) {
				const a = rng.next() * Math.PI * 2;
				const rad = 2.2 + rng.next() * 3.4;
				spawns.push({
					x: r.x + Math.cos(a) * rad,
					z: r.z + Math.sin(a) * rad,
					monster: rng.pick(mons)
				});
			}
			continue;
		}
		if (r.kind === "boss") {
			const bossId = opts.isRift ? "guardian" : ACT_BOSSES[Math.max(0, opts.act - 1)] ?? "maltheon";
			spawns.push({
				x: r.x,
				z: r.z,
				monster: bossId,
				boss: true,
				elite: true
			});
			props.push({
				kind: "exit",
				x: r.x,
				z: r.z + r.d / 2 - 2.5
			});
			continue;
		}
		if (r.kind === "shrine") props.push({
			kind: "shrine",
			x: r.x,
			z: r.z,
			shrine: rng.pick([
				"speed",
				"damage",
				"loot",
				"res"
			])
		});
		if (r.kind === "treasure" || r.kind === "secret") {
			props.push({
				kind: "chest",
				x: r.x,
				z: r.z
			});
			if (r.kind === "secret") props.push({
				kind: "chest",
				x: r.x + 2,
				z: r.z
			});
		}
		const pack = r.kind === "elite" ? rng.int(8, 12) : r.kind === "event" ? rng.int(14, 20) : rng.int(10, 16);
		for (let i = 0; i < pack; i++) {
			const a = rng.next() * Math.PI * 2;
			const rad = 1.5 + rng.next() * Math.min(r.w, r.d) * .28;
			const champ = r.kind === "elite" && i === 0 ? [rng.pick([...CHAMPION_AFFIXES]), rng.chance(.5) ? rng.pick([...CHAMPION_AFFIXES]) : "extraLife"] : void 0;
			spawns.push({
				x: r.x + Math.cos(a) * rad,
				z: r.z + Math.sin(a) * rad,
				monster: r.kind === "elite" && i === 0 ? "brute" : rng.pick(mons),
				elite: r.kind === "elite" && i < 2,
				champion: champ
			});
		}
		if (r.kind === "combat" && rng.chance(.25)) props.push({
			kind: "chest",
			x: r.x + r.w / 2 - 2,
			z: r.z
		});
	}
	let minx = Infinity, maxx = -Infinity, minz = Infinity, maxz = -Infinity;
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
		bounds: {
			x: (minx + maxx) / 2,
			z: (minz + maxz) / 2,
			w: maxx - minx + 8,
			d: maxz - minz + 8
		},
		fog: opts.biome === "hell" ? .022 : opts.biome === "ice" ? .012 : .016,
		ambient: opts.biome === "hell" ? .62 : .52,
		seed: opts.seed,
		isRift: opts.isRift,
		riftTier: opts.riftTier,
		corridors: halls
	};
}
function generateTown() {
	const walls = [...rectWalls(0, 0, 42, 32, 1.35)];
	walls.push(...[
		{
			x: -12,
			z: -8,
			w: 7,
			d: 6
		},
		{
			x: 12,
			z: -8,
			w: 7,
			d: 6
		},
		{
			x: -12,
			z: 8,
			w: 7,
			d: 6
		},
		{
			x: 12,
			z: 8,
			w: 7,
			d: 6
		},
		{
			x: 0,
			z: -12,
			w: 8,
			d: 5
		}
	]);
	return {
		name: "Thornwatch",
		biome: "town",
		rooms: [{
			kind: "start",
			x: 0,
			z: 0,
			w: 48,
			d: 36,
			biome: "town"
		}],
		walls,
		spawns: [],
		props: [
			{
				kind: "npc",
				x: -2.2,
				z: -.4,
				npcId: "ryn"
			},
			{
				kind: "blacksmith",
				x: -12,
				z: 3.4
			},
			{
				kind: "npc",
				x: -12,
				z: 4.8,
				npcId: "kael"
			},
			{
				kind: "mystic",
				x: 12,
				z: 3.4
			},
			{
				kind: "npc",
				x: 12,
				z: 4.8,
				npcId: "maera"
			},
			{
				kind: "vendor",
				x: 12,
				z: -3.6
			},
			{
				kind: "npc",
				x: 12,
				z: -2.2,
				npcId: "vesh"
			},
			{
				kind: "stash",
				x: -12,
				z: -3.6
			},
			{
				kind: "npc",
				x: -12,
				z: -2.2,
				npcId: "brann"
			},
			{
				kind: "riftstone",
				x: 0,
				z: 1.6
			},
			{
				kind: "npc",
				x: 2.4,
				z: 1.6,
				npcId: "io"
			},
			{
				kind: "portal",
				x: 0,
				z: -10.2
			},
			{
				kind: "bounty",
				x: -5.5,
				z: 5.5
			}
		],
		playerX: 0,
		playerZ: 3.2,
		bounds: {
			x: 0,
			z: 0,
			w: 42,
			d: 32
		},
		fog: .008,
		ambient: .58,
		seed: 1,
		isTown: true
	};
}
function isWalkable(level, x, z) {
	if (level.isTown) {
		const b = level.bounds;
		return Math.abs(x - b.x) <= b.w / 2 - .9 && Math.abs(z - b.z) <= b.d / 2 - .9;
	}
	for (const r of level.rooms) if (Math.abs(x - r.x) <= r.w / 2 - .4 && Math.abs(z - r.z) <= r.d / 2 - .4) return true;
	for (const c of level.corridors ?? []) if (Math.abs(x - c.x) <= c.w / 2 && Math.abs(z - c.z) <= c.d / 2) return true;
	return false;
}
function circleHitsAABB(x, z, r, b) {
	const nx = Math.max(b.x - b.w / 2, Math.min(x, b.x + b.w / 2));
	const nz = Math.max(b.z - b.d / 2, Math.min(z, b.z + b.d / 2));
	const dx = x - nx;
	const dz = z - nz;
	return dx * dx + dz * dz < r * r;
}
function resolveWalls(x, z, r, walls) {
	let px = x, pz = z;
	for (let i = 0; i < 3; i++) for (const b of walls) {
		if (!circleHitsAABB(px, pz, r, b)) continue;
		const nx = Math.max(b.x - b.w / 2, Math.min(px, b.x + b.w / 2));
		const nz = Math.max(b.z - b.d / 2, Math.min(pz, b.z + b.d / 2));
		let dx = px - nx;
		let dz = pz - nz;
		const m = Math.hypot(dx, dz) || 1e-4;
		const push = r - m + .01;
		if (push > 0) {
			px += dx / m * push;
			pz += dz / m * push;
		}
	}
	return {
		x: px,
		z: pz
	};
}
var SKILL_CODES = [
	"Digit1",
	"Digit2",
	"Digit3",
	"Digit4"
];
var SKILL_KEYS = [
	"1",
	"2",
	"3",
	"4"
];
function radial(x, y, dz = .18) {
	const m = Math.hypot(x, y);
	if (m < dz) return {
		x: 0,
		y: 0
	};
	const s = (m - dz) / (1 - dz) / m;
	return {
		x: x * s,
		y: y * s
	};
}
var Input = class {
	keys = /* @__PURE__ */ new Set();
	forced = /* @__PURE__ */ new Set();
	pointer = {
		x: 0,
		y: 0,
		down: false,
		right: false,
		id: -1
	};
	leftStick = {
		x: 0,
		y: 0
	};
	hudPrimary = false;
	hudSkills = [
		false,
		false,
		false,
		false
	];
	hudUlt = false;
	hudPotion = false;
	prev;
	actions;
	canvas;
	unbind = [];
	constructor(canvas) {
		this.canvas = canvas;
		this.prev = this.empty();
		this.actions = this.empty();
		const onDown = (e) => {
			this.keys.add(e.code);
			if ([
				"Space",
				"ArrowUp",
				"ArrowDown",
				"ArrowLeft",
				"ArrowRight"
			].includes(e.code)) e.preventDefault();
		};
		const onUp = (e) => this.keys.delete(e.code);
		const clear = () => this.keys.clear();
		const pd = (e) => {
			this.updPtr(e);
			if (e.pointerType === "mouse" && e.button === 2) {
				this.pointer.right = true;
				e.preventDefault();
				return;
			}
			if (e.pointerType === "mouse" && e.button !== 0) return;
			this.pointer.down = true;
			this.pointer.id = e.pointerId;
		};
		const pm = (e) => this.updPtr(e);
		const pu = (e) => {
			if (e.pointerType === "mouse" && e.button === 2) this.pointer.right = false;
			if (e.pointerId === this.pointer.id || e.pointerType === "mouse" && e.button === 0) this.pointer.down = false;
		};
		const noCtx = (e) => e.preventDefault();
		window.addEventListener("keydown", onDown);
		window.addEventListener("keyup", onUp);
		window.addEventListener("blur", clear);
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) clear();
		});
		canvas.addEventListener("pointerdown", pd);
		canvas.addEventListener("contextmenu", noCtx);
		window.addEventListener("pointermove", pm);
		window.addEventListener("pointerup", pu);
		window.addEventListener("pointercancel", pu);
		this.unbind.push(() => window.removeEventListener("keydown", onDown), () => window.removeEventListener("keyup", onUp), () => window.removeEventListener("blur", clear), () => canvas.removeEventListener("pointerdown", pd), () => canvas.removeEventListener("contextmenu", noCtx), () => window.removeEventListener("pointermove", pm), () => window.removeEventListener("pointerup", pu), () => window.removeEventListener("pointercancel", pu));
	}
	setVirtualStick(x, y) {
		this.leftStick = {
			x,
			y
		};
	}
	setHudPrimary(v) {
		this.hudPrimary = v;
	}
	setHudSkill(i, v) {
		this.hudSkills[i] = v;
	}
	setHudUlt(v) {
		this.hudUlt = v;
	}
	setHudPotion(v) {
		this.hudPotion = v;
	}
	setKeys(codes) {
		this.forced = new Set(codes);
	}
	dispose() {
		for (const u of this.unbind) u();
	}
	poll() {
		this.prev = this.actions;
		const has = (c) => this.keys.has(c) || this.forced.has(c);
		let mx = 0, my = 0;
		if (has("KeyA") || has("ArrowLeft")) mx -= 1;
		if (has("KeyD") || has("ArrowRight")) mx += 1;
		if (has("KeyW") || has("ArrowUp")) my -= 1;
		if (has("KeyS") || has("ArrowDown")) my += 1;
		mx += this.leftStick.x;
		my += this.leftStick.y;
		const gp = navigator.getGamepads?.()[0];
		if (gp) {
			const st = radial(gp.axes[0] ?? 0, gp.axes[1] ?? 0);
			mx += st.x;
			my += st.y;
		}
		const ml = Math.hypot(mx, my);
		if (ml > 1) {
			mx /= ml;
			my /= ml;
		}
		const skills = SKILL_CODES.map((c, i) => has(c) || !!this.hudSkills[i]);
		if (gp) {
			if (gp.buttons[4]?.pressed) skills[0] = true;
			if (gp.buttons[5]?.pressed) skills[1] = true;
			if (gp.buttons[6]?.pressed) skills[2] = true;
			if (gp.buttons[7]?.pressed) skills[3] = true;
		}
		const primary = has("Space") || this.pointer.down || this.hudPrimary || !!gp?.buttons[1]?.pressed;
		const potion = has("KeyR") || this.hudPotion || !!gp?.buttons[3]?.pressed;
		const ultimate = has("KeyQ") || this.hudUlt || !!gp?.buttons[2]?.pressed;
		const interact = has("KeyE") || has("KeyG") || !!gp?.buttons[0]?.pressed;
		const forceMove = has("KeyF");
		const inv = has("KeyI") || has("Tab") || has("KeyC") || has("KeyB");
		const pause = has("Escape") || has("KeyP");
		const a = {
			moveX: mx,
			moveY: my,
			pointerNdcX: this.pointer.x,
			pointerNdcY: this.pointer.y,
			pointerDown: this.pointer.down,
			pointerJust: false,
			rightDown: this.pointer.right,
			rightJust: false,
			primary,
			primaryJust: false,
			primaryReleased: false,
			skills,
			skillJust: skills.map(() => false),
			skillReleased: skills.map(() => false),
			ultimate,
			ultimateJust: false,
			potion,
			potionJust: false,
			interact,
			interactJust: false,
			forceMove,
			inv,
			invJust: false,
			pause,
			pauseJust: false
		};
		a.pointerJust = a.pointerDown && !this.prev.pointerDown;
		a.rightJust = a.rightDown && !this.prev.rightDown;
		a.primaryJust = a.primary && !this.prev.primary;
		a.primaryReleased = !a.primary && this.prev.primary;
		a.potionJust = a.potion && !this.prev.potion;
		a.ultimateJust = a.ultimate && !this.prev.ultimate;
		a.interactJust = a.interact && !this.prev.interact;
		a.invJust = a.inv && !this.prev.inv;
		a.pauseJust = a.pause && !this.prev.pause;
		a.skillJust = a.skills.map((s, i) => s && !this.prev.skills[i]);
		a.skillReleased = a.skills.map((s, i) => !s && this.prev.skills[i]);
		this.actions = a;
		return a;
	}
	updPtr(e) {
		const r = this.canvas.getBoundingClientRect();
		if (r.width < 1 || r.height < 1) return;
		this.pointer.x = (e.clientX - r.left) / r.width * 2 - 1;
		this.pointer.y = -((e.clientY - r.top) / r.height * 2 - 1);
	}
	empty() {
		return {
			moveX: 0,
			moveY: 0,
			pointerNdcX: 0,
			pointerNdcY: 0,
			pointerDown: false,
			pointerJust: false,
			rightDown: false,
			rightJust: false,
			primary: false,
			primaryJust: false,
			primaryReleased: false,
			skills: SKILL_KEYS.map(() => false),
			skillJust: SKILL_KEYS.map(() => false),
			skillReleased: SKILL_KEYS.map(() => false),
			ultimate: false,
			ultimateJust: false,
			potion: false,
			potionJust: false,
			interact: false,
			interactJust: false,
			forceMove: false,
			inv: false,
			invJust: false,
			pause: false,
			pauseJust: false
		};
	}
};
function detectQuality() {
	const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
	const mobile = /Mobi|Android|iPhone|iPad/i.test(ua) || typeof window !== "undefined" && window.innerWidth < 820;
	const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 8 : 8;
	const low = mobile || cores <= 4;
	const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
	return {
		low,
		mobile,
		dpr: low ? Math.min(1, dpr) : Math.min(dpr, 1.75),
		shadows: true,
		shadowMap: low ? 512 : 2048,
		bloom: !low,
		grain: !low,
		particles: low ? .42 : 1,
		maxLights: low ? 5 : 14,
		env: !low
	};
}
var ALBEDO = {
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
	wood: "/game/textures/wood-dark.jpg"
};
function loadTex(src, srgb) {
	return new Promise((res) => {
		const loader = new TextureLoader();
		loader.crossOrigin = "anonymous";
		const tmo = window.setTimeout(() => res(null), 6e3);
		loader.load(src, (t) => {
			window.clearTimeout(tmo);
			t.colorSpace = srgb ? SRGBColorSpace : "";
			t.wrapS = t.wrapT = RepeatWrapping;
			t.anisotropy = 8;
			t.needsUpdate = true;
			res(t);
		}, void 0, () => {
			window.clearTimeout(tmo);
			res(null);
		});
	});
}
function deriveMaps(albedo, bump = 2.4) {
	const img = albedo.image;
	const w = Math.min(256, (img && "width" in img ? img.width : 256) || 256);
	const h = Math.min(256, (img && "height" in img ? img.height : 256) || 256);
	const src = document.createElement("canvas");
	src.width = w;
	src.height = h;
	const sctx = src.getContext("2d");
	if (img) sctx.drawImage(img, 0, 0, w, h);
	const px = sctx.getImageData(0, 0, w, h).data;
	const lum = new Float32Array(w * h);
	for (let i = 0; i < w * h; i++) {
		const o = i * 4;
		lum[i] = (px[o] * .3 + px[o + 1] * .59 + px[o + 2] * .11) / 255;
	}
	const ncv = document.createElement("canvas");
	ncv.width = w;
	ncv.height = h;
	const nctx = ncv.getContext("2d");
	const nimg = nctx.createImageData(w, h);
	const rcv = document.createElement("canvas");
	rcv.width = w;
	rcv.height = h;
	const rctx = rcv.getContext("2d");
	const rimg = rctx.createImageData(w, h);
	const acv = document.createElement("canvas");
	acv.width = w;
	acv.height = h;
	const actx = acv.getContext("2d");
	const aimg = actx.createImageData(w, h);
	const at = (x, y) => lum[(y + h) % h * w + (x + w) % w];
	for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
		const dx = (at(x + 1, y) - at(x - 1, y)) * bump;
		const dy = (at(x, y + 1) - at(x, y - 1)) * bump;
		const inv = 1 / Math.hypot(dx, dy, 1);
		const i = (y * w + x) * 4;
		nimg.data[i] = Math.round(-dx * inv * 127 + 128);
		nimg.data[i + 1] = Math.round(-dy * inv * 127 + 128);
		nimg.data[i + 2] = Math.round(1 * inv * 127 + 128);
		nimg.data[i + 3] = 255;
		const L = at(x, y);
		const rough = Math.max(.16, Math.min(.97, .9 - L * .5 + (1 - L) * .14));
		rimg.data[i] = rimg.data[i + 1] = rimg.data[i + 2] = Math.round(rough * 255);
		rimg.data[i + 3] = 255;
		const ao = Math.max(.28, Math.min(1, .48 + L * .55));
		aimg.data[i] = aimg.data[i + 1] = aimg.data[i + 2] = Math.round(ao * 255);
		aimg.data[i + 3] = 255;
	}
	nctx.putImageData(nimg, 0, 0);
	rctx.putImageData(rimg, 0, 0);
	actx.putImageData(aimg, 0, 0);
	const mk = (cv, srgb) => {
		const t = new CanvasTexture(cv);
		t.colorSpace = srgb ? SRGBColorSpace : "";
		t.wrapS = t.wrapT = RepeatWrapping;
		t.needsUpdate = true;
		return t;
	};
	return {
		normal: mk(ncv, false),
		rough: mk(rcv, false),
		ao: mk(acv, false)
	};
}
function procAlbedo(seed, c0, c1) {
	const cv = document.createElement("canvas");
	cv.width = 128;
	cv.height = 128;
	const ctx = cv.getContext("2d");
	ctx.fillStyle = c0;
	ctx.fillRect(0, 0, 128, 128);
	ctx.fillStyle = c1;
	let s = seed;
	const rnd = () => {
		s = s * 16807 % 2147483647;
		return (s - 1) / 2147483646;
	};
	for (let i = 0; i < 80; i++) {
		ctx.globalAlpha = .08 + rnd() * .2;
		ctx.beginPath();
		ctx.arc(rnd() * 128, rnd() * 128, 4 + rnd() * 18, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 1;
	const t = new CanvasTexture(cv);
	t.colorSpace = SRGBColorSpace;
	t.wrapS = t.wrapT = RepeatWrapping;
	t.needsUpdate = true;
	return t;
}
function brightenMap(map, gain, lift = .08) {
	const img = map.image;
	if (!img) return map;
	const w = Math.min(512, ("width" in img ? img.width : 512) || 512);
	const h = Math.min(512, ("height" in img ? img.height : 512) || 512);
	const cv = document.createElement("canvas");
	cv.width = w;
	cv.height = h;
	const ctx = cv.getContext("2d");
	ctx.drawImage(img, 0, 0, w, h);
	const id = ctx.getImageData(0, 0, w, h);
	const d = id.data;
	for (let i = 0; i < d.length; i += 4) {
		d[i] = Math.min(255, d[i] * gain + lift * 255);
		d[i + 1] = Math.min(255, d[i + 1] * gain + lift * 255);
		d[i + 2] = Math.min(255, d[i + 2] * gain + lift * 255);
	}
	ctx.putImageData(id, 0, 0);
	const t = new CanvasTexture(cv);
	t.colorSpace = SRGBColorSpace;
	t.wrapS = t.wrapT = RepeatWrapping;
	t.anisotropy = 4;
	t.needsUpdate = true;
	return t;
}
var TextureKit = class {
	maps = {};
	mats = {};
	envTex = null;
	quality;
	constructor(q) {
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
			if (k === "hell") albedo = brightenMap(map, 2.8, .12);
			else if (k === "hide" || k === "dirt" || k === "roof") albedo = brightenMap(map, 1.85, .06);
			const bump = k === "hell" || k === "wall" || k === "floor" ? 3.4 : k === "hide" ? 2.8 : 2.2;
			const derived = this.quality.low ? {
				normal: void 0,
				rough: void 0,
				ao: void 0
			} : deriveMaps(albedo, bump);
			this.maps[k] = {
				map: albedo,
				...derived
			};
		});
		await Promise.all(jobs);
		this.maps.skin = { map: procAlbedo(9, "#c4a07a", "#8a6048") };
		this.maps.fur = { map: procAlbedo(13, "#3a2a1c", "#1a120c") };
		this.buildMats();
	}
	env(renderer) {
		if (this.envTex) return this.envTex;
		const sc = new Scene();
		sc.add(new HemisphereLight(8032424, 2757640, 1.1));
		const warm = new Mesh(new SphereGeometry(6, 8, 8), new MeshBasicMaterial({ color: 16756848 }));
		warm.position.set(10, 14, 6);
		sc.add(warm);
		const cool = new Mesh(new SphereGeometry(8, 8, 8), new MeshBasicMaterial({ color: 2109504 }));
		cool.position.set(-12, 8, -10);
		sc.add(cool);
		const pmrem = new PMREMGenerator(renderer);
		this.envTex = pmrem.fromScene(sc, .06).texture;
		pmrem.dispose();
		return this.envTex;
	}
	buildMats() {
		const std = (key, color, rough, metal, opts) => {
			const maps = this.maps[key] ?? {};
			const mat = new MeshStandardMaterial({
				color,
				map: maps.map ?? null,
				normalMap: maps.normal ?? null,
				roughnessMap: maps.rough ?? null,
				aoMap: maps.ao ?? null,
				roughness: rough,
				metalness: metal,
				envMapIntensity: .78,
				aoMapIntensity: .48
			});
			if (opts?.emissive != null) {
				mat.emissive = new Color(opts.emissive);
				mat.emissiveIntensity = opts.emi ?? .4;
			}
			const rep = opts?.repeat ?? 1;
			if (maps.map) maps.map.repeat.set(rep, rep);
			if (maps.normal) maps.normal.repeat.set(rep, rep);
			if (maps.rough) maps.rough.repeat.set(rep, rep);
			if (maps.ao) maps.ao.repeat.set(rep, rep);
			if (maps.normal) mat.normalScale.set(opts?.nrm ?? .85, opts?.nrm ?? .85);
			return mat;
		};
		this.mats.floor = std("floor", 14536888, .88, .04, {
			repeat: 8,
			nrm: 1.05
		});
		this.mats.stone = std("stone", 13944496, .86, .04, {
			repeat: 6,
			nrm: .85
		});
		this.mats.wall = std("wall", 13154468, .88, .05, {
			repeat: 2,
			nrm: 1
		});
		this.mats.hell = std("hell", 15255720, .68, .08, {
			emissive: 5905416,
			emi: .2,
			repeat: 6,
			nrm: 1.05
		});
		this.mats.hide = std("hide", 12872264, .4, .1, {
			emissive: 4854792,
			emi: .12,
			nrm: 1
		});
		this.mats.ice = std("ice", 13952240, .32, .14, { repeat: 5 });
		this.mats.dirt = std("dirt", 11569776, .92, .02, { repeat: 6 });
		this.mats.leather = std("leather", 11569768, .72, .1, { nrm: .7 });
		this.mats.bone = std("bone", 15656144, .9, .02);
		this.mats.iron = std("iron", 10131088, .42, .78, { nrm: .8 });
		this.mats.gold = std("gold", 13939818, .34, .88, {
			emissive: 5912592,
			emi: .28
		});
		this.mats.cloth = std("cloth", 6971476, .88, .02);
		this.mats.banner = std("banner", 10758178, .8, .04, {
			emissive: 3803140,
			emi: .1
		});
		this.mats.roof = std("roof", 6974066, .78, .12, {
			repeat: 2,
			nrm: 1
		});
		this.mats.skin = std("skin", 13938832, .52, .02, {
			emissive: 4857876,
			emi: .1
		});
		this.mats.fur = std("fur", 5916728, .94, 0);
		this.mats.wood = std("wood", 9071170, .86, .04, { nrm: .7 });
		this.mats.ember = new MeshStandardMaterial({
			color: 16742195,
			emissive: 16729105,
			emissiveIntensity: 1.6,
			roughness: .38,
			metalness: .05
		});
		this.mats.crystal = new MeshStandardMaterial({
			color: 16742212,
			emissive: 16724744,
			emissiveIntensity: 1.35,
			roughness: .2,
			metalness: .4,
			transparent: true,
			opacity: .92
		});
	}
	clone(id) {
		const base = this.mats[id];
		return base ? base.clone() : new MeshStandardMaterial({ color: 8947848 });
	}
	floorFor(biome) {
		if (biome === "hell" || biome === "rift") return this.mats.hell;
		if (biome === "ice" || biome === "flood") return this.mats.ice;
		if (biome === "wilds") return this.mats.dirt;
		if (biome === "town") return this.mats.floor;
		return this.mats.stone;
	}
};
var GradeShader = {
	uniforms: {
		tDiffuse: { value: null },
		uTime: { value: 0 },
		uGrain: { value: .028 },
		uChroma: { value: 0 },
		uExposure: { value: 1.18 },
		uVignette: { value: .12 },
		uTexel: { value: new Vector2(1 / 1920, 1 / 1080) },
		uSharpen: { value: .16 }
	},
	vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uChroma;
    uniform float uExposure;
    uniform float uVignette;
    uniform vec2 uTexel;
    uniform float uSharpen;
    varying vec2 vUv;
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec2 uv = vUv;
      vec3 src = texture2D(tDiffuse, uv).rgb;
      vec3 n = texture2D(tDiffuse, uv + vec2(0.0, uTexel.y)).rgb;
      vec3 s = texture2D(tDiffuse, uv - vec2(0.0, uTexel.y)).rgb;
      vec3 e = texture2D(tDiffuse, uv + vec2(uTexel.x, 0.0)).rgb;
      vec3 w = texture2D(tDiffuse, uv - vec2(uTexel.x, 0.0)).rgb;
      vec3 col = src * (1.0 + 4.0 * uSharpen) - (n + s + e + w) * uSharpen;
      col *= uExposure;
      col = max(col, vec3(0.0));
      col = col * 0.92 + vec3(0.062);
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      vec3 shadowTint = vec3(0.78, 0.82, 0.86);
      vec3 midTint = vec3(1.06, 0.97, 0.86);
      col = mix(col * shadowTint, col, smoothstep(0.04, 0.32, lum));
      col *= mix(midTint, vec3(1.0), smoothstep(0.22, 0.72, lum));
      vec2 q = uv * 2.0 - 1.0;
      float vig = 1.0 - dot(q, q) * uVignette;
      col *= vig;
      float g = hash(uv * (uTime * 19.0 + 3.1) + vec2(uTime));
      col += (g - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }
  `
};
var PostPipeline = class {
	composer;
	bloom = null;
	grade;
	fxaa;
	quality;
	chromaT = 0;
	popT = 0;
	constructor(renderer, scene, camera, quality) {
		this.quality = quality;
		renderer.toneMapping = 4;
		renderer.toneMappingExposure = 1.38;
		renderer.outputColorSpace = SRGBColorSpace;
		this.composer = new EffectComposer(renderer);
		this.composer.addPass(new RenderPass(scene, camera));
		if (quality.bloom) {
			this.bloom = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), .14, .2, .93);
			this.composer.addPass(this.bloom);
		}
		this.grade = new ShaderPass(GradeShader);
		this.grade.uniforms.uGrain.value = quality.grain ? .028 : .008;
		this.grade.uniforms.uSharpen.value = quality.low ? .1 : .16;
		this.grade.uniforms.uVignette.value = .12;
		this.grade.uniforms.uExposure.value = 1.18;
		this.composer.addPass(this.grade);
		this.fxaa = new FXAAPass();
		this.composer.addPass(this.fxaa);
		this.composer.addPass(new OutputPass());
		this.setSize(window.innerWidth, window.innerHeight);
	}
	setSize(w, h) {
		const dpr = this.quality.dpr;
		this.composer.setSize(w, h);
		this.composer.setPixelRatio(dpr);
		this.fxaa.setSize(w * dpr, h * dpr);
		this.bloom?.setSize(w, h);
		this.grade.uniforms.uTexel.value.set(1 / Math.max(1, w * dpr), 1 / Math.max(1, h * dpr));
	}
	punch(_chroma = 0, pop = .1) {
		this.chromaT = 0;
		this.popT = Math.max(this.popT, pop);
		this.grade.uniforms.uChroma.value = 0;
	}
	render(dt) {
		this.chromaT = 0;
		this.popT = Math.max(0, this.popT - dt);
		this.grade.uniforms.uTime.value += dt;
		this.grade.uniforms.uChroma.value = 0;
		this.grade.uniforms.uExposure.value = 1.18 + this.popT * .28;
		this.composer.render();
	}
};
function lathe(profile, segs = 12) {
	return new LatheGeometry(profile.map(([x, y]) => new Vector2(x, y)), segs);
}
var box$1 = new BoxGeometry(1, 1, 1);
var cyl$1 = new CylinderGeometry(.5, .5, 1, 14);
var cylT$1 = new CylinderGeometry(.32, .5, 1, 14);
var sph$1 = new SphereGeometry(.5, 18, 14);
var sphLo = new SphereGeometry(.5, 10, 8);
var cone$1 = new ConeGeometry(.5, 1, 10);
var tor$1 = new TorusGeometry(.5, .12, 8, 16);
var cap = new CapsuleGeometry(.5, 1, 4, 10);
var octa$1 = new OctahedronGeometry(.5, 1);
var torsoGeo = lathe([
	[.01, 0],
	[.24, .02],
	[.27, .14],
	[.2, .3],
	[.29, .48],
	[.34, .64],
	[.24, .76],
	[.11, .84]
], 14);
var robeGeo = lathe([
	[.44, 0],
	[.42, .06],
	[.34, .4],
	[.22, .82],
	[.15, 1.02],
	[.1, 1.12]
], 14);
var hoodGeo = lathe([
	[.24, 0],
	[.26, .1],
	[.2, .26],
	[.08, .36],
	[.02, .38]
], 10);
var wingShape = new Shape();
wingShape.moveTo(0, 0);
wingShape.bezierCurveTo(.18, .32, .52, .42, .92, .12);
wingShape.lineTo(.72, -.06);
wingShape.lineTo(.38, -.14);
wingShape.lineTo(0, -.05);
var wingGeo = new ShapeGeometry(wingShape);
wingGeo.computeVertexNormals();
function add(parent, geo, mat, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0, shadow = true) {
	const m = new Mesh(geo, mat);
	m.position.set(x, y, z);
	m.scale.set(sx, sy, sz);
	m.rotation.set(rx, ry, rz);
	m.castShadow = shadow;
	m.receiveShadow = shadow;
	parent.add(m);
	return m;
}
function tuft(parent, mat, x, y, z, k, n = 7) {
	add(parent, sphLo, mat, x, y, z, .28 * k, .2 * k, .28 * k);
	for (let i = 0; i < n; i++) {
		const a = i / n * Math.PI * 1.6 - .4;
		add(parent, cone$1, mat, x + Math.cos(a) * .1 * k, y - .06 * k, z + Math.sin(a) * .08 * k, .07 * k, .2 * k, .07 * k, .85, 0, a);
	}
}
function plates(torso, iron, gold, rows = 4) {
	for (let r = 0; r < rows; r++) for (let c = -1; c <= 1; c++) add(torso, box$1, iron, c * .2, .18 - r * .11, .3, .2, .09, .045, .18, 0, 0, false);
	add(torso, box$1, gold, 0, .08, .34, .08, .42, .03, 0, 0, 0, false);
}
var Figure = class {
	root = new Group();
	kind;
	height;
	parts = {};
	flashMats = [];
	attackT = 0;
	hitFlash = 0;
	dissolve = 1;
	deadT = 0;
	cloakX = .1;
	walk = 0;
	iceShell = null;
	gear = new Group();
	glowT = 0;
	glowCol = 4521864;
	kit = null;
	constructor(kind, height) {
		this.kind = kind;
		this.height = height;
		this.root.add(this.gear);
	}
	playAttack() {
		this.attackT = .32;
	}
	flash() {
		this.hitFlash = .14;
	}
	glow(color, t) {
		this.glowCol = color;
		this.glowT = t;
	}
	bindKit(kit) {
		this.kit = kit;
	}
	applyGear(equipped) {
		while (this.gear.children.length) this.gear.remove(this.gear.children[0]);
		if (this.kind !== "barbarian") return;
		const kit = this.kit;
		const iron = kit?.clone("iron") ?? new MeshStandardMaterial({
			color: 9076852,
			metalness: .7,
			roughness: .35
		});
		const gold = kit?.clone("gold") ?? new MeshStandardMaterial({
			color: 12886874,
			metalness: .85,
			roughness: .28
		});
		const leather = kit?.clone("leather") ?? new MeshStandardMaterial({
			color: 5913128,
			roughness: .7
		});
		const k = this.height / 2.02;
		const main = equipped.main;
		const wep = !Array.isArray(main) ? main : void 0;
		if (wep && this.parts.weapon) {
			const rare = wep.rarity === "rare" || wep.rarity === "legendary" || wep.rarity === "set";
			const col = wep.rarity === "legendary" ? gold : wep.rarity === "rare" ? gold : iron;
			add(this.gear, box$1, col, .42 * k, 1.15 * k, .22 * k, .08 * k, .08 * k, .08 * k, 0, 0, 0, false);
			if (rare) {
				add(this.parts.weapon, box$1, gold, .14 * k, .7 * k, .07 * k, .18 * k, .32 * k, .03 * k, 0, 0, 0, false);
				add(this.parts.weapon, cone$1, gold, .4 * k, .7 * k, .02 * k, .12 * k, .22 * k, .04 * k, 0, 0, Math.PI / 2, false);
			}
		}
		const helm = !Array.isArray(equipped.helm) ? equipped.helm : void 0;
		if (helm && this.parts.head) {
			const mat = helm.rarity === "normal" ? leather : helm.rarity === "magic" ? iron : gold;
			add(this.parts.head, box$1, mat, 0, .18, .02, .95, .42, .95, 0, 0, 0, false);
			add(this.parts.head, box$1, iron, 0, .02, .38, .7, .16, .18, 0, 0, 0, false);
			if (helm.rarity === "rare" || helm.rarity === "legendary") add(this.parts.head, box$1, gold, 0, .22, .42, .18, .1, .08, 0, 0, 0, false);
		}
		const chest = !Array.isArray(equipped.chest) ? equipped.chest : void 0;
		if (chest && this.parts.torso) {
			const mat = chest.rarity === "legendary" || chest.rarity === "rare" ? gold : iron;
			add(this.parts.torso, box$1, mat, 0, .42, .36, .62, .14, .08, .1, 0, 0, false);
			add(this.parts.torso, box$1, iron, -.22, .28, .34, .22, .28, .06, .12, 0, 0, false);
			add(this.parts.torso, box$1, iron, .22, .28, .34, .22, .28, .06, .12, 0, 0, false);
		}
	}
	update(pose) {
		const dt = pose.dt;
		this.root.position.y = 0;
		if (pose.whirlwind) this.root.rotation.y += dt * 16;
		else this.root.rotation.y = pose.facing + Math.PI;
		if (this.hitFlash > 0) {
			this.hitFlash -= dt;
			const on = this.hitFlash > .04;
			for (const m of this.flashMats) {
				m.emissive.setHex(on ? 16773856 : 0);
				m.emissiveIntensity = on ? .85 : m.userData.emi0 ?? 0;
			}
			this.root.position.x = Math.sin(this.hitFlash * 48) * .035;
		} else this.root.position.x = 0;
		if (this.glowT > 0) {
			this.glowT -= dt;
			for (const m of this.flashMats) {
				m.emissive.setHex(this.glowCol);
				m.emissiveIntensity = .35 + Math.sin(pose.time * 8) * .12;
			}
		}
		if (this.iceShell) this.iceShell.visible = pose.freeze;
		if (pose.dead) {
			this.deadT += dt;
			const k = Math.min(1, this.deadT / .5);
			this.root.rotation.x = k * 1.25;
			this.root.position.y = -k * .18;
			if (this.deadT > 8) {
				this.dissolve = Math.max(0, this.dissolve - dt * .7);
				this.root.scale.y = Math.max(.05, this.dissolve);
				this.root.traverse((o) => {
					const mat = o.material;
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
			const u = 1 - this.attackT / .32;
			const swing = u < .4 ? u / .4 : 1 - (u - .4) / .6;
			if (rArm) rArm.rotation.x = -2.05 * swing;
			if (lArm) lArm.rotation.x = .35 * swing;
			if (weapon) weapon.rotation.z = -.55 * swing;
			if (torso) torso.rotation.x = -.12 * swing;
		} else if (rArm) {
			rArm.rotation.x *= Math.max(0, 1 - dt * 8);
			if (torso) torso.rotation.x *= Math.max(0, 1 - dt * 8);
		}
		if (pose.moving) {
			this.walk += dt * (6.4 + pose.speed * .85);
			const s = Math.sin(this.walk);
			const c = Math.cos(this.walk);
			if (lThigh) lThigh.rotation.x = s * .78;
			if (rThigh) rThigh.rotation.x = -s * .78;
			if (lShin) lShin.rotation.x = Math.max(0, -c) * .5;
			if (rShin) rShin.rotation.x = Math.max(0, c) * .5;
			if (lArm && this.attackT <= 0) lArm.rotation.x = -s * .58;
			if (rArm && this.attackT <= 0 && !pose.whirlwind) rArm.rotation.x = s * .48;
			if (torso) {
				torso.position.y = (torso.userData.y0 ?? torso.position.y) + Math.abs(s) * .035;
				torso.rotation.y = s * .08;
			}
			this.cloakX = MathUtils.damp(this.cloakX, .48, 8, dt);
		} else {
			this.walk += dt * 2;
			const b = Math.sin(pose.time * 2.05) * .014;
			if (torso) {
				torso.position.y = (torso.userData.y0 ?? torso.position.y) + b;
				torso.rotation.y *= Math.max(0, 1 - dt * 6);
			}
			if (head) head.rotation.y = Math.sin(pose.time * .65) * .1;
			if (lThigh) lThigh.rotation.x *= Math.max(0, 1 - dt * 8);
			if (rThigh) rThigh.rotation.x *= Math.max(0, 1 - dt * 8);
			if (lShin) lShin.rotation.x *= Math.max(0, 1 - dt * 8);
			if (rShin) rShin.rotation.x *= Math.max(0, 1 - dt * 8);
			if (lArm && this.attackT <= 0) lArm.rotation.x = Math.sin(pose.time * 1.35) * .06;
			this.cloakX = MathUtils.damp(this.cloakX, .12, 6, dt);
		}
		if (cloak) cloak.rotation.x = this.cloakX;
		if (pose.whirlwind) {
			if (lArm) lArm.rotation.z = 1.15;
			if (rArm) rArm.rotation.z = -1.15;
		} else {
			if (lArm) lArm.rotation.z = MathUtils.damp(lArm.rotation.z, .14, 8, dt);
			if (rArm) rArm.rotation.z = MathUtils.damp(rArm.rotation.z, -.14, 8, dt);
		}
		if (lWing && rWing) {
			const flap = Math.sin(pose.time * (pose.moving ? 16 : 5.5)) * .32;
			lWing.rotation.y = .45 + flap;
			rWing.rotation.y = -.45 - flap;
			lWing.rotation.z = .25 + flap * .4;
			rWing.rotation.z = -.25 - flap * .4;
		}
		if (this.kind === "npc-kael" && this.attackT <= 0) {
			const swing = Math.max(0, Math.sin(pose.time * 2.4));
			if (rArm) rArm.rotation.x = -1.7 * swing;
			if (weapon) weapon.rotation.z = -.4 * swing;
		} else if (this.kind === "npc-maera") {
			if (lArm) lArm.rotation.x = Math.sin(pose.time * 1.15) * .28 - .45;
			if (rArm) rArm.rotation.x = Math.sin(pose.time * 1.15 + 1.2) * .2 - .2;
			if (head) head.rotation.y = Math.sin(pose.time * .5) * .18;
		} else if (this.kind === "npc-vesh") {
			if (head) head.rotation.y = Math.sin(pose.time * .35) * .4;
			if (rArm && this.attackT <= 0) rArm.rotation.x = -.35;
		} else if (this.kind === "npc-ryn") {
			if (head) head.rotation.y = Math.sin(pose.time * .28) * .22;
		} else if (this.kind === "npc-brann") {
			if (lArm) lArm.rotation.z = .55 + Math.sin(pose.time * 1.6) * .08;
			if (rArm) rArm.rotation.z = -.55 - Math.sin(pose.time * 1.6) * .08;
		} else if (this.kind === "npc-io") {
			if (weapon) weapon.rotation.y = pose.time * .6;
		}
	}
};
var FigureFactory = class {
	kit;
	quality;
	eyeWhite;
	eyeDark;
	eyeGlow;
	constructor(kit, quality) {
		this.kit = kit;
		this.quality = quality;
		this.eyeWhite = new MeshStandardMaterial({
			color: 15260872,
			roughness: .4
		});
		this.eyeDark = new MeshStandardMaterial({
			color: 1708556,
			roughness: .35
		});
		this.eyeGlow = new MeshStandardMaterial({
			color: 16724753,
			emissive: 16720384,
			emissiveIntensity: 2.2,
			roughness: .3
		});
	}
	create(kind, scale = 1, elite = false, boss = false) {
		const h = (kind === "imp" ? 1.22 : kind === "brute" || kind === "guardian" ? 2.45 : kind === "boss" ? 3.15 : 2.02) * scale;
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
		const ember = this.kit.mats.ember;
		fig.flashMats.push(leather, hide, skin, bone, cloth);
		for (const m of fig.flashMats) m.userData.emi0 = m.emissiveIntensity;
		fig.bindKit(this.kit);
		if (kind === "barbarian" || kind === "npc-kael") this.barb(fig, k, {
			leather,
			iron,
			gold,
			skin,
			fur,
			cloth,
			wood
		}, kind === "npc-kael");
		else if (kind === "imp") this.imp(fig, k, {
			hide,
			bone,
			ember,
			iron
		});
		else if (kind === "skeleton" || kind === "wight") this.skel(fig, k, {
			bone,
			iron,
			cloth,
			ice: this.kit.mats.ice
		}, kind === "wight");
		else if (kind === "cultist" || kind === "npc-vesh" || kind === "npc-io" || kind === "npc-maera") this.robe(fig, k, {
			cloth,
			skin,
			iron,
			gold,
			bone,
			hide,
			banner
		}, kind);
		else if (kind === "brute" || kind === "guardian") this.brute(fig, k, {
			hide,
			bone,
			iron,
			ember
		}, kind === "guardian");
		else if (kind === "boss") this.boss(fig, k, {
			hide,
			iron,
			gold,
			bone,
			ember,
			cloth,
			banner
		});
		else if (kind === "npc-ryn") this.plate(fig, k, {
			iron,
			gold,
			cloth,
			skin,
			leather,
			banner
		});
		else if (kind === "npc-brann") this.monk(fig, k, {
			cloth,
			skin,
			leather,
			banner
		});
		else this.barb(fig, k, {
			leather,
			iron,
			gold,
			skin,
			fur,
			cloth,
			wood
		}, false);
		if (elite || boss) {
			const vein = new MeshStandardMaterial({
				color: 16724753,
				emissive: 16720384,
				emissiveIntensity: boss ? 1.8 : 1.2,
				roughness: .35
			});
			add(fig.root, box$1, vein, 0, h * .58, .18 * k, .07 * k, .7 * k, .04 * k, 0, 0, 0, false);
			add(fig.root, box$1, vein, -.12 * k, h * .55, .16 * k, .04 * k, .45 * k, .03 * k, 0, 0, .4, false);
			if (boss) add(fig.root, tor$1, vein, 0, h * .98, 0, 1.15 * k, 1.15 * k, 1.15 * k, Math.PI / 2);
		}
		const ice = new MeshStandardMaterial({
			color: 11198463,
			transparent: true,
			opacity: .26,
			roughness: .18,
			metalness: .12,
			depthWrite: false
		});
		const shell = add(fig.root, cap, ice, 0, h * .5, 0, .85 * k, h * .55, .7 * k);
		shell.visible = false;
		fig.iceShell = shell;
		const shMat = new MeshBasicMaterial({
			color: 0,
			transparent: true,
			opacity: .2,
			depthWrite: false
		});
		const sh = new Mesh(new CircleGeometry(.3 * k, 14), shMat);
		sh.rotation.x = -Math.PI / 2;
		sh.position.y = .03;
		fig.root.add(sh);
		fig.parts.shadow = sh;
		return fig;
	}
	eyes(head, glow = false, k = 1) {
		const mat = glow ? this.eyeGlow : this.eyeWhite;
		const pupil = glow ? this.eyeGlow : this.eyeDark;
		add(head, sphLo, mat, -.14, .04, .32, .1 * k, .08 * k, .06 * k, 0, 0, 0, false);
		add(head, sphLo, mat, .14, .04, .32, .1 * k, .08 * k, .06 * k, 0, 0, 0, false);
		add(head, sphLo, pupil, -.14, .04, .36, .05 * k, .05 * k, .04 * k, 0, 0, 0, false);
		add(head, sphLo, pupil, .14, .04, .36, .05 * k, .05 * k, .04 * k, 0, 0, 0, false);
	}
	limb(fig, side, x, y, k, mat, thighLen = .48) {
		const thigh = new Group();
		thigh.position.set(x, y, 0);
		fig.root.add(thigh);
		fig.parts[side === "l" ? "lThigh" : "rThigh"] = thigh;
		add(thigh, cylT$1, mat, 0, -thighLen * .5 * k, 0, .18 * k, thighLen * k, .18 * k);
		add(thigh, sphLo, mat, 0, -thighLen * k, 0, .16 * k, .16 * k, .16 * k, 0, 0, 0, false);
		const shin = new Group();
		shin.position.set(0, -thighLen * k, 0);
		thigh.add(shin);
		fig.parts[side === "l" ? "lShin" : "rShin"] = shin;
		add(shin, cylT$1, mat, 0, -.22 * k, 0, .14 * k, .42 * k, .14 * k);
		return {
			thigh,
			shin
		};
	}
	arms(fig, x, y, k, mat, hand) {
		const lArm = new Group();
		lArm.position.set(-x, y, 0);
		fig.root.add(lArm);
		fig.parts.lArm = lArm;
		add(lArm, cylT$1, mat, 0, -.24 * k, 0, .15 * k, .48 * k, .15 * k);
		add(lArm, sphLo, hand ?? mat, 0, -.5 * k, 0, .16 * k, .16 * k, .16 * k);
		const rArm = new Group();
		rArm.position.set(x, y, 0);
		fig.root.add(rArm);
		fig.parts.rArm = rArm;
		add(rArm, cylT$1, mat, 0, -.24 * k, 0, .15 * k, .48 * k, .15 * k);
		add(rArm, sphLo, hand ?? mat, 0, -.5 * k, 0, .16 * k, .16 * k, .16 * k);
		const weapon = new Group();
		weapon.position.set(.02 * k, -.52 * k, .06 * k);
		rArm.add(weapon);
		fig.parts.weapon = weapon;
		return {
			lArm,
			rArm,
			weapon
		};
	}
	barb(fig, k, m, smith) {
		add(fig.root, sph$1, m.leather, 0, .72 * k, 0, .46 * k, .28 * k, .34 * k);
		const torso = add(fig.root, torsoGeo, m.leather, 0, .7 * k, 0, 1.05 * k, 1.05 * k, .95 * k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		plates(torso, m.iron, m.gold, 5);
		add(torso, box$1, m.iron, 0, .55, .22, .7, .18, .2, -.2);
		add(torso, box$1, m.leather, -.28, .22, .18, .12, .42, .04, .1, 0, 0, false);
		add(torso, box$1, m.leather, .28, .22, .18, .12, .42, .04, .1, 0, 0, false);
		tuft(fig.root, m.fur, -.42 * k, 1.48 * k, .04 * k, k, 10);
		tuft(fig.root, m.fur, .42 * k, 1.48 * k, .04 * k, k, 10);
		const head = add(fig.root, sph$1, m.skin, 0, 1.68 * k, .06 * k, .34 * k, .38 * k, .32 * k);
		fig.parts.head = head;
		this.eyes(head, false, 1);
		add(head, sphLo, m.skin, 0, -.02, .28, .14, .16, .14, .4, 0, 0, false);
		add(head, sphLo, m.fur, 0, .28, -.04, .78, .5, .75);
		add(head, sphLo, m.fur, 0, -.22, .26, .55, .38, .4);
		add(head, cone$1, m.fur, -.12, .42, -.12, .16, .32, .16, .5);
		add(head, cone$1, m.fur, .12, .42, -.12, .16, .32, .16, .5);
		add(head, cone$1, m.fur, 0, .46, -.18, .18, .38, .18, .65);
		const { weapon } = this.arms(fig, .44 * k, 1.42 * k, k, m.skin, m.leather);
		if (smith) {
			add(weapon, cyl$1, m.wood, 0, .12 * k, 0, .08 * k, .72 * k, .08 * k);
			add(weapon, box$1, m.iron, 0, .5 * k, 0, .34 * k, .2 * k, .14 * k);
		} else {
			add(weapon, cyl$1, m.wood, 0, .22 * k, 0, .055 * k, 1.05 * k, .055 * k);
			add(weapon, cyl$1, m.leather, 0, .02 * k, 0, .075 * k, .22 * k, .075 * k, 0, 0, 0, false);
			add(weapon, box$1, m.iron, .14 * k, .7 * k, 0, .42 * k, .28 * k, .08 * k);
			add(weapon, cone$1, m.iron, .36 * k, .7 * k, 0, .22 * k, .4 * k, .06 * k, 0, 0, Math.PI / 2);
			add(weapon, cone$1, m.iron, 0, .96 * k, 0, .05 * k, .22 * k, .05 * k);
			add(weapon, box$1, m.gold, .14 * k, .7 * k, .05 * k, .1 * k, .2 * k, .02 * k, 0, 0, 0, false);
			add(weapon, box$1, m.iron, .14 * k, .7 * k, -.05 * k, .38 * k, .04 * k, .02 * k, 0, 0, 0, false);
			add(weapon, box$1, m.gold, 0, .18 * k, 0, .1 * k, .04 * k, .1 * k, 0, 0, 0, false);
		}
		const { shin: lShin } = this.limb(fig, "l", -.15 * k, .68 * k, k, m.leather);
		const { shin: rShin } = this.limb(fig, "r", .15 * k, .68 * k, k, m.leather);
		add(lShin, box$1, m.iron, 0, -.4 * k, .06 * k, .2 * k, .14 * k, .3 * k);
		add(rShin, box$1, m.iron, 0, -.4 * k, .06 * k, .2 * k, .14 * k, .3 * k);
		add(fig.root, box$1, m.cloth, 0, .78 * k, .04 * k, .52 * k, .22 * k, .24 * k);
		add(fig.root, box$1, m.iron, 0, .86 * k, .14 * k, .5 * k, .08 * k, .1 * k);
		add(fig.root, box$1, m.gold, 0, .86 * k, .2 * k, .12 * k, .1 * k, .04 * k, 0, 0, 0, false);
		const cloak = add(fig.root, box$1, m.fur, 0, 1.15 * k, -.24 * k, .58 * k, .78 * k, .08 * k);
		fig.parts.cloak = cloak;
	}
	imp(fig, k, m) {
		const torso = add(fig.root, sph$1, m.hide, 0, .72 * k, .08 * k, .62 * k, .52 * k, .48 * k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		const head = add(fig.root, sph$1, m.hide, 0, 1.12 * k, .18 * k, .4 * k, .34 * k, .38 * k);
		fig.parts.head = head;
		this.eyes(head, true, .9);
		add(head, cone$1, m.bone, -.22, .38, -.02, .1 * k, .34 * k, .1 * k, .25);
		add(head, cone$1, m.bone, .22, .38, -.02, .1 * k, .34 * k, .1 * k, .25);
		add(head, cone$1, m.bone, 0, .28, -.2, .08 * k, .22 * k, .08 * k, .8);
		const lWing = new Group();
		lWing.position.set(-.12 * k, .82 * k, -.12 * k);
		fig.root.add(lWing);
		fig.parts.lWing = lWing;
		const wingMat = m.hide.clone();
		wingMat.transparent = true;
		wingMat.opacity = .82;
		wingMat.side = 2;
		add(lWing, wingGeo, wingMat, 0, 0, 0, .85 * k, .7 * k, 1, .2, .2, .4);
		const rWing = new Group();
		rWing.position.set(.12 * k, .82 * k, -.12 * k);
		fig.root.add(rWing);
		fig.parts.rWing = rWing;
		add(rWing, wingGeo, wingMat, 0, 0, 0, -.85 * k, .7 * k, 1, .2, -.2, -.4);
		this.arms(fig, .3 * k, .82 * k, k * .85, m.hide);
		this.limb(fig, "l", -.12 * k, .48 * k, k * .85, m.hide, .36);
		this.limb(fig, "r", .12 * k, .48 * k, k * .85, m.hide, .36);
		add(fig.root, cylT$1, m.hide, 0, .38 * k, -.28 * k, .07 * k, .5 * k, .07 * k, .7);
		add(fig.root, sphLo, m.hide, 0, .18 * k, -.48 * k, .12 * k, .1 * k, .12 * k, 0, 0, 0, false);
	}
	skel(fig, k, m, wight) {
		const bone = wight ? m.ice : m.bone;
		add(fig.root, sph$1, bone, 0, .72 * k, 0, .34 * k, .18 * k, .24 * k);
		const torso = add(fig.root, box$1, bone, 0, 1.12 * k, 0, .32 * k, .58 * k, .2 * k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		add(torso, cyl$1, bone, 0, .02, 0, .16, .95, .16);
		for (let i = 0; i < 4; i++) add(torso, cyl$1, bone, 0, .28 - i * .14, .12, .55, .05, .08, 0, 0, 0, false);
		const head = add(fig.root, sph$1, bone, 0, 1.58 * k, .04 * k, .3 * k, .32 * k, .28 * k);
		fig.parts.head = head;
		this.eyes(head, true, .85);
		add(head, box$1, bone, 0, -.08, .2, .42, .18, .16, 0, 0, 0, false);
		this.arms(fig, .28 * k, 1.34 * k, k, bone);
		const w = fig.parts.weapon;
		if (w) {
			add(w, cyl$1, m.iron, 0, .22 * k, 0, .04 * k, .85 * k, .04 * k);
			add(w, box$1, m.iron, 0, .66 * k, 0, .04 * k, .22 * k, .18 * k);
		}
		this.limb(fig, "l", -.1 * k, .64 * k, k, bone, .42);
		this.limb(fig, "r", .1 * k, .64 * k, k, bone, .42);
		if (wight) {
			const cloak = add(fig.root, box$1, m.cloth, 0, 1.08 * k, -.14 * k, .42 * k, .7 * k, .08 * k);
			fig.parts.cloak = cloak;
		}
	}
	robe(fig, k, m, kind) {
		const mystic = kind === "npc-maera";
		const dark = kind === "npc-vesh" || kind === "cultist";
		const robeMat = mystic ? m.banner : dark ? m.hide : m.cloth;
		const torso = add(fig.root, robeGeo, robeMat, 0, .08 * k, 0, k, k, k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		add(torso, box$1, mystic ? m.gold : m.iron, 0, .72, .12, .28, .08, .08, 0, 0, 0, false);
		const head = add(fig.root, sph$1, m.skin, 0, 1.62 * k, .05 * k, .3 * k, .32 * k, .28 * k);
		fig.parts.head = head;
		this.eyes(head, dark, .9);
		add(fig.root, hoodGeo, robeMat, 0, 1.52 * k, -.02 * k, 1.15 * k, 1.05 * k, 1.15 * k);
		this.arms(fig, .28 * k, 1.3 * k, k, robeMat, m.skin);
		const w = fig.parts.weapon;
		if (w) {
			add(w, cyl$1, mystic ? m.gold : m.bone, 0, .32 * k, 0, .045 * k, 1.15 * k, .045 * k);
			add(w, octa$1, mystic ? m.gold : m.iron, 0, .95 * k, 0, .22 * k, .28 * k, .22 * k);
		}
		this.limb(fig, "l", -.1 * k, .42 * k, k, robeMat, .28);
		this.limb(fig, "r", .1 * k, .42 * k, k, robeMat, .28);
		const cloak = add(fig.root, box$1, robeMat, 0, 1.08 * k, -.22 * k, .55 * k, .95 * k, .08 * k);
		fig.parts.cloak = cloak;
	}
	brute(fig, k, m, guardian) {
		const torso = add(fig.root, torsoGeo, m.hide, 0, .72 * k, .04 * k, 1.45 * k, 1.2 * k, 1.2 * k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		add(torso, box$1, m.bone, 0, .42, .32, .7, .45, .16);
		const head = add(fig.root, sph$1, m.hide, 0, 1.78 * k, .2 * k, .46 * k, .4 * k, .44 * k);
		fig.parts.head = head;
		this.eyes(head, true, 1.1);
		add(head, cone$1, m.bone, -.24, .36, .08, .14 * k, .4 * k, .14 * k, .2);
		add(head, cone$1, m.bone, .24, .36, .08, .14 * k, .4 * k, .14 * k, .2);
		this.arms(fig, .55 * k, 1.4 * k, k * 1.15, m.hide);
		const w = fig.parts.weapon;
		if (w) {
			add(w, cyl$1, m.iron, 0, .22 * k, 0, .1 * k, 1.15 * k, .1 * k);
			add(w, box$1, m.bone, 0, .82 * k, 0, .32 * k, .38 * k, .24 * k);
		}
		this.limb(fig, "l", -.2 * k, .72 * k, k, m.hide, .5);
		this.limb(fig, "r", .2 * k, .72 * k, k, m.hide, .5);
		if (guardian) add(fig.root, tor$1, m.ember, 0, 1.45 * k, 0, 1.25 * k, 1.25 * k, 1.25 * k, Math.PI / 2);
	}
	boss(fig, k, m) {
		const torso = add(fig.root, torsoGeo, m.hide, 0, .85 * k, .06 * k, 1.55 * k, 1.4 * k, 1.3 * k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		plates(torso, m.iron, m.gold, 5);
		const head = add(fig.root, sph$1, m.hide, 0, 2.18 * k, .16 * k, .52 * k, .52 * k, .48 * k);
		fig.parts.head = head;
		this.eyes(head, true, 1.2);
		add(head, cone$1, m.bone, -.3, .45, .04, .16 * k, .58 * k, .16 * k, .15);
		add(head, cone$1, m.bone, .3, .45, .04, .16 * k, .58 * k, .16 * k, .15);
		add(head, cone$1, m.iron, 0, .52, -.08, .18 * k, .48 * k, .18 * k, .2);
		const lWing = new Group();
		lWing.position.set(-.2 * k, 1.7 * k, -.18 * k);
		fig.root.add(lWing);
		fig.parts.lWing = lWing;
		const wingMat = m.banner.clone();
		wingMat.side = 2;
		wingMat.transparent = true;
		wingMat.opacity = .88;
		add(lWing, wingGeo, wingMat, 0, 0, 0, 1.6 * k, 1.3 * k, 1, .15, .15, .35);
		const rWing = new Group();
		rWing.position.set(.2 * k, 1.7 * k, -.18 * k);
		fig.root.add(rWing);
		fig.parts.rWing = rWing;
		add(rWing, wingGeo, wingMat, 0, 0, 0, -1.6 * k, 1.3 * k, 1, .15, -.15, -.35);
		this.arms(fig, .6 * k, 1.75 * k, k * 1.15, m.hide);
		const w = fig.parts.weapon;
		if (w) {
			add(w, cyl$1, m.iron, 0, .32 * k, 0, .08 * k, 1.45 * k, .08 * k);
			add(w, box$1, m.gold, .1 * k, 1.08 * k, 0, .42 * k, .4 * k, .1 * k);
			add(w, cone$1, m.gold, .34 * k, 1.08 * k, 0, .22 * k, .48 * k, .08 * k, 0, 0, Math.PI / 2);
		}
		this.limb(fig, "l", -.22 * k, .88 * k, k, m.hide, .55);
		this.limb(fig, "r", .22 * k, .88 * k, k, m.hide, .55);
		const cloak = add(fig.root, box$1, m.cloth, 0, 1.4 * k, -.34 * k, .85 * k, 1.25 * k, .1 * k);
		fig.parts.cloak = cloak;
	}
	plate(fig, k, m) {
		const torso = add(fig.root, torsoGeo, m.iron, 0, .7 * k, 0, 1.05 * k, 1.02 * k, .95 * k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		plates(torso, m.iron, m.gold, 4);
		const head = add(fig.root, sph$1, m.skin, 0, 1.64 * k, .04 * k, .3 * k, .32 * k, .28 * k);
		fig.parts.head = head;
		this.eyes(head, false, .9);
		add(head, box$1, m.iron, 0, .12, .04, .92, .55, .95);
		add(head, box$1, m.gold, 0, .08, .42, .18, .12, .08, 0, 0, 0, false);
		this.arms(fig, .4 * k, 1.36 * k, k, m.iron, m.leather);
		const w = fig.parts.weapon;
		if (w) {
			add(w, box$1, m.iron, .12 * k, .02 * k, .1 * k, .48 * k, .62 * k, .08 * k);
			add(w, box$1, m.gold, .12 * k, .02 * k, .15 * k, .18 * k, .55 * k, .04 * k, 0, 0, 0, false);
		}
		this.limb(fig, "l", -.14 * k, .7 * k, k, m.iron);
		this.limb(fig, "r", .14 * k, .7 * k, k, m.iron);
		const cloak = add(fig.root, box$1, m.banner, 0, 1.08 * k, -.24 * k, .52 * k, .88 * k, .08 * k);
		fig.parts.cloak = cloak;
	}
	monk(fig, k, m) {
		const torso = add(fig.root, robeGeo, m.cloth, 0, .12 * k, 0, .85 * k, .92 * k, .85 * k);
		torso.userData.y0 = torso.position.y;
		fig.parts.torso = torso;
		const head = add(fig.root, sph$1, m.skin, 0, 1.58 * k, .04 * k, .3 * k, .32 * k, .28 * k);
		fig.parts.head = head;
		this.eyes(head, false, .9);
		this.arms(fig, .3 * k, 1.3 * k, k, m.skin);
		this.limb(fig, "l", -.12 * k, .7 * k, k, m.cloth, .4);
		this.limb(fig, "r", .12 * k, .7 * k, k, m.cloth, .4);
		add(fig.root, box$1, m.leather, 0, .88 * k, .12 * k, .42 * k, .08 * k, .08 * k);
		add(fig.root, box$1, m.banner, 0, 1.2 * k, .14 * k, .12 * k, .22 * k, .04 * k, 0, 0, 0, false);
	}
};
function figureKindFor(id, isNpc = false) {
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
var chunkGeo = new BoxGeometry(.14, .1, .12);
var sparkGeo = new SphereGeometry(.07, 6, 6);
var ringGeo = new TorusGeometry(1, .055, 6, 28);
var shaftGeo = new CylinderGeometry(.16, .48, 3.8, 10, 1, true);
var coneGeo = new ConeGeometry(.55, 2.6, 8, 1, true);
var wispGeo = new SphereGeometry(.09, 6, 6);
var slashGeo = new TorusGeometry(.78, .055, 5, 14, Math.PI * 1.15);
var scuffGeo = new CircleGeometry(.55, 12);
var warnRingGeo = new RingGeometry(.82, 1, 40);
var aimCircleGeo = new RingGeometry(.72, 1, 48);
var aimFillGeo = new CircleGeometry(1, 40);
var VfxWorld = class {
	group = new Group();
	kit;
	quality;
	bursts = [];
	shafts = [];
	pulses = [];
	motes = [];
	pool = [];
	add;
	ember;
	gold;
	blood;
	dust;
	lightBudget = 0;
	scene;
	maxLights;
	aimGroup = new Group();
	aimFill = null;
	aimEdge = null;
	aimKind = "";
	warn = [];
	constructor(scene, kit, quality) {
		this.scene = scene;
		this.kit = kit;
		this.quality = quality;
		this.maxLights = quality.maxLights;
		scene.add(this.group);
		this.add = new MeshBasicMaterial({
			color: 16755285,
			transparent: true,
			opacity: .5,
			depthWrite: false,
			blending: 2,
			side: 2
		});
		this.ember = kit.mats.ember;
		this.gold = new MeshBasicMaterial({
			color: 16764006,
			transparent: true,
			opacity: .5,
			depthWrite: false,
			blending: 2,
			side: 2
		});
		this.blood = new MeshBasicMaterial({
			color: 10031377,
			transparent: true,
			opacity: .9,
			depthWrite: false
		});
		this.dust = new MeshStandardMaterial({
			color: 6969928,
			roughness: .95,
			transparent: true,
			opacity: .85
		});
		this.group.add(this.aimGroup);
		this.aimGroup.visible = false;
	}
	clear() {
		for (const b of this.bursts) this.recycle(b.mesh);
		for (const s of this.shafts) {
			this.group.remove(s.mesh);
			if (s.light) this.scene.remove(s.light);
		}
		for (const p of this.pulses) this.group.remove(p.mesh);
		for (const m of this.motes) this.recycle(m.mesh);
		this.bursts = [];
		this.shafts = [];
		this.pulses = [];
		this.motes = [];
		this.lightBudget = 0;
		this.clearAim();
		for (const w of this.warn) this.group.remove(w.mesh);
		this.warn = [];
	}
	take(geo, mat) {
		const m = this.pool.pop() ?? new Mesh(geo, mat);
		m.geometry = geo;
		m.material = mat;
		m.visible = true;
		m.scale.set(1, 1, 1);
		m.rotation.set(0, 0, 0);
		this.group.add(m);
		return m;
	}
	recycle(m) {
		this.group.remove(m);
		if (this.pool.length < 90) this.pool.push(m);
	}
	burst(x, y, z, color, n, mode = "blood") {
		const count = Math.max(3, Math.round(n * this.quality.particles));
		for (let i = 0; i < count; i++) {
			const mat = mode === "ember" ? this.ember : mode === "soul" ? this.gold : mode === "chunk" ? this.dust : this.blood;
			const geo = mode === "chunk" ? chunkGeo : mode === "soul" ? wispGeo : sparkGeo;
			const mesh = this.take(geo, mat);
			mesh.position.set(x, y, z);
			mesh.scale.setScalar(.55 + Math.random() * 1.5);
			this.bursts.push({
				mesh,
				vx: (Math.random() - .5) * (mode === "soul" ? 1.1 : 5.8),
				vy: (mode === "soul" ? 1.9 : 2.4) + Math.random() * (mode === "soul" ? 2.2 : 5.2),
				vz: (Math.random() - .5) * (mode === "soul" ? 1.1 : 5.8),
				t: mode === "chunk" ? .95 : .32 + Math.random() * .32,
				spin: (Math.random() - .5) * 9
			});
		}
	}
	ring(x, z, color, grow = 6, life = .38) {
		const mat = this.add.clone();
		mat.color.setHex(color);
		const mesh = new Mesh(ringGeo, mat);
		mesh.rotation.x = Math.PI / 2;
		mesh.position.set(x, .07, z);
		mesh.scale.setScalar(.28);
		this.group.add(mesh);
		this.pulses.push({
			mesh,
			t: life,
			max: life,
			grow
		});
	}
	shock(x, z, color = 16755268) {
		this.ring(x, z, color, 9, .44);
		this.ring(x, z, 16773832, 5.5, .22);
		this.burst(x, .4, z, color, 16, "chunk");
		this.burst(x, .55, z, color, 12, "ember");
		this.flash(x, z, color, 3.4, .2);
		const scuff = new MeshBasicMaterial({
			color: 2758672,
			transparent: true,
			opacity: .45,
			depthWrite: false
		});
		const mesh = new Mesh(scuffGeo, scuff);
		mesh.rotation.x = -Math.PI / 2;
		mesh.position.set(x, .04, z);
		this.group.add(mesh);
		this.pulses.push({
			mesh,
			t: .55,
			max: .55,
			grow: 3.2
		});
	}
	whirl(x, z) {
		this.ring(x, z, 14527078, 3.8, .2);
		this.burst(x, .35, z, 9071168, 6, "chunk");
	}
	leap(x, z) {
		this.ring(x, z, 12886874, 5.8, .34);
		this.burst(x, .2, z, 9071168, 12, "chunk");
		this.flash(x, z, 16767136, 2.4, .12);
	}
	slash(x, z, facing) {
		const mat = this.add.clone();
		mat.color.setHex(16770224);
		const mesh = new Mesh(slashGeo, mat);
		mesh.position.set(x + Math.sin(facing) * .35, .95, z + Math.cos(facing) * .35);
		mesh.rotation.set(.35, facing, .95);
		this.group.add(mesh);
		this.pulses.push({
			mesh,
			t: .16,
			max: .16,
			grow: 3.6
		});
		this.burst(x, .9, z, 16764040, 4, "ember");
	}
	death(x, z, elite, boss) {
		this.burst(x, .8, z, 7803153, elite || boss ? 24 : 14, "blood");
		this.burst(x, .9, z, 4465169, elite || boss ? 18 : 9, "chunk");
		this.burst(x, 1.15, z, 16764040, elite || boss ? 16 : 7, "soul");
		if (boss) this.flash(x, z, 16720384, 8, .5);
	}
	lootShaft(x, z, color, rarity) {
		const tall = rarity === "legendary" || rarity === "set";
		const mat = this.gold.clone();
		mat.color.setHex(color);
		mat.opacity = tall ? .58 : rarity === "rare" ? .42 : .22;
		const mesh = new Mesh(shaftGeo, mat);
		mesh.position.set(x, tall ? 2.25 : 1.45, z);
		mesh.scale.set(tall ? 1.25 : .78, tall ? 1.45 : .88, tall ? 1.25 : .78);
		this.group.add(mesh);
		let light = null;
		if ((tall || rarity === "rare") && this.lightBudget < this.maxLights) {
			light = new PointLight(color, tall ? 14 : 8, tall ? 10 : 7, 1.5);
			light.position.set(x, 1.65, z);
			this.scene.add(light);
			this.lightBudget++;
		}
		if (tall) for (let i = 0; i < 5; i++) {
			const spark = this.take(wispGeo, this.gold);
			spark.position.set(x, .6 + i * .45, z);
			spark.scale.setScalar(.4);
			this.motes.push({
				mesh: spark,
				x,
				y: .6 + i * .45,
				z,
				vy: .55,
				t: 8
			});
		}
		this.shafts.push({
			mesh,
			light,
			t: 999,
			max: 999,
			spin: tall ? .65 : 1.35
		});
		return {
			mesh,
			light
		};
	}
	dropShaft(mesh, light) {
		this.shafts = this.shafts.filter((s) => {
			if (s.mesh === mesh) {
				this.group.remove(s.mesh);
				if (s.light) {
					this.scene.remove(s.light);
					this.lightBudget = Math.max(0, this.lightBudget - 1);
				}
				return false;
			}
			return true;
		});
		if (light && !this.shafts.some((s) => s.light === light)) this.scene.remove(light);
	}
	flash(x, z, color, dist, life) {
		if (this.lightBudget >= this.maxLights) return;
		const l = new PointLight(color, 12, dist, 1.6);
		l.position.set(x, 1.4, z);
		this.scene.add(l);
		this.lightBudget++;
		window.setTimeout(() => {
			this.scene.remove(l);
			this.lightBudget = Math.max(0, this.lightBudget - 1);
		}, life * 1e3);
	}
	shatter(x, z) {
		this.burst(x, .4, z, 6965800, 18, "chunk");
		this.ring(x, z, 11171652, 4, .25);
	}
	/** High-contrast red enemy windup ring. Stays put until life expires. */
	warnCircle(x, z, r, life = .9) {
		const mat = new MeshBasicMaterial({
			color: 16720384,
			transparent: true,
			opacity: .92,
			depthWrite: false,
			side: 2
		});
		const mesh = new Mesh(warnRingGeo, mat);
		mesh.rotation.x = -Math.PI / 2;
		mesh.position.set(x, .08, z);
		mesh.scale.setScalar(Math.max(.4, r));
		this.group.add(mesh);
		this.warn.push({
			mesh,
			t: life
		});
		const fill = new MeshBasicMaterial({
			color: 16720384,
			transparent: true,
			opacity: .18,
			depthWrite: false,
			side: 2
		});
		const disc = new Mesh(aimFillGeo, fill);
		disc.rotation.x = -Math.PI / 2;
		disc.position.set(x, .06, z);
		disc.scale.setScalar(Math.max(.4, r));
		this.group.add(disc);
		this.warn.push({
			mesh: disc,
			t: life
		});
	}
	setAim(kind, x, z, facing, range, radius, charged) {
		if (this.aimKind !== kind) {
			this.clearAim();
			this.aimKind = kind;
			const fillMat = new MeshBasicMaterial({
				color: charged ? 16763989 : 16733491,
				transparent: true,
				opacity: .28,
				depthWrite: false,
				side: 2
			});
			const edgeMat = new MeshBasicMaterial({
				color: charged ? 16769160 : 16724753,
				transparent: true,
				opacity: .92,
				depthWrite: false,
				side: 2
			});
			if (kind === "circle") {
				this.aimFill = new Mesh(aimFillGeo, fillMat);
				this.aimEdge = new Mesh(aimCircleGeo, edgeMat);
				this.aimFill.rotation.x = -Math.PI / 2;
				this.aimEdge.rotation.x = -Math.PI / 2;
			} else if (kind === "cone") {
				const shape = new Shape();
				shape.moveTo(0, 0);
				const half = Math.PI / 4;
				const segs = 10;
				for (let i = 0; i <= segs; i++) {
					const a = -half + i / segs * half * 2;
					shape.lineTo(Math.sin(a) * range, -Math.cos(a) * range);
				}
				shape.lineTo(0, 0);
				const geo = new ShapeGeometry(shape);
				this.aimFill = new Mesh(geo, fillMat);
				this.aimFill.rotation.x = -Math.PI / 2;
				this.aimEdge = new Mesh(aimCircleGeo, edgeMat);
				this.aimEdge.rotation.x = -Math.PI / 2;
			} else {
				const geo = new PlaneGeometry(radius * 1.4, range);
				this.aimFill = new Mesh(geo, fillMat);
				this.aimFill.rotation.x = -Math.PI / 2;
				this.aimEdge = new Mesh(aimCircleGeo, edgeMat);
				this.aimEdge.rotation.x = -Math.PI / 2;
			}
			if (this.aimFill) this.aimGroup.add(this.aimFill);
			if (this.aimEdge) this.aimGroup.add(this.aimEdge);
		}
		this.aimGroup.visible = true;
		this.aimGroup.position.set(x, .07, z);
		this.aimGroup.rotation.y = facing;
		const gold = charged;
		for (const m of [this.aimFill, this.aimEdge]) {
			if (!m) continue;
			const mat = m.material;
			mat.color.setHex(gold ? m === this.aimEdge ? 16769160 : 16763989 : m === this.aimEdge ? 16724753 : 16733491);
			mat.opacity = gold ? m === this.aimEdge ? 1 : .38 : m === this.aimEdge ? .92 : .28;
		}
		if (kind === "circle" && this.aimFill && this.aimEdge) {
			const s = Math.max(.6, radius);
			this.aimFill.scale.setScalar(s);
			this.aimEdge.scale.setScalar(s);
		} else if (kind === "line" && this.aimFill) {
			this.aimFill.position.set(0, 0, -range * .5);
			if (this.aimEdge) {
				this.aimEdge.position.set(0, 0, -range);
				this.aimEdge.scale.setScalar(Math.max(.35, radius));
			}
		} else if (kind === "cone" && this.aimEdge) {
			this.aimEdge.position.set(0, 0, -range);
			this.aimEdge.scale.setScalar(Math.max(.4, radius * .55));
		}
	}
	clearAim() {
		while (this.aimGroup.children.length) this.aimGroup.remove(this.aimGroup.children[0]);
		this.aimFill = null;
		this.aimEdge = null;
		this.aimKind = "";
		this.aimGroup.visible = false;
	}
	seedMotes(biome, cx, cz) {
		const n = Math.round((biome === "hell" || biome === "rift" ? 34 : 22) * this.quality.particles);
		const col = biome === "ice" ? 11193582 : biome === "hell" || biome === "rift" ? 16737826 : 12886128;
		const mat = this.add.clone();
		mat.color.setHex(col);
		mat.opacity = .32;
		for (let i = 0; i < n; i++) {
			const mesh = this.take(wispGeo, mat);
			const x = cx + (Math.random() - .5) * 28;
			const z = cz + (Math.random() - .5) * 28;
			const y = .35 + Math.random() * 3.4;
			mesh.position.set(x, y, z);
			mesh.scale.setScalar(.32 + Math.random() * .55);
			this.motes.push({
				mesh,
				x,
				y,
				z,
				vy: .12 + Math.random() * .42,
				t: 4 + Math.random() * 6
			});
		}
	}
	windowShaft(x, y, z, rotY) {
		const mat = this.gold.clone();
		mat.color.setHex(16767136);
		mat.opacity = .11;
		const mesh = new Mesh(coneGeo, mat);
		mesh.position.set(x, y, z);
		mesh.rotation.x = Math.PI;
		mesh.rotation.y = rotY;
		mesh.scale.set(1.25, 1.65, 1.25);
		this.group.add(mesh);
	}
	update(dt, t, px, pz) {
		for (let i = this.bursts.length - 1; i >= 0; i--) {
			const b = this.bursts[i];
			b.t -= dt;
			b.mesh.position.x += b.vx * dt;
			b.mesh.position.y += b.vy * dt;
			b.mesh.position.z += b.vz * dt;
			b.vy -= (b.vy > 0 && b.mesh.material === this.gold ? 1.2 : 11) * dt;
			b.mesh.rotation.x += b.spin * dt;
			b.mesh.rotation.z += b.spin * .6 * dt;
			const mat = b.mesh.material;
			if ("opacity" in mat) mat.opacity = Math.max(0, b.t * 2.4);
			if (b.t <= 0) {
				this.recycle(b.mesh);
				this.bursts.splice(i, 1);
			}
		}
		for (let i = this.pulses.length - 1; i >= 0; i--) {
			const p = this.pulses[i];
			p.t -= dt;
			const u = 1 - p.t / p.max;
			const s = .3 + u * p.grow;
			p.mesh.scale.set(s, s, s);
			const mat = p.mesh.material;
			if ("opacity" in mat) mat.opacity = Math.max(0, (1 - u) * .65);
			if (p.t <= 0) {
				this.group.remove(p.mesh);
				this.pulses.splice(i, 1);
			}
		}
		for (const s of this.shafts) {
			s.mesh.rotation.y += dt * s.spin;
			const mat = s.mesh.material;
			if ("opacity" in mat) mat.opacity = (mat.opacity > .3 ? .45 : .22) + Math.sin(t * 2.2 + s.mesh.position.x) * .06;
		}
		for (const m of this.motes) {
			m.y += m.vy * dt;
			if (m.y > 4.2) m.y = .3;
			m.mesh.position.set(m.x + Math.sin(t * .6 + m.x) * .4, m.y, m.z + Math.cos(t * .5 + m.z) * .4);
			const dx = m.x - px;
			const dz = m.z - pz;
			m.mesh.visible = dx * dx + dz * dz < 240;
		}
		for (let i = this.warn.length - 1; i >= 0; i--) {
			const w = this.warn[i];
			w.t -= dt;
			const mat = w.mesh.material;
			if ("opacity" in mat) mat.opacity = Math.max(.08, mat.opacity * (w.t < .18 ? .92 : 1));
			w.mesh.scale.x *= 1 + dt * .08;
			w.mesh.scale.z *= 1 + dt * .08;
			if (w.t <= 0) {
				this.group.remove(w.mesh);
				this.warn.splice(i, 1);
			}
		}
	}
};
var box = new BoxGeometry(1, 1, 1);
var cyl = new CylinderGeometry(.5, .5, 1, 10);
var cylT = new CylinderGeometry(.28, .5, 1, 8);
var cone = new ConeGeometry(.5, 1, 4);
var sph = new SphereGeometry(.5, 10, 8);
var plane = new PlaneGeometry(1, 1);
var tor = new TorusGeometry(.5, .1, 6, 14);
var octa = new OctahedronGeometry(.5, 0);
function peakedRoofGeo() {
	const hw = .5, hd = .5, h = 1;
	const pos = new Float32Array([
		-.5,
		0,
		-.5,
		hw,
		0,
		-.5,
		hw,
		0,
		hd,
		-.5,
		0,
		hd,
		0,
		h,
		-.5,
		0,
		h,
		hd
	]);
	const idx = [
		0,
		5,
		4,
		0,
		3,
		5,
		1,
		4,
		5,
		1,
		5,
		2,
		0,
		4,
		1,
		3,
		2,
		5
	];
	const geo = new BufferGeometry();
	geo.setAttribute("position", new BufferAttribute(pos, 3));
	geo.setIndex(idx);
	geo.computeVertexNormals();
	const uv = new Float32Array([
		0,
		0,
		1,
		0,
		1,
		1,
		0,
		1,
		.5,
		1,
		.5,
		0
	]);
	geo.setAttribute("uv", new BufferAttribute(uv, 2));
	return geo;
}
var roofGeo = peakedRoofGeo();
function mistTex(warm) {
	const cv = document.createElement("canvas");
	cv.width = 128;
	cv.height = 128;
	const ctx = cv.getContext("2d");
	const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
	g.addColorStop(0, warm ? "rgba(210,140,80,0.4)" : "rgba(160,170,180,0.32)");
	g.addColorStop(.55, warm ? "rgba(80,40,20,0.12)" : "rgba(30,40,50,0.1)");
	g.addColorStop(1, "rgba(0,0,0,0)");
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, 128, 128);
	const t = new CanvasTexture(cv);
	t.needsUpdate = true;
	return t;
}
var WorldKit = class {
	scene;
	wallsGroup;
	decorGroup;
	kit;
	quality;
	ground = null;
	hemi = null;
	dir = null;
	rim = null;
	lights = [];
	torches = [];
	playerLight = null;
	fillWarm = null;
	fillCool = null;
	backdrop = new Group();
	constructor(scene, wallsGroup, decorGroup, kit, quality) {
		this.scene = scene;
		this.wallsGroup = wallsGroup;
		this.decorGroup = decorGroup;
		this.kit = kit;
		this.quality = quality;
		scene.add(this.backdrop);
	}
	clear() {
		while (this.wallsGroup.children.length) this.wallsGroup.remove(this.wallsGroup.children[0]);
		while (this.decorGroup.children.length) this.decorGroup.remove(this.decorGroup.children[0]);
		while (this.backdrop.children.length) this.backdrop.remove(this.backdrop.children[0]);
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
	put(geo, mat, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0, shadow = true, group = this.decorGroup) {
		const m = new Mesh(geo, mat);
		m.position.set(x, y, z);
		m.scale.set(sx, sy, sz);
		m.rotation.set(rx, ry, rz);
		m.castShadow = shadow;
		m.receiveShadow = true;
		group.add(m);
		return m;
	}
	dress(level, vfx) {
		this.clear();
		const hell = level.biome === "hell" || level.biome === "rift";
		const ice = level.biome === "ice" || level.biome === "flood";
		const fogCol = hell ? 2888718 : ice ? 1318952 : 1841172;
		this.scene.fog = new FogExp2(fogCol, level.fog * (hell ? .48 : .55));
		this.scene.background = new Color(fogCol);
		const floorMat = this.kit.floorFor(level.biome).clone();
		if (hell) {
			floorMat.color.setRGB(1.45, 1.12, .92);
			floorMat.emissive = new Color(3806216);
			floorMat.emissiveIntensity = .18;
		}
		if (floorMat.map) {
			const rep = Math.max(5, Math.round(Math.max(level.bounds.w, level.bounds.d) / 5.5));
			floorMat.map = floorMat.map.clone();
			floorMat.map.wrapS = floorMat.map.wrapT = RepeatWrapping;
			floorMat.map.repeat.set(rep, rep);
			if (floorMat.normalMap) {
				floorMat.normalMap = floorMat.normalMap.clone();
				floorMat.normalMap.wrapS = floorMat.normalMap.wrapT = RepeatWrapping;
				floorMat.normalMap.repeat.set(rep, rep);
			}
		}
		const geo = new PlaneGeometry(level.bounds.w + 36, level.bounds.d + 36, 1, 1);
		geo.rotateX(-Math.PI / 2);
		const ground = new Mesh(geo, floorMat);
		ground.position.set(level.bounds.x, 0, level.bounds.z);
		ground.receiveShadow = true;
		this.ground = ground;
		this.scene.add(ground);
		this.hemi = new HemisphereLight(hell ? 16763040 : ice ? 13162728 : 15262940, hell ? 4858388 : 3024412, hell ? 1.05 : 1.12);
		this.dir = new DirectionalLight(hell ? 16756858 : ice ? 13688044 : 16769728, hell ? 1.45 : 1.58);
		this.dir.position.set(8, 14, 8);
		this.dir.castShadow = this.quality.shadows;
		this.dir.shadow.mapSize.set(this.quality.shadowMap, this.quality.shadowMap);
		const s = 18;
		this.dir.shadow.camera.left = -18;
		this.dir.shadow.camera.right = s;
		this.dir.shadow.camera.top = s;
		this.dir.shadow.camera.bottom = -18;
		this.dir.shadow.camera.near = 2;
		this.dir.shadow.camera.far = 60;
		this.dir.shadow.bias = -6e-4;
		this.dir.shadow.normalBias = .032;
		this.dir.shadow.intensity = .48;
		this.dir.shadow.radius = 3.2;
		this.dir.shadow.camera.updateProjectionMatrix();
		this.rim = new DirectionalLight(hell ? 16737860 : 15257760, .72);
		this.rim.position.set(-8, 7, -8);
		const amb = new AmbientLight(hell ? 3810328 : 3945516, Math.max(.58, level.ambient * 1.35));
		this.scene.add(this.hemi, this.dir, this.dir.target, this.rim, amb);
		this.lights.push(this.hemi, this.dir, this.rim, amb);
		this.playerLight = new PointLight(16760976, 14, 13, 1.45);
		this.playerLight.position.set(level.playerX, 2.4, level.playerZ);
		this.scene.add(this.playerLight);
		this.lights.push(this.playerLight);
		this.fillWarm = new PointLight(hell ? 16746564 : 16765608, 9, 16, 1.5);
		this.fillWarm.position.set(level.playerX + 4.2, 3.4, level.playerZ + 3.2);
		this.scene.add(this.fillWarm);
		this.lights.push(this.fillWarm);
		if (!this.quality.low) {
			this.fillCool = new PointLight(hell ? 16737826 : 11057352, 5.5, 15, 1.5);
			this.fillCool.position.set(level.playerX - 4.4, 3, level.playerZ - 3.4);
			this.scene.add(this.fillCool);
			this.lights.push(this.fillCool);
		}
		this.kit.mats.wall;
		const trim = this.kit.mats.iron;
		const gold = this.kit.mats.gold;
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
	followShadows(x, z) {
		if (!this.dir) return;
		this.dir.position.set(x + 8, 14, z + 8);
		this.dir.target.position.set(x, .6, z);
		this.dir.target.updateMatrixWorld();
		if (this.rim) this.rim.position.set(x - 8, 7, z - 8);
		if (this.playerLight) this.playerLight.position.set(x + .6, 2.45, z + .55);
		if (this.fillWarm) this.fillWarm.position.set(x + 4.2, 3.4, z + 3.2);
		if (this.fillCool) this.fillCool.position.set(x - 4.4, 3, z - 3.4);
	}
	flicker(t, px, pz) {
		let n = 0;
		for (const tr of this.torches) {
			const near = Math.hypot(tr.x - px, tr.z - pz) < 20;
			tr.flame.scale.setScalar(.88 + Math.sin(t * 12 + tr.x) * .14);
			tr.flame.rotation.y = Math.sin(t * 7 + tr.z) * .15;
			if (tr.light) {
				tr.light.visible = near && n < this.quality.maxLights;
				if (tr.light.visible) {
					tr.light.intensity = tr.base * (.9 + Math.sin(t * 9 + tr.z) * .1);
					n++;
				}
			}
		}
	}
	gothicBuilding(x, z, w, d, cathedral) {
		const wall = this.kit.mats.wall;
		const iron = this.kit.mats.iron;
		const gold = this.kit.mats.gold;
		const roof = this.kit.mats.roof;
		const h = cathedral ? 6.4 : 4.7;
		this.put(box, wall, x, .18, z, w + .4, .36, d + .4);
		this.put(box, wall, x, h / 2, z, w, h, d);
		this.put(box, iron, x, h, z, w + .32, .16, d + .32);
		this.put(box, wall, x, h + .38, z, w * .9, .72, d * .9);
		this.put(box, iron, x, h * .52, z, w + .18, .12, d + .18, 0, 0, 0, false);
		const roofMesh = this.put(roofGeo, roof, x, h + .7, z, w + .7, cathedral ? 2.6 : 1.85, d + .7);
		roofMesh.castShadow = true;
		const corners = [
			[x - w / 2, z - d / 2],
			[x + w / 2, z - d / 2],
			[x - w / 2, z + d / 2],
			[x + w / 2, z + d / 2]
		];
		for (const [cx, cz] of corners) {
			this.put(cylT, wall, cx, 1.7, cz, .7, 3.4, .7);
			this.put(box, iron, cx, 3.45, cz, .85, .14, .85, 0, 0, 0, false);
		}
		const glow = new MeshStandardMaterial({
			color: 16767136,
			emissive: 16764040,
			emissiveIntensity: 1.15,
			roughness: .35
		});
		const faces = [
			[
				x,
				2.15,
				z + d / 2 + .04,
				0
			],
			[
				x,
				2.15,
				z - d / 2 - .04,
				Math.PI
			],
			[
				x + w / 2 + .04,
				2.15,
				z,
				Math.PI / 2
			],
			[
				x - w / 2 - .04,
				2.15,
				z,
				-Math.PI / 2
			]
		];
		for (const [wx, wy, wz, ry] of faces) {
			this.put(box, glow, wx, wy, wz, .55, .95, .08, 0, ry, 0, false);
			this.put(box, iron, wx, wy, wz, .7, 1.15, .05, 0, ry, 0, false);
			this.put(box, glow, wx, wy + 1.35, wz, .42, .7, .07, 0, ry, 0, false);
		}
		this.put(box, this.kit.mats.wood, x, 1.15, z + d / 2 + .06, .85, 2.1, .1);
		this.put(tor, iron, x, 2.05, z + d / 2 + .08, .9, .9, .35, Math.PI / 2, 0, 0, false);
		if (cathedral) {
			this.put(cyl, wall, x - w * .42, 4.4, z - d * .15, 1.15, 5.2, 1.15);
			this.put(cyl, wall, x + w * .42, 4.4, z - d * .15, 1.15, 5.2, 1.15);
			this.put(cone, roof, x - w * .42, 7.4, z - d * .15, 1.6, 2.4, 1.6);
			this.put(cone, roof, x + w * .42, 7.4, z - d * .15, 1.6, 2.4, 1.6);
			this.put(box, gold, x - w * .42, 8.7, z - d * .15, .12, .5, .12, 0, 0, 0, false);
			this.put(box, gold, x + w * .42, 8.7, z - d * .15, .12, .5, .12, 0, 0, 0, false);
			this.put(sph, glow, x, 3.4, z + d / 2 + .05, 1.15, 1.15, .12, 0, 0, 0, false);
			this.put(tor, gold, x, 3.4, z + d / 2 + .08, 1.4, 1.4, .4, 0, 0, 0, false);
		}
		const battlements = Math.max(3, Math.round(w / 1.4));
		for (let i = 0; i < battlements; i++) {
			const t = (i + .5) / battlements - .5;
			this.put(box, wall, x + t * w, h + .95, z + d / 2 - .12, .38, .55, .28, 0, 0, 0, false);
		}
		this.hangBanner(x + w * .28, z + d / 2 + .08, 2.6);
		this.addTorch(x + w * .42, z + d * .42, 2.35);
	}
	plazaCurb(w) {
		const wall = this.kit.mats.wall;
		const iron = this.kit.mats.iron;
		const alongX = w.w >= w.d;
		this.put(box, wall, w.x, .38, w.z, w.w, .76, w.d, 0, 0, 0, false, this.wallsGroup);
		const len = alongX ? w.w : w.d;
		const n = Math.max(4, Math.round(len / 4.2));
		for (let i = 0; i < n; i++) {
			const t = (i + .5) / n - .5;
			const x = alongX ? w.x + t * w.w : w.x;
			const z = alongX ? w.z : w.z + t * w.d;
			this.put(cyl, wall, x, 1.15, z, .55, 2.3, .55);
			this.put(box, iron, x, 2.32, z, .7, .12, .7, 0, 0, 0, false);
			this.put(sph, this.kit.mats.gold, x, 2.5, z, .22, .22, .22, 0, 0, 0, false);
		}
	}
	dungeonWall(w, hell, ice) {
		const wall = hell ? this.kit.mats.hell : ice ? this.kit.mats.ice : this.kit.mats.wall;
		const h = 3.15;
		this.put(box, wall, w.x, h / 2, w.z, w.w, h, w.d, 0, 0, 0, true, this.wallsGroup);
		this.put(box, this.kit.mats.iron, w.x, 3.23, w.z, w.w + .08, .14, w.d + .08, 0, 0, 0, false);
	}
	hangBanner(x, z, y) {
		this.put(cyl, this.kit.mats.iron, x, y + .15, z, .08, .7, .08, 0, 0, 0, false);
		this.put(plane, this.kit.mats.banner, x, y - .55, z + .02, .7, 1.15, 1, 0, 0, 0, false);
	}
	addTorch(x, z, y = 1.7) {
		const iron = this.kit.mats.iron;
		const ember = this.kit.mats.ember;
		this.put(box, iron, x, y, z, .1, .55, .1, 0, 0, 0, false);
		this.put(cyl, iron, x, y + .28, z, .3, .12, .3, 0, 0, 0, false);
		const flame = this.put(cone, ember, x, y + .52, z, .22, .48, .22, 0, 0, 0, false);
		this.put(sph, ember, x, y + .42, z, .18, .18, .18, 0, 0, 0, false);
		let light = null;
		const base = 16;
		if (this.torches.length < this.quality.maxLights + 8) {
			light = new PointLight(16746564, base, 11, 1.5);
			light.position.set(x, y + .58, z);
			this.scene.add(light);
			this.lights.push(light);
		}
		this.torches.push({
			flame,
			light,
			x,
			z,
			base
		});
	}
	groundFog(level, hell, ice) {
		const mat = new MeshBasicMaterial({
			map: mistTex(hell),
			transparent: true,
			opacity: hell ? .16 : ice ? .14 : .12,
			depthWrite: false,
			fog: true
		});
		const b = level.bounds;
		const spots = [
			[b.x - b.w * .38, b.z - b.d * .38],
			[b.x + b.w * .38, b.z - b.d * .38],
			[b.x - b.w * .38, b.z + b.d * .38],
			[b.x + b.w * .38, b.z + b.d * .38]
		];
		for (const [x, z] of spots) {
			const m = new Mesh(new PlaneGeometry(11, 11), mat);
			m.rotation.x = -Math.PI / 2;
			m.position.set(x, .14, z);
			this.decorGroup.add(m);
		}
	}
	floorDecals(level, hell, ice) {
		const blood = new MeshBasicMaterial({
			color: 6952976,
			transparent: true,
			opacity: .22,
			depthWrite: false
		});
		const scorch = new MeshBasicMaterial({
			color: 4861988,
			transparent: true,
			opacity: .16,
			depthWrite: false
		});
		const moss = new MeshBasicMaterial({
			color: 3820080,
			transparent: true,
			opacity: .18,
			depthWrite: false
		});
		const n = this.quality.low ? 8 : 16;
		for (let i = 0; i < n; i++) {
			const x = level.bounds.x + Math.sin(i * 2.7 + level.seed) * level.bounds.w / 2.6;
			const z = level.bounds.z + Math.cos(i * 1.9 + level.seed) * level.bounds.d / 2.6;
			const mat = hell ? scorch : ice ? moss : i % 3 === 0 ? blood : moss;
			const s = .8 + i % 5 * .35;
			this.put(plane, mat, x, .03, z, s, s * .7, 1, -Math.PI / 2, i, 0, false);
		}
		if (hell) for (let i = 0; i < 7; i++) {
			const x = level.bounds.x + (i - 3) * 2.4;
			const z = level.bounds.z + Math.sin(i * 1.3) * 4;
			this.put(box, this.kit.mats.ember, x, .02, z, .12 + i % 3 * .08, .04, 2.2 + i % 2, 0, i * .4, 0, false);
		}
	}
	dressTown(level, vfx, gold, trim) {
		this.brazier(0, -1.2);
		this.saintStatue(-5.4, -4.6);
		this.fountain(4.6, -4.4);
		this.crateStack(-6.2, 6.4);
		this.crateStack(6.4, 6.2);
		this.crateStack(-7.5, -6.8);
		this.addTorch(-3.8, 6.2, 1.6);
		this.addTorch(3.8, 6.2, 1.6);
		this.addTorch(-8.4, .2, 1.6);
		this.addTorch(8.4, .2, 1.6);
		this.lamp(-4.2, 3.6);
		this.lamp(4.2, 3.6);
		this.lamp(-4.2, -6.5);
		this.lamp(4.2, -6.5);
		vfx.windowShaft(0, 4.2, -9.4, 0);
		vfx.windowShaft(-12, 3.4, -5.2, 0);
		vfx.windowShaft(12, 3.4, -5.2, 0);
		this.put(cyl, this.kit.mats.stone, 0, .08, 0, 9.5, .1, 9.5, 0, 0, 0, false);
		this.put(tor, gold, 0, .12, 0, 8.4, 8.4, .6, Math.PI / 2, 0, 0, false);
	}
	lamp(x, z) {
		this.put(cyl, this.kit.mats.iron, x, 1.15, z, .12, 2.3, .12);
		this.put(box, this.kit.mats.iron, x, 2.35, z, .38, .12, .38, 0, 0, 0, false);
		const flame = this.put(sph, this.kit.mats.ember, x, 2.55, z, .22, .22, .22, 0, 0, 0, false);
		const light = new PointLight(16746564, 12, 10, 1.5);
		light.position.set(x, 2.6, z);
		this.scene.add(light);
		this.lights.push(light);
		this.torches.push({
			flame,
			light,
			x,
			z,
			base: 12
		});
	}
	brazier(x, z) {
		this.put(cyl, this.kit.mats.iron, x, .22, z, 1.35, .44, 1.35);
		this.put(cylT, this.kit.mats.iron, x, .7, z, 1.15, .55, 1.15);
		const fire = this.put(sph, this.kit.mats.ember, x, 1.15, z, .7, .7, .7, 0, 0, 0, false);
		this.put(cone, this.kit.mats.ember, x, 1.45, z, .45, .7, .45, 0, 0, 0, false);
		const blaze = new PointLight(16742195, 26, 16, 1.45);
		blaze.position.set(x, 1.7, z);
		this.scene.add(blaze);
		this.lights.push(blaze);
		this.torches.push({
			flame: fire,
			light: blaze,
			x,
			z,
			base: 26
		});
	}
	saintStatue(x, z) {
		this.put(cyl, this.kit.mats.stone, x, .2, z, 1.1, .4, 1.1);
		this.put(box, this.kit.mats.stone, x, 1.15, z, .55, 1.5, .4);
		this.put(sph, this.kit.mats.stone, x, 2.05, z, .42, .48, .4);
		this.put(box, this.kit.mats.iron, x + .28, 1.35, z, .12, 1.1, .08, 0, 0, -.4);
		this.put(box, this.kit.mats.gold, x, 2.38, z, .22, .16, .22, 0, 0, 0, false);
	}
	fountain(x, z) {
		this.put(cyl, this.kit.mats.stone, x, .18, z, 1.8, .36, 1.8);
		this.put(cyl, this.kit.mats.iron, x, .55, z, .45, .9, .45);
		this.put(sph, this.kit.mats.ice, x, 1.15, z, .45, .28, .45, 0, 0, 0, false);
		this.put(tor, this.kit.mats.gold, x, .42, z, 1.5, 1.5, .35, Math.PI / 2, 0, 0, false);
	}
	stall(x, z, ry) {
		const g = new Group();
		g.position.set(x, 0, z);
		g.rotation.y = ry;
		const wood = this.kit.mats.wood;
		const cloth = this.kit.mats.banner;
		const body = new Mesh(box, wood);
		body.position.y = .55;
		body.scale.set(1.8, .7, 1.1);
		body.castShadow = true;
		g.add(body);
		const roof = new Mesh(box, cloth);
		roof.position.set(0, 1.45, 0);
		roof.scale.set(2, .08, 1.3);
		roof.rotation.x = -.15;
		g.add(roof);
		const pole = new Mesh(cyl, this.kit.mats.iron);
		pole.position.set(-.85, 1.05, -.45);
		pole.scale.set(.08, 1.1, .08);
		g.add(pole);
		const pole2 = pole.clone();
		pole2.position.x = .85;
		g.add(pole2);
		this.decorGroup.add(g);
	}
	crateStack(x, z) {
		this.put(box, this.kit.mats.wood, x, .28, z, .7, .55, .55);
		this.put(box, this.kit.mats.wood, x + .4, .22, z + .15, .5, .42, .45, 0, .4, 0);
		this.put(cyl, this.kit.mats.wood, x - .45, .32, z + .1, .5, .62, .5);
	}
	anvil(x, z) {
		this.put(box, this.kit.mats.wood, x, .28, z, 1.15, .55, .7);
		this.put(box, this.kit.mats.iron, x, .72, z, .85, .28, .35);
		this.put(box, this.kit.mats.iron, x + .35, .78, z, .35, .16, .18);
		this.put(sph, this.kit.mats.ember, x - .55, .22, z + .4, .18, .18, .18, 0, 0, 0, false);
	}
	mysticTable(x, z) {
		this.put(cyl, this.kit.mats.wood, x, .45, z, 1.1, .9, 1.1);
		this.put(octa, this.kit.mats.crystal, x, 1.15, z, .45, .7, .45);
		const l = new PointLight(6728447, 10, 8, 1.5);
		l.position.set(x, 1.4, z);
		this.scene.add(l);
		this.lights.push(l);
	}
	dressDungeon(level, vfx, trim, hell, ice) {
		const glow = new MeshStandardMaterial({
			color: ice ? 8965358 : hell ? 16737826 : 16767136,
			emissive: ice ? 2254472 : hell ? 16724753 : 16764040,
			emissiveIntensity: 1.15,
			roughness: .4
		});
		for (const r of level.rooms) {
			const inset = 1.05;
			const pts = [
				[r.x - r.w / 2 + inset, r.z - r.d / 2 + inset],
				[r.x + r.w / 2 - inset, r.z - r.d / 2 + inset],
				[r.x - r.w / 2 + inset, r.z + r.d / 2 - inset],
				[r.x + r.w / 2 - inset, r.z + r.d / 2 - inset]
			];
			for (const [px, pz] of pts) {
				this.put(cylT, this.kit.mats.wall, px, 1.55, pz, .7, 3.1, .7);
				this.put(box, this.kit.mats.gold, px, 3.2, pz, .85, .16, .85, 0, 0, 0, false);
				this.put(cyl, this.kit.mats.iron, px, .18, pz, .95, .36, .95, 0, 0, 0, false);
			}
			this.addTorch(r.x + r.w * .28, r.z - r.d * .28, 2.2);
			this.addTorch(r.x - r.w * .28, r.z + r.d * .22, 2.2);
			if (r.kind === "boss" || r.kind === "elite") {
				const l = new PointLight(r.kind === "boss" ? 16729122 : 16755285, 14, 14, 1.5);
				l.position.set(r.x, 2.8, r.z);
				this.scene.add(l);
				this.lights.push(l);
				this.put(tor, hell ? this.kit.mats.ember : this.kit.mats.gold, r.x, .06, r.z, 4.2, 4.2, .8, Math.PI / 2, 0, 0, false);
			}
			const wx = r.x;
			const wz = r.z - r.d / 2 + .1;
			this.put(box, glow, wx, 2.2, wz, 1.15, 1.4, .12, 0, 0, 0, false);
			vfx.windowShaft(wx, 2.6, wz + .7, 0);
			this.put(tor, trim, r.x, 2.9, r.z - r.d / 2 + .2, 2.2, 1.4, .55, 0, 0, 0, false);
			if (r.kind === "combat" || r.kind === "elite") {
				this.put(box, this.kit.mats.bone, r.x - r.w * .32, .18, r.z + r.d * .28, .7, .28, .45, 0, .5, 0, false);
				this.put(cyl, this.kit.mats.iron, r.x + r.w * .3, 1.4, r.z - r.d * .2, .55, .9, .55);
				this.put(box, this.kit.mats.wall, r.x + r.w * .18, .55, r.z + r.d * .22, 1.4, 1.1, .45, 0, .3, 0);
				this.put(box, this.kit.mats.wall, r.x - r.w * .22, .35, r.z - r.d * .18, .9, .7, .7, 0, -.4, 0);
			}
			if (hell) {
				const lava = new MeshStandardMaterial({
					color: 12855312,
					emissive: 16724753,
					emissiveIntensity: .7,
					roughness: .55
				});
				this.put(cyl, lava, r.x + 1.6, .03, r.z - 1.1, 1.5, .05, 1, 0, .4, 0, false);
				this.put(cyl, lava, r.x - 2.1, .025, r.z + 1.4, 1, .04, 1.6, 0, -.5, 0, false);
			}
			const scorch = new MeshBasicMaterial({
				color: hell ? 4859928 : 4864040,
				transparent: true,
				opacity: .16,
				depthWrite: false
			});
			this.put(plane, scorch, r.x, .025, r.z, 4.2, 3.4, 1, -Math.PI / 2, .3, 0, false);
		}
		for (const c of level.corridors ?? []) this.put(box, this.kit.mats.iron, c.x, 2.85, c.z, Math.min(c.w, 1.2), .18, Math.min(c.d, 1.2), 0, 0, 0, false);
	}
	makeChest(x, z) {
		const g = new Group();
		const wood = this.kit.mats.wood;
		const iron = this.kit.mats.iron;
		const gold = this.kit.mats.gold;
		const body = new Mesh(box, wood);
		body.position.y = .28;
		body.scale.set(.9, .52, .58);
		body.castShadow = true;
		g.add(body);
		const lid = new Mesh(box, wood);
		lid.position.set(0, .58, 0);
		lid.scale.set(.94, .16, .62);
		g.add(lid);
		const band = new Mesh(box, iron);
		band.position.set(0, .32, .3);
		band.scale.set(.96, .12, .06);
		g.add(band);
		const lock = new Mesh(box, gold);
		lock.position.set(0, .42, .32);
		lock.scale.set(.14, .16, .08);
		g.add(lock);
		g.position.set(x, 0, z);
		return g;
	}
	makeShrine(x, z) {
		const g = new Group();
		const base = new Mesh(cyl, this.kit.mats.iron);
		base.position.y = .2;
		base.scale.set(.85, .4, .85);
		g.add(base);
		const crystal = new Mesh(octa, this.kit.mats.crystal);
		crystal.position.y = .9;
		g.add(crystal);
		const ring = new Mesh(tor, this.kit.mats.gold);
		ring.position.y = .7;
		ring.rotation.x = Math.PI / 2;
		ring.scale.set(1.1, 1.1, .7);
		g.add(ring);
		g.position.set(x, 0, z);
		return g;
	}
	makePortal(x, z, color) {
		const g = new Group();
		const iron = this.kit.mats.iron;
		const arch = new Mesh(new TorusGeometry(1.1, .13, 8, 20, Math.PI), iron);
		arch.position.y = 1.2;
		arch.rotation.y = Math.PI / 4;
		g.add(arch);
		const colL = new Mesh(cyl, iron);
		colL.position.set(-.72, .7, .72);
		colL.scale.set(.22, 1.4, .22);
		g.add(colL);
		const colR = colL.clone();
		colR.position.set(.72, .7, -.72);
		g.add(colR);
		const mat = new MeshStandardMaterial({
			color,
			emissive: color,
			emissiveIntensity: 1.5,
			transparent: true,
			opacity: .52,
			side: 2
		});
		const veil = new Mesh(new CircleGeometry(1, 20), mat);
		veil.position.y = 1.2;
		veil.rotation.y = Math.PI / 4;
		g.add(veil);
		const l = new PointLight(color, 12, 12, 1.5);
		l.position.set(0, 1.45, 0);
		g.add(l);
		g.position.set(x, 0, z);
		return g;
	}
	makeRiftstone(x, z) {
		const g = new Group();
		const base = new Mesh(cyl, this.kit.mats.iron);
		base.position.y = .16;
		base.scale.set(1.2, .32, 1.2);
		g.add(base);
		const crystal = new Mesh(octa, this.kit.mats.crystal);
		crystal.position.y = 1.2;
		crystal.scale.set(1.05, 1.75, 1.05);
		g.add(crystal);
		const ring = new Mesh(new TorusGeometry(.9, .06, 8, 22), this.kit.mats.gold);
		ring.position.y = 1.1;
		ring.rotation.x = Math.PI / 2;
		g.add(ring);
		const l = new PointLight(16733474, 16, 13, 1.5);
		l.position.set(0, 1.65, 0);
		g.add(l);
		g.position.set(x, 0, z);
		return g;
	}
	makeBarrel(x, z) {
		const g = new Group();
		const body = new Mesh(cyl, this.kit.mats.wood);
		body.scale.set(.64, .72, .64);
		body.castShadow = true;
		g.add(body);
		const ring = new Mesh(new TorusGeometry(.34, .04, 6, 12), this.kit.mats.iron);
		ring.rotation.x = Math.PI / 2;
		ring.position.y = .14;
		g.add(ring);
		const ring2 = ring.clone();
		ring2.position.y = -.14;
		g.add(ring2);
		g.position.set(x, .36, z);
		return g;
	}
	backdropBuildings(level, hell, ice) {
		const mat = hell ? this.kit.mats.hell : ice ? this.kit.mats.iron : this.kit.mats.wall;
		const roof = this.kit.mats.roof;
		const b = level.bounds;
		const spots = [
			[
				b.x - b.w * .92,
				b.z - b.d * 1.22,
				8,
				13
			],
			[
				b.x + b.w * .95,
				b.z - b.d * 1.28,
				7,
				11
			],
			[
				b.x,
				b.z - b.d * 1.45,
				12,
				16
			],
			[
				b.x - b.w * 1.22,
				b.z + b.d * .1,
				7,
				10
			],
			[
				b.x + b.w * 1.25,
				b.z + b.d * .08,
				8,
				12
			],
			[
				b.x - b.w * .55,
				b.z - b.d * 1.55,
				5,
				9
			],
			[
				b.x + b.w * .5,
				b.z - b.d * 1.5,
				6,
				14
			]
		];
		for (const [x, z, w, h] of spots) {
			const m = new Mesh(box, mat);
			m.position.set(x, h / 2, z);
			m.scale.set(w, h, w * .65);
			this.backdrop.add(m);
			const r = new Mesh(roofGeo, roof);
			r.position.set(x, h, z);
			r.scale.set(w * 1.15, 3.4, w * .8);
			this.backdrop.add(r);
			if (h > 12) {
				const spire = new Mesh(cone, roof);
				spire.position.set(x, h + 3.6, z);
				spire.scale.set(w * .35, 5.5, w * .35);
				this.backdrop.add(spire);
			}
		}
	}
};
/** Small studio WebGL view of the hero for the inventory paperdoll. */
var PaperdollView = class {
	renderer;
	scene = new Scene();
	camera;
	factory;
	figure = null;
	yaw = .22;
	ro = null;
	constructor(canvas, kit, quality) {
		this.factory = new FigureFactory(kit, quality);
		const rect = canvas.getBoundingClientRect();
		const w = Math.max(64, Math.floor(rect.width) || canvas.clientWidth || 280);
		const h = Math.max(64, Math.floor(rect.height) || canvas.clientHeight || 420);
		const aspect = w / h;
		const f = 1.72;
		this.camera = new OrthographicCamera(-1.72 * aspect, f * aspect, f, -1.72, .1, 40);
		this.camera.position.set(2.8, 3.1, 2.8);
		this.camera.lookAt(0, .95, 0);
		this.renderer = new WebGLRenderer({
			canvas,
			antialias: false,
			alpha: false,
			powerPreference: "low-power"
		});
		this.renderer.setPixelRatio(1);
		this.renderer.setSize(w, h, false);
		this.renderer.toneMapping = 4;
		this.renderer.toneMappingExposure = 1.45;
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.setClearColor(1840914, 1);
		this.scene.background = new Color(1840914);
		try {
			this.scene.environment = kit.env(this.renderer);
			this.scene.environmentIntensity = .7;
		} catch {}
		this.scene.add(new AmbientLight(16771280, 1.05));
		const key = new DirectionalLight(16769732, 2.1);
		key.position.set(2.2, 4.4, 1.8);
		this.scene.add(key);
		const rim = new DirectionalLight(11060479, 1.1);
		rim.position.set(-2.4, 2.2, -2.2);
		this.scene.add(rim);
		const fill = new PointLight(16760976, 18, 10, 1.4);
		fill.position.set(.2, 1.8, 2.2);
		this.scene.add(fill);
		const floor = new Mesh(new CircleGeometry(1.15, 28), new MeshBasicMaterial({ color: 2761756 }));
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = .01;
		this.scene.add(floor);
		this.figure = this.factory.create("barbarian", 1, false, false);
		this.figure.root.position.set(0, 0, 0);
		this.scene.add(this.figure.root);
		this.ro = new ResizeObserver(() => this.fit(canvas));
		this.ro.observe(canvas);
		this.fit(canvas);
	}
	fit(canvas) {
		const rect = canvas.getBoundingClientRect();
		const w = Math.max(64, Math.floor(rect.width));
		const h = Math.max(64, Math.floor(rect.height));
		const aspect = w / Math.max(1, h);
		const f = 1.72;
		this.camera.left = -1.72 * aspect;
		this.camera.right = f * aspect;
		this.camera.top = f;
		this.camera.bottom = -1.72;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(w, h, false);
	}
	setGear(equipped) {
		this.figure?.applyGear(equipped);
	}
	addYaw(d) {
		this.yaw = MathUtils.clamp(this.yaw + d, -.4, .4);
	}
	tick(dt) {
		if (!this.figure) return;
		this.figure.update({
			moving: false,
			speed: 0,
			attacking: false,
			whirlwind: false,
			dead: false,
			freeze: false,
			facing: this.yaw,
			dt,
			time: performance.now() / 1e3
		});
		this.renderer.render(this.scene, this.camera);
	}
	dispose() {
		this.ro?.disconnect();
		this.ro = null;
		this.renderer.dispose();
		this.figure = null;
	}
};
var KEY = "veilbreak-save-v1";
var SAVE_VERSION = 2;
function emptyHero(classId, name) {
	const c = CLASSES[classId];
	const ranks = {};
	const runes = {};
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
		paragonSpent: {
			core: 0,
			offense: 0,
			defense: 0,
			utility: 0
		},
		gold: 40,
		materials: {
			scrap: 0,
			dust: 0,
			crystal: 0
		},
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
		quests: [{
			id: "a1q1",
			step: 0,
			progress: 0,
			done: false
		}],
		flags: {},
		act: 1,
		pity: 0,
		stats: {
			kills: 0,
			elites: 0,
			legendaries: 0,
			deaths: 0
		}
	};
}
function defaultSave() {
	return {
		version: SAVE_VERSION,
		characters: [],
		active: 0,
		settings: {
			shake: .7,
			numbers: true,
			autoPickup: 2.4,
			music: .35,
			sfx: .8,
			autoLoot: "yellow"
		},
		season: {
			id: 1,
			name: SEASON_NAME,
			challenges: {}
		},
		riftBest: {},
		weekly: {
			id: weekId(),
			bounties: makeBounties(),
			cacheClaimed: false
		}
	};
}
function weekId() {
	const d = /* @__PURE__ */ new Date();
	const onejan = new Date(d.getFullYear(), 0, 1);
	const week = Math.ceil(((+d - +onejan) / 864e5 + onejan.getDay() + 1) / 7);
	return `${d.getFullYear()}-w${week}`;
}
function makeBounties() {
	return [
		{
			id: "b1",
			text: "Slay 80 Choir spawn",
			kind: "kill",
			count: 80,
			progress: 0,
			gold: 400,
			done: false
		},
		{
			id: "b2",
			text: "Hunt 8 elites",
			kind: "elite",
			count: 8,
			progress: 0,
			gold: 500,
			done: false
		},
		{
			id: "b3",
			text: "Open 6 chests",
			kind: "chest",
			count: 6,
			progress: 0,
			gold: 300,
			done: false
		},
		{
			id: "b4",
			text: "Close 2 Challenge Rifts",
			kind: "rift",
			count: 2,
			progress: 0,
			gold: 700,
			done: false
		}
	];
}
function loadSave() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return defaultSave();
		const parsed = JSON.parse(raw);
		const base = defaultSave();
		const s = {
			...base,
			...parsed,
			settings: {
				...base.settings,
				...parsed.settings
			}
		};
		if (s.weekly.id !== weekId()) s.weekly = {
			id: weekId(),
			bounties: makeBounties(),
			cacheClaimed: false
		};
		s.version = SAVE_VERSION;
		s.settings.autoLoot = s.settings.autoLoot ?? "yellow";
		for (const h of s.characters) {
			const c = CLASSES[h.classId];
			for (const sk of c.skills) if (h.skillRanks[sk.id] == null) h.skillRanks[sk.id] = sk.unlock <= Math.max(1, h.level) ? 1 : 0;
			if (!h.primaryId || !c.skills.some((sk) => sk.id === h.primaryId)) h.primaryId = defaultPrimary(h.classId);
			if (!h.loadout || h.loadout.length < 4 || h.loadout.some((id) => !c.skills.some((sk) => sk.id === id))) h.loadout = defaultLoadout(h.classId);
			if (h.potionCount == null) h.potionCount = 3;
		}
		return s;
	} catch {
		return defaultSave();
	}
}
function persistSave(data) {
	try {
		const backup = localStorage.getItem(KEY);
		if (backup) localStorage.setItem(KEY + ":prev", backup);
		localStorage.setItem(KEY, JSON.stringify(data));
	} catch {}
}
function createHero(save, classId, name) {
	const h = emptyHero(classId, name || CLASSES[classId].name);
	save.characters.push(h);
	save.active = save.characters.length - 1;
	persistSave(save);
	return h;
}
function addXp(hero, amount) {
	hero.xp += amount;
	let leveled = false;
	let paragon = false;
	if (hero.level < 60) {
		const need = (l) => Math.floor(80 * Math.pow(1.14, l - 1) + 40);
		while (hero.level < 60 && hero.xp >= need(hero.level)) {
			hero.xp -= need(hero.level);
			hero.level += 1;
			leveled = true;
			const c = CLASSES[hero.classId];
			for (const s of c.skills) if (s.unlock <= hero.level && (hero.skillRanks[s.id] ?? 0) < 1) hero.skillRanks[s.id] = 1;
		}
	}
	if (hero.level >= 60) {
		const pNeed = 1200 + hero.paragon * 80;
		while (hero.xp >= pNeed) {
			hero.xp -= pNeed;
			hero.paragon += 1;
			paragon = true;
		}
	}
	return {
		leveled,
		paragon
	};
}
function expLerp(cur, target, k, dt) {
	return cur + (target - cur) * (1 - Math.exp(-k * dt));
}
var nid = 1;
var nextId = () => ++nid;
var Veilbreak = class {
	renderer;
	scene = new Scene();
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
	wallsGroup = new Group();
	decorGroup = new Group();
	ground = null;
	clock = new Clock();
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
	aim = new Vector3();
	tmp = new Vector3();
	ray = new Raycaster();
	plane = new Plane(new Vector3(0, 1, 0), 0);
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
	loading = true;
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
	skillHoldT = [
		0,
		0,
		0,
		0
	];
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
		y: 0
	};
	viewSize = 5.5;
	baseViewSize = 5.5;
	gemGeo = new OctahedronGeometry(.22, 0);
	goldPileGeo = new CylinderGeometry(.22, .28, .16, 8);
	camFwd = new Vector3(-1, 0, -1).normalize();
	camRight = new Vector3();
	camOff = {
		x: 13.5,
		y: 15.5,
		z: 13.5
	};
	camLagT = 0;
	aimingSlot = -1;
	aimHoldT = 0;
	camLookX = 0;
	camLookZ = 0;
	paperdoll = null;
	quality = detectQuality();
	texKit = new TextureKit(detectQuality());
	post = null;
	figures = null;
	vfx = null;
	world = null;
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
		this.camera = new OrthographicCamera(-f * aspect, f * aspect, f, -f, .1, 220);
		this.camera.position.set(this.camOff.x, this.camOff.y, this.camOff.z);
		this.camera.lookAt(0, 0, 0);
		this.renderer = new WebGLRenderer({
			canvas,
			antialias: !this.quality.low,
			alpha: false,
			powerPreference: "high-performance"
		});
		this.renderer.setPixelRatio(this.quality.dpr);
		this.renderer.setSize(window.innerWidth, window.innerHeight, false);
		this.renderer.shadowMap.enabled = this.quality.shadows;
		this.renderer.shadowMap.type = 1;
		this.renderer.toneMapping = 4;
		this.renderer.toneMappingExposure = 1.38;
		this.renderer.outputColorSpace = SRGBColorSpace;
		this.renderer.setClearColor(1841172, 1);
		this.scene.fog = new FogExp2(1841172, .01);
		this.scene.add(this.wallsGroup);
		this.scene.add(this.decorGroup);
		this.post = new PostPipeline(this.renderer, this.scene, this.camera, this.quality);
		this.reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
		window.addEventListener("resize", this.onResize);
		document.addEventListener("visibilitychange", this.onVis);
		this.wireControlsTest();
	}
	async start() {
		await this.preload();
		this.loading = false;
		this.running = true;
		this.clock.start();
		this.loop();
		this.emit();
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
		this.panel = this.panel === p ? "none" : p;
		if (p !== "dialogue") this.dialogue = null;
		this.emit(true);
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
			const rings = Array.isArray(h.equipped.ring) ? [...h.equipped.ring] : h.equipped.ring ? [h.equipped.ring] : [];
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
			rarity: it.rarity
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
			uid: it.uid + "x"
		};
		this.toast("Power extracted into the cube.", it);
		this.persist();
		this.emit(true);
	}
	socketGem(itemUid, gemId, slot = 0) {
		const h = this.hero;
		if (!h) return;
		const it = [...h.inventory, ...Object.values(h.equipped).flatMap((x) => Array.isArray(x) ? x : x ? [x] : [])].find((x) => x.uid === itemUid);
		if (!it || slot >= it.sockets) return;
		if (!h.gems.find((x) => x.id === gemId)) return;
		it.gems[slot] = gemId;
		this.persist();
		this.emit(true);
	}
	spendParagon(tree) {
		const h = this.hero;
		if (!h) return;
		if (h.paragonSpent.core + h.paragonSpent.offense + h.paragonSpent.defense + h.paragonSpent.utility >= h.paragon) return;
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
		if (kind === "rift") {
			const lv = generateDungeon({
				seed: (Date.now() ^ h.level) >>> 0,
				biome: "rift",
				name: `First Tear T${riftTier}`,
				level: h.level,
				act: h.act,
				isRift: true,
				riftTier,
				wantBoss: true
			});
			this.rift = {
				active: true,
				tier: riftTier,
				time: 180,
				progress: 0,
				goal: 36 + riftTier * 8
			};
			this.loadArea(lv);
			this.audio.rift();
			this.audio.startDrone(true);
			this.quest("enter", "rift");
			return;
		}
		const isRaid = kind === "raid";
		const isWorld = kind === "world";
		const biome = kind === "cathedral" ? "cathedral" : kind === "ice" ? "ice" : isWorld ? "wilds" : "hell";
		const names = {
			cathedral: "Cathedral of Saint Elara",
			ice: "Frosthold Caverns",
			hell: isRaid ? "Choir Vault" : "The Burning Quarter",
			world: "The Marches",
			raid: "Choir Vault"
		};
		const lv = generateDungeon({
			seed: (Date.now() ^ h.level * 17) >>> 0,
			biome,
			name: names[kind] ?? "The Tear",
			level: h.level,
			act: kind === "ice" ? 2 : isRaid ? 4 : kind === "hell" ? 3 : 1,
			wantBoss: true
		});
		if (isWorld) lv.spawns.push({
			x: 4,
			z: 4,
			monster: "worldboss",
			boss: true,
			elite: true
		});
		if (isRaid) {
			lv.spawns = lv.spawns.filter((s) => !s.boss);
			lv.spawns.push({
				x: lv.rooms[lv.rooms.length - 1].x,
				z: lv.rooms[lv.rooms.length - 1].z,
				monster: "raid",
				boss: true,
				elite: true
			});
		}
		this.rift = null;
		this.loadArea(lv);
		this.audio.startDrone(biome === "hell");
		this.quest("enter", biome);
	}
	talkChoice(id) {
		this.dialogue = null;
		if (id === "x") this.panel = "none";
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
		const e = this.ents.find((x) => x.uid === uid || x.item && x.item.uid === uid);
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
		const next = [...h.loadout ?? defaultLoadout(h.classId)];
		const swap = next.indexOf(id);
		if (swap >= 0) next[swap] = next[slot];
		next[slot] = id;
		h.loadout = next.slice(0, 4);
		this.initCharges();
		this.persist();
		this.emit(true);
	}
	respawn() {
		if (!this.hero || !this.player) return;
		this.hero.stats.deaths += 1;
		this.hp = this.maxHp;
		this.resource = this.maxResource * .4;
		this.player.dead = false;
		this.player.hp = this.hp;
		this.screen = "playing";
		this.loadArea(generateTown());
		this.persist();
		this.emit(true);
	}
	onResize = () => {
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
		this.loadPct = .6;
		this.emit();
		if (this.quality.env) {
			this.scene.environment = this.texKit.env(this.renderer);
			this.scene.environmentIntensity = .55;
		}
		this.figures = new FigureFactory(this.texKit, this.quality);
		this.vfx = new VfxWorld(this.scene, this.texKit, this.quality);
		this.world = new WorldKit(this.scene, this.wallsGroup, this.decorGroup, this.texKit, this.quality);
		this.loadPct = 1;
		this.onResize();
	}
	loadArea(level) {
		this.clearLevel();
		this.level = level;
		this.dest = null;
		this.channel = null;
		this.vfx?.clear();
		this.world.dress(level, this.vfx);
		this.ground = this.world.ground;
		this.hemi = this.world.hemi;
		this.dir = this.world.dir;
		this.lights = this.world.lights;
		for (const s of level.spawns) this.spawnMonster(s.x, s.z, s.monster, s.elite, s.boss, s.champion);
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
		const e = this.makeSprite("player", x, z, [], .01, 16777215);
		if (e.sprite) e.sprite.visible = false;
		if (e.shadow) e.shadow.visible = false;
		this.attachFigure(e, figureKindFor(cls.id), 1.05, false, false);
		e.team = 1;
		e.speed = cls.base.speed;
		e.r = .45;
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
		const scale = 1 + (h.level - 1) * .16;
		const e = this.makeSprite("monster", x, z, [], .01, 16777215);
		if (e.sprite) e.sprite.visible = false;
		if (e.shadow) e.shadow.visible = false;
		this.attachFigure(e, figureKindFor(id), Math.max(.72, def.scale * .42), !!elite || def.elite, !!boss || !!def.boss);
		e.monsterId = id;
		e.name = def.name;
		e.elite = !!elite || def.elite;
		e.boss = !!boss || !!def.boss;
		e.champion = champ;
		e.team = 2;
		e.r = def.radius;
		e.speed = def.speed * (champ?.includes("fast") ? 1.55 : e.boss ? 1 : 1.22);
		e.maxHp = def.hp * scale * diff.hp * 4.2 * (e.elite ? 3.2 : 1) * (e.boss ? 2.4 : 1) * (champ?.includes("extraLife") ? 1.8 : 1);
		e.hp = e.maxHp;
		e.dmg = def.dmg * scale * diff.dmg * 4.6 * (e.elite ? 1.85 : 1) * (champ ? 2.15 : 1) * (e.boss ? 2.4 : 1);
		e.scale = def.scale;
		e.spawnX = x;
		e.spawnZ = z;
		e.knockLock = 0;
		e.windup = 0;
		e.windupKind = "";
		e.ranged = id === "cultist";
		if (e.boss) e.phase = 1;
		this.ents.push(e);
	}
	spawnProp(p) {
		const npcId = p.npcId ?? {
			blacksmith: "kael",
			mystic: "maera",
			vendor: "vesh",
			stash: "brann",
			bounty: "ryn"
		}[p.kind];
		if ([
			"blacksmith",
			"mystic",
			"vendor",
			"stash",
			"bounty"
		].includes(p.kind)) {
			if (p.kind === "blacksmith") this.world.anvil(p.x, p.z);
			else if (p.kind === "mystic") this.world.mysticTable(p.x, p.z);
			else if (p.kind === "vendor") this.world.stall(p.x, p.z, 0);
			else if (p.kind === "stash") this.decorGroup.add(this.world.makeChest(p.x, p.z));
			else {
				const board = new Mesh(new BoxGeometry(1.15, 1.65, .12), this.texKit.mats.wood);
				board.position.set(p.x, .92, p.z);
				board.castShadow = true;
				this.decorGroup.add(board);
			}
			return;
		}
		if (p.kind === "npc" && npcId) {
			const e = this.makeSprite("npc", p.x, p.z, [], .01, 16777215);
			if (e.sprite) e.sprite.visible = false;
			if (e.shadow) e.shadow.visible = false;
			this.attachFigure(e, figureKindFor(npcId, true), .95, false, false);
			e.kind = "npc";
			e.npcId = npcId;
			e.name = NPCS.find((n) => n.id === npcId)?.name ?? "Wanderer";
			e.r = .55;
			e.team = 0;
			this.ents.push(e);
			return;
		}
		const e = this.makeSprite("prop", p.x, p.z, [], .01, 16777215);
		if (e.sprite) e.sprite.visible = false;
		if (e.shadow) e.shadow.visible = false;
		e.kind = p.kind === "chest" ? "chest" : p.kind === "shrine" ? "shrine" : p.kind === "portal" || p.kind === "exit" || p.kind === "riftstone" ? "portal" : "prop";
		e.shrine = p.shrine;
		e.name = p.kind;
		e.r = .7;
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
		const mat = new SpriteMaterial({
			map: frames[0] ?? null,
			color,
			transparent: true,
			depthWrite: solid,
			alphaTest: .12
		});
		mat.onBeforeCompile = (shader) => {
			shader.fragmentShader = shader.fragmentShader.replace("#include <alphatest_fragment>", `if (diffuseColor.r > 0.52 && diffuseColor.b > 0.52 && diffuseColor.g < 0.42) discard;
         #include <alphatest_fragment>`);
		};
		const spr = new Sprite(mat);
		spr.center.set(.5, 0);
		spr.position.set(x, .02, z);
		spr.scale.set(scale * .72, scale, 1);
		this.scene.add(spr);
		const shMat = new MeshBasicMaterial({
			color: 0,
			transparent: true,
			opacity: .32,
			depthWrite: false
		});
		const sh = new Mesh(new CircleGeometry(scale * .22, 10), shMat);
		sh.rotation.x = -Math.PI / 2;
		sh.position.set(x, .05, z);
		this.scene.add(sh);
		return {
			id: nextId(),
			kind,
			x,
			y: 0,
			z,
			vx: 0,
			vz: 0,
			r: .5,
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
			cc: {
				type: "",
				t: 0
			},
			ccDR: {},
			atkCd: 0,
			iFrames: 0,
			invuln: 0,
			corpse: false,
			scale
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
		for (const r of level.rooms) if (r.kind === "combat" || r.kind === "elite" || r.kind === "start") {
			const n = r.kind === "start" ? 2 : 3;
			for (let i = 0; i < n; i++) {
				const a = i / n * Math.PI * 2 + .4;
				this.spawnBarrel(r.x + Math.cos(a) * (Math.min(r.w, r.d) * .32), r.z + Math.sin(a) * (Math.min(r.w, r.d) * .32));
			}
		}
	}
	loop = () => {
		if (!this.running) return;
		this.raf = requestAnimationFrame(this.loop);
		let dt = this.clock.getDelta();
		if (dt > .1) dt = .1;
		this.acc += dt;
		const step = 1 / 60;
		let n = 0;
		while (this.acc >= step && n < 5) {
			if (this.hitstop > 0) this.hitstop -= step;
			else this.sim(step);
			this.acc -= step;
			n++;
		}
		this.draw(dt);
		this.uiAcc += dt;
		if (this.uiAcc > .09) {
			this.uiAcc = 0;
			this.emit();
		}
	};
	sim(dt) {
		if (this.screen !== "playing" || this.panel === "pause") {
			this.input.poll();
			if (this.input.actions.pauseJust && this.screen === "playing") this.openPanel(this.panel === "pause" ? "none" : "pause");
			return;
		}
		const a = this.input.poll();
		if (a.pauseJust) {
			this.openPanel("pause");
			return;
		}
		if (a.invJust) this.openPanel(this.panel === "inventory" ? "none" : "inventory");
		if (this.panel !== "none" && this.panel !== "dialogue") return;
		const p = this.player;
		const lv = this.level;
		const h = this.hero;
		if (!p || !lv || !h || p.dead) return;
		this.potionCd = Math.max(0, this.potionCd - dt);
		if (this.potionHot > 0) {
			const tick = Math.min(dt, this.potionHot);
			this.hp = Math.min(this.maxHp, this.hp + this.potionHotLeft * (tick / this.potionHot));
			this.potionHotLeft = Math.max(0, this.potionHotLeft - this.potionHotLeft * (tick / this.potionHot));
			this.potionHot -= tick;
		}
		for (const k of Object.keys(this.skillCd)) this.skillCd[k] = Math.max(0, (this.skillCd[k] ?? 0) - dt);
		for (const k of Object.keys(this.skillChargeCd)) {
			const s = CLASSES[h.classId].skills.find((x) => x.id === k);
			if (!s?.charges) continue;
			if ((this.skillCharges[k] ?? 0) >= s.charges) {
				this.skillChargeCd[k] = 0;
				continue;
			}
			this.skillChargeCd[k] = (this.skillChargeCd[k] ?? 0) - dt;
			if ((this.skillChargeCd[k] ?? 0) <= 0) {
				this.skillCharges[k] = Math.min(s.charges, (this.skillCharges[k] ?? 0) + 1);
				this.skillChargeCd[k] = (this.skillCharges[k] ?? 0) < s.charges ? s.chargeCd ?? s.cooldown : 0;
			}
		}
		for (const b of this.buffs) b.t -= dt;
		this.buffs = this.buffs.filter((b) => b.t > 0);
		p.iFrames = Math.max(0, p.iFrames - dt);
		p.invuln = Math.max(0, p.invuln - dt);
		p.atkCd = Math.max(0, p.atkCd - dt);
		this.ultActive = Math.max(0, this.ultActive - dt);
		if (this.hp < this.hpChase) this.hpChase = Math.max(this.hp, this.hpChase - this.maxHp * dt * .55);
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
		this.worldBossIn = Math.max(0, this.worldBossIn - dt);
		const camFwd = this.camFwd.set(-1, 0, -1).normalize();
		const camRight = this.camRight.crossVectors(camFwd, new Vector3(0, 1, 0)).normalize();
		this.pickAim(a);
		let mx = 0, mz = 0;
		if (Math.hypot(a.moveX, a.moveY) > .12) {
			mx = camRight.x * a.moveX + camFwd.x * -a.moveY;
			mz = camRight.z * a.moveX + camFwd.z * -a.moveY;
			this.dest = null;
		} else if (a.rightDown || a.forceMove) this.dest = {
			x: this.aim.x,
			z: this.aim.z
		};
		else if (a.pointerDown && this.aimingSlot < 0) this.dest = {
			x: this.aim.x,
			z: this.aim.z
		};
		if (this.dest) {
			const dx = this.dest.x - p.x;
			const dz = this.dest.z - p.z;
			const m = Math.hypot(dx, dz);
			if (m < .35) this.dest = null;
			else {
				mx = dx / m;
				mz = dz / m;
			}
		}
		if (this.channel?.id === "whirlwind" || this.channel?.id === "bloodspin") {
			const fast = h.skillRunes.whirlwind || h.skillRunes.bloodspin;
			mx *= fast ? .85 : .55;
			mz *= fast ? .85 : .55;
		}
		const spMul = (this.hasBuff("speed") || this.hasBuff("sprint") ? 1.4 : 1) * (this.hasBuff("archon") || this.hasBuff("wrath") || this.ultActive > 0 ? 1.12 : 1);
		const spd = p.speed * spMul;
		if ((mx || mz) && !a.forceMove) {
			const m = Math.hypot(mx, mz) || 1;
			p.vx = mx / m * spd;
			p.vz = mz / m * spd;
			if (this.aimingSlot < 0) {
				p.facing = Math.atan2(-p.vx, -p.vz);
				this.yaw = p.facing;
			}
		} else if (a.forceMove && (mx || mz)) {
			const m = Math.hypot(mx, mz) || 1;
			p.vx = mx / m * spd;
			p.vz = mz / m * spd;
			p.facing = Math.atan2(-p.vx, -p.vz);
			this.yaw = p.facing;
		} else {
			p.vx = 0;
			p.vz = 0;
		}
		this.speed = Math.hypot(p.vx, p.vz);
		this.moveEnt(p, dt);
		if (a.potionJust) this.drink();
		if (a.ultimateJust) this.fireUlt();
		const { primary, equipped } = this.kit();
		const locked = !!this.channel && (this.channel.id === "whirlwind" || this.channel.id === "bloodspin");
		for (let i = 0; i < 4; i++) {
			const sk = equipped[i];
			if (!sk) continue;
			if (sk.kind === "channel") {
				if (a.skills[i]) {
					if (!this.channel || this.channel.id !== sk.id) this.castSkill(sk, false, 1);
				} else if (this.channel?.id === sk.id) {
					this.channel = null;
					this.skillCd[sk.id] = sk.cooldown * (1 - Math.min(.5, this.stat("cdr") / 100));
				}
			} else {
				if (a.skillJust[i] && !locked) {
					this.aimingSlot = i;
					this.aimHoldT = 0;
				}
				if (this.aimingSlot === i && a.skills[i]) {
					this.aimHoldT += dt;
					const charged = this.aimHoldT >= .55;
					const { ux, uz } = this.aimDir(true);
					p.facing = Math.atan2(-ux, -uz);
					const shape = sk.kind === "dash" || sk.kind === "beam" ? "line" : sk.kind === "melee" ? "cone" : "circle";
					const hold = Math.min(1, this.aimHoldT / .7);
					const range = sk.range * (.72 + hold * .4);
					const rad = (sk.radius || 2) * (.8 + hold * .35);
					this.vfx?.setAim(shape, p.x, p.z, p.facing, range, rad, charged);
				}
				if (a.skillReleased[i] && this.aimingSlot === i) {
					const hold = Math.min(1, this.aimHoldT / .7);
					this.castSkill(sk, true, hold);
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
				const ch = CLASSES[h.classId].skills.find((s) => s.id === this.channel.id);
				if (ch) this.skillCd[ch.id] = ch.cooldown * (1 - Math.min(.5, this.stat("cdr") / 100));
				this.channel = null;
			} else if (this.channel.id === "whirlwind" || this.channel.id === "bloodspin") {
				const ch = CLASSES[h.classId].skills.find((s) => s.id === this.channel.id);
				if (ch) this.dealRadius(p.x, p.z, ch.radius * (this.ultActive > 0 ? 1.2 : 1), ch.damage * this.outDmg() * (dt / .16));
			}
		}
		const wantAtk = (a.primary || a.pointerDown && !a.forceMove && !a.rightDown) && !a.forceMove;
		if (p.atkCd <= 0 && wantAtk) {
			const t = this.nearestInCone(primary.range + 1.2, p.facing, Math.PI / 4) ?? this.nearestEnemy(primary.range + 1.2);
			if (t) this.autoAttack(t, primary);
		}
		if (this.potionHot > 0) p.figure?.glow(4521864, .12);
		const look = this.nearestEnemy(10);
		this.target = look && Math.hypot(look.x - p.x, look.z - p.z) < 9 ? look : this.target && !this.target.dead ? this.target : null;
		if (this.target?.dead) this.target = null;
		this.regen(dt);
		this.ai(dt);
		this.projectiles(dt);
		this.pickups(dt);
		this.bossLogic(dt);
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
		this.ray.setFromCamera(new Vector2(a.pointerNdcX, a.pointerNdcY), this.camera);
		const hit = new Vector3();
		this.ray.ray.intersectPlane(this.plane, hit);
		this.aim.copy(hit);
	}
	moveEnt(e, dt) {
		if (!this.level) return;
		if (e.cc.t > 0) {
			e.cc.t -= dt;
			if (e.cc.type === "stun" || e.cc.type === "freeze") {
				e.vx = 0;
				e.vz = 0;
			} else if (e.cc.type === "snare") {
				e.vx *= .35;
				e.vz *= .35;
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
		if (e.figure) e.figure.root.position.set(e.x, 0, e.z);
		else if (e.sprite) e.sprite.position.set(e.x, .02, e.z);
		if (e.shadow) e.shadow.position.set(e.x, .05, e.z);
		if (e.mesh && !e.figure) e.mesh.position.set(e.x, e.mesh.position.y, e.z);
		if (e.light && !e.figure) e.light.position.set(e.x, 2, e.z);
		e.anim += dt * (Math.hypot(e.vx, e.vz) > .2 ? 8 : 3);
		if (e.frames && e.frames.length && e.sprite && e.sprite.visible) {
			const i = Math.floor(e.anim) % e.frames.length;
			e.frame = i;
			const mat = e.sprite.material;
			mat.map = e.frames[i] ?? mat.map;
			const left = e.vx < -.05 || e.vx === 0 && Math.sin(e.facing) > .2;
			e.sprite.scale.set((left ? -1 : 1) * e.scale * .72, e.scale, 1);
		}
	}
	regen(dt) {
		const h = this.hero;
		const cls = CLASSES[h.classId];
		if (cls.resource === "Fury" || cls.resource === "Hatred") this.resource = Math.max(0, this.resource - dt * 8);
		else this.resource = Math.min(this.maxResource, this.resource + dt * 14);
		if (this.hasBuff("warcry") && cls.resource === "Fury") this.resource = Math.min(this.maxResource, this.resource + dt * 18);
	}
	drink() {
		const h = this.hero;
		if (this.potionCd > 0 || this.potionHot > 0) return;
		if ((h.potionCount ?? 0) <= 0) {
			this.toast("No potions");
			return;
		}
		h.potionCount -= 1;
		this.potionCd = 2.6;
		this.potionHot = 2.5;
		this.potionHotLeft = this.maxHp * .5;
		this.audio.potion();
		this.burst(this.player.x, 1, this.player.z, 16737860, 14);
		this.persist();
	}
	kit() {
		const h = this.hero;
		const cls = CLASSES[h.classId];
		return {
			cls,
			primary: cls.skills.find((s) => s.id === (h.primaryId || defaultPrimary(h.classId))) ?? cls.skills[0],
			equipped: (h.loadout?.length === 4 ? h.loadout : defaultLoadout(h.classId)).map((id) => cls.skills.find((s) => s.id === id)).filter((s) => !!s),
			ult: cls.skills.find((s) => s.id === defaultUlt(h.classId)) ?? cls.skills[cls.skills.length - 1]
		};
	}
	initCharges() {
		if (!this.hero) return;
		const { equipped } = this.kit();
		for (const s of equipped) if (s.charges) {
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
			mag: 1
		});
		const p = this.player;
		this.burst(p.x, 1.3, p.z, 16763989, 28);
		this.vfx?.burst(p.x, 1.3, p.z, 16763989, 22, "ember");
		this.vfx?.ring(p.x, p.z, 16764006, 7, .5);
		this.post?.punch(.0032, .18);
		this.trauma += .4;
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
			mag
		};
	}
	castSkill(skill, aimed, charge = 1) {
		const h = this.hero;
		const p = this.player;
		if ((h.skillRanks[skill.id] ?? 0) < 1) return;
		if (this.channel && skill.id !== this.channel.id && skill.kind !== "channel") return;
		if (skill.charges) {
			if ((this.skillCharges[skill.id] ?? 0) <= 0) return;
		} else if ((this.skillCd[skill.id] ?? 0) > 0 && skill.kind !== "channel") return;
		const rank = h.skillRanks[skill.id] ?? 1;
		const rune = !!h.skillRunes[skill.id];
		const dmgMul = (.9 + rank * .12) * this.outDmg() * (this.ultActive > 0 ? 1.45 : 1) * (.78 + .32 * charge);
		const cdr = this.stat("cdr") / 100;
		if (skill.charges) {
			this.skillCharges[skill.id] = (this.skillCharges[skill.id] ?? skill.charges) - 1;
			if (!this.skillChargeCd[skill.id]) this.skillChargeCd[skill.id] = skill.chargeCd ?? skill.cooldown;
		} else if (skill.kind !== "channel") this.skillCd[skill.id] = skill.cooldown * (1 - Math.min(.5, cdr));
		const { ux, uz, mag } = this.aimDir(aimed);
		p.facing = Math.atan2(-ux, -uz);
		if (skill.kind === "dash" || skill.id === "charge" || skill.id === "leap" || skill.id === "warleap") {
			const dist = skill.dash * (rune ? 1.12 : 1) * (this.hasPower("dashIframes") ? 1.1 : 1) * (.75 + .4 * charge);
			p.x += ux * dist;
			p.z += uz * dist;
			const r = resolveWalls(p.x, p.z, p.r, this.level.walls);
			p.x = r.x;
			p.z = r.z;
			p.iFrames = skill.id === "leap" || skill.id === "warleap" || skill.id === "charge" ? .32 * (this.hasPower("dashIframes") ? 1.4 : 1) : 0;
			this.camLagT = .16;
			this.dealRadius(p.x, p.z, skill.radius * (.85 + .3 * charge), skill.damage * dmgMul, { knock: skill.id === "charge" ? 5 : 3 });
			if (rune && (skill.id === "leap" || skill.id === "warleap")) this.dealRadius(p.x, p.z, skill.radius + .6, skill.damage * dmgMul * .5);
			this.trauma += skill.id === "leap" || skill.id === "hota" ? .45 : .28;
			if (skill.id === "leap" || skill.id === "hota") {
				this.hitstop = Math.max(this.hitstop, .032);
				this.post?.punch(.0024, .12);
			}
			this.vfx?.leap(p.x, p.z);
			p.figure?.playAttack();
			this.audio.swing();
			return;
		}
		if (skill.id === "sprint") {
			this.buffs.push({
				id: "sprint",
				name: skill.name,
				t: skill.duration,
				mag: 1
			});
			this.buffs.push({
				id: "speed",
				name: "Sprint",
				t: skill.duration,
				mag: 1
			});
			p.iFrames = 0;
			this.audio.swing();
			return;
		}
		if (skill.kind === "buff" || skill.id === "wrath" || skill.id === "ancestral") {
			this.buffs.push({
				id: skill.id,
				name: skill.name,
				t: skill.duration + (rune ? 2 : 0),
				mag: 1
			});
			if (skill.id === "wrath") this.buffs.push({
				id: "damage",
				name: skill.name,
				t: skill.duration,
				mag: 1
			});
			if (skill.id === "demoralize") this.applyCCRadius(p.x, p.z, skill.radius || 5.5, "snare", 2.4);
			this.burst(p.x, 1.2, p.z, 16768392, 18);
			this.audio.swing();
			return;
		}
		if (skill.kind === "channel") {
			if (this.channel?.id === skill.id) return;
			this.channel = {
				id: skill.id,
				t: skill.duration || 4,
				max: skill.duration || 4
			};
			this.dealRadius(p.x, p.z, skill.radius, skill.damage * dmgMul);
			if (this.hasPower("whirlwindTrail")) this.groundHazard(p.x, p.z, 1.4, 1.6, 10 * dmgMul);
			return;
		}
		if (skill.kind === "nova" || skill.id === "stomp") {
			this.dealRadius(p.x, p.z, skill.radius, skill.damage * dmgMul, {
				stun: skill.id === "stomp" ? 1.2 : 0,
				knock: 4
			});
			this.burst(p.x, 1, p.z, 16737826, 24);
			this.vfx?.shock(p.x, p.z, 16737826);
			this.trauma += .4;
			this.hitstop = .032;
			this.post?.punch(.002, .1);
			this.audio.hit(true);
			return;
		}
		if (skill.kind === "melee") {
			const hx = p.x + ux * 1.4;
			const hz = p.z + uz * 1.4;
			this.dealCone(p.x, p.z, p.facing, skill.range, Math.PI / 4, skill.damage * dmgMul, { knock: 2 });
			if (skill.id === "cleave" || skill.id === "rend") this.applyDoTRadius(hx, hz, skill.radius, .28 * dmgMul, rune ? 4.2 : 2.2);
			if (skill.id === "lacerate") {
				const heal = this.maxHp * (rune ? .06 : .03);
				this.hp = Math.min(this.maxHp, this.hp + heal);
				this.floatNum(p.x, 2.2, p.z, Math.round(heal), false, false, "heal");
			}
			this.fxSlash(hx, hz);
			p.attackT = .28;
			p.figure?.playAttack();
			this.audio.swing();
			return;
		}
		if (skill.kind === "aoe") {
			const tx = p.x + ux * Math.min(skill.range, mag);
			const tz = p.z + uz * Math.min(skill.range, mag);
			this.dealRadius(tx, tz, skill.radius, skill.damage * dmgMul, {
				knock: 3,
				stun: skill.id === "hota" || skill.id === "earthsplitter" ? .7 : 0
			});
			if (skill.id === "hota") {
				this.trauma += .55;
				this.hitstop = .032;
				this.vfx?.shock(tx, tz, 16755268);
				this.post?.punch(.0022, .1);
			}
			if (skill.id === "demoralize") this.applyCCRadius(tx, tz, skill.radius, "snare", 3);
			if (skill.id === "caltrops" || skill.id === "consecrate" || skill.id === "sanctuary" || skill.id === "decrepify") this.groundHazard(tx, tz, skill.radius, skill.duration, skill.damage * 8 * dmgMul, skill.id);
			this.burst(tx, .6, tz, 16755268, 18);
			this.audio.hit(false);
			return;
		}
		if (skill.kind === "projectile" || skill.kind === "beam") {
			const n = skill.id === "multishot" ? this.hasPower("multishotPlus") || rune ? 7 : 5 : skill.id === "shards" && rune ? 5 : 1;
			const spread = n > 1 ? .22 : 0;
			for (let i = 0; i < n; i++) {
				const ang = Math.atan2(uz, ux) + (i - (n - 1) / 2) * spread;
				this.fireProj(p, Math.cos(ang), Math.sin(ang), skill, dmgMul, rune);
			}
			if (skill.kind === "beam") this.dealBeam(p.x, p.z, ux, uz, skill.range, skill.radius, skill.damage * dmgMul);
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
		const e = this.makeSprite("projectile", owner.x + ux * .8, owner.z + uz * .8, frames, .9, 16777215);
		e.kind = "projectile";
		e.vx = ux * 16;
		e.vz = uz * 16;
		e.r = skill.radius || .4;
		e.ttl = skill.duration + .3;
		e.dmg = skill.damage * dmgMul;
		e.team = owner.team;
		e.owner = owner.id;
		e.skillId = skill.id;
		e.pierce = skill.id === "bonespear" || skill.id === "impale" ? 4 : 0;
		e.homing = skill.id === "spirit";
		if (rune && skill.id === "hungering") e.ttl += .5;
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
		const e = this.makeSprite("prop", x, z, this.frames.holy ?? [], r * 1.4, 16755302);
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
			const a = i / n * Math.PI * 2;
			this.spawnMonster(this.player.x + Math.cos(a) * 2, this.player.z + Math.sin(a) * 2, "skeleton");
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
		p.atkCd = (prim.cooldown || .42) * (1 - Math.min(.4, this.stat("cdr") / 200)) * (empowered ? .82 : 1);
		const dmg = this.outDmg() * prim.damage * (empowered ? 1.55 : 1);
		this.dealCone(p.x, p.z, p.facing, prim.range, Math.PI / 4, dmg, { knock: 1.4 });
		if (prim.id === "cleave") this.applyDoTRadius(p.x, p.z, prim.radius, dmg * .12, 2);
		if (prim.id === "lacerate") {
			const heal = this.maxHp * .03;
			this.hp = Math.min(this.maxHp, this.hp + heal);
			this.floatNum(p.x, 2.2, p.z, Math.round(heal), false, false, "heal");
		}
		this.fxSlash((p.x + t.x) / 2, (p.z + t.z) / 2);
		p.attackT = .28;
		p.figure?.playAttack();
		this.audio.swing();
		this.target = t;
		if (empowered) {
			this.burst((p.x + t.x) / 2, .9, (p.z + t.z) / 2, 16763989, 8);
			this.vfx?.burst((p.x + t.x) / 2, .9, (p.z + t.z) / 2, 16763989, 8, "ember");
		}
		this.ultCharge = Math.min(1, this.ultCharge + (empowered ? 0 : 1 / 14));
	}
	ai(dt) {
		const p = this.player;
		const mons = this.ents.filter((e) => e.kind === "monster" && !e.dead && e.team === 2);
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
			if (Math.hypot(e.x - (e.spawnX ?? e.x), e.z - (e.spawnZ ?? e.z)) > 25) {
				e.x = e.spawnX;
				e.z = e.spawnZ;
				e.hp = e.maxHp;
				e.vx = 0;
				e.vz = 0;
				this.moveEnt(e, 0);
				continue;
			}
			let dx = p.x - e.x;
			let dz = p.z - e.z;
			const dist = Math.hypot(dx, dz) || 1;
			if (e.champion?.includes("vortex") && dist < 8) {
				p.x += (e.x - p.x) * dt * .35;
				p.z += (e.z - p.z) * dt * .35;
			}
			if (e.champion?.includes("teleporter") && this.rng.chance(dt * .25)) {
				this.vfx?.warnCircle(p.x, p.z, 1.6, .45);
				e.x = p.x + (this.rng.next() - .5) * 6;
				e.z = p.z + (this.rng.next() - .5) * 6;
			}
			if (e.champion?.includes("jailer") && dist < 7 && e.atkCd <= 0) {
				this.vfx?.warnCircle(p.x, p.z, 1.4, .7);
				this.applyCC(p, "snare", 1.2);
				e.atkCd = 4;
			}
			if (e.champion?.includes("molten") && dist < 2.2) this.hurtPlayer(8 * dt);
			if (e.champion?.includes("electrified") && dist < 3) this.hurtPlayer(6 * dt);
			if (e.champion?.includes("molten") && e.atkCd <= 0 && dist < 7) {
				this.vfx?.warnCircle(e.x, e.z, 2.6, .85);
				e.atkCd = 5;
				e.windup = .85;
				e.windupKind = "nova";
			}
			if (e.windupKind === "nova" && e.windup <= 0) {
				this.dealRadius(e.x, e.z, 2.6, (e.dmg ?? 12) * .8);
				e.windupKind = "";
			}
			const ranged = e.ranged || e.monsterId === "cultist";
			const stopAt = ranged ? 8.5 : 1.4;
			if (e.windup > 0) {
				e.vx = 0;
				e.vz = 0;
				if (e.windup <= .02) {
					if (e.windupKind === "ranged") {
						const ux = dx / dist, uz = dz / dist;
						this.fireEnemyBolt(e, ux, uz);
					} else if (e.windupKind === "swing") {
						if (dist < 2.2 && p.iFrames <= 0 && p.invuln <= 0) {
							this.hurtPlayer(e.dmg ?? 8);
							if (e.champion?.includes("frozen")) this.applyCC(p, "freeze", .6);
						}
					}
					e.windupKind = "";
				}
			} else if (dist > stopAt) {
				let sx = 0, sz = 0;
				for (const o of mons) {
					if (o === e) continue;
					const ddx = e.x - o.x;
					const ddz = e.z - o.z;
					const dm = Math.hypot(ddx, ddz) || .01;
					if (dm < 1.6) {
						sx += ddx / dm;
						sz += ddz / dm;
					}
				}
				e.vx = dx / dist * e.speed + sx * 1.2;
				e.vz = dz / dist * e.speed + sz * 1.2;
				e.facing = Math.atan2(-e.vx, -e.vz);
			} else {
				e.vx = 0;
				e.vz = 0;
				e.facing = Math.atan2(-dx, -dz);
				if (e.atkCd <= 0 && p.iFrames <= 0 && p.invuln <= 0) {
					const wind = .7 + this.rng.next() * .4;
					e.windup = wind;
					e.atkCd = (e.boss ? 1.8 : ranged ? 2.2 : 1.15) + wind;
					e.windupKind = ranged ? "ranged" : "swing";
					if (ranged) this.vfx?.warnCircle(p.x, p.z, .9, wind);
					else this.vfx?.warnCircle(e.x + dx / dist * 1.1, e.z + dz / dist * 1.1, 1.15, wind);
				}
			}
			this.moveEnt(e, dt);
		}
		for (const e of this.ents) if (e.kind === "monster" && e.team === 1 && !e.dead) {
			const t = this.nearestEnemyFrom(e, 12);
			if (t) {
				const dx = t.x - e.x, dz = t.z - e.z, m = Math.hypot(dx, dz) || 1;
				e.vx = dx / m * 4;
				e.vz = dz / m * 4;
				if (m < 1.4 && e.atkCd <= 0) {
					e.atkCd = .8;
					this.hurt(t, 12 * this.outDmg() * .3, false);
				}
				e.atkCd = Math.max(0, e.atkCd - dt);
			}
			this.moveEnt(e, dt);
		}
	}
	fireEnemyBolt(owner, ux, uz) {
		const frames = this.frames.fire ?? this.frames.slash ?? [];
		const e = this.makeSprite("projectile", owner.x + ux * .8, owner.z + uz * .8, frames, .7, 16737826);
		e.kind = "projectile";
		e.vx = ux * 9;
		e.vz = uz * 9;
		e.r = .35;
		e.ttl = 1.6;
		e.dmg = (owner.dmg ?? 10) * .85;
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
					const dx = t.x - e.x, dz = t.z - e.z, m = Math.hypot(dx, dz) || 1;
					e.vx = expLerp(e.vx, dx / m * 14, 6, dt);
					e.vz = expLerp(e.vz, dz / m * 14, 6, dt);
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
			for (const m of this.ents) if (m.team === 2 && !m.dead && !m.corpse && Math.hypot(m.x - e.x, m.z - e.z) < m.r + e.r) {
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
		for (const e of this.ents) if (e.name?.startsWith("hazard:") && e.ttl != null) {
			e.ttl -= dt;
			if (e.ttl <= 0) {
				e.dead = true;
				if (e.sprite) this.scene.remove(e.sprite);
				if (e.shadow) this.scene.remove(e.shadow);
				continue;
			}
			this.dealRadius(e.x, e.z, e.r, (e.dmg ?? 8) * dt, e.name.includes("decrepify") ? { snare: .4 } : void 0);
		}
		this.ents = this.ents.filter((e) => !e.dead || e.corpse);
	}
	pickups(dt) {
		const p = this.player;
		const rad = this.save.settings.autoPickup + this.stat("pickup");
		const rank = {
			off: -1,
			white: 0,
			blue: 1,
			yellow: 2,
			all: 4
		}[this.save.settings.autoLoot ?? "yellow"] ?? 2;
		const rarityRank = (r) => r === "normal" ? 0 : r === "magic" ? 1 : r === "rare" ? 2 : 3;
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
			const autoOk = e.globe || e.gold || e.item && itemRank <= rank && (!legendary || rank >= 4);
			const magnet = autoOk && d < rad;
			const walk = d < 1.5 && autoOk;
			if (magnet) {
				e.x = expLerp(e.x, p.x, 8, dt);
				e.z = expLerp(e.z, p.z, 8, dt);
				this.moveEnt(e, 0);
			}
			if (walk || d < .7 && autoOk) this.collect(e);
		}
	}
	collect(e) {
		const h = this.hero;
		if (e.globe) {
			const heal = this.maxHp * .14;
			this.hp = Math.min(this.maxHp, this.hp + heal);
			this.floatNum(this.player.x, 2.2, this.player.z, Math.round(heal), false, false, "heal");
			this.audio.potion();
		}
		if (e.gold) {
			const g = Math.floor(e.gold * (1 + this.stat("goldFind") / 100) * DIFFICULTY[h.difficulty].gold);
			h.gold += g;
			this.toast("+" + g + " Gold");
			this.audio.pickup();
		}
		if (e.item) {
			if (h.inventory.length >= 60) {
				this.toast("Inventory full");
				return;
			}
			if (!e.item.identified && e.item.rarity !== "normal") {}
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
			const hpPct = e.hp / e.maxHp;
			if (hpPct < .3 && !e.enraged) {
				e.enraged = true;
				e.speed *= 1.25;
				e.dmg *= 1.2;
				this.toast(e.name + " enrages.");
				this.vfx?.warnCircle(e.x, e.z, 4.5, 1.1);
			}
			if (hpPct < .66 && (e.phase ?? 1) === 1) {
				e.phase = 2;
				this.toast(e.name + " enters a second hymn.");
				this.spawnMonster(e.x + 3, e.z, "imp", true);
				this.spawnMonster(e.x - 3, e.z, "imp", true);
			}
			if (hpPct < .33 && (e.phase ?? 1) < 3) {
				e.phase = 3;
				this.toast(e.name + " tears the floor.");
				this.vfx?.warnCircle(e.x, e.z, 6, .9);
				this.dealRadius(e.x, e.z, 6, 40, { knock: 6 });
			}
			if ((e.telegraph ?? 0) <= 0) {
				const pattern = (e.bossAtk ?? 0) % 3;
				e.bossAtk = (e.bossAtk ?? 0) + 1;
				e.telegraph = e.enraged ? 1.6 : e.phase === 3 ? 2.2 : 3;
				const tx = p.x;
				const tz = p.z;
				if (pattern === 0) {
					this.vfx?.warnCircle(tx, tz, 2.8, .9);
					window.setTimeout(() => {
						if (!e.dead) this.dealRadius(tx, tz, 2.8, (e.dmg ?? 20) * 1.8, { stun: .5 });
					}, 900);
				} else if (pattern === 1) {
					this.vfx?.warnCircle(e.x, e.z, 4.2, 1.05);
					window.setTimeout(() => {
						if (!e.dead) this.dealRadius(e.x, e.z, 4.2, (e.dmg ?? 20) * 1.4, { knock: 5 });
					}, 1050);
				} else {
					this.vfx?.warnCircle(tx, tz, 1.6, .75);
					window.setTimeout(() => {
						if (!e.dead) {
							const ux = p.x - e.x, uz = p.z - e.z, m = Math.hypot(ux, uz) || 1;
							this.fireEnemyBolt(e, ux / m, uz / m);
							this.dealRadius(tx, tz, 1.6, (e.dmg ?? 20) * 1.1);
						}
					}, 750);
				}
			}
		}
	}
	interactScan() {
		const p = this.player;
		this.interact = null;
		this.interactEnt = null;
		let best = 3.2;
		for (const e of this.ents) {
			if (e === p || e.dead) continue;
			if (![
				"npc",
				"chest",
				"shrine",
				"portal",
				"prop"
			].includes(e.kind)) continue;
			const d = Math.hypot(e.x - p.x, e.z - p.z);
			if (d < best) {
				best = d;
				this.interactEnt = e;
				const npc = NPCS.find((n) => n.id === e.npcId);
				this.interact = npc ? `Talk — ${npc.name}` : e.kind === "chest" ? "Open chest" : e.kind === "shrine" ? "Touch shrine" : e.name === "riftstone" ? "Enter the First Tear" : e.kind === "portal" ? this.level?.isTown ? "Enter the Cathedral" : "Return to Thornwatch" : "Use";
			}
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
			else if (this.level?.isTown) this.enterPortal("cathedral");
			else this.enterPortal("town");
			return;
		}
		const npc = e.npcId;
		if (!npc) return;
		this.quest("talk", npc);
		if (npc === "ryn") this.dialogue = {
			speaker: "Captain Ryn",
			text: this.hero.flags.maltheon ? "The nave is quiet. The tears are not. Io can ride them. When you are ready, we march north." : "The cathedral opened like a mouth. Close it. Bring me Maltheon's silence.",
			options: [
				{
					id: "enter:cathedral",
					label: "Enter the Cathedral"
				},
				{
					id: "enter:ice",
					label: "Frosthold (Act II)"
				},
				{
					id: "panel:quests",
					label: "Quest log"
				},
				{
					id: "x",
					label: "Leave"
				}
			]
		};
		else if (npc === "kael") this.dialogue = {
			speaker: "Forge-Father Kael",
			text: "Salvage the Choir. I will make the scraps remember they were weapons.",
			options: [
				{
					id: "panel:blacksmith",
					label: "Blacksmith"
				},
				{
					id: "enter:hell",
					label: "Burning Quarter (Act III)"
				},
				{
					id: "x",
					label: "Leave"
				}
			]
		};
		else if (npc === "maera") this.dialogue = {
			speaker: "Sister Maera",
			text: "I can move a power from one relic to another. The hymns called it heresy. I call it Tuesday.",
			options: [
				{
					id: "panel:mystic",
					label: "Mystic"
				},
				{
					id: "enter:hell",
					label: "Prime Rift (Act IV)"
				},
				{
					id: "x",
					label: "Leave"
				}
			]
		};
		else if (npc === "vesh") this.dialogue = {
			speaker: "Quartermaster Vesh",
			text: "Gold in. Steel out. Don't bleed on the counter.",
			options: [
				{
					id: "panel:vendor",
					label: "Vendor"
				},
				{
					id: "panel:bounties",
					label: "Bounties"
				},
				{
					id: "x",
					label: "Leave"
				}
			]
		};
		else if (npc === "io") this.dialogue = {
			speaker: "Warden Io",
			text: "Challenge Rifts keep time like a blade. Higher tiers. Better sins. Your best is remembered.",
			options: [
				{
					id: "panel:rifts",
					label: "Open a Rift"
				},
				{
					id: "enter:raid",
					label: "Choir Vault"
				},
				{
					id: "x",
					label: "Leave"
				}
			]
		};
		else if (npc === "brann") this.dialogue = {
			speaker: "Keeper Brann",
			text: "Leave what you cannot carry. The stash does not dream. Mostly.",
			options: [{
				id: "panel:stash",
				label: "Stash"
			}, {
				id: "x",
				label: "Leave"
			}]
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
				mag: 1
			});
			this.toast(s.name);
		}
		this.burst(e.x, 1, e.z, 16764006, 20);
	}
	dealRadius(x, z, r, dmg, extra) {
		for (const e of this.ents) {
			if (e.barrel && !e.dead && Math.hypot(e.x - x, e.z - z) <= r + e.r) this.smashBarrel(e);
			if (e.team !== 2 || e.dead || e.corpse) continue;
			if (Math.hypot(e.x - x, e.z - z) <= r + e.r) {
				this.hurt(e, dmg * (1 + this.stat("area") / 200), false);
				if (extra?.knock) {
					if (!(e.elite && (e.knockLock ?? 0) > 0)) {
						const dx = e.x - x, dz = e.z - z, m = Math.hypot(dx, dz) || 1;
						e.x += dx / m * extra.knock * .15;
						e.z += dz / m * extra.knock * .15;
						if (e.elite) e.knockLock = 3;
					}
				}
				if (extra?.stun) {
					if (!(e.elite && (e.knockLock ?? 0) > 0)) this.applyCC(e, "stun", extra.stun);
				}
				if (extra?.freeze) this.applyCC(e, "freeze", extra.freeze);
				if (extra?.snare) this.applyCC(e, "snare", extra.snare);
			}
		}
	}
	applyCCRadius(x, z, r, type, t) {
		for (const e of this.ents) if (e.team === 2 && !e.dead && Math.hypot(e.x - x, e.z - z) < r) this.applyCC(e, type, t);
	}
	applyDoTRadius(x, z, r, tick, dur) {
		for (const e of this.ents) if (e.team === 2 && !e.dead && Math.hypot(e.x - x, e.z - z) < r) {
			const n = Math.max(1, Math.floor(dur / .5));
			for (let i = 1; i <= n; i++) setTimeout(() => {
				if (!e.dead) this.hurt(e, tick, false);
			}, i * 500);
		}
	}
	applyCC(e, type, t) {
		const stacks = e.ccDR[type] ?? 0;
		const mul = stacks === 0 ? 1 : stacks === 1 ? .5 : stacks === 2 ? .25 : 0;
		if (mul <= 0) return;
		e.cc = {
			type,
			t: t * mul
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
		if (this.hasBuff("damage") || this.hasBuff("archon") || this.hasBuff("vengeance")) dmg *= 1.25;
		const critC = 5 + this.stat("crit") + (this.hasSet(6, "ashen") && !isDot ? 0 : 0);
		const crit = !isDot && this.rng.chance(Math.min(.75, critC / 100));
		if (crit) {
			dmg *= 1.5 + this.stat("critDmg") / 100;
			this.hitstop = Math.max(this.hitstop, .018);
			this.trauma += .12;
		}
		if (e.boss) this.trauma += .08;
		e.hp -= dmg;
		this.floatNum(e.x, (e.figure?.height ?? e.scale) + .4, e.z, Math.round(dmg), crit, isDot);
		this.burst(e.x, .8, e.z, 10031377, crit ? 10 : 5);
		this.vfx?.burst(e.x, .85, e.z, 10031377, crit ? 10 : 5, "blood");
		this.audio.hit(crit);
		if (this.stat("lifeOnHit") && !isDot) this.hp = Math.min(this.maxHp, this.hp + this.stat("lifeOnHit") * .02);
		if (this.hasPower("furyOnHit") && this.hero?.classId === "barbarian") this.resource = Math.min(this.maxResource, this.resource + 3);
		e.figure?.flash();
		if (this.hasPower("eliteExecute") && (e.elite || e.boss) && e.hp / e.maxHp < .15) {
			e.hp = 0;
			this.dealRadius(e.x, e.z, 3.5, dmg);
		}
		if (e.hp <= 0) this.kill(e);
	}
	hurtPlayer(raw) {
		const p = this.player;
		if (p.iFrames > 0 || p.invuln > 0) return;
		if (this.rng.chance(Math.min(.4, this.stat("dodge") / 100))) {
			this.floatNum(p.x, 2, p.z, 0, false, false, "dodge");
			return;
		}
		const armor = 40 + this.stat("armor") + (this.hasBuff("warcry") ? 80 : 0);
		const red = armor / (armor + 400);
		const res = this.stat("allRes") / (this.stat("allRes") + 220);
		const dmg = raw * (1 - red) * (1 - res * .5);
		this.hp -= dmg;
		this.floatNum(p.x, 2.1, p.z, Math.round(dmg), false, false, "you");
		this.trauma += .28;
		this.audio.hit(false);
		if (this.hp <= 0) {
			this.hp = 0;
			p.dead = true;
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
		const { leveled, paragon } = addXp(h, def.xp * (e.elite ? 3 : 1) * (e.boss ? 1 : 1));
		if (leveled) this.toast(`Level ${h.level}`);
		if (paragon) this.toast(`Paragon ${h.paragon}`);
		this.dropGold(e.x, e.z, 4 + h.level + (e.elite ? 20 : 0));
		if (this.rng.chance(def.loot * DIFFICULTY[h.difficulty].magic) || e.elite || e.boss) this.dropLoot(e.x, e.z, !!e.elite, !!e.boss);
		if (this.rng.chance(e.elite || e.boss ? .7 : .28)) this.dropGlobe(e.x, e.z);
		this.burst(e.x, 1, e.z, 7803153, e.elite || e.boss ? 36 : 22);
		this.vfx?.death(e.x, e.z, !!e.elite, !!e.boss);
		this.trauma += e.elite || e.boss ? .45 : .12;
		if (e.elite || e.boss) {
			this.post?.punch(.0026, .16);
			this.hitstop = Math.max(this.hitstop, .032);
		}
		const extra = e.boss ? 4 + this.rng.int(0, 2) : e.elite ? 2 + this.rng.int(0, 2) : this.rng.chance(.55) ? 1 : 0;
		for (let i = 0; i < extra; i++) this.dropLoot(e.x, e.z, !!e.elite, !!e.boss);
		if (e.boss && this.level?.isRift) {
			h.gems.push(randomGem(this.rng, Math.min(10, 1 + Math.floor((this.rift?.tier ?? 1) / 5))));
			this.toast("The Tear closes. Thornwatch waits.");
			const key = h.classId;
			const t = this.rift?.tier ?? 1;
			if (t > (this.save.riftBest[key] ?? 0)) this.save.riftBest[key] = t;
			this.bounty("rift");
			this.rift = this.rift ? {
				...this.rift,
				progress: this.rift.goal
			} : this.rift;
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
			m.opacity = .35;
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
		const ang = i / Math.max(1, n) * Math.PI * 2 + this.rng.next() * .4;
		const rad = .85 + this.rng.next() * .85;
		let nx = x + Math.cos(ang) * rad;
		let nz = z + Math.sin(ang) * rad;
		if (this.level) {
			const r = resolveWalls(nx, nz, .35, this.level.walls);
			nx = r.x;
			nz = r.z;
			if (!isWalkable(this.level, nx, nz)) {
				nx = x;
				nz = z;
			}
		}
		return {
			x: nx,
			z: nz
		};
	}
	dropLoot(x, z, elite, boss) {
		const h = this.hero;
		const magic = DIFFICULTY[h.difficulty].magic;
		let rarity = rarityFor(magic, elite, boss, h.pity, this.rng);
		if (elite && rarity === "normal") rarity = "magic";
		if (boss && (rarity === "normal" || rarity === "magic")) rarity = "rare";
		if (rarity === "legendary" || rarity === "set") h.pity = 0;
		else if (elite) h.pity += 1;
		const item = rollItem({
			rng: this.rng,
			level: h.level,
			classId: h.classId,
			rarity
		});
		const col = rarity === "legendary" ? 16733457 : rarity === "set" ? 3407718 : rarity === "rare" ? 16763955 : rarity === "magic" ? 6719743 : 14540253;
		const pos = this.scatterPos(x, z, this.rng.int(0, 7), 8);
		const e = this.makeSprite("pickup", pos.x, pos.z, [], .01, col);
		e.kind = "pickup";
		e.item = item;
		e.uid = item.uid;
		e.r = .4;
		e.ttl = 20;
		e.dropVx = (pos.x - x) * 3.2;
		e.dropVz = (pos.z - z) * 3.2;
		e.dropY = .9;
		if (e.sprite) e.sprite.visible = false;
		const stand = new Group();
		const peg = new Mesh(new CylinderGeometry(.06, .1, .28, 6), new MeshStandardMaterial({
			color: 3813928,
			roughness: .8
		}));
		peg.position.y = .14;
		stand.add(peg);
		const gem = new Mesh(item.slot === "main" ? new BoxGeometry(.18, .55, .08) : this.gemGeo, new MeshStandardMaterial({
			color: col,
			emissive: col,
			emissiveIntensity: rarity === "normal" ? .45 : 1.6,
			roughness: .25,
			metalness: .45
		}));
		gem.position.y = item.slot === "main" ? .55 : .5;
		stand.add(gem);
		stand.position.set(e.x, 0, e.z);
		this.scene.add(stand);
		e.mesh = stand;
		const beam = this.vfx?.lootShaft(e.x, e.z, col, rarity);
		if (beam) e.beam = beam.mesh;
		if (rarity === "legendary" || rarity === "set" || rarity === "rare") {
			const l = new PointLight(col, rarity === "legendary" ? 16 : 8, 8, 1.5);
			l.position.set(e.x, 1.4, e.z);
			this.scene.add(l);
			e.light = l;
		}
		if (rarity === "legendary" || rarity === "set") {
			this.hitstop = Math.max(this.hitstop, .066);
			this.legendaryFlash = item.name;
			this.flashT = 1.4;
			this.post?.punch(.003, .2);
			this.audio.legendary();
		}
		this.ents.push(e);
	}
	dropGold(x, z, amount) {
		const pos = this.scatterPos(x, z, this.rng.int(0, 5), 6);
		const e = this.makeSprite("pickup", pos.x, pos.z, [], .01, 16768341);
		e.kind = "pickup";
		e.gold = amount;
		e.uid = "gold-" + e.id;
		e.r = .3;
		e.ttl = 20;
		if (e.sprite) e.sprite.visible = false;
		const size = amount > 40 ? 1.35 : amount > 16 ? 1 : .7;
		const pile = new Group();
		const n = amount > 40 ? 5 : amount > 16 ? 3 : 2;
		const mat = new MeshStandardMaterial({
			color: 15782234,
			emissive: 11175936,
			emissiveIntensity: .55,
			roughness: .35,
			metalness: .7
		});
		for (let i = 0; i < n; i++) {
			const c = new Mesh(this.goldPileGeo, mat);
			c.position.set(i % 2 * .12 - .06, .08 + Math.floor(i / 2) * .1, i * .07 % .16);
			c.scale.setScalar(size * (.7 + i % 3 * .12));
			pile.add(c);
		}
		pile.position.set(e.x, 0, e.z);
		this.scene.add(pile);
		e.mesh = pile;
		this.ents.push(e);
	}
	dropGlobe(x, z) {
		const pos = this.scatterPos(x, z, this.rng.int(0, 4), 5);
		const e = this.makeSprite("pickup", pos.x, pos.z, [], .01, 16724804);
		e.kind = "pickup";
		e.globe = true;
		e.uid = "globe-" + e.id;
		e.r = .35;
		e.ttl = 20;
		if (e.sprite) e.sprite.visible = false;
		const gem = new Mesh(new SphereGeometry(.28, 12, 12), new MeshStandardMaterial({
			color: 13378099,
			emissive: 8917265,
			emissiveIntensity: 1.4,
			roughness: .25,
			metalness: .1
		}));
		gem.position.set(e.x, .45, e.z);
		this.scene.add(gem);
		e.mesh = gem;
		const l = new PointLight(16720435, 8, 5, 1.5);
		l.position.set(e.x, 1.1, e.z);
		this.scene.add(l);
		e.light = l;
		this.ents.push(e);
	}
	smashBarrel(e) {
		if (e.dead) return;
		e.dead = true;
		this.burst(e.x, .8, e.z, 11171652, 14);
		this.vfx?.shatter(e.x, e.z);
		this.audio.hit(false);
		if (this.rng.chance(.55)) this.dropGold(e.x, e.z, 6 + this.hero.level);
		if (this.rng.chance(.4)) this.dropGlobe(e.x, e.z);
		if (e.mesh) this.scene.remove(e.mesh);
		if (e.sprite) this.scene.remove(e.sprite);
		if (e.shadow) this.scene.remove(e.shadow);
	}
	spawnBarrel(x, z) {
		const g = this.world ? this.world.makeBarrel(x, z) : new Group();
		this.scene.add(g);
		const e = this.makeSprite("prop", x, z, [], .01, 16777215);
		e.kind = "prop";
		e.barrel = true;
		e.name = "barrel";
		e.r = .4;
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
		for (let i = 0; i < n; i++) {
			let s = this.particlePool.pop();
			if (!s) s = new Sprite(new SpriteMaterial({
				color,
				transparent: true,
				depthWrite: false
			}));
			else s.material.color.setHex(color);
			s.position.set(x, y, z);
			s.scale.setScalar(.18);
			this.scene.add(s);
			this.particles.push({
				s,
				vx: (Math.random() - .5) * 6,
				vy: 2 + Math.random() * 5,
				vz: (Math.random() - .5) * 6,
				t: .35 + Math.random() * .25
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
		const text = kind === "dodge" ? "dodge" : kind === "you" ? String(-n) : kind === "heal" ? "+" + n : String(n);
		this.numbers.push({
			x,
			y,
			z,
			t: crit ? .9 : .65,
			text,
			color: kind === "you" ? "#f88" : kind === "heal" ? "#7dff8a" : crit ? "#ffa64d" : "#f4efe4",
			crit: crit || kind === "heal"
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
			if (d >= bd || d < .05) continue;
			if ((dx * fx + dz * fz) / d >= Math.cos(half)) {
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
			if (e.barrel && !e.dead && Math.hypot(e.x - x, e.z - z) <= range + e.r) this.smashBarrel(e);
			if (e.team !== 2 || e.dead || e.corpse) continue;
			const dx = e.x - x;
			const dz = e.z - z;
			const d = Math.hypot(dx, dz);
			if (d > range + e.r) continue;
			if ((d < .08 ? 1 : (dx * fx + dz * fz) / d) < Math.cos(half)) continue;
			this.hurt(e, dmg * (1 + this.stat("area") / 200), false);
			if (extra?.knock && !(e.elite && (e.knockLock ?? 0) > 0)) {
				e.x += fx * extra.knock * .12;
				e.z += fz * extra.knock * .12;
				if (e.elite) e.knockLock = 3;
			}
			if (extra?.stun && !(e.elite && (e.knockLock ?? 0) > 0)) this.applyCC(e, "stun", extra.stun);
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
		if (this.equippedList().some((i) => LEGENDARIES.find((l) => l.id === i.legendaryId)?.power === id)) return true;
		if (this.cube && LEGENDARIES.find((l) => l.id === this.cube.legendaryId)?.power === id) return true;
		return false;
	}
	hasSet(n, id) {
		return this.equippedList().filter((i) => i.setId === id).length >= n;
	}
	equippedList() {
		const h = this.hero;
		const out = [];
		for (const v of Object.values(h.equipped)) if (Array.isArray(v)) out.push(...v);
		else if (v) out.push(v);
		return out;
	}
	stat(id) {
		let v = 0;
		for (const it of this.equippedList()) for (const a of it.affixes) if (a.id === id) v += a.value;
		const h = this.hero;
		if (id === "str") v += h.paragonSpent.core * 5;
		if (id === "vit") v += h.paragonSpent.core * 5;
		if (id === "crit") v += h.paragonSpent.offense * .4;
		if (id === "critDmg") v += h.paragonSpent.offense * 1.2;
		if (id === "armor") v += h.paragonSpent.defense * 8;
		if (id === "allRes") v += h.paragonSpent.defense * 4;
		if (id === "cdr") v += h.paragonSpent.utility * .3;
		if (id === "pickup") v += h.paragonSpent.utility * .05;
		if (this.hasSet(2, "thornwatch") && (id === "armor" || id === "vit")) v *= 1.15;
		return v;
	}
	outDmg() {
		const h = this.hero;
		const cls = CLASSES[h.classId];
		const prim = cls.base[cls.primary] * 4 + h.level * 3 + this.stat(cls.primary);
		return (18 + h.level * 2.2) * (1 + prim / 140) * (this.hasSet(4, "thornwatch") && cls.id === "barbarian" ? 1.2 : 1);
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
			slot: "main"
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
			slot: "main"
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
		for (let i = 0; i < 8; i++) this.vendorStock.push(rollItem({
			rng: this.rng,
			level: h.level,
			classId: h.classId,
			rarity: i < 2 ? "rare" : "magic"
		}));
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
			if (step.kind === kind && (step.target === target || step.target === "any" || kind === "kill" && step.target === "any")) {
				q.progress += n;
				if ((step.count ?? 1) <= q.progress) {
					q.step += 1;
					q.progress = 0;
					if (q.step >= def.steps.length) {
						q.done = true;
						h.gold += def.rewardGold;
						addXp(h, def.rewardXp);
						this.toast(`Quest complete: ${def.name}`);
						const next = QUESTS.find((x) => !h.quests.some((y) => y.id === x.id) && (x.act <= h.act || h.flags.maltheon));
						if (next) h.quests.push({
							id: next.id,
							step: 0,
							progress: 0,
							done: false
						});
					}
				}
			}
		}
	}
	bounty(kind) {
		for (const b of this.save.weekly.bounties) {
			if (b.done) continue;
			if (b.kind === kind || kind === "kill" && b.kind === "kill") {
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
			t: 4.5
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
			const shake = this.reduced ? 0 : this.trauma * this.trauma * (this.save.settings.shake ?? .7);
			const ox = (Math.random() - .5) * shake * 1.1;
			const oz = (Math.random() - .5) * shake * 1.1;
			const followK = this.camLagT > 0 ? 3.4 : 10;
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
		const t = this.clock.elapsedTime;
		for (const e of this.ents) {
			if (e.kind === "pickup" && e.mesh) {
				e.mesh.position.x = e.x;
				e.mesh.position.z = e.z;
				if (e.item) {
					e.mesh.position.y = Math.sin(t * 3.4 + e.id) * .08;
					e.mesh.rotation.y += dt * 1.6;
				}
			}
			if (e.figure) {
				e.figure.update({
					moving: Math.hypot(e.vx, e.vz) > .25,
					speed: Math.hypot(e.vx, e.vz),
					attacking: (e.attackT ?? 0) > 0,
					whirlwind: !!(this.channel && e.kind === "player" && (this.channel.id === "whirlwind" || this.channel.id === "bloodspin")),
					dead: !!e.corpse || e.dead,
					freeze: e.cc?.type === "freeze" && e.cc.t > 0,
					facing: e.facing,
					dt,
					time: t
				});
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
		if (this.channel?.id === "whirlwind" && p && Math.random() < .18) this.vfx?.whirl(p.x, p.z);
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
		for (const n of this.numbers) {
			this.tmp.set(n.x, n.y + (.65 - n.t) * 1.4, n.z);
			this.tmp.project(this.camera);
			const sx = (this.tmp.x * .5 + .5) * w;
			const sy = (-this.tmp.y * .5 + .5) * h;
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
			this.tmp.set(this.player.x, this.player.scale + .15, this.player.z).project(this.camera);
			const sx = (this.tmp.x * .5 + .5) * w;
			const sy = (-this.tmp.y * .5 + .5) * h;
			const bw = 54 * pr;
			ctx.fillStyle = "rgba(0,0,0,0.55)";
			ctx.fillRect(sx - bw / 2, sy, bw, 5 * pr);
			ctx.fillStyle = "#9b1c1c";
			ctx.fillRect(sx - bw / 2, sy, bw * (this.hp / this.maxHp), 5 * pr);
		}
		for (const e of this.ents) {
			if (e.kind !== "monster" || e.dead || e.team !== 2) continue;
			this.tmp.set(e.x, e.scale + .2, e.z).project(this.camera);
			const sx = (this.tmp.x * .5 + .5) * w;
			const sy = (-this.tmp.y * .5 + .5) * h;
			const bw = (e.boss ? 90 : 44) * pr;
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(sx - bw / 2, sy, bw, 4 * pr);
			ctx.fillStyle = e.elite ? "#e8a23a" : "#9b1c1c";
			ctx.fillRect(sx - bw / 2, sy, bw * (e.hp / e.maxHp), 4 * pr);
		}
		for (const e of this.ents) {
			if (e.kind !== "pickup" || !e.item) continue;
			this.tmp.set(e.x, 1.3, e.z).project(this.camera);
			const sx = (this.tmp.x * .5 + .5) * w;
			const sy = (-this.tmp.y * .5 + .5) * h;
			ctx.font = `600 ${12 * pr}px Barlow, sans-serif`;
			ctx.textAlign = "center";
			ctx.fillStyle = e.item.rarity === "legendary" ? "#ff7a18" : e.item.rarity === "set" ? "#6dcc5a" : e.item.rarity === "rare" ? "#f0d15a" : e.item.rarity === "magic" ? "#6ea0ff" : "#ddd";
			ctx.fillText(e.item.name, sx, sy);
		}
		for (const e of this.ents) {
			if (e.kind !== "pickup" || e.item || e.dead) continue;
			this.tmp.set(e.x, 1.05, e.z).project(this.camera);
			const sx = (this.tmp.x * .5 + .5) * w;
			const sy = (-this.tmp.y * .5 + .5) * h;
			ctx.font = `600 ${11 * pr}px Barlow, sans-serif`;
			ctx.textAlign = "center";
			ctx.fillStyle = e.globe ? "#de624c" : "#f0d15a";
			ctx.fillText(e.globe ? "Globe" : `+${Math.floor(e.gold ?? 0)} Gold`, sx, sy);
		}
		for (const e of this.ents) {
			if (e.kind !== "npc" || !e.name) continue;
			if (!this.player) continue;
			if (Math.hypot(e.x - this.player.x, e.z - this.player.z) > 5.5) continue;
			this.tmp.set(e.x, (e.figure?.height ?? e.scale) + .2, e.z).project(this.camera);
			const sx = (this.tmp.x * .5 + .5) * w;
			const sy = (-this.tmp.y * .5 + .5) * h;
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
			setKeys: (codes) => this.input.setKeys(codes),
			setPos: (x, z) => {
				if (!this.player) return;
				this.player.x = x;
				this.player.z = z;
				if (this.player.figure) this.player.figure.root.position.set(x, 0, z);
				if (this.player.sprite) this.player.sprite.position.set(x, .02, z);
			},
			interact: () => {
				this.interactScan();
				if (this.interactEnt) this.doInteract(this.interactEnt);
			},
			enter: (kind) => this.enterPortal(kind)
		};
	}
	snapshot() {
		const h = this.hero;
		const cls = h ? CLASSES[h.classId] : CLASSES.barbarian;
		const q = h?.quests.find((x) => !x.done);
		const qdef = q ? QUESTS.find((x) => x.id === q.id) : void 0;
		const step = qdef && q ? qdef.steps[q.step] : void 0;
		const kit = h ? this.kit() : null;
		const locked = !!this.channel && (this.channel.id === "whirlwind" || this.channel.id === "bloodspin");
		const snapSkill = (s, key) => ({
			id: s.id,
			name: s.name,
			key,
			cd: this.skillCd[s.id] ?? 0,
			maxCd: s.cooldown,
			charges: s.charges ? this.skillCharges[s.id] ?? s.charges : 0,
			maxCharges: s.charges ?? 0,
			locked: locked && s.kind !== "channel",
			icon: iconFor(s),
			channel: this.channel?.id === s.id && this.channel.max ? this.channel.t / this.channel.max : 0
		});
		const tgt = this.target && !this.target.dead ? this.target : null;
		const groundLoot = this.ents.filter((e) => e.kind === "pickup" && !e.dead).slice(0, 8).map((e) => ({
			uid: e.uid ?? e.item?.uid ?? String(e.id),
			name: e.globe ? "Health Globe" : e.gold ? `+${Math.floor(e.gold)} Gold` : e.item?.name ?? "Loot",
			rarity: e.globe ? "globe" : e.gold ? "gold" : e.item?.rarity ?? "normal",
			gold: e.gold
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
				crystal: 0
			},
			difficulty: h?.difficulty ?? "normal",
			areaName: this.level?.name ?? "Thornwatch",
			biome: this.level?.biome ?? "town",
			questText: step ? `${qdef.name}: ${step.text.replace("0/", `${q?.progress ?? 0}/`)}` : "The veil holds — for now.",
			buffs: this.buffs.map((b) => ({
				id: b.id,
				name: b.name,
				t: b.t
			})),
			skills: kit ? kit.equipped.map((s, i) => snapSkill(s, String(i + 1))) : [],
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
			target: tgt ? {
				name: tgt.name ?? MONSTERS[tgt.monsterId ?? ""]?.name ?? "Foe",
				hp: tgt.hp,
				maxHp: tgt.maxHp,
				level: h?.level ?? 1,
				elite: !!tgt.elite,
				boss: !!tgt.boss,
				type: tgt.boss ? "demon" : tgt.monsterId === "skeleton" ? "undead" : tgt.monsterId === "cultist" ? "humanoid" : "demon",
				affixes: tgt.champion ?? []
			} : null,
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
			lowHp: this.maxHp > 0 && this.hp / this.maxHp < .28,
			portrait: cls.portrait
		};
	}
	minimap() {
		const lv = this.level;
		const p = this.player;
		if (!lv || !p) return {
			w: 1,
			h: 1,
			px: 0,
			pz: 0,
			ents: []
		};
		return {
			w: lv.bounds.w,
			h: lv.bounds.d,
			px: p.x - lv.bounds.x,
			pz: p.z - lv.bounds.z,
			ents: this.ents.filter((e) => e.kind === "monster" && e.team === 2 && !e.dead).slice(0, 40).map((e) => ({
				x: e.x - lv.bounds.x,
				z: e.z - lv.bounds.z,
				c: e.boss ? "#f64" : e.elite ? "#fc6" : "#c44"
			}))
		};
	}
	emit(force = false) {
		this.toasts = this.toasts.map((t) => ({
			...t,
			t: t.t - (force ? 0 : .09)
		})).filter((t) => t.t > 0);
		this.pushUI(this.snapshot());
	}
};
//#endregion
export { Veilbreak };
