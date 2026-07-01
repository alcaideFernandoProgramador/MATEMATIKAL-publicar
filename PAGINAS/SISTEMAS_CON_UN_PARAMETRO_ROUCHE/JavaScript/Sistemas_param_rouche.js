"use strict";

// =====================================================================
// ESTADO GLOBAL
// =====================================================================
let nEcuaciones = 0, nIncognitas = 0, nombreParam = "a";
let matrizAmpS = [];       // string[][] — entradas algebraicas
let pasoActual = 0;
let tarjetaActiva = null;
let valoresCriticos = [];  // string[] — valores del parámetro donde algún det = 0
let casosEspecialesUsuario = []; // string[] — casos especiales indicados por el usuario
// Rangos por caso: {general: number, especiales: [{val:string, r:number}]}
let rangoA_casos = null;
let rangoAb_casos = null;

// Refs DOM
let caja1111, caja11111, caja11112, caja1112, caja112;
let pasoIndicadorDer, refContenido, historialDiv;

// =====================================================================
// UTILIDADES
// =====================================================================
function _clear(n) { while (n && n.firstChild) n.removeChild(n.firstChild); }
function _strip(s) { return (s ?? "").toString().trim().replace(/\s+/g, ""); }

function _simpl(s) {
  try { return ExpresionAlgebraica.simplificar(String(s || "0")); }
  catch (e) { return String(s || "0"); }
}

function _toLaTeX(expr) {
  if (expr == null) return "0";
  let s = String(expr).trim();
  if (!s) return "0";
  try { return ExpresionAlgebraica.pasarALatex(s); }
  catch (e) { return s; }
}

function _contieneParam(expr) {
  if (!nombreParam) return false;
  let s = String(expr || "");
  // Check for the param letter as a whole word/token
  let re = new RegExp("(?:^|[^a-zA-Z_])" + nombreParam + "(?![a-zA-Z_0-9])");
  return re.test(s);
}

function _esCeroExpr(x) {
  if (x === 0 || x === "0") return true;
  let s = String(x ?? "").trim();
  if (!s || s === "0") return true;
  try {
    let t = _simpl(s).trim();
    if (t === "0" || t === "(0)") return true;
    if (!/[a-zA-Z]/.test(t)) {
      let v = parseFloat(t);
      if (Number.isFinite(v) && Math.abs(v) < 1e-10) return true;
    }
  } catch (e) {}
  return false;
}

function _normalizarCasoEspecial(raw) {
  if (raw == null) return "";
  let s = String(raw).trim();
  if (!s) return "";
  let re = new RegExp("^\\s*" + nombreParam + "\\s*=\\s*(.+)$");
  let m = s.match(re);
  if (m) s = m[1].trim();
  return s.replace(/\s+/g, "");
}

function _valorNumericoCasoEspecial(raw) {
  let s = _normalizarCasoEspecial(raw);
  if (!s) return NaN;
  try {
    let dec = ExpresionAlgebraica.pasarADecimal(_simpl(s));
    let v = parseFloat(dec);
    if (Number.isFinite(v)) return v;
  } catch (e) {}
  if (/^[+-]?\d+(?:\.\d+)?\/[+-]?\d+(?:\.\d+)?$/.test(s)) {
    let [num, den] = s.split("/").map(Number);
    return den ? num / den : NaN;
  }
  return parseFloat(s);
}

function _parseCasosEspeciales(raw) {
  if (!raw) return [];
  return String(raw)
    .split(/[,;]+/)
    .map(_normalizarCasoEspecial)
    .filter(Boolean)
    .filter((v, i, self) => self.indexOf(v) === i);
}

function _mismoCasoEspecial(a, b) {
  let sa = _normalizarCasoEspecial(a);
  let sb = _normalizarCasoEspecial(b);
  if (sa === sb) return true;
  let na = _valorNumericoCasoEspecial(sa);
  let nb = _valorNumericoCasoEspecial(sb);
  return Number.isFinite(na) && Number.isFinite(nb) && Math.abs(na - nb) < 1e-9;
}

function _incluyeCasoEspecial(lista, valor) {
  return (lista || []).some(v => _mismoCasoEspecial(v, valor));
}

function _addCasoEspecialGlobal(valor) {
  let v = _normalizarCasoEspecial(valor);
  if (v && !_incluyeCasoEspecial(valoresCriticos, v)) valoresCriticos.push(v);
}

function _casosEsperadosInternos(mat) {
  try {
    let vals = Matriz.rangoPorCasos(mat)[2] || [];
    return vals.map(_normalizarCasoEspecial).filter(Boolean);
  } catch (e) {
    return [];
  }
}

function _rootsExpr(expr) {
  // Returns array of string values where expr = 0
  try {
    let roots = Resolver.ecuacionValores(expr);
    if (!Array.isArray(roots)) return [];
    return roots.map(r => _simpl(String(r)).trim()).filter(r => r && r !== "?");
  } catch (e) { return []; }
}

function _sustitNum(mat, val) {
  // Substitute param in string[][] → number[][]
  try {
    let ms = Matriz.sustituir(mat, nombreParam, val);
    return ms.map(row => row.map(c => {
      try {
        let d = ExpresionAlgebraica.pasarADecimal(String(c));
        let v = parseFloat(d);
        return Number.isFinite(v) ? v : 0;
      } catch (e) { return parseFloat(String(c)) || 0; }
    }));
  } catch (e) {
    return mat.map(row => row.map(c => parseFloat(String(c)) || 0));
  }
}

function _rangoNum(mat) {
  try { return Matriz.rangoMatrizNumerica(mat) || 0; }
  catch (e) { return 0; }
}

function _detStr(submat) {
  try {
    let d = Matriz.determinante(submat);
    return _simpl(d);
  } catch (e) { return "?"; }
}

function _matCoefS() { return matrizAmpS.map(r => r.slice(0, nIncognitas)); }

function _parseInput(raw) {
  let s = _strip(raw);
  if (!s.length) return null;
  // Accept integers, decimals, fractions and algebraic expressions with the param
  return s;
}

// =====================================================================
// KATEX
// =====================================================================
function _rk(latex, el) {
  try { katex.render(latex, el, { throwOnError: false, displayMode: false }); }
  catch (e) { el.textContent = latex; }
}

function _matLxS(mat) {
  let rows = mat.map(r => r.map(_toLaTeX).join("&"));
  return `\\begin{pmatrix}${rows.join("\\\\")}\\end{pmatrix}`;
}

function _matAmpLxS() {
  let n = nIncognitas;
  let rows = matrizAmpS.map(r => {
    let cols = [...r.slice(0, n).map(_toLaTeX), _toLaTeX(r[n])];
    return cols.join("&");
  });
  return `\\left(\\begin{array}{${"c".repeat(n)}|c}${rows.join("\\\\")}\\end{array}\\right)`;
}

function _sistemaLxS() {
  let baseLabels = ["x", "y", "z"];
  let xLabels = Array.from({ length: nIncognitas }, (_, j) => baseLabels[j] || `x_{${j + 1}}`);
  let rows = matrizAmpS.map(fila => {
    let first = true;
    let lhs = fila.slice(0, nIncognitas).map((c, j) => {
      let cs = _simpl(c);
      if (_esCeroExpr(cs)) return null;
      let s = String(cs).replace(/\s+/g, "");
      let neg = s[0] === "-";
      let abs = neg ? s.slice(1) : s;
      let necesitaPar = abs !== "1" && /[+\-]/.test(abs);
      let coef = (abs === "1") ? "" : (necesitaPar ? `\\left(${_toLaTeX(abs)}\\right)` : _toLaTeX(abs));
      let sign = "";
      if (first) sign = neg ? "-" : "";
      else sign = neg ? "-" : "+";
      first = false;
      return sign + coef + xLabels[j];
    }).filter(t => t !== null).join("") || "0";
    let rhs = _toLaTeX(_simpl(fila[nIncognitas]));
    return lhs + "=" + rhs;
  });
  return `\\left\\{\\begin{array}{l}${rows.join("\\\\")}\\end{array}\\right.`;
}

// =====================================================================
// INDICADOR DE PASOS
// =====================================================================
function _construirIndicador() {
  _clear(pasoIndicadorDer);
  pasoIndicadorDer.style.display = "none";
  return;
  ["Rango A", "Rango (A|b)", "Casos especiales", "Caso y sol.", "Final"].forEach((lbl, i) => {
    if (i > 0) {
      let sep = document.createElement("div");
      sep.className = "paso-sep"; sep.textContent = "›";
      pasoIndicadorDer.appendChild(sep);
    }
    let item = document.createElement("div"); item.className = "paso-ind-item";
    let num = document.createElement("div"); num.className = "paso-num"; num.textContent = i + 1;
    let txt = document.createElement("div"); txt.className = "paso-txt"; txt.textContent = lbl;
    item.appendChild(num); item.appendChild(txt);
    pasoIndicadorDer.appendChild(item);
  });
  let btnAG = document.createElement("button");
  btnAG.type = "button"; btnAG.id = "btnAutoGlobal"; btnAG.className = "btn-auto";
  btnAG.textContent = "Resolución automática →"; btnAG.style.display = "none";
  btnAG.addEventListener("click", _autoResolver);
  pasoIndicadorDer.appendChild(btnAG);
}

function _actualizarIndicador() {
  let items = pasoIndicadorDer.querySelectorAll(".paso-ind-item");
  items.forEach((item, i) => {
    item.classList.remove("activo", "completado");
    let s = i + 1;
    if (s === pasoActual) item.classList.add("activo");
    else if (s < pasoActual) item.classList.add("completado");
  });
}

// =====================================================================
// PANEL DERECHO
// =====================================================================
function _mostrarRef(titulo, latexContent, notaHTML, rangosArr) {
  _clear(refContenido);
  if (latexContent) {
    let d = document.createElement("div"); d.className = "ref-mat";
    _rk(latexContent, d); refContenido.appendChild(d);
  }
  if (notaHTML) {
    let n = document.createElement("div"); n.className = "ref-nota"; n.innerHTML = notaHTML;
    refContenido.appendChild(n);
  }
  if (rangosArr && rangosArr.length) {
    let bar = document.createElement("div"); bar.className = "ref-rangos";
    rangosArr.forEach(par => {
      let b = document.createElement("div"); b.className = "ref-rango-badge";
      _rk(par, b); bar.appendChild(b);
    });
    refContenido.appendChild(bar);
  }
}

// =====================================================================
// HISTORIAL
// =====================================================================
function _scrollHistorialAbajo() {
  if (!historialDiv) return;
  requestAnimationFrame(() => {
    let scrollCasos = historialDiv.querySelector(".hist-casos-scroll");
    if (scrollCasos) scrollCasos.scrollTop = scrollCasos.scrollHeight;
    else historialDiv.scrollTop = historialDiv.scrollHeight;
  });
}

function _prepararScrollCasos() {
  if (!historialDiv) return null;
  historialDiv.classList.add("historial-auto");
  let scrollCasos = historialDiv.querySelector(".hist-casos-scroll");
  if (!scrollCasos) {
    scrollCasos = document.createElement("div");
    scrollCasos.className = "hist-casos-scroll";
    historialDiv.appendChild(scrollCasos);
  }
  return scrollCasos;
}

function _insertarAnteActiva(card) {
  if (tarjetaActiva && tarjetaActiva.parentNode === historialDiv)
    historialDiv.insertBefore(card, tarjetaActiva);
  else historialDiv.appendChild(card);
  _scrollHistorialAbajo();
}

