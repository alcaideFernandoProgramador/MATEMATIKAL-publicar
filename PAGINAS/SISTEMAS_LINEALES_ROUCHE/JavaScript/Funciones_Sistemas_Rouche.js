"use strict";

// =====================================================================
// ESTADO GLOBAL
// =====================================================================
let nEcuaciones=0, nIncognitas=0;
let matrizAmpS=[], matrizAmpN=[];
let rangoA_real=0, rangoAmp_real=0;
let rangoA_confirm=null, rangoAmp_confirm=null;
let pasoActual=0;
let tablaInput=null, valoresInput=[];
let tarjetaActiva=null; // tarjeta de formulario activa en el workspace

// =====================================================================
// REFS AL DOM
// =====================================================================
let caja1111, caja11111, caja11112, caja1112, caja112;
let pasoIndicadorDer, refContenido, historialDiv;

// =====================================================================
// UTILIDADES NUMÉRICAS
// =====================================================================
function _strip(s){return (s??"").toString().trim().replace(/\s+/g,"");}
function _clear(n){while(n&&n.firstChild)n.removeChild(n.firstChild);}
function _esCeroNum(x){return typeof x==="number"&&Number.isFinite(x)&&Math.abs(x)<=1e-9;}
function _gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){let t=a%b;a=b;b=t;}return a||1;}
function _fracApprox(x,maxDen){
  if(!Number.isFinite(x))return null;
  let s=x<0?-1:1,v=Math.abs(x),a=Math.floor(v);
  if(Math.abs(v-a)<=1e-9)return{p:s*a,q:1};
  let h1=1,h0=0,k1=0,k0=1,b=v;
  for(let it=0;it<32;it++){
    let ai=Math.floor(b),h=ai*h1+h0,k=ai*k1+k0;if(k>maxDen)break;
    let r=v-h/k;if(Math.abs(r)<=1e-9)return{p:s*h,q:k};
    h0=h1;h1=h;k0=k1;k1=k;let frac=b-ai;if(frac<=1e-15)break;b=1/frac;
  }
  return null;
}
function _numToStr(x){
  if(!Number.isFinite(x))return"0";
  if(_esCeroNum(x))return"0";
  let r=Math.round(x);if(Math.abs(x-r)<=1e-9)return r.toString();
  let fr=_fracApprox(x,1000);
  if(fr&&fr.q!==1){let g=_gcd(Math.abs(fr.p),fr.q),p=fr.p/g,q=fr.q/g;if(Math.abs(x-p/q)<=1e-8)return p+"/"+q;}
  return x.toFixed(8).replace(/\.?0+$/,"");
}
function _parseRacional(raw){
  let s=_strip(raw);if(!s.length)throw new Error("v");
  if(s.includes(","))s=s.replace(",",".");
  if(/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(s)){let n=parseFloat(s);if(!Number.isFinite(n))throw new Error("n");return n;}
  if(/^[-+]?\d+\/\d+$/.test(s)){let p=s.split("/"),a=parseInt(p[0],10),b=parseInt(p[1],10);
    if(!Number.isFinite(a)||!Number.isFinite(b)||b===0)throw new Error("f");return a/b;}
  throw new Error("f");
}
function _parseIndices(str, maxVal){
  let parts=str.split(",").map(s=>s.trim()).filter(s=>s.length>0);
  if(!parts.length)throw new Error("Introduce al menos un índice.");
  let indices=parts.map(s=>{
    let n=parseInt(s,10);
    if(isNaN(n)||n<1||n>maxVal)throw new Error(`Índice ${s} fuera del rango [1,${maxVal}].`);
    return n-1;
  });
  if(new Set(indices).size!==indices.length)throw new Error("Índices repetidos.");
  return indices.sort((a,b)=>a-b);
}
function _matCoefN(){return matrizAmpN.map(r=>r.slice(0,nIncognitas));}

