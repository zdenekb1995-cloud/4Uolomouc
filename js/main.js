/* ═══════════════════════════════════════════════
   4U OLOMOUC — main.js (shared for all pages)
   ═══════════════════════════════════════════════ */

/* ── PRELOADER ── */
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  document.body.classList.add('loading');
  var hide = function () {
    loader.classList.add('done');
    document.body.classList.remove('loading');
  };
  // Show once per session in full length; shorter on repeat visits
  var seen = sessionStorage.getItem('4u_loaded');
  var delay = seen ? 500 : 2400;
  window.addEventListener('load', function () {
    setTimeout(hide, delay);
    sessionStorage.setItem('4u_loaded', '1');
  });
  // Safety fallback
  setTimeout(hide, 5000);
})();

/* ── STICKY NAV ── */
(function () {
  var header = document.querySelector('header');
  if (!header) return;
  var onScroll = function () {
    header.classList.toggle('solid', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU ── */
(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('navMenu');
  if (!burger || !menu) return;
  burger.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
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
  }, { threshold: 0.12 });
  els.forEach(function (el) { io.observe(el); });
})();

/* ── HERO SLIDESHOW (homepage) ── */
(function () {
  var slides = document.querySelectorAll('.hero-media img');
  var dotsWrap = document.getElementById('heroDots');
  if (!slides.length) return;
  var idx = 0, timer;

  if (dotsWrap) {
    slides.forEach(function (_, i) {
      var b = document.createElement('button');
      b.className = 'hero-dot' + (i === 0 ? ' on' : '');
      b.setAttribute('aria-label', 'Fotografie ' + (i + 1));
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
    });
  }
  function go(i) {
    slides[idx].classList.remove('on');
    if (dotsWrap) dotsWrap.children[idx].classList.remove('on');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('on');
    if (dotsWrap) dotsWrap.children[idx].classList.add('on');
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(function () { go(idx + 1); }, 6000);
  }
  restart();
})();

/* ── DETAIL GALLERY + LIGHTBOX ── */
(function () {
  var main = document.getElementById('galMain');
  if (!main) return;
  var imgs = Array.prototype.slice.call(main.querySelectorAll('img'));
  var thumbsWrap = document.getElementById('galThumbs');
  var countEl = document.getElementById('galCount');
  var idx = 0;

  // Build thumbnails
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
    if (lb.classList.contains('open')) lbImg.src = imgs[idx].src;
  }
  window.galMove = function (d) { go(idx + d); };
  if (countEl) countEl.textContent = '1 / ' + imgs.length;

  /* Lightbox */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCount = document.getElementById('lbCount');
  function openLb() {
    lbImg.src = imgs[idx].src;
    if (lbCount) lbCount.textContent = (idx + 1) + ' / ' + imgs.length;
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
  window.lbMove = function (d) {
    go(idx + d);
    lbImg.src = imgs[idx].src;
    if (lbCount) lbCount.textContent = (idx + 1) + ' / ' + imgs.length;
  };
  window.lbClose = closeLb;
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') window.lbMove(1);
    if (e.key === 'ArrowLeft') window.lbMove(-1);
  });

  /* Auto-advance while lightbox is closed */
  setInterval(function () {
    if (!lb.classList.contains('open')) go(idx + 1);
  }, 5200);
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

/* ── COOKIE BAR ── */
(function () {
  var bar = document.getElementById('cookiebar');
  if (!bar) return;
  try {
    if (localStorage.getItem('4u_cookies')) return;
  } catch (e) { return; }
  setTimeout(function () { bar.classList.add('show'); }, 1800);
  window.cookieChoice = function (choice) {
    try { localStorage.setItem('4u_cookies', choice); } catch (e) {}
    bar.classList.remove('show');
  };
})();

/* ── FOOTER YEAR ── */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
