#!/usr/bin/env python3
"""
Restructure the four simulation domain chapters from
  domain -> persona (##) -> sim (###)
to
  domain -> sim (##) -> persona (###)

Source of truth for which sim sits in which domain per persona is the RSG
Simulation tool (sim.rsg), oil spill removed. Prose and images are preserved
verbatim from the current chapters; only grouping and headings change. A short
neutral one-line intro is added under each sim (##) heading.

Run from repo root:  python3 tools/restructure_sim_chapters.py
"""
import re, sys, pathlib

DOCS = pathlib.Path("content/docs")
CHAPTERS = {
    "people": "08-simulation-people.mdx",
    "traffic": "09-simulation-traffic.mdx",
    "transport": "10-simulation-transport.mdx",
    "environment": "11-simulation-environment.mdx",
}

PERSONA_H2 = {
    "Guest Experience Manager": "GXM",
    "Operations Manager": "OPS",
    "Environment Manager": "ENV",
    "Marine Operations Manager": "MO",
}
PERSONA_LABEL = {v: k for k, v in PERSONA_H2.items()}
PERSONA_ORDER = ["GXM", "OPS", "ENV", "MO"]

# Tool-faithful domain -> sim order -> personas (nav order from sim.rsg, oil removed)
STRUCTURE = {
    "people": [
        ("Crowd", ["GXM", "OPS"]),
        ("Evacuation", ["GXM", "OPS"]),
        ("Outdoor thermal comfort", ["GXM", "ENV"]),
        ("Accessibility", ["GXM"]),
    ],
    "traffic": [
        ("Mobility", ["GXM", "OPS"]),
        ("Energy", ["OPS", "ENV"]),
        ("Shuttle network", ["GXM", "OPS"]),
        ("Drop-off forecourt", ["GXM", "OPS"]),
        ("Wave", ["MO"]),
        ("Ocean current", ["MO"]),
    ],
    "transport": [
        ("Wind", ["GXM"]),
        ("Emissions and noise", ["GXM", "ENV"]),
        ("Safety conflicts", ["GXM", "OPS"]),
        ("Flood and storm surge", ["OPS", "ENV", "MO"]),
    ],
    "environment": [
        ("Wind", ["OPS", "MO"]),
        ("Water quality", ["ENV", "MO"]),
        ("Ocean current", ["ENV"]),
        ("Wave", ["ENV"]),
        ("Coral reef", ["ENV", "MO"]),
    ],
}

# One-line neutral intro per sim (sim-focused, domain-neutral so it reads in any chapter)
SIM_INTRO = {
    "Crowd": "How people gather and how dense a space becomes under load, read by each persona that runs it.",
    "Evacuation": "How an occupied space clears under pressure, and where the flow stalls, read by each persona that runs it.",
    "Outdoor thermal comfort": "How felt heat sits across the ground as the sun moves, read by each persona that runs it.",
    "Accessibility": "How easily guests can reach the places they are headed for, read by each persona that runs it.",
    "Mobility": "How guest transfers hold up as demand rises against the fleet behind them, read by each persona that runs it.",
    "Energy": "How the island microgrid balances clean supply against demand, read by each persona that runs it.",
    "Shuttle network": "How the shuttle network carries load across its routes, read by each persona that runs it.",
    "Drop-off forecourt": "How the arrival forecourt holds up as vehicles bunch at the kerb, read by each persona that runs it.",
    "Wave": "How offshore swell carries energy to the shore and the routes, read by each persona that runs it.",
    "Ocean current": "How flow builds through the channels and the basin, read by each persona that runs it.",
    "Wind": "How wind moves across the resort and the water, read by each persona that runs it.",
    "Emissions and noise": "How emissions and noise carry across the site from their sources, read by each persona that runs it.",
    "Safety conflicts": "Where pedestrian and vehicle movements cross and clash, read by each persona that runs it.",
    "Flood and storm surge": "How storm, tide, and rainfall drive water onto the land and the marina, read by each persona that runs it.",
    "Water quality": "How the water holds its clarity and condition under load, read by each persona that runs it.",
    "Coral reef": "How heat stress builds on the reef against the bleaching scale, read by each persona that runs it.",
}

BLOCK_RE = re.compile(
    r"^### (?P<sim>.+?)\n\n(?P<prose>.*?)\n\n(?P<img>!\[.*?\]\(.*?\))\s*?(?=\n#|\n<Callout|\Z)",
    re.S | re.M,
)


def parse_chapter(path):
    """Return {(persona_code, sim_name): (prose, image_md)} and the frontmatter+intro and any callout."""
    text = path.read_text(encoding="utf-8")
    # frontmatter + chapter intro = everything before the first "## "
    head = text.split("\n## ", 1)[0]
    # callout (people chapter) preserved
    callout = ""
    cm = re.search(r"(<Callout.*?</Callout>)", text, re.S)
    if cm:
        callout = cm.group(1)

    blocks = {}
    # iterate persona sections
    for pm in re.finditer(r"\n## (?P<persona>.+?)\n(?P<body>.*?)(?=\n## |\n<Callout|\Z)", text, re.S):
        persona_name = pm.group("persona").strip()
        code = PERSONA_H2.get(persona_name)
        if not code:
            continue
        body = pm.group("body")
        for bm in BLOCK_RE.finditer("### " + body.split("### ", 1)[1] if "### " in body else body):
            sim = bm.group("sim").strip()
            prose = bm.group("prose").strip()
            img = bm.group("img").strip()
            blocks[(code, sim)] = (prose, img)
    return head, callout, blocks


def main():
    if not DOCS.exists():
        print("ERROR: run from repo root (content/docs not found)")
        sys.exit(1)

    # gather all blocks from all four chapters into one pool
    pool = {}
    heads = {}
    callouts = {}
    for dom, fname in CHAPTERS.items():
        p = DOCS / fname
        if not p.exists():
            print(f"ERROR: missing {p}")
            sys.exit(1)
        head, callout, blocks = parse_chapter(p)
        heads[dom] = head
        callouts[dom] = callout
        pool.update(blocks)

    print(f"parsed {len(pool)} persona/sim blocks total\n")

    # rebuild each chapter
    for dom, fname in CHAPTERS.items():
        out = [heads[dom].rstrip(), ""]
        missing = []
        for sim, personas in STRUCTURE[dom]:
            out.append(f"## {sim}")
            out.append("")
            out.append(SIM_INTRO.get(sim, ""))
            out.append("")
            for code in PERSONA_ORDER:
                if code not in personas:
                    continue
                key = (code, sim)
                if key not in pool:
                    missing.append(key)
                    continue
                prose, img = pool[key]
                out.append(f"### {PERSONA_LABEL[code]}")
                out.append("")
                out.append(prose)
                out.append("")
                out.append(img)
                out.append("")
        if dom == "people" and callouts["people"]:
            out.append(callouts["people"])
            out.append("")
        text = "\n".join(out).rstrip() + "\n"
        (DOCS / fname).write_text(text, encoding="utf-8")
        status = f"wrote {fname}"
        if missing:
            status += f"  (MISSING blocks: {missing})"
        print(status)


if __name__ == "__main__":
    main()
