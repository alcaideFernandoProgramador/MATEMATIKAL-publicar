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

// ===== Botón "✓ Validar" en las calculadoras (solo móvil y tablet) =====
// Hace lo mismo que pulsar ENTER en el campo activo. No aparece en PC (puntero principal = ratón o panel táctil).
(function(){
  if(location.pathname.indexOf('/PAGINAS/')===-1)return;
  var tactil=function(){return !!(window.matchMedia&&window.matchMedia('(pointer: coarse)').matches);};
  var esCampo=function(e){if(!e||e.tagName!=='INPUT'||e.disabled||e.readOnly)return false;var t=(e.getAttribute('type')||'text').toLowerCase();
    if(t!=='text'&&t!=='number'&&t!=='search')return false;if(e.closest('.siteFooter,#mk-consent-banner,.ventana'))return false;return !!e.closest('#contenedor,#calculadora');};
  var b=null,activo=null;
  var crear=function(){if(b)return b;b=document.createElement('button');b.id='btnValidar';b.className='mk-btn-validar';b.type='button';b.textContent='✓ Validar';b.style.display='none';document.body.appendChild(b);
    b.addEventListener('pointerdown',function(e){e.preventDefault();});b.addEventListener('mousedown',function(e){e.preventDefault();});
    b.addEventListener('click',function(){if(!activo)return;var campo=activo;campo.focus();
      campo.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',keyCode:13,which:13,bubbles:true,cancelable:true}));
      setTimeout(function(){if(esCampo(document.activeElement)){activo=document.activeElement;colocar();}else ocultar();},30);});return b;};
  var ocultar=function(){activo=null;if(b)b.style.display='none';};
  var colocar=function(){if(!b)return;if(!activo||!document.body.contains(activo)||!activo.getClientRects().length){ocultar();return;}
    var par=activo.parentElement,ancla=activo.closest('#marcoEntrada')||activo.closest('table')||(par&&par.querySelectorAll('input').length>1?par:activo);
    var ra=ancla.getBoundingClientRect(),ri=activo.getBoundingClientRect(),vw=document.documentElement.clientWidth;b.style.display='block';var w=b.offsetWidth,h=b.offsetHeight,x,y;
    if(ra.right+8+w<=vw-4){x=ra.right+8;y=ri.top+ri.height/2-h/2;}else{x=Math.max(4,Math.min(ri.left,vw-w-4));y=ra.bottom+6;}
    b.style.left=(x+window.scrollX)+'px';b.style.top=(y+window.scrollY)+'px';};
  document.addEventListener('focusin',function(e){if(esCampo(e.target)&&tactil()){crear();activo=e.target;requestAnimationFrame(colocar);}else if(e.target!==b)ocultar();});
  document.addEventListener('focusout',function(){setTimeout(function(){if(b&&document.activeElement!==b&&!esCampo(document.activeElement))ocultar();},150);});
  window.addEventListener('scroll',function(){if(activo)requestAnimationFrame(colocar);},{passive:true,capture:true});
  window.addEventListener('resize',function(){if(activo)requestAnimationFrame(colocar);},{passive:true});
  var inicio=function(){if(esCampo(document.activeElement)&&tactil()){crear();activo=document.activeElement;requestAnimationFrame(colocar);}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(inicio,300);});else setTimeout(inicio,300);
})();
