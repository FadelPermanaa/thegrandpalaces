# 🎭 Undangan Digital — Venetian Renaissance Luxury Wedding

Terima kasih sudah menggunakan template ini. Panduan singkat berikut membantu Anda
mengganti seluruh isi (foto, nama, tanggal, lokasi, bank, dsb.) tanpa menyentuh kode inti.

## 1. Struktur Folder
```
luxury-39/
├── index.html              ← seluruh markup, CSS, dan JS ada di sini (single-file)
└── assets/
    ├── photos/   1.webp – 20.webp  (+ slot foto & galeri)
    ├── audio/    theme-song.mp3     (musik latar)
    ├── video/    wedding-video.mp4  (opsional)
    ├── css/      (kosong — CSS inline di index.html)
    └── js/       (kosong — JS inline di index.html)
```

**Ciri khas tema Venetian Renaissance:** cursor berbentuk topeng Venesia, cover
dengan skyline kota & gondola yang melayang di atas kanal, frame mempelai melengkung
khas lengkung renaissance, aksen lion of Venice, dan closing dengan latar kanal.
Palet ivory–emas–biru kanal.

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
"Buka Undangan" dan bisa diatur lewat tombol bulat di kanan atas.

## 4. Mengganti Nama, Tanggal, dan Data
Semua di satu tempat, atas `<script>` di `index.html`:
```js
var WEDDING = new Date("2027-10-10T09:00:00+07:00");
var GROOM = "Matteo Alvise", BRIDE = "Isabella Rosaria";
var BANK_NO = "5566 7788 9900";
```
Detail teks panjang (nama orang tua, alamat venue, isi FAQ, dsb.) mudah dicari lewat
komentar section seperti `LE CERIMONIE`, `LUOGO`, `REGALO`, `CONTATTI`.

## 5. Nama Tamu Personal
```
index.html?to=Keluarga%20Bapak%20Andi
```

## 6. RSVP & Buku Tamu
Tersimpan di `localStorage` masing-masing browser tamu (tanpa server). Untuk
mengumpulkan data terpusat, sambungkan ke backend seperti Google Apps Script.

## 7. Menjalankan / Hosting
Directory ini perlu di-hosting (Netlify Drop, Vercel, dsb.), atau jalankan lokal:
```
python3 -m http.server 8000
```

## 8. Catatan
- Semua gambar galeri memakai `loading="lazy"`.
- Animasi memakai `transform` & `opacity` (GPU-friendly).
- `prefers-reduced-motion` dihormati.

Selamat berbahagia di atas kanal. 🎭
