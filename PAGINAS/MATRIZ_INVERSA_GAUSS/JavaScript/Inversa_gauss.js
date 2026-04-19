/* =====================================================================
   MATRIZ INVERSA — Método de Gauss-Jordan
   Usa: FraccionNumerica, ExpresionAlgebraica (Biblioteca Matematikal 2.0)
         KaTeX para renderizado
   ===================================================================== */

var S = {
  n: 0,          // tamaño de la matriz (2, 3 o 4)
  val: [],       // matriz original n×n (strings fracción)
  aug: [],       // matriz ampliada actual n×2n
  origAug: [],   // matriz ampliada inicial (para reset)
  hayUsuario: false
};

/* ---------- utilidades básicas ---------- */
function $(id){ return document.getElementById(id); }
function html(el, s){ if(el) el.innerHTML = s; }
function rm(el){ if(el) try{ el.remove(); }catch(_){} }
function cloneM(m){ return m.map(function(r){ return r.slice(); }); }

function _strip(s){ return (s||"").toString().trim().replace(/\s+/g,"").replace(/,/g,"."); }

function toFrac(s){
  s = _strip(s);
  if(!s.length) return "0";
  // integer
  if(/^[-+]?\d+$/.test(s)) return s;
  // fraction p/q
  if(/^[-+]?\d+\/[+]?\d+$/.test(s)){
    return FraccionNumerica.simplificar(s);
  }
  // decimal → fraction via library
  if(/^[-+]?(\d+\.\d*|\.\d+)$/.test(s)){
    return ExpresionAlgebraica.pasarAFraccion(s);
  }
  return s;
}

function _isZero(v){
  v = (v||"").toString().trim();
  if(v === "0" || v === "" || v === "-0") return true;
  try{
    var s = FraccionNumerica.simplificar(v);
    return s === "0";
  }catch(e){ return false; }
}

function _isOne(v){
  v = (v||"").toString().trim();
  if(v === "1") return true;
  try{
    var s = FraccionNumerica.simplificar(v);
    return s === "1";
  }catch(e){ return false; }
}

function _msgOk(s){ var e=$("caja11112"); if(e){ e.style.color="#dbeafe"; e.innerHTML=s||""; } }
function _msgErr(s){ var e=$("caja11112"); if(e){ e.style.color="#fecaca"; e.innerHTML=s||""; } }
function _msgOp(s){ var e=$("caja1251"); if(e){ e.style.color="#b91c1c"; e.innerHTML=s||""; } }

/* ---------- operaciones sobre matriz ampliada n×2n ---------- */

function buildAug(mat, n){
  return mat.map(function(row, i){
    var id = Array.from({length: n}, function(_, j){ return i===j ? "1" : "0"; });
    return row.slice().concat(id);
  });
}

function swapRows(aug, i, j){
  var m = cloneM(aug);
  var t = m[i]; m[i] = m[j]; m[j] = t;
  return m;
}

function divRow(aug, k, div){
  return aug.map(function(row, i){
    if(i !== k) return row;
    return row.map(function(v){
      return FraccionNumerica.dividir(v, div);
    });
  });
}

// Fk → m·Fk + n·Fother  (m, n son strings de fracciones)
function combineRows(aug, k, m, n, other){
  return aug.map(function(row, i){
    if(i !== k) return row;
    return row.map(function(v, j){
      var t1 = FraccionNumerica.multiplicar(m, v);
      var t2 = FraccionNumerica.multiplicar(n, aug[other][j]);
      return FraccionNumerica.sumar(t1, t2);
    });
  });
}

/* ---------- KaTeX: renderizar matriz ampliada ---------- */

function latexFrac(v){
  // convierte string fracción a LaTeX  p/q → \frac{p}{q}, entero → entero
  v = (v||"0").toString().trim();
  if(v.indexOf("/") === -1) return v;
  var parts = v.split("/");
  var num = parts[0], den = parts[1];
  if(den === "1") return num;
  if(num[0] === "-") return "-\\dfrac{"+num.slice(1)+"}{"+den+"}";
  return "\\dfrac{"+num+"}{"+den+"}";
}

