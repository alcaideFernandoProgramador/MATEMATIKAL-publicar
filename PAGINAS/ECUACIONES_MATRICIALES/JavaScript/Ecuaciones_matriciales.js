/* =====================================================================
   ECUACIONES MATRICIALES — herramienta interactiva
   Usa Biblioteca Matematikal 2.0:
     · Validar.expresionMatricial              → validar cada lado
     · ExpresionMatricial.obtenerVariables      → nombres de matrices
     · ExpresionMatricial.calcular              → calcular L, R y B
     · ExpresionAlgebraica.pasarALatex          → convertir a LaTeX
     · Representar.expresionMatricialPasoaPaso  → resolución paso a paso
   ===================================================================== */

let gAnalysis = null;
let gN        = 0;
let gEqStr    = '';
let caja1, caja2, caja21, letreroUsuario;

// =====================================================================
// PARSEO Y ANÁLISIS
// =====================================================================

// Separa un lado de la ecuación en términos con y sin X.
// Solo soporta el formato simple: letras mayúsculas yuxtapuestas (ej: AXB, AX, XB, X).
function parseSide(s) {
  s = s.replace(/\s+/g, '');
  if (!s) return [];
  if (!/^[+\-]/.test(s)) s = '+' + s;
  const tokens = s.match(/[+\-][A-Z]+/g) || [];
  return tokens.map(tok => {
    const sign = tok[0] === '-' ? -1 : 1;
    const body = tok.slice(1);
    const xi = body.indexOf('X');
    if (xi >= 0) return { sign, left: body.slice(0, xi), right: body.slice(xi + 1), hasX: true };
    return { sign, str: body, hasX: false };
  });
}

// Valida la ecuación con la biblioteca y devuelve los dos lados como cadenas.
function parseAndValidate(eq) {
  eq = eq.replace(/\s+/g, '');
  if ((eq.match(/=/g) || []).length !== 1)
    throw 'La ecuación debe tener exactamente un signo igual (=).';

  const sep = eq.indexOf('=');
  const lhsStr = eq.slice(0, sep);
  const rhsStr = eq.slice(sep + 1);
  if (!lhsStr || !rhsStr) throw 'Ambos miembros deben ser no vacíos.';

  // Validación con la biblioteca
  const vL = Validar.expresionMatricial(lhsStr);
  if (!vL[0]) throw 'Primer miembro no válido' + (vL[1] ? ': ' + vL[1] : '.');
  const vR = Validar.expresionMatricial(rhsStr);
  if (!vR[0]) throw 'Segundo miembro no válido' + (vR[1] ? ': ' + vR[1] : '.');

  return { lhsStr, rhsStr };
}

// Analiza la estructura de la ecuación: estrategia de factorización,
// nombres de matrices y expresiones de L, R y B.
function analyzeEquation(lhsStr, rhsStr) {
  const lhs = parseSide(lhsStr);
  const rhs = parseSide(rhsStr);

  // Mover todos los términos con X al primer miembro y los libres al segundo
  const xTerms = [], freeTrms = [];
  for (const t of lhs) {
    if (t.hasX) xTerms.push({ sign:  t.sign, left: t.left, right: t.right });
    else        freeTrms.push({ sign: -t.sign, str: t.str });
  }
  for (const t of rhs) {
    if (t.hasX) xTerms.push({ sign: -t.sign, left: t.left, right: t.right });
    else        freeTrms.push({ sign:  t.sign, str: t.str });
  }

  if (xTerms.length === 0) throw 'La ecuación no contiene la incógnita X.';

  const allSameRight = xTerms.every(t => t.right === xTerms[0].right);
  const allSameLeft  = xTerms.every(t => t.left  === xTerms[0].left);
  if (!allSameRight && !allSameLeft)
    throw 'Los términos con X no tienen ningún factor común por la izquierda ni por la derecha. No es posible despejar X con este método.';

  const strategy = allSameRight ? 'A' : 'B';

  // Nombres de matrices con la biblioteca (excluye X e I)
  const lhsVars = ExpresionMatricial.obtenerVariables(lhsStr);
  const rhsVars = ExpresionMatricial.obtenerVariables(rhsStr);
  const matrixNames = [...new Set([...lhsVars, ...rhsVars])]
    .filter(v => v !== 'X' && v !== 'I').sort();

  // Construir las expresiones de L, R y B como cadenas para la biblioteca
  const lExpr = buildLExpr(xTerms, strategy);
  const rExpr = buildRExpr(xTerms, strategy);
  const bExpr = buildBExpr(freeTrms);

  return { xTerms, strategy, matrixNames, lExpr, rExpr, bExpr };
}