// =====================================================================
// KATEX
// =====================================================================
function _rk(latex,el){
  try{katex.render(latex,el,{throwOnError:false,displayMode:false});}
  catch(e){el.textContent=latex;}
}
function _numLx(x){
  let s=_numToStr(x);
  if(s.includes("/")){let[a,b]=s.split("/");return`\\dfrac{${a}}{${b}}`;}
  return s;
}
function _matLx(matN){
  let rows=matN.map(r=>r.map(_numLx).join("&"));
  return`\\begin{pmatrix}${rows.join("\\\\")}\\end{pmatrix}`;
}
function _matAmpLx(){
  let n=nIncognitas;
  let rows=matrizAmpN.map(r=>[...r.slice(0,n).map(_numLx),_numLx(r[n])].join("&"));
  return`\\left(\\begin{array}{${"c".repeat(n)}|c}${rows.join("\\\\")}\\end{array}\\right)`;
}
function _sistemaLx(){
  let rows=matrizAmpN.map(fila=>{
    let eq="";
    fila.slice(0,nIncognitas).forEach((c,j)=>{
      if(_esCeroNum(c))return;
      let xj=`x_{${j+1}}`;
      let abs=Math.abs(c),neg=c<0;
      let coefLx=Math.abs(Math.round(abs*1e9)-1e9)<1?"":_numLx(abs);
      let term=coefLx+xj;
      if(eq===""){eq=neg?"-"+term:term;}
      else{eq+=neg?"-"+term:"+"+term;}
    });
    if(eq==="")eq="0";
    return eq+`=${_numLx(fila[nIncognitas])}`;
  });
  return`\\left\\{\\begin{array}{l}${rows.join("\\\\")}\\end{array}\\right.`;
}

// =====================================================================
// INDICADOR DE PASOS (panel derecho)
// =====================================================================
function _construirIndicador(){
  _clear(pasoIndicadorDer);
  let labels=["Rango de A","Rango de (A|b)","Discusión","Solución"];
  labels.forEach((lbl,i)=>{
    if(i>0){let sep=document.createElement("div");sep.className="paso-sep";sep.textContent="›";pasoIndicadorDer.appendChild(sep);}
    let item=document.createElement("div");item.className="paso-ind-item";
    let num=document.createElement("div");num.className="paso-num";num.textContent=i+1;
    let txt=document.createElement("div");txt.className="paso-txt";txt.textContent=lbl;
    item.appendChild(num);item.appendChild(txt);
    pasoIndicadorDer.appendChild(item);
  });
}
function _actualizarIndicador(){
  let items=pasoIndicadorDer.querySelectorAll(".paso-ind-item");
  items.forEach((item,i)=>{
    let s=i+1;
    item.classList.remove("activo","completado");
    if(s===pasoActual)item.classList.add("activo");
    else if(s<pasoActual)item.classList.add("completado");
  });
}

// =====================================================================
// PANEL DE REFERENCIA (caja12 → refContenido)
// =====================================================================
function _mostrarRef(titulo, latexContent, notaHTML, rangosArr){
  _clear(refContenido);
  if(titulo){let h=document.createElement("div");h.className="ref-titulo";h.textContent=titulo;refContenido.appendChild(h);}
  if(latexContent){let d=document.createElement("div");d.className="ref-mat";refContenido.appendChild(d);_rk(latexContent,d);}
  if(notaHTML){let n=document.createElement("div");n.className="ref-nota";n.innerHTML=notaHTML;refContenido.appendChild(n);}
  if(rangosArr&&rangosArr.length){
    let bar=document.createElement("div");bar.className="ref-rangos";
    rangosArr.forEach(function(par){
      let b=document.createElement("div");b.className="ref-rango-badge";_rk(par,b);bar.appendChild(b);
    });
    refContenido.appendChild(bar);
  }
}

// =====================================================================
// WORKSPACE: insertar tarjeta antes de la activa (o al final)
// =====================================================================
function _insertarAnteActiva(card){
  if(tarjetaActiva&&tarjetaActiva.parentNode===historialDiv){
    historialDiv.insertBefore(card,tarjetaActiva);
  }else{
    historialDiv.appendChild(card);
  }
  historialDiv.scrollTop=historialDiv.scrollHeight;
}

// =====================================================================
// TARJETAS DE RESULTADOS (estáticas)
// =====================================================================
function _tarjetaMenor(prefijo, filasIdx, colsIdx, minorMat, det, maxOrden, rangoReal){
  let esNulo=_esCeroNum(det);
  let f=filasIdx.map(x=>x+1).join(", ");
  let c=colsIdx.map(x=>x+1).join(", ");
  let orden=filasIdx.length;

  let card=document.createElement("div");
  card.className="hist-entrada "+(esNulo?"hist-nulo":"hist-nonulo");

  let et=document.createElement("div");et.className="hist-etiqueta";
  et.textContent=`Menor de ${prefijo}  ·  F:{${f}}  C:{${c}}  ·  orden ${orden}`;
  card.appendChild(et);

  // Menor (como determinante) = valor
  let v=document.createElement("div");v.className="hist-valor";
  let mRows=minorMat.map(r=>r.map(_numLx).join("&"));
  let matTex=`\\begin{vmatrix}${mRows.join("\\\\")}\\end{vmatrix}`;
  _rk(`${matTex}=${_numLx(det)}`,v);
  card.appendChild(v);

  // Veredicto sobre orden superior
  let verd=document.createElement("div");verd.className="hist-vered";
  verd.textContent=esNulo?"Determinante NULO":"Determinante NO NULO";
  card.appendChild(verd);

  let info=document.createElement("div");info.className="hist-info";
  if(!esNulo){
    if(orden<rangoReal)info.innerHTML=`Existen menores no nulos de orden superior.`;
    else info.innerHTML=`<span class="hist-maxord">⭐ No existen menores no nulos de orden superior.</span>`;
  }else{
    if(orden>rangoReal)info.innerHTML=`Todos los menores de orden ${orden} son nulos.`;
    else info.innerHTML=`Este menor es nulo — pero existen menores no nulos de este orden.`;
  }
  card.appendChild(info);

  return card;
}

