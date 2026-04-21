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
  let btnAutoG=document.createElement("button");btnAutoG.type="button";
  btnAutoG.id="btnAutoGlobal";btnAutoG.className="btn-auto";
  btnAutoG.textContent="Resolución automática →";
  btnAutoG.style.display="none";
  btnAutoG.addEventListener("click",function(){_autoResolverDesde(1);});
  pasoIndicadorDer.appendChild(btnAutoG);
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
  let et=document.createElement("div");et.className="hist-etiqueta";et.textContent="Paso 3 — Discusión";card.appendChild(et);

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

// =====================================================================
// CERTIFICACIÓN DE RANGO (menor no nulo + menores nulos de orden superior)
// =====================================================================
function _combs(arr,k){
  if(k===0)return[[]];if(!arr.length)return[];
  let h=arr[0],t=arr.slice(1);
  return[..._combs(t,k-1).map(function(c){return[h].concat(c);}), ..._combs(t,k)];
}

function _agregarCertificacion(parent, mat, prefijo, rango){
  let m=mat.length, nc=mat[0].length;
  let maxOrd=Math.min(m,nc);
  let filAll=Array.from({length:m},function(_,i){return i;});
  let colAll=Array.from({length:nc},function(_,j){return j;});
  let resArea=document.createElement("div");resArea.className="form-res-area";

  // Menor no nulo de orden rango (certifica el rango)
  let cert=null;
  outerCert: for(let fC of _combs(filAll,rango)){
    for(let cC of _combs(colAll,rango)){
      let minor=Matriz.menor(mat,fC,cC);
      let det=Matriz.determinanteNumerico(minor);
      if(det!==null&&Number.isFinite(det)&&!_esCeroNum(det)){cert={fC,cC,minor,det};break outerCert;}
    }
  }
  if(cert){
    let blq=document.createElement("div");blq.className="form-menor-blq form-menor-nonulo";
    let hdr=document.createElement("div");hdr.className="form-menor-hdr";
    hdr.textContent="F:{"+cert.fC.map(function(x){return x+1;}).join(",")+"}  C:{"+cert.cC.map(function(x){return x+1;}).join(",")+"}  · orden "+rango;
    blq.appendChild(hdr);
    let val=document.createElement("div");val.className="form-menor-val";
    let mRows=cert.minor.map(function(r){return r.map(_numLx).join("&");});
    _rk("\\begin{vmatrix}"+mRows.join("\\\\")+"\\end{vmatrix}="+_numLx(cert.det),val);
    blq.appendChild(val);
    let inf=document.createElement("div");inf.className="form-menor-inf";
    if(rango>=maxOrd){
      inf.innerHTML="<span class='hist-maxord'>⭐ Menor de orden máximo no nulo.</span>";
    }else{
      inf.innerHTML="<span class='hist-maxord'>⭐ Menor no nulo de orden "+rango+". Los de orden "+(rango+1)+" son todos nulos:</span>";
    }
    blq.appendChild(inf);
    resArea.appendChild(blq);
  }

  // Todos los menores nulos del orden siguiente (prueban que no existe rango mayor)
  if(rango>0&&rango<maxOrd){
    let nextOrd=rango+1;
    for(let fC of _combs(filAll,nextOrd)){
      for(let cC of _combs(colAll,nextOrd)){
        let minor=Matriz.menor(mat,fC,cC);
        let det=Matriz.determinanteNumerico(minor);
        let blq=document.createElement("div");blq.className="form-menor-blq form-menor-nulo";
        let hdr=document.createElement("div");hdr.className="form-menor-hdr";
        hdr.textContent="F:{"+fC.map(function(x){return x+1;}).join(",")+"}  C:{"+cC.map(function(x){return x+1;}).join(",")+"}  · orden "+nextOrd;
        blq.appendChild(hdr);
        let val=document.createElement("div");val.className="form-menor-val";
        let mRows=minor.map(function(r){return r.map(_numLx).join("&");});
        _rk("\\begin{vmatrix}"+mRows.join("\\\\")+"\\end{vmatrix}="+_numLx(det),val);
        blq.appendChild(val);
        resArea.appendChild(blq);
      }
    }
  }

  parent.appendChild(resArea);
  let v=document.createElement("div");v.className="hist-badge-rango";
  _rk("\\text{rg}("+prefijo+") = "+rango,v);
  parent.appendChild(v);
}

