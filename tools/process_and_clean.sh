#!/usr/bin/env bash
# Process raw PNGs -> JPGs, commit, empty raw-images, then push.
# Empty-before-push so the pre-push hook (which blocks on non-empty raw-images) passes.
# Usage: tools/process_and_clean.sh "commit message"
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

MSG="${1:-Update processed simulation images}"

echo "== processing raws =="
python3 tools/name_images.py

echo "== staging processed JPGs =="
git add private/images/docs/

echo "== staging any doc changes you already made =="
git add content/docs/ 2>/dev/null || true

git --no-pager status --short
if git diff --cached --quiet; then
  echo "nothing to commit"
else
  git commit -m "$MSG"
  echo "== emptying local raw-images (before push, so pre-push hook passes) =="
  find raw-images/ -type f ! -name '.gitkeep' -delete
  echo "== pushing =="
  git push
  echo "done. committed, raw-images cleared, pushed."
fi
