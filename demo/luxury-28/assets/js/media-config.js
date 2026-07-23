/* =========================================================================
   OBSIDIAN NOIR — MEDIA CONFIGURATION
   -------------------------------------------------------------------------
   This is the ONLY file you need to edit to place your own photos, videos,
   music and wedding details. Nothing in index.html, style.css or main.js
   needs to change — every section reads from MEDIA_CONFIG and WEDDING_INFO
   below.

   HOW TO USE
   1. Drop your files into the matching folders:
        /assets/images/  -> photos (.webp recommended)
        /assets/video/   -> video (.mp4)
        /assets/audio/   -> theme-song.mp3
   2. Update the paths / text below to match your filenames.
   3. Save. Refresh the page. Done.
   ========================================================================= */

const MEDIA_CONFIG = {

  // Hero / cover imagery ----------------------------------------------------
  heroImage:   "/assets/images/1.webp",
  groomImage:  "/assets/images/2.webp",
  brideImage:  "/assets/images/3.webp",
  coupleImage: "/assets/images/4.webp",

  // Gallery — masonry + lightbox --------------------------------------------
  galleryImages: [
    "/assets/images/5.webp",
    "/assets/images/6.webp",
    "/assets/images/7.webp",
    "/assets/images/8.webp",
    "/assets/images/9.webp",
    "/assets/images/10.webp",
    "/assets/images/11.webp",
    "/assets/images/12.webp",
    "/assets/images/13.webp",
    "/assets/images/14.webp",
    "/assets/images/15.webp",
    "/assets/images/16.webp",
    "/assets/images/17.webp",
    "/assets/images/18.webp",
    "/assets/images/19.webp",
    "/assets/images/20.webp"
  ],

  // Video --------------------------------------------------------------------
  openingVideo:    "/assets/video/opening.mp4",
  preweddingVideo: "/assets/video/prewedding.mp4",
  trailerVideo:    "/assets/video/trailer.mp4",

  // Audio ----------------------------------------------------------------------
  backgroundMusic: "/assets/audio/theme-song.mp3",

  // Gift — QRIS ------------------------------------------------------------
  qrisImage: "/assets/images/qris.webp",

  // Guest avatar fallback (used only for the initial-letter avatar chips
  // in the Guest Book — no AI-generated portraits are ever used)
  guestBookAvatarStyle: "initial" // "initial" | "none"
};

/* =========================================================================
   WEDDING DETAILS
   Freely editable — plain text and numbers only. Used across Hero,
   Countdown, Event, Calendar links, Maps and Footer.
   ========================================================================= */

const WEDDING_INFO = {

  groom: {
    fullName: "Alexander Wirawan",
    shortName: "Alexander",
    parents: "Putra dari Bapak Hendra Wirawan & Ibu Anastasia Wirawan"
  },
  bride: {
    fullName: "Isabella Kirana",
    shortName: "Isabella",
    parents: "Putri dari Bapak Raden Kirana & Ibu Aurelia Kirana"
  },

  hashtag: "#TheObsidianVows",

  // ISO date used by the countdown + calendar links (yyyy-mm-ddThh:mm:ss)
  akadDateTime:      "2026-11-14T09:00:00",
  receptionDateTime: "2026-11-14T18:00:00",

  akad: {
    label: "Akad Nikah",
    date: "Sabtu, 14 November 2026",
    time: "09.00 WIB — Selesai",
    venue: "The Obsidian Grand Ballroom",
    address: "Jl. Sudirman Kav. 45, Jakarta Selatan, Indonesia"
  },
  reception: {
    label: "Resepsi",
    date: "Sabtu, 14 November 2026",
    time: "18.00 WIB — 21.00 WIB",
    venue: "The Obsidian Grand Ballroom",
    address: "Jl. Sudirman Kav. 45, Jakarta Selatan, Indonesia"
  },

  // Google Maps embed src (replace with your own venue's embed link)
  mapsEmbedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.998!2d106.8095!3d-6.2145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInNTIuMiJTIDEwNsKwNDgnMzQuMiJF!5e0!3m2!1sid!2sid!4v0000000000000",
  mapsDirectionUrl: "https://maps.google.com/?q=The+Obsidian+Grand+Ballroom+Jakarta",

  dressCode: {
    description: "Formal Dark Elegance — palet obsidian, bronze, dan emas champagne.",
    colors: ["#0b0c11", "#26272f", "#8a5628", "#d4af7a", "#c9cad2"]
  },

  gift: {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountName: "Alexander Wirawan",
    bankName2: "Bank Mandiri",
    accountNumber2: "0987654321",
    accountName2: "Isabella Kirana"
  },

  accommodation: [
    { name: "The Dharmawangsa Jakarta", distance: "1.2 km dari venue", type: "Hotel Bintang 5" },
    { name: "Fairmont Jakarta",         distance: "2.4 km dari venue", type: "Hotel Bintang 5" },
    { name: "Hotel Mulia Senayan",      distance: "3.1 km dari venue", type: "Hotel Bintang 5" }
  ],
  nearbyRestaurants: [
    { name: "Amuz Gourmet Restaurant", distance: "0.8 km", type: "Fine Dining" },
    { name: "Kila Kila Sky Dining",    distance: "1.5 km", type: "Rooftop Dining" },
    { name: " Misool Restaurant",      distance: "2.0 km", type: "Contemporary Indonesian" }
  ],
  parkingInfo: "Valet parking tersedia di lobby utama. Area parkir basement menampung 300 kendaraan.",

  contact: [
    { name: "Alexander (Groom)", role: "Mempelai Pria" },
    { name: "Isabella (Bride)",  role: "Mempelai Wanita" }
  ],

  closingQuote: "In The Depth Of Darkness, We Found Our Light."
};
