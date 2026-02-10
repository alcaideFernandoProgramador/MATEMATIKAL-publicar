var S={nf:0,nc:0,np:0,val:[],act:[],orig:[],ant:[],p:1,FS_MAT:"13px",FS_IN:"12px",FS_TIT:"15px",
MB_TIT:"12px",ALT_SIM:34,MAXH_USER:260,MAXH_AUTO:260};

function $(id){return document.getElementById(id);}function html(el,s){if(el)el.innerHTML=s??"";}
function rm(el){if(el)try{el.remove()}catch(_){}}
function cloneM(m){return (m??[]).map(r=>(r??[]).slice());}
function normNumStr(v){let s=(v??"").toString().trim().replace(/\s+/g,"").replace(/,/g,".");return s===""?"0":s;}
function simp(s){
  s=(s??"0").toString().replace(/\s+/g,"").replace(/,/g,".");
  return (typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.simplificar)?
    ExpresionAlgebraica.simplificar(s):(s===""?"0":s);
}
function _Z(x){
  if(typeof Matriz!=="undefined"&&Matriz._Z)return Matriz._Z(x);
  let s=(x??"0").toString().trim().replace(/\s+/g,"").replace(/,/g,".");
  return s===""||s==="0"||s==="-0";
}
function isNumStr(v){
  if(typeof Matriz!=="undefined"&&Matriz._isNum)return Matriz._isNum(v);
  let s=normNumStr(v);
  return /^[+\-]?\d+$/.test(s)||/^[+\-]?\d*\.\d+$/.test(s)||/^[+\-]?\d+\/[+\-]?\d+$/.test(s);
}
function msgOK(id,txt){let c=$(id);if(c){c.style.color="black";html(c,txt??"");}}
function msgERR(id,txt){let c=$(id);if(c){c.style.color="red";html(c,txt??"");}}
function activarScrollVerticalSiNecesario(el,maxHpx){
  if(!el)return;el.style.maxHeight=maxHpx+"px";el.style.overflowY="hidden";
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    el.style.overflowY=(el.scrollHeight>maxHpx)?"auto":"hidden";
  }));
}
function setupCaja1121(){let c=$("caja1121");if(!c)return;c.style.height="auto";c.style.overflowY="visible";}
function matPintable(m){
  if(Array.isArray(m)&&m.length>0)return m;
  let nc=(S.nc||((S.val&&S.val[0])?S.val[0].length:0)||1);
  return [new Array(nc).fill("0")];
}

function esEscalonadaLocal(m){
  if(!Array.isArray(m))return false;
  if(m.length===0)return true;
  if(!Array.isArray(m[0]))return false;
  let nf=m.length,nc=m[0].length,prev=-1,all0=true;
  for(let i=0;i<nf;i++){
    let j=0;for(;j<nc;j++)if(!_Z(m[i][j])){all0=false;break;}
    if(j===nc){if(!all0&&prev===nc)continue;prev=nc;continue;}
    if(prev!==-1&&j<=prev)return false;prev=j;
  }
  return true;
}

