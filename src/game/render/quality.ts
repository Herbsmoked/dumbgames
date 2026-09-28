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

export type GraphicsTier = "auto" | "low" | "high" | "max";

/** Phone UA only — narrow preview iframes must NOT force low gfx. */
function isPhoneUa(): boolean {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  return /Mobi|Android|iPhone|iPad/i.test(ua);
}

function isNarrowUi(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 820;
}

/** Absolute ceiling — used when settings.graphics === "max". */
export function maxQuality(): Quality {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return {
    low: false,
    mobile: isPhoneUa() || isNarrowUi(),
    dpr: Math.min(Math.max(dpr, 1.5), 2.5),
    shadows: true,
    shadowMap: 4096,
    bloom: true,
    grain: true,
    particles: 1.45,
    maxLights: 28,
    env: true,
  };
}

export function lowQuality(): Quality {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return {
    low: true,
    mobile: true,
    dpr: Math.min(1, dpr),
    shadows: true,
    shadowMap: 512,
    bloom: false,
    grain: false,
    particles: 0.42,
    maxLights: 5,
    env: false,
  };
}

export function highQuality(): Quality {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  return {
    low: false,
    mobile: isPhoneUa() || isNarrowUi(),
    dpr: Math.min(dpr, 2),
    shadows: true,
    shadowMap: 2048,
    bloom: true,
    grain: true,
    particles: 1.1,
    maxLights: 18,
    env: true,
  };
}

/**
 * Auto: phones / very weak CPUs get low; everything else gets high.
 * Viewport width alone never drops quality (preview iframes are narrow).
 */
export function detectQuality(tier: GraphicsTier = "max"): Quality {
  if (tier === "max") return maxQuality();
  if (tier === "low") return lowQuality();
  if (tier === "high") return highQuality();

  const phone = isPhoneUa();
  const cores = typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 8) : 8;
  if (phone || cores <= 2) return lowQuality();
  if (cores <= 4) {
    const q = highQuality();
    q.shadowMap = 1024;
    q.particles = 0.85;
    q.maxLights = 12;
    return q;
  }
  return highQuality();
}
