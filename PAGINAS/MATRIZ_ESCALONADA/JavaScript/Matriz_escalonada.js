var S={nf:0,nc:0,np:0,val:[],act:[],orig:[],ant:[],p:1,FS_MAT:"14px",FS_TIT:"16px",MB_TIT:"20px"};
function $(id){return document.getElementById(id);}function html(el,s){if(el)el.innerHTML=s;}
function rm(el){if(el)try{el.remove()}catch(_){}}
function normCad(c){c=(c??"").toString().replace(/\s+/g,"").replace(/,/g,".").replace(/\+\-/g,"-");
  c=c.replace(/=1F/g,"=F").replace(/\+1F/g,"+F").replace(/\-1F/g,"-F");c=c.replace(/=([+-]?)0F\d+/g,"=");
  c=c.replace(/[+\-]0F\d+/g,"");c=c.replace(/=\+/g,"=").replace(/\+\+/g,"+").replace(/\-\-/g,"+");
  c=c.replace(/\+\-/g,"-").replace(/\-\+/g,"-");return c.replace(/=$/,"");}
function _S(x){if(typeof Matriz!=="undefined"&&Matriz._S)return Matriz._S(x);return (x??"0").toString();}
function _Z(x){if(typeof Matriz!=="undefined"&&Matriz._Z)return Matriz._Z(x);
  let s=(x??"0").toString().trim().replace(/\s+/g,"").replace(/,/g,".");return s===""||s==="0"||s==="-0";}
function simp(s){s=(s??"0").toString().replace(/\s+/g,"").replace(/,/g,".");
  if(typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.simplificar)return ExpresionAlgebraica.simplificar(s);
  return s===""?"0":s;}
function opp(s){
  s=simp(s);if(_Z(s))return "0";
  if(typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.opuesto)return ExpresionAlgebraica.opuesto(s);
  if(s[0]==='-')return s.slice(1);if(s[0]==='+')return '-'+s.slice(1);return '-('+s+')';
}
function add(a,b){return simp(`(${a})+(${b})`);}function sub(a,b){return simp(`(${a})-(${b})`);}
function mul(a,b){return simp(`(${a})*(${b})`);}function divi(a,b){return simp(`(${a})/(${b})`);}
function cloneM(m){return (m??[]).map(r=>(r??[]).slice());}
function _eqM(a,b){
  if(typeof Matriz!=="undefined"&&Matriz.compararMatrices)return Matriz.compararMatrices(a,b);
  if(a===b)return true;if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length)return false;
  for(let i=0;i<a.length;i++){
    if(!Array.isArray(a[i])||!Array.isArray(b[i])||a[i].length!==b[i].length)return false;
    for(let j=0;j<a[i].length;j++)if((a[i][j]??"")!==((b[i][j]??"")))return false;
  }return true;
}
function tieneFracDec(m){
  if(!Array.isArray(m))return false;
  for(let i=0;i<m.length;i++)for(let j=0;j<(m[i]??[]).length;j++){
    let s=(m[i][j]??"").toString();if(s.includes("/")||s.includes("."))return true;
  }return false;
}

function normNumStr(v){let s=(v??"").toString().trim().replace(/\s+/g,"").replace(/,/g,".");return s===""?"0":s;}
function isNumStr(v){
  if(typeof Matriz!=="undefined"&&Matriz._isNum)return Matriz._isNum(v);
  let s=normNumStr(v);return /^[+\-]?\d+$/.test(s)||/^[+\-]?\d*\.\d+$/.test(s)||/^[+\-]?\d+\/[+\-]?\d+$/.test(s);
}
function msgOK(id,txt){let c=$(id);if(c){c.style.color="black";html(c,txt??"");}}
function msgERR(id,txt){let c=$(id);if(c){c.style.color="red";html(c,txt??"");}}

function activarScrollVerticalSiNecesario(el,maxHpx){
  if(!el)return;el.style.maxHeight=maxHpx+"px";el.style.overflowY="hidden";
  requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.overflowY=(el.scrollHeight>maxHpx)?"auto":"hidden";}));
}

function ocultarZonaUsuario(limpiar=true){let c=$("caja21");if(c){if(limpiar)html(c,"");c.style.display="none";}}
function ocultarZonaAutomatico(){
  let ids=["caja22","caja221","caja222"];for(let i=0;i<ids.length;i++){let e=$(ids[i]);if(e){html(e,"");e.style.display="none";}}
  let t=["tituloCaja22","tituloAutomatico","tituloSolucionAutomatica","textoCaja22"];for(let i=0;i<t.length;i++){let e=$(t[i]);if(e)e.style.display="none";}}
function ocultarTituloUsuario(){
  let t=["tituloCaja2","tituloUsuario","tituloSolucionUsuario","textoCaja2"];for(let i=0;i<t.length;i++){let e=$(t[i]);if(e)e.style.display="none";}}

