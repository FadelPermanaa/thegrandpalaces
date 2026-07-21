/* ============================================================
   FORMS — RSVP, Guest Book, Gift Confirmation
   ============================================================ */
(function () {
  var CFG = window.WEDDING_CONFIG || {};
  var KEYS = CFG.storageKeys || { guestbook: 'sakura_wedding_guestbook', rsvp: 'sakura_wedding_rsvp' };

  function readList(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function writeList(key, list) {
    try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }
  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------- RSVP ---------------- */
  var rsvpForm = document.getElementById('rsvpForm');
  var rsvpSuccess = document.getElementById('rsvpSuccess');
  var rsvpPetalsCanvas = document.getElementById('rsvpPetals');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('rsvpName').value.trim();
      var guests = document.getElementById('rsvpGuests').value;
      var attendance = rsvpForm.querySelector('input[name="attendance"]:checked');
      var message = document.getElementById('rsvpMessage').value.trim();
      if (!name) return;

      var list = readList(KEYS.rsvp);
      list.push({
        name: name,
        guests: guests,
        attendance: attendance ? attendance.value : 'hadir',
        message: message,
        date: new Date().toISOString()
      });
      writeList(KEYS.rsvp, list);

      rsvpForm.style.display = 'none';
      rsvpSuccess.classList.add('is-visible');
      rsvpSuccess.setAttribute('aria-hidden', 'false');

      if (rsvpPetalsCanvas && window.PetalField) {
        var burst = new window.PetalField(rsvpPetalsCanvas, { density: 30, speed: 1.4 });
        burst.start();
        setTimeout(function () { burst.stop(); }, 3200);
      }

      // If the message was left and attendance is "hadir" or any, also mirror to guestbook feed
      if (message) {
        addGuestbookEntry(name, message);
      }
    });
  }

  /* ---------------- Guest Book ---------------- */
  var guestbookForm = document.getElementById('guestbookForm');
  var guestbookList = document.getElementById('guestbookList');

  function renderGuestbook() {
    if (!guestbookList) return;
    var list = readList(KEYS.guestbook).slice().reverse();
    if (!list.length) {
      guestbookList.innerHTML = '<p class="guestbook__empty">Jadilah yang pertama menuliskan ucapan &amp; doa.</p>';
      return;
    }
    guestbookList.innerHTML = list.map(function (entry) {
      return '<div class="guestbook__card"><h4>' + escapeHTML(entry.name) + '</h4><p>' + escapeHTML(entry.message) + '</p></div>';
    }).join('');
  }

  function addGuestbookEntry(name, message) {
    var list = readList(KEYS.guestbook);
    list.push({ name: name, message: message, date: new Date().toISOString() });
    writeList(KEYS.guestbook, list);
    renderGuestbook();
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('gbName').value.trim();
      var message = document.getElementById('gbMessage').value.trim();
      if (!name || !message) return;
      addGuestbookEntry(name, message);
      guestbookForm.reset();
    });
  }
  renderGuestbook();

  /* ---------------- Gift confirmation ---------------- */
  var giftConfirmForm = document.getElementById('giftConfirmForm');
  var giftConfirmThanks = document.getElementById('giftConfirmThanks');
  if (giftConfirmForm) {
    giftConfirmForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('giftName');
      var name = nameInput.value.trim();
      if (!name) return;
      var list = readList('sakura_wedding_gift_confirm');
      list.push({ name: name, date: new Date().toISOString() });
      writeList('sakura_wedding_gift_confirm', list);
      giftConfirmThanks.classList.add('is-visible');
      giftConfirmForm.querySelector('.gift__confirm-row').style.display = 'none';
    });
  }
})();
