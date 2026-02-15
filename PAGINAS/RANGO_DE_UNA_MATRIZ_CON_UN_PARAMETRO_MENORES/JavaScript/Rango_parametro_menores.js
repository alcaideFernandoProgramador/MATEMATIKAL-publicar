let ventana1,contenedor,caja1,tituloCaja1,ventana2,caja2,tituloUsuario,ventana3;
let matriz=null,nombreMatriz=null,matrizInicial=null;
let estadoMenoresMax=null,menorActual=null,menorElegidoDet=null,menorElegidoMat=null;
let solucionesPaso3=[],casosEstudiados=[],huboPaso4=false;
let cajaFormulario=null,caja124=null,caja125=null,autoModo=null,autoBody=null;
let cacheMenores={},finalSolucion=null;
if(typeof globalThis.matrizObjeto==="undefined"||globalThis.matrizObjeto===null)globalThis.matrizObjeto={};
var matrizObjeto=globalThis.matrizObjeto;

function inyectarEstilosUI(){let css=":root{--b:#222;--bh:#111;--bd:#bbb;--bg:#fafafa;--fg:#333}"+
".panel{border:1px solid var(--b);border-radius:8px;padding:10px;margin:14px 0;background:var(--bg)}"+
".step{font-weight:700;text-decoration:underline;margin:0 0 6px 0}"+
".btn{padding:4px 10px;border:1px solid var(--b);border-radius:6px;background:#fff;cursor:pointer}"+
".btn:hover{background:#eee}"+
".rad{display:flex;align-items:center;gap:8px;height:24px}"+
".tiles{margin-top:8px;overflow-x:auto;white-space:nowrap;padding:6px 0;border-top:1px solid #ddd}"+
".tile{display:inline-block;vertical-align:top;margin-right:16px;border:1px dashed #aaa;padding:6px;min-width:180px;font-size:12px;border-radius:6px;background:#fff}"+
".badge{font-weight:700;margin-bottom:4px}"+
".mut{color:#666}"+
".math{display:inline-block;font-size:13px;line-height:1.25;vertical-align:middle}"+
".chips{display:flex;flex-wrap:wrap;gap:6px}"+
".chip{border:1px dashed #888;padding:2px 6px;border-radius:6px;background:#fff}"+
".ok{color:#0a0}.err{color:#b00}"+
".boxThin{border:2px solid #333;border-radius:8px;padding:10px;max-width:96%}"+
".kv{font-weight:700}"+
".katex{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}";
let st=document.createElement("style");st.textContent=css;document.head.appendChild(st);}

function hasKatex(){return typeof katex!=="undefined"&&katex.render;}
function toLatex(x){let s=String(x??"");if(globalThis.ExpresionAlgebraica&&ExpresionAlgebraica.pasarALatex)try{return ExpresionAlgebraica.pasarALatex(s);}catch(e){}return s;}
function renderLatex(latex,el){if(hasKatex())katex.render(latex,el,{throwOnError:false});else el.textContent=latex;}
function spanMathFromLatex(latex,cls){let sp=document.createElement("span");sp.className=cls||"math";renderLatex(latex,sp);return sp;}
function spanMathExpr(expr,cls){return spanMathFromLatex(toLatex(expr),cls);}
function latexJoinSolutions(arr){let a=(arr||[]).filter(s=>typeof s==="string"&&s.trim()!=="").map(s=>toLatex(s.trim()));return a.join(",\\;");}
function renderDet(menor,cls){let sp=document.createElement("span");sp.className=cls||"math";try{Representar.determinante(menor,sp);}catch(e){sp.textContent="";sp.appendChild(spanMathFromLatex("\\text{(error)}","math"));}return sp;}

function aCadenas(A){return (A||[]).map(r=>(r||[]).map(x=>String(x??"0")));}
function detValor(A){try{if(typeof Matriz==="undefined"||typeof Matriz.determinante!=="function")return "(no existe Matriz.determinante)";return String(Matriz.determinante(aCadenas(A)));}catch(e){return "(no se pudo calcular el determinante)";}}
function simplDetStr(s){let t=String(s??"");if(globalThis.ExpresionAlgebraica&&typeof ExpresionAlgebraica.simplificar==="function")try{t=String(ExpresionAlgebraica.simplificar(t));}catch(e){}return t;}
function dependeParametroDet(s){return /[a-zA-Z]/.test(String(s??""));}
function esCeroDet(d){let s=String(d??"").replace(/\s+/g,"");if(!s)return true;s=simplDetStr(s).replace(/\s+/g,"");if(/^[-+]?0+(\.0+)?$/.test(s))return true;if(/^[-+]?0+\/\d+$/.test(s))return true;return false;}
function uniqSoluciones(arr){let out=[],seen=new Set();(arr||[]).forEach(s=>{if(typeof s!=="string")return;let k=s.replace(/\s+/g,"");if(!k||seen.has(k))return;seen.add(k);out.push(s.trim());});return out;}

function autoScroll(){requestAnimationFrame(()=>{let c=document.getElementById("caja21");if(c)c.scrollTop=c.scrollHeight;});}
function paso(t){let b=document.createElement("div");b.className="step";b.textContent=t[0].toUpperCase()+t.slice(1);return b;}
function envoltorioPaso(){let w=document.createElement("div");w.className="panel";return w;}

function ensureCasosEspeciales(){let box=document.getElementById("casosEspeciales");if(box)return box;let host=document.getElementById("caja113");if(!host)return null;
box=document.createElement("div");box.id="casosEspeciales";box.style.marginTop="8px";
let h=document.createElement("div");h.style.fontWeight="bold";h.style.marginBottom="4px";h.textContent="Casos especiales que se deben estudiar:";box.appendChild(h);
let l=document.createElement("div");l.id="listaCasosEspeciales";l.className="chips";box.appendChild(l);host.appendChild(box);return box;}
function eliminarCasoEspecial(raw){let host=document.getElementById("listaCasosEspeciales");if(!host)return;[...host.children].forEach(n=>{if((n.dataset&&n.dataset.raw)===raw)host.removeChild(n);});}
function getCasosPendientes(){let host=document.getElementById("listaCasosEspeciales");return host?[...host.children].map(n=>(n.dataset&&n.dataset.raw)||"").filter(Boolean):[];}