function latexAug(aug, n){
  var cols = new Array(n).fill("r").join("") + "|" + new Array(n).fill("r").join("");
  var rows = aug.map(function(row){
    return row.map(latexFrac).join(" & ");
  }).join(" \\\\[8pt] ");
  return "\\left(\\begin{array}{"+cols+"}"+rows+"\\end{array}\\right)";
}

function renderAug(aug, n, container){
  try{
    katex.render(latexAug(aug, n), container, {throwOnError:false, displayMode:false});
  }catch(e){
    container.textContent = "[error]";
  }
}

function renderMatriz(mat, container){
  var n = mat.length;
  var rows = mat.map(function(row){
    return row.map(latexFrac).join(" & ");
  }).join(" \\\\[8pt] ");
  var latex = "\\left(\\begin{array}{"+new Array(n).fill("r").join("")+"}"+rows+"\\end{array}\\right)";
  try{
    katex.render(latex, container, {throwOnError:false, displayMode:false});
  }catch(e){
    container.textContent = "[error]";
  }
}

/* ---------- Área de resultados del usuario ---------- */

function _getTiraUsuario(limpiar){
  var c21 = $("caja21"); if(!c21) return null;
  c21.style.display = "flex";
  if(limpiar){ html(c21,""); S.hayUsuario=false; }
  var t = $("tiraUsuario");
  if(!t){
    t = document.createElement("div"); t.id = "tiraUsuario";
    t.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;gap:10px;row-gap:10px;max-width:100%;box-sizing:border-box;";
    c21.appendChild(t);
  }
  return t;
}

function _addNodoUsuario(n){ var t=_getTiraUsuario(false); if(t&&n) t.appendChild(n); }

function _addAugUsuario(aug){
  var cont = document.createElement("div");
  cont.style.cssText = "display:inline-flex;align-items:center;";
  renderAug(aug, S.n, cont);
  _addNodoUsuario(cont);
}

function _addSimboloUsuario(fn){
  var s = document.createElement("div");
  s.style.cssText = "display:inline-flex;align-items:center;margin:0 2px;";
  if(fn) fn(s);
  _addNodoUsuario(s);
}

function renderInicioUsuario(){
  _getTiraUsuario(true);
  _addAugUsuario(S.aug);
  S.hayUsuario = true;
}

function renderPasoUsuario(simboloFn){
  if(S.hayUsuario){
    _addSimboloUsuario(function(el){
      if(simboloFn) simboloFn(el);
      else el.innerHTML = "→";
    });
  }
  _addAugUsuario(S.aug);
  S.hayUsuario = true;
}

/* ---------- Área automática ---------- */

function _getTiraAuto(limpiar){
  var c221 = $("caja221"); if(!c221) return null;
  if(limpiar) html(c221,"");
  var t = $("tiraAuto");
  if(!t){
    // Contenedor exterior: controla el scroll — hereda height de caja221 vía flex:1
    var scroll = document.createElement("div"); scroll.id = "tiraAutoScroll";
    scroll.style.cssText = "flex:1;min-height:0;width:100%;overflow-y:scroll;overflow-x:hidden;box-sizing:border-box;";
    // Contenedor interior: solo layout flex, sin restricciones de altura
    t = document.createElement("div"); t.id = "tiraAuto";
    t.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;align-content:flex-start;gap:10px;row-gap:10px;padding:8px;box-sizing:border-box;width:100%;";
    scroll.appendChild(t);
    c221.appendChild(scroll);
  }
  return t;
}

function _addNodoAuto(n){ var t=_getTiraAuto(false); if(t&&n) t.appendChild(n); }

function _addAugAuto(aug){
  var cont = document.createElement("div");
  cont.style.cssText = "display:inline-flex;align-items:center;";
  renderAug(aug, S.n, cont);
  _addNodoAuto(cont);
}

function _addSimboloAuto(fn){
  var s = document.createElement("div");
  s.style.cssText = "display:inline-flex;align-items:center;margin:0 2px;";
  if(fn) fn(s);
  _addNodoAuto(s);
}

function _simlabel(txt){
  return function(el){
    katex.render(txt, el, {throwOnError:false, displayMode:false});
  };
}