function limpiarZonaOpcionesFinal(){
  let c12=$("caja12");if(c12)while(c12.firstChild)c12.removeChild(c12.firstChild);
  rm($("caja1111"));rm($("caja1112"));let c111=$("caja111");if(c111)c111.style.height="20px";
  let l12=$("caja12");if(l12){
    l12.style.display="block";let sp=document.createElement("div");l12.appendChild(sp);sp.style.height="30px";
    let d1=document.createElement("div"),d2=document.createElement("div");l12.appendChild(d1);l12.appendChild(d2);
    d1.style.display="flex";d1.style.fontSize="24px";d1.style.alignItems="center";d1.style.justifyContent="center";
    d1.innerHTML="LA MATRIZ OBTENIDA YA ES ESCALONADA";
    d2.style.display="flex";d2.style.fontSize="18px";d2.style.alignItems="center";d2.style.justifyContent="center";
    d2.innerHTML="(Se ofrece el resultado con las filas simplificadas)";}}

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
    for(let i=0;i<t.length;i++){if(t[i]==="(")bal++;else if(t[i]===")"){bal--;if(bal<0){ok=false;break;}}}
    if(!ok||bal!==0)break;s=t;
  }return s;
}
function prettyCoef(s){s=cleanCoef(s);if(needsParensCoef(s))return `(${s})`;return s;}

function getTiraUsuario(limpiar){
  let c21=$("caja21");if(!c21)return null;
  c21.style.display="block";c21.style.fontSize=S.FS_MAT;c21.style.padding="6px";c21.style.boxSizing="border-box";
  c21.style.overflowX="hidden";if(limpiar)html(c21,"");activarScrollVerticalSiNecesario(c21,260);
  let t=$("tiraUsuario");
  if(!t){
    t=document.createElement("div");t.id="tiraUsuario";t.style.display="flex";t.style.flexWrap="wrap";
    t.style.alignItems="center";t.style.alignContent="flex-start";t.style.gap="10px";t.style.rowGap="10px";
    t.style.maxWidth="100%";t.style.overflowX="hidden";t.style.boxSizing="border-box";c21.appendChild(t);
  }return t;
}
function addNodoUsuario(n){let t=getTiraUsuario(false);if(!t||!n)return;t.appendChild(n);activarScrollVerticalSiNecesario($("caja21"),260);}
function addMatrizUsuario(m){
  let cont=document.createElement("div");cont.style.display="inline-flex";cont.style.alignItems="center";
  cont.style.maxWidth="100%";cont.style.overflowX="hidden";cont.style.overflowY="hidden";cont.style.boxSizing="border-box";
  if(typeof Representar!=="undefined"&&Representar.matriz)Representar.matriz(m,cont);addNodoUsuario(cont);
}
function addSimboloUsuario(fn){
  let s=document.createElement("div");s.style.display="inline-flex";s.style.alignItems="center";s.style.margin="0 2px";
  if(fn)fn(s);addNodoUsuario(s);
}
function renderInicioUsuario(limpiar){getTiraUsuario(limpiar);
  if(S.intro&&Array.isArray(S.intro)&&S.intro.length&&!_eqM(S.intro,S.act)){addMatrizUsuario(S.intro);addSimboloUsuario(l=>{l.style.fontWeight="bold";l.innerHTML="≡";});}
  addMatrizUsuario(S.act);}

