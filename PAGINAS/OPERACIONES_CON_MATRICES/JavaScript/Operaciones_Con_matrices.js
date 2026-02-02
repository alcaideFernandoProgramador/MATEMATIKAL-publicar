let ventana1=document.getElementById("ventana1"),contenedor=document.getElementById("contenedor"),
caja1=document.getElementById("caja1"),tituloCaja1=document.getElementById("tituloCaja1"),
ventana2=document.getElementById("ventana2"),caja2=document.getElementById("caja2"),
tituloUsuario=document.getElementById("letreroUsuario");tituloUsuario.style.fontSize="20px";
let ventana3=document.getElementById("ventana3");caja2.style.marginTop="10px";
tituloUsuario.style.margin="10px 0px 10px 0px";

let numeroMatrices=0,nombreMatrices=[],matrices=[],matricesIniciales=[];caja2.style.display="none";
let aviso=document.createElement("div");tituloCaja1.appendChild(aviso);aviso.style.fontSize="12px";
aviso.style.color="red";aviso.textContent="(Valida todos los datos introducidos con la tecla ENTER del teclado)";
crearMatrices();let matricesCreadasActuales=[];

const mantenerScrollAbajo=el=>{if(!el)return;requestAnimationFrame(()=>{el.scrollTop=el.scrollHeight});
setTimeout(()=>{el.scrollTop=el.scrollHeight},0);setTimeout(()=>{el.scrollTop=el.scrollHeight},120)};

const activarAutoScroll=caja=>{if(!caja)return;caja.style.scrollBehavior="smooth";
try{new MutationObserver(()=>mantenerScrollAbajo(caja)).observe(caja,{childList:true,subtree:true})}catch(_){}}; 


const prepararExpresionMatrices=e=>{let s=String(e||"").replace(/\s+/g,"");
s=s.replace(/(^|[^\w\.])(-?\d+\s*\/\s*\d+)\s*([A-Za-z]\w*)/g,(_,p,f,m)=>p+"("+f.replace(/\s+/g,"")+")*"+m);
s=s.replace(/(^|[^\w\.])(-?\d*\.\d+|-?\d+)\s*([A-Za-z]\w*)/g,(_,p,n,m)=>p+"("+n+")*"+m);
s=s.replace(/\)\s*([A-Za-z]\w*)/g,")*$1");return s};

const crearCajaOperacion=()=>{let w=document.createElement("div");w.className="opBox";
w.style.cssText="display:block;width:99%;max-width:99%;border:1px solid #999;border-radius:6px;padding:8px;margin:8px 0;box-sizing:border-box;";
return w};

const crearCajaError=msg=>{let w=crearCajaOperacion();w.style.borderColor="#d33";let t=document.createElement("div");
t.style.cssText="font:13px system-ui;color:#d33;white-space:pre-wrap;";t.textContent="❌ "+msg+" Presiona RESET.";
w.appendChild(t);return w};

const pintarErrorEnCaja21=msg=>{let c125=document.getElementById("caja125");if(!c125)return;
c125.style.color="red";c125.innerHTML="❌ "+msg};

const envolverInversa=()=>{if(Matriz.__inversaEnvuelta)return;Matriz.__inversaOriginal=Matriz.inversa;
Matriz.inversa=function(A){if(!Array.isArray(A)||!Array.isArray(A[0]))throw new Error("La matriz debe ser cuadrada.");
if(A.length!==A[0].length)throw new Error("La matriz debe ser cuadrada.");
if(Matriz.determinante(A)==="0")throw new Error("La matriz no es regular y, por tanto, no tiene inversa.");
return Matriz.__inversaOriginal(A)};Matriz.__inversaEnvuelta=true};

window.addEventListener("error",e=>{let m=e?.error?.message||e?.message||"";if(/cuadrada|no es regular|inversa/i.test(m))pintarErrorEnCaja21(m)});
window.addEventListener("unhandledrejection",e=>{let m=e?.reason?.message||String(e.reason||"");if(/cuadrada|no es regular|inversa/i.test(m))pintarErrorEnCaja21(m)});

