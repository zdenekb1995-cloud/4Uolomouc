/* ═══════════════════════════════════════════════
   4U OLOMOUC — main.js · v3 (shared for all pages)
   ═══════════════════════════════════════════════ */

/* ── PRELOADER ── */
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  document.body.classList.add('loading');
  var seen = false;
  try { seen = !!sessionStorage.getItem('4u_loaded'); } catch (e) {}
  var hide = function () {
    loader.classList.add('done');
    document.body.classList.remove('loading');
    try { sessionStorage.setItem('4u_loaded', '1'); } catch (e) {}
  };
  var delay = seen ? 350 : 2300;
  if (document.readyState === 'complete') {
    setTimeout(hide, delay);
  } else {
    window.addEventListener('load', function () { setTimeout(hide, delay); });
  }
  setTimeout(hide, 4800); // safety fallback
})();

/* ── STICKY NAV SHADOW ── */
(function () {
  var header = document.querySelector('header');
  if (!header) return;
  var onScroll = function () {
    header.classList.toggle('solid', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU (standalone fullscreen panel) ── */
(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mmenu');
  if (!burger || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () {
    setOpen(!menu.classList.contains('open'));
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1080 && menu.classList.contains('open')) setOpen(false);
  });
})();

/* ── SCROLL REVEAL ── */
(function () {
  var els = document.querySelectorAll('.rv');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) { io.observe(el); });
})();

/* ── 3D TILT (cards, hero image) ──
   Elements with [data-tilt] tilt toward the cursor. Disabled on touch
   devices and when reduced motion is preferred. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;
  if (reduce || touch) return;

  document.querySelectorAll('[data-tilt]').forEach(function (el) {
    var max = parseFloat(el.getAttribute('data-tilt')) || 7;
    var raf = null;

    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.transform =
          'perspective(1100px) rotateX(' + (-py * max).toFixed(2) + 'deg)' +
          ' rotateY(' + (px * max).toFixed(2) + 'deg)' +
          ' translateY(-6px)';
      });
    });
    el.addEventListener('mouseleave', function () {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });
})();

/* ── COUNT-UP STATS ── */
(function () {
  var els = document.querySelectorAll('.count[data-to]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var el = e.target;
      var to = parseFloat(el.getAttribute('data-to'));
      var dec = (el.getAttribute('data-to').split('.')[1] || '').length;
      var suffix = el.getAttribute('data-suffix') || '';
      var t0 = null, dur = 1600;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (to * eased).toFixed(dec).replace('.', ',') + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  els.forEach(function (el) { io.observe(el); });
})();

/* ── DETAIL GALLERY + LIGHTBOX ── */
(function () {
  var main = document.getElementById('galMain');
  if (!main) return;
  var imgs = Array.prototype.slice.call(main.querySelectorAll('img'));
  var thumbsWrap = document.getElementById('galThumbs');
  var countEl = document.getElementById('galCount');
  var idx = 0;

  if (thumbsWrap) {
    imgs.forEach(function (img, i) {
      var b = document.createElement('button');
      b.className = i === 0 ? 'on' : '';
      b.setAttribute('aria-label', 'Fotografie ' + (i + 1));
      var t = document.createElement('img');
      t.src = img.src; t.alt = ''; t.loading = 'lazy';
      b.appendChild(t);
      b.addEventListener('click', function () { go(i); });
      thumbsWrap.appendChild(b);
    });
  }
  function go(i) {
    imgs[idx].classList.remove('on');
    if (thumbsWrap) thumbsWrap.children[idx].classList.remove('on');
    idx = (i + imgs.length) % imgs.length;
    imgs[idx].classList.add('on');
    if (thumbsWrap) thumbsWrap.children[idx].classList.add('on');
    if (countEl) countEl.textContent = (idx + 1) + ' / ' + imgs.length;
    if (lb && lb.classList.contains('open')) syncLb();
  }
  window.galMove = function (d) { go(idx + d); };
  if (countEl) countEl.textContent = '1 / ' + imgs.length;

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCount = document.getElementById('lbCount');
  function syncLb() {
    lbImg.src = imgs[idx].src;
    if (lbCount) lbCount.textContent = (idx + 1) + ' / ' + imgs.length;
  }
  function openLb() {
    syncLb();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  main.addEventListener('click', function (e) {
    if (e.target.closest('.gal-nav')) return;
    openLb();
  });
  window.lbMove = function (d) { go(idx + d); syncLb(); };
  window.lbClose = closeLb;
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') window.lbMove(1);
    if (e.key === 'ArrowLeft') window.lbMove(-1);
  });

  /* Touch swipe */
  var startX = null;
  main.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  main.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) go(idx + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();

/* ── FAQ ACCORDION ── */
(function () {
  var faqs = document.querySelectorAll('.faq');
  if (!faqs.length) return;
  faqs.forEach(function (f) {
    var q = f.querySelector('.faq-q');
    var a = f.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = f.classList.contains('open');
      faqs.forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        f.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

/* ── CONTACT FORM (demo submit) ── */
(function () {
  var btn = document.getElementById('formSubmit');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var name = document.getElementById('f-name');
    var email = document.getElementById('f-email');
    var note = document.getElementById('formNote');
    if (!name.value.trim() || !email.value.trim()) {
      note.textContent = 'Vyplňte prosím jméno a e-mail.';
      note.classList.add('show');
      return;
    }
    note.textContent = 'Děkujeme! Vaše poptávka byla odeslána — ozveme se Vám co nejdříve.';
    note.classList.add('show');
    setTimeout(function () { note.classList.remove('show'); }, 7000);
  });
})();

/* ── COOKIE BAR ──
   Shows unless the visitor already made a choice. Storage failures
   (private mode, file://) no longer hide the bar. */
(function () {
  var bar = document.getElementById('cookiebar');
  if (!bar) return;
  var choice = null;
  try { choice = localStorage.getItem('4u_cookies'); } catch (e) { choice = null; }
  if (choice) return;
  setTimeout(function () { bar.classList.add('show'); }, 1200);
  window.cookieChoice = function (c) {
    try { localStorage.setItem('4u_cookies', c); } catch (e) {}
    bar.classList.remove('show');
  };
})();

/* ── FOOTER YEAR ── */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ── CREDIT "Vytvořil 4uweb" ──
   Injected from shared JS so the credit appears in the footer
   of every page without editing the HTML files. */
(function () {
  var host = document.querySelector('.foot-bottom-in');
  if (!host) return;
  var css = document.createElement('style');
  css.textContent =
    '.credit-4uweb{display:inline-flex;align-items:center;gap:8px;}' +
    '.credit-4uweb a{font-weight:700;font-size:14px;letter-spacing:.01em;' +
    'color:#f7f5f0;text-decoration:none;transition:opacity .25s;}' +
    '.credit-4uweb a:hover{opacity:.75;}' +
    '.credit-4uweb a span{color:#FFB800;}';
  document.head.appendChild(css);
  var d = document.createElement('div');
  d.className = 'credit-4uweb';
  d.innerHTML = 'Vytvořil&nbsp;' +
    '<a href="https://www.4uweb.cz" target="_blank" rel="noopener" aria-label="4uweb — tvorba webů">' +
    '4uweb<span>.</span></a>';
  host.appendChild(d);
})();
