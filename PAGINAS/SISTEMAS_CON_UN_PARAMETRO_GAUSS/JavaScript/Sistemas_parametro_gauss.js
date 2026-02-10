let ecuacion="",numeroEcuaciones=0,numeroIncognitas=0,nombreParametro="",contadorp=1,valores=[],matrizExpresiones=[],matrizExpresionesR=[],matrizActualExpresionesR=[],matrizActualExpresiones=[],matrizActualSustituida=[],matrizAntiguaExpresiones=[],matrizOriginal=[],matrizValoresCoeficientes=[],matrizValoresCoeficientesActual=[],primerNumeroNoNulo=[],coeficientes,expresion="",alturaPrimerHijo=0,bandera2=true,matrizActualExpresionesCopia=[],leyendaIncognitas=false,ordenLeyenda=[],primerHijo=true,numeroMatricesImprimidas=0,controlAltura=false,eliminar=false,casos=[],casosString=[],etapa="",casosAutomatico=[],filasMenor=[],columnasMenor=[],menorActual=[],matrizSustituida=[],rango=0,tipoCaso="",matrizSoluciones=[],numeroParametros=0,parametros=[],variablesPrincipales=[],casoUnico=true,pivotesUsados=[],pivotesUltimos=[];

function _simpl(s){try{if(typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica&&typeof ExpresionAlgebraica.simplificar==="function")return ExpresionAlgebraica.simplificar(s);}catch(e){}return (s==null?"":s.toString());}
function _esCeroExpr(x){if(x===0||x==="0")return true;let s=(x==null?"":x.toString()).trim();if(!s.length)return false;if(s==="0"||s==="(0)")return true;let t=_simpl(s).trim();if(t==="0"||t==="(0)")return true;try{let u=_strip(t);while(u.length&&u[0]==="("&&u[u.length-1]===")"){u=u.slice(1,-1);u=_strip(u);}u=u.replace(/\s+/g,"");if(!/[a-zA-Z]/.test(u)){let val=null;if(/^[-+]?((\d+\.?\d*)|(\.\d+))(e[-+]?\d+)?$/i.test(u))val=parseFloat(u);else{let m=u.match(/^([-+]?((\d+\.?\d*)|(\.\d+))(e[-+]?\d+)?)\/([-+]?((\d+\.?\d*)|(\.\d+))(e[-+]?\d+)?)$/i);if(m){let a=parseFloat(m[1]),b=parseFloat(m[6]);if(Number.isFinite(a)&&Number.isFinite(b)&&b!==0)val=a/b;}}if(val!=null&&Number.isFinite(val)&&Math.abs(val)<1e-10)return true;}}catch(e){}return false;}
function _strip(s){return (s||"").toString().replace(/\s+/g,"");}
function _denomsTop(expr){expr=_strip(expr);if(!expr.length)return [];let dens=[],d=0;for(let i=0;i<expr.length;i++){let c=expr[i];if(c==="(")d++;else if(c===")"){d--;if(d<0)throw new Error("p");}if(c==="/"&&d===0){let rest=expr.slice(i+1);if(rest.length)dens.push(rest);break;}}return dens;}
function _primerNoNuloFila(f){if(!Array.isArray(f)||!f.length)return null;for(let j=0;j<f.length-1;j++)if(!_esCeroExpr(f[j]))return f[j];return null;}
function _registrarPivoteFila(idx){try{if(!Array.isArray(matrizActualExpresiones)||!matrizActualExpresiones[idx])return;let p=_primerNoNuloFila(matrizActualExpresiones[idx]);if(p==null)return;let s=p.toString();if(!pivotesUsados.includes(s))pivotesUsados.push(s);}catch(e){}}
function _registrarDenomsCoef(coef){try{for(let d of _denomsTop(coef))if(d&&!pivotesUsados.includes(d))pivotesUsados.push(d);}catch(e){}}
function _registrarDivisorUsado(mRaw){mRaw=_strip(mRaw);if(!mRaw.length)return;if(!pivotesUsados.includes(mRaw))pivotesUsados.push(mRaw);_registrarDenomsCoef(mRaw);}
function _algunPivoteUsadoSeAnula(v){if(!Array.isArray(pivotesUsados)||!pivotesUsados.length)return false;try{for(let k=0;k<pivotesUsados.length;k++){let e=pivotesUsados[k],aux=[[e]],s=Matriz.sustituir(aux,nombreParametro,v)[0][0];if(_esCeroExpr(s))return true;}}catch(err){return true;}return false;}
function _pivotesDesdeEscalonada(mat){let out=[];if(!Array.isArray(mat))return out;for(let i=0;i<mat.length;i++){let p=_primerNoNuloFila(mat[i]);if(p!=null)out.push(p.toString());}return out;}

caja1.id="caja1";caja1.style.height="auto";caja1.style.width="99%";caja1.style.border="2px solid black";caja1.style.display="flex";caja1.style.padding="5px";caja1.style.justifyContent="center";caja1.style.alignItems="center";
let caja11=document.createElement("div");caja1.appendChild(caja11);caja11.id="caja11";caja11.style.height="auto";caja11.style.width="60%";caja11.style.padding="0px";caja11.style.display="block";caja11.style.justifyContent="center";
let caja111=document.createElement("div");caja11.appendChild(caja111);caja111.id="caja111";caja111.style.height="auto";caja111.style.width="99%";caja111.style.display="flex";caja111.style.alignItems="center";caja111.style.padding="5px";
let caja1111=document.createElement("div");caja111.appendChild(caja1111);caja1111.id="caja1111";caja1111.style.height="auto";caja1111.style.width="50%";caja1111.style.display="block";caja1111.style.border="1px solid black";caja1111.style.marginRight="3px";
let caja11111=document.createElement("div");caja1111.appendChild(caja11111);caja11111.id="caja11111";caja11111.style.height="auto";caja11111.style.width="99%";caja11111.style.marginRight="3px";caja11111.style.fontWeight="bold";caja11111.style.fontSize="18px";caja11111.innerHTML="INTRODUCCIÓN DE DATOS";
let caja11112=document.createElement("div");caja1111.appendChild(caja11112);caja11112.id="caja11112";caja11112.style.height="auto";caja11112.style.width="99%";caja11112.style.padding="5px";caja11112.style.marginRight="3px";caja11112.style.fontSize="13px";caja11112.innerHTML="Valida todos los datos introducidos con la tecla ENTER o TAB del teclado";
let caja1112=document.createElement("div");caja111.appendChild(caja1112);caja1112.id="caja1112";caja1112.style.height="auto";caja1112.style.width="50%";caja1112.style.border="1px solid black";caja1112.style.marginLeft="3px";caja1112.style.display="flex";caja1112.style.justifyContent="center";caja1112.style.alignItems="center";
let caja11121=document.createElement("div");caja1112.appendChild(caja11121);caja11121.id="caja11121";caja11121.style.height="auto";caja11121.style.width="32%";caja11121.style.marginLeft="3px";caja11121.style.display="block";
let caja11122=document.createElement("div");caja1112.appendChild(caja11122);caja11122.id="caja11122";caja11122.style.height="auto";caja11122.style.width="32%";caja11122.style.display="block";caja11122.style.marginLeft="3px";caja11122.style.display="block";
let caja11123=document.createElement("div");caja1112.appendChild(caja11123);caja11123.id="caja11123";caja11123.style.height="auto";caja11123.style.width="32%";caja11123.style.marginLeft="3px";caja11123.style.display="block";
let caja112=document.createElement("div");caja112.id="caja112";caja112.style.display="flex";caja112.style.alignItems="center";caja112.style.height="auto";caja112.style.width="98%";caja112.style.border="1px solid black";caja112.style.padding="5px";caja112.style.margin="3px";caja112.style.marginLeft="5px";
let caja12=document.createElement("div");caja1.appendChild(caja12);caja12.id="caja12";caja12.style.height="auto";caja12.style.width="40%";caja12.style.display="block";caja12.style.padding="5px";caja12.style.marginRight="3px";caja12.style.marginTop="2px";caja12.style.alignItems="center";
caja2.style.marginBottom="5px";
let texto1=document.createTextNode("Nº de Ecuaciones"),texto2=document.createTextNode("(Entre 1 y 5)"),lugarTexto1=document.createElement("p"),lugarTexto2=document.createElement("p");
lugarTexto1.style.fontSize="12px";lugarTexto2.style.fontSize="12px";lugarTexto1.appendChild(texto1);lugarTexto2.appendChild(texto2);
let texto3=document.createTextNode("Nº de Incógnitas"),texto4=document.createTextNode("(Entre 1 y 5)"),lugarTexto3=document.createElement("p"),lugarTexto4=document.createElement("p");
lugarTexto3.style.fontSize="12px";lugarTexto4.style.fontSize="12px";lugarTexto3.appendChild(texto3);lugarTexto4.appendChild(texto4);
let texto5=document.createTextNode("Nombre del parámetro"),texto6=document.createTextNode("(Letra minúscula)"),lugarTexto5=document.createElement("p"),lugarTexto6=document.createElement("p");
lugarTexto5.style.fontSize="12px";lugarTexto6.style.fontSize="12px";lugarTexto5.appendChild(texto5);lugarTexto6.appendChild(texto6);

