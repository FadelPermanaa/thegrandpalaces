/* ============================================================
   INTERACTIVE COMPONENTS
   ============================================================ */
(function () {
  var CFG = window.WEDDING_CONFIG || {};
  var weddingDate = new Date(CFG.weddingDateTime || '2026-11-08T07:30:00');

  /* ---------------- Guest name personalization ---------------- */
  (function personalizeGuest() {
    var params = new URLSearchParams(window.location.search);
    var to = params.get('to');
    var line = document.getElementById('coverGuestLine');
    if (to && line) {
      line.textContent = 'Kepada Yth. Bapak/Ibu/Saudara/i ' + decodeURIComponent(to);
    }
  })();

  /* ---------------- Countdown (hero teaser + flip clock) ---------------- */
  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdowns() {
    var now = new Date().getTime();
    var diff = weddingDate.getTime() - now;
    if (diff < 0) diff = 0;
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var mins = Math.floor((diff / (1000 * 60)) % 60);
    var secs = Math.floor((diff / 1000) % 60);

    document.querySelectorAll('[data-cd="days"]').forEach(function (el) { el.textContent = pad(days); });
    document.querySelectorAll('[data-cd="hours"]').forEach(function (el) { el.textContent = pad(hours); });
    document.querySelectorAll('[data-cd="mins"]').forEach(function (el) { el.textContent = pad(mins); });
    document.querySelectorAll('[data-cd="secs"]').forEach(function (el) { el.textContent = pad(secs); });

    updateFlip('days', pad(days));
    updateFlip('hours', pad(hours));
    updateFlip('mins', pad(mins));
    updateFlip('secs', pad(secs));
  }

  var lastFlipValues = {};
  function updateFlip(key, value) {
    var el = document.querySelector('[data-flip="' + key + '"]');
    if (!el) return;
    if (lastFlipValues[key] !== value) {
      lastFlipValues[key] = value;
      el.textContent = value;
      var card = el.closest('.flip-card');
      if (card) {
        card.classList.remove('is-flipping');
        void card.offsetWidth;
        card.classList.add('is-flipping');
      }
    }
  }

  setInterval(updateCountdowns, 1000);
  updateCountdowns();

  /* ---------------- Gallery: build masonry from config range ---------------- */
  var masonryGrid = document.getElementById('masonryGrid');
  var galleryUrls = [];
  if (masonryGrid) {
    var start = CFG.galleryStart || 5;
    var end = CFG.galleryEnd || 20;
    var folder = CFG.galleryFolder || 'assets/photos/';
    for (var i = start; i <= end; i++) {
      galleryUrls.push(folder + i + '.webp');
    }
    galleryUrls.forEach(function (url, idx) {
      var item = document.createElement('button');
      item.className = 'masonry__item';
      item.setAttribute('type', 'button');
      item.setAttribute('data-index', idx);
      item.setAttribute('aria-label', 'Perbesar foto galeri ' + (idx + 1));
      var img = document.createElement('img');
      img.src = url;
      img.loading = 'lazy';
      img.alt = 'Momen ' + (idx + 1);
      img.decoding = 'async';
      item.appendChild(img);
      masonryGrid.appendChild(item);
    });
  }

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = 0;

  function openLightbox(idx) {
    if (!galleryUrls.length) return;
    currentIndex = (idx + galleryUrls.length) % galleryUrls.length;
    lightboxImg.src = galleryUrls[currentIndex];
    lightboxImg.alt = 'Momen ' + (currentIndex + 1);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (masonryGrid) {
    masonryGrid.addEventListener('click', function (e) {
      var item = e.target.closest('.masonry__item');
      if (!item) return;
      openLightbox(parseInt(item.getAttribute('data-index'), 10));
    });
  }
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { openLightbox(currentIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { openLightbox(currentIndex + 1); });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
    if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
  });

  /* ---------------- Video modal ---------------- */
  var videoModal = document.getElementById('videoModal');
  var videoOpenBtn = document.getElementById('videoOpenBtn');
  var videoCloseBtn = document.getElementById('videoCloseBtn');
  var weddingVideo = document.getElementById('weddingVideo');
  var videoFallback = document.getElementById('videoFallback');

  if (videoOpenBtn) {
    videoOpenBtn.addEventListener('click', function () {
      videoModal.classList.add('is-open');
      videoModal.setAttribute('aria-hidden', 'false');
      if (weddingVideo) weddingVideo.play().catch(function () {});
    });
  }
  function closeVideo() {
    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');
    if (weddingVideo) weddingVideo.pause();
  }
  if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideo);
  if (videoModal) videoModal.addEventListener('click', function (e) { if (e.target === videoModal) closeVideo(); });
  if (weddingVideo) {
    weddingVideo.addEventListener('error', function () {
      weddingVideo.style.display = 'none';
      if (videoFallback) videoFallback.style.display = 'block';
    });
  }

  /* ---------------- Accordion (FAQ) ---------------- */
  document.querySelectorAll('.accordion__item').forEach(function (item) {
    var trigger = item.querySelector('.accordion__trigger');
    var panel = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.accordion__item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion__panel').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Venue tabs ---------------- */
  var tabButtons = document.querySelectorAll('.venue__tab-btn');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      document.querySelectorAll('.venue__tab-btn').forEach(function (b) { b.classList.remove('is-active'); });
      document.querySelectorAll('.venue__tab-panel').forEach(function (p) { p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var panel = document.querySelector('.venue__tab-panel[data-panel="' + target + '"]');
      if (panel) panel.classList.add('is-active');
    });
  });

  /* ---------------- Copy to clipboard ---------------- */
  function copyText(text, btn, successLabel) {
    var originalLabel = btn.textContent;
    navigator.clipboard.writeText(text).then(function () {
      btn.textContent = successLabel || 'Tersalin!';
      setTimeout(function () { btn.textContent = originalLabel; }, 1800);
    }).catch(function () {
      btn.textContent = 'Gagal menyalin';
      setTimeout(function () { btn.textContent = originalLabel; }, 1800);
    });
  }

  var copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', function () {
      copyText('Zenko Garden Hall, Jl. Taman Momiji No. 21, Bandung, Jawa Barat', copyAddressBtn, 'Alamat tersalin');
    });
  }
  var copyAccountBtn = document.getElementById('copyAccountBtn');
  if (copyAccountBtn) {
    copyAccountBtn.addEventListener('click', function () {
      copyText((CFG.bankAccountNumber || '').replace(/\s/g, ''), copyAccountBtn, 'Nomor tersalin');
    });
  }

  /* ---------------- Add to calendar (.ics download) ---------------- */
  function pad2(n) { return String(n).padStart(2, '0'); }
  function formatICSDate(d) {
    return d.getUTCFullYear() + pad2(d.getUTCMonth() + 1) + pad2(d.getUTCDate()) + 'T' + pad2(d.getUTCHours()) + pad2(d.getUTCMinutes()) + '00Z';
  }
  function downloadICS(title, start, end, location) {
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      'SUMMARY:' + title,
      'DTSTART:' + formatICSDate(start),
      'DTEND:' + formatICSDate(end),
      'LOCATION:' + location,
      'DESCRIPTION:Undangan Pernikahan Rangga & Sakura',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([ics], { type: 'text/calendar' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = title.replace(/\s/g, '-') + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  document.querySelectorAll('[data-calendar]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var type = btn.getAttribute('data-calendar');
      if (type === 'akad') {
        downloadICS('Akad Nikah Rangga & Sakura',
          new Date('2026-11-08T00:30:00Z'), new Date('2026-11-08T02:00:00Z'),
          'Kediaman Mempelai Putri, Jl. Sakura Raya No. 8, Bandung');
      } else {
        downloadICS('Resepsi Rangga & Sakura',
          new Date('2026-11-08T04:00:00Z'), new Date('2026-11-08T07:00:00Z'),
          'Zenko Garden Hall, Jl. Taman Momiji No. 21, Bandung');
      }
    });
  });

  window.WeddingCountdownTarget = weddingDate;
})();
