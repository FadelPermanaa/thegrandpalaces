/* =========================================================
   MEDIA VARIABLES
   Ganti hanya file di folder /assets — jangan ubah baris ini.
   ========================================================= */
const heroImage = "assets/images/1.webp";
const groomImage = "assets/images/2.webp";
const brideImage = "assets/images/3.webp";
const coupleImage = "assets/images/4.webp";
const galleryImages = [
  "assets/images/5.webp","assets/images/6.webp","assets/images/7.webp","assets/images/8.webp",
  "assets/images/9.webp","assets/images/10.webp","assets/images/11.webp","assets/images/12.webp",
  "assets/images/13.webp","assets/images/14.webp","assets/images/15.webp","assets/images/16.webp",
  "assets/images/17.webp","assets/images/18.webp","assets/images/19.webp","assets/images/20.webp"
];
const openingVideo = "assets/video/opening.mp4";
const preweddingVideo = "assets/video/prewedding.mp4";
const trailerVideo = "assets/video/trailer.mp4";
const backgroundMusic = "assets/audio/theme-song.mp3";
const qrisImageSrc = "assets/images/qris.webp";

/* Wedding date used for countdown & calendar links (edit as needed) */
const WEDDING_DATE = new Date("2026-12-12T08:00:00+07:00");

document.addEventListener('DOMContentLoaded', () => {
  bindMedia();
  initCursor();
  initPreloader();
  initGate();
  initRevealObserver();
  initGallery();
  initLightbox();
  initCountdown();
  initCalendarButtons();
  initCopyButtons();
  initRsvp();
  initFaq();
  initAudioPlayer();
  initScrollProgress();
  initGuestName();
});

/* ---------- Media binding ---------- */
function bindMedia(){
  setImgSafe('heroImage', heroImage);
  setImgSafe('groomImage', groomImage);
  setImgSafe('brideImage', brideImage);
  setImgSafe('coupleImage', coupleImage);
  setImgSafe('qrisImage', qrisImageSrc);

  const pw = document.getElementById('preweddingVideo');
  const tr = document.getElementById('trailerVideo');
  if(pw) pw.src = preweddingVideo;
  if(tr) tr.src = trailerVideo;

  const audio = document.getElementById('bgAudio');
  if(audio) audio.src = backgroundMusic;
}

function setImgSafe(id, src){
  const el = document.getElementById(id);
  if(!el) return;
  el.src = src;
  el.addEventListener('error', () => {
    el.style.background = 'linear-gradient(160deg,#EFE6D3,#F5F0E7)';
    el.alt = el.alt + ' (letakkan file gambar pada ' + src + ')';
  });
}

/* ---------- Custom cursor ---------- */
function initCursor(){
  const cursor = document.getElementById('luxuryCursor');
  if(!cursor || matchMedia('(hover:none)').matches) return;
  let x = window.innerWidth/2, y = window.innerHeight/2, cx = x, cy = y;
  window.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
  (function loop(){
    cx += (x-cx)*0.18; cy += (y-cy)*0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  const hoverables = 'a, button, .masonry-item, input, textarea, select, .faq-question';
  document.addEventListener('mouseover', e => {
    if(e.target.closest(hoverables)) cursor.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if(e.target.closest(hoverables)) cursor.classList.remove('hover');
  });
  document.addEventListener('mousedown', () => cursor.classList.add('button'));
  document.addEventListener('mouseup', () => cursor.classList.remove('button'));
}

/* ---------- Preloader ---------- */
function initPreloader(){
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
    }, 1400);
  });
  // fallback in case 'load' already fired
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 3200);
}

/* ---------- Opening gate ---------- */
function initGate(){
  // letter-by-letter
  document.querySelectorAll('.letters').forEach(el => {
    const text = el.dataset.text || el.textContent;
    el.innerHTML = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (0.9 + i*0.06) + 's';
      el.appendChild(span);
    });
  });

  const gate = document.getElementById('gate');
  const btn = document.getElementById('btnOpen');
  const audio = document.getElementById('bgAudio');
  const audioToggle = document.getElementById('audioToggle');

  btn.addEventListener('click', () => {
    gate.classList.add('opened');
    document.body.style.cursor = document.body.style.cursor; // no-op, keep custom cursor
    document.getElementById('gateSeam').style.height = '0';
    setTimeout(() => { document.getElementById('mainContent').style.opacity = '1'; }, 200);

    // Play music with fade-in 6-8s
    if(audio){
      audio.volume = 0;
      audio.play().then(() => {
        fadeAudioIn(audio, 7000);
        audioToggle && audioToggle.classList.add('playing');
      }).catch(() => { /* autoplay might be blocked; user can press the audio button */ });
    }
    document.body.classList.add('unlocked');
  }, { once:true });
}

