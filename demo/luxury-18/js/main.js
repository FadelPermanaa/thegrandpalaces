/* ============================================================
   MAIN — Preloader orchestration + Opening Experience
   ============================================================ */
(function () {
  /* ---------------- Letter-by-letter name reveal ---------------- */
  document.querySelectorAll('.cover__letters').forEach(function (el, groupIndex) {
    var text = el.getAttribute('data-text') || el.textContent;
    el.textContent = '';
    text.split('').forEach(function (ch, i) {
      var span = document.createElement('span');
      span.className = 'letter-span';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (0.7 + groupIndex * 0.5 + i * 0.045) + 's';
      el.appendChild(span);
    });
  });

  /* ---------------- Preloader: simulate preloading gallery assets ---------------- */
  var preloader = document.getElementById('preloader');
  var preloaderFill = document.getElementById('preloaderFill');
  var CFG = window.WEDDING_CONFIG || {};

  function buildPreloadList() {
    var urls = ['assets/photos/1.webp', 'assets/photos/2.webp', 'assets/photos/3.webp', 'assets/photos/4.webp'];
    var start = CFG.galleryStart || 5;
    var end = CFG.galleryEnd || 20;
    var folder = CFG.galleryFolder || 'assets/photos/';
    for (var i = start; i <= end; i++) urls.push(folder + i + '.webp');
    return urls;
  }

  function preloadAssets(urls, onProgress, onDone) {
    var loaded = 0;
    var total = urls.length || 1;
    var doneCalled = false;

    function tick() {
      loaded++;
      onProgress(loaded / total);
      if (loaded >= total && !doneCalled) {
        doneCalled = true;
        onDone();
      }
    }

    if (!urls.length) { onProgress(1); onDone(); return; }

    urls.forEach(function (src) {
      var img = new Image();
      img.onload = tick;
      img.onerror = tick; // missing local photo shouldn't block the experience
      img.src = src;
    });

    // Safety timeout in case some images hang (slow network / missing files)
    setTimeout(function () {
      if (!doneCalled) { doneCalled = true; onProgress(1); onDone(); }
    }, 4500);
  }

  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add('is-hidden');
    setTimeout(function () { preloader.style.display = 'none'; }, 1100);
  }

  preloadAssets(
    buildPreloadList(),
    function (pct) { if (preloaderFill) preloaderFill.style.width = Math.round(pct * 100) + '%'; },
    function () { setTimeout(hidePreloader, 400); }
  );

  /* ---------------- Opening Experience: "Buka Undangan" ---------------- */
  var openBtn = document.getElementById('openInvitation');
  var cover = document.getElementById('cover');
  var branchRail = document.getElementById('branchRail');

  if (openBtn && cover) {
    openBtn.addEventListener('click', function () {
      cover.classList.add('is-transitioning');

      // Kick off theme song fade-in right away (6-8s fade as requested)
      if (window.themeSongControls) {
        window.themeSongControls.playWithFadeIn();
      }

      setTimeout(function () {
        cover.classList.add('is-open');
        document.body.style.overflow = '';
        if (branchRail) branchRail.style.opacity = '0.85';
      }, 900);
    }, { once: true });
  }

  // Lock scroll while cover is showing
  if (cover) document.body.style.overflow = 'hidden';
  var unlockObserver = new MutationObserver(function () {
    if (cover.classList.contains('is-open')) {
      document.body.style.overflow = '';
    }
  });
  if (cover) unlockObserver.observe(cover, { attributes: true, attributeFilter: ['class'] });
})();
