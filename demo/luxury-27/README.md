# Undangan Digital — Reyhan & Aleida
Tema: Marble Minimal Luxury Wedding

## Cara memasang foto, video, dan musik
Cukup letakkan file Anda ke folder berikut **dengan nama file angka murni** — tidak perlu mengubah HTML/CSS/JS sama sekali:

```
assets/images/1.webp   → Foto Hero (lorong galeri utama)
assets/images/2.webp   → Foto Mempelai Pria
assets/images/3.webp   → Foto Mempelai Wanita
assets/images/4.webp   → Foto Pasangan
assets/images/5.webp … 20.webp → Foto Gallery (16 foto)
assets/images/qris.webp        → Kode QRIS untuk hadiah digital

assets/video/opening.mp4      → (opsional, belum dipakai di template ini — cadangan)
assets/video/prewedding.mp4   → Video prewedding di section Highlight Moments
assets/video/trailer.mp4      → Wedding trailer

assets/audio/theme-song.mp3   → Lagu latar (theme song)
```

Format `.webp` untuk gambar disarankan agar performa tetap ringan. Jika file Anda `.jpg`/`.png`, cukup ubah ekstensi pada `js/script.js` di bagian **MEDIA VARIABLES** (baris paling atas), tanpa perlu mengubah struktur lain.

## Mengganti nama, tanggal, dan teks lainnya
Buka `index.html` dan cari teks berikut untuk diganti sesuai data Anda:
- Nama mempelai: "Reyhan" & "Aleida" (muncul di beberapa tempat)
- Tanggal pernikahan: "Sabtu, 12 Desember 2026"
- Alamat venue, nomor rekening, dan nomor telepon (masih berupa contoh)

Untuk countdown dan tombol "Save Calendar", ubah variabel `WEDDING_DATE` di bagian atas `js/script.js`.

## Mengirim undangan dengan nama tamu otomatis
Tambahkan parameter `?to=Nama%20Tamu` di akhir URL, contoh:
`https://domainanda.com/index.html?to=Bapak%20Budi`
Nama tamu akan otomatis muncul pada halaman pembuka.

## Guest Book
Ucapan dari RSVP tersimpan secara lokal di browser masing-masing tamu (localStorage) sebagai contoh interaksi. Untuk menampilkan ucapan dari semua tamu secara terpusat di server, form RSVP perlu dihubungkan ke backend/Google Sheets — silakan sampaikan jika ingin dibantu menghubungkannya.

## Struktur file
```
index.html
css/style.css
js/script.js
assets/images/
assets/video/
assets/audio/
```
