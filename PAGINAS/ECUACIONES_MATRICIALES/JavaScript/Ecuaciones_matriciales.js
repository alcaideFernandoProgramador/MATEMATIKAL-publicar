/* =====================================================================
   ECUACIONES MATRICIALES — herramienta interactiva
   Usa Biblioteca Matematikal 2.0:
     · Validar.expresionMatricial              → validar cada lado
     · ExpresionMatricial.obtenerVariables      → nombres de matrices
     · ExpresionMatricial.calcular              → calcular L, R y B
     · ExpresionAlgebraica.pasarALatex          → convertir a LaTeX
     · Representar.expresionMatricialPasoaPaso  → resolución paso a paso
   ===================================================================== */

let gAnalysis    = null;
let gN           = 0;
let gEqStr       = '';
let gUnknownName = 'X';
let gScalarMap   = {};
let caja1, caja2, caja21, letreroUsuario;

// Sustituye escalares (letras minúsculas) por sus valores numéricos en una expresión.
// Inserta '*' cuando el valor sustituido queda yuxtapuesto a una letra (ej: aX → (2)X → (2)*X)
// para evitar que la biblioteca matricial entre en un bucle infinito con multiplicación implícita.
function substituteScalars(expr) {
  if (!expr || !Object.keys(gScalarMap).length) return expr;
  return expr.replace(/[A-Za-z]/g, ch =>
    Object.prototype.hasOwnProperty.call(gScalarMap, ch) ? '(' + gScalarMap[ch] + ')' : ch
  ).replace(/\)([A-Za-z])/g, ')*$1');
}

// =====================================================================
// PARSEO Y ANÁLISIS
// =====================================================================

// Separa un lado de la ecuación en términos con y sin la incógnita.
// Solo soporta el formato simple: letras mayúsculas yuxtapuestas (ej: AXB, AX, XB, X).
function parseSide(s, unknownName) {
  s = s.replace(/\s+/g, '');
  if (!s) return [];
  if (!/^[+\-]/.test(s)) s = '+' + s;

  // Caracteres permitidos: letras (mayúsculas = matrices, minúsculas = escalares), dígitos, operadores
  if (/[^+\-0-9A-Za-z^()*]/.test(s))
    throw 'La ecuación contiene caracteres no soportados. ' +
          'Se admiten matrices (letras mayúsculas), escalares (letras minúsculas, excepto t reservada para transpuesta), ' +
          'coeficientes enteros y notaciones como A^(-1) o A^t.';

  // Dividir en términos por + y - de nivel superior (fuera de paréntesis)
  const termStrs = [];
  let depth = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') depth--;
    else if ((s[i] === '+' || s[i] === '-') && depth === 0 && i > start) {
      termStrs.push(s.slice(start, i));
      start = i;
    }
  }
  termStrs.push(s.slice(start));

  return termStrs.map(tok => {
    const sign = tok[0] === '-' ? -1 : 1;
    let body = tok.slice(1);

    // Coeficiente numérico inicial opcional (ej: 3XA)
    const cm = body.match(/^(\d+)(.*)/);
    const coeff = cm ? parseInt(cm[1], 10) : 1;
    body = cm ? cm[2] : body;

    // Dividir el cuerpo en factores matriciales y localizar la incógnita
    const factors = splitMatrixFactors(body);
    const xi = factors.findIndex(f => f.name === unknownName);
    if (xi >= 0) {
      const xRaw = factors[xi].raw;
      const xExp = xRaw.slice(factors[xi].name.length); // '' | '^t' | '^(-1)' | …
      const left  = factors.slice(0, xi).map(f => f.raw).join('*');
      const right = factors.slice(xi + 1).map(f => f.raw).join('*');
      return { sign, coeff, left, right, xExp, hasX: true };
    }
    // Para términos sin incógnita, dividir también en factores para separar escalares de matrices
    const freeFactors = splitMatrixFactors(body);
    const str = freeFactors.length > 0 ? freeFactors.map(f => f.raw).join('*') : body;
    return { sign, coeff, str, hasX: false };
  });
}

// Divide una cadena de producto matricial en factores individuales.
// Cada factor es una letra con su exponente opcional, o una expresión entre paréntesis.
// Los paréntesis en posición de factor (no de exponente) se tratan como escalares compuestos.
function splitMatrixFactors(s) {
  const factors = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === '*') { i++; continue; }

    if (s[i] === '(') {
      // Expresión escalar entre paréntesis: (a-1), (2+b), etc. — factor atómico
      let raw = '(';
      let depth = 1;
      i++;
      while (i < s.length) {
        if (s[i] === '(') { depth++; raw += s[i++]; }
        else if (s[i] === ')') { raw += s[i++]; depth--; if (depth === 0) break; }
        else { raw += s[i++]; }
      }
      factors.push({ name: null, raw });        // name=null → escalar compuesto, no puede ser incógnita

    } else if (/[A-Za-z]/.test(s[i])) {
      const name = s[i];
      let raw = name;
      i++;
      if (i < s.length && s[i] === '^') {      // exponente presente
        raw += '^';
        i++;
        if (i < s.length && s[i] === '(') {    // exponente entre paréntesis: ^(-1), ^(2)…
          raw += '(';
          let d = 1;
          i++;
          while (i < s.length && d > 0) {
            raw += s[i];
            if (s[i] === '(') d++;
            else if (s[i] === ')') d--;
            i++;
          }
        } else if (i < s.length) {             // exponente de un carácter: ^t, ^2…
          raw += s[i++];
        }
      }
      factors.push({ name, raw });
    } else {
      i++;
    }
  }
  return factors;
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
function analyzeEquation(lhsStr, rhsStr, unknownName) {
  const lhs = parseSide(lhsStr, unknownName);
  const rhs = parseSide(rhsStr, unknownName);

  // Mover todos los términos con X al primer miembro y los libres al segundo
  const xTerms = [], freeTrms = [];
  for (const t of lhs) {
    if (t.hasX) xTerms.push({ sign:  t.sign, coeff: t.coeff || 1, left: t.left, right: t.right, xExp: t.xExp || '' });
    else        freeTrms.push({ sign: -t.sign, coeff: t.coeff || 1, str: t.str });
  }
  for (const t of rhs) {
    if (t.hasX) xTerms.push({ sign: -t.sign, coeff: t.coeff || 1, left: t.left, right: t.right, xExp: t.xExp || '' });
    else        freeTrms.push({ sign:  t.sign, coeff: t.coeff || 1, str: t.str });
  }

  if (xTerms.length === 0) throw `La ecuación no contiene la incógnita ${unknownName}.`;

  // Validar el exponente de la incógnita
  const xExpSet = [...new Set(xTerms.map(t => t.xExp))];
  if (xExpSet.length > 1)
    throw `Los términos con ${unknownName} tienen exponentes distintos; no es posible despejar.`;
  const xExp = xExpSet[0] || '';
  if (xExp && xExp !== '^t' && xExp !== '^(-1)')
    throw `El exponente "${xExp}" sobre la incógnita no está soportado.`;

  const allSameRight = xTerms.every(t => t.right === xTerms[0].right);
  const allSameLeft  = xTerms.every(t => t.left  === xTerms[0].left);
  if (!allSameRight && !allSameLeft)
    throw `Los términos con ${unknownName} no tienen ningún factor común por la izquierda ni por la derecha. No es posible despejar ${unknownName} con este método.`;

  const strategy = allSameRight ? 'A' : 'B';

  // Nombres de variables con la biblioteca (excluye la incógnita e I)
  const lhsVars = ExpresionMatricial.obtenerVariables(lhsStr);
  const rhsVars = ExpresionMatricial.obtenerVariables(rhsStr);
  const allVars = [...new Set([...lhsVars, ...rhsVars])]
    .filter(v => v !== unknownName && v !== 'I');
  // Mayúsculas = matrices; minúsculas = escalares numéricos
  const matrixNames = allVars.filter(v => /^[A-Z]$/.test(v)).sort();
  const scalarNames = allVars.filter(v => /^[a-z]$/.test(v)).sort();

  // Construir las expresiones de L, R y B como cadenas para la biblioteca
  const lExpr = buildLExpr(xTerms, strategy);
  const rExpr = buildRExpr(xTerms, strategy);
  const bExpr = buildBExpr(freeTrms);

  return { xTerms, strategy, matrixNames, scalarNames, lExpr, rExpr, bExpr, unknownName, xExp };
}