async function crearMatrices(){contenedor.style.display="flex";contenedor.style.justifyContent="center";
caja1.style.width="auto";caja1.style.height="auto";caja1.style.minHeight="0";
caja1.style.border="1px solid black";caja1.style.padding="8px 12px";let caja11=document.createElement("div");caja11.id="caja11";
caja11.style.display="flex";caja11.style.marginTop="15px";caja1.appendChild(caja11);
let caja111=document.createElement("div");caja111.id="caja111";caja111.textContent="Nº de matrices";
caja111.style.marginRight="5px";caja11.appendChild(caja111);let caja112=document.createElement("div");
caja112.id="caja112";caja11.appendChild(caja112);let contenedorMatriz=document.createElement('div');
caja1.appendChild(contenedorMatriz);document.getElementById("tituloCaja1")?.remove();
document.getElementById("caja11")?.remove();await Crear.matrices(contenedorMatriz);crearFormulario()}

function crearFormulario(){contenedor.style.display="block";while(caja1.firstChild)caja1.removeChild(caja1.firstChild);
caja1.style.cssText=`display:flex;width:100%;height:auto;border:1px solid black;padding:5px;box-sizing:border-box;`;
let caja2=document.getElementById("caja2");caja2.style.display="block";let caja21=document.getElementById("caja21");caja21.scrollTop=caja21.scrollHeight;
if(!caja21){caja21=document.createElement("div");caja21.id="caja21";caja2.appendChild(caja21);
caja21.style.display="block";caja21.style.height="70%";caja21.style.width="95%";caja21.style.border="1px solid black";
caja21.style.minHeight="15px";caja21.style.overflowY="auto"}activarAutoScroll(caja21);

let cajaMatricesIntroducidas=document.createElement("div");cajaMatricesIntroducidas.id="cajaMatricesIntroducidas";
cajaMatricesIntroducidas.style.cssText=`width:auto;min-width:33%;margin-right:10px;border:1px solid black;padding:5px;box-sizing:border-box;height:auto;overflow:visible;`;
caja1.appendChild(cajaMatricesIntroducidas);let cajaFormulario=document.createElement("div");
cajaFormulario.id="cajaFormulario";cajaFormulario.style.cssText=`flex:1;border:1px solid black;padding:5px;box-sizing:border-box;height:auto;overflow:visible;`;
caja1.appendChild(cajaFormulario);

let caja111=document.createElement("div");caja111.id="caja111";cajaMatricesIntroducidas.appendChild(caja111);
let titulo=document.createElement("h3");titulo.textContent="MATRICES INTRODUCIDAS";caja111.appendChild(titulo);
let caja112=document.createElement("div");caja112.id="caja112";
caja112.style.cssText=`display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:flex-start;margin-top:15px;font-size:13px;`;
cajaMatricesIntroducidas.appendChild(caja112);let caja113=document.createElement("div");
caja113.id="caja113";cajaMatricesIntroducidas.appendChild(caja113);

matrices=structuredClone(matricesCreadas);matricesIniciales=structuredClone(matricesCreadas);
for(let i=0;i<matricesCreadas.length;i++){matricesCreadasActuales.push(matricesCreadas[i].matriz);
nombreMatrices.push(matricesCreadas[i].nombre)};matricesCreadas=matricesCreadasActuales.map(arr=>arr.slice());

matricesCreadasActuales.forEach((matriz,i)=>{let divMatriz=document.createElement("div");
divMatriz.style.cssText=`display:flex;align-items:center;margin-bottom:15px;margin-right:20px;width:calc(33.33% - 20px);min-height:110px;`;
let label=document.createElement("div");label.textContent=`${nombreMatrices[i]}=`;
label.style.cssText=`font-weight:bold;margin-right:5px;font-size:16px;`;divMatriz.appendChild(label);
Representar.matriz(matriz,divMatriz);caja112.appendChild(divMatriz)});

let caja121=document.createElement("h3");caja121.id="tituloFormulario";
caja121.textContent="OPCIONES PARA OPERAR CON LAS MATRICES INTRODUCIDAS";
caja121.style.cssText=`display:flex;width:99%;justify-content:center;`;cajaFormulario.appendChild(caja121);

const opciones=["Sumar dos matrices","Restar dos matrices","Multiplicar dos matrices",
"Multiplicar un número por una matriz","Traspuesta de una matriz","Inversa de una matriz",
"Potencia de una matriz","Operaciones combinadas: mostrar paso a paso",
"Operaciones combinadas: mostrar pasos de forma automática",
"Operaciones combinadas: mediante pasos realizados por el usuario"];

opciones.forEach((texto,i)=>{let contenedor=document.createElement("div");
contenedor.style.cssText=`display:flex;align-items:center;height:20px;width:99%;`;let input=document.createElement("input");
input.type="radio";input.name="option";input.value=`opcion${i+1}`;input.className="inputCorto";
input.style.cssText=`transform:scale(0.8);margin-left:10px;margin-right:8px;`;let label=document.createElement("label");
label.textContent=`Opción ${i+1}: ${texto}`;label.style.fontSize="16px";contenedor.appendChild(input);
contenedor.appendChild(label);cajaFormulario.appendChild(contenedor)});

let caja122=document.createElement("div");caja122.id="caja122";caja122.style.cssText="display:flex;width:99%;margin-top:5px;";
cajaFormulario.appendChild(caja122);let botonSeleccionar=document.createElement("button");
botonSeleccionar.textContent="Seleccionar";caja122.appendChild(botonSeleccionar);

let caja123=document.createElement("div");caja123.id="caja123";
caja123.style.cssText="display:flex;width:99%;justify-content:right;";cajaFormulario.appendChild(caja123);
let botonReset=document.createElement("button");botonReset.textContent="RESET";caja123.appendChild(botonReset);

let caja124=document.createElement("div");caja124.id="caja124";caja124.style.cssText="display:block;width:99%;";
cajaFormulario.appendChild(caja124);let caja125=document.createElement("div");caja125.id="caja125";
caja125.style.cssText="display:block;width:99%;";cajaFormulario.appendChild(caja125);let opcionSeleccionada=null;

function crearLineaResultado(tit,matrices,resultado,operacionSimbolo=""){let wrap=crearCajaOperacion();
let contenedor=document.createElement("div");contenedor.id="contenedorResultado";
contenedor.style.cssText="display:flex;align-items:center;gap:5px;margin:4px 0;flex-wrap:wrap;";
let parte1=document.createElement("div");parte1.id="parte1";parte1.style.fontSize="13px";
katex.render(tit+"=",parte1,{throwOnError:false});contenedor.appendChild(parte1);

const mostrarOperandos=()=>{if(matrices.length===2&&typeof matrices[0]==='number'&&Array.isArray(matrices[1])
&&operacionSimbolo==="\\cdot"){let escalarDiv=document.createElement("div");escalarDiv.id="escalarDiv";
escalarDiv.textContent=matrices[0];escalarDiv.style.fontWeight="bold";escalarDiv.style.fontSize="16px";
contenedor.appendChild(escalarDiv);let signo=document.createElement("div");signo.id="signo";
signo.style.display="flex";signo.style.justifyContent="center";signo.style.fontSize="17px";
katex.render("\\cdot",signo,{throwOnError:false});contenedor.appendChild(signo);let contMat=document.createElement("div");
contMat.id="contMat";contMat.style.fontSize="13px";let bloque=document.createElement("div");bloque.id="bloque";
bloque.style.display="inline-flex";bloque.style.alignItems="flex-start";Representar.matriz(matrices[1],contMat);
bloque.appendChild(contMat);contenedor.appendChild(bloque);let igual=document.createElement("div");
igual.style.fontSize="17px";igual.textContent="=";contenedor.appendChild(igual)}else{matrices.forEach((mat,i)=>{
if(i>0&&operacionSimbolo&&operacionSimbolo!=="^{t}"&&operacionSimbolo!=="^{-1}"&&!operacionSimbolo.startsWith("^{")){
let signo=document.createElement("div");signo.id="signo";signo.style.display="flex";signo.style.justifyContent="center";
signo.style.fontSize="17px";katex.render(operacionSimbolo,signo,{throwOnError:false});contenedor.appendChild(signo)}
if(Array.isArray(mat)){let contMat=document.createElement("div");contMat.id="contMat";contMat.style.fontSize="13px";
let bloque=document.createElement("div");bloque.id="bloque";bloque.style.display="inline-flex";
bloque.style.alignItems="flex-start";Representar.matriz(mat,contMat);bloque.appendChild(contMat);
if(matrices.length===1&&(operacionSimbolo==="^{t}"||operacionSimbolo==="^{-1}"||operacionSimbolo.startsWith("^{"))){
let simboloUnario=document.createElement("div");simboloUnario.id="simboloUnario";simboloUnario.style.fontSize="17px";
katex.render(operacionSimbolo,simboloUnario,{throwOnError:false});bloque.appendChild(simboloUnario)}
contenedor.appendChild(bloque)}else{let escalarDiv=document.createElement("div");escalarDiv.id="escalarDiv";
escalarDiv.textContent=mat;escalarDiv.style.fontWeight="bold";escalarDiv.style.fontSize="16px";
contenedor.appendChild(escalarDiv)}});let igual=document.createElement("div");igual.style.fontSize="17px";
igual.textContent="=";contenedor.appendChild(igual)}};const mostrarResultadoFinal=()=>{let contRes=document.createElement("div");
contRes.id="contRes";contRes.style.fontSize="13px";Representar.matriz(resultado,contRes);contenedor.appendChild(contRes)};

const mostrarInputs=()=>{const filas=resultado.length,columnas=resultado[0].length;let tablaInputs=document.createElement("table");
tablaInputs.style.borderCollapse="collapse";tablaInputs.style.marginRight="5px";tablaInputs.style.userSelect="none";
let contenedorParentesis=document.createElement("div");contenedorParentesis.style.display="flex";
contenedorParentesis.style.alignItems="center";contenedorParentesis.style.gap="2px";
Representar.abrirParentesis(filas+1,contenedorParentesis);contenedorParentesis.appendChild(tablaInputs);
Representar.cerrarParentesis(filas+1,contenedorParentesis);let mensajeError=document.createElement("div");
mensajeError.style.color="red";mensajeError.style.fontSize="13px";mensajeError.style.marginTop="5px";
mensajeError.style.display="none";mensajeError.textContent="❌ ERROR";contenedorParentesis.appendChild(mensajeError);
let primerInput=null;for(let i=0;i<filas;i++){let fila=document.createElement("tr");for(let j=0;j<columnas;j++){
let celda=document.createElement("td");celda.style.border="1px solid black";celda.style.padding="2px";
let input=document.createElement("input");input.type="text";input.style.width="40px";input.style.fontSize="13px";
input.style.textAlign="center";if(!primerInput)primerInput=input;input.addEventListener("keydown",e=>{
if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();e.preventDefault();mensajeError.style.display="none";let valor=input.value.trim();
let correcto=resultado[i][j];if(valor===""||ExpresionAlgebraica.simplificar("("+valor+")-("+correcto+")")!=="0"){
input.value="";input.style.border="2px solid red";mensajeError.style.display="block";input.focus()}else{
input.style.border="";let inputs=tablaInputs.querySelectorAll("input");let actualIndex=[...inputs].indexOf(input);
let siguiente=inputs[actualIndex+1];if(siguiente)siguiente.focus();else{contenedorParentesis.remove();
let botonRes=document.getElementById("botonRes");botonRes.remove();mostrarResultadoFinal();
mantenerScrollAbajo(document.getElementById("caja21"))}}}});celda.appendChild(input);fila.appendChild(celda)}
tablaInputs.appendChild(fila)}contenedor.appendChild(contenedorParentesis);setTimeout(()=>{if(primerInput)primerInput.focus()},0);
mostrarBotonResultado(contenedorParentesis,mostrarResultadoFinal)};

function mostrarBotonResultado(contenedorParaRemover,funcionParaMostrarResultado){let botonRes=document.createElement("button");
botonRes.id="botonRes";botonRes.style.fontSize="13px";
botonRes.innerHTML="RESOLVER AUTOMÁTICAMENTE<br>(no se recomienda)";
document.getElementById("caja21").appendChild(botonRes);mantenerScrollAbajo(document.getElementById("caja21"));
botonRes.addEventListener("click",()=>{contenedorParaRemover.remove();funcionParaMostrarResultado();botonRes.remove();
mantenerScrollAbajo(document.getElementById("caja21"))})}

mostrarOperandos();mostrarInputs();let c21=document.getElementById("caja21");wrap.appendChild(contenedor);
c21.appendChild(wrap);mantenerScrollAbajo(c21)}

