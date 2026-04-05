(()=>{const r=document.documentElement,f=document.querySelector('.siteFooter');if(!f)return;let a=0;const s=()=>{a=0;const h=Math.ceil(f.getBoundingClientRect().height);r.style.setProperty('--footer-h',h+'px')},q=()=>{a&&cancelAnimationFrame(a);a=requestAnimationFrame(s)};q();window.addEventListener('load',q,{passive:true});window.addEventListener('resize',q,{passive:true});window.addEventListener('orientationchange',q,{passive:true});'ResizeObserver'in window&&new ResizeObserver(q).observe(f);document.addEventListener('visibilitychange',()=>{document.hidden||q()},{passive:true})})();

// Botón confirmar para tablet/móvil
(()=>{
  // Solo activar en dispositivos táctiles
  if(!('ontouchstart' in window) && !navigator.maxTouchPoints) return;

  // Crear el botón flotante
  const btn = document.createElement('button');
  btn.id = 'btnConfirmarTactil';
  btn.textContent = '✓ Confirmar';
  btn.style.cssText = [
    'position:fixed',
    'bottom:24px',
    'right:20px',
    'z-index:9999',
    'display:none',
    'align-items:center',
    'gap:6px',
    'padding:12px 22px',
    'background:#2b4faa',
    'color:#fff',
    'border:none',
    'border-radius:999px',
    'font-size:1rem',
    'font-weight:700',
    'box-shadow:0 4px 18px rgba(43,79,170,0.35)',
    'cursor:pointer',
    'touch-action:manipulation'
  ].join(';');
  document.body.appendChild(btn);

  let inputActivo = null;

  // Mostrar el botón cuando el usuario enfoca un input de la calculadora
  document.addEventListener('focusin', e => {
    const el = e.target;
    if(el.tagName === 'INPUT' && el.type !== 'radio' && el.type !== 'checkbox' && el.type !== 'hidden') {
      inputActivo = el;
      btn.style.display = 'flex';
    }
  }, true);

  // Ocultar el botón cuando el foco sale de un input
  document.addEventListener('focusout', e => {
    // Pequeño delay para que el click en el botón pueda procesarse antes
    setTimeout(() => {
      if(document.activeElement !== btn && document.activeElement && document.activeElement.tagName !== 'INPUT') {
        btn.style.display = 'none';
        inputActivo = null;
      }
    }, 200);
  }, true);

  // Al pulsar el botón, disparar Enter en el input activo
  btn.addEventListener('click', () => {
    if(!inputActivo) return;
    inputActivo.focus();
    // Disparar keydown con Enter
    const ev = new KeyboardEvent('keydown', {
      key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
      bubbles: true, cancelable: true
    });
    inputActivo.dispatchEvent(ev);
    // Si el input sigue activo (no se desactivó), disparar también input event
    if(!inputActivo.disabled) {
      inputActivo.dispatchEvent(new Event('input', {bubbles:true}));
    }
  });
})();
