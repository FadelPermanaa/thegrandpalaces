# Golden Lantern Garden — Wedding Invitation Website

## Cara Menggunakan
Tidak perlu mengubah kode apa pun. Cukup taruh file media Anda ke folder berikut,
dengan nama file PERSIS seperti ini:

assets/
├── images/
│   ├── 1.webp        → Hero (taman lentera)
│   ├── 2.webp        → Foto mempelai pria
│   ├── 3.webp        → Foto mempelai wanita
│   ├── 4.webp        → Foto pasangan (dipakai di Closing & Footer)
│   ├── 5.webp – 20.webp → Galeri (16 foto, akan otomatis dipilih 10 terbaik untuk layout editorial)
│   └── qris.webp     → Kode QRIS untuk hadiah
├── video/
│   ├── opening.mp4       → (opsional, belum dipasang otomatis di opening screen)
│   ├── prewedding.mp4    → Video di section "Highlight Moments"
│   └── trailer.mp4       → Video di section "Wedding Trailer"
└── audio/
    └── theme-song.mp3    → Lagu tema, diputar setelah tombol "Buka Undangan" ditekan

Selama file diletakkan dengan path & nama yang sama seperti di atas, website akan
langsung menampilkannya. Jika file belum tersedia, section terkait akan menampilkan
skeleton loading premium (bukan teks placeholder atau ikon rusak).

## Personalisasi
- Nama tamu otomatis muncul di layar pembuka jika Anda membagikan link dengan parameter:
  index.html?to=Nama%20Tamu
- Nama pasangan, tanggal, lokasi, timeline love story, FAQ, dan detail acara dapat diubah
  langsung di dalam index.html pada bagian HTML masing-masing section.

## Struktur
Satu file tunggal (index.html) berisi seluruh HTML, CSS, dan JavaScript — tidak ada
dependency eksternal selain Google Fonts (koneksi internet diperlukan untuk font).