function renderPasoPermutar(a,b){
  addSimboloUsuario(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloPermutarFilas)Representar.simboloPermutarFilas(a,b,S.act.length,l);
    else l.innerHTML=`F<sub>${a}</sub>↔F<sub>${b}</sub>`;
  });addMatrizUsuario(S.act);
}
function renderPasoFilasAbajo(){
  addSimboloUsuario(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloFilasNulasAbajo)Representar.simboloFilasNulasAbajo(S.act.length,l);
    else l.innerHTML="F↓";
  });addMatrizUsuario(S.act);
}
function renderPasoDividir(a,b){
  addSimboloUsuario(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloDividirFila)Representar.simboloDividirFila(a,b,S.act.length,l);
    else l.innerHTML=`F<sub>${a}</sub>→1/${b}F<sub>${a}</sub>`;
  });addMatrizUsuario(S.act);
}
function renderPasoCambiar(cad){
  addSimboloUsuario(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloCambiarLinea){let x=normCad(cad);Representar.simboloCambiarLinea(x,S.act.length,l);}
    else l.innerHTML=(cad??"").toString();
  });addMatrizUsuario(S.act);
}
function renderPasoSimplificarUsuario(){
  addSimboloUsuario(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloSimplificarFilas)Representar.simboloSimplificarFilas(S.act.length,l);
    else l.innerHTML="simp";
  });addMatrizUsuario(S.act);
}
function getTiraAuto(limpiar){
  let c221=$("caja221");if(!c221)return null;
  c221.style.display="flex";c221.style.fontSize=S.FS_MAT;c221.style.maxWidth="100%";
  c221.style.overflowX="auto";c221.style.overflowY="auto";c221.style.padding="6px";c221.style.boxSizing="border-box";
  if(limpiar)html(c221,"");let t=$("tiraAuto");
  if(!t){
    t=document.createElement("div");t.id="tiraAuto";t.style.display="flex";t.style.flexWrap="wrap";
    t.style.alignItems="center";t.style.alignContent="flex-start";t.style.gap="10px";t.style.rowGap="10px";
    t.style.maxWidth="100%";t.style.boxSizing="border-box";c221.appendChild(t);
  }return t;
}
function addNodoAuto(n){let t=getTiraAuto(false);if(!t||!n)return;t.appendChild(n);}
function addMatrizAuto(m){
  let cont=document.createElement("div");cont.style.display="inline-flex";cont.style.alignItems="center";
  cont.style.maxWidth="100%";cont.style.overflowX="hidden";cont.style.overflowY="hidden";cont.style.boxSizing="border-box";
  if(typeof Representar!=="undefined"&&Representar.matriz)Representar.matriz(m,cont);addNodoAuto(cont);
}
function addSimboloAuto(fn){
  let s=document.createElement("div");s.style.display="inline-flex";s.style.alignItems="center";s.style.margin="0 2px";
  if(fn)fn(s);addNodoAuto(s);
}
function renderInicioAuto(m,limpiar){getTiraAuto(limpiar);addMatrizAuto(m);}
function renderPasoAutoFilasAbajo(nf,m){
  addSimboloAuto(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloFilasNulasAbajo)Representar.simboloFilasNulasAbajo(nf,l);
    else l.innerHTML="F↓";
  });addMatrizAuto(m);
}
function renderPasoAutoOrdenar(nf,m){
  addSimboloAuto(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloOrdenarFilasPorCeros)Representar.simboloOrdenarFilasPorCeros(nf,l);
    else if(typeof Representar!=="undefined"&&Representar.simboloFilasNulasAbajo)Representar.simboloFilasNulasAbajo(nf,l);
    else l.innerHTML="F↓";
  });addMatrizAuto(m);
}
function renderPasoAutoCambiar(nf,cad,m){
  addSimboloAuto(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloCambiarLinea){let x=normCad(cad);Representar.simboloCambiarLinea(x,nf,l);}
    else l.innerHTML=(cad??"").toString();
  });addMatrizAuto(m);
}
function renderPasoAutoSimplificar(nf,m){
  addSimboloAuto(function(l){
    if(typeof Representar!=="undefined"&&Representar.simboloSimplificarFilas)Representar.simboloSimplificarFilas(nf,l);
    else l.innerHTML="simp";
  });addMatrizAuto(m);
}

function finalizarSiEscalonadaUsuario(){
  if(typeof Matriz==="undefined"||!Matriz.esMatrizEscalonada)return false;
  if(!Matriz.esMatrizEscalonada(S.act))return false;
let res=cloneM(S.act);if(typeof Matriz!=="undefined"&&Matriz.simplificarFilasNumericas){let ant=cloneM(res);res=Matriz.simplificarFilasNumericas(res);
  if(typeof Matriz!=="undefined"&&Matriz.compararMatrices?!Matriz.compararMatrices(res,ant):JSON.stringify(res)!==JSON.stringify(ant)){
    S.act=cloneM(res);renderPasoSimplificarUsuario();}}
  html($("caja121"),"");html($("caja1221"),"");html($("caja1222"),"");html($("caja1223"),"");html($("caja1224"),"");
  html($("caja1225"),"");html($("caja1252"),"");html($("caja1231"),"");html($("caja1232"),"");html($("caja1241"),"");html($("caja1251"),"");
  limpiarZonaOpcionesFinal();let c1122=$("caja1122");if(c1122)c1122.style.display="block";
  html(c1122,"");let t1=document.createElement("div"),t2=document.createElement("div");c1122.appendChild(t1);c1122.appendChild(t2);
  t1.style.fontSize=S.FS_TIT;t1.style.fontWeight="bold";t1.style.margin="0 0 "+S.MB_TIT+" 0";
  t2.style.overflowX="auto";t2.style.overflowY="hidden";t2.style.maxWidth="100%";t2.style.fontSize=S.FS_MAT;
  t1.innerHTML="LA MATRIZ ESCALONADA SIMPLIFICADA ES: ";
  t2.style.display="flex";t2.style.alignItems="center";t2.style.justifyContent="center";
  let lab=document.createElement("div");t2.appendChild(lab);lab.style.fontWeight="bold";lab.style.fontSize=S.FS_MAT;lab.innerHTML="E=";
  if(typeof Representar!=="undefined"&&Representar.matriz)Representar.matriz(res,t2);
  return true;
}

function resetTrabajoUsuario(){
  html($("caja1231"),"");html($("caja1232"),"");msgOK("caja1241","");msgOK("caja1251","");
  let ops=document.getElementsByName("option");for(let k=0;k<ops.length;k++)if(ops[k].checked){ops[k].checked=false;break;}
}