function getTiraUsuario(limpiar){
  let c21=$("caja21");if(!c21)return null;
  c21.style.display="block";c21.style.padding="6px";c21.style.boxSizing="border-box";
  c21.style.overflowX="hidden";if(limpiar)html(c21,"");
  activarScrollVerticalSiNecesario(c21,S.MAXH_USER);
  let t=$("tiraUsuario");
  if(!t){
    t=document.createElement("div");t.id="tiraUsuario";t.style.display="flex";t.style.flexWrap="wrap";
    t.style.alignItems="center";t.style.alignContent="flex-start";t.style.justifyContent="flex-start";
    t.style.gap="10px";t.style.rowGap="10px";t.style.maxWidth="100%";t.style.overflowX="hidden";
    t.style.boxSizing="border-box";c21.appendChild(t);
  }
  return t;
}
function addNodoUsuario(n){
  let t=getTiraUsuario(false);if(!t||!n)return;t.appendChild(n);
  activarScrollVerticalSiNecesario($("caja21"),S.MAXH_USER);
}
function addMatrizUsuario(m){
  let cont=document.createElement("div");cont.style.display="inline-flex";cont.style.alignItems="center";
  cont.style.maxWidth="100%";cont.style.overflow="hidden";cont.style.boxSizing="border-box";
  cont.style.fontSize=S.FS_MAT;if(Representar?.matriz)Representar.matriz(matPintable(m),cont);addNodoUsuario(cont);
}
function addSimboloUsuario(fn){
  let s=document.createElement("div");s.style.display="inline-flex";s.style.alignItems="center";
  s.style.margin="0 2px";if(fn)fn(s);addNodoUsuario(s);
}
function renderInicioUsuario(limpiar){getTiraUsuario(limpiar);addMatrizUsuario(S.act);}
function renderPasoPermutar(a,b){
  addSimboloUsuario(l=>{
    if(Representar?.simboloPermutarFilas)Representar.simboloPermutarFilas(a,b,S.act.length,l);
    else l.innerHTML=`F<sub>${a}</sub>↔F<sub>${b}</sub>`;
  });addMatrizUsuario(S.act);
}
function renderPasoFilasAbajo(){
  addSimboloUsuario(l=>{
    if(Representar?.simboloFilasNulasAbajo)Representar.simboloFilasNulasAbajo(S.act.length,l);
    else l.innerHTML="F↓";
  });addMatrizUsuario(S.act);
}
function renderPasoDividir(a,b){
  addSimboloUsuario(l=>{
    if(Representar?.simboloDividirFila)Representar.simboloDividirFila(a,b,S.act.length,l);
    else l.innerHTML=`F<sub>${a}</sub>→1/${b}F<sub>${a}</sub>`;
  });addMatrizUsuario(S.act);
}
function normCad(c){
  c=(c??"").toString().replace(/\s+/g,"").replace(/,/g,".").replace(/\+\-/g,"-");
  c=c.replace(/=1F/g,"=F").replace(/\+1F/g,"+F").replace(/\-1F/g,"-F");
  c=c.replace(/=([+-]?)0F\d+/g,"=");c=c.replace(/[+\-]0F\d+/g,"");c=c.replace(/=\+/g,"=");
  c=c.replace(/\+\+/g,"+").replace(/\-\-/g,"+").replace(/\+\-/g,"-").replace(/\-\+/g,"-");
  return c.replace(/=$/,"");
}
function renderPasoCambiar(cad){
  addSimboloUsuario(l=>{
    if(Representar?.simboloCambiarLinea)Representar.simboloCambiarLinea(normCad(cad),S.act.length,l);
    else l.innerHTML=(cad??"").toString();
  });addMatrizUsuario(S.act);
}
function renderPasoEquivalente(){
  addSimboloUsuario(l=>{
    if(Representar?.simboloMatrizEquivalente)Representar.simboloMatrizEquivalente(S.act.length,l);
    else l.innerHTML="~";
  });addMatrizUsuario(S.act);
}
function renderPasoSimplificar(){
  addSimboloUsuario(l=>{
    if(Representar?.simboloSimplificarFilas)Representar.simboloSimplificarFilas(S.act.length,l);
    else l.innerHTML="simp";
  });addMatrizUsuario(S.act);
}
function renderPasoEliminarNulas(){
  addSimboloUsuario(l=>{
    if(Representar?.simboloEliminarFilasNulas)Representar.simboloEliminarFilasNulas(S.act.length,l);
    else l.innerHTML="anular";
  });addMatrizUsuario(S.act);
}

function getTiraAuto(limpiar){
  let c221=$("caja221");if(!c221)return null;
  c221.style.display="flex";c221.style.fontSize=S.FS_MAT;c221.style.maxWidth="100%";
  c221.style.overflowX="hidden";if(limpiar)html(c221,"");
  activarScrollVerticalSiNecesario(c221,S.MAXH_AUTO);
  let t=$("tiraAuto");
  if(!t){
    t=document.createElement("div");t.id="tiraAuto";t.style.display="flex";t.style.flexWrap="wrap";
    t.style.alignItems="center";t.style.alignContent="flex-start";t.style.justifyContent="flex-start";
    t.style.gap="10px";t.style.rowGap="10px";t.style.maxWidth="100%";t.style.boxSizing="border-box";
    c221.appendChild(t);
  }
  return t;
}
function addNodoAuto(n){
  let t=getTiraAuto(false);if(!t||!n)return;t.appendChild(n);
  activarScrollVerticalSiNecesario($("caja221"),S.MAXH_AUTO);
}
function addMatrizAuto(m){
  let cont=document.createElement("div");cont.style.display="inline-flex";cont.style.alignItems="center";
  cont.style.maxWidth="100%";cont.style.overflow="hidden";cont.style.boxSizing="border-box";
  cont.style.fontSize=S.FS_MAT;if(Representar?.matriz)Representar.matriz(matPintable(m),cont);addNodoAuto(cont);
}
function addSimboloAuto(fn){
  let s=document.createElement("div");s.style.display="inline-flex";s.style.alignItems="center";
  s.style.margin="0 2px";if(fn)fn(s);addNodoAuto(s);
}
function renderInicioAuto(m,limpiar){getTiraAuto(limpiar);addMatrizAuto(m);}
function renderAutoOrdenar(nf,m){
  addSimboloAuto(l=>{
    if(Representar?.simboloOrdenarFilasPorCeros)Representar.simboloOrdenarFilasPorCeros(nf,l);
    else if(Representar?.simboloFilasNulasAbajo)Representar.simboloFilasNulasAbajo(nf,l);
    else l.innerHTML="F↓";
  });addMatrizAuto(m);
}
function renderAutoFilasAbajo(nf,m){
  addSimboloAuto(l=>{
    if(Representar?.simboloFilasNulasAbajo)Representar.simboloFilasNulasAbajo(nf,l);
    else l.innerHTML="F↓";
  });addMatrizAuto(m);
}
function renderAutoCambiar(nf,cad,m){
  addSimboloAuto(l=>{
    if(Representar?.simboloCambiarLinea)Representar.simboloCambiarLinea(normCad(cad),nf,l);
    else l.innerHTML=(cad??"");
  });addMatrizAuto(m);
}
function renderAutoSimplificar(nf,m){
  addSimboloAuto(l=>{
    if(Representar?.simboloSimplificarFilas)Representar.simboloSimplificarFilas(nf,l);
    else l.innerHTML="simp";
  });addMatrizAuto(m);
}
function renderAutoEliminarNulas(nf,m){
  addSimboloAuto(l=>{
    if(Representar?.simboloEliminarFilasNulas)Representar.simboloEliminarFilasNulas(nf,l);
    else l.innerHTML="anular";
  });addMatrizAuto(m);
}