/* ---------- Resolución automática Gauss-Jordan ---------- */

function gaussJordanAuto(mat){
  var n = mat.length;
  var aug = buildAug(mat, n);
  var pasos = [{tipo:"inicio", mat:cloneM(aug)}];

  for(var i=0; i<n; i++){
    // Buscar pivote no nulo en columna i
    if(_isZero(aug[i][i])){
      var found = false;
      for(var k=i+1; k<n; k++){
        if(!_isZero(aug[k][i])){
          aug = swapRows(aug, i, k);
          pasos.push({tipo:"swap", a:i+1, b:k+1, mat:cloneM(aug)});
          found = true; break;
        }
      }
      if(!found) return null; // matriz singular
    }

    // Normalizar fila i (pivote → 1)
    var piv = aug[i][i];
    if(!_isOne(piv)){
      aug = divRow(aug, i, piv);
      pasos.push({tipo:"div", fila:i+1, div:piv, mat:cloneM(aug)});
    }

    // Eliminar columna i en todas las demás filas
    for(var k=0; k<n; k++){
      if(k===i) continue;
      if(!_isZero(aug[k][i])){
        var factor = aug[k][i];
        var negFactor = FraccionNumerica.multiplicar("-1", factor);
        aug = combineRows(aug, k, "1", negFactor, i);
        pasos.push({tipo:"comb", fila:k+1, pivFila:i+1, factor:factor, mat:cloneM(aug)});
      }
    }
  }

  return {pasos:pasos, inversa:aug.map(function(row){ return row.slice(n); })};
}

function resolverAutomatico(){
  var c221=$("caja221"), c222=$("caja222");
  html(c221,""); html(c222,"");
  _getTiraAuto(true);

  var res = gaussJordanAuto(S.val);

  if(!res){
    var div=document.createElement("div");
    div.className="inv-singular";
    div.innerHTML="La matriz introducida <strong>no tiene inversa</strong>: su determinante es 0 (es singular).";
    c221.appendChild(div);
    return;
  }

  var pasos = res.pasos;

  // Renderizar paso inicial
  _addAugAuto(pasos[0].mat);

  for(var i=1; i<pasos.length; i++){
    var p = pasos[i];
    if(p.tipo === "swap"){
      (function(pp){
        _addSimboloAuto(function(el){
          katex.render("F_{"+pp.a+"}\\leftrightarrow F_{"+pp.b+"}", el, {throwOnError:false});
        });
      })(p);
    }
    else if(p.tipo === "div"){
      (function(pp){
        _addSimboloAuto(function(el){
          katex.render("F_{"+pp.fila+"}\\to\\dfrac{1}{"+latexFrac(pp.div)+"}F_{"+pp.fila+"}", el, {throwOnError:false});
        });
      })(p);
    }
    else if(p.tipo === "comb"){
      (function(pp){
        _addSimboloAuto(function(el){
          var factorLatex = latexFrac(pp.factor);
          var label;
          if(_isOne(pp.factor)){
            label = "F_{"+pp.fila+"}\\to F_{"+pp.fila+"}-F_{"+pp.pivFila+"}";
          } else {
            label = "F_{"+pp.fila+"}\\to F_{"+pp.fila+"}-"+factorLatex+" F_{"+pp.pivFila+"}";
          }
          katex.render(label, el, {throwOnError:false});
        });
      })(p);
    }
    _addAugAuto(p.mat);
  }

  // Resultado final inline en caja221
  var resWrap = document.createElement("div");
  resWrap.style.cssText="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#eff6ff,#f0fdf4);border:1px solid #bfdbfe;border-radius:10px;padding:8px 12px;";
  var lbl = document.createElement("span");
  lbl.style.cssText="font-weight:800;font-size:12px;color:var(--accent);white-space:nowrap;";
  lbl.textContent="⇒ A⁻¹ =";
  var matDiv = document.createElement("div");
  renderMatriz(res.inversa, matDiv);
  resWrap.appendChild(lbl);
  resWrap.appendChild(matDiv);
  _addNodoAuto(resWrap);
}

/* ---------- Comprobación de fin en modo usuario ---------- */