function crearFormulario(){
  S.act=cloneM(S.val);S.orig=cloneM(S.val);S.ant=cloneM(S.val);
  let lt=$("caja121");if(lt){html(lt,"");let tit=document.createElement("h3");tit.innerHTML="OPCIONES PARA MODIFICAR LA MATRIZ";lt.appendChild(tit);}
  let l1=$("caja1221"),l2=$("caja1222"),l3=$("caja1223"),l4=$("caja1224"),l5=$("caja1225"),l6=$("caja1252");
  function addOpt(l,id,val,txt,sym){
    if(!l)return;let o=document.createElement("input");o.type="radio";o.value=val;o.name="option";o.id=id;l.appendChild(o);
    let a=document.createElement("label"),b=document.createElement("label");a.style.display="inline-block";a.style.width="75%";a.innerHTML=txt;b.innerHTML=sym;
    l.appendChild(a);l.appendChild(b);}
  addOpt(l1,"inputcorto1","opcion1","Opción 1: Permutar el orden de dos filas","F<sub>i</sub> ↔ F<sub>j</sub>");
  addOpt(l2,"inputcorto2","opcion2","Opción 2: Reordenar las filas dejando abajo las que más ceros tengan a la izquierda","F↓");
  addOpt(l3,"inputcorto3","opcion3","Opción 3: Simplificar los elementos de una fila dividiendolos por el mismo número","F<sub>a</sub>→1/mF<sub>a</sub>");
  addOpt(l4,"inputcorto4","opcion4","Opción 4: Cambiar una fila por una combinación lineal de ella y de otras filas","F<sub>i</sub>→aF<sub>i</sub>+bF<sub>j</sub>+cF<sub>k</sub>");
  if(l5){html(l5,"");let b=document.createElement("button");b.innerHTML="Seleccionar";l5.appendChild(b);b.addEventListener("click",onSelect);}
  if(l6){html(l6,"");let br=document.createElement("button");br.innerHTML="RESET";l6.appendChild(br);br.addEventListener("click",resetTrabajoUsuario);}
  html($("caja1231"),"");html($("caja1232"),"");msgOK("caja1241","");msgOK("caja1251","");renderInicioUsuario(true);
}

function onSelect(){
  html($("caja1231"),"");html($("caja1232"),"");msgOK("caja1241","");msgOK("caja1251","");
  let r=document.querySelector('input[name="option"]:checked'),opSel=(r&&r.value&&r.value!=="null")?r.value:null;
  if(!opSel){msgERR("caja1241","Elige una opción antes de pulsar Seleccionar.");return;}
  if(opSel==="opcion1")op1();else if(opSel==="opcion2")op2();else if(opSel==="opcion3")op3();else if(opSel==="opcion4")op4();
}

function op2(){
  if(typeof Matriz!=="undefined"&&Matriz.ordenarFilasPorCeros){
    let antes=cloneM(S.act);S.act=Matriz.ordenarFilasPorCeros(S.act);
    if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&Matriz.compararMatrices(S.act,antes)){
      msgERR("caja1241","LA MATRIZ YA ESTÁ ORDENADA. Elige otra opción");return;}}
  renderPasoFilasAbajo();html($("caja1231"),"");html($("caja1232"),"");
  let ops=document.getElementsByName("option");for(let k=0;k<ops.length;k++)if(ops[k].checked){ops[k].checked=false;break;}
  if(finalizarSiEscalonadaUsuario())return;
}

function op1(){
  let lf5=$("caja1231"),lf6=$("caja1232");if(!lf5||!lf6)return;
  let t=document.createElement("div");t.innerHTML="Introduce las dos filas a permutar y valida con ENTER en la segunda caja:";lf5.appendChild(t);
  let wrap=document.createElement("div");wrap.style.display="inline-flex";wrap.style.gap="8px";wrap.style.alignItems="center";lf6.appendChild(wrap);
  let lA=document.createElement("label"),lB=document.createElement("label");lA.innerHTML="Fila 1";lB.innerHTML="Fila 2";
  let iA=document.createElement("input"),iB=document.createElement("input");iA.type="text";iB.type="text";
  iA.style.width="44px";iB.style.width="44px";iA.style.padding="2px 4px";iB.style.padding="2px 4px";
  iA.inputMode="numeric";iB.inputMode="numeric";wrap.appendChild(lA);wrap.appendChild(iA);wrap.appendChild(lB);wrap.appendChild(iB);iA.focus();
  function exec(){
    try{
      msgOK("caja1251","");let A=parseInt(normNumStr(iA.value),10),B=parseInt(normNumStr(iB.value),10);
      if(!Number.isInteger(A)||!Number.isInteger(B)||A<1||B<1||A>S.act.length||B>S.act.length||A===B)throw 0;
      let ii=A-1,jj=B-1;
      S.act=Matriz.permutarFilas?Matriz.permutarFilas(S.act,ii,jj):(()=>{let m=cloneM(S.act);[m[ii],m[jj]]=[m[jj],m[ii]];return m;})();
      renderPasoPermutar(A,B);
      html($("caja1231"),"");html($("caja1232"),"");let ops=document.getElementsByName("option");
      for(let k=0;k<ops.length;k++)if(ops[k].checked){ops[k].checked=false;break;}
      if(finalizarSiEscalonadaUsuario())return;
    }catch(_){msgERR("caja1251","Datos no válidos. Usa enteros distintos y dentro del rango.");}}
  iA.addEventListener("keydown",function(e){if(e.key==="Enter")iB.focus();});
  iB.addEventListener("keydown",function(e){if(e.key==="Enter")exec();});
}

