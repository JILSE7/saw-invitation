#!/usr/bin/env bash
#
# Art pipeline for the invitation.
#
# The source design only exists as a flat 1490px-wide raster export, so every
# decorative element has to be cut out of it. These helpers cover the four
# things that pipeline needs: measuring the source, sampling its background
# colours, cutting regions out of it, and tracing line art to SVG.
#
# Usage:
#   scripts/art.sh info    <source.png>
#   scripts/art.sh palette <source.png> [count]
#   scripts/art.sh probe   <source.png> <x> <y>
#   scripts/art.sh bands   <source.png> [step]     # background colour per row band
#   scripts/art.sh slice   <source.png>            # cuts every row in crops.tsv
#   scripts/art.sh trace   <crop.png> <name>       # line art -> SVG
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/src/assets/art"
ICONS="$OUT/icons"
CROPS="$ROOT/scripts/crops.tsv"

die() { printf 'error: %s\n' "$1" >&2; exit 1; }

# Reads one pixel as RRGGBB.
#
# Cropping to 1x1 and formatting %[hex:u] is used instead of the fx p{x,y}
# accessor: the latter needs the pixel enumeration escaped through several
# layers of shell quoting and silently degrades to an fx parse error.
pixel_at() {
  local src="$1" x="$2" y="$3"
  magick "$src" -crop "1x1+${x}+${y}" +repage -alpha off -format '%[hex:u]' info:
}

cmd_info() {
  local src="$1"
  magick identify -format 'file:       %f\nsize:       %wx%h\ndepth:      %z-bit\ncolorspace: %[colorspace]\nalpha:      %A\n' "$src"
}

# Dominant colours, most frequent first. Use these to seed tokens.css.
cmd_palette() {
  local src="$1" count="${2:-12}"
  magick "$src" -resize 400x -colors "$count" -unique-colors txt: |
    tail -n +2 |
    rg -o '#[0-9A-Fa-f]{6}' |
    sort -u
}

cmd_probe() {
  local src="$1" x="$2" y="$3"
  printf '%s\n' "$(pixel_at "$src" "$x" "$y")"
}

# Samples the left margin down the page. Because the crops keep their
# baked-in background, each section's CSS background must match the value
# reported here for the rows it covers, or the seam will show.
cmd_bands() {
  local src="$1" step="${2:-200}"
  local h; h=$(magick identify -format '%h' "$src")
  local y=0 hex prev=''
  while [ "$y" -lt "$h" ]; do
    hex="$(pixel_at "$src" 8 "$y")"
    if [ "$hex" != "$prev" ]; then
      printf 'y=%-7s #%s\n' "$y" "$hex"
      prev="$hex"
    fi
    y=$((y + step))
  done
}

# Cuts every region listed in crops.tsv. Emits a lossless PNG master plus a
# WebP for delivery.
cmd_slice() {
  local src="$1"
  [ -f "$CROPS" ] || die "missing $CROPS"
  mkdir -p "$OUT"
  local name x y w h
  while IFS=$'\t' read -r name x y w h; do
    case "$name" in ''|'#'*) continue ;; esac
    magick "$src" -crop "${w}x${h}+${x}+${y}" +repage "$OUT/$name.png"
    magick "$OUT/$name.png" -quality 88 "$OUT/$name.webp"
    printf 'cut %-28s %sx%s at +%s+%s\n' "$name" "$w" "$h" "$x" "$y"
  done < "$CROPS"
}

# Black-line-on-white art traces cleanly to SVG, which beats the raster
# original: scalable, a couple of KB, and recolourable via currentColor.
cmd_trace() {
  local crop="$1" name="$2"
  mkdir -p "$ICONS"
  magick "$crop" -colorspace gray -threshold 62% -bordercolor white -border 2 pbm:- |
    potrace --svg --turdsize 3 --alphamax 1 -o "$ICONS/$name.svg" -
  printf 'traced %s -> %s\n' "$name" "$ICONS/$name.svg"
}

[ $# -ge 1 ] || die "no subcommand; see the header of this file"
sub="$1"; shift
case "$sub" in
  info)    cmd_info "$@" ;;
  palette) cmd_palette "$@" ;;
  probe)   cmd_probe "$@" ;;
  bands)   cmd_bands "$@" ;;
  slice)   cmd_slice "$@" ;;
  trace)   cmd_trace "$@" ;;
  *)       die "unknown subcommand: $sub" ;;
esac
