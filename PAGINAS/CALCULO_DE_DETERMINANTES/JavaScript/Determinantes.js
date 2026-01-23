var orden=0;var valores=[];var valorDeterminante=null;var valoresCopia=[];var determinanteActual=[];
var determinanteCopia=[];var determinanteAdjunto=[];var determinanteInicial=[];var opcionSeleccionada=null;
var coeficienteDeterminante="1";var posibilidadesEleccion=[];var eleccion="";var eleccion2="";
var coeficienteEleccion=0;var tipoError="";var fila=null;var columna=null;var fila2=null;var columna2=null;
var numeroCerosFilas=[];var numeroCerosColumnas=[];var anchoTotalCaja221=0;var nulo=false;var x,m,n=null;
var lineaNula=false;var lineasIguales=false;var lineasProporcionales=false;var lineaNulaFijada=[];
var lineasIgualesFijadas=[];var lineasProporcionalesFijadas=[];var estado="inicial";var comprobar=false;

function _simp(x){return ExpresionAlgebraica.simplificar((x??"").toString().trim());}
function _numSimple(x){let s=_simp(x);return /^-?\d+(\/\d+)?$/.test(s);}
function _enteroSiNumero(x){
  let s=_simp(x),v=Number(s);if(isNaN(v))return true;
  return (Math.abs(v)-Math.floor(Math.abs(v)))===0;
}
function _splitSumaTop(expr){
  let s=(expr??"").toString().replace(/\s+/g,""),res=[],buf="",d=0;
  for(let i=0;i<s.length;i++){
    let c=s[i];if(c==="(")d++;else if(c===")")d=Math.max(0,d-1);
    if((c==="+"||c==="-")&&d===0){if(buf!==""){res.push(buf);buf="";}buf=c;}
    else buf+=c;
  }
  if(buf!=="")res.push(buf);return res;
}
function _parseTermLinea(t,letra){
  if(t==="+"||t==="-"||t==="")throw new Error("termino");
  let rg=new RegExp(letra+"(\\d+)$"),m=t.match(rg);if(!m)throw new Error("termino");
  let k=parseInt(m[1],10);if(!Number.isFinite(k))throw new Error("termino");
  let idx=t.lastIndexOf(letra),c=t.slice(0,idx);if(c==="")c="+1";
  if(c==="+")c="+1";if(c==="-")c="-1";if(c.endsWith("*"))c=c.slice(0,-1);
  c=_simp(c);return {idx:k-1,coef:c};
}
function _termLin(coef,letra,idx1){
  let c=_simp(coef);if(c==="0")return "";
  let simple=/^-?\d+(\/\d+)?$/.test(c);
  if(c==="1")return "+"+letra+idx1;
  if(c==="-1")return "-"+letra+idx1;
  if(c.startsWith("-"))return c+letra+idx1;
  if(simple)return "+"+c+letra+idx1;
  return "+("+c+")"+letra+idx1;
}
function aplicarExpresionFila(det,expr){
  let s=(expr??"").toString().replace(/\s+/g,"");if(s==="")throw new Error("expresion");
  let p=s.split("=");if(p.length!==2)throw new Error("expresion");
  let iz=p[0],der=p[1],m=iz.match(/^F(\d+)$/);if(!m)throw new Error("filaDestino");
  let fd=parseInt(m[1],10)-1,n=det.length;if(fd<0||fd>=n)throw new Error("filaDestino");
  let termStr=_splitSumaTop(der),terms=[],coefPropio="0";
  for(let ts of termStr){
    let tt=_parseTermLinea(ts,"F");if(tt.idx<0||tt.idx>=n)throw new Error("filaRef");
    terms.push(tt);if(tt.idx===fd)coefPropio=_simp("("+coefPropio+")+("+tt.coef+")");
  }
  if(coefPropio==="0")throw new Error("sinCoefPropio");
  let nueva=new Array(n).fill("0");
  for(let k=0;k<terms.length;k++){
    let f=terms[k].idx,c=terms[k].coef;
    for(let j=0;j<n;j++)nueva[j]=_simp("("+nueva[j]+")+("+c+")*("+det[f][j]+")");
  }
  det[fd]=nueva;return {dest:fd,coefPropio:coefPropio,terms:terms};
}
function aplicarExpresionColumna(det,expr){
  let s=(expr??"").toString().replace(/\s+/g,"");if(s==="")throw new Error("expresion");
  let p=s.split("=");if(p.length!==2)throw new Error("expresion");
  let iz=p[0],der=p[1],m=iz.match(/^C(\d+)$/);if(!m)throw new Error("colDestino");
  let cd=parseInt(m[1],10)-1,n=det.length;if(cd<0||cd>=n)throw new Error("colDestino");
  let termStr=_splitSumaTop(der),terms=[],coefPropio="0";
  for(let ts of termStr){
    let tt=_parseTermLinea(ts,"C");if(tt.idx<0||tt.idx>=n)throw new Error("colRef");
    terms.push(tt);if(tt.idx===cd)coefPropio=_simp("("+coefPropio+")+("+tt.coef+")");
  }
  if(coefPropio==="0")throw new Error("sinCoefPropio");
  let nueva=new Array(n).fill("0");
  for(let k=0;k<terms.length;k++){
    let cidx=terms[k].idx,c=terms[k].coef;
    for(let i=0;i<n;i++)nueva[i]=_simp("("+nueva[i]+")+("+c+")*("+det[i][cidx]+")");
  }
  for(let i=0;i<n;i++)det[i][cd]=nueva[i];
  return {dest:cd,coefPropio:coefPropio,terms:terms};
}

function insertarBotonOtroDeterminante(){
  let ayuda=document.getElementById("abreVentana1");if(!ayuda||!ayuda.parentNode)return;
  if(document.getElementById("botonOtroDeterminante"))return;
  let b=document.createElement("button");b.type="button";b.id="botonOtroDeterminante";
  b.innerHTML="Otro determinante";b.addEventListener("click",function(){location.reload();});
  let volver=document.getElementById("volver")||document.getElementById("botonVolver")||
    document.getElementById("volver1")||document.getElementById("enlaceVolver")||
    document.getElementById("btnVolver");
  if(volver&&volver.parentNode===ayuda.parentNode)ayuda.parentNode.insertBefore(b,volver);
  else ayuda.parentNode.insertBefore(b,ayuda.nextSibling);
}

crearOrden("caja1112","caja11112");
document.getElementById("caja11112").innerHTML="Valida todos los datos introducidos con la tecla ENTER del teclado";

