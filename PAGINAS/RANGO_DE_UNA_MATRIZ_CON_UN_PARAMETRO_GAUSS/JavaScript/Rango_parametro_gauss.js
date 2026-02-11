let numeroFilas=0,numeroColumnas=0,nombreParametro="",valores=[],matrizOriginal=[],matrizAntigua=[],matrizActualExpresiones=[],valoresExcluidos=[],valoresExcluidosNumerico=[],pivotesUsados=[],casos=["G"],casosAutomatico=[],casosNumerico=[],casosAutomaticoNumerico=[],_enSol=false;
function _$(id){return document.getElementById(id);}function _strip(s){return (s||"").toString().replace(/\s+/g,"");}
function _clone2(m){return m.map(r=>r.slice());}function _simpl(s){try{if(ExpresionAlgebraica&&typeof ExpresionAlgebraica.simplificar==="function")return ExpresionAlgebraica.simplificar(s);}catch(e){}return (s==null?"":s.toString());}
function _esCeroExpr(x){
  if(x===0||x==="0")return true;let s=(x==null?"":x.toString()).trim();if(!s.length)return false;if(s==="0"||s==="(0)")return true;
  let t=_simpl(s).trim();if(t==="0"||t==="(0)")return true;
  /* Tolerancia numérica: algunos casos generan restos tipo 2.4e-14 (debería ser 0) */
  try{
    let u=_strip(t).replace(/−/g,"-");
    while(u.length&&u[0]==="("&&u[u.length-1]===")"){u=u.slice(1,-1);u=_strip(u).replace(/−/g,"-");}
    if(!/[a-zA-Z]/.test(u)){
      let val=null;
      /* Caso: número normal / decimal / notación científica */
      if(/^[-+]?((\d+\.?\d*)|(\.\d+))(e[-+]?\d+)?$/i.test(u))val=parseFloat(u);
      else{
        /* Caso: fracción simple (posible sci en num/den) */
        let m=u.match(/^([-+]?((\d+\.?\d*)|(\.\d+))(e[-+]?\d+)?)\/([-+]?((\d+\.?\d*)|(\.\d+))(e[-+]?\d+)?)$/i);
        if(m){let a=parseFloat(m[1]),b=parseFloat(m[6]);if(Number.isFinite(a)&&Number.isFinite(b)&&b!==0)val=a/b;}
        /* Caso: BASE e EXP (sin '*'), donde BASE puede ser fracción, con o sin paréntesis.
           Ejemplos reales: 248/17e-14, (248/17)e-14, -248/17e-14 */
        if(val==null){
          let i=u.toLowerCase().lastIndexOf('e');
          if(i>0){
            let base=u.slice(0,i),exp=u.slice(i+1);
            if(/^[-+]?\d+$/.test(exp)){
              while(base.length&&base[0]==="("&&base[base.length-1]===")")base=base.slice(1,-1);
              let bval=null;
              if(base.includes('/')){
                let p=base.split('/');if(p.length===2){let a=parseFloat(p[0]),b=parseFloat(p[1]);if(Number.isFinite(a)&&Number.isFinite(b)&&b!==0)bval=a/b;}
              }else if(/^[-+]?((\d+\.?\d*)|(\.\d+))$/.test(base))bval=parseFloat(base);
              if(bval!=null&&Number.isFinite(bval))val=bval*Math.pow(10,parseInt(exp,10));
            }
          }
        }
      }
      /* Último recurso: evaluación numérica segura (solo dígitos y operadores) para casos raros.
         Ejemplos que aparecen en KaTeX: (2489341/1751718)e-14, 2489341/1751718*10^-14, etc. */
      if(val==null){
        try{
          let z=u;
          if(/^[0-9eE\+\-\.\*\/\(\)\^]+$/.test(z)){
            if(z.includes('^')&&!z.includes('**'))z=z.replace(/\^/g,"**");
            let f=Function("'use strict';return ("+z+")");
            let w=f();
            if(typeof w==='number'&&Number.isFinite(w))val=w;
          }
        }catch(e){}
      }
      if(val!=null&&Number.isFinite(val)&&Math.abs(val)<1e-10)return true;
    }
  }catch(e){}
  return false;
}

