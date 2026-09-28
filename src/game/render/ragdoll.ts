import * as THREE from "three";

/** One articulated part driven by a lightweight death sim (no physics engine). */
type Limb = {
  obj: THREE.Object3D;
  /** Rest local euler captured at ragdoll start. */
  rest: THREE.Euler;
  wx: number;
  wy: number;
  wz: number;
  /** Soft target tip angles so bodies settle into a readable collapse. */
  targetX: number;
  targetZ: number;
};

/**
 * Shared procedural ragdoll for town + rifts.
 * Drives Figure.parts (and root tip) with angular impulses + damping.
 * Same code path for hero, NPCs, and monsters — no area-specific death clips.
 */
export class FigureRagdoll {
  active = false;
  private limbs: Limb[] = [];
  private rootWx = 0;
  private rootWz = 0;
  private settleT = 0;
  private intense = false;

  /** Kick the articulated body; call once when an actor dies. */
  start(
    parts: Record<string, THREE.Object3D>,
    root: THREE.Object3D,
    impulseX: number,
    impulseZ: number,
    intense = false,
  ) {
    this.active = true;
    this.intense = intense;
    this.settleT = 0;
    this.limbs = [];

    const mag = Math.hypot(impulseX, impulseZ) || 1;
    const ix = impulseX / mag;
    const iz = impulseZ / mag;
    const power = intense ? 1.55 : 1.05;

    // Tip the whole body in the hit direction.
    this.rootWx = iz * 3.8 * power + (Math.random() - 0.5) * 0.6;
    this.rootWz = -ix * 3.8 * power + (Math.random() - 0.5) * 0.6;
    root.rotation.x = 0;
    root.rotation.z = 0;

    const keys = [
      "head",
      "torso",
      "lArm",
      "rArm",
      "lThigh",
      "rThigh",
      "lShin",
      "rShin",
      "weapon",
      "cloak",
      "lWing",
      "rWing",
    ] as const;

    for (const key of keys) {
      const obj = parts[key];
      if (!obj) continue;
      const rest = obj.rotation.clone();
      const side = key.startsWith("l") ? -1 : key.startsWith("r") ? 1 : 0;
      const limp = 0.7 + Math.random() * 0.9;
      this.limbs.push({
        obj,
        rest,
        wx: (Math.random() - 0.5) * 6 * power * limp + iz * 1.2 * side,
        wy: (Math.random() - 0.5) * 3 * power,
        wz: (Math.random() - 0.5) * 5 * power * limp - ix * 1.2 * side,
        targetX: rest.x + (key.includes("Thigh") || key.includes("Shin") ? 0.85 + Math.random() * 0.55 : key === "head" ? 0.35 : 0.55) * (side || 1) * (Math.random() > 0.5 ? 1 : -0.4),
        targetZ: rest.z + side * (0.4 + Math.random() * 0.5) * power,
      });
    }
  }

  /** Advance sim; returns sinkY contribution. */
  update(root: THREE.Object3D, dt: number, deadT: number): number {
    if (!this.active) return 0;
    this.settleT += dt;
    const damp = Math.exp(-dt * (this.intense ? 2.4 : 3.1));

    // Root tip toward prone.
    this.rootWx *= damp;
    this.rootWz *= damp;
    root.rotation.x += this.rootWx * dt;
    root.rotation.z += this.rootWz * dt;
    // Soft pull to a stable face-down-ish pose so packs don't end in wild spins.
    const tipX = THREE.MathUtils.clamp(1.15 + (this.intense ? 0.2 : 0), 0.9, 1.45);
    root.rotation.x += (tipX - root.rotation.x) * Math.min(1, dt * 2.2);
    root.rotation.z += (0 - root.rotation.z) * Math.min(1, dt * 1.6);
    root.rotation.x = THREE.MathUtils.clamp(root.rotation.x, -0.2, 1.55);
    root.rotation.z = THREE.MathUtils.clamp(root.rotation.z, -0.85, 0.85);

    for (const limb of this.limbs) {
      limb.wx *= damp;
      limb.wy *= damp;
      limb.wz *= damp;
      limb.obj.rotation.x += limb.wx * dt;
      limb.obj.rotation.y += limb.wy * dt;
      limb.obj.rotation.z += limb.wz * dt;
      // Ease toward a collapsed pose after the initial fling.
      if (this.settleT > 0.18) {
        const k = Math.min(1, dt * 3.2);
        limb.obj.rotation.x += (limb.targetX - limb.obj.rotation.x) * k;
        limb.obj.rotation.z += (limb.targetZ - limb.obj.rotation.z) * k;
      }
    }

    // Sink into the floor as the body settles (matches prior dissolve timing).
    const k = Math.min(1, deadT / 0.55);
    return -k * 0.22;
  }

  /** Restore limb rest poses so a revive / town return looks alive. */
  reset(parts: Record<string, THREE.Object3D>, root: THREE.Object3D) {
    for (const limb of this.limbs) {
      limb.obj.rotation.copy(limb.rest);
    }
    // If we lost rest captures (cold revive), zero known parts.
    if (this.limbs.length === 0) {
      for (const key of Object.keys(parts)) {
        const o = parts[key];
        if (!o) continue;
        if (key === "shadow") continue;
        o.rotation.set(0, 0, 0);
      }
    }
    this.limbs = [];
    this.active = false;
    this.rootWx = 0;
    this.rootWz = 0;
    this.settleT = 0;
    root.rotation.x = 0;
    root.rotation.z = 0;
  }
}
