export type Quality = {
  low: boolean;
  mobile: boolean;
  dpr: number;
  shadows: boolean;
  shadowMap: number;
  bloom: boolean;
  grain: boolean;
  particles: number;
  maxLights: number;
  env: boolean;
};

export function detectQuality(): Quality {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const mobile = /Mobi|Android|iPhone|iPad/i.test(ua) || (typeof window !== "undefined" && window.innerWidth < 820);
  const cores = typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 8) : 8;
  const low = mobile || cores <= 4;
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const mid = !low && (mobile || cores <= 6);
  return {
    low,
    mobile,
    dpr: low ? Math.min(1, dpr) : Math.min(dpr, 2),
    shadows: true,
    shadowMap: low ? 512 : mid ? 1024 : 2048,
    bloom: !low,
    grain: !low,
    particles: low ? 0.42 : 1,
    maxLights: low ? 5 : 14,
    env: !low,
  };
}
