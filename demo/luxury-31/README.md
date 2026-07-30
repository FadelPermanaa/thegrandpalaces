# Elegan Blanc — Modern Luxury Wedding Invitation

Undangan digital satu file (single-file HTML) bergaya **Elegan Blanc**: ivory, cream,
dan aksen gold, dengan layout full-width yang dirancang untuk desktop namun tetap
menyesuaikan diri di tablet dan mobile.

## Struktur folder
```
luxury-31/
├── index.html            → seluruh markup, CSS, dan JS ada di sini
└── assets/
    ├── images/           → foto (opsional, saat ini memakai Unsplash)
    ├── video/            → slot video (belum dipakai)
    ├── audio/
    │   └── theme-song.mp3 → musik latar
    ├── css/              → kosong (CSS inline di index.html)
    ├── js/               → kosong (JS inline di index.html)
    └── fonts/            → kosong (font dimuat via Google Fonts)
```

## Section yang tersedia
Cover pembuka · Hero parallax · Salam & countdown · Kedua mempelai · Kutipan Q.S. Ar-Rum 21 ·
Akad & Resepsi + Google Maps · Live streaming · Filter Instagram/TikTok · Background band 1 ·
Our Story (timeline) · Gallery 8 foto + lightbox · Background band 2 · RSVP & ucapan ·
Amplop digital · Doa penutup · Closing.

## Cara mengganti isi

**Tanggal, judul kalender, lokasi** — blok `CONFIG` di awal `<script>`:
```js
var CONFIG = {
  tanggalAcara: "2026-12-13T08:30:00+07:00",
  judulKalender: "Pernikahan Mitha & Dhika",
  lokasiKalender: "Jl. Jend. Sudirman No.1, ..."
};
```
Countdown dan tombol "Simpan ke Kalender" ikut nilai ini.

**Nama, orang tua, alamat, jam acara, nomor rekening** — langsung di `index.html`,
setiap section diberi komentar penanda yang jelas.

**Foto** — saat ini memakai URL Unsplash. Ganti `src` pada setiap `<img>` dengan
`assets/images/nama-file.webp` bila ingin memakai foto sendiri.

**Musik latar** — timpa `assets/audio/theme-song.mp3` dengan lagu Anda.
Musik otomatis diputar setelah tombol "Buka Undangan" ditekan (bila browser mengizinkan),
dan bisa dihidup-matikan lewat tombol bulat di kanan bawah.

**Warna** — semua warna ada di `:root` bagian atas `<style>`:
`--ivory --cream --sand --gold --gold-soft --ink --muted`.

## Nama tamu personal
Tambahkan parameter `?to=` pada URL:
```
index.html?to=Bapak%20Andi%20Wijaya
```
Nama akan tampil otomatis di layar cover. Tanpa parameter, tampil teks default.

## Responsif
Ukuran dasar halaman bersifat fluid (`html { font-size: clamp(14.5px, 0.42vw + 12.6px, 21px) }`),
sehingga seluruh elemen berbasis `rem` ikut menyesuaikan di setiap lebar layar.
Breakpoint: `≤1024px` (galeri 3 kolom), `≤860px` (semua kolom ganda jadi tunggal,
timeline pindah ke satu sisi), `≤600px` (galeri 2 kolom), `≥1900px` (lebar konten dikunci).

## Catatan
- RSVP & ucapan disimpan di `localStorage` browser pengunjung — belum terhubung ke server.
  Untuk produksi, sambungkan handler `#rsvpForm` ke Google Sheets / API Anda.
- Tidak ada dependensi eksternal selain Google Fonts dan foto Unsplash.
- Semua animasi menghormati `prefers-reduced-motion`.

## Menjalankan lokal
Buka `index.html` langsung di browser, atau:
```
python3 -m http.server 8000
```
lalu buka http://localhost:8000
