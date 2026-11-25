(function () {
  var D = window.PARTS_GALLERY; if (!D) return;
  var PAGE = 60, chips = document.getElementById('brandChips'), grid = document.getElementById('galGrid'),
      more = document.getElementById('galMore'), count = document.getElementById('galCount');
  var current = [], shown = 0, active = 'all';
  var cta = document.getElementById('galCatalog'), CAT = { dell: 'Dell', hp: 'HP', lenovo: 'Lenovo', asus: 'ASUS', acer: 'Acer', msi: 'MSI' };
  function updateCta(key) {
    if (!cta) return;
    if (CAT[key]) { cta.href = 'parts.html#brand=' + CAT[key]; cta.textContent = CAT[key] + ' parts catalog'; }
    else { cta.href = 'parts.html'; cta.textContent = 'Parts catalog'; }
  }
  var total = D.brands.reduce(function (n, b) { return n + b.files.length; }, 0);
  function list(key) {
    var out = [];
    D.brands.forEach(function (b) {
      if (key === 'all' || key === b.dir) b.files.forEach(function (f, i) { out.push({ src: D.base + b.dir + '/' + f + '.jpg', alt: b.name + ' laptop spare part, photo ' + (i + 1) }); });
    });
    return out;
  }
  function add() {
    var end = Math.min(shown + PAGE, current.length), frag = document.createDocumentFragment();
    for (var i = shown; i < end; i++) {
      var img = new Image(); img.src = current[i].src; img.alt = current[i].alt; img.width = 110; img.height = 110; img.loading = 'lazy'; img.decoding = 'async';
      var li = document.createElement('div'); li.className = 'gal-item'; li.appendChild(img); frag.appendChild(li);
    }
    grid.appendChild(frag); shown = end;
    count.textContent = 'Showing ' + shown + ' of ' + current.length + ' photos';
    more.hidden = shown >= current.length;
  }
  function select(key) {
    active = key; current = list(key); shown = 0; grid.innerHTML = '';
    [].forEach.call(chips.children, function (c) { c.setAttribute('aria-pressed', c.dataset.key === key ? 'true' : 'false'); });
    add(); updateCta(key);
    if (history.replaceState) history.replaceState(null, '', key === 'all' ? location.pathname : '#' + key);
  }
  function chip(key, label, n) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.dataset.key = key;
    b.textContent = label + ' (' + n + ')'; b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () { select(key); }); chips.appendChild(b);
  }
  chip('all', 'All brands', total);
  D.brands.forEach(function (b) { chip(b.dir, b.name, b.files.length); });
  more.addEventListener('click', add);
  var h = location.hash.slice(1);
  select(D.brands.some(function (b) { return b.dir === h; }) ? h : 'all');
})();
