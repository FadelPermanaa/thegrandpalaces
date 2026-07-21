/* ============================================================
   CONFIG — Ganti nilai di bawah ini sesuai data pernikahan Anda.
   File ini sengaja dipisah agar mudah diedit tanpa menyentuh
   logika/kode lainnya.
   ============================================================ */
window.WEDDING_CONFIG = {
  // Tanggal & waktu acara utama (format: YYYY-MM-DDTHH:mm:ss), dipakai untuk countdown
  weddingDateTime: "2026-11-08T07:30:00",

  groomName: "Rangga Aditya Wijaya",
  brideName: "Sakura Amelia Putri",

  // Jumlah foto galeri lokal yang tersedia (5.webp - 20.webp => 16 foto)
  galleryStart: 5,
  galleryEnd: 20,
  galleryFolder: "assets/photos/",

  // Nomor rekening / kontak — silakan sesuaikan
  bankAccountNumber: "1234 5678 9012",

  // Kunci penyimpanan lokal (localStorage) — tidak perlu diubah
  storageKeys: {
    guestbook: "sakura_wedding_guestbook",
    rsvp: "sakura_wedding_rsvp"
  }
};
