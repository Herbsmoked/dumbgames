/** Fine pointer + hover + wide viewport → desktop WASD/mouse scheme.
 *  Headless / automation often reports neither fine nor hover; a wide
 *  non-coarse viewport is treated as PC so the desktop HUD is what QA sees.
 */
export function isPc(): boolean {
  if (typeof window === "undefined") return true;
  if (window.innerWidth < 900) return false;
  const fine = window.matchMedia?.("(pointer: fine)")?.matches ?? false;
  const hover = window.matchMedia?.("(hover: hover)")?.matches ?? false;
  const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  if (fine || hover) return true;
  if (coarse) return false;
  return true;
}

/** Recompute on resize / pointer-capability change. */
export function subscribePc(cb: (pc: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const fire = () => cb(isPc());
  window.addEventListener("resize", fire);
  const mqFine = window.matchMedia?.("(pointer: fine)");
  const mqHover = window.matchMedia?.("(hover: hover)");
  const mqCoarse = window.matchMedia?.("(pointer: coarse)");
  mqFine?.addEventListener?.("change", fire);
  mqHover?.addEventListener?.("change", fire);
  mqCoarse?.addEventListener?.("change", fire);
  fire();
  return () => {
    window.removeEventListener("resize", fire);
    mqFine?.removeEventListener?.("change", fire);
    mqHover?.removeEventListener?.("change", fire);
    mqCoarse?.removeEventListener?.("change", fire);
  };
}