function _tarjetaRango(prefijo, rango){
  let card=document.createElement("div");
  card.className="hist-entrada hist-rango-conf";
  let et=document.createElement("div");et.className="hist-etiqueta";et.textContent="✓ Rango confirmado";card.appendChild(et);
  let v=document.createElement("div");v.className="hist-badge-rango";
  _rk(`\\text{rg}(${prefijo}) = ${rango}`,v);
  card.appendChild(v);
  return card;
}

function _tarjetaDiscusion(){
  let rA=rangoA_confirm, rAb=rangoAmp_confirm, n=nIncognitas;
  let tipo;
  if(rA!==rAb)tipo="incompatible";
  else if(rA===n)tipo="cd";
  else tipo="ci";

  let card=document.createElement("div");
  card.className="hist-entrada hist-discusion";
  let et=document.createElement("div");et.className="hist-etiqueta";et.textContent="Rouché-Frobenius";card.appendChild(et);

  let vals=document.createElement("div");vals.className="hist-disc-vals";
  _rk(`\\text{rg}(A)=${rA}\\quad\\text{rg}(A|b)=${rAb}\\quad n=${n}`,vals);
  card.appendChild(vals);

  let conclu=document.createElement("div");
  let tex,clase;
  if(tipo==="incompatible"){
    clase="hist-tipo-incompatible";
    tex=`\\text{rg}(A)\\neq\\text{rg}(A|b)\\Rightarrow\\textbf{Incompatible}`;
  }else if(tipo==="cd"){
    clase="hist-tipo-cd";
    tex=`\\text{rg}(A)=\\text{rg}(A|b)=n\\Rightarrow\\textbf{Compatible Det.}`;
  }else{
    clase="hist-tipo-ci";
    let lib=n-rA;
    tex=`\\text{rg}(A)=\\text{rg}(A|b)<n\\Rightarrow\\textbf{Comp. Indet.}\\;(${lib}\\text{ par.})`;
  }
  conclu.className="hist-disc-conclu "+clase;
  _rk(tex,conclu);
  card.appendChild(conclu);

  return {card, tipo};
}

function _tarjetaSolucion(){
  let card=document.createElement("div");
  card.className="hist-entrada hist-solucion";
  let et=document.createElement("div");et.className="hist-etiqueta";et.textContent="Solución del sistema";card.appendChild(et);
  let v=document.createElement("div");v.className="hist-sol-cuerpo";card.appendChild(v);
  Representar.solucionesSistemaLineal(matrizAmpS,v,false,[]);
  return card;
}

