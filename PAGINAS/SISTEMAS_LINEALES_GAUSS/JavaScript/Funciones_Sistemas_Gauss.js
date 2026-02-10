let numeroEcuaciones=0,numeroIncognitas=0,valores=[],matrizOriginalS=[],matrizActualS=[],matrizOriginalN=[],matrizActualN=[],
leyendaIncognitas=false,ordenLeyenda=[],tablaInput=null,autoBtn=null,autoReady=false,hayAlgoUsuario=false;

const caja1=document.getElementById("caja1"),caja11=document.getElementById("caja11"),caja12=document.getElementById("caja12"),
caja111=document.getElementById("caja111"),caja1111=document.getElementById("caja1111"),caja1112=document.getElementById("caja1112"),
caja11121=document.getElementById("caja11121"),caja11122=document.getElementById("caja11122"),caja112=document.getElementById("caja112"),
caja2=document.getElementById("caja2"),caja21=document.getElementById("caja21"),caja221=document.getElementById("caja221"),
caja222=document.getElementById("caja222"),letreroUsuario=document.getElementById("letreroUsuario");
let caja11112=document.getElementById("caja11112");

function _strip(s){return (s??"").toString().trim().replace(/\s+/g,"");}
function _clear(n){while(n&&n.firstChild)n.removeChild(n.firstChild);}
function _msgOk(s){caja11112.style.color="#dbeafe";caja11112.innerHTML=s||"";}
function _msgErr(s){caja11112.style.color="#fecaca";caja11112.innerHTML=s||"";}
function _cloneMat(m){return m.map(r=>r.slice());}
function _esCeroNum(x){return typeof x==="number"&&Number.isFinite(x)&&Math.abs(x)<=1e-12;}
function _gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){let t=a%b;a=b;b=t;}return a||1;}
function _lcm(a,b){a=Math.abs(a);b=Math.abs(b);return a/_gcd(a,b)*b;}
function _parseRacional(raw){
  let s=_strip(raw);if(!s.length)throw new Error("v");if(s.includes(","))s=s.replace(",",".");
  if(/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(s)){let n=parseFloat(s);if(!Number.isFinite(n))throw new Error("n");return n;}
  if(/^[-+]?\d+\/\d+$/.test(s)){let p=s.split("/"),a=parseInt(p[0],10),b=parseInt(p[1],10);
    if(!Number.isFinite(a)||!Number.isFinite(b)||b===0)throw new Error("f");return a/b;}
  throw new Error("f");
}
function _fracFromStr(s){
  s=_strip(s);if(!s.length)throw 0;if(s.includes(","))s=s.replace(",",".");
  if(/^[-+]?\d+\/\d+$/.test(s)){let p=s.split("/"),a=parseInt(p[0],10),b=parseInt(p[1],10);
    if(!Number.isFinite(a)||!Number.isFinite(b)||b===0)throw 0;let g=_gcd(a,b);a/=g;b/=g;if(b<0){a=-a;b=-b;}return {p:a,q:b};}
  if(/^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(s)){
    let sign=s.trim().startsWith("-")?-1:1,t=s.replace(/^[-+]/,"");if(!t.includes(".")){let a=sign*parseInt(t,10);return {p:a,q:1};}
    let parts=t.split("."),intp=parts[0]||"0",decp=parts[1]||"";let q=1;for(let i=0;i<decp.length;i++)q*=10;
    let p=sign*(parseInt(intp,10)*q+parseInt(decp||"0",10));let g=_gcd(p,q);p/=g;q/=g;if(q<0){p=-p;q=-q;}return {p,q};}
  throw 0;
}
function _matEquivalenteEntera(matS){
  let R=matS.length,C=matS[0].length,rowLCM=new Array(R).fill(1),has=false;
  for(let i=0;i<R;i++)for(let j=0;j<C;j++){let f=_fracFromStr(matS[i][j]);if(f.q!==1)has=true;rowLCM[i]=_lcm(rowLCM[i],Math.abs(f.q));}
  if(!has)return {has:false,mat:matS};
  let out=[];for(let i=0;i<R;i++){let row=[];for(let j=0;j<C;j++){let f=_fracFromStr(matS[i][j]),m=rowLCM[i];row.push(((f.p*(m/f.q))|0).toString());}out.push(row);}
  return {has:true,mat:out};
}
function _fracApprox(x,maxDen){
  if(!Number.isFinite(x))return null;let s=x<0?-1:1,v=Math.abs(x),a=Math.floor(v);
  if(Math.abs(v-a)<=1e-12)return {p:s*a,q:1};let h1=1,h0=0,k1=0,k0=1,b=v;
  for(let it=0;it<32;it++){
    let ai=Math.floor(b),h=ai*h1+h0,k=ai*k1+k0;if(k>maxDen)break;
    let r=v-h/k;if(Math.abs(r)<=1e-12)return {p:s*h,q:k};
    h0=h1;h1=h;k0=k1;k1=k;let frac=b-ai;if(frac<=1e-15)break;b=1/frac;
  }
  return null;
}
function _numToStr(x){
  if(!Number.isFinite(x))return "NaN";if(_esCeroNum(x))return "0";
  let r=Math.round(x);if(Math.abs(x-r)<=1e-12)return r.toString();
  let fr=_fracApprox(x,1000);if(fr&&fr.q!==1){let g=_gcd(fr.p,fr.q),p=fr.p/g,q=fr.q/g;if(Math.abs(x-p/q)<=1e-10)return p+"/"+q;}
  let s=x.toFixed(12).replace(/\.?0+$/,"");return s==="-0"?"0":s;
}
function _syncSfromN(){matrizActualS=matrizActualN.map(r=>r.map(_numToStr));}
function _cmpMatS(A,B){
  if(!Array.isArray(A)||!Array.isArray(B)||A.length!==B.length)return false;
  for(let i=0;i<A.length;i++){if(A[i].length!==B[i].length)return false;for(let j=0;j<A[i].length;j++)if(A[i][j]!==B[i][j])return false;}
  return true;
}
function _appendUsuario(matS,conSimboloEq){
  if(conSimboloEq&&hayAlgoUsuario)Representar.simboloMatrizEquivalente(matS.length,caja21);
  Representar.matrizGaussCompleta(matS,caja21,leyendaIncognitas,ordenLeyenda);hayAlgoUsuario=true;
}
function _appendUsuarioCambiarLinea(cad,n){if(hayAlgoUsuario&&Representar&&typeof Representar.simboloCambiarLinea==="function")Representar.simboloCambiarLinea(cad,n,caja21);}
function _pintarUserBaseline(){
  _clear(caja21);hayAlgoUsuario=false;_appendUsuario(matrizOriginalS,false);
  let eq=_matEquivalenteEntera(matrizOriginalS);if(eq.has&&!_cmpMatS(eq.mat,matrizOriginalS))_appendUsuario(eq.mat,true);
}
function _pintarSolucionEnCaja12(matS){
  _clear(caja12);let h=document.createElement("h3");h.style.margin="3px";h.style.padding="0px";h.innerHTML="SOLUCIÓN DEL SISTEMA";caja12.appendChild(h);
  let d=document.createElement("div");d.style.marginTop="8px";caja12.appendChild(d);
  Representar.solucionesSistemaLineal(matS,d,leyendaIncognitas,ordenLeyenda);
}
function _renderContinuar(){
  let t=document.getElementById("caja11111");if(t)t.innerHTML="INTRODUCCIÓN DE DATOS";
  caja1111.style.fontSize="20px";caja1111.style.display="flex";caja1111.style.justifyContent="center";caja1111.style.alignItems="center";caja1111.style.fontWeight="bold";
  caja1111.innerHTML="EL SISTEMA HA SIDO INTRODUCIDO";
  _clear(caja1112);_clear(caja112);
  caja112.style.display="flex";caja112.style.border="0px";caja112.style.width="99%";caja112.style.margin="0px";caja112.style.gap="10px";
  let caja1121=document.createElement("div"),caja1122=document.createElement("div");caja1121.id="caja1121";caja1122.id="caja1122";
  caja1121.style.display="block";caja1122.style.display="block";caja1121.style.width="55%";caja1122.style.width="55%";
  caja1121.style.height="107%";caja1122.style.height="107%";caja1121.style.padding="0px";caja1122.style.padding="0px";
  caja1121.style.marginTop="3px";caja1122.style.marginTop="3px";caja1121.style.border="1px solid black";caja1122.style.border="1px solid black";
  caja1121.style.marginRight="3px";caja1122.style.marginLeft="3px";caja112.appendChild(caja1121);caja112.appendChild(caja1122);
  let caja11211=document.createElement("div"),caja11212=document.createElement("div"),caja11221=document.createElement("div"),caja11222=document.createElement("div");
  caja11211.style.display="flex";caja11212.style.display="flex";caja11221.style.display="flex";caja11222.style.display="flex";
  caja11211.style.marginLeft="7px";caja11221.style.marginLeft="7px";caja11212.style.justifyContent="center";
  caja11212.style.alignItems="center";caja11222.style.justifyContent="center";caja11222.style.alignItems="center";
  caja1121.appendChild(caja11211);caja1121.appendChild(caja11212);caja1122.appendChild(caja11221);caja1122.appendChild(caja11222);
  let t1=document.createElement("h3");t1.style.marginBottom="15px";t1.style.marginTop="7px";t1.style.fontSize="17px";
  t1.innerHTML="EL SISTEMA INICIAL INTRODUCIDO ES:";caja11211.appendChild(t1);Representar.sistemaCompleto(matrizOriginalS,caja11212);
  let t2=document.createElement("h3");t2.style.fontSize="17px";t2.style.marginBottom="15px";t2.style.marginTop="7px";
  t2.innerHTML="LA MATRIZ DE GAUSS INICIAL ES:";caja11221.appendChild(t2);Representar.matrizGaussCompleta(matrizOriginalS,caja11222,leyendaIncognitas,ordenLeyenda);
  if(letreroUsuario)letreroUsuario.style.display="block";caja21.style.display="flex";
  _pintarUserBaseline();crearFormulario();_setupAutoUI();
}
function _setupAutoUI(){
  if(autoReady)return;autoReady=true;_clear(caja222);
  autoBtn=document.createElement("button");autoBtn.id="botonautomatico";autoBtn.innerHTML="SOLUCIÓN AUTOMÁTICA";caja222.appendChild(autoBtn);
  autoBtn.addEventListener("click",function(){resolverAutomaticoConPasosEnteros();});
}

