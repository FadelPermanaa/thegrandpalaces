# Blush Peony — Modern Luxury Wedding Invitation

Varian tema dari basis **Elegan Blanc (luxury-31)**: struktur section, layout, dan
seluruh interaksi identik — yang berbeda adalah palet warna, pasangan font,
tint foto, dan data dummy. Tema ini bernuansa **pastel blush peach + dusty rose, aksen terracotta** (terang).

- Pasangan dummy: **Sabrina & Gilang**
- Tanggal: Minggu, 18 April 2027
- Lokasi: Villa Amara Chapel & Garden, Bali
- Font: Tenor Sans (display) · Cormorant Garamond (serif) · Sacramento (script) · Montserrat (body)

## Struktur folder
```
luxury-35/
├── index.html            → seluruh markup, CSS, dan JS ada di sini
└── assets/
    ├── images/           → foto (opsional, saat ini memakai Unsplash)
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
| `--ivory` | `#FEF8F6` | latar utama |
| `--cream` | `#FBEDE8` | latar section selang-seling |
| `--sand` | `#F3D9CF` | garis & placeholder |
| `--gold` | `#C1826C` | aksen utama (terracotta) |
| `--gold-soft` | `#E0A891` | aksen lembut |
| `--accent-deep` | `#8A5240` | hover tombol solid |
| `--ink` | `#3A2A26` | warna teks |
| `--muted` | `#7E625A` | teks sekunder |

Token pendukung: `--surface-soft` (kartu semi transparan), `--field-bg` (input form),
`--nav-bg` (navbar & tombol musik), `--veil` / `--veil-strong` (overlay di atas foto),
`--img-filter` (tint semua foto), `--map-filter` (tint embed Google Maps).

## Cara mengganti isi

**Tanggal, judul kalender, lokasi** — blok `CONFIG` di awal `<script>`. Countdown dan
tombol "Simpan ke Kalender" mengikuti nilai ini.

**Nama, orang tua, alamat, jam acara, nomor rekening** — langsung di `index.html`,
setiap section diberi komentar penanda.

**Foto** — saat ini memakai URL Unsplash. Ganti `src` pada setiap `<img>` dengan
`assets/images/nama-file.webp` bila memakai foto sendiri. Tint tema tetap berlaku
otomatis lewat `--img-filter`.

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
- RSVP & ucapan disimpan di `localStorage` (kunci `luxury35_rsvp`) — belum terhubung ke server.
  Untuk produksi, sambungkan handler `#rsvpForm` ke Google Sheets / API Anda.
- Tidak ada dependensi eksternal selain Google Fonts dan foto Unsplash.
- Semua animasi menghormati `prefers-reduced-motion`.

## Menjalankan lokal
Buka `index.html` langsung di browser, atau `python3 -m http.server 8000`.