function crearOrden(lug,lugc){
  let texto1=document.createElement("span");texto1.style.fontSize="16px";
  texto1.textContent="Orden del determinante"+"\u00A0".repeat(3)+"n=";
  let texto2=document.createElement("span");texto2.style.fontSize="13px";
  texto2.textContent="\u00A0".repeat(3)+"(Entre 2 y 6)";
  let lugarTexto1=document.createElement("p"),lugarTexto2=document.createElement("p");
  lugarTexto1.id="textos_int_orden";lugarTexto2.id="textos_in_orden";
  lugarTexto1.appendChild(texto1);lugarTexto2.appendChild(texto2);
  let nOrden=document.createElement("input");nOrden.id="nOrden";nOrden.type="text";
  let lugarInputOrden=document.getElementById(lug);
  lugarInputOrden.appendChild(lugarTexto1);lugarInputOrden.appendChild(nOrden);
  lugarInputOrden.appendChild(lugarTexto2);nOrden.focus();let ctrol=true;
  nOrden.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
      try{
        if(ctrol===false){
          document.getElementById(lugc).style.color="black";
          document.getElementById("caja11112").innerHTML=
          "Valida todos los datos introducidos con la tecla ENTER del teclado";
        }
        orden=parseInt(document.getElementById("nOrden").value);
        if(isNaN(orden)||orden<2||orden>6){document.getElementById("nOrden").value="";throw new Error();}
        crearDeterminanteVacio();
      }catch(error){
        ctrol=false;document.getElementById(lugc).style.color="red";
        document.getElementById(lugc).innerHTML=
        "El carácter introducido en el orden del determinante no es válido.<br>"+
        "Debe ser un número comprendido entre 2 y 6.<br>Inténtalo otra vez por favor";
      }
    }
  });
}

function crearDeterminanteVacio(){
  let contenedorDeterminante=document.getElementById("caja1122");
  Representar.abrirBarra(orden+1,contenedorDeterminante);let tabla=document.createElement('table');
  for(let i=0;i<orden;i++){
    let fila=document.createElement('tr'),filaMatriz=[];
    for(let j=0;j<orden;j++){
      let input=document.createElement('input');input.type='text';input.value='';
      filaMatriz.push(null);let celda=document.createElement('td');
      celda.appendChild(input);fila.appendChild(celda);
    }
    valores.push(filaMatriz);tabla.appendChild(fila);
  }
  contenedorDeterminante.appendChild(tabla);
  Representar.abrirBarra(orden+1,contenedorDeterminante);rellenarDeterminante(tabla);
}

function rellenarDeterminante(tabla){
  let inputs=tabla.getElementsByTagName('input');inputs[0].focus();
  for(let i=0;i<inputs.length;i++){
    inputs[i].addEventListener("keydown",function(event){
      if(event.key==="Enter"){
        try{
            let fila=this.parentNode.parentNode.rowIndex,columna=this.parentNode.cellIndex,valor=this.value;
            document.getElementById("caja11112bis").innerHTML="";
            let raw=(valor??"").toString().trim();if(raw==="")raw="0";raw=raw.replace(/\s+/g,"");
            if(!Validar.expresionAlgebraica(raw)[0])throw new Error("valorInvalido");
            let vs=raw;try{vs=_simp(raw);}catch(e){vs=raw;}
            this.value=vs;valores[fila][columna]=vs;
          document.getElementById("caja11112bis").innerHTML="";
          let siguienteInput=null;
          if(i<inputs.length-1){siguienteInput=inputs[i+1];}
          else{
            let caja1121=document.getElementById("caja1121"),caja11211=document.createElement("div");
            caja1121.style.flexDirection="column";let caja11212=document.createElement("div");
            caja1121.appendChild(caja11211);caja1121.appendChild(caja11212);
            caja11211.id="caja11211";caja11212.id="caja11212";
            caja11212.style.flexWrap="wrap";caja11212.style.justifyContent="center";
            let titulo=document.createElement("div");titulo.innerHTML="EL DETERMINANTE INICIAL ES:";
            titulo.style.cssText+="font-size:18px;font-weight:bold;margin-top:5px;";
            let lugarBorrar=document.getElementById("caja1122"),lugar2=document.getElementById("caja11211");
            let lugar=document.getElementById("caja11212");
            lugar.style.display="flex";lugar.style.alignItems="center";caja11211.appendChild(titulo);
            let tx=document.createElement("div");tx.innerHTML="A=";caja11212.appendChild(tx);
            Representar.determinante(valores,lugar);
            while(lugarBorrar.firstChild){
              lugarBorrar.removeChild(lugarBorrar.firstChild);lugarBorrar.style.fontSize="20px";
              lugarBorrar.style.alignItems="center";
            }
            let lugarB=document.getElementById("caja1112");
            while(lugarB.firstChild){lugarB.style.fontSize="20px";lugarB.removeChild(lugarB.firstChild);}
            lugarB.innerHTML="EL DETERMINANTE INICIAL HA SIDO INTRODUCIDO";
            determinanteInicial=valores.map(function(arr){return arr.slice();});
            if(valores.length==2){imprimeResultadoFinal(valores,"orden2");return;}
            if(Matriz.comprobarLineaNula(valores)){
              lineaNulaFijada=Matriz.lineaNula(valores);comprobar=true;
              imprimeResultadoFinal(valores,"inicialNula");return;
            }
            if(Matriz.comprobarLineasIguales(valores)){
              lineasIgualesFijadas=Matriz.lineasIguales(valores);comprobar=true;
              imprimeResultadoFinal(valores,"inicialIguales");return;
            }
            if(Matriz.comprobarLineasProporcionales(valores)){
              lineasProporcionalesFijadas=Matriz.lineasProporcionales(valores);comprobar=true;
              imprimeResultadoFinal(valores,"inicialProporcionales");return;
            }
            valores=Matriz.simplificarElementosMatriz(valores);
            Representar.determinante(valores,caja21);crearFormulario();botonResolucionAutomatica();
          }
          if(siguienteInput){siguienteInput.focus();}
        }catch(error){
          document.getElementById("caja11112bis").style.color="red";
          document.getElementById("caja11112bis").innerHTML=
          "El valor introducido en el elemento del determinante no es válido.<br>"+
          "Debe ser un número entero. Prueba otro ...";
          inputs[i].value="";
        }
      }
    });
  }
}

