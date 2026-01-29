let ecuacion="",numeroEcuaciones=0,numeroIncognitas=0,nombreParametro="",contadorp=1,valores=[],matrizExpresiones=[],matrizExpresionesR=[],matrizActualExpresionesR=[],matrizActualExpresiones=[],matrizActualSustituida=[],matrizAntiguaExpresiones=[],matrizOriginal=[],matrizValoresCoeficientes=[],matrizValoresCoeficientesActual=[],primerNumeroNoNulo=[],coeficientes,expresion="",alturaPrimerHijo=0,bandera2=true,matrizActualExpresionesCopia=[],leyendaIncognitas=false,ordenLeyenda=[],primerHijo=true,numeroMatricesImprimidas=0,controlAltura=false,eliminar=false,casos=[],casosString=[],etapa="",casosAutomatico=[],filasMenor=[],columnasMenor=[],menorActual=[],matrizSustituida=[],rango=0,tipoCaso="",matrizSoluciones=[],numeroParametros=0,parametros=[],variablesPrincipales=[],casoUnico=true,pivotesUsados=[],pivotesUltimos=[];

function _$(id){return document.getElementById(id);}function _hide(el){if(!el)return;el.classList.add("isHidden");el.classList.remove("isFlex");el.classList.remove("isBlock");}
function _showFlex(el){if(!el)return;el.classList.remove("isHidden");el.classList.remove("isBlock");el.classList.add("isFlex");}
function _showBlock(el){if(!el)return;el.classList.remove("isHidden");el.classList.remove("isFlex");el.classList.add("isBlock");}
function _setOkEl(el){if(!el)return;el.classList.remove("txtErr");el.classList.add("txtOk");}
function _setErrEl(el){if(!el)return;el.classList.remove("txtOk");el.classList.add("txtErr");}
function _setOk(id){_setOkEl(_$(id));}function _setErr(id){_setErrEl(_$(id));}
let caja1=_$("caja1"),caja2=_$("caja2"),contenedorCaja3=_$("contenedorCaja3"),caja3=_$("caja3"),titulo3=_$("titulo3");
try{_hide(caja2);_hide(contenedorCaja3);}catch(e){}

function _simpl(s){return (s||"").toString().replace(/\s+/g,"");}
function _isZeroExpr(s){s=_simpl(s);return s==="0"||s===""}
function _algunPivoteUsadoSeAnula(v){if(v==null||!pivotesUsados||!pivotesUsados.length)return false;for(let i=0;i<pivotesUsados.length;i++){let p=pivotesUsados[i];if(!p||!p.expr)continue;try{let r=Resolver.sustituir(p.expr,nombreParametro,v);if(_isZeroExpr(r))return true;}catch(e){}}return false;}
function _pivotesDesdeEscalonada(mat){let piv=[];for(let i=0;i<mat.length;i++){for(let j=0;j<mat[0].length;j++){if(!_isZeroExpr(mat[i][j])){piv.push({i,j,expr:mat[i][j]});break;}}}return piv;}

let contenido=document.getElementById("caja1");
let caja11=document.createElement("div");caja1.appendChild(caja11);caja11.id="caja11";
let caja111=document.createElement("div");caja11.appendChild(caja111);caja111.id="caja111";
let caja1111=document.createElement("div");caja111.appendChild(caja1111);caja1111.id="caja1111";
let caja11111=document.createElement("div");caja1111.appendChild(caja11111);caja11111.id="caja11111";caja11111.innerHTML="INTRODUCCIÓN DE DATOS";
let caja11112=document.createElement("div");caja1111.appendChild(caja11112);caja11112.id="caja11112";caja11112.innerHTML="Valida todos los datos introducidos con la tecla ENTER del teclado";
let caja1112=document.createElement("div");caja111.appendChild(caja1112);caja1112.id="caja1112";
let caja11121=document.createElement("div");caja1112.appendChild(caja11121);caja11121.id="caja11121";
let caja11122=document.createElement("div");caja1112.appendChild(caja11122);caja11122.id="caja11122";
let caja11123=document.createElement("div");caja1112.appendChild(caja11123);caja11123.id="caja11123";
let caja112=document.createElement("div");caja112.id="caja112";
let caja12=document.createElement("div");caja1.appendChild(caja12);caja12.id="caja12";

function crearNumeroEcuaciones(){
  while(caja11121.firstChild){caja11121.removeChild(caja11121.firstChild);}
  let p1=document.createElement("p");p1.innerHTML="Nº de Ecuaciones";caja11121.appendChild(p1);
  let numeroecuaciones=document.createElement("input");numeroecuaciones.id="numeroecuaciones";numeroecuaciones.type="text";caja11121.appendChild(numeroecuaciones);
  let p2=document.createElement("p");p2.innerHTML="(Entre 1 y 5)";caja11121.appendChild(p2);
  numeroecuaciones.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
      try{
        _setOk("caja11112");document.getElementById("caja11112").innerHTML="Valida todos los datos introducidos con la tecla ENTER del teclado";
        if(numeroecuaciones.value.length===0){numeroecuaciones.value="";numeroecuaciones.focus();throw new Error("errorB");}
        if(numeroecuaciones.value.match(/^[0-9]+$/)===null){numeroecuaciones.value="";numeroecuaciones.focus();throw new Error("errorA");}
        numeroEcuaciones=Number(numeroecuaciones.value);
        if(numeroEcuaciones<1||numeroEcuaciones>5){numeroecuaciones.value="";numeroecuaciones.focus();throw new Error("errorA");}
        crearNumeroIncognitas();document.getElementById("numeroincognitas").focus();
      }catch(error){
        _setErr("caja11112");
        if(error.message==="errorA")document.getElementById("caja11112").innerHTML="Número de ecuaciones inválido.<br>Debe ser un entero entre 1 y 5.";
        if(error.message==="errorB")document.getElementById("caja11112").innerHTML="No has introducido nada.<br>Inténtalo otra vez por favor";
      }
    }
  });
}

