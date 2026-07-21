(function(){
"use strict";

/* =========================================================================
   HELPERS
   ========================================================================= */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min,max) => Math.random()*(max-min)+min;

function applyMediaBindings(){
  const setBg = (el, url) => { if(el && url) el.style.backgroundImage = `url("${url}")`; };
  setBg($('#heroMedia'), MEDIA.heroImage);
  setBg($('#groomPhoto'), MEDIA.groomImage);
  setBg($('#bridePhoto'), MEDIA.brideImage);
  setBg($('#couplePortrait'), MEDIA.coupleImage);

  const trailerVideo = $('#trailerVideoEl');
  if(trailerVideo){ trailerVideo.src = MEDIA.trailerVideo; }

  const audio = $('#bgAudio');
  if(audio){ audio.src = MEDIA.backgroundMusic; }

  const qris = $('#qrisImage');
  if(qris){ qris.src = MEDIA.qrisImage; }
  const dlQr = $('#btnDownloadQr');
  if(dlQr){ dlQr.href = MEDIA.qrisImage; }

  const bankAcc = $('#bankAccount');
  if(bankAcc){ bankAcc.textContent = MEDIA.bankAccount; }

  const mapFrame = $('.map-wrap iframe');
  if(mapFrame){ mapFrame.src = MEDIA.mapsEmbedUrl; }
  const mapLink = document.querySelector('.venue-info a[href*="google"]');
  if(mapLink){ mapLink.href = MEDIA.mapsLinkUrl; }
}

/* =========================================================================
   CUSTOM CURSOR — ROYAL CREST
   ========================================================================= */
function initCursor(){
  const dot = $('#cursorDot'), ring = $('#cursorRing');
  if(!dot || !ring) return;
  if(window.matchMedia('(hover:none), (pointer:coarse)').matches) return;

  let mx=0,my=0, rx=0, ry=0;
  window.addEventListener('mousemove', e=>{
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });
  function loop(){
    rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  const hoverables = 'a, button, input, textarea, select, .masonry-item, [data-hover]';
  document.addEventListener('mouseover', e=>{
    if(e.target.closest(hoverables)) ring.classList.add('hover');
  });
  document.addEventListener('mouseout', e=>{
    if(e.target.closest(hoverables)) ring.classList.remove('hover');
  });
}

/* =========================================================================
   CANVAS PARTICLE ENGINE — golden dust, floating light, soft glow blobs
   Reusable generator used by preloader, opening, ambient bg, ending, footer
   ========================================================================= */
function createParticleField(canvas, opts={}){
  const ctx = canvas.getContext('2d');
  let w,h,dpr;
  let motes = [], glows = [], sparks = [];
  const density = opts.density || 0.00022;
  const withGlow = opts.glow !== false;
  const withSparks = opts.sparks || false;
  const speed = opts.speed || 1;
  let running = true;
  let rafId;

  function resize(){
    dpr = Math.min(window.devicePixelRatio||1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.max(40, Math.floor(w*h*density));
    motes = Array.from({length:count}, ()=>({
      x: rand(0,w), y: rand(0,h), r: rand(0.5,2.2),
      tw: rand(0,Math.PI*2), tws: rand(0.008,0.022),
      drift: rand(-0.15,-0.03)
    }));
    if(withGlow){
      glows = Array.from({length:4}, ()=>({
        x: rand(0,w), y: rand(0,h), r: rand(w*0.16,w*0.34),
        alpha: rand(0.05,0.11), drift: rand(-0.04,0.04)
      }));
    }
  }
  window.addEventListener('resize', resize);
  resize();

  function spawnSpark(){
    sparks.push({
      x: rand(0,w), y: rand(0,h),
      life:0, maxLife: rand(30,55)
    });
  }
  let sparkTimer = 0;

  function draw(){
    if(!running) return;
    ctx.clearRect(0,0,w,h);

    if(withGlow){
      glows.forEach(gl=>{
        gl.x += gl.drift*speed; gl.y += gl.drift*0.6*speed;
        const g = ctx.createRadialGradient(gl.x,gl.y,0,gl.x,gl.y,gl.r);
        g.addColorStop(0, `rgba(201,168,106,${gl.alpha})`);
        g.addColorStop(1, 'rgba(201,168,106,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(gl.x,gl.y,gl.r,0,Math.PI*2); ctx.fill();
      });
    }

    motes.forEach(s=>{
      s.tw += s.tws;
      s.y += s.drift*speed;
      s.x += Math.sin(s.tw*0.5)*0.15;
      if(s.y<0) s.y=h; if(s.y>h) s.y=0;
      const alpha = 0.35 + Math.abs(Math.sin(s.tw))*0.5;
      ctx.beginPath();
      ctx.fillStyle = `rgba(232,213,168,${alpha})`;
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });

    if(withSparks){
      sparkTimer++;
      if(sparkTimer > 60){ sparkTimer=0; if(Math.random()>0.3) spawnSpark(); }
      sparks.forEach(sp=>{
        sp.life++;
        const p = sp.life/sp.maxLife;
        const alpha = Math.sin(p*Math.PI);
        ctx.save();
        ctx.translate(sp.x, sp.y);
        ctx.rotate(p*Math.PI);
        ctx.strokeStyle = `rgba(250,240,210,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-4,0); ctx.lineTo(4,0); ctx.moveTo(0,-4); ctx.lineTo(0,4);
        ctx.stroke();
        ctx.restore();
      });
      sparks = sparks.filter(sp=> sp.life < sp.maxLife);
    }

    rafId = requestAnimationFrame(draw);
  }
  rafId = requestAnimationFrame(draw);

  return {
    stop(){ running=false; cancelAnimationFrame(rafId); }
  };
}

/* =========================================================================
   PRELOADER
   ========================================================================= */
function initPreloader(cb){
  const canvas = $('#preloaderCanvas');
  const engine = createParticleField(canvas, {density:0.00035, glow:true, sparks:true});
  const fill = $('#preloaderFill');

  let progress = 0;
  const interval = setInterval(()=>{
    progress += rand(4,12);
    if(progress>=100){ progress=100; clearInterval(interval); }
    fill.style.width = progress+'%';
    if(progress>=100){
      setTimeout(()=>{
        $('#preloader').classList.add('hide');
        engine.stop();
        cb && cb();
      }, 400);
    }
  }, 180);
}

/* =========================================================================
   OPENING SEQUENCE
   ========================================================================= */
function initOpening(){
  const canvas = $('#openingCanvas');
  const engine = createParticleField(canvas, {density:0.0003, glow:true, sparks:true, speed:0.6});

  $$('.opening-names .letters').forEach(el=>{
    const text = el.dataset.text;
    el.innerHTML = text.split('').map((ch,i)=>`<span style="animation-delay:${0.6+i*0.05}s">${ch===' '?'&nbsp;':ch}</span>`).join('');
  });

  const btn = $('#btnOpenInvitation');
  const audio = $('#bgAudio');
  const audioPlayer = $('#audioPlayer');
  const openingSection = $('#opening');

  btn.addEventListener('click', ()=>{
    openingSection.classList.add('gate-open');
    setTimeout(()=>{
      openingSection.classList.add('hide');
      document.body.style.overflow = '';
      engine.stop();
    }, 900);

    // Fade in music 6-8s
    audio.volume = 0;
    audio.play().catch(()=>{ /* autoplay might be blocked, user can press play button */ });
    audioPlayer.classList.add('show');
    let vol = 0;
    const targetDur = 7000; const stepMs = 120;
    const steps = targetDur/stepMs;
    const inc = 0.55/steps;
    const fadeTimer = setInterval(()=>{
      vol = Math.min(0.55, vol+inc);
      audio.volume = vol;
      if(vol>=0.55) clearInterval(fadeTimer);
    }, stepMs);

    setToggleIcon(true);
    revealHero();
  }, {once:true});
}

function revealHero(){
  document.body.style.overflow = 'auto';
  const heroContent = $('.hero-content');
  if(heroContent){
    heroContent.style.opacity=0; heroContent.style.transform='translateY(30px)';
    heroContent.style.transition='opacity 1.6s ease, transform 1.6s ease';
    requestAnimationFrame(()=>{
      setTimeout(()=>{ heroContent.style.opacity=1; heroContent.style.transform='translateY(0)'; }, 500);
    });
  }
}

/* =========================================================================
   AMBIENT / ENDING / FOOTER PARTICLE FIELDS
   ========================================================================= */
function initAmbientCanvases(){
  createParticleField($('#ambientCanvas'), {density:0.00012, glow:true, speed:0.4});
  createParticleField($('#footerCanvas'), {density:0.00016, glow:true, speed:0.3});

  const endingCanvas = $('#endingCanvas');
  createParticleField(endingCanvas, {density:0.00045, glow:true, sparks:true, speed:1});

  const endingSection = $('#ending');
  const endingContent = $('.ending-content');
  const endingGate = $('.ending-gate');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        endingGate.classList.add('show');
        setTimeout(()=>endingGate.classList.add('closing'), 1200);
        setTimeout(()=>endingContent.classList.add('show'), 2600);
      }
    });
  }, {threshold:0.4});
  io.observe(endingSection);
}

/* =========================================================================
   SCROLL REVEAL
   ========================================================================= */
function initReveal(){
  const els = $$('.reveal');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, {threshold:0.15});
  els.forEach(el=>io.observe(el));
}

/* =========================================================================
   SCROLL PROGRESS
   ========================================================================= */
function initScrollOrbit(){
  const orbitFill = $('#orbitFill');
  const orbitDot = $('#orbitDot');
  const orbitWrap = $('#scrollOrbit');
  const circumference = 163;
  window.addEventListener('scroll', ()=>{
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH>0 ? scrollTop/docH : 0;
    orbitFill.style.strokeDashoffset = circumference - (circumference*pct);
    const angle = pct*360 - 90;
    const rad = angle*Math.PI/180;
    orbitDot.style.transform = `translate(-50%,-50%) translate(${26*Math.cos(rad)}px, ${26*Math.sin(rad)}px)`;
    orbitWrap.classList.toggle('show', scrollTop>window.innerHeight*0.4);
  }, {passive:true});
}

/* =========================================================================
   LOVE STORY — position nodes along corridor path
   ========================================================================= */
function initStoryPath(){
  const path = $('#storyPath');
  if(!path) return;
  const length = path.getTotalLength();
  $$('.story-node').forEach(node=>{
    const pos = parseFloat(node.dataset.pos);
    const pt = path.getPointAtLength(length*pos);
    node.style.setProperty('--sx', pt.x);
    node.style.setProperty('--sy', pt.y);
  });
}

/* =========================================================================
   COUNTDOWN
   ========================================================================= */
function initCountdown(){
  const target = new Date(MEDIA.eventDate).getTime();
  const els = {
    days: $('#cdDays'), hours: $('#cdHours'), minutes: $('#cdMinutes'), seconds: $('#cdSeconds')
  };
  const units = { days: $('.flip-unit[data-unit="days"] .flip-glass'), hours: $('.flip-unit[data-unit="hours"] .flip-glass'),
    minutes: $('.flip-unit[data-unit="minutes"] .flip-glass'), seconds: $('.flip-unit[data-unit="seconds"] .flip-glass') };
  let prev = {};

  function tick(){
    const now = Date.now();
    const diff = Math.max(0, target-now);
    const d = Math.floor(diff/86400000);
    const h = Math.floor((diff%86400000)/3600000);
    const m = Math.floor((diff%3600000)/60000);
    const s = Math.floor((diff%60000)/1000);
    const vals = {days:d,hours:h,minutes:m,seconds:s};
    Object.keys(vals).forEach(k=>{
      const str = String(vals[k]).padStart(2,'0');
      if(prev[k] !== str){
        els[k].textContent = str;
        units[k].classList.remove('flip'); void units[k].offsetWidth; units[k].classList.add('flip');
        prev[k] = str;
      }
    });
  }
  tick();
  setInterval(tick, 1000);
}

/* =========================================================================
   CALENDAR / COPY HELPERS
   ========================================================================= */
function pad(n){ return String(n).padStart(2,'0'); }
function toGCalDate(d){
  return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+'00Z';
}
function initCalendarButtons(){
  const start = new Date(MEDIA.eventDate);
  const end = new Date(MEDIA.eventEndDate);
  const gBtn = $('#btnGoogleCal');
  if(gBtn) gBtn.addEventListener('click', ()=>{
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(MEDIA.eventTitle)}&dates=${toGCalDate(start)}/${toGCalDate(end)}&location=${encodeURIComponent(MEDIA.eventLocation)}`;
    window.open(url, '_blank');
  });
  const aBtn = $('#btnAppleCal');
  if(aBtn) aBtn.addEventListener('click', ()=>{
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${MEDIA.eventTitle}\nDTSTART:${toGCalDate(start)}\nDTEND:${toGCalDate(end)}\nLOCATION:${MEDIA.eventLocation}\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([ics], {type:'text/calendar'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'wedding-invitation.ics';
    link.click();
  });

  $$('[data-copy-address]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      navigator.clipboard.writeText(btn.dataset.copyAddress).then(()=>{
        const orig = btn.textContent; btn.textContent = 'Tersalin!';
        setTimeout(()=>btn.textContent=orig, 1800);
      });
    });
  });

  const copyAccBtn = $('#btnCopyAccount');
  if(copyAccBtn) copyAccBtn.addEventListener('click', ()=>{
    navigator.clipboard.writeText(MEDIA.bankAccount.replace(/\s/g,'')).then(()=>{
      const orig = copyAccBtn.textContent; copyAccBtn.textContent = 'Tersalin!';
      setTimeout(()=>copyAccBtn.textContent=orig, 1800);
    });
  });
}

/* =========================================================================
   GALLERY MASONRY + LIGHTBOX
   ========================================================================= */
function initGallery(){
  const grid = $('#masonryGrid');
  if(!grid) return;
  MEDIA.galleryImages.forEach((src,i)=>{
    const item = document.createElement('div');
    item.className = 'masonry-item';
    item.dataset.index = i;
    item.innerHTML = `<img src="${src}" loading="lazy" alt="Momen ${i+1}">`;
    grid.appendChild(item);
  });

  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  let current = 0;

  function open(i){
    current = i;
    lightboxImg.src = MEDIA.galleryImages[i];
    lightbox.classList.add('open');
  }
  function close(){ lightbox.classList.remove('open'); }
  function nav(delta){
    current = (current + delta + MEDIA.galleryImages.length) % MEDIA.galleryImages.length;
    lightboxImg.src = MEDIA.galleryImages[current];
  }

  grid.addEventListener('click', e=>{
    const item = e.target.closest('.masonry-item');
    if(item) open(parseInt(item.dataset.index,10));
  });
  $('#lightboxClose').addEventListener('click', close);
  $('#lightboxPrev').addEventListener('click', ()=>nav(-1));
  $('#lightboxNext').addEventListener('click', ()=>nav(1));
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox) close(); });
  document.addEventListener('keydown', e=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') nav(-1);
    if(e.key==='ArrowRight') nav(1);
  });
}