// Returns the matrix form of a left/right factor.
// If the raw factor is a pure scalar expression (no uppercase matrix names),
// it must be converted to scalar*I so the matrix library can operate on it.
function toMatrixFactor(raw) {
  if (!raw || raw === 'I') return 'I';
  const isScalarExpr = !/[A-Z]/.test(raw);
  return isScalarExpr ? `(${raw})*I` : raw;
}

function buildLExpr(xTerms, strategy) {
  if (strategy !== 'A') return toMatrixFactor(xTerms[0].left) || 'I';
  return xTerms.map((t, i) => {
    const l = toMatrixFactor(t.left) || 'I';
    const c = t.coeff || 1;
    const factor = c > 1 ? `${c}*${l}` : l;
    return (i === 0 ? (t.sign === -1 ? '-' : '') : (t.sign === -1 ? '-' : '+')) + factor;
  }).join('');
}

function buildRExpr(xTerms, strategy) {
  if (strategy !== 'B') return toMatrixFactor(xTerms[0].right) || 'I';
  return xTerms.map((t, i) => {
    const r = toMatrixFactor(t.right) || 'I';
    const c = t.coeff || 1;
    const factor = c > 1 ? `${c}*${r}` : r;
    return (i === 0 ? (t.sign === -1 ? '-' : '') : (t.sign === -1 ? '-' : '+')) + factor;
  }).join('');
}

function buildBExpr(freeTrms) {
  if (!freeTrms.length) return null;
  return freeTrms.map((t, i) => {
    const c = t.coeff || 1;
    const factor = c > 1 ? `${c}*${t.str || ''}` : (t.str || '');
    return (i === 0 ? (t.sign === -1 ? '-' : '') : (t.sign === -1 ? '-' : '+')) + factor;
  }).join('');
}

// =====================================================================
// CÁLCULO USANDO LA BIBLIOTECA
// =====================================================================

function toMatrList(matMap) {
  return Object.entries(matMap).map(([nombre, matriz]) => ({ nombre, matriz }));
}