// =====================================================================
// RESOLUCIÓN AUTOMÁTICA
// =====================================================================
function _autoResolverDesde(desde){
  // Combinaciones de k elementos de arr
  function combs(arr,k){
    if(k===0)return[[]];if(!arr.length)return[];
    let[h,...t]=arr;
    return[...combs(t,k-1).map(c=>[h,...c]),...combs(t,k)];
  }
  // Primer menor no nulo del orden dado
  function hallarMenor(mat,rango){
    if(rango===0)return null;
    let m=mat.length,n=mat[0].length;
    for(let fC of combs([...Array(m).keys()],rango))
      for(let cC of combs([...Array(n).keys()],rango)){
        let minor=Matriz.menor(mat,fC,cC);
        let det=Matriz.determinanteNumerico(minor);
        if(det!==null&&Number.isFinite(det)&&!_esCeroNum(det))
          return{filasIdx:fC,colsIdx:cC,minorMat:minor,det};
      }
    return null;
  }
  // Crea tarjeta estática con el menor hallado y la confirmación del rango
  function crearCardAuto(paso,prefijo,mat,rangoReal){
    if(tarjetaActiva&&tarjetaActiva.parentNode)tarjetaActiva.parentNode.removeChild(tarjetaActiva);
    tarjetaActiva=null;
    let card=document.createElement("div");card.className="hist-entrada hist-rango-conf";
    let etq=document.createElement("div");etq.className="hist-etiqueta";
    etq.textContent=`Paso ${paso} — ${prefijo}`;card.appendChild(etq);
    let resArea=document.createElement("div");resArea.className="form-res-area";
    let r=hallarMenor(mat,rangoReal);
    if(r){
      let blq=document.createElement("div");blq.className="form-menor-blq form-menor-nonulo";
      let hdr=document.createElement("div");hdr.className="form-menor-hdr";
      hdr.textContent=`F:{${r.filasIdx.map(x=>x+1).join(",")}} C:{${r.colsIdx.map(x=>x+1).join(",")}} · orden ${r.filasIdx.length}`;
      blq.appendChild(hdr);
      let val=document.createElement("div");val.className="form-menor-val";
      let mRows=r.minorMat.map(row=>row.map(_numLx).join("&"));
      _rk(`\\begin{vmatrix}${mRows.join("\\\\")}\\end{vmatrix}=${_numLx(r.det)}`,val);
      blq.appendChild(val);
      let inf=document.createElement("div");inf.className="form-menor-inf";
      inf.innerHTML=`<span class="hist-maxord">No existen menores no nulos de orden superior.</span>`;
      blq.appendChild(inf);
      resArea.appendChild(blq);
    }
    card.appendChild(resArea);
    let v=document.createElement("div");v.className="hist-badge-rango";
    _rk(`\\text{rg}(${prefijo}) = ${rangoReal}`,v);card.appendChild(v);
    historialDiv.appendChild(card);
    historialDiv.scrollTop=historialDiv.scrollHeight;
  }

  if(desde<=1){
    pasoActual=1;_actualizarIndicador();
    crearCardAuto(1,"A",_matCoefN(),rangoA_real);
    rangoA_confirm=rangoA_real;
    pasoActual=2;_actualizarIndicador();
    _mostrarRef("Paso 2 — Rango de (A|b)",_matAmpLx(),
      `Orden máximo de menores: <strong>${Math.min(nEcuaciones,nIncognitas+1)}</strong>`,
      [`\\text{rg}(A)=${rangoA_confirm}`]);
    crearCardAuto(2,"(A|b)",matrizAmpN,rangoAmp_real);
    rangoAmp_confirm=rangoAmp_real;
    iniciarPaso3();
  }else if(desde===2){
    crearCardAuto(2,"(A|b)",matrizAmpN,rangoAmp_real);
    rangoAmp_confirm=rangoAmp_real;
    iniciarPaso3();
  }
}

// =====================================================================
// TARJETA ACTIVA: todo dentro del mismo contenedor
// =====================================================================
function _crearTarjetaActiva(mat, numFilas, numCols, maxOrd, prefijo, rangoReal, onRangoOk){
  if(tarjetaActiva&&tarjetaActiva.parentNode)tarjetaActiva.parentNode.removeChild(tarjetaActiva);

  let card=document.createElement("div");
  card.className="hist-entrada hist-activa";
  tarjetaActiva=card;

  // Cabecera
  let et=document.createElement("div");et.className="hist-etiqueta";
  et.textContent=`Paso ${pasoActual} — ${prefijo}`;
  card.appendChild(et);

  // Botón resolución automática
  let btnAuto=document.createElement("button");btnAuto.type="button";
  btnAuto.className="btn-auto";btnAuto.textContent="Resolución automática →";
  let pasoCap=pasoActual;
  btnAuto.addEventListener("click",function(){_autoResolverDesde(pasoCap);});
  card.appendChild(btnAuto);

  // Zona acumuladora de resultados de menores (dentro de la tarjeta)
  let resArea=document.createElement("div");resArea.className="form-res-area";
  card.appendChild(resArea);

  // Toggle
  let tog=document.createElement("div");tog.className="form-toggle";
  let btnM=document.createElement("button");btnM.className="form-toggle-btn activo";btnM.textContent="Calcular menor";btnM.type="button";
  let btnR=document.createElement("button");btnR.className="form-toggle-btn";btnR.textContent="Indicar rango";btnR.type="button";
  tog.appendChild(btnM);tog.appendChild(btnR);
  card.appendChild(tog);

  // Zona de inputs intercambiable
  let zona=document.createElement("div");zona.className="form-seccion";
  card.appendChild(zona);

  historialDiv.appendChild(card);

  /* ── Añadir resultado de menor a resArea ── */
  function _addResultado(filIdx, colIdx, minorMat, det){
    let esNulo=_esCeroNum(det);
    let orden=filIdx.length;
    let f=filIdx.map(x=>x+1).join(",");
    let c=colIdx.map(x=>x+1).join(",");

    let blq=document.createElement("div");blq.className="form-menor-blq "+(esNulo?"form-menor-nulo":"form-menor-nonulo");

    let hdr=document.createElement("div");hdr.className="form-menor-hdr";
    hdr.textContent=`F:{${f}} C:{${c}} · orden ${orden}`;
    blq.appendChild(hdr);

    let val=document.createElement("div");val.className="form-menor-val";
    let mRows=minorMat.map(r=>r.map(_numLx).join("&"));
    _rk(`\\begin{vmatrix}${mRows.join("\\\\")}\\end{vmatrix}=${_numLx(det)}`,val);
    blq.appendChild(val);

    let inf=document.createElement("div");inf.className="form-menor-inf";
    if(!esNulo){
      if(orden<rangoReal)inf.textContent="Existen menores no nulos de orden superior.";
      else inf.innerHTML=`<span class="hist-maxord">No existen menores no nulos de orden superior.</span>`;
    }else{
      if(orden>rangoReal)inf.textContent=`Todos los menores de orden ${orden} son nulos.`;
      else inf.textContent="Este menor es nulo — existen menores no nulos de este orden.";
    }
    blq.appendChild(inf);
    resArea.appendChild(blq);
    card.scrollIntoView({block:"end",behavior:"smooth"});
  }

  /* ── MODO: calcular menor ── */
  function _modoMenor(){
    btnM.classList.add("activo");btnR.classList.remove("activo");
    _clear(zona);

    let rowM=document.createElement("div");rowM.className="form-row";
    let lFil=document.createElement("label");lFil.textContent="Filas:";
    let iFil=document.createElement("input");iFil.type="text";iFil.className="input-indices";iFil.placeholder=`ej: 1,2`;
    let lCol=document.createElement("label");lCol.textContent="Cols:";
    let iCol=document.createElement("input");iCol.type="text";iCol.className="input-indices";iCol.placeholder=`ej: 1,3`;
    rowM.appendChild(lFil);rowM.appendChild(iFil);rowM.appendChild(lCol);rowM.appendChild(iCol);
    zona.appendChild(rowM);
    let msgM=document.createElement("div");msgM.className="form-msg";zona.appendChild(msgM);

    function _calcMenor(){
      msgM.innerHTML="";
      try{
        let filIdx=_parseIndices(iFil.value,numFilas);
        let colIdx=_parseIndices(iCol.value,numCols);
        if(filIdx.length!==colIdx.length){msgM.innerHTML=`<span class="err">Mismo nº de filas y columnas.</span>`;iFil.focus();return;}
        let minor=Matriz.menor(mat,filIdx,colIdx);
        let det=Matriz.determinanteNumerico(minor);
        if(det===null||!Number.isFinite(det)){msgM.innerHTML=`<span class="err">No se pudo calcular.</span>`;return;}
        _addResultado(filIdx,colIdx,minor,det);
        iFil.value="";iCol.value="";msgM.innerHTML="";
        iFil.focus();
      }catch(err){msgM.innerHTML=`<span class="err">${err.message||"Índices no válidos."}</span>`;}
    }

    iFil.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key==="Tab"){ev.preventDefault();iCol.focus();}});
    iCol.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key==="Tab"){ev.preventDefault();_calcMenor();}});
    iFil.focus();
  }

  /* ── MODO: indicar rango ── */
  function _modoRango(){
    btnR.classList.add("activo");btnM.classList.remove("activo");
    _clear(zona);

    let rowR=document.createElement("div");rowR.className="form-row";
    let lRng=document.createElement("label");_rk(`\\text{rg}(${prefijo})=`,lRng);
    let iRng=document.createElement("input");iRng.type="text";iRng.style.width="40px";
    rowR.appendChild(lRng);rowR.appendChild(iRng);
    zona.appendChild(rowR);
    let msgR=document.createElement("div");msgR.className="form-msg";zona.appendChild(msgR);

    iRng.addEventListener("keydown",function(ev){
      if(ev.key!=="Enter")return;
      ev.preventDefault();
      msgR.innerHTML="";
      let rDecl=parseInt(_strip(iRng.value),10);
      let maxPos=Math.min(numFilas,numCols);
      if(isNaN(rDecl)||rDecl<0||rDecl>maxPos){msgR.innerHTML=`<span class="err">Entero entre 0 y ${maxPos}.</span>`;return;}
      if(rDecl===rangoReal){
        msgR.innerHTML=`<span class="cierto">CIERTO</span>`;
        setTimeout(function(){
          // Quitar solo el toggle y la zona de inputs; conservar cabecera y menores
          if(tog.parentNode)tog.parentNode.removeChild(tog);
          if(zona.parentNode)zona.parentNode.removeChild(zona);
          card.className="hist-entrada hist-rango-conf";
          let v=document.createElement("div");v.className="hist-badge-rango";
          _rk(`\\text{rg}(${prefijo}) = ${rDecl}`,v);card.appendChild(v);
          tarjetaActiva=null;
          onRangoOk(rDecl);
        },600);
      }else{
        msgR.innerHTML=`<span class="falso">FALSO</span>`;
        iRng.value="";
        setTimeout(function(){iRng.focus();},300);
      }
    });
    iRng.focus();
  }

  btnM.addEventListener("click",_modoMenor);
  btnR.addEventListener("click",_modoRango);
  _modoMenor();
}

// =====================================================================
// PASO 0 — ENTRADA DEL SISTEMA
// =====================================================================
function iniciarPaso0(){
  pasoActual=0;
  _actualizarIndicador();

  // Panel izquierdo: título
  caja11111.textContent="INTRODUCCIÓN DE DATOS";
  caja11112.style.color="#dbeafe";
  caja11112.innerHTML="Valida cada dato con ENTER o TAB.";

  // Inputs de dimensiones en caja1112
  _clear(caja1112);
  let fila=document.createElement("div");fila.className="dim-fila";

  let d1=document.createElement("div");d1.className="dim-campo";
  let l1=document.createElement("span");l1.textContent="Nº de Ecuaciones";
  let s1=document.createElement("small");s1.textContent="(1 a 5)";
  let i1=document.createElement("input");i1.type="text";i1.style.width="52px";
  d1.appendChild(l1);d1.appendChild(i1);d1.appendChild(s1);

  let d2=document.createElement("div");d2.className="dim-campo";
  let l2=document.createElement("span");l2.textContent="Nº de Incógnitas";
  let s2=document.createElement("small");s2.textContent="(1 a 5)";
  let i2=document.createElement("input");i2.type="text";i2.style.width="52px";
  d2.appendChild(l2);d2.appendChild(i2);d2.appendChild(s2);

  fila.appendChild(d1);fila.appendChild(d2);
  caja1112.appendChild(fila);

  // Limpiar caja112
  _clear(caja112);
  let vac=document.createElement("div");vac.style.cssText="font-size:11px;color:var(--muted);font-style:italic;padding:6px;";
  vac.textContent="El sistema aparecerá aquí al rellenar las dimensiones.";
  caja112.appendChild(vac);

  // Panel derecho: vacío
  _mostrarRef(null,null,null,null);
  let rv=document.createElement("div");rv.className="ref-vacia";rv.textContent="Introduce el sistema para comenzar.";refContenido.appendChild(rv);

  // Lógica dimensiones
  i1.focus();
  i1.addEventListener("keydown",function(ev){
    if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();
    try{
      let n=parseInt(_strip(i1.value),10);
      if(!Number.isInteger(n)||n<1||n>5)throw 0;
      nEcuaciones=n;
      caja11112.style.color="#dbeafe";
      caja11112.innerHTML="Ahora indica el número de incógnitas.";
      i2.focus();
    }catch(e){i1.value="";i1.focus();caja11112.style.color="#fecaca";caja11112.innerHTML="Entero entre 1 y 5.";}
  });
  i2.addEventListener("keydown",function(ev){
    if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();
    try{
      let n=parseInt(_strip(i2.value),10);
      if(!Number.isInteger(n)||n<1||n>5)throw 0;
      nIncognitas=n;
      caja11112.innerHTML="Rellena la matriz ampliada (coef. | término ind.).";
      _crearTablaMatriz();
    }catch(e){i2.value="";i2.focus();caja11112.style.color="#fecaca";caja11112.innerHTML="Entero entre 1 y 5.";}
  });
}

function _crearTablaMatriz(){
  _clear(caja112);
  valoresInput=[];

  // Contenedor inline para llave + tabla
  let cont=document.createElement("div");cont.className="sistema-inline";
  caja112.appendChild(cont);

  Representar.abrirLlave(1.75*nEcuaciones,cont);

  let tabla=document.createElement("table");
  tablaInput=tabla;
  for(let i=0;i<nEcuaciones;i++){
    let tr=document.createElement("tr"),fila=[];
    for(let j=0;j<nIncognitas+1;j++){
      let td=document.createElement("td");
      let inp=document.createElement("input");inp.type="text";inp.value="";
      fila.push(null);
      td.style.textAlign="left";
      if(j<nIncognitas-1){
        let sp=document.createElement("span");sp.innerHTML=` x<sub>${j+1}</sub>+`;
        td.appendChild(inp);td.appendChild(sp);
      }else if(j===nIncognitas-1){
        let sp=document.createElement("span");sp.innerHTML=` x<sub>${j+1}</sub>`;
        let eq=document.createElement("span");eq.style.cssText="display:inline-flex;align-items:center;padding:0 3px;";_rk("=",eq);
        td.appendChild(inp);td.appendChild(sp);td.appendChild(eq);
      }else{
        td.appendChild(inp);
      }
      tr.appendChild(td);
    }
    valoresInput.push(fila);tabla.appendChild(tr);
  }
  cont.appendChild(tabla);
  _rellenarTabla(tabla);
}

