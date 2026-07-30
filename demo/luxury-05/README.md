# Midnight Navy — Dark Luxury Wedding Invitation

Kategori galeri: **Dark Luxury** (`dark`) — label kartu: *Dark Luxury · Midnight Collection*.

Varian tema dari basis **Elegan Blanc (luxury-01)**: struktur section, layout, dan
seluruh interaksi identik — yang berbeda adalah palet warna, pasangan font,
tint foto, dan data dummy. Tema ini bernuansa **navy pekat + gold hangat** (gelap).

- Pasangan dummy: **Kirana & Bagas**
- Tanggal: Minggu, 20 Desember 2026
- Lokasi: The Grand Ballroom, Hotel Arcadia, Jakarta
- Font: Cinzel (display) · EB Garamond (serif) · Great Vibes (script) · Montserrat (body)

## Struktur folder
```
luxury-05/
├── index.html            → seluruh markup, CSS, dan JS ada di sini
└── assets/
    ├── images/           → 1.webp..12.webp + gallery-1..8.webp (slot foto)
    ├── video/            → slot video (belum dipakai)
    ├── audio/
    │   └── theme-song.mp3 → musik latar
    ├── css/  js/         → kosong (CSS & JS inline di index.html)
    └── fonts/            → kosong (font dimuat via Google Fonts)
```

## Section yang tersedia
Cover pembuka · Hero parallax · Salam & countdown · Kedua mempelai · Kutipan Q.S. Ar-Rum 21 ·
Akad & Resepsi + Google Maps · Live streaming · Filter Instagram/TikTok · Background band 1 ·
Our Story (timeline) · Gallery 8 foto + lightbox · Background band 2 · RSVP & ucapan ·
Amplop digital · Doa penutup · Closing.

## Palet warna
Semua warna didefinisikan di `:root` pada bagian atas `<style>`. Ubah di satu tempat,
seluruh halaman ikut berubah.

| Variabel | Nilai | Dipakai untuk |
|---|---|---|
| `--ivory` | `#0E1626` | latar utama (navy gelap) |
| `--cream` | `#131E33` | latar section selang-seling |
| `--sand` | `#1E2C47` | garis & placeholder |
| `--gold` | `#C6A664` | aksen utama |
| `--gold-soft` | `#E0C88E` | aksen lembut |
| `--accent-deep` | `#8A6F3A` | hover tombol solid |
| `--ink` | `#EDF1F8` | warna teks (terang) |
| `--muted` | `#A3AFC4` | teks sekunder |
| `--surface` | `#16223A` | latar kartu |
| `--footer-bg` | `#080D18` | latar footer |

Token pendukung: `--surface-soft` (kartu semi transparan), `--field-bg` (input form),
`--nav-bg` (navbar & tombol musik), `--veil` / `--veil-strong` (overlay di atas foto),
`--img-filter` (tint semua foto), `--map-filter` (tint embed Google Maps).

## Cara mengganti isi

**Tanggal, judul kalender, lokasi** — blok `CONFIG` di awal `<script>`. Countdown dan
tombol "Simpan ke Kalender" mengikuti nilai ini.

**Nama, orang tua, alamat, jam acara, nomor rekening** — langsung di `index.html`,
setiap section diberi komentar penanda.

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

## Nama tamu personal
```
index.html?to=Bapak%20Andi%20Wijaya
```
Nama akan tampil otomatis di layar cover.

## Responsif
Ukuran dasar halaman fluid (`html { font-size: clamp(14.5px, 0.42vw + 12.6px, 21px) }`),
seluruh elemen berbasis `rem` menyesuaikan di setiap lebar layar.
Breakpoint: `≤1024px` galeri 3 kolom · `≤860px` kolom ganda jadi tunggal & timeline satu sisi ·
`≤600px` galeri 2 kolom · `≥1900px` lebar konten dikunci.

## Catatan
- RSVP & ucapan disimpan di `localStorage` (kunci `luxury05_rsvp`) — belum terhubung ke server.
  Untuk produksi, sambungkan handler `#rsvpForm` ke Google Sheets / API Anda.
- Tidak ada dependensi eksternal selain Google Fonts dan foto Unsplash.
- Semua animasi menghormati `prefers-reduced-motion`.

## Menjalankan lokal
Buka `index.html` langsung di browser, atau `python3 -m http.server 8000`.