function op3(){
  let lf5=$("caja1231"),lf6=$("caja1232");if(!lf5||!lf6)return;
  let t=document.createElement("div");t.innerHTML="Introduce fila y divisor (entero, decimal o fracción); valida con ENTER:";lf5.appendChild(t);
  let wrap=document.createElement("div");wrap.style.display="inline-flex";wrap.style.gap="8px";wrap.style.alignItems="center";lf6.appendChild(wrap);
  let lA=document.createElement("label"),lB=document.createElement("label");lA.innerHTML="Fila";lB.innerHTML="Divisor";
  let iA=document.createElement("input"),iB=document.createElement("input");iA.type="text";iB.type="text";
  iA.style.width="44px";iB.style.width="72px";iA.style.padding="2px 4px";iB.style.padding="2px 4px";
  iA.inputMode="numeric";wrap.appendChild(lA);wrap.appendChild(iA);wrap.appendChild(lB);wrap.appendChild(iB);iA.focus();
  function exec(){
    try{
      msgOK("caja1251","");let a=parseInt(normNumStr(iA.value),10),m=normNumStr(iB.value);
      if(!Number.isInteger(a)||a<1||a>S.act.length||!isNumStr(m)||_Z(simp(m)))throw 0;
      let nueva=cloneM(S.act);for(let j=0;j<nueva[a-1].length;j++)nueva[a-1][j]=divi(nueva[a-1][j],m);
      S.act=nueva;renderPasoDividir(a,m);
      html($("caja1231"),"");html($("caja1232"),"");let ops=document.getElementsByName("option");
      for(let k=0;k<ops.length;k++)if(ops[k].checked){ops[k].checked=false;break;}
      if(finalizarSiEscalonadaUsuario())return;
    }catch(_){msgERR("caja1251","Datos no válidos. Fila válida y divisor numérico distinto de 0.");}}
  iA.addEventListener("keydown",function(e){if(e.key==="Enter")iB.focus();});
  iB.addEventListener("keydown",function(e){if(e.key==="Enter")exec();});
}

function aplicarCombinacionDesdeCadena(cad){
  if(typeof Matriz==="undefined"||!Matriz.cambiarFila)throw new Error("sinMetodo");
  S.act=Matriz.cambiarFila(S.act,cad);return {raw:(cad??"").toString()};}

function op4(){
  let lf5=$("caja1231"),lf6=$("caja1232");if(!lf5||!lf6)return;
  let lc=document.createElement("label"),ic=document.createElement("input");
  lc.innerHTML="Introduce la operación (ej: F1=2F1+F2+3F3):";lf5.appendChild(lc);lf6.appendChild(ic);ic.focus();
  function rhsIncluyeFilaNoNula(cad){
    cad=(cad??"").toString().replace(/\s+/g,"");let m=cad.match(/^F(\d+)=/i);if(!m)return false;
    let i=m[1],rhs=(cad.split("=")[1]??""),re=new RegExp(`([+\\-]?)([0-9.,/]*?)F${i}(?!\\d)`,"gi"),x;
    while((x=re.exec(rhs))!==null){
      let sign=x[1]==="-"?"-":"",coef=(x[2]??"");if(coef==="")return true;
      let v=normNumStr(sign+coef);if(isNumStr(v)&&!_Z(simp(v)))return true;}return false;}
  ic.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!=="Tab")return;
    try{
      msgOK("caja1251","");let cad=ic.value;aplicarCombinacionDesdeCadena(cad);
      if(!rhsIncluyeFilaNoNula(cad))throw 1;
      renderPasoCambiar(cad);
      html($("caja1231"),"");html($("caja1232"),"");let ops=document.getElementsByName("option");
      for(let k=0;k<ops.length;k++)if(ops[k].checked){ops[k].checked=false;break;}
      if(finalizarSiEscalonadaUsuario())return;
    }catch(e2){
      if(e2===1)msgERR("caja1251","Combinación no válida: el término F_i debe aparecer con coeficiente no nulo.");
      else msgERR("caja1251","Cadena no válida. Usa F1=2F1+F2+3F3 admitiendo enteros, fracciones o decimales.");}});}

function mostrarResultadoFinalAutomatica(E){
  let res=cloneM(E);if(typeof Matriz!=="undefined"&&Matriz.simplificarFilasNumericas)res=Matriz.simplificarFilasNumericas(res);
  limpiarZonaOpcionesFinal();let c1122=$("caja1122");if(c1122)c1122.style.display="block";
  html(c1122,"");let t1=document.createElement("div"),t2=document.createElement("div");c1122.appendChild(t1);c1122.appendChild(t2);
  t1.style.fontSize=S.FS_TIT;t1.style.fontWeight="bold";t1.style.margin="0 0 "+S.MB_TIT+" 0";
  t2.style.overflowX="auto";t2.style.overflowY="hidden";t2.style.maxWidth="100%";t2.style.fontSize=S.FS_MAT;
  t1.innerHTML="LA MATRIZ ESCALONADA SIMPLIFICADA ES: ";
  t2.style.display="flex";t2.style.alignItems="center";t2.style.justifyContent="center";
  let lab=document.createElement("div");t2.appendChild(lab);lab.style.fontWeight="bold";lab.style.fontSize=S.FS_MAT;lab.innerHTML="E=";
  if(typeof Representar!=="undefined"&&Representar.matriz)Representar.matriz(res,t2);
}

