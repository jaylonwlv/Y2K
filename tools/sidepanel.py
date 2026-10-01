"""'sidepanel this': fit an iPhone screenshot into a 1080 x 1920 TikTok frame without cropping.

The screenshot keeps its full height; the side panels are a blurred, enlarged copy of it, as in
the app's Full screen export (src/components/home/tiktok-post.tsx).

    python3 tools/sidepanel.py <screenshot.png> [out.png]
"""
import sys

from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1920


def sidepanel(src: str, out: str) -> None:
    shot = Image.open(src).convert("RGB")
    # Backdrop: the screenshot scaled to cover the frame, blurred and slightly brightened.
    cover = max(W / shot.width, H / shot.height) * 1.2
    bg = shot.resize((round(shot.width * cover), round(shot.height * cover)), Image.LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width + W) // 2, (bg.height + H) // 2))
    bg = bg.filter(ImageFilter.GaussianBlur(40))
    bg = Image.blend(bg, Image.new("RGB", (W, H), "white"), 0.1)

    # The screenshot itself, full height, centred, with a soft shadow.
    scale = min(H / shot.height, W / shot.width)
    fg = shot.resize((round(shot.width * scale), round(shot.height * scale)), Image.LANCZOS)
    x, y = (W - fg.width) // 2, (H - fg.height) // 2
    shadow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(shadow).rectangle((x, y, x + fg.width, y + fg.height), fill=110)
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    bg.paste(Image.new("RGB", (W, H), (20, 20, 60)), (0, 0), shadow)
    bg.paste(fg, (x, y))
    bg.save(out, quality=95)


if __name__ == "__main__":
    src = sys.argv[1]
    sidepanel(src, sys.argv[2] if len(sys.argv) > 2 else src.rsplit(".", 1)[0] + "-tiktok.png")
