let caja2=document.getElementById("caja2"),ventana3=document.getElementById("ventana3");
let tituloUsuario=document.getElementById("letreroUsuario");if(tituloUsuario){tituloUsuario.style.fontSize="20px";tituloUsuario.style.margin="10px 0px 10px 0px";}
if(caja2){caja2.style.marginTop="10px";caja2.style.display="none";}
let matriz=null,nombreMatriz=null,matrizInicial=null,matrizInicialOriginal=null,menorActual=null,indiceMatriz=0,contenedorMenorActual=null;
if(typeof matrizObjeto==="undefined"||matrizObjeto===null){var matrizObjeto={};}
let tituloCaja1=document.getElementById("tituloCaja1")||document.getElementById("caja11112")||document.getElementById("caja11111")||caja1;
if(tituloCaja1){
tituloCaja1.style.display="flex";tituloCaja1.style.flexDirection="column";tituloCaja1.style.justifyContent="flex-start";
tituloCaja1.style.alignItems="center";tituloCaja1.style.gap="6px";tituloCaja1.style.paddingTop="10px";
tituloCaja1.style.paddingBottom="10px";tituloCaja1.style.height="auto";tituloCaja1.style.minHeight="70px";
let aviso=document.createElement("div");tituloCaja1.appendChild(aviso);aviso.style.fontSize="12px";aviso.style.color="red";
aviso.style.margin="0";aviso.style.textAlign="center";aviso.textContent="(Valida todos los datos introducidos con la tecla ENTER del teclado)";
}
function autoScroll(){requestAnimationFrame(()=>{window.scrollTo(0,document.body.scrollHeight);});}
crearMatriz();

async function crearMatriz(){
if(!caja1||!contenedor)return;contenedor.style.display="flex";contenedor.style.justifyContent="center";
let lugar=document.getElementById("caja1112");if(!lugar){lugar=document.createElement("div");lugar.id="caja1112";caja1.appendChild(lugar);}
lugar.style.maxHeight="220px";lugar.style.overflowY="auto";lugar.innerHTML="";
const{nombre,matriz}=await Crear.unaMatrizNumerica(lugar);Object.assign(matrizObjeto,{nombre,matriz});
let c111=document.getElementById("caja111");if(c111)c111.style.display="none";
let c1111=document.getElementById("caja1111");if(c1111)c1111.style.display="none";if(lugar)lugar.style.display="none";
crearFormulario();
}

function crearFormulario(){
if(!caja1||!caja2)return;caja2.style.display="block";
let caja21=document.getElementById("caja21");if(!caja21){caja21=document.createElement("div");caja21.id="caja21";caja2.appendChild(caja21);}
caja21.style.cssText="display:flex;flex-direction:column;gap:8px;";
let caja21Titulo=document.getElementById("caja21Titulo");if(!caja21Titulo){caja21Titulo=document.createElement("div");caja21Titulo.id="caja21Titulo";caja21.prepend(caja21Titulo);}
caja21Titulo.textContent="TRABAJO DEL USUARIO";

let cajaMatricesIntroducidas=document.getElementById("caja1121"),cajaFormulario=document.getElementById("caja1122");
if(!cajaMatricesIntroducidas||!cajaFormulario){
cajaMatricesIntroducidas=document.createElement("div");cajaFormulario=document.createElement("div");
cajaMatricesIntroducidas.id="caja1121";cajaFormulario.id="caja1122";caja1.append(cajaMatricesIntroducidas,cajaFormulario);
}
cajaMatricesIntroducidas.innerHTML="";cajaFormulario.innerHTML="";

matrizInicialOriginal=matrizObjeto.matriz;matrizInicial=structuredClone(matrizInicialOriginal);matriz=structuredClone(matrizInicial);
nombreMatriz=matrizObjeto.nombre;indiceMatriz=0;contenedorMenorActual=null;

function etiquetarA(ind){if(typeof katex!=="undefined"&&katex.render){let s=document.createElement("span");
katex.render(ind===0?"A=":"A_{"+ind+"}=",s,{throwOnError:false});return s;}let t=document.createElement("span");
t.textContent=ind===0?"A =":"A_"+ind+" =";return t;}
let titulo=document.createElement("h3");titulo.textContent="MATRIZ INTRODUCIDA Y MATRICES EQUIVALENTES";titulo.style.fontSize="16px";
cajaMatricesIntroducidas.appendChild(titulo);
let historial=document.createElement("div");historial.id="historialMatrices";
historial.style.cssText="display:flex;flex-direction:row;gap:25px;align-items:flex-start;margin-top:12px;font-size:12px;flex-wrap:wrap;";
cajaMatricesIntroducidas.appendChild(historial);

function esCero(d){if(typeof d==="number")return d===0;const s=String(d).replace(/\s/g,"");
if(s==="0"||s==="0/1"||/^0([.,]0+)?$/.test(s))return true;const n=Number(s.replace(",","."));return!Number.isNaN(n)&&n===0;}

function requiereQuitarDenominadores(mat){
if(!Array.isArray(mat)||!mat.length||!Array.isArray(mat[0]))return false;
for(let i=0;i<mat.length;i++)for(let j=0;j<mat[i].length;j++){
let x=mat[i][j];
if(typeof x==="number"){if(!Number.isInteger(x))return true;continue;}
let s=String(x).trim();if(!s)continue;if(s.includes("/"))return true;if(s.includes(".")||s.includes(","))return true;
let n=Number(s.replace(",","."));if(!Number.isNaN(n)&&!Number.isInteger(n))return true;
}
return false;
}

function ocultarMenorActual(){if(!contenedorMenorActual)return;contenedorMenorActual.innerHTML="";contenedorMenorActual.style.display="none";}

function agregarMatrizInicialConEquivalente(mat0,matEq){
let cel=document.createElement("div");cel.style.cssText="display:flex;align-items:flex-start;gap:10px;padding:4px 0;";
cel.style.flexDirection="column";cel.style.alignItems="flex-start";cel.style.gap="6px";
let fila=document.createElement("div");fila.style.cssText="display:flex;align-items:center;gap:6px;flex-wrap:wrap;";
let lab=document.createElement("div");lab.style.cssText="font-weight:bold;font-size:14px;";lab.appendChild(etiquetarA(0));fila.appendChild(lab);
Representar.matriz(mat0,fila);
if(matEq){if(typeof Representar!=="undefined"&&Representar.simboloMatrizEquivalente)Representar.simboloMatrizEquivalente(0,fila);Representar.matriz(matEq,fila);}
cel.appendChild(fila);
contenedorMenorActual=document.createElement("div");contenedorMenorActual.id="contenedorMenorActual";
contenedorMenorActual.style.cssText="display:block;margin-left:2px;";cel.appendChild(contenedorMenorActual);
historial.appendChild(cel);autoScroll();
}

function agregarMatrizAlHistorial(mat,ind){
let cel=document.createElement("div");cel.style.cssText="display:flex;align-items:flex-start;gap:10px;padding:4px 0;";
let fila=document.createElement("div");fila.style.cssText="display:flex;align-items:center;gap:4px;";
let lab=document.createElement("div");lab.style.cssText="font-weight:bold;font-size:14px;";lab.appendChild(etiquetarA(ind));
fila.appendChild(lab);Representar.matriz(mat,fila);cel.appendChild(fila);historial.appendChild(cel);autoScroll();
}

function mostrarMenorActual(menor,esFinal=false){
if(!contenedorMenorActual)return;contenedorMenorActual.style.display="block";contenedorMenorActual.innerHTML="";
let lab=document.createElement("span");lab.textContent="Menor actual:";lab.style.fontWeight="bold";contenedorMenorActual.appendChild(lab);
let dc=document.createElement("span");dc.style.cssText="display:inline-block;vertical-align:middle;margin-left:6px;";
Representar.determinante(menor,dc);contenedorMenorActual.appendChild(dc);
let orden=menor.length,det=Matriz.determinante(menor),dv=document.createElement("span"),txt=" = "+det+" ≠ 0";
txt+=esFinal?" y rango(A) = "+orden:" y rango(A) ≥ "+orden;dv.textContent=txt;dv.style.marginLeft="6px";contenedorMenorActual.appendChild(dv);
}

function mostrarSolucionFinalMenor(menor){
ocultarMenorActual();let orden=menor.length,det=Matriz.determinante(menor);
function construirEn(dest){
if(dest===cajaFormulario)dest.innerHTML="";
let cont=document.createElement("div");
cont.style.cssText="margin-top:12px;font-size:14px;display:flex;align-items:center;justify-content:center;gap:10px;";
let t1=document.createElement("span");t1.textContent="Menor final encontrado:";cont.appendChild(t1);
let dWrap=document.createElement("span");dWrap.style.cssText="display:inline-block;vertical-align:middle;";Representar.determinante(menor,dWrap);
cont.appendChild(dWrap);let t2=document.createElement("span");t2.textContent=" = "+det+" ≠ 0  rango(A)="+orden;cont.appendChild(t2);dest.appendChild(cont);
}
construirEn(cajaFormulario);construirEn(document.getElementById("caja21")||caja2);
}

function mostrarMensajeRangoPequeno(r){
ocultarMenorActual();
function construirEn(dest){
if(dest===cajaFormulario)dest.innerHTML="";
let cont=document.createElement("div");
cont.style.cssText="margin-top:12px;border:1px solid #bbb;border-radius:4px;padding:10px;font-size:15px;display:flex;flex-direction:column;gap:8px;";
let tit=document.createElement("div");tit.textContent="RESULTADO";
tit.style.cssText="font-weight:bold;font-size:16px;text-align:center;margin-bottom:6px;";cont.appendChild(tit);
let t1=document.createElement("div");t1.textContent="rango(A) = "+r;cont.appendChild(t1);
let t2=document.createElement("div");t2.textContent=r===0?"No hay ningún menor de orden 1 no nulo.":"No hay ningún menor de orden 2 no nulo.";cont.appendChild(t2);
dest.appendChild(cont);
}
construirEn(cajaFormulario);construirEn(document.getElementById("caja21")||caja2);
}

function mostrarMensajeRangoFinal(orden,menor,porDimension=false){
ocultarMenorActual();
function construirEn(dest){
if(dest===cajaFormulario)dest.innerHTML="";
let cont=document.createElement("div");
cont.style.cssText="margin-top:12px;border:1px solid #bbb;border-radius:4px;padding:10px;font-size:15px;display:flex;flex-direction:column;gap:8px;";
let tit=document.createElement("div");tit.textContent="RESULTADO";
tit.style.cssText="font-weight:bold;font-size:16px;text-align:center;margin-bottom:6px;";cont.appendChild(tit);
let t1=document.createElement("div");t1.textContent="rango(A) = "+orden+".";cont.appendChild(t1);
let t2=document.createElement("div");
t2.textContent=porDimension?"No hay ningún menor de orden "+(orden+1)+" no nulo por falta de filas o columnas.":"No hay ningún menor de orden "+(orden+1)+" no nulo.";
cont.appendChild(t2);
if(menor){
let mw=document.createElement("div");mw.style.cssText="margin-top:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;";
let lbl=document.createElement("span");lbl.textContent="Menor utilizado:";lbl.style.fontWeight="bold";mw.appendChild(lbl);
let dCont=document.createElement("span");dCont.style.cssText="display:inline-block;vertical-align:middle;";Representar.determinante(menor,dCont);mw.appendChild(dCont);
let val=document.createElement("span");val.textContent=" = "+Matriz.determinante(menor)+" ≠ 0";mw.appendChild(val);cont.appendChild(mw);
}
dest.appendChild(cont);
}
construirEn(cajaFormulario);construirEn(document.getElementById("caja21")||caja2);
}

function ocultarOpcionMenor2(){const r=document.querySelector('input[name="option"][value="opcion1"]');if(r&&r.parentElement)r.parentElement.style.display="none";}

function registrarEquivalenteInicial(msg,mat0,matEq){
let caja21=document.getElementById("caja21");if(!caja21)return;
let cont=document.createElement("div");
cont.style.cssText="margin-top:8px;border:1px solid #bbb;border-radius:4px;padding:8px;font-size:14px;white-space:pre-wrap;";
let d=document.createElement("div");d.textContent=msg;cont.appendChild(d);
let fila=document.createElement("div");fila.style.cssText="margin-top:4px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;";
let lab=document.createElement("span");lab.style.fontWeight="bold";lab.appendChild(etiquetarA(0));fila.appendChild(lab);
let z1=document.createElement("span");z1.style.cssText="display:inline-block;";Representar.matriz(mat0,z1);fila.appendChild(z1);
if(typeof Representar!=="undefined"&&Representar.simboloMatrizEquivalente)Representar.simboloMatrizEquivalente(0,fila);
let z2=document.createElement("span");z2.style.cssText="display:inline-block;";Representar.matriz(matEq,z2);fila.appendChild(z2);
cont.appendChild(fila);caja21.appendChild(cont);caja21.scrollTop=caja21.scrollHeight;autoScroll();
}

function registrarOperacionConMatriz(msg,mat){
let caja21=document.getElementById("caja21");if(!caja21)return;
let cont=document.createElement("div");
cont.style.cssText="margin-top:8px;border:1px solid #bbb;border-radius:4px;padding:8px;font-size:14px;white-space:pre-wrap;";
let d=document.createElement("div");d.textContent=msg;cont.appendChild(d);
let fila=document.createElement("div");fila.style.cssText="margin-top:4px;display:flex;align-items:center;gap:6px;";
let lab=document.createElement("span");lab.style.fontWeight="bold";lab.appendChild(etiquetarA(indiceMatriz+1));fila.appendChild(lab);
let z=document.createElement("span");z.style.cssText="display:inline-block;";Representar.matriz(mat,z);fila.appendChild(z);cont.appendChild(fila);
caja21.appendChild(cont);caja21.scrollTop=caja21.scrollHeight;autoScroll();agregarMatrizAlHistorial(mat,++indiceMatriz);matriz=structuredClone(mat);
}

function pintarPasoMenorEnCaja(paso,tit){
let caja21=document.getElementById("caja21");if(!caja21)return;
let b=document.createElement("div");
b.style.cssText="margin-top:8px;border:1px solid #bbb;border-radius:4px;padding:8px;font-size:14px;display:flex;flex-direction:column;gap:4px;";
caja21.appendChild(b);let t=document.createElement("div");t.textContent=tit;t.style.fontWeight="bold";b.appendChild(t);
let i=document.createElement("div");i.style.cssText="display:flex;flex-wrap:wrap;align-items:center;gap:8px;";b.appendChild(i);
let p=document.createElement("span");p.textContent="Filas ["+paso.filas.join(", ")+"] y columnas ["+paso.cols.join(", ")+"]";i.appendChild(p);
let lm=document.createElement("div");lm.style.cssText="display:flex;align-items:center;gap:8px;flex-wrap:wrap;";b.appendChild(lm);
let tag=document.createElement("span");tag.textContent="Menor:";tag.style.fontWeight="bold";lm.appendChild(tag);
let dc=document.createElement("span");dc.style.cssText="display:inline-block;vertical-align:middle;";lm.appendChild(dc);Representar.determinante(paso.menor,dc);
let dv=document.createElement("span"),orden=paso.filas.length;
if(!esCero(paso.det))dv.textContent=" = "+paso.det+" ≠ 0 y rango(A) ≥ "+orden;
else{dv.textContent=" = "+paso.det;lm.appendChild(dv);let av=document.createElement("span");av.textContent="El menor es nulo. Elige otro menor";av.style.marginLeft="10px";lm.appendChild(av);return;}lm.appendChild(dv);caja21.scrollTop=caja21.scrollHeight;autoScroll();
}

function listarAmpliaciones(mat,fa,ca){
let m=mat.length,n=mat[0].length,pasos=[];
for(let f=1;f<=m;f++){if(fa.includes(f))continue;for(let c=1;c<=n;c++){if(ca.includes(c))continue;
let nf=fa.concat([f]),nc=ca.concat([c]),Mx=Matriz.menor(mat,nf.map(x=>x-1),nc.map(x=>x-1)),dx=Matriz.determinante(Mx);
pasos.push({filas:nf,cols:nc,menor:Mx,det:dx});}}
return pasos;
}

function ampliarMenorActual(mat,fa,ca){
let pasos=listarAmpliaciones(mat,fa,ca);if(!pasos.length)return{fallo:true,razonFallo:{tipo:"dimension"},pasos:[]};
for(let i=0;i<pasos.length;i++)if(!esCero(pasos[i].det))return Object.assign({fallo:false,pasos},pasos[i]);
return{fallo:true,razonFallo:{tipo:"nulos"},pasos};
}

function pintarMenoresNulos(pasos,titBase){
let nulos=pasos.filter(p=>esCero(p.det));
for(let i=0;i<nulos.length;i++){let p=nulos[i];pintarPasoMenorEnCaja(p,titBase+" (intento "+(i+1)+")");}
}

function desmarcarOpcionActual(){const m=document.querySelector('input[name="option"]:checked');if(m){m.checked=false;m.blur();m.dispatchEvent(new Event("change",{bubbles:true}));}}
function resetearFormulario(){caja124.innerHTML="";caja125.innerHTML="";opcionSeleccionada=null;document.querySelectorAll('input[name="option"]').forEach(op=>op.checked=false);}
function encontrarMenor2NoNulo(mat){
let m=mat.length,n=mat[0].length;
for(let i1=0;i1<m-1;i1++)for(let i2=i1+1;i2<m;i2++)for(let j1=0;j1<n-1;j1++)for(let j2=j1+1;j2<n;j2++){
let M2=Matriz.menor(mat,[i1,i2],[j1,j2]),d2=Matriz.determinante(M2);
if(!esCero(d2))return{filas:[i1+1,i2+1],cols:[j1+1,j2+1],menor:M2,det:d2};
}
return null;
}
function logLinea(s){let d=document.createElement("div");d.style.cssText="color:red;font-size:14px;margin-top:10px;";d.textContent=s;caja124.appendChild(d);}

let matrizEq=null;
if(requiereQuitarDenominadores(matrizInicialOriginal)&&Matriz&&typeof Matriz.quitarDenominadores==="function"){
let qd=Matriz.quitarDenominadores(matrizInicialOriginal);matrizEq=qd&&qd[0]?qd[0]:null;
if(matrizEq){matrizInicial=matrizEq;matriz=structuredClone(matrizInicial);registrarEquivalenteInicial("Se han quitado denominadores para obtener una matriz equivalente.",matrizInicialOriginal,matrizEq);}
}
agregarMatrizInicialConEquivalente(matrizInicialOriginal,matrizEq);

let r0=Matriz.rangoMatrizNumerica(matrizInicial),rangoInicial=parseInt(r0,10);if(Number.isNaN(rangoInicial))rangoInicial=0;

let caja121=document.createElement("h3");caja121.id="tituloFormulario";caja121.textContent="OPCIONES";
caja121.style.cssText="display:flex;width:99%;justify-content:center;";cajaFormulario.appendChild(caja121);
const opciones=["Elegir un menor de orden 2 no nulo","Ampliar a un menor no nulo de un orden superior",
"Eliminar una de dos filas iguales o proporcionales","Eliminar una de dos columnas iguales o proporcionales",
"Dividir una fila de la matriz por un número no nulo","Dividir una columna de la matriz por un número no nulo",
"Resolver el rango de forma automática (no recomendado)"];
opciones.forEach((texto,i)=>{
const filaO=document.createElement("div");filaO.style.cssText="display:flex;align-items:center;height:20px;width:99%;";
const input=document.createElement("input");input.type="radio";input.name="option";input.value=`opcion${i+1}`;input.className="inputCorto";
input.style.cssText="transform:scale(0.8);margin-left:10px;margin-right:8px;";
const lab=document.createElement("label");lab.textContent=`Opción ${i+1}: ${texto}`;lab.style.fontSize="16px";
filaO.appendChild(input);filaO.appendChild(lab);cajaFormulario.appendChild(filaO);
});
let caja122=document.createElement("div");caja122.id="caja122";caja122.style.cssText="display:flex;width:99%;margin-top:5px;";cajaFormulario.appendChild(caja122);
let botonSeleccionar=document.createElement("button");botonSeleccionar.textContent="Seleccionar";caja122.appendChild(botonSeleccionar);
let caja123=document.createElement("div");caja123.id="caja123";caja123.style.cssText="display:flex;width:99%;justify-content:right;";cajaFormulario.appendChild(caja123);
let botonReset=document.createElement("button");botonReset.textContent="RESET";caja123.appendChild(botonReset);
let caja124=document.createElement("div");caja124.id="caja124";caja124.style.cssText="display:block;width:99%;";cajaFormulario.appendChild(caja124);
let caja125=document.createElement("div");caja125.id="caja125";caja125.style.cssText="display:block;width:99%;";cajaFormulario.appendChild(caja125);

let opcionSeleccionada=null;

botonSeleccionar.addEventListener("click",function(){
const radio=document.querySelector('input[name="option"]:checked');if(!radio)return;opcionSeleccionada=radio.value;caja124.innerHTML="";caja125.innerHTML="";
switch(opcionSeleccionada){

case "opcion1":{
let nf=matriz.length,nc=matriz[0].length;
if(nf===2&&nc===2){
let menor=Matriz.menor(matriz,[0,1],[0,1]),det=Matriz.determinante(menor);
pintarPasoMenorEnCaja({filas:[1,2],cols:[1,2],menor,det},"Menor unico de orden 2");
if(!esCero(det)){
menorActual={filas:[1,2],columnas:[1,2],menor};let esFinal=rangoInicial===2;mostrarMenorActual(menor,esFinal);ocultarOpcionMenor2();
if(esFinal){mostrarMensajeRangoFinal(2,menor,true);desmarcarOpcionActual();return;}
}else logLinea("El unico menor 2×2 es nulo.");
desmarcarOpcionActual();return;
}
let ui=document.createElement("div");caja124.appendChild(ui);let to=document.createElement("h4");to.textContent="Elegir un menor de orden 2 no nulo";ui.appendChild(to);
let pf=document.createElement("p");pf.textContent="Introduce las dos filas:";pf.style.fontSize="14px";ui.appendChild(pf);
let ff=document.createElement("div");ff.style.cssText="display:flex;gap:6px;margin-top:5px;alignitems:center;";ui.appendChild(ff);
let f1=document.createElement("input");f1.placeholder="F1";f1.style.width="40px";
let f2=document.createElement("input");f2.placeholder="F2";f2.style.width="40px";ff.append(f1,f2);
let pc=document.createElement("p");pc.textContent="Introduce las dos columnas:";pc.style.cssText="font-size:14px;margin-top:10px;";ui.appendChild(pc);
let fc=document.createElement("div");fc.style.cssText="display:flex;gap:6px;margin-top:5px;align-items:center;";ui.appendChild(fc);
let c1=document.createElement("input");c1.placeholder="C1";c1.style.width="40px";
let c2=document.createElement("input");c2.placeholder="C2";c2.style.width="40px";fc.append(c1,c2);
function err(s){let e=document.createElement("div");e.style.color="red";e.style.marginTop="10px";e.textContent=s;ui.appendChild(e);}
function validarMenor2(){
const vf1=parseInt(f1.value.trim()),vf2=parseInt(f2.value.trim()),vc1=parseInt(c1.value.trim()),vc2=parseInt(c2.value.trim());
const nf=matriz.length,nc=matriz[0].length;if([vf1,vf2,vc1,vc2].some(v=>isNaN(v))){err("Error: debes introducir 4 números.");return;}
if(vf1===vf2){err("Error: filas iguales.");return;}if(vc1===vc2){err("Error: columnas iguales.");return;}
if(vf1<1||vf1>nf||vf2<1||vf2>nf){err("Filas fuera de rango.");return;}if(vc1<1||vc1>nc||vc2<1||vc2>nc){err("Columnas fuera de rango.");return;}
const menor=Matriz.menor(matriz,[vf1-1,vf2-1],[vc1-1,vc2-1]),det=Matriz.determinante(menor);
pintarPasoMenorEnCaja({filas:[vf1,vf2],cols:[vc1,vc2],menor,det},"Menor de orden 2 elegido");
if(!esCero(det)){
menorActual={filas:[vf1,vf2],columnas:[vc1,vc2],menor};let esFinal=rangoInicial===2;mostrarMenorActual(menor,esFinal);ocultarOpcionMenor2();
if(esFinal){
let porDim=matriz.length<3||matriz[0].length<3;
if(!porDim){let pasos=listarAmpliaciones(matriz,[vf1,vf2],[vc1,vc2]);pintarMenoresNulos(pasos,"Menor nulo de orden 3 construido a partir del menor actual");}
mostrarMensajeRangoFinal(2,menorActual.menor,porDim);ui.remove();desmarcarOpcionActual();return;
}}
ui.remove();desmarcarOpcionActual();
}
f1.focus();f1.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();f2.focus();}});
f2.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();c1.focus();}});
c1.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();c2.focus();}});
c2.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();validarMenor2();}});return;
}