function resetearFormulario(){caja124.innerHTML="";caja125.innerHTML="";opcionSeleccionada=null;
document.querySelectorAll('input[name="option"]').forEach(op=>op.checked=false)}

function crearInputsYProcesar(inputConfigs,operacion,simbolo){envolverInversa();caja124.innerHTML="";caja125.innerHTML="";
const inputs=[],inputValues=[];inputConfigs.forEach(config=>{let div=document.createElement("div");
let label=document.createElement("label");label.textContent=config.label;let input=document.createElement("input");
input.className="inputCorto";input.type="text";div.append(label,input);caja124.appendChild(div);inputs.push(input)});
inputs[0].focus();inputs.forEach((input,idx)=>{input.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();
e.preventDefault();inputValues[idx]=input.value.trim();if(idx+1<inputs.length){inputs[idx+1].focus()}else{try{
let matricesOperandos=[],nombreOperandos=[],escalar=null,exponente=null;inputConfigs.forEach((config,i)=>{
let val=inputValues[i];if(config.type==='matriz'){let indiceMatriz=nombreMatrices.indexOf(val);
if(indiceMatriz===-1){throw new Error(`Nombre de matriz "${val}" no válido. Asegúrate de escribirlo exactamente como aparece. Presiona RESET`)}
matricesOperandos.push(matricesCreadasActuales[indiceMatriz]);nombreOperandos.push(val)}else if(config.type==='numero'){
if(opcionSeleccionada==="opcion4"){escalar=val}else{let num=Number(val);if(isNaN(num))throw new Error("Por favor, introduce un valor numérico válido.");
if(config.label.includes('Exponente')){if(!Number.isInteger(num)||num<0)throw new Error("El exponente debe ser un número entero mayor o igual a 0.");
exponente=num}else if(config.label.includes('Escalar')){escalar=num}}}});
if((operacion===Matriz.sumar||operacion===Matriz.restar)
&&matricesOperandos.length===2){if(matricesOperandos[0].length!==matricesOperandos[1].length
||matricesOperandos[0][0].length!==matricesOperandos[1][0].length)throw new Error("Para poder sumar o restar dos matrices, deben tener la misma dimensión. Presiona RESET.")}
if(operacion===Matriz.multiplicar&&matricesOperandos.length===2){if(matricesOperandos[0][0].length!==matricesOperandos[1].length)
throw new Error("Para poder multiplicar dos matrices, el número de columnas de la primera debe coincidir con el de filas de la segunda. Presiona RESET.")}
if(operacion===Matriz.potencia&&matricesOperandos.length===1){if(matricesOperandos[0].length!==matricesOperandos[0][0].length)
throw new Error("La matriz debe ser cuadrada. Presiona RESET.")}
if(operacion===Matriz.inversa&&matricesOperandos.length===1){if(matricesOperandos[0].length!==matricesOperandos[0][0].length)
throw new Error("La matriz debe ser cuadrada. Presiona RESET.");if(Matriz.determinante(matricesOperandos[0])==="0")
throw new Error("La matriz no es regular y, por tanto, no tiene inversa. Presiona RESET.")}
let resultado,tituloParaResultado,simboloParaOperandosEnDisplay=simbolo,operandosParaDisplay=[];
if(operacion===Matriz.potencia){resultado=operacion(matricesOperandos[0],exponente);
tituloParaResultado=`${nombreOperandos[0]}^{${exponente}}`;simboloParaOperandosEnDisplay=`^{${exponente}}`;
operandosParaDisplay.push(matricesOperandos[0])}else if(operacion===Matriz.trasponer){
resultado=operacion(matricesOperandos[0]);tituloParaResultado=`${nombreOperandos[0]}${simbolo}`;
simboloParaOperandosEnDisplay=simbolo;operandosParaDisplay.push(matricesOperandos[0])}else if(operacion===Matriz.inversa){
resultado=operacion(matricesOperandos[0]);tituloParaResultado=`${nombreOperandos[0]}${simbolo}`;
simboloParaOperandosEnDisplay=simbolo;operandosParaDisplay.push(matricesOperandos[0])}else if(operacion===Matriz.multiplicarEscalar){
resultado=operacion(escalar,matricesOperandos[0]);tituloParaResultado=`${escalar} \\cdot ${nombreOperandos[0]}`;
simboloParaOperandosEnDisplay="\\cdot";operandosParaDisplay.push(escalar);operandosParaDisplay.push(matricesOperandos[0])}else{
resultado=operacion(...matricesOperandos);tituloParaResultado=nombreOperandos.join(` ${simbolo} `);
simboloParaOperandosEnDisplay=simbolo;operandosParaDisplay=matricesOperandos}
crearLineaResultado(tituloParaResultado,operandosParaDisplay,resultado,simboloParaOperandosEnDisplay);
resetearFormulario();caja125.style.color="";caja125.innerHTML="";
mantenerScrollAbajo(document.getElementById("caja21"))}catch(err){let msg=err.message||String(err);
pintarErrorEnCaja21(msg)}}}})})}