crearNumeroEcuaciones();

function crearNumeroEcuaciones(){
  let nEcuaciones=document.createElement("input");nEcuaciones.type="text";
  let lugarInputNumeroEcuaciones=document.createElement("p");lugarInputNumeroEcuaciones.appendChild(nEcuaciones);
  caja11121.appendChild(lugarTexto1);caja11121.appendChild(lugarInputNumeroEcuaciones);caja11121.appendChild(lugarTexto2);
  nEcuaciones.focus();
  nEcuaciones.addEventListener("keydown",function(event){
    if(event.key==="Enter"||event.key==="Tab"){event.preventDefault();event.preventDefault();
      try{
        document.getElementById("caja11112").style.color="black";document.getElementById("caja11112").innerHTML="Valida todos los datos introducidos con la tecla ENTER o TAB del teclado";
        numeroEcuaciones=Number(nEcuaciones.value);
        if(isNaN(numeroEcuaciones)||numeroEcuaciones<1||numeroEcuaciones>5||Number.isInteger(numeroEcuaciones)===false){nEcuaciones.value="";throw new Error();}
        crearnumeroIncognitas();
      }catch(error){
        document.getElementById("caja11112").style.color="red";
        document.getElementById("caja11112").innerHTML="El carácter introducido en el nº de ecuaciones no es válido.<br> Debe ser un número entero comprendido entre 1 y 5.<br> Inténtalo otra vez por favor";
      }
    }
  });
}

function crearnumeroIncognitas(){
  let nIncognitas=document.createElement("input");nIncognitas.type="text";nIncognitas.style.marginTop="4px";
  let lugarInputNumeroIncognitas=document.createElement("p");lugarInputNumeroIncognitas.appendChild(nIncognitas);
  caja11122.appendChild(lugarTexto3);caja11122.appendChild(lugarInputNumeroIncognitas);caja11122.appendChild(lugarTexto4);
  let nombreParametro=document.createElement("input");nombreParametro.type="text";
  let lugarInputnumeroIncognitas=document.getElementById("caja11122");
  lugarInputnumeroIncognitas.appendChild(lugarTexto3);lugarInputnumeroIncognitas.appendChild(nIncognitas);lugarInputnumeroIncognitas.appendChild(lugarTexto4);
  nIncognitas.focus();
  nIncognitas.addEventListener("keydown",function(event){
    if(event.key==="Enter"||event.key==="Tab"){event.preventDefault();event.preventDefault();
      try{
        document.getElementById("caja11112").style.color="black";document.getElementById("caja11112").innerHTML="Valida todos los datos introducidos con la tecla ENTER o TAB del teclado";
        numeroIncognitas=Number(nIncognitas.value);
        if(isNaN(numeroIncognitas)||numeroIncognitas<1||numeroIncognitas>5||Number.isInteger(numeroIncognitas)===false){nIncognitas.value="";throw new Error();}
        for(let i=0;i<numeroIncognitas;i++){ordenLeyenda[i]=i+1}
        crearNombreParametro();
      }catch(error){
        document.getElementById("caja11112").style.color="red";
        document.getElementById("caja11112").innerHTML="El carácter introducido en el nº de incógnitas no es válido. <br>Debe ser un número entero comprendido entre 1 y 5. <br>Inténtalo otra vez por favor";
      }
    }
  });
}

function crearNombreParametro(){
  let nParametro=document.createElement("input");nParametro.type="text";
  let lugarInputNombreParametro=document.createElement("p");lugarInputNombreParametro.appendChild(nParametro);
  caja11123.appendChild(lugarTexto5);caja11123.appendChild(lugarInputNombreParametro);caja11123.appendChild(lugarTexto6);
  nParametro.focus();
  nParametro.addEventListener("keydown",function(event){
    if(event.key==="Enter"||event.key==="Tab"){event.preventDefault();event.preventDefault();
      try{
        document.getElementById("caja11112").style.color="black";document.getElementById("caja11112").innerHTML="Valida todos los datos introducidos con la tecla ENTER o TAB del teclado";
        nombreParametro=nParametro.value;
        if(isNaN(nombreParametro)===false||nombreParametro.toLowerCase()!==nombreParametro||nombreParametro.length!==1){nParametro.value="";throw new Error();}
        caja11.appendChild(caja112);crearSistemaVacio();
      }catch(error){
        document.getElementById("caja11112").style.color="red";
        document.getElementById("caja11112").innerHTML="El nombre del parámetro conviene que sea una letra minúscula.<br> Inténtalo otra vez por favor";
      }
    }
  });
}

function crearSistemaVacio(){
  let contenedorMatriz=document.getElementById("caja112");Representar.abrirLlave(1.75*numeroEcuaciones,contenedorMatriz);
  let tabla=document.createElement("table");
  for(let i=0;i<numeroEcuaciones;i++){
    let fila=document.createElement("tr"),filaMatriz=[];
    for(let j=0;j<numeroIncognitas+1;j++){
      let input=document.createElement("input");input.type="text";input.value="";filaMatriz.push(null);
      let celda=document.createElement("td");celda.style.textAlign="left";
      let texto=document.createElement("span"),igual=document.createElement("span");igual.innerHTML="=";
      if(j<numeroIncognitas-1){texto.innerHTML=" x<sub>"+(j+1)+"</sub> + ";}
      if(j===numeroIncognitas-1){texto.innerHTML=" x<sub>"+(j+1)+"</sub> ";}
      celda.appendChild(input);celda.appendChild(texto);if(j===numeroIncognitas-1){celda.appendChild(igual);}
      fila.appendChild(celda);
    }
    valores.push(filaMatriz);tabla.appendChild(fila);
  }
  contenedorMatriz.appendChild(tabla);rellenarSistema(tabla);
}