function limpiarZonaOpcionesFinal(){
  let c12=$("caja12");if(c12)html(c12,"");rm($("caja1111"));rm($("caja1112"));
  let c111=$("caja111");if(c111)c111.style.height="20px";
  let l12=$("caja12");if(l12){l12.style.display="block";let sp=document.createElement("div");
    l12.appendChild(sp);sp.style.height="18px";}
}

function mostrarBloqueFinalRango(mIni,mFin){
  limpiarZonaOpcionesFinal();let panel=$("caja12");if(!panel)return;
  let t1=document.createElement("div"),t2=document.createElement("div"),t3=document.createElement("div");
  panel.appendChild(t1);panel.appendChild(t2);panel.appendChild(t3);
  t1.style.display="flex";t1.style.fontSize="26px";t1.style.alignItems="center";
  t1.style.justifyContent="center";t1.innerHTML="LA MATRIZ OBTENIDA YA ES ESCALONADA";
  t2.style.display="flex";t2.style.fontSize="18px";t2.style.alignItems="center";
  t2.style.justifyContent="center";t2.style.marginTop="10px";
  t2.innerHTML="Como su número de filas no nulas es "+mFin.length+" el rango de la matriz es "+mFin.length+":";
  t3.style.display="flex";t3.style.fontSize="15px";t3.style.alignItems="center";
  t3.style.justifyContent="center";t3.style.marginTop="12px";
  let a1=document.createElement("div"),a2=document.createElement("div"),a3=document.createElement("div");
  let a4=document.createElement("div"),a5=document.createElement("div");
  t3.appendChild(a1);t3.appendChild(a2);t3.appendChild(a3);t3.appendChild(a4);t3.appendChild(a5);
  a1.style.display="flex";a2.style.display="flex";a3.style.display="flex";a4.style.display="flex";a5.style.display="flex";
  a1.style.alignItems="center";a2.style.alignItems="center";a3.style.alignItems="center";
  a4.style.alignItems="center";a5.style.alignItems="center";a1.innerHTML="rango";
  if(Representar?.matriz){
    let c=document.createElement("div");c.style.fontSize=S.FS_MAT;a2.appendChild(c);
    Representar.matriz(matPintable(mIni),c);
  }
  if(Matriz?.compararMatrices&&!Matriz.compararMatrices(mIni,mFin)){
    a3.innerHTML="= rango";
    if(Representar?.matriz){
      let c=document.createElement("div");c.style.fontSize=S.FS_MAT;a4.appendChild(c);
      Representar.matriz(matPintable(mFin),c);
    }
  }
  a5.innerHTML="="+mFin.length;
}

function mostrarMatrizEscalonadaArriba(E){
  let c1122=$("caja1122");if(!c1122)return;c1122.style.display="block";html(c1122,"");
  let t1=document.createElement("div"),t2=document.createElement("div");c1122.appendChild(t1);c1122.appendChild(t2);
  t1.style.fontSize=S.FS_TIT;t1.style.fontWeight="bold";t1.style.margin="0 0 "+S.MB_TIT+" 0";
  t1.innerHTML="LA MATRIZ ESCALONADA SIMPLIFICADA ES:";
  t2.style.display="flex";t2.style.alignItems="center";t2.style.justifyContent="center";t2.style.gap="6px";
  t2.style.marginTop="10px";t2.style.overflowX="auto";t2.style.overflowY="hidden";t2.style.maxWidth="100%";
  t2.style.fontSize=S.FS_MAT;let lab=document.createElement("div");
  lab.style.fontWeight="bold";lab.style.fontSize=S.FS_MAT;lab.innerHTML="E=";t2.appendChild(lab);
  if(Representar?.matriz)Representar.matriz(matPintable(E),t2);
}

function resetTrabajoUsuario(){
  html($("caja1231"),"");html($("caja1232"),"");msgOK("caja1241","");msgOK("caja1251","");
  let ops=document.getElementsByName("option");for(let k=0;k<ops.length;k++)if(ops[k].checked){ops[k].checked=false;break;}
}

function finalizarSiEscalonadaUsuario(){
  if(!esEscalonadaLocal(S.act))return false;
  let ini=cloneM(S.orig),E=cloneM(S.act),au=cloneM(E);
  if(Matriz?.simplificarFilasNumericas)E=Matriz.simplificarFilasNumericas(E);
  if(Matriz?.compararMatrices&&!Matriz.compararMatrices(au,E)){S.act=cloneM(E);renderPasoSimplificar();}
  if(Matriz?.eliminarFilasNulas){
    au=cloneM(S.act);E=Matriz.eliminarFilasNulas(cloneM(S.act));
    if(Matriz?.compararMatrices&&!Matriz.compararMatrices(au,E)){S.act=cloneM(E);renderPasoEliminarNulas();}
  }
  mostrarMatrizEscalonadaArriba(E);mostrarBloqueFinalRango(ini,E);
  html($("caja121"),"");html($("caja1221"),"");html($("caja1222"),"");html($("caja1223"),"");
  html($("caja1224"),"");html($("caja1225"),"");html($("caja1252"),"");resetTrabajoUsuario();return true;
}