function _rellenarTabla(tabla){
  let inputs=Array.from(tabla.querySelectorAll("input"));
  if(!inputs.length)return;
  inputs[0].focus();
  inputs.forEach(function(inp,i){
    inp.addEventListener("keydown",function(ev){
      if(ev.key!=="Enter"&&ev.key!=="Tab")return;
      ev.preventDefault();
      let fila=inp.closest("tr").rowIndex;
      let col=inp.closest("td").cellIndex;
      try{
        let v=_strip(inp.value);
        if(!v.length)throw new Error("B");
        _parseRacional(v);
        valoresInput[fila][col]=v;
        caja11112.style.color="#dbeafe";
        caja11112.innerHTML="Rellena la matriz. Valida con ENTER o TAB.";
        let next=inputs[(i+1)%inputs.length];
        next.focus();
        if(i!==inputs.length-1)return;
        _confirmarSistema();
      }catch(e){
        let msg=e.message==="B"?"Celda vacía.":"Dato erróneo (entero, decimal o a/b).";
        inp.value="";inp.focus();
        caja11112.style.color="#fecaca";caja11112.innerHTML=msg;
      }
    });
  });
}

function _confirmarSistema(){
  matrizAmpS=valoresInput.map(r=>r.map(x=>_strip(x)));
  matrizAmpN=matrizAmpS.map(r=>r.map(_parseRacional));

  rangoA_real=Matriz.rangoMatrizNumerica(_matCoefN());
  rangoAmp_real=Matriz.rangoMatrizNumerica(matrizAmpN);
  rangoA_confirm=null;rangoAmp_confirm=null;

  if(tablaInput&&tablaInput.parentNode)tablaInput.parentNode.removeChild(tablaInput);
  tablaInput=null;

  // Mostrar sistema + A + (A|b) en una sola fila
  _clear(caja112);
  let fila=document.createElement("div");fila.className="confirmados-fila";

  function _bloque(titulo,latexStr){
    let b=document.createElement("div");b.className="mat-bloque conf-blq";
    let t=document.createElement("div");t.className="mat-bloque-titulo";t.textContent=titulo;
    let c=document.createElement("div");c.className="mat-bloque-contenido";_rk(latexStr,c);
    b.appendChild(t);b.appendChild(c);return b;
  }

  fila.appendChild(_bloque("Sistema",_sistemaLx()));
  let vs1=document.createElement("div");vs1.className="conf-vsep";fila.appendChild(vs1);
  fila.appendChild(_bloque("A",_matLx(_matCoefN())));
  let vs2=document.createElement("div");vs2.className="conf-vsep";fila.appendChild(vs2);
  fila.appendChild(_bloque("(A|b)",_matAmpLx()));

  caja112.appendChild(fila);

  caja11111.textContent="SISTEMA INTRODUCIDO";
  caja11112.style.color="#dbeafe";
  caja11112.innerHTML=`${nEcuaciones} ec. · ${nIncognitas} incóg. · Avanza por los pasos →`;

  iniciarPaso1();
}

// =====================================================================
// PASO 1 — RANGO DE A
// =====================================================================
function iniciarPaso1(){
  pasoActual=1;
  _actualizarIndicador();

  let maxOrd=Math.min(nEcuaciones,nIncognitas);
  _mostrarRef(
    "Paso 1 — Rango de A",
    _matLx(_matCoefN()),
    `Orden máximo de menores: <strong>${maxOrd}</strong>`,
    null
  );

  _crearTarjetaActiva(
    _matCoefN(), nEcuaciones, nIncognitas, maxOrd, "A", rangoA_real,
    function(rango){
      rangoA_confirm=rango;
      iniciarPaso2();
    }
  );
}

// =====================================================================
// PASO 2 — RANGO DE (A|b)
// =====================================================================
function iniciarPaso2(){
  pasoActual=2;
  _actualizarIndicador();

  let maxOrd=Math.min(nEcuaciones,nIncognitas+1);
  _mostrarRef(
    "Paso 2 — Rango de (A|b)",
    _matAmpLx(),
    `Orden máximo de menores: <strong>${maxOrd}</strong>`,
    [`\\text{rg}(A)=${rangoA_confirm}`]
  );

  _crearTarjetaActiva(
    matrizAmpN, nEcuaciones, nIncognitas+1, maxOrd, "(A|b)", rangoAmp_real,
    function(rango){
      rangoAmp_confirm=rango;
      iniciarPaso3();
    }
  );
}