async function crearFormulario(){
  determinanteActual=valores.map(function(arr){return arr.slice();});
  let lugarTitulo=document.getElementById("caja121"),titulo=document.createElement("h3");
  titulo.innerHTML="OPCIONES PARA MODIFICAR EL DETERMINANTE";lugarTitulo.appendChild(titulo);
  let lugarFormulario1=document.getElementById("caja1221"),lugarFormulario1C=document.getElementById("caja1221bis");
  let lugarFormulario2=document.getElementById("caja1222"),lugarFormulario2bis=document.getElementById("caja1222bis");
  let lugarFormulario3=document.getElementById("caja1223"),lugarFormulario4=document.getElementById("caja1224");
  let lugarFormulario7=document.getElementById("caja1227");

  let opcion1=document.createElement("input");opcion1.type="radio";opcion1.value="opcion1";
  opcion1.name="option";opcion1.id="inputcorto1";lugarFormulario1.appendChild(opcion1);
  let etiquetaOpcion1=document.createElement("label");
  etiquetaOpcion1.innerHTML="Opción 1: Extraer factor común de una fila";lugarFormulario1.appendChild(etiquetaOpcion1);

  let opcion1C=document.createElement("input");opcion1C.type="radio";opcion1C.value="opcion1C";
  opcion1C.name="option";opcion1C.id="inputcorto1C";lugarFormulario1C.appendChild(opcion1C);
  let etiquetaOpcion1C=document.createElement("label");
  etiquetaOpcion1C.innerHTML="Opción 2: Extraer factor común de una columna";lugarFormulario1C.appendChild(etiquetaOpcion1C);

  let opcion2=document.createElement("input");opcion2.type="radio";opcion2.value="opcion2";
  opcion2.name="option";opcion2.id="inputcorto2";lugarFormulario2.appendChild(opcion2);
  let etiquetaOpcion2=document.createElement("label");
  etiquetaOpcion2.innerHTML="Opción 3: Cambiar una fila por una expresión del tipo F1=aF1+bF2-cF3";
  lugarFormulario2.appendChild(etiquetaOpcion2);

  let opcion2bis=document.createElement("input");opcion2bis.type="radio";opcion2bis.value="opcion2bis";
  opcion2bis.name="option";opcion2bis.id="inputcorto2";lugarFormulario2bis.appendChild(opcion2bis);
  let etiquetaopcion2bis=document.createElement("label");
  etiquetaopcion2bis.innerHTML="Opción 4: Cambiar una columna por una expresión del tipo C1=aC1+bC2-cC3";
  lugarFormulario2bis.appendChild(etiquetaopcion2bis);

  let opcion3=document.createElement("input");opcion3.type="radio";opcion3.value="opcion3";
  opcion3.name="option";opcion3.id="inputcorto3";lugarFormulario3.appendChild(opcion3);
  let etiquetaOpcion3=document.createElement("label");
  etiquetaOpcion3.innerHTML="Opción 5: Reducir el determinante a otro determinante de orden una unidad inferior";
  lugarFormulario3.appendChild(etiquetaOpcion3);

  let opcion4=document.createElement("input");opcion4.type="radio";opcion4.value="opcion4";
  opcion4.name="option";opcion4.id="inputcorto4";lugarFormulario4.appendChild(opcion4);
  let etiquetaOpcion4=document.createElement("label");
  etiquetaOpcion4.innerHTML="Opción 6: Obtener el valor del determinante de orden 3";
  lugarFormulario4.appendChild(etiquetaOpcion4);

  let boton=document.createElement("button");boton.innerHTML="Seleccionar";lugarFormulario7.appendChild(boton);
  let opcionSeleccionada=null;let botonReset=document.createElement("button");
  botonReset.innerHTML="RESET";lugarFormulario7.appendChild(botonReset);

  await new Promise((resolve,reject)=>{
    boton.addEventListener("click",function(){
      var radioSeleccionado=document.querySelector('input[name="option"]:checked');
      if(radioSeleccionado!==null&&radioSeleccionado.value!==null&&radioSeleccionado.value!==undefined
        &&radioSeleccionado.value!=="null"){opcionSeleccionada=radioSeleccionado.value;}
      document.getElementById("caja1236").innerHTML="";
      switch(opcionSeleccionada){

        case "opcion1":
          document.getElementById("caja1236").innerHTML="";
          determinanteCopia=determinanteActual.map(function(arr){return arr.slice();});
          let lugarFila4=document.getElementById("caja1232"),lugarFila5=document.getElementById("caja1233");
          let inputFila4=document.createElement("input"),inputFila5=document.createElement("input");
          let labelFila4=document.createElement("label"),labelFila5=document.createElement("label");
          lugarFila4.appendChild(labelFila4);lugarFila5.appendChild(labelFila5);
          lugarFila4.appendChild(inputFila4);lugarFila5.appendChild(inputFila5);
          labelFila4.textContent="Fila:";labelFila5.textContent="Dividir por:";
          document.getElementById("caja1236").innerHTML="";inputFila4.focus();

          inputFila4.addEventListener("keydown",function(event){
            if(event.key==="Enter"){
              try{
                if(isNaN(inputFila4.value)||inputFila4.value<1||inputFila4.value>determinanteActual.length
                  ||inputFila4.value%1!==0){throw new(error);}
                document.getElementById("caja1236").innerHTML="";inputFila5.focus();
              }catch(error){
                document.getElementById("caja1236").style.color="red";
                document.getElementById("caja1236").innerHTML=
                "<br>El número de fila no es válido<br>Debe ser un número comprendido ente 1 y "+
                determinanteActual.length+"<br>Presiona \"RESET\" y elige una nueva opción";
                inputFila4.remove();labelFila4.remove();inputFila5.remove();labelFila5.remove();
                opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }
            }
          });

          inputFila5.addEventListener("keydown",function(event){
            if(event.key==="Enter"){
              try{
                let filaCambio=inputFila4.value-1,coef=inputFila5.value,coefS=_simp(coef);
                if(coefS==="0"){throw new(error);}let entero=true;
                if(_numSimple(coefS)){
                  for(let j=0;j<determinanteActual.length;j++){
                    let t=_simp("("+determinanteActual[filaCambio][j]+")/("+coefS+")");
                    if(FraccionAlgebraica.denominador(t)!=="1"){entero=false;break;}
                  }
                }
                if(entero===false){
                  document.getElementById("caja1236").innerHTML=
                  "Los elementos de la fila no son todos múltiplos de "+coefS+
                  ". <br>No conviene extraer factor común.<br>Presiona \"RESET\" y elige otra opción ";
                  inputFila4.remove();inputFila5.remove();labelFila4.remove();labelFila5.remove();
                  opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                  for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
                }else{
                  for(let j=0;j<determinanteActual.length;j++){
                    determinanteActual[filaCambio][j]=_simp("("+determinanteActual[filaCambio][j]+")/("+coefS+")");
                  }
                  coeficienteDeterminante=_simp("("+coeficienteDeterminante+")*("+coefS+")");
                  Representar.simboloDividirFila(filaCambio+1,coefS,determinanteActual.length,caja21);
                  Representar.coeficienteDeterminante(coeficienteDeterminante,determinanteActual.length,caja21);
                  Representar.determinante(determinanteActual,caja21);
                  inputFila4.remove();inputFila5.remove();labelFila4.remove();labelFila5.remove();
                  opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                  for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
                }
              }catch(error){
                document.getElementById("caja1236").style.color="red";
                document.getElementById("caja1236").innerHTML=
                "No está permitido dividir por 0. <br>Presiona \"RESET\" y elige otra opción.";
                inputFila4.remove();inputFila5.remove();labelFila4.remove();labelFila5.remove();
                opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }
            }
          });

          botonReset.addEventListener("click",function(){
            document.getElementById("caja1236").innerHTML="";inputFila4.value="";inputFila5.value="";
            labelFila4.remove();labelFila5.remove();inputFila4.remove();inputFila5.remove();
            filaCambio=undefined;coef=undefined;
            if(document.querySelector('input[name="option"]:checked'))document.querySelector('input[name="option"]:checked').checked=false;
          });
        break;

        case "opcion1C":
          document.getElementById("caja1236").innerHTML="";
          determinanteCopia=determinanteActual.map(function(arr){return arr.slice();});
          let lugarFila4C=document.getElementById("caja1232"),lugarFila5C=document.getElementById("caja1233");
          let inputFila4C=document.createElement("input"),inputFila5C=document.createElement("input");
          let labelFila4C=document.createElement("label"),labelFila5C=document.createElement("label");
          lugarFila4C.appendChild(labelFila4C);lugarFila5C.appendChild(labelFila5C);
          lugarFila4C.appendChild(inputFila4C);lugarFila5C.appendChild(inputFila5C);
          labelFila4C.textContent="Columna:";labelFila5C.textContent="Dividir por:";
          document.getElementById("caja1236").innerHTML="";inputFila4C.focus();

          inputFila4C.addEventListener("keydown",function(event){
            if(event.key==="Enter"){
              try{
                if(isNaN(inputFila4C.value)||inputFila4C.value<1||inputFila4C.value>determinanteActual.length
                  ||inputFila4C.value%1!==0){throw new(error);}
                document.getElementById("caja1236").innerHTML="";inputFila5C.focus();
              }catch(error){
                document.getElementById("caja1236").style.color="red";
                document.getElementById("caja1236").innerHTML=
                "<br>El número de columna no es válido<br>Debe ser un número comprendido ente 1 y "+
                determinanteActual.length+"<br>Presiona \"RESET\" y elige una nueva opción";
                inputFila4C.remove();labelFila4C.remove();inputFila5C.remove();labelFila5C.remove();
                opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }
            }
          });

          inputFila5C.addEventListener("keydown",function(event){
            if(event.key==="Enter"){
              try{
                let colCambio=inputFila4C.value-1,coef=inputFila5C.value,coefS=_simp(coef);
                if(coefS==="0"){tipoError="divisionPorCero";throw new(error);}let entero=true;
                if(_numSimple(coefS)){
                  for(let i=0;i<determinanteActual.length;i++){
                    let t=_simp("("+determinanteActual[i][colCambio]+")/("+coefS+")");
                    if(FraccionAlgebraica.denominador(t)!=="1"){entero=false;break;}
                  }
                }
                if(entero===false){
                  document.getElementById("caja1236").innerHTML=
                  "Los elementos de la columna no son todos múltiplos de "+coefS+
                  ". <br>No conviene extraer factor común.<br>Presiona \"RESET\" y elige otra opción ";
                  inputFila4C.remove();inputFila5C.remove();labelFila4C.remove();labelFila5C.remove();
                  opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                  for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
                }else{
                  for(let i=0;i<determinanteActual.length;i++){
                    determinanteActual[i][colCambio]=_simp("("+determinanteActual[i][colCambio]+")/("+coefS+")");
                  }
                  coeficienteDeterminante=_simp("("+coeficienteDeterminante+")*("+coefS+")");
                  Representar.simboloDividirColumna(colCambio+1,coefS,determinanteActual.length,caja21);
                  Representar.coeficienteDeterminante(coeficienteDeterminante,determinanteActual.length,caja21);
                  Representar.determinante(determinanteActual,caja21);
                  inputFila4C.remove();inputFila5C.remove();labelFila4C.remove();labelFila5C.remove();
                  opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                  for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
                }
              }catch(error){
                document.getElementById("caja1236").style.color="red";
                document.getElementById("caja1236").innerHTML=
                "No está permitido dividir por 0. <br>Presiona \"RESET\" y elige otra opción.";
                inputFila4C.remove();inputFila5C.remove();labelFila4C.remove();labelFila5C.remove();
                opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }
            }
          });

          botonReset.addEventListener("click",function(){
            document.getElementById("caja1236").innerHTML="";inputFila4C.value="";inputFila5C.value="";
            labelFila4C.remove();labelFila5C.remove();inputFila4C.remove();inputFila5C.remove();
            colCambio=undefined;coef=undefined;
            if(document.querySelector('input[name="option"]:checked'))document.querySelector('input[name="option"]:checked').checked=false;
          });
        break;

        case "opcion2":
          document.getElementById("caja1236").innerHTML="";
          let lugarE1=document.getElementById("caja1232"),lugarE2=document.getElementById("caja1233");
          let labelE=document.createElement("label"),inputE=document.createElement("input");
          inputE.style.width="150px";
          labelE.textContent="Expresión:";lugarE1.appendChild(labelE);lugarE2.appendChild(inputE);
          let guia=document.getElementById("caja1231");guia.innerHTML="Ejemplo: F1=aF1+bF2-cF3";
          inputE.focus();

          inputE.addEventListener("keydown",function(event){
            if(event.key==="Enter"){
              try{
                estado="usuario";document.getElementById("caja1236").innerHTML="";
                let r=aplicarExpresionFila(determinanteActual,inputE.value);
                coeficienteDeterminante=_simp("("+coeficienteDeterminante+")/("+r.coefPropio+")");
                Representar.simboloCambiarLinea(inputE.value,determinanteActual.length,caja21);
                Representar.coeficienteDeterminante(coeficienteDeterminante,determinanteActual.length,caja21);
                Representar.determinante(determinanteActual,caja21);

                if(Matriz.comprobarLineaNula(determinanteActual)){
                  lineaNulaFijada=Matriz.lineaNula(determinanteActual);comprobar=true;
                  imprimeResultadoFinal(determinanteActual,"inicialNula");return;
                }
                if(Matriz.comprobarLineasIguales(determinanteActual)){
                  lineasIgualesFijadas=Matriz.lineasIguales(determinanteActual);comprobar=true;
                  imprimeResultadoFinal(determinanteActual,"inicialIguales");return;
                }
                if(Matriz.comprobarLineasProporcionales(determinanteActual)){
                  lineasProporcionalesFijadas=Matriz.lineasProporcionales(determinanteActual);comprobar=true;
                  imprimeResultadoFinal(determinanteActual,"inicialProporcionales");return;
                }

                document.getElementById("caja1231").innerHTML="";document.getElementById("caja1232").innerHTML="";
                document.getElementById("caja1233").innerHTML="";document.getElementById("caja1234").innerHTML="";
                labelE.remove();inputE.remove();opcionSeleccionada.value=null;
                var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }catch(error){
                document.getElementById("caja1236").style.color="red";
                let msg="<br>Expresión no válida.<br>Usa un formato tipo F1=2F1+3F2-4F3";
                if(error&&error.message==="sinCoefPropio"){
                  msg="<br>La fila destino debe aparecer en el segundo miembro con coeficiente no nulo.<br>"+
                  "Ej: F1=2F1+3F2";
                }
                document.getElementById("caja1236").innerHTML=msg+"<br>Presiona \"RESET\" y elige una nueva opción";
                labelE.remove();inputE.remove();opcionSeleccionada.value=null;
                var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }
            }
          });

          botonReset.addEventListener("click",function(){
            document.getElementById("caja1236").innerHTML="";document.getElementById("caja1231").innerHTML="";
            try{labelE.remove();inputE.remove();}catch(e){}
            if(document.querySelector('input[name="option"]:checked'))document.querySelector('input[name="option"]:checked').checked=false;
          });
        break;

        case "opcion2bis":
          document.getElementById("caja1236").innerHTML="";
          let lugarEC1=document.getElementById("caja1232"),lugarEC2=document.getElementById("caja1233");
          let labelEC=document.createElement("label"),inputEC=document.createElement("input");
          inputEC.style.width="150px";
          labelEC.textContent="Expresión:";lugarEC1.appendChild(labelEC);lugarEC2.appendChild(inputEC);
          let guiaC=document.getElementById("caja1231");guiaC.innerHTML="Ejemplo: C1=aC1+bC2-cC3";
          inputEC.focus();

          inputEC.addEventListener("keydown",function(event){
            if(event.key==="Enter"){
              try{
                estado="usuario";document.getElementById("caja1236").innerHTML="";
                let r=aplicarExpresionColumna(determinanteActual,inputEC.value);
                coeficienteDeterminante=_simp("("+coeficienteDeterminante+")/("+r.coefPropio+")");
                Representar.simboloCambiarLinea(inputEC.value,determinanteActual.length,caja21);
                Representar.coeficienteDeterminante(coeficienteDeterminante,determinanteActual.length,caja21);
                Representar.determinante(determinanteActual,caja21);

                if(Matriz.comprobarLineaNula(determinanteActual)){
                  lineaNulaFijada=Matriz.lineaNula(determinanteActual);comprobar=true;
                  imprimeResultadoFinal(determinanteActual,"inicialNula");return;
                }
                if(Matriz.comprobarLineasIguales(determinanteActual)){
                  lineasIgualesFijadas=Matriz.lineasIguales(determinanteActual);comprobar=true;
                  imprimeResultadoFinal(determinanteActual,"inicialIguales");return;
                }
                if(Matriz.comprobarLineasProporcionales(determinanteActual)){
                  lineasProporcionalesFijadas=Matriz.lineasProporcionales(determinanteActual);comprobar=true;
                  imprimeResultadoFinal(determinanteActual,"inicialProporcionales");return;
                }

                document.getElementById("caja1231").innerHTML="";document.getElementById("caja1232").innerHTML="";
                document.getElementById("caja1233").innerHTML="";document.getElementById("caja1234").innerHTML="";
                labelEC.remove();inputEC.remove();opcionSeleccionada.value=null;
                var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }catch(error){
                document.getElementById("caja1236").style.color="red";
                let msg="<br>Expresión no válida.<br>Usa un formato tipo C1=2C1+3C2-4C3";
                if(error&&error.message==="sinCoefPropio"){
                  msg="<br>La columna destino debe aparecer en el segundo miembro con coeficiente no nulo.<br>"+
                  "Ej: C1=2C1+3C2";
                }
                document.getElementById("caja1236").innerHTML=msg+"<br>Presiona \"RESET\" y elige una nueva opción";
                labelEC.remove();inputEC.remove();opcionSeleccionada.value=null;
                var opciones=document.getElementsByName("option");
                for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
              }
            }
          });

          botonReset.addEventListener("click",function(){
            document.getElementById("caja1236").innerHTML="";document.getElementById("caja1231").innerHTML="";
            try{labelEC.remove();inputEC.remove();}catch(e){}
            if(document.querySelector('input[name="option"]:checked'))document.querySelector('input[name="option"]:checked').checked=false;
          });
        break;

        case "opcion3":
          posibilidadesEleccion=Matriz.buscarLineaCasiNula(determinanteActual);let lineaElegida="";
          let lugarFila11=document.getElementById("caja1231"),lugarFila12=document.getElementById("caja1232");
          let inputFila12=document.createElement('input'),labelFila12=document.createElement('label');
          inputFila12.style.width="150px";

          if(posibilidadesEleccion.length===0){
            document.getElementById("caja1236").innerHTML=
            "El determinante no contiene, todavía, una fila o columna de elementos todos nulos excepto uno.<br>"+
            "Presiona \"RESET\" y elige una nueva opción";
            opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
            for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
          }else{
            document.getElementById("caja1236").innerHTML="";
            lugarFila11.innerHTML="Las filas y columnas que cumplen la condición son:  "+posibilidadesEleccion;
            labelFila12.textContent="Elige una posibilidad:  ";lugarFila12.appendChild(labelFila12);
            lugarFila12.appendChild(inputFila12);inputFila12.focus();

            inputFila12.addEventListener("keydown",function(event){
              if(event.key==="Enter"){
                try{
                  if(posibilidadesEleccion.includes(inputFila12.value)===false){throw new(error);}
                  lineaElegida=inputFila12.value;
                  coeficienteDeterminante=_simp("("+coeficienteDeterminante+")*("+
                    Matriz.reducirDeterminante(determinanteActual,lineaElegida)[1]+")");
                  Representar.simboloReducirDeterminante(lineaElegida,determinanteActual.length,caja21);
                  Representar.coeficienteDeterminante(coeficienteDeterminante.toString(),determinanteActual.length,caja21);
                  determinanteActual=Matriz.reducirDeterminante(determinanteActual,lineaElegida)[0];
                  Representar.determinante(determinanteActual,caja21);

                  if(Matriz.comprobarLineaNula(valores)){
                    lineaNulaFijada=Matriz.lineaNula(valores);comprobar=true;
                    imprimeResultadoFinal(valores,"inicialNula");return;
                  }
                  if(Matriz.comprobarLineasIguales(valores)){
                    lineasIgualesFijadas=Matriz.lineasIguales(valores);comprobar=true;
                    imprimeResultadoFinal(valores,"inicialIguales");return;
                  }
                  if(Matriz.comprobarLineasProporcionales(valores)){
                    lineasProporcionalesFijadas=Matriz.lineasProporcionales(valores);comprobar=true;
                    imprimeResultadoFinal(valores,"inicialProporcionales");return;
                  }

                  document.getElementById("caja1231").innerHTML="";document.getElementById("caja1232").innerHTML="";
                  inputFila12.remove();labelFila12.remove();posibilidadesEleccion=[];opcionSeleccionada.value=null;
                  var opciones=document.getElementsByName("option");
                  for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
                }catch{
                  document.getElementById("caja1236").style.color="red";
                  document.getElementById("caja1236").innerHTML=
                  "<br>La opción elegida no se encuentra entre las posibilidades<br>"+
                  "Presiona \"RESET\" y elige una nueva opción";
                  labelFila12.remove();inputFila12.remove();posibilidadesEleccion=[];opcionSeleccionada.value=null;
                  var opciones=document.getElementsByName("option");
                  for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
                }
              }
            });
          }

          botonReset.addEventListener("click",function(){
            lugarFila11.innerHTML="";document.getElementById("caja1236").innerHTML="";
            inputFila12.remove();labelFila12.remove();posibilidadesEleccion=[];
            if(document.querySelector('input[name="option"]:checked'))document.querySelector('input[name="option"]:checked').checked=false;
          });
        break;

        case "opcion4":
          document.getElementById("caja1236").innerHTML="";
          try{
            if(determinanteActual.length>3){throw new(error);}
            let deterA=determinanteActual.map(function(arr){return arr.slice()});
            let p1=document.createElement("div");p1.style.display="flex";p1.style.alignItems="center";caja21.appendChild(p1);
            deterA=Matriz.aNumerica(deterA);
            text="("+_simp("("+deterA[0][0]+")*("+deterA[1][1]+")*("+deterA[2][2]+")")+")+(";
            text=text+_simp("("+deterA[1][0]+")*("+deterA[2][1]+")*("+deterA[0][2]+")")+")+(";
            text=text+_simp("("+deterA[0][1]+")*("+deterA[1][2]+")*("+deterA[2][0]+")")+")-(";
            text=text+_simp("("+deterA[2][0]+")*("+deterA[1][1]+")*("+deterA[0][2]+")")+")-(";
            text=text+_simp("("+deterA[2][1]+")*("+deterA[1][2]+")*("+deterA[0][0]+")")+")-(";
            text=text+_simp("("+deterA[1][0]+")*("+deterA[0][1]+")*("+deterA[2][2]+")")+")";
            text=ExpresionAlgebraica.pasarALatex(text);text=text.replace(/\+\-/g,"-");
            if(coeficienteDeterminante==="1"){text="="+text+"=";}
            if(coeficienteDeterminante==="-1"){text="=-("+text+")=";}
            if(coeficienteDeterminante!=="1"&&coeficienteDeterminante!=="-1"){
              if(coeficienteDeterminante.includes("+")||coeficienteDeterminante.includes("-")){
                text="=("+coeficienteDeterminante+")\\cdot("+text+")=";
              }else{text="="+coeficienteDeterminante+"\\cdot("+text+")=";}
            }
            katex.render(text,p1);deterA=Matriz.aString(deterA);
            if(coeficienteDeterminante==="1"){text=ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA))+"=";}
            if(coeficienteDeterminante==="-1"){text="-("+ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA))+")=";}
            if(coeficienteDeterminante!=="1"&&coeficienteDeterminante!=="-1"){
              if(coeficienteDeterminante.includes("+")||coeficienteDeterminante.includes("-")){
                text="("+coeficienteDeterminante+")\\cdot("+ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA))+")=";
              }else{text=coeficienteDeterminante+"\\cdot("+ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA))+")=";}
            }
            let p2=document.createElement("div");p2.style.display="flex";p2.style.alignItems="center";caja21.appendChild(p2);
            text=ExpresionAlgebraica.pasarALatex(_simp("("+coeficienteDeterminante+")*("+Matriz.determinante(deterA)+")"));
            katex.render(text,p2);estado="usuario";imprimeResultadoFinal(determinanteActual,"usuario");
          }catch(error){
            document.getElementById("caja1236").style.color="red";
            document.getElementById("caja1236").innerHTML=
            "<br>El determinante todavía no tiene determinanteActual.length 3<br>"+
            "Presiona \"RESET\" y elige otra opción";
            opcionSeleccionada.value=null;var opciones=document.getElementsByName("option");
            for(let i=0;i<opciones.length;i++){if(opciones[i].checked){opciones[i].checked=false;break;}}
          }
        break;
      }
    });
  });
}

