// FCSE site script: mobile menu, problem picker, guide search, parts catalog, quote list, booking form.
(function () {
  'use strict';
  var WA_NUM = '923216141055';
  var MAIL = 'fcsecomputer@gmail.com';
  var KEY = 'fcse_quote_v1';
  var cart = null;

  function $(id) { return document.getElementById(id); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function enc(s) { return encodeURIComponent(s); }

  // ---- quote list storage (falls back to memory if storage is blocked) ----
  function loadCart() {
    if (cart) return cart;
    try { var a = JSON.parse(localStorage.getItem(KEY) || '[]'); cart = Array.isArray(a) ? a : []; }
    catch (e) { cart = []; }
    return cart;
  }
  function saveCart() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} updateBadge(); }
  function cartTotal() { return loadCart().reduce(function (s, i) { return s + i.qty; }, 0); }
  function updateBadge() { var n = cartTotal(); all('[data-cart-count]').forEach(function (e) { e.textContent = n; }); }
  function addItem(id, name) {
    var c = loadCart(), f = c.filter(function (i) { return i.id === id; })[0];
    if (f) f.qty += 1; else c.push({ id: id, name: name, qty: 1 });
    saveCart();
  }
  updateBadge();

  // ---- helpers ----
  function copyText(text, done) {
    function fallback() {
      var t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', '');
      t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(t); done(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else { fallback(); }
  }
  function links(subject, text) {
    return {
      mail: 'mailto:' + MAIL + '?subject=' + enc(subject) + '&body=' + enc(text),
      wa: 'https://wa.me/' + WA_NUM + '?text=' + enc(text)
    };
  }
  function showErr(id, bad) { var e = $(id + '-err'); if (e) e.hidden = !bad; var f = $(id); if (f) f.setAttribute('aria-invalid', bad ? 'true' : 'false'); }

  // ---- mobile menu ----
  var btn = $('menuBtn'), nav = $('mainNav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---- home: problem picker filters the service cards ----
  var q = $('q'), grid = $('serviceGrid');
  if (q && grid) {
    var cards = all('.card', grid), none = $('none'), chips = all('.chip');
    var applyPicker = function () {
      var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      cards.forEach(function (c) {
        var tags = c.getAttribute('data-tags');
        var ok = words.every(function (w) { return tags.indexOf(w) !== -1; });
        c.hidden = !ok; if (ok) shown++;
      });
      none.classList.toggle('show', shown === 0);
      chips.forEach(function (ch) {
        ch.setAttribute('aria-pressed', words.length === 1 && words[0] === ch.getAttribute('data-q') ? 'true' : 'false');
      });
    };
    q.addEventListener('input', applyPicker);
    chips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        q.value = q.value === ch.getAttribute('data-q') ? '' : ch.getAttribute('data-q');
        applyPicker();
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  // ---- guides: search ----
  var gs = $('gs'), gg = $('guideGrid');
  if (gs && gg) {
    var gcards = all('.card', gg), gnone = $('gnone');
    gs.addEventListener('input', function () {
      var words = gs.value.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      gcards.forEach(function (c) {
        var ok = words.every(function (w) { return c.getAttribute('data-tags').indexOf(w) !== -1; });
        c.hidden = !ok; if (ok) shown++;
      });
      gnone.classList.toggle('show', shown === 0);
    });
  }

  // ---- parts catalog: search, brand, type, add to quote ----
  var products = $('products');
  if (products) {
    var pcards = all('.pcard', products), ps = $('ps'), pb = $('pb'), pcount = $('pcount'), pnone = $('pnone');
    var cat = 'all', catChips = all('.filters .chip');
    var filterParts = function () {
      var words = ps.value.toLowerCase().split(/\s+/).filter(Boolean), brand = pb.value, shown = 0;
      pcards.forEach(function (c) {
        var hay = (c.getAttribute('data-name') + ' ' + c.querySelector('.meta').textContent).toLowerCase();
        var ok = words.every(function (w) { return hay.indexOf(w) !== -1; }) &&
          (cat === 'all' || c.getAttribute('data-cat') === cat) &&
          (brand === 'all' || c.getAttribute('data-brand') === brand || c.getAttribute('data-brand') === 'Any');
        c.hidden = !ok; if (ok) shown++;
      });
      pcount.textContent = 'Showing ' + shown + ' of ' + pcards.length + ' parts';
      pnone.classList.toggle('show', shown === 0);
    };
    ps.addEventListener('input', filterParts);
    pb.addEventListener('change', filterParts);
    catChips.forEach(function (ch) {
      ch.addEventListener('click', function () {
        cat = ch.getAttribute('data-cat');
        catChips.forEach(function (x) { x.setAttribute('aria-pressed', x === ch ? 'true' : 'false'); });
        filterParts();
      });
    });
    $('pclear').addEventListener('click', function () {
      ps.value = ''; pb.value = 'all'; cat = 'all';
      catChips.forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
      filterParts(); ps.focus();
    });
    products.addEventListener('click', function (e) {
      var b = e.target.closest('.add'); if (!b) return;
      var card = b.closest('.pcard');
      addItem(card.getAttribute('data-id'), card.getAttribute('data-name'));
      b.textContent = 'Added to quote'; b.classList.add('done');
      setTimeout(function () { b.textContent = 'Add to quote'; b.classList.remove('done'); }, 1600);
    });
    filterParts();
  }

  // ---- quote list page ----
  var qlist = $('qlist');
  if (qlist) {
    var qempty = $('qempty'), qclear = $('qclear'), qform = $('qform'), qstatus = $('qstatus');
    var qmail = $('qmail'), qwa = $('qwa');
    var quoteText = function () {
      var c = loadCart(), lines = ['Quote request for First Computer Service & Engineering (FCSE)', ''];
      lines.push('Name: ' + $('qn').value.trim(), 'Phone: ' + $('qp').value.trim());
      if ($('qm').value.trim()) lines.push('Laptop model: ' + $('qm').value.trim());
      lines.push('', 'Parts:');
      c.forEach(function (i) { lines.push('- ' + i.qty + ' x ' + i.name); });
      if ($('qx').value.trim()) lines.push('', 'Notes: ' + $('qx').value.trim());
      return lines.join('\n');
    };
    var renderQuote = function () {
      var c = loadCart();
      qlist.innerHTML = '';
      c.forEach(function (i) {
        var li = document.createElement('li'); li.setAttribute('data-id', i.id);
        var n = document.createElement('span'); n.className = 'qname'; n.textContent = i.name;
        var qty = document.createElement('span'); qty.className = 'qty';
        var minus = document.createElement('button'); minus.type = 'button'; minus.setAttribute('data-act', 'minus'); minus.setAttribute('aria-label', 'One less ' + i.name); minus.textContent = '−';
        var out = document.createElement('output'); out.textContent = i.qty;
        var plus = document.createElement('button'); plus.type = 'button'; plus.setAttribute('data-act', 'plus'); plus.setAttribute('aria-label', 'One more ' + i.name); plus.textContent = '+';
        qty.appendChild(minus); qty.appendChild(out); qty.appendChild(plus);
        var rm = document.createElement('button'); rm.type = 'button'; rm.className = 'linkbtn'; rm.setAttribute('data-act', 'remove'); rm.setAttribute('aria-label', 'Remove ' + i.name); rm.textContent = 'Remove';
        li.appendChild(n); li.appendChild(qty); li.appendChild(rm); qlist.appendChild(li);
      });
      qlist.hidden = c.length === 0; qclear.hidden = c.length === 0; qempty.hidden = c.length !== 0;
      refreshLinks();
    };
    var refreshLinks = function () {
      var l = links('Parts quote request', quoteText());
      qmail.href = l.mail; qwa.href = l.wa;
    };
    var validQuote = function () {
      var okN = $('qn').value.trim() !== '', okP = $('qp').value.trim() !== '', okC = loadCart().length > 0;
      showErr('qn', !okN); showErr('qp', !okP);
      if (!okC) { qstatus.textContent = 'Your list is empty. Add parts from the catalog first.'; }
      else if (!okN || !okP) { qstatus.textContent = 'Please fill in the fields marked below.'; }
      else { qstatus.textContent = ''; }
      if (!okN) { $('qn').focus(); } else if (!okP) { $('qp').focus(); }
      return okN && okP && okC;
    };
    qlist.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var id = b.closest('li').getAttribute('data-id'), c = loadCart(), it = c.filter(function (x) { return x.id === id; })[0];
      if (!it) return;
      var act = b.getAttribute('data-act');
      if (act === 'plus') it.qty += 1;
      if (act === 'minus') it.qty -= 1;
      if (act === 'remove' || it.qty < 1) c.splice(c.indexOf(it), 1);
      saveCart(); renderQuote();
    });
    qclear.addEventListener('click', function () { cart = []; saveCart(); renderQuote(); });
    qform.addEventListener('input', refreshLinks);
    qform.addEventListener('submit', function (e) { e.preventDefault(); });
    [qmail, qwa].forEach(function (a) {
      a.addEventListener('click', function (e) { refreshLinks(); if (!validQuote()) e.preventDefault(); });
    });
    $('qcopy').addEventListener('click', function () {
      if (!validQuote()) return;
      copyText(quoteText(), function (ok) { qstatus.textContent = ok ? 'List copied. Paste it into a message to us.' : 'Could not copy. Please use the WhatsApp or email button.'; });
    });
    renderQuote();
  }

  // ---- book a repair page ----
  var bform = $('bform');
  if (bform) {
    var bstatus = $('bstatus'), bmail = $('bmail'), bwa = $('bwa');
    var bookText = function () {
      var lines = ['Repair booking for First Computer Service & Engineering (FCSE)', ''];
      lines.push('Name: ' + $('bn').value.trim(), 'Phone: ' + $('bp').value.trim());
      lines.push('Device: ' + $('bd').value);
      if ($('bb').value.trim()) lines.push('Brand and model: ' + $('bb').value.trim());
      lines.push('Problem: ' + $('bpr').value);
      if ($('bx').value.trim()) lines.push('Details: ' + $('bx').value.trim());
      lines.push('Contact preference: ' + $('bw').value);
      return lines.join('\n');
    };
    var refreshBook = function () { var l = links('Repair booking', bookText()); bmail.href = l.mail; bwa.href = l.wa; };
    var validBook = function () {
      var okN = $('bn').value.trim() !== '', okP = $('bp').value.trim() !== '';
      showErr('bn', !okN); showErr('bp', !okP);
      bstatus.textContent = okN && okP ? '' : 'Please fill in the fields marked below.';
      if (!okN) { $('bn').focus(); } else if (!okP) { $('bp').focus(); }
      return okN && okP;
    };
    bform.addEventListener('input', refreshBook);
    bform.addEventListener('change', refreshBook);
    bform.addEventListener('submit', function (e) { e.preventDefault(); });
    [bmail, bwa].forEach(function (a) {
      a.addEventListener('click', function (e) { refreshBook(); if (!validBook()) e.preventDefault(); });
    });
    $('bcopy').addEventListener('click', function () {
      if (!validBook()) return;
      copyText(bookText(), function (ok) { bstatus.textContent = ok ? 'Booking copied. Paste it into a message to us.' : 'Could not copy. Please use the WhatsApp or email button.'; });
    });
    refreshBook();
  }
})();
