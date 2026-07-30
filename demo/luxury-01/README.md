# Elegan Blanc — Modern Luxury Wedding Invitation

Undangan digital satu file (single-file HTML) bergaya **Elegan Blanc**: ivory, cream,
dan aksen gold, dengan layout full-width yang dirancang untuk desktop namun tetap
menyesuaikan diri di tablet dan mobile.

## Struktur folder
```
luxury-01/
├── index.html            → seluruh markup, CSS, dan JS ada di sini
└── assets/
    ├── images/           → 1.webp..12.webp + gallery-1..8.webp (slot foto)
    ├── video/            → slot video (belum dipakai)
    ├── audio/
    │   └── theme-song.mp3 → musik latar
    ├── css/              → kosong (CSS inline di index.html)
    ├── js/               → kosong (JS inline di index.html)
    └── fonts/            → kosong (font dimuat via Google Fonts)
```

**Ciri khas tema ini — amplop & segel lilin.** Layar cover berperan sebagai amplop:
ada segel lilin emas bermonogram di atas nama mempelai, dan sebuah flap berbentuk
segitiga menutupi bagian atas. Saat tombol "Buka Undangan" ditekan, segel pecah
menjadi dua bagian yang terpelanting ke samping lalu flap terangkat (`rotateX`)
sebelum cover menghilang. Ornamen pemisah di section pembuka juga diganti
**letterpress crest** bulat bermonogram, bukan garis biasa.
Kelas terkait: `.wax`, `.wax-half`, `.wax-mono`, `.flap`, `.crest`, state `#cover.opening`.

Semua efek signature memakai CSS `transform`/`opacity` dan SVG kecil — tanpa canvas
dan tanpa partikel berbasis JavaScript. Otomatis nonaktif di layar `≤860px` dan saat
`prefers-reduced-motion: reduce`.

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

**Foto** — memakai slot lokal di `assets/images/`, sama seperti demo lain, sehingga
`demo/download-all-photos.ps1` (dan `download-gallery-photos.*`) langsung mengisinya:

| Slot | Dipakai di |
|---|---|
| `1.webp` | hero (layar utama) |
| `2.webp` | potret mempelai pria |
| `3.webp` | potret mempelai wanita |
| `4.webp` | cover pembuka (foto berdua) |
| `5.webp` | latar kutipan Q.S. Ar-Rum 21 |
| `6.webp` | section live streaming |
| `7.webp` | background band 1 |
| `8.webp` `9.webp` `10.webp` | tiga tahap Our Story |
| `gallery-1.webp` … `gallery-8.webp` | galeri 8 foto |
| `11.webp` | background band 2 |
| `12.webp` | closing |

Selama file itu belum ada, setiap `<img>` otomatis jatuh ke foto Unsplash pada
atribut `data-fb` — jadi demo tidak pernah tampil kosong. Mekanismenya satu
listener `error` fase capture di `<head>`. Tint tema tetap berlaku lewat
`--img-filter`, baik untuk foto lokal maupun cadangan.

Catatan: skrip download menyebar satu set foto yang sama ke seluruh demo, jadi
setelah dijalankan kelima tema ini akan memakai foto yang identik (yang berbeda
tetap palet, font, dan tint). Untuk foto berbeda per tema, taruh file sendiri di
`assets/images/` masing-masing folder setelah skrip selesai.

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