case "opcion2":{
if(!menorActual){logLinea("Primero elige un menor no nulo.");desmarcarOpcionActual();return;}
let fa=menorActual.filas.slice(),ca=menorActual.columnas.slice(),nfGlob=matriz.length,ncGlob=matriz[0].length;
if(fa.length===nfGlob||ca.length===ncGlob){mostrarMenorActual(menorActual.menor,true);mostrarMensajeRangoFinal(fa.length,menorActual.menor,true);desmarcarOpcionActual();return;}
let ordenActual=fa.length;
if(rangoInicial===ordenActual){
let porDim=fa.length===nfGlob||ca.length===ncGlob;
if(!porDim){let pasos=listarAmpliaciones(matriz,fa,ca);pintarMenoresNulos(pasos,"Menor nulo de orden "+(ordenActual+1)+" construido a partir del menor actual");}
mostrarMenorActual(menorActual.menor,true);mostrarMensajeRangoFinal(ordenActual,menorActual.menor,porDim);desmarcarOpcionActual();return;
}
let remF=[],remC=[];
for(let i=1;i<=nfGlob;i++)if(!fa.includes(i))remF.push(i);
for(let j=1;j<=ncGlob;j++)if(!ca.includes(j))remC.push(j);
if(remF.length===1&&remC.length===1){
let f=remF[0],c=remC[0],nF=fa.concat([f]),nC=ca.concat([c]),mA=Matriz.menor(matriz,nF.map(v=>v-1),nC.map(v=>v-1)),dA=Matriz.determinante(mA);
pintarPasoMenorEnCaja({filas:nF,cols:nC,menor:mA,det:dA},"Unico menor de orden "+nF.length+" (ampliacion automatica)");
if(!esCero(dA)){
menorActual={filas:nF,columnas:nC,menor:mA};mostrarMenorActual(mA);
if(nF.length===nfGlob||nC.length===ncGlob){mostrarMenorActual(mA,true);mostrarMensajeRangoFinal(nF.length,mA,true);desmarcarOpcionActual();return;}
if(rangoInicial===nF.length){
let porDim=nF.length===nfGlob||nC.length===ncGlob;
if(!porDim){let pasos=listarAmpliaciones(matriz,nF,nC);pintarMenoresNulos(pasos,"Menor nulo de orden "+(nF.length+1)+" construido a partir del menor actual");}
mostrarMenorActual(mA,true);mostrarMensajeRangoFinal(nF.length,mA,porDim);desmarcarOpcionActual();return;
}
}else{
mostrarMenorActual(menorActual.menor,true);mostrarMensajeRangoFinal(ordenActual,menorActual.menor,false);desmarcarOpcionActual();return;
}
desmarcarOpcionActual();return;
}
let ui=document.createElement("div");caja124.appendChild(ui);let to=document.createElement("h4");to.textContent="Ampliar a un menor de orden superior";ui.appendChild(to);
let pf=document.createElement("p");pf.textContent="Nueva fila y nueva columna:";pf.style.fontSize="14px";ui.appendChild(pf);
let fila=document.createElement("div");fila.style.cssText="display:flex;gap:6px;align-items:center;margin-top:5px;";ui.appendChild(fila);
let fN=document.createElement("input");fN.placeholder="F nueva";fN.style.width="60px";
let cN=document.createElement("input");cN.placeholder="C nueva";cN.style.width="60px";fila.append(fN,cN);

function validarAmp(){
let f=parseInt(fN.value.trim()),c=parseInt(cN.value.trim()),nf=matriz.length,nc=matriz[0].length;
if(isNaN(f)||isNaN(c)){logLinea("Error: números requeridos");return;}if(f<1||f>nf){logLinea("Fila fuera de rango");return;}
if(c<1||c>nc){logLinea("Columna fuera de rango");return;}if(fa.includes(f)){logLinea("La fila ya está en el menor");return;}
if(ca.includes(c)){logLinea("La columna ya está en el menor");return;}
let nF=fa.concat([f]),nC=ca.concat([c]),mA=Matriz.menor(matriz,nF.map(v=>v-1),nC.map(v=>v-1)),dA=Matriz.determinante(mA);
pintarPasoMenorEnCaja({filas:nF,cols:nC,menor:mA,det:dA},"Menor de orden "+nF.length+" ampliado");
if(!esCero(dA)){
menorActual={filas:nF,columnas:nC,menor:mA};mostrarMenorActual(mA);
if(nF.length===nfGlob||nC.length===ncGlob){mostrarMenorActual(mA,true);mostrarMensajeRangoFinal(nF.length,mA,true);desmarcarOpcionActual();return;}
if(rangoInicial===nF.length){
let porDim=nF.length===nfGlob||nC.length===ncGlob;
if(!porDim){let pasos=listarAmpliaciones(matriz,nF,nC);pintarMenoresNulos(pasos,"Menor nulo de orden "+(nF.length+1)+" construido a partir del menor actual");}
mostrarMenorActual(mA,true);mostrarMensajeRangoFinal(nF.length,mA,porDim);desmarcarOpcionActual();return;
}}
ui.remove();desmarcarOpcionActual();
}
fN.focus();fN.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();cN.focus();}});
cN.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();validarAmp();}});return;
}