function _ceroizarMatriz(M){if(!Array.isArray(M))return M;return M.map(r=>Array.isArray(r)?r.map(x=>_esCeroExpr(x)?"0":x):r);}
function _primerNoNuloFila(f){if(!Array.isArray(f)||!f.length)return null;for(let j=0;j<f.length;j++)if(!_esCeroExpr(f[j]))return f[j];return null;}
function _denomsTop(expr){expr=_strip(expr);if(!expr.length)return [];let dens=[],d=0;for(let i=0;i<expr.length;i++){let c=expr[i];if(c==="(")d++;else if(c===")"){d--;if(d<0)throw new Error("p");}if(c==="/"&&d===0){let rest=expr.slice(i+1);if(rest.length)dens.push(rest);break;}}return dens;}
function _registrarPivoteFila(idx){try{if(!matrizActualExpresiones||!matrizActualExpresiones[idx])return;let p=_primerNoNuloFila(matrizActualExpresiones[idx]);if(p==null)return;let s=p.toString();if(!pivotesUsados.includes(s))pivotesUsados.push(s);}catch(e){}}
function _registrarDenomsCoef(coef){try{for(let d of _denomsTop(coef))if(d&&!pivotesUsados.includes(d))pivotesUsados.push(d);}catch(e){}}
function _algunPivoteUsadoSeAnula(v){if(!Array.isArray(pivotesUsados)||!pivotesUsados.length)return false;try{for(let k=0;k<pivotesUsados.length;k++){let e=pivotesUsados[k],aux=[[e]],s=Matriz.sustituir(aux,nombreParametro,v)[0][0];if(_esCeroExpr(s))return true;}}catch(err){return true;}return false;}
function _uncheck(){let r=document.querySelector('input[name="option"]:checked');if(r)r.checked=false;}
function _cmp(a,b){return (Matriz&&typeof Matriz.compararMatrices==="function")?Matriz.compararMatrices(a,b):false;}
function _msgOkBox(id,s){let el=_$(id);if(!el)return;el.style.color="black";el.innerHTML=s||"";}
function _msgErrBox(id,s){let el=_$(id);if(!el)return;el.style.color="red";el.innerHTML=s||"";}
function _splitTopSums(expr){expr=_strip(expr);if(!expr.length)return [];let out=[],buf="",d=0;for(let i=0;i<expr.length;i++){let c=expr[i];if(c==="(")d++;else if(c===")"){d--;if(d<0)throw new Error("p");}if((c==="+"||c==="-")&&d===0){if(buf.length)out.push(buf);buf=c;continue;}buf+=c;}if(d!==0)throw new Error("p");if(buf.length)out.push(buf);return out;}
function _parseCombLineal(expr,n){expr=_strip(expr);let m=expr.match(/^F(\d+)\=(.+)$/i);if(!m)throw new Error("f");let target=parseInt(m[1],10)-1;if(!(target>=0&&target<n))throw new Error("lhs");let rhs=m[2];if(rhs[0]!=="+"&&rhs[0]!=="-")rhs="+"+rhs;let parts=_splitTopSums(rhs),terms=[];for(let p of parts){let s=p[0],b=p.slice(1);let mm=b.match(/^(.+)?F(\d+)$/i);if(!mm)throw new Error("t");let coef=(mm[1]||"1");if(coef==="")coef="1";let idx=parseInt(mm[2],10)-1;if(!(idx>=0&&idx<n))throw new Error("fila");coef=_simpl(ExpresionAlgebraica.simplificar((s==="-"?"-1":"1")+"*("+coef+")"));terms.push({coef,idx});}let coefTarget="0";for(let t of terms)if(t.idx===target)coefTarget=_simpl(Polinomio.sumar(coefTarget,t.coef));if(_esCeroExpr(coefTarget))throw new Error("self0");return {target,terms,expr};}
function _aplicarCombMultiple(M,expr){let n=M.length,m=M[0].length,o=_parseCombLineal(expr,n),snap=_clone2(M),nueva=Array(m).fill("0");for(let t of o.terms){_registrarPivoteFila(t.idx);_registrarDenomsCoef(t.coef);for(let j=0;j<m;j++){let p=Polinomio.multiplicar("("+t.coef+")","("+snap[t.idx][j]+")");nueva[j]=_simpl(Polinomio.sumar(nueva[j],p));}}M[o.target]=nueva;return o;}
function _parseValorSimple(raw){raw=(raw||"").toString().trim();if(!raw.length)throw new Error("v");if(raw.includes("/"))raw=ExpresionAlgebraica.pasarADecimal(raw);if(raw.includes(","))raw=raw.replace(",",".");let n=parseFloat(raw);if(Number.isNaN(n))throw new Error("v");return n;}
function _insertarBotonOtraMatriz(){try{let ayuda=_$("abreVentana1"),volver=_$("btnHome");if(!ayuda)return;let btn=_$("otraMatriz");if(btn)btn.remove();btn=document.createElement("button");btn.id="otraMatriz";btn.innerHTML="Otra matriz";btn.addEventListener("click",function(e){e.preventDefault();window.location.reload();});let parent=ayuda.parentNode;if(parent){if(volver&&volver.parentNode===parent)parent.insertBefore(btn,volver);else parent.insertBefore(btn,ayuda.nextSibling);}}catch(e){}}
function _setupAyuda(){const abre=_$("abreVentana1"),cierra=_$("cierraVentana1"),vent=_$("ventana1"),pdf=_$("pdf1");const url="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";if(abre)abre.addEventListener("click",function(ev){ev.preventDefault();pdf.src=url;vent.style.display="flex";});if(cierra)cierra.addEventListener("click",function(){vent.style.display="none";pdf.src="";});window.addEventListener("click",function(ev){if(ev.target===vent){vent.style.display="none";pdf.src="";}});}
function _appendMatrizTrabajo(M){let caja2=_$("caja2");if(!caja2)return;caja2.style.display="flex";Representar.matriz(M,caja2);}
function _validarExpresionEntrada(expr){
  expr=(expr||"").toString().trim();if(!expr.length)return [false,"No has introducido nada."];
  let s=_strip(expr);if(/[\+\-\*\/\^]$/.test(s))return [false,"La expresión no puede terminar en operador."];
  try{if(typeof Validar==="object"&&Validar&&typeof Validar.expresionAlgebraica==="function"){let r=Validar.expresionAlgebraica(expr);
    if(Array.isArray(r)&&r[0]===true)return [true,""];let err=(Array.isArray(r)?r[1]:r);if(err==null)err="";
    if(typeof err!=="string"){try{err=JSON.stringify(err);}catch(e){err=String(err);}}return [false,err||"Expresión no válida."];}}
  catch(e){return [false,"Expresión no válida."];}
  return [true,""];
}

