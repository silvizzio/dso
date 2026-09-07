# Image watcher

Auto-processes raw PNGs into the private docs folder so the only thing left is writing content.

## One-time setup

```
pip install watchdog
```

## Daily use

Start it once and leave it running in a terminal tab:

```
python3 tools/watch_images.py
```

Drop PNGs into `raw-images/` as you work. Each one is converted to a JPG in `private/images/docs/` automatically, using the same `tools/name_images.py` pipeline you would run by hand.

## Knowing what needs content

Every change is recorded in `tools/processed-log.md`, newest first:

- NEW means no JPG existed before, so the image likely needs a caption and narrative in the MDX.
- UPDATED means an existing image was refreshed, so it is probably a visual-only change (but check the caption still matches).

Paste that log into a docs-writing session to see at a glance which images are still waiting on content.

Stop the watcher with Ctrl-C.