function aplicarCombinacionDesdeCadena(cad){if(!Matriz?.cambiarFila)throw 0;S.act=Matriz.cambiarFila(S.act,cad);}

function rhsIncluyeFiNoNula(cad){
  cad=(cad??"").toString().replace(/\s+/g,"");let m=cad.match(/^F(\d+)=/i);if(!m)return false;
  let i=m[1],rhs=(cad.split("=")[1]??"");
  let re=new RegExp(`([+\\-]?)([0-9.,/]*?)F${i}(?!\\d)`,"gi"),x;
  while((x=re.exec(rhs))!==null){
    let sign=x[1]==="-"?"-":"",coef=(x[2]??"");if(coef==="")return true;
    let v=normNumStr(sign+coef);if(isNumStr(v)&&!_Z(simp(v)))return true;
  }
  return false;
}

function op1(){
  let lf5=$("caja1231"),lf6=$("caja1232");if(!lf5||!lf6)return;html(lf5,"");html(lf6,"");
  let wrap=document.createElement("div");wrap.style.display="inline-flex";wrap.style.gap="8px";
  wrap.style.alignItems="center";lf5.appendChild(wrap);
  let lA=document.createElement("label"),lB=document.createElement("label");lA.innerHTML="Fila a";lB.innerHTML="Fila b";
  let iA=document.createElement("input"),iB=document.createElement("input");iA.type="text";iB.type="text";
  iA.style.width="44px";iB.style.width="44px";iA.style.padding="2px 4px";iB.style.padding="2px 4px";
  iA.style.fontSize=S.FS_IN;iB.style.fontSize=S.FS_IN;wrap.appendChild(lA);wrap.appendChild(iA);
  wrap.appendChild(lB);wrap.appendChild(iB);iA.focus();
  function exec(){
    try{
      msgOK("caja1251","");let A=parseInt(normNumStr(iA.value),10),B=parseInt(normNumStr(iB.value),10);
      if(!Number.isInteger(A)||!Number.isInteger(B)||A<1||B<1||A>S.act.length||B>S.act.length||A===B)throw 0;
      let ii=A-1,jj=B-1;
      S.act=Matriz?.permutarFilas?Matriz.permutarFilas(S.act,ii,jj):(()=>{
        let m=cloneM(S.act);[m[ii],m[jj]]=[m[jj],m[ii]];return m;
      })();
      renderPasoPermutar(A,B);resetTrabajoUsuario();if(finalizarSiEscalonadaUsuario())return;
    }catch(_){msgERR("caja1251","Filas no válidas. Enteros distintos y dentro del rango.");}
  }
  iA.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();iB.focus();}});
  iB.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();exec();}});
}

function op2(){
  try{
    if(Matriz?.ordenarFilasPorCeros){
      let antes=cloneM(S.act);S.act=Matriz.ordenarFilasPorCeros(S.act);
      if(Matriz?.compararMatrices&&Matriz.compararMatrices(S.act,antes)){
        msgERR("caja1241","La matriz ya está ordenada.");resetTrabajoUsuario();return;
      }
      renderPasoFilasAbajo();resetTrabajoUsuario();if(finalizarSiEscalonadaUsuario())return;return;
    }
    if(Matriz?.filasNulasAbajo){
      let antes=cloneM(S.act);S.act=Matriz.filasNulasAbajo(S.act);
      if(Matriz?.compararMatrices&&Matriz.compararMatrices(S.act,antes)){
        msgERR("caja1241","La matriz ya está ordenada.");resetTrabajoUsuario();return;
      }
      renderPasoFilasAbajo();resetTrabajoUsuario();if(finalizarSiEscalonadaUsuario())return;return;
    }
    msgERR("caja1241","No existe método de reordenación en la biblioteca.");resetTrabajoUsuario();
  }catch(_){msgERR("caja1241","Error en reordenación.");resetTrabajoUsuario();}
}

function op3(){
  let lf5=$("caja1231"),lf6=$("caja1232");if(!lf5||!lf6)return;html(lf5,"");html(lf6,"");
  let wrap=document.createElement("div");wrap.style.display="inline-flex";wrap.style.gap="8px";
  wrap.style.alignItems="center";lf5.appendChild(wrap);
  let lA=document.createElement("label"),lB=document.createElement("label");lA.innerHTML="Fila";lB.innerHTML="Divisor";
  let iA=document.createElement("input"),iB=document.createElement("input");iA.type="text";iB.type="text";
  iA.style.width="44px";iB.style.width="90px";iA.style.padding="2px 4px";iB.style.padding="2px 4px";
  iA.style.fontSize=S.FS_IN;iB.style.fontSize=S.FS_IN;wrap.appendChild(lA);wrap.appendChild(iA);
  wrap.appendChild(lB);wrap.appendChild(iB);iA.focus();
  function exec(){
    try{
      msgOK("caja1251","");let a=parseInt(normNumStr(iA.value),10),m=normNumStr(iB.value);
      if(!Number.isInteger(a)||a<1||a>S.act.length||!isNumStr(m)||_Z(simp(m)))throw 0;
      let nueva=cloneM(S.act);
      for(let j=0;j<nueva[a-1].length;j++)nueva[a-1][j]=simp(`(${nueva[a-1][j]})/(${m})`);
      S.act=nueva;renderPasoDividir(a,m);resetTrabajoUsuario();if(finalizarSiEscalonadaUsuario())return;
    }catch(_){msgERR("caja1251","Fila válida y divisor numérico distinto de 0.");}
  }
  iA.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();iB.focus();}});
  iB.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();exec();}});
}