// =====================================================================
// PASO 3 — DISCUSIÓN (automática)
// =====================================================================
function iniciarPaso3(){
  pasoActual=3;
  _actualizarIndicador();

  _mostrarRef(
    "Paso 3 — Discusión",
    null,
    null,
    [`\\text{rg}(A)=${rangoA_confirm}`,`\\text{rg}(A|b)=${rangoAmp_confirm}`,`n=${nIncognitas}`]
  );

  let {card,tipo}=_tarjetaDiscusion();
  historialDiv.appendChild(card);
  historialDiv.scrollTop=historialDiv.scrollHeight;

  if(tipo!=="incompatible"){
    iniciarPaso4();
  }else{
    pasoActual=4;
    _actualizarIndicador();
    caja11111.textContent="PROCESO COMPLETADO";
    caja11112.style.color="#fecaca";
    caja11112.innerHTML="Sistema incompatible — sin solución.";
  }
}

// =====================================================================
// PASO 4 — SOLUCIÓN (automática)
// =====================================================================
function iniciarPaso4(){
  pasoActual=4;
  _actualizarIndicador();

  // Renderizar solución directamente en ESPACIO DE RESULTADOS
  _clear(refContenido);
  let rangosBar=document.createElement("div");rangosBar.className="ref-rangos";
  [`\\text{rg}(A)=${rangoA_confirm}`,`\\text{rg}(A|b)=${rangoAmp_confirm}`,`n=${nIncognitas}`].forEach(function(par){
    let b=document.createElement("div");b.className="ref-rango-badge";_rk(par,b);rangosBar.appendChild(b);
  });
  refContenido.appendChild(rangosBar);

  let titSol=document.createElement("div");titSol.className="ref-titulo";titSol.textContent="Paso 4 — Solución";
  refContenido.appendChild(titSol);

  // La biblioteca necesita la matriz ya escalonada en resolverSistemaCI
  let matEch=Matriz.eliminarFilasNulas(Matriz.escalonarMatrizNumerica(matrizAmpN.map(r=>r.slice())));
  Representar.solucionesSistemaLineal(matEch,refContenido,false,[]);

  caja11111.textContent="PROCESO COMPLETADO";
  caja11112.style.color="#dbeafe";
  caja11112.innerHTML="Solución en el panel derecho →";
}

// =====================================================================
// INIT
// =====================================================================
document.addEventListener("DOMContentLoaded",function(){
  caja1111   =document.getElementById("caja1111");
  caja11111  =document.getElementById("caja11111");
  caja11112  =document.getElementById("caja11112");
  caja1112   =document.getElementById("caja1112");
  caja112    =document.getElementById("caja112");
  pasoIndicadorDer=document.getElementById("pasoIndicadorDer");
  refContenido    =document.getElementById("refContenido");
  historialDiv    =document.getElementById("historial");

  _construirIndicador();

  // Volver a explicación
  let btnVolver=document.getElementById("btnVolverExplicacion");
  if(btnVolver)btnVolver.addEventListener("click",function(ev){
    ev.preventDefault();
    let calc=document.getElementById("calculadora");
    let intro=document.getElementById("introPrincipal");
    if(calc)calc.style.display="none";
    if(intro){intro.style.display="block";document.body.style.overflow="auto";window.scrollTo(0,0);}
  });

  // Modal de ayuda
  let abreV1=document.getElementById("abreVentana1");
  let cierraV1=document.getElementById("cierraVentana1");
  let ventana1=document.getElementById("ventana1");
  let pdf1=document.getElementById("pdf1");
  let pdfURL="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
  if(abreV1&&cierraV1&&ventana1&&pdf1){
    abreV1.addEventListener("click",function(e){e.preventDefault();pdf1.src=pdfURL;ventana1.style.display="flex";});
    cierraV1.addEventListener("click",function(){ventana1.style.display="none";pdf1.src="";});
    window.addEventListener("click",function(e){if(e.target===ventana1){ventana1.style.display="none";pdf1.src="";}});
  }

  // Botón OTRO SISTEMA
  let otroSistema=document.getElementById("otroSistema");
  if(!otroSistema){otroSistema=document.createElement("button");otroSistema.id="otroSistema";otroSistema.innerHTML="OTRO SISTEMA";}
  let ctrlTop=document.getElementById("controlesTop");
  let btnHomeEl=document.getElementById("btnHome");
  if(ctrlTop){
    if(btnHomeEl&&btnHomeEl.parentNode===ctrlTop)ctrlTop.insertBefore(otroSistema,btnHomeEl);
    else ctrlTop.appendChild(otroSistema);
  }
  otroSistema.addEventListener("click",function(){sessionStorage.setItem("irACalculadora","1");window.location.reload();});

  iniciarPaso0();
});
