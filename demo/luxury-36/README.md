# Santorini White Haven — Luxury Digital Wedding Invitation

Undangan digital satu file (single-file HTML) bergaya **Santorini White Haven**:
dinding bercat putih, laut Aegean biru, aksen kubah ikonik Yunani, dengan palet
ivory–putih–biru laut yang cerah dan sejuk.

## Struktur folder
```
luxury-36/
├── index.html             → seluruh markup, CSS, dan JS ada di sini
└── assets/
    ├── images/           → 2.webp (groom), 3.webp (bride), gallery-1..8.webp (slot foto)
    ├── video/            → slot video (belum dipakai)
    ├── audio/
    │   └── theme-song.mp3 → musik latar
    ├── css/              → kosong (CSS inline di index.html)
    └── js/               → kosong (JS inline di index.html)
```

**Ciri khas tema Santorini:** layar cover berupa kubah putih ikonik yang muncul
dengan animasi halus, hero dengan lengkung (arch) dan garis horizon laut Aegean,
bingkai foto mempelai berbentuk kubah (dome frame), serta aksen biru santorini
pada tombol, ornamen, dan garis pemisah.

## Section yang tersedia
Cover pembuka · Hero · Salam & QS. Ar-Rum 21 · Kedua mempelai · Countdown ·
Akad &amp; Resepsi + Google Maps · Galeri 8 foto + lightbox · Amplop digital
(QRIS &amp; transfer) · RSVP &amp; ucapan · Guest book · FAQ · Contact ·
Doa penutup · Closing · Music player · Floating WhatsApp.

## Cara mengganti isi

**Nama, orang tua, alamat, jam acara, nomor rekening** — langsung di `index.html`,
setiap section diberi komentar penanda yang jelas.

**Tanggal countdown & kalender** — ubah `WEDDING_DATE` di awal `<script>`:
```js
var WEDDING_DATE = new Date("2027-06-12T09:00:00+07:00");
```

**Foto** — memakai slot lokal di `assets/images/`, sama seperti demo lain:

| Slot | Dipakai di |
|---|---|
| `2.webp` | potret pengantin pria |
| `3.webp` | potret pengantin wanita |
| `gallery-1.webp` … `gallery-8.webp` | galeri 8 foto |

Setiap `<img>` dilengkapi `onerror` fallback ke foto Unsplash, jadi demo tidak
pernah tampil kosong meski file foto belum ada. Skrip `download-all-photos.ps1`
(atau `download-gallery-photos.*`) di folder `demo/` otomatis mengisi slot ini.

**Nama tamu personal** — tambahkan parameter `?to=` pada URL:
```
index.html?to=Bapak%20Andi%20Wijaya
```

**Musik latar** — timpa `assets/audio/theme-song.mp3`. Musik diputar otomatis
setelah tombol "Buka Undangan" ditekan, dan bisa diatur lewat tombol bulat di
kiri bawah.

**Warna** — semua token warna di `:root` bagian atas `<style>`:
`--sant-blue --aegean --deep-sea --ink-blue --white-wash --plaster --sand`.

## Responsif
Layout fluid, galeri 3 kolom (→ 2 → 1 kolom di layar kecil), nav berubah jadi
menu hamburger di tablet/mobile, dan semua animasi menghormati
`prefers-reduced-motion`.

## Catatan
- RSVP &amp; ucapan disimpan di `localStorage` browser — belum terhubung ke server.
- Tidak ada dependensi eksternal selain Google Fonts dan foto Unsplash.

## Menjalankan lokal
Buka `index.html` langsung di browser, atau jalankan server:
```
python3 -m http.server 8000
```
lalu buka http://localhost:8000
