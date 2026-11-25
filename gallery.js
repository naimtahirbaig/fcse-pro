(function () {
  var D = window.PARTS_GALLERY; if (!D) return;
  var PAGE = 60, chips = document.getElementById('brandChips'), grid = document.getElementById('galGrid'),
      more = document.getElementById('galMore'), count = document.getElementById('galCount'),
      typeSel = document.getElementById('galType'), q = document.getElementById('galSearch');
  var current = [], shown = 0, active = 'all';
  var cta = document.getElementById('galCatalog'), CAT = { dell: 'Dell', hp: 'HP', lenovo: 'Lenovo', asus: 'ASUS', acer: 'Acer', msi: 'MSI' };
  var total = D.brands.reduce(function (n, b) { return n + b.files.length; }, 0);
  function updateCta(key) {
    if (!cta) return;
    if (CAT[key]) { cta.href = 'parts.html#brand=' + CAT[key]; cta.textContent = CAT[key] + ' parts catalog'; }
    else { cta.href = 'parts.html'; cta.textContent = 'Parts catalog'; }
  }
  function list() {
    var key = active, type = typeSel ? typeSel.value : 'all', words = (q ? q.value : '').toLowerCase().split(/\s+/).filter(Boolean), out = [];
    D.brands.forEach(function (b) {
      if (key !== 'all' && key !== b.dir) return;
      b.files.forEach(function (f, i) {
        var li = b.l[i], label = D.labels[li];
        if (type !== 'all' && String(li) !== type) return;
        var hay = (label + ' ' + b.name).toLowerCase();
        if (!words.every(function (w) { return hay.indexOf(w) !== -1; })) return;
        out.push({ src: D.base + b.dir + '/' + f + '.jpg', label: label, brand: b.name, li: li });
      });
    });
    out.sort(function (a, b) { return a.li - b.li; });
    return out;
  }
  function add() {
    var end = Math.min(shown + PAGE, current.length), frag = document.createDocumentFragment();
    for (var i = shown; i < end; i++) {
      var it = current[i], fig = document.createElement('figure'); fig.className = 'gal-item';
      var pic = document.createElement('div'); pic.className = 'gal-pic';
      var img = new Image(); img.src = it.src; img.alt = it.label + ' for ' + it.brand + ' laptops'; img.width = 110; img.height = 110; img.loading = 'lazy'; img.decoding = 'async';
      pic.appendChild(img);
      var cap = document.createElement('figcaption'), b = document.createElement('b'), s = document.createElement('span');
      b.textContent = it.label; s.textContent = it.brand; cap.appendChild(b); cap.appendChild(s);
      fig.appendChild(pic); fig.appendChild(cap); frag.appendChild(fig);
    }
    grid.appendChild(frag); shown = end;
    count.textContent = current.length ? 'Showing ' + shown + ' of ' + current.length + ' photos' : 'No photos match. Try another brand, part type or search word.';
    more.hidden = shown >= current.length;
  }
  function refresh() { current = list(); shown = 0; grid.innerHTML = ''; add(); }
  function select(key) {
    active = key;
    [].forEach.call(chips.children, function (c) { c.setAttribute('aria-pressed', c.dataset.key === key ? 'true' : 'false'); });
    updateCta(key); refresh();
    if (history.replaceState) history.replaceState(null, '', key === 'all' ? location.pathname : '#' + key);
  }
  function chip(key, label, n) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.key = key;
    b.textContent = label + ' (' + n + ')'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { select(key); }); chips.appendChild(b);
  }
  chip('all', 'All brands', total);
  D.brands.forEach(function (b) { chip(b.dir, b.name, b.files.length); });
  if (typeSel) {
    var counts = {}; D.brands.forEach(function (b) { b.l.forEach(function (li) { counts[li] = (counts[li] || 0) + 1; }); });
    D.labels.map(function (l, i) { return { l: l, i: i }; }).sort(function (a, b) { return a.l < b.l ? -1 : 1; }).forEach(function (o) {
      if (!counts[o.i]) return; var op = document.createElement('option'); op.value = String(o.i); op.textContent = o.l + ' (' + counts[o.i] + ')'; typeSel.appendChild(op);
    });
    typeSel.addEventListener('change', refresh);
  }
  if (q) { var t; q.addEventListener('input', function () { clearTimeout(t); t = setTimeout(refresh, 150); }); }
  more.addEventListener('click', add);
  var h = location.hash.slice(1);
  select(D.brands.some(function (b) { return b.dir === h; }) ? h : 'all');
})();
