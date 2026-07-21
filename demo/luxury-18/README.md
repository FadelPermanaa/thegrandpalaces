# 🌸 Undangan Digital — Japanese Sakura Hanami Luxury Wedding

Terima kasih sudah menggunakan template ini. Panduan singkat di bawah akan membantu
Anda mengganti seluruh isi (foto, nama, tanggal, lokasi, dsb.) tanpa perlu menyentuh
kode inti.

## 1. Struktur Folder

```
sakura-wedding/
├── index.html              ← halaman utama
├── css/
│   ├── variables.css        ← palet warna & tipografi (token)
│   └── style.css            ← seluruh styling komponen & section
├── js/
│   ├── config.js            ← ⭐ EDIT DI SINI untuk nama, tanggal, dsb.
│   ├── cursor.js             (custom cursor kelopak sakura)
│   ├── particles.js          (kelopak & kupu-kupu berjatuhan)
│   ├── audio-player.js       (theme song + fade in/out)
│   ├── scroll.js             (animasi scroll & progress ranting sakura)
│   ├── interactive.js        (countdown, galeri, lightbox, kalender, dsb.)
│   ├── forms.js              (RSVP, buku tamu, konfirmasi kado)
│   └── main.js               (preloader & opening experience)
└── assets/
    ├── photos/   1.webp – 20.webp  (+ qris-placeholder.webp)
    ├── audio/    theme-song.mp3, ambient-river.mp3
    └── video/    wedding-video.mp4 (opsional)
```

## 2. Mengganti Foto (WAJIB)

Foto placeholder bertema sakura sudah dibuat otomatis agar preview terlihat rapi.
**Ganti file-file berikut di `assets/photos/` dengan foto asli mempelai**, gunakan
nama file yang **sama persis** (format `.webp`, huruf kecil):

| File        | Digunakan untuk         |
|-------------|-------------------------|
| `1.webp`    | Foto latar Hero / Cover |
| `2.webp`    | Foto mempelai pria      |
| `3.webp`    | Foto mempelai wanita    |
| `4.webp`    | Foto pasangan           |
| `5.webp` – `20.webp` | Galeri foto (16 foto) |

Jika foto asli Anda bukan format `.webp`, konversi dulu (banyak tool online gratis,
atau lewat Photoshop/Squoosh.app) — pertahankan nama angka sesuai tabel di atas.

Ukuran yang disarankan: rasio potret ±3:4 hingga 4:5, resolusi minimal 1000px pada
sisi terpendek, agar tetap tajam namun ringan diunduh.

## 3. Mengganti Musik Latar (theme-song)

File `assets/audio/theme-song.mp3` saat ini adalah **placeholder senyap** (bukan lagu
sungguhan, demi menghindari isu hak cipta). Ganti dengan file musik pilihan Anda,
dengan nama file yang **sama persis**: `theme-song.mp3`.

`assets/audio/ambient-river.mp3` bersifat opsional — suara ambient (aliran sungai/alam)
yang diputar sangat pelan menemani musik utama. Boleh dihapus isinya / dibiarkan
placeholder jika tidak diperlukan.

## 4. Video Cerita Cinta (opsional)

`assets/video/wedding-video.mp4` saat ini placeholder. Ganti dengan video highlight
Anda (nama file sama). Jika tidak punya video, biarkan saja — sistem otomatis
menampilkan pesan "Video akan segera hadir" tanpa merusak tampilan.

## 5. Mengganti Nama, Tanggal, dan Data Lain

Buka `js/config.js` — semua nilai penting dikumpulkan di satu tempat:

```js
weddingDateTime: "2026-11-08T07:30:00",  // tanggal & jam acara (untuk countdown)
groomName: "Rangga Aditya Wijaya",
brideName: "Sakura Amelia Putri",
bankAccountNumber: "1234 5678 9012",
```

Untuk detail lain yang tampil sebagai teks panjang (nama orang tua, alamat venue,
nomor WhatsApp, isi FAQ, dsb.), buka `index.html` dan cari teks terkait — semua
sudah diberi komentar section (`<!-- ... -->`) agar mudah ditemukan, contoh:
`BRIDE & GROOM`, `EVENT`, `VENUE`, `GIFT`, `CONTACT PERSON`.

Beberapa bagian yang perlu Anda sesuaikan manual di `index.html`:
- Nama & Instagram kedua mempelai + nama orang tua (bagian **Kedua Mempelai**)
- Kisah cinta / timeline (bagian **Love Story**)
- Tanggal, jam, dan alamat akad & resepsi (bagian **Akad & Resepsi**)
- Alamat Google Maps — ganti `q=Zenko+Garden+Hall+Bandung` pada `<iframe>` dan
  tombol "Buka di Maps" dengan nama/alamat venue Anda
- Info hotel, kafe, parkir, dan rute (bagian **Venue & Travel**)
- Nama bank & pemilik rekening (bagian **Gift**)
- Nomor telepon/WhatsApp narahubung (bagian **Contact Person**)
- Tagar Instagram (`#RanggaSakuraHanami`) di bagian **Instagram**

## 6. Nama Tamu Personal (opsional)

Anda bisa mengirim tautan berbeda untuk tiap tamu agar sapaan di layar pembuka
menyebut nama mereka, dengan menambahkan parameter `?to=` pada URL, contoh:

```
https://undangan-anda.com/?to=Bapak%20Andi%20%26%20Keluarga
```

## 7. RSVP & Buku Tamu — Cara Kerja Penyimpanan Data

RSVP dan Buku Tamu tersimpan di **localStorage browser tamu masing-masing** (tanpa
server/database). Artinya data yang terkirim hanya tersimpan di perangkat tamu
tersebut, bukan terkumpul otomatis ke satu tempat yang bisa Anda lihat semua.

Jika Anda ingin **mengumpulkan semua RSVP & ucapan tamu di satu tempat** (misalnya
ke Google Sheet, email, atau dashboard admin), Anda perlu menghubungkan form ini ke
layanan backend sederhana seperti Google Apps Script, Formspree, atau sejenisnya —
beri tahu saya jika Anda ingin saya bantu menyiapkannya.

## 8. Menjalankan / Menghosting Website

Karena website ini terdiri dari beberapa file (HTML, CSS, JS, gambar, audio), file
ini perlu **dihosting**, bukan sekadar dibuka langsung sebagai file tunggal, agar
seluruh path & animasi berjalan sempurna. Opsi termudah dan gratis:

- **Netlify Drop** (netlify.com/drop) — seret folder `sakura-wedding`, langsung online.
- **Vercel** atau **GitHub Pages** — cocok jika terbiasa dengan Git.
- Hosting lain yang sudah Anda punya — cukup unggah seluruh isi folder ini.

## 9. Catatan Performa

- Semua gambar galeri menggunakan `loading="lazy"`.
- Animasi memakai `transform` & `opacity` (GPU-friendly).
- `prefers-reduced-motion` dihormati — animasi otomatis dikurangi untuk pengguna
  yang mengaktifkan pengaturan tersebut di perangkatnya.
- Setelah mengganti foto asli, kompres dulu (misalnya lewat squoosh.app) supaya
  ukuran file tetap kecil dan website tetap cepat.

Selamat mempersiapkan hari bahagia Anda berdua. 🌸