let _moCaja3=null;
function _scrollCaja3Bottom(){let c=_$("contenedorCaja3");if(!c||c.style.display==="none")return;c.scrollTop=c.scrollHeight;}
function _activarAutoScrollCaja3(){let c=_$("contenedorCaja3");if(!c||c._autoBottom)return;c._autoBottom=true;let tick=()=>requestAnimationFrame(()=>requestAnimationFrame(_scrollCaja3Bottom));
  try{_moCaja3=new MutationObserver(tick);_moCaja3.observe(c,{childList:true,subtree:true,characterData:true});}catch(e){}
  window.addEventListener("resize",tick);window.addEventListener("orientationchange",tick);document.addEventListener("visibilitychange",tick);
  tick();
}


function _init(){
  _insertarBotonOtraMatriz();_setupAyuda();let caja1=_$("caja1"),caja2=_$("caja2"),caja3=_$("contenedorCaja3");
  _activarAutoScrollCaja3();
  caja1.className="";if(caja2){caja2.style.display="none";caja2.innerHTML="";}if(caja3){caja3.style.display="none";caja3.classList.remove("casosWrap");caja3.innerHTML="";}
  caja1.innerHTML="";let caja11=document.createElement("div");caja11.id="caja11";caja1.appendChild(caja11);
  let caja111=document.createElement("div");caja111.id="caja111";caja11.appendChild(caja111);
  let caja1111=document.createElement("div");caja1111.id="caja1111";caja111.appendChild(caja1111);
  let caja1112=document.createElement("div");caja1112.id="caja1112";caja111.appendChild(caja1112);
  caja1111.innerHTML="INTRODUCCIÓN DE DATOS";caja1112.innerHTML="Valida todos los datos introducidos con la tecla ENTER o TAB del teclado";
  let caja112=document.createElement("div");caja112.id="caja112";caja11.appendChild(caja112);
  let caja1121=document.createElement("div"),caja1122=document.createElement("div"),caja1123=document.createElement("div");
  caja112.appendChild(caja1121);caja112.appendChild(caja1122);caja112.appendChild(caja1123);
  let caja12=document.createElement("div");caja12.id="caja12";caja1.appendChild(caja12);

  let t1=document.createElement("p");t1.innerHTML="Nº de filas<br>(Entre 1 y 6)";
  let t2=document.createElement("p");t2.innerHTML="Nº de columnas<br>(Entre 1 y 8)";
  let t3=document.createElement("p");t3.innerHTML="Nombre del parámetro<br>(Letra minúscula)";

  function crearNumeroFilas(){
    let inp=document.createElement("input");inp.type="text";caja1121.appendChild(t1);caja1121.appendChild(inp);inp.focus();
    inp.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{_msgOkBox("caja1112","Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");numeroFilas=Number(inp.value);if(!Number.isInteger(numeroFilas)||numeroFilas<1||numeroFilas>6)throw 0;crearNumeroColumnas();}catch(e){inp.value="";_msgErrBox("caja1112","El nº de filas no es válido.<br>Debe ser un entero entre 1 y 6.");inp.focus();}});
  }
  function crearNumeroColumnas(){
    let inp=document.createElement("input");inp.type="text";caja1122.appendChild(t2);caja1122.appendChild(inp);inp.focus();
    inp.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{_msgOkBox("caja1112","Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");numeroColumnas=Number(inp.value);if(!Number.isInteger(numeroColumnas)||numeroColumnas<1||numeroColumnas>8)throw 0;crearNombreParametro();}catch(e){inp.value="";_msgErrBox("caja1112","El nº de columnas no es válido.<br>Debe ser un entero entre 1 y 8.");inp.focus();}});
  }
  function crearNombreParametro(){
    let inp=document.createElement("input");inp.type="text";caja1123.appendChild(t3);caja1123.appendChild(inp);inp.focus();
    inp.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{_msgOkBox("caja1112","Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");nombreParametro=inp.value;if(isNaN(nombreParametro)===false||nombreParametro.toLowerCase()!==nombreParametro||nombreParametro.length!==1)throw 0;crearMatrizVacia();}catch(e){inp.value="";_msgErrBox("caja1112","El parámetro debe ser una letra minúscula.");inp.focus();}});
  }
  function crearMatrizVacia(){
    caja12.innerHTML="";valores=[];let cont=document.createElement("div");cont.className="rowFlex";caja12.appendChild(cont);
    Representar.abrirParentesis(numeroFilas+1,cont);let tabla=document.createElement("table");
    for(let i=0;i<numeroFilas;i++){let fila=document.createElement("tr"),filaM=[];for(let j=0;j<numeroColumnas;j++){let input=document.createElement("input");input.type="text";input.value="";filaM.push(null);let celda=document.createElement("td");celda.appendChild(input);fila.appendChild(celda);}valores.push(filaM);tabla.appendChild(fila);}
    cont.appendChild(tabla);Representar.cerrarParentesis(numeroFilas+1,cont);rellenarMatriz(tabla);
  }
  function rellenarMatriz(tabla){
    let inputs=tabla.getElementsByTagName("input");inputs[0].focus();
    for(let i=0;i<inputs.length;i++)inputs[i].addEventListener("keydown",function(ev){
      if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();_msgOkBox("caja1112","");let fila=this.parentNode.parentNode.rowIndex,col=this.parentNode.cellIndex;
      try{
        let v=this.value||"";if(!v.length)throw new Error("B");
        let texto="^[0-9\\.,\\+\\-\\(\\)\\^\\*\\/"+nombreParametro+"]*$",rx=new RegExp(texto);if(!rx.test(v))throw new Error("C");
        let ap=(v.match(/\(/g)||[]).length,cp=(v.match(/\)/g)||[]).length;if(ap-cp!==0)throw new Error("A");
        let vr=_validarExpresionEntrada(v);if(!vr[0])throw new Error("V:"+vr[1]);
        valores[fila][col]=v;let next=(i+1)%inputs.length;inputs[next].focus();if(ev.key==="Tab")ev.preventDefault();if(i===inputs.length-1)_finEntrada();
      }catch(e){
        this.value="";this.focus();let m=(e&&e.message)?e.message:"";
        if(m==="C")_msgErrBox("caja1112","Dato erróneo. Revisa caracteres permitidos.");
        else if(m==="B")_msgErrBox("caja1112","No has introducido nada.");
        else if(m==="A")_msgErrBox("caja1112","Los paréntesis no están balanceados.");
        else if(m.startsWith("V:")){let det=m.slice(2).trim();_msgErrBox("caja1112",(det?("Expresión no válida: "+det):"Expresión no válida."));}
        else _msgErrBox("caja1112","Expresión no válida.");
      }
    });
  }
  function _finEntrada(){
    matrizOriginal=_clone2(valores);matrizAntigua=_clone2(valores);matrizActualExpresiones=_clone2(valores);
    pivotesUsados=[];valoresExcluidos=[];valoresExcluidosNumerico=[];
    try{matrizActualExpresiones=Matriz.simplificarFilasNumericas(matrizActualExpresiones);}catch(e){}
    try{let qd=Matriz.quitarDenominadores(matrizActualExpresiones),aux1=qd[1]||[],aux2=qd[2]||[];matrizActualExpresiones=qd[0];
      try{matrizActualExpresiones=Matriz.simplificarFilasNumericas(matrizActualExpresiones);}catch(e){}valoresExcluidos=[...valoresExcluidos,...aux1];
      valoresExcluidosNumerico=[...valoresExcluidosNumerico,...aux2];}catch(e){}
    if(Matriz.esMatrizEscalonada(matrizActualExpresiones))solucionEscalonada(true);else continuar();
  }
  crearNumeroFilas();
}

