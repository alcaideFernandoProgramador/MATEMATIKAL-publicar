(()=>{const r=document.documentElement,f=document.querySelector('.siteFooter');if(!f)return;let a=0;const s=()=>{a=0;const h=Math.ceil(f.getBoundingClientRect().height);r.style.setProperty('--footer-h',h+'px')},q=()=>{a&&cancelAnimationFrame(a);a=requestAnimationFrame(s)};q();window.addEventListener('load',q,{passive:true});window.addEventListener('resize',q,{passive:true});window.addEventListener('orientationchange',q,{passive:true});'ResizeObserver'in window&&new ResizeObserver(q).observe(f);document.addEventListener('visibilitychange',()=>{document.hidden||q()},{passive:true})})();

// El banner de consentimiento de cookies casero se ha eliminado.
// Lo gestiona la CMP certificada de Google (panel AdSense → Privacy & messaging
// → European regulations message), que es la requerida desde el 16 de enero
// de 2024 para servir anuncios de AdSense a tráfico EEE/UK/Suiza.
// La variable CSS --consent-h se conserva por compatibilidad por si en el
// futuro se quiere reservar espacio inferior para el banner de la CMP.