// =====================================================================
// TARJETA DE RANGO CONFIRMADO (con casos)
// =====================================================================
function _tarjetaRangoConfirmado(prefijo, casos) {
  let card = document.createElement("div");
  card.className = "hist-entrada hist-rango-conf";
  let et = document.createElement("div"); et.className = "hist-etiqueta";
  et.textContent = "✓ Rango confirmado — " + prefijo;
  card.appendChild(et);

  // General case badge
  let vg = document.createElement("div"); vg.className = "hist-badge-rango";
  let texG = `\\text{rg}(${prefijo}) = ${casos.general}`;
  if (casos.especiales.length > 0) {
    let vals = casos.especiales.map(e => _toLaTeX(e.val)).join(",\\,");
    texG += `\\;\\;(${nombreParam}\\neq ${vals})`;
  }
  _rk(texG, vg); card.appendChild(vg);

  // Special case badges
  casos.especiales.forEach(e => {
    let ve = document.createElement("div"); ve.className = "hist-badge-rango";
    ve.style.background = "#fff7ed"; ve.style.color = "#c2410c";
    _rk(`\\text{rg}(${prefijo}) = ${e.r}\\;\\;(${nombreParam}=${_toLaTeX(e.val)})`, ve);
    card.appendChild(ve);
  });
  return card;
}

// =====================================================================
// TARJETA DE DISCUSIÓN POR CASO
// =====================================================================
function _hacerTarjetaColapsable(card, textoBoton = "Mostrar detalle", ocultarResumen = false) {
  if (!card) return;
  let cuerpo = card.querySelector(".hist-colapsable-cuerpo");
  if (!cuerpo) {
    cuerpo = document.createElement("div");
    cuerpo.className = "hist-colapsable-cuerpo";
    card.appendChild(cuerpo);
  }
  if (card.querySelector(".hist-toggle-detalle")) return;

  if (ocultarResumen) {
    let primeraEtiqueta = card.querySelector(".hist-etiqueta");
    Array.from(card.children).forEach(child => {
      if (
        child === cuerpo ||
        child === primeraEtiqueta ||
        child.classList.contains("hist-toggle-detalle")
      ) return;
      cuerpo.appendChild(child);
    });
  }

  cuerpo.hidden = true;
  card.classList.add("hist-colapsada");

  let btn = document.createElement("button");
  btn.type = "button";
  btn.className = "hist-toggle-detalle";
  btn.textContent = textoBoton;
  btn.addEventListener("click", () => {
    let oculto = cuerpo.hidden;
    cuerpo.hidden = !oculto;
    card.classList.toggle("hist-colapsada", !oculto);
    btn.textContent = oculto ? "Ocultar detalle" : textoBoton;
  });
  card.appendChild(btn);
}

function _colapsarTarjetasRangoConfirmadas() {
  if (!historialDiv) return;
  historialDiv.querySelectorAll(".hist-rango-conf").forEach(card => {
    _hacerTarjetaColapsable(card, "Mostrar detalle", true);
  });
}

function _buscarMenorConstanteNoNulo(mat, numFilas, numCols, orden, val = null) {
  if (!orden) return null;
  let base = val === null ? mat : Matriz.sustituir(mat, nombreParam, val);
  let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
  let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
  for (let fs of filas) for (let cs of cols) {
    let sub = Matriz.menor(base, fs, cs);
    let det = _simpl(_detStr(sub));
    if (_contieneParam(det) || _esCeroExpr(det)) continue;
    return { sub, det, filas: fs, cols: cs };
  }
  return null;
}

function _buscarMenoresSinRaizComun(mat, numFilas, numCols, orden) {
  if (!orden) return null;
  let candidatos = [];
  let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
  let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
  for (let fs of filas) for (let cs of cols) {
    let sub = Matriz.menor(mat, fs, cs);
    let det = _simpl(_detStr(sub));
    if (_esCeroExpr(det) || !_contieneParam(det)) continue;
    let roots = _rootsExpr(det).map(_normalizarCasoEspecial).filter(Boolean);
    if (!roots.length) continue;
    candidatos.push({ sub, det, roots, filas: fs, cols: cs });
  }
  for (let i = 0; i < candidatos.length; i++) {
    for (let j = i + 1; j < candidatos.length; j++) {
      let comun = candidatos[i].roots.some(r => _incluyeCasoEspecial(candidatos[j].roots, r));
      if (!comun) return [candidatos[i], candidatos[j]];
    }
  }
  return null;
}

function _buscarMenorSinRaicesRacionales(mat, numFilas, numCols, orden) {
  if (!orden) return null;
  let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
  let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
  for (let fs of filas) for (let cs of cols) {
    let sub = Matriz.menor(mat, fs, cs);
    let det = _simpl(_detStr(sub));
    if (_esCeroExpr(det) || !_contieneParam(det)) continue;
    let raicesRacionales = _rootsExpr(det)
      .map(_normalizarCasoEspecial)
      .filter(Boolean)
      .filter(v => /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d+)?|\.\d+))?$/.test(v.replace(",", ".")));
    if (raicesRacionales.length === 0) return { sub, det, filas: fs, cols: cs };
  }
  return null;
}

function _buscarMenorNoNuloCasoGeneral(mat, numFilas, numCols, orden) {
  if (!orden) return null;
  let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
  let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
  for (let fs of filas) for (let cs of cols) {
    let sub = Matriz.menor(mat, fs, cs);
    let det = _simpl(_detStr(sub));
    if (_esCeroExpr(det) || !_contieneParam(det)) continue;
    let raices = _rootsExpr(det).map(_normalizarCasoEspecial).filter(Boolean);
    if (raices.length && raices.every(r => _incluyeCasoEspecial(valoresCriticos, r))) {
      return { sub, det, roots: raices, filas: fs, cols: cs };
    }
  }
  return null;
}

function _crearJustificacionRangoAuto(mat, numFilas, numCols, orden, val = null) {
  let ejemplo = _buscarMenorConstanteNoNulo(mat, numFilas, numCols, orden, val);
  let el = document.createElement("div");
  el.className = "hist-menor-ejemplo";
  if (ejemplo) {
    _rk(`\\text{Ejemplo: }${_detMatrixTex(ejemplo.sub)}=${_toLaTeX(ejemplo.det)}\\;\\text{ distinto de }\\;0`, el);
    return el;
  }
  if (val !== null) return null;
  let general = _buscarMenorNoNuloCasoGeneral(mat, numFilas, numCols, orden);
  if (general) {
    _rk(`${_detMatrixTex(general.sub)}=${_toLaTeX(general.det)}`, el);
    return el;
  }
  let sinRaices = _buscarMenorSinRaicesRacionales(mat, numFilas, numCols, orden);
  if (sinRaices) {
    _rk(`\\text{Ejemplo: }${_detMatrixTex(sinRaices.sub)}=${_toLaTeX(sinRaices.det)}\\;\\text{ no se anula para valores racionales}`, el);
    return el;
  }
  let pareja = _buscarMenoresSinRaizComun(mat, numFilas, numCols, orden);
  if (!pareja) return null;
  let tex = pareja.map(m => `${_detMatrixTex(m.sub)}=${_toLaTeX(m.det)}`).join("\\quad\\text{y}\\quad ");
  _rk(`\\text{Ejemplo: }${tex}\\quad\\text{no se anulan a la vez}`, el);
  return el;
}

function _crearTarjetaRangoAuto(titulo, prefijo, casos, mat, numFilas, numCols) {
  let card = document.createElement("div");
  card.className = "hist-entrada hist-rango-conf hist-auto-resumen";
  let et = document.createElement("div"); et.className = "hist-etiqueta"; et.textContent = titulo;
  card.appendChild(et);

  let vg = document.createElement("div"); vg.className = "hist-badge-rango";
  let texG = `\\text{rg}(${prefijo}) = ${casos.general}`;
  if (casos.especiales.length > 0) {
    texG += `\\;\\;(${nombreParam}\\neq ${casos.especiales.map(e => _toLaTeX(e.val)).join(",\\,")})`;
  }
  _rk(texG, vg);
  let justG = _crearJustificacionRangoAuto(mat, numFilas, numCols, casos.general, null);
  _appendFilaRango(card, vg, justG);

  casos.especiales.forEach(e => {
    let ve = document.createElement("div"); ve.className = "hist-badge-rango";
    ve.style.cssText = "background:#fff7ed;color:#c2410c;";
    _rk(`\\text{rg}(${prefijo}) = ${e.r}\\;\\;(${nombreParam}=${_toLaTeX(e.val)})`, ve);
    let justE = _crearJustificacionRangoAuto(mat, numFilas, numCols, e.r, e.val);
    if (justE) justE.classList.add("especial");
    _appendFilaRango(card, ve, justE);
  });
  return card;
}

function _appendFilaRango(card, badge, justificacion) {
  let row = document.createElement("div");
  row.className = "hist-rango-linea";
  if (justificacion) row.appendChild(justificacion);
  row.appendChild(badge);
  card.appendChild(row);
}

function _crearTarjetaCasoAuto(val, rA, rAb) {
  let correcto = _tipoCaso(rA, rAb);
  let card = document.createElement("div"); card.className = "hist-entrada hist-discusion hist-caso-card";
  let caseTop = document.createElement("div"); caseTop.className = "hist-caso-top";
  let h = document.createElement("div"); h.className = "hist-etiqueta hist-caso-titulo";
  h.textContent = _casoTextoPlano(val);
  caseTop.appendChild(h);
  let ranks = document.createElement("div"); ranks.className = "hist-disc-vals";
  _rk(`\\text{rg}(A)=${rA}\\quad\\text{rg}(A|b)=${rAb}\\quad n=${nIncognitas}`, ranks);
  caseTop.appendChild(ranks);

  let tipo = document.createElement("div"); tipo.className = "caso-opciones";
  [
    { value: "SCD", label: "SCD" },
    { value: "CSI", label: "SDI" },
    { value: "SI", label: "SI" }
  ].forEach(opt => {
    let lab = document.createElement("span"); lab.className = "caso-opcion auto";
    if (opt.value === correcto) lab.classList.add("seleccionado");
    lab.textContent = opt.label;
    tipo.appendChild(lab);
  });
  caseTop.appendChild(tipo);

  let fb = document.createElement("div");
  fb.className = "disc-feedback hist-disc-conclu " + (correcto === "SCD" ? "hist-tipo-cd" : correcto === "CSI" ? "hist-tipo-ci" : "hist-tipo-incompatible");
  fb.textContent = "CIERTO";
  caseTop.appendChild(fb);
  card.appendChild(caseTop);

  if (correcto !== "SI") _renderSolucionCaso(card, val, rA);
  else {
    let no = document.createElement("div"); no.className = "hist-valor"; no.textContent = "No hay soluciones.";
    card.appendChild(no);
    _appendIncompatiblePanel(val);
  }
  return card;
}