function rellenarSistema(tabla){
  let inputs=tabla.getElementsByTagName("input");inputs[0].focus();
  for(let i=0;i<inputs.length;i++){
    inputs[i].addEventListener("keydown",function(event){
      if(event.key==="Enter"||event.key==="Tab"){event.preventDefault();
        document.getElementById("caja11112").style.color="black";
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
              caja1111.style.fontSize="20px";caja1111.style.display="flex";caja1111.style.justifyContent="center";caja1111.style.alignItems="center";caja1111.style.fontWeight="bold";caja1111.innerHTML="EL SISTEMA HA SIDO INTRODUCIDO";
              caja1112.style.display="block";while(caja1112.firstChild){caja1112.removeChild(caja1112.firstChild);}
              while(caja112.firstChild){caja112.removeChild(caja112.firstChild);}
              caja112.style.fontSize="15px";caja112.style.display="flex";caja112.style.border="0px";caja112.style.width="99%";caja112.style.margin="0px";
              let caja1121=document.createElement("div"),caja1122=document.createElement("div");caja1121.id="caja1121";caja1122.id="caja1122";
              caja1121.style.display="block";caja1122.style.display="block";caja1121.style.width="55%";caja1122.style.width="55%";caja1121.style.height="107%";caja1122.style.height="107%";
              caja1121.style.padding="0px";caja1122.style.padding="0px";caja1121.style.marginTop="3px";caja1122.style.marginTop="3px";caja1121.style.border="1px solid black";caja1122.style.border="1px solid black";
              caja1121.style.marginRight="3px";caja1122.style.marginLeft="3px";
              let caja11211=document.createElement("div"),caja11212=document.createElement("div"),caja11221=document.createElement("div"),caja11222=document.createElement("div");
              caja11211.id="caja11211";caja11212.id="caja11212";caja11221.id="caja11221";caja11222.id="caja11222";
              caja11211.style.display="flex";caja11212.style.display="flex";caja11221.style.display="flex";caja11222.style.display="flex";caja11211.style.marginLeft="7px";caja11221.style.marginLeft="7px";
              caja11212.style.justifyContent="center";caja11212.style.alignItems="center";caja11222.style.justifyContent="center";caja11222.style.alignItems="center";
              caja112.appendChild(caja1121);caja112.appendChild(caja1122);caja1121.appendChild(caja11211);caja1121.appendChild(caja11212);caja1122.appendChild(caja11221);caja1122.appendChild(caja11222);
              let titulo1=document.createElement("h3");titulo1.style.marginBottom="15px";titulo1.style.marginTop="7px";titulo1.style.fontSize="17px";titulo1.innerHTML="EL SISTEMA INICIAL INTRODUCIDO ES:";
              caja11211.appendChild(titulo1);continuar();
            }
          }
        }catch(error){
          document.getElementById("caja11112").style.color="red";
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
  caja112.style.height="62%";caja111.style.height="30%";
  Representar.sistemaCompleto(matrizOriginal,caja11212);
  caja11.style.width="60%";caja12.style.width="40%";caja12.style.alignItems="center";
  let titulo2=document.createElement("h3");titulo2.style.fontSize="17px";titulo2.style.marginBottom="15px";titulo2.style.marginTop="7px";titulo2.innerHTML="LA MATRIZ DE GAUSS INICIAL ES:";caja11221.appendChild(titulo2);
  caja2.style.display="flex";caja2.style.alignContent="flex-start";caja2.style.flexWrap="wrap";caja2.id="caja2";caja2.style.height="auto";caja2.style.width="99%";caja2.style.border="2px solid black";caja2.style.padding="5px";caja2.style.alignItems="center";
  Representar.matrizGaussCompleta(matrizOriginal,caja11222,leyendaIncognitas,ordenLeyenda);
  titulo3=document.getElementById("titulo3");titulo3.style.marginTop="3px";titulo3.style.marginBottom="3px";titulo3.innerHTML="ESPACIO PARA MOSTRAR LOS TRABAJOS REALIZADOS POR EL USUARIO";
  Representar.matrizGaussCompleta(matrizOriginal,caja2,leyendaIncognitas,ordenLeyenda);
  if(!Matriz.compararMatrices(matrizOriginal,matrizActualExpresiones))
    {
      Representar.simboloMatrizEquivalente(matrizOriginal.length,caja2);
      Representar.matrizGaussCompleta(matrizActualExpresiones,caja2,leyendaIncognitas,ordenLeyenda);}
  primerHijo=true;alturaPrimerHijo=caja2.children[0].clientHeight*0.5;caja112.style.height="72%";caja12.style.border="1px solid black";
  crearFormulario();
}

function crearFormulario(){
  while(caja111.firstChild)caja111.removeChild(caja111.firstChild);caja111.style.display="block";caja111.style.justifyContent="center";
  let tex1=document.createElement("h3");tex1.innerHTML="EL SISTEMA HA SIDO INTRODUCIDO";tex1.style.margin="0px";tex1.style.padding="0px";caja111.appendChild(tex1);
  caja11.style.width="60%";caja12.style.width="40%";caja111.style.border="1px solid black";caja111.style.width="97%";caja111.style.margin="4px 0px 7px 5px";caja111.style.height="15%";
  caja1121.style.width="55%";caja1122.style.width="43.3%";
  let titulo=document.createElement("h3");titulo.style.margin="3px";titulo.style.padding="0px";titulo.style.justifyContent="center";titulo.innerHTML="OPCIONES PARA MODIFICAR LA MATRIZ";caja12.appendChild(titulo);
  let caja121=document.createElement("div"),caja122=document.createElement("div"),caja123=document.createElement("div"),caja124=document.createElement("div"),caja125=document.createElement("div"),caja125bis=document.createElement("div");
  caja121.id="caja121";caja122.id="caja122";caja123.id="caja123";caja124.id="caja124";caja125.id="caja125";caja125bis.id="caja125bis";
  caja121.style.display="flex";caja122.style.display="flex";caja123.style.display="flex";caja124.style.display="flex";caja125.style.display="flex";caja125bis.style.display="flex";
  caja121.style.alignItems="center";caja122.style.alignItems="center";caja123.style.alignItems="center";caja124.style.alignItems="center";caja125.style.alignItems="center";caja125bis.style.alignItems="center";
  caja12.alignItems="center";caja12.appendChild(caja121);caja12.appendChild(caja122);caja12.appendChild(caja123);caja12.appendChild(caja124);caja12.appendChild(caja125);caja12.appendChild(caja125bis);
  let caja1211=document.createElement("div"),caja1212=document.createElement("div");caja1211.id="caja1211";caja1212.id="caja1212";caja1211.style.width="84%";caja121.appendChild(caja1211);caja121.appendChild(caja1212);
  let caja1221=document.createElement("div"),caja1222=document.createElement("div");caja1221.id="caja1221";caja1222.id="caja1222";caja1221.style.width="84%";caja122.appendChild(caja1221);caja122.appendChild(caja1222);
  let caja1231=document.createElement("div"),caja1232=document.createElement("div");caja1231.id="caja1231";caja1232.id="caja1232";caja1231.style.width="84%";caja123.appendChild(caja1231);caja123.appendChild(caja1232);
  let caja1241=document.createElement("div"),caja1242=document.createElement("div");caja1241.id="caja1241";caja1242.id="caja1242";caja1241.style.width="84%";caja124.appendChild(caja1241);caja124.appendChild(caja1242);
  let caja1251=document.createElement("div"),caja1252=document.createElement("div");caja1251.id="caja1251";caja1252.id="caja1252";caja1251.style.width="84%";caja125.appendChild(caja1251);caja125.appendChild(caja1252);
  let caja1251bis=document.createElement("div"),caja1252bis=document.createElement("div");caja1251bis.id="caja1251bis";caja1252bis.id="caja1252bis";caja1251bis.style.width="84%";caja125bis.appendChild(caja1251bis);caja125bis.appendChild(caja1252bis);caja125bis.style.marginBottom="5px";
  let caja126=document.createElement("div"),caja127=document.createElement("div"),caja128=document.createElement("div"),caja129=document.createElement("div");
  caja126.id="caja126";caja127.id="caja127";caja128.id="caja128";caja129.id="caja129";
  caja12.appendChild(caja126);caja12.appendChild(caja127);caja12.appendChild(caja128);caja12.appendChild(caja129);caja129.style.display="flex";caja129.style.justifyContent="flex-end";
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
  function _msgOk(s){caja128.style.color="black";caja128.innerHTML=s||"";}
  function _msgErr(s){caja128.style.color="red";caja128.innerHTML=s||"";}
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
      }break;

      case "opcion2":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        let d1=document.createElement("div"),d2=document.createElement("div"),l1=document.createElement("label"),l2=document.createElement("label"),i1=document.createElement("input"),i2=document.createElement("input");
        d1.appendChild(l1);d1.appendChild(i1);d2.appendChild(l2);d2.appendChild(i2);caja127.appendChild(d1);caja127.appendChild(d2);uiNodes.push(d1,d2);
        l1.innerHTML="C<sub>i</sub>:"+"\u00A0".repeat(3)+"i=";l2.innerHTML="C<sub>j</sub>:"+"\u00A0".repeat(3)+"j=";i1.focus();
        let m=matrizActualExpresiones[0].length-1,c1=null,c2=null;
        i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");c1=Number(i1.value);if(!Number.isInteger(c1)||c1<1||c1>m)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_msgErr("La columna i no es válida.<br>Debe estar entre 1 y "+m+".");}});
        i2.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");c2=Number(i2.value);if(!Number.isInteger(c2)||c2<1||c2>m||c2===c1)throw 0;
          matrizActualExpresiones=Matriz.permutarColumnas(matrizActualExpresiones,c1-1,c2-1);_swapLeyenda(c1-1,c2-1);
          if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){Representar.simboloPermutarColumnas(c1,c2,matrizActualExpresiones.length,caja2);_after();}_clearUI();
        }catch(e){i2.value="";i2.focus();_msgErr("La columna j no es válida.<br>Debe estar entre 1 y "+m+" y ser distinta de i.");}});
      }break;

      case "opcion3":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        matrizActualExpresiones=Matriz.ordenarFilasPorCeros(matrizActualExpresiones);
        if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){
          if(typeof Representar!=="undefined"&&Representar&&typeof Representar.simboloReordenarFilas==="function")Representar.simboloReordenarFilas(matrizActualExpresiones.length,caja2);
          else if(typeof Representar!=="undefined"&&Representar&&typeof Representar.simboloFilasNulasAbajo==="function")Representar.simboloFilasNulasAbajo(matrizActualExpresiones.length,caja2);
          if(_render)matrizExpresionesR=_render(matrizActualExpresiones);_after();
        }
        _clearUI();
      }break;

      case "opcion4":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        let d1=document.createElement("div"),d2=document.createElement("div"),l1=document.createElement("label"),l2=document.createElement("label"),i1=document.createElement("input"),i2=document.createElement("input");
        d1.appendChild(l1);d1.appendChild(i1);d2.appendChild(l2);d2.appendChild(i2);caja127.appendChild(d1);caja127.appendChild(d2);uiNodes.push(d1,d2);
        l1.innerHTML="F<sub>a</sub>"+"\u00A0".repeat(3)+"a=";l2.innerHTML="Dividir por m=";i1.focus();
        let n=matrizActualExpresiones.length,a=null;
        i1.addEventListener("keydown",function(ev){if(ev.key!=="Enter")return;try{_msgOk("");a=Number(i1.value);if(!Number.isInteger(a)||a<1||a>n)throw 0;i2.focus();}catch(e){i1.value="";i1.focus();_msgErr("La fila a no es válida.<br>Debe estar entre 1 y "+n+".");}});
        i2.addEventListener("keydown",function(ev){
          if(ev.key!=="Enter")return;
          try{
            _msgOk("");let mRaw=(i2.value||"").toString().trim();if(!mRaw.length)throw 0;
            let texto="^[0-9\\+\\-\\(\\)\\^\\*\\/"+nombreParametro+"]*$",rx=new RegExp(texto);if(!rx.test(mRaw))throw 0;_registrarDivisorUsado(mRaw);
            let mNum=null,isNum=false;try{let pm=_parseNumFrac(mRaw);mNum=pm.n;isNum=Number.isFinite(mNum);}catch(e){isNum=false;}
            if(isNum&&mNum===0)throw 0;
            if(!isNum){
              for(let j=0;j<matrizActualExpresiones[0].length;j++){let expr=matrizActualExpresiones[a-1][j],div="("+expr+")/("+mRaw+")";matrizActualExpresiones[a-1][j]=_simpl(div);}
              if(_render)matrizExpresionesR=_render(matrizActualExpresiones);if(typeof Representar!=="undefined"&&Representar&&typeof Representar.simboloDividirFila==="function")Representar.simboloDividirFila(a,mRaw,matrizActualExpresiones.length,caja2);
              _after();_clearUI();return;
            }
            let mStr=mRaw,canCoef=(typeof matrizExpresionesAValores==="function"&&typeof matrizCoeficientesAExpresion==="function"&&typeof quitarLlaves==="function");
            if(canCoef){
              let entero=true;matrizValoresCoeficientesActual=matrizExpresionesAValores(matrizActualExpresiones,nombreParametro);
              if(!Number.isInteger(mNum))entero=false;else{for(let j=0;j<matrizActualExpresiones[0].length;j++)for(let k=0;k<matrizValoresCoeficientesActual[a-1][j].length;k++)if(matrizValoresCoeficientesActual[a-1][j][k]%mNum!==0)entero=false;}
              if(!entero){for(let j=0;j<matrizActualExpresiones[0].length;j++){let expr=matrizActualExpresiones[a-1][j],div="("+expr+")/("+mStr+")";matrizActualExpresiones[a-1][j]=_simpl(div);}}
              else{for(let j=0;j<matrizActualExpresiones[0].length;j++)for(let k=0;k<matrizValoresCoeficientesActual[a-1][j].length;k++)matrizValoresCoeficientesActual[a-1][j][k]=matrizValoresCoeficientesActual[a-1][j][k]/mNum;
                matrizActualExpresiones=matrizCoeficientesAExpresion(matrizValoresCoeficientesActual,nombreParametro);matrizActualExpresiones=quitarLlaves(matrizActualExpresiones);}
            }else{for(let j=0;j<matrizActualExpresiones[0].length;j++){let expr=matrizActualExpresiones[a-1][j],div="("+expr+")/("+mStr+")";matrizActualExpresiones[a-1][j]=_simpl(div);}}
            if(_render)matrizExpresionesR=_render(matrizActualExpresiones);if(typeof Representar!=="undefined"&&Representar&&typeof Representar.simboloDividirFila==="function")Representar.simboloDividirFila(a,mStr,matrizActualExpresiones.length,caja2);
            _after();_clearUI();
          }catch(e){i2.value="";i2.focus();_msgErr("m no es válido.<br>Debe ser una expresión válida distinta de 0.");}
        });
      }break;

      case "opcion5":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        let lugarExp=document.createElement("div");caja127.appendChild(lugarExp);uiNodes.push(lugarExp);
        let lab=document.createElement("label");lab.innerHTML="Escribe la combinación lineal (ej.: F1=2F1-3/2F2+F3) y pulsa ENTER:";lugarExp.appendChild(lab);
        let inp=document.createElement("input");inp.style.width="260px";inp.style.marginLeft="8px";lugarExp.appendChild(inp);inp.focus();
        function _coefNoNulo(c){let s=_simpl(c);return s!=="0"&&s!=="(0)";}
        function _splitTopLevelSum(expr){let s=(expr||"").replace(/\s+/g,""),out=[],buf="",depth=0;for(let i=0;i<s.length;i++){let ch=s[i];if(ch==="(")depth++;else if(ch===")"){depth--;if(depth<0)throw new Error("paren");}if((ch==="+"||ch==="-")&&depth===0){if(buf.length)out.push(buf);buf=ch;}else buf+=ch;}if(depth!==0)throw new Error("paren");if(buf.length)out.push(buf);return out;}
        function _parseCL(cad,n){cad=(cad||"").replace(/\s+/g,"");if(!cad.length)throw new Error("vacia");let m=cad.match(/^F(\d+)=(.+)$/i);if(!m)throw new Error("formato");
          let lhs=Number(m[1]);if(!Number.isInteger(lhs)||lhs<1||lhs>n)throw new Error("lhs");let rhs=m[2],partes=_splitTopLevelSum(rhs);if(!partes.length)throw new Error("rhs");
          let terms=[];for(let t of partes){if(!t)continue;let mm=t.match(/^([+\-]?)(.*?)(?:\*)?F(\d+)$/i);if(!mm)throw new Error("termino");
            let sgn=mm[1]||"+",coef=mm[2]||"",fila=Number(mm[3]);if(!Number.isInteger(fila)||fila<1||fila>n)throw new Error("fila");
            if(coef==="")coef="1";if(coef==="+")coef="1";if(coef==="-"||coef==="")coef="1";if(sgn==="-"&&coef==="1")coef="-1";else if(sgn==="-"&&coef!=="-1")coef="-("+coef+")";
            terms.push({fila,factor:coef});
          }
          let tSelf=terms.find(x=>x.fila===lhs);if(!tSelf)throw new Error("faltaSelf");if(!_coefNoNulo(tSelf.factor))throw new Error("selfCero");return {lhs,terms};
        }
        inp.addEventListener("keydown",function(ev){
          if(ev.key!=="Enter")return;
          try{
            _msgOk("");let n=matrizActualExpresiones.length,cad=inp.value,obj=_parseCL(cad,n),target=obj.lhs-1,terms=obj.terms;
            for(let t of terms){_registrarPivoteFila(t.fila-1);_registrarDenomsCoef(t.factor);}
            for(let j=0;j<matrizActualExpresiones[0].length;j++){let acc="0";for(let t of terms){let expr=matrizActualExpresiones[t.fila-1][j];
              let prod=_simpl("("+expr+")*("+t.factor+")");acc=_simpl("("+acc+")+("+prod+")");}matrizActualExpresiones[target][j]=acc;}
            Representar.simboloCambiarLinea(cad,matrizActualExpresiones.length,caja2);_after();_clearUI();
          }catch(e){
            let msg="Formato no válido. Ejemplo: F1=2F1-3/2F2+F3";
            if(e.message==="lhs")msg="La fila del primer miembro no es válida.";
            if(e.message==="faltaSelf")msg="La fila del primer miembro debe aparecer también en el segundo miembro.";
            if(e.message==="selfCero")msg="El coeficiente de la fila del primer miembro debe ser no nulo.";
            if(e.message==="fila")msg="Alguna fila del segundo miembro no es válida.";
            _msgErr(msg+"<br>Pulsa RESET y vuelve a intentarlo.");inp.focus();
          }
        });
      }break;

      case "opcion6":{
        matrizActualExpresionesCopia=matrizActualExpresiones.map(a=>a.slice());
        matrizActualExpresiones=Matriz.eliminarFilasNulas(matrizActualExpresiones);
        if(!_cmp||!_cmp(matrizActualExpresiones,matrizActualExpresionesCopia)){
          if(typeof Representar!=="undefined"&&Representar&&typeof Representar.simboloEliminarFilasNulas==="function")Representar.simboloEliminarFilasNulas(caja2);
          else if(typeof Representar!=="undefined"&&Representar&&typeof Representar.simboloFilasNulas==="function")Representar.simboloFilasNulas(caja2);
          else if(typeof Representar!=="undefined"&&Representar&&typeof Representar.simboloEliminarFilas==="function")Representar.simboloEliminarFilas(caja2);
          if(_render)matrizExpresionesR=_render(matrizActualExpresiones);_after();
        }
        _clearUI();
      }break;

      default:_msgErr("Selecciona una opción.");break;
    }
    lockReset=false;
  });
}

