(()=>{const r=document.documentElement,f=document.querySelector('.siteFooter');if(!f)return;let a=0;const s=()=>{a=0;const h=Math.ceil(f.getBoundingClientRect().height);r.style.setProperty('--footer-h',h+'px')},q=()=>{a&&cancelAnimationFrame(a);a=requestAnimationFrame(s)};q();window.addEventListener('load',q,{passive:true});window.addEventListener('resize',q,{passive:true});window.addEventListener('orientationchange',q,{passive:true});'ResizeObserver'in window&&new ResizeObserver(q).observe(f);document.addEventListener('visibilitychange',()=>{document.hidden||q()},{passive:true})})();

// ===== Cookie consent banner =====
(function(){
  if(localStorage.getItem('mk_consent')!==null)return;
  var b=document.createElement('div');
  b.id='mk-consent-banner';
  b.innerHTML='<div class="mk-cb-inner"><p class="mk-cb-text">Usamos cookies propias y de Google AdSense para mostrar publicidad. Puedes aceptar o rechazar el uso de cookies de publicidad. <a class="mk-cb-link" href="/cookies.html">Más información</a></p><div class="mk-cb-btns"><button class="mk-cb-reject" id="mk-cb-reject">Rechazar</button><button class="mk-cb-accept" id="mk-cb-accept">Aceptar todo</button></div></div>';
  document.body.appendChild(b);
  var ra=0;
  function syncH(){ra=0;var h=Math.ceil(b.getBoundingClientRect().height);document.documentElement.style.setProperty('--consent-h',h+'px');}
  function qH(){ra&&cancelAnimationFrame(ra);ra=requestAnimationFrame(syncH);}
  qH();window.addEventListener('resize',qH,{passive:true});
  'ResizeObserver'in window&&new ResizeObserver(qH).observe(b);
  function dismiss(choice){
    localStorage.setItem('mk_consent',choice);
    if(typeof gtag==='function'){
      var v=choice==='granted'?'granted':'denied';
      gtag('consent','update',{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v});
    }
    b.remove();
    document.documentElement.style.removeProperty('--consent-h');
  }
  document.getElementById('mk-cb-accept').addEventListener('click',function(){dismiss('granted');});
  document.getElementById('mk-cb-reject').addEventListener('click',function(){dismiss('denied');});
})();