function ocultarPaso(num){let r=document.getElementById("row-"+num);if(!r)return;r.style.setProperty("display","none","important");let inp=r.querySelector('input[type="radio"]');if(inp)inp.disabled=true;}
function mostrarTodosPasos(){for(let i=1;i<=6;i++){let r=document.getElementById("row-"+i);if(!r)continue;r.style.setProperty("display","flex","important");let inp=r.querySelector('input[type="radio"]');if(inp)inp.disabled=false;}}

function resetEstado(){estadoMenoresMax=null;menorActual=null;menorElegidoDet=null;menorElegidoMat=null;solucionesPaso3=[];casosEstudiados=[];huboPaso4=false;cacheMenores={};finalSolucion=null;
let ce=document.getElementById("listaCasosEspeciales");if(ce)ce.innerHTML="";}
function resetTotalUI(){resetEstado();mostrarTodosPasos();if(caja124)caja124.innerHTML="";if(caja125)caja125.innerHTML="";document.querySelectorAll('input[name="option"]').forEach(op=>op.checked=false);
let caja21=document.getElementById("caja21");if(caja21)caja21.innerHTML="";if(autoBody)autoBody.innerHTML="";if(autoModo&&cajaFormulario&&caja2){autoModo.style.display="none";cajaFormulario.style.display="";caja2.style.display="block";}}
function desmarcarOpcionActual(){const m=document.querySelector('input[name="option"]:checked');if(m){m.checked=false;m.blur();m.dispatchEvent(new Event("change",{bubbles:true}));}}

function combos(n,k){let a=[...Array(n).keys()].map(i=>i+1),res=[];function bt(start,path){if(path.length===k){res.push(path.slice());return;}
for(let i=start;i<=a.length-(k-path.length)+1;i++)bt(i+1,path.concat(a[i-1]));}bt(1,[]);return res;}
function submatriz(mat,filas,cols){return filas.map(f=>cols.map(c=>mat[f-1][c-1]));}
function parseCaso(str){let p="",v="";if(typeof str!=="string")return{p,v};let t=str.replace(/\s+/g,""),m=t.match(/^([a-zA-Z])=(.+)$/);if(m){p=m[1];v=m[2];}return{p,v};}

function construirEstadoMenores(mat,ord,calcDet){
let m=mat.length,n=mat[0].length,F=combos(m,ord),C=combos(n,ord),total=F.length*C.length,lista=[],idx=1;
for(let i=0;i<F.length;i++)for(let j=0;j<C.length;j++){
let filas=F[i],cols=C[j],menor=submatriz(mat,filas,cols),it={id:idx,filas,cols,menor,det:null,esCero:null,dep:null};
if(calcDet){it.det=simplDetStr(detValor(menor));it.esCero=esCeroDet(it.det);it.dep=dependeParametroDet(it.det);}lista.push(it);idx++;}
return {k:ord,F,C,lista,total,probados:new Set()};}

function asegurarDet(it){if(it.det==null){it.det=simplDetStr(detValor(it.menor));it.esCero=esCeroDet(it.det);it.dep=dependeParametroDet(it.det);}return it;}
function asegurarDetDeLista(st){st.lista.forEach(it=>{if(it.det==null){it.det=simplDetStr(detValor(it.menor));it.esCero=esCeroDet(it.det);it.dep=dependeParametroDet(it.det);}else{it.det=simplDetStr(it.det);it.esCero=esCeroDet(it.det);it.dep=dependeParametroDet(it.det);}});}

function buscarMenorNoNulo(A,ord){
let m=A.length,n=A[0].length,F=combos(m,ord),C=combos(n,ord);
for(let i=0;i<F.length;i++)for(let j=0;j<C.length;j++){
let M=submatriz(A,F[i],C[j]);let d=simplDetStr(detValor(M));if(!esCeroDet(d))return{filas:F[i],cols:C[j],det:String(d),menor:M};}
return null;}

function avisoOrdenBaja(kFrom,kTo,host){
let cajaT=host||document.getElementById("caja21");let w=envoltorioPaso();w.appendChild(paso("Aviso"));
let fila=document.createElement("div");fila.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;";
fila.appendChild(spanMathFromLatex(`\\text{Todos los menores de orden }${kFrom}\\text{ son nulos exactamente.}`,"math"));
fila.appendChild(spanMathFromLatex(`\\;\\Rightarrow\\;\\text{se pasa a estudiar menores de orden }${kTo}.`,"math"));
w.appendChild(fila);cajaT.appendChild(w);if(!host)autoScroll();}

function avisoTodosNulosOrden(k,host){
let cajaT=host||document.getElementById("caja21");if(!cajaT)return;
let w=envoltorioPaso();w.appendChild(paso("Aviso"));
let fila=document.createElement("div");fila.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;";
fila.appendChild(spanMathFromLatex(`\\text{Todos los menores de orden }${k}\\text{ son nulos exactamente.}`,"math"));
w.appendChild(fila);cajaT.appendChild(w);if(!host)autoScroll();}

function ofrecerResumenEnFormulario(){
if(!caja124)return;caja124.innerHTML="";
let t=document.createElement("div");t.className="ok";t.style.fontSize="14px";t.textContent="Se ha obtenido una solución final. Puedes generar el resumen aquí:";caja124.appendChild(t);
let btn=document.createElement("button");btn.className="btn";btn.style.marginTop="6px";btn.textContent="Ver resumen";
btn.addEventListener("click",()=>{uiResumenCasos(null);});caja124.appendChild(btn);}