// Evalúa una expresión matricial con la biblioteca o devuelve identidad si es 'I'.
// Sustituye primero los escalares (gScalarMap). Si el resultado es escalar lo trata como escalar·I.
function calcExpr(expr, matrList, n) {
  if (!expr || expr === 'I') return Matriz.identidad(n);
  const subExpr = substituteScalars(expr);
  // Pure numeric expression (no uppercase matrix names after substitution): evaluate as scalar·I
  if (!/[A-Z]/.test(subExpr)) {
    try {
      const val = ExpresionNumerica.calcular(subExpr);
      if (val !== null && val !== undefined && isFinite(Number(val)))
        return Matriz.multiplicarEscalar(String(val), Matriz.identidad(n));
    } catch(_) {}
  }
  const withI = [...matrList, { nombre: 'I', matriz: Matriz.identidad(n) }];
  const result = ExpresionMatricial.calcular(subExpr, withI);
  if (!result) throw `No se pudo calcular la expresión "${expr}".`;
  if (!Array.isArray(result)) return Matriz.multiplicarEscalar(String(result), Matriz.identidad(n));
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
  // Aplicar la operación inversa al exponente de la incógnita (^t → transponer, ^(-1) → invertir)
  const xExp = analysis.xExp || '';
  if (xExp === '^t')   X = Matriz.trasponer(X);
  if (xExp === '^(-1)') X = Matriz.inversa(X);

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

// Genera LaTeX correcto para la inversa de una expresión matricial.
// Evita el doble superíndice que produce exprToLatex(inverseExpr(expr))
// cuando la base ya contiene un exponente (p.ej. A^2 → (A^2)^(-1)).
function matrixInverseLatex(expr) {
  if (!expr || expr === 'I') return 'I';
  if (/^[A-Z]\^\(-1\)$/.test(expr)) return expr[0];          // (M^{-1})^{-1} = M
  if (/^[A-Z]$/.test(expr))         return expr + '^{-1}';   // matriz sola
  if (/^[a-z]\^\(-1\)$/.test(expr)) return expr[0];          // (a^{-1})^{-1} = a
  if (/^[a-z]$/.test(expr))         return expr + '^{-1}';   // escalar solo
  const base = matrixExprToLatex(expr);
  return `\\left(${base}\\right)^{-1}`;                      // caso general
}

function buildFactoredTex(analysis) {
  const { lExpr, rExpr, bExpr, xTerms, strategy, unknownName } = analysis;
  const isLId = lExpr === 'I';
  const isRId = rExpr === 'I';
  const needsLParen = xTerms.length > 1 && strategy === 'A' && /[+\-]/.test(lExpr);
  const needsRParen = xTerms.length > 1 && strategy === 'B' && /[+\-]/.test(rExpr);
  const lTex = isLId ? '' : (needsLParen ? `(${exprToLatex(lExpr)})` : exprToLatex(lExpr));
  const rTex = isRId ? '' : (needsRParen ? `(${exprToLatex(rExpr)})` : exprToLatex(rExpr));
  const bTex = bExpr ? exprToLatex(bExpr) : '\\mathbf{0}';
  return `${lTex}${unknownName}${rTex} = ${bTex}`;
}

function buildFormulaTex(analysis) {
  const { lExpr, rExpr, bExpr, xTerms, strategy, unknownName, xExp } = analysis;
  const isLId = lExpr === 'I';
  const isRId = rExpr === 'I';
  const needsLParen = xTerms.length > 1 && strategy === 'A' && /[+\-]/.test(lExpr);
  const needsRParen = xTerms.length > 1 && strategy === 'B' && /[+\-]/.test(rExpr);
  const lFull = needsLParen ? `(${lExpr})` : lExpr;
  const rFull = needsRParen ? `(${rExpr})` : rExpr;
  const bRaw  = bExpr ? exprToLatex(bExpr) : '\\mathbf{0}';
  const needsBParen = bExpr && /[+\-]/.test(bExpr.slice(1)) && (!isLId || !isRId);
  const bTex  = needsBParen ? `(${bRaw})` : bRaw;
  const parts = [];
  if (!isLId) parts.push(matrixInverseLatex(lExpr));
  parts.push(bTex);
  if (!isRId) parts.push(matrixInverseLatex(rExpr));
  const rhsTex = parts.join('\\cdot ');
  // Aplicar la operación inversa al exponente de la incógnita
  if (xExp === '^t') {
    const rhs = parts.length === 1 ? `${rhsTex}^{t}` : `\\left(${rhsTex}\\right)^{t}`;
    return `${unknownName} = ${rhs}`;
  }
  if (xExp === '^(-1)') {
    const rhs = parts.length === 1 ? `\\left(${rhsTex}\\right)^{-1}` : `\\left(${rhsTex}\\right)^{-1}`;
    return `${unknownName} = ${rhs}`;
  }
  return `${unknownName} = ` + rhsTex;
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

function matrixExprToLatex(expr) {
  if (!expr) return '';
  try { return ExpresionMatricial.pasarALatex(expr); }
  catch(e) { return exprToLatex(expr); }
}

function equationToLatex(eq) {
  const { lhsStr, rhsStr } = parseAndValidate(eq);
  return matrixExprToLatex(lhsStr) + '=' + matrixExprToLatex(rhsStr);
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

function matrixCellToTex(value) {
  const s = String(value).trim();
  const frac = s.match(/^([-+]?\d+)\/(\d+)$/);
  if (frac) return `\\frac{${frac[1]}}{${frac[2]}}`;
  return s || '0';
}

function matrixToTex(mat) {
  return `\\begin{pmatrix}${mat.map(row => row.map(matrixCellToTex).join('&')).join('\\\\')}\\end{pmatrix}`;
}

function zeroMatrix(n) {
  return Array.from({ length: n }, () => Array(n).fill('0'));
}

function basisMatrix(n, index) {
  const mat = zeroMatrix(n);
  mat[Math.floor(index / n)][index % n] = '1';
  return mat;
}

function sampleMatrix(n) {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => String(((i + 1) * (j + 2)) - (i === j ? 1 : 0)))
  );
}

function matrixToVector(mat) {
  return mat.flat().map(numericValue);
}

function numericValue(value) {
  const s = String(value ?? '0').trim();
  try {
    const calculated = ExpresionNumerica.calcular(s);
    const n = Number(calculated);
    if (Number.isFinite(n)) return n;
  } catch(e) {}
  const frac = s.match(/^([-+]?\d+(?:\.\d+)?)\/([-+]?\d+(?:\.\d+)?)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const n = Number(s);
  if (Number.isFinite(n)) return n;
  throw new Error(`No se pudo interpretar el valor numérico "${s}".`);
}

function subtractMatrices(A, B) {
  return A.map((row, i) => row.map((value, j) => {
    try { return ExpresionAlgebraica.simplificar(`(${value})-(${B[i][j]})`); }
    catch(e) { return String(numericValue(value) - numericValue(B[i][j])); }
  }));
}

function almostZero(x) {
  return Math.abs(x) < 1e-8;
}

function almostEqual(a, b) {
  return Math.abs(a - b) < 1e-7;
}

function rref(matrix) {
  const A = matrix.map(row => row.slice());
  const rows = A.length;
  const cols = rows ? A[0].length : 0;
  let r = 0;
  for (let c = 0; c < cols - 1 && r < rows; c++) {
    let pivot = r;
    for (let i = r + 1; i < rows; i++) {
      if (Math.abs(A[i][c]) > Math.abs(A[pivot][c])) pivot = i;
    }
    if (almostZero(A[pivot][c])) continue;
    [A[r], A[pivot]] = [A[pivot], A[r]];
    const div = A[r][c];
    for (let j = c; j < cols; j++) A[r][j] /= div;
    for (let i = 0; i < rows; i++) {
      if (i === r || almostZero(A[i][c])) continue;
      const factor = A[i][c];
      for (let j = c; j < cols; j++) A[i][j] -= factor * A[r][j];
    }
    r++;
  }
  return A
    .map(row => row.map(v => almostZero(v) ? 0 : Number(v.toFixed(10))))
    .sort((a, b) => {
      const sa = a.join(',');
      const sb = b.join(',');
      return sa < sb ? -1 : sa > sb ? 1 : 0;
    });
}

function sameRref(A, B) {
  if (A.length !== B.length) return false;
  for (let i = 0; i < A.length; i++) {
    if (A[i].length !== B[i].length) return false;
    for (let j = 0; j < A[i].length; j++) {
      if (!almostEqual(A[i][j], B[i][j])) return false;
    }
  }
  return true;
}

function normalizeEquationText(eq) {
  return eq.trim().replace(/\s+/g, '')
    .replace(/\^-\s*1/g, '^(-1)')
    .replace(/\^T(?![A-Za-z0-9])/g, '^t');  // ^T como transpuesta → ^t (minúscula)
}

function validateEquationVariables(lhsStr, rhsStr, analysis) {
  const allowed = new Set([...analysis.matrixNames, ...(analysis.scalarNames || []), analysis.unknownName, 'I']);
  const vars = [...new Set([
    ...ExpresionMatricial.obtenerVariables(lhsStr),
    ...ExpresionMatricial.obtenerVariables(rhsStr)
  ])];
  const invalid = vars.filter(v => !allowed.has(v));
  if (invalid.length) throw `La ecuación contiene matrices no definidas: ${invalid.join(', ')}.`;
}

function evalMatrixExpr(expr, matMap, n) {
  if (expr === 'I') return Matriz.identidad(n);
  const subExpr = substituteScalars(expr);
  const matrList = [...toMatrList(matMap), { nombre: 'I', matriz: Matriz.identidad(n) }];
  const result = ExpresionMatricial.calcular(subExpr, matrList);
  if (!Array.isArray(result) && String(result).trim() === '0') return zeroMatrix(n);
  if (!Array.isArray(result)) return Matriz.multiplicarEscalar(String(result), Matriz.identidad(n));
  return result;
}

function residualVector(lhsStr, rhsStr, matMap, n) {
  const lhs = evalMatrixExpr(lhsStr, matMap, n);
  const rhs = evalMatrixExpr(rhsStr, matMap, n);
  if (lhs.length !== rhs.length || lhs[0].length !== rhs[0].length)
    throw 'Los dos miembros de la ecuación no tienen el mismo tamaño.';
  return matrixToVector(subtractMatrices(lhs, rhs));
}

function buildEquationSystem(eq, analysis, baseMatMap, n) {
  const normalizedEq = normalizeEquationText(eq);
  const { lhsStr, rhsStr } = parseAndValidate(normalizedEq);
  validateEquationVariables(lhsStr, rhsStr, analysis);

  // Para la verificación numérica (RREF), sustituir escalares simbólicos y variables
  // algebraicas en elementos de matrices por valores de prueba fijos.
  // Fuera de esta función todo sigue siendo simbólico.
  const savedScalarMap = gScalarMap;
  const allAlgVars = new Set(analysis.scalarNames || []);
  // Recoger variables algebraicas de los elementos de las matrices
  for (const mat of Object.values(baseMatMap)) {
    if (!Array.isArray(mat)) continue;
    for (const row of mat) {
      for (const cell of row) {
        try {
          ExpresionMatricial.obtenerVariables(String(cell || ''))
            .filter(v => /^[a-z]$/.test(v))
            .forEach(v => allAlgVars.add(v));
        } catch(_) {}
      }
    }
  }
  if (allAlgVars.size) {
    const testMap = {};
    let idx = 0;
    for (const name of allAlgVars) { testMap[name] = String(3 + idx * Math.PI); idx++; }
    gScalarMap = testMap;
  }
  try {

  // Sustituir las variables algebraicas en los elementos de las matrices conocidas
  // para que numericValue pueda evaluar los residuos numéricamente.
  const numBaseMatMap = {};
  for (const [name, mat] of Object.entries(baseMatMap)) {
    numBaseMatMap[name] = Array.isArray(mat)
      ? mat.map(row => row.map(cell => substituteScalars(String(cell ?? '0'))))
      : mat;
  }

  const unknownName = analysis.unknownName;
  const zeroMap = { ...numBaseMatMap, [unknownName]: zeroMatrix(n) };
  const b = residualVector(lhsStr, rhsStr, zeroMap, n);
  const vars = n * n;
  const rows = b.length;
  const coeffs = Array.from({ length: rows }, () => Array(vars).fill(0));

  for (let k = 0; k < vars; k++) {
    const basisMap = { ...numBaseMatMap, [unknownName]: basisMatrix(n, k) };
    const v = residualVector(lhsStr, rhsStr, basisMap, n);
    for (let r = 0; r < rows; r++) coeffs[r][k] = v[r] - b[r];
  }

  const test = sampleMatrix(n);
  const testMap = { ...numBaseMatMap, [unknownName]: test };
  const actual = residualVector(lhsStr, rhsStr, testMap, n);
  const x = matrixToVector(test);
  for (let r = 0; r < rows; r++) {
    const predicted = coeffs[r].reduce((sum, c, i) => sum + c * x[i], b[r]);
    if (!almostEqual(predicted, actual[r]))
      throw 'La ecuación introducida no es lineal en la matriz incógnita.';
  }

  return {
    eq: normalizedEq,
    lhsStr,
    rhsStr,
    rref: rref(coeffs.map((row, i) => [...row, -b[i]]))
  };
  } finally {
    gScalarMap = savedScalarMap;
  }
}

function isEquivalentSystem(a, b) {
  return sameRref(a.rref, b.rref);
}

function isSolvedForUnknown(system, analysis) {
  const xExp = analysis.xExp || '';
  // Acepta "X = RHS" y, cuando hay exponente, también "X^t = RHS" o "X^(-1) = RHS"
  const validLhs = [analysis.unknownName, analysis.unknownName + xExp].filter(Boolean);
  if (!validLhs.includes(system.lhsStr)) return false;
  return !ExpresionMatricial.obtenerVariables(system.rhsStr).includes(analysis.unknownName);
}

function renderResolvedInputSummary(analysis, matMap) {
  clearEl(caja1);
  const summary = document.createElement('div');
  summary.className = 'resolvedSummary';
  const parts = [
    `\\text{Ecuación: } ${exprToLatex(analysis.lhsStr)}=${exprToLatex(analysis.rhsStr)}`
  ];
  for (const name of analysis.matrixNames.filter(m => m !== 'I')) {
    parts.push(`${name}=${matrixToTex(matMap[name])}`);
  }
  renderKatex(parts.join('\\qquad '), summary, false);
  caja1.appendChild(summary);
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
  return card;
}

// =====================================================================
// PASOS 2, 3 Y SOLUCIÓN
// =====================================================================

// Muestra una fila del tipo: labelTex = [operandMatrix][opSymbol] = [input grid]
// Estilo "operaciones simples" de Operaciones con matrices.
// Devuelve una Promise que se resuelve cuando el usuario rellena todas las celdas.
function injectTableOverrideCSS() {
  if (document.getElementById('emps3-css-override')) return;
  const st = document.createElement('style');
  st.id = 'emps3-css-override';
  st.textContent = [
    '.twrap{overflow-x:hidden!important}',
    '.tpasos col.pasoCol{width:8%!important;min-width:0!important;max-width:none!important}',
    '.tpasos col.calcCol{width:42%!important}',
    '.tpasos>tbody>tr>th,.tpasos>tbody>tr>td{text-align:left!important}',
    '.tpasos>tbody>tr>td.calcCell .panelCalc{justify-content:flex-start!important}',
    '.tpasos>tbody>tr>td.exprCell{width:auto!important;min-width:0!important;max-width:none!important}'
  ].join('');
  document.head.appendChild(st);
}

function renderComputationRow(container, labelTex, operandMatrix, opSymbol, resultMatrix) {
  return new Promise(resolve => {
    const n = resultMatrix.length;

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:8px 0;';

    // Label: ej. "A^{-1} ="
    const lbl = document.createElement('div');
    lbl.style.fontSize = '13px';
    try { katex.render(labelTex + ' =', lbl, {throwOnError: false}); }
    catch(_) { lbl.textContent = labelTex + ' ='; }
    row.appendChild(lbl);

    // Matriz operando (opcional) + símbolo (ej. ^{-1}) en bloque flex-start
    if (operandMatrix) {
      const bloque = document.createElement('div');
      bloque.style.cssText = 'display:inline-flex;align-items:flex-start;';
      const mDiv = document.createElement('div');
      Representar.matriz(operandMatrix, mDiv);
      bloque.appendChild(mDiv);
      if (opSymbol) {
        const sym = document.createElement('div');
        sym.style.fontSize = '17px';
        try { katex.render(opSymbol, sym, {throwOnError: false}); }
        catch(_) { sym.textContent = opSymbol; }
        bloque.appendChild(sym);
      }
      row.appendChild(bloque);
      const eq2 = document.createElement('span');
      eq2.style.cssText = 'font-size:16px;margin:0 2px;';
      eq2.textContent = '=';
      row.appendChild(eq2);
    }

    // Tabla de inputs entre paréntesis
    const parenWrap = document.createElement('div');
    parenWrap.style.cssText = 'display:flex;align-items:center;gap:2px;';
    const tbl = document.createElement('table');
    tbl.style.cssText = 'border-collapse:collapse;margin:0;';
    try { Representar.abrirParentesis(n + 1, parenWrap); } catch(_) {}
    parenWrap.appendChild(tbl);
    try { Representar.cerrarParentesis(n + 1, parenWrap); } catch(_) {}
    row.appendChild(parenWrap);

    const errMsg = document.createElement('span');
    errMsg.className = 'msgError';
    errMsg.style.cssText = 'display:none;margin-left:6px;';
    errMsg.textContent = '❌ ERROR';
    row.appendChild(errMsg);
    container.appendChild(row);

    const inputs = [];
    let k = 0;

    for (let i = 0; i < n; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < n; j++) {
        const td = document.createElement('td');
        td.style.cssText = 'border:1px solid #999;padding:1px 2px;';
        const inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'inputCorto';
        inp.dataset.i = i; inp.dataset.j = j;
        inp.addEventListener('keydown', e => {
          if (e.key !== 'Enter' && e.key !== 'Tab') return;
          e.preventDefault();
          errMsg.style.display = 'none';
          const val = inp.value.trim();
          const expected = resultMatrix[i][j];
          let ok = false;
          try { ok = val !== '' && ExpresionAlgebraica.simplificar(`(${val})-(${expected})`) === '0'; }
          catch(_) {}
          if (!ok) {
            inp.style.border = '2px solid red';
            errMsg.style.display = 'inline';
            inp.focus();
          } else {
            inp.style.border = '';
            inp.readOnly = true;
            k++;
            if (k < inputs.length) inputs[k].focus();
            else allDone();
          }
        });
        td.appendChild(inp); tr.appendChild(td); inputs.push(inp);
      }
      tbl.appendChild(tr);
    }

    const btnAuto = document.createElement('button');
    btnAuto.type = 'button';
    btnAuto.innerHTML = 'RESOLVER AUTOMÁTICAMENTE<br><small>(no se recomienda)</small>';
    btnAuto.style.marginTop = '6px';
    container.appendChild(btnAuto);

    function allDone() {
      parenWrap.remove(); errMsg.remove(); btnAuto.remove();
      const resDiv = document.createElement('div');
      Representar.matriz(resultMatrix, resDiv);
      row.appendChild(resDiv);
      caja21.scrollTop = caja21.scrollHeight;
      resolve();
    }

    btnAuto.addEventListener('click', () => {
      inputs.forEach(inp => {
        if (inp.readOnly) return;
        inp.value = String(resultMatrix[+inp.dataset.i][+inp.dataset.j]);
        inp.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
      });
    });

    setTimeout(() => { if (inputs[0]) inputs[0].focus(); }, 0);
  });
}

// =====================================================================
// PASOS 2 Y 3 — TÉCNICA: FÓRMULA DE LA ADJUNTA + CÁLCULO PASO A PASO
// =====================================================================

function renderKatexBlock(container, tex) {
  const div = document.createElement('div');
  div.style.cssText = 'overflow-x:auto;margin:10px 0;padding:14px 18px;' +
    'background:linear-gradient(135deg,#e8eeff 0%,#f0f4ff 100%);' +
    'border:1px solid rgba(59,110,248,.14);border-radius:14px;';
  renderKatex(tex, div, true);
  container.appendChild(div);
}

// Muestra: exprSimbólica = [matrices sustituidas] = resultado
function renderCompositeComputation(container, expr, matMap, result) {
  const exprTex = exprToLatex(expr);
  const resultTex = matrixToTex(result);
  let subsTex = '';
  for (const ch of expr) {
    if (/[A-Z]/.test(ch) && matMap[ch]) subsTex += matrixToTex(matMap[ch]);
    else if (/[A-Z]/.test(ch))           subsTex += ch;
    else if (ch === '*')                  subsTex += '';
    else                                  subsTex += ch;
  }
  renderKatexBlock(container, `${exprTex}=${subsTex}=${resultTex}`);
}

// Muestra: M^{-1} = (1/|M|)[Adj(M)]^t = (1/det)(cofactores)^t = resultado
function renderInverseAdjoint(container, expr, mat) {
  try {
    const labelTex  = matrixInverseLatex(expr);
    const baseTex   = exprToLatex(expr);
    const det       = Matriz.determinante(mat);
    const detTex    = ExpresionAlgebraica.pasarALatex(det);
    const cofactors = Matriz.adjunta(mat);
    const cofTex    = matrixToTex(cofactors);
    const result    = Matriz.inversa(mat);
    const resTex    = matrixToTex(result);
    renderKatexBlock(container,
      `${labelTex}=\\dfrac{1}{\\left|${baseTex}\\right|}\\left[\\operatorname{Adj}(${baseTex})\\right]^t` +
      `=\\dfrac{1}{${detTex}}${cofTex}^t=${resTex}`
    );
  } catch(_) {}
}

async function renderStep2(container, analysis, matMap, sol, onComplete) {
  const { lExpr, rExpr, bExpr } = analysis;
  const isLId = !lExpr || lExpr === 'I';
  const isRId = !rExpr || rExpr === 'I';
  const hasNonTrivialB = bExpr && (bExpr.match(/[A-Z]/g) || []).length > 1;

  if (!bExpr || (!hasNonTrivialB && isLId && isRId)) { onComplete(); return; }

  const matrList = toMatrList(matMap);

  const desc = document.createElement('p');
  desc.style.cssText = 'font-size:13px;color:#4a5270;margin:0 0 10px;';
  desc.textContent = 'Se calculan las matrices que se necesiten, es decir, las que aparecen en el segundo miembro de la ecuación despejada.';
  container.appendChild(desc);

  try {
    if (hasNonTrivialB) {
      renderCompositeComputation(container, bExpr, matMap, sol.B);
    }
    if (!isLId) {
      renderInverseAdjoint(container, lExpr, calcExpr(lExpr, matrList, gN));
    }
    if (!isRId) {
      renderInverseAdjoint(container, rExpr, calcExpr(rExpr, matrList, gN));
    }
  } catch(e) {
    const p = document.createElement('p');
    p.className = 'msgError';
    p.textContent = '⚠ ' + (typeof e === 'string' ? e : e.message);
    container.appendChild(p);
  }

  onComplete();
}

async function renderStep3(container, analysis, matMap, sol, onComplete) {
  if (!analysis.bExpr) { onComplete(); return; }

  const desc = document.createElement('p');
  desc.style.cssText = 'font-size:13px;color:#4a5270;margin:0 0 10px;';
  desc.textContent = 'Se sustituyen en la expresión despejada y se calcula paso a paso.';
  container.appendChild(desc);

  try {
    const xExp  = analysis.xExp || '';
    const parts = [];
    if (sol.Linv) parts.push(sol.Linv);
    parts.push(sol.B);
    if (sol.Rinv) parts.push(sol.Rinv);

    let tex = buildFormulaTex(analysis);

    if (xExp) {
      const xExpLatex = xExp === '^t' ? '^t' : '^{-1}';
      const innerParts = parts.map(matrixToTex).join('');
      // Wrap matrices in parentheses before applying xExp
      tex += parts.length === 1
        ? '=' + innerParts + xExpLatex
        : '=\\left(' + innerParts + '\\right)' + xExpLatex;
      if (parts.length === 3) {
        const partial = Matriz.multiplicar(parts[0], parts[1]);
        tex += '=\\left(' + matrixToTex(partial) + matrixToTex(sol.Rinv) + '\\right)' + xExpLatex;
      }
      if (parts.length > 1) {
        let inner = parts[0];
        for (let k = 1; k < parts.length; k++) inner = Matriz.multiplicar(inner, parts[k]);
        tex += '=' + matrixToTex(inner) + xExpLatex;
      }
      tex += '=' + matrixToTex(sol.X);
    } else {
      tex += '=' + parts.map(matrixToTex).join('');
      if (parts.length === 3) {
        const partial = Matriz.multiplicar(parts[0], parts[1]);
        tex += '=' + matrixToTex(partial) + matrixToTex(sol.Rinv);
      }
      if (parts.length >= 2) {
        tex += '=' + matrixToTex(sol.X);
      }
    }

    renderKatexBlock(container, tex);
  } catch(e) {
    const p = document.createElement('p');
    p.className = 'msgError';
    p.textContent = '⚠ ' + (typeof e === 'string' ? e : e.message);
    container.appendChild(p);
  }

  onComplete();
}

function renderSolutionCard(container, sol, unknownName) {
  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:12px;';
  const lbl = document.createElement('span');
  lbl.style.fontWeight = '700';
  renderKatex(unknownName + ' =', lbl, false);
  row.appendChild(lbl);
  const mDiv = document.createElement('div');
  Representar.matriz(sol.X, mDiv);
  row.appendChild(mDiv);
  container.appendChild(row);
}

function displaySolution(analysis, matMap, n, sol, lhsStr, rhsStr) {
  clearEl(caja21);

  let step2Card, step3Card, solutionCard;

  addStep(caja21, 'Paso 1: Despejar la matriz incógnita', false, div => {
    renderDespejeStep(div, analysis, matMap, n, () => {
      step2Card.classList.remove('lockedStep');
      caja21.scrollTop = caja21.scrollHeight;
      renderStep2(step2Card, analysis, matMap, sol, () => {
        step3Card.classList.remove('lockedStep');
        caja21.scrollTop = caja21.scrollHeight;
        renderStep3(step3Card, analysis, matMap, sol, () => {
          solutionCard.classList.remove('lockedStep');
          caja21.scrollTop = caja21.scrollHeight;
          renderSolutionCard(solutionCard, sol, analysis.unknownName);
        });
      });
    });
  });
  step2Card = addStep(caja21, 'Paso 2: Calcular las matrices necesarias', false, () => {});
  step3Card = addStep(caja21, 'Paso 3: Sustituir las matrices y realizar los cálculos paso a paso', false, () => {});
  solutionCard = addStep(caja21, 'Solución', true, () => {});
  step2Card.classList.add('lockedStep');
  step3Card.classList.add('lockedStep');
  solutionCard.classList.add('lockedStep');
}

function renderDespejeStep(container, analysis, matMap, n, onComplete) {
  const baseEq = `${analysis.lhsStr}=${analysis.rhsStr}`;
  const originalSystem = buildEquationSystem(baseEq, analysis, matMap, n);
  const chain = document.createElement('div');
  chain.className = 'equationChain';
  const autoWrap = document.createElement('div');
  autoWrap.className = 'autoSolveWrap';
  const autoBtn = document.createElement('button');
  autoBtn.type = 'button';
  autoBtn.className = 'autoSolveBtn';
  autoBtn.innerHTML = '<span>Resolución automática</span><small>(no recomendado)</small>';
  autoWrap.appendChild(autoBtn);
  const err = document.createElement('p');
  err.className = 'msgError stepError';
  err.style.display = 'none';
  const ok = document.createElement('p');
  ok.className = 'msgOk stepOk';
  ok.style.display = 'none';
  const state = { currentSystem: originalSystem, seen: new Set([originalSystem.eq]), completed: false };

  appendEquationToken(chain, originalSystem.eq);
  appendArrow(chain);
  const wrappedComplete = () => { autoWrap.remove(); if (typeof onComplete === 'function') onComplete(); };
  appendEquationInput(chain, analysis, matMap, n, originalSystem, state, err, ok, wrappedComplete);
  autoBtn.addEventListener('click', () => {
    if (state.completed) return;
    try {
      applyAutomaticDespeje(chain, analysis, matMap, n, originalSystem, state, err, ok, wrappedComplete);
      autoBtn.disabled = true;
    } catch(e) {
      err.textContent = '⚠ ' + (typeof e === 'string' ? e : e.message);
      err.style.display = 'block';
    }
  });
  container.appendChild(chain);
  container.appendChild(autoWrap);
  container.appendChild(err);
  container.appendChild(ok);
}

function appendArrow(container) {
  const arrow = document.createElement('span');
  arrow.className = 'equationArrow';
  renderKatex('\\Longrightarrow', arrow, false);
  container.appendChild(arrow);
}

function appendEquationToken(container, eq) {
  const token = document.createElement('span');
  token.className = 'equationToken';
  renderKatex(equationToLatex(eq), token, false);
  container.appendChild(token);
}

function appendEquationInput(container, analysis, matMap, n, originalSystem, state, err, ok, onComplete) {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'inputEcuacion stepEquationInput';
  inp.placeholder = '';
  inp.autocomplete = 'off';
  inp.spellcheck = false;
  container.appendChild(inp);

  function showStepError(msg) {
    err.textContent = '⚠ ' + msg;
    err.style.display = 'block';
    ok.style.display = 'none';
    inp.focus();
    inp.select();
  }

  function acceptEquation(system) {
    err.style.display = 'none';
    const value = system.eq;
    inp.remove();
    appendEquationToken(container, value);
    state.currentSystem = system;
    state.seen.add(value);

    if (isSolvedForUnknown(system, analysis)) {
      state.completed = true;
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    appendArrow(container);
    appendEquationInput(container, analysis, matMap, n, originalSystem, state, err, ok, onComplete);
  }

  inp.addEventListener('input', () => {
    inp.value = inp.value.replace(/\^T(?![A-Za-z0-9])/g, '^t');
  });
  inp.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter' && ev.key !== 'Tab') return;
    ev.preventDefault();
    if (state.completed) return;
    const raw = inp.value.trim();
    if (!raw) { showStepError('Escribe una ecuación equivalente.'); return; }
    try {
      const system = buildEquationSystem(raw, analysis, matMap, n);
      if (state.seen.has(system.eq)) {
        showStepError('Esa ecuación ya está escrita. Prueba con el siguiente despeje.');
        return;
      }
      if (!isEquivalentSystem(originalSystem, system)) {
        showStepError('La ecuación no es equivalente a la anterior. Revisa la operación realizada.');
        return;
      }
      acceptEquation(system);
    } catch(e) {
      showStepError(typeof e === 'string' ? e : e.message);
    }
  });
  setTimeout(() => { try { inp.focus(); } catch(e) {} }, 0);
}

