document.addEventListener('DOMContentLoaded',()=>{const $=id=>document.getElementById(id),all=(s,c=document)=>Array.from(c.querySelectorAll(s));
const normalizaUrl=u=>{if(!u)return'';let i=u.indexOf('#');return i>=0?u.slice(0,i):u};
const head=async u=>{try{return await fetch(normalizaUrl(u),{method:'HEAD',cache:'no-store'})}catch(_){return null}};
const esPdf=async u=>{let r=await head(u);if(!r||!r.ok)return false;let ct=(r.headers.get('content-type')||'').toLowerCase();return ct.includes('pdf')};
const esDescargable=async u=>{let r=await head(u);if(!r||!r.ok)return false;let ct=(r.headers.get('content-type')||'').toLowerCase();return !ct.includes('text/html')};
const vistaDefault=a=>{let pdf=a?.getAttribute('data-help-pdf')||'INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300';
let docx=a?.getAttribute('data-help-docx')||'INSTRUCCIONES/Ayuda.docx';return {pdf,docx}};
const asegurarBtnDescarga=(c,docx)=>{if(!c)return;let b=c.querySelector('.btnDescarga');if(!b){b=document.createElement('a');b.className='btnDescarga';b.textContent='Descargar DOCX';
b.style.cssText='position:absolute;top:12px;right:48px;font:12px system-ui;text-decoration:none;border:1px solid #888;padding:6px 10px;border-radius:6px;background:#f7f7f7';
c.style.position='relative';c.appendChild(b)}
if(docx){b.style.display='inline-block';b.href=docx;b.setAttribute('download','')}else{b.style.display='none';b.removeAttribute('href');b.removeAttribute('download')}};
const cerrar=v=>{if(!v)return;v.style.display='none';let f=v.querySelector('iframe');if(f){f.removeAttribute('srcdoc');f.src=''}};
const abrir=async a=>{if(!a)return;let id=a.id||'',m=id.match(/abreVentana(\d+)/),n=m?m[1]:'1',v=$('ventana'+n),f=$('pdf'+n);
if(!v||!f){v=a.closest('header,body')?.querySelector('.ventana');f=v?.querySelector('iframe')}
if(!v||!f)return;let c=v.querySelector('.contenidoVentana')||v,urls=vistaDefault(a);
let ok=await esPdf(urls.pdf);if(!ok){f.src='';f.setAttribute('srcdoc','<div style="font:14px system-ui;padding:16px"><h3>Ayuda no disponible</h3><p>No se ha encontrado un PDF válido en <code>'+normalizaUrl(urls.pdf)+'</code>.</p><p>Si existe una regla que redirige 404 a <code>index.html</code>, Cloudflare puede estar devolviendo HTML en vez del PDF.</p><p><a href="'+normalizaUrl(urls.pdf)+'" target="_blank" rel="noopener">Abrir el recurso en una pestaña nueva</a></p></div>')}
else{f.removeAttribute('srcdoc');f.src=urls.pdf}
let docxOk=urls.docx?await esDescargable(urls.docx):false;asegurarBtnDescarga(c,docxOk?urls.docx:null);
v.style.display='flex'};
document.addEventListener('click',e=>{let a=e.target.closest('.abreVentana');if(a){e.preventDefault();e.stopImmediatePropagation();abrir(a);return}
let x=e.target.closest('.cierraVentana');if(x){let v=x.closest('.ventana');if(v){e.stopImmediatePropagation();cerrar(v)}return}
let v=e.target.classList?.contains('ventana')?e.target:null;if(v){e.stopImmediatePropagation();cerrar(v)}},true);
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;all('.ventana').forEach(v=>cerrar(v))});
});