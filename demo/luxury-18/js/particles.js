/* ============================================================
   PARTICLE SYSTEM — Falling Sakura Petals (canvas based)
   Reused across: cover, hero, closing sections.
   ============================================================ */
(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function PetalField(canvas, opts) {
    if (!canvas) return null;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = Object.assign({ density: 26, speed: 1, intensified: false }, opts || {});
    this.petals = [];
    this.running = false;
    this.resize();
    this.init();
    window.addEventListener('resize', this.resize.bind(this));
  }

  PetalField.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    this.w = rect.width;
    this.h = rect.height;
    this.ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  };

  PetalField.prototype.init = function () {
    var count = reduceMotion ? Math.round(this.opts.density / 3) : this.opts.density;
    this.petals = [];
    for (var i = 0; i < count; i++) {
      this.petals.push(this.makePetal(true));
    }
  };

  PetalField.prototype.makePetal = function (randomY) {
    return {
      x: Math.random() * this.w,
      y: randomY ? Math.random() * this.h : -20,
      size: 6 + Math.random() * 10,
      speedY: (0.4 + Math.random() * 0.7) * this.opts.speed,
      speedX: (Math.random() - 0.5) * 0.6,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.02,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.5 + Math.random() * 0.4,
      hue: Math.random() > 0.5 ? '#F1BFC4' : '#E39CA6'
    };
  };

  PetalField.prototype.drawPetal = function (p) {
    var ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.hue;
    ctx.beginPath();
    // simple petal shape via bezier
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.4, p.size * 0.6, p.size * 0.4, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.4, -p.size * 0.6, -p.size * 0.4, 0, 0);
    ctx.fill();
    ctx.restore();
  };

  PetalField.prototype.step = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    for (var i = 0; i < this.petals.length; i++) {
      var p = this.petals[i];
      p.sway += p.swaySpeed;
      p.x += p.speedX + Math.sin(p.sway) * 0.6;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y > this.h + 20) {
        this.petals[i] = this.makePetal(false);
        continue;
      }
      this.drawPetal(p);
    }
  };

  PetalField.prototype.loop = function () {
    if (!this.running) return;
    this.step();
    requestAnimationFrame(this.loop.bind(this));
  };

  PetalField.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.loop();
  };

  PetalField.prototype.stop = function () { this.running = false; };

  PetalField.prototype.setIntensity = function (density) {
    this.opts.density = density;
    this.init();
  };

  window.PetalField = PetalField;

  // Instantiate for known canvases once DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    var coverCanvas = document.getElementById('coverPetals');
    var heroCanvas = document.getElementById('heroPetals');
    var closingCanvas = document.getElementById('closingPetals');

    window.coverPetalField = coverCanvas ? new PetalField(coverCanvas, { density: 22, speed: 0.8 }) : null;
    window.heroPetalField = heroCanvas ? new PetalField(heroCanvas, { density: 18, speed: 0.7 }) : null;
    window.closingPetalField = closingCanvas ? new PetalField(closingCanvas, { density: 34, speed: 0.6 }) : null;

    if (window.coverPetalField) window.coverPetalField.start();

    // Hero petals start once hero is visible (handled also in main.js on open)
    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!window.heroPetalField) return;
        if (entry.isIntersecting) window.heroPetalField.start();
        else window.heroPetalField.stop();
      });
    }, { threshold: 0.05 });
    var heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    var closingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!window.closingPetalField) return;
        if (entry.isIntersecting) {
          window.closingPetalField.setIntensity(48); // intensify at ending experience
          window.closingPetalField.start();
        } else {
          window.closingPetalField.stop();
        }
      });
    }, { threshold: 0.15 });
    var closingSection = document.getElementById('closing');
    if (closingSection) closingObserver.observe(closingSection);
  });

  /* ---- Butterflies: a few drifting SVGs injected into the hero ---- */
  document.addEventListener('DOMContentLoaded', function () {
    if (reduceMotion) return;
    var hero = document.getElementById('hero');
    if (!hero) return;
    var butterflyCount = 2;
    for (var i = 0; i < butterflyCount; i++) {
      var b = document.createElement('div');
      b.className = 'butterfly';
      b.style.cssText = [
        'position:absolute', 'width:16px', 'height:14px', 'z-index:2',
        'top:' + (20 + Math.random() * 40) + '%',
        'left:' + (Math.random() * 80) + '%',
        'opacity:.6', 'pointer-events:none',
        'animation: butterflyDrift ' + (14 + Math.random() * 8) + 's linear infinite',
        'animation-delay:' + (Math.random() * 6) + 's'
      ].join(';');
      b.innerHTML = '<svg viewBox="0 0 20 16" width="16" height="14"><path d="M10 8 C6 0,0 2,2 8 C0 14,6 16,10 8 Z" fill="#B8757F" opacity=".6"/><path d="M10 8 C14 0,20 2,18 8 C20 14,14 16,10 8 Z" fill="#E39CA6" opacity=".6"/></svg>';
      hero.appendChild(b);
    }
    var style = document.createElement('style');
    style.textContent = '@keyframes butterflyDrift{0%{transform:translate(0,0) rotate(0deg);}25%{transform:translate(30px,-18px) rotate(8deg);}50%{transform:translate(60px,4px) rotate(-6deg);}75%{transform:translate(30px,20px) rotate(4deg);}100%{transform:translate(0,0) rotate(0deg);}}';
    document.head.appendChild(style);
  });
})();