function getCurrentEquationInput(container) {
  return container.querySelector('.stepEquationInput');
}

function acceptAutoEquation(container, eq, system, analysis, state) {
  appendEquationToken(container, eq);
  state.currentSystem = system;
  state.seen.add(system.eq);
}

function applyAutomaticDespeje(chain, analysis, matMap, n, originalSystem, state, err, ok, onComplete) {
  err.style.display = 'none';
  const currentInput = getCurrentEquationInput(chain);
  if (currentInput) currentInput.remove();
  const equations = buildAutomaticDespejeEquations(analysis);
  if (!equations.length) throw 'No se pudo construir una resolución automática para esta ecuación.';

  let added = 0;
  for (let i = 0; i < equations.length; i++) {
    const eq = equations[i];
    const system = buildEquationSystem(eq, analysis, matMap, n);
    if (!isEquivalentSystem(originalSystem, system))
      throw `La resolución automática produjo un paso no equivalente: ${eq}`;
    if (state.seen.has(system.eq)) continue;
    if (added > 0) appendArrow(chain);
    acceptAutoEquation(chain, system.eq, system, analysis, state);
    added++;
  }

  const last = buildEquationSystem(equations[equations.length - 1], analysis, matMap, n);
  if (!isSolvedForUnknown(last, analysis))
    throw 'La resolución automática no llegó a despejar completamente la incógnita.';
  const danglingInput = getCurrentEquationInput(chain);
  if (danglingInput) danglingInput.remove();
  state.completed = true;
  if (typeof onComplete === 'function') onComplete();
}