function esIdentidadIzquierda(){
  var n = S.n;
  for(var i=0; i<n; i++){
    for(var j=0; j<n; j++){
      var v;
      try{ v = FraccionNumerica.simplificar(S.aug[i][j]); }catch(e){ return false; }
      if(i===j && v!=="1") return false;
      if(i!==j && v!=="0") return false;
    }
  }
  return true;
}

function mostrarResultadoUsuario(){
  var c12 = $("caja12"); if(!c12) return;
  html(c12,"");
  var h = document.createElement("h3");
  h.style.cssText="font-size:14px;font-weight:800;margin:0 0 10px;padding:6px 10px;background:var(--soft);border:1px solid var(--border);border-radius:var(--radius-sm);";
  h.innerHTML = "¡INVERSA OBTENIDA!";
  c12.appendChild(h);

  var resBox = document.createElement("div"); resBox.className="inv-result-box"; resBox.style.width="100%";
  var lbl = document.createElement("div"); lbl.className="inv-label";
  lbl.textContent = "Matriz inversa A⁻¹";
  resBox.appendChild(lbl);
  var matDiv = document.createElement("div"); matDiv.className="inv-mat";
  var inversa = S.aug.map(function(row){ return row.slice(S.n); });
  renderMatriz(inversa, matDiv);
  resBox.appendChild(matDiv);
  c12.appendChild(resBox);

  var note = document.createElement("p");
  note.style.cssText="font-size:11px;color:var(--muted);margin-top:10px;line-height:1.5;";
  note.innerHTML = "La parte derecha de la matriz ampliada es ahora <strong>A<sup>−1</sup></strong>. Puedes comparar con la solución automática.";
  c12.appendChild(note);
}

/* ---------- Formulario de opciones ---------- */

function crearFormulario(){
  S.aug = buildAug(S.val, S.n);
  S.origAug = cloneM(S.aug);
  renderInicioUsuario();

  var c121=$("caja121"), c122=$("caja122"), c123=$("caja123");
  var c1241=$("caja1241"), c1251=$("caja1251"), c1252=$("caja1252");

  html(c121,"");
  var tit=document.createElement("h3"); tit.innerHTML="OPERACIONES DE FILA"; c121.appendChild(tit);

  html(c122,"");
  function addOpt(pid, val, txt, sym){
    var wrap=document.createElement("div");
    wrap.style.cssText="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid #e5e7eb;";
    var o=document.createElement("input"); o.type="radio"; o.name="invOp"; o.id=pid; o.value=val;
    var la=document.createElement("label"); la.htmlFor=pid; la.style.cssText="flex:1;font-size:12px;"; la.textContent=txt;
    var lb=document.createElement("span"); lb.style.cssText="font-size:12px;color:var(--muted);";
    katex.render(sym, lb, {throwOnError:false, displayMode:false});
    wrap.appendChild(o); wrap.appendChild(la); wrap.appendChild(lb);
    c122.appendChild(wrap);
  }
  addOpt("invOp1","op1","Opción 1: Permutar dos filas","F_i \\leftrightarrow F_j");
  addOpt("invOp2","op2","Opción 2: Dividir una fila por un número","F_i \\to \\frac{1}{k}F_i");
  addOpt("invOp3","op3","Opción 3: Sustituir una fila por combinación lineal de otras filas","F_i = aF_i + bF_j + cF_k");
  addOpt("invOp4","op4","Opción 4: Reordenar filas por ceros a la izquierda","F_{\\downarrow}");

  var btnBar=document.createElement("div"); btnBar.style.cssText="display:flex;justify-content:space-between;align-items:center;gap:8px;padding-top:8px;border-top:1px solid #e5e7eb;margin-top:4px;";
  var bSel=document.createElement("button"); bSel.textContent="Seleccionar"; bSel.addEventListener("click",onSelect);
  var bReset=document.createElement("button"); bReset.textContent="RESET";
  bReset.addEventListener("click", function(){
    _afterExec();
  });
  btnBar.appendChild(bSel); btnBar.appendChild(bReset);
  c122.appendChild(btnBar);

  html(c123,""); html(c1241||{},"")||null;
  _msgOp("");
  html(c1252,"");

  // Botón automático
  var c222=$("caja222"); html(c222,"");
  var bAuto=document.createElement("button"); bAuto.id="botonautomatico";
  bAuto.textContent="SOLUCIÓN AUTOMÁTICA";
  bAuto.addEventListener("click", resolverAutomatico);
  c222.appendChild(bAuto);
}

