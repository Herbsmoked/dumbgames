import { useEffect, useRef, useState, type PointerEvent as PE, type ReactNode } from "react";
import { Backpack, Hand, Map as MapIcon, Menu, Swords } from "lucide-react";
import type { Veilbreak } from "@/game/engine";
import { CLASSES, DIFFICULTY, GAME_TITLE, INVENTORY_SIZE, INTRO, LEGENDARIES, ROSTER, SLOT_LABEL, SLOTS, TOWN_NAME, roleOf } from "@/game/catalog";
import { formatAffix, itemCR, itemDamage, itemLife } from "@/game/loot";
import type { ClassId, Item, Panel, SkillSnap, Slot, UiSnapshot } from "@/game/types";
import { isPc } from "@/game/platform";

const empty: UiSnapshot = {
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
  materials: { scrap: 0, dust: 0, crystal: 0 },
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
  minimap: { w: 1, h: 1, px: 0, pz: 0, ents: [] },
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
  pc: typeof window === "undefined" ? true : isPc(),
};

export function GameApp() {
  const worldRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const game = useRef<Veilbreak | null>(null);
  const [ui, setUi] = useState<UiSnapshot>(empty);
  const [sel, setSel] = useState<ClassId>("barbarian");
  const [name, setName] = useState("Ashen");
  const [intro, setIntro] = useState(0);
  const [hover, setHover] = useState<Item | null>(null);
  const [saves, setSaves] = useState<{ name: string; classId: ClassId; level: number }[]>([]);

  useEffect(() => {
    const world = worldRef.current;
    const overlay = overlayRef.current;
    if (!world || !overlay) return;
    let g: Veilbreak | null = null;
    let dead = false;
    void import("@/game/engine").then(({ Veilbreak }) => {
      if (dead) return;
      g = new Veilbreak(world, overlay, setUi);
      game.current = g;
      void g.start();
      try {
        const raw = localStorage.getItem("veilbreak-save-v1");
        if (raw) {
          const p = JSON.parse(raw) as { characters?: { name: string; classId: ClassId; level: number }[] };
          setSaves(p.characters ?? []);
        }
      } catch {
        /* ignore */
      }
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

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-void text-bone font-sans">
      <canvas ref={worldRef} className={`absolute inset-0 h-full w-full touch-none ${ui.pc && ui.screen === "playing" ? "cursor-none" : ""}`} />
      <canvas ref={overlayRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      {ui.loading && <LoadGate pct={ui.loadPct} />}
      {ui.screen === "title" && !ui.loading && (
        <Title
          saves={saves}
          onNew={() => game.current?.goSelect()}
          onContinue={(i) => game.current?.continueHero(i)}
        />
      )}
      {ui.screen === "select" && (
        <Select
          sel={sel}
          name={name}
          onSel={setSel}
          onName={setName}
          onStart={() => g?.chooseClass(sel, name)}
          onBack={() => setUi({ ...ui, screen: "title" })}
        />
      )}
      {ui.screen === "intro" && (
        <Intro i={intro} onNext={() => (intro < INTRO.length - 1 ? setIntro(intro + 1) : (setIntro(0), g?.finishIntro()))} />
      )}

      {ui.screen === "playing" && (
        <Hud
          ui={ui}
          hover={hover}
          setHover={setHover}
          onPanel={(p) => g?.openPanel(p)}
          onEquip={(id) => g?.equip(id)}
          onEquipTo={(id, s, r) => g?.equipTo(id, s, r)}
          onUnequip={(s, i) => g?.unequip(s, i)}
          onSalvage={(id) => g?.salvage(id)}
          onStash={(id, t) => g?.stashMove(id, t)}
          onBuy={(id) => g?.buy(id)}
          onReforge={(id) => g?.reforge(id)}
          onSocket={(id) => g?.addSocket(id)}
          onExtract={(id) => g?.extractPower(id)}
          onRune={(id) => g?.toggleRune(id)}
          onDiff={(d) => g?.setDifficulty(d)}
          onTalk={(id) => g?.talkChoice(id)}
          onRift={(t) => g?.enterPortal("rift", t)}
          onParagon={(k) => g?.spendParagon(k)}
          onStick={(x, y) => g?.setStick(x, y)}
          onSkill={(i) => game.current?.pressSkill(i)}
          onSkillHold={(i, d) => game.current?.holdSkill(i, d)}
          onPrimary={(d) => game.current?.holdPrimary(d)}
          onUlt={() => game.current?.pressUltimate()}
          onPotion={() => game.current?.drinkPotion()}
          onLoot={(id) => game.current?.pickupGround(id)}
          onInteract={() => game.current?.useInteract()}
          onSetPrimary={(id) => game.current?.setPrimarySkill(id)}
          onSetLoadout={(slot, id) => game.current?.setLoadoutSlot(slot, id)}
          onPaperdoll={(el) => game.current?.mountPaperdoll(el)}
          onDollYaw={(d) => game.current?.paperdollYaw(d)}
        />
      )}

      {ui.screen === "dead" && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-void/80">
          <p className="font-display text-4xl tracking-widest text-blood">Fallen</p>
          <p className="mt-3 max-w-sm text-center text-muted">The Choir does not keep what it kills. Rise where you fell, or walk back to the lanterns.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ui.biome !== "town" && (
              <button type="button" className="rounded-md border border-gold bg-stone px-6 py-3 text-sm font-semibold text-bone" onClick={() => g?.respawn(false)}>
                Rise at the door
              </button>
            )}
            <button type="button" className="rounded-md bg-bone px-8 py-3 text-sm font-semibold text-void" onClick={() => g?.respawn(true)}>
              Return to Thornwatch
            </button>
          </div>
        </div>
      )}

      {ui.legendaryFlash && (
        <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-void/40">
          <div className="border border-legend/40 bg-ash/90 px-10 py-6 text-center">
            <p className="text-xs tracking-[0.3em] text-legend uppercase">Legendary</p>
            <p className="mt-2 font-display text-2xl text-bone">{ui.legendaryFlash}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadGate({ pct }: { pct: number }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-void">
      <div className="relative mb-8 size-28">
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-gold/70" style={{ boxShadow: "0 0 24px #c4a35a55, inset 0 0 18px #c4a35a33" }} />
        <div className="absolute inset-3 animate-spin rounded-full border border-gold-lo" style={{ animationDirection: "reverse", animationDuration: "4s" }} />
        <div className="absolute inset-[22%] rounded-full bg-gradient-to-br from-gold-hi/40 to-blood/40" />
      </div>
      <p className="font-display text-3xl tracking-[0.4em]">{GAME_TITLE}</p>
      <div className="mt-8 h-1 w-48 overflow-hidden bg-stone">
        <div className="h-full bg-gold-hi transition-all duration-300" style={{ width: `${Math.round(pct * 100)}%` }} />
      </div>
      <p className="mt-3 text-xs tracking-[0.35em] text-muted uppercase">Binding the veil</p>
    </div>
  );
}

function Title({
  saves,
  onNew,
  onContinue,
}: {
  saves: { name: string; classId: ClassId; level: number }[];
  onNew: () => void;
  onContinue: (i: number) => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col">
      <img src="/game/title.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/30" />
      <div className="relative mt-auto flex flex-col items-center px-6 pb-16 pt-24">
        <p className="text-[11px] tracking-[0.45em] text-muted uppercase">The Shattered Marches of Aeloria</p>
        <h1 className="mt-3 font-display text-5xl tracking-[0.28em] sm:text-7xl">{GAME_TITLE}</h1>
        <p className="mt-4 max-w-md text-center text-sm text-muted">The veil is torn. Thornwatch is the last lantern. You are what the wound spat back.</p>
        <button type="button" className="mt-10 min-h-11 rounded-md bg-bone px-10 py-3 text-sm font-semibold tracking-wide text-void" onClick={onNew}>
          New Wanderer
        </button>
        {saves.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {saves.map((s, i) => (
              <button key={s.name + i} type="button" className="rounded-sm border border-border bg-ash/80 px-4 py-2 text-xs" onClick={() => onContinue(i)}>
                {s.name} · {CLASSES[s.classId].name} · {s.level}
              </button>
            ))}
          </div>
        )}
        <p className="mt-8 text-[11px] text-faint">WASD move · hold LMB / Space to strike · 1–4 skills · Q ultimate · R potion · F force-move</p>
      </div>
    </div>
  );
}

function Select({
  sel,
  name,
  onSel,
  onName,
  onStart,
  onBack,
}: {
  sel: ClassId;
  name: string;
  onSel: (c: ClassId) => void;
  onName: (s: string) => void;
  onStart: () => void;
  onBack: () => void;
}) {
  const picked = ROSTER.find((r) => (r.playable ?? r.id) === sel) ?? ROSTER[0]!;
  const c = CLASSES.barbarian;
  return (
    <div className="absolute inset-0 z-20 overflow-y-auto bg-void">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-muted uppercase">Choose your wound</p>
            <h2 className="font-display text-3xl tracking-widest">The Nine</h2>
          </div>
          <button type="button" className="text-sm text-muted" onClick={onBack}>
            Back
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-9">
          {ROSTER.map((cl) => (
            <button
              key={cl.id}
              type="button"
              onClick={() => {
                if (!cl.locked && cl.playable) onSel(cl.playable);
              }}
              className={`relative overflow-hidden rounded-lg border text-left ${
                sel === (cl.playable ?? cl.id) ? "border-gold" : "border-border"
              } ${cl.locked ? "opacity-55" : ""}`}
            >
              <img src={cl.portrait} alt={cl.name} className="aspect-[2/3] w-full object-cover object-top" />
              {cl.locked && (
                <div className="absolute inset-0 flex flex-col items-center justify-end bg-void/50 pb-2">
                  <span className="rounded-sm border border-gold-lo bg-ash/80 px-2 py-0.5 text-[9px] tracking-widest text-gold uppercase">Locked</span>
                </div>
              )}
              <div className="px-2 py-1.5">
                <p className="font-display text-[11px] leading-tight sm:text-sm">{cl.name}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <img src={picked.portrait} alt="" className="hidden h-80 w-full rounded-lg object-cover object-top lg:block" />
          <div className="menu-sheet rounded-xl p-6">
            <p className="font-display text-2xl">{picked.name}</p>
            <p className="text-sm text-muted">{picked.title}</p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-bone/90">{picked.lore}</p>
            {!picked.locked && (
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {c.skills.filter((s) => roleOf(s) !== "ultimate").slice(0, 6).map((s) => (
                  <div key={s.id} className="rounded-md border border-gold-lo bg-stone/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted">{s.key}</p>
                    <p className="text-sm">{s.name}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-1 text-xs text-muted">
                Name
                <input
                  value={name}
                  onChange={(e) => onName(e.target.value.slice(0, 16))}
                  className="min-h-11 rounded-md border border-gold-lo bg-ash px-3 text-sm text-bone"
                />
              </label>
              <button
                type="button"
                disabled={picked.locked}
                className="min-h-11 rounded-md bg-bone px-8 text-sm font-semibold text-void disabled:opacity-40"
                onClick={onStart}
              >
                {picked.locked ? "Sealed" : "Enter Thornwatch"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Intro({ i, onNext }: { i: number; onNext: () => void }) {
  return (
    <button type="button" className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-void px-8 text-center" onClick={onNext}>
      <img src="/game/title.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      <p className="relative max-w-xl font-display text-2xl leading-snug sm:text-3xl">{INTRO[i]}</p>
      <p className="relative mt-10 text-xs tracking-[0.3em] text-muted uppercase">Touch to continue</p>
    </button>
  );
}

function Hud(props: {
  ui: UiSnapshot;
  hover: Item | null;
  setHover: (i: Item | null) => void;
  onPanel: (p: Panel) => void;
  onEquip: (id: string) => void;
  onEquipTo: (id: string, s: Slot, r?: number) => void;
  onUnequip: (s: Slot, i?: number) => void;
  onSalvage: (id: string) => void;
  onStash: (id: string, t: boolean) => void;
  onBuy: (id: string) => void;
  onReforge: (id: string) => void;
  onSocket: (id: string) => void;
  onExtract: (id: string) => void;
  onRune: (id: string) => void;
  onDiff: (d: UiSnapshot["difficulty"]) => void;
  onTalk: (id: string) => void;
  onRift: (t: number) => void;
  onParagon: (k: "core" | "offense" | "defense" | "utility") => void;
  onStick: (x: number, y: number) => void;
  onSkill: (i: number) => void;
  onSkillHold: (i: number, d: boolean) => void;
  onPrimary: (d: boolean) => void;
  onUlt: () => void;
  onPotion: () => void;
  onLoot: (id: string) => void;
  onInteract: () => void;
  onSetPrimary: (id: string) => void;
  onSetLoadout: (slot: number, id: string) => void;
  onPaperdoll: (el: HTMLCanvasElement | null) => void;
  onDollYaw: (d: number) => void;
}) {
  const { ui, onPanel } = props;
  const hp = ui.maxHp ? ui.hp / ui.maxHp : 0;
  const chase = ui.maxHp ? ui.hpChase / ui.maxHp : 0;
  return (
    <>
      {ui.lowHp && <div className="low-vignette" />}

      <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-start gap-2 sm:left-4 sm:top-4">
        <div className="relative">
          <div className={`portrait-ring size-16 sm:size-[4.6rem] ${ui.lowHp ? "is-low" : ""}`}>
            <img src={ui.portrait} alt="" className="size-full rounded-full object-cover object-top" />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-sm border border-gold bg-stone px-1.5 text-[10px] font-bold tabular-nums text-bone">
            {ui.level}
          </span>
        </div>
        <div className="pt-1">
          <div className="hp-well w-[148px] sm:w-[210px]">
            <div className="hp-chase" style={{ width: `${Math.max(hp, chase) * 100}%` }} />
            <div className="hp-fill" style={{ width: `${hp * 100}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums text-bone" style={{ textShadow: "0 1px 2px #000" }}>
              {Math.ceil(ui.hp)} / {Math.ceil(ui.maxHp)}
            </span>
          </div>
          <p className="mt-1 text-[10px] tracking-wide text-muted">
            {ui.name} · CR {Math.round(ui.combatRating)}
          </p>
          <div className="mt-1 flex gap-1">
            {ui.buffs.map((b) => (
              <span key={b.id + b.t} className="rounded-sm border border-gold-lo bg-ash px-1.5 py-0.5 text-[9px] text-gold-hi">
                {b.name} {Math.ceil(b.t)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {ui.target && (
        <div className="pointer-events-none absolute left-1/2 top-3 z-10 w-[min(280px,70vw)] -translate-x-1/2 sm:top-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-[10px] tabular-nums text-muted">{ui.target.level}</span>
            <p className={`font-display text-sm ${ui.target.elite || ui.target.boss ? "text-gold-hi" : "text-bone"}`}>
              {ui.target.boss ? "☠ " : ui.target.elite ? "✦ " : ""}
              {ui.target.name}
            </p>
            <span className="text-[10px] uppercase text-muted">{ui.target.type}</span>
          </div>
          <div className="hp-well mt-0.5 h-3 w-full">
            <div className="hp-fill" style={{ width: `${(ui.target.maxHp ? ui.target.hp / ui.target.maxHp : 0) * 100}%` }} />
          </div>
          {ui.target.affixes.length > 0 && (
            <p className="mt-0.5 text-center text-[9px] uppercase tracking-wider text-gold">{ui.target.affixes.join(" · ")}</p>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-start gap-1.5 sm:right-4 sm:top-4">
        <div className="pointer-events-auto flex flex-col gap-1">
          {(
            [
              ["inventory", Backpack, "Bag"],
              ["skills", Swords, "Skills"],
              ["map", MapIcon, "Map"],
              ["pause", Menu, "Menu"],
            ] as const
          ).map(([p, Icon, label]) => (
            <button key={p} type="button" className="stone-btn size-9 rounded-sm" onClick={() => onPanel(p)} aria-label={label}>
              <Icon className="size-4 text-gold-hi" />
            </button>
          ))}
        </div>
        <button type="button" className="pointer-events-auto" onClick={() => onPanel("map")}>
          <Mini map={ui.minimap} zone={ui.areaName} />
        </button>
      </div>

      {ui.rift?.active && (
        <div className={`pointer-events-none absolute left-1/2 z-10 w-[min(260px,70vw)] -translate-x-1/2 ${ui.target ? "top-[5.8rem]" : "top-3"}`}>
          <p className="text-center text-[10px] tracking-[0.2em] text-gold uppercase">First Tear · T{ui.rift.tier}</p>
          <div className="hp-well mt-0.5 h-2 w-full">
            <div className="hp-fill" style={{ width: `${Math.min(100, (ui.rift.progress / ui.rift.goal) * 100)}%`, background: "linear-gradient(180deg,#e6c87a,#c45a12)" }} />
          </div>
          <p className="mt-0.5 text-center text-[10px] tabular-nums text-muted">
            {Math.floor(ui.rift.time / 60)}:{String(Math.floor(ui.rift.time % 60)).padStart(2, "0")} · {ui.rift.progress}/{ui.rift.goal}
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute left-3 top-24 z-10 max-w-[220px] sm:top-28">
        <button type="button" className="quest-parchment pointer-events-auto rounded-sm px-3 py-2 text-left text-[11px] leading-snug" onClick={() => game.current?.pathQuest()}>
          <p className="mb-0.5 text-[10px] tracking-widest text-gold uppercase">!</p>
          {ui.questText}
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-36 left-1/2 z-10 flex w-[min(280px,70vw)] -translate-x-1/2 flex-col items-center gap-1">
        {ui.interact && (
          <button type="button" className="hand-btn pointer-events-auto flex items-center justify-center" onClick={props.onInteract} aria-label={ui.interact}>
            <Hand className="size-6 text-gold-hi" />
          </button>
        )}
        {ui.groundLoot.map((g) => (
          <button
            key={g.uid}
            type="button"
            className={`loot-plate pointer-events-auto rounded-sm px-3 py-1.5 text-xs rarity-${g.rarity}`}
            onClick={() => props.onLoot(g.uid)}
          >
            {g.name}
          </button>
        ))}
      </div>

      <SkillCluster ui={ui} pc={ui.pc} onSkill={props.onSkill} onSkillHold={props.onSkillHold} onPrimary={props.onPrimary} onUlt={props.onUlt} onPotion={props.onPotion} />
      {!ui.pc && <Stick onStick={props.onStick} />}

      {ui.panel === "inventory" && <Inv {...props} />}
      {ui.panel === "stash" && <Stash {...props} />}
      {ui.panel === "vendor" && <Vendor {...props} />}
      {ui.panel === "blacksmith" && <Smith {...props} />}
      {ui.panel === "mystic" && <Mystic {...props} />}
      {ui.panel === "skills" && (
        <Skills ui={ui} onRune={props.onRune} onPrimary={props.onSetPrimary} onLoadout={props.onSetLoadout} onClose={() => onPanel("none")} />
      )}
      {ui.panel === "quests" && <Quests ui={ui} onClose={() => onPanel("none")} />}
      {ui.panel === "rifts" && <Rifts ui={ui} onRift={props.onRift} onClose={() => onPanel("none")} />}
      {ui.panel === "bounties" && <Bounties onClose={() => onPanel("none")} />}
      {ui.panel === "pause" && <PauseMenu ui={ui} onDiff={props.onDiff} onParagon={props.onParagon} onClose={() => onPanel("none")} />}
      {ui.panel === "map" && <PauseMenu ui={ui} onDiff={props.onDiff} onParagon={props.onParagon} onClose={() => onPanel("none")} />}
      {ui.panel === "dialogue" && ui.dialogue && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-void via-void/95 to-transparent px-4 pb-8 pt-16">
          <div className="mx-auto max-w-2xl menu-sheet rounded-xl p-5">
            <p className="font-display text-lg">{ui.dialogue.speaker}</p>
            <p className="mt-2 text-sm leading-relaxed text-bone/90">{ui.dialogue.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(ui.dialogue.options ?? [{ id: "x", label: "Leave" }]).map((o) => (
                <button key={o.id} type="button" className="min-h-11 rounded-md border border-gold-lo bg-stone px-4 text-sm" onClick={() => props.onTalk(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {props.hover && <Tip item={props.hover} eq={equippedIn(ui, props.hover.slot)} />}
    </>
  );
}

function SkillCluster({
  ui,
  pc,
  onSkillHold,
  onPrimary,
  onUlt,
  onPotion,
}: {
  ui: UiSnapshot;
  pc: boolean;
  onSkill: (i: number) => void;
  onSkillHold: (i: number, d: boolean) => void;
  onPrimary: (d: boolean) => void;
  onUlt: () => void;
  onPotion: () => void;
}) {
  const s = ui.skills;
  if (pc) {
    return (
      <div className="absolute bottom-3 right-3 z-20 flex items-end gap-1.5 sm:bottom-4 sm:right-4">
        {ui.ultReady && ui.ultimate && (
          <Medallion skill={ui.ultimate} size={42} onDown={() => onUlt()} pulse />
        )}
        {s[0] && <Medallion skill={s[0]} size={44} onDown={() => onSkillHold(0, true)} onUp={() => onSkillHold(0, false)} />}
        {s[1] && <Medallion skill={s[1]} size={44} onDown={() => onSkillHold(1, true)} onUp={() => onSkillHold(1, false)} />}
        {s[2] && <Medallion skill={s[2]} size={44} onDown={() => onSkillHold(2, true)} onUp={() => onSkillHold(2, false)} />}
        {s[3] && <Medallion skill={s[3]} size={44} onDown={() => onSkillHold(3, true)} onUp={() => onSkillHold(3, false)} />}
        <button
          type="button"
          className={`medallion size-10 ${ui.hp / ui.maxHp < 0.55 ? "animate-pulse" : ""}`}
          onClick={onPotion}
          aria-label="Potion"
        >
          <img src="/game/icons/potion.png" alt="" />
          {ui.potionCd > 0 && <span className="cd-sweep" style={{ ["--cd" as string]: String(Math.min(1, ui.potionCd / 2.6)) }} />}
          {ui.potionCd > 0 && <span className="cd-num text-sm">{Math.ceil(ui.potionCd)}</span>}
          <span className="absolute -right-1 -top-1 rounded-sm border border-gold bg-stone px-1 text-[10px] font-bold tabular-nums">{ui.potionCount}</span>
        </button>
      </div>
    );
  }
  return (
    <div className="absolute bottom-2 right-2 z-20 h-[200px] w-[220px] sm:bottom-4 sm:right-4">
      {ui.ultReady && ui.ultimate && (
        <div className="absolute bottom-2 left-0">
          <Medallion skill={ui.ultimate} size={54} onDown={() => onUlt()} pulse />
        </div>
      )}
      {s[0] && (
        <div className="absolute bottom-[44px] left-[8px]">
          <Medallion skill={s[0]} size={54} onDown={() => onSkillHold(0, true)} onUp={() => onSkillHold(0, false)} />
        </div>
      )}
      {s[1] && (
        <div className="absolute bottom-[102px] left-[44px]">
          <Medallion skill={s[1]} size={54} onDown={() => onSkillHold(1, true)} onUp={() => onSkillHold(1, false)} />
        </div>
      )}
      {s[2] && (
        <div className="absolute bottom-[102px] right-[52px]">
          <Medallion skill={s[2]} size={54} onDown={() => onSkillHold(2, true)} onUp={() => onSkillHold(2, false)} />
        </div>
      )}
      {s[3] && (
        <div className="absolute bottom-1 right-[100px]">
          <Medallion skill={s[3]} size={54} onDown={() => onSkillHold(3, true)} onUp={() => onSkillHold(3, false)} />
        </div>
      )}
      <div className="absolute bottom-0 right-0">
        {ui.primary && (
          <div className="relative">
            <div className="ult-arc" style={{ ["--ult" as string]: String(ui.ultCharge) }} />
            <Medallion skill={ui.primary} size={96} onDown={() => onPrimary(true)} onUp={() => onPrimary(false)} />
          </div>
        )}
      </div>
      <button
        type="button"
        className={`medallion absolute right-3 top-0 size-11 ${ui.hp / ui.maxHp < 0.55 ? "animate-pulse" : ""}`}
        onClick={onPotion}
        aria-label="Potion"
      >
        <img src="/game/icons/potion.png" alt="" />
        {ui.potionCd > 0 && <span className="cd-sweep" style={{ ["--cd" as string]: String(Math.min(1, ui.potionCd / 2.6)) }} />}
        {ui.potionCd > 0 && <span className="cd-num text-sm">{Math.ceil(ui.potionCd)}</span>}
        <span className="absolute -right-1 -top-1 rounded-sm border border-gold bg-stone px-1 text-[10px] font-bold tabular-nums">{ui.potionCount}</span>
      </button>
    </div>
  );
}

function Medallion({
  skill,
  size,
  k,
  onDown,
  onUp,
  pulse,
}: {
  skill: SkillSnap;
  size: number;
  k?: string;
  onDown: () => void;
  onUp?: () => void;
  pulse?: boolean;
}) {
  const cd = skill.maxCd > 0 ? Math.min(1, skill.cd / skill.maxCd) : 0;
  return (
    <button
      type="button"
      className={`medallion ${skill.cd > 0 ? "is-cd" : ""} ${skill.locked ? "opacity-40" : ""} ${pulse ? "animate-pulse" : ""}`}
      style={{ width: size, height: size }}
      onPointerDown={(e) => {
        e.preventDefault();
        onDown();
      }}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      disabled={skill.locked}
    >
      <img src={skill.icon} alt={skill.name} />
      {cd > 0.02 && <span className="cd-sweep" style={{ ["--cd" as string]: String(cd) }} />}
      {skill.cd > 0.15 && <span className="cd-num text-sm tabular-nums">{skill.cd >= 1 ? Math.ceil(skill.cd) : skill.cd.toFixed(1)}</span>}
      {skill.channel > 0 && (
        <span className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-void">
          <span className="block h-full bg-gold-hi" style={{ width: `${skill.channel * 100}%` }} />
        </span>
      )}
      {skill.maxCharges > 0 && (
        <span className="pip-row">
          {Array.from({ length: skill.maxCharges }, (_, i) => (
            <span key={i} className={`pip ${i < skill.charges ? "on" : ""}`} />
          ))}
        </span>
      )}
      {k && <span className="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 text-[9px] text-muted">{k}</span>}
    </button>
  );
}

function equippedIn(ui: UiSnapshot, slot: Slot): Item | undefined {
  const v = ui.equipped[slot];
  if (Array.isArray(v)) return v[0];
  return v;
}

function Mini({ map, zone }: { map: UiSnapshot["minimap"]; zone: string }) {
  return (
    <div className="minimap-rect h-[92px] w-[124px] sm:h-[110px] sm:w-[148px]">
      <svg viewBox={`${-map.w / 2} ${-map.h / 2} ${map.w} ${map.h}`} className="h-[72px] w-full bg-void sm:h-[88px]">
        {map.ents.map((e, i) => (
          <circle key={i} cx={e.x} cy={e.z} r={1.1} fill={e.c} />
        ))}
        <polygon points={`${map.px},${map.pz - 2.2} ${map.px + 1.6},${map.pz + 1.4} ${map.px - 1.6},${map.pz + 1.4}`} fill="#e8dcc8" />
      </svg>
      <p className="truncate px-2 py-0.5 text-center text-[9px] tracking-wider text-gold uppercase">{zone}</p>
    </div>
  );
}

const DOLL: { key: string; slot: Slot; ring?: number; label: string; x: string; y: string }[] = [
  { key: "helm", slot: "helm", label: "Head", x: "42%", y: "2%" },
  { key: "shoulders", slot: "shoulders", label: "Shoulders", x: "6%", y: "16%" },
  { key: "chest", slot: "chest", label: "Chest", x: "42%", y: "16%" },
  { key: "amulet", slot: "amulet", label: "Neck", x: "78%", y: "16%" },
  { key: "main", slot: "main", label: "Main Hand", x: "6%", y: "38%" },
  { key: "off", slot: "off", label: "Off Hand", x: "78%", y: "38%" },
  { key: "gloves", slot: "gloves", label: "Hands", x: "6%", y: "58%" },
  { key: "ring0", slot: "ring", ring: 0, label: "Ring", x: "78%", y: "58%" },
  { key: "belt", slot: "belt", label: "Waist", x: "42%", y: "58%" },
  { key: "ring1", slot: "ring", ring: 1, label: "Ring", x: "78%", y: "74%" },
  { key: "pants", slot: "pants", label: "Legs", x: "6%", y: "78%" },
  { key: "boots", slot: "boots", label: "Feet", x: "42%", y: "78%" },
];

function wornIn(ui: UiSnapshot, slot: Slot, ring = 0): Item | undefined {
  const v = ui.equipped[slot];
  if (Array.isArray(v)) return v[ring];
  return v;
}

function ItemCell({ item, onEnter, onLeave, onClick }: { item: Item; onEnter: () => void; onLeave: () => void; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={`flex h-12 items-center truncate rounded-sm border border-border bg-stone px-2 text-left text-[11px] rarity-${item.rarity}`}
    >
      {item.name}
    </button>
  );
}

function Inv(p: {
  ui: UiSnapshot;
  setHover: (i: Item | null) => void;
  onEquip: (id: string) => void;
  onEquipTo: (id: string, s: Slot, r?: number) => void;
  onUnequip: (s: Slot, i?: number) => void;
  onSalvage: (id: string) => void;
  onPanel: (p: Panel) => void;
  onPaperdoll: (el: HTMLCanvasElement | null) => void;
  onDollYaw: (d: number) => void;
}) {
  const [tab, setTab] = useState<"eq" | "gems" | "mats">("eq");
  const [sel, setSel] = useState<Item | null>(null);
  const [filter, setFilter] = useState<"all" | Slot | RarityFilter>("all");
  const [err, setErr] = useState("");
  const dollRef = useRef<HTMLCanvasElement>(null);
  const lastTap = useRef({ uid: "", t: 0 });
  const dragUid = useRef<string | null>(null);

  useEffect(() => {
    const c = dollRef.current;
    const id = window.requestAnimationFrame(() => p.onPaperdoll(c));
    return () => {
      window.cancelAnimationFrame(id);
      p.onPaperdoll(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = p.ui.inventory.filter((it) => {
    if (filter === "all") return true;
    if (filter === "magic" || filter === "rare" || filter === "legendary" || filter === "normal" || filter === "set")
      return it.rarity === filter;
    return it.slot === filter;
  });
  const cells = Array.from({ length: INVENTORY_SIZE }, (_, i) => items[i] ?? null);

  const dropOnSlot = (slot: Slot, ring?: number) => {
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

  const tapItem = (it: Item) => {
    const now = performance.now();
    if (lastTap.current.uid === it.uid && now - lastTap.current.t < 380) {
      p.onEquip(it.uid);
      setSel(null);
      lastTap.current = { uid: "", t: 0 };
      return;
    }
    lastTap.current = { uid: it.uid, t: now };
    setSel(it);
    p.setHover(it);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center bg-void/78 p-2 pt-12 pb-36 sm:items-center sm:pb-28">
      <div className="menu-sheet flex max-h-[min(88dvh,820px)] w-full max-w-5xl flex-col overflow-hidden rounded-xl">
        <div className="flex items-center justify-between gap-3 border-b border-gold-lo px-4 py-3">
          <h3 className="font-display text-xl tracking-wide text-gold-hi">Inventory</h3>
          <div className="flex gap-3 text-[11px] text-gold">
            <span>{p.ui.gold} gold</span>
            <span>{p.ui.materials.scrap} scrap</span>
            <span>{p.ui.materials.dust} dust</span>
            <span>{p.ui.materials.crystal} crystal</span>
          </div>
          <button type="button" className="text-sm text-muted" onClick={() => p.onPanel("none")}>
            Close
          </button>
        </div>
        <div className="flex gap-2 border-b border-gold-lo px-4 py-2 text-[11px] uppercase tracking-wider">
          {(["eq", "gems", "mats"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-sm px-3 py-1 ${tab === t ? "border border-gold text-gold-hi" : "text-muted"}`}
            >
              {t === "eq" ? "Equipment" : t === "gems" ? "Gems" : "Materials"}
            </button>
          ))}
          {tab === "eq" && (
            <select
              className="ml-auto rounded-sm border border-gold-lo bg-ash px-2 py-1 text-[11px] text-bone"
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <option value="all">All</option>
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {SLOT_LABEL[s]}
                </option>
              ))}
              <option value="rare">Rare</option>
              <option value="legendary">Legendary</option>
              <option value="magic">Magic</option>
            </select>
          )}
        </div>
        <div className="grid min-h-0 flex-1 gap-3 overflow-y-auto p-4 lg:grid-cols-[minmax(240px,320px)_1fr]">
          <div className="relative h-[min(52dvh,440px)] w-full overflow-hidden rounded-md border border-gold-lo bg-[#1c1712]">
            <canvas
              ref={dollRef}
              className="absolute inset-0 h-full w-full touch-none"
              onPointerDown={(e) => {
                const el = e.currentTarget;
                el.setPointerCapture(e.pointerId);
                let last = e.clientX;
                const move = (ev: PointerEvent) => {
                  p.onDollYaw((ev.clientX - last) * 0.008);
                  last = ev.clientX;
                };
                const up = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              }}
            />
            {DOLL.map((d) => {
              const it = wornIn(p.ui, d.slot, d.ring ?? 0);
              return (
                <button
                  key={d.key}
                  type="button"
                  style={{ position: "absolute", left: d.x, top: d.y, zIndex: 10 }}
                  className={`inv-socket ${it ? `rarity-${it.rarity}` : ""}`}
                  onClick={() => {
                    if (sel && sel.slot === d.slot) dropOnSlot(d.slot, d.ring);
                    else if (it) p.onUnequip(d.slot, d.ring);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const uid = e.dataTransfer.getData("text/uid") || dragUid.current || sel?.uid;
                    if (uid) {
                      dragUid.current = uid;
                      dropOnSlot(d.slot, d.ring);
                    }
                  }}
                  onMouseEnter={() => it && p.setHover(it)}
                  onMouseLeave={() => p.setHover(null)}
                >
                  <span className="inv-sil">{it ? it.name.slice(0, 10) : d.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex min-h-0 flex-col">
            {sel && (
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`text-sm rarity-${sel.rarity}`}>{sel.name}</span>
                <button type="button" className="rounded-md border border-gold bg-stone px-3 py-2 text-xs" onClick={() => p.onEquip(sel.uid)}>
                  Equip
                </button>
                <button
                  type="button"
                  className="rounded-md border border-gold-lo px-3 py-2 text-xs"
                  onClick={() => p.setHover(sel)}
                >
                  Compare
                </button>
                <button
                  type="button"
                  className="rounded-md border border-border px-3 py-2 text-xs text-muted"
                  onClick={() => {
                    if (sel.rarity === "legendary" || sel.rarity === "set") {
                      setErr("Locked — cannot salvage");
                      window.setTimeout(() => setErr(""), 900);
                      return;
                    }
                    p.onSalvage(sel.uid);
                    setSel(null);
                  }}
                >
                  Salvage
                </button>
              </div>
            )}
            {tab === "eq" && (
              <div className="inv-grid overflow-y-auto">
                {cells.map((it, i) => (
                  <button
                    key={it?.uid ?? "e" + i}
                    type="button"
                    className={`inv-cell ${it ? `rarity-b-${it.rarity}` : ""} ${sel?.uid === it?.uid ? "is-sel" : ""}`}
                    draggable={!!it}
                    onDragStart={(e) => {
                      if (!it) return;
                      dragUid.current = it.uid;
                      e.dataTransfer.setData("text/uid", it.uid);
                      e.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => it && tapItem(it)}
                    onMouseEnter={() => it && p.setHover(it)}
                    onMouseLeave={() => p.setHover(null)}
                  >
                    {it ? <span className={`text-[10px] leading-tight rarity-${it.rarity}`}>{it.name}</span> : null}
                  </button>
                ))}
              </div>
            )}
            {tab === "gems" && (
              <div className="grid gap-1">
                {p.ui.inventory.length === 0 && <p className="text-sm text-muted">No gems yet.</p>}
                <p className="text-sm text-muted">Socket gems at the Forge-Father. Ranked stones drop from rifts.</p>
              </div>
            )}
            {tab === "mats" && (
              <div className="grid gap-2 text-sm">
                <p>Scrap · {p.ui.materials.scrap}</p>
                <p>Veil Dust · {p.ui.materials.dust}</p>
                <p>Tear Crystal · {p.ui.materials.crystal}</p>
              </div>
            )}
            {err && <p className="mt-2 text-xs text-blood">{err}</p>}
            <p className="mt-2 text-[10px] text-faint">Double-tap or drop onto a socket. Drag the paperdoll to turn.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type RarityFilter = "normal" | "magic" | "rare" | "legendary" | "set";

function Stash(p: { ui: UiSnapshot; setHover: (i: Item | null) => void; onStash: (id: string, t: boolean) => void; onPanel: (x: Panel) => void }) {
  return (
    <Modal title="Stash" onClose={() => p.onPanel("none")}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs text-muted">Carried</p>
          {p.ui.inventory.map((it) => (
            <ItemCell key={it.uid} item={it} onEnter={() => p.setHover(it)} onLeave={() => p.setHover(null)} onClick={() => p.onStash(it.uid, true)} />
          ))}
        </div>
        <div>
          <p className="mb-2 text-xs text-muted">Kept</p>
          {p.ui.stash.map((it) => (
            <ItemCell key={it.uid} item={it} onEnter={() => p.setHover(it)} onLeave={() => p.setHover(null)} onClick={() => p.onStash(it.uid, false)} />
          ))}
        </div>
      </div>
    </Modal>
  );
}

function Vendor(p: { ui: UiSnapshot; onBuy: (id: string) => void; onPanel: (x: Panel) => void; setHover: (i: Item | null) => void }) {
  return (
    <Modal title="Quartermaster" onClose={() => p.onPanel("none")}>
      <p className="mb-3 text-sm text-muted">Gold: {p.ui.gold}</p>
      <div className="grid gap-1">
        {p.ui.vendor.length === 0 && <p className="text-sm text-muted">Talk to Vesh in town to restock.</p>}
        {p.ui.vendor.map((it) => (
          <ItemCell key={it.uid} item={it} onEnter={() => p.setHover(it)} onLeave={() => p.setHover(null)} onClick={() => p.onBuy(it.uid)} />
        ))}
      </div>
    </Modal>
  );
}

function Smith(p: { ui: UiSnapshot; onSalvage: (id: string) => void; onReforge: (id: string) => void; onSocket: (id: string) => void; onPanel: (x: Panel) => void; setHover: (i: Item | null) => void }) {
  return (
    <Modal title="Forge-Father" onClose={() => p.onPanel("none")}>
      <p className="mb-3 text-xs text-muted">
        Scrap {p.ui.materials.scrap} · Dust {p.ui.materials.dust} · Crystal {p.ui.materials.crystal}
      </p>
      <div className="grid gap-2">
        {p.ui.inventory.map((it) => (
          <div key={it.uid} className="flex items-center gap-2">
            <ItemCell item={it} onEnter={() => p.setHover(it)} onLeave={() => p.setHover(null)} onClick={() => p.onSalvage(it.uid)} />
            <button type="button" className="text-[11px] text-muted" onClick={() => p.onReforge(it.uid)}>
              Reforge
            </button>
            <button type="button" className="text-[11px] text-muted" onClick={() => p.onSocket(it.uid)}>
              Socket
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function Mystic(p: { ui: UiSnapshot; onExtract: (id: string) => void; onPanel: (x: Panel) => void; setHover: (i: Item | null) => void }) {
  return (
    <Modal title="Sister Maera" onClose={() => p.onPanel("none")}>
      <p className="mb-3 text-sm text-muted">Extract a legendary power into the cube (2 crystal).</p>
      {p.ui.inventory
        .filter((i) => i.legendaryId)
        .map((it) => (
          <ItemCell key={it.uid} item={it} onEnter={() => p.setHover(it)} onLeave={() => p.setHover(null)} onClick={() => p.onExtract(it.uid)} />
        ))}
    </Modal>
  );
}

function Skills({
  ui,
  onRune,
  onPrimary,
  onLoadout,
  onClose,
}: {
  ui: UiSnapshot;
  onRune: (id: string) => void;
  onPrimary: (id: string) => void;
  onLoadout: (slot: number, id: string) => void;
  onClose: () => void;
}) {
  const c = ui.classId ? CLASSES[ui.classId] : CLASSES.barbarian;
  const primaries = c.skills.filter((s) => roleOf(s) === "primary");
  const skills = c.skills.filter((s) => roleOf(s) === "skill");
  const equipped = new Set(ui.skills.map((s) => s.id));
  return (
    <Modal title="Skills" onClose={onClose}>
      <p className="mb-2 text-[11px] uppercase tracking-wider text-gold">Primary Attack</p>
      <div className="mb-4 flex gap-2">
        {primaries.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onPrimary(s.id)}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 ${ui.primary?.id === s.id ? "border-gold" : "border-border"}`}
          >
            <img src={s.icon} alt="" className="size-10 rounded-full" />
            <span className="text-left text-sm">{s.name}</span>
          </button>
        ))}
      </div>
      <p className="mb-2 text-[11px] uppercase tracking-wider text-gold">Loadout — tap to equip</p>
      <div className="grid gap-2">
        {skills.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              if (equipped.has(s.id)) return;
              onLoadout(0, s.id);
            }}
            className={`flex items-center gap-3 rounded-md border bg-ash px-3 py-2 text-left ${equipped.has(s.id) ? "border-gold" : "border-border"}`}
          >
            <img src={s.icon} alt="" className="size-11 rounded-full" />
            <div className="min-w-0 flex-1">
              <p className="font-display">
                {s.name} {equipped.has(s.id) && <span className="text-xs text-gold">Equipped</span>}
              </p>
              <p className="text-xs text-muted">{s.desc}</p>
            </div>
            <button
              type="button"
              className="text-xs text-muted"
              onClick={(e) => {
                e.stopPropagation();
                onRune(s.id);
              }}
            >
              Rune
            </button>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function Quests({ ui, onClose }: { ui: UiSnapshot; onClose: () => void }) {
  return (
    <Modal title="Codex & Quests" onClose={onClose}>
      <p className="text-sm leading-relaxed">{ui.questText}</p>
      <p className="mt-4 text-xs text-muted">Act of Thornwatch. The Black Choir still sings.</p>
    </Modal>
  );
}

function Rifts({ ui, onRift, onClose }: { ui: UiSnapshot; onRift: (t: number) => void; onClose: () => void }) {
  return (
    <Modal title="Challenge Rifts" onClose={onClose}>
      <p className="mb-4 text-sm text-muted">Ten minutes. Density. A guardian. Your best is local to this lantern.</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((t) => (
          <button key={t} type="button" className="min-h-11 rounded-md border border-border bg-stone px-3 text-sm" onClick={() => onRift(t)}>
            T{t}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">World boss in {Math.ceil(ui.worldBossIn)}s · Choir Vault via Io</p>
    </Modal>
  );
}

function Bounties({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Weekly Board" onClose={onClose}>
      <p className="text-sm text-muted">Season 1 — The First Tear. Bounties refresh with the week. Turn them in by completing the work in the field.</p>
    </Modal>
  );
}

function PauseMenu({
  ui,
  onDiff,
  onParagon,
  onClose,
}: {
  ui: UiSnapshot;
  onDiff: (d: UiSnapshot["difficulty"]) => void;
  onParagon: (k: "core" | "offense" | "defense" | "utility") => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Pause" onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase text-muted">Difficulty</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(Object.keys(DIFFICULTY) as UiSnapshot["difficulty"][]).map((d) => (
              <button key={d} type="button" className={`rounded-md border px-2 py-1 text-xs ${ui.difficulty === d ? "border-bone" : "border-border"}`} onClick={() => onDiff(d)}>
                {DIFFICULTY[d].name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase text-muted">Paragon {ui.paragon}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(["core", "offense", "defense", "utility"] as const).map((k) => (
              <button key={k} type="button" className="rounded-md border border-border px-2 py-1 text-xs capitalize" onClick={() => onParagon(k)}>
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-faint">Shake, numbers, and pickup live in the save. The veil does not pause for long.</p>
    </Modal>
  );
}

function Tip({ item, eq }: { item: Item; eq?: Item }) {
  const dmg = itemDamage(item);
  const life = itemLife(item);
  const cr = itemCR(item);
  const dmgE = eq ? itemDamage(eq) : 0;
  const lifeE = eq ? itemLife(eq) : 0;
  const crE = eq ? itemCR(eq) : 0;
  const row = (label: string, a: number, b: number) => {
    const d = a - b;
    return (
      <p className="flex justify-between gap-3">
        <span>{label}</span>
        <span>
          {a}
          {eq ? (
            <span className={d > 0 ? "text-emerald-400" : d < 0 ? "text-blood" : "text-muted"}>
              {d > 0 ? " ↑" : d < 0 ? " ↓" : ""}
              {d !== 0 ? Math.abs(d) : ""}
            </span>
          ) : null}
        </span>
      </p>
    );
  };
  return (
    <div className="pointer-events-none absolute right-4 top-24 z-40 w-72 hud-panel rounded-lg p-3 text-xs">
      <p className={`font-display text-sm rarity-${item.rarity}`}>{item.name}</p>
      <p className="text-muted">
        {SLOT_LABEL[item.slot]} · Barbarian
        {item.sockets ? ` · ${item.sockets} sockets` : ""}
      </p>
      {!item.identified && <p className="mt-1 italic text-muted">Unidentified</p>}
      {item.identified && (
        <div className="mt-2 space-y-0.5">
          {row("Damage", dmg, dmgE)}
          {row("Life", life, lifeE)}
          {row("Combat Rating", cr, crE)}
          {item.affixes.slice(0, 3).map((a, i) => {
            const ev = eq?.affixes.find((x) => x.id === a.id)?.value ?? 0;
            const d = a.value - ev;
            return (
              <p key={i} className="flex justify-between gap-2">
                <span>{formatAffix(a)}</span>
                {eq && d !== 0 && (
                  <span className={d > 0 ? "text-emerald-400" : "text-blood"}>
                    {d > 0 ? "↑" : "↓"}
                  </span>
                )}
              </p>
            );
          })}
        </div>
      )}
      {item.legendaryId && (
        <p className="mt-2 text-legend">{LEGENDARIES.find((l) => l.id === item.legendaryId)?.desc}</p>
      )}
      {item.reqLevel > 1 && <p className="mt-1 text-muted">Required level {item.reqLevel}</p>}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center bg-void/70 p-3 pt-14 pb-40 sm:items-center sm:pb-36">
      <div className="menu-sheet max-h-[min(82dvh,720px)] w-full max-w-3xl overflow-y-auto rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-display text-xl tracking-wide text-gold-hi">{title}</h3>
          <button type="button" className="text-sm text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Stick({ onStick }: { onStick: (x: number, y: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const apply = (e: PE<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    const m = Math.hypot(x, y) || 1;
    const s = Math.min(1, m);
    const nx = (x / m) * s;
    const ny = (y / m) * s;
    setKnob({ x: nx, y: ny });
    onStick(nx, ny);
  };
  const clear = () => {
    setKnob({ x: 0, y: 0 });
    onStick(0, 0);
  };
  return (
    <div
      ref={ref}
      className="stick-well absolute bottom-5 left-4 z-20 size-32 touch-none sm:bottom-7 sm:left-6"
      onPointerDown={(e) => {
        (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
        apply(e);
      }}
      onPointerMove={(e) => e.buttons && apply(e)}
      onPointerUp={clear}
      onPointerCancel={clear}
    >
      <span className="stick-knob" style={{ transform: `translate(${knob.x * 36}px, ${knob.y * 36}px)` }} />
    </div>
  );
}