function buildAutomaticDespejeEquations(analysis) {
  const { unknownName, lExpr, rExpr, bExpr, xTerms, xExp } = analysis;
  const isLId = !lExpr || lExpr === 'I';
  const isRId = !rExpr || rExpr === 'I';
  const lFull = formatFactorForEquation(lExpr); // '' si identidad
  const rFull = formatFactorForEquation(rExpr); // '' si identidad
  const bStr  = !bExpr ? '0' : bExpr === 'I' ? 'I' : formatFactorForEquation(bExpr);
  const lInv  = isLId ? null : inverseExpr(lExpr);
  const rInv  = isRId ? null : inverseExpr(rExpr);

  // Token de la incógnita en las ecuaciones: "X" o "X^t" / "X^(-1)"
  const xTok = unknownName + (xExp || '');

  const equations = [];

  // Forma factorada (si difiere de la ecuación original)
  const factored = `${lFull}${xTok}${rFull}=${bStr}`;
  if (xTerms.length > 1 || `${analysis.lhsStr}=${analysis.rhsStr}` !== factored) {
    equations.push(factored);
  }

  // Pasos intermedios: multiplicación por inversas + pasos identidad
  if (!isLId && !isRId) {
    equations.push(`${lInv}*${lFull}*${xTok}*${rFull}=${lInv}*${bStr}`);
    equations.push(`I*${xTok}*${rFull}=${lInv}*${bStr}`);          // L⁻¹·L = I
    equations.push(`${xTok}*${rFull}=${lInv}*${bStr}`);            // I·Xtok = Xtok
    equations.push(`${xTok}*${rFull}*${rInv}=${lInv}*${bStr}*${rInv}`);
    equations.push(`${xTok}*I=${lInv}*${bStr}*${rInv}`);           // R·R⁻¹ = I
  } else if (!isLId) {
    equations.push(`${lInv}*${lFull}*${xTok}=${lInv}*${bStr}`);
    equations.push(`I*${xTok}=${lInv}*${bStr}`);                   // L⁻¹·L = I
  } else if (!isRId) {
    equations.push(`${xTok}*${rFull}*${rInv}=${bStr}*${rInv}`);
    equations.push(`${xTok}*I=${bStr}*${rInv}`);                   // R·R⁻¹ = I
  }

  // Forma final despejada (Xtok = RHS)
  const rhsParts = [];
  if (!isLId) rhsParts.push(lInv);
  rhsParts.push(bStr);
  if (!isRId) rhsParts.push(rInv);
  equations.push(`${xTok}=${rhsParts.join('*')}`);

  return equations;
}