/* =========================================================================
   TRAILER VIDEO
   ========================================================================= */
function initTrailer(){
  const btn = $('#trailerPlayBtn');
  const video = $('#trailerVideoEl');
  const frame = $('#trailerFrame');
  if(!btn || !video) return;
  btn.addEventListener('click', ()=>{
    video.play().then(()=>{
      frame.classList.add('playing');
      video.setAttribute('controls','');
    }).catch(()=>{ /* file not present yet */ });
  });
}

/* =========================================================================
   RSVP + GUEST BOOK (persisted locally)
   ========================================================================= */
function initRSVP(){
  const form = $('#rsvpForm');
  const grid = $('#guestbookGrid');
  if(!form) return;

  const STORAGE_KEY = 'royal-wedding-guestbook';
  function loadEntries(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){ return []; }
  }
  function saveEntries(entries){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
  function renderEntries(){
    const entries = loadEntries();
    grid.innerHTML = '';
    if(entries.length===0){
      grid.innerHTML = `<p style="color:var(--royal-beige); grid-column:1/-1; text-align:center;">Jadilah yang pertama mengirimkan ucapan.</p>`;
      return;
    }
    entries.slice().reverse().forEach(entry=>{
      const card = document.createElement('div');
      card.className = 'gb-card';
      card.innerHTML = `<h5>${escapeHtml(entry.name)} ${entry.attend==='hadir' ? '' : '(berhalangan hadir)'}</h5><p>${escapeHtml(entry.msg || 'Turut berbahagia atas pernikahan kalian.')}</p>`;
      grid.appendChild(card);
    });
  }
  function escapeHtml(str){
    const d = document.createElement('div'); d.textContent = str; return d.innerHTML;
  }
  renderEntries();

  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = $('#rsvpName').value.trim();
    const guests = $('#rsvpGuests').value;
    const attend = $('input[name="attend"]:checked').value;
    const msg = $('#rsvpMsg').value.trim();
    if(!name) return;

    const entries = loadEntries();
    entries.push({name, guests, attend, msg, ts:Date.now()});
    saveEntries(entries);
    renderEntries();

    triggerGoldenConfetti(form);

    form.innerHTML = `<div class="rsvp-success">Terima kasih, ${escapeHtml(name)}. &#9813;<br><span style="font-size:.9rem; color:var(--royal-beige); font-family:var(--font-body);">Konfirmasi Anda telah kami terima.</span></div>`;
  });
}