function _swapLey(i,j){let a=ordenLeyenda[i],b=ordenLeyenda[j];ordenLeyenda[i]=b;ordenLeyenda[j]=a;leyendaIncognitas=true;}
function _permutarFilasN(mat,i,j){let t=mat[i];mat[i]=mat[j];mat[j]=t;return mat;}
function _permutarColsN(mat,i,j){for(let r=0;r<mat.length;r++){let t=mat[r][i];mat[r][i]=mat[r][j];mat[r][j]=t;}return mat;}
function _ordenarFilasPorCerosN(mat){
  function zLeft(row){let c=0;for(let j=0;j<row.length-1;j++){if(_esCeroNum(row[j]))c++;else break;}return c;}
  return mat.slice().sort((a,b)=>zLeft(b)-zLeft(a));
}
function _eliminarFilasNulasN(mat){
  let out=[];for(let i=0;i<mat.length;i++){let all=true;for(let j=0;j<mat[i].length;j++)if(!_esCeroNum(mat[i][j])){all=false;break;}if(!all)out.push(mat[i].slice());}
  return out;
}
function _afterPasoUsuario(){_syncSfromN();_appendUsuario(matrizActualS,true);if(Matriz.esMatrizEscalonada(matrizActualN))_pintarSolucionEnCaja12(matrizActualS);}

