# Astral Sanctuary — Undangan Pernikahan Digital

## Cara memasang media Anda
Semua path media diatur di SATU file:

    assets/js/media-config.js

Ganti nilai path di sana dengan file asli Anda (foto, video, audio, QRIS),
lalu letakkan filenya di folder yang sesuai:

    assets/images/   -> semua foto (.webp disarankan)
    assets/video/    -> opening.mp4, prewedding.mp4, trailer.mp4
    assets/audio/    -> theme-song.mp3

Anda TIDAK perlu mengubah index.html, style.css, atau main.js.
Jika sebuah file belum ada, situs akan menampilkan bingkai placeholder
yang rapi (bukan gambar AI, bukan foto manusia) sampai file aslinya
ditempatkan.

## Cara menjalankan
Buka index.html langsung di browser, atau jalankan local server:

    python3 -m http.server 8000

lalu buka http://localhost:8000

## Struktur
    index.html
    assets/css/style.css
    assets/js/media-config.js   <- edit di sini untuk ganti media & teks acara
    assets/js/main.js
    assets/images/ /video/ /audio/