function botonResolucionAutomatica(){
  valoresCopia=valores.map(function(arr){return arr.slice();});
  let botonAutomatico=document.createElement("button");botonAutomatico.id="botonautomatico";
  botonAutomatico.innerHTML="SOLUCIÓN automática";
  let lugarBotonAutomatico=document.getElementById("caja222");lugarBotonAutomatico.appendChild(botonAutomatico);

  botonAutomatico.addEventListener("click",function(){
    estado="automatico";caja21.remove();let tiU=document.getElementById("tituloU");tiU.remove();
    Representar.determinante(valores,caja221);coeficienteDeterminante="1";

    while(orden>3){
      let linea=Matriz.elegirLineaConMasCeros(valores);

      if(linea[0]==="F"){
        let filaPivote=parseInt(linea[1])-1,columnaPivote,valorPivote;
        for(let j=0;j<orden;j++){if(valores[filaPivote][j]!=="0"){columnaPivote=j;valorPivote=valores[filaPivote][columnaPivote];break;}}
        for(let j=0;j<orden;j++){
          if(valores[filaPivote][j]!=="0"&&j!==columnaPivote){
            let a=valores[filaPivote][j],p=valorPivote,cp=_simp(p),c2=_simp("-("+a+")");
            let t1=_termLin(cp,"C",j+1).replace(/^\+/,""),t2=_termLin(c2,"C",columnaPivote+1);
            let expr="C"+(j+1)+"="+t1+t2;
            let r=aplicarExpresionColumna(valores,expr);
            coeficienteDeterminante=_simp("("+coeficienteDeterminante+")/("+r.coefPropio+")");
            Representar.simboloCambiarLinea(expr,valores.length,caja221);
            Representar.coeficienteDeterminante(coeficienteDeterminante,valores.length,caja221);
            Representar.determinante(valores,caja221);valoresCopia=valores.map(function(arr){return arr.slice();});
          }
        }
        coeficienteDeterminante=_simp("("+coeficienteDeterminante+")*("+Matriz.reducirDeterminante(valores,linea)[1]+")");
        valores=Matriz.reducirDeterminante(valores,linea)[0];orden=valores.length;
        Representar.simboloReducirDeterminante(linea,valores.length+1,caja221);
        Representar.coeficienteDeterminante(coeficienteDeterminante,valores.length+1,caja221);
        Representar.determinante(valores,caja221,linea);valoresCopia=valores.map(function(arr){return arr.slice();});
      }

      if(linea[0]==="C"){
        let filaPivote,columnaPivote,valorPivote;
        for(let i=0;i<orden;i++){
          if(valores[i][parseInt(linea[1])-1]!=="0"){
            filaPivote=i;columnaPivote=parseInt(linea[1])-1;valorPivote=valores[filaPivote][columnaPivote];break;
          }
        }
        for(let i=0;i<orden;i++){
          if(valores[i][columnaPivote]!=="0"&&i!==filaPivote){
            let b=valores[i][columnaPivote],p=valorPivote,cp=_simp(p),c2=_simp("-("+b+")");
            let t1=_termLin(cp,"F",i+1).replace(/^\+/,""),t2=_termLin(c2,"F",filaPivote+1);
            let expr="F"+(i+1)+"="+t1+t2;
            let r=aplicarExpresionFila(valores,expr);
            coeficienteDeterminante=_simp("("+coeficienteDeterminante+")/("+r.coefPropio+")");
            Representar.simboloCambiarLinea(expr,valores.length,caja221);
            Representar.coeficienteDeterminante(coeficienteDeterminante,valores.length,caja221);
            Representar.determinante(valores,caja221);valoresCopia=valores.map(function(arr){return arr.slice();});
          }
        }
        coeficienteDeterminante=_simp("("+coeficienteDeterminante+")*("+Matriz.reducirDeterminante(valores,linea)[1]+")");
        valores=Matriz.reducirDeterminante(valores,linea)[0];orden=valores.length;
        Representar.simboloReducirDeterminante(linea,valores.length+1,caja221);
        Representar.coeficienteDeterminante(coeficienteDeterminante,valores.length+1,caja221);
        Representar.determinante(valores,caja221,linea);valoresCopia=valores.map(function(arr){return arr.slice();});
      }
    }
    if(orden===3){imprimeResultadoFinal(valores,"orden3");}
    botonAutomatico.remove();
  });
}