function estudiarSistemaEscalonadoGauss(){document.body.classList.add("escalonada");
  while(caja1.firstChild){caja1.removeChild(caja1.firstChild)}
  caja1.style.display="block";caja1.style.border="2px solid black";caja1.style.margin="2px";caja1.style.padding="2px";caja1.style.width="100%";
  let caja11=document.createElement("div"),caja12=document.createElement("div");caja11.id="caja11";caja12.id="caja12";caja12.style.alignItems="center";
  caja1.appendChild(caja11);caja1.appendChild(caja12);
  caja11.style.height="auto";caja11.style.display="flex";caja11.style.justifyContent="center";caja11.style.alignItems="center";
  caja11.style.width="99%";caja12.style.height="auto";caja12.style.display="flex";caja12.style.justifyContent="space-between";caja12.style.gap="6px";caja12.style.width="99%";
  caja11.style.border="2px solid black";caja12.style.border="2px solid black";caja11.style.margin="2px";caja11.style.padding="2px";caja12.style.margin="2px";caja12.style.padding="2px";
  let caja121=document.createElement("div"),caja123=document.createElement("div"),caja124=document.createElement("div");
  caja121.id="caja121";caja123.id="caja123";caja124.id="caja124";
  caja121.style.display="block";caja123.style.display="block";caja124.style.display="block";
  caja12.appendChild(caja121);caja12.appendChild(caja123);caja12.appendChild(caja124);
  caja121.style.height="auto";caja123.style.height="auto";caja124.style.height="auto";
  caja121.style.width="28%";caja123.style.width="28%";caja124.style.width="44%";
  caja121.style.border="2px solid black";caja123.style.border="2px solid black";caja124.style.border="2px solid black";
  caja121.style.margin="2px";caja123.style.margin="2px";caja124.style.margin="2px";
  caja121.style.padding="2px";caja123.style.padding="2px";caja124.style.padding="2px";
  let caja1211=document.createElement("div"),caja1212=document.createElement("div"),caja1231=document.createElement("div"),caja1232=document.createElement("div"),caja1241=document.createElement("div"),caja1242=document.createElement("div"),caja1243=document.createElement("div");
  caja1211.id="caja1211";caja1212.id="caja1212";caja1231.id="caja1231";caja1232.id="caja1232";caja1243.id="caja1243";
  caja1241.id="caja1241";caja1242.id="caja1242";
  caja121.appendChild(caja1211);caja121.appendChild(caja1212);caja123.appendChild(caja1231);caja123.appendChild(caja1232);caja124.appendChild(caja1241);caja124.appendChild(caja1242);caja124.appendChild(caja1243);
  caja1211.style.height="auto";caja1231.style.height="auto";caja1241.style.height="auto";
  caja1211.style.width="99%";caja1231.style.width="99%";caja1241.style.width="99%";
  caja1211.style.justifyContent="center";caja1231.style.justifyContent="center";caja1241.style.justifyContent="center";
  caja1211.style.fontSize="18px";caja1231.style.fontSize="18px";caja1241.style.fontSize="18px";
  caja1211.style.marginBottom="10px";caja1212.style.width="99%";caja1232.style.width="99%";caja1242.style.width="98%";
  caja1212.style.display="flex";caja1232.style.display="flex";caja1242.style.display="flex";
  caja1212.style.justifyContent="center";caja1232.style.justifyContent="center";caja1242.style.justifyContent="center";
  caja1212.style.alignItems="center";caja1232.style.alignItems="center";
  caja1212.style.fontSize="15px";caja1232.style.fontSize="15px";caja1242.style.fontSize="15px";
  caja1242.style.height="auto";caja1242.style.paddingLeft="5px";caja1242.style.paddingRight="7px";caja1231.style.marginBottom="10px";
  caja1243.style.width="99%";caja1243.style.display="block";caja1243.style.fontSize="15px";
  caja11.style.fontSize="20px";caja11.style.justifyContent="center";caja11.innerHTML="LA MATRIZ MODIFICADA DEL SISTEMA INICIAL INTRODUCIDO YA ES ESCALONADA";
  caja1211.style.fontWeight="bold";caja1211.innerHTML="El sistema inicial introducido es:";Representar.sistemaCompleto(matrizExpresiones,caja1212);
  caja1231.style.fontWeight="bold";caja1231.innerHTML="Una matriz escalonada de GAUSS es: ";Representar.matrizGaussCompleta(matrizActualExpresiones,caja1232,leyendaIncognitas,ordenLeyenda);
  caja1241.style.fontWeight="bold";
  let caja12411=document.createElement("div");caja12411.id="caja12411";caja1241.appendChild(caja12411);caja12411.style.marginBottom="2px";caja12411.innerHTML="CASOS ESPECÍFICOS QUE SE DEBEN ESTUDIAR POR SEPARADO";

  function _abrirModalEcuacion(){
    let ov=document.getElementById("modalEcuacion");if(ov)ov.remove();
    ov=document.createElement("div");ov.id="modalEcuacion";ov.style.position="fixed";ov.style.left="0";ov.style.top="0";ov.style.width="100%";ov.style.height="100%";ov.style.background="rgba(0,0,0,0.45)";ov.style.display="flex";ov.style.justifyContent="center";ov.style.alignItems="center";ov.style.zIndex="99999";
    let box=document.createElement("div");box.style.width="520px";box.style.maxWidth="90%";box.style.background="white";box.style.border="2px solid black";box.style.padding="12px";box.style.display="block";
    let h=document.createElement("h3");h.style.margin="0 0 12px 0";h.innerHTML="RESOLVER UNA ECUACIÓN";
    let row=document.createElement("div");row.style.display="flex";row.style.alignItems="center";row.style.gap="10px";
    let lab=document.createElement("label");lab.innerHTML="Introduce la ecuación:";
    let inp=document.createElement("input");inp.style.flex="1";inp.style.minWidth="200px";
    let out=document.createElement("div");out.style.marginTop="12px";out.style.minHeight="22px";
    let botRow=document.createElement("div");botRow.style.marginTop="12px";botRow.style.display="flex";botRow.style.justifyContent="space-between";
    let cerrar=document.createElement("button");cerrar.innerHTML="CERRAR";
    let usar=document.createElement("button");usar.innerHTML="AÑADIR SOLUCIONES A CASOS";usar.disabled=true;
    row.appendChild(lab);row.appendChild(inp);box.appendChild(h);box.appendChild(row);box.appendChild(out);box.appendChild(botRow);botRow.appendChild(cerrar);botRow.appendChild(usar);ov.appendChild(box);document.body.appendChild(ov);
    function _close(){ov.remove();}
    cerrar.addEventListener("click",_close);ov.addEventListener("click",function(e){if(e.target===ov)_close();});
    let soluciones=null;inp.focus();
    inp.addEventListener("keydown",function(ev){
      if(ev.key!=="Enter")return;
      let ecu=inp.value||"";ecu=ecu.toString().trim();
      if(!ecu.length){out.style.color="red";out.innerHTML="No has introducido ninguna ecuación.";usar.disabled=true;soluciones=null;return;}
      try{let sol=Resolver.ecuacionValores(ecu);soluciones=sol;out.style.color="black";out.innerHTML="Soluciones: <span style='margin-left:8px'>"+sol+"</span>";usar.disabled=false;}
      catch(e){out.style.color="red";out.innerHTML="No se ha podido resolver la ecuación.";usar.disabled=true;soluciones=null;}
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
        let caja12412=document.getElementById("caja12412");if(caja12412)caja12412.innerHTML="CASOS: "+casosString;_close();
      }catch(e){out.style.color="red";out.innerHTML="No se han podido añadir las soluciones a los casos.";}
    });
  }

  function _crearCajaCasoHeader(casoTxt){
    let caja31=document.createElement("div");caja31.id="caja31";caja31.style.display="block";caja3.appendChild(caja31);
    caja31.style.width="48%";caja31.style.height="auto";caja31.style.border="2px black solid";caja31.style.marginBottom="5px";
    let caja311=document.createElement("div"),caja312=document.createElement("div"),caja313=document.createElement("div"),caja314=document.createElement("div");
    caja31.appendChild(caja311);caja31.appendChild(caja312);caja31.appendChild(caja313);caja31.appendChild(caja314);
    caja311.id="caja311";caja312.id="caja312";caja313.id="caja313";caja314.id="caja314";
    caja311.style.justifyContent="center";caja311.style.fontWeight="bold";caja311.style.fontSize="22px";caja311.style.marginBottom="10px";caja311.innerHTML=casoTxt;
    caja312.style.display="flex";caja312.style.justifyContent="space-between";
    let caja3121=document.createElement("div"),caja3122=document.createElement("div");caja312.appendChild(caja3121);caja312.appendChild(caja3122);
    caja3121.style.width="48%";caja3122.style.width="48%";caja3121.style.display="block";caja3122.style.display="block";
    let caja31211=document.createElement("div"),caja31212=document.createElement("div");caja3121.appendChild(caja31211);caja3121.appendChild(caja31212);
    let caja31221=document.createElement("div"),caja31222=document.createElement("div");caja3122.appendChild(caja31221);caja3122.appendChild(caja31222);
    caja31211.id="caja31211";caja31212.id="caja31212";caja31221.id="caja31221";caja31222.id="caja31222";
    caja313.style.justifyContent="center";caja313.style.fontSize="25px";caja314.style.display="block";caja314.style.justifyContent="center";
    return {caja31,caja311,caja31211,caja31212,caja31221,caja31222,caja314,caja3122};
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
  tipoCaso="G";casoUnico=true;caja1242.style.marginLeft="10px";caja1242.style.display="block";caja1242.style.height="auto";
  let lista1=document.createElement("div");lista1.innerHTML="Para este sistema, no hay NINGÚN CASO ESPECÍFICO del valor de \""+nombreParametro+"\" que haya que estudiar por separado.<br>";caja1242.appendChild(lista1);
  let lista2=document.createElement("div");lista2.innerHTML="Para cualquier valor de \""+nombreParametro+"\" el sistema es siempre del mismo tipo.<br>";lista2.style.paddingBottom="4px";caja1242.appendChild(lista2);
  let lista3=document.createElement("div");lista3.innerHTML="<br>Pulsa el botón \"CASO GENERAL\" para resolverlo.";lista3.style.paddingBottom="4px";caja1242.appendChild(lista3);
  let botonEstudiar=document.createElement("button");botonEstudiar.innerHTML="CASO GENERAL";caja1243.style.display="flex";caja1243.style.justifyContent="flex-end";caja1243.appendChild(botonEstudiar);

  function _parseValorSimple(raw){
    raw=(raw||"").toString().trim();if(!raw.length)throw new Error("v");
    if(raw.includes("/")){if(typeof pasarADecimal==="function")raw=pasarADecimal(raw);else{let p=raw.split("/");if(p.length!==2)throw new Error("v");raw=(parseFloat(p[0])/parseFloat(p[1])).toString();}}
    if(raw.includes(","))raw=raw.replace(",",".");let n=parseFloat(raw);if(Number.isNaN(n))throw new Error("v");return n;
  }

  function _dejarCaja124SoloParaOtrosCasos(){
    while(caja124.firstChild)caja124.removeChild(caja124.firstChild);
    let c1=document.createElement("div"),c2=document.createElement("div"),c3=document.createElement("div");caja124.appendChild(c1);caja124.appendChild(c2);caja124.appendChild(c3);
    c1.id="caja1241";c2.id="caja1242";c3.id="caja1243";
    c1.innerHTML="YA SE HA RESUELTO EL CASO GENERAL";c1.style.marginBottom="5px";
    c2.innerHTML="Ahora puedes estudiar cualquier valor específico de "+nombreParametro+" (el tipo será el mismo).";c2.style.marginBottom="5px";
    c3.style.display="flex";let c31=document.createElement("div"),c32=document.createElement("div");c3.appendChild(c31);c3.appendChild(c32);
    c31.id="caja12431";c32.id="caja12432";c31.innerHTML="Introduce dicho valor "+nombreParametro+"= ";let inputValor=document.createElement("input");c32.appendChild(inputValor);inputValor.focus();
    let msg=document.createElement("div");msg.id="caja124msg";msg.style.marginTop="8px";msg.style.minHeight="18px";caja124.appendChild(msg);

    inputValor.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key==="Tab"){ev.preventDefault();
      try{
        msg.style.color="black";msg.innerHTML="";
        let v=_parseValorSimple(inputValor.value);
        let txt="CASO: "+nombreParametro+"="+(typeof fraccionContinua==="function"?fraccionContinua(v.toString(),long):v.toString());
        _resolverYpintarCasoValor(v,txt,false);inputValor.value="";inputValor.focus();
      }catch(e){
        msg.style.color="red";msg.innerHTML="Entrada no válida. Usa decimal (0.5) o fracción (1/2).";
        inputValor.value="";inputValor.focus();
      }
    }});
  }

  botonEstudiar.addEventListener("click",function(){
    let txt="CASO GENERAL";_resolverYpintarCasoValor(null,txt,true);
    let matUso=matrizActualExpresiones;if(!Matriz.esMatrizEscalonada(matUso))matUso=Matriz.escalonarMatrizNumerica(matUso);
    tipoCaso=Sistema.discutir(matUso);
    _dejarCaja124SoloParaOtrosCasos();
  });
}


  else{
    if(casos.length===0)caja1242.innerHTML="Ahora, debes introducir todos los casos específicos del valor de \""+nombreParametro+"\" que se deben estudiar de forma separada. Puedes utilizar la matriz escalonada para encontrarlos (Es IMPRESCINDIBLE que los introduzcas todos)";
    else caja1241.innerHTML="Casos a estudiar: "+casos;
    let caja12431=document.createElement("div"),caja12432=document.createElement("div"),caja12433=document.createElement("div"),caja12434=document.createElement("div"),caja12435=document.createElement("div");
    caja12431.id="caja12431";caja12432.id="caja12432";caja12433.id="caja12433";caja12434.id="caja12434";caja12435.id="caja12435";
    caja12431.style.display="flex";caja12432.style.display="flex";caja12433.style.display="flex";caja12434.style.display="flex";caja12435.style.display="flex";
    let caja1241=document.createElement("div");caja124.appendChild(caja1241);caja1241.style.height="15%";caja124.style.display="block";caja1241.id="caja1241";
    let caja12411=document.createElement("div");caja1241.appendChild(caja12411);caja12411.id="caja12411";
    let caja12412=document.createElement("div");caja1241.appendChild(caja12412);caja12412.id="caja12412";
    caja12411.style.display="flex";caja12411.style.justifyContent="center";caja12411.style.fontSize="20px";caja12411.style.width="99%";caja12411.style.justifyContent="center";caja12411.style.fontWeight="bold";caja12411.style.marginBottom="10px";
    caja12412.innerHTML=casosString;
    let caja1243=document.createElement("div");caja1243.style.display="block";caja124.appendChild(caja1243);caja1243.id="caja1243";
    let caja1244=document.createElement("div");caja1244.style.display="flex";caja1244.id="caja1244";caja1244.style.marginBottom="20px";caja124.appendChild(caja1244);
    let caja1245=document.createElement("div");caja1245.style.display="flex";caja124.appendChild(caja1245);caja1245.id="caja1245";
    let caja1246=document.createElement("div");caja1246.style.display="flex";caja124.appendChild(caja1246);caja1246.id="caja1246";
    caja1243.appendChild(caja12431);caja1243.appendChild(caja12432);caja1243.appendChild(caja12433);caja1243.appendChild(caja12434);caja1243.appendChild(caja12435);
    caja1243.style.margin="5px";caja1243.style.marginTop="20px";caja1244.style.margin="5px";caja1245.style.margin="5px";
    let inputCaso=document.createElement("input");inputCaso.style.width="50px";inputCaso.style.height="20px";inputCaso.style.marginLeft="5px";inputCaso.style.marginRight="15px";
    let leyenda1=document.createElement("label");leyenda1.innerHTML="Introduce los valores validando, en cada paso, con la tecla \"ENTER\". Cuando hayas acabado, pulsa el botón \"FIN\"";caja1243.appendChild(leyenda1);
    caja1244.style.justifyContent="flex-start";caja1244.style.alignItems="center";
    let leyenda2=document.createElement("label");leyenda2.innerHTML=nombreParametro+"=";caja1244.appendChild(leyenda2);caja1244.appendChild(inputCaso);inputCaso.focus();
    let botonEcuacion=document.createElement("button");botonEcuacion.id="ecuacion";caja1245.style.marginTop="20px";
    let ly=document.createElement("div");ly.innerHTML="Si necesistas resolver una ecuación, puedes hacer click en el botón";caja1245.appendChild(ly);
    botonEcuacion.innerHTML="RESOLVER ECUACIÓN";caja1245.style.justifyContent="space-around";caja1245.appendChild(botonEcuacion);
    botonEcuacion.addEventListener("click",function(){_abrirModalEcuacion();});
    let botonFin=document.createElement("button");botonFin.innerHTML="FIN";botonFin.style.marginLeft="auto";caja1244.appendChild(botonFin);

    inputCaso.addEventListener("keydown",function(event){if(event.key==="Enter"||event.key==="Tab"){event.preventDefault();event.preventDefault();
      caja1242.remove();
      try{
        caja1246.style.color="black";caja1246.innerHTML="";
        let texto=/^(-?\d+(\.\d+)?|-\d+\/\d+|\d+\/\d+)$/,regex1=new RegExp(texto);
        if(regex1.test(inputCaso.value)===false){inputCaso.value="";inputCaso.focus();throw new Error();}
        let cas=inputCaso.value,casN;
        if(cas.includes("/")){let partes=cas.split("/");casN=parseFloat(partes[0]/partes[1]);}
        else casN=parseFloat(inputCaso.value);
        if(!casos.includes(casN))casos.push(casN);
        if(!casosString.includes(cas))casosString.push(cas);
        caja12412.style.marginTop="5px";caja12412.style.display="flex";caja12412.style.justifyContent="center";
        caja12412.innerHTML="CASOS: "+casosString;inputCaso.value="";
      }catch(error){
        caja1246.style.color="red";caja1246.innerHTML="Has introducido un caso no válido. Debe ser un número entero o racional. Puedes utilizar la expresión a/b";
      }
    }});

    botonFin.addEventListener("click",function(){
      let todosIncluidos=casosAutomatico.every(function(va){return casosString.includes(va);});
      if(todosIncluidos){
        casos.push("G");casosString.push("G");caja12412.innerHTML="CASOS: "+casosString;
        while(caja1243.firstChild){caja1243.removeChild(caja1243.firstChild);}while(caja1244.firstChild){caja1244.removeChild(caja1244.firstChild);}while(caja1245.firstChild){caja1245.removeChild(caja1245.firstChild);}
        let tx1="Ya has ingresado todos los casos específicos que se deben de estudiar.";
        let tx2="Ahora, puedes estudiar casa uno de ellos por separado.<br>Además, también debes estudiar el caso general que engloba el resto de valores de "+nombreParametro+". Para ello, introduce\"G\"";
        caja1243.innerHTML=tx1;caja1244.style.margin="20px 5px 20px 5px";caja1244.innerHTML=tx2;
        caja1245.style.display="flex";caja1245.style.justifyContent="inherit";caja1245.style.margin="20px 0px 0px 0px";
        let leyenda3=document.createElement("label");leyenda3.style.display="flex";leyenda3.style.justifyContent="right";leyenda3.style.margin="0px 50px 0px 5px";leyenda3.innerHTML="Introduce el valor a estudiar y presiona \"ENTER\"";
        caja1245.appendChild(leyenda3);
        let espacio=document.createElement("div");espacio.style.width="50px";espacio.innerHTML="VALOR:";
        let inputValor=document.createElement("input");caja1245.appendChild(espacio);caja1245.appendChild(inputValor);

        inputValor.focus();
        inputValor.addEventListener("keydown",function(event){if(event.key==="Enter"||event.key==="Tab"){event.preventDefault();event.preventDefault();
          let v;try{v=_parseValor(inputValor.value);}catch(e){caja1243.innerHTML="Entrada no válida. Usa decimal (0.5), fracción (1/2) o G.";inputValor.value="";inputValor.focus();return;}
          if(!_hasCaso(v)){caja1243.innerHTML="El valor introducido no está entre los casos a estudiar ni es el caso general G.<br>Introduce otro valor, por favor.";inputValor.value="";inputValor.focus();return;}

          casoUnico=false;
          if(v.tipo!=="G"){
            let txt="CASO: "+nombreParametro+"="+fraccionContinua(v.num.toString(),long);
            _resolverYpintarCasoValor(v.num,txt,false);_removeCaso(v);caja12412.innerHTML="CASOS: "+casosString;inputValor.value="";inputValor.focus();return;
          }

          let casosAutomaticoCadena=[];for(let i=0;i<casosAutomatico.length;i++)
            {if(casosAutomatico[i].includes(".")){casosAutomaticoCadena[i]=fraccionContinua(casosAutomatico[i].toString(),long);}
             else{casosAutomaticoCadena[i]=casosAutomatico[i]}  }
          let txt="CASO GENERAL: "+nombreParametro+" \u2260"+casosAutomaticoCadena;
          let ui=_crearCajaCasoHeader(txt);ui.caja31211.innerHTML="EL SISTEMA INICIAL PARA ESTE CASO ES:";Representar.sistemaCompleto(matrizExpresiones,ui.caja31212);
          ui.caja31221.innerHTML="UNA MATRIZ ESCALONADA PARA ESTE CASO ES:";Representar.matrizGaussCompleta(matrizActualExpresiones,ui.caja31222,leyendaIncognitas,ordenLeyenda);
          let matUso=matrizActualExpresiones;if(!Matriz.esMatrizEscalonada(matUso))matUso=Matriz.escalonarMatrizNumerica(matUso);
          tipoCaso=Sistema.discutir(matUso);Representar.solucionesSistemaLineal(matUso,ui.caja314,leyendaIncognitas,ordenLeyenda);
          _removeCaso(v);caja12412.innerHTML="CASOS: "+casosString;inputValor.value="";inputValor.focus();

          if(casos.length===0){
            while(caja124.firstChild){caja124.removeChild(caja124.firstChild);}
            let c1=document.createElement("div"),c2=document.createElement("div"),c3=document.createElement("div");caja124.appendChild(c1);caja124.appendChild(c2);caja124.appendChild(c3);
            c1.id="caja1241";c2.id="caja1242";c3.id="caja1243";
            c1.innerHTML="YA HAS ESTUDIADO TODOS LOS CASOS ESPECÍFICOS POSIBLES DE "+nombreParametro;c1.style.marginBottom="5px";
            c2.innerHTML="Si quieres, ahora puedes obtener la solución para un valor específico del parámetro.";c2.style.marginBottom="5px";
            let inputValor2=document.createElement("input");c3.style.display="flex";
            let c31=document.createElement("div"),c32=document.createElement("div");c3.appendChild(c31);c3.appendChild(c32);
            c31.id="caja12431";c32.id="caja12432";c31.innerHTML="Para ello, introduce dicho valor "+nombreParametro+"= ";c32.appendChild(inputValor2);

            inputValor2.focus();
            inputValor2.addEventListener("keydown",function(ev){if(ev.key==="Enter"||ev.key==="Tab"){ev.preventDefault();
              let valorrr=inputValor2.value;
              try{if((valorrr||"").trim().length===0)throw new Error();if(valorrr.includes("/"))valorrr=parseFloat(pasarADecimal(valorrr));if(valorrr.includes(","))valorrr=valorrr.replace(",",".");valorrr=parseFloat(valorrr);if(Number.isNaN(valorrr))throw new Error();}
              catch(e){c2.innerHTML="Entrada no válida. Usa decimal (0.5) o fracción (1/2).";inputValor2.value="";inputValor2.focus();return;}
              let txt="CASO: "+nombreParametro+"="+fraccionContinua(valorrr.toString(),long);
              _resolverYpintarCasoValor(valorrr,txt,false);inputValor2.value="";inputValor2.focus();
            }});
          }
        }});
      }else caja1243.innerHTML="Todavía no has introducido todos los casos específicos que se deben estudiar. Continúa incluyendo casos.";
    });
  }
}

