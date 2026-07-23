# Obsidian Noir — Dark Luxury Wedding Invitation

Website undangan digital dengan konsep **Obsidian Noir Luxury Wedding**:
marmer hitam, smoked glass, kristal chandelier, dan pencahayaan bronze.

## Cara Menggunakan

1. **Buka `index.html`** langsung di browser untuk melihat pratinjau
   (beberapa browser membatasi pemutaran audio/video otomatis dari file lokal —
   unggah ke hosting untuk pengalaman penuh).
2. **Ganti media Anda** — satu-satunya file yang perlu Anda ubah adalah:

   ```
   assets/js/media-config.js
   ```

   Letakkan file Anda di folder berikut, lalu sesuaikan nama file di
   `media-config.js`:

   ```
   assets/images/   -> foto (format .webp disarankan)
   assets/video/    -> video (.mp4)
   assets/audio/    -> theme-song.mp3
   ```

   Tidak ada satu pun HTML, CSS, atau JavaScript lain yang perlu diedit
   untuk mengganti foto/video/musik.

3. **Ganti detail acara** (nama mempelai, tanggal, lokasi, rekening hadiah,
   dsb.) juga berada di `media-config.js`, pada objek `WEDDING_INFO` di
   bagian bawah file.

4. **Nama tamu otomatis** — bagikan tautan dengan parameter `?to=Nama+Tamu`
   (contoh: `index.html?to=Bapak+Budi`) agar nama tamu muncul otomatis di
   layar pembuka.

## Struktur File

```
index.html
assets/
  css/style.css        -> seluruh gaya visual (tidak perlu diedit)
  js/media-config.js   -> SATU-SATUNYA file yang perlu Anda edit
  js/main.js            -> seluruh interaksi & animasi (tidak perlu diedit)
  images/               -> taruh foto Anda di sini
  video/                -> taruh video Anda di sini
  audio/                -> taruh theme-song.mp3 di sini
```

## Catatan

- Tidak ada foto/video AI yang dibuat untuk mempelai — seluruh elemen
  dekoratif (marmer, kristal, chandelier, dsb.) dibuat dengan CSS/SVG asli.
- Guest Book pada demo ini bersifat sementara (di memori browser tamu)
  karena tidak ada backend yang terhubung — hubungkan ke Google
  Sheets/Firebase/API pilihan Anda bila ingin menyimpan ucapan secara permanen.
- Untuk performa terbaik, kompres foto ke format `.webp` sebelum diunggah.