case "opcion3":{
let ui=document.createElement("div");caja124.appendChild(ui);let to=document.createElement("h4");to.textContent="Eliminar una de dos filas iguales o proporcionales";ui.appendChild(to);
let p=document.createElement("p");p.textContent="Introduce F1 y F2:";p.style.fontSize="14px";ui.appendChild(p);
let f=document.createElement("div");f.style.cssText="display:flex;gap:6px;margin-top:5px;align-items:center;";ui.appendChild(f);
let a=document.createElement("input");a.placeholder="F1";a.style.width="40px";
let b=document.createElement("input");b.placeholder="F2";b.style.width="40px";f.append(a,b);
function validar(){
const A=parseInt(a.value.trim()),B=parseInt(b.value.trim()),nf=matriz.length;
if([A,B].some(v=>isNaN(v))){logLinea("Error: debes introducir dos filas numéricas.");return;}if(A===B){logLinea("Error: las dos filas deben ser distintas.");return;}
if(A<1||A>nf||B<1||B>nf){logLinea("Error: fila fuera de rango (1 a "+nf+").");return;}
const prop=Matriz.sonFilasProporcionales(A-1,B-1,matriz);if(!prop){logLinea("Las filas "+A+" y "+B+" no son proporcionales.");ui.remove();desmarcarOpcionActual();return;}
let msg="Las filas "+A+" y "+B+" son proporcionales ⇒ se elimina la fila "+B+" sin cambiar el rango.",mS=matriz.filter((_,i)=>i!==(B-1));
registrarOperacionConMatriz(msg,mS);ui.remove();desmarcarOpcionActual();
}
a.focus();a.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();b.focus();}});
b.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();validar();}});return;
}