function op4(){
  let lf5=$("caja1231"),lf6=$("caja1232");if(!lf5||!lf6)return;html(lf5,"");html(lf6,"");
  let lc=document.createElement("label"),ic=document.createElement("input");
  lc.innerHTML="Combinación (ej: F1=2F1+F2+3F3):";lf5.appendChild(lc);lf6.appendChild(ic);
  ic.type="text";ic.value="";ic.placeholder="";ic.style.width="150px";ic.style.padding="2px 4px";
  ic.style.fontSize=S.FS_IN;ic.focus();
  ic.addEventListener("keydown",function(e){
  if(e.key!=="Enter"&&e.key!=="Tab")return;e.preventDefault();e.preventDefault();
  let cad=ic.value;
  try{
    msgOK("caja1251","");if(!rhsIncluyeFiNoNula(cad))throw 1;aplicarCombinacionDesdeCadena(cad);
    renderPasoCambiar(cad);resetTrabajoUsuario();if(finalizarSiEscalonadaUsuario())return;
  }catch(ex){
    if(ex===1){
      let m=(cad??"").toString().replace(/\s+/g,"").match(/^F(\d+)=/i),fi=m?("F"+m[1]):"F_i";
      msgERR("caja1251","Debe aparecer "+fi+" en el lado derecho con coeficiente no nulo.");
    }else msgERR("caja1251","Expresión no válida. Admite enteros, decimales y fracciones.");
  }
});

}

function onSelect(){
  html($("caja1231"),"");html($("caja1232"),"");msgOK("caja1241","");msgOK("caja1251","");
  let r=document.querySelector('input[name="option"]:checked');
  let opSel=(r&&r.value&&r.value!=="null")?r.value:null;
  if(!opSel){msgERR("caja1241","Elige una opción y pulsa Seleccionar.");return;}
  if(opSel==="opcion1")op1();else if(opSel==="opcion2")op2();else if(opSel==="opcion3")op3();else if(opSel==="opcion4")op4();
}

function crearFormulario(){
  S.act=cloneM(S.val);S.orig=cloneM(S.val);S.ant=cloneM(S.val);
  let lt=$("caja121");
  if(lt){html(lt,"");let tit=document.createElement("h3");tit.innerHTML="OPCIONES PARA MODIFICAR LA MATRIZ";lt.appendChild(tit);}
  let l1=$("caja1221"),l2=$("caja1222"),l3=$("caja1223"),l4=$("caja1224"),l5=$("caja1225"),l6=$("caja1252");
  function addOpt(l,id,val,txt,sym){
    if(!l)return;html(l,"");let o=document.createElement("input");o.type="radio";o.value=val;o.name="option";o.id=id;
    l.appendChild(o);let a=document.createElement("label"),b=document.createElement("label");
    a.style.display="inline-block";a.style.width="75%";a.innerHTML=txt;b.innerHTML=sym;l.appendChild(a);l.appendChild(b);
  }
  addOpt(l1,"inputcorto1","opcion1","Opción 1: Permutar el orden de dos filas","F<sub>i</sub> ↔ F<sub>j</sub>");
  addOpt(l2,"inputcorto2","opcion2","Opción 2: Reordenar las filas dejando abajo las que más ceros tengan a la izquierda","F↓");
  addOpt(l3,"inputcorto3","opcion3","Opción 3: Dividir una fila por un número distinto de 0","F<sub>a</sub>→1/mF<sub>a</sub>");
  addOpt(l4,"inputcorto4","opcion4","Opción 4: Cambiar una fila por combinación lineal de varias filas","F<sub>i</sub>→aF<sub>i</sub>+bF<sub>j</sub>+cF<sub>k</sub>");
  if(l5){html(l5,"");l5.style.display="flex";l5.style.justifyContent="flex-start";l5.style.alignItems="center";
  let b=document.createElement("button");b.innerHTML="Seleccionar";l5.appendChild(b);b.addEventListener("click",onSelect);}
  if(l6){html(l6,"");let br=document.createElement("button");br.innerHTML="RESET";l6.appendChild(br);br.addEventListener("click",resetTrabajoUsuario);}
  html($("caja1231"),"");html($("caja1232"),"");msgOK("caja1241","");msgOK("caja1251","");renderInicioUsuario(true);
}

