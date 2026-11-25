/* FCSE shared extras: offer strip, section quick-links, floating side tabs, CTA band, FAQ accordions */
(function () {
  var page = (location.pathname.split('/').pop() || 'index').toLowerCase();
  if (page === '') page = 'index';
  var WA = 'https://wa.me/923216141055?text=Hello%20First%20Computer%20Service%20%26%20Engineering%2C%20I%20need%20help%20with%20my%20computer.';
  var ico = {
    call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
    parts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></svg>'
  };

  /* 1. Offer strip under the header */
  var header = document.querySelector('header.site');
  if (header && !document.querySelector('.strip')) {
    var items = [
      'Quote before any work starts',
      'Three phone numbers, call any of them',
      'Abbot Road, near Jamia Masjid, Sialkot',
      'Over 4,800 spare part photos in our gallery',
      'Your data stays yours'
    ];
    var strip = document.createElement('div');
    strip.className = 'strip';
    strip.setAttribute('role', 'region');
    strip.setAttribute('aria-label', 'Shop highlights');
    var track = '<div class="strip-track">';
    for (var r = 0; r < 2; r++) {
      items.forEach(function (t) { track += '<span>' + t + '</span>'; });
    }
    strip.innerHTML = track + '</div>';
    header.parentNode.insertBefore(strip, header.nextSibling);
  }

  /* 2. "In this section" quick links */
  var groups = {
    parts: [['parts', 'Parts catalog'], ['gallery', 'Parts photo gallery'], ['quote', 'Quote list']],
    gallery: null, quote: null
  };
  var partsPages = { 'parts': 1, 'gallery': 1, 'quote': 1 };
  var guidePage = /^guides?(-.*)?$/.test(page);
  var links = null, label = '';
  if (partsPages[page]) { links = groups.parts; label = 'Parts'; }
  else if (guidePage) {
    links = [['guides', 'All guides'], ['guide-laptop-wont-charge', 'Won’t charge'], ['guide-laptop-running-slow', 'Running slow'], ['guide-laptop-overheating', 'Overheating'], ['guide-cracked-screen', 'Cracked screen'], ['guide-liquid-spill', 'Liquid spill'], ['guide-backup-your-files', 'Back up files']];
    label = 'Guides';
  } else if (page === 'services' || page === 'book' || page === 'contact') {
    links = [['services', 'Services'], ['book', 'Book a repair'], ['contact', 'Contact']];
    label = 'Repairs';
  }
  var anchor = document.querySelector('.strip') || header;
  if (links && anchor) {
    var sub = document.createElement('nav');
    sub.className = 'subnav';
    sub.setAttribute('aria-label', 'In this section');
    var h = '<div class="wrap"><span class="subnav-label">In this section: ' + label + '</span>';
    links.forEach(function (l) {
      h += '<a href="' + l[0] + '"' + (l[0] === page ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
    });
    sub.innerHTML = h + '</div>';
    anchor.parentNode.insertBefore(sub, anchor.nextSibling);
  }

  /* 3. Floating side tabs (desktop) */
  if (!document.querySelector('.side-tabs')) {
    var tabs = document.createElement('div');
    tabs.className = 'side-tabs';
    tabs.innerHTML =
      '<a href="tel:+923338635515" aria-label="Call 0333 863 5515">' + ico.call + '<span>Call</span></a>' +
      '<a href="book" aria-label="Book a repair">' + ico.book + '<span>Book</span></a>' +
      '<a href="parts" aria-label="Parts catalog">' + ico.parts + '<span>Parts</span></a>';
    document.body.appendChild(tabs);
  }

  /* 4. Closing call-to-action band */
  var main = document.querySelector('main');
  var footer = document.querySelector('footer');
  if (main && footer && !document.querySelector('.cta-band') && page !== 'book') {
    var cta = document.createElement('section');
    cta.className = 'cta-band';
    cta.innerHTML = '<div class="wrap"><div><h2>Computer trouble? Bring it to us.</h2><p>Book a repair, message us on WhatsApp or call the shop on Abbot Road, Sialkot.</p></div>' +
      '<div class="cta-actions"><a class="btn" href="book">Book a repair</a><a class="btn wa" href="' + WA + '" target="_blank" rel="noopener">WhatsApp</a><a class="btn light" href="tel:+923338635515">Call 0333 863 5515</a></div></div>';
    footer.parentNode.insertBefore(cta, footer);
  }

  /* 5. FAQ accordions: one open at a time */
  var all = document.querySelectorAll('.faq details');
  all.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) all.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* 6. Count-up for stats when they scroll into view */
  var nums = document.querySelectorAll('.stat b[data-n]');
  if (nums.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, end = parseInt(el.getAttribute('data-n'), 10), suf = el.getAttribute('data-s') || '', t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1200, 1);
          el.textContent = Math.round(end * p).toLocaleString('en-US') + suf;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: .4 });
    nums.forEach(function (n) { io.observe(n); });
  }
})();