function finalizarConstante(ord,it,host){
finalSolucion={tipo:"const",rank:ord,menor:it.menor,det:it.det};
let cajaT=host||document.getElementById("caja21");let w=envoltorioPaso();w.appendChild(paso("Solución final"));
let fila=document.createElement("div");fila.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;";
fila.appendChild(spanMathFromLatex(`\\text{Existe un menor de orden }${ord}\\text{ no nulo exactamente:}`,"math"));w.appendChild(fila);
let fila2=document.createElement("div");fila2.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;";
fila2.appendChild(renderDet(it.menor,"math"));fila2.appendChild(spanMathFromLatex("=","math"));fila2.appendChild(spanMathExpr(it.det,"math"));w.appendChild(fila2);
let fila3=document.createElement("div");fila3.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;";
fila3.appendChild(spanMathFromLatex(`\\Rightarrow\\;\\operatorname{rg}(A)=${ord}`,"math"));w.appendChild(fila3);
cajaT.appendChild(w);if(!host)autoScroll();
ocultarPaso(2);ocultarPaso(3);ocultarPaso(4);ocultarPaso(6);ofrecerResumenEnFormulario();}

function finalizarRangoCero(host){
finalSolucion={tipo:"cero",rank:0};
let cajaT=host||document.getElementById("caja21");let w=envoltorioPaso();w.appendChild(paso("Solución final"));
let fila=document.createElement("div");fila.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:13px;";
fila.appendChild(spanMathFromLatex("\\text{Todos los menores de orden 1 son nulos exactamente.}\\;\\Rightarrow\\;\\operatorname{rg}(A)=0","math"));w.appendChild(fila);
cajaT.appendChild(w);if(!host)autoScroll();
ocultarPaso(2);ocultarPaso(3);ocultarPaso(4);ocultarPaso(6);ofrecerResumenEnFormulario();}

function prepararOrdenHastaUtil(host){
if(!estadoMenoresMax||!estadoMenoresMax.k)return "noestado";
while(true){
cacheMenores[estadoMenoresMax.k]=estadoMenoresMax;asegurarDetDeLista(estadoMenoresMax);
let constNZ=estadoMenoresMax.lista.find(it=>!it.esCero&&!it.dep);
if(constNZ){finalizarConstante(estadoMenoresMax.k,constNZ,host);return "final";}
let depNZ=estadoMenoresMax.lista.find(it=>!it.esCero&&it.dep);
if(depNZ)return "seguir";
let allZero=estadoMenoresMax.lista.every(it=>it.esCero);
if(!allZero)return "seguir";
if(estadoMenoresMax.k<=1){avisoTodosNulosOrden(estadoMenoresMax.k,host);finalizarRangoCero(host);return "final";}
let kFrom=estadoMenoresMax.k,kTo=kFrom-1;avisoOrdenBaja(kFrom,kTo,host);
pintarListadoMenoresOrden(matriz,kTo,host,null,true);
let st=cacheMenores[kTo]||construirEstadoMenores(matriz,kTo,false);estadoMenoresMax=st;cacheMenores[kTo]=st;
}}
function pintarListadoMenoresOrden(mat,ord,host,notaExtra,skipHide){
let cajaT=host||document.getElementById("caja21"),wrap=envoltorioPaso();wrap.appendChild(paso("Paso 1: Menores de orden "+ord));
let m=mat.length,n=mat[0].length,total=combos(m,ord).length*combos(n,ord).length;
let nota=document.createElement("div");nota.style.marginTop="6px";nota.style.fontSize="14px";nota.style.fontWeight="bold";
nota.textContent=total===1?"Hay un único menor de orden "+ord:"Hay "+total+" menores de orden "+ord;wrap.appendChild(nota);
if(notaExtra){let ex=document.createElement("div");ex.className="mut";ex.style.marginTop="4px";ex.style.fontSize="13px";ex.textContent=notaExtra;wrap.appendChild(ex);}
let box=document.createElement("div");box.className="tiles";wrap.appendChild(box);
let st=cacheMenores[ord]||construirEstadoMenores(mat,ord,false);estadoMenoresMax=st;cacheMenores[ord]=st;let idx=1;
for(let i=0;i<st.lista.length;i++){
let it=st.lista[i],tile=document.createElement("div");tile.className="tile";
let badge=document.createElement("div");badge.className="badge";badge.textContent="#"+idx;tile.appendChild(badge);
let info=document.createElement("div");info.style.fontSize="12px";info.style.marginBottom="4px";
info.textContent="Filas ["+it.filas.join(", ")+"] • Columnas ["+it.cols.join(", ")+"]";tile.appendChild(info);
tile.appendChild(renderDet(it.menor,"math"));box.appendChild(tile);idx++;}
cajaT.appendChild(wrap);if(!skipHide)ocultarPaso(1);if(!host)autoScroll();}
function pintarListadoMenoresMax(mat,host){let k=Math.min(mat.length,mat[0].length);pintarListadoMenoresOrden(mat,k,host,null,false);}