function crearNumeroIncognitas(){
  while(caja11122.firstChild){caja11122.removeChild(caja11122.firstChild);}
  let p1=document.createElement("p");p1.innerHTML="Nº de Incógnitas";caja11122.appendChild(p1);
  let numeroincognitas=document.createElement("input");numeroincognitas.id="numeroincognitas";numeroincognitas.type="text";caja11122.appendChild(numeroincognitas);
  let p2=document.createElement("p");p2.innerHTML="(Entre 1 y 5)";caja11122.appendChild(p2);
  numeroincognitas.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
      try{
        _setOk("caja11112");document.getElementById("caja11112").innerHTML="Valida todos los datos introducidos con la tecla ENTER del teclado";
        if(numeroincognitas.value.length===0){numeroincognitas.value="";numeroincognitas.focus();throw new Error("errorB");}
        if(numeroincognitas.value.match(/^[0-9]+$/)===null){numeroincognitas.value="";numeroincognitas.focus();throw new Error("errorA");}
        numeroIncognitas=Number(numeroincognitas.value);
        if(numeroIncognitas<1||numeroIncognitas>5){numeroincognitas.value="";numeroincognitas.focus();throw new Error("errorA");}
        crearNombreParametro();document.getElementById("nombreParametro").focus();
      }catch(error){
        _setErr("caja11112");
        if(error.message==="errorA")document.getElementById("caja11112").innerHTML="Número de incógnitas inválido.<br>Debe ser un entero entre 1 y 5.";
        if(error.message==="errorB")document.getElementById("caja11112").innerHTML="No has introducido nada.<br>Inténtalo otra vez por favor";
      }
    }
  });
}

function crearNombreParametro(){
  while(caja11123.firstChild){caja11123.removeChild(caja11123.firstChild);}
  let p1=document.createElement("p");p1.innerHTML="Nombre del parámetro";caja11123.appendChild(p1);
  let nombreparametro=document.createElement("input");nombreparametro.id="nombreParametro";nombreparametro.type="text";caja11123.appendChild(nombreparametro);
  let p2=document.createElement("p");p2.innerHTML="(Una letra)";caja11123.appendChild(p2);
  nombreparametro.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
      try{
        _setOk("caja11112");document.getElementById("caja11112").innerHTML="Valida todos los datos introducidos con la tecla ENTER del teclado";
        if(nombreparametro.value.length===0){nombreparametro.value="";nombreparametro.focus();throw new Error("errorB");}
        if(nombreparametro.value.match(/^[a-zA-Z]$/)===null){nombreparametro.value="";nombreparametro.focus();throw new Error("errorA");}
        nombreParametro=nombreparametro.value;
        crearTabla();crearBotonValidar();
      }catch(error){
        _setErr("caja11112");
        if(error.message==="errorA")document.getElementById("caja11112").innerHTML="Nombre del parámetro inválido.<br>Debe ser una sola letra.";
        if(error.message==="errorB")document.getElementById("caja11112").innerHTML="No has introducido nada.<br>Inténtalo otra vez por favor";
      }
    }
  });
}

