#!/usr/bin/env python3
"""Aggressive magenta key, despill, shared-scale crop, compact sheets."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path("/workspace/public/game")


def key_arr(arr: np.ndarray) -> np.ndarray:
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    a = arr[:, :, 3].astype(np.int16)
    mag = (
        (r > 95)
        & (b > 95)
        & (g < 155)
        & (np.abs(r - b) < 85)
        & (((r + b) / 2 - g) > 28)
    )
    mag |= (r > 170) & (b > 130) & (g < 70)
    mag |= (r > 210) & (b > 90) & (g < 40)  # hot fuchsia jpeg
    out = arr.copy()
    out[mag, 3] = 0
    # despill leftover pink on the silhouette edge
    edge = (~mag) & (r > g + 25) & (b > g + 15) & (r > 90) & (b > 70) & (g < 140)
    if edge.any():
        spill = np.minimum(r[edge] - g[edge], b[edge] - g[edge]).astype(np.float32)
        k = np.clip(spill / 90.0, 0, 0.85)
        out[edge, 0] = np.clip(r[edge] - (r[edge] - g[edge]) * k, 0, 255)
        out[edge, 2] = np.clip(b[edge] - (b[edge] - g[edge]) * k, 0, 255)
        out[edge, 3] = np.clip(a[edge] * (1 - k * 0.35), 0, 255)
    # kill rgb on transparent so bilinear sampling does not bleed magenta
    trans = out[:, :, 3] < 16
    out[trans, 0:3] = 0
    out[trans, 3] = 0
    return out


def bbox(alpha: np.ndarray, thr: int = 18):
    ys, xs = np.where(alpha > thr)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def process_sheet(src: Path, dst: Path, rows: int, cols: int, cell: int = 256) -> None:
    im = Image.open(src).convert("RGBA")
    arr = key_arr(np.array(im))
    h, w = arr.shape[:2]
    ch, cw = h // rows, w // cols
    frames: list[np.ndarray] = []
    boxes = []
    for r in range(rows):
        for c in range(cols):
            cell_a = arr[r * ch : (r + 1) * ch, c * cw : (c + 1) * cw]
            b = bbox(cell_a[:, :, 3])
            frames.append(cell_a)
            boxes.append(b)
    valid = [b for b in boxes if b]
    if not valid:
        Image.fromarray(arr).save(dst)
        print("empty", src)
        return
    max_w = max(b[2] - b[0] + 1 for b in valid)
    max_h = max(b[3] - b[1] + 1 for b in valid)
    pad = int(max(max_w, max_h) * 0.06) + 4
    tw, th = max_w + pad * 2, max_h + pad * 2
    # keep a portrait-ish cell, feet at bottom
    side = max(tw, th)
    out = Image.new("RGBA", (cols * cell, rows * cell), (0, 0, 0, 0))
    for i, fr in enumerate(frames):
        r, c = divmod(i, cols)
        r, c = r, c  # row-major
        rr, cc = i // cols, i % cols
        b = boxes[i]
        canvas = np.zeros((side, side, 4), dtype=np.uint8)
        if b:
            x0, y0, x1, y1 = b
            crop = fr[y0 : y1 + 1, x0 : x1 + 1]
            chh, cww = crop.shape[:2]
            x = (side - cww) // 2
            y = side - chh - 2  # feet
            y = max(0, y)
            canvas[y : y + chh, x : x + cww] = crop
        frame_im = Image.fromarray(canvas).resize((cell, cell), Image.Resampling.LANCZOS)
        out.paste(frame_im, (cc * cell, rr * cell))
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst)
    print(f"wrote {dst} {out.size} from {src.name} {rows}x{cols}")


def main() -> None:
    jobs = [
        ("sprites/barbarian-idle.png", 2, 2),
        ("sprites/barbarian-attack.png", 2, 2),
        ("sprites/wizard-idle.png", 2, 2),
        ("sprites/demonhunter-idle.png", 2, 2),
        ("sprites/monk-idle.png", 2, 2),
        ("sprites/necromancer-idle.png", 2, 2),
        ("sprites/crusader-idle.png", 2, 2),
        ("sprites/skeleton-idle.png", 2, 2),
        ("sprites/imp-idle.png", 2, 2),
        ("sprites/cultist-idle.png", 2, 2),
        ("sprites/brute-idle.png", 2, 2),
        ("sprites/boss-idle.png", 3, 3),
        ("fx/fx-slash.png", 2, 2),
        ("fx/fx-fire.png", 2, 2),
        ("fx/fx-holy.png", 2, 2),
        ("fx/fx-blood.png", 2, 2),
        ("props/prop-chest.png", 1, 1),
        ("props/prop-shrine.png", 1, 1),
        ("props/prop-portal.png", 1, 1),
    ]
    tmp = Path("/tmp/sprite-in")
    tmp.mkdir(exist_ok=True)
    for rel, rows, cols in jobs:
        src = OUT / "game" / rel if False else OUT / rel
        if not src.exists():
            print("missing", src)
            continue
        # process from a copy so we don't read our own output
        raw = tmp / src.name
        Image.open(src).save(raw)
        process_sheet(raw, src, rows, cols, cell=256 if rows < 3 else 192)


if __name__ == "__main__":
    main()