function fadeAudioIn(audio, duration){
  const target = parseFloat(document.getElementById('audioVolume')?.value || 0.6);
  const steps = 40;
  const stepTime = duration/steps;
  let i = 0;
  const iv = setInterval(() => {
    i++;
    audio.volume = Math.min(target, (target*i)/steps);
    if(i >= steps) clearInterval(iv);
  }, stepTime);
}

/* ---------- Scroll reveal + seam draw ---------- */
function initRevealObserver(){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold:0.18 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  const seamIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('drawn');
    });
  }, { threshold:0.4 });
  document.querySelectorAll('[data-seam]').forEach(el => seamIo.observe(el));
}

/* ---------- Gallery ---------- */
function initGallery(){
  const grid = document.getElementById('masonryGrid');
  if(!grid) return;
  galleryImages.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.dataset.index = i;
    item.setAttribute('data-reveal','');
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    img.alt = 'Momen ' + (i+1);
    img.addEventListener('error', () => { item.style.display = 'none'; });
    item.appendChild(img);
    grid.appendChild(item);
  });
  // re-observe newly added items
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('in-view'); });
  }, { threshold:0.15 });
  grid.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}

/* ---------- Lightbox ---------- */
function initLightbox(){
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const grid = document.getElementById('masonryGrid');
  let current = 0;

  function open(i){
    current = i;
    img.src = galleryImages[current];
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  }
  function close(){
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
  }
  function nav(delta){
    current = (current + delta + galleryImages.length) % galleryImages.length;
    img.src = galleryImages[current];
  }

  grid?.addEventListener('click', e => {
    const item = e.target.closest('.masonry-item');
    if(item) open(parseInt(item.dataset.index,10));
  });
  document.getElementById('lightboxClose')?.addEventListener('click', close);
  document.getElementById('lightboxPrev')?.addEventListener('click', () => nav(-1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => nav(1));
  lightbox?.addEventListener('click', e => { if(e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if(!lightbox.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft') nav(-1);
    if(e.key === 'ArrowRight') nav(1);
  });
}

/* ---------- Countdown ---------- */
function initCountdown(){
  const d = document.getElementById('cdDays');
  const h = document.getElementById('cdHours');
  const m = document.getElementById('cdMinutes');
  const s = document.getElementById('cdSeconds');
  if(!d) return;
  function tick(){
    const diff = WEDDING_DATE.getTime() - Date.now();
    if(diff <= 0){ d.textContent='00'; h.textContent='00'; m.textContent='00'; s.textContent='00'; return; }
    const days = Math.floor(diff/86400000);
    const hours = Math.floor((diff%86400000)/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    const secs = Math.floor((diff%60000)/1000);
    d.textContent = String(days).padStart(2,'0');
    h.textContent = String(hours).padStart(2,'0');
    m.textContent = String(mins).padStart(2,'0');
    s.textContent = String(secs).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- Calendar buttons ---------- */
function initCalendarButtons(){
  const gcal = document.getElementById('btnGCal');
  const ical = document.getElementById('btnICal');
  const start = WEDDING_DATE;
  const end = new Date(start.getTime() + 3*3600000);
  const fmt = (dt) => dt.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';

  gcal?.addEventListener('click', () => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Pernikahan Reyhan & Aleida')}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent('Dengan penuh sukacita kami mengundang Anda.')}&location=${encodeURIComponent('The Marble Atelier Hall, Jakarta')}`;
    window.open(url, '_blank');
  });

  ical?.addEventListener('click', () => {
    const ics = [
      'BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,
      'SUMMARY:Pernikahan Reyhan & Aleida',
      'LOCATION:The Marble Atelier Hall, Jakarta',
      'END:VEVENT','END:VCALENDAR'
    ].join('\n');
    const blob = new Blob([ics], { type:'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reyhan-aleida-wedding.ics';
    a.click();
  });
}

/* ---------- Copy buttons ---------- */
function initCopyButtons(){
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try{
        await navigator.clipboard.writeText(text);
      }catch(e){ /* clipboard may be unavailable */ }
      const feedback = btn.closest('.event-card') ? document.getElementById('copyFeedback') : document.getElementById('giftFeedback');
      if(feedback){
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 1800);
      }
    });
  });

  document.getElementById('btnDownloadQr')?.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = qrisImageSrc;
    a.download = 'qris-reyhan-aleida.png';
    a.click();
  });
}