function triggerGoldenConfetti(anchor){
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + window.scrollY;
  const colors = ['#c9a86a','#e8d5a8','#faf7f0','#8a6d3b'];
  const burst = document.createElement('div');
  burst.style.cssText = `position:absolute; left:${cx}px; top:${cy}px; width:0; height:0; z-index:5000; pointer-events:none;`;
  document.body.appendChild(burst);
  for(let i=0;i<36;i++){
    const p = document.createElement('span');
    const angle = rand(-Math.PI*0.15, Math.PI*1.15);
    const dist = rand(80,220);
    const size = rand(4,8);
    const color = colors[Math.floor(rand(0,colors.length))];
    p.style.cssText = `position:absolute; width:${size}px; height:${size*0.4}px; background:${color}; left:0; top:0; opacity:1; box-shadow:0 0 6px ${color}; transition:transform 1.3s cubic-bezier(.16,.84,.44,1), opacity 1.3s;`;
    burst.appendChild(p);
    requestAnimationFrame(()=>{
      const fallX = Math.cos(angle)*dist;
      const fallY = Math.abs(Math.sin(angle))*dist + rand(40,100);
      p.style.transform = `translate(${fallX}px, ${fallY}px) rotate(${rand(180,720)}deg)`;
      p.style.opacity = '0';
    });
  }
  setTimeout(()=>burst.remove(), 1400);
}