function crearNumeroEcuaciones(){
  _clear(caja11121);_clear(caja11122);_clear(caja112);_clear(caja12);_clear(caja21);_clear(caja221);_clear(caja222);hayAlgoUsuario=false;autoReady=false;
  caja1111.style.fontSize="";caja1111.style.display="flex";caja1111.style.flexDirection="column";caja1111.style.justifyContent="space-between";
  let t=document.getElementById("caja11111");if(t)t.innerHTML="INTRODUCCIÓN DE DATOS";_msgOk("Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");
  let p1=document.createElement("p"),p2=document.createElement("p"),p3=document.createElement("p"),inp=document.createElement("input");
  p1.style.fontSize="12px";p2.style.fontSize="12px";p3.style.fontSize="12px";p1.textContent="Nº de Ecuaciones";p3.textContent="(Entre 1 y 5)";
  inp.type="text";p2.appendChild(inp);caja11121.appendChild(p1);caja11121.appendChild(p2);caja11121.appendChild(p3);inp.focus();
  inp.addEventListener("keydown",function(ev){
    if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();
    try{_msgOk("Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");
      numeroEcuaciones=Number(inp.value);if(!Number.isInteger(numeroEcuaciones)||numeroEcuaciones<1||numeroEcuaciones>5)throw 0;
      crearNumeroIncognitas();
    }catch(e){inp.value="";inp.focus();_msgErr("El nº de ecuaciones no es válido.<br>Entero entre 1 y 5.");}
  });
}
function crearNumeroIncognitas(){
  _clear(caja11122);
  let p1=document.createElement("p"),p2=document.createElement("p"),p3=document.createElement("p"),inp=document.createElement("input");
  p1.style.fontSize="12px";p2.style.fontSize="12px";p3.style.fontSize="12px";p1.textContent="Nº de Incógnitas";p3.textContent="(Entre 1 y 5)";
  inp.type="text";inp.style.marginTop="4px";p2.appendChild(inp);caja11122.appendChild(p1);caja11122.appendChild(p2);caja11122.appendChild(p3);inp.focus();
  inp.addEventListener("keydown",function(ev){
    if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();
    try{_msgOk("Valida todos los datos introducidos con la tecla ENTER o TAB del teclado");
      numeroIncognitas=Number(inp.value);if(!Number.isInteger(numeroIncognitas)||numeroIncognitas<1||numeroIncognitas>5)throw 0;
      ordenLeyenda=[];for(let i=0;i<numeroIncognitas;i++)ordenLeyenda[i]=i+1;crearSistemaVacio();
    }catch(e){inp.value="";inp.focus();_msgErr("El nº de incógnitas no es válido.<br>Entero entre 1 y 5.");}
  });
}
function crearSistemaVacio(){
  _clear(caja112);valores=[];Representar.abrirLlave(1.75*numeroEcuaciones,caja112);
  let tabla=document.createElement("table");tablaInput=tabla;
  for(let i=0;i<numeroEcuaciones;i++){
    let tr=document.createElement("tr"),fila=[];
    for(let j=0;j<numeroIncognitas+1;j++){
      let td=document.createElement("td"),inp=document.createElement("input"),sp=document.createElement("span"),eq=document.createElement("span");
      inp.type="text";inp.value="";fila.push(null);td.style.textAlign="left";eq.innerHTML="=";
      if(j<numeroIncognitas-1)sp.innerHTML=" x<sub>"+(j+1)+"</sub> + ";
      if(j===numeroIncognitas-1)sp.innerHTML=" x<sub>"+(j+1)+"</sub> ";
      td.appendChild(inp);td.appendChild(sp);if(j===numeroIncognitas-1)td.appendChild(eq);tr.appendChild(td);
    }
    valores.push(fila);tabla.appendChild(tr);
  }
  caja112.appendChild(tabla);rellenarSistema(tabla);
}
function rellenarSistema(tabla){
  let inputs=tabla.getElementsByTagName("input");if(!inputs.length)return;inputs[0].focus();
  for(let i=0;i<inputs.length;i++){
    inputs[i].addEventListener("keydown",function(ev){
      if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();
      let fila=this.parentNode.parentNode.rowIndex,col=this.parentNode.cellIndex;
      try{
        let v=_strip(this.value);if(!v.length)throw new Error("B");_parseRacional(v);valores[fila][col]=v;
        let next=(i+1)%inputs.length;inputs[next].focus();if(ev.key==="Tab")ev.preventDefault();
        if(i!==inputs.length-1)return;
        for(let r=0;r<valores.length;r++){
          let z=0;for(let c=0;c<valores[r].length;c++){let n=_parseRacional(valores[r][c]);if(_esCeroNum(n))z++;}
          if(z===valores[0].length){valores.splice(r,1);numeroEcuaciones--;r--;}
        }
        matrizOriginalS=valores.map(r=>r.map(x=>_strip(x)));matrizOriginalN=matrizOriginalS.map(r=>r.map(_parseRacional));
        matrizActualN=_cloneMat(matrizOriginalN);matrizActualS=_cloneMat(matrizOriginalS);
        if(tablaInput&&tablaInput.parentNode)tablaInput.parentNode.removeChild(tablaInput);tablaInput=null;_renderContinuar();
      }catch(e){
        if(e.message==="B")_msgErr("No has introducido nada.<br>Inténtalo otra vez.");else _msgErr("Dato erróneo.<br>Usa entero, decimal o fracción a/b.");
        this.value="";this.focus();
      }
    });
  }
}