function mostrarMatrizInicialArriba(){
  let c1121=$("caja1121"),c1122=$("caja1122");if(!c1121||!c1122)return;setupCaja1121();
  html(c1121,"");html(c1122,"");
  let b1=document.createElement("div"),b2=document.createElement("div");c1121.appendChild(b1);c1121.appendChild(b2);
  b1.id="caja11211";b2.id="caja11212";b2.style.display="flex";b2.style.alignItems="center";
  b2.style.justifyContent="center";b2.style.gap="10px";b2.style.overflowX="auto";b2.style.overflowY="hidden";
  b2.style.maxWidth="100%";
  let tit=document.createElement("h3");tit.innerHTML="LA MATRIZ INTRODUCIDA ES:";tit.style.margin="0 0 "+S.MB_TIT+" 0";
  tit.style.fontSize=S.FS_TIT;b1.appendChild(tit);
  let tx=document.createElement("div");tx.innerHTML="A=";b2.appendChild(tx);
  let contA=document.createElement("div");contA.style.fontSize=S.FS_MAT;b2.appendChild(contA);
  if(Representar?.matriz)Representar.matriz(matPintable(S.val),contA);
  let needsQD=false;
  for(let i=0;i<S.val.length&&!needsQD;i++)for(let j=0;j<S.val[0].length;j++){
    let v=(S.val[i][j]??"").toString();if(v.includes("/")||v.includes(".")){needsQD=true;break;}
  }
  if(needsQD&&Matriz?.quitarDenominadores){
    try{
      let q=Matriz.quitarDenominadores(cloneM(S.val))[0];
      if(Matriz?.compararMatrices&&!Matriz.compararMatrices(S.val,q)){
        let sym=document.createElement("div");sym.style.display="inline-flex";sym.style.alignItems="center";b2.appendChild(sym);
        if(Representar?.simboloMatrizEquivalente)Representar.simboloMatrizEquivalente(S.val.length,sym);else sym.innerHTML="~";
        let contB=document.createElement("div");contB.style.fontSize=S.FS_MAT;b2.appendChild(contB);
        if(Representar?.matriz)Representar.matriz(matPintable(q),contB);S.val=q;
      }
    }catch(_){}
  }
  S.act=cloneM(S.val);S.orig=cloneM(S.val);S.ant=cloneM(S.val);
}

function crearNumeroFilas(lug,lugc){
  let l=$(lug);if(!l)return;html(l,"");
  let p1=document.createElement("p"),p2=document.createElement("p");p1.id="textosinmargen";p2.id="textosinmargen";
  p1.appendChild(document.createTextNode("Nº de filas"));p2.appendChild(document.createTextNode("(Entre 1 y 6)"));
  let i=document.createElement("input");i.id="nfilas";i.type="text";l.appendChild(p1);l.appendChild(i);l.appendChild(p2);i.focus();
  let ok=true;
  i.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!=="Tab")return;e.preventDefault();e.preventDefault();
    try{
  if(!ok)msgOK(lugc,"Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");
  let s=i.value.toString().trim().replace(/\s+/g,"");
  if(!/^\d+$/.test(s))throw 0;
  S.nf=parseInt(s,10);if(isNaN(S.nf)||S.nf<1||S.nf>6)throw 0;
  crearNumeroColumnas("caja11122","caja11112");
  }catch(_){ok=false;msgERR(lugc,"El nº de filas no es válido. Inténtalo otra vez.");i.value="";} });}

function crearNumeroColumnas(lug,lugc){
  let l=$(lug);if(!l)return;html(l,"");
  let p1=document.createElement("p"),p2=document.createElement("p");p1.id="textosinmargen";p2.id="textosinmargen";
  p1.appendChild(document.createTextNode("Nº de columnas"));p2.appendChild(document.createTextNode("(Entre 1 y 8)"));
  let i=document.createElement("input");i.id="ncolumnas";i.type="text";l.appendChild(p1);l.appendChild(i);l.appendChild(p2);i.focus();
  let ok=true;
  i.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!=="Tab")return;e.preventDefault();e.preventDefault();
    try{
  if(!ok)msgOK(lugc,"Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");
  let s=i.value.toString().trim().replace(/\s+/g,"");
  if(!/^\d+$/.test(s))throw 0;
  S.nc=parseInt(s,10);if(isNaN(S.nc)||S.nc<1||S.nc>8)throw 0;
  crearMatrizVacia();
  }catch(_){ok=false;msgERR(lugc,"El nº de columnas no es válido. Inténtalo otra vez.");i.value="";}});}

function crearMatrizVacia(){
  let cont=$("caja1122");if(cont)html(cont,"");S.val=[];
  let marco=document.createElement("div");marco.style.display="flex";marco.style.alignItems="center";
  marco.style.justifyContent="center";marco.style.gap="4px";marco.style.overflowX="auto";marco.style.maxWidth="100%";
  if(cont)cont.appendChild(marco);
  if(Representar?.abrirParentesis)Representar.abrirParentesis(S.nf,marco);
  let tabla=document.createElement("table");tabla.style.margin="0 auto";tabla.style.fontSize=S.FS_IN;
  for(let i=0;i<S.nf;i++){
    let tr=document.createElement("tr"),fila=[];
    for(let j=0;j<S.nc;j++){
      let inp=document.createElement("input");inp.type="text";inp.value="";inp.style.fontSize=S.FS_IN;
      inp.style.width="46px";inp.style.padding="2px 4px";fila.push(null);
      let td=document.createElement("td");td.appendChild(inp);tr.appendChild(td);
    }
    S.val.push(fila);tabla.appendChild(tr);
  }
  marco.appendChild(tabla);if(Representar?.cerrarParentesis)Representar.cerrarParentesis(S.nf,marco);rellenarMatriz(tabla);
}