/* ===== Language dropdown (Google Translate engine, own UI) ===== */
(function () {
  var LANGS = [["en", "English", "English"], ["ur", "\u0627\u0631\u062f\u0648", "\u0627\u0631\u062f\u0648"], ["ar", "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", "\u0627\u0644\u0639\u0631\u0628\u064a\u0629"], ["hi", "\u0939\u093f\u0928\u094d\u0926\u0940", "\u0939\u093f\u0928\u094d\u0926\u0940"], ["bn", "\u09ac\u09be\u0982\u09b2\u09be", "\u09ac\u09be\u0982\u09b2\u09be"], ["pa", "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40"], ["ps", "\u067e\u069a\u062a\u0648", "\u067e\u069a\u062a\u0648"], ["sd", "\u0633\u0646\u068c\u064a", "\u0633\u0646\u068c\u064a"], ["fa", "\u0641\u0627\u0631\u0633\u06cc", "\u0641\u0627\u0631\u0633\u06cc"], ["zh-CN", "\u7b80\u4f53\u4e2d\u6587", "\u7b80\u4f53\u4e2d\u6587"], ["zh-TW", "\u7e41\u9ad4\u4e2d\u6587", "\u7e41\u9ad4\u4e2d\u6587"], ["ja", "\u65e5\u672c\u8a9e", "\u65e5\u672c\u8a9e"], ["ko", "\ud55c\uad6d\uc5b4", "\ud55c\uad6d\uc5b4"], ["es", "Espa\u00f1ol", "Espa\u00f1ol"], ["fr", "Fran\u00e7ais", "Fran\u00e7ais"], ["de", "Deutsch", "Deutsch"], ["pt", "Portugu\u00eas", "Portugu\u00eas"], ["ru", "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", "\u0420\u0443\u0441\u0441\u043a\u0438\u0439"], ["it", "Italiano", "Italiano"], ["tr", "T\u00fcrk\u00e7e", "T\u00fcrk\u00e7e"], ["nl", "Nederlands", "Nederlands"], ["pl", "Polski", "Polski"], ["uk", "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430"], ["id", "Bahasa Indonesia", "Bahasa Indonesia"], ["ms", "Bahasa Melayu", "Bahasa Melayu"], ["th", "\u0e44\u0e17\u0e22", "\u0e44\u0e17\u0e22"], ["vi", "Ti\u1ebfng Vi\u1ec7t", "Ti\u1ebfng Vi\u1ec7t"], ["tl", "Filipino", "Filipino"], ["sw", "Kiswahili", "Kiswahili"], ["ta", "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd"], ["te", "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41"], ["mr", "\u092e\u0930\u093e\u0920\u0940", "\u092e\u0930\u093e\u0920\u0940"], ["gu", "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0"], ["ne", "\u0928\u0947\u092a\u093e\u0932\u0940", "\u0928\u0947\u092a\u093e\u0932\u0940"], ["si", "\u0dc3\u0dd2\u0d82\u0dc4\u0dbd", "\u0dc3\u0dd2\u0d82\u0dc4\u0dbd"], ["iw", "\u05e2\u05d1\u05e8\u05d9\u05ea", "\u05e2\u05d1\u05e8\u05d9\u05ea"], ["el", "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac", "\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac"], ["sv", "Svenska", "Svenska"], ["da", "Dansk", "Dansk"], ["no", "Norsk", "Norsk"], ["fi", "Suomi", "Suomi"], ["cs", "\u010ce\u0161tina", "\u010ce\u0161tina"], ["ro", "Rom\u00e2n\u0103", "Rom\u00e2n\u0103"], ["hu", "Magyar", "Magyar"], ["af", "Afrikaans", "Afrikaans"], ["am", "\u12a0\u121b\u122d\u129b", "\u12a0\u121b\u122d\u129b"], ["ha", "Hausa", "Hausa"]];
  var LATIN = { ur: 'urdu', ar: 'arabic', hi: 'hindi', bn: 'bengali bangla', pa: 'punjabi', ps: 'pashto', sd: 'sindhi', fa: 'persian farsi', 'zh-CN': 'chinese simplified', 'zh-TW': 'chinese traditional', ja: 'japanese', ko: 'korean', ru: 'russian', uk: 'ukrainian', tl: 'filipino tagalog', sw: 'swahili', ta: 'tamil', te: 'telugu', mr: 'marathi', gu: 'gujarati', ne: 'nepali', si: 'sinhala', iw: 'hebrew', el: 'greek', am: 'amharic', th: 'thai', vi: 'vietnamese', tr: 'turkish', de: 'german', es: 'spanish', fr: 'french', pt: 'portuguese', it: 'italian', nl: 'dutch', pl: 'polish', sv: 'swedish', da: 'danish', no: 'norwegian', fi: 'finnish', cs: 'czech', ro: 'romanian', hu: 'hungarian', id: 'indonesian', ms: 'malay', af: 'afrikaans', ha: 'hausa' };
  var RTL = { ur: 1, ar: 1, fa: 1, ps: 1, sd: 1, iw: 1 };
  var host = location.hostname;
  function getLang() { var m = document.cookie.match(/(?:^|; )googtrans=\/en\/([\w-]+)/); return m ? m[1] : 'en'; }
  function setLang(l) {
    var exp = 'Thu, 01 Jan 1970 00:00:00 GMT';
    var doms = ['', '; domain=' + host, '; domain=.' + host.replace(/^www\./, '')];
    doms.forEach(function (d) {
      document.cookie = 'googtrans=' + (l === 'en' ? '; expires=' + exp : '/en/' + l) + '; path=/' + d;
    });
    try { localStorage.setItem('fcse-lang', l); } catch (e) {}
    location.reload();
  }
  var cur = getLang();
  var curRow = LANGS.filter(function (x) { return x[0] === cur; })[0] || LANGS[0];

  // mark things that must never be translated
  document.querySelectorAll('.brand, .hero-brand, .phones, .fcse, a[href^="tel:"], a[href^="mailto:"]').forEach(function (e) { e.setAttribute('translate', 'no'); e.classList.add('notranslate'); });

  // dropdown UI in the top bar
  var tb = document.querySelector('.topbar .wrap');
  if (tb && !document.querySelector('.lang')) {
    var call = tb.querySelector('a[href^="tel:"]');
    var right = document.createElement('div'); right.className = 'tb-right';
    if (call) right.appendChild(call);
    var box = document.createElement('div'); box.className = 'lang notranslate'; box.setAttribute('translate', 'no');
    var h = '<button type="button" class="lang-btn" aria-haspopup="listbox" aria-expanded="false" aria-label="Language">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/></svg>' +
      '<span>' + curRow[1] + '</span><i aria-hidden="true">▾</i></button><div class="lang-menu" hidden><input type="search" class="lang-q" placeholder="Search language" aria-label="Search language" autocomplete="off"><ul role="listbox">';
    LANGS.forEach(function (x) {
      h += '<li role="option" tabindex="-1" data-l="' + x[0] + '"' + (x[0] === cur ? ' aria-selected="true"' : '') + '>' + x[1] + '</li>';
    });
    box.innerHTML = h + '</ul></div>';
    right.appendChild(box); tb.appendChild(right);
    var btn = box.querySelector('.lang-btn'), menu = box.querySelector('.lang-menu'), q = box.querySelector('.lang-q'), ul = box.querySelector('ul');
    function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); var o = menu.hidden; menu.hidden = !o; btn.setAttribute('aria-expanded', String(o)); if (o) { q.value = ''; filt(); q.focus(); var s = menu.querySelector('[aria-selected]'); if (s) s.scrollIntoView({ block: 'center' }); } });
    function filt() { var t = q.value.trim().toLowerCase(); [].forEach.call(ul.children, function (li) { var k = li.getAttribute('data-l'); var l = LANGS.filter(function (x) { return x[0] === k; })[0]; li.hidden = !!t && l[1].toLowerCase().indexOf(t) < 0 && k.toLowerCase().indexOf(t) < 0 && (LATIN[k] || '').indexOf(t) < 0; }); }
    q.addEventListener('input', filt);
    menu.addEventListener('click', function (e) { if (e.target === q) return; var li = e.target.closest('li'); if (li) { var l = li.getAttribute('data-l'); if (l === cur) close(); else setLang(l); } });
    menu.addEventListener('keydown', function (e) {
      var vis = [].filter.call(ul.children, function (x) { return !x.hidden; }), a = document.activeElement, i = vis.indexOf(a);
      if (e.key === 'ArrowDown') { (vis[i + 1] || vis[0] || a).focus(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { if (i <= 0) q.focus(); else vis[i - 1].focus(); e.preventDefault(); }
      else if ((e.key === 'Enter' || e.key === ' ') && a.tagName === 'LI') { a.click(); e.preventDefault(); }
      else if (e.key === 'Enter' && a === q && vis[0]) { vis[0].click(); e.preventDefault(); }
      else if (e.key === 'Escape') { close(); btn.focus(); }
    });
    document.addEventListener('click', close);
  }

  // translated view
  if (cur !== 'en') {
    document.documentElement.setAttribute('data-lang', cur);
    if (RTL[cur]) document.documentElement.setAttribute('dir', 'rtl');
    var holder = document.createElement('div'); holder.id = 'google_translate_element'; holder.style.display = 'none'; document.body.appendChild(holder);
    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false, includedLanguages: LANGS.map(function (x) { return x[0]; }).join(',') }, 'google_translate_element');
    };
    var s = document.createElement('script'); s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'; s.async = true; document.head.appendChild(s);
  }
})();

/* Instant navigation: prefetch a page when the pointer is over its link or on touch */
(function () {
  var done = {};
  function pf(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (u.origin !== location.origin || u.pathname === location.pathname || done[u.pathname]) return;
    if (navigator.connection && navigator.connection.saveData) return;
    done[u.pathname] = 1;
    var l = document.createElement('link'); l.rel = 'prefetch'; l.href = u.pathname; document.head.appendChild(l);
  }
  document.addEventListener('mouseover', pf, { passive: true });
  document.addEventListener('touchstart', pf, { passive: true });
})();