case "opcion4":{
let ui=document.createElement("div");caja124.appendChild(ui);let to=document.createElement("h4");to.textContent="Eliminar una de dos columnas iguales o proporcionales";ui.appendChild(to);
let p=document.createElement("p");p.textContent="Introduce C1 y C2:";p.style.fontSize="14px";ui.appendChild(p);
let c=document.createElement("div");c.style.cssText="display:flex;gap:6px;margin-top:5px;align-items:center;";ui.appendChild(c);
let a=document.createElement("input");a.placeholder="C1";a.style.width="40px";
let b=document.createElement("input");b.placeholder="C2";b.style.width="40px";c.append(a,b);
function validar(){
const A=parseInt(a.value.trim()),B=parseInt(b.value.trim()),nc=matriz[0].length;
if([A,B].some(v=>isNaN(v))){logLinea("Error: debes introducir dos columnas numéricas.");return;}if(A===B){logLinea("Error: las dos columnas deben ser distintas.");return;}
if(A<1||A>nc||B<1||B>nc){logLinea("Error: columna fuera de rango (1 a "+nc+").");return;}
const prop=Matriz.sonColumnasProporcionales(A-1,B-1,matriz);if(!prop){logLinea("Las columnas "+A+" y "+B+" no son proporcionales.");ui.remove();desmarcarOpcionActual();return;}
let msg="Las columnas "+A+" y "+B+" son proporcionales ⇒ se elimina la columna "+B+" sin cambiar el rango.",mS=matriz.map(f=>f.filter((_,i)=>i!==(B-1)));
registrarOperacionConMatriz(msg,mS);ui.remove();desmarcarOpcionActual();
}
a.focus();a.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();b.focus();}});
b.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();validar();}});return;
}