function _actualizarRangosCabecera(prefijo, casos) {
  if (!caja112 || !casos) return;
  let bloques = Array.from(caja112.querySelectorAll(".mat-bloque"));
  let bloque = bloques.find(b => {
    let t = b.querySelector(".mat-bloque-titulo");
    return t && t.textContent.trim() === prefijo;
  });
  if (!bloque) return;

  let anterior = bloque.querySelector(".conf-rangos");
  if (anterior) anterior.remove();

  let wrap = document.createElement("div");
  wrap.className = "conf-rangos";

  let general = document.createElement("div");
  general.className = "conf-rango-badge";
  let texG = `\\text{rg}(${prefijo})=${casos.general}`;
  if (casos.especiales.length > 0) {
    let vals = casos.especiales.map(e => _toLaTeX(e.val)).join(",\\,");
    texG += `\\;(${nombreParam}\\neq ${vals})`;
  }
  _rk(texG, general);
  wrap.appendChild(general);

  casos.especiales.forEach(e => {
    let esp = document.createElement("div");
    esp.className = "conf-rango-badge especial";
    _rk(`\\text{rg}(${prefijo})=${e.r}\\;(${nombreParam}=${_toLaTeX(e.val)})`, esp);
    wrap.appendChild(esp);
  });

  bloque.appendChild(wrap);
}

function _tarjetaDiscusion(prefijo, rA, rAb, n, val) {
  let tipo = rA !== rAb ? "incompatible" : rA === n ? "cd" : "ci";

  let card = document.createElement("div"); card.className = "hist-entrada hist-discusion";
  let et = document.createElement("div"); et.className = "hist-etiqueta";
  et.textContent = `Discusión — ${_casoTextoPlano(val)}`;
  card.appendChild(et);

  let vals = document.createElement("div"); vals.className = "hist-disc-vals";
  _rk(`\\text{rg}(A)=${rA}\\quad\\text{rg}(A|b)=${rAb}\\quad n=${n}`, vals);
  card.appendChild(vals);

  let conclu = document.createElement("div");
  let tex, clase;
  if (tipo === "incompatible") {
    clase = "hist-tipo-incompatible";
    tex = `\\text{rg}(A)\\neq\\text{rg}(A|b)\\Rightarrow\\textbf{Incompatible}`;
  } else if (tipo === "cd") {
    clase = "hist-tipo-cd";
    tex = `\\text{rg}(A)=\\text{rg}(A|b)=n\\Rightarrow\\textbf{Compatible Det.}`;
  } else {
    clase = "hist-tipo-ci";
    let lib = n - rA;
    tex = `\\text{rg}(A)=\\text{rg}(A|b)<n\\Rightarrow\\textbf{Comp. Indet.}\\;(${lib}\\text{ par. libre})`;
  }
  conclu.className = "hist-disc-conclu " + clase;
  _rk(tex, conclu);
  card.appendChild(conclu);
  return { card, tipo };
}

function _tipoCaso(rA, rAb) {
  if (rA !== rAb) return "SI";
  return rA === nIncognitas ? "SCD" : "CSI";
}

function _textoTipo(tipo) {
  if (tipo === "SCD") return "Sistema compatible determinado";
  if (tipo === "CSI") return "Sistema compatible indeterminado";
  return "Sistema incompatible";
}

function _rangosParaCaso(val) {
  let especiales = casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos;
  let esEspecial = val !== null && _incluyeCasoEspecial(especiales, val);
  let rA = val === null || !esEspecial
    ? rangoA_casos.general
    : (rangoA_casos.especiales.find(e => e.val === val)?.r ?? rangoA_casos.general);
  let rAb = val === null || !esEspecial
    ? rangoAb_casos.general
    : (rangoAb_casos.especiales.find(e => e.val === val)?.r ?? rangoAb_casos.general);
  return { rA, rAb };
}

function _normalizarCasoPaso4(raw) {
  let s = _strip(raw);
  if (!s) return { ok: false, msg: "Introduce G o un valor del parametro." };
  if (/^g$/i.test(s)) return { ok: true, val: null };
  let v = _normalizarCasoEspecial(s);
  let permitidos = casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos;
  if (_incluyeCasoEspecial(permitidos, v)) return { ok: true, val: v, extraGeneral: false };
  let nv = _valorNumericoCasoEspecial(v);
  if (Number.isFinite(nv)) return { ok: true, val: v, extraGeneral: true };
  return { ok: false, msg: `Usa G, un valor numerico, o uno de los especiales: ${permitidos.map(x => nombreParam + "=" + x).join(", ")}.` };
}

function _casoTexto(val) {
  let especiales = casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos;
  if (val === null) {
    let lista = especiales.map(v => _toLaTeX(v)).join(",");
    return lista
      ? `\\text{Caso general }(${nombreParam}\\neq ${lista})`
      : `\\text{Caso general}`;
  }
  return _incluyeCasoEspecial(especiales, val)
    ? `\\text{Caso }${nombreParam}=${_toLaTeX(val)}`
    : `\\text{Caso }${nombreParam}=${_toLaTeX(val)}\\;\\text{(dentro del caso general)}`;
}

function _casoTextoPlano(val) {
  if (val !== null) return `${nombreParam} = ${val}`;
  let especiales = casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos;
  return especiales.length ? `Caso general (${nombreParam} != ${especiales.join(", ")})` : "Caso general";
}

function _appendSolucionPanel(val, node) {
  if (!refContenido || !node) return;
  let box = document.createElement("div"); box.className = "ref-nota";
  let title = document.createElement("div"); title.className = "confirmados-caso-titulo";
  _rk(`\\text{Solucion: }${_casoTexto(val)}`, title);
  box.appendChild(title);
  box.appendChild(node.cloneNode(true));
  refContenido.appendChild(box);
}

function _appendIncompatiblePanel(val) {
  if (!refContenido) return;
  let box = document.createElement("div"); box.className = "ref-nota";
  let title = document.createElement("div"); title.className = "confirmados-caso-titulo";
  _rk(`\\text{Conclusion: }${_casoTexto(val)}`, title);
  let msg = document.createElement("div");
  msg.className = "hist-badge-rango hist-sol-linea";
  msg.style.cssText = "background:#fef2f2;color:#dc2626;border:1px solid #fecaca;";
  _rk(`\\text{Sistema incompatible: no hay soluciones}`, msg);
  box.appendChild(title);
  box.appendChild(msg);
  refContenido.appendChild(box);
}

