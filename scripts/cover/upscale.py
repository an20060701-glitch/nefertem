"""Upscale An's cover reference (1586×992) to 2× for sharp large and high-DPI screens.
Run once, from the repo root; the result is committed as scripts/cover/reference@2x.webp
and clean.py works from it:

    pip install spandrel opencv-python-headless pillow numpy   # pulls in torch
    curl -L -o /tmp/anime6B.pth \
      https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth
    python3 scripts/cover/upscale.py /tmp/anime6B.pth

Real-ESRGAN (anime model) restores line art and edges; on its own it flattens the
watercolour grain and shifts colour slightly, so the output keeps the original's
colour and paper texture (low frequencies and grain from a plain bicubic upscale)
and takes only the sharper edges from the model.
"""

import sys
from pathlib import Path

import cv2
import numpy as np
import torch
from PIL import Image
from spandrel import ModelLoader

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "scripts/cover/reference.webp"
OUT = ROOT / "scripts/cover/reference@2x.webp"
TILE, PAD = 192, 16


def model_upscale(model, img):
    """Run the model tile by tile so CPU memory stays small."""
    h, w, _ = img.shape
    s = model.scale
    out = np.zeros((h * s, w * s, 3), np.float32)
    x = torch.from_numpy(img).permute(2, 0, 1)[None]
    with torch.inference_mode():
        for y0 in range(0, h, TILE):
            for x0 in range(0, w, TILE):
                ya, yb = max(y0 - PAD, 0), min(y0 + TILE + PAD, h)
                xa, xb = max(x0 - PAD, 0), min(x0 + TILE + PAD, w)
                o = model(x[:, :, ya:yb, xa:xb])[0].permute(1, 2, 0).clamp(0, 1).numpy()
                ty, tx = (y0 - ya) * s, (x0 - xa) * s
                th, tw = (min(y0 + TILE, h) - y0) * s, (min(x0 + TILE, w) - x0) * s
                out[y0 * s : y0 * s + th, x0 * s : x0 * s + tw] = o[ty : ty + th, tx : tx + tw]
    return out


def main():
    model = ModelLoader().load_from_file(sys.argv[1]).eval()
    src = Image.open(SRC).convert("RGB")
    w, h = src.size[0] * 2, src.size[1] * 2
    sr = model_upscale(model, np.asarray(src, np.float32) / 255)
    sr = np.asarray(Image.fromarray((sr * 255 + 0.5).astype(np.uint8)).resize((w, h), Image.LANCZOS), np.float32)
    bic = np.asarray(src.resize((w, h), Image.BICUBIC), np.float32)

    def blur(a):
        return cv2.GaussianBlur(a, (0, 0), 2.0)

    out = blur(bic) + 0.85 * (sr - blur(sr)) + 0.55 * (bic - blur(bic))
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT, quality=94, method=6)
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