function crearFormulario(){
  _clear(caja12);
  let titulo=document.createElement("h3");titulo.style.margin="3px";titulo.style.padding="0px";titulo.innerHTML="OPCIONES PARA MODIFICAR LA MATRIZ";caja12.appendChild(titulo);
  let cont=document.createElement("div");cont.style.marginTop="8px";caja12.appendChild(cont);
  let ops=[["op1","Opción 1: Permutar el orden de dos filas","(Fᵢ ↔ Fⱼ)"],["op2","Opción 2: Permutar el orden de dos columnas","(Cᵢ ↔ Cⱼ)"],["op3","Opción 3: Reordenar filas (más ceros a la izquierda abajo)","(F↓)"],["op4","Opción 4: Dividir una fila por un número no nulo","(Fₐ→1/m Fₐ)"],["op5","Opción 5: Combinación lineal de filas","(F1=2F1-3/2F2+F3)"],["op6","Opción 6: Eliminar las filas nulas","(F nulas)"]];
  for(let k=0;k<ops.length;k++){
    let row=document.createElement("div");row.style.display="flex";row.style.alignItems="center";row.style.gap="8px";row.style.padding="6px 4px";row.style.borderBottom="1px solid #e5e7eb";
    let r=document.createElement("input");r.type="radio";r.name="opt";r.value=ops[k][0];
    let l=document.createElement("label");l.innerHTML=ops[k][1];
    let b=document.createElement("span");b.innerHTML=ops[k][2];b.style.color="#6b7280";b.style.fontWeight="800";b.style.fontSize="12px";
    row.appendChild(r);row.appendChild(l);row.appendChild(b);cont.appendChild(row);
  }
  let actions=document.createElement("div");actions.style.display="flex";actions.style.justifyContent="space-between";actions.style.gap="8px";actions.style.paddingTop="10px";caja12.appendChild(actions);
  let btn=document.createElement("button"),rst=document.createElement("button");btn.innerHTML="Seleccionar";rst.innerHTML="RESET";actions.appendChild(btn);actions.appendChild(rst);
  let ui=document.createElement("div");ui.style.marginTop="10px";caja12.appendChild(ui);
  let msg=document.createElement("div");msg.style.marginTop="8px";msg.style.fontSize="12px";msg.style.fontWeight="800";msg.style.color="#b91c1c";caja12.appendChild(msg);
  function _uncheck(){let r=document.querySelector('input[name="opt"]:checked');if(r)r.checked=false;}
  function _clr(){ui.innerHTML="";msg.innerHTML="";_uncheck();}
  function _err(s){msg.innerHTML=s||"";}
  rst.addEventListener("click",function(){_clr();});
  btn.addEventListener("click",function(){
    ui.innerHTML="";msg.innerHTML="";
    let r=document.querySelector('input[name="opt"]:checked'),opt=r?r.value:"";if(!opt){_err("Selecciona una opción.");return;}
    if(opt==="op1"){
      let d=document.createElement("div"),l1=document.createElement("label"),i1=document.createElement("input"),l2=document.createElement("label"),i2=document.createElement("input");
      d.style.display="flex";d.style.alignItems="center";d.style.gap="10px";l1.innerHTML="i=";l2.innerHTML="j=";
      i1.type="text";i2.type="text";ui.appendChild(d);d.appendChild(l1);d.appendChild(i1);d.appendChild(l2);d.appendChild(i2);i1.focus();
      let n=matrizActualN.length,f1=null;
      i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{f1=Number(i1.value);if(!Number.isInteger(f1)||f1<1||f1>n)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_err("Fila i no válida.");}});
      i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{let f2=Number(i2.value);if(!Number.isInteger(f2)||f2<1||f2>n||f2===f1)throw 0;
          _permutarFilasN(matrizActualN,f1-1,f2-1);_afterPasoUsuario();_clr();
        }catch(e){i2.value="";i2.focus();_err("Fila j no válida.");}});
      return;
    }
    if(opt==="op2"){
      let d=document.createElement("div"),l1=document.createElement("label"),i1=document.createElement("input"),l2=document.createElement("label"),i2=document.createElement("input");
      d.style.display="flex";d.style.alignItems="center";d.style.gap="10px";l1.innerHTML="i=";l2.innerHTML="j=";
      i1.type="text";i2.type="text";ui.appendChild(d);d.appendChild(l1);d.appendChild(i1);d.appendChild(l2);d.appendChild(i2);i1.focus();
      let m=matrizActualN[0].length-1,c1=null;
      i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{c1=Number(i1.value);if(!Number.isInteger(c1)||c1<1||c1>m)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_err("Columna i no válida.");}});
      i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{let c2=Number(i2.value);if(!Number.isInteger(c2)||c2<1||c2>m||c2===c1)throw 0;
          _permutarColsN(matrizActualN,c1-1,c2-1);_swapLey(c1-1,c2-1);_afterPasoUsuario();_clr();
        }catch(e){i2.value="";i2.focus();_err("Columna j no válida.");}});
      return;
    }
    if(opt==="op3"){matrizActualN=_ordenarFilasPorCerosN(matrizActualN);_afterPasoUsuario();_clr();return;}
    if(opt==="op4"){
      let d=document.createElement("div"),l1=document.createElement("label"),i1=document.createElement("input"),l2=document.createElement("label"),i2=document.createElement("input");
      d.style.display="flex";d.style.alignItems="center";d.style.gap="10px";l1.innerHTML="a=";l2.innerHTML="m=";
      i1.type="text";i2.type="text";ui.appendChild(d);d.appendChild(l1);d.appendChild(i1);d.appendChild(l2);d.appendChild(i2);i1.focus();
      let n=matrizActualN.length,a=null;
      i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{a=Number(i1.value);if(!Number.isInteger(a)||a<1||a>n)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_err("Fila a no válida.");}});
      i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();try{let m=_parseRacional(i2.value);if(_esCeroNum(m))throw 0;
          for(let j=0;j<matrizActualN[0].length;j++)matrizActualN[a-1][j]/=m;_afterPasoUsuario();_clr();
        }catch(e){i2.value="";i2.focus();_err("m no válido (≠0).");}});
      return;
    }
    if(opt==="op5"){
      let d=document.createElement("div"),lab=document.createElement("label"),inp=document.createElement("input");
      d.style.display="flex";d.style.alignItems="center";d.style.gap="10px";lab.innerHTML="Ej.: F1=2F1-3/2F2+F3";
      inp.type="text";inp.style.width="260px";ui.appendChild(d);d.appendChild(lab);d.appendChild(inp);inp.focus();
      function _splitTop(expr){
        let s=(expr||"").replace(/\s+/g,""),out=[],buf="",dep=0;
        for(let i=0;i<s.length;i++){let ch=s[i];if(ch==="(")dep++;else if(ch===")"){dep--;if(dep<0)throw 0;}
          if((ch==="+"||ch==="-")&&dep===0){if(buf.length)out.push(buf);buf=ch;}else buf+=ch;}
        if(dep!==0)throw 0;if(buf.length)out.push(buf);return out;
      }
      function _parseCL(cad,n){
        cad=(cad||"").replace(/\s+/g,"");let m=cad.match(/^F(\d+)=(.+)$/i);if(!m)throw 0;
        let lhs=Number(m[1]);if(!Number.isInteger(lhs)||lhs<1||lhs>n)throw 0;
        let rhs=m[2],partes=_splitTop(rhs);if(!partes.length)throw 0;let terms=[];
        for(let t of partes){
          let mm=t.match(/^([+\-]?)(.*?)(?:\*)?F(\d+)$/i);if(!mm)throw 0;
          let sgn=mm[1]||"+",coef=mm[2]||"",fila=Number(mm[3]);if(!Number.isInteger(fila)||fila<1||fila>n)throw 0;
          if(coef==="")coef="1";if(coef==="+")coef="1";if(coef==="-"||coef==="")coef="1";
          let c=_parseRacional((sgn==="-"?("-"+coef):coef));terms.push({fila,factor:c});
        }
        let self=terms.find(x=>x.fila===lhs);if(!self||_esCeroNum(self.factor))throw 0;return {lhs,terms};
      }
      inp.addEventListener("keydown",function(ev){
        if(ev.key!=="Enter"&&ev.key!=="Tab")return;ev.preventDefault();
        try{
          let cad=inp.value,n=matrizActualN.length,obj=_parseCL(cad,n),target=obj.lhs-1,terms=obj.terms,row=new Array(matrizActualN[0].length).fill(0);
          for(let j=0;j<matrizActualN[0].length;j++){let acc=0;for(let t of terms)acc+=matrizActualN[t.fila-1][j]*t.factor;row[j]=acc;}
          matrizActualN[target]=row;_syncSfromN();_appendUsuarioCambiarLinea(cad,n);_appendUsuario(matrizActualS,true);
          if(Matriz.esMatrizEscalonada(matrizActualN))_pintarSolucionEnCaja12(matrizActualS);_clr();
        }catch(e){_err("Formato no válido o coeficientes no numéricos.");inp.focus();}
      });
      return;
    }
    if(opt==="op6"){matrizActualN=_eliminarFilasNulasN(matrizActualN);_afterPasoUsuario();_clr();return;}
  });
}