function _numToTexCalc(x) {
  if (!Number.isFinite(x)) return "?";
  let r = Math.round(x * 1e9) / 1e9;
  if (Number.isInteger(r)) return r.toString();
  return r.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

function _cocienteSimplificadoTex(num, den) {
  let denS = String(den);
  if (_esCeroExpr(denS)) return `\\frac{${_toLaTeX(num)}}{${_toLaTeX(denS)}}`;
  try {
    return _toLaTeX(_simpl(`(${num})/(${denS})`));
  } catch (e) {
    return `\\frac{${_toLaTeX(num)}}{${_toLaTeX(denS)}}`;
  }
}

function _detMatrixTex(mat) {
  return `\\begin{vmatrix}${mat.map(r => r.map(_toLaTeX).join("&")).join("\\\\")}\\end{vmatrix}`;
}

function _primerMenorNoNulo(mat, r) {
  let rows = _combs(Array.from({ length: mat.length }, (_, i) => i), r);
  let cols = _combs(Array.from({ length: mat[0].length }, (_, i) => i), r);
  for (let rs of rows) for (let cs of cols) {
    let sub = rs.map(i => cs.map(j => mat[i][j]));
    let d = Matriz.determinanteNumerico(sub);
    if (Math.abs(d) > 1e-9) return { rows: rs, cols: cs, det: d };
  }
  return null;
}

function _renderSolucionCaso(card, val, rA) {
  let matS = val === null ? matrizAmpS : Matriz.sustituir(matrizAmpS, nombreParam, val);
  if (val === null) {
    _cramerSimbolicoCD(card, matS, rA, refContenido, val);
    return;
  }

  let matNum = _sustitNum(matrizAmpS, _valorNumericoCasoEspecial(val));
  let matCoef = matNum.map(r => r.slice(0, nIncognitas));
  if (rA === nIncognitas) {
    _cramerNumerico(card, matCoef, matNum, rA, refContenido, val);
    return;
  }

  let piv = _primerMenorNoNulo(matCoef, rA);
  if (!piv) {
    let note = document.createElement("div"); note.className = "hist-valor";
    note.textContent = "No se ha encontrado un subsistema regular para aplicar Cramer.";
    card.appendChild(note);
    return;
  }

  let freeCols = Array.from({ length: nIncognitas }, (_, i) => i).filter(i => !piv.cols.includes(i));
  let paramNames = ["t", "s", "u", "v"];
  let params = freeCols.map((_, i) => paramNames[i] || `t_{${i + 1}}`);
  let info = document.createElement("div"); info.className = "hist-free-note";
  let libresTex = freeCols.map((c, i) => `x_{${c + 1}}=${params[i]}`).join(",\\;");
  _rk(`\\text{Dejamos ${freeCols.length === 1 ? "libre" : "libres"} }${libresTex}`, info);
  let top = card.querySelector(".hist-caso-top");
  let fb = top ? top.querySelector(".disc-feedback") : null;
  if (fb && fb.parentNode) fb.parentNode.insertBefore(info, fb.nextSibling);
  else if (top) top.appendChild(info);
  else card.appendChild(info);

  let detTex = _numToTexCalc(piv.det);
  let sol = Array(nIncognitas).fill(null);
  freeCols.forEach((c, i) => { sol[c] = params[i]; });

  let rhsExprRows = piv.rows.map(rowIdx => {
    let base = matNum[rowIdx][nIncognitas];
    let terms = freeCols.map((fc, pi) => {
      let coef = -matNum[rowIdx][fc];
      if (Math.abs(coef) < 1e-9) return "";
      let sign = coef >= 0 ? "+" : "-";
      let abs = Math.abs(coef);
      return `${sign}${abs === 1 ? "" : _numToTexCalc(abs)}${params[pi]}`;
    }).join("");
    return `${_numToTexCalc(base)}${terms}`;
  });

  function lhsRow(rowIdx) {
    let first = true;
    return piv.cols.map(c => {
      let coef = matNum[rowIdx][c];
      if (Math.abs(coef) < 1e-9) return "";
      let sign = "";
      if (first) sign = coef < 0 ? "-" : "";
      else sign = coef < 0 ? "-" : "+";
      first = false;
      let abs = Math.abs(coef);
      return `${sign}${abs === 1 ? "" : _numToTexCalc(abs)}x_{${c + 1}}`;
    }).filter(Boolean).join("") || "0";
  }

  let solRow = document.createElement("div"); solRow.className = "hist-sol-row";
  card.appendChild(solRow);

  let sistema = document.createElement("div"); sistema.className = "hist-valor";
  _rk(`\\left\\{\\begin{array}{l}${piv.rows.map((rowIdx, i) => `${lhsRow(rowIdx)}=${_toLaTeX(rhsExprRows[i])}`).join("\\\\")}\\end{array}\\right.`, sistema);
  solRow.appendChild(sistema);

  piv.cols.forEach(col => {
    let Ai = piv.rows.map((rowIdx, rr) => piv.cols.map(c => c === col ? rhsExprRows[rr] : String(matNum[rowIdx][c])));
    let detMatrix = _detMatrixTex(Ai);
    let detAi = _detStr(Ai);
    let xi = _cocienteSimplificadoTex(detAi, detTex);
    let tex = `x_{${col + 1}}=\\frac{\\det(A_{${col + 1}})}{\\det(A_0)}=\\frac{${detMatrix}}{${detTex}}=${xi}`;
    let el = document.createElement("div"); el.className = "hist-valor";
    _rk(tex, el); solRow.appendChild(el);
    sol[col] = xi;
  });

  let out = document.createElement("div"); out.className = "hist-badge-rango hist-sol-linea";
  _rk(`\\left[${sol.map((s, i) => `x_{${i + 1}}=${s}`).join(",\\quad ")}\\right]`, out);
  _appendSolucionPanel(val, out);
}

// =====================================================================
// ENCONTRAR VALOR GENÉRICO (no crítico)
// =====================================================================
function _encontrarValorGenerico() {
  let candidates = [7, 13, 97, 23, 41, -3, 100, 11, 5, 3, 2, -5, 17, 19];
  for (let c of candidates) {
    let isCrit = valoresCriticos.some(v => {
      let nv = _valorNumericoCasoEspecial(v);
      return Number.isFinite(nv) && Math.abs(nv - c) < 1e-9;
    });
    if (!isCrit) return c;
  }
  return 97;
}

// =====================================================================
// TARJETA ACTIVA (cálculo de menores con soporte algebraico)
// =====================================================================
function _crearTarjetaActiva(mat, numFilas, numCols, prefijo, onRangoOk) {
  if (tarjetaActiva && tarjetaActiva.parentNode)
    tarjetaActiva.parentNode.removeChild(tarjetaActiva);

  let card = document.createElement("div");
  card.className = "hist-entrada hist-activa";
  tarjetaActiva = card;

  let et = document.createElement("div"); et.className = "hist-etiqueta";
  et.textContent = `Paso ${pasoActual} — ${prefijo}`;
  card.appendChild(et);

  let cuerpo = document.createElement("div"); cuerpo.className = "hist-colapsable-cuerpo";
  card.appendChild(cuerpo);

  let resArea = document.createElement("div"); resArea.className = "form-res-area";
  cuerpo.appendChild(resArea);

  let tog = document.createElement("div"); tog.className = "form-toggle";
  let btnM = document.createElement("button"); btnM.className = "form-toggle-btn activo"; btnM.textContent = "Calcular menor"; btnM.type = "button";
  let btnR = document.createElement("button"); btnR.className = "form-toggle-btn"; btnR.textContent = "Indicar rango"; btnR.type = "button";
  tog.appendChild(btnM); tog.appendChild(btnR);
  cuerpo.appendChild(tog);

  let zona = document.createElement("div"); zona.className = "form-seccion";
  cuerpo.appendChild(zona);
  historialDiv.appendChild(card);
  let criticosLocal = new Set();
  let menoresCalculados = [];

  /* ── Añadir resultado de menor ── */
  function _addResultado(filIdx, colIdx, det, roots) {
    let orden = filIdx.length;
    let f = filIdx.map(x => x + 1).join(",");
    let c = colIdx.map(x => x + 1).join(",");

    // Register critical values
    let rangoGenericoLocal = _rangoNum(_sustitNum(mat, _encontrarValorGenerico()));
    let rootsEfectivas = [];
    roots.forEach(rv => {
      let nv = _valorNumericoCasoEspecial(rv);
      if (!Number.isFinite(nv)) return;
      let cambiaRango = _rangoNum(_sustitNum(mat, nv)) !== rangoGenericoLocal;
      if (!cambiaRango) return;
      let norm = _normalizarCasoEspecial(rv);
      rootsEfectivas.push(norm);
      criticosLocal.add(norm);
      _addCasoEspecialGlobal(norm);
    });
    menoresCalculados.push({ filIdx: filIdx.slice(), colIdx: colIdx.slice(), orden, det, roots: rootsEfectivas });

    let siempreNulo = _esCeroExpr(det);
    let tieneParam = _contieneParam(det);
    let siempreNoNulo = !siempreNulo && !tieneParam;

    let blq = document.createElement("div");
    blq.className = "form-menor-blq " + (
      siempreNulo ? "form-menor-nulo" :
      tieneParam && roots.length > 0 ? "form-menor-simb" :
      "form-menor-nonulo"
    );

    let hdr = document.createElement("div"); hdr.className = "form-menor-hdr";
    hdr.textContent = `F:{${f}} C:{${c}} · orden ${orden}`;
    blq.appendChild(hdr);

    // Determinant display
    let valDiv = document.createElement("div"); valDiv.className = "form-menor-val";
    let submat = Matriz.menor(mat, filIdx, colIdx);
    let mRows = submat.map(r => r.map(_toLaTeX).join("&"));
    let detTex = siempreNulo ? "0" : _toLaTeX(det);
    _rk(`\\begin{vmatrix}${mRows.join("\\\\")}\\end{vmatrix}=${detTex}`, valDiv);
    blq.appendChild(valDiv);

    // Roots display
    if (!siempreNulo && tieneParam) {
      if (roots.length > 0) {
        let rd = document.createElement("div"); rd.className = "det-raices";
        let rootTex = roots.map(r => `${nombreParam}=${_toLaTeX(r)}`).join(",\\;");
        _rk(`\\text{Se anula si }${rootTex}`, rd);
        blq.appendChild(rd);
      } else {
        let rd = document.createElement("div"); rd.className = "form-menor-inf";
        rd.style.color = "#15803d";
        rd.textContent = "No se anula para ningún valor racional del parámetro.";
        blq.appendChild(rd);
      }
    }

    let inf = document.createElement("div"); inf.className = "form-menor-inf";
    if (siempreNulo) inf.textContent = "Siempre nulo (para todo valor del parámetro).";
    else if (siempreNoNulo) inf.textContent = "Siempre no nulo — no depende del parámetro.";
    else if (roots.length > 0) {
      inf = null;
    } else {
      inf.textContent = "Nunca nulo.";
    }
    if (inf) blq.appendChild(inf);
    resArea.appendChild(blq);
    _scrollHistorialAbajo();
  }

  /* ── MODO: calcular menor ── */
  function _modoMenor() {
    btnM.classList.add("activo"); btnR.classList.remove("activo");
    _clear(zona);

    let selRows = new Set(), selCols = new Set();
    let rowBtns = [], colBtns = [];

    let pickerF = document.createElement("div"); pickerF.className = "form-picker-row";
    let lblF = document.createElement("span"); lblF.className = "form-picker-label"; lblF.textContent = "Filas:";
    pickerF.appendChild(lblF);
    for (let i = 0; i < numFilas; i++) {
      let b = document.createElement("button"); b.type = "button"; b.className = "form-picker-btn"; b.textContent = i + 1;
      b.addEventListener("click", () => {
        if (selRows.has(i)) { selRows.delete(i); b.classList.remove("sel"); }
        else { selRows.add(i); b.classList.add("sel"); }
        _tryCompute();
      });
      pickerF.appendChild(b); rowBtns.push(b);
    }
    zona.appendChild(pickerF);

    let pickerC = document.createElement("div"); pickerC.className = "form-picker-row";
    let lblC = document.createElement("span"); lblC.className = "form-picker-label"; lblC.textContent = "Cols:";
    pickerC.appendChild(lblC);
    for (let j = 0; j < numCols; j++) {
      let b = document.createElement("button"); b.type = "button"; b.className = "form-picker-btn"; b.textContent = j + 1;
      b.addEventListener("click", () => {
        if (selCols.has(j)) { selCols.delete(j); b.classList.remove("sel"); }
        else { selCols.add(j); b.classList.add("sel"); }
        _tryCompute();
      });
      pickerC.appendChild(b); colBtns.push(b);
    }
    zona.appendChild(pickerC);

    let hint = document.createElement("div"); hint.className = "form-picker-hint"; zona.appendChild(hint);

    function _tryCompute() {
      let nF = selRows.size, nC = selCols.size;
      if (nF === 0 && nC === 0) { hint.textContent = ""; return; }
      if (nF === 0) { hint.textContent = `Selecciona ${nC} fila${nC > 1 ? "s" : ""} para el menor.`; return; }
      if (nC === 0) { hint.textContent = `Selecciona ${nF} columna${nF > 1 ? "s" : ""} para el menor.`; return; }
      if (nF !== nC) {
        let diff = Math.abs(nF - nC);
        hint.textContent = nF > nC
          ? `Selecciona ${diff} columna${diff > 1 ? "s más" : " más"}.`
          : `Selecciona ${diff} fila${diff > 1 ? "s más" : " más"}.`;
        return;
      }
      hint.textContent = "";
      let filIdx = Array.from(selRows).sort((a, b) => a - b);
      let colIdx = Array.from(selCols).sort((a, b) => a - b);

      let submat = Matriz.menor(mat, filIdx, colIdx);
      let det = _detStr(submat);
      let roots = [];
      if (!_esCeroExpr(det) && _contieneParam(det)) {
        roots = _rootsExpr(det);
      }
      _addResultado(filIdx, colIdx, det, roots);

      selRows.clear(); selCols.clear();
      rowBtns.forEach(b => b.classList.remove("sel"));
      colBtns.forEach(b => b.classList.remove("sel"));
    }
  }

  /* ── MODO: indicar rango ── */
  function _modoRango() {
    let maxPos = Math.min(numFilas, numCols);
    let esperados = _casosEsperadosInternos(mat);
    if (!esperados.length) esperados = _calcularRangoCasos(mat, numFilas, numCols, maxPos).criticos;
    let detectados = [...valoresCriticos, ...Array.from(criticosLocal)];
    let faltan = esperados.filter(v => !_incluyeCasoEspecial(detectados, v));
    let necesitaMenorAmpliada = prefijo === "(A|b)" && valoresCriticos.length > 0;
    let tieneMenorAmpliada = menoresCalculados.some(m =>
      m.orden === maxPos && m.colIdx.includes(numCols - 1)
    );
    if (faltan.length || (necesitaMenorAmpliada && !tieneMenorAmpliada)) {
      btnM.classList.add("activo"); btnR.classList.remove("activo");
      _clear(zona);
      let aviso = document.createElement("div");
      aviso.className = "form-msg";
      aviso.innerHTML = `<span class="err">Antes de indicar el rango debes calcular los menores adecuados para detectar los casos especiales.</span>`;
      zona.appendChild(aviso);
      let ayuda = document.createElement("div");
      ayuda.className = "form-picker-hint";
      ayuda.textContent = "Calcula menores cuyo determinante dependa del parámetro y se anule en esos valores.";
      zona.appendChild(ayuda);
      return;
    }

    function _menorConstanteCalculadoNoNulo(orden, val) {
      return menoresCalculados.some(m => {
        if (m.orden !== orden) return false;
        let sub = Matriz.menor(mat, m.filIdx, m.colIdx);
        if (val !== null) sub = Matriz.sustituir(sub, nombreParam, val);
        let det = _simpl(_detStr(sub));
        return !_contieneParam(det) && !_esCeroExpr(det);
      });
    }

    function _menoresCalculadosSinRaizComun(orden) {
      let candidatos = menoresCalculados
        .filter(m => m.orden === orden)
        .map(m => {
          let sub = Matriz.menor(mat, m.filIdx, m.colIdx);
          let det = _simpl(_detStr(sub));
          if (_esCeroExpr(det) || !_contieneParam(det)) return null;
          let roots = _rootsExpr(det).map(_normalizarCasoEspecial).filter(Boolean);
          return roots.length ? { det, roots } : null;
        })
        .filter(Boolean);
      for (let i = 0; i < candidatos.length; i++) {
        for (let j = i + 1; j < candidatos.length; j++) {
          let comun = candidatos[i].roots.some(r => _incluyeCasoEspecial(candidatos[j].roots, r));
          if (!comun) return true;
        }
      }
      return false;
    }

    function _esRacionalTexto(raw) {
      let s = _normalizarCasoEspecial(raw).replace(",", ".");
      return /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d+)?|\.\d+))?$/.test(s);
    }

    function _menorCalculadoSinRaicesRacionales(orden) {
      return menoresCalculados.some(m => {
        if (m.orden !== orden) return false;
        let sub = Matriz.menor(mat, m.filIdx, m.colIdx);
        let det = _simpl(_detStr(sub));
        if (_esCeroExpr(det) || !_contieneParam(det)) return false;
        let raicesRacionales = _rootsExpr(det)
          .map(_normalizarCasoEspecial)
          .filter(Boolean)
          .filter(_esRacionalTexto);
        return raicesRacionales.length === 0;
      });
    }

    function _menorCalculadoNoNuloCasoGeneral(orden) {
      return menoresCalculados.some(m => {
        if (m.orden !== orden) return false;
        let sub = Matriz.menor(mat, m.filIdx, m.colIdx);
        let det = _simpl(_detStr(sub));
        if (_esCeroExpr(det) || !_contieneParam(det)) return false;
        let raices = _rootsExpr(det).map(_normalizarCasoEspecial).filter(Boolean);
        return raices.length && raices.every(r => _incluyeCasoEspecial(valoresCriticos, r));
      });
    }

    function _rangoJustificado(orden, val) {
      if (!orden) return true;
      if (val !== null && _menorEjemploNoNulo(orden, val)) return true;
      if (prefijo === "(A|b)" && rangoA_casos) {
        let rA = val === null
          ? rangoA_casos.general
          : (rangoA_casos.especiales.find(e => _mismoCasoEspecial(e.val, val))?.r ?? rangoA_casos.general);
        if (rA === orden && orden === Math.min(nEcuaciones, nIncognitas)) return true;
      }
      if (_menorConstanteCalculadoNoNulo(orden, val)) return true;
      return val === null && (
        _menorCalculadoNoNuloCasoGeneral(orden) ||
        _menorCalculadoSinRaicesRacionales(orden) ||
        _menoresCalculadosSinRaizComun(orden)
      );
    }

    btnR.classList.add("activo"); btnM.classList.remove("activo");
    _clear(zona);

    let criticos = valoresCriticos.slice();

    // Build inputs for general case + each critical value
    let rows = [];

    let rowG = document.createElement("div"); rowG.className = "form-row";
    let lG = document.createElement("label"); _rk(`\\text{rg}(${prefijo})=`, lG);
    let iG = document.createElement("input"); iG.type = "text"; iG.style.width = "40px";
    rowG.appendChild(lG); rowG.appendChild(iG);
    if (criticos.length > 0) {
      let noteG = document.createElement("small");
      noteG.textContent = ` caso general (${nombreParam} ≠ ${criticos.join(", ")})`;
      rowG.appendChild(noteG);
    }
    zona.appendChild(rowG);
    rows.push({ input: iG, val: null, label: "caso general" });

    criticos.forEach(val => {
      let rowS = document.createElement("div"); rowS.className = "form-row";
      rowS.style.marginTop = "5px";
      let lS = document.createElement("label"); _rk(`\\text{rg}(${prefijo})=`, lS);
      let iS = document.createElement("input"); iS.type = "text"; iS.style.width = "40px";
      let noteS = document.createElement("small");
      noteS.textContent = ` cuando ${nombreParam} = ${val}`;
      rowS.appendChild(lS); rowS.appendChild(iS); rowS.appendChild(noteS);
      zona.appendChild(rowS);
      rows.push({ input: iS, val: val, label: `${nombreParam}=${val}` });
    });

    let msgR = document.createElement("div"); msgR.className = "form-msg"; zona.appendChild(msgR);

    function _validar() {
      msgR.innerHTML = "";
      let resultados = [];

      for (let { input, val, label } of rows) {
        let rv = parseInt(_strip(input.value), 10);
        if (isNaN(rv) || rv < 0 || rv > maxPos) {
          msgR.innerHTML = `<span class="err">${label}: entero entre 0 y ${maxPos}.</span>`;
          input.value = ""; input.focus(); return;
        }

        // Validate numerically
        let testVal = (val === null) ? _encontrarValorGenerico() : _valorNumericoCasoEspecial(val);
        if (!Number.isFinite(testVal)) testVal = 0;
        let matNum = _sustitNum(mat, testVal);
        let rangoReal = _rangoNum(matNum);

        if (rangoReal !== rv) {
          let casoTxt = val === null ? "caso general" : `${nombreParam}=${val}`;
          msgR.innerHTML = `<span class="falso">FALSO</span> — En el ${casoTxt}: rg = ${rangoReal}, no ${rv}.`;
          input.value = ""; input.focus(); return;
        }
        if (!_rangoJustificado(rv, val)) {
          let casoTxt = val === null ? "caso general" : `${nombreParam}=${val}`;
          msgR.innerHTML = `<span class="err">Antes de indicar rg = ${rv} en el ${casoTxt}, calcula un menor de orden ${rv} que lo justifique.</span>`;
          input.value = ""; input.focus(); return;
        }
        resultados.push({ val, r: rv });
      }

      // All correct!
      msgR.innerHTML = `<span class="cierto">CIERTO</span>`;
      let casosObj = {
        general: resultados[0].r,
        especiales: resultados.slice(1).map((res, i) => ({ val: criticos[i], r: res.r }))
      };

      setTimeout(() => {
        if (tog.parentNode) tog.parentNode.removeChild(tog);
        if (zona.parentNode) zona.parentNode.removeChild(zona);
        card.className = "hist-entrada hist-rango-conf";
        let et = card.querySelector(".hist-etiqueta");
        if (prefijo === "A" && et) et.textContent = "Paso 1: Rango de A";
        if (prefijo === "(A|b)" && et) et.textContent = "Paso 2: Rango(A|b)";
        // Add summary
        let vg = document.createElement("div"); vg.className = "hist-badge-rango";
        let texG = `\\text{rg}(${prefijo}) = ${casosObj.general}`;
        if (casosObj.especiales.length > 0) {
          texG += `\\;\\;(${nombreParam}\\neq ${casosObj.especiales.map(e => _toLaTeX(e.val)).join(",\\,")})`;
        }
        _rk(texG, vg);
        let ejemploG = _menorEjemploNoNulo(casosObj.general, null);
        let eg = _crearJustificacionRango(ejemploG, casosObj.general, null);
        _appendFilaRango(card, vg, eg);
        casosObj.especiales.forEach(e => {
          let ve = document.createElement("div"); ve.className = "hist-badge-rango";
          ve.style.cssText = "background:#fff7ed;color:#c2410c;";
          _rk(`\\text{rg}(${prefijo}) = ${e.r}\\;\\;(${nombreParam}=${_toLaTeX(e.val)})`, ve);
          let ejemploE = _menorEjemploNoNulo(e.r, e.val);
          let ee = _crearJustificacionRango(ejemploE, e.r, e.val);
          if (ee) ee.classList.add("especial");
          _appendFilaRango(card, ve, ee);
        });
        if (prefijo === "(A|b)") _colapsarTarjetasRangoConfirmadas();
        tarjetaActiva = null;
        onRangoOk(casosObj);
      }, 600);
    }

    rows.forEach(({ input }, idx) => {
      input.addEventListener("keydown", ev => {
        if (ev.key !== "Enter") return;
        ev.preventDefault();
        if (idx < rows.length - 1) rows[idx + 1].input.focus();
        else _validar();
      });
    });
    rows[0].input.focus();
  }

  function _menorEjemploNoNulo(orden, val) {
    if (!orden) return null;
    let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
    let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
    let matBase = val === null ? mat : Matriz.sustituir(mat, nombreParam, val);
    for (let fs of filas) for (let cs of cols) {
      let sub = Matriz.menor(matBase, fs, cs);
      let det = _simpl(_detStr(sub));
      if (_contieneParam(det) || _esCeroExpr(det)) continue;
      return { sub, det, filas: fs, cols: cs };
    }
    return null;
  }

  function _menoresSinRaizComun(orden) {
    if (!orden) return null;
    let candidatos = [];
    let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
    let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
    for (let fs of filas) for (let cs of cols) {
      let sub = Matriz.menor(mat, fs, cs);
      let det = _simpl(_detStr(sub));
      if (_esCeroExpr(det) || !_contieneParam(det)) continue;
      let roots = _rootsExpr(det).map(_normalizarCasoEspecial).filter(Boolean);
      if (!roots.length) continue;
      candidatos.push({ sub, det, roots, filas: fs, cols: cs });
    }
    for (let i = 0; i < candidatos.length; i++) {
      for (let j = i + 1; j < candidatos.length; j++) {
        let comun = candidatos[i].roots.some(r => _incluyeCasoEspecial(candidatos[j].roots, r));
        if (!comun) return [candidatos[i], candidatos[j]];
      }
    }
    return null;
  }

  function _menorSinRaicesRacionales(orden) {
    if (!orden) return null;
    let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
    let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
    for (let fs of filas) for (let cs of cols) {
      let sub = Matriz.menor(mat, fs, cs);
      let det = _simpl(_detStr(sub));
      if (_esCeroExpr(det) || !_contieneParam(det)) continue;
      let raicesRacionales = _rootsExpr(det)
        .map(_normalizarCasoEspecial)
        .filter(Boolean)
        .filter(v => /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d+)?|\.\d+))?$/.test(v.replace(",", ".")));
      if (raicesRacionales.length === 0) return { sub, det, filas: fs, cols: cs };
    }
    return null;
  }

  function _menorNoNuloCasoGeneral(orden) {
    if (!orden) return null;
    let filas = _combs(Array.from({ length: numFilas }, (_, i) => i), orden);
    let cols = _combs(Array.from({ length: numCols }, (_, i) => i), orden);
    for (let fs of filas) for (let cs of cols) {
      let sub = Matriz.menor(mat, fs, cs);
      let det = _simpl(_detStr(sub));
      if (_esCeroExpr(det) || !_contieneParam(det)) continue;
      let raices = _rootsExpr(det).map(_normalizarCasoEspecial).filter(Boolean);
      if (raices.length && raices.every(r => _incluyeCasoEspecial(valoresCriticos, r))) {
        return { sub, det, roots: raices, filas: fs, cols: cs };
      }
    }
    return null;
  }

  function _crearJustificacionRango(ejemplo, orden, val) {
    if (ejemplo) {
      let el = document.createElement("div"); el.className = "hist-menor-ejemplo";
      _rk(`\\text{Ejemplo: }${_detMatrixTex(ejemplo.sub)}=${_toLaTeX(ejemplo.det)}\\;\\text{ distinto de }\\;0`, el);
      return el;
    }
    if (val !== null) return null;
    let general = _menorNoNuloCasoGeneral(orden);
    if (general) {
      let el = document.createElement("div"); el.className = "hist-menor-ejemplo";
      _rk(`${_detMatrixTex(general.sub)}=${_toLaTeX(general.det)}`, el);
      return el;
    }
    let sinRaices = _menorSinRaicesRacionales(orden);
    if (sinRaices) {
      let el = document.createElement("div"); el.className = "hist-menor-ejemplo";
      _rk(`\\text{Ejemplo: }${_detMatrixTex(sinRaices.sub)}=${_toLaTeX(sinRaices.det)}\\;\\text{ no se anula para valores racionales}`, el);
      return el;
    }
    let pareja = _menoresSinRaizComun(orden);
    if (!pareja) return null;
    let el = document.createElement("div"); el.className = "hist-menor-ejemplo";
    let tex = pareja.map(m => `${_detMatrixTex(m.sub)}=${_toLaTeX(m.det)}`).join("\\quad\\text{y}\\quad ");
    _rk(`\\text{Ejemplo: }${tex}\\quad\\text{no se anulan a la vez}`, el);
    return el;
  }

  btnM.addEventListener("click", _modoMenor);
  btnR.addEventListener("click", _modoRango);
  _modoMenor();
}