/* Limpia los inputs de la operación y desmarca el radio tras aplicar con éxito */
function _afterExec(){
  html($("caja123"),"");
  _msgOp("");
  document.querySelectorAll('input[name="invOp"]').forEach(function(o){ o.checked=false; });
}

function onSelect(){
  var r=document.querySelector('input[name="invOp"]:checked');
  if(!r){ _msgOp("Elige una opción antes de pulsar Seleccionar."); return; }
  _msgOp("");
  html($("caja123"),"");
  if(r.value==="op1") op1();
  else if(r.value==="op2") op2();
  else if(r.value==="op3") op3();
  else op4();
}

/* --- Op1: permutar --- */
function op1(){
  var c123=$("caja123"); if(!c123) return;
  var t=document.createElement("div"); t.textContent="Filas a permutar:"; t.style.fontSize="12px"; c123.appendChild(t);
  var wrap=document.createElement("div"); wrap.style.cssText="display:flex;gap:8px;align-items:center;margin-top:4px;";
  var lA=document.createElement("label"); lA.textContent="Fila 1";
  var iA=document.createElement("input"); iA.type="text"; iA.style.width="36px"; iA.inputMode="numeric";
  var lB=document.createElement("label"); lB.textContent="Fila 2";
  var iB=document.createElement("input"); iB.type="text"; iB.style.width="36px"; iB.inputMode="numeric";
  wrap.appendChild(lA); wrap.appendChild(iA); wrap.appendChild(lB); wrap.appendChild(iB);
  c123.appendChild(wrap);
  iA.focus();
  function exec(){
    _msgOp("");
    var a=parseInt(_strip(iA.value),10), b=parseInt(_strip(iB.value),10);
    var n=S.n;
    if(!Number.isInteger(a)||!Number.isInteger(b)||a<1||b<1||a>n||b>n){
      _msgOp("Introduce dos filas válidas entre 1 y "+n+"."); return;
    }
    if(a===b){ _msgOp("Las dos filas deben ser distintas."); return; }
    S.aug = swapRows(S.aug, a-1, b-1);
    var aa=a, bb=b;
    renderPasoUsuario(function(el){
      katex.render("F_{"+aa+"}\\leftrightarrow F_{"+bb+"}", el, {throwOnError:false});
    });
    if(esIdentidadIzquierda()){ mostrarResultadoUsuario(); return; }
    _afterExec();
  }
  iA.addEventListener("keydown", function(ev){ if(ev.key==="Enter"||ev.key==="Tab"){ ev.preventDefault(); iB.focus(); } });
  iB.addEventListener("keydown", function(ev){ if(ev.key==="Enter"||ev.key==="Tab"){ ev.preventDefault(); exec(); } });
}

/* --- Op2: dividir fila --- */
function op2(){
  var c123=$("caja123"); if(!c123) return;
  var t=document.createElement("div"); t.textContent="Divide la fila i por el número k:"; t.style.fontSize="12px"; c123.appendChild(t);
  var wrap=document.createElement("div"); wrap.style.cssText="display:flex;gap:8px;align-items:center;margin-top:4px;";
  var lI=document.createElement("label"); lI.textContent="Fila i";
  var iI=document.createElement("input"); iI.type="text"; iI.style.width="36px"; iI.inputMode="numeric";
  var lK=document.createElement("label"); lK.textContent="÷ k =";
  var iK=document.createElement("input"); iK.type="text"; iK.style.width="60px";
  wrap.appendChild(lI); wrap.appendChild(iI); wrap.appendChild(lK); wrap.appendChild(iK);
  c123.appendChild(wrap);
  iI.focus();
  function exec(){
    _msgOp("");
    var fi=parseInt(_strip(iI.value),10);
    var n=S.n;
    if(!Number.isInteger(fi)||fi<1||fi>n){ _msgOp("Introduce un número de fila válido entre 1 y "+n+"."); return; }
    var ks = toFrac(_strip(iK.value));
    if(!ks || _isZero(ks)){ _msgOp("El divisor no puede ser cero."); return; }
    var fi2=fi;
    S.aug = divRow(S.aug, fi-1, ks);
    renderPasoUsuario(function(el){
      katex.render("F_{"+fi2+"}\\to\\dfrac{1}{"+latexFrac(ks)+"}F_{"+fi2+"}", el, {throwOnError:false});
    });
    if(esIdentidadIzquierda()){ mostrarResultadoUsuario(); return; }
    _afterExec();
  }
  iI.addEventListener("keydown", function(ev){ if(ev.key==="Enter"||ev.key==="Tab"){ ev.preventDefault(); iK.focus(); } });
  iK.addEventListener("keydown", function(ev){ if(ev.key==="Enter"||ev.key==="Tab"){ ev.preventDefault(); exec(); } });
}