botonSeleccionar.addEventListener("click",function(){let radioSeleccionado=document.querySelector('input[name="option"]:checked');
if(!radioSeleccionado)return;opcionSeleccionada=radioSeleccionado.value;caja124.innerHTML="";caja125.innerHTML="";
envolverInversa();switch(opcionSeleccionada){case"opcion1":return crearInputsYProcesar(
[{type:'matriz',label:'Matriz 1:'},{type:'matriz',label:'Matriz 2:'}],Matriz.sumar,"+");
case"opcion2":return crearInputsYProcesar([{type:'matriz',label:'Matriz 1:'},{type:'matriz',label:'Matriz 2:'}],Matriz.restar,"-");
case"opcion3":return crearInputsYProcesar([{type:'matriz',label:'Matriz 1:'},{type:'matriz',label:'Matriz 2:'}],Matriz.multiplicar,"\\cdot");
case"opcion4":return crearInputsYProcesar([{type:'numero',label:'Escalar:'},{type:'matriz',label:'Matriz:'}],Matriz.multiplicarEscalar,"\\cdot");
case"opcion5":return crearInputsYProcesar([{type:'matriz',label:'Matriz:'}],Matriz.trasponer,"^{t}");
case"opcion6":return crearInputsYProcesar([{type:'matriz',label:'Matriz:'}],Matriz.inversa,"^{-1}");
case"opcion7":return crearInputsYProcesar([{type:'matriz',label:'Nombre de la matriz:'},{type:'numero',label:'Exponente (entero positivo):'}],Matriz.potencia);
case"opcion8":{let label=document.createElement("label");label.textContent="Escribe la operación combinada:";
let input=document.createElement("input");input.className="inputLargo";caja124.append(label,input);input.focus();
input.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();try{resetearFormulario();caja125.style.color="";
caja125.innerHTML="";let expre=prepararExpresionMatrices(input.value);let wrap=crearCajaOperacion();
let contenedorResultado=document.createElement("div");wrap.appendChild(contenedorResultado);
document.getElementById("caja21").appendChild(wrap);
Representar.expresionMatricialPasoaPaso2(expre,matrices,contenedorResultado);
mantenerScrollAbajo(document.getElementById("caja21"))}catch(err){let msg=err.message||String(err);
pintarErrorEnCaja21(msg)}}});break}
case"opcion9":{let label=document.createElement("label");label.textContent="Escribe la operación combinada:";
let input=document.createElement("input");input.className="inputLargo";caja124.append(label,input);input.focus();
input.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();try{resetearFormulario();caja125.style.color="";
caja125.innerHTML="";function signoIgual(){let contenedorIgual=document.createElement("div");
contenedorIgual.id="contenedorIgual";contenedorIgual.style.cssText="width:auto;height:auto;display:flex;align-items:center;margin-bottom:10px;font-size:13px;";
contenedorResultado.appendChild(contenedorIgual);katex.render("=",contenedorIgual)}let expre=prepararExpresionMatrices(input.value);
let wrap=crearCajaOperacion();let contenedorResultado=document.createElement("div");wrap.appendChild(contenedorResultado);
document.getElementById("caja21").appendChild(wrap);Representar.expresionMatricial(expre,matrices,contenedorResultado);
signoIgual();Representar.expresionMatricialPasoaPaso(expre,matrices,contenedorResultado);
mantenerScrollAbajo(document.getElementById("caja21"))}catch(err){let msg=err.message||String(err);
pintarErrorEnCaja21(msg)}}});break}