function crearTabla(){
  while(caja12.firstChild){caja12.removeChild(caja12.firstChild);}
  let tabla=document.createElement("table");caja12.appendChild(tabla);
  let filas=numeroEcuaciones,columnas=numeroIncognitas+1;
  valores=[];for(let i=0;i<filas;i++){valores.push([]);for(let j=0;j<columnas;j++)valores[i].push("0");}
  for(let i=0;i<filas;i++){
    let tr=document.createElement("tr");tabla.appendChild(tr);
    for(let j=0;j<columnas;j++){
      let td=document.createElement("td");tr.appendChild(td);
      let inp=document.createElement("input");inp.type="text";td.appendChild(inp);
    }
  }
  let inputs=tabla.getElementsByTagName("input");inputs[0].focus();
  for(let i=0;i<inputs.length;i++){
    inputs[i].addEventListener("keydown",function(event){
      if(event.key==="Enter"||event.key==="Tab"){
        _setOk("caja11112");
        let fila=this.parentNode.parentNode.rowIndex,columna=this.parentNode.cellIndex;
        try{
          let texto="^[0-9\\.,\\+\\-\\(\\)\\^\\*\\/"+nombreParametro+"]*$",regex1=new RegExp(texto);
          if(regex1.test(this.value)===false){this.value="";this.focus();throw new Error("errorC");}
          if(this.value.length===0)throw new Error("errorB");
          const abrirParentesis=(this.value.match(/\(/g)||[]).length,cerrarParentesis=(this.value.match(/\)/g)||[]).length,contadorParentesis=abrirParentesis-cerrarParentesis;
          if(contadorParentesis!==0){this.value="";this.focus();throw new Error("errorA");}
          valores[fila][columna]=this.value;
          let siguienteIndex=(i+1)%inputs.length;inputs[siguienteIndex].focus();if(event.key==="Tab")event.preventDefault();
          if(i===inputs.length-1){
            for(let i=0;i<valores.length;i++){let nCeros=valores[i].filter(num=>num==="0").length;if(nCeros===valores[0].length){valores.splice(i,1),numeroEcuaciones=numeroEcuaciones-1}}
            while(caja1111.firstChild){caja1111.removeChild(caja1111.firstChild);}
            matrizExpresiones=valores.map(arr=>arr.slice());matrizOriginal=valores.map(arr=>arr.slice());matrizActualExpresiones=valores.map(arr=>arr.slice());
            matrizActualExpresiones=Matriz.quitarDenominadores(matrizExpresiones)[0];
            let maauxx=matrizOriginal.map(arr=>arr.slice());casosAutomatico=Matriz.rangoPorCasosSistema(maauxx)[2];
            pivotesUsados=[];pivotesUltimos=[];
            if(Matriz.esMatrizEscalonada(matrizExpresiones)){casoUnico=true;etapa="inicial";estudiarSistemaEscalonadoGauss();}
            else{
              caja1111.innerHTML="EL SISTEMA HA SIDO INTRODUCIDO";
              _showBlock(caja1112);while(caja1112.firstChild){caja1112.removeChild(caja1112.firstChild);}
              while(caja112.firstChild){caja112.removeChild(caja112.firstChild);}
              let caja1121=document.createElement("div"),caja1122=document.createElement("div");caja1121.id="caja1121";caja1122.id="caja1122";
              let caja11211=document.createElement("div"),caja11212=document.createElement("div"),caja11221=document.createElement("div"),caja11222=document.createElement("div");
              caja11211.id="caja11211";caja11212.id="caja11212";caja11221.id="caja11221";caja11222.id="caja11222";
              caja112.appendChild(caja1121);caja112.appendChild(caja1122);caja1121.appendChild(caja11211);caja1121.appendChild(caja11212);caja1122.appendChild(caja11221);caja1122.appendChild(caja11222);
              let titulo1=document.createElement("h3");titulo1.innerHTML="EL SISTEMA INICIAL INTRODUCIDO ES:";caja11211.appendChild(titulo1);continuar();
            }
          }
        }catch(error){
          _setErr("caja11112");
          if(error.message==="errorC")document.getElementById("caja11112").innerHTML="Se ha introducido un dato erróneo.<br>Inténtalo otra vez por favor";
          if(error.message==="errorB")document.getElementById("caja11112").innerHTML="No has introducido nada.<br>Inténtalo otra vez por favor";
          if(error.message==="errorA")document.getElementById("caja11112").innerHTML="Los paréntesis no están balanceados.<br>Inténtalo otra vez por favor";
        }
      }
    });
  }
}

function continuar(){
  let caja11121=document.createElement("div"),caja11122=document.createElement("div"),caja11123=document.createElement("div"),caja11124=document.createElement("div");
  caja11121.id="caja11121";caja11122.id="caja11122";caja11123.id="caja11123";caja11124.id="caja11124";
  caja1112.appendChild(caja11121);caja1112.appendChild(caja11122);caja1112.appendChild(caja11123);caja1112.appendChild(caja11124);
  Representar.sistemaCompleto(matrizOriginal,caja11212);
  let titulo2=document.createElement("h3");titulo2.innerHTML="LA MATRIZ DE GAUSS INICIAL ES:";caja11221.appendChild(titulo2);
  _showFlex(caja2);
  Representar.matrizGaussCompleta(matrizOriginal,caja11222,leyendaIncognitas,ordenLeyenda);
  titulo3=document.getElementById("titulo3");titulo3.innerHTML="ESPACIO PARA MOSTRAR LOS TRABAJOS REALIZADOS POR EL USUARIO";
  Representar.matrizGaussCompleta(matrizOriginal,caja2,leyendaIncognitas,ordenLeyenda);
  if(!Matriz.compararMatrices(matrizOriginal,matrizActualExpresiones))
    {
      Representar.simboloMatrizEquivalente(matrizOriginal.length,caja2);
      Representar.matrizGaussCompleta(matrizActualExpresiones,caja2,leyendaIncognitas,ordenLeyenda);}
  primerHijo=true;alturaPrimerHijo=caja2.children[0].clientHeight*0.5;
  crearFormulario();
}

