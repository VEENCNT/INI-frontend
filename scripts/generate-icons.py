"""Генерирует PNG-иконки приложения для PWA (требуется Pillow).

Запуск: python scripts/generate-icons.py
Иконки кладутся в public/icons; повторный запуск нужен только при смене дизайна.
"""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"
PURPLE = "#533293"
WHITE = "#ffffff"


def draw_icon(size: int, rounded: bool, maskable: bool = False) -> Image.Image:
    scale = 4
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if rounded:
        draw.rounded_rectangle([0, 0, s, s], radius=int(s * 0.22), fill=PURPLE)
    else:
        draw.rectangle([0, 0, s, s], fill=PURPLE)

    # сердце: две окружности + треугольник
    k = 0.8 if maskable else 1.0
    cx = s / 2
    cy = s / 2 + s * 0.03
    r = s * 0.15 * k
    left = (cx - s * 0.11 * k, cy - s * 0.08 * k)
    right = (cx + s * 0.11 * k, cy - s * 0.08 * k)
    draw.ellipse([left[0] - r, left[1] - r, left[0] + r, left[1] + r], fill=WHITE)
    draw.ellipse([right[0] - r, right[1] - r, right[0] + r, right[1] + r], fill=WHITE)
    draw.polygon(
        [
            (cx - s * 0.27 * k, cy - s * 0.03 * k),
            (cx, cy + s * 0.29 * k),
            (cx + s * 0.27 * k, cy - s * 0.03 * k),
            (cx, cy + s * 0.02 * k),
        ],
        fill=WHITE,
    )
    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    draw_icon(192, rounded=True).save(OUT / "icon-192.png")
    draw_icon(512, rounded=True).save(OUT / "icon-512.png")
    draw_icon(512, rounded=False, maskable=True).save(OUT / "maskable-512.png")
    draw_icon(180, rounded=True).save(OUT / "apple-touch-icon.png")
    print("Icons written to", OUT)


if __name__ == "__main__":
    main()