/* AUTOMÁTICO: pasos con ENTEROS + símbolos de transformación de filas */
function _toBigIntMatFromStrInt(matS){let out=[];for(let i=0;i<matS.length;i++){let row=[];for(let j=0;j<matS[0].length;j++)row.push(BigInt(_strip(matS[i][j])||"0"));out.push(row);}return out;}
function _bigAbs(x){return x<0n?-x:x;}
function _bigGcd(a,b){a=_bigAbs(a);b=_bigAbs(b);while(b){let t=a%b;a=b;b=t;}return a||1n;}
function _bigRowGcd(row,from){let g=0n;for(let j=from;j<row.length;j++){let v=_bigAbs(row[j]);if(v===0n)continue;g=g===0n?v:_bigGcd(g,v);if(g===1n)break;}return g||1n;}
function _bigMatToStr(matB){let out=[];for(let i=0;i<matB.length;i++){let row=[];for(let j=0;j<matB[0].length;j++)row.push(matB[i][j].toString());out.push(row);}return out;}
function _escalonarEnteroConPasos(matStrInt){
  let A=_toBigIntMatFromStrInt(matStrInt),R=A.length,C=A[0].length,steps=[_bigMatToStr(A)],ops=[""],i=0,j=0;
  function push(op){steps.push(_bigMatToStr(A));ops.push(op||"");}
  while(i<R&&j<C-1){
    let piv=i;
    if(A[piv][j]===0n){
      let r=i+1;while(r<R&&A[r][j]===0n)r++;
      if(r===R){j++;continue;}
      piv=r;
      let t=A[i];A[i]=A[piv];A[piv]=t;push("F"+(i+1)+"\u2194F"+(piv+1));
    }
    let pv=A[i][j];
    for(let r=i+1;r<R;r++){
      let a=A[r][j];if(a===0n)continue;
      for(let c=j;c<C;c++)A[r][c]=pv*A[r][c]-a*A[i][c];
      push("F"+(r+1)+"="+pv.toString()+"F"+(r+1)+"-"+a.toString()+"F"+(i+1));
      let g=_bigRowGcd(A[r],j);if(g>1n){for(let c=j;c<C;c++)A[r][c]/=g;push("F"+(r+1)+"=(1/"+g.toString()+")F"+(r+1));}
    }
    i++;j++;
  }
  return {steps,ops};
}