case"opcion10":{let label=document.createElement("label");
label.textContent="Escribe la operación combinada (el usuario realizará los pasos):";
let input=document.createElement("input");input.className="inputLargo";caja124.append(label,input);input.focus();
const preparar10=txt=>{let s=String(txt||"").replace(/\s+/g,"").replace(/·|\\cdot/g,"*");
s=s.replace(/\b([A-Za-z]\w*)\(/g,"$1*(").replace(/(\d|\))([A-Za-z]\w*)/g,"$1*$2").replace(/\)\(/g,")*(");
const aDecimal=t=>{try{return ExpresionAlgebraica.pasarADecimal(t)}catch(_){return t}};
s=s.replace(/-?\d+\s*\/\s*\d+/g,m=>aDecimal(m.replace(/\s+/g,"")));
for(let k=0;k<40;k++){let prev=s;
s=s.replace(/\(([^()]*)\)/g,(m,inner)=>{let t=inner.replace(/\s+/g,"");
if(!t||/[^0-9\.\+\-\*\/]/.test(t))return m;
try{let simp=ExpresionAlgebraica.simplificar("("+t+")");let dec=aDecimal(simp);
return "("+dec+")"}catch(_){return m}});
if(s===prev)break}
return s};
input.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!=="Tab")return;e.preventDefault();try{resetearFormulario();caja125.style.color="";
caja125.innerHTML="";
let expre=preparar10(input.value),wrap=crearCajaOperacion(),contenedorResultado=document.createElement("div");
wrap.appendChild(contenedorResultado);document.getElementById("caja21").appendChild(wrap);
Representar.expresionMatricialPasoaPaso3(expre,matrices,contenedorResultado);mantenerScrollAbajo(document.getElementById("caja21"));
}catch(err){let msg=err.message||String(err);pintarErrorEnCaja21(msg)}});break}

}});
botonReset.addEventListener("click",()=>resetearFormulario())}

