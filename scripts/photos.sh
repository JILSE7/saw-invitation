#!/usr/bin/env bash
#
# Builds the delivery derivatives for the engagement photos.
#
# The sources are 1000x1500. The invitation column is capped at 500 CSS px,
# so 1000px wide is exactly 2x — every crop below stays at native resolution
# and nothing is ever upscaled. Widening the column past 500 breaks that.
#
# Each entry is cropped to a different aspect ratio on purpose: five portraits
# at the same 2:3 down one page reads as a contact sheet, not a design.
#
# Usage: scripts/photos.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/src/assets/source"
OUT="$ROOT/public/photos"
BASE_W=1000

# name<TAB>source<TAB>ratio<TAB>gravity
MANIFEST=$(cat <<'EOF'
ring	saw-1	4:5	center
water	saw-3	3:2	center
bench	saw-5	16:9	center
walking	saw-4	4:5	center
dock	saw-2	4:5	center
alina	saw-6	1:1	north
said	saw-7	1:1	north
EOF
)

mkdir -p "$OUT"

while IFS=$'\t' read -r name source ratio gravity; do
  [ -n "$name" ] || continue
  rw="${ratio%%:*}"
  rh="${ratio##*:}"
  h=$(( (BASE_W * rh + rw / 2) / rw ))
  input="$SRC/$source.jpeg"
  [ -f "$input" ] || { echo "missing $input" >&2; exit 1; }

  master="$OUT/.$name-master.png"
  magick "$input" -gravity "$gravity" -crop "${BASE_W}x${h}+0+0" +repage "$master"

  for w in "$BASE_W" $(( BASE_W / 2 )); do
    hh=$(( (w * rh + rw / 2) / rw ))
    magick "$master" -resize "${w}x${hh}!" -strip -quality 82 "$OUT/$name-$w.jpg"
    magick "$master" -resize "${w}x${hh}!" -strip -quality 80 "$OUT/$name-$w.webp"
    magick "$master" -resize "${w}x${hh}!" -strip -quality 55 "$OUT/$name-$w.avif"
  done

  rm -f "$master"
  printf '%-9s %s  %sx%s\n' "$name" "$source" "$BASE_W" "$h"
done <<< "$MANIFEST"