// =====================================================================
// RESOLUCIÓN AUTOMÁTICA
// =====================================================================
function _autoResolver() {
  tarjetaActiva = null;
  _clear(historialDiv);
  historialDiv.classList.add("historial-auto");
  _clear(refContenido);
  valoresCriticos = [];
  casosEspecialesUsuario = [];

  let matCoef = _matCoefS();
  let maxOrdA = Math.min(nEcuaciones, nIncognitas);
  let { general: genA, criticos: critA } = _calcularRangoCasos(matCoef, nEcuaciones, nIncognitas, maxOrdA);
  let internosA = _casosEsperadosInternos(matCoef);
  if (internosA.length) critA = internosA;
  critA.forEach(v => { _addCasoEspecialGlobal(v); });
  let especA = critA.map(v => ({ val: v, r: _rangoNum(_sustitNum(matCoef, _valorNumericoCasoEspecial(v))) }));
  rangoA_casos = { general: genA, especiales: especA };
  _actualizarRangosCabecera("A", rangoA_casos);

  let maxOrdAb = Math.min(nEcuaciones, nIncognitas + 1);
  let { general: genAb, criticos: critAb } = _calcularRangoCasos(matrizAmpS, nEcuaciones, nIncognitas + 1, maxOrdAb);
  let internosAb = _casosEsperadosInternos(matrizAmpS);
  if (internosAb.length) critAb = internosAb;
  critAb.forEach(v => { _addCasoEspecialGlobal(v); });
  let allCrit = valoresCriticos.slice();
  let especAb = allCrit.map(v => ({ val: v, r: _rangoNum(_sustitNum(matrizAmpS, _valorNumericoCasoEspecial(v))) }));
  rangoAb_casos = { general: genAb, especiales: especAb };
  rangoA_casos.especiales = allCrit.map(v => ({ val: v, r: _rangoNum(_sustitNum(matCoef, _valorNumericoCasoEspecial(v))) }));
  _actualizarRangosCabecera("A", rangoA_casos);
  _actualizarRangosCabecera("(A|b)", rangoAb_casos);
  casosEspecialesUsuario = allCrit.slice();

  pasoActual = 5; _actualizarIndicador();
  historialDiv.appendChild(_crearTarjetaRangoAuto("Paso 1: Rango de A", "A", rangoA_casos, matCoef, nEcuaciones, nIncognitas));
  historialDiv.appendChild(_crearTarjetaRangoAuto("Paso 2: Rango(A|b)", "(A|b)", rangoAb_casos, matrizAmpS, nEcuaciones, nIncognitas + 1));

  let casosCard = document.createElement("div");
  casosCard.className = "hist-entrada hist-rango-conf hist-auto-resumen hist-auto-casos-resumen";
  let casosEt = document.createElement("div"); casosEt.className = "hist-etiqueta"; casosEt.textContent = "Paso 3: Casos especiales";
  casosCard.appendChild(casosEt);
  let casosTxt = document.createElement("div"); casosTxt.className = "hist-badge-rango";
  if (allCrit.length) _rk(`\\text{Casos especiales: }${allCrit.map(v => `${nombreParam}=${_toLaTeX(v)}`).join(",\\;")}`, casosTxt);
  else _rk(`\\text{No hay casos especiales}`, casosTxt);
  casosCard.appendChild(casosTxt);
  historialDiv.appendChild(casosCard);

  let casosScroll = document.createElement("div");
  casosScroll.className = "hist-casos-scroll";
  historialDiv.appendChild(casosScroll);

  let allVals = [null, ...allCrit];
  allVals.forEach(val => {
    let rA = val === null ? rangoA_casos.general : (rangoA_casos.especiales.find(e => _mismoCasoEspecial(e.val, val))?.r ?? rangoA_casos.general);
    let rAb = val === null ? rangoAb_casos.general : (rangoAb_casos.especiales.find(e => _mismoCasoEspecial(e.val, val))?.r ?? rangoAb_casos.general);
    casosScroll.appendChild(_crearTarjetaCasoAuto(val, rA, rAb));
  });
  _scrollHistorialAbajo();
}