function finalizarEntrada(){
  mostrarMatrizInicialArriba();let lugarB=$("caja1112");if(lugarB)html(lugarB,"LA MATRIZ INICIAL HA SIDO INTRODUCIDA");
  if(esEscalonadaLocal(S.val)){
    S.orig=cloneM(S.val);S.act=cloneM(S.val);renderInicioUsuario(true);
    if(Matriz?.simplificarFilasNumericas){
      let a=cloneM(S.act),b=Matriz.simplificarFilasNumericas(cloneM(S.act));
      if(Matriz?.compararMatrices&&!Matriz.compararMatrices(a,b)){S.act=b;renderPasoSimplificar();}
    }
    if(Matriz?.eliminarFilasNulas){
      let a=cloneM(S.act),b=Matriz.eliminarFilasNulas(cloneM(S.act));
      if(Matriz?.compararMatrices&&!Matriz.compararMatrices(a,b)){S.act=b;renderPasoEliminarNulas();}
    }
    mostrarMatrizEscalonadaArriba(S.act);mostrarBloqueFinalRango(S.orig,S.act);return;
  }
  crearFormulario();botonResolucionAutomatica();
}

function rellenarMatriz(tabla){
  let inputs=tabla.getElementsByTagName("input");if(inputs[0])inputs[0].focus();
  for(let i=0;i<inputs.length;i++)inputs[i].addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!=="Tab")return;e.preventDefault();e.preventDefault();
    try{
      msgOK("caja11112","Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");
      let f=this.parentNode.parentNode.rowIndex,col=this.parentNode.cellIndex;
      let v=normNumStr(this.value);if(!isNumStr(v))throw 0;S.val[f][col]=simp(v);
      if(i<inputs.length-1)inputs[i+1].focus();else finalizarEntrada();
    }catch(_){msgERR("caja11112","Valor no válido. Admite enteros, decimales y fracciones tipo 2/3.");inputs[i].value="";}
  });
}

function mostrarResultadoFinalAutomatica(E){
  let res=cloneM(E);if(Matriz?.simplificarFilasNumericas)res=Matriz.simplificarFilasNumericas(res);
  if(Matriz?.eliminarFilasNulas)res=Matriz.eliminarFilasNulas(res);
  mostrarMatrizEscalonadaArriba(res);mostrarBloqueFinalRango(S.orig,res);
}

function needsParensCoef(s){
  s=(s??"").toString().replace(/\s+/g,"");if(s==="")return false;
  if(s[0]==='+'||s[0]==='-')s=s.slice(1);if(s==="")return false;
  if(/^\d+(\.\d+)?$/.test(s)||/^\d+\/\d+$/.test(s))return false;
  if(/^[A-Za-z]\w*$/.test(s))return false;
  return /[+\-*/]/.test(s)||s.includes("(")||s.includes(")");
}
function cleanCoef(s){
  s=simp(s);s=(s??"").toString().replace(/\s+/g,"");if(s==="")return "0";
  while(s.startsWith("(")&&s.endsWith(")")){
    let t=s.slice(1,-1),bal=0,ok=true;
    for(let i=0;i<t.length;i++){
      if(t[i]==="(")bal++;else if(t[i]===")"){bal--;if(bal<0){ok=false;break;}}
    }
    if(!ok||bal!==0)break;s=t;
  }
  return s;
}
function prettyCoef(s){s=cleanCoef(s);return needsParensCoef(s)?`(${s})`:s;}
function opp(s){
  s=simp(s);if(_Z(s))return "0";
  if(typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.opuesto)return ExpresionAlgebraica.opuesto(s);
  if(s[0]==='-')return s.slice(1);if(s[0]==='+')return '-'+s.slice(1);return '-('+s+')';
}
function mul(a,b){return simp(`(${a})*(${b})`);}function sub(a,b){return simp(`(${a})-(${b})`);}

