/* =============================================================================
   OBSIDIAN NOIR — MAIN SCRIPT
   All media, names and details come from MEDIA_CONFIG / WEDDING_INFO
   (assets/js/media-config.js). Nothing here should need editing to
   personalize the invitation.
   ============================================================================= */

(function(){
  "use strict";

  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);

  const state = {
    invitationOpened: false,
    guestName: null,
    galleryIndex: 0
  };

  /* ---------------------------------------------------------------------
     0. GUEST NAME FROM URL (?to=Nama+Tamu)
  --------------------------------------------------------------------- */
  function getGuestNameFromURL(){
    try{
      const params = new URLSearchParams(window.location.search);
      const to = params.get('to');
      return to ? decodeURIComponent(to.replace(/\+/g,' ')) : null;
    }catch(e){ return null; }
  }

  /* ---------------------------------------------------------------------
     1. POPULATE STATIC CONTENT FROM MEDIA_CONFIG / WEDDING_INFO
  --------------------------------------------------------------------- */
  function setText(id, value){ const el = document.getElementById(id); if(el && value!=null) el.textContent = value; }
  function setSrc(id, value){
    const el = document.getElementById(id);
    if(!el || !value) return;
    el.setAttribute('src', value);
    attachMediaFallback(el);
  }

  // If a media file has not been placed yet, swap the broken-image icon
  // for a quiet on-brand placeholder instead (never an AI-generated photo).
  function attachMediaFallback(mediaEl){
    const handler = () => mediaEl.closest('img,video') && mediaEl.classList.add('media-missing');
    mediaEl.addEventListener('error', handler, { once:true });
  }

  function buildLetters(text){
    return text.split('').map(ch => `<span class="letter" style="animation-delay:${Math.random()*0.4+0.1}s">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
  }

  function formatDateHuman(iso){
    try{
      const d = new Date(iso);
      return d.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    }catch(e){ return iso; }
  }

  function populateContent(){
    if(typeof MEDIA_CONFIG === 'undefined' || typeof WEDDING_INFO === 'undefined') return;
    const M = MEDIA_CONFIG, W = WEDDING_INFO;

    // Gate
    const gateNames = document.getElementById('gateNames');
    if(gateNames){
      gateNames.innerHTML = `<span class="letters">${buildLetters(W.groom.shortName)}</span><span class="amp">&amp;</span><span class="letters">${buildLetters(W.bride.shortName)}</span>`;
    }
    state.guestName = getGuestNameFromURL();
    setText('guestNameDisplay', state.guestName || 'Tamu Undangan');

    // Hero
    setSrc('heroImg', M.heroImage);
    setText('heroGroom', W.groom.shortName);
    setText('heroBride', W.bride.shortName);
    setText('heroDate', formatDateHuman(W.akadDateTime));

    // Welcome
    setText('welcomeGroom', W.groom.shortName);
    setText('welcomeBride', W.bride.shortName);

    // Couple
    setSrc('groomImg', M.groomImage);
    setSrc('brideImg', M.brideImage);
    setText('groomName', W.groom.fullName);
    setText('brideName', W.bride.fullName);
    setText('groomParents', W.groom.parents);
    setText('brideParents', W.bride.parents);

    // Family
    setText('groomFamilyParents', W.groom.parents.replace('Putra dari ',''));
    setText('groomFamilyChild', `Ayahanda dari ${W.groom.shortName}`);
    setText('brideFamilyParents', W.bride.parents.replace('Putri dari ',''));
    setText('brideFamilyChild', `Ayahanda dari ${W.bride.shortName}`);

    // Trailer
    const trailerVideoEl = document.getElementById('trailerVideo');
    if(trailerVideoEl){ trailerVideoEl.setAttribute('src', M.trailerVideo); trailerVideoEl.setAttribute('poster', M.coupleImage); }

    // Event
    setText('akadDate', formatDateHuman(W.akadDateTime));
    setText('akadTime', W.akad.time);
    setText('akadVenue', `${W.akad.venue} — ${W.akad.address}`);
    setText('receptionDate', formatDateHuman(W.receptionDateTime));
    setText('receptionTime', W.reception.time);
    setText('receptionVenue', `${W.reception.venue} — ${W.reception.address}`);

    // Maps
    const mapsIframe = document.getElementById('mapsIframe');
    if(mapsIframe) mapsIframe.setAttribute('src', W.mapsEmbedSrc);
    setText('venueAddress', W.akad.address);
    setText('parkingInfo', W.parkingInfo);
    const navLink = document.getElementById('navigationLink');
    if(navLink) navLink.setAttribute('href', W.mapsDirectionUrl);

    const accList = document.getElementById('accommodationList');
    if(accList){
      accList.innerHTML = W.accommodation.map(h => `<li>${h.name} <span>${h.distance}</span></li>`).join('');
    }
    const restList = document.getElementById('restaurantList');
    if(restList){
      restList.innerHTML = W.nearbyRestaurants.map(r => `<li>${r.name} <span>${r.distance}</span></li>`).join('');
    }

    // Dress code
    setText('dressCodeDesc', W.dressCode.description);
    const swatchWrap = document.getElementById('dressCodeSwatches');
    if(swatchWrap){
      swatchWrap.innerHTML = W.dressCode.colors.map(c => `<span class="swatch" style="background:${c}"></span>`).join('');
    }

    // Gift
    setSrc('qrisImg', M.qrisImage);
    setText('giftBank1', W.gift.bankName);
    setText('giftAccount1', W.gift.accountNumber);
    setText('giftOwner1', `a.n. ${W.gift.accountName}`);
    setText('giftBank2', W.gift.bankName2);
    setText('giftAccount2', W.gift.accountNumber2);
    setText('giftOwner2', `a.n. ${W.gift.accountName2}`);
    const copyBtn = document.getElementById('copyAccountBtn');
    if(copyBtn) copyBtn.setAttribute('data-account', W.gift.accountNumber);

    // Hashtag
    setText('hashtagText', W.hashtag);

    // Contact
    const contactGrid = document.getElementById('contactGrid');
    if(contactGrid){
      contactGrid.innerHTML = W.contact.map(c => `
        <div class="contact-card glass-panel reveal">
          <h4>${c.name}</h4>
          <p>${c.role}</p>
        </div>`).join('');
    }

    // Ending + Footer
    setText('endingQuote', `"${W.closingQuote}"`);
    setText('endingGroom', W.groom.shortName);
    setText('endingBride', W.bride.shortName);
    setText('footerNames', `${W.groom.shortName} & ${W.bride.shortName}`);
    const dt = new Date(W.akadDateTime);
    setText('footerDate', `${String(dt.getDate()).padStart(2,'0')} . ${String(dt.getMonth()+1).padStart(2,'0')} . ${dt.getFullYear()}`);

    document.title = `${W.groom.shortName} & ${W.bride.shortName} — The Wedding Invitation`;
  }

  /* ---------------------------------------------------------------------
     2. CUSTOM CURSOR — magnetic follow + hover morph
  --------------------------------------------------------------------- */
  function initCursor(){
    if(window.matchMedia('(max-width: 860px)').matches || window.matchMedia('(pointer: coarse)').matches) return;
    const core = $('.cursor-core');
    const ring = $('.cursor-ring');
    if(!core || !ring) return;

    let mouseX=innerWidth/2, mouseY=innerHeight/2;
    let ringX=mouseX, ringY=mouseY;
    let coreX=mouseX, coreY=mouseY;

    on(window, 'mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    function raf(){
      coreX += (mouseX-coreX)*0.55;
      coreY += (mouseY-coreY)*0.55;
      ringX += (mouseX-ringX)*0.16;
      ringY += (mouseY-ringY)*0.16;
      core.style.transform = `translate(${coreX}px, ${coreY}px) rotate(45deg)`;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const hoverables = 'a, button, .gallery-item, .form-choice, input, textarea, select, .faq-q, .flip-card';
    document.addEventListener('mouseover', e => { if(e.target.closest(hoverables)) document.body.classList.add('cursor-hover'); });
    document.addEventListener('mouseout',  e => { if(e.target.closest(hoverables)) document.body.classList.remove('cursor-hover'); });

    // Occasional crystal spark trail on move
    let lastTrail = 0;
    on(window, 'mousemove', (e) => {
      const now = performance.now();
      if(now - lastTrail < 60) return;
      lastTrail = now;
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX+'px';
      trail.style.top = e.clientY+'px';
      document.body.appendChild(trail);
      requestAnimationFrame(()=>{
        trail.style.transition = 'transform .7s ease-out, opacity .7s ease-out';
        trail.style.transform = 'translate(-50%,-50%) scale(0.2)';
        trail.style.opacity = '0';
      });
      setTimeout(()=> trail.remove(), 750);
    });
  }

  /* ---------------------------------------------------------------------
     3. AMBIENT FLOATING DUST / CRYSTAL PARTICLES (canvas)
  --------------------------------------------------------------------- */
  function initAmbientDust(){
    const canvas = document.getElementById('dustCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w,h,particles;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function makeParticles(){
      const count = window.innerWidth < 760 ? 26 : 55;
      particles = Array.from({length:count}, () => ({
        x: Math.random()*w, y: Math.random()*h,
        r: Math.random()*1.6+0.4,
        vy: -(Math.random()*0.18+0.04),
        vx: (Math.random()-0.5)*0.08,
        o: Math.random()*0.5+0.15
      }));
    }
    resize(); makeParticles();
    on(window, 'resize', () => { resize(); makeParticles(); });

    function draw(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.y < -10){ p.y = h+10; p.x = Math.random()*w; }
        if(p.x < -10) p.x = w+10;
        if(p.x > w+10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(212,175,122,${p.o})`;
        ctx.shadowColor = 'rgba(212,175,122,0.8)';
        ctx.shadowBlur = 4;
        ctx.fill();
      });
      if(!reduceMotion) requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------------------------------------------------------------
     4. PRELOADER -> OPENING GATE
  --------------------------------------------------------------------- */
  function initPreloaderAndGate(){
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloaderBar');
    const gate = document.getElementById('gate');
    const openBtn = document.getElementById('openInvitationBtn');
    const bgAudio = document.getElementById('bgAudio');
    const audioPlayer = document.getElementById('audioPlayer');

    let progress = 0;
    const imagesToPreload = (typeof MEDIA_CONFIG !== 'undefined')
      ? [MEDIA_CONFIG.heroImage, MEDIA_CONFIG.groomImage, MEDIA_CONFIG.brideImage].filter(Boolean)
      : [];
    let loaded = 0;

    function bumpProgress(to){
      progress = Math.max(progress, to);
      if(bar) bar.style.width = progress + '%';
    }

    if(imagesToPreload.length){
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loaded++;
          bumpProgress(Math.round((loaded/imagesToPreload.length)*90));
        };
        img.src = src;
      });
    }

    // Guarantee forward progress even if assets are slow/missing
    let ticks = 0;
    const ticker = setInterval(() => {
      ticks++;
      bumpProgress(Math.min(96, progress + 6));
      if(progress >= 96 || ticks > 40){
        clearInterval(ticker);
        bumpProgress(100);
        setTimeout(() => {
          preloader.classList.add('is-hidden');
        }, 400);
      }
    }, 120);

    function openInvitation(){
      if(state.invitationOpened) return;
      state.invitationOpened = true;
      gate.classList.add('is-open');
      document.body.classList.remove('no-scroll');

      // Background music fade-in over 6-8s, only after explicit user gesture
      if(bgAudio && typeof MEDIA_CONFIG !== 'undefined' && MEDIA_CONFIG.backgroundMusic){
        bgAudio.src = MEDIA_CONFIG.backgroundMusic;
        bgAudio.volume = 0;
        const targetVolume = parseFloat(document.getElementById('audioVolume')?.value || 0.6);
        bgAudio.play().then(() => {
          audioPlayer.classList.add('is-visible', 'is-playing');
          const fadeDuration = 7000; // 6-8s fade-in
          const steps = 60;
          let step = 0;
          const fadeInterval = setInterval(() => {
            step++;
            bgAudio.volume = Math.min(targetVolume, (targetVolume * step/steps));
            if(step >= steps) clearInterval(fadeInterval);
          }, fadeDuration/steps);
        }).catch(() => {
          // Autoplay blocked — still reveal the player so guest can press play
          audioPlayer.classList.add('is-visible');
        });
      } else if(audioPlayer){
        audioPlayer.classList.add('is-visible');
      }

      setTimeout(() => { gate.style.display = 'none'; }, 1600);
    }

    on(openBtn, 'click', openInvitation);
  }

  /* ---------------------------------------------------------------------
     5. AUDIO PLAYER CONTROLS
  --------------------------------------------------------------------- */
  function initAudioPlayer(){
    const bgAudio = document.getElementById('bgAudio');
    const audioPlayer = document.getElementById('audioPlayer');
    const toggle = document.getElementById('audioToggle');
    const progress = document.getElementById('audioProgress');
    const progressFill = document.getElementById('audioProgressFill');
    const volume = document.getElementById('audioVolume');
    if(!bgAudio) return;

    on(toggle, 'click', () => {
      if(bgAudio.paused){ bgAudio.play().catch(()=>{}); audioPlayer.classList.add('is-playing'); }
      else { bgAudio.pause(); audioPlayer.classList.remove('is-playing'); }
    });

    on(bgAudio, 'timeupdate', () => {
      if(!bgAudio.duration) return;
      progressFill.style.width = (bgAudio.currentTime/bgAudio.duration*100) + '%';
    });
    on(progress, 'click', (e) => {
      const rect = progress.getBoundingClientRect();
      const ratio = (e.clientX-rect.left)/rect.width;
      if(bgAudio.duration) bgAudio.currentTime = ratio*bgAudio.duration;
    });
    on(volume, 'input', () => { bgAudio.volume = parseFloat(volume.value); });
  }

  /* ---------------------------------------------------------------------
     6. SCROLL PROGRESS RING + NAV DOTS
  --------------------------------------------------------------------- */
  function initScrollProgress(){
    const ring = document.getElementById('scrollRing');
    const ringFill = document.getElementById('ringFill');
    const circumference = 150.8;
    const navDots = $$('.nav-dots a');
    const sections = navDots.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

    on(window, 'scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? scrollTop/docHeight : 0;
      ringFill.style.strokeDashoffset = circumference - (ratio*circumference);
      ring.classList.toggle('is-visible', scrollTop > window.innerHeight*0.6);

      let activeIdx = 0;
      sections.forEach((sec, i) => {
        if(sec.getBoundingClientRect().top - window.innerHeight/2 < 0) activeIdx = i;
      });
      navDots.forEach((a,i) => a.classList.toggle('is-active', i === activeIdx));
    }, { passive:true });

    on(ring, 'click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  }

  /* ---------------------------------------------------------------------
     7. REVEAL ON SCROLL (IntersectionObserver)
  --------------------------------------------------------------------- */
  function initRevealObserver(){
    const targets = $$('.reveal, .reveal-scale, .timeline-item');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(t => io.observe(t));

    // Ending section quote/names (already has .in-view trigger class approach)
    const endingTargets = $$('.ending-quote, .ending-names, .ending-thanks');
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold:0.4 });
    endingTargets.forEach(t => io2.observe(t));
  }

  /* ---------------------------------------------------------------------
     8. LOVE STORY TIMELINE
  --------------------------------------------------------------------- */
  const TIMELINE_DATA = [
    { year:"2019", title:"Perjumpaan Pertama", text:"Dua langkah asing bertemu di sebuah lorong yang sama, tanpa tahu ke mana ia akan membawa." },
    { year:"2020", title:"Awal Kedekatan",     text:"Percakapan panjang berubah menjadi kebiasaan, dan kebiasaan berubah menjadi kerinduan." },
    { year:"2022", title:"Janji Untuk Serius", text:"Di tengah gemerlap malam, sebuah janji sederhana diucapkan — untuk saling menjaga." },
    { year:"2025", title:"Lamaran",            text:"Sebuah cincin, sebuah pertanyaan, dan jawaban yang telah lama dinantikan." },
    { year:"2026", title:"Menuju Pernikahan",  text:"Kini, kami melangkah bersama menuju babak baru — sebagai satu." }
  ];

  function buildTimeline(){
    const wrap = document.getElementById('timeline');
    if(!wrap) return;
    TIMELINE_DATA.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `
        <div class="timeline-content glass-panel">
          <span class="timeline-year">${item.year}</span>
          <h3 class="timeline-title">${item.title}</h3>
          <p class="timeline-text">${item.text}</p>
        </div>
        <div class="timeline-node"></div>
        <div></div>`;
      wrap.appendChild(el);
    });

    const items = $$('.timeline-item', wrap);
    const fill = document.getElementById('timelineFill');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('in-view'); });
    }, { threshold:0.35 });
    items.forEach(it => io.observe(it));

    on(window, 'scroll', () => {
      const rect = wrap.getBoundingClientRect();
      const total = rect.height;
      const visible = Math.min(Math.max(window.innerHeight*0.75 - rect.top, 0), total);
      fill.style.height = Math.round((visible/total)*100) + '%';
    }, { passive:true });
  }

  /* ---------------------------------------------------------------------
     9. GALLERY + LIGHTBOX
  --------------------------------------------------------------------- */
  function buildGallery(){
    const masonry = document.getElementById('galleryMasonry');
    const instaGrid = document.getElementById('instaGrid');
    if(typeof MEDIA_CONFIG === 'undefined') return;
    const images = MEDIA_CONFIG.galleryImages || [];

    if(masonry){
      masonry.innerHTML = images.map((src, i) => `
        <figure class="gallery-item reveal-scale" data-index="${i}" role="listitem" data-reveal-delay="${(i%3)+1}">
          <img src="${src}" alt="Momen galeri ${i+1}" loading="lazy" onerror="this.classList.add('media-missing')">
          <figcaption class="gallery-item-label">Lihat &#8599;</figcaption>
        </figure>`).join('');
    }
    if(instaGrid){
      instaGrid.innerHTML = images.slice(0,8).map((src,i) => `
        <figure class="gallery-item" data-index="${i}">
          <img src="${src}" alt="Instagram feed ${i+1}" loading="lazy" onerror="this.classList.add('media-missing')">
        </figure>`).join('');
    }

    // Re-run reveal observer for newly injected nodes
    const newTargets = $$('.gallery-masonry .reveal-scale, .insta-grid .gallery-item');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); } });
    }, { threshold:0.15 });
    newTargets.forEach(t => io.observe(t));

    initLightbox(images);
  }

  function initLightbox(images){
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    if(!lightbox) return;

    function openAt(i){
      state.galleryIndex = ((i % images.length) + images.length) % images.length;
      lightboxImg.src = images[state.galleryIndex];
      lightbox.classList.add('is-open');
      document.body.classList.add('no-scroll');
    }
    function close(){
      lightbox.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
    }

    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery-item');
      if(item && item.dataset.index !== undefined) openAt(parseInt(item.dataset.index,10));
    });
    on(closeBtn, 'click', close);
    on(prevBtn, 'click', () => openAt(state.galleryIndex-1));
    on(nextBtn, 'click', () => openAt(state.galleryIndex+1));
    on(lightbox, 'click', (e) => { if(e.target === lightbox) close(); });
    on(document, 'keydown', (e) => {
      if(!lightbox.classList.contains('is-open')) return;
      if(e.key === 'Escape') close();
      if(e.key === 'ArrowLeft') openAt(state.galleryIndex-1);
      if(e.key === 'ArrowRight') openAt(state.galleryIndex+1);
    });
  }

  /* ---------------------------------------------------------------------
     10. TRAILER VIDEO PLAY
  --------------------------------------------------------------------- */
  function initTrailer(){
    const frame = document.getElementById('trailerFrame');
    const video = document.getElementById('trailerVideo');
    const playBtn = document.getElementById('trailerPlayBtn');
    if(!frame || !video) return;
    on(playBtn, 'click', () => {
      video.play().then(() => frame.classList.add('is-playing')).catch(()=>{});
    });
    on(video, 'pause', () => frame.classList.remove('is-playing'));
    on(video, 'ended', () => frame.classList.remove('is-playing'));
  }

  /* ---------------------------------------------------------------------
     11. COUNTDOWN — flip animation
  --------------------------------------------------------------------- */
  function initCountdown(){
    const els = {
      d: document.getElementById('cdDays'),
      h: document.getElementById('cdHours'),
      m: document.getElementById('cdMinutes'),
      s: document.getElementById('cdSeconds')
    };
    if(!els.d || typeof WEDDING_INFO === 'undefined') return;
    const target = new Date(WEDDING_INFO.akadDateTime).getTime();
    const prev = { d:null, h:null, m:null, s:null };

    function setFlip(el, value, key){
      const str = String(Math.max(0,value)).padStart(2,'0');
      if(prev[key] !== str){
        el.textContent = str;
        el.classList.remove('flip-anim');
        void el.offsetWidth; // restart animation
        el.classList.add('flip-anim');
        prev[key] = str;
      }
    }

    function tick(){
      const now = Date.now();
      let diff = Math.max(0, target-now);
      const d = Math.floor(diff/86400000); diff -= d*86400000;
      const h = Math.floor(diff/3600000); diff -= h*3600000;
      const m = Math.floor(diff/60000); diff -= m*60000;
      const s = Math.floor(diff/1000);
      setFlip(els.d, d, 'd'); setFlip(els.h, h, 'h'); setFlip(els.m, m, 'm'); setFlip(els.s, s, 's');
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------------
     12. CALENDAR LINKS (Google / Apple .ics)
  --------------------------------------------------------------------- */
  function toICSDate(iso){
    return new Date(iso).toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
  }
  function initCalendarLinks(){
    $$('[data-calendar]').forEach(btn => {
      on(btn, 'click', () => {
        if(typeof WEDDING_INFO === 'undefined') return;
        const which = btn.dataset.event === 'akad' ? WEDDING_INFO.akad : WEDDING_INFO.reception;
        const startISO = btn.dataset.event === 'akad' ? WEDDING_INFO.akadDateTime : WEDDING_INFO.receptionDateTime;
        const start = new Date(startISO);
        const end = new Date(start.getTime() + 3*60*60*1000);
        const title = encodeURIComponent(`${which.label} — ${WEDDING_INFO.groom.shortName} & ${WEDDING_INFO.bride.shortName}`);
        const details = encodeURIComponent(which.address);
        const location = encodeURIComponent(which.venue + ', ' + which.address);

        if(btn.dataset.calendar === 'google'){
          const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${toICSDate(start)}/${toICSDate(end)}&details=${details}&location=${location}`;
          window.open(url, '_blank');
        } else {
          const ics = [
            'BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',
            `DTSTART:${toICSDate(start)}`,`DTEND:${toICSDate(end)}`,
            `SUMMARY:${which.label} — ${WEDDING_INFO.groom.shortName} & ${WEDDING_INFO.bride.shortName}`,
            `LOCATION:${which.venue}, ${which.address}`,
            'END:VEVENT','END:VCALENDAR'
          ].join('\n');
          const blob = new Blob([ics], { type:'text/calendar' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `${which.label.replace(/\s+/g,'-')}.ics`;
          a.click();
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     13. GIFT — copy account / download QR
  --------------------------------------------------------------------- */
  function showToast(msg){
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-shown');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-shown'), 2600);
  }

  function initGiftActions(){
    const copyBtn = document.getElementById('copyAccountBtn');
    const giftToast = document.getElementById('giftToast');
    on(copyBtn, 'click', async () => {
      const acc = copyBtn.dataset.account;
      try{
        await navigator.clipboard.writeText(acc);
      }catch(e){ /* clipboard may be unavailable — fail silently, UI still confirms */ }
      giftToast.classList.add('is-shown');
      setTimeout(()=> giftToast.classList.remove('is-shown'), 2200);
      showToast('Nomor rekening disalin');
    });

    const downloadBtn = document.getElementById('downloadQrBtn');
    on(downloadBtn, 'click', () => {
      if(typeof MEDIA_CONFIG === 'undefined') return;
      const a = document.createElement('a');
      a.href = MEDIA_CONFIG.qrisImage;
      a.download = 'qris-wedding-gift.webp';
      a.click();
    });
  }

  /* ---------------------------------------------------------------------
     14. RSVP FORM — attendance choice + submit success burst
  --------------------------------------------------------------------- */
  function initRSVP(){
    const form = document.getElementById('rsvpForm');
    if(!form) return;
    const choiceGroup = document.getElementById('rsvpAttendance');
    let attendance = 'hadir';

    on(choiceGroup, 'click', (e) => {
      const btn = e.target.closest('.form-choice');
      if(!btn) return;
      $$('.form-choice', choiceGroup).forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      attendance = btn.dataset.value;
    });

    on(form, 'submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value.trim();
      if(!name) return;

      const success = document.getElementById('rsvpSuccess');
      $$('.form-row', form).forEach(r => r.style.display = 'none');
      form.querySelector('.rsvp-submit').style.display = 'none';
      success.classList.add('is-shown');
      burstParticles(document.getElementById('rsvpParticles'));

      // Also drop a matching entry into the guest book so the guest sees
      // their own confirmation reflected immediately.
      const msg = document.getElementById('rsvpMessage').value.trim();
      if(msg) addGuestbookEntry(name, msg, attendance);

      showToast('Konfirmasi kehadiran terkirim');
    });
  }

  function burstParticles(container){
    if(!container) return;
    const colors = ['#d4af7a', '#ecd3a0', '#b9793f'];
    for(let i=0;i<24;i++){
      const p = document.createElement('span');
      const angle = (Math.PI*2/24)*i + Math.random()*0.3;
      const dist = 60 + Math.random()*80;
      p.style.cssText = `position:absolute; left:50%; top:30%; width:5px; height:5px; border-radius:1px;
        background:${colors[i%colors.length]}; transform:translate(-50%,-50%) rotate(45deg);
        box-shadow:0 0 8px rgba(212,175,122,0.8); pointer-events:none;
        transition:transform 1s cubic-bezier(.16,.8,.24,1), opacity 1s ease-out;`;
      container.appendChild(p);
      requestAnimationFrame(() => {
        p.style.transform = `translate(${Math.cos(angle)*dist - 50}%, ${Math.sin(angle)*dist + -50}%) rotate(180deg)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 1100);
    }
  }

  /* ---------------------------------------------------------------------
     15. GUEST BOOK — in-memory wall (session only, no backend wired)
  --------------------------------------------------------------------- */
  const guestbookEntries = [];

  function addGuestbookEntry(name, message, attendance){
    guestbookEntries.unshift({ name, message, attendance: attendance || 'hadir' });
    renderGuestbook();
  }

  function renderGuestbook(){
    const wall = document.getElementById('guestbookWall');
    if(!wall) return;
    if(!guestbookEntries.length){
      wall.innerHTML = `<p class="guest-empty">Jadilah yang pertama meninggalkan ucapan &amp; doa.</p>`;
      return;
    }
    const attendLabel = { 'hadir':'Hadir', 'tidak-hadir':'Tidak Hadir', 'ragu':'Masih Ragu' };
    wall.innerHTML = guestbookEntries.map(entry => `
      <div class="guest-card glass-panel">
        <div class="guest-avatar">${(entry.name||'?').trim().charAt(0).toUpperCase()}</div>
        <div>
          <span class="guest-name">${escapeHTML(entry.name)}</span><span class="guest-attend">${attendLabel[entry.attendance]||''}</span>
          <p class="guest-msg">${escapeHTML(entry.message)}</p>
        </div>
      </div>`).join('');
  }

  function escapeHTML(str){
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initGuestbookForm(){
    const form = document.getElementById('guestbookForm');
    if(!form) return;
    renderGuestbook();
    on(form, 'submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('gbName').value.trim();
      const message = document.getElementById('gbMessage').value.trim();
      if(!name || !message) return;
      addGuestbookEntry(name, message, 'hadir');
      form.reset();
      showToast('Ucapan Anda telah terkirim');
    });
  }

  /* ---------------------------------------------------------------------
     16. FAQ ACCORDION
  --------------------------------------------------------------------- */
  const FAQ_DATA = [
    { q:"Apakah anak-anak diperkenankan hadir?", a:"Demi kenyamanan bersama pada malam hari yang formal, kami mohon maaf undangan ini berlaku untuk dewasa." },
    { q:"Apakah tersedia area parkir di venue?", a:"Ya, valet parking tersedia di lobby utama dan area parkir basement dengan kapasitas yang memadai." },
    { q:"Bagaimana jika saya belum bisa memastikan kehadiran?", a:"Anda dapat memilih opsi 'Masih Ragu' pada formulir RSVP, dan memperbarui konfirmasi kapan saja sebelum hari pernikahan." },
    { q:"Apakah ada dress code khusus?", a:"Kami mengundang Anda mengenakan busana formal dengan palet warna gelap, bronze, atau emas champagne." }
  ];
  function buildFAQ(){
    const list = document.getElementById('faqList');
    if(!list) return;
    list.innerHTML = FAQ_DATA.map((item,i) => `
      <div class="faq-item reveal" data-reveal-delay="${(i%3)+1}">
        <button class="faq-q" type="button" aria-expanded="false">
          <span>${item.q}</span><span class="plus"></span>
        </button>
        <div class="faq-a"><p>${item.a}</p></div>
      </div>`).join('');

    $$('.faq-item', list).forEach(item => {
      const q = item.querySelector('.faq-q');
      on(q, 'click', () => {
        const isOpen = item.classList.contains('is-open');
        $$('.faq-item', list).forEach(i => { i.classList.remove('is-open'); i.querySelector('.faq-q').setAttribute('aria-expanded','false'); });
        if(!isOpen){ item.classList.add('is-open'); q.setAttribute('aria-expanded','true'); }
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in-view'); io.unobserve(entry.target); } });
    }, { threshold:0.2 });
    $$('.faq-item', list).forEach(t => io.observe(t));
  }

  /* ---------------------------------------------------------------------
     17. INIT
  --------------------------------------------------------------------- */
  function init(){
    populateContent();
    initPreloaderAndGate();
    initAudioPlayer();
    initCursor();
    initAmbientDust();
    initScrollProgress();
    buildTimeline();
    buildGallery();
    initTrailer();
    initCountdown();
    initCalendarLinks();
    initGiftActions();
    initRSVP();
    initGuestbookForm();
    buildFAQ();
    initRevealObserver();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
