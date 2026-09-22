#!/usr/bin/env python3
"""Fast magenta chroma-key for Imagine JPEG sprite sheets."""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image


def chroma_key(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGBA")
    arr = np.array(im).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    mag = (
        (r > 130)
        & (b > 130)
        & (g < np.minimum(r, b) * 0.82)
        & ((r + b) > g * 2.05)
        & (np.maximum(r, b) - g > 40)
    )
    # JPEG fringe: near-magenta midtones
    fringe = (
        (r > 110)
        & (b > 110)
        & (g < 170)
        & (np.abs(r - b) < 55)
        & ((r + b) / 2 - g > 25)
    )
    alpha = np.where(mag, 0.0, np.where(fringe, 90.0, 255.0))
    arr[:, :, 3] = alpha
    arr[mag, 0:3] = 0
    Image.fromarray(arr.astype(np.uint8), "RGBA").save(dst)
    print(f"wrote {dst} ({dst.stat().st_size} bytes)")


def tile2x2(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGB")
    w, h = im.size
    out = Image.new("RGB", (w * 2, h * 2))
    for x in range(2):
        for y in range(2):
            out.paste(im, (x * w, y * h))
    out.save(dst, quality=90)
    print(f"seam check {dst}")


if __name__ == "__main__":
    if sys.argv[1] == "key":
        chroma_key(Path(sys.argv[2]), Path(sys.argv[3]))
    elif sys.argv[1] == "seam":
        tile2x2(Path(sys.argv[2]), Path(sys.argv[3]))