// =====================================================================
// RESOLUCIÓN AUTOMÁTICA
// =====================================================================
function _autoResolverDesde(desde){
  // Crea tarjeta estática con certificación completa del rango
  function crearCardAuto(paso,prefijo,mat,rangoReal){
    if(tarjetaActiva&&tarjetaActiva.parentNode)tarjetaActiva.parentNode.removeChild(tarjetaActiva);
    tarjetaActiva=null;
    let card=document.createElement("div");card.className="hist-entrada hist-rango-conf";
    let etq=document.createElement("div");etq.className="hist-etiqueta";
    etq.textContent="Paso "+paso+" — "+prefijo;card.appendChild(etq);
    _agregarCertificacion(card,mat,prefijo,rangoReal);
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

    let selRows=new Set(), selCols=new Set();
    let rowBtns=[], colBtns=[];

    // Fila de botones de filas
    let pickerF=document.createElement("div");pickerF.className="form-picker-row";
    let lblF=document.createElement("span");lblF.className="form-picker-label";lblF.textContent="Filas:";
    pickerF.appendChild(lblF);
    for(let i=0;i<numFilas;i++){
      let b=document.createElement("button");b.type="button";b.className="form-picker-btn";b.textContent=i+1;
      b.addEventListener("click",function(){
        if(selRows.has(i)){selRows.delete(i);b.classList.remove("sel");}
        else{selRows.add(i);b.classList.add("sel");}
        _tryCompute();
      });
      pickerF.appendChild(b);rowBtns.push(b);
    }
    zona.appendChild(pickerF);

    // Fila de botones de columnas
    let pickerC=document.createElement("div");pickerC.className="form-picker-row";
    let lblC=document.createElement("span");lblC.className="form-picker-label";lblC.textContent="Cols:";
    pickerC.appendChild(lblC);
    for(let j=0;j<numCols;j++){
      let b=document.createElement("button");b.type="button";b.className="form-picker-btn";b.textContent=j+1;
      b.addEventListener("click",function(){
        if(selCols.has(j)){selCols.delete(j);b.classList.remove("sel");}
        else{selCols.add(j);b.classList.add("sel");}
        _tryCompute();
      });
      pickerC.appendChild(b);colBtns.push(b);
    }
    zona.appendChild(pickerC);

    let hint=document.createElement("div");hint.className="form-picker-hint";zona.appendChild(hint);

    function _tryCompute(){
      let nF=selRows.size, nC=selCols.size;
      if(nF===0&&nC===0){hint.textContent="";return;}
      if(nF===0){hint.textContent="Selecciona "+nC+" fila"+(nC>1?"s":"")+" para formar el menor.";return;}
      if(nC===0){hint.textContent="Selecciona "+nF+" columna"+(nF>1?"s":"")+" para formar el menor.";return;}
      if(nF!==nC){
        let diff=Math.abs(nF-nC);
        if(nF>nC) hint.textContent="Selecciona "+diff+" columna"+(diff>1?"s más":" más")+".";
        else      hint.textContent="Selecciona "+diff+" fila"+(diff>1?"s más":" más")+".";
        return;
      }
      // Mismo número → calcular
      hint.textContent="";
      let filIdx=Array.from(selRows).sort(function(a,b){return a-b;});
      let colIdx=Array.from(selCols).sort(function(a,b){return a-b;});
      let minor=Matriz.menor(mat,filIdx,colIdx);
      let det=Matriz.determinanteNumerico(minor);
      if(det===null||!Number.isFinite(det)){hint.textContent="No se pudo calcular el determinante.";return;}
      _addResultado(filIdx,colIdx,minor,det);
      // Limpiar selección
      selRows.clear();selCols.clear();
      rowBtns.forEach(function(b){b.classList.remove("sel");});
      colBtns.forEach(function(b){b.classList.remove("sel");});
    }
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
          if(tog.parentNode)tog.parentNode.removeChild(tog);
          if(zona.parentNode)zona.parentNode.removeChild(zona);
          card.className="hist-entrada hist-rango-conf";
          _agregarCertificacion(card,mat,prefijo,rDecl);
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
  let btnAG=document.getElementById("btnAutoGlobal");if(btnAG)btnAG.style.display="";

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
// PASO 4 — SOLUCIÓN POR CRAMER
// =====================================================================

function _addValorLine(parent, latexStr){
  let d=document.createElement("div");d.className="hist-valor";_rk(latexStr,d);parent.appendChild(d);
}

function _buildLinearExprTex(constant, paramCoeffs, pNames){
  let parts=[];
  if(!_esCeroNum(constant))parts.push({num:constant,name:null});
  paramCoeffs.forEach(function(c,i){if(!_esCeroNum(c))parts.push({num:c,name:pNames[i]});});
  if(!parts.length)return"0";
  let result="";
  parts.forEach(function(p,idx){
    let isFirst=idx===0;
    if(p.name===null){
      let s=_numLx(p.num);if(!isFirst&&p.num>0)s="+"+s;result+=s;
    }else{
      let abs=Math.abs(p.num),sign=p.num<0?"-":(isFirst?"":"+");
      let isOne=Math.abs(abs-1)<1e-9;
      let coefTex=isOne?"":_numLx(abs);
      result+=sign+coefTex+p.name;
    }
  });
  return result;
}

function _cramerCD(card, panel){
  let matCoef=_matCoefN();
  let b=matrizAmpN.map(function(r){return r[nIncognitas];});
  let n=nIncognitas;
  let detA=Matriz.determinanteNumerico(matCoef);

  let mRows=matCoef.map(function(r){return r.map(_numLx).join("&");});
  _addValorLine(card,"\\det(A)=\\begin{vmatrix}"+mRows.join("\\\\")+"\\end{vmatrix}="+_numLx(detA));

  let results=[];
  for(let i=0;i<n;i++){
    let Ai=matCoef.map(function(row,ri){let nr=row.slice();nr[i]=b[ri];return nr;});
    let detAi=Matriz.determinanteNumerico(Ai);
    let xi=detAi/detA;
    results.push(xi);
    let aiRows=Ai.map(function(r){return r.map(_numLx).join("&");});
    _addValorLine(card,
      "\\det(A_{"+(i+1)+"})=\\begin{vmatrix}"+aiRows.join("\\\\")+"\\end{vmatrix}="+_numLx(detAi)
      +"\\qquad x_{"+(i+1)+"}=\\dfrac{"+_numLx(detAi)+"}{"+_numLx(detA)+"}="+_numLx(xi)
    );
  }

  let solTex=results.map(function(v,i){return"x_{"+(i+1)+"}="+_numLx(v);}).join(",\\quad ");
  let tex="\\left["+solTex+"\\right]";
  let b1=document.createElement("div");b1.className="hist-badge-rango";_rk(tex,b1);card.appendChild(b1);
  let b2=document.createElement("div");b2.className="hist-badge-rango";_rk(tex,b2);panel.appendChild(b2);
}

function _echelonNumerica(mat){
  // Gaussian elimination returning numeric rows and pivot column indices
  let m=mat.length, nc=mat[0].length;
  let aux=mat.map(function(r){return r.slice();});
  let pivotCols=[], pivotRow=0;
  for(let col=0;col<nc&&pivotRow<m;col++){
    let found=-1;
    for(let row=pivotRow;row<m;row++){if(Math.abs(aux[row][col])>1e-9){found=row;break;}}
    if(found===-1)continue;
    let tmp=aux[pivotRow];aux[pivotRow]=aux[found];aux[found]=tmp;
    let piv=aux[pivotRow][col];
    for(let row=pivotRow+1;row<m;row++){
      if(Math.abs(aux[row][col])>1e-9){
        let f=aux[row][col]/piv;
        for(let c=col;c<nc;c++)aux[row][c]-=f*aux[pivotRow][c];
      }
    }
    pivotCols.push(col);pivotRow++;
  }
  return{rows:aux,pivotCols:pivotCols};
}

function _cramerCI(card, panel){
  let n=nIncognitas, r=rangoA_confirm;

  // Buscar el menor certificador en la matriz de coeficientes ORIGINAL (igual que _agregarCertificacion)
  let matCoef=_matCoefN();
  let m=matCoef.length;
  let filAll=Array.from({length:m},function(_,i){return i;});
  let colAll=Array.from({length:n},function(_,j){return j;});

  let cert=null;
  outerCI: for(let fC of _combs(filAll,r)){
    for(let cC of _combs(colAll,r)){
      let minor=Matriz.menor(matCoef,fC,cC);
      let det=Matriz.determinanteNumerico(minor);
      if(det!==null&&Number.isFinite(det)&&!_esCeroNum(det)){cert={fC:fC,cC:cC,minor:minor,det:det};break outerCI;}
    }
  }

  let pivotCols=cert.cC;
  let freeCols=[];
  for(let j=0;j<n;j++){if(!pivotCols.includes(j))freeCols.push(j);}

  let numP=freeCols.length;
  let pNames=numP===1?["t"]:freeCols.map(function(_,i){return"t_{"+(i+1)+"}";});

  // Asignación de variables libres
  let paramTex=freeCols.map(function(c,i){return"x_{"+(c+1)+"}="+pNames[i];}).join(",\\quad ");
  let paramRange=pNames.map(function(p){return p+"\\in\\mathbb{R}";}).join(",\\;");
  _addValorLine(card,paramTex+"\\quad("+paramRange+")");

  // Asub ES el menor certificador (valores de la matriz original)
  let Asub=cert.minor;
  let detAsub=cert.det;
  let subRows=Asub.map(function(row){return row.map(_numLx).join("&");});
  _addValorLine(card,"\\det(A_s)=\\begin{vmatrix}"+subRows.join("\\\\")+"\\end{vmatrix}="+_numLx(detAsub));

  // b original en las filas del menor certificador
  let bOrig=cert.fC.map(function(row){return matrizAmpN[row][n];});

  // Para cada variable pivote: Cramer con b original y contribuciones de variables libres
  let solutions=pivotCols.map(function(varIdx,k){
    let AsubK=Asub.map(function(row,ri){let nr=row.slice();nr[k]=bOrig[ri];return nr;});
    let detConst=Matriz.determinanteNumerico(AsubK);
    let paramCoeffs=freeCols.map(function(fc){
      // Contribución de xfc: -A[pivRow][fc] en la columna k (por linealidad)
      let bParam=cert.fC.map(function(row){return-matrizAmpN[row][fc];});
      let AsubKp=Asub.map(function(row,ri){let nr=row.slice();nr[k]=bParam[ri];return nr;});
      return Matriz.determinanteNumerico(AsubKp);
    });
    return{varIdx:varIdx,constant:detConst,paramCoeffs:paramCoeffs};
  });

  // Columna denominador (Asub)
  let denMatRows=Asub.map(function(row){return row.map(_numLx).join("&");});
  let denTex="\\begin{vmatrix}"+denMatRows.join("\\\\")+"\\end{vmatrix}";

  solutions.forEach(function(sol,k){
    let idx=sol.varIdx+1;

    // Columna simbólica: bOrig[i] - sum(A[pivRow][fc]*pName)
    let symCol=bOrig.map(function(b,ri){
      let coeffs=freeCols.map(function(fc){return-matrizAmpN[cert.fC[ri]][fc];});
      return _buildLinearExprTex(b,coeffs,pNames);
    });

    // Matriz numerador: Asub con columna k reemplazada por symCol
    let numMatRows=Asub.map(function(row,ri){
      return row.map(function(v,ci){return ci===k?symCol[ri]:_numLx(v);}).join("&");
    });
    let numMatTex="\\begin{vmatrix}"+numMatRows.join("\\\\")+"\\end{vmatrix}";

    // Numerador y resultado simbólico
    let numValTex=_buildLinearExprTex(sol.constant,sol.paramCoeffs,pNames);
    let xiConst=sol.constant/detAsub;
    let xiPCoeffs=sol.paramCoeffs.map(function(c){return c/detAsub;});
    let simplTex=_buildLinearExprTex(xiConst,xiPCoeffs,pNames);

    _addValorLine(card,
      "x_{"+idx+"}=\\dfrac{"+numMatTex+"}{"+denTex+"}"
      +"=\\dfrac{"+numValTex+"}{"+_numLx(detAsub)+"}"
      +"="+simplTex
    );
  });

  // Solución paramétrica completa
  let allVars=[];
  for(let j=0;j<n;j++){
    let pivIdx=pivotCols.indexOf(j);
    if(pivIdx>=0){
      let sol=solutions[pivIdx];
      let xiConst=sol.constant/detAsub;
      let xiPCoeffs=sol.paramCoeffs.map(function(c){return c/detAsub;});
      allVars.push("x_{"+(j+1)+"}="+_buildLinearExprTex(xiConst,xiPCoeffs,pNames));
    }else{
      let fi=freeCols.indexOf(j);
      allVars.push("x_{"+(j+1)+"}="+pNames[fi]);
    }
  }
  let solSys="\\left\\{\\begin{aligned}"+allVars.map(function(s){return"&"+s;}).join("\\\\")+"\\end{aligned}\\right.\\quad("+paramRange+")";
  let b1=document.createElement("div");b1.className="hist-badge-rango";_rk(solSys,b1);card.appendChild(b1);
  let b2=document.createElement("div");b2.className="hist-badge-rango";_rk(solSys,b2);panel.appendChild(b2);
}

function iniciarPaso4(){
  pasoActual=4;
  _actualizarIndicador();

  _clear(refContenido);
  let rangosBar=document.createElement("div");rangosBar.className="ref-rangos";
  [`\\text{rg}(A)=${rangoA_confirm}`,`\\text{rg}(A|b)=${rangoAmp_confirm}`,`n=${nIncognitas}`].forEach(function(par){
    let b=document.createElement("div");b.className="ref-rango-badge";_rk(par,b);rangosBar.appendChild(b);
  });
  refContenido.appendChild(rangosBar);

  // Discusión Rouché-Frobenius
  let rA=rangoA_confirm, rAb=rangoAmp_confirm, n=nIncognitas;
  let discDiv=document.createElement("div");discDiv.className="hist-disc-conclu "+(rA!==rAb?"hist-tipo-incompatible":rA===n?"hist-tipo-cd":"hist-tipo-ci");
  let discTex,lib=n-rA;
  if(rA!==rAb) discTex="\\text{rg}(A)\\neq\\text{rg}(A|b)\\Rightarrow\\textbf{Incompatible}";
  else if(rA===n) discTex="\\text{rg}(A)=\\text{rg}(A|b)=n\\Rightarrow\\textbf{Compatible Det.}";
  else discTex="\\text{rg}(A)=\\text{rg}(A|b)<n\\Rightarrow\\textbf{Comp. Indet.}\\;("+lib+"\\text{ par.})";
  _rk(discTex,discDiv);
  refContenido.appendChild(discDiv);

  let titSol=document.createElement("div");titSol.className="ref-titulo";titSol.textContent="Paso 4 — Solución (Cramer)";
  refContenido.appendChild(titSol);

  let card=document.createElement("div");card.className="hist-entrada hist-solucion";
  let et=document.createElement("div");et.className="hist-etiqueta";et.textContent="Paso 4 — Regla de Cramer";card.appendChild(et);

  let tipo=(rangoA_confirm===nIncognitas)?"cd":"ci";
  if(tipo==="cd"){_cramerCD(card,refContenido);}else{_cramerCI(card,refContenido);}

  historialDiv.appendChild(card);
  historialDiv.scrollTop=historialDiv.scrollHeight;

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
  otroSistema.addEventListener("click",function(){
    nEcuaciones=0;nIncognitas=0;
    matrizAmpS=[];matrizAmpN=[];
    rangoA_real=0;rangoAmp_real=0;
    rangoA_confirm=null;rangoAmp_confirm=null;
    pasoActual=0;tablaInput=null;valoresInput=[];tarjetaActiva=null;
    _clear(historialDiv);
    _construirIndicador();
    let btnAG=document.getElementById("btnAutoGlobal");if(btnAG)btnAG.style.display="none";
    iniciarPaso0();
  });

  iniciarPaso0();
});