/* =========================================================================
   FAQ ACCORDION
   ========================================================================= */
function initAccordion(){
  $$('.acc-item').forEach(item=>{
    const head = $('.acc-head', item);
    const body = $('.acc-body', item);
    head.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      $$('.acc-item').forEach(other=>{
        other.classList.remove('open');
        $('.acc-body', other).style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* =========================================================================
   AUDIO PLAYER CONTROLS
   ========================================================================= */
function setToggleIcon(playing){
  const playIcon = $('.icon-play'), pauseIcon = $('.icon-pause');
  if(!playIcon) return;
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
}
function initAudioPlayer(){
  const audio = $('#bgAudio');
  const toggle = $('#audioToggle');
  const mute = $('#audioMute');
  const fill = $('#audioProgressFill');
  if(!audio) return;

  toggle.addEventListener('click', ()=>{
    if(audio.paused){ audio.play(); setToggleIcon(true); }
    else { audio.pause(); setToggleIcon(false); }
  });
  mute.addEventListener('click', ()=>{
    audio.muted = !audio.muted;
    mute.style.opacity = audio.muted ? 0.4 : 1;
  });
  audio.addEventListener('timeupdate', ()=>{
    if(audio.duration){ fill.style.width = (audio.currentTime/audio.duration*100)+'%'; }
  });
  audio.addEventListener('play', ()=>setToggleIcon(true));
  audio.addEventListener('pause', ()=>setToggleIcon(false));
}

/* =========================================================================
   INIT
   ========================================================================= */
document.addEventListener('DOMContentLoaded', ()=>{
  document.body.style.overflow = 'hidden';
  applyMediaBindings();
  initCursor();

  initPreloader(()=>{
    initOpening();
  });

  initAmbientCanvases();
  initReveal();
  initScrollOrbit();
  initStoryPath();
  initCountdown();
  initCalendarButtons();
  initGallery();
  initTrailer();
  initRSVP();
  initAccordion();
  initAudioPlayer();
});

})();