/* --- Op3: combinación lineal (input único tipo F2=2F2-3F1) --- */
function op3(){
  var c123=$("caja123"); if(!c123) return;

  var t=document.createElement("div"); t.style.cssText="font-size:12px;margin-bottom:6px;";
  t.textContent="Introduce la operación de fila (ej: F2=2F2-3F1):";
  c123.appendChild(t);

  var wrap=document.createElement("div"); wrap.style.cssText="display:flex;gap:8px;align-items:center;flex-wrap:wrap;";
  var ic=document.createElement("input"); ic.type="text"; ic.style.cssText="width:200px;font-size:12px;";
  ic.placeholder="F2=2F2-3F1";
  wrap.appendChild(ic);
  c123.appendChild(wrap);
  ic.focus();

  /* Divide expresión por + y - respetando paréntesis */
  function splitTop(expr){
    var s=(expr||"").replace(/\s+/g,""), out=[], buf="", dep=0;
    for(var k=0;k<s.length;k++){
      var ch=s[k];
      if(ch==="(") dep++;
      else if(ch===")"){ dep--; if(dep<0) throw 0; }
      if((ch==="+"||ch==="-")&&dep===0){ if(buf.length) out.push(buf); buf=ch; }
      else buf+=ch;
    }
    if(dep!==0) throw 0;
    if(buf.length) out.push(buf);
    return out;
  }

  /* Parsea "F2=2F2-3/2F1" → {lhs:2, terms:[{fila:2,coef:"2"},{fila:1,coef:"-3/2"}]} */
  function parseCL(cad){
    var N=S.n;
    cad=(cad||"").replace(/\s+/g,"").replace(/,/g,".");
    var m=cad.match(/^F(\d+)=(.+)$/i);
    if(!m) throw "Formato inválido. Escribe p.ej.: F2=2F2-3F1";
    var lhs=parseInt(m[1],10);
    if(!Number.isInteger(lhs)||lhs<1||lhs>N) throw "La fila izquierda F"+m[1]+" está fuera del rango 1–"+N+".";
    var parts=splitTop(m[2]);
    if(!parts.length) throw "El lado derecho está vacío.";
    var terms=[];
    for(var k=0;k<parts.length;k++){
      var part=parts[k];
      var mm=part.match(/^([+\-]?)([\d.\/]*)F(\d+)$/i);
      if(!mm) throw "Término no reconocido: '"+part+"'. Usa p.ej. 2F1 o -3/2F2.";
      var sign=mm[1]||"+", coefStr=mm[2]||"1";
      if(coefStr==="") coefStr="1";
      var fila=parseInt(mm[3],10);
      if(!Number.isInteger(fila)||fila<1||fila>N) throw "La fila F"+mm[3]+" no existe en la matriz "+N+"×"+N+".";
      var fullCoef=(sign==="-"?"-":"")+coefStr;
      terms.push({fila:fila, coef:toFrac(fullCoef)});
    }
    var selfOk=false;
    for(var k=0;k<terms.length;k++){
      if(terms[k].fila===lhs && !_isZero(terms[k].coef)){ selfOk=true; break; }
    }
    if(!selfOk) throw "F"+lhs+" debe aparecer con coeficiente no nulo en el lado derecho.";
    return {lhs:lhs, terms:terms};
  }

  /* Construye fragmento LaTeX para un término */
  function termLatex(coef, filaIdx, isFirst){
    var isNeg=coef.toString()[0]==="-";
    var plus=(!isFirst&&!isNeg)?"+":"";
    var simpl; try{ simpl=FraccionNumerica.simplificar(coef); }catch(e){ simpl=coef.toString(); }
    if(simpl==="1")  return plus+"F_{"+filaIdx+"}";
    if(simpl==="-1") return "-F_{"+filaIdx+"}";
    return plus+latexFrac(coef)+"F_{"+filaIdx+"}";
  }

  function exec(){
    _msgOp("");
    var cad=_strip(ic.value);
    if(!cad){ _msgOp("Introduce la operación de fila."); return; }
    var obj;
    try{ obj=parseCL(cad); }
    catch(err){ _msgOp(typeof err==="string"?err:"Formato no válido. Usa p.ej.: F2=2F2-3F1"); return; }

    var target=obj.lhs-1, cols=2*S.n, newRow=[];
    for(var j=0;j<cols;j++){
      var acc="0";
      for(var k=0;k<obj.terms.length;k++){
        var contrib=FraccionNumerica.multiplicar(obj.terms[k].coef, S.aug[obj.terms[k].fila-1][j]);
        acc=FraccionNumerica.sumar(acc, contrib);
      }
      newRow.push(acc);
    }
    S.aug=S.aug.map(function(row,i){ return i===target ? newRow : row; });

    var capturedTerms=obj.terms.slice(), capturedLhs=obj.lhs;
    renderPasoUsuario(function(el){
      var latex="F_{"+capturedLhs+"}\\to ";
      for(var k=0;k<capturedTerms.length;k++){
        latex+=termLatex(capturedTerms[k].coef, capturedTerms[k].fila, k===0);
      }
      katex.render(latex, el, {throwOnError:false});
    });
    if(esIdentidadIzquierda()){ mostrarResultadoUsuario(); return; }
    _afterExec();
  }

  ic.addEventListener("keydown", function(ev){
    if(ev.key==="Enter"||ev.key==="Tab"){ ev.preventDefault(); exec(); }
  });
}

