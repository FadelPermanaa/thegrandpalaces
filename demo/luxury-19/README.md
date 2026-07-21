# Royal Palace Versailles — Undangan Pernikahan Digital

## Struktur Folder
```
index.html
assets/
  css/style.css        <- semua styling & animasi
  js/media-config.js   <- SATU-SATUNYA file yang perlu Anda edit untuk mengganti media
  js/main.js           <- seluruh logika & efek (tidak perlu diubah)
  images/              <- taruh 1.webp s/d 20.webp + qris.webp di sini
  video/                <- taruh opening.mp4, prewedding.mp4, trailer.mp4 di sini
  audio/                <- taruh theme-song.mp3 di sini
```

## Cara Mengganti Media (tanpa menyentuh HTML/CSS/JS lain)
Buka `assets/js/media-config.js` dan ganti nilai path/teks sesuai file Anda:

- `heroImage`, `groomImage`, `brideImage`, `coupleImage` — foto utama
- `galleryImages` — array 16–20 foto highlight untuk galeri masonry
- `openingVideo`, `preweddingVideo`, `trailerVideo` — video (letakkan di `assets/video/`)
- `backgroundMusic` — file `theme-song.mp3` (letakkan di `assets/audio/`)
- `qrisImage`, `bankAccount` — untuk section hadiah
- `mapsEmbedUrl`, `mapsLinkUrl` — ganti dengan link Google Maps lokasi Anda
- `eventDate`, `eventEndDate`, `eventTitle`, `eventLocation` — dipakai oleh countdown & tombol kalender

Semua file media WAJIB diletakkan pada folder yang sudah disediakan (`assets/images`, `assets/video`, `assets/audio`) dengan nama file yang sama seperti pada `media-config.js`, atau ubah path-nya di file tersebut agar sesuai lokasi file Anda.

## Nama File Yang Perlu Disiapkan
**assets/images/**: `1.webp` (hero), `2.webp` (mempelai pria), `3.webp` (mempelai wanita), `4.webp` (couple portrait), `5.webp`–`20.webp` (galeri, 16 foto), `qris.webp` (kode QRIS)
**assets/video/**: `opening.mp4`, `prewedding.mp4`, `trailer.mp4`
**assets/audio/**: `theme-song.mp3`

## Konten Teks
Nama pasangan, tanggal, lokasi, cerita cinta, dan FAQ saat ini berisi teks contoh — silakan cari & ganti langsung di `index.html` (semua berupa teks biasa, mudah ditemukan per section).

## Menjalankan Secara Lokal
Karena menggunakan path absolut (`/assets/...`), jalankan lewat local server, bukan dibuka langsung sebagai file:

```bash
cd royal
python3 -m http.server 8080
```
Lalu buka `http://localhost:8080`.

## Deploy
Unggah seluruh folder ini apa adanya ke Netlify, Vercel, atau hosting statis lain manapun.

## Catatan
- Tidak ada gambar/video AI yang dibuat — seluruh media memakai variabel placeholder yang harus Anda isi sendiri.
- Ucapan tamu (Guest Book) tersimpan di browser pengunjung (localStorage) sebagai demo; untuk penyimpanan terpusat/nyata, hubungkan form RSVP ke backend (Google Sheets, Firebase, dsb).
