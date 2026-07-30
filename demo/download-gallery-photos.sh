#!/usr/bin/env bash
# =============================================================================
#  Unduh 8 foto galeri dan sebar ke semua demo (luxury-01 .. luxury-35)
# =============================================================================
#  Versi macOS / Linux / Git Bash. Jalankan sekali saja:
#
#      cd .../thegrandpalaces/demo
#      bash download-gallery-photos.sh
#
#  MODE FOTO SENDIRI: buat folder "my-photos" di samping skrip ini berisi
#  8 gambar (urut nama 1..8); skrip akan memakainya dan melewati unduhan.
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STAGING="$ROOT/.gallery-staging"
MYPHOTOS="$ROOT/my-photos"

PHOTOS=(
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80'
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80'
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=80'
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80'
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80'
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80'
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80'
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=80'
)

mkdir -p "$STAGING"
echo
echo "=== Menyiapkan 8 foto galeri ==="

if [ -d "$MYPHOTOS" ]; then
  mapfile -t FILES < <(find "$MYPHOTOS" -maxdepth 1 -type f \
    \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) | sort)

  if [ "${#FILES[@]}" -lt 8 ]; then
    echo "Folder my-photos hanya berisi ${#FILES[@]} gambar, butuh 8. Dibatalkan." >&2
    exit 1
  fi

  echo "Memakai foto dari my-photos (${#FILES[@]} file ditemukan)"
  for i in $(seq 0 7); do
    cp -f "${FILES[$i]}" "$STAGING/gallery-$((i + 1)).webp"
    echo "  [$((i + 1))/8] $(basename "${FILES[$i]}")"
  done
else
  for i in $(seq 0 7); do
    n=$((i + 1))
    printf '  [%d/8] mengunduh...' "$n"
    if curl -fsSL --max-time 60 "${PHOTOS[$i]}" -o "$STAGING/gallery-$n.webp"; then
      kb=$(( $(wc -c < "$STAGING/gallery-$n.webp") / 1024 ))
      printf ' selesai (%s KB)\n' "$kb"
    else
      printf ' GAGAL\n'
      echo "      Periksa koneksi internet lalu jalankan ulang skrip ini." >&2
      exit 1
    fi
  done
fi

echo
echo "=== Menyalin ke setiap demo ==="
copied=0
for n in $(seq -w 1 35); do
  demo="$ROOT/luxury-$n"
  [ -d "$demo" ] || continue
  mkdir -p "$demo/assets/images"
  for i in $(seq 1 8); do
    cp -f "$STAGING/gallery-$i.webp" "$demo/assets/images/gallery-$i.webp"
  done
  copied=$((copied + 1))
  echo "  luxury-$n  8 foto"
done

rm -rf "$STAGING"

echo
echo "Selesai. $copied demo diperbarui."
echo "Galeri kini dimuat sepenuhnya dari file lokal - tidak butuh internet."
echo
echo "Uji cepat: matikan wifi, buka salah satu demo/luxury-XX/index.html,"
echo "galeri harus tetap tampil penuh 8 foto."
echo