/* --- Op4: reordenar filas por ceros a la izquierda --- */
function op4(){
  var n=S.n;
  function leadingZeros(row){
    var cnt=0;
    for(var j=0;j<n;j++){ if(_isZero(row[j])) cnt++; else break; }
    return cnt;
  }
  var idx=S.aug.map(function(_,i){ return i; });
  idx.sort(function(a,b){ return leadingZeros(S.aug[a])-leadingZeros(S.aug[b]); });
  var changed=idx.some(function(v,i){ return v!==i; });
  if(!changed){
    _msgOk("Las filas ya están ordenadas por número de ceros.");
    _afterExec();
    return;
  }
  S.aug=idx.map(function(i){ return S.aug[i]; });
  renderPasoUsuario(function(el){
    katex.render("F_{\\downarrow}", el, {throwOnError:false});
  });
  if(esIdentidadIzquierda()){ mostrarResultadoUsuario(); return; }
  _afterExec();
}

/* ---------- Entrada de datos ---------- */

function iniciarEntradaDatos(){
  var c11121=$("caja11121"), c11122=$("caja11122"), c112=$("caja112");
  var c21=$("caja21"), c221=$("caja221"), c222=$("caja222");
  // No limpiar caja12: sus hijos (caja121, caja122...) están definidos en el HTML
  // y crearFormulario() los necesita por id. Solo vaciamos las zonas de datos y resultados.
  [c11121,c11122,c112,c21,c221,c222].forEach(function(el){ if(el) html(el,""); });
  // Vaciar los hijos de caja12 individualmente sin destruirlos del DOM
  ["caja121","caja122","caja123","caja1241","caja1251","caja1252"].forEach(function(id){
    var el=$( id); if(el) html(el,"");
  });

  _msgOk("Elige el tamaño de la matriz cuadrada");

  // Selector de tamaño
  var p=document.createElement("p"); p.style.fontSize="12px"; p.style.fontWeight="700"; p.textContent="Tamaño:";
  c11121.appendChild(p);
  [2,3,4].forEach(function(k){
    var o=document.createElement("input"); o.type="radio"; o.name="invSize"; o.id="sz"+k; o.value=k;
    var l=document.createElement("label"); l.htmlFor="sz"+k; l.textContent=k+"×"+k; l.style.marginRight="8px";
    c11121.appendChild(o); c11121.appendChild(l);
    o.addEventListener("change", function(){ crearInputMatriz(k); });
  });
}