document.addEventListener("DOMContentLoaded",function(){
  const abreVentana1=document.getElementById("abreVentana1"),cierraVentana1=document.getElementById("cierraVentana1"),ventana=document.getElementById("ventana1"),pdf1=document.getElementById("pdf1");
  const pdf1URL="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
  let otroSistema=document.getElementById("otroSistema");if(!otroSistema){otroSistema=document.createElement("button");otroSistema.id="otroSistema";otroSistema.innerHTML="Otro sistema";}
  let parent=abreVentana1&&abreVentana1.parentNode,volver=(document.getElementById("volver")||document.getElementById("volver1")||document.getElementById("btnVolver"));
  if(parent){
    if(volver&&volver.parentNode===parent)parent.insertBefore(otroSistema,volver);
    else parent.insertBefore(otroSistema,abreVentana1?abreVentana1.nextSibling:null);
  }else document.body.appendChild(otroSistema);
  otroSistema.addEventListener("click",function(){window.location.reload();});
  abreVentana1.addEventListener("click",function(event){event.preventDefault();pdf1.src=pdf1URL;ventana.style.display="flex";});
  cierraVentana1.addEventListener("click",function(){ventana.style.display="none";pdf1.src="";});
  window.addEventListener("click",function(event){if(event.target==ventana){ventana.style.display="none";pdf1.src="";}});
});