function formatFactorForEquation(expr) {
  if (!expr || expr === 'I') return '';
  // Envolver en paréntesis si empieza con '-' o si contiene +, -, * internamente
  return expr[0] === '-' || /[+\-\*\^]/.test(expr.slice(1)) ? `(${expr})` : expr;
}

function inverseExpr(expr) {
  // Simplificar doble inversa: M^(-1) → M (para una sola letra, mayúscula o minúscula)
  if (/^[A-Z]\^\(-1\)$/.test(expr)) return expr[0];
  if (/^[a-z]\^\(-1\)$/.test(expr)) return expr[0];
  return `${formatFactorForEquation(expr)}^(-1)`;
}

// =====================================================================
// INTERFAZ — FASE 1: introducir ecuación
// =====================================================================

function initFase1() {
  clearEl(caja1);
  clearEl(caja21);
  gAnalysis = null; gN = 0; gEqStr = ''; gUnknownName = 'X'; gScalarMap = {};

  const titleDiv = document.createElement('div');
  titleDiv.id = 'tituloCaja1';
  titleDiv.innerHTML = '<span>INTRODUCCIÓN DE DATOS</span>';
  caja1.appendChild(titleDiv);

  const fase = document.createElement('div');
  fase.className = 'fase';
  fase.style.cssText = 'display:flex;align-items:center;gap:42px;flex-wrap:wrap;';
  fase.innerHTML = '<span><strong>Fase 1/2:</strong> Introduce la ecuación matricial.</span>' +
    '<span>Matrices en <strong>MAYÚSCULAS</strong>, escalares algebraicos en <strong>minúsculas</strong> (excepto <em>t</em>). Incógnita por defecto: <strong>X</strong>.</span>' +
    '<span>Ejemplos: <code>AX+BX=C</code> &nbsp; <code>aAXB=C</code> &nbsp; <code>XA-XB=D</code></span>';
  caja1.appendChild(fase);

  const row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:12px;flex-wrap:wrap;';
  const unknownLabel = document.createElement('label');
  unknownLabel.textContent = 'Incógnita:';
  unknownLabel.style.cssText = 'font-size:13px;font-weight:700;color:#374151;';
  const unknownInp = document.createElement('input');
  unknownInp.type = 'text';
  unknownInp.className = 'inputPequeno';
  unknownInp.value = 'X';
  unknownInp.maxLength = 1;
  unknownInp.autocomplete = 'off';
  unknownInp.spellcheck = false;
  unknownInp.addEventListener('input', () => { unknownInp.value = unknownInp.value.toUpperCase(); });
  const inp = document.createElement('input');
  inp.type = 'text'; inp.className = 'inputEcuacion';
  inp.placeholder = 'Ej: AX + BX = C'; inp.autocomplete = 'off'; inp.spellcheck = false;
  row.appendChild(unknownLabel); row.appendChild(unknownInp); row.appendChild(inp);
  caja1.appendChild(row);

  const errDiv = document.createElement('div');
  errDiv.id = 'errFase1';
  caja1.appendChild(errDiv);

  function doAnalyze() {
    clearEl(errDiv);
    const eq = inp.value.trim().replace(/\^T(?![A-Za-z0-9])/g, '^t');
    const unknownName = (unknownInp.value.trim().toUpperCase() || 'X');
    if (!/^[A-Z]$/.test(unknownName)) { showError('La incógnita debe ser una sola letra mayúscula.', errDiv); return; }
    if (unknownName === 'I') { showError('La letra I está reservada para la matriz identidad.', errDiv); return; }
    if (!eq) { showError('Introduce una ecuación.', errDiv); return; }
    try {
      const { lhsStr, rhsStr } = parseAndValidate(eq);
      gUnknownName = unknownName;
      gAnalysis = analyzeEquation(lhsStr, rhsStr, gUnknownName);
      gAnalysis.lhsStr = lhsStr;
      gAnalysis.rhsStr = rhsStr;
      gEqStr = eq;
      initFase2(gAnalysis);
    } catch(e) {
      showError(typeof e === 'string' ? e : e.message, errDiv);
    }
  }

  inp.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); doAnalyze(); }
  });
  unknownInp.addEventListener('keydown', ev => {
    if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); inp.focus(); }
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
  fase.style.cssText = 'display:flex;align-items:center;gap:42px;flex-wrap:wrap;';
  const scalarInfo = analysis.scalarNames && analysis.scalarNames.length
    ? ` &nbsp;·&nbsp; Escalares algebraicos (sin valor): <strong>${analysis.scalarNames.join(', ')}</strong>` : '';
  fase.innerHTML = `<span><strong>Fase 2/2:</strong> Ecuación: <code>${gEqStr}</code></span>` +
    `<span>Incógnita: <strong>${analysis.unknownName}</strong></span>` +
    `<span>Matrices a introducir: <strong>${analysis.matrixNames.filter(m => m !== 'I').join(', ') || '(ninguna)'}</strong>${scalarInfo}</span>`;
  caja1.appendChild(fase);

  const orderRow = document.createElement('div');
  orderRow.style.cssText = 'display:flex;align-items:center;gap:10px;margin:12px 0;';
  const orderLabel = document.createElement('label');
  orderLabel.textContent = 'Todas las matrices deben ser cuadradas del mismo orden. Indica este orden n =';
  orderLabel.style.cssText = 'font-size:13px;font-weight:600;color:#374151;';
  const orderInp = document.createElement('input');
  orderInp.type = 'text'; orderInp.className = 'inputPequeno'; orderInp.placeholder = '';
  orderRow.appendChild(orderLabel); orderRow.appendChild(orderInp);
  caja1.appendChild(orderRow);
  setTimeout(() => { try { orderInp.focus(); } catch(e) {} }, 0);

  const matSection = document.createElement('div');
  matSection.id = 'matSection';
  caja1.appendChild(matSection);

  const errDiv = document.createElement('div');
  errDiv.id = 'errFase2';
  caja1.appendChild(errDiv);

  let matInputCells = {};
  let nConfirmed = false;

  function doResolve() {
    clearEl(errDiv);
    if (!nConfirmed || gN < 1) {
      showError('Confirma primero el orden (pulsa ENTER en el campo).', errDiv); return;
    }
    gScalarMap = {};
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
            row.push(v);
          }
          mat.push(row);
        }
        matMap[name] = mat;
      }
      const sol = computeSolution(analysis, matMap, gN);
      renderResolvedInputSummary(analysis, matMap);
      displaySolution(analysis, matMap, gN, sol, analysis.lhsStr, analysis.rhsStr);
    } catch(e) {
      showError(typeof e === 'string' ? e : e.message, errDiv);
    }
  }

  function buildMatrixInputs(n) {
    clearEl(matSection);
    matInputCells = {};
    const matricesToInput = analysis.matrixNames.filter(name => name !== 'I');

    if (matricesToInput.length === 0) { doResolve(); return; }

    for (const name of matricesToInput) {
      const wrap = document.createElement('div');
      wrap.className = 'matrizInputWrap';
      const lbl = document.createElement('span');
      lbl.className = 'matNombreLabel'; lbl.textContent = name + ' =';
      wrap.appendChild(lbl);
      const matrixLine = document.createElement('div');
      matrixLine.className = 'matrixInputLine';
      const leftParen = document.createElement('span');
      leftParen.className = 'matrixParen';
      leftParen.textContent = '(';
      const rightParen = document.createElement('span');
      rightParen.className = 'matrixParen';
      rightParen.textContent = ')';
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
            if (ev.key === 'Enter' || ev.key === 'Tab') {
              ev.preventDefault();
              const all = [...matSection.querySelectorAll('input')];
              const idx = all.indexOf(ev.target);
              if (idx >= 0 && idx < all.length - 1) all[idx + 1].focus();
              else doResolve();
            }
          });
          td.appendChild(inp); tr.appendChild(td); row.push(inp);
        }
        tbl.appendChild(tr); cells.push(row);
      }
      matInputCells[name] = cells;
      matrixLine.appendChild(leftParen);
      matrixLine.appendChild(tbl);
      matrixLine.appendChild(rightParen);
      wrap.appendChild(matrixLine);
      matSection.appendChild(wrap);
    }
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

}

// =====================================================================
// ARRANQUE
// =====================================================================

document.addEventListener('DOMContentLoaded', function() {
  caja1          = document.getElementById('caja1');
  if (!caja1) return;   // entorno sin calculadora (p.ej. página de tests)
  caja2          = document.getElementById('caja2');
  caja21         = document.getElementById('caja21');
  letreroUsuario = document.getElementById('letreroUsuario');

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

  // Mantener caja21 siempre en la parte más baja al añadir contenido
  new MutationObserver(() => {
    requestAnimationFrame(() => { caja21.scrollTop = caja21.scrollHeight; });
  }).observe(caja21, { childList: true, subtree: true });

  initFase1();
});