function _calcularRangoCasos(mat, m, nc, maxOrd) {
  // Compute generic rank and find critical values by testing minors symbolically
  let criticos = [];
  let genericVal = _encontrarValorGenerico();
  let matNum = _sustitNum(mat, genericVal);
  let genRango = _rangoNum(matNum);
  let candidatos = [];

  // Find critical values by computing all minors of order >= genRango
  for (let ord = Math.min(maxOrd, genRango + 1); ord >= Math.max(1, genRango); ord--) {
    let filAll = Array.from({ length: m }, (_, i) => i);
    let colAll = Array.from({ length: nc }, (_, j) => j);
    let fCombs = _combs(filAll, ord);
    let cCombs = _combs(colAll, ord);
    for (let fc of fCombs) {
      for (let cc of cCombs) {
        let sub = Matriz.menor(mat, fc, cc);
        let det = _detStr(sub);
        if (!_esCeroExpr(det) && _contieneParam(det)) {
          let roots = _rootsExpr(det);
          roots.forEach(r => { if (!_incluyeCasoEspecial(candidatos, r)) candidatos.push(_normalizarCasoEspecial(r)); });
        }
      }
    }
  }
  candidatos.forEach(r => {
    let nr = _valorNumericoCasoEspecial(r);
    if (!Number.isFinite(nr)) return;
    if (_rangoNum(_sustitNum(mat, nr)) !== genRango && !_incluyeCasoEspecial(criticos, r)) {
      criticos.push(r);
    }
  });
  return { general: genRango, criticos };
}

function _combs(arr, k) {
  if (k === 0) return [[]];
  if (!arr.length) return [];
  let [h, ...t] = arr;
  return [..._combs(t, k - 1).map(c => [h, ...c]), ..._combs(t, k)];
}

// =====================================================================
// PASO 0 — ENTRADA
// =====================================================================
function iniciarPaso0() {
  pasoActual = 0;
  _actualizarIndicador();
  if (historialDiv) historialDiv.classList.remove("historial-auto");

  if (!caja1111.parentNode && caja1112 && caja1112.parentNode) caja1112.parentNode.insertBefore(caja1111, caja1112);
  caja1111.style.display = "flex";
  if (caja1111.parentNode) caja1111.parentNode.style.minWidth = "";
  caja11111.textContent = "INTRODUCCIÓN DE DATOS";
  caja11112.style.color = "#dbeafe";
  caja11112.innerHTML = "Valida cada dato con ENTER o TAB.";

  _clear(caja1112);
  let fila = document.createElement("div"); fila.className = "dim-fila";

  function _campo(label, hint) {
    let d = document.createElement("div"); d.className = "dim-campo";
    let l = document.createElement("span"); l.textContent = label;
    let s = document.createElement("small"); s.textContent = hint;
    let i = document.createElement("input"); i.type = "text";
    i.style.width = "52px";
    d.appendChild(l); d.appendChild(i); d.appendChild(s);
    return { d, i };
  }

  let { d: d1, i: i1 } = _campo("Nº Ecuaciones", "(1 a 5)");
  let { d: d2, i: i2 } = _campo("Nº Incógnitas", "(1 a 5)");
  let { d: d3, i: i3 } = _campo("Parámetro", "(letra, ej. a)");
  fila.appendChild(d1); fila.appendChild(d2); fila.appendChild(d3);
  caja1112.appendChild(fila);

  _clear(caja112);
  let vac = document.createElement("div");
  vac.style.cssText = "font-size:11px;color:var(--muted);font-style:italic;padding:6px;";
  vac.textContent = "El sistema aparecerá aquí al rellenar las dimensiones.";
  caja112.appendChild(vac);

  _mostrarRef(null, null, null, null);
  let rv = document.createElement("div"); rv.className = "ref-vacia";
  rv.textContent = "Introduce el sistema para comenzar.";
  refContenido.appendChild(rv);

  i1.focus();
  i1.addEventListener("keydown", ev => {
    if (ev.key !== "Enter" && ev.key !== "Tab") return;
    ev.preventDefault();
    let n = parseInt(_strip(i1.value), 10);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      i1.value = ""; i1.focus();
      caja11112.style.color = "#fecaca"; caja11112.innerHTML = "Entero entre 1 y 5."; return;
    }
    nEcuaciones = n; caja11112.style.color = "#dbeafe";
    caja11112.innerHTML = "Ahora el nº de incógnitas."; i2.focus();
  });
  i2.addEventListener("keydown", ev => {
    if (ev.key !== "Enter" && ev.key !== "Tab") return;
    ev.preventDefault();
    let n = parseInt(_strip(i2.value), 10);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      i2.value = ""; i2.focus();
      caja11112.style.color = "#fecaca"; caja11112.innerHTML = "Entero entre 1 y 5."; return;
    }
    nIncognitas = n; caja11112.innerHTML = "Nombre del parámetro (letra, ej: a, k, λ).";
    i3.focus();
  });
  i3.addEventListener("keydown", ev => {
    if (ev.key !== "Enter" && ev.key !== "Tab") return;
    ev.preventDefault();
    let p = _strip(i3.value);
    if (!p.length || !/^[a-zA-Zα-ωΑ-Ω]$/.test(p)) {
      i3.value = ""; i3.focus();
      caja11112.style.color = "#fecaca"; caja11112.innerHTML = "Una letra (a-z, A-Z)."; return;
    }
    nombreParam = p; valoresCriticos = [];
    caja11112.innerHTML = `Rellena la matriz ampliada con coeficientes en ${p}.`;
    _crearTablaMatriz();
  });
}

// =====================================================================
// PASO 0b — TABLA DE ENTRADA
// =====================================================================
function _crearTablaMatriz() {
  _clear(caja112);

  // Show param chip
  let chip = document.createElement("div");
  chip.style.cssText = "display:flex;align-items:center;gap:6px;margin-bottom:6px;flex-wrap:wrap;";
  let chipLabel = document.createElement("span");
  chipLabel.className = "param-chip";
  chipLabel.textContent = "Parámetro: " + nombreParam;
  let note = document.createElement("span");
  note.style.cssText = "font-size:10px;color:var(--muted);";
  note.textContent = "Admite expresiones: 2" + nombreParam + "+1, " + nombreParam + "^2-3, etc.";
  chip.appendChild(chipLabel); chip.appendChild(note);
  caja112.appendChild(chip);

  let cont = document.createElement("div"); cont.className = "sistema-inline";
  caja112.appendChild(cont);

  Representar.abrirLlave(1.75 * nEcuaciones, cont);

  let tabla = document.createElement("table");
  let valoresInput = [];
  for (let i = 0; i < nEcuaciones; i++) {
    let tr = document.createElement("tr");
    let fila = [];
    for (let j = 0; j < nIncognitas + 1; j++) {
      let td = document.createElement("td");
      let inp = document.createElement("input"); inp.type = "text"; inp.value = "";
      inp.style.width = "52px";
      fila.push(inp);
      if (j < nIncognitas - 1) {
        let sp = document.createElement("span"); sp.innerHTML = ` x<sub>${j + 1}</sub>+`;
        td.appendChild(inp); td.appendChild(sp);
      } else if (j === nIncognitas - 1) {
        let sp = document.createElement("span"); sp.innerHTML = ` x<sub>${j + 1}</sub>`;
        let eq = document.createElement("span"); eq.style.padding = "0 3px"; _rk("=", eq);
        td.appendChild(inp); td.appendChild(sp); td.appendChild(eq);
      } else {
        td.appendChild(inp);
      }
      tr.appendChild(td);
    }
    valoresInput.push(fila); tabla.appendChild(tr);
  }
  cont.appendChild(tabla);

  let inputs = valoresInput.flat();
  inputs[0].focus();
  inputs.forEach((inp, i) => {
    inp.addEventListener("keydown", ev => {
      if (ev.key !== "Enter" && ev.key !== "Tab") return;
      ev.preventDefault();
      let v = _strip(inp.value);
      if (!v.length) {
        inp.value = ""; caja11112.style.color = "#fecaca";
        caja11112.innerHTML = "Celda vacía. Introduce 0 si el coeficiente es nulo."; return;
      }
      caja11112.style.color = "#dbeafe"; caja11112.innerHTML = "Rellena la matriz.";
      if (i < inputs.length - 1) inputs[i + 1].focus();
      else _confirmarSistema(valoresInput);
    });
  });
}