function autoScrollCaja3SiempreAbajo(){try{let el=document.getElementById("caja3");if(!el)return;let go=()=>{el.scrollTop=el.scrollHeight;};go();if(window.__obsCaja3)return;window.__obsCaja3=new MutationObserver(go);window.__obsCaja3.observe(el,{childList:true,subtree:true});window.addEventListener("resize",go,{passive:true});}catch(e){}}



function setupToggleTrabajos(){try{let btn=document.getElementById("btnToggleTrabajos"),c2=document.getElementById("caja2");if(!btn||!c2)return;
c2.style.position=c2.style.position||"relative";btn.style.position="absolute";btn.style.top="6px";btn.style.right="6px";btn.style.zIndex="10";
btn.style.margin="0";btn.style.alignSelf="flex-start";if(btn.parentNode!==c2)c2.appendChild(btn);else c2.appendChild(btn);
let kids=()=>Array.from(c2.children).filter(x=>x!==btn),set=(on)=>{btn.setAttribute("aria-expanded",on?"true":"false");btn.textContent=on?"Ocultar trabajos":"Mostrar trabajos";kids().forEach(el=>{el.style.display=on?"":"none";});};
btn.addEventListener("click",()=>{let visible=kids().some(el=>el.style.display!=="none");set(!visible);});
let sync=()=>{let esc=document.body.classList.contains("escalonada");btn.style.display=esc?"inline-flex":"none";if(!esc)set(true);};
sync();if(!window.__obsBodyCls){window.__obsBodyCls=new MutationObserver(sync);window.__obsBodyCls.observe(document.body,{attributes:true,attributeFilter:["class"]});}}catch(e){}}


function _initUIExtras(){autoScrollCaja3SiempreAbajo();setupToggleTrabajos();}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",_initUIExtras,{once:true});else _initUIExtras();

