# =============================================================================
#  Unduh 8 foto galeri dan sebar ke semua demo (luxury-04 .. luxury-30)
# =============================================================================
#  Jalankan sekali saja, dari komputer yang terhubung internet:
#
#      cd "D:\.THEGRANDGALLERY\the-grand-gallery\thegrandpalaces\demo"
#      powershell -ExecutionPolicy Bypass -File .\download-gallery-photos.ps1
#
#  Setelah selesai, semua undangan memuat foto dari assets/images/ secara lokal
#  dan tidak lagi membutuhkan internet untuk menampilkan galeri.
#
#  Ingin memakai foto klien sendiri? Lihat bagian "MODE FOTO SENDIRI" di bawah.
# =============================================================================

$ErrorActionPreference = 'Stop'

# --- Sumber foto -------------------------------------------------------------
# Urutan menentukan posisi di mosaik. Foto 1 dan 7 tampil paling besar,
# jadi taruh foto terbaik di dua posisi itu.
$Photos = @(
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&q=80',
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1600&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&q=80'
)

# =============================================================================
#  MODE FOTO SENDIRI
#  Punya foto klien? Buat folder "my-photos" di samping skrip ini, isi dengan
#  8 file (jpg/png/webp), urutkan namanya 1..8, lalu jalankan skrip seperti biasa.
#  Skrip otomatis memakai folder itu dan melewati proses unduh.
# =============================================================================

$Root     = $PSScriptRoot
$Staging  = Join-Path $Root '.gallery-staging'
$MyPhotos = Join-Path $Root 'my-photos'

New-Item -ItemType Directory -Force -Path $Staging | Out-Null

Write-Host ''
Write-Host '=== Menyiapkan 8 foto galeri ===' -ForegroundColor Cyan

$useLocal = Test-Path $MyPhotos

if ($useLocal) {
    $files = Get-ChildItem -Path $MyPhotos -Include *.jpg,*.jpeg,*.png,*.webp -File -Recurse |
             Sort-Object Name

    if ($files.Count -lt 8) {
        Write-Host ("Folder my-photos hanya berisi {0} gambar, butuh 8. Dibatalkan." -f $files.Count) -ForegroundColor Red
        exit 1
    }

    Write-Host ("Memakai foto dari my-photos ({0} file ditemukan)" -f $files.Count) -ForegroundColor Green
    for ($i = 0; $i -lt 8; $i++) {
        Copy-Item $files[$i].FullName (Join-Path $Staging ("gallery-{0}.webp" -f ($i + 1))) -Force
        Write-Host ("  [{0}/8] {1}" -f ($i + 1), $files[$i].Name)
    }
}
else {
    for ($i = 0; $i -lt 8; $i++) {
        $n   = $i + 1
        $dest = Join-Path $Staging ("gallery-{0}.webp" -f $n)
        Write-Host ("  [{0}/8] mengunduh..." -f $n) -NoNewline
        try {
            Invoke-WebRequest -Uri $Photos[$i] -OutFile $dest -UseBasicParsing -TimeoutSec 60
            $kb = [math]::Round((Get-Item $dest).Length / 1KB)
            Write-Host (" selesai ({0} KB)" -f $kb) -ForegroundColor Green
        }
        catch {
            Write-Host ' GAGAL' -ForegroundColor Red
            Write-Host ("      {0}" -f $_.Exception.Message) -ForegroundColor DarkGray
            Write-Host '      Periksa koneksi internet lalu jalankan ulang skrip ini.' -ForegroundColor Yellow
            exit 1
        }
    }
}

# --- Sebar ke seluruh demo ---------------------------------------------------
Write-Host ''
Write-Host '=== Menyalin ke setiap demo ===' -ForegroundColor Cyan

$copied = 0
foreach ($n in 4..30) {
    $demo = Join-Path $Root ("luxury-{0:D2}" -f $n)
    if (-not (Test-Path $demo)) { continue }

    $imgDir = Join-Path $demo 'assets\images'
    New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

    for ($i = 1; $i -le 8; $i++) {
        Copy-Item (Join-Path $Staging ("gallery-{0}.webp" -f $i)) `
                  (Join-Path $imgDir ("gallery-{0}.webp" -f $i)) -Force
    }
    $copied++
    Write-Host ("  luxury-{0:D2}  8 foto" -f $n) -ForegroundColor DarkGray
}

Remove-Item $Staging -Recurse -Force

Write-Host ''
Write-Host ("Selesai. {0} demo diperbarui." -f $copied) -ForegroundColor Green
Write-Host 'Galeri kini dimuat sepenuhnya dari file lokal - tidak butuh internet.' -ForegroundColor Green
Write-Host ''
Write-Host 'Uji cepat: matikan wifi, buka salah satu demo/luxury-XX/index.html,' -ForegroundColor DarkGray
Write-Host 'galeri harus tetap tampil penuh 8 foto.' -ForegroundColor DarkGray
Write-Host ''
