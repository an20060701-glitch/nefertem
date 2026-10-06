"""Make the cover figure: the key visual with its white paper made transparent and
its outer edge dissolved into an irregular watercolour edge, so it sits in the wash
with no rectangle, white outline or hard line. Run from the repo root:

    python3 scripts/watercolor/figure.py

Reads public/images/nefertem-key-visual.png, writes public/images/nefertem-key-visual-watercolor.webp.
Needs Pillow and numpy.

Colour-to-alpha with a steep ramp: anything clearly inked (skin, hair, gold, blue)
stays fully opaque and keeps its exact colour; only paper-white and the palest
washes turn see-through, so the background shows through the paper, not the figure.
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "public/images/nefertem-key-visual.png"
OUT = ROOT / "public/images/nefertem-key-visual-watercolor.webp"

# Distance from white below which a pixel is paper, and how fast ink turns opaque.
PAPER = 0.02
GAIN = 4.0


def smooth_noise(h, w, cells, rng):
    """Low-frequency value noise in 0..1: a coarse random grid upscaled bicubically."""
    gh, gw = max(2, round(cells * h / w)), cells
    grid = Image.fromarray((rng.random((gh, gw)) * 255).astype(np.uint8))
    return np.asarray(grid.resize((w, h), Image.BICUBIC), dtype=np.float32) / 255


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def edge_mask(h, w, seed=11):
    """Where the figure is allowed to show: soft at the left, top and bottom, with a
    ragged watercolour edge (blooms plus a little dry-brush grain) rather than a line."""
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    x /= w
    y /= h
    # The shape: open on the right where the figure meets the screen edge.
    base = np.minimum.reduce([
        smoothstep(0.0, 0.08, x),
        smoothstep(0.0, 0.04, y),
        1 - smoothstep(0.84, 1.0, y),
        1 - smoothstep(0.97, 1.0, x),
    ])
    # Blooms at three scales and fine grain for the dry edge.
    n = (
        0.5 * smooth_noise(h, w, 6, rng)
        + 0.3 * smooth_noise(h, w, 14, rng)
        + 0.2 * smooth_noise(h, w, 40, rng)
    )
    grain = rng.random((h, w)).astype(np.float32)
    m = base + (n - 0.5) * 0.55 + (grain - 0.5) * 0.08
    return smoothstep(0.32, 0.62, m)


def main():
    im = np.asarray(Image.open(SRC).convert("RGB"), dtype=np.float32) / 255
    h, w, _ = im.shape
    d = (1 - im).max(axis=2)
    a = np.clip((d - PAPER) * GAIN, 0, 1)
    safe = np.maximum(a, 1e-4)[..., None]
    # Unblend from white so (colour over white) == the original pixel.
    rgb = np.clip(1 - (1 - im) / safe, 0, 1)
    a = a * edge_mask(h, w)
    out = np.dstack([rgb, a])
    Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA").save(OUT, quality=88, method=6)
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