function _confirmarSistema(valoresInput) {
  // Build matrizAmpS from inputs
  matrizAmpS = valoresInput.map(fila => fila.map(inp => {
    let v = _strip(inp.value);
    return v.length ? v : "0";
  }));
  casosEspecialesUsuario = [];

  // Compute real ranks (numeric, using a generic value)
  let genVal = _encontrarValorGenerico();
  let matCoefNum = _sustitNum(_matCoefS(), genVal);
  let matAmpNum = _sustitNum(matrizAmpS, genVal);

  _clear(caja112);
  let fila = document.createElement("div"); fila.className = "confirmados-fila";

  function _bloque(titulo, latexStr, claseExtra) {
    let b = document.createElement("div"); b.className = "mat-bloque conf-blq " + (claseExtra || "");
    let t = document.createElement("div"); t.className = "mat-bloque-titulo"; t.textContent = titulo;
    let c = document.createElement("div"); c.className = "mat-bloque-contenido";
    _rk(latexStr, c); b.appendChild(t); b.appendChild(c); return b;
  }

  fila.appendChild(_bloque("Sistema", _sistemaLxS(), "conf-sistema"));
  let vs1 = document.createElement("div"); vs1.className = "conf-vsep"; fila.appendChild(vs1);
  fila.appendChild(_bloque("A", _matLxS(_matCoefS()), "conf-matriz"));
  let vs2 = document.createElement("div"); vs2.className = "conf-vsep"; fila.appendChild(vs2);
  fila.appendChild(_bloque("(A|b)", _matAmpLxS(), "conf-matriz conf-ampliada"));
  caja112.appendChild(fila);

  let btnAG = document.createElement("button");
  btnAG.type = "button";
  btnAG.id = "btnAutoGlobal";
  btnAG.className = "btn-auto btn-auto-cabecera";
  btnAG.textContent = "Resolución automática →";
  btnAG.style.display = "none";
  btnAG.addEventListener("click", _autoResolver);
  caja112.appendChild(btnAG);

  if (caja1111.parentNode) {
    caja1111.parentNode.style.minWidth = "0";
    caja1111.remove();
  }

  iniciarPaso1();
}

// =====================================================================
// PASO 1 — RANGO DE A
// =====================================================================
function iniciarPaso1() {
  pasoActual = 1; _actualizarIndicador();
  let btnAG = document.getElementById("btnAutoGlobal"); if (btnAG) btnAG.style.display = "";

  _mostrarRef(
    "Paso 1 — Rango de A",
    null,
    null,
    null
  );

  _crearTarjetaActiva(_matCoefS(), nEcuaciones, nIncognitas, "A", casos => {
    rangoA_casos = casos;
    _actualizarRangosCabecera("A", rangoA_casos);
    iniciarPaso2();
  });
}

// =====================================================================
// PASO 2 — RANGO DE (A|b)
// =====================================================================
function iniciarPaso2() {
  pasoActual = 2; _actualizarIndicador();

  _mostrarRef(
    "Paso 2 — Rango de (A|b)",
    null,
    null,
    null
  );

  _crearTarjetaActiva(matrizAmpS, nEcuaciones, nIncognitas + 1, "(A|b)", casos => {
    rangoAb_casos = casos;
    // Merge any new critical values
    casos.especiales.forEach(e => {
      _addCasoEspecialGlobal(e.val);
    });
    rangoA_casos.especiales = valoresCriticos.map(v => ({
      val: v,
      r: _rangoNum(_sustitNum(_matCoefS(), _valorNumericoCasoEspecial(v)))
    }));
    rangoAb_casos.especiales = valoresCriticos.map(v => ({
      val: v,
      r: _rangoNum(_sustitNum(matrizAmpS, _valorNumericoCasoEspecial(v)))
    }));
    _actualizarRangosCabecera("A", rangoA_casos);
    _actualizarRangosCabecera("(A|b)", rangoAb_casos);
    iniciarPaso3Especiales();
  });
}

// =====================================================================
// PASO 3 — CASOS ESPECIALES
// =====================================================================
function iniciarPaso3Especiales(auto = false) {
  pasoActual = 3; _actualizarIndicador();

  let casosCriticos = valoresCriticos.slice();
  _mostrarRef(
    "Paso 3 — Casos especiales",
    null,
    casosCriticos.length > 0
      ? `<strong>Los casos especiales son:</strong>`
      : `<strong>No hay casos especiales.</strong>`,
    casosCriticos.map(v => `\\text{${nombreParam}}=${_toLaTeX(v)}`)
  );

  _clear(refContenido);
  casosEspecialesUsuario = casosCriticos.slice();
  tarjetaActiva = null;
  setTimeout(iniciarPaso4, 250);
}
// =====================================================================
// PASO 3 — DISCUSION Y SOLUCION POR CASO
// =====================================================================
function iniciarPaso4() {
  pasoActual = 3; _actualizarIndicador();
  let scrollCasos = _prepararScrollCasos();
  let oldPaso4 = document.getElementById("paso4SelectorCaso");
  if (oldPaso4) oldPaso4.remove();
  let oldSep = caja112 ? caja112.querySelector(".confirmados-caso-sep") : null;
  if (oldSep) oldSep.remove();
  _mostrarRef(
    "Paso 3 - Caso y solucion",
    null,
    null
  );

  let card = document.createElement("div");
  card.id = "paso4SelectorCaso";
  card.className = "confirmados-caso";
  tarjetaActiva = null;
  let title = document.createElement("div");
  title.className = "confirmados-caso-titulo";
  title.textContent = "ESTUDIO DE LOS DIFERENTES CASOS";
  card.appendChild(title);
  let zona = document.createElement("div"); zona.className = "form-seccion";
  card.appendChild(zona);

  let filaConfirmados = caja112 ? caja112.querySelector(".confirmados-fila") : null;
  if (filaConfirmados) {
    let vs = document.createElement("div"); vs.className = "conf-vsep confirmados-caso-sep";
    filaConfirmados.appendChild(vs);
    filaConfirmados.appendChild(card);
  } else if (caja112) {
    caja112.appendChild(card);
  }

  let row = document.createElement("div"); row.className = "form-row confirmados-caso-row";
  let label = document.createElement("label"); label.textContent = `Estudia el caso ${nombreParam}=`;
  let inp = document.createElement("input"); inp.type = "text"; inp.style.width = "90px"; inp.placeholder = "G o valor";
  row.appendChild(label); row.appendChild(inp); zona.appendChild(row);
  let msg = document.createElement("div"); msg.className = "form-msg"; zona.appendChild(msg);
  let casosEstudiados = [];

  function crearCaso() {
    let parsed = _normalizarCasoPaso4(inp.value);
    if (!parsed.ok) { msg.innerHTML = `<span class='err'>${parsed.msg}</span>`; return; }
    let val = parsed.val;
    let repetido = casosEstudiados.some(v =>
      (v === null && val === null) ||
      (v !== null && val !== null && _mismoCasoEspecial(v, val))
    );
    if (repetido) {
      msg.innerHTML = `<span class='err'>Ese caso ya se ha estudiado.</span>`;
      inp.value = "";
      inp.focus();
      return;
    }
    casosEstudiados.push(val);
    let { rA, rAb } = _rangosParaCaso(val);
    let correcto = _tipoCaso(rA, rAb);

    let caseCard = document.createElement("div"); caseCard.className = "hist-entrada hist-discusion hist-caso-card";
    let caseTop = document.createElement("div"); caseTop.className = "hist-caso-top";
    let h = document.createElement("div"); h.className = "hist-etiqueta hist-caso-titulo";
    let especialesTxt = (casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos).join(", ");
    h.textContent = val === null && especialesTxt ? `Caso general (${nombreParam} != ${especialesTxt})` : val === null ? "Caso general" : `Caso ${nombreParam}=${val}`;
    caseTop.appendChild(h);
    let ranks = document.createElement("div"); ranks.className = "hist-disc-vals";
    _rk(`\\text{rg}(A)=${rA}\\quad\\text{rg}(A|b)=${rAb}\\quad n=${nIncognitas}`, ranks);
    caseTop.appendChild(ranks);

    let opts = document.createElement("div"); opts.className = "form-row caso-opciones";
    let radioName = `tipo_${Date.now()}_${Math.random()}`;
    [
      { value: "SCD", label: "SCD" },
      { value: "CSI", label: "SDI" },
      { value: "SI", label: "SI" }
    ].forEach(opt => {
      let lab = document.createElement("label"); lab.className = "caso-opcion";
      let radio = document.createElement("input"); radio.type = "radio"; radio.name = radioName; radio.value = opt.value;
      lab.appendChild(radio); lab.appendChild(document.createTextNode(opt.label)); opts.appendChild(lab);
      radio.addEventListener("change", () => validarTipo(opt.value, caseCard, correcto, rA, rAb, val));
    });
    caseTop.appendChild(opts);
    caseCard.appendChild(caseTop);
    (scrollCasos || historialDiv).appendChild(caseCard);
    inp.value = "";
    msg.textContent = "Puedes elegir otro caso especial, G, o un valor concreto dentro del caso general.";
    _scrollHistorialAbajo();
  }

  function validarTipo(t, caseCard, correcto, rA, rAb, val) {
    let old = caseCard.querySelector(".disc-feedback"); if (old) old.remove();
    let fb = document.createElement("div"); fb.className = "disc-feedback hist-disc-conclu";
    if (t !== correcto) {
      fb.className += " hist-tipo-incompatible";
      fb.textContent = "FALSO";
      (caseCard.querySelector(".hist-caso-top") || caseCard).appendChild(fb);
      return;
    }
    fb.className += correcto === "SCD" ? " hist-tipo-cd" : correcto === "CSI" ? " hist-tipo-ci" : " hist-tipo-incompatible";
    fb.textContent = "CIERTO";
    (caseCard.querySelector(".hist-caso-top") || caseCard).appendChild(fb);
    if (caseCard.dataset.solved === "1") return;
    caseCard.dataset.solved = "1";
    if (correcto !== "SI") _renderSolucionCaso(caseCard, val, rA);
    else {
      let no = document.createElement("div"); no.className = "hist-valor"; no.textContent = "No hay soluciones."; caseCard.appendChild(no);
      _appendIncompatiblePanel(val);
    }
  }

  inp.addEventListener("keydown", ev => {
    if (ev.key !== "Enter") return;
    ev.preventDefault(); crearCaso();
  });
  inp.focus();
  _scrollHistorialAbajo();
}
function iniciarPaso5() {
  pasoActual = 5; _actualizarIndicador();

  _clear(refContenido);
  let scrollCasos = _prepararScrollCasos();

  let allVals = [null, ...(casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos)];

  allVals.forEach(val => {
    let rA = val === null ? rangoA_casos.general : (rangoA_casos.especiales.find(e => e.val === val)?.r ?? rangoA_casos.general);
    let rAb = val === null ? rangoAb_casos.general : (rangoAb_casos.especiales.find(e => e.val === val)?.r ?? rangoAb_casos.general);
    if (rA !== rAb) {
      let card = document.createElement("div"); card.className = "hist-entrada hist-solucion";
      let et = document.createElement("div"); et.className = "hist-etiqueta";
      et.textContent = `Solución — ${_casoTextoPlano(val)}`;
      let no = document.createElement("div"); no.className = "hist-valor"; no.textContent = "No hay soluciones.";
      card.appendChild(et);
      card.appendChild(no);
      (scrollCasos || historialDiv).appendChild(card);
      _appendIncompatiblePanel(val);
      return;
    }

    let matS = val === null ? matrizAmpS : Matriz.sustituir(matrizAmpS, nombreParam, val);
    let matNum = val === null ? null : _sustitNum(matrizAmpS, _valorNumericoCasoEspecial(val));

    let card = document.createElement("div"); card.className = "hist-entrada hist-solucion";
    let et = document.createElement("div"); et.className = "hist-etiqueta";
    et.textContent = `Solución — ${_casoTextoPlano(val)}`;
    card.appendChild(et);

    if (val === null) {
      // General case: symbolic Cramer
      _cramerSimbolicoCD(card, matS, rA, refContenido, val);
    } else {
      // Specific case: numeric Cramer
      let matCoefNum = matNum.map(r => r.slice(0, nIncognitas));
      let matAmpNum = matNum;
      _cramerNumerico(card, matCoefNum, matAmpNum, rA, refContenido, val);
    }

    (scrollCasos || historialDiv).appendChild(card);
  });

  _scrollHistorialAbajo();
  caja11111.textContent = "PROCESO COMPLETADO";
  caja11112.style.color = "#dbeafe";
  caja11112.innerHTML = "Soluciones en el panel derecho →";
}