function uiElegirMenorMax(){
if(finalSolucion){let e=document.createElement("div");e.className="ok";e.style.marginTop="10px";e.style.fontSize="14px";e.textContent="Ya existe una solución final. Puedes ver el resumen.";caja124.appendChild(e);return;}
if(!estadoMenoresMax){let e=document.createElement("div");e.className="err";e.style.marginTop="10px";e.style.fontSize="14px";e.textContent="Primero ejecuta el Paso 1 para listar los menores.";caja124.appendChild(e);return;}
let prep=prepararOrdenHastaUtil(null);if(prep==="final")return;
let caja21=document.getElementById("caja21"),wrap=envoltorioPaso();wrap.appendChild(paso("Paso 2: Elegir un menor de orden "+estadoMenoresMax.k));
let panel=document.createElement("div");panel.id="panelPaso2";panel.style.marginTop="6px";wrap.appendChild(panel);caja21.appendChild(wrap);

let ui=document.createElement("div");ui.style.cssText="margin-top:6px;font-size:14px;display:flex;align-items:center;gap:8px;";caja124.appendChild(ui);
let lab=document.createElement("div");lab.id="labPaso2";lab.textContent="Elige un número de menor del 1 al "+estadoMenoresMax.total+":";ui.appendChild(lab);
let hint=document.createElement("div");hint.className="mut";hint.id="hintPaso2";hint.textContent="Consejo: conviene elegir el menor en el que menos veces aparece el parámetro.";caja124.appendChild(hint);
let inNum=document.createElement("input");inNum.type="number";inNum.min=1;inNum.max=estadoMenoresMax.total;inNum.style.cssText="width:52px;text-align:center;";ui.appendChild(inNum);
let msg=document.createElement("div");msg.id="msgPaso2";msg.style.cssText="margin-top:6px;font-size:14px;";caja124.appendChild(msg);

function renderMenorSel(item,avisoNulo){
panel.innerHTML="";let fila=document.createElement("div");
fila.style.cssText="display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;";
fila.appendChild(renderDet(item.menor,"math"));fila.appendChild(spanMathFromLatex("=", "math"));fila.appendChild(spanMathExpr(item.det,"math"));
if(avisoNulo)fila.appendChild(spanMathFromLatex("\\;\\text{El menor elegido es nulo. Debes elegir otro menor}","math"));
panel.appendChild(fila);}

function elegirDep(it){
menorActual=[it.filas.slice(),it.cols.slice()];menorElegidoMat=it.menor;menorElegidoDet=it.det;
caja124.innerHTML="";caja125.innerHTML="";desmarcarOpcionActual();ocultarPaso(2);autoScroll();}

function aplicar(){
msg.textContent="";let v=parseInt(inNum.value,10),sel=estadoMenoresMax.lista.find(x=>x.id===v);
if(!sel){msg.className="err";msg.textContent="Número inválido. Elige entre 1 y "+estadoMenoresMax.total+".";return;}
if(estadoMenoresMax.probados.has(sel.id)){msg.className="err";msg.textContent="Ese menor ya se probó (era nulo). Elige otro.";return;}
asegurarDet(sel);renderMenorSel(sel,false);
if(sel.esCero){
estadoMenoresMax.probados.add(sel.id);renderMenorSel(sel,true);
caja124.innerHTML="";caja125.innerHTML="";desmarcarOpcionActual();
if(estadoMenoresMax.probados.size>=estadoMenoresMax.total){
let kFrom=estadoMenoresMax.k;asegurarDetDeLista(estadoMenoresMax);
let allZero=estadoMenoresMax.lista.every(it=>it.esCero);
if(allZero){
if(kFrom<=1){avisoTodosNulosOrden(kFrom,null);finalizarRangoCero(null);return;}
let kTo=kFrom-1;avisoOrdenBaja(kFrom,kTo,null);pintarListadoMenoresOrden(matriz,kTo,null,null,true);
estadoMenoresMax=cacheMenores[kTo]||construirEstadoMenores(matriz,kTo,false);cacheMenores[kTo]=estadoMenoresMax;
let prep=prepararOrdenHastaUtil(null);if(prep==="final")return;caja124.innerHTML="";caja125.innerHTML="";uiElegirMenorMax();return;}
}
return;}
if(!sel.dep){finalizarConstante(estadoMenoresMax.k,sel,null);return;}
elegirDep(sel);}

inNum.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();e.preventDefault();aplicar();}});inNum.focus();autoScroll();}

function elegirMenorMaxAuto(host){
if(!estadoMenoresMax||!estadoMenoresMax.lista||!estadoMenoresMax.lista.length)return null;
asegurarDetDeLista(estadoMenoresMax);
let candidatos=estadoMenoresMax.lista.filter(it=>!it.esCero&&it.dep);if(!candidatos.length)return null;
let best=candidatos[0];menorActual=[best.filas.slice(),best.cols.slice()];menorElegidoMat=best.menor;menorElegidoDet=best.det;
let wrap=envoltorioPaso();wrap.appendChild(paso("Paso 2: Elegir un menor de orden "+estadoMenoresMax.k));
let fila=document.createElement("div");fila.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;";
fila.appendChild(renderDet(best.menor,"math"));fila.appendChild(spanMathFromLatex("=", "math"));fila.appendChild(spanMathExpr(best.det,"math"));
fila.appendChild(spanMathFromLatex("\\;\\text{(elección automática)}","math"));wrap.appendChild(fila);(host||autoBody).appendChild(wrap);ocultarPaso(2);return best;}

function uiCerosDelMenor(host){
let cajaT=host||document.getElementById("caja21");
if(!menorActual||!Array.isArray(menorActual)||menorActual.length!==2){
let e=document.createElement("div");e.className="err";e.style.marginTop="10px";e.style.fontSize="14px";e.textContent="Primero elige un menor en el Paso 2.";
if(!host)caja124.appendChild(e);else cajaT.appendChild(e);return;}
let filas=menorActual[0].slice(),cols=menorActual[1].slice(),menor=menorElegidoMat||submatriz(matriz,filas,cols);
let det=simplDetStr(String(menorElegidoDet!=null?menorElegidoDet:detValor(menor)));menorElegidoDet=det;
let wrap=envoltorioPaso();wrap.appendChild(paso("Paso 3: Anulación del menor elegido"));
let fila=document.createElement("div");fila.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:12px;";
fila.appendChild(renderDet(menor,"math"));fila.appendChild(spanMathFromLatex("=", "math"));fila.appendChild(spanMathExpr(det,"math"));
fila.appendChild(spanMathFromLatex("=0\\;\\Rightarrow\\;\\text{Soluciones:}","math"));
let soluciones=[];try{soluciones=(Resolver&&Resolver.ecuacion)?Resolver.ecuacion(String(det)):[];soluciones=uniqSoluciones(soluciones);}catch(err){soluciones=[];}
solucionesPaso3=soluciones||[];let solLatex=solucionesPaso3.length?latexJoinSolutions(solucionesPaso3):"\\text{(no se encontraron en forma cerrada)}";
fila.appendChild(spanMathFromLatex(solLatex,"math"));wrap.appendChild(fila);
if(solucionesPaso3.length){
let box=ensureCasosEspeciales();if(box){let hostCh=box.querySelector("#listaCasosEspeciales");hostCh.innerHTML="";
solucionesPaso3.forEach(s=>{let chip=document.createElement("span");chip.className="chip";chip.dataset.raw=s;chip.appendChild(spanMathExpr(s,"math"));hostCh.appendChild(chip);});}}
cajaT.appendChild(wrap);if(!host){caja124.innerHTML="";caja125.innerHTML="";desmarcarOpcionActual();}ocultarPaso(3);if(!host)autoScroll();}