function crearFormulario(){
  while(caja111.firstChild)caja111.removeChild(caja111.firstChild);
  let tex1=document.createElement("h3");tex1.innerHTML="EL SISTEMA HA SIDO INTRODUCIDO";caja111.appendChild(tex1);
  let tex2=document.createElement("h4");tex2.innerHTML="Para resolverlo, se utilizará el MÉTODO DE GAUSS";caja111.appendChild(tex2);
  let titulo=document.createElement("h3");titulo.innerHTML="OPCIONES PARA MODIFICAR LA MATRIZ";caja12.appendChild(titulo);
  let caja121=document.createElement("div"),caja122=document.createElement("div"),caja123=document.createElement("div"),caja124=document.createElement("div"),caja125=document.createElement("div"),caja125bis=document.createElement("div");
  caja121.id="caja121";caja122.id="caja122";caja123.id="caja123";caja124.id="caja124";caja125.id="caja125";caja125bis.id="caja125bis";
  caja12.appendChild(caja121);caja12.appendChild(caja122);caja12.appendChild(caja123);caja12.appendChild(caja124);caja12.appendChild(caja125);caja12.appendChild(caja125bis);
  let caja1211=document.createElement("div"),caja1212=document.createElement("div");caja1211.id="caja1211";caja1212.id="caja1212";caja121.appendChild(caja1211);caja121.appendChild(caja1212);
  let caja1221=document.createElement("div"),caja1222=document.createElement("div");caja1221.id="caja1221";caja1222.id="caja1222";caja122.appendChild(caja1221);caja122.appendChild(caja1222);
  let caja1231=document.createElement("div"),caja1232=document.createElement("div");caja1231.id="caja1231";caja1232.id="caja1232";caja123.appendChild(caja1231);caja123.appendChild(caja1232);
  let caja1241=document.createElement("div"),caja1242=document.createElement("div");caja1241.id="caja1241";caja1242.id="caja1242";caja124.appendChild(caja1241);caja124.appendChild(caja1242);
  let caja1251=document.createElement("div"),caja1252=document.createElement("div");caja1251.id="caja1251";caja1252.id="caja1252";caja125.appendChild(caja1251);caja125.appendChild(caja1252);
  let caja1251bis=document.createElement("div"),caja1252bis=document.createElement("div");caja1251bis.id="caja1251bis";caja1252bis.id="caja1252bis";caja125bis.appendChild(caja1251bis);caja125bis.appendChild(caja1252bis);
  let caja126=document.createElement("div"),caja127=document.createElement("div"),caja128=document.createElement("div"),caja129=document.createElement("div");
  caja126.id="caja126";caja127.id="caja127";caja128.id="caja128";caja129.id="caja129";
  caja12.appendChild(caja126);caja12.appendChild(caja127);caja12.appendChild(caja128);caja12.appendChild(caja129);
  let opcion1=document.createElement("input");opcion1.type="radio";opcion1.value="opcion1";opcion1.name="option";opcion1.id="inputcorto1";caja1211.appendChild(opcion1);
  let etiquetaOpcion1=document.createElement("label");etiquetaOpcion1.innerHTML="Opción 1: Permutar el orden de dos filas";caja1211.appendChild(etiquetaOpcion1);
  let etiquetaOpcion1bis=document.createElement("label");etiquetaOpcion1bis.innerHTML="(F<sub>i</sub> ↔ F<sub>j</sub>)";caja1212.appendChild(etiquetaOpcion1bis);
  let opcion2=document.createElement("input");opcion2.type="radio";opcion2.value="opcion2";opcion2.name="option";opcion2.id="inputcorto2";caja1221.appendChild(opcion2);
  let etiquetaOpcion2=document.createElement("label");etiquetaOpcion2.innerHTML="Opción 2: Permutar el orden de dos columnas";caja1221.appendChild(etiquetaOpcion2);
  let etiquetaOpcion2bis=document.createElement("label");etiquetaOpcion2bis.innerHTML="(C<sub>i</sub> ↔ C<sub>j</sub>)";caja1222.appendChild(etiquetaOpcion2bis);
  let opcion3=document.createElement("input");opcion3.type="radio";opcion3.value="opcion3";opcion3.name="option";opcion3.id="inputcorto3";caja1231.appendChild(opcion3);
  let etiquetaOpcion3=document.createElement("label");etiquetaOpcion3.innerHTML="Opción 3: Reordenar las filas bajando las que más ceros tengan a su izquierda";caja1231.appendChild(etiquetaOpcion3);
  let etiquetaOpcion3bis=document.createElement("label");etiquetaOpcion3bis.innerHTML="(F↓)";caja1232.appendChild(etiquetaOpcion3bis);
  let opcion4=document.createElement("input");opcion4.type="radio";opcion4.value="opcion4";opcion4.name="option";opcion4.id="inputcorto4";caja1241.appendChild(opcion4);
  let etiquetaOpcion4=document.createElement("label");etiquetaOpcion4.innerHTML="Opción 4: Simplificar una fila dividiendo sus elementos por un número no nulo";caja1241.appendChild(etiquetaOpcion4);
  let etiquetaOpcion4bis=document.createElement("label");etiquetaOpcion4bis.innerHTML="(F<sub>a</sub>→1/m F<sub>a</sub>)";caja1242.appendChild(etiquetaOpcion4bis);
  let opcion5=document.createElement("input");opcion5.type="radio";opcion5.value="opcion5";opcion5.name="option";opcion5.id="inputcorto5";caja1251.appendChild(opcion5);
  let etiquetaOpcion5=document.createElement("label");etiquetaOpcion5.innerHTML="Opción 5: Cambiar una fila por una combinación lineal de ella y de otras";caja1251.appendChild(etiquetaOpcion5);
  let etiquetaOpcion5bis=document.createElement("label");etiquetaOpcion5bis.innerHTML="(F<sub>1</sub>=aF<sub>1</sub>+bF<sub>2</sub>+cF<sub>3</sub>)";caja1252.appendChild(etiquetaOpcion5bis);
  let opcion6=document.createElement("input");opcion6.type="radio";opcion6.value="opcion6";opcion6.name="option";opcion6.id="inputcorto6";caja1251bis.appendChild(opcion6);
  let etiquetaOpcion6=document.createElement("label");etiquetaOpcion6.innerHTML="Opción 6: Eliminar las filas nulas";caja1251bis.appendChild(etiquetaOpcion6);
  let etiquetaOpcion6bis=document.createElement("label");etiquetaOpcion6bis.innerHTML="(F<sub>nulas</sub>)";caja1252bis.appendChild(etiquetaOpcion6bis);
  let boton=document.createElement("button");boton.innerHTML="Seleccionar";caja126.appendChild(boton);
  let botonReset=document.createElement("button");botonReset.innerHTML="RESET";caja129.appendChild(botonReset);

  let opcionSeleccionada=null,uiNodes=[],lockReset=false;
  let _cmp=(Matriz&&typeof Matriz.compararMatrices==="function")?Matriz.compararMatrices:((typeof compararMatrices==="function")?compararMatrices:null);
  let _render=(typeof renderizarMatriz==="function")?renderizarMatriz:null;

  function _uncheck(){let r=document.querySelector('input[name="option"]:checked');if(r)r.checked=false;}
  function _clearUI(){caja127.innerHTML="";caja128.innerHTML="";uiNodes.length=0;opcionSeleccionada=null;_uncheck();}
  function _msgOk(s){_setOkEl(caja128);caja128.innerHTML=s||"";}
  function _msgErr(s){_setErrEl(caja128);caja128.innerHTML=s||"";}
  function _after(){Representar.matrizGaussCompleta(matrizActualExpresiones,caja2,leyendaIncognitas,ordenLeyenda);if(Matriz.esMatrizEscalonada(matrizActualExpresiones)){pivotesUltimos=_pivotesDesdeEscalonada(matrizActualExpresiones);etapa="";estudiarSistemaEscalonadoGauss();}}
  function _swapLeyenda(i,j){if(!Array.isArray(ordenLeyenda))return;let a=ordenLeyenda[i],b=ordenLeyenda[j];ordenLeyenda[i]=b;ordenLeyenda[j]=a;leyendaIncognitas=true;}
  function _parseNumFrac(raw){let s=(raw||"").toString().trim();if(!s.length)throw new Error("m");if(s.includes(","))s=s.replace(",",".");if(s.includes("/")){if(typeof pasarADecimal==="function"){let d=pasarADecimal(s);let n=parseFloat(d);if(!Number.isFinite(n))throw new Error("m");return {n,str:s};}let p=s.split("/");if(p.length!==2)throw new Error("m");let a=parseFloat(p[0]),b=parseFloat(p[1]);if(!Number.isFinite(a)||!Number.isFinite(b)||b===0)throw new Error("m");return {n:a/b,str:s};}let n=parseFloat(s);if(!Number.isFinite(n))throw new Error("m");return {n,str:s};}

  botonReset.addEventListener("click",function(){if(lockReset)return;_clearUI();});

  boton.addEventListener("click",function(){
    lockReset=true;let r=document.querySelector('input[name="option"]:checked');opcionSeleccionada=(r&&r.value)?r.value:null;_msgOk("");caja127.innerHTML="";
    switch(opcionSeleccionada){

      case "opcion1":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        let d1=document.createElement("div"),d2=document.createElement("div"),l1=document.createElement("label"),l2=document.createElement("label"),i1=document.createElement("input"),i2=document.createElement("input");
        d1.appendChild(l1);d1.appendChild(i1);d2.appendChild(l2);d2.appendChild(i2);caja127.appendChild(d1);caja127.appendChild(d2);uiNodes.push(d1,d2);
        l1.innerHTML="F<sub>i</sub>:"+"\u00A0".repeat(3)+"i=";l2.innerHTML="F<sub>j</sub>:"+"\u00A0".repeat(3)+"j=";i1.focus();
        let n=matrizActualExpresiones.length,f1=null,f2=null;
        i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");f1=Number(i1.value);if(!Number.isInteger(f1)||f1<1||f1>n)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_msgErr("La fila i no es válida.<br>Debe estar entre 1 y "+n+".");}});
        i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");f2=Number(i2.value);if(!Number.isInteger(f2)||f2<1||f2>n||f2===f1)throw 0;matrizActualExpresiones=Matriz.permutarFilas(matrizActualExpresiones,f1-1,f2-1);
          if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){Representar.simboloPermutarFilas(f1,f2,n,caja2);_after();}_clearUI();
        }catch(e){i2.value="";i2.focus();_msgErr("La fila j no es válida.<br>Debe estar entre 1 y "+n+" y ser distinta de i.");}});
        break;}

      case "opcion2":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        let d1=document.createElement("div"),d2=document.createElement("div"),l1=document.createElement("label"),l2=document.createElement("label"),i1=document.createElement("input"),i2=document.createElement("input");
        d1.appendChild(l1);d1.appendChild(i1);d2.appendChild(l2);d2.appendChild(i2);caja127.appendChild(d1);caja127.appendChild(d2);uiNodes.push(d1,d2);
        l1.innerHTML="C<sub>i</sub>:"+"\u00A0".repeat(3)+"i=";l2.innerHTML="C<sub>j</sub>:"+"\u00A0".repeat(3)+"j=";i1.focus();
        let m=matrizActualExpresiones[0].length,c1=null,c2=null;
        i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");c1=Number(i1.value);if(!Number.isInteger(c1)||c1<1||c1>m)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_msgErr("La columna i no es válida.<br>Debe estar entre 1 y "+m+".");}});
        i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");c2=Number(i2.value);if(!Number.isInteger(c2)||c2<1||c2>m||c2===c1)throw 0;matrizActualExpresiones=Matriz.permutarColumnas(matrizActualExpresiones,c1-1,c2-1);_swapLeyenda(c1-1,c2-1);
          if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){Representar.simboloPermutarColumnas(c1,c2,matrizActualExpresiones.length,caja2);_after();}_clearUI();
        }catch(e){i2.value="";i2.focus();_msgErr("La columna j no es válida.<br>Debe estar entre 1 y "+m+" y ser distinta de i.");}});
        break;}

      case "opcion3":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        matrizActualExpresiones=Matriz.reordenarFilas(matrizActualExpresiones);
        if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){Representar.simboloReordenarFilas(matrizActualExpresiones.length,caja2);_after();}_clearUI();
        break;}

      case "opcion4":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        let d1=document.createElement("div"),d2=document.createElement("div"),l1=document.createElement("label"),l2=document.createElement("label"),i1=document.createElement("input"),i2=document.createElement("input");
        d1.appendChild(l1);d1.appendChild(i1);d2.appendChild(l2);d2.appendChild(i2);caja127.appendChild(d1);caja127.appendChild(d2);uiNodes.push(d1,d2);
        l1.innerHTML="Fila a simplificar:"+"\u00A0".repeat(2)+"a=";l2.innerHTML="Divisor (m≠0):"+"\u00A0".repeat(2)+"m=";i1.focus();
        let n=matrizActualExpresiones.length,a=null,mv=null;
        i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");a=Number(i1.value);if(!Number.isInteger(a)||a<1||a>n)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_msgErr("La fila a no es válida.<br>Debe estar entre 1 y "+n+".");}});
        i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");let p=_parseNumFrac(i2.value);mv=p.n;if(!Number.isFinite(mv)||Math.abs(mv)<1e-12)throw 0;matrizActualExpresiones=Matriz.dividirFila(matrizActualExpresiones,a-1,p.str);
          if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){Representar.simboloSimplificarFila(a,p.str,matrizActualExpresiones.length,caja2);_after();}_clearUI();
        }catch(e){i2.value="";i2.focus();_msgErr("El divisor m no es válido.<br>Debe ser distinto de 0 (decimal o fracción).");}});
        break;}

      case "opcion5":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        let d=document.createElement("div"),l=document.createElement("label"),inp=document.createElement("input");
        d.appendChild(l);d.appendChild(inp);caja127.appendChild(d);uiNodes.push(d);
        l.innerHTML="Introduce la combinación (ej: F1=2F1-3F2):";inp.focus();
        inp.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{
          _msgOk("");let s=(inp.value||"").toString().trim();if(!s.length)throw 0;
          matrizActualExpresiones=Matriz.combinacionLinealFilas(matrizActualExpresiones,s);
          if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){Representar.simboloCombinacionLineal(s,matrizActualExpresiones.length,caja2);_after();}_clearUI();
        }catch(e){inp.value="";inp.focus();_msgErr("No se ha podido aplicar la combinación. Revisa el formato.");}});
        break;}

      case "opcion6":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        matrizActualExpresiones=Matriz.moverFilasNulasFinal(matrizActualExpresiones);
        if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){Representar.simboloEliminarFilasNulas(matrizActualExpresiones.length,caja2);_after();}_clearUI();
        break;}

      default:_msgErr("Selecciona una opción.");lockReset=false;break;
    }
    lockReset=false;
  });
}