function matrizEscalonadaFn(matriz){
  matriz=cloneM(matriz);if(Array.isArray(matriz)&&matriz.length){S.nf=matriz.length;S.nc=matriz[0].length;}
  let E=cloneM(matriz);renderInicioAuto(E,true);
  if(typeof Matriz!=="undefined"&&Matriz.ordenarFilasPorCeros){
    let ant=cloneM(E);E=Matriz.ordenarFilasPorCeros(E);
    if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,ant))renderPasoAutoOrdenar(E.length,cloneM(E));
  }
  if(typeof Matriz!=="undefined"&&Matriz.filasNulasAbajo){
    let ant=cloneM(E);E=Matriz.filasNulasAbajo(E);
    if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,ant))renderPasoAutoFilasAbajo(E.length,cloneM(E));
  }
  if(typeof Matriz!=="undefined"&&Matriz.esMatrizEscalonada&&Matriz.esMatrizEscalonada(E)){
    if(typeof Matriz!=="undefined"&&Matriz.simplificarFilasNumericas){
      let ant=cloneM(E),Es=Matriz.simplificarFilasNumericas(cloneM(E));
      if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(Es,ant))renderPasoAutoSimplificar(Es.length,cloneM(Es));
      E=Es;
    }mostrarResultadoFinalAutomatica(E);return;
  }
  let nf=E.length,nc=E[0].length,np=(nf<=nc)?nf-1:nc;
  function primerNoNuloCol(col,desde){for(let f=(desde??0);f<nf;f++)if(!_Z(E[f][col]))return f;return -1;}
  for(let c=0;c<np;c++){
    if(primerNoNuloCol(c,c)===c){
      for(let f=c+1;f<nf;f++){
        if(_Z(E[f][c]))continue;
        let piv=E[c][c],a=E[f][c],m2=cloneM(E);
        for(let k=0;k<nc;k++)E[f][k]=sub(mul(piv,m2[f][k]),mul(a,m2[c][k]));
        if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,m2)){
          let cad=`F${f+1}=${prettyCoef(piv)}F${f+1}+${prettyCoef(opp(a))}F${c+1}`;cad=normCad(cad);
          renderPasoAutoCambiar(E.length,cad,cloneM(E));
        }
      }
    }else{
      if(primerNoNuloCol(c,c)===-1){
        for(let j=c+1;j<nc;j++){
          if(!_Z(E[c][j])){
            for(let f=c+1;f<nf;f++){
              if(_Z(E[f][j]))continue;
              let piv=E[c][j],a=E[f][j],m2=cloneM(E);
              for(let k=0;k<nc;k++)E[f][k]=sub(mul(piv,m2[f][k]),mul(a,m2[c][k]));
              if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,m2)){
                let cad=`F${f+1}=${prettyCoef(piv)}F${f+1}+${prettyCoef(opp(a))}F${c+1}`;cad=normCad(cad);
                renderPasoAutoCambiar(E.length,cad,cloneM(E));
              }
            }break;
          }
        }
      }
    }
    if(typeof Matriz!=="undefined"&&Matriz.filasNulasAbajo){
      let ant=cloneM(E);E=Matriz.filasNulasAbajo(E);
      if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,ant))renderPasoAutoFilasAbajo(E.length,cloneM(E));
    }
    if(typeof Matriz!=="undefined"&&Matriz.ordenarFilasPorCeros){
      let ant=cloneM(E);E=Matriz.ordenarFilasPorCeros(E);
      if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,ant))renderPasoAutoOrdenar(E.length,cloneM(E));
    }
    if(typeof Matriz!=="undefined"&&Matriz.esMatrizEscalonada&&Matriz.esMatrizEscalonada(E))break;
  }
  if(typeof Matriz!=="undefined"&&Matriz.filasNulasAbajo){
    let ant=cloneM(E);E=Matriz.filasNulasAbajo(E);
    if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,ant))renderPasoAutoFilasAbajo(E.length,cloneM(E));
  }
  if(typeof Matriz!=="undefined"&&Matriz.ordenarFilasPorCeros){
    let ant=cloneM(E);E=Matriz.ordenarFilasPorCeros(E);
    if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(E,ant))renderPasoAutoOrdenar(E.length,cloneM(E));
  }
  if(typeof Matriz!=="undefined"&&Matriz.simplificarFilasNumericas){
    let ant=cloneM(E),Es=Matriz.simplificarFilasNumericas(cloneM(E));
    if(typeof Matriz!=="undefined"&&Matriz.compararMatrices&&!Matriz.compararMatrices(Es,ant))renderPasoAutoSimplificar(Es.length,cloneM(Es));
    E=Es;
  }
  mostrarResultadoFinalAutomatica(E);
}

