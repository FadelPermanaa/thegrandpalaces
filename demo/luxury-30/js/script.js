/* ==========================================================================
   CELESTIAL ELYSIUM — media variables
   Ganti path di bawah ini setelah menaruh file asli ke folder /assets/
   Jangan ubah bagian lain dari file ini maupun HTML/CSS.
   ========================================================================== */
const heroImage   = "/assets/images/1.webp";
const groomImage  = "/assets/images/2.webp";
const brideImage  = "/assets/images/3.webp";
const coupleImage = "/assets/images/4.webp";

const galleryImages = [
  "/assets/images/5.webp","/assets/images/6.webp","/assets/images/7.webp","/assets/images/8.webp",
  "/assets/images/9.webp","/assets/images/10.webp","/assets/images/11.webp","/assets/images/12.webp",
  "/assets/images/13.webp","/assets/images/14.webp","/assets/images/15.webp","/assets/images/16.webp",
  "/assets/images/17.webp","/assets/images/18.webp","/assets/images/19.webp","/assets/images/20.webp"
];

const openingVideo    = "/assets/video/opening.mp4";
const preweddingVideo = "/assets/video/prewedding.mp4";
const trailerVideo    = "/assets/video/trailer.mp4";
const backgroundMusic = "/assets/audio/theme-song.mp3";

/* Wedding date used by countdown — sesuaikan bila perlu */
const WEDDING_DATE = new Date("2026-12-12T09:00:00+07:00");

/* ==========================================================================
   BIND MEDIA VARIABLES TO DOM
   ========================================================================== */
function bindMedia(){
  document.querySelectorAll('[data-src-var]').forEach(el=>{
    const varName = el.getAttribute('data-src-var');
    const map = {heroImage, groomImage, brideImage, coupleImage};
    if(map[varName]) el.src = map[varName];
  });

  // Gallery grid — symmetrical editorial CSS grid, first slot wide (focal)
  const grid = document.getElementById('galleryGrid');
  if(grid){
    galleryImages.forEach((src, i)=>{
      const item = document.createElement('div');
      item.className = 'gallery-item reveal-scale' + (i === 0 ? ' wide' : '');
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Wedding gallery photo ' + (i+1);
      img.loading = 'lazy';
      img.onerror = ()=>{ item.style.background = 'var(--heavenly-beige)'; img.style.display='none'; };
      item.appendChild(img);
      item.addEventListener('click', ()=> openLightbox(src));
      grid.appendChild(item);
    });
  }

  // Instagram feed grid (reuses gallery images as placeholders)
  const insta = document.getElementById('instaGrid');
  if(insta){
    galleryImages.slice(0,8).forEach(src=>{
      const img = document.createElement('img');
      img.src = src; img.loading='lazy';
      img.onerror = ()=>{ img.style.background='var(--heavenly-beige)'; };
      insta.appendChild(img);
    });
  }

  const trailerEl = document.getElementById('trailerVideo');
  if(trailerEl) trailerEl.src = trailerVideo;

  const musicEl = document.getElementById('bgMusic');
  if(musicEl) musicEl.src = backgroundMusic;
}

/* ==========================================================================
   PRELOADER + OPENING GATE
   ========================================================================== */
function initStarfield(){
  const field = document.getElementById('starfield');
  if(!field) return;
  for(let i=0;i<70;i++){
    const s = document.createElement('span');
    s.style.top = Math.random()*100 + '%';
    s.style.left = Math.random()*100 + '%';
    s.style.animationDelay = (Math.random()*3).toFixed(2) + 's';
    field.appendChild(s);
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  bindMedia();
  initStarfield();
  initCursor();
  initAuroraCanvas();
  initCloudDrift();
  initRevealObserver();
  initGallery(); // lightbox handlers already bound in bindMedia via click
  initCountdown();
  initFAQ();
  initNav();
  initMusicToggle();
  initScrollProgress();
  initRSVP();
  initUtilityButtons();
  initVideoPlay();
});

window.addEventListener('load', ()=>{
  setTimeout(()=>{
    document.getElementById('preloader').classList.add('hide');
  }, 3200);
});

