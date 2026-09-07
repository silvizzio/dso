#!/usr/bin/env python3
"""
tools/watch_images.py

Watches raw-images/ and runs the existing image pipeline (tools/name_images.py)
whenever a PNG is added or changed, so processed JPGs land in
private/images/docs/ automatically. Leaves only the MDX content to write by hand.

Each run records what was NEW (no JPG existed before, likely needs a caption and
narrative) versus UPDATED (JPG already existed, likely a visual-only refresh) to a
running log at tools/processed-log.md, newest batch at the top.

Usage:
    pip install watchdog        # one time
    python3 tools/watch_images.py

Stop with Ctrl-C.
"""
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RAW = REPO / "raw-images"
DOCS = REPO / "private" / "images" / "docs"
PIPELINE = REPO / "tools" / "name_images.py"
LOG = REPO / "tools" / "processed-log.md"
DEBOUNCE_SECONDS = 1.0


def snapshot_jpgs():
    """Map of existing output jpg name -> mtime, before a pipeline run."""
    if not DOCS.exists():
        return {}
    return {p.name: p.stat().st_mtime for p in DOCS.glob("*.jpg")}


def run_pipeline():
    """Run the existing name_images.py exactly as you would by hand."""
    return subprocess.run(
        [sys.executable, str(PIPELINE)],
        cwd=str(REPO),
        capture_output=True,
        text=True,
    )


def classify(before):
    """Compare the docs folder against the pre-run snapshot.

    Returns (new, updated): lists of jpg filenames that were newly created or
    had their content rewritten during the run.
    """
    after = snapshot_jpgs()
    new, updated = [], []
    for name, mtime in after.items():
        if name not in before:
            new.append(name)
        elif mtime > before[name]:
            updated.append(name)
    return sorted(new), sorted(updated)


def write_log(new, updated):
    """Prepend a dated block to the running log. Silent if nothing changed."""
    if not new and not updated:
        return
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [f"## {stamp}", ""]
    for name in new:
        lines.append(f"- NEW: `{name}` (needs caption/narrative)")
    for name in updated:
        lines.append(f"- UPDATED: `{name}` (visual refresh, check captions)")
    lines.append("")
    block = "\n".join(lines) + "\n"

    header = "# Processed images log\n\nNewest first. NEW means a caption and narrative are likely needed; UPDATED means an existing image was refreshed.\n\n"
    if LOG.exists():
        existing = LOG.read_text()
        body = existing[len(header):] if existing.startswith(header) else existing
        LOG.write_text(header + block + body)
    else:
        LOG.write_text(header + block)


def process_once():
    before = snapshot_jpgs()
    result = run_pipeline()
    if result.returncode != 0:
        print("  pipeline error:")
        print(result.stderr.strip() or result.stdout.strip())
        return
    new, updated = classify(before)
    if not new and not updated:
        return
    for name in new:
        print(f"  NEW      {name}")
    for name in updated:
        print(f"  UPDATED  {name}")
    write_log(new, updated)
    print(f"  logged to {LOG.relative_to(REPO)}")


def main():
    try:
        from watchdog.observers import Observer
        from watchdog.events import FileSystemEventHandler
    except ImportError:
        sys.exit("watchdog is not installed. Run:  pip install watchdog")

    if not PIPELINE.exists():
        sys.exit(f"pipeline not found at {PIPELINE}")
    RAW.mkdir(parents=True, exist_ok=True)

    state = {"pending": False, "last": 0.0}

    class Handler(FileSystemEventHandler):
        def on_any_event(self, event):
            if event.is_directory:
                return
            if not str(event.src_path).lower().endswith(".png"):
                return
            state["pending"] = True
            state["last"] = time.time()

    print(f"Watching {RAW.relative_to(REPO)} for new or changed PNGs.")
    print("Drop images in; processed JPGs and the log update automatically.")
    print("Ctrl-C to stop.\n")

    process_once()

    observer = Observer()
    observer.schedule(Handler(), str(RAW), recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(0.25)
            if state["pending"] and (time.time() - state["last"]) >= DEBOUNCE_SECONDS:
                state["pending"] = False
                process_once()
    except KeyboardInterrupt:
        print("\nStopped.")
        observer.stop()
    observer.join()


if __name__ == "__main__":
    main()
