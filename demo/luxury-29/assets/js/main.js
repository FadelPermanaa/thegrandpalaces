/* ============================================================
   ASTRAL SANCTUARY — MAIN SCRIPT
   Semua logika situs. Media diambil murni dari media-config.js.
   ============================================================ */
(function(){
  "use strict";

  const $  = (s, ctx) => (ctx||document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx||document).querySelectorAll(s));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     MEDIA BINDING — mengisi semua elemen dari MEDIA (media-config.js)
     Jika file belum tersedia / gagal dimuat, placeholder tetap tampil.
     ============================================================ */
  function bindImage(wrapId, path){
    const wrap = document.getElementById(wrapId);
    if(!wrap || !path) return;
    const img = new Image();
    img.alt = "";
    img.loading = "lazy";
    img.onload = () => {
      wrap.innerHTML = "";
      wrap.appendChild(img);
    };
    img.onerror = () => { /* keep placeholder */ };
    img.src = path;
  }

  function bindVideoFrame(frameEl, path){
    if(!frameEl || !path) return null;
    const video = document.createElement('video');
    video.src = path;
    video.playsInline = true;
    video.preload = "metadata";
    video.controls = false;
    video.onloadeddata = () => {
      const placeholder = frameEl.querySelector('.media-placeholder');
      if(placeholder) placeholder.remove();
      frameEl.insertBefore(video, frameEl.firstChild);
    };
    video.onerror = () => {};
    video.load();
    return video;
  }

  function initMedia(){
    if(typeof MEDIA === "undefined") return;
    bindImage('hero-image-wrap', MEDIA.heroImage);
    bindImage('groom-image-wrap', MEDIA.groomImage);
    bindImage('bride-image-wrap', MEDIA.brideImage);
    bindImage('qris-image-wrap', MEDIA.qrisImage);
    const qrisWrap = $('.qris-frame');
    if(qrisWrap) bindImage(null, null); // noop guard
    if(qrisWrap && MEDIA.qrisImage){
      const img = new Image();
      img.onload = () => { qrisWrap.innerHTML = ""; qrisWrap.appendChild(img); };
      img.src = MEDIA.qrisImage;
    }

    // Gallery
    const galleryGrid = $('#gallery-grid');
    if(galleryGrid && MEDIA.galleryImages){
      MEDIA.galleryImages.forEach((src, i) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-index', i);
        item.innerHTML = `<div class="media-placeholder" data-var="gallery-${i}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5.5-5.5L9 17"/></svg>
            <span>${i+1}.webp</span>
          </div>`;
        galleryGrid.appendChild(item);
        const img = new Image();
        img.alt = "Galeri " + (i+1);
        img.loading = "lazy";
        img.onload = () => { item.innerHTML = ""; item.appendChild(img); };
        img.src = src;
      });
    }

    // Trailer video
    const trailerFrame = $('#trailer-frame');
    let trailerVideo = null;
    if(trailerFrame && MEDIA.trailerVideo){
      trailerVideo = document.createElement('video');
      trailerVideo.src = MEDIA.trailerVideo;
      trailerVideo.playsInline = true;
      trailerVideo.preload = "none";
      trailerVideo.controls = false;
      trailerVideo.style.cssText = "width:100%;height:100%;object-fit:cover;";
    }
    const trailerPlay = $('#trailer-play');
    if(trailerPlay){
      trailerPlay.addEventListener('click', () => {
        if(!trailerVideo) return;
        const placeholder = trailerFrame.querySelector('.media-placeholder');
        if(placeholder && !trailerFrame.contains(trailerVideo)){
          trailerFrame.insertBefore(trailerVideo, trailerFrame.firstChild);
        }
        trailerVideo.onerror = () => { trailerFrame.classList.remove('is-playing'); };
        trailerVideo.play().then(() => {
          trailerFrame.classList.add('is-playing');
          trailerVideo.controls = true;
        }).catch(() => {});
      });
    }

    // Maps embed
    const mapsFrame = document.querySelector('iframe[data-var="mapsEmbedUrl"]');
    if(mapsFrame && MEDIA.mapsEmbedUrl) mapsFrame.src = MEDIA.mapsEmbedUrl;

    // Background audio
    const audio = $('#bg-audio');
    if(audio && MEDIA.backgroundMusic) audio.src = MEDIA.backgroundMusic;

    // Text content from MEDIA.couple
    if(MEDIA.couple){
      const hashtagEls = $$('.footer-hashtag');
      hashtagEls.forEach(el => el.textContent = MEDIA.couple.hashtag || el.textContent);
    }
  }

  /* ============================================================
     PRELOADER
     ============================================================ */
  function initPreloader(){
    const preloader = $('#preloader');
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('is-hidden');
      }, prefersReducedMotion ? 200 : 1600);
    });
    // Safety fallback in case load event is delayed
    setTimeout(() => preloader.classList.add('is-hidden'), 4500);
  }

  /* ============================================================
     GATE — letter-by-letter names + starfield + open action
     ============================================================ */
  function initGateNames(){
    const el = $('#gate-names');
    if(!el || typeof MEDIA === "undefined") return;
    const text = `${MEDIA.couple.groomName} & ${MEDIA.couple.brideName}`;
    let delay = 0;
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.className = ch === '&' ? 'letter gate-amp' : 'letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (2.4 + delay) + 's';
      el.appendChild(span);
      delay += 0.045;
    });
  }

  function starCanvas(canvasId, opts){
    const canvas = document.getElementById(canvasId);
    if(!canvas) return null;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let raf;
    function resize(){
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    function seed(){
      const count = opts && opts.count || 140;
      stars = Array.from({length: count}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 * devicePixelRatio + .3,
        s: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2
      }));
    }
    function draw(t){
      ctx.clearRect(0,0,canvas.width, canvas.height);
      stars.forEach(st => {
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(t * st.s + st.phase));
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    resize(); seed();
    if(!prefersReducedMotion) raf = requestAnimationFrame(draw); else draw(0);
    window.addEventListener('resize', () => { resize(); seed(); });
    return { stop: () => cancelAnimationFrame(raf) };
  }

  function initGate(){
    const gate = $('#gate');
    const openBtn = $('#open-invitation');
    const audio = $('#bg-audio');
    const musicPlayer = $('#music-player');
    if(!gate || !openBtn) return;

    openBtn.addEventListener('click', () => {
      gate.classList.add('is-opening');
      document.body.classList.add('sound-on');

      // Play audio with fade-in
      if(audio && audio.src){
        audio.volume = 0;
        audio.play().then(() => {
          fadeAudioIn(audio, 7000);
        }).catch(() => { /* autoplay may be blocked; user can use music-toggle */ });
      }
      if(musicPlayer) musicPlayer.classList.add('is-visible');

      setTimeout(() => {
        gate.classList.add('is-open');
        document.body.style.overflow = '';
      }, 900);
    });
  }

  function fadeAudioIn(audio, duration){
    const target = 0.55;
    const steps = 40;
    const stepTime = duration / steps;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      audio.volume = Math.min(target, (target * i) / steps);
      if(i >= steps) clearInterval(iv);
    }, stepTime);
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  function initCursor(){
    if(window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const cursor = $('#cursor');
    const dot = $('#cursor-dot');
    if(!cursor || !dot) return;
    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let cx = mx, cy = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });

    function loop(){
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%) rotate(${(mx-cx)*2}deg)`;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    const interactive = 'a, button, .gallery-item, input, select, textarea, .swatch';
    document.addEventListener('mouseover', (e) => {
      if(e.target.closest(interactive)){
        cursor.style.transform += ' scale(1.6)';
        cursor.classList.add('is-hover');
        cursor.style.opacity = '.75';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if(e.target.closest(interactive)){
        cursor.classList.remove('is-hover');
        cursor.style.opacity = '1';
      }
    });
  }

  /* ============================================================
     AMBIENT PARTICLE CANVAS (body-wide starfield + drifting dust)
     ============================================================ */
  function initAmbientCanvas(){
    if(prefersReducedMotion) return;
    const canvas = $('#ambient-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    function seed(){
      particles = Array.from({length: 60}, () => ({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*1.2+.3,
        vy: -(Math.random()*0.12+0.02),
        vx: (Math.random()-0.5)*0.06,
        a: Math.random()*0.4+0.1
      }));
    }
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.y < -10) p.y = canvas.height + 10;
        if(p.x < -10) p.x = canvas.width + 10;
        if(p.x > canvas.width+10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(243,223,174,${p.a})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); seed();
    window.addEventListener('resize', () => { resize(); seed(); });
    requestAnimationFrame(draw);
  }

  /* ============================================================
     DECORATIVE STARS / CLOUDS INJECTION
     ============================================================ */
  function scatterDecor(containerId, {stars=24, clouds=3} = {}){
    const el = document.getElementById(containerId);
    if(!el) return;
    for(let i=0;i<stars;i++){
      const s = document.createElement('div');
      s.className = 'deco-star';
      const size = Math.random()*2.4+1;
      s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*4}s;`;
      el.appendChild(s);
    }
    for(let i=0;i<clouds;i++){
      const c = document.createElement('div');
      c.className = 'deco-cloud';
      c.style.cssText = `left:${Math.random()*70}%;top:${Math.random()*80}%;animation-duration:${30+Math.random()*30}s;`;
      el.appendChild(c);
    }
  }

  /* ============================================================
     NAV SCROLL STATE
     ============================================================ */
  function initNav(){
    const nav = $('#site-nav');
    if(!nav) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if(!ticking){
        requestAnimationFrame(() => {
          nav.classList.toggle('is-scrolled', window.scrollY > 60);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ============================================================
     CONSTELLATION SCROLL THREAD (signature element)
     ============================================================ */
  function initThread(){
    const wrap = $('.constellation-thread');
    const progress = $('#thread-progress');
    const nodesG = $('#thread-nodes');
    if(!wrap || !progress) return;
    const sections = $$('main > section, main > footer');
    const total = sections.length;
    // place nodes evenly
    sections.forEach((sec, i) => {
      const y = total > 1 ? (i/(total-1))*800 : 400;
      const node = document.createElementNS('http://www.w3.org/2000/svg','circle');
      node.setAttribute('cx', 13);
      node.setAttribute('cy', y);
      node.setAttribute('r', 3.4);
      node.classList.add('thread-node');
      node.dataset.target = sec.id || '';
      nodesG.appendChild(node);
      sec.dataset.threadY = y;
    });

    function update(){
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const ratio = max > 0 ? Math.min(1, scrollTop / max) : 0;
      progress.style.strokeDashoffset = String(1 - ratio);

      let activeIdx = 0;
      sections.forEach((sec, i) => {
        const rect = sec.getBoundingClientRect();
        if(rect.top < window.innerHeight*0.5) activeIdx = i;
      });
      $$('.thread-node').forEach((n, i) => n.classList.toggle('is-active', i === activeIdx));
    }
    document.addEventListener('scroll', () => requestAnimationFrame(update), { passive:true });
    update();
  }

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  function initReveal(){
    const items = $$('.reveal');
    if(!('IntersectionObserver' in window)){
      items.forEach(i => i.classList.add('is-inview'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-inview');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(i => io.observe(i));

    $$('[data-divider]').forEach(d => {
      const io2 = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting){ d.classList.add('is-inview'); io2.unobserve(d);} });
      }, { threshold: 0.4 });
      io2.observe(d);
    });
  }

  /* ============================================================
     LOVE STORY RENDER
     ============================================================ */
  function renderStory(){
    const track = $('#story-track');
    if(!track || typeof MEDIA === "undefined") return;
    MEDIA.loveStory.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'story-item reveal';
      el.innerHTML = `
        <div class="story-node"></div>
        <div class="story-year">${item.year}</div>
        <h3 class="story-title">${item.title}</h3>
        <p class="story-desc">${item.desc}</p>`;
      track.appendChild(el);
    });
  }

  /* ============================================================
     EVENTS RENDER
     ============================================================ */
  function renderEvents(){
    const grid = $('#events-grid');
    if(!grid || typeof MEDIA === "undefined") return;
    MEDIA.events.forEach(ev => {
      const card = document.createElement('div');
      card.className = 'event-card reveal';
      const gcalUrl = buildGoogleCalendarUrl(ev);
      card.innerHTML = `
        <div class="event-name">${ev.name}</div>
        <div class="event-date">${ev.date}</div>
        <div class="event-time">${ev.time}</div>
        <div class="event-venue">${ev.venue}</div>
        <div class="event-address">${ev.address}</div>
        <div class="event-actions">
          <a class="btn" href="${gcalUrl}" target="_blank" rel="noopener"><span>Google Calendar</span></a>
          <button class="btn copy-address" data-address="${ev.address}"><span>Salin Alamat</span></button>
        </div>`;
      grid.appendChild(card);
    });
    $$('.copy-address').forEach(btn => {
      btn.addEventListener('click', () => copyText(btn.dataset.address, btn));
    });
  }

  function buildGoogleCalendarUrl(ev){
    const title = encodeURIComponent(ev.name + " — " + (MEDIA.couple ? MEDIA.couple.groomName + ' & ' + MEDIA.couple.brideName : ''));
    const details = encodeURIComponent(ev.venue + ', ' + ev.address);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
  }

  /* ============================================================
     FAQ RENDER + ACCORDION
     ============================================================ */
  function renderFaq(){
    const list = $('#faq-list');
    if(!list || typeof MEDIA === "undefined") return;
    MEDIA.faq.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'faq-item reveal';
      el.innerHTML = `
        <button class="faq-q" aria-expanded="false">
          <span>${item.q}</span>
          <svg viewBox="0 0 20 20" fill="none" stroke="#F3DFAE" stroke-width="1.4"><path d="M10 3v14M3 10h14"/></svg>
        </button>
        <div class="faq-a"><p>${item.a}</p></div>`;
      list.appendChild(el);
      const btn = el.querySelector('.faq-q');
      const ans = el.querySelector('.faq-a');
      btn.addEventListener('click', () => {
        const isOpen = el.classList.contains('is-open');
        list.querySelectorAll('.faq-item').forEach(it => {
          it.classList.remove('is-open');
          it.querySelector('.faq-a').style.maxHeight = null;
          it.querySelector('.faq-q').setAttribute('aria-expanded','false');
        });
        if(!isOpen){
          el.classList.add('is-open');
          ans.style.maxHeight = ans.scrollHeight + 'px';
          btn.setAttribute('aria-expanded','true');
        }
      });
    });
  }

  /* ============================================================
     GALLERY LIGHTBOX
     ============================================================ */
  function initLightbox(){
    const lightbox = $('#lightbox');
    const imgEl = $('#lightbox-img');
    if(!lightbox || !imgEl || typeof MEDIA === "undefined") return;
    let currentIndex = 0;
    const images = MEDIA.galleryImages || [];

    function open(i){
      currentIndex = i;
      imgEl.src = images[currentIndex];
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close(){
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function nav(delta){
      currentIndex = (currentIndex + delta + images.length) % images.length;
      imgEl.src = images[currentIndex];
    }

    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if(item){
        const idx = parseInt(item.getAttribute('data-index'), 10);
        if(!isNaN(idx)) open(idx);
      }
    });
    $('#lightbox-close').addEventListener('click', close);
    $('#lightbox-prev').addEventListener('click', () => nav(-1));
    $('#lightbox-next').addEventListener('click', () => nav(1));
    lightbox.addEventListener('click', (e) => { if(e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if(!lightbox.classList.contains('is-open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') nav(-1);
      if(e.key === 'ArrowRight') nav(1);
    });
  }

  /* ============================================================
     COUNTDOWN
     ============================================================ */
  function initCountdown(){
    if(typeof MEDIA === "undefined") return;
    const target = new Date(MEDIA.couple.weddingDate).getTime();
    const dEl = $('#cd-days'), hEl = $('#cd-hours'), mEl = $('#cd-minutes'), sEl = $('#cd-seconds');
    if(!dEl) return;
    function pad(n){ return String(n).padStart(2,'0'); }
    function tick(){
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      dEl.textContent = pad(days); hEl.textContent = pad(hours);
      mEl.textContent = pad(minutes); sEl.textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     RSVP FORM + GUESTBOOK (localStorage)
     ============================================================ */
  const GUESTBOOK_KEY = 'astral-sanctuary-guestbook';

  function loadGuestbook(){
    try{ return JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || []; }
    catch(e){ return []; }
  }
  function saveGuestbook(entries){
    try{ localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(entries)); }catch(e){}
  }
  function renderGuestbook(){
    const grid = $('#guestbook-grid');
    if(!grid) return;
    const entries = loadGuestbook();
    if(entries.length === 0){
      grid.innerHTML = '<p class="guestbook-empty">Jadilah yang pertama mengirimkan ucapan melalui form RSVP di atas.</p>';
      return;
    }
    grid.innerHTML = entries.slice().reverse().map(en => `
      <div class="guest-card">
        <div class="guest-name">${escapeHtml(en.name)}</div>
        <p class="guest-msg">${escapeHtml(en.message)}</p>
      </div>`).join('');
  }
  function escapeHtml(str){
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function initRsvp(){
    const form = $('#rsvp-form');
    const success = $('#rsvp-success');
    if(!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#rsvp-name').value.trim();
      const message = $('#rsvp-message').value.trim();
      if(!name){ $('#rsvp-name').focus(); return; }

      if(message){
        const entries = loadGuestbook();
        entries.push({ name, message, ts: Date.now() });
        saveGuestbook(entries);
        renderGuestbook();
      }

      form.style.display = 'none';
      success.classList.add('is-visible');
      triggerCelestialBurst();
    });
  }

  function triggerCelestialBurst(){
    if(prefersReducedMotion) return;
    const wrap = $('#rsvp-success');
    if(!wrap) return;
    for(let i=0;i<18;i++){
      const p = document.createElement('span');
      const angle = (Math.PI*2*i)/18;
      const dist = 60 + Math.random()*60;
      p.style.cssText = `position:absolute;width:5px;height:5px;border-radius:50%;left:50%;top:38%;
        background:#F3DFAE;box-shadow:0 0 8px 2px rgba(243,223,174,.8);
        transform:translate(-50%,-50%);pointer-events:none;
        transition:transform 1s cubic-bezier(.22,.61,.36,1), opacity 1s ease;`;
      wrap.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle)*dist - 50}%, ${Math.sin(angle)*dist}%) translate(-50%,-50%)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 1100);
    }
  }

  /* ============================================================
     GIFT SECTION — copy account / download QRIS
     ============================================================ */
  function initGift(){
    const copyBtn = $('#copy-account');
    if(copyBtn) copyBtn.addEventListener('click', () => copyText('•••• •••• 8821', copyBtn));
    const dlBtn = $('#download-qris');
    if(dlBtn) dlBtn.addEventListener('click', () => {
      if(typeof MEDIA !== "undefined" && MEDIA.qrisImage){
        const a = document.createElement('a');
        a.href = MEDIA.qrisImage;
        a.download = 'qris-astral-sanctuary.webp';
        a.click();
      }
    });
  }

  function copyText(text, btn){
    const label = btn.querySelector('span');
    const original = label ? label.textContent : '';
    const done = () => {
      if(label){ label.textContent = 'Tersalin'; setTimeout(() => label.textContent = original, 1600); }
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
      done();
    }
  }

  /* ============================================================
     MUSIC PLAYER
     ============================================================ */
  function initMusicPlayer(){
    const audio = $('#bg-audio');
    const toggle = $('#music-toggle');
    const navToggle = $('#nav-sound-toggle');
    const fill = $('#music-progress-fill');
    const icon = $('#music-icon');
    if(!audio) return;

    function setIcon(playing){
      if(!icon) return;
      icon.innerHTML = playing
        ? '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>'
        : '<path d="M8 5v14l11-7z"/>';
    }

    function togglePlay(){
      if(audio.paused){ audio.play().catch(()=>{}); }
      else { audio.pause(); }
    }
    if(toggle) toggle.addEventListener('click', togglePlay);
    if(navToggle) navToggle.addEventListener('click', togglePlay);

    audio.addEventListener('play', () => { setIcon(true); if(navToggle) navToggle.classList.remove('is-muted'); });
    audio.addEventListener('pause', () => { setIcon(false); if(navToggle) navToggle.classList.add('is-muted'); });
    audio.addEventListener('timeupdate', () => {
      if(fill && audio.duration){
        fill.style.width = ((audio.currentTime / audio.duration) * 100) + '%';
      }
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    initMedia();
    initPreloader();
    initGateNames();
    starCanvas('gate-star-canvas', { count: 160 });
    initGate();
    initCursor();
    initAmbientCanvas();
    scatterDecor('hero-deco', { stars: 30, clouds: 4 });
    scatterDecor('footer-deco', { stars: 26, clouds: 2 });
    initNav();
    initThread();
    initReveal();
    renderStory();
    renderEvents();
    renderFaq();
    initLightbox();
    initCountdown();
    initRsvp();
    renderGuestbook();
    initGift();
    initMusicPlayer();

    // Re-run reveal registration for dynamically injected nodes
    setTimeout(() => initReveal(), 300);
  });

})();