function calcularRangoCaso(host,p,v){
let cajaT=host||document.getElementById("caja21"),wrap=envoltorioPaso();
let A=Matriz.sustituir(matriz,p,v),r=Matriz.rangoMatrizNumerica(A),kmax=Math.min(A.length,A[0].length),soporte=r>0?buscarMenorNoNulo(A,r):null;
wrap.appendChild(paso(`Paso 4: Rango de A para el valor del parámetro ${p}=${v}`));
let bloque=document.createElement("div");bloque.style.cssText="margin:6px 0 0 0;font-size:13px;";wrap.appendChild(bloque);
let l2=document.createElement("div");l2.style.cssText="display:flex;align-items:center;gap:6px;flex-wrap:wrap;";bloque.appendChild(l2);
if(soporte){
l2.appendChild(spanMathFromLatex("\\text{El menor}","math"));l2.appendChild(renderDet(soporte.menor,"math"));
l2.appendChild(spanMathFromLatex("=", "math"));l2.appendChild(spanMathExpr(soporte.det,"math"));l2.appendChild(spanMathFromLatex("\\neq 0\\;\\text{ y }","math"));
}else l2.appendChild(spanMathFromLatex("\\text{(no se pudo exhibir un menor no nulo) y }","math"));
if(r+1>kmax)l2.appendChild(spanMathFromLatex(`\\text{no se pueden formar menores de orden }${r+1}`,"math"));
else{let ex=buscarMenorNoNulo(A,r+1);l2.appendChild(spanMathFromLatex(ex?`\\text{existe un menor de orden }${r+1}\\text{ no nulo}`:`\\text{todos los menores de orden }${r+1}\\text{ son nulos}`,"math"));}
bloque.appendChild(spanMathFromLatex(`\\text{Por tanto, }\\operatorname{rg}(A)=${r}`,"math"));cajaT.appendChild(wrap);
casosEstudiados.push({p,v,rank:r,soporte,k:kmax});eliminarCasoEspecial(p+"="+v);huboPaso4=true;return r;}

function uiRangoParaParametro(){
let ui=document.createElement("div");ui.style.cssText="margin-top:8px;font-size:14px;display:flex;align-items:center;gap:10px;";caja124.appendChild(ui);
let sugeridos=getCasosPendientes();
if(!solucionesPaso3.length){let e=document.createElement("div");e.className="err";e.textContent="Antes encuentra casos especiales en el Paso 3.";ui.appendChild(e);return;}
if(!sugeridos.length){let e=document.createElement("div");e.className="ok";e.textContent="No hay casos especiales pendientes. Ya puedes ir al Resumen (Paso 5).";ui.appendChild(e);return;}
let lista=document.createElement("div");lista.style.cssText="display:flex;flex-wrap:wrap;gap:10px;";ui.appendChild(lista);
sugeridos.forEach(s=>{let l=document.createElement("label");l.style.cssText="display:flex;align-items:center;gap:6px;border:1px dashed #888;padding:2px 6px;border-radius:6px;";
let r=document.createElement("input");r.type="radio";r.name="casoSug";r.value=s;l.appendChild(r);
let sp=document.createElement("span");sp.appendChild(spanMathExpr(s,"math"));l.appendChild(sp);lista.appendChild(l);});
let btn=document.createElement("button");btn.textContent="Calcular";btn.className="btn";ui.appendChild(btn);
function leerCaso(){let sel=document.querySelector('input[name="casoSug"]:checked');return sel?parseCaso(sel.value):{p:"",v:""};}
function calcular(){let {p,v}=leerCaso();if(!p||v===""){let e=document.createElement("div");e.className="err";e.style.marginTop="6px";e.textContent="Selecciona uno de los casos especiales listados.";caja124.appendChild(e);return;}
calcularRangoCaso(null,p,v);let quedan=getCasosPendientes();if(!quedan.length)ocultarPaso(4);caja124.innerHTML="";caja125.innerHTML="";desmarcarOpcionActual();autoScroll();}
btn.addEventListener("click",calcular);}

