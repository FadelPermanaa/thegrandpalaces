# 💐 Undangan Digital — Parisian Romance Luxury Wedding

Terima kasih sudah menggunakan template ini. Panduan singkat berikut membantu Anda
mengganti seluruh isi (foto, nama, tanggal, lokasi, bank, dsb.) tanpa menyentuh kode inti.

## 1. Struktur Folder
```
luxury-37/
├── index.html              ← seluruh markup, CSS, dan JS ada di sini (single-file)
└── assets/
    ├── photos/   1.webp – 20.webp  (+ slot foto & galeri)
    ├── audio/    theme-song.mp3     (musik latar)
    ├── video/    wedding-video.mp4  (opsional)
    ├── css/      (kosong — CSS inline di index.html)
    └── js/       (kosong — JS inline di index.html)
```

**Ciri khas tema Parisian Romance:** cursor berbentuk fleur-de-lis (bunga lili Paris),
cover dengan siluet cakrawala & Menara Eiffel, garnish bunga putih & emas, font script
Great Vibes, hero dengan langit Paris + Eiffel mini, timeline cinta, flip clock, venue
dengan tab perjalanan, dan closing dengan lampu jalan bergaya Paris.

## 2. Mengganti Foto (WAJIB)
Ganti file di `assets/photos/` dengan nama yang sama persis (`.webp`):

| File        | Digunakan untuk         |
|-------------|-------------------------|
| `1.webp`    | Foto latar Hero / Cover |
| `2.webp`    | Foto mempelai pria      |
| `3.webp`    | Foto mempelai wanita    |
| `4.webp`    | Foto pasangan           |
| `5.webp` – `20.webp` | Galeri foto (16 foto) |

Setiap `<img>` sudah dilengkapi fallback ke foto Unsplash, jadi preview tidak kosong.

## 3. Mengganti Musik
Timpa `assets/audio/theme-song.mp3`. Musik diputar otomatis setelah tombol
"Buka Undangan" ditekan dan bisa diatur lewat tombol bulat di kanan atas.

## 4. Video Cerita Cinta (opsional)
`assets/video/wedding-video.mp4` opsional. Jika file belum ada, sistem otomatis
menampilkan pesan "Video akan segera hadir".

## 5. Mengganti Nama, Tanggal, dan Data
Semua di satu tempat, atas `<script>` di `index.html`:
```js
var WEDDING = new Date("2027-02-14T09:00:00+07:00");
var GROOM = "Alexandre Pratama", BRIDE = "Chloé Aurelia";
var BANK_NO = "1234 5678 9012";
```
Detail teks panjang (nama orang tua, alamat venue, isi FAQ, dsb.) ada di `index.html`
dan mudah dicari lewat komentar section seperti `LA CÉRÉMONIE`, `LIEU & ITINÉRAIRE`,
`CADEAU`, `CONTACT`.

## 6. Nama Tamu Personal
```
index.html?to=Keluarga%20Bapak%20Andi
```

## 7. RSVP & Buku Tamu
Tersimpan di `localStorage` masing-masing browser tamu (tanpa server). Untuk
mengumpulkan data terpusat, sambungkan ke backend seperti Google Apps Script.

## 8. Menjalankan / Hosting
Karena memuat foto & audio lokal, sebaiknya di-hosting (Netlify Drop, Vercel, dsb.),
atau jalankan lokal:
```
python3 -m http.server 8000
```

## 9. Catatan
- Semua gambar galeri memakai `loading="lazy"`.
- Animasi memakai `transform` & `opacity` (GPU-friendly).
- `prefers-reduced-motion` dihormati.

Selamat merayakan hari bahagia Anda berdua. 💍
