# Celestial Elysium — Heavenly Kingdom Luxury Wedding

## Struktur folder
```
celestial-elysium/
├── index.html
├── css/style.css
├── js/script.js
└── assets/
    ├── images/   → 1.webp s.d. 20.webp
    ├── video/    → opening.mp4, prewedding.mp4, trailer.mp4
    └── audio/    → theme-song.mp3
```

## Cara mengganti foto & video (tanpa mengubah kode)
Cukup taruh file dengan nama yang sama pada folder `assets/`:

- `assets/images/1.webp` → foto hero (halaman utama)
- `assets/images/2.webp` → foto mempelai pria
- `assets/images/3.webp` → foto mempelai wanita
- `assets/images/4.webp` → foto pasangan (couple)
- `assets/images/5.webp` s.d. `20.webp` → 16 foto galeri (foto pertama otomatis tampil lebih besar sebagai fokus utama)
- `assets/video/trailer.mp4` → video wedding trailer
- `assets/video/opening.mp4`, `assets/video/prewedding.mp4` → disiapkan sebagai variabel, belum dipasang ke section manapun secara default — tambahkan sendiri jika ingin dipakai di section tertentu
- `assets/audio/theme-song.mp3` → musik latar yang otomatis diputar setelah tombol "Buka Undangan" ditekan

Semua path ini didefinisikan sebagai variabel di baris paling atas `js/script.js`. Jika ingin mengganti nama file, ubah nilainya di sana saja — HTML dan CSS tidak perlu disentuh.

## Catatan penting
- Tidak ada foto/video AI yang dibuat untuk mempelai — semua sudah disiapkan sebagai slot media kosong dengan fallback warna lembut (heavenly beige) jika file belum ditaruh.
- Gallery menggunakan **CSS Grid simetris** (bukan masonry), 4 kolom di desktop, 2 kolom di tablet, 1 kolom di mobile — margin & gutter konsisten sesuai instruksi.
- Ganti data dummy (nama mempelai, tanggal, lokasi, nomor rekening, kontak) langsung di `index.html` — semuanya ditandai dengan komentar section yang jelas.
- Tanggal pernikahan untuk countdown diatur di `js/script.js` pada konstanta `WEDDING_DATE`.
- Custom cursor otomatis nonaktif di perangkat sentuh (mobile/tablet) demi kenyamanan penggunaan.
- Font: Cormorant Garamond & Playfair Display (heading), Inter & Poppins (body) — dimuat via Google Fonts.
- Semua animasi memakai `transform`/`opacity` dan menghormati `prefers-reduced-motion`.

## Menjalankan secara lokal
Buka `index.html` langsung di browser, atau jalankan local server sederhana (disarankan agar video/audio dapat dimuat dengan benar):
```
python3 -m http.server 8000
```
lalu akses `http://localhost:8000`.