document.getElementById('btnOpen')?.addEventListener('click', ()=>{
  const opening = document.getElementById('opening');
  const whiteout = document.getElementById('whiteout');
  const music = document.getElementById('bgMusic');

  opening.classList.add('enter');
  setTimeout(()=>{
    whiteout.classList.add('show');
  }, 700);
  setTimeout(()=>{
    opening.classList.add('hide');
    document.body.style.overflow = 'auto';
  }, 1400);
  setTimeout(()=>{
    whiteout.classList.remove('show');
  }, 2400);

  // attempt to start ambient music after user gesture
  if(music){
    music.volume = 0.55;
    music.play().then(()=>{
      document.getElementById('musicToggle')?.classList.remove('paused');
    }).catch(()=>{ /* autoplay blocked, user can press toggle */ });
  }
});

// lock scroll until gate opened
document.body.style.overflow = 'hidden';

/* ==========================================================================
   CUSTOM CURSOR — Halo / Crystal / Celestial Star
   ========================================================================== */
function initCursor(){
  const halo = document.getElementById('cursorHalo');
  const dot = document.getElementById('cursorDot');
  if(!halo || !dot) return;
  let hx=0, hy=0, dx=0, dy=0;

  window.addEventListener('mousemove', e=>{
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
  });

  function follow(){
    hx += (dx - hx) * 0.16;
    hy += (dy - hy) * 0.16;
    halo.style.left = hx + 'px'; halo.style.top = hy + 'px';
    requestAnimationFrame(follow);
  }
  follow();

  document.querySelectorAll('a, button, .gallery-item, input, textarea, select').forEach(el=>{
    el.addEventListener('mouseenter', ()=> halo.classList.add('hover'));
    el.addEventListener('mouseleave', ()=> halo.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', ()=>{ halo.classList.add('hidden'); dot.classList.add('hidden'); });
  document.addEventListener('mouseenter', ()=>{ halo.classList.remove('hidden'); dot.classList.remove('hidden'); });
}

/* ==========================================================================
   AURORA / STARLIGHT CANVAS — ambient background particles
   ========================================================================== */
function initAuroraCanvas(){
  const canvas = document.getElementById('skyCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight * 1.0;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 768 ? 26 : 50;
  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*w, y: Math.random()*h,
      r: Math.random()*1.6 + 0.4,
      speed: Math.random()*0.15 + 0.03,
      alpha: Math.random()*0.5 + 0.2
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.y -= p.speed;
      if(p.y < -10){ p.y = h + 10; p.x = Math.random()*w; }
      ctx.beginPath();
      ctx.fillStyle = `rgba(242,217,166,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function initCloudDrift(){
  // lightweight decorative clouds behind hero, purely CSS-driven positions via inline style
  const hero = document.getElementById('hero');
  if(!hero) return;
  const wrap = document.createElement('div');
  wrap.className = 'cloud-drift';
  for(let i=0;i<4;i++){
    const c = document.createElement('div');
    c.className = 'cloud';
    c.style.top = (10 + i*20) + '%';
    c.style.left = (-20 + i*30) + '%';
    c.style.animation = `driftCloud ${28 + i*6}s linear infinite`;
    wrap.appendChild(c);
  }
  hero.appendChild(wrap);
  const styleTag = document.createElement('style');
  styleTag.textContent = `@keyframes driftCloud{from{transform:translateX(0);}to{transform:translateX(140vw);}}`;
  document.head.appendChild(styleTag);
}

/* ==========================================================================
   SCROLL REVEAL — IntersectionObserver
   ========================================================================== */
function initRevealObserver(){
  const els = document.querySelectorAll('.reveal, .reveal-scale');
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.18});
  els.forEach(el=> observer.observe(el));
}

/* ==========================================================================
   GALLERY LIGHTBOX
   ========================================================================== */
function initGallery(){
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  closeBtn?.addEventListener('click', ()=> lightbox.classList.remove('open'));
  lightbox?.addEventListener('click', (e)=>{ if(e.target === lightbox) lightbox.classList.remove('open'); });
}
function openLightbox(src){
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = src;
  lightbox.classList.add('open');
}

/* ==========================================================================
   TRAILER VIDEO PLAY OVERLAY
   ========================================================================== */
function initVideoPlay(){
  const overlay = document.getElementById('videoPlayOverlay');
  const btn = document.getElementById('videoPlayBtn');
  const video = document.getElementById('trailerVideo');
  if(!overlay || !video) return;
  btn.addEventListener('click', ()=>{
    video.play().then(()=>{ overlay.style.display = 'none'; }).catch(()=>{});
  });
}

/* ==========================================================================
   COUNTDOWN
   ========================================================================== */
function initCountdown(){
  const d = document.getElementById('cdDays');
  const h = document.getElementById('cdHours');
  const m = document.getElementById('cdMinutes');
  const s = document.getElementById('cdSeconds');
  if(!d) return;
  function tick(){
    const now = new Date();
    let diff = WEDDING_DATE - now;
    if(diff < 0) diff = 0;
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    d.textContent = String(days).padStart(2,'0');
    h.textContent = String(hours).padStart(2,'0');
    m.textContent = String(mins).padStart(2,'0');
    s.textContent = String(secs).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFAQ(){
  document.querySelectorAll('.faq-item').forEach(item=>{
    item.querySelector('.faq-q').addEventListener('click', ()=>{
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i=> i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */
function initNav(){
  const toggle = document.getElementById('navToggle');
  const panel = document.getElementById('navPanel');
  const close = document.getElementById('navClose');
  toggle?.addEventListener('click', ()=> panel.classList.add('open'));
  close?.addEventListener('click', ()=> panel.classList.remove('open'));
  panel?.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> panel.classList.remove('open')));

  let lastY = window.scrollY;
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', ()=>{
    const y = window.scrollY;
    if(y > lastY && y > 200) nav.classList.add('nav-hide');
    else nav.classList.remove('nav-hide');
    lastY = y;
  }, {passive:true});
}

/* ==========================================================================
   MUSIC TOGGLE
   ========================================================================== */
function initMusicToggle(){
  const btn = document.getElementById('musicToggle');
  const music = document.getElementById('bgMusic');
  btn?.addEventListener('click', ()=>{
    if(music.paused){
      music.play().catch(()=>{});
      btn.classList.remove('paused');
    } else {
      music.pause();
      btn.classList.add('paused');
    }
  });
}

/* ==========================================================================
   SCROLL PROGRESS ORBIT
   ========================================================================== */
function initScrollProgress(){
  const circle = document.getElementById('scrollProgressCircle');
  if(!circle) return;
  const full = 144.5;
  window.addEventListener('scroll', ()=>{
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? scrolled / max : 0;
    circle.style.strokeDashoffset = full - (full * pct);
  }, {passive:true});
}

/* ==========================================================================
   RSVP FORM
   ========================================================================== */
function initRSVP(){
  const form = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    form.style.display = 'none';
    success.classList.add('show');
  });
}

/* ==========================================================================
   UTILITY BUTTONS — copy address / bank number, calendar links
   ========================================================================== */
function initUtilityButtons(){
  const copyAddress = document.getElementById('copyAddressBtn');
  copyAddress?.addEventListener('click', ()=>{
    navigator.clipboard?.writeText('Jl. Langit Utama No. 7, Kawasan Kerajaan Surgawi, Jakarta Selatan').then(()=>{
      copyAddress.textContent = 'Alamat Tersalin ✦';
      setTimeout(()=> copyAddress.textContent = 'Salin Alamat', 2000);
    });
  });

  const copyBank = document.getElementById('copyBankBtn');
  copyBank?.addEventListener('click', ()=>{
    navigator.clipboard?.writeText('1234567890').then(()=>{
      copyBank.textContent = 'Nomor Tersalin ✦';
      setTimeout(()=> copyBank.textContent = 'Salin Nomor Rekening', 2000);
    });
  });

  document.querySelectorAll('[data-calendar]').forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const start = WEDDING_DATE.toISOString().replace(/[-:]|\.\d{3}/g,'');
      const end = new Date(WEDDING_DATE.getTime() + 3*60*60*1000).toISOString().replace(/[-:]|\.\d{3}/g,'');
      if(link.dataset.calendar === 'google'){
        window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Kavin+%26+Alysia+Wedding&dates=${start}/${end}&location=Crystal+Palace+of+Elysium`, '_blank');
      } else {
        // Apple Calendar via .ics download would require a generated file; fallback informs user
        alert('Gunakan tombol Google Calendar, atau tambahkan acara ini secara manual ke Apple Calendar Anda.');
      }
    });
  });
}
