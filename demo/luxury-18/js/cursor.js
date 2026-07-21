/* ============================================================
   CUSTOM CURSOR — Sakura Petal
   ============================================================ */
(function () {
  var cursor = document.querySelector('.sakura-cursor');
  var ripple = document.querySelector('.cursor-ripple');
  if (!cursor) return;

  var isCoarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isCoarse) return; // rely on native cursor on touch devices

  var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  var curX = mouseX, curY = mouseY;
  var rotation = 0;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function raf() {
    // Smooth follow (lerp) + magnetic pull toward hovered interactive elements
    curX += (mouseX - curX) * 0.18;
    curY += (mouseY - curY) * 0.18;
    rotation += 0.6;
    cursor.style.transform = 'translate(' + curX + 'px,' + curY + 'px) rotate(' + rotation + 'deg)';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var hoverSelectors = 'a, button, input, textarea, .btn, [data-cursor-hover]';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(hoverSelectors)) {
      cursor.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(hoverSelectors)) {
      cursor.classList.remove('is-hover');
    }
  });

  document.addEventListener('mousedown', function (e) {
    cursor.classList.add('is-down');
    if (ripple) {
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.classList.remove('is-active');
      // force reflow to restart animation
      void ripple.offsetWidth;
      ripple.classList.add('is-active');
    }
  });
  document.addEventListener('mouseup', function () {
    cursor.classList.remove('is-down');
  });

  document.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    cursor.style.opacity = '1';
  });
})();