function resolverAutomaticoConPasosEnteros(){
  if(!matrizOriginalS.length)return;
  if(letreroUsuario)letreroUsuario.style.display="none";caja21.style.display="none";_clear(caja21);hayAlgoUsuario=false;
  _clear(caja221);
  let eq=_matEquivalenteEntera(matrizOriginalS),baseInt=eq.has?eq.mat:matrizOriginalS.map(r=>r.map(x=>_strip(x)));
  for(let i=0;i<baseInt.length;i++)for(let j=0;j<baseInt[0].length;j++){
    let v=_strip(baseInt[i][j]);if(/^[-+]?\d+$/.test(v))continue;let f=_fracFromStr(v);baseInt[i][j]=f.p.toString();
  }
  let res=_escalonarEnteroConPasos(baseInt),pasos=res.steps,ops=res.ops,n=pasos[0].length;
  for(let k=0;k<pasos.length;k++){
    if(k>0){
      let cad=ops[k]||"";if(Representar&&typeof Representar.simboloCambiarLinea==="function"&&cad.length)Representar.simboloCambiarLinea(cad,n,caja221);
      else Representar.simboloMatrizEquivalente(n,caja221);
    }
    Representar.matrizGaussCompleta(pasos[k],caja221,leyendaIncognitas,ordenLeyenda);
  }
  _pintarSolucionEnCaja12(pasos[pasos.length-1]);
}