function crearInputMatriz(n){
  S.n = n;
  var c11122=$("caja11122"), c112=$("caja112");
  html(c11122,""); html(c112,"");
  _msgOk("Introduce los coeficientes y valida cada uno con ENTER o TAB");

  // Contenedor flex con paréntesis de la librería
  var cont=document.createElement("div");
  cont.style.cssText="display:flex;align-items:center;";
  c112.appendChild(cont);

  Representar.abrirParentesis(n*1.25, cont);

  var tabla=document.createElement("table");
  cont.appendChild(tabla);

  Representar.cerrarParentesis(n*1.25, cont);

  var inputs=[];
  for(var i=0;i<n;i++){
    var tr=document.createElement("tr");
    for(var j=0;j<n;j++){
      var td=document.createElement("td");
      var inp=document.createElement("input"); inp.type="text"; inp.style.width="48px";
      td.appendChild(inp); tr.appendChild(td);
      inputs.push(inp);
    }
    tabla.appendChild(tr);
  }
  inputs[0].focus();

  function confirmar(){
    _msgOk("");
    var mat=[];
    for(var i=0;i<n;i++){
      var fila=[];
      for(var j=0;j<n;j++){
        var v=_strip(inputs[i*n+j].value);
        if(!v){ _msgErr("Rellena todos los campos."); inputs[i*n+j].focus(); return; }
        try{ fila.push(toFrac(v)); }
        catch(e){ _msgErr("Valor no válido en fila "+(i+1)+", col "+(j+1)+"."); inputs[i*n+j].focus(); return; }
      }
      mat.push(fila);
    }

    // Comprobar si es invertible (det ≠ 0)
    try{
      var detStr=Matriz.determinante(mat);
      if(detStr!==null){
        var detSimp=ExpresionAlgebraica.simplificar(detStr);
        if(detSimp==="0"){
          inputs.forEach(function(inp){ inp.value=""; });
          inputs[0].focus();
          _msgErr("⚠ Matriz singular (det = 0): no tiene inversa. Introduce una matriz distinta.");
          return;
        }
      }
    }catch(e){}

    S.val=mat;
    _msgOk("Matriz "+n+"×"+n+" confirmada");

    var c1111=$("caja11111");
    if(c1111) c1111.innerHTML="MATRIZ INTRODUCIDA";

    html(c112,"");
    c112.style.cssText="display:flex;gap:var(--gap);align-items:center;";

    var box1=document.createElement("div");
    box1.style.cssText="background:var(--soft);border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px;";
    var tit1=document.createElement("h3"); tit1.style.cssText="font-size:13px;margin-bottom:6px;";
    tit1.textContent="Matriz A introducida:";
    var matCont=document.createElement("div");
    renderMatriz(S.val,matCont);
    box1.appendChild(tit1); box1.appendChild(matCont);

    c112.appendChild(box1);

    crearFormulario();
  }

  // Navegación: ENTER avanza campo a campo y confirma en el último.
  // TAB: se deja al navegador para campos intermedios (orden DOM correcto),
  // solo se intercepta en el último para confirmar en lugar de salir de la tabla.
  inputs.forEach(function(inp, idx){
    inp.addEventListener("keydown", function(ev){
      if(ev.key==="Enter"||ev.key==="Tab"){
        ev.preventDefault();
        if(idx===inputs.length-1){ confirmar(); }
        else{ inputs[idx+1].focus(); }
      }
    });
  });
}

/* ---------- Arranque ---------- */
document.addEventListener("DOMContentLoaded", function(){
  iniciarEntradaDatos();
});