function continuar(){
  if(_enSol)return;let caja1=_$("caja1"),caja2=_$("caja2"),caja3=_$("contenedorCaja3");
  caja3.style.display="none";caja3.classList.remove("casosWrap");caja3.innerHTML="";caja2.style.display="flex";caja2.innerHTML="";
  caja1.className="layoutContinuar";caja1.innerHTML="";

  let boxA=document.createElement("div"),boxB=document.createElement("div"),right=document.createElement("div");
  boxA.className="panelAuto panelBox";boxB.className="panelAuto panelBox";right.className="formAuto panelBox";
  caja1.appendChild(boxA);caja1.appendChild(boxB);caja1.appendChild(right);

  let hA=document.createElement("div"),mA=document.createElement("div");hA.className="panelTitle";hA.innerHTML="LA MATRIZ INTRODUCIDA ES";
  boxA.appendChild(hA);boxA.appendChild(mA);Representar.matriz(matrizAntigua,mA);
  let hB=document.createElement("div"),mB=document.createElement("div");hB.className="panelTitle";hB.innerHTML="LA MATRIZ SIMPLIFICADA ES";
  boxB.appendChild(hB);boxB.appendChild(mB);Representar.matriz(matrizActualExpresiones,mB);

  let titulo=document.createElement("h3");titulo.className="sectionTitle";titulo.innerHTML="OPCIONES PARA MODIFICAR LA MATRIZ";right.appendChild(titulo);
  let form=document.createElement("div");right.appendChild(form);

  let caja127=document.createElement("div"),caja128=document.createElement("div"),caja129=document.createElement("div");
  caja127.className="mt8";caja128.className="mt8 minH18";caja129.className="btnRow";right.appendChild(caja127);
  right.appendChild(caja128);right.appendChild(caja129);

  function _msgOk(s){caja128.style.color="black";caja128.innerHTML=s||"";}function _msgErr(s){caja128.style.color="red";caja128.innerHTML=s||"";}
  function _clearUI(){caja127.innerHTML="";caja128.innerHTML="";_uncheck();}
  function _after(){_appendMatrizTrabajo(matrizActualExpresiones);if(!_enSol&&Matriz.esMatrizEscalonada(matrizActualExpresiones))solucionEscalonada(false);}
  function _radioRow(val,txt,sub){
    let row=document.createElement("div");row.className="optionRow";let r=document.createElement("input");r.type="radio";r.name="option";r.value=val;
    let lab=document.createElement("label");lab.innerHTML=txt;row.appendChild(r);row.appendChild(lab);
    if(sub){let lab2=document.createElement("label");lab2.className="muted";lab2.innerHTML=sub;row.appendChild(lab2);}form.appendChild(row);
  }
  _radioRow("op1","Opción 1: Permutar el orden de dos filas","(Fᵢ ↔ Fⱼ)");
  _radioRow("op2","Opción 2: Permutar el orden de dos columnas","(Cᵢ ↔ Cⱼ)");
  _radioRow("op3","Opción 3: Reordenar filas bajando las que más ceros tengan a su izquierda","(F↓)");
  _radioRow("op4","Opción 4: Cambiar una fila por combinación lineal","(ej: F3=2F3-(a-1)F2)");
  _radioRow("op5","Opción 5: Eliminar las filas nulas","(F_nulas)");

  let btnSel=document.createElement("button");btnSel.innerHTML="Seleccionar";caja129.appendChild(btnSel);
  let btnReset=document.createElement("button");btnReset.innerHTML="RESET";caja129.appendChild(btnReset);
  btnReset.addEventListener("click",function(){_clearUI();});

  btnSel.addEventListener("click",function(){
    let r=document.querySelector('input[name="option"]:checked'),op=(r&&r.value)?r.value:null;_msgOk("");caja127.innerHTML="";
    switch(op){
      case "op1":{
        let matrizAux=_clone2(matrizActualExpresiones),d1=document.createElement("div"),d2=document.createElement("div");
        d1.className="rowFlex rowGap6";d2.className="rowFlex rowGap6";
        let l1=document.createElement("label"),l2=document.createElement("label"),i1=document.createElement("input"),i2=document.createElement("input");
        i1.className="w40";i2.className="w40";d1.appendChild(l1);d1.appendChild(i1);d2.appendChild(l2);d2.appendChild(i2);
        caja127.appendChild(d1);caja127.appendChild(d2);l1.innerHTML="i=";l2.innerHTML="j=";i1.focus();let n=matrizActualExpresiones.length,f1=null;
        i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{_msgOk("");f1=Number(i1.value);if(!Number.isInteger(f1)||f1<1||f1>n)throw 0;i2.focus();}
          catch(e){i1.value="";i1.focus();_msgErr("i no válido (1.."+n+").");}});
        i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{_msgOk("");let f2=Number(i2.value);if(!Number.isInteger(f2)||f2<1||f2>n||f2===f1)throw 0;
          matrizActualExpresiones=Matriz.permutarFilas(matrizActualExpresiones,f1-1,f2-1);
          if(!_cmp(matrizActualExpresiones,matrizAux))Representar.simboloPermutarFilas(f1,f2,n,caja2);_after();_clearUI();}
          catch(e){i2.value="";i2.focus();_msgErr("j no válido (1.."+n+") y distinto de i.");}});
      }break;

      case "op2":{
        let matrizAux=_clone2(matrizActualExpresiones),d1=document.createElement("div"),d2=document.createElement("div");
        d1.className="rowFlex rowGap6";d2.className="rowFlex rowGap6";
        let l1=document.createElement("label"),l2=document.createElement("label"),i1=document.createElement("input"),i2=document.createElement("input");
        i1.className="w40";i2.className="w40";d1.appendChild(l1);d1.appendChild(i1);d2.appendChild(l2);d2.appendChild(i2);
        caja127.appendChild(d1);caja127.appendChild(d2);l1.innerHTML="i=";l2.innerHTML="j=";i1.focus();let m=matrizActualExpresiones[0].length,c1=null;
        i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{_msgOk("");c1=Number(i1.value);if(!Number.isInteger(c1)||c1<1||c1>m)throw 0;i2.focus();}
          catch(e){i1.value="";i1.focus();_msgErr("i no válido (1.."+m+").");}});
        i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{_msgOk("");let c2=Number(i2.value);if(!Number.isInteger(c2)||c2<1||c2>m||c2===c1)throw 0;
          matrizActualExpresiones=Matriz.permutarColumnas(matrizActualExpresiones,c1-1,c2-1);
          if(!_cmp(matrizActualExpresiones,matrizAux))Representar.simboloPermutarColumnas(c1,c2,matrizActualExpresiones.length,caja2);_after();_clearUI();}
          catch(e){i2.value="";i2.focus();_msgErr("j no válido (1.."+m+") y distinto de i.");}});
      }break;

      case "op3":{
        let matrizAux=_clone2(matrizActualExpresiones);matrizActualExpresiones=Matriz.ordenarFilasPorCeros(matrizActualExpresiones);
        if(!_cmp(matrizActualExpresiones,matrizAux)){if(Representar.simboloFilasNulasAbajo)Representar.simboloFilasNulasAbajo(matrizActualExpresiones.length,caja2);_after();}
        _clearUI();
      }break;

      case "op4":{
        let d=document.createElement("div");d.className="rowFlex";let lab=document.createElement("label"),inp=document.createElement("input");
        lab.innerHTML="Introduce combinación lineal y ENTER:";inp.className="w150 mL8";d.appendChild(lab);d.appendChild(inp);caja127.appendChild(d);inp.focus();
        inp.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{let expr=inp.value.trim();if(!expr.length)throw 0;let matrizAux=_clone2(matrizActualExpresiones);
          _aplicarCombMultiple(matrizActualExpresiones,expr);if(!_cmp(matrizActualExpresiones,matrizAux))Representar.simboloCambiarLinea(expr,matrizActualExpresiones.length,caja2);
          _after();_clearUI();}catch(e){inp.focus();_msgErr("Expresión no válida. Ej: F3=2F3-(a-1)F2");}});
      }break;

      case "op5":{
        let matrizFiltrada=Matriz.eliminarFilasNulas(matrizActualExpresiones);
        if(_cmp(matrizActualExpresiones,matrizFiltrada))_msgErr("No hay filas nulas. Pulsa RESET y elige otra opción.");
        else{matrizActualExpresiones=_clone2(matrizFiltrada);if(Representar.simboloEliminarFilasNulas)Representar.simboloEliminarFilasNulas(matrizActualExpresiones.length,caja2);_after();_uncheck();}
      }break;

      default:_msgErr("Selecciona una opción.");break;
    }
  });
  Representar.matriz(matrizActualExpresiones,caja2);
}

