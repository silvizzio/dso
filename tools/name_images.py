#!/usr/bin/env python3
"""Compress and rename screenshots dropped in raw-images/ into private/images/docs/.

DSO naming: "LOD <n> - <State> - <Topic>.png" becomes
"<chapter>-<state>-lod<n>-<topic-slug>.jpg". The state (Now, Past, Future) sets
the chapter. LOD 1 and LOD 2 screens go to the Interface chapter. A screen whose
last part is "Form" goes to the Enquiry chapter.

  "LOD 3 - Now - Leased.png"                   -> "03-now-lod3-leased.jpg"
  "LOD 3 - Future - District IO - 1A - Form.png" -> "06-future-lod3-district-io-1a-form.jpg"
  "LOD 2 - DSO 1.png"                          -> "02-lod2-dso-1.jpg"

Run from the repo root:  python3 tools/name_images.py
Re-running is safe: a file is skipped when its output already exists and is
newer than the source, so only new or changed images are processed.
"""
from pathlib import Path
import re, sys
from PIL import Image

STATE_CH = {"now": "03", "past": "04", "future": "05"}
LOD_ONLY_CH = "02"
FORM_CH = "06"
SRC = Path("raw-images")
DST = Path("private/images/docs")
MAX_EDGE = 1920
QUALITY = 65


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def out_name(stem):
    parts = [p.strip() for p in stem.split(" - ")]
    m = re.match(r"lod\s*([0-9]+)", parts[0], re.I)
    if not m:
        return None
    lod = m.group(1)
    rest = parts[1:]
    state = rest[0].lower() if rest and rest[0].lower() in STATE_CH else ""
    topic = rest[1:] if state else rest
    if topic and topic[-1].lower() == "form":
        ch = FORM_CH
    elif state:
        ch = STATE_CH[state]
    else:
        ch = LOD_ONLY_CH
    seg = [ch] + ([state] if state else []) + ["lod" + lod]
    s = slug("-".join(topic))
    if s:
        seg.append(s)
    return "-".join(seg) + ".jpg"


def main():
    if not SRC.exists():
        print("No raw-images/ folder found. Run this from the repo root.")
        return 1
    DST.mkdir(parents=True, exist_ok=True)
    made = skipped = unknown = 0
    for src in sorted(SRC.glob("*.png")):
        name = out_name(src.stem)
        if not name:
            print("skip (name does not start with LOD n):", src.name)
            unknown += 1
            continue
        dst = DST / name
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
