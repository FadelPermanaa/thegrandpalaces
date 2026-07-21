/* ============================================================
   SCROLL EXPERIENCE — reveal animations + growing sakura branch
   ============================================================ */
(function () {
  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Growing branch — overall page scroll progress rail ---- */
  var branchPath = document.getElementById('branchPath');
  var branchBud = document.getElementById('branchBud');
  var branchRail = document.getElementById('branchRail');
  var mainContent = document.getElementById('mainContent');

  function updateBranch() {
    if (!branchPath || !mainContent) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = mainContent.offsetHeight + mainContent.offsetTop - window.innerHeight;
    var progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
    var length = 1400;
    branchPath.style.strokeDashoffset = String(length - length * progress);
    if (branchBud) branchBud.style.top = (progress * 100) + '%';
    if (branchRail) branchRail.style.opacity = progress > 0.01 ? '0.85' : '0';
  }

  /* ---- Timeline branch (Love Story section) ---- */
  var timelineBranch = document.getElementById('timelineBranch');
  var loveStorySection = document.getElementById('loveStory');

  function updateTimeline() {
    if (!timelineBranch || !loveStorySection) return;
    var rect = loveStorySection.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height + vh;
    var passed = vh - rect.top;
    var progress = Math.min(1, Math.max(0, passed / total));
    var length = 900;
    timelineBranch.style.strokeDashoffset = String(length - length * progress);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateBranch();
      updateTimeline();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
