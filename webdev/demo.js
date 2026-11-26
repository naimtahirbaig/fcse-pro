(function(){
var NUM='923216141055';
window.$=function(s,r){return (r||document).querySelector(s)};
window.$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
window.toast=function(m){var t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.className='toast on';clearTimeout(t._t);t._t=setTimeout(function(){t.className='toast'},4200)};
window.wa=function(msg){toast('Demo: this opens WhatsApp to FCSE. On your real site it goes to your own number.');setTimeout(function(){window.open('https://wa.me/'+NUM+'?text='+encodeURIComponent('[DEMO] '+msg),'_blank','noopener')},900)};
window.fd=function(f){var o=[];$$('input,select,textarea',f).forEach(function(e){if(e.name&&e.value)o.push(e.name+': '+e.value)});return o.join('\n')};
window.chips=function(bar,cb){bar.addEventListener('click',function(e){var b=e.target.closest('.chp');if(!b)return;$$('.chp',bar).forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');cb(b.dataset.v)})};
window.modal=function(html){var m=$('.modal');if(!m){m=document.createElement('div');m.className='modal';m.innerHTML='<div class="box"><button class="x" aria-label="Close">&times;</button><div class="mb"></div></div>';document.body.appendChild(m);m.addEventListener('click',function(e){if(e.target===m||e.target.classList.contains('x'))m.classList.remove('on')});document.addEventListener('keydown',function(e){if(e.key==='Escape')m.classList.remove('on')})}$('.mb',m).innerHTML=html;m.classList.add('on')};
var bar=document.createElement('div');bar.className='dbar';
var n=document.body.getAttribute('data-name')||'Template';
bar.innerHTML='<span>SAMPLE TEMPLATE: '+n+' (by FCSE, made-up business)</span><a href="/web-development">All templates</a><a class="gold" target="_blank" rel="noopener" href="https://wa.me/'+NUM+'?text='+encodeURIComponent('Hello FCSE, I want the '+n+' template for my business.')+'">Order this</a>';
document.body.insertBefore(bar,document.body.firstChild);
})();