function botonResolucionAutomatica(){
  let l=$("caja222");if(!l)return;rm($("botonautomatico"));
  let b=document.createElement("button");b.id="botonautomatico";b.innerHTML="SOLUCIÓN automática";l.appendChild(b);
  b.addEventListener("click",function(){
    rm($("botonautomatico"));
    ocultarTituloUsuario();ocultarZonaUsuario();
    let c221=$("caja221");if(c221){c221.style.display="flex";c221.style.fontSize=S.FS_MAT;}
    matrizEscalonadaFn(S.ant);
  });
}

function crearNumeroFilas(lug,lugc){
  let l=$(lug);if(!l)return;html(l,"");
  let p=document.createElement("p");p.id="textosinmargen";p.appendChild(document.createTextNode("Nº de filas"));
  let i=document.createElement("input");i.id="nfilas";i.type="text";l.appendChild(p);l.appendChild(i);i.focus();
  let ok=true;i.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!=="Tab")return;
    try{if(!ok)msgOK(lugc,"Valida todos los datos introducidos con la tecla ENTER del teclado");
      S.nf=Number(i.value);if(isNaN(S.nf)||S.nf<1||!Number.isInteger(S.nf))throw 0;crearNumeroColumnas("caja11122","caja11112");
    }catch(_){ok=false;msgERR(lugc,"El nº de filas no es válido.<br>Debe ser un entero positivo.");i.value="";}});}

function crearNumeroColumnas(lug,lugc){
  let l=$(lug);if(!l)return;html(l,"");
  let p=document.createElement("p");p.id="textosinmargen";p.appendChild(document.createTextNode("Nº de columnas"));
  let i=document.createElement("input");i.id="ncolumnas";i.type="text";l.appendChild(p);l.appendChild(i);i.focus();
  let ok=true;i.addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!=="Tab")return;
    try{if(!ok)msgOK(lugc,"Valida todos los datos introducidos con la tecla ENTER del teclado");
      S.nc=Number(i.value);if(isNaN(S.nc)||S.nc<1||!Number.isInteger(S.nc))throw 0;crearMatrizVacia();
    }catch(_){ok=false;msgERR(lugc,"El nº de columnas no es válido.<br>Debe ser un entero positivo.");i.value="";}});}

function crearMatrizVacia(){
  let cont=$("caja1122");if(cont)html(cont,"");S.val=[];
  let marco=document.createElement("div");marco.id="marcoEntrada";marco.style.display="flex";
  marco.style.alignItems="center";marco.style.justifyContent="center";marco.style.gap="4px";
  marco.style.overflowX="auto";marco.style.maxWidth="100%";if(cont)cont.appendChild(marco);
  if(typeof Representar!=="undefined"&&Representar.abrirParentesis)Representar.abrirParentesis(S.nf,marco);
  let tabla=document.createElement("table");tabla.style.margin="0 auto";
  for(let i=0;i<S.nf;i++){
    let tr=document.createElement("tr"),fila=[];
    for(let j=0;j<S.nc;j++){let inp=document.createElement("input");inp.type="text";inp.value="";
      fila.push(null);let td=document.createElement("td");td.appendChild(inp);tr.appendChild(td);}
    S.val.push(fila);tabla.appendChild(tr);}
  marco.appendChild(tabla);
  if(typeof Representar!=="undefined"&&Representar.cerrarParentesis)Representar.cerrarParentesis(S.nf,marco);
  rellenarMatriz(tabla);
}

