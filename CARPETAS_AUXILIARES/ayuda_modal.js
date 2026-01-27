document.addEventListener('DOMContentLoaded',()=>{const $=id=>document.getElementById(id),all=(s,c=document)=>Array.from(c.querySelectorAll(s));
const baseDir=()=>{let p=location.pathname;return p.endsWith('/')?p:p.replace(/\/[^\/]*$/,'/')};
const normalizaUrl=u=>{if(!u)return'';let i=u.indexOf('#');return i>=0?u.slice(0,i):u};
const resuelve=u=>{if(!u)return'';let i=u.indexOf('#'),h=i>=0?u.slice(i):'',p=i>=0?u.slice(0,i):u;
if(/^(https?:)?\/\//.test(p)||p.startsWith('/'))return p+h;return baseDir()+p.replace(/^\//,'')+h};
const head=async u=>{try{return await fetch(normalizaUrl(u),{method:'HEAD',cache:'no-store'})}catch(_){return null}};
const contentType=async u=>{let r=await head(u);if(!r||!r.ok)return'';return (r.headers.get('content-type')||'').toLowerCase()};
const esHtml=ct=>!!ct&&ct.includes('text/html');
const esDescargable=async u=>{let ct=await contentType(u);return !ct||!esHtml(ct)};
const vistaDefault=a=>{let pdf=a?.getAttribute('data-help-pdf')||'INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300';
let docx=a?.getAttribute('data-help-docx')||'INSTRUCCIONES/Ayuda.docx';return {pdf,docx}};
const asegurarBtnDescarga=(c,docx)=>{if(!c)return;let b=c.querySelector('.btnDescarga');
if(!b){b=document.createElement('a');b.className='btnDescarga';b.textContent='Descargar DOCX';
b.style.cssText='position:absolute;top:12px;right:48px;font:12px system-ui;text-decoration:none;'+
'border:1px solid #888;padding:6px 10px;border-radius:6px;background:#f7f7f7';
c.style.position='relative';c.appendChild(b)}
if(docx){b.style.display='inline-block';b.href=docx;b.setAttribute('download','')}else{b.style.display='none';
b.removeAttribute('href');b.removeAttribute('download')}};
const cerrar=v=>{if(!v)return;v.style.display='none';let f=v.querySelector('iframe');if(f){f.removeAttribute('srcdoc');f.src=''}};
const srcdocError=pdf=>'<div style="font:14px system-ui;padding:16px"><h3>Ayuda no disponible</h3>'+
'<p>No se ha encontrado un PDF válido en <code>'+normalizaUrl(pdf)+'</code>.</p>'+
'<p>Si existe una regla que redirige 404 a <code>index.html</code>, el servidor puede estar devolviendo HTML.</p>'+
'<p><a href="'+normalizaUrl(pdf)+'" target="_blank" rel="noopener">Abrir el recurso en una pestaña nueva</a></p></div>';
const abrir=async a=>{if(!a)return;let id=a.id||'',m=id.match(/abreVentana(\d+)/),n=m?m[1]:'1',v=$('ventana'+n),f=$('pdf'+n);
if(!v||!f){v=a.closest('header,body')?.querySelector('.ventana');f=v?.querySelector('iframe')}if(!v||!f)return;
let c=v.querySelector('.contenidoVentana')||v,urls=vistaDefault(a),pdf=resuelve(urls.pdf),docx=resuelve(urls.docx),ct=await contentType(pdf);
if(esHtml(ct)){f.src='';f.setAttribute('srcdoc',srcdocError(pdf))}else{f.removeAttribute('srcdoc');f.src=pdf}
let docxOk=docx?await esDescargable(docx):false;asegurarBtnDescarga(c,docxOk?docx:null);v.style.display='flex'};
document.addEventListener('click',e=>{let a=e.target.closest('.abreVentana');
if(a){e.preventDefault();e.stopImmediatePropagation();abrir(a);return}
let x=e.target.closest('.cierraVentana');if(x){let v=x.closest('.ventana');if(v){e.stopImmediatePropagation();cerrar(v)}return}
let v=e.target.classList?.contains('ventana')?e.target:null;if(v){e.stopImmediatePropagation();cerrar(v)}},true);
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;all('.ventana').forEach(v=>cerrar(v))});
});
