#!/usr/bin/env python3
"""Genera docs/screenshots/nav.gif a partir de los mockups SVG on-brand.
Demo animada (slide) que recorre las pantallas. No es un screen-recording real."""
import io
import os
import cairosvg
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, "screenshots")

PHONE_W, PHONE_H = 280, 580
MARGIN = 10
W, H = PHONE_W + MARGIN * 2, PHONE_H + MARGIN * 2  # 300 x 600
BACKDROP = (10, 10, 10)  # carbón

SCREENS = ["hoy", "entrenar", "progreso", "tu-claro"]
SLIDE_FRAMES = 10        # pasos por transición
SLIDE_MS = 45            # ms por paso de slide
HOLD_MS = 1100           # ms de pausa en cada pantalla


def load_phone(name):
    png = cairosvg.svg2png(
        url=os.path.join(SHOTS, f"{name}.svg"),
        output_width=PHONE_W, output_height=PHONE_H,
    )
    return Image.open(io.BytesIO(png)).convert("RGBA")


def composite(phone):
    canvas = Image.new("RGB", (W, H), BACKDROP)
    canvas.paste(phone, (MARGIN, MARGIN), phone)
    return canvas


def main():
    phones = [load_phone(n) for n in SCREENS]
    holds = [composite(p) for p in phones]

    frames, durations = [], []
    for i in range(len(phones)):
        a, b = phones[i], phones[(i + 1) % len(phones)]
        # pausa en la pantalla A
        frames.append(holds[i])
        durations.append(HOLD_MS)
        # tira A|B y ventana deslizante
        strip = Image.new("RGB", (W * 2, H), BACKDROP)
        strip.paste(a, (MARGIN, MARGIN), a)
        strip.paste(b, (W + MARGIN, MARGIN), b)
        for k in range(1, SLIDE_FRAMES):
            off = round(W * k / SLIDE_FRAMES)
            frames.append(strip.crop((off, 0, off + W, H)))
            durations.append(SLIDE_MS)

    out = os.path.join(SHOTS, "nav.gif")
    frames[0].save(
        out, save_all=True, append_images=frames[1:],
        duration=durations, loop=0, optimize=True, disposal=2,
    )
    print(f"{out}  ({len(frames)} frames, {os.path.getsize(out)//1024} KB)")


if __name__ == "__main__":
    main()