// ─── Cramer Simbólico (caso general) ───────────────────────────────────────
function _cramerSimbolicoCD(card, matS, rango, panel, val) {
  let n = nIncognitas;
  let matCoefS = matS.map(r => r.slice(0, n));

  if (rango === n) {
    // Compatible Determinado: Cramer full
    let detA = _detStr(matCoefS);
    let dEl = document.createElement("div"); dEl.className = "hist-det-note";
    _rk(`\\det(A)=${_detMatrixTex(matCoefS)}=${_toLaTeX(detA)}`, dEl);
    let top = card.querySelector(".hist-caso-top");
    let fb = top ? top.querySelector(".disc-feedback") : null;
    if (fb && fb.parentNode) fb.parentNode.insertBefore(dEl, fb.nextSibling);
    else if (top) top.appendChild(dEl);
    else card.appendChild(dEl);

    let solTex = [];
    let solRow = document.createElement("div"); solRow.className = "hist-sol-row";
    card.appendChild(solRow);
    for (let i = 0; i < n; i++) {
      let Ai = matCoefS.map((row, ri) => {
        let nr = row.slice(); nr[i] = matS[ri][n]; return nr;
      });
      let detAi = _detStr(Ai);
      let xiExpr = _simpl(`(${detAi})/(${detA})`);
      let xi = _toLaTeX(xiExpr);
      let dAiEl = document.createElement("div"); dAiEl.className = "hist-valor";
      _rk(`x_{${i + 1}}=\\frac{\\det(A_{${i + 1}})}{\\det(A)}=\\frac{${_detMatrixTex(Ai)}}{${_toLaTeX(detA)}}=${xi}`, dAiEl); solRow.appendChild(dAiEl);
      solTex.push(`x_{${i + 1}}=${xi}`);
    }
    let solEl = document.createElement("div"); solEl.className = "hist-badge-rango hist-sol-linea";
    _rk(`\\left[${solTex.join(",\\quad ")}\\right]`, solEl);
    _appendSolucionPanel(val, solEl);

  } else {
    // Compatible Indeterminado: show parametric structure
    let r = rango;
    let note = document.createElement("div"); note.className = "hist-valor";
    note.textContent = `rg(A) = ${r} < n = ${n} → Compatible indeterminado con ${n - r} parámetro(s) libre(s).`;
    card.appendChild(note);
    // Show the matrix for the general case
    let mEl = document.createElement("div"); mEl.className = "hist-valor";
    _rk(_matLxS(matCoefS), mEl); card.appendChild(mEl);
    let hint = document.createElement("div"); hint.className = "hist-valor";
    hint.style.fontSize = "11px"; hint.style.color = "var(--muted)";
    hint.textContent = "Asigna un parámetro a la(s) incógnita(s) libre(s) y aplica Cramer al subsistema.";
    card.appendChild(hint);
  }
}

// ─── Cramer Numérico (caso especial) ───────────────────────────────────────
function _cramerNumerico(card, matCoef, matAmp, rango, panel, val) {
  let n = nIncognitas;

  function _numToTex(x) {
    if (!Number.isFinite(x)) return "?";
    let r = Math.round(x * 1e9) / 1e9;
    if (Number.isInteger(r)) return r.toString();
    // Try fraction
    let fr = _fracApprox(r);
    if (fr) return `\\dfrac{${fr.p}}{${fr.q}}`;
    return r.toFixed(4);
  }

  function _fracApprox(x) {
    let s = x < 0 ? -1 : 1; let v = Math.abs(x);
    if (Math.abs(v - Math.round(v)) < 1e-8) return null;
    let h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = v;
    for (let it = 0; it < 32; it++) {
      let ai = Math.floor(b), h = ai * h1 + h0, k = ai * k1 + k0;
      if (k > 1000) break;
      if (Math.abs(v - h / k) < 1e-8) return { p: s * h, q: k };
      h0 = h1; h1 = h; k0 = k1; k1 = k;
      let fr = b - ai; if (fr < 1e-15) break; b = 1 / fr;
    }
    return null;
  }

  if (rango === n) {
    let b = matAmp.map(r => r[n]);
    let detA = Matriz.determinanteNumerico(matCoef);
    let dEl = document.createElement("div"); dEl.className = "hist-det-note";
    _rk(`\\det(A)=${_detMatrixTex(matCoef)}=${_numToTex(detA)}`, dEl);
    let top = card.querySelector(".hist-caso-top");
    let fb = top ? top.querySelector(".disc-feedback") : null;
    if (fb && fb.parentNode) fb.parentNode.insertBefore(dEl, fb.nextSibling);
    else if (top) top.appendChild(dEl);
    else card.appendChild(dEl);

    let results = [];
    let solRow = document.createElement("div"); solRow.className = "hist-sol-row";
    card.appendChild(solRow);
    for (let i = 0; i < n; i++) {
      let Ai = matCoef.map((row, ri) => { let nr = row.slice(); nr[i] = b[ri]; return nr; });
      let detAi = Matriz.determinanteNumerico(Ai);
      let xi = detAi / detA;
      results.push(xi);
      let dAiEl = document.createElement("div"); dAiEl.className = "hist-valor";
      _rk(`x_{${i + 1}}=\\frac{\\det(A_{${i + 1}})}{\\det(A)}=\\frac{${_detMatrixTex(Ai)}}{${_numToTex(detA)}}=${_numToTex(xi)}`, dAiEl);
      solRow.appendChild(dAiEl);
    }
    let solTex = `\\left[${results.map((v, i) => `x_{${i + 1}}=${_numToTex(v)}`).join(",\\quad ")}\\right]`;
    let b2 = document.createElement("div"); b2.className = "hist-badge-rango hist-sol-linea"; b2.style.cssText = "background:#fff7ed;color:#c2410c;"; _rk(solTex, b2); _appendSolucionPanel(val, b2);

  } else {
    // CI numeric
    let r = rango, libres = n - r;
    let note = document.createElement("div"); note.className = "hist-valor";
    note.textContent = `rg(A) = ${r} < n = ${n} → Compatible Indeterminado (${libres} parámetro libre).`;
    card.appendChild(note);
  }
}

// =====================================================================
// INIT
// =====================================================================
document.addEventListener("DOMContentLoaded", function () {
  caja1111 = document.getElementById("caja1111");
  caja11111 = document.getElementById("caja11111");
  caja11112 = document.getElementById("caja11112");
  caja1112 = document.getElementById("caja1112");
  caja112 = document.getElementById("caja112");
  pasoIndicadorDer = document.getElementById("pasoIndicadorDer");
  refContenido = document.getElementById("refContenido");
  historialDiv = document.getElementById("historial");
  if (historialDiv && window.MutationObserver) {
    new MutationObserver(_scrollHistorialAbajo).observe(historialDiv, { childList: true, subtree: true });
  }

  _construirIndicador();

  // Volver a explicación
  let btnVolver = document.getElementById("btnVolverExplicacion");
  if (btnVolver) btnVolver.addEventListener("click", ev => {
    ev.preventDefault();
    let calc = document.getElementById("calculadora");
    let intro = document.getElementById("introPrincipal");
    if (calc) calc.style.display = "none";
    if (intro) { intro.style.display = "block"; document.body.style.overflow = "auto"; window.scrollTo(0, 0); }
  });

  // Modal ayuda
  let abreV1 = document.getElementById("abreVentana1");
  let cierraV1 = document.getElementById("cierraVentana1");
  let ventana1 = document.getElementById("ventana1");
  let pdf1 = document.getElementById("pdf1");
  if (abreV1 && cierraV1 && ventana1 && pdf1) {
    let pdfURL = "INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0";
    abreV1.addEventListener("click", e => { e.preventDefault(); pdf1.src = pdfURL; ventana1.style.display = "flex"; });
    cierraV1.addEventListener("click", () => { ventana1.style.display = "none"; pdf1.src = ""; });
    window.addEventListener("click", e => { if (e.target === ventana1) { ventana1.style.display = "none"; pdf1.src = ""; } });
  }

  // Botón OTRO SISTEMA
  let otroBtn = document.getElementById("otroSistema");
  if (!otroBtn) { otroBtn = document.createElement("button"); otroBtn.id = "otroSistema"; otroBtn.textContent = "OTRO SISTEMA"; }
  let ctrlTop = document.getElementById("controlesTop");
  let btnHomeEl = document.getElementById("btnHome");
  if (ctrlTop) {
    if (btnHomeEl && btnHomeEl.parentNode === ctrlTop) ctrlTop.insertBefore(otroBtn, btnHomeEl);
    else ctrlTop.appendChild(otroBtn);
  }
  otroBtn.addEventListener("click", () => {
    nEcuaciones = 0; nIncognitas = 0; nombreParam = "a";
    matrizAmpS = []; valoresCriticos = [];
    rangoA_casos = null; rangoAb_casos = null;
    pasoActual = 0; tarjetaActiva = null;
    _clear(historialDiv);
    _construirIndicador();
    let btnAG = document.getElementById("btnAutoGlobal"); if (btnAG) btnAG.style.display = "none";
    iniciarPaso0();
  });

  iniciarPaso0();
});
