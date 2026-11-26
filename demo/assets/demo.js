(function(){
var NUM='923216141055';
window.$=function(s,r){return(r||document).querySelector(s)};
window.$$=function(s,r){return[].slice.call((r||document).querySelectorAll(s))};
window.toast=function(m){var t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=m;t.className='toast on';clearTimeout(t._t);t._t=setTimeout(function(){t.className='toast'},3800)};
window.wa=function(msg){toast('Demo: this opens WhatsApp to FCSE. On your real site it goes to your own number.');setTimeout(function(){window.open('https://wa.me/'+NUM+'?text='+encodeURIComponent('[DEMO] '+msg),'_blank','noopener')},800)};
window.fd=function(f){var o=[];$$('input,select,textarea',f).forEach(function(e){if(e.name&&e.value)o.push(e.name+': '+e.value)});return o.join('\n')};
window.qs=function(k){return new URLSearchParams(location.search).get(k)};
window.esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
window.store=function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
window.save=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
var D=window.DEMO||{pages:[],cur:0,name:'Template',slug:''};
/* demo bar */
var bar=document.createElement('div');bar.className='dbar';
var prev=D.pages[D.cur-1],next=D.pages[D.cur+1];
bar.innerHTML='<span class="t">SAMPLE TEMPLATE: '+esc(D.name)+' · page '+(D.cur+1)+' of '+D.pages.length+'</span>'+
'<select aria-label="Jump to page">'+D.pages.map(function(p,i){return'<option value="'+p[0]+'"'+(i===D.cur?' selected':'')+'>'+(i+1)+'. '+esc(p[1])+'</option>'}).join('')+'</select>'+
(prev?'<a href="'+prev[0]+'" aria-label="Previous page">&larr;</a>':'')+(next?'<a href="'+next[0]+'" aria-label="Next page">&rarr;</a>':'')+
'<a href="/web-development#t-'+D.slug+'">All templates</a><a class="gold" target="_blank" rel="noopener" href="https://wa.me/'+NUM+'?text='+encodeURIComponent('Hello FCSE, I want the '+D.name+' template for my business.')+'">Order this</a>';
document.body.insertBefore(bar,document.body.firstChild);
$('select',bar).addEventListener('change',function(){location.href=this.value});
/* nav */
var mb=$('.mb');if(mb)mb.addEventListener('click',function(){var n=$('.nav');var on=n.classList.toggle('on');mb.setAttribute('aria-expanded',on)});
/* reveal + count */
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);var c=e.target.querySelector&&e.target.querySelector('[data-count]');if(c)count(c)}})},{threshold:.12}):null;
$$('.rv').forEach(function(e){io?io.observe(e):e.classList.add('in')});
setTimeout(function(){$$('.rv').forEach(function(e){e.classList.add('in')})},2500);
function count(el){var t=el.getAttribute('data-count'),m=t.match(/^([^\d]*)([\d.,]+)(.*)$/);if(!m)return;var n=parseFloat(m[2].replace(/,/g,'')),s=Date.now();(function f(){var p=Math.min(1,(Date.now()-s)/1100),dec=(m[2].indexOf(".")>-1),v=dec?(n*p).toFixed(1):Math.round(n*p).toLocaleString();el.textContent=m[1]+v+m[3];if(p<1)requestAnimationFrame(f)})()}
/* wa forms and buttons */
document.addEventListener('submit',function(e){var f=e.target.closest('form[data-wa]');if(!f)return;e.preventDefault();wa(f.getAttribute('data-wa')+'\n'+fd(f))});
document.addEventListener('click',function(e){var a=e.target.closest('[data-wa]');if(a&&a.tagName!=='FORM'){e.preventDefault();wa(a.getAttribute('data-wa'))}});
/* chips + gallery filter + lightbox */
document.addEventListener('click',function(e){var b=e.target.closest('.chp');if(!b)return;var bar=b.parentNode;$$('.chp',bar).forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');var v=b.dataset.v,tg=bar.getAttribute('data-chips');if(tg==='gal'){$$('#gal figure').forEach(function(f){f.style.display=(v==='All'||f.dataset.cat===v)?'':'none'})}else if(tg==='list'){window.__cat=v;window.runList&&runList()}});
var lb;document.addEventListener('click',function(e){var f=e.target.closest('#gal figure');if(!f)return;if(!lb){lb=document.createElement('div');lb.className='lb';lb.innerHTML='<button aria-label="Close">&times;</button><div class="art"></div>';document.body.appendChild(lb);lb.addEventListener('click',function(){lb.classList.remove('on')})}var a=$('.art',f);$('.art',lb).style.backgroundImage=a.style.backgroundImage;lb.classList.add('on')});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lb)lb.classList.remove('on')});
/* generic list filter: [data-list] children carry data-cat data-q data-price data-rate */
window.runList=function(){var q=($('[data-search]')||{value:''}).value.toLowerCase(),cat=window.__cat||'All',sort=($('[data-sort]')||{value:''}).value,box=$('[data-list]');var items=$$('[data-item]',box),n=0;items.forEach(function(it){var ok=(cat==='All'||it.dataset.cat===cat)&&(!q||it.dataset.q.toLowerCase().indexOf(q)>-1);it.style.display=ok?'':'none';if(ok)n++});if(sort){var vis=items.slice().sort(function(a,b){var k=sort==='price-asc'?['price',1]:sort==='price-desc'?['price',-1]:['rate',-1];return(parseFloat(a.dataset[k[0]])-parseFloat(b.dataset[k[0]]))*k[1]});vis.forEach(function(v){box.appendChild(v)})}var c=$('[data-count-out]');if(c)c.textContent=n+' result'+(n==1?'':'s')};
document.addEventListener('input',function(e){if(e.target.matches('[data-search]'))runList()});
document.addEventListener('change',function(e){if(e.target.matches('[data-sort]'))runList()});
})();
