(()=>{let a=null,b=0,c=0,e=0,f=0;
function g(h){return h&&h.closest?h.closest(".ventana"):null}
function i(h){let j=h.querySelector(".contenidoVentana");if(!j)return;
if(!j.querySelector(".barraVentana")){let k=document.createElement("div");k.className="barraVentana";
let l=document.createElement("div");l.className="tituloVentana";l.textContent="Ayuda";
let m=document.createElement("div");m.className="accionesVentana";
let n=document.createElement("button");n.type="button";n.className="btnVentana btnFull";n.textContent="⛶";
let o=document.createElement("button");o.type="button";o.className="btnVentana btnClose";o.textContent="✕";
m.append(n,o);k.append(l,m);j.prepend(k)}
let p=j.querySelector("iframe"),q=j.querySelector(".cuerpoVentana");if(p&&!q){q=document.createElement("div");q.className="cuerpoVentana";p.parentNode.insertBefore(q,p);q.appendChild(p)}
h.classList.add("is-open")}
function r(h){let j=h.querySelector(".contenidoVentana");if(!j)return;
h.classList.remove("fullscreen");j.style.left="50%";j.style.top="50%";j.style.transform="translate(-50%,-50%)";j.style.right="";j.style.bottom="";j.style.margin=""}
function s(h){let j=h.querySelector(".contenidoVentana");if(!j)return;
if(document.fullscreenElement){document.exitFullscreen();h.classList.remove("fullscreen");return}
h.classList.add("fullscreen");(j.requestFullscreen?j:j).requestFullscreen?.()}
function t(h){let j=h.querySelector(".contenidoVentana"),k=j&&j.querySelector(".barraVentana");if(!j||!k)return;
k.addEventListener("mousedown",u);k.addEventListener("touchstart",v,{passive:false})}
function w(x,y){if(!a)return;let j=a.querySelector(".contenidoVentana");if(!j||a.classList.contains("fullscreen"))return;
let nx=e+(x-b),ny=f+(y-c);j.style.transform="none";j.style.left=nx+"px";j.style.top=ny+"px"}
function u(ev){let h=g(ev.target);if(!h)return;let j=h.querySelector(".contenidoVentana");if(!j||h.classList.contains("fullscreen"))return;
a=h;let rect=j.getBoundingClientRect();b=ev.clientX;c=ev.clientY;e=rect.left;f=rect.top;
document.addEventListener("mousemove",y);document.addEventListener("mouseup",z);ev.preventDefault()}
function v(ev){let h=g(ev.target);if(!h)return;let j=h.querySelector(".contenidoVentana");if(!j||h.classList.contains("fullscreen"))return;
let t0=ev.touches[0];a=h;let rect=j.getBoundingClientRect();b=t0.clientX;c=t0.clientY;e=rect.left;f=rect.top;
document.addEventListener("touchmove",A,{passive:false});document.addEventListener("touchend",B);ev.preventDefault()}
function y(ev){w(ev.clientX,ev.clientY)}
function z(){document.removeEventListener("mousemove",y);document.removeEventListener("mouseup",z);a=null}
function A(ev){let t0=ev.touches[0];w(t0.clientX,t0.clientY);ev.preventDefault()}
function B(){document.removeEventListener("touchmove",A);document.removeEventListener("touchend",B);a=null}
document.addEventListener("click",ev=>{let h=g(ev.target);if(!h)return;
if(ev.target.closest(".btnFull")){s(h);return}
if(ev.target.closest(".btnClose")){r(h);h.style.display="none";h.classList.remove("is-open");return}});
document.addEventListener("fullscreenchange",()=>{document.querySelectorAll(".ventana.fullscreen").forEach(h=>{if(!document.fullscreenElement)h.classList.remove("fullscreen")})});
window.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".ventana").forEach(h=>{i(h);t(h)})});
})();