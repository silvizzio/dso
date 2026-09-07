#!/usr/bin/env python3
"""Compress and rename screenshots dropped in raw-images/ into private/images/docs/.

Naming: "<Persona> - LOD <n> - <Topic>.png" becomes
"<chapter>-<persona>-lod<n>-<topic-slug>.jpg". For example
"ENV - LOD 3 - Monitoring Assets.png" -> "05-env-lod3-monitoring-assets.jpg".

Run from the repo root:  python3 tools/name_images.py
Re-running is safe: a file is skipped when its output already exists and is
newer than the source, so only new or changed images are processed.
"""
from pathlib import Path
import re, sys
from PIL import Image

CH = {"GXM": "03", "OPS": "04", "ENV": "05", "MO": "06"}
SRC = Path("raw-images")
DST = Path("private/images/docs")
MAX_EDGE = 1920
QUALITY = 65


def parse(stem):
    parts = [p.strip() for p in stem.split(" - ")]
    persona = parts[0].upper()
    lod = ""
    topic = []
    for p in parts[1:]:
        m = re.match(r"lod\s*([0-9]+)", p, re.I)
        if m and not lod:
            lod = m.group(1)
        else:
            topic.append(p)
    slug = re.sub(r"[^a-z0-9]+", "-", "-".join(topic).lower()).strip("-")
    return persona, lod, slug


def out_name(persona, lod, slug):
    seg = [CH[persona], persona.lower()]
    if lod:
        seg.append("lod" + lod)
    if slug:
        seg.append(slug)
    return "-".join(seg) + ".jpg"


def main():
    if not SRC.exists():
        print("No raw-images/ folder found. Run this from the repo root.")
        return 1
    DST.mkdir(parents=True, exist_ok=True)
    made = skipped = unknown = 0
    for src in sorted(SRC.glob("*.png")):
        persona, lod, slug = parse(src.stem)
        if persona not in CH:
            print("skip (unknown persona):", src.name)
            unknown += 1
            continue
        dst = DST / out_name(persona, lod, slug)
        if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            print("up to date:", dst.name)
            skipped += 1
            continue
        img = Image.open(src).convert("RGB")
        img.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        img.save(dst, "JPEG", quality=QUALITY, optimize=True)
        print(f"{src.name}  ->  {dst.name}  ({dst.stat().st_size // 1024} KB)")
        made += 1
    print(f"\ndone: {made} written, {skipped} up to date, {unknown} skipped")
    return 0


if __name__ == "__main__":
    sys.exit(main())