function buildLExpr(xTerms, strategy) {
  if (strategy !== 'A') return xTerms[0].left || 'I';
  return xTerms.map((t, i) => {
    const l = t.left || 'I';
    return (i === 0 ? (t.sign === -1 ? '-' : '') : (t.sign === -1 ? '-' : '+')) + l;
  }).join('');
}

function buildRExpr(xTerms, strategy) {
  if (strategy !== 'B') return xTerms[0].right || 'I';
  return xTerms.map((t, i) => {
    const r = t.right || 'I';
    return (i === 0 ? (t.sign === -1 ? '-' : '') : (t.sign === -1 ? '-' : '+')) + r;
  }).join('');
}

function buildBExpr(freeTrms) {
  if (!freeTrms.length) return null;
  return freeTrms.map((t, i) =>
    (i === 0 ? (t.sign === -1 ? '-' : '') : (t.sign === -1 ? '-' : '+')) + (t.str || '')
  ).join('');
}

// =====================================================================
// CÁLCULO USANDO LA BIBLIOTECA
// =====================================================================

function toMatrList(matMap) {
  return Object.entries(matMap).map(([nombre, matriz]) => ({ nombre, matriz }));
}

// Evalúa una expresión matricial con la biblioteca o devuelve identidad si es 'I'.
function calcExpr(expr, matrList, n) {
  if (!expr || expr === 'I') return Matriz.identidad(n);
  const result = ExpresionMatricial.calcular(expr, [...matrList]);
  if (!result) throw `No se pudo calcular la expresión "${expr}".`;
  return result;
}

function computeSolution(analysis, matMap, n) {
  const { lExpr, rExpr, bExpr } = analysis;
  const matrList = toMatrList(matMap);
  const isLId = lExpr === 'I';
  const isRId = rExpr === 'I';

  // La biblioteca calcula L, R y B a partir de las expresiones de cadena
  const L = calcExpr(lExpr, matrList, n);
  const R = calcExpr(rExpr, matrList, n);
  const B = bExpr
    ? calcExpr(bExpr, matrList, n)
    : Array.from({ length: n }, () => Array(n).fill('0'));

  let Linv = null, Rinv = null;
  if (!isLId) {
    const detL = Matriz.determinante(L);
    if (!detL || detL === '0') throw 'El factor izquierdo L no es invertible (det = 0). No tiene solución con este método.';
    Linv = Matriz.inversa(L);
  }
  if (!isRId) {
    const detR = Matriz.determinante(R);
    if (!detR || detR === '0') throw 'El factor derecho R no es invertible (det = 0). No tiene solución con este método.';
    Rinv = Matriz.inversa(R);
  }

  let X = B;
  if (Linv) X = Matriz.multiplicar(Linv, X);
  if (Rinv) X = Matriz.multiplicar(X, Rinv);

  return { L, R, B, Linv, Rinv, X, isLId, isRId };
}

// =====================================================================
// LaTeX — usa ExpresionAlgebraica.pasarALatex de la biblioteca
// =====================================================================

function exprToLatex(expr) {
  if (!expr || expr === 'I') return 'I';
  try { return ExpresionAlgebraica.pasarALatex(expr); }
  catch(e) { return expr; }
}

