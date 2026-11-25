// Mobile menu and problem picker (filters service cards by keyword)
(function () {
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('mainNav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var q = document.getElementById('q');
  var grid = document.getElementById('serviceGrid');
  if (!q || !grid) return;
  var cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));
  var none = document.getElementById('none');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  function apply() {
    var words = q.value.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    cards.forEach(function (c) {
      var tags = c.getAttribute('data-tags');
      var ok = words.every(function (w) { return tags.indexOf(w) !== -1; });
      c.hidden = !ok;
      if (ok) shown++;
    });
    none.classList.toggle('show', shown === 0);
    chips.forEach(function (ch) {
      ch.setAttribute('aria-pressed', words.length === 1 && words[0] === ch.getAttribute('data-q') ? 'true' : 'false');
    });
  }
  q.addEventListener('input', apply);
  chips.forEach(function (ch) {
    ch.addEventListener('click', function () {
      q.value = q.value === ch.getAttribute('data-q') ? '' : ch.getAttribute('data-q');
      apply();
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