/* ---------- RSVP + Guest book ---------- */
function initRsvp(){
  const form = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  const burst = document.getElementById('goldBurst');
  if(!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const entry = {
      name: (data.get('name')||'').toString().trim(),
      attendance: data.get('attendance'),
      guests: data.get('guests'),
      message: (data.get('message')||'').toString().trim(),
      time: Date.now()
    };
    if(!entry.name || !entry.attendance) return;

    saveGuestbookEntry(entry);
    renderGuestbook();

    form.style.display = 'none';
    success.classList.add('show');
    success.setAttribute('aria-hidden','false');
    burst.classList.remove('burst');
    void burst.offsetWidth;
    burst.classList.add('burst');
  });

  renderGuestbook();
}

function saveGuestbookEntry(entry){
  try{
    const list = JSON.parse(localStorage.getItem('guestbook') || '[]');
    list.unshift(entry);
    localStorage.setItem('guestbook', JSON.stringify(list.slice(0,100)));
  }catch(e){ /* localStorage may be unavailable */ }
}

function renderGuestbook(){
  const container = document.getElementById('guestbookList');
  const emptyMsg = document.getElementById('guestbookEmpty');
  if(!container) return;
  let list = [];
  try{ list = JSON.parse(localStorage.getItem('guestbook') || '[]'); }catch(e){}
  container.innerHTML = '';
  if(!list.length){ emptyMsg.style.display = 'block'; return; }
  emptyMsg.style.display = 'none';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'guestbook-card';
    const status = item.attendance === 'hadir' ? 'Akan hadir' : 'Tidak dapat hadir';
    card.innerHTML = `
      <p class="guestbook-name">${escapeHtml(item.name)}</p>
      <p class="body-caption">${status}</p>
      ${item.message ? `<p class="guestbook-msg">${escapeHtml(item.message)}</p>` : ''}
    `;
    container.appendChild(card);
  });
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- FAQ accordion ---------- */
function initFaq(){
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    q?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
}

/* ---------- Audio player ---------- */
function initAudioPlayer(){
  const audio = document.getElementById('bgAudio');
  const toggle = document.getElementById('audioToggle');
  const progress = document.getElementById('audioProgress');
  const volume = document.getElementById('audioVolume');
  const muteBtn = document.getElementById('audioMute');
  if(!audio) return;

  audio.volume = parseFloat(volume.value);

  toggle.addEventListener('click', () => {
    if(audio.paused){
      audio.play().then(() => toggle.classList.add('playing'));
    }else{
      audio.pause();
      toggle.classList.remove('playing');
    }
  });

  audio.addEventListener('timeupdate', () => {
    if(audio.duration){
      progress.value = (audio.currentTime/audio.duration)*100;
    }
  });
  progress.addEventListener('input', () => {
    if(audio.duration) audio.currentTime = (progress.value/100)*audio.duration;
  });
  volume.addEventListener('input', () => { audio.volume = parseFloat(volume.value); });
  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteBtn.textContent = audio.muted ? 'Unmute' : 'Mute';
  });
}

/* ---------- Scroll progress ---------- */
function initScrollProgress(){
  const fill = document.getElementById('scrollFill');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if(fill) fill.style.height = scrolled + '%';
  }, { passive:true });
}

/* ---------- Guest name from URL (?to=Nama) ---------- */
function initGuestName(){
  const params = new URLSearchParams(window.location.search);
  const to = params.get('to');
  const el = document.getElementById('guestName');
  if(to && el) el.textContent = decodeURIComponent(to);
}