function buildFactoredTex(analysis) {
  const { lExpr, rExpr, bExpr, xTerms, strategy } = analysis;
  const isLId = lExpr === 'I';
  const isRId = rExpr === 'I';
  const needsLParen = xTerms.length > 1 && strategy === 'A' && /[+\-]/.test(lExpr);
  const needsRParen = xTerms.length > 1 && strategy === 'B' && /[+\-]/.test(rExpr);
  const lTex = isLId ? '' : (needsLParen ? `(${exprToLatex(lExpr)})` : exprToLatex(lExpr));
  const rTex = isRId ? '' : (needsRParen ? `(${exprToLatex(rExpr)})` : exprToLatex(rExpr));
  const bTex = bExpr ? exprToLatex(bExpr) : '\\mathbf{0}';
  return `${lTex}X${rTex} = ${bTex}`;
}

function buildFormulaTex(analysis) {
  const { lExpr, rExpr, bExpr, xTerms, strategy } = analysis;
  const isLId = lExpr === 'I';
  const isRId = rExpr === 'I';
  const needsLParen = xTerms.length > 1 && strategy === 'A' && /[+\-]/.test(lExpr);
  const needsRParen = xTerms.length > 1 && strategy === 'B' && /[+\-]/.test(rExpr);
  const lFull = needsLParen ? `(${lExpr})` : lExpr;
  const rFull = needsRParen ? `(${rExpr})` : rExpr;
  const bTex  = bExpr ? exprToLatex(bExpr) : '\\mathbf{0}';
  const parts = [];
  if (!isLId) parts.push(exprToLatex(lFull + '^(-1)'));
  parts.push(bTex);
  if (!isRId) parts.push(exprToLatex(rFull + '^(-1)'));
  return 'X = ' + parts.join('\\cdot ');
}

// =====================================================================
// DISPLAY DE LA SOLUCIÓN
// =====================================================================

function clearEl(el) { while (el.firstChild) el.removeChild(el.firstChild); }

function showError(msg, where) {
  const p = document.createElement('p');
  p.className = 'msgError';
  p.textContent = '⚠ ' + msg;
  where.appendChild(p);
}

function renderKatex(tex, el, display) {
  try { katex.render(tex, el, { throwOnError: false, displayMode: !!display }); }
  catch(e) { el.textContent = tex; }
}

function renderMatRow(labelTex, mat, container) {
  const row = document.createElement('div');
  row.className = 'matRow';
  if (labelTex) {
    const lbl = document.createElement('span');
    lbl.className = 'matLabel';
    renderKatex(labelTex + ' =', lbl, false);
    row.appendChild(lbl);
  }
  const mDiv = document.createElement('div');
  Representar.matriz(mat, mDiv);
  row.appendChild(mDiv);
  container.appendChild(row);
}

function addStep(container, title, isResult, renderFn) {
  const card = document.createElement('div');
  card.className = 'stepCard' + (isResult ? ' resultCard' : '');
  const h = document.createElement('div');
  h.className = 'stepTitle';
  h.textContent = title;
  card.appendChild(h);
  renderFn(card);
  container.appendChild(card);
}