function solucionEscalonada(escalonada){
  if(_enSol)return;_enSol=true;let caja1=_$("caja1"),caja2=_$("caja2"),caja3=_$("contenedorCaja3");
  caja1.className="layoutSol";caja1.innerHTML="";caja2.style.display="flex";caja3.style.display="flex";caja3.classList.add("casosWrap");caja3.innerHTML="";
  let top=document.createElement("div");top.className="tituloSol";top.innerHTML=escalonada?"LA MATRIZ INICIAL INTRODUCIDA YA ES ESCALONADA":"LA MATRIZ OBTENIDA YA ES ESCALONADA";caja1.appendChild(top);
  let grid=document.createElement("div");grid.className="gridSol";caja1.appendChild(grid);
  function _panel(t,mat){let p=document.createElement("div");p.className="panelSol";let h=document.createElement("div");h.className="panelTitle";h.innerHTML=t;let b=document.createElement("div");p.appendChild(h);p.appendChild(b);grid.appendChild(p);Representar.matriz(mat,b);return {p,h,b};}
  _panel("La matriz introducida es:",matrizAntigua);let matS=_clone2(matrizAntigua);try{matS=Matriz.simplificarElementosMatriz(matS);matS=Matriz.simplificarFilasNumericas(matS);}catch(e){}
  _panel("La matriz SIMPLIFICADA es:",matS);_panel("La matriz ESCALONADA es:",matrizActualExpresiones);

  casos=["G"];casosNumerico=[];casosAutomatico=[];casosAutomaticoNumerico=[];
  try{casosAutomatico=Matriz.rangoPorCasos(matrizOriginal)[2]||[];}catch(e){casosAutomatico=[];}
  for(let i=0;i<casosAutomatico.length;i++){try{casosAutomaticoNumerico[i]=parseFloat(ExpresionAlgebraica.pasarADecimal(casosAutomatico[i]));}catch(e){}}
  casosAutomaticoNumerico=casosAutomaticoNumerico.filter(v=>typeof v==="number"&&!Number.isNaN(v));

  let panel=document.createElement("div");panel.className="casosPanel";grid.appendChild(panel);
  let h=document.createElement("div");h.className="panelTitle";h.innerHTML="CASOS ESPECÍFICOS QUE SE DEBEN ESTUDIAR POR SEPARADO";panel.appendChild(h);
  let info=document.createElement("div");info.className="mb8";panel.appendChild(info);
  let ui={row1:null,row2:null,list:null,fin:null,inp1:null,auto:null};

  function _listaGeneral(){return [...new Set((casosAutomatico||[]).map(x=>_simpl(x)))].filter(x=>x&&x!=="G"&&x!=="g");}
  function _tituloGeneral(){let L=_listaGeneral();if(!L.length)return "CASO GENERAL (∀ "+nombreParametro+")";return "CASO GENERAL (∀ "+nombreParametro+" ∉ {"+L.join(", ")+"})";}
  function _lineaRango(card,mat1,mat2,r){let line=document.createElement("div");line.className="casosLine";
    let s1=document.createElement("span");s1.innerHTML="rango ";let m1=document.createElement("span");let s2=document.createElement("span");s2.innerHTML=" = rango ";
    let m2=document.createElement("span");let s3=document.createElement("span");s3.innerHTML=" = "+r;line.appendChild(s1);line.appendChild(m1);
    line.appendChild(s2);line.appendChild(m2);line.appendChild(s3);Representar.matriz(mat1,m1);Representar.matriz(mat2,m2);card.appendChild(line);}

  function _imprimirRangoCaso(valorNum,estado){
    let card=document.createElement("div");card.className="casosCard";caja3.appendChild(card);
    let hh=document.createElement("div");hh.className="panelTitle";hh.innerHTML=(estado==="general")?_tituloGeneral():("CASO "+nombreParametro+"="+estado);card.appendChild(hh);
    let matIni,matEsc,r;if(estado==="general"){matEsc=_clone2(matrizActualExpresiones);if(!Matriz.esMatrizEscalonada(matEsc))try{matEsc=Matriz.escalonarMatrizNumerica(matEsc);}catch(e){}
      matEsc=_ceroizarMatriz(matEsc);matEsc=Matriz.eliminarFilasNulas(matEsc);r=matEsc.length;_lineaRango(card,_ceroizarMatriz(matrizAntigua),matEsc,r);return;}
    matIni=_ceroizarMatriz(Matriz.sustituir(matrizAntigua,nombreParametro,valorNum));let usarUsuario=!_algunPivoteUsadoSeAnula(valorNum),base=usarUsuario?matrizActualExpresiones:matrizAntigua;
    let m0=_ceroizarMatriz(Matriz.sustituir(base,nombreParametro,valorNum));matEsc=(Matriz.esMatrizEscalonada(m0))?m0:Matriz.escalonarMatrizNumerica(m0);
    matEsc=_ceroizarMatriz(matEsc);matEsc=Matriz.eliminarFilasNulas(matEsc);r=matEsc.length;_lineaRango(card,matIni,matEsc,r);
  }

  function _dejarSoloCasosExtra(){if(ui.row1)ui.row1.remove();if(ui.row2)ui.row2.remove();if(ui.list)ui.list.remove();if(ui.auto)ui.auto.remove();info.innerHTML="Ya has estudiado todos los casos. Si quieres, estudia un valor específico más.";}
  function _activarEstudioExtra(){
    let zona=_$("zonaExtraCasos");if(zona)zona.remove();_dejarSoloCasosExtra();zona=document.createElement("div");zona.id="zonaExtraCasos";zona.className="mt8";panel.appendChild(zona);
    let row=document.createElement("div");row.className="rowFlex rowGap6 mt8";let lab=document.createElement("label");lab.innerHTML=nombreParametro+"=";
    let inp=document.createElement("input");inp.className="w40";row.appendChild(lab);row.appendChild(inp);zona.appendChild(row);inp.focus();
    inp.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{let num=_parseValorSimple(inp.value);inp.value="";let s=(typeof fraccionContinua==="function")?fraccionContinua(num.toString(),long):num.toString();_imprimirRangoCaso(num,s);inp.focus();}catch(e){inp.value="";inp.focus();}});
  }

  function _autoCasos(){
    casosNumerico=[];casos=["G"];
    for(let i=0;i<casosAutomaticoNumerico.length;i++){let num=casosAutomaticoNumerico[i];if(valoresExcluidosNumerico.includes(num))continue;if(!casosNumerico.includes(num))casosNumerico.push(num);
      let s=_simpl(casosAutomatico[i]);if(!s||valoresExcluidos.includes(s))continue;if(!casos.includes(s))casos.push(s);}
    if(ui.list){ui.list.style.color="black";ui.list.innerHTML="CASOS: "+casos;}if(ui.fin)ui.fin.click();
  }

  if(casosAutomatico.length===0){
    info.innerHTML="No hay casos específicos. Pulsa CASO GENERAL para obtener el rango.";let btn=document.createElement("button");btn.innerHTML="CASO GENERAL";panel.appendChild(btn);
    btn.addEventListener("click",function(){_imprimirRangoCaso(null,"general");btn.disabled=true;_activarEstudioExtra();});return;
  }

  info.innerHTML="Debes introducir todos los casos específicos de "+nombreParametro+" (o pulsar introducir automáticamente).";
  let row1=document.createElement("div");row1.className="rowFlexWrap mt8";let lab=document.createElement("label");lab.innerHTML=nombreParametro+"=";
  let inp=document.createElement("input");inp.className="w90";let fin=document.createElement("button");fin.innerHTML="FIN";let auto=document.createElement("button");auto.innerHTML="Introducir automáticamente (no recomendado)";
  row1.appendChild(lab);row1.appendChild(inp);row1.appendChild(fin);row1.appendChild(auto);panel.appendChild(row1);
  let list=document.createElement("div");list.className="mt8";panel.appendChild(list);list.innerHTML="CASOS: "+casos;
  ui.row1=row1;ui.list=list;ui.fin=fin;ui.inp1=inp;ui.auto=auto;auto.addEventListener("click",function(ev){ev.preventDefault();_autoCasos();});

  inp.focus();
  inp.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();
    try{let num=_parseValorSimple(inp.value);let s=(typeof fraccionContinua==="function")?fraccionContinua(num.toString(),long):num.toString();
      if(valoresExcluidosNumerico.includes(num)||valoresExcluidos.includes(s))throw 0;if(!casosNumerico.includes(num))casosNumerico.push(num);if(!casos.includes(s))casos.push(s);
      list.style.color="black";list.innerHTML="CASOS: "+casos;inp.value="";inp.focus();}
    catch(e){list.style.color="red";list.innerHTML="Caso no válido o EXCLUIDO. Usa decimal (0.5) o fracción (1/2).";inp.value="";inp.focus();}
  });

  fin.addEventListener("click",function(){
    let ok=casosAutomaticoNumerico.every(v=>casosNumerico.includes(v));if(!ok){info.innerHTML="Todavía no has introducido todos los casos. Continúa o usa automático.";inp.focus();return;}
    if(!casos.includes("G"))casos.push("G");list.style.color="black";list.innerHTML="CASOS: "+casos;row1.remove();ui.row1=null;ui.auto=null;
    info.innerHTML="Introduce un caso de la lista (o G) y pulsa ENTER para estudiar.";
    let row2=document.createElement("div");row2.className="rowFlexWrap mt8";let lab2=document.createElement("label");lab2.innerHTML="Valor:";let inp2=document.createElement("input");inp2.className="w110";
    row2.appendChild(lab2);row2.appendChild(inp2);panel.appendChild(row2);ui.row2=row2;inp2.focus();let general=true;

    inp2.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();let raw=(inp2.value||"").trim();inp2.value="";
      if(raw==="G"||raw==="g"){if(!general){info.innerHTML="El caso general ya fue estudiado.";inp2.focus();return;}
        _imprimirRangoCaso(null,"general");general=false;casos=casos.filter(x=>x!=="G"&&x!=="g");list.innerHTML="CASOS: "+casos;
        if(casos.length===0)_activarEstudioExtra();inp2.focus();return;}
      try{let num=_parseValorSimple(raw),s=(typeof fraccionContinua==="function")?fraccionContinua(num.toString(),long):num.toString();
        if(!casosNumerico.includes(num)&&!casos.includes(s)){info.innerHTML="Ese valor no está entre los casos.";inp2.focus();return;}
        _imprimirRangoCaso(num,s);casosNumerico=casosNumerico.filter(e=>e!==num);casos=casos.filter(e=>e!==s);list.innerHTML="CASOS: "+casos;
        if(casos.length===0)_activarEstudioExtra();inp2.focus();}
      catch(e){info.innerHTML="Entrada no válida. Usa decimal (0.5) o fracción (1/2).";inp2.focus();}
    });
  });
}

document.addEventListener("DOMContentLoaded",_init);