function estudiarSistemaEscalonadoGauss(){
  _showBlock(contenedorCaja3);while(caja3.firstChild)caja3.removeChild(caja3.firstChild);
  let matUso=matrizActualExpresiones;if(!Matriz.esMatrizEscalonada(matUso))matUso=Matriz.escalonarMatrizNumerica(matUso);
  pivotesUltimos=_pivotesDesdeEscalonada(matUso);
  tipoCaso=Sistema.discutir(matUso);

  function _abrirModalEcuacion(){
    let ov=_$("modalEcuacion");if(ov)ov.remove();
    ov=document.createElement("div");ov.id="modalEcuacion";ov.className="modalOverlay";
    let box=document.createElement("div");box.className="modalBox";
    let h=document.createElement("h3");h.className="modalTitle";h.innerHTML="RESOLVER UNA ECUACIÓN";
    let row=document.createElement("div");row.className="modalRow";
    let lab=document.createElement("label");lab.innerHTML="Introduce la ecuación:";
    let inp=document.createElement("input");inp.type="text";inp.className="modalInput";
    let out=document.createElement("div");out.className="modalOut txtOk";
    let botRow=document.createElement("div");botRow.className="modalButtons";
    let cerrar=document.createElement("button");cerrar.innerHTML="CERRAR";
    let usar=document.createElement("button");usar.innerHTML="AÑADIR SOLUCIONES A CASOS";usar.disabled=true;
    row.appendChild(lab);row.appendChild(inp);botRow.appendChild(cerrar);botRow.appendChild(usar);
    box.appendChild(h);box.appendChild(row);box.appendChild(out);box.appendChild(botRow);ov.appendChild(box);document.body.appendChild(ov);
    function _close(){ov.remove();}
    cerrar.addEventListener("click",_close);ov.addEventListener("click",function(e){if(e.target===ov)_close();});
    let soluciones=null;inp.focus();
    inp.addEventListener("keydown",function(ev){
      if(ev.key!=="Enter")return;
      let ecu=(inp.value||"").toString().trim();
      if(!ecu.length){_setErrEl(out);out.innerHTML="No has introducido ninguna ecuación.";usar.disabled=true;soluciones=null;return;}
      try{let sol=Resolver.ecuacionValores(ecu);soluciones=sol;_setOkEl(out);out.innerHTML="Soluciones:<span class=\"ml8\">"+sol+"</span>";usar.disabled=false;}
      catch(e){_setErrEl(out);out.innerHTML="No se ha podido resolver la ecuación.";usar.disabled=true;soluciones=null;}
    });
    usar.addEventListener("click",function(){
      if(!soluciones)return;
      try{
        let sol=Array.isArray(soluciones)?soluciones.slice():soluciones;
        if(!Array.isArray(sol))sol=(sol&&sol.length!=null)?Array.from(sol):[sol];
        for(let i=0;i<sol.length;i++){
          let v=sol[i];if(typeof v==="string"&&v.includes("/")){let p=v.split("/");if(p.length===2)v=parseFloat(p[0]/p[1]);}
          let num=(typeof v==="number")?v:parseFloat(v);
          if(Number.isFinite(num)&&!casos.includes(num))casos.push(num);
          let s=(typeof fraccionContinua==="function")?fraccionContinua(num.toString(),long):num.toString();
          if(!casosString.includes(s))casosString.push(s);
        }
        let caja12412=_$("caja12412");if(caja12412)caja12412.innerHTML="CASOS: "+casosString;_close();
      }catch(e){_setErrEl(out);out.innerHTML="No se han podido añadir las soluciones a los casos.";}
    });
  }

  function _crearCajaCasoHeader(casoTxt){
    if(caja3&&!caja3.classList.contains("casosWrap"))caja3.classList.add("casosWrap");
    let card=document.createElement("div");card.className="casosCard";caja3.appendChild(card);

    let title=document.createElement("div");title.className="casosTitle";title.innerHTML=casoTxt;card.appendChild(title);
    let two=document.createElement("div");two.className="casosTwo";card.appendChild(two);

    let col1=document.createElement("div"),col2=document.createElement("div");col1.className="casosCol";col2.className="casosCol";two.appendChild(col1);two.appendChild(col2);
    let l11=document.createElement("div"),b11=document.createElement("div");l11.className="casosLabel";b11.className="casosBody";col1.appendChild(l11);col1.appendChild(b11);
    let l21=document.createElement("div"),b21=document.createElement("div");l21.className="casosLabel";b21.className="casosBody";col2.appendChild(l21);col2.appendChild(b21);

    let sol=document.createElement("div");sol.className="casosSol";card.appendChild(sol);
    return {caja31:card,caja311:title,caja31211:l11,caja31212:b11,caja31221:l21,caja31222:b21,caja314:sol,caja3122:col2};
  }

  function _resolverYpintarCasoValor(valorNum,txtCaso,esGeneral){
  let ui=_crearCajaCasoHeader(txtCaso),matInicial,matCaso;
  if(esGeneral){
    matInicial=matrizOriginal;ui.caja31211.innerHTML="EL SISTEMA INICIAL PARA ESTE CASO ES:";Representar.sistemaCompleto(matInicial,ui.caja31212);
    matCaso=matrizActualExpresiones;if(!Matriz.esMatrizEscalonada(matCaso))matCaso=Matriz.escalonarMatrizNumerica(matCaso);
    ui.caja31221.innerHTML="UNA MATRIZ ESCALONADA PARA ESTE CASO ES:";Representar.matrizGaussCompleta(matCaso,ui.caja31222,leyendaIncognitas,ordenLeyenda);
    tipoCaso=Sistema.discutir(matCaso);Representar.solucionesSistemaLineal(matCaso,ui.caja314,leyendaIncognitas,ordenLeyenda);return;
  }
  matInicial=Matriz.sustituir(matrizOriginal,nombreParametro,valorNum);ui.caja31211.innerHTML="EL SISTEMA INICIAL PARA ESTE VALOR ES:";Representar.sistemaCompleto(matInicial,ui.caja31212);
  let usarUsuario=!_algunPivoteUsadoSeAnula(valorNum);
  if(usarUsuario){matCaso=Matriz.sustituir(matrizActualExpresiones,nombreParametro,valorNum);if(!Matriz.esMatrizEscalonada(matCaso))matCaso=Matriz.escalonarMatrizNumerica(matCaso);}
  else{matCaso=Matriz.sustituir(matrizOriginal,nombreParametro,valorNum);matCaso=Matriz.escalonarMatrizNumerica(matCaso);}
  ui.caja31221.innerHTML="UNA MATRIZ ESCALONADA PARA ESTE VALOR ES:";Representar.matrizGaussCompleta(matCaso,ui.caja31222,leyendaIncognitas,ordenLeyenda);
  tipoCaso=Sistema.discutir(matCaso);Representar.solucionesSistemaLineal(matCaso,ui.caja314,leyendaIncognitas,ordenLeyenda);
}

  function _gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){let t=a%b;a=b;b=t}return a||1}
  function _normFracStr(s){s=(s||"").trim();if(!s.includes("/"))return s;let p=s.split("/");if(p.length!==2)throw new Error("f");let a=parseInt(p[0],10),b=parseInt(p[1],10);if(!Number.isInteger(a)||!Number.isInteger(b)||b===0)throw new Error("f");let sign=(a*b<0)?-1:1;a=Math.abs(a);b=Math.abs(b);let g=_gcd(a,b);a=a/g;b=b/g;return (sign<0?"-":"")+a+"/"+b;}
  function _parseValor(raw){
    raw=(raw||"").trim();if(raw==="G"||raw==="g")return {tipo:"G",raw:"G",str:"G",num:null};
    if(raw.includes("/")){let fr=_normFracStr(raw),q=fr.split("/");let a=parseInt(q[0],10),b=parseInt(q[1],10);return {tipo:"N",raw:raw,str:fr,num:a/b};}
    let s=raw.includes(",")?raw.replace(",","."):raw;let n=parseFloat(s);if(Number.isNaN(n))throw new Error("n");return {tipo:"N",raw:raw,str:raw,num:n};
  }
  function _hasCaso(v){
    let eps=1e-12;if(v.tipo==="G")return casos.includes("G")||casos.includes("g")||casosString.includes("G")||casosString.includes("g");
    let okNum=casos.some(x=>typeof x==="number"&&Math.abs(x-v.num)<=eps);
    let okStr=casosString.includes(v.raw)||casosString.includes(v.str)||casosString.includes(v.num.toString());
    return okNum||okStr;
  }
  function _removeCaso(v){
    let eps=1e-12;
    if(v.tipo==="G"){casos=casos.filter(x=>x!=="G"&&x!=="g");casosString=casosString.filter(x=>x!=="G"&&x!=="g");return;}
    casos=casos.filter(x=>typeof x!=="number"||Math.abs(x-v.num)>eps);
    casosString=casosString.filter(x=>x!==v.raw&&x!==v.str&&x!==v.num.toString());
  }

  if(casosAutomatico.length===0){
    tipoCaso="G";casoUnico=true;
    let lista1=document.createElement("div");lista1.innerHTML="Para este sistema, no hay NINGÚN CASO ESPECÍFICO del valor de \""+nombreParametro+"\" que haya que estudiar por separado.<br>";caja3.appendChild(lista1);
    let lista2=document.createElement("div");lista2.innerHTML="Para cualquier valor de \""+nombreParametro+"\" el sistema es siempre del mismo tipo.<br>";caja3.appendChild(lista2);
    let lista3=document.createElement("div");lista3.innerHTML="<br>Pulsa el botón \"CASO GENERAL\" para resolverlo.";caja3.appendChild(lista3);
    let botonEstudiar=document.createElement("button");botonEstudiar.innerHTML="CASO GENERAL";caja3.appendChild(botonEstudiar);
    botonEstudiar.addEventListener("click",function(){_resolverYpintarCasoValor(null,"CASO GENERAL",true);});
  }else{
    let intro=document.createElement("div");intro.innerHTML="Introduce los casos específicos (y luego el caso general G).";caja3.appendChild(intro);
    let row=document.createElement("div");row.className="rowFlexWrap mt8";caja3.appendChild(row);
    let lab=document.createElement("label");lab.innerHTML=nombreParametro+"=";row.appendChild(lab);
    let inputValor=document.createElement("input");row.appendChild(inputValor);
    let msg=document.createElement("div");msg.className="minH18 mt8 txtOk";caja3.appendChild(msg);inputValor.focus();
    inputValor.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;
      try{
        _setOkEl(msg);msg.innerHTML="";
        let v=_parseValor(inputValor.value);if(!_hasCaso(v)&&v.tipo!=="G")throw new Error("x");
        let txt=v.tipo==="G"?"CASO GENERAL":"CASO: "+nombreParametro+"="+(typeof fraccionContinua==="function"?fraccionContinua(v.num.toString(),long):v.num.toString());
        _resolverYpintarCasoValor(v.tipo==="G"?null:v.num,txt,v.tipo==="G");inputValor.value="";inputValor.focus();
      }catch(e){_setErrEl(msg);msg.innerHTML="Entrada no válida. Usa decimal (0.5), fracción (1/2) o G.";inputValor.value="";inputValor.focus();}
    });
    let btnEq=document.createElement("button");btnEq.innerHTML="RESOLVER ECUACIÓN";caja3.appendChild(btnEq);
    btnEq.addEventListener("click",function(){_abrirModalEcuacion();});
  }
}

crearNumeroEcuaciones();
