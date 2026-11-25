(function () {
  var pb = document.getElementById('pb'); if (!pb) return;
  var m = /brand=([^&]+)/i.exec(location.hash); if (!m) return;
  var want = decodeURIComponent(m[1]).toLowerCase();
  for (var i = 0; i < pb.options.length; i++) {
    if (pb.options[i].value.toLowerCase() === want) {
      pb.value = pb.options[i].value; pb.dispatchEvent(new Event('change'));
      var t = document.getElementById('products'); if (t && t.scrollIntoView) t.scrollIntoView();
      break;
    }
  }
})();