case "opcion5":{
let ui=document.createElement("div");caja124.appendChild(ui);let to=document.createElement("h4");to.textContent="Dividir una fila por un número no nulo";ui.appendChild(to);
let p1=document.createElement("p");p1.textContent="Introduce la fila:";p1.style.fontSize="14px";ui.appendChild(p1);
let iF=document.createElement("input");iF.placeholder="Fila";iF.style.width="60px";ui.appendChild(iF);
let p2=document.createElement("p");p2.textContent="Introduce el divisor (≠0):";p2.style.fontSize="14px";p2.style.marginTop="12px";ui.appendChild(p2);
let iD=document.createElement("input");iD.placeholder="Divisor";iD.style.width="80px";ui.appendChild(iD);
function validar(){
const f=parseInt(iF.value.trim()),d=Number(iD.value.trim()),nf=matriz.length;
if(isNaN(f)||isNaN(d)){logLinea("Error: fila y divisor deben ser numéricos.");return;}
if(f<1||f>nf){logLinea("Error: fila fuera de rango (1 a "+nf+").");return;}if(d===0){logLinea("Error: el divisor no puede ser 0.");return;}
let mS=matriz.map((fila,i)=>i===f-1?fila.map(x=>Matriz.dividirElemento?Matriz.dividirElemento(x,d):x/d):fila.slice());
registrarOperacionConMatriz("Se ha dividido la fila "+f+" entre "+d+".",mS);ui.remove();desmarcarOpcionActual();
}
iF.focus();iF.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();iD.focus();}});
iD.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();validar();}});return;
}