function uiResumenCasos(host){
let cajaT=host||document.getElementById("caja21");
if(finalSolucion&&finalSolucion.tipo==="const"){
let wrap=envoltorioPaso();wrap.appendChild(paso("Paso 5: RESUMEN"));
let box=document.createElement("div");box.style.cssText="max-width:98%;font-size:14px;";wrap.appendChild(box);
let cg=document.createElement("div");cg.style.cssText="font-weight:bold;text-decoration:underline;margin-bottom:6px;";cg.textContent="CASO GENERAL:";box.appendChild(cg);
let cont=document.createElement("div");cont.style.marginLeft="18px";box.appendChild(cont);
let r=finalSolucion.rank;let row1=document.createElement("div");row1.style.cssText="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;";cont.appendChild(row1);
row1.appendChild(spanMathFromLatex(`\\text{Un menor de orden }${r}\\text{ no nulo exactamente es:}`,"math"));
let row2=document.createElement("div");row2.style.cssText="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;";cont.appendChild(row2);
row2.appendChild(renderDet(finalSolucion.menor,"math"));row2.appendChild(spanMathFromLatex("=","math"));row2.appendChild(spanMathExpr(finalSolucion.det,"math"));
cont.appendChild(spanMathFromLatex(`\\Rightarrow\\;\\operatorname{rg}(A)=${r}\\;\\text{(para todo valor del parámetro)}`,"math"));
let subt=document.createElement("div");subt.style.cssText="font-weight:bold;margin:10px 0 6px 0;text-align:left;";subt.textContent="CASOS ESPECÍFICOS:";box.appendChild(subt);
let espCont=document.createElement("div");espCont.style.marginLeft="18px";box.appendChild(espCont);
espCont.appendChild(spanMathFromLatex("\\text{(No hay casos específicos)}","math"));
cajaT.appendChild(wrap);ocultarPaso(5);if(!host){caja124.innerHTML="";caja125.innerHTML="";desmarcarOpcionActual();autoScroll();}return;}
if(finalSolucion&&finalSolucion.tipo==="cero"){
let wrap=envoltorioPaso();wrap.appendChild(paso("Paso 5: RESUMEN"));
let box=document.createElement("div");box.style.cssText="max-width:98%;font-size:14px;";wrap.appendChild(box);
let cg=document.createElement("div");cg.style.cssText="font-weight:bold;text-decoration:underline;margin-bottom:6px;";cg.textContent="CASO GENERAL:";box.appendChild(cg);
let cont=document.createElement("div");cont.style.marginLeft="18px";box.appendChild(cont);
cont.appendChild(spanMathFromLatex("\\text{Todos los menores de orden 1 son nulos exactamente.}\\;\\Rightarrow\\;\\operatorname{rg}(A)=0","math"));
let subt=document.createElement("div");subt.style.cssText="font-weight:bold;margin:10px 0 6px 0;text-align:left;";subt.textContent="CASOS ESPECÍFICOS:";box.appendChild(subt);
let espCont=document.createElement("div");espCont.style.marginLeft="18px";box.appendChild(espCont);
espCont.appendChild(spanMathFromLatex("\\text{(No hay casos específicos)}","math"));
cajaT.appendChild(wrap);ocultarPaso(5);if(!host){caja124.innerHTML="";caja125.innerHTML="";desmarcarOpcionActual();autoScroll();}return;}

let pendientes=getCasosPendientes();
if(!huboPaso4||pendientes.length){let e=document.createElement("div");e.className="err";e.style.marginTop="6px";
e.textContent=!huboPaso4?"Antes debes estudiar al menos un caso en el Paso 4.":"Quedan casos especiales sin estudiar: "+pendientes.join(", ")+".";if(!host)caja124.appendChild(e);else cajaT.appendChild(e);return;}
let wrap=envoltorioPaso();wrap.appendChild(paso("Paso 5: RESUMEN"));
let box=document.createElement("div");box.style.cssText="max-width:98%;font-size:14px;";wrap.appendChild(box);
let param=(solucionesPaso3[0]?parseCaso(solucionesPaso3[0]).p:"k")||"k",vals=solucionesPaso3.map(s=>parseCaso(s).v);
let vTxt=vals.length===2?`${param}≠${vals[0]} y ${param}≠${vals[1]}`:vals.map(v=>`${param}≠${v}`).join(" y ");
let rangoGen=(menorElegidoMat?menorElegidoMat.length:Math.min(matriz.length,matriz[0].length));
let cg=document.createElement("div");cg.style.cssText="font-weight:bold;text-decoration:underline;margin-bottom:6px;";
cg.textContent=`CASO GENERAL: Para cualquier valor ${vTxt}`;box.appendChild(cg);
let genCont=document.createElement("div");genCont.style.marginLeft="18px";box.appendChild(genCont);
let row1=document.createElement("div");row1.style.cssText="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;";genCont.appendChild(row1);
row1.appendChild(spanMathFromLatex("\\text{Menor elegido:}","math"));
if(menorElegidoMat){
row1.appendChild(renderDet(menorElegidoMat,"math"));row1.appendChild(spanMathFromLatex("=", "math"));row1.appendChild(spanMathExpr(menorElegidoDet,"math"));
let sols=vals.length?vals.map(v=>toLatex(`${param}=${v}`)).join("\\;\\text{ ó }\\;"):"\\text{(sin soluciones)}";
row1.appendChild(spanMathFromLatex(`\\text{; se anula solo para }${sols}`,"math"));
}else row1.appendChild(spanMathFromLatex("\\text{(no seleccionado en Paso 2)}","math"));
genCont.appendChild(spanMathFromLatex(`\\text{Por tanto, para cualquier valor }${toLatex(vTxt)}\\;\\operatorname{rg}(A)=${rangoGen}`,"math"));
let subt=document.createElement("div");subt.style.cssText="font-weight:bold;margin:10px 0 6px 0;text-align:left;";subt.textContent="CASOS ESPECÍFICOS:";box.appendChild(subt);
let espCont=document.createElement("div");espCont.style.marginLeft="18px";box.appendChild(espCont);
if(!casosEstudiados.length)espCont.appendChild(spanMathFromLatex("\\text{(Todavía no hay casos específicos)}","math"));
casosEstudiados.forEach(c=>{let fila=document.createElement("div");fila.style.cssText="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;";espCont.appendChild(fila);
fila.appendChild(spanMathFromLatex("\\bullet","math"));
fila.appendChild(spanMathFromLatex(`\\text{Si }${toLatex(`${c.p}=${c.v}`)}\\text{ entonces }\\operatorname{rg}(A)=${c.rank}`,"math"));
if(c.soporte&&c.soporte.menor){fila.appendChild(spanMathFromLatex("\\text{; menor:}","math"));fila.appendChild(renderDet(c.soporte.menor,"math"));
fila.appendChild(spanMathFromLatex("=", "math"));fila.appendChild(spanMathExpr(c.soporte.det,"math"));fila.appendChild(spanMathFromLatex("\\neq 0","math"));}});
cajaT.appendChild(wrap);ocultarPaso(5);if(!host){caja124.innerHTML="";caja125.innerHTML="";desmarcarOpcionActual();autoScroll();}}

