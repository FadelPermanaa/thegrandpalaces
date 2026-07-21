/* ============================================================
   MUSIC PLAYER — theme-song with smooth fade in/out
   ============================================================ */
(function () {
  var audio = document.getElementById('themeSong');
  var ambient = document.getElementById('ambientRiver');
  var player = document.getElementById('musicPlayer');
  var toggleBtn = document.getElementById('musicToggle');
  var muteBtn = document.getElementById('musicMute');
  var progress = document.getElementById('musicProgress');
  var volume = document.getElementById('musicVolume');
  if (!audio || !player) return;

  var TARGET_VOLUME = 0.55;
  audio.volume = 0;
  if (ambient) ambient.volume = 0;
  var fadeInterval = null;

  function fadeTo(el, target, durationMs) {
    if (!el) return;
    clearInterval(fadeInterval);
    var start = el.volume;
    var steps = 40;
    var stepTime = durationMs / steps;
    var stepAmount = (target - start) / steps;
    var count = 0;
    fadeInterval = setInterval(function () {
      count++;
      el.volume = Math.min(1, Math.max(0, start + stepAmount * count));
      if (count >= steps) clearInterval(fadeInterval);
    }, stepTime);
  }

  function play() {
    audio.play().catch(function () { /* autoplay may be blocked; user gesture required */ });
    if (ambient) ambient.play().catch(function () {});
    fadeTo(audio, volume ? volume.value / 100 : TARGET_VOLUME, 7000);
    if (ambient) fadeTo(ambient, 0.18, 7000);
    player.dataset.state = 'playing';
  }

  function pause() {
    fadeTo(audio, 0, 900);
    if (ambient) fadeTo(ambient, 0, 900);
    setTimeout(function () {
      audio.pause();
      if (ambient) ambient.pause();
    }, 950);
    player.dataset.state = 'paused';
  }

  window.themeSongControls = {
    playWithFadeIn: play,
    pauseWithFadeOut: pause
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (player.dataset.state === 'playing') pause();
      else play();
    });
  }

  audio.addEventListener('timeupdate', function () {
    if (!progress || !audio.duration) return;
    progress.value = (audio.currentTime / audio.duration) * 100;
  });
  if (progress) {
    progress.addEventListener('input', function () {
      if (!audio.duration) return;
      audio.currentTime = (progress.value / 100) * audio.duration;
    });
  }

  if (volume) {
    volume.addEventListener('input', function () {
      audio.volume = volume.value / 100;
    });
  }

  var isMuted = false;
  if (muteBtn) {
    muteBtn.addEventListener('click', function () {
      isMuted = !isMuted;
      audio.muted = isMuted;
      if (ambient) ambient.muted = isMuted;
      muteBtn.style.opacity = isMuted ? '.4' : '1';
    });
  }
})();