case "opcion6":{
let ui=document.createElement("div");caja124.appendChild(ui);let to=document.createElement("h4");to.textContent="Dividir una columna por un número no nulo";ui.appendChild(to);
let p1=document.createElement("p");p1.textContent="Introduce la columna:";p1.style.fontSize="14px";ui.appendChild(p1);
let iC=document.createElement("input");iC.placeholder="Columna";iC.style.width="60px";ui.appendChild(iC);
let p2=document.createElement("p");p2.textContent="Introduce el divisor (≠0):";p2.style.fontSize="14px";p2.style.marginTop="12px";ui.appendChild(p2);
let iD=document.createElement("input");iD.placeholder="Divisor";iD.style.width="80px";ui.appendChild(iD);
function validar(){
const c=parseInt(iC.value.trim()),d=Number(iD.value.trim()),nc=matriz[0].length;
if(isNaN(c)||isNaN(d)){logLinea("Error: columna y divisor deben ser numéricos.");return;}
if(c<1||c>nc){logLinea("Error: columna fuera de rango (1 a "+nc+").");return;}if(d===0){logLinea("Error: el divisor no puede ser 0.");return;}
let mS=matriz.map(fila=>fila.map((x,j)=>j===c-1?(Matriz.dividirElemento?Matriz.dividirElemento(x,d):x/d):x));
registrarOperacionConMatriz("Se ha dividido la columna "+c+" entre "+d+".",mS);ui.remove();desmarcarOpcionActual();
}
iC.focus();iC.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();iD.focus();}});
iD.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();validar();}});return;
}

