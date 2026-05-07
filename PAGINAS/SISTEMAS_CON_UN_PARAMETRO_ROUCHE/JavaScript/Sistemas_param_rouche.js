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
  let re = new RegExp("(?<![a-zA-Z_])" + nombreParam + "(?![a-zA-Z_0-9])");
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

function _parseCasosEspeciales(raw) {
  if (!raw) return [];
  return String(raw)
    .split(/[,;]+/)
    .map(_normalizarCasoEspecial)
    .filter(Boolean)
    .filter((v, i, self) => self.indexOf(v) === i);
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
  let xLabels = Array.from({ length: nIncognitas }, (_, j) => `x_{${j + 1}}`);
  let rows = matrizAmpS.map(fila => {
    let lhs = fila.slice(0, nIncognitas).map((c, j) => {
      let cs = _simpl(c);
      if (_esCeroExpr(cs)) return null;
      let tex = _toLaTeX(cs);
      return (j === 0 ? "" : "+") + tex + xLabels[j];
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
  ["Rango A", "Rango (A|b)", "Casos especiales", "Discusión", "Solución"].forEach((lbl, i) => {
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
  if (titulo) {
    let h = document.createElement("div"); h.className = "ref-titulo"; h.textContent = titulo;
    refContenido.appendChild(h);
  }
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
function _insertarAnteActiva(card) {
  if (tarjetaActiva && tarjetaActiva.parentNode === historialDiv)
    historialDiv.insertBefore(card, tarjetaActiva);
  else historialDiv.appendChild(card);
  historialDiv.scrollTop = historialDiv.scrollHeight;
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
function _tarjetaDiscusion(prefijo, rA, rAb, n, val) {
  let tipo = rA !== rAb ? "incompatible" : rA === n ? "cd" : "ci";

  let card = document.createElement("div"); card.className = "hist-entrada hist-discusion";
  let et = document.createElement("div"); et.className = "hist-etiqueta";
  et.textContent = val === null
    ? `Discusión — Caso general (${nombreParam} ≠ valores críticos)`
    : `Discusión — ${nombreParam} = ${val}`;
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

// =====================================================================
// ENCONTRAR VALOR GENÉRICO (no crítico)
// =====================================================================
function _encontrarValorGenerico() {
  let candidates = [7, 13, 97, 23, 41, -3, 100, 11, 5, 3, 2, -5, 17, 19];
  for (let c of candidates) {
    let isCrit = valoresCriticos.some(v => {
      let nv = parseFloat(v);
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

  let resArea = document.createElement("div"); resArea.className = "form-res-area";
  card.appendChild(resArea);

  let tog = document.createElement("div"); tog.className = "form-toggle";
  let btnM = document.createElement("button"); btnM.className = "form-toggle-btn activo"; btnM.textContent = "Calcular menor"; btnM.type = "button";
  let btnR = document.createElement("button"); btnR.className = "form-toggle-btn"; btnR.textContent = "Indicar rango"; btnR.type = "button";
  tog.appendChild(btnM); tog.appendChild(btnR);
  card.appendChild(tog);

  let zona = document.createElement("div"); zona.className = "form-seccion";
  card.appendChild(zona);
  historialDiv.appendChild(card);

  /* ── Añadir resultado de menor ── */
  function _addResultado(filIdx, colIdx, det, roots) {
    let orden = filIdx.length;
    let f = filIdx.map(x => x + 1).join(",");
    let c = colIdx.map(x => x + 1).join(",");

    // Register critical values
    roots.forEach(rv => { if (!valoresCriticos.includes(rv)) valoresCriticos.push(rv); });

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
        rd.textContent = "No se anula para ningún valor real del parámetro.";
        blq.appendChild(rd);
      }
    }

    let inf = document.createElement("div"); inf.className = "form-menor-inf";
    if (siempreNulo) inf.textContent = "Siempre nulo (para todo valor del parámetro).";
    else if (siempreNoNulo) inf.textContent = "Siempre no nulo — no depende del parámetro.";
    else if (roots.length > 0) {
      let rStr = roots.map(r => `${nombreParam}=${r}`).join(", ");
      inf.textContent = `No nulo salvo cuando ${rStr}.`;
    } else {
      inf.textContent = "Nunca nulo.";
    }
    blq.appendChild(inf);
    resArea.appendChild(blq);
    card.scrollIntoView({ block: "end", behavior: "smooth" });
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
    btnR.classList.add("activo"); btnM.classList.remove("activo");
    _clear(zona);

    let criticos = valoresCriticos.slice();
    let maxPos = Math.min(numFilas, numCols);

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
        let testVal = (val === null) ? _encontrarValorGenerico() : parseFloat(val);
        if (!Number.isFinite(testVal)) testVal = 0;
        let matNum = _sustitNum(mat, testVal);
        let rangoReal = _rangoNum(matNum);

        if (rangoReal !== rv) {
          msgR.innerHTML = `<span class="falso">FALSO</span> — Para ${nombreParam}=${testVal}: rg = ${rangoReal}, no ${rv}.`;
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
        // Add summary
        let vg = document.createElement("div"); vg.className = "hist-badge-rango";
        let texG = `\\text{rg}(${prefijo}) = ${casosObj.general}`;
        if (casosObj.especiales.length > 0) {
          texG += `\\;\\;(${nombreParam}\\neq ${casosObj.especiales.map(e => _toLaTeX(e.val)).join(",\\,")})`;
        }
        _rk(texG, vg); card.appendChild(vg);
        casosObj.especiales.forEach(e => {
          let ve = document.createElement("div"); ve.className = "hist-badge-rango";
          ve.style.cssText = "background:#fff7ed;color:#c2410c;";
          _rk(`\\text{rg}(${prefijo}) = ${e.r}\\;\\;(${nombreParam}=${_toLaTeX(e.val)})`, ve);
          card.appendChild(ve);
        });
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

  btnM.addEventListener("click", _modoMenor);
  btnR.addEventListener("click", _modoRango);
  _modoMenor();
}

// =====================================================================
// RESOLUCIÓN AUTOMÁTICA
// =====================================================================
function _autoResolver() {
  if (tarjetaActiva && tarjetaActiva.parentNode)
    tarjetaActiva.parentNode.removeChild(tarjetaActiva);
  tarjetaActiva = null;

  // Compute rank of A symbolically
  let matCoef = _matCoefS();
  let maxOrdA = Math.min(nEcuaciones, nIncognitas);
  let { general: genA, criticos: critA } = _calcularRangoCasos(matCoef, nEcuaciones, nIncognitas, maxOrdA);
  critA.forEach(v => { if (!valoresCriticos.includes(v)) valoresCriticos.push(v); });
  let especA = critA.map(v => ({ val: v, r: _rangoNum(_sustitNum(matCoef, parseFloat(v))) }));
  rangoA_casos = { general: genA, especiales: especA };

  // Show card for A
  let cardA = _tarjetaRangoConfirmado("A", rangoA_casos);
  let etA = document.createElement("div"); etA.className = "hist-etiqueta";
  etA.textContent = "Paso 1 — A (resolución automática)";
  cardA.insertBefore(etA, cardA.firstChild);
  historialDiv.appendChild(cardA);

  pasoActual = 2; _actualizarIndicador();

  // Compute rank of A|b
  let maxOrdAb = Math.min(nEcuaciones, nIncognitas + 1);
  let { general: genAb, criticos: critAb } = _calcularRangoCasos(matrizAmpS, nEcuaciones, nIncognitas + 1, maxOrdAb);
  critAb.forEach(v => { if (!valoresCriticos.includes(v)) valoresCriticos.push(v); });
  // For all critical values (from both A and A|b)
  let allCrit = valoresCriticos.slice();
  let especAb = allCrit.map(v => ({ val: v, r: _rangoNum(_sustitNum(matrizAmpS, parseFloat(v))) }));
  rangoAb_casos = { general: genAb, especiales: especAb };

  // Recalculate speciales for A with all critical values too
  rangoA_casos.especiales = allCrit.map(v => ({ val: v, r: _rangoNum(_sustitNum(matCoef, parseFloat(v))) }));

  let cardAb = _tarjetaRangoConfirmado("(A|b)", rangoAb_casos);
  let etAb = document.createElement("div"); etAb.className = "hist-etiqueta";
  etAb.textContent = "Paso 2 — (A|b) (resolución automática)";
  cardAb.insertBefore(etAb, cardAb.firstChild);
  historialDiv.appendChild(cardAb);

  iniciarPaso3Especiales(true);
}

function _calcularRangoCasos(mat, m, nc, maxOrd) {
  // Compute generic rank and find critical values by testing minors symbolically
  let criticos = [];
  let genericVal = _encontrarValorGenerico();
  let matNum = _sustitNum(mat, genericVal);
  let genRango = _rangoNum(matNum);

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
          roots.forEach(r => { if (!criticos.includes(r)) criticos.push(r); });
        }
      }
    }
  }
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

  function _bloque(titulo, latexStr) {
    let b = document.createElement("div"); b.className = "mat-bloque conf-blq";
    let t = document.createElement("div"); t.className = "mat-bloque-titulo"; t.textContent = titulo;
    let c = document.createElement("div"); c.className = "mat-bloque-contenido";
    _rk(latexStr, c); b.appendChild(t); b.appendChild(c); return b;
  }

  fila.appendChild(_bloque("Sistema", _sistemaLxS()));
  let vs1 = document.createElement("div"); vs1.className = "conf-vsep"; fila.appendChild(vs1);
  fila.appendChild(_bloque("A", _matLxS(_matCoefS())));
  let vs2 = document.createElement("div"); vs2.className = "conf-vsep"; fila.appendChild(vs2);
  fila.appendChild(_bloque("(A|b)", _matAmpLxS()));
  caja112.appendChild(fila);

  caja11111.textContent = "SISTEMA INTRODUCIDO";
  caja11112.style.color = "#dbeafe";
  caja11112.innerHTML = `${nEcuaciones} ec. · ${nIncognitas} incóg. · Parámetro: ${nombreParam} · Avanza →`;

  iniciarPaso1();
}

// =====================================================================
// PASO 1 — RANGO DE A
// =====================================================================
function iniciarPaso1() {
  pasoActual = 1; _actualizarIndicador();
  let btnAG = document.getElementById("btnAutoGlobal"); if (btnAG) btnAG.style.display = "";

  let maxOrd = Math.min(nEcuaciones, nIncognitas);
  _mostrarRef(
    "Paso 1 — Rango de A",
    _matLxS(_matCoefS()),
    `Orden máximo de menores: <strong>${maxOrd}</strong> &nbsp;·&nbsp; Parámetro: <strong>${nombreParam}</strong>`,
    null
  );

  _crearTarjetaActiva(_matCoefS(), nEcuaciones, nIncognitas, "A", casos => {
    rangoA_casos = casos;
    iniciarPaso2();
  });
}

// =====================================================================
// PASO 2 — RANGO DE (A|b)
// =====================================================================
function iniciarPaso2() {
  pasoActual = 2; _actualizarIndicador();

  let maxOrd = Math.min(nEcuaciones, nIncognitas + 1);
  let rangosBadge = [`\\text{rg}(A)=${rangoA_casos.general}`];
  if (rangoA_casos.especiales.length > 0) {
    rangoA_casos.especiales.forEach(e => {
      rangosBadge.push(`\\text{rg}(A)=${e.r}\\;(${nombreParam}=${_toLaTeX(e.val)})`);
    });
  }
  _mostrarRef(
    "Paso 2 — Rango de (A|b)",
    _matAmpLxS(),
    `Orden máximo de menores: <strong>${maxOrd}</strong>`,
    rangosBadge
  );

  _crearTarjetaActiva(matrizAmpS, nEcuaciones, nIncognitas + 1, "(A|b)", casos => {
    rangoAb_casos = casos;
    // Merge any new critical values
    casos.especiales.forEach(e => {
      if (!valoresCriticos.includes(e.val)) valoresCriticos.push(e.val);
    });
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
      ? `<strong>Marca los valores críticos que se deben estudiar y añade casos adicionales si lo deseas.</strong>`
      : `<strong>No hay valores críticos detectados. Puedes continuar al siguiente paso.</strong>`,
    casosCriticos.map(v => `\\text{${nombreParam}}=${_toLaTeX(v)}`)
  );

  let card = document.createElement("div"); card.className = "hist-entrada hist-activa";
  tarjetaActiva = card;
  let et = document.createElement("div"); et.className = "hist-etiqueta";
  et.textContent = "Paso 3 — Casos especiales";
  card.appendChild(et);
  let zona = document.createElement("div"); zona.className = "form-seccion";
  card.appendChild(zona);
  historialDiv.appendChild(card);

  if (casosCriticos.length === 0) {
    let info = document.createElement("div"); info.className = "form-msg";
    info.innerHTML = "<span class='cierto'>No hay valores críticos. Continúa al siguiente paso.</span>";
    zona.appendChild(info);
    let btn = document.createElement("button"); btn.type = "button"; btn.textContent = "Continuar";
    btn.addEventListener("click", function () {
      casosEspecialesUsuario = [];
      card.className = "hist-entrada hist-rango-conf";
      let summary = document.createElement("div"); summary.className = "hist-badge-rango";
      _rk(`\\text{Casos especiales: ninguno}`, summary);
      card.appendChild(summary);
      tarjetaActiva = null;
      iniciarPaso4();
    });
    zona.appendChild(btn);
    if (auto) btn.click();
    return;
  }

  let pickList = document.createElement("div");
  pickList.className = "form-row";
  pickList.style.flexDirection = "column";
  pickList.style.alignItems = "flex-start";
  pickList.style.gap = "6px";
  let instruction = document.createElement("div"); instruction.className = "form-msg";
  instruction.textContent = "Marca los valores críticos que se deben estudiar:";
  pickList.appendChild(instruction);

  let seleccionado = new Set();
  casosCriticos.forEach(val => {
    let row = document.createElement("label");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "8px";
    row.style.fontSize = "12px";
    let cb = document.createElement("input"); cb.type = "checkbox"; cb.value = val;
    cb.addEventListener("change", function () {
      if (cb.checked) seleccionado.add(val);
      else seleccionado.delete(val);
    });
    let txt = document.createElement("span"); txt.textContent = `${nombreParam}=${val}`;
    row.appendChild(cb);
    row.appendChild(txt);
    pickList.appendChild(row);
  });
  zona.appendChild(pickList);

  let extraRow = document.createElement("div"); extraRow.className = "form-row";
  let extraLabel = document.createElement("label"); extraLabel.textContent = "Casos adicionales:";
  let extraInput = document.createElement("input"); extraInput.type = "text";
  extraInput.style.width = "160px";
  extraInput.placeholder = `Ej. ${nombreParam}=0, ${nombreParam}=2`;
  extraRow.appendChild(extraLabel);
  extraRow.appendChild(extraInput);
  zona.appendChild(extraRow);

  let msg = document.createElement("div"); msg.className = "form-msg";
  zona.appendChild(msg);

  let btn = document.createElement("button"); btn.type = "button"; btn.textContent = "Validar casos";
  btn.addEventListener("click", function () {
    let faltantes = casosCriticos.filter(v => !seleccionado.has(v));
    if (faltantes.length) {
      msg.innerHTML = `<span class='err'>Debes marcar todos los valores críticos: ${faltantes.map(v => nombreParam + "=" + v).join(", ")}.</span>`;
      return;
    }
    let extra = _parseCasosEspeciales(extraInput.value);
    let casos = [...casosCriticos];
    extra.forEach(v => { if (!casos.includes(v)) casos.push(v); });
    casosEspecialesUsuario = casos;
    msg.innerHTML = `<span class='cierto'>CIERTO</span> — Casos especiales listos.`;
    setTimeout(function () {
      card.className = "hist-entrada hist-rango-conf";
      let summary = document.createElement("div"); summary.className = "hist-badge-rango";
      _rk(`\\text{Casos especiales: }${casos.map(v => nombreParam + "=" + _toLaTeX(v)).join(",\\,")}`, summary);
      card.appendChild(summary);
      tarjetaActiva = null;
      iniciarPaso4();
    }, 600);
  });
  zona.appendChild(btn);

  if (auto) {
    casosCriticos.forEach(v => seleccionado.add(v));
    btn.click();
  }
}

// =====================================================================
// =====================================================================
// PASO 4 — DISCUSIÓN POR CASOS
// =====================================================================
function iniciarPaso4() {
  pasoActual = 4; _actualizarIndicador();

  let casosParaMostrar = casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos;
  let allVals = [null, ...casosParaMostrar];
  let textoCasos = casosParaMostrar.length
    ? `${nombreParam} ≠ {${casosParaMostrar.join(', ')}}`
    : `todos los valores`;

  _mostrarRef(
    "Paso 4 — Discusión",
    null,
    `<strong>Casos:</strong> general (${textoCasos}) ${casosParaMostrar.length > 0 ? " + " + casosParaMostrar.length + " caso(s) particular(es)" : ""}`,
    null
  );

  let incompatibleAll = true;

  allVals.forEach(val => {
    let rA = val === null ? rangoA_casos.general : (rangoA_casos.especiales.find(e => e.val === val)?.r ?? rangoA_casos.general);
    let rAb = val === null ? rangoAb_casos.general : (rangoAb_casos.especiales.find(e => e.val === val)?.r ?? rangoAb_casos.general);
    let { card } = _tarjetaDiscusion("A", rA, rAb, nIncognitas, val);
    historialDiv.appendChild(card);
    if (rA === rAb) incompatibleAll = false;
  });

  historialDiv.scrollTop = historialDiv.scrollHeight;

  if (incompatibleAll) {
    pasoActual = 5; _actualizarIndicador();
    caja11111.textContent = "PROCESO COMPLETADO";
    caja11112.style.color = "#fecaca";
    caja11112.innerHTML = "Sistema incompatible en todos los casos.";
  } else {
    iniciarPaso5();
  }
}

// =====================================================================
// PASO 5 — SOLUCIÓN POR CASOS
function iniciarPaso5() {
  pasoActual = 5; _actualizarIndicador();

  _clear(refContenido);
  let titSol = document.createElement("div"); titSol.className = "ref-titulo";
  titSol.textContent = "Paso 5 — Solución (Cramer por casos)";
  refContenido.appendChild(titSol);

  let allVals = [null, ...(casosEspecialesUsuario.length ? casosEspecialesUsuario : valoresCriticos)];

  allVals.forEach(val => {
    let rA = val === null ? rangoA_casos.general : (rangoA_casos.especiales.find(e => e.val === val)?.r ?? rangoA_casos.general);
    let rAb = val === null ? rangoAb_casos.general : (rangoAb_casos.especiales.find(e => e.val === val)?.r ?? rangoAb_casos.general);
    if (rA !== rAb) return; // incompatible — no solution

    let matS = val === null ? matrizAmpS : Matriz.sustituir(matrizAmpS, nombreParam, val);
    let matNum = val === null ? null : _sustitNum(matrizAmpS, parseFloat(val));

    let card = document.createElement("div"); card.className = "hist-entrada hist-solucion";
    let et = document.createElement("div"); et.className = "hist-etiqueta";
    et.textContent = val === null
      ? `Solución — Caso general (${nombreParam} ≠ valores críticos)`
      : `Solución — ${nombreParam} = ${val}`;
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

    historialDiv.appendChild(card);
  });

  historialDiv.scrollTop = historialDiv.scrollHeight;
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
    let dEl = document.createElement("div"); dEl.className = "hist-valor";
    _rk(`\\det(A)=${_toLaTeX(detA)}`, dEl); card.appendChild(dEl);

    let solTex = [];
    for (let i = 0; i < n; i++) {
      let Ai = matCoefS.map((row, ri) => {
        let nr = row.slice(); nr[i] = matS[ri][n]; return nr;
      });
      let detAi = _detStr(Ai);
      let xi = `\\dfrac{${_toLaTeX(detAi)}}{${_toLaTeX(detA)}}`;
      let dAiEl = document.createElement("div"); dAiEl.className = "hist-valor";
      _rk(`x_{${i + 1}}=${xi}`, dAiEl); card.appendChild(dAiEl);
      solTex.push(`x_{${i + 1}}=${xi}`);
    }
    let solEl = document.createElement("div"); solEl.className = "hist-badge-rango";
    _rk(`\\left[${solTex.join(",\\quad ")}\\right]`, solEl);
    card.appendChild(solEl); panel.appendChild(solEl.cloneNode(true));

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
    let dEl = document.createElement("div"); dEl.className = "hist-valor";
    _rk(`\\det(A)=${_numToTex(detA)}`, dEl); card.appendChild(dEl);

    let results = [];
    for (let i = 0; i < n; i++) {
      let Ai = matCoef.map((row, ri) => { let nr = row.slice(); nr[i] = b[ri]; return nr; });
      let detAi = Matriz.determinanteNumerico(Ai);
      let xi = detAi / detA;
      results.push(xi);
      let dAiEl = document.createElement("div"); dAiEl.className = "hist-valor";
      _rk(`x_{${i + 1}}=\\dfrac{${_numToTex(detAi)}}{${_numToTex(detA)}}=${_numToTex(xi)}`, dAiEl);
      card.appendChild(dAiEl);
    }
    let solTex = `\\left[${results.map((v, i) => `x_{${i + 1}}=${_numToTex(v)}`).join(",\\quad ")}\\right]`;
    let b1 = document.createElement("div"); b1.className = "hist-badge-rango"; _rk(solTex, b1); card.appendChild(b1);
    let b2 = document.createElement("div"); b2.className = "hist-badge-rango"; b2.style.cssText = "background:#fff7ed;color:#c2410c;"; _rk(solTex, b2); panel.appendChild(b2);

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