function displaySolution(analysis, matMap, n, sol, lhsStr, rhsStr) {
  const { xTerms, strategy, lExpr, rExpr, bExpr } = analysis;
  const { L, R, B, Linv, Rinv, X, isLId, isRId } = sol;
  const matrList = toMatrList(matMap);

  clearEl(caja21);

  // 0. Ecuación introducida
  addStep(caja21, 'Ecuación introducida', false, div => {
    const d = document.createElement('div');
    d.style.marginTop = '6px';
    renderKatex(exprToLatex(lhsStr) + ' = ' + exprToLatex(rhsStr), d, true);
    div.appendChild(d);
  });

  // 1. Factorización (solo si hay más de un término con X)
  if (xTerms.length > 1) {
    addStep(caja21, 'Paso 1 — Factorizar X', false, div => {
      const desc = document.createElement('p');
      desc.style.cssText = 'font-size:13px;color:#4a5270;margin-bottom:8px;';
      desc.textContent = strategy === 'A'
        ? `Factor derecho común${xTerms[0].right ? ' (' + xTerms[0].right + ')' : ' (la identidad)'}. Se extrae X por la izquierda:`
        : `Factor izquierdo común${xTerms[0].left ? ' (' + xTerms[0].left + ')' : ' (la identidad)'}. Se extrae X por la derecha:`;
      div.appendChild(desc);
      const d = document.createElement('div');
      renderKatex(buildFactoredTex(analysis), d, true);
      div.appendChild(d);
    });
  }

  // 2. Fórmula simbólica para X
  const pasoFmla = xTerms.length > 1 ? 2 : 1;
  addStep(caja21, `Paso ${pasoFmla} — Fórmula para X`, false, div => {
    const note = document.createElement('p');
    note.style.cssText = 'font-size:12px;color:#6b7280;margin-bottom:8px;';
    note.textContent = 'Multiplicando por las inversas (respetando el orden):';
    div.appendChild(note);
    const d = document.createElement('div');
    renderKatex(buildFormulaTex(analysis), d, true);
    div.appendChild(d);
  });

  let paso = pasoFmla + 1;

  // 3. Factor L y su inversa
  if (!isLId) {
    addStep(caja21, `Paso ${paso++} — Factor izquierdo L`, false, div => {
      const lbl = document.createElement('p');
      lbl.style.cssText = 'font-size:12px;color:#6b7280;margin-bottom:6px;';
      const lSpan = document.createElement('span');
      renderKatex('L = ' + exprToLatex(lExpr), lSpan, false);
      lbl.appendChild(lSpan);
      div.appendChild(lbl);
      renderMatRow('L', L, div);
      const detL = Matriz.determinante(L);
      const p = document.createElement('p');
      p.style.cssText = 'font-size:13px;margin-top:8px;';
      p.innerHTML = `<strong>det(L)</strong> = ${detL} <span style="color:#16a34a;margin-left:8px;">✓ invertible</span>`;
      div.appendChild(p);
    });
    addStep(caja21, `Paso ${paso++} — Inversa de L`, false, div => {
      renderMatRow('L^{-1}', Linv, div);
    });
  }

  // 4. Factor R y su inversa
  if (!isRId) {
    addStep(caja21, `Paso ${paso++} — Factor derecho R`, false, div => {
      const lbl = document.createElement('p');
      lbl.style.cssText = 'font-size:12px;color:#6b7280;margin-bottom:6px;';
      const rSpan = document.createElement('span');
      renderKatex('R = ' + exprToLatex(rExpr), rSpan, false);
      lbl.appendChild(rSpan);
      div.appendChild(lbl);
      renderMatRow('R', R, div);
      const detR = Matriz.determinante(R);
      const p = document.createElement('p');
      p.style.cssText = 'font-size:13px;margin-top:8px;';
      p.innerHTML = `<strong>det(R)</strong> = ${detR} <span style="color:#16a34a;margin-left:8px;">✓ invertible</span>`;
      div.appendChild(p);
    });
    addStep(caja21, `Paso ${paso++} — Inversa de R`, false, div => {
      renderMatRow('R^{-1}', Rinv, div);
    });
  }

  // 5. Segundo miembro B
  addStep(caja21, `Paso ${paso++} — Segundo miembro B`, false, div => {
    const lbl = document.createElement('p');
    lbl.style.cssText = 'font-size:12px;color:#6b7280;margin-bottom:6px;';
    const bSpan = document.createElement('span');
    renderKatex('B = ' + exprToLatex(bExpr || '0'), bSpan, false);
    lbl.appendChild(bSpan);
    div.appendChild(lbl);
    renderMatRow('B', B, div);
  });

  // 6. Cálculo paso a paso de X usando Representar.expresionMatricialPasoaPaso
  addStep(caja21, `Paso ${paso++} — Cálculo de X paso a paso`, false, div => {
    const xMatrList = [];
    let xFormulaExpr = '';
    if (!isLId) { xMatrList.push({ nombre: 'L', matriz: L }); xFormulaExpr += 'L^(-1)*'; }
    xMatrList.push({ nombre: 'B', matriz: B });
    xFormulaExpr += 'B';
    if (!isRId) { xMatrList.push({ nombre: 'R', matriz: R }); xFormulaExpr += '*R^(-1)'; }

    if (xMatrList.length === 1) {
      renderMatRow('X', X, div);
    } else {
      const pasoDiv = document.createElement('div');
      pasoDiv.style.overflowX = 'auto';
      try {
        Representar.expresionMatricialPasoaPaso(xFormulaExpr, xMatrList, pasoDiv);
      } catch(e) {
        renderMatRow('X', X, div);
      }
      div.appendChild(pasoDiv);
    }
  });

  // 7. Resultado final
  addStep(caja21, 'RESULTADO', true, div => {
    renderMatRow('X', X, div);
  });
}

