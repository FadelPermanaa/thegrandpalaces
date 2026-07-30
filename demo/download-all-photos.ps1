# =============================================================================
#  Isi SEMUA slot foto di seluruh demo (luxury-01 .. luxury-35)
# =============================================================================
#  Skrip sebelumnya (download-gallery-photos.ps1) hanya mengisi galeri.
#  Skrip ini mengisi seluruh slot foto yang masih placeholder:
#
#      1.webp   -> foto utama / hero
#      2.webp   -> GROOM  (potret mempelai pria)
#      3.webp   -> BRIDE  (potret mempelai wanita)
#      4.webp   -> potret berdua
#      5-20.webp-> momen tambahan (dipakai berbagai section)
#      gallery-1..8.webp -> galeri utama
#
#  Jalankan sekali dari komputer yang terhubung internet:
#
#      powershell -ExecutionPolicy Bypass -File "D:\.THEGRANDGALLERY\the-grand-gallery\thegrandpalaces\demo\download-all-photos.ps1"
#
#  MODE FOTO SENDIRI: buat folder "my-photos" di samping skrip ini.
#  Beri nama file sesuai slot supaya penempatannya tepat:
#      groom.jpg, bride.jpg, couple.jpg, hero.jpg, lalu 01.jpg, 02.jpg, dst.
# =============================================================================

$ErrorActionPreference = 'Stop'
$Root     = $PSScriptRoot
$Staging  = Join-Path $Root '.photo-staging'
$MyPhotos = Join-Path $Root 'my-photos'

# --- Peta slot -> sumber foto ------------------------------------------------
# 'slot' = nama file tujuan, 'url' = sumber, 'kind' = pencocokan mode my-photos
$Slots = @(
  @{ slot = '1';  kind = 'hero';   url = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80' }
  @{ slot = '2';  kind = 'groom';  url = 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=1200&q=80' }
  @{ slot = '3';  kind = 'bride';  url = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1200&q=80' }
  @{ slot = '4';  kind = 'couple'; url = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80' }
  @{ slot = '5';  kind = 'extra';  url = 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=80' }
  @{ slot = '6';  kind = 'extra';  url = 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1400&q=80' }
  @{ slot = '7';  kind = 'extra';  url = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80' }
  @{ slot = '8';  kind = 'extra';  url = 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1400&q=80' }
  @{ slot = '9';  kind = 'extra';  url = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=80' }
  @{ slot = '10'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1400&q=80' }
  @{ slot = '11'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80' }
  @{ slot = '12'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1400&q=80' }
  @{ slot = '13'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=80' }
  @{ slot = '14'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=80' }
  @{ slot = '15'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=80' }
  @{ slot = '16'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1400&q=80' }
  @{ slot = '17'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1400&q=80' }
  @{ slot = '18'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=80' }
  @{ slot = '19'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1400&q=80' }
  @{ slot = '20'; kind = 'extra';  url = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=80' }
)

New-Item -ItemType Directory -Force -Path $Staging | Out-Null

Write-Host ''
Write-Host '=== Menyiapkan foto ===' -ForegroundColor Cyan

$ok = @{}
$failed = @()

if (Test-Path $MyPhotos) {
    Write-Host 'Memakai foto dari folder my-photos' -ForegroundColor Green
    $files = Get-ChildItem -Path $MyPhotos -Include *.jpg,*.jpeg,*.png,*.webp -File -Recurse | Sort-Object Name

    foreach ($s in $Slots) {
        # cocokkan berdasarkan nama file (groom/bride/couple/hero), sisanya urut
        $match = $files | Where-Object { $_.BaseName -match $s.kind } | Select-Object -First 1
        if (-not $match) { $match = $files | Select-Object -First 1 }
        if ($match) {
            Copy-Item $match.FullName (Join-Path $Staging ("{0}.webp" -f $s.slot)) -Force
            $ok[$s.slot] = $true
        }
    }
}
else {
    foreach ($s in $Slots) {
        $dest = Join-Path $Staging ("{0}.webp" -f $s.slot)
        Write-Host ("  slot {0,-3} " -f $s.slot) -NoNewline
        try {
            Invoke-WebRequest -Uri $s.url -OutFile $dest -UseBasicParsing -TimeoutSec 60
            $kb = [math]::Round((Get-Item $dest).Length / 1KB)
            Write-Host ("{0,-8} OK ({1} KB)" -f $s.kind, $kb) -ForegroundColor Green
            $ok[$s.slot] = $true
        }
        catch {
            Write-Host ("{0,-8} GAGAL - akan dipakai foto cadangan" -f $s.kind) -ForegroundColor Yellow
            $failed += $s.slot
        }
    }
}

# --- Slot yang gagal diisi memakai foto yang berhasil (tidak ada slot kosong) --
$good = @($ok.Keys | Sort-Object { [int]$_ })
if ($good.Count -eq 0) {
    Write-Host ''
    Write-Host 'Tidak ada foto yang berhasil disiapkan. Periksa koneksi internet.' -ForegroundColor Red
    Remove-Item $Staging -Recurse -Force
    exit 1
}
$i = 0
foreach ($slot in $failed) {
    $src = Join-Path $Staging ("{0}.webp" -f $good[$i % $good.Count])
    Copy-Item $src (Join-Path $Staging ("{0}.webp" -f $slot)) -Force
    $i++
}

# --- Galeri utama memakai 8 foto pertama -------------------------------------
for ($g = 1; $g -le 8; $g++) {
    $srcSlot = $good[($g - 1) % $good.Count]
    Copy-Item (Join-Path $Staging ("{0}.webp" -f $srcSlot)) `
              (Join-Path $Staging ("gallery-{0}.webp" -f $g)) -Force
}

# --- Sebar ke seluruh demo ---------------------------------------------------
Write-Host ''
Write-Host '=== Menyalin ke setiap demo ===' -ForegroundColor Cyan
$copied = 0
foreach ($n in 1..35) {
    $demo = Join-Path $Root ("luxury-{0:D2}" -f $n)
    if (-not (Test-Path $demo)) { continue }
    $imgDir = Join-Path $demo 'assets\images'
    New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

    Get-ChildItem -Path $Staging -Filter *.webp | ForEach-Object {
        Copy-Item $_.FullName (Join-Path $imgDir $_.Name) -Force
    }
    $copied++
    Write-Host ("  luxury-{0:D2}" -f $n) -ForegroundColor DarkGray
}

Remove-Item $Staging -Recurse -Force

Write-Host ''
Write-Host ("Selesai. {0} demo diperbarui." -f $copied) -ForegroundColor Green
if ($failed.Count -gt 0) {
    Write-Host ("Catatan: {0} slot memakai foto cadangan karena unduhan gagal." -f $failed.Count) -ForegroundColor Yellow
    Write-Host 'Tidak ada slot yang dibiarkan kosong.' -ForegroundColor Yellow
}
Write-Host ''
Write-Host 'Slot Groom = 2.webp, Bride = 3.webp - timpa dua file itu dengan' -ForegroundColor DarkGray
Write-Host 'foto klien untuk hasil terbaik.' -ForegroundColor DarkGray
Write-Host ''