function ejecutarAutomatico(){
resetEstado();mostrarTodosPasos();
let caja21=document.getElementById("caja21");if(caja21)caja21.innerHTML="";
if(autoBody)autoBody.innerHTML="";if(caja124)caja124.innerHTML="";if(caja125)caja125.innerHTML="";
if(cajaFormulario)cajaFormulario.style.display="none";if(caja2)caja2.style.display="none";if(autoModo)autoModo.style.display="block";
pintarListadoMenoresMax(matriz,autoBody);let prep=prepararOrdenHastaUtil(autoBody);if(prep==="final")return;
let elegido=elegirMenorMaxAuto(autoBody);if(!elegido){let prep2=prepararOrdenHastaUtil(autoBody);if(prep2==="final")return;}
uiCerosDelMenor(autoBody);
let sols=solucionesPaso3.slice();for(let i=0;i<sols.length;i++){let {p,v}=parseCaso(sols[i]);if(p&&v!=="")calcularRangoCaso(autoBody,p,v);}
ocultarPaso(4);uiResumenCasos(autoBody);ocultarPaso(6);}

async function crearMatriz(){
contenedor.style.display="flex";caja1.style.width="auto";caja1.style.height="40%";caja1.style.border="1px solid black";
caja1.style.padding="5px 10px 10px 10px";const contenedorMatriz=document.createElement("div");caja1.appendChild(contenedorMatriz);
const{nombre,matriz}=await Crear.unaMatriz(contenedorMatriz);Object.assign(matrizObjeto,{nombre,matriz});crearFormulario();}

function crearFormulario(){
contenedor.style.display="block";while(caja1.firstChild)caja1.removeChild(caja1.firstChild);
caja1.style.cssText="display:flex;width:100%;height:auto;border:1px solid black;padding:5px;box-sizing:border-box;";
caja2.style.display="block";let caja21=document.getElementById("caja21");
if(!caja21){caja21=document.createElement("div");caja21.id="caja21";caja2.appendChild(caja21);
caja21.style.cssText="display:block;width:95%;border:1px solid black;min-height:15px;max-height:60vh;overflow-y:auto;";}

let cajaMatricesIntroducidas=document.createElement("div");cajaMatricesIntroducidas.id="cajaMatricesIntroducidas";
cajaMatricesIntroducidas.style.cssText="width:auto;min-width:33%;margin-right:10px;border:1px solid black;padding:5px;box-sizing:border-box;height:auto;overflow:visible;";
caja1.appendChild(cajaMatricesIntroducidas);

cajaFormulario=document.createElement("div");cajaFormulario.id="cajaFormulario";
cajaFormulario.style.cssText="flex:1;border:1px solid black;padding:5px;box-sizing:border-box;height:auto;overflow:visible;";
caja1.appendChild(cajaFormulario);

autoModo=document.createElement("div");autoModo.id="autoModo";
autoModo.style.cssText="flex:1;border:1px solid black;padding:10px;box-sizing:border-box;height:auto;overflow:auto;display:none;";
caja1.appendChild(autoModo);
let autoTop=document.createElement("div");autoTop.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;";autoModo.appendChild(autoTop);
let autoTit=document.createElement("div");autoTit.style.fontWeight="bold";autoTit.textContent="MODO AUTOMÁTICO";autoTop.appendChild(autoTit);
let autoBtns=document.createElement("div");autoBtns.style.cssText="display:flex;gap:8px;";autoTop.appendChild(autoBtns);
let btnVolver=document.createElement("button");btnVolver.className="btn";btnVolver.textContent="Volver";autoBtns.appendChild(btnVolver);
let btnResetAuto=document.createElement("button");btnResetAuto.className="btn";btnResetAuto.textContent="RESET";autoBtns.appendChild(btnResetAuto);
autoBody=document.createElement("div");autoBody.id="autoBody";autoModo.appendChild(autoBody);

let caja111=document.createElement("div");caja111.id="caja111";cajaMatricesIntroducidas.appendChild(caja111);
let titulo=document.createElement("h3");titulo.textContent="MATRIZ INTRODUCIDA";titulo.style.fontSize="16px";caja111.appendChild(titulo);
let historial=document.createElement("div");historial.id="historialMatrices";
historial.style.cssText="display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start;margin-top:12px;font-size:12px;";
cajaMatricesIntroducidas.appendChild(historial);
let caja113=document.createElement("div");caja113.id="caja113";cajaMatricesIntroducidas.appendChild(caja113);

matrizInicial=matrizObjeto.matriz;matriz=structuredClone(matrizInicial);nombreMatriz=matrizObjeto.nombre;

function etiquetarA(ind){if(hasKatex()){let s=document.createElement("span");renderLatex(ind===0?"A=":`A_{${ind}}=`,s);return s;}
let t=document.createElement("span");t.textContent=ind===0?"A =":"A_"+ind+" =";return t;}
function agregarMatrizAlHistorial(mat,ind){
let cel=document.createElement("div");cel.style.cssText="display:flex;align-items:center;min-height:100px;font-size:12px;";
let lab=document.createElement("div");lab.style.cssText="font-weight:bold;margin-right:6px;font-size:14px;";
lab.appendChild(etiquetarA(ind));cel.appendChild(lab);Representar.matriz(mat,cel);historial.appendChild(cel);}
agregarMatrizAlHistorial(matriz,0);

let caja121=document.createElement("h3");caja121.id="tituloFormulario";caja121.textContent="OPCIONES";
caja121.style.cssText="display:flex;width:99%;justify-content:center;";cajaFormulario.appendChild(caja121);

const opciones=["Obtener todos los menores de orden máximo","Elegir uno de los menores de orden máximo y calcular su valor",
"Anulación del menor elegido","Calcular el rango de la matriz para un valor específico del parámetro","Resumen de los casos",
"Resolver el rango de forma automática (no recomendado)"];

opciones.forEach((texto,i)=>{const filaO=document.createElement("div");filaO.id="row-"+(i+1);filaO.className="rad";
const input=document.createElement("input");input.type="radio";input.name="option";input.value=`opcion${i+1}`;
input.className="inputCorto";input.style.cssText="transform:scale(0.8);margin-left:10px;margin-right:8px;";
const lab=document.createElement("label");lab.textContent=i===5?texto:`Paso ${i+1}: ${texto}`;lab.style.fontSize="16px";
if(i===5)filaO.style.marginTop="8px";filaO.appendChild(input);filaO.appendChild(lab);cajaFormulario.appendChild(filaO);});

let caja122=document.createElement("div");caja122.id="caja122";caja122.style.cssText="display:flex;width:99%;margin-top:5px;align-items:center;gap:8px;";
let botonSeleccionar=document.createElement("button");botonSeleccionar.textContent="Seleccionar";botonSeleccionar.className="btn";caja122.appendChild(botonSeleccionar);
let caja123=document.createElement("div");caja123.id="caja123";caja123.style.cssText="display:flex;width:99%;justify-content:right;";
let botonReset=document.createElement("button");botonReset.textContent="RESET";botonReset.className="btn";caja123.appendChild(botonReset);
caja124=document.createElement("div");caja124.id="caja124";caja124.style.cssText="display:block;width:99%;";
caja125=document.createElement("div");caja125.id="caja125";caja125.style.cssText="display:block;width:99%;";
[caja122,caja123,caja124,caja125].forEach(e=>cajaFormulario.appendChild(e));

botonSeleccionar.addEventListener("click",function(){
const radio=document.querySelector('input[name="option"]:checked');if(!radio)return;let opcion=radio.value;caja124.innerHTML="";caja125.innerHTML="";
switch(opcion){
case"opcion1":pintarListadoMenoresMax(matriz,null);prepararOrdenHastaUtil(null);desmarcarOpcionActual();return;
case"opcion2":uiElegirMenorMax();return;
case"opcion3":uiCerosDelMenor(null);return;
case"opcion4":uiRangoParaParametro();return;
case"opcion5":uiResumenCasos(null);return;
case"opcion6":desmarcarOpcionActual();ejecutarAutomatico();return;}});
botonReset.addEventListener("click",()=>{resetTotalUI();desmarcarOpcionActual();});

btnVolver.addEventListener("click",()=>{autoModo.style.display="none";cajaFormulario.style.display="";caja2.style.display="block";mostrarTodosPasos();});
btnResetAuto.addEventListener("click",()=>{resetTotalUI();});}