// =====================================================================
// INTERFAZ — FASE 1: introducir ecuación
// =====================================================================

function initFase1() {
  clearEl(caja1);
  clearEl(caja21);
  gAnalysis = null; gN = 0; gEqStr = '';

  const titleDiv = document.createElement('div');
  titleDiv.id = 'tituloCaja1';
  titleDiv.innerHTML = '<span>INTRODUCCIÓN DE DATOS</span>';
  caja1.appendChild(titleDiv);

  const fase = document.createElement('div');
  fase.className = 'fase';
  fase.innerHTML = '<strong>Fase 1/2:</strong> Introduce la ecuación matricial.';
  caja1.appendChild(fase);

  const nota = document.createElement('p');
  nota.style.cssText = 'font-size:12px;color:#6b7280;margin:8px 0 4px;';
  nota.innerHTML = 'Usa <strong>mayúsculas</strong>. <strong>X</strong> es la incógnita (reservada). ' +
    'Juxtaposición = producto. Signos + y −.<br>' +
    'Ejemplos: <code>AX+BX=C</code> &nbsp; <code>AXB=C</code> &nbsp; <code>XA-XB=D</code>';
  caja1.appendChild(nota);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:12px;flex-wrap:wrap;';
  const inp = document.createElement('input');
  inp.type = 'text'; inp.className = 'inputEcuacion';
  inp.placeholder = 'Ej: AX + BX = C'; inp.autocomplete = 'off'; inp.spellcheck = false;
  const btn = document.createElement('button');
  btn.className = 'primary'; btn.textContent = 'Analizar →';
  row.appendChild(inp); row.appendChild(btn);
  caja1.appendChild(row);

  const errDiv = document.createElement('div');
  errDiv.id = 'errFase1';
  caja1.appendChild(errDiv);

  function doAnalyze() {
    clearEl(errDiv);
    const eq = inp.value.trim().toUpperCase();
    if (!eq) { showError('Introduce una ecuación.', errDiv); return; }
    try {
      const { lhsStr, rhsStr } = parseAndValidate(eq);
      gAnalysis = analyzeEquation(lhsStr, rhsStr);
      gAnalysis.lhsStr = lhsStr;
      gAnalysis.rhsStr = rhsStr;
      gEqStr = eq;
      initFase2(gAnalysis);
    } catch(e) {
      showError(typeof e === 'string' ? e : e.message, errDiv);
    }
  }

  btn.addEventListener('click', doAnalyze);
  inp.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); doAnalyze(); }
  });
  inp.focus();
}

// =====================================================================
// INTERFAZ — FASE 2: introducir matrices
// =====================================================================

