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
