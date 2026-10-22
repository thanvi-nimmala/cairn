#!/usr/bin/env bash
# Stills straight from the running prototype, so there is one implementation
# of each screen instead of a canvas mockup drifting alongside it.
#   npm run dev   (in another shell)   then   ./capture.sh
set -euo pipefail
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="${BASE:-http://localhost:5183/keystone/}"
OUT="${OUT:-shots}"
SCENES=(welcome calibrate faceid home activity security profile cards txn)

mkdir -p "$OUT"
for s in "${SCENES[@]}"; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=2 --window-size=390,844 --virtual-time-budget=9000 \
    --screenshot="$OUT/$s.png" "$BASE?shot=$s" 2>/dev/null
  printf '  %-10s %s\n' "$s" "$(du -h "$OUT/$s.png" | cut -f1)"
done
echo "→ $(ls "$OUT" | wc -l | tr -d ' ') screens in $OUT/ at 780×1688"