document.addEventListener("DOMContentLoaded",function(){
  const abreVentana1=document.getElementById("abreVentana1"),cierraVentana1=document.getElementById("cierraVentana1"),
  ventana=document.getElementById("ventana1"),pdf1=document.getElementById("pdf1");
  const pdf1URL="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
  if(abreVentana1&&cierraVentana1&&ventana&&pdf1){
    abreVentana1.addEventListener("click",function(e){e.preventDefault();pdf1.src=pdf1URL;ventana.style.display="flex";});
    cierraVentana1.addEventListener("click",function(){ventana.style.display="none";pdf1.src="";});
    window.addEventListener("click",function(e){if(e.target===ventana){ventana.style.display="none";pdf1.src="";}});
  }
  let otroSistema=document.getElementById("otroSistema");
  if(!otroSistema){otroSistema=document.createElement("button");otroSistema.id="otroSistema";otroSistema.innerHTML="OTRO SISTEMA";}
  let parent=abreVentana1&&abreVentana1.parentNode,btnHome=document.getElementById("btnHome");
  if(parent){
    if(btnHome&&btnHome.parentNode===parent)parent.insertBefore(otroSistema,btnHome);
    else parent.appendChild(otroSistema);
  }else document.body.appendChild(otroSistema);
  otroSistema.addEventListener("click",function(){window.location.reload();});
  crearNumeroEcuaciones();
});

