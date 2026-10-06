"""Make the cover image from An's reference (scripts/cover/reference.webp, 2026-10-06):
paint out the text baked into it (logo, navigation, headline block) so the site can set
that text live on top, crisp and selectable. The art, the wash and the speech bubble stay
exactly as An supplied them. Run from the repo root:

    python3 scripts/cover/clean.py

Needs numpy, Pillow and opencv-python-headless. Writes public/images/cover.webp.
"""

from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "scripts/cover/reference.webp"
OUT = ROOT / "public/images/cover.webp"

# Boxes (x0, y0, x1, y1) in the 1586×992 reference that hold baked-in text.
TEXT_BOXES = [
    (55, 15, 260, 85),  # logo + "A Life in Scent"
    (1035, 35, 1530, 72),  # navigation
    (55, 205, 480, 245),  # muse line
    (55, 280, 575, 395),  # wordmark
    (55, 410, 285, 515),  # "A Life in Scent" + gold rule
    (55, 540, 470, 605),  # Chinese slogan
    (55, 635, 500, 765),  # English lines
    (55, 815, 390, 845),  # CTA
]


def main():
    bgr = cv2.imread(str(SRC), cv2.IMREAD_COLOR)
    h, w = bgr.shape[:2]
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.int16)
    # Local paper/wash colour, ignoring thin strokes.
    bg = cv2.medianBlur(bgr, 41)
    bg_lab = cv2.cvtColor(bg, cv2.COLOR_BGR2LAB).astype(np.int16)
    diff = np.abs(lab - bg_lab)
    ink = (diff[..., 0] > 14) | (diff[..., 1] > 8) | (diff[..., 2] > 8)

    region = np.zeros((h, w), np.uint8)
    for x0, y0, x1, y1 in TEXT_BOXES:
        region[y0:y1, x0:x1] = 1
    mask = (ink & (region == 1)).astype(np.uint8) * 255
    mask = cv2.dilate(mask, np.ones((5, 5), np.uint8), iterations=2)

    out = cv2.inpaint(bgr, mask, 9, cv2.INPAINT_TELEA)
    cv2.imwrite(str(OUT), out, [cv2.IMWRITE_WEBP_QUALITY, 92])
    cv2.imwrite("/tmp/claude-0/cover-mask.png", mask)
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