function finalizarEntrada(){
  let c1121=$("caja1121");let b1=document.createElement("div"),b2=document.createElement("div");
  if(c1121){c1121.appendChild(b1);c1121.appendChild(b2);}b1.id="caja11211";b2.id="caja11212";
  b2.style.flexWrap="nowrap";b2.style.justifyContent="center";b2.style.overflowX="auto";
  b2.style.overflowY="hidden";b2.style.maxWidth="100%";
  let tit=document.createElement("h3");tit.innerHTML="LA MATRIZ INICIAL ES:";tit.style.margin="0 0 "+S.MB_TIT+" 0";tit.style.fontSize=S.FS_TIT;
  let borrar=$("caja1122"),lugar=$("caja11212");if(lugar){lugar.style.display="flex";lugar.style.alignItems="center";}b1.appendChild(tit);
  let tx=document.createElement("div");tx.innerHTML="A=";b2.appendChild(tx);
let contMat=document.createElement("div");contMat.style.fontSize=S.FS_MAT;if(lugar)lugar.appendChild(contMat);

let mIn=cloneM(S.val),mInt=null;S.intro=null;
if(tieneFracDec(mIn)&&typeof Matriz!=="undefined"&&Matriz.quitarDenominadores){
  try{mInt=Matriz.quitarDenominadores(cloneM(mIn))[0];}catch(_){mInt=null;}
}
if(mInt&&Array.isArray(mInt)&&mInt.length&&!_eqM(mInt,mIn)){
  S.intro=cloneM(mIn);S.val=cloneM(mInt);
  html(contMat,"");contMat.style.display="flex";contMat.style.alignItems="center";contMat.style.gap="8px";
  let cA=document.createElement("div"),ceq=document.createElement("div"),cB=document.createElement("div");
  ceq.style.fontWeight="bold";ceq.innerHTML="≡";contMat.appendChild(cA);contMat.appendChild(ceq);contMat.appendChild(cB);
  if(typeof Representar!=="undefined"&&Representar.matriz){Representar.matriz(mIn,cA);Representar.matriz(S.val,cB);}
}else{
  if(typeof Representar!=="undefined"&&Representar.matriz)Representar.matriz(S.val,contMat);
}
activarScrollVerticalSiNecesario(b2,320);

  while(borrar&&borrar.firstChild){borrar.removeChild(borrar.firstChild);borrar.style.fontSize="20px";borrar.style.alignItems="center";}
  let lugarB=$("caja1112");while(lugarB&&lugarB.firstChild){lugarB.style.fontSize="20px";lugarB.removeChild(lugarB.firstChild);}
  if(typeof Matriz!=="undefined"&&Matriz.esMatrizEscalonada(S.val)){
    rm($("caja1111"));rm($("caja1112"));ocultarTituloUsuario();ocultarZonaUsuario();ocultarZonaAutomatico();limpiarZonaOpcionesFinal();
    let c1122=$("caja1122");if(c1122)c1122.style.display="block";html(c1122,"");
    let titS=document.createElement("h3"),boxS=document.createElement("div");c1122.appendChild(titS);c1122.appendChild(boxS);
    titS.style.fontWeight="bold";titS.style.margin="0 0 "+S.MB_TIT+" 0";titS.style.fontSize=S.FS_TIT;
    boxS.style.overflowX="auto";boxS.style.overflowY="hidden";boxS.style.maxWidth="100%";boxS.style.fontSize=S.FS_MAT;
    titS.innerHTML="LA MATRIZ ESCALONADA SIMPLIFICADA ES: ";
    let vals=cloneM(S.val);if(typeof Matriz!=="undefined"&&Matriz.simplificarFilasNumericas)vals=Matriz.simplificarFilasNumericas(vals);
    boxS.style.display="flex";boxS.style.alignItems="center";boxS.style.justifyContent="center";boxS.style.gap="6px";
    let labE=document.createElement("div");labE.style.fontWeight="bold";labE.style.fontSize=S.FS_MAT;labE.innerHTML="E=";boxS.appendChild(labE);
    if(typeof Representar!=="undefined"&&Representar.matriz)Representar.matriz(vals,boxS);
    if(typeof caja2borde!=="undefined"&&caja2borde)rm(caja2borde);return;
  }else{if(lugarB)html(lugarB,"LA MATRIZ INICIAL HA SIDO INTRODUCIDA");crearFormulario();botonResolucionAutomatica();}
}

function rellenarMatriz(tabla){
  let inputs=tabla.getElementsByTagName("input");if(inputs[0])inputs[0].focus();
  for(let i=0;i<inputs.length;i++)inputs[i].addEventListener("keydown",function(e){
    if(e.key!=="Enter"&&e.key!=="Tab")return;
    try{
      msgOK("caja11112","Valida todos los datos introducidos con la tecla ENTER del teclado");
      let f=this.parentNode.parentNode.rowIndex,col=this.parentNode.cellIndex;
      let v=normNumStr(this.value);if(!isNumStr(v))throw 0;S.val[f][col]=simp(v);
      if(i<inputs.length-1)inputs[i+1].focus();else finalizarEntrada();
    }catch(_){msgERR("caja11112","Valor no válido. Admite enteros, decimales y fracciones tipo 2/3.");inputs[i].value="";}});}

function insertarBotonOtraMatriz(){
  let ayuda=$("abreVentana1");if(!ayuda||!ayuda.parentNode)return;if($("otraMatrizBtn"))return;
  let b=document.createElement("button");b.id="otraMatrizBtn";b.innerHTML="Otra matriz";ayuda.parentNode.insertBefore(b,ayuda);
  b.addEventListener("click",function(e){e.preventDefault();window.location.reload();});
}

document.addEventListener("DOMContentLoaded",function(){
  crearNumeroFilas("caja11121","caja11112");let cInit=$("caja11112");
  if(cInit)html(cInit,"Valida todos los datos introducidos con la tecla ENTER del teclado");
  const a=$("abreVentana1"),c=$("cierraVentana1"),v=$("ventana1"),p=$("pdf1"),u="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
  if(a)a.addEventListener("click",function(e){e.preventDefault();if(p)p.src=u;if(v)v.style.display="flex";});
  if(c)c.addEventListener("click",function(){if(v)v.style.display="none";if(p)p.src="";});
  window.addEventListener("click",function(e){if(e.target==v){v.style.display="none";if(p)p.src="";}});
  insertarBotonOtraMatriz();
});