function matrizEscalonadaFn(matriz){
  let E=cloneM(matriz);renderInicioAuto(E,true);
  if(!Array.isArray(E)||E.length===0){mostrarResultadoFinalAutomatica([]);return;}
  if(!Array.isArray(E[0])||E[0].length===0){mostrarResultadoFinalAutomatica([]);return;}

  if(Matriz?.ordenarFilasPorCeros){
    let ant=cloneM(E);E=Matriz.ordenarFilasPorCeros(E);
    if(Matriz?.compararMatrices&&!Matriz.compararMatrices(E,ant))renderAutoOrdenar(E.length,cloneM(E));
  }
  if(Matriz?.filasNulasAbajo){
    let ant=cloneM(E);E=Matriz.filasNulasAbajo(E);
    if(Matriz?.compararMatrices&&!Matriz.compararMatrices(E,ant))renderAutoFilasAbajo(E.length,cloneM(E));
  }
  if(esEscalonadaLocal(E)){
    if(Matriz?.simplificarFilasNumericas){
      let ant=cloneM(E),Es=Matriz.simplificarFilasNumericas(cloneM(E));
      if(Matriz?.compararMatrices&&!Matriz.compararMatrices(Es,ant))renderAutoSimplificar(Es.length,cloneM(Es));E=Es;
    }
    if(Matriz?.eliminarFilasNulas){
      let ant=cloneM(E),En=Matriz.eliminarFilasNulas(cloneM(E));
      if(Matriz?.compararMatrices&&!Matriz.compararMatrices(En,ant))renderAutoEliminarNulas(En.length,cloneM(En));E=En;
    }
    mostrarResultadoFinalAutomatica(E);return;
  }

  let nf=E.length,nc=E[0].length,np=Math.min(nc,nf-1);if(np<0)np=0;
  function primerNoNuloCol(col,desde){for(let f=(desde??0);f<nf;f++)if(!_Z(E[f][col]))return f;return -1;}

  for(let c=0;c<np;c++){
    let pivRow=primerNoNuloCol(c,c);
    if(pivRow!==-1&&pivRow!==c){
      if(Matriz?.permutarFilas)E=Matriz.permutarFilas(E,c,pivRow);
      else {let tmp=E[c];E[c]=E[pivRow];E[pivRow]=tmp;}
      renderAutoCambiar(E.length,`F${c+1}↔F${pivRow+1}`,cloneM(E));
    }

    if(primerNoNuloCol(c,c)===c){
      for(let f=c+1;f<nf;f++){
        if(_Z(E[f][c]))continue;
        let piv=E[c][c],a=E[f][c],m2=cloneM(E);
        for(let k=0;k<nc;k++)E[f][k]=sub(mul(piv,m2[f][k]),mul(a,m2[c][k]));
        if(Matriz?.compararMatrices&&!Matriz.compararMatrices(E,m2)){
          let cad=`F${f+1}=${prettyCoef(piv)}F${f+1}+${prettyCoef(opp(a))}F${c+1}`;
          renderAutoCambiar(E.length,normCad(cad),cloneM(E));
        }
      }
    }

    if(Matriz?.filasNulasAbajo){
      let ant=cloneM(E);E=Matriz.filasNulasAbajo(E);
      if(Matriz?.compararMatrices&&!Matriz.compararMatrices(E,ant))renderAutoFilasAbajo(E.length,cloneM(E));
    }
    if(Matriz?.ordenarFilasPorCeros){
      let ant=cloneM(E);E=Matriz.ordenarFilasPorCeros(E);
      if(Matriz?.compararMatrices&&!Matriz.compararMatrices(E,ant))renderAutoOrdenar(E.length,cloneM(E));
    }
    nf=E.length;nc=E[0].length;np=Math.min(nc,nf-1);if(np<0)np=0;
    if(esEscalonadaLocal(E))break;
  }

  if(Matriz?.filasNulasAbajo){
    let ant=cloneM(E);E=Matriz.filasNulasAbajo(E);
    if(Matriz?.compararMatrices&&!Matriz.compararMatrices(E,ant))renderAutoFilasAbajo(E.length,cloneM(E));
  }
  if(Matriz?.ordenarFilasPorCeros){
    let ant=cloneM(E);E=Matriz.ordenarFilasPorCeros(E);
    if(Matriz?.compararMatrices&&!Matriz.compararMatrices(E,ant))renderAutoOrdenar(E.length,cloneM(E));
  }
  if(Matriz?.simplificarFilasNumericas){
    let ant=cloneM(E),Es=Matriz.simplificarFilasNumericas(cloneM(E));
    if(Matriz?.compararMatrices&&!Matriz.compararMatrices(Es,ant))renderAutoSimplificar(Es.length,cloneM(Es));E=Es;
  }
  if(Matriz?.eliminarFilasNulas){
    let ant=cloneM(E),En=Matriz.eliminarFilasNulas(cloneM(E));
    if(Matriz?.compararMatrices&&!Matriz.compararMatrices(En,ant))renderAutoEliminarNulas(En.length,cloneM(En));E=En;
  }
  mostrarResultadoFinalAutomatica(E);
}

function botonResolucionAutomatica(){
  let l=$("caja222");if(!l)return;rm($("botonautomatico"));
  let b=document.createElement("button");b.id="botonautomatico";b.innerHTML="SOLUCIÓN automática";l.appendChild(b);
  b.addEventListener("click",function(){
    rm($("botonautomatico"));S.orig=cloneM(S.val);matrizEscalonadaFn(S.ant);
  });
}

function insertarBotonOtraMatriz(){
  let ayuda=$("abreVentana1");if(!ayuda||!ayuda.parentNode)return;if($("otraMatrizBtn"))return;
  let b=document.createElement("button");b.id="otraMatrizBtn";b.innerHTML="Otra matriz";
  ayuda.parentNode.insertBefore(b,ayuda);b.addEventListener("click",e=>{e.preventDefault();window.location.reload();});
}

document.addEventListener("DOMContentLoaded",function(){
  crearNumeroFilas("caja11121","caja11112");
  msgOK("caja11112","Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");
  setupCaja1121();
  const abre=$("abreVentana1"),cierra=$("cierraVentana1"),vent=$("ventana1"),pdf=$("pdf1");
  const url="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
  if(abre)abre.addEventListener("click",e=>{e.preventDefault();if(pdf)pdf.src=url;if(vent)vent.style.display="flex";});
  if(cierra)cierra.addEventListener("click",()=>{if(vent)vent.style.display="none";if(pdf)pdf.src="";});
  window.addEventListener("click",e=>{if(e.target==vent){vent.style.display="none";if(pdf)pdf.src="";}});
  insertarBotonOtraMatriz();
});
