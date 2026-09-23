# Image watcher

The watcher converts source PNGs into JPGs for the guide as you add them to the image folder.

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

## Checking which images need text

Every change is recorded in `tools/processed-log.md`, newest first:

- NEW means no JPG existed before, so the image likely needs a caption and narrative in the MDX.
- UPDATED means an existing image was refreshed, so it is probably a visual-only change (but check the caption still matches).

Use the log when editing the guide to identify images that need a caption or an explanation.

Stop the watcher with Ctrl-C.
