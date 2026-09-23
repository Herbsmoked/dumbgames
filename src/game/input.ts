import { isPc } from "./platform";

export type Actions = {
  moveX: number;
  moveY: number;
  pointerNdcX: number;
  pointerNdcY: number;
  pointerDown: boolean;
  pointerJust: boolean;
  rightDown: boolean;
  rightJust: boolean;
  primary: boolean;
  primaryJust: boolean;
  primaryReleased: boolean;
  skills: boolean[];
  skillJust: boolean[];
  skillReleased: boolean[];
  ultimate: boolean;
  ultimateJust: boolean;
  potion: boolean;
  potionJust: boolean;
  interact: boolean;
  interactJust: boolean;
  forceMove: boolean;
  inv: boolean;
  invJust: boolean;
  pause: boolean;
  pauseJust: boolean;
};

const SKILL_CODES = ["Digit1", "Digit2", "Digit3", "Digit4"];
const SKILL_KEYS = ["1", "2", "3", "4"];

function radial(x: number, y: number, dz = 0.18) {
  const m = Math.hypot(x, y);
  if (m < dz) return { x: 0, y: 0 };
  const s = ((m - dz) / (1 - dz)) / m;
  return { x: x * s, y: y * s };
}

export class Input {
  keys = new Set<string>();
  forced = new Set<string>();
  pointer = { x: 0, y: 0, down: false, right: false, id: -1 };
  leftStick = { x: 0, y: 0 };
  hudPrimary = false;
  hudSkills = [false, false, false, false];
  hudUlt = false;
  hudPotion = false;
  prev: Actions;
  actions: Actions;
  canvas: HTMLElement;
  private unbind: (() => void)[] = [];

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    this.prev = this.empty();
    this.actions = this.empty();
    const onDown = (e: KeyboardEvent) => {
      this.keys.add(e.code);
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
    };
    const onUp = (e: KeyboardEvent) => this.keys.delete(e.code);
    const clear = () => this.keys.clear();
    const pd = (e: PointerEvent) => {
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
    const pm = (e: PointerEvent) => this.updPtr(e);
    const pu = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 2) this.pointer.right = false;
      if (e.pointerId === this.pointer.id || (e.pointerType === "mouse" && e.button === 0)) this.pointer.down = false;
    };
    const noCtx = (e: Event) => e.preventDefault();
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
    this.unbind.push(
      () => window.removeEventListener("keydown", onDown),
      () => window.removeEventListener("keyup", onUp),
      () => window.removeEventListener("blur", clear),
      () => canvas.removeEventListener("pointerdown", pd),
      () => canvas.removeEventListener("contextmenu", noCtx),
      () => window.removeEventListener("pointermove", pm),
      () => window.removeEventListener("pointerup", pu),
      () => window.removeEventListener("pointercancel", pu),
    );
  }

  setVirtualStick(x: number, y: number) {
    this.leftStick = { x, y };
  }

  setHudPrimary(v: boolean) {
    this.hudPrimary = v;
  }
  setHudSkill(i: number, v: boolean) {
    this.hudSkills[i] = v;
  }
  setHudUlt(v: boolean) {
    this.hudUlt = v;
  }
  setHudPotion(v: boolean) {
    this.hudPotion = v;
  }

  setKeys(codes: string[]) {
    this.forced = new Set(codes);
  }

  dispose() {
    for (const u of this.unbind) u();
  }

  poll(): Actions {
    this.prev = this.actions;
    const has = (c: string) => this.keys.has(c) || this.forced.has(c);
    let mx = 0,
      my = 0;
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
    const pc = isPc();
    // PC: LMB / Space / HUD primary attack in place. Mobile: Space / HUD / gamepad only — world tap is dest.
    const primary =
      has("Space") ||
      this.hudPrimary ||
      !!gp?.buttons[1]?.pressed ||
      (pc && this.pointer.down && !this.pointer.right);
    const potion = has("KeyR") || this.hudPotion || !!gp?.buttons[3]?.pressed;
    const ultimate = has("KeyQ") || this.hudUlt || !!gp?.buttons[2]?.pressed;
    const interact = has("KeyE") || has("KeyG") || !!gp?.buttons[0]?.pressed;
    const forceMove = has("KeyF") || this.pointer.right;
    const inv = has("KeyI") || has("Tab") || has("KeyC") || has("KeyB");
    const pause = has("Escape") || has("KeyP");
    const a: Actions = {
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
      pauseJust: false,
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

  private updPtr(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    this.pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    this.pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  }

  private empty(): Actions {
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
      pauseJust: false,
    };
  }
}

export { SKILL_KEYS };