function initFase2(analysis) {
  clearEl(caja1);

  const titleDiv = document.createElement('div');
  titleDiv.id = 'tituloCaja1';
  titleDiv.innerHTML = '<span>INTRODUCCIÓN DE DATOS</span>';
  caja1.appendChild(titleDiv);

  const fase = document.createElement('div');
  fase.className = 'fase';
  const { lExpr, rExpr, bExpr } = analysis;
  const isLId = lExpr === 'I', isRId = rExpr === 'I';
  const factDesc = analysis.strategy === 'A'
    ? `<strong>L·X·R = B</strong> con L = ${lExpr}, R = ${isRId ? 'I' : rExpr}`
    : `<strong>L·X·R = B</strong> con L = ${isLId ? 'I' : lExpr}, R = ${rExpr}`;
  fase.innerHTML = `<strong>Fase 2/2:</strong> Ecuación: <code>${gEqStr}</code><br>
    Matrices a introducir: <strong>${analysis.matrixNames.filter(m => m !== 'I').join(', ')}</strong><br>
    ${factDesc}`;
  caja1.appendChild(fase);

  const orderRow = document.createElement('div');
  orderRow.style.cssText = 'display:flex;align-items:center;gap:10px;margin:12px 0;';
  const orderLabel = document.createElement('label');
  orderLabel.textContent = 'Orden de las matrices (n):';
  orderLabel.style.cssText = 'font-size:13px;font-weight:600;color:#374151;';
  const orderInp = document.createElement('input');
  orderInp.type = 'text'; orderInp.className = 'inputPequeno'; orderInp.placeholder = '2';
  orderRow.appendChild(orderLabel); orderRow.appendChild(orderInp);
  caja1.appendChild(orderRow);

  const matSection = document.createElement('div');
  matSection.id = 'matSection';
  caja1.appendChild(matSection);

  const errDiv = document.createElement('div');
  errDiv.id = 'errFase2';
  caja1.appendChild(errDiv);

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;';
  const btnResolver = document.createElement('button');
  btnResolver.className = 'primary'; btnResolver.textContent = 'Resolver';
  btnResolver.style.display = 'none';
  const btnVolver = document.createElement('button');
  btnVolver.textContent = '← Otra ecuación';
  btnRow.appendChild(btnResolver); btnRow.appendChild(btnVolver);
  caja1.appendChild(btnRow);

  btnVolver.addEventListener('click', initFase1);

  let matInputCells = {};
  let nConfirmed = false;

  function buildMatrixInputs(n) {
    clearEl(matSection);
    matInputCells = {};
    const toInput = analysis.matrixNames.filter(name => name !== 'I');
    if (toInput.length === 0) { btnResolver.style.display = 'inline-flex'; return; }
    for (const name of toInput) {
      const wrap = document.createElement('div');
      wrap.className = 'matrizInputWrap';
      const lbl = document.createElement('span');
      lbl.className = 'matNombreLabel'; lbl.textContent = name + ' =';
      wrap.appendChild(lbl);
      const tbl = document.createElement('table');
      tbl.style.borderSpacing = '6px';
      const cells = [];
      for (let i = 0; i < n; i++) {
        const tr = document.createElement('tr');
        const row = [];
        for (let j = 0; j < n; j++) {
          const td = document.createElement('td');
          const inp = document.createElement('input');
          inp.type = 'text'; inp.className = 'inputCorto';
          inp.placeholder = '0'; inp.autocomplete = 'off';
          inp.addEventListener('keydown', ev => {
            if (ev.key === 'Enter') {
              ev.preventDefault();
              const all = [...matSection.querySelectorAll('input')];
              const idx = all.indexOf(ev.target);
              if (idx >= 0 && idx < all.length - 1) all[idx + 1].focus();
              else btnResolver.focus();
            }
          });
          td.appendChild(inp); tr.appendChild(td); row.push(inp);
        }
        tbl.appendChild(tr); cells.push(row);
      }
      matInputCells[name] = cells;
      wrap.appendChild(tbl);
      matSection.appendChild(wrap);
    }
    btnResolver.style.display = 'inline-flex';
    const firstInp = matSection.querySelector('input');
    if (firstInp) firstInp.focus();
  }

  orderInp.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter' && ev.key !== 'Tab') return;
    ev.preventDefault();
    clearEl(errDiv);
    const nVal = parseInt(orderInp.value, 10);
    if (!Number.isInteger(nVal) || nVal < 1 || nVal > 5) {
      showError('El orden debe ser un entero entre 1 y 5.', errDiv); return;
    }
    gN = nVal; nConfirmed = true;
    buildMatrixInputs(nVal);
  });

  btnResolver.addEventListener('click', () => {
    clearEl(errDiv);
    if (!nConfirmed || gN < 1) {
      showError('Confirma primero el orden (pulsa ENTER en el campo).', errDiv); return;
    }
    const matMap = { 'I': Matriz.identidad(gN) };
    try {
      for (const name of analysis.matrixNames) {
        if (name === 'I') continue;
        const cells = matInputCells[name];
        if (!cells) { showError(`Tabla de la matriz ${name} no encontrada.`, errDiv); return; }
        const mat = [];
        for (let i = 0; i < gN; i++) {
          const row = [];
          for (let j = 0; j < gN; j++) {
            const v = cells[i][j].value.trim().replace(',', '.');
            if (!v) { showError(`Falta un valor en ${name} (fila ${i+1}, col ${j+1}).`, errDiv); return; }
            if (!/^[-+]?(\d+(\.\d+)?|\d+\/\d+)$/.test(v))
              { showError(`Valor inválido "${v}" en ${name}. Usa enteros, decimales o fracciones a/b.`, errDiv); return; }
            row.push(v);
          }
          mat.push(row);
        }
        matMap[name] = mat;
      }
      const sol = computeSolution(analysis, matMap, gN);
      displaySolution(analysis, matMap, gN, sol, analysis.lhsStr, analysis.rhsStr);
    } catch(e) {
      showError(typeof e === 'string' ? e : e.message, errDiv);
    }
  });
}