document.addEventListener('DOMContentLoaded',()=>{const $=id=>document.getElementById(id),
all=(s,c=document)=>Array.from(c.querySelectorAll(s));
const insertarOtrasMatrices=()=>{let ayuda=$("abreVentana1");if(!ayuda)return;let cont=ayuda.parentElement;if(!cont)return;
let volver=[...cont.children].find(el=>el!==ayuda&&(/volver/i.test(el.textContent||"")||/volver/i.test(el.id||"")));
let b=ayuda.cloneNode(true);b.id="otrasMatrices";b.textContent="Otras matrices";b.classList?.remove("abreVentana");
if(b.tagName==="A"){b.href="#";b.removeAttribute("download")}else if(b.tagName==="BUTTON")b.type="button";
b.addEventListener("click",e=>{e.preventDefault();location.reload()});
if(volver)cont.insertBefore(b,volver);else ayuda.insertAdjacentElement("afterend",b)};insertarOtrasMatrices();
const archivos={abreVentana1:{pdf:'INSTRUCCIONES/Ayuda.pdf',
docx:'INSTRUCCIONES/Archivos_Word/Ayuda.docx'}};const vistaDe=f=>f?.pdf?{ver:f.pdf,desc:f.docx||f.pdf}:null;

const abrir=aid=>{const n=aid.replace('abreVentana',''),v=$('ventana'+n),f=$('pdf'+n),
c=v?.querySelector('.contenidoVentana');if(!v||!f||!c)return;const m=vistaDe(archivos[aid]);
if(!m){f.removeAttribute('src');f.setAttribute('srcdoc','<div style="font:14px system-ui;padding:16px"><h3>Contenido no disponible</h3><p>Añade un PDF en <code>archivos.'+aid+'.pdf</code>.</p></div>');
v.style.display='block';return}f.removeAttribute('srcdoc');f.src=m.ver;v.style.display='block';let btn=c.querySelector('.btnDescarga');
if(!btn){btn=document.createElement('a');btn.className='btnDescarga';btn.textContent='Descargar DOCX';
btn.style.cssText='position:absolute;top:12px;right:48px;font:12px system-ui;text-decoration:none;border:1px solid #888;padding:6px 10px;border-radius:6px;background:#f7f7f7';
c.style.position='relative';c.appendChild(btn)}btn.style.display=archivos[aid]?.docx?'inline-block':'none';
if(archivos[aid]?.docx){btn.href=archivos[aid].docx;btn.setAttribute('download','')}else{btn.removeAttribute('href');btn.removeAttribute('download')}};

const cerrar=v=>v.style.display='none';all('.abreVentana').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();abrir(a.id)}));
all('.cierraVentana').forEach(x=>x.addEventListener('click',()=>{const v=x.closest('.ventana');if(v)cerrar(v)}));
all('.ventana').forEach(v=>v.addEventListener('click',e=>{if(e.target===v)cerrar(v)}));
document.addEventListener('keydown',e=>{if(e.key==='Escape')all('.ventana').forEach(v=>v.style.display='none')});
});