function initPdfAyuda(){
const abreVentana1=document.getElementById("abreVentana1"),cierraVentana1=document.getElementById("cierraVentana1");
const v=document.getElementById("ventana1"),pdf1=document.getElementById("pdf1");
if(!abreVentana1||!cierraVentana1||!v||!pdf1)return;
const pdf1URL="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
abreVentana1.addEventListener("click",function(event){event.preventDefault();pdf1.src=pdf1URL;v.style.display="flex";});
cierraVentana1.addEventListener("click",function(){v.style.display="none";pdf1.src="";});
window.addEventListener("click",function(event){if(event.target==v){v.style.display="none";pdf1.src="";}});}

function acoplarOtraMatrizConAyuda(){
let ayuda=document.getElementById("abreVentana1");if(!ayuda)return;
let otra=document.getElementById("btnOtraMatriz")||[...document.querySelectorAll("button")]
.find(b=>/otra\s*matriz/i.test((b.textContent||"").trim()));if(!otra)return;
let p=ayuda.parentNode;if(!p)return;
let grp=document.createElement("div");grp.style.cssText="display:inline-flex;align-items:center;gap:8px;";
p.insertBefore(grp,ayuda);grp.appendChild(otra);grp.appendChild(ayuda);
}




function initApp(){
ventana1=document.getElementById("ventana1");contenedor=document.getElementById("contenedor");caja1=document.getElementById("caja1");
tituloCaja1=document.getElementById("tituloCaja1");ventana2=document.getElementById("ventana2");caja2=document.getElementById("caja2");
tituloUsuario=document.getElementById("letreroUsuario");ventana3=document.getElementById("ventana3");
if(!contenedor||!caja1||!tituloCaja1||!caja2||!tituloUsuario)return;
tituloUsuario.style.fontSize="20px";caja2.style.marginTop="10px";tituloUsuario.style.margin="10px 0 10px 0";
caja2.style.display="none";tituloCaja1.style.display="block";tituloCaja1.style.width="500px";
let aviso=document.createElement("div");tituloCaja1.appendChild(aviso);aviso.style.fontSize="12px";aviso.style.color="red";
aviso.textContent="(Valida todos los datos introducidos con la tecla ENTER o TAB del teclado)";
inyectarEstilosUI();
let btnOtra=document.createElement("button");btnOtra.id="btnOtraMatriz";btnOtra.className="btn";btnOtra.textContent="Otra matriz";
btnOtra.addEventListener("click",()=>{location.reload();});
tituloCaja1.insertBefore(btnOtra,tituloCaja1.firstChild);
initPdfAyuda();
acoplarOtraMatrizConAyuda();
crearMatriz();
}


document.addEventListener("DOMContentLoaded",initApp);