// =====================================================================
// ARRANQUE
// =====================================================================

document.addEventListener('DOMContentLoaded', function() {
  caja1          = document.getElementById('caja1');
  caja2          = document.getElementById('caja2');
  caja21         = document.getElementById('caja21');
  letreroUsuario = document.getElementById('letreroUsuario');

  const btnVolver = document.getElementById('btnVolverExplicacion');
  if (btnVolver) btnVolver.addEventListener('click', e => { e.preventDefault(); mostrarIntro(); });

  const btnReset = document.getElementById('btnReset');
  if (btnReset) btnReset.addEventListener('click', e => { e.preventDefault(); initFase1(); });

  // Modal de ayuda
  const btnAyuda = document.getElementById('abreVentana1');
  const ventana1 = document.getElementById('ventana1');
  const cierraV1 = document.getElementById('cierraVentana1');
  const pdf1     = document.getElementById('pdf1');
  if (btnAyuda && ventana1) {
    btnAyuda.addEventListener('click', e => {
      e.preventDefault();
      if (pdf1 && !pdf1.src.includes('Ayuda.pdf')) pdf1.src = 'INSTRUCCIONES/Ayuda.pdf';
      ventana1.style.display = 'flex';
    });
  }
  if (cierraV1 && ventana1) cierraV1.addEventListener('click', () => { ventana1.style.display = 'none'; });
  if (ventana1) ventana1.addEventListener('click', e => { if (e.target === ventana1) ventana1.style.display = 'none'; });

  initFase1();
});

// =====================================================================
// TOGGLE INTRO / CALCULADORA
// =====================================================================

function mostrarCalc(ev) {
  if (ev) ev.preventDefault();
  const intro = document.getElementById('introPrincipal');
  const calc  = document.getElementById('calculadora');
  if (intro) intro.style.display = 'none';
  if (calc) {
    calc.style.display = 'flex';
    calc.style.flexDirection = 'column';
    calc.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    window.scrollTo(0, 0);
    requestAnimationFrame(function() {
      var f = calc.querySelector('input'); if (f) try { f.focus(); } catch(e) {}
    });
  }
}

function mostrarIntro(ev) {
  if (ev) ev.preventDefault();
  const intro = document.getElementById('introPrincipal');
  const calc  = document.getElementById('calculadora');
  if (calc) calc.style.display = 'none';
  if (intro) {
    intro.style.display = 'block';
    document.body.style.overflow = 'auto';
    document.body.style.display = 'block';
    window.scrollTo(0, 0);
  }
}