case "opcion7":{
caja21Titulo.textContent="RESOLUCIÓN AUTOMÁTICA";
let cab=document.createElement("div");cab.style.cssText="margin-top:10px;font-size:15px;font-weight:bold;";
cab.textContent="Resolución automática del rango por menores sucesivos:";document.getElementById("caja21").appendChild(cab);
let rangoFinal=rangoInicial;if(rangoFinal===0||rangoFinal===1){mostrarMensajeRangoPequeno(rangoFinal);desmarcarOpcionActual();return;}
let p2=encontrarMenor2NoNulo(matriz);if(!p2){logLinea("No se ha encontrado menor 2×2 no nulo.");desmarcarOpcionActual();return;}
menorActual={filas:p2.filas,columnas:p2.cols,menor:p2.menor};mostrarMenorActual(p2.menor);ocultarOpcionMenor2();pintarPasoMenorEnCaja(p2,"1) Menor de orden 2 elegido");
let filasAct=p2.filas.slice(),colsAct=p2.cols.slice();
while(filasAct.length<rangoFinal){
let s=ampliarMenorActual(matriz,filasAct,colsAct);
if(s.fallo){
if(s.razonFallo&&s.razonFallo.tipo==="nulos"&&s.pasos&&s.pasos.length)pintarMenoresNulos(s.pasos,"Menor nulo de orden "+(filasAct.length+1)+" construido a partir del menor actual");
break;
}
let k=s.filas.length;pintarPasoMenorEnCaja(s,"Menor de orden "+k+" distinto de cero ampliado");
menorActual={filas:s.filas,columnas:s.cols,menor:s.menor};mostrarMenorActual(s.menor);filasAct=s.filas.slice();colsAct=s.cols.slice();
if(filasAct.length===matriz.length||colsAct.length===matriz[0].length){mostrarSolucionFinalMenor(s.menor);desmarcarOpcionActual();return;}
}
mostrarSolucionFinalMenor(menorActual.menor);desmarcarOpcionActual();return;
}

}});
if(rangoInicial===0||rangoInicial===1){
caja21Titulo.textContent="RESOLUCIÓN AUTOMÁTICA";
let cab=document.createElement("div");cab.style.cssText="margin-top:10px;font-size:15px;font-weight:bold;";
cab.textContent="Resolución automática del rango por menores sucesivos:";document.getElementById("caja21").appendChild(cab);
mostrarMensajeRangoPequeno(rangoInicial);
}
botonReset.addEventListener("click",()=>resetearFormulario());
}

document.addEventListener("DOMContentLoaded",function(){
const abreVentana1=document.getElementById("abreVentana1"),cierraVentana1=document.getElementById("cierraVentana1");
const ventana=document.getElementById("ventana1"),pdf1=document.getElementById("pdf1");
const pdf1URL="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
if(abreVentana1)abreVentana1.addEventListener("click",function(event){event.preventDefault();pdf1.src=pdf1URL;ventana.style.display="flex";});
if(cierraVentana1)cierraVentana1.addEventListener("click",function(){ventana.style.display="none";pdf1.src="";});
window.addEventListener("click",function(event){if(event.target==ventana){ventana.style.display="none";pdf1.src="";}});

let ayuda=abreVentana1;try{
if(ayuda&&ayuda.parentElement){
let parent=ayuda.parentElement,btn=document.createElement("button");btn.textContent="Otra matriz";
btn.addEventListener("click",()=>{window.scrollTo(0,0);window.location.reload();});
let volver=[...parent.querySelectorAll("button,a")].find(x=>String(x.textContent||"").trim()==="Volver");
if(volver)parent.insertBefore(btn,volver);else parent.appendChild(btn);
}
}catch(e){}
});