function imprimeResultadoFinal(det,tex){
  let caja12=document.getElementById("caja12");while(caja12.firstChild)caja12.removeChild(caja12.firstChild);
  caja12.style.display="block";let caja121=document.createElement("div"),caja122=document.createElement("div");
  caja12.appendChild(caja121);caja12.appendChild(caja122);caja121.id="caja121";caja122.id="caja122";
  caja121.style.display="flex";caja122.style.display="flex";caja121.style.justifyContent="center";
  caja122.style.justifyContent="center";caja121.style.paddingTop="105px";
  if(tex==="inicialNula"){caja121.innerHTML="<B>LA "+lineaNulaFijada+" TIENE TODOS LOS ELEMENTOS NULOS.</B>";caja122.innerHTML="<br>Por tanto, el valor del determinante es 0";}
  if(tex==="inicialIguales"){caja121.innerHTML="<B>LAS "+lineasIgualesFijadas+" SON IGUALES.</B>";caja122.innerHTML="<br>Por tanto, el valor del determinante es 0";}
  if(tex==="inicialProporcionales"){caja121.innerHTML="<B>LAS "+lineasProporcionalesFijadas+" SON PROPORCIONALES.</B>";caja122.innerHTML="<br>Por tanto, el valor del determinante es 0";}
  if(tex==="finalNula"){caja121.innerHTML="<B>LA "+lineaNulaFijada+" DEL ÚLTIMO DETERMINANTE OBTENIDO TIENE TODOS LOS ELEMENTOS NULOS.</B>";caja122.innerHTML="<br>Por tanto, el valor del determinante es 0";}
  if(tex==="finalIguales"){caja121.innerHTML="<B>LAS "+lineasIgualesFijadas+" DEL ÚLTIMO DETERMINANTE OBTENIDO SON IGUALES.</B>";caja122.innerHTML="<br>Por tanto, el valor del determinante es 0";}
  if(tex==="finalProporcionales"){caja121.innerHTML="<B>LAS "+lineasProporcionalesFijadas+" DEL ÚLTIMO DETERMINANTE OBTENIDO SON PROPORCIONALES.</B>";caja122.innerHTML="<br>Por tanto, el valor del determinante es 0";}
  if(tex==="orden2"){caja121.innerHTML="<B>EL DETERMINANTE DE SEGUNDO ORDEN VALE:</B>";Representar.determinanteOrden2(det,caja122);}
  if(tex==="orden3"&&estado!=="automatico"){caja121.innerHTML="<B>EL DETERMINANTE DE TERCER ORDEN VALE:</B>";Representar.determinanteOrden3(det,caja122);}
  if(tex==="orden3"&&estado==="automatico"){
    let caja222=document.getElementById("caja222");if(caja222)caja222.remove();let caja221=document.getElementById("caja221");
    let n0=caja221.childElementCount;Representar.determinanteOrden3Desarrollo(det,caja221);
    if(caja221.childElementCount>n0){let u=caja221.lastElementChild;if(u)u.remove();}
    let d3=det.map(a=>a.slice());d3=Matriz.aNumerica(d3);
    let e="("+_simp("("+d3[0][0]+")*("+d3[1][1]+")*("+d3[2][2]+")")+")+(";
    e+=_simp("("+d3[1][0]+")*("+d3[2][1]+")*("+d3[0][2]+")")+")+(";
    e+=_simp("("+d3[0][1]+")*("+d3[1][2]+")*("+d3[2][0]+")")+")-(";
    e+=_simp("("+d3[2][0]+")*("+d3[1][1]+")*("+d3[0][2]+")")+")-(";
    e+=_simp("("+d3[2][1]+")*("+d3[1][2]+")*("+d3[0][0]+")")+")-(";
    e+=_simp("("+d3[1][0]+")*("+d3[0][1]+")*("+d3[2][2]+")")+")";
    let v3=Matriz.determinante(det),vf=_simp("("+coeficienteDeterminante+")*("+v3+")");
    let tdev=ExpresionAlgebraica.pasarALatex(e).replace(/\+\-/g,"-"),t3=ExpresionAlgebraica.pasarALatex(v3),tf=ExpresionAlgebraica.pasarALatex(vf);
    let tc=coeficienteDeterminante,tcl=ExpresionAlgebraica.pasarALatex(tc),simple=/^-?\d+(\/\d+)?$/.test(tc),linea="";
    if(tc==="1")linea="=("+tdev+")=("+t3+")="+tf;else if(tc==="-1")linea="=-("+tdev+")=-("+t3+")="+tf;
    else if(simple)linea="="+tcl+"\\cdot("+tdev+")="+tcl+"\\cdot("+t3+")="+tf;else linea="=("+tcl+")\\cdot("+tdev+")=("+tcl+")\\cdot("+t3+")="+tf;
    let p5=document.createElement("div");p5.style.display="flex";p5.style.alignItems="center";caja221.appendChild(p5);
    katex.render(linea.replace(/\+\-/g,"-"),p5);
  }
  let caja1122=document.getElementById("caja1122");caja1122.style.display="block";
  let tit1=document.createElement("div"),tit2=document.createElement("div");caja1122.appendChild(tit1);caja1122.appendChild(tit2);
  tit1.style.fontSize="18px";tit1.style.fontWeight="bold";tit1.style.marginTop="5px";tit2.style.height="75%";
  tit1.innerHTML="EL VALOR DEL DETERMINANTE ES: ";tit2.id="tit2";tit2.style.fontSize="15px";
  tit2.style.display="flex";tit2.style.alignItems="center";tit2.style.justifyContent="center";
  let tit3=document.createElement("div");tit2.appendChild(tit3);tit3.style.fontSize="15px";tit3.innerHTML="A=";
  Representar.determinante(determinanteInicial,tit2);
  let tit4=document.createElement("div");tit2.appendChild(tit4);tit4.style.fontWeight="bold";tit4.style.fontSize="15px";
  let texx="="+Matriz.determinante(determinanteInicial);katex.render(texx,tit4);

  tit1.style.margin="0";tit1.style.padding="12px 16px";tit1.style.textAlign="left";tit1.style.width="100%";
  let c11211=document.getElementById("caja11211"),h=c11211?c11211.querySelector("h3"):null;
  if(c11211){c11211.style.display="block";c11211.style.width="100%";}
  if(h){h.style.margin="0";h.style.padding="12px 16px";h.style.textAlign="left";h.style.width="100%";}

  let c1121=document.getElementById("caja1121"),c1122=document.getElementById("caja1122"),c11212=document.getElementById("caja11212");
  if(c1121&&c1122){
    let s=getComputedStyle(c1122);
    c1121.style.background=s.background;c1121.style.backgroundColor=s.backgroundColor;c1121.style.border=s.border;
    c1121.style.borderRadius=s.borderRadius;c1121.style.boxShadow=s.boxShadow;c1121.style.padding=s.padding;c1121.style.overflow=s.overflow;
    c1121.style.display="flex";c1121.style.flexDirection="column";
    if(c11211){
      c11211.style.display="flex";c11211.style.justifyContent="flex-start";c11211.style.alignItems="center";
      c11211.style.padding="12px 16px";c11211.style.margin="0";
      let hh=c11211.querySelector("h3");if(hh){hh.style.margin="0";hh.style.textAlign="left";hh.style.fontSize="18px";}
    }
    if(c11212){
      c11212.style.height="75%";c11212.style.display="flex";c11212.style.alignItems="center";
      c11212.style.justifyContent="center";c11212.style.fontSize="15px";
    }
  }

  let caja2=document.getElementById("caja2");if(estado==="inicial"){if(caja2)caja2.remove();return;}
  let c111=document.getElementById("caja111");if(c111)c111.remove();
  if(estado==="usuario"){
    let caja22=document.getElementById("caja22");if(caja22)caja22.remove();
    let ti=document.getElementById("tituloA");if(ti)ti.remove();
    let c12=document.getElementById("caja12");if(c12)c12.remove();
    return;
  }
  if(estado==="automatico"){
    let caja21b=document.getElementById("caja21");if(caja21b)caja21b.remove();
    let tic=document.getElementById("tituloA");if(tic)tic.remove();
    let caja12c=document.getElementById("caja12");if(caja12c)caja12c.remove();
  }
}






document.addEventListener('DOMContentLoaded',function(){
  insertarBotonOtroDeterminante();
  const abreVentana1=document.getElementById("abreVentana1"),cierraVentana1=document.getElementById("cierraVentana1");
  const ventana=document.getElementById("ventana1"),pdf1=document.getElementById("pdf1");
  const pdf1URL="INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300";
  abreVentana1.addEventListener('click',function(event){
    event.preventDefault();pdf1.src=pdf1URL;ventana.style.display='flex';
  });
  cierraVentana1.addEventListener('click',function(){ventana.style.display='none';pdf1.src='';});
  window.addEventListener('click',function(event){
    if(event.target==ventana){ventana.style.display='none';pdf1.src='';}
  });
});
