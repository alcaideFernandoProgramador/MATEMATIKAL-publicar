(function(){
  'use strict';

  const AUTO_NAMES = ['a','b','c','d','f','g','h','k','l','m','p','q','r','s','u','v'];
  const KINDS = {
    general: {
      title: 'X general',
      hint: 'La herramienta escribe todas las entradas de X como incógnitas.'
    },
    particular: {
      title: 'X de una forma dada',
      hint: 'Rellena X con números y parámetros antes de imponer la ecuación.'
    }
  };

  let gKind = null;
  let gProblem = null;
  let gUnknownName = 'X';
  let caja1 = null;
  let caja21 = null;

  function $(id){ return document.getElementById(id); }
  function clearEl(el){ while(el && el.firstChild) el.removeChild(el.firstChild); }
  function cloneMatrix(M){ return M.map(row => row.slice()); }
  function zeroMatrix(rows, cols){ return Array.from({length: rows}, () => Array(cols).fill('0')); }
  function simplify(expr){
    try { return normalizeZero(ExpresionAlgebraica.simplificar(String(expr))); }
    catch(e){ return normalizeZero(String(expr)); }
  }
  function normalizeZero(s){ s = String(s ?? '0').trim(); return (s === '-0' || s === '+0') ? '0' : s; }

  function showError(msg, where){
    const p = document.createElement('p');
    p.className = 'msgError';
    p.textContent = 'Atención: ' + msg;
    where.appendChild(p);
  }

  function renderKatex(tex, el, display){
    try { katex.render(tex, el, { throwOnError:false, displayMode:!!display }); }
    catch(e){ el.textContent = tex; }
  }

  function isValidationKey(ev){ return ev.key === 'Enter' || ev.key === 'Tab'; }

  function focusFirstInput(container){
    const input = container ? container.querySelector('input') : null;
    if(input) input.focus();
    return !!input;
  }

  function wireSequentialInputs(container, onLast){
    const inputs = [...(container ? container.querySelectorAll('input') : [])];
    inputs.forEach((inp, idx) => {
      inp.addEventListener('keydown', ev => {
        if(!isValidationKey(ev)) return;
        ev.preventDefault();
        if(idx < inputs.length - 1) inputs[idx + 1].focus();
        else if(typeof onLast === 'function') onLast();
      });
    });
  }

  // Wire only grid cell inputs (inputCorto) for sequential nav — skips dimension pickers
  function wireGridInputs(container, onLast){
    const inputs = [...(container ? container.querySelectorAll('input.inputCorto') : [])];
    inputs.forEach((inp, idx) => {
      inp.addEventListener('keydown', ev => {
        if(!isValidationKey(ev)) return;
        ev.preventDefault();
        if(idx < inputs.length - 1) inputs[idx + 1].focus();
        else if(typeof onLast === 'function') onLast();
      });
    });
  }

  function gcdAbs(a,b){
    a = a < 0n ? -a : a; b = b < 0n ? -b : b;
    while(b !== 0n){ const t = a % b; a = b; b = t; }
    return a || 1n;
  }

  function pow10(n){ let r = 1n; for(let i = 0; i < n; i++) r *= 10n; return r; }

  class Fraction {
    constructor(n,d){
      n = BigInt(n); d = BigInt(d);
      if(d === 0n) throw new Error('División por cero.');
      if(d < 0n){ n = -n; d = -d; }
      const g = gcdAbs(n,d);
      this.n = n / g; this.d = d / g;
    }
    static zero(){ return new Fraction(0,1); }
    static one(){ return new Fraction(1,1); }
    static from(value){
      if(value instanceof Fraction) return value;
      let s = String(value ?? '0').trim().replace(/\s+/g,'').replace(/,/g,'.');
      if(!s) return Fraction.zero();
      s = stripOuterParens(s);
      try { s = simplify(s); } catch(e) {}
      s = stripOuterParens(s);
      if(s === '-0' || s === '+0') s = '0';
      if(/^[+-]?\d+$/.test(s)) return new Fraction(BigInt(s), 1n);
      let m = s.match(/^([+-]?\d+)\/([+-]?\d+)$/);
      if(m) return new Fraction(BigInt(m[1]), BigInt(m[2]));
      m = s.match(/^([+-]?)(?:(\d*)\.(\d+)|(\d+)\.(\d*))$/);
      if(m){
        const sign = m[1] === '-' ? -1n : 1n;
        const left = m[2] !== undefined ? (m[2] || '0') : (m[4] || '0');
        const right = m[3] !== undefined ? m[3] : (m[5] || '');
        const num = BigInt(left + right) * sign;
        return new Fraction(num, pow10(right.length));
      }
      if(!/[A-Za-z]/.test(s) && /[+\-*/()^]/.test(s)){
        try { return Fraction.from(ExpresionNumerica.calcular(s)); } catch(e) {}
      }
      throw new Error('No se pudo interpretar como número: ' + value);
    }
    add(b){ b = Fraction.from(b); return new Fraction(this.n*b.d + b.n*this.d, this.d*b.d); }
    sub(b){ b = Fraction.from(b); return new Fraction(this.n*b.d - b.n*this.d, this.d*b.d); }
    mul(b){ b = Fraction.from(b); return new Fraction(this.n*b.n, this.d*b.d); }
    div(b){ b = Fraction.from(b); if(b.n === 0n) throw new Error('División por cero.'); return new Fraction(this.n*b.d, this.d*b.n); }
    neg(){ return new Fraction(-this.n, this.d); }
    isZero(){ return this.n === 0n; }
    equals(b){ b = Fraction.from(b); return this.n === b.n && this.d === b.d; }
    toString(){ return this.d === 1n ? this.n.toString() : this.n.toString() + '/' + this.d.toString(); }
  }

  function stripOuterParens(s){
    s = String(s || '').trim();
    while(s.length > 1 && s[0] === '(' && s[s.length - 1] === ')' && wrapsWholeString(s))
      s = s.slice(1,-1).trim();
    return s;
  }

  function wrapsWholeString(s){
    let depth = 0;
    for(let i = 0; i < s.length; i++){
      if(s[i] === '(') depth++;
      else if(s[i] === ')') depth--;
      if(depth === 0 && i < s.length - 1) return false;
      if(depth < 0) return false;
    }
    return depth === 0;
  }

  function normalizeEquationText(text){
    return String(text || '').trim().replace(/\s+/g,'').replace(/,/g,'.')
      .replace(/\^-\s*1/g,'^(-1)').replace(/\^T(?![A-Za-z0-9])/g,'^t')
      .replace(/([A-Z])\^1(?!\d)/g,'$1')
      .replace(/([A-Z])\^2(?!\d)/g,'($1*$1)');
  }

  function validateUnknownPower(condition, unknownName, rows, cols){
    const raw = String(condition || '').replace(/\s+/g,'');
    const re = new RegExp(unknownName + '\\^(\\d+)', 'g');
    let m;
    while((m = re.exec(raw)) !== null){
      const n = parseInt(m[1]);
      if(n > 2) throw 'Solo se admite ' + unknownName + ' elevada a potencia 1 o 2.';
      if(n >= 2 && rows !== cols) throw unknownName + '^2 solo está definida para matrices cuadradas (igual número de filas y columnas).';
    }
  }

  function parseMatrixEquation(raw){
    const eq = normalizeEquationText(raw);
    if(!eq) throw 'Introduce una condición matricial.';
    if((eq.match(/=/g) || []).length !== 1) throw 'La condición debe tener exactamente un signo igual (=).';
    const parts = eq.split('=');
    if(!parts[0] || !parts[1]) throw 'La condición debe tener dos miembros no vacíos.';
    return { raw:eq, lhs:parts[0], rhs:parts[1] };
  }

  function collectUppercaseNames(text, exclude){
    const out = new Set();
    (String(text || '').match(/[A-Z]/g) || []).forEach(name => { if(!exclude.includes(name)) out.add(name); });
    return [...out].sort();
  }

  function collectScalarNames(text){
    const cleaned = String(text || '').replace(/\^t/g,'').replace(/\^\(t\)/g,'');
    const names = new Set();
    (cleaned.match(/[a-z]/g) || []).forEach(ch => {
      if(ch === 't') throw 'La letra t está reservada para la traspuesta. Usa otra letra como parámetro.';
      if(ch === 'e') throw 'La letra e representa la constante de Euler y no puede usarse como parámetro. Usa otra letra.';
      names.add(ch);
    });
    return [...names].sort();
  }

  function buildAutoEntries(rows, cols){
    if(rows * cols > AUTO_NAMES.length) throw 'Demasiadas entradas para la matriz incógnita general (máximo ' + AUTO_NAMES.length + ').';
    let idx = 0;
    return Array.from({length: rows}, () => Array.from({length: cols}, () => AUTO_NAMES[idx++]));
  }

  function buildGeneralProblem(rows, cols, condition){
    validateUnknownPower(condition, gUnknownName, rows, cols);
    const eq = parseMatrixEquation(condition);
    const scalarNames = collectScalarNames(eq.lhs + '+' + eq.rhs);
    if(scalarNames.length) throw 'En el modo X general no introduzcas parámetros escalares en la ecuación.';
    if(new RegExp('\\b' + gUnknownName + '\\s*\\^\\s*\\(?-?1\\)?').test(eq.raw))
      throw 'No se admite la inversa de la matriz incógnita ' + gUnknownName + '.';
    const entries = buildAutoEntries(rows, cols);
    return {
      mode:'general', rows, cols, unknownName:gUnknownName,
      entries, variables:entries.flat(), equations:[eq],
      matrixNames:collectUppercaseNames(eq.lhs + eq.rhs, [gUnknownName,'I']),
      label:gUnknownName + ' general'
    };
  }

  function buildParticularProblem(rows, cols, entries, condition){
    validateUnknownPower(condition, gUnknownName, rows, cols);
    const eq = parseMatrixEquation(condition);
    const flatEntries = entries.flat().map(v => String(v || '0').trim().replace(/,/g,'.') || '0');
    if(flatEntries.some(v => /[A-Z]/.test(v))) throw 'En la matriz con parámetros solo se admiten números y letras minúsculas.';
    const variables = collectScalarNames(flatEntries.join('+') + '+' + eq.lhs + '+' + eq.rhs);
    const matrixNames = collectUppercaseNames(eq.lhs + eq.rhs, [gUnknownName,'I']);
    if(new RegExp('\\b' + gUnknownName + '\\s*\\^\\s*\\(?-?1\\)?').test(eq.raw))
      throw 'No se admite la inversa de la matriz incógnita ' + gUnknownName + '.';
    const normalizedEntries = [];
    let k = 0;
    for(let i = 0; i < rows; i++){
      const row = [];
      for(let j = 0; j < cols; j++) row.push(flatEntries[k++]);
      normalizedEntries.push(row);
    }
    return {
      mode:'particular', rows, cols, unknownName:gUnknownName,
      entries:normalizedEntries, variables, equations:[eq],
      matrixNames, label:gUnknownName + ' de una forma dada'
    };
  }

  function substituteScalarValues(expr, values){
    let out = '';
    const s = String(expr || '0');
    for(let i = 0; i < s.length; i++){
      const ch = s[i];
      if(/[a-z]/.test(ch) && !(ch === 't' && s[i - 1] === '^'))
        out += Object.prototype.hasOwnProperty.call(values, ch) ? '(' + values[ch] + ')' : ch;
      else out += ch;
    }
    return out.replace(/\)(?=[A-Z])/g,')*').replace(/([A-Z])\(/g,'$1*(');
  }

  function buildUnknownMatrix(problem, values){
    return problem.entries.map(row => row.map(cell => {
      const sub = substituteScalarValues(cell, values);
      if(/[a-z]/.test(sub.replace(/\^t/g,''))) throw new Error('Falta valor para algún parámetro.');
      return simplify(sub || '0');
    }));
  }

  function identityOrScalarMatrix(value, n){
    const val = simplify(value);
    if(val === '0') return zeroMatrix(n, n);
    return Matriz.multiplicarEscalar(val, Matriz.identidad(n));
  }

  function calcMatrixExpr(expr, matMap, rows, cols, values){
    let e = normalizeEquationText(expr);
    e = substituteScalarValues(e, values || {});
    if(!e || e === '0') return zeroMatrix(rows, cols);
    const withoutTranspose = e.replace(/\^t/g,'');
    if(!/[A-Z]/.test(withoutTranspose)){
      if(rows !== cols) throw new Error('Una expresión escalar no puede usarse en contexto de matrices no cuadradas.');
      return identityOrScalarMatrix(e, rows);
    }
    const list = Object.entries(matMap).map(([nombre, matriz]) => ({ nombre, matriz:cloneMatrix(matriz) }));
    if(rows === cols && !list.some(o => o.nombre === 'I')) list.push({ nombre:'I', matriz:Matriz.identidad(rows) });
    const result = ExpresionMatricial.calcular(e, list);
    if(!Array.isArray(result)){
      if(rows !== cols) throw new Error('La expresión produce un escalar en contexto de matrices no cuadradas.');
      return identityOrScalarMatrix(String(result), rows);
    }
    return Matriz.simplificarElementosMatriz(result);
  }

  function evaluateResidual(problem, values, knownMap){
    const matMap = {};
    Object.keys(knownMap || {}).forEach(name => { matMap[name] = cloneMatrix(knownMap[name]); });
    matMap[problem.unknownName] = buildUnknownMatrix(problem, values);
    const residual = [];
    for(const eq of problem.equations){
      const L = calcMatrixExpr(eq.lhs, matMap, problem.rows, problem.cols, values);
      const R = calcMatrixExpr(eq.rhs, matMap, problem.rows, problem.cols, values);
      if(L.length !== R.length || (L[0] && R[0] && L[0].length !== R[0].length))
        throw new Error('Los dos miembros producen matrices de distintas dimensiones. Revisa las dimensiones de las matrices conocidas.');
      const D = Matriz.restar(L, R);
      for(const row of D) for(const cell of row) residual.push(Fraction.from(cell));
    }
    return residual;
  }

  // Validate proposed known-matrix dimensions against the condition (using zero matrices)
  function validateKnownDimensions(problem, dimMap){
    const knownMap = {};
    for(const [name, {rows, cols}] of Object.entries(dimMap))
      knownMap[name] = zeroMatrix(rows, cols);
    try {
      evaluateResidual(problem, valuesWith(problem, {}), knownMap);
      return null; // OK
    } catch(e){
      return typeof e === 'string' ? e : e.message;
    }
  }

  function valuesWith(problem, assignments){
    const values = {};
    problem.variables.forEach(name => { values[name] = '0'; });
    Object.keys(assignments || {}).forEach(name => { values[name] = assignments[name]; });
    return values;
  }

  function vectorAdd(a,b){ return a.map((v,i) => v.add(b[i])); }
  function vectorScale(a,k){ return a.map(v => v.mul(k)); }
  function sameVector(a,b){ return a.length === b.length && a.every((v,i) => v.equals(b[i])); }

  function linearizeProblem(problem, knownMap){
    const vars = problem.variables;
    const constant = evaluateResidual(problem, valuesWith(problem, {}), knownMap);
    const columns = [];
    for(const name of vars){
      const v = evaluateResidual(problem, valuesWith(problem, { [name]:'1' }), knownMap);
      columns.push(v.map((entry, i) => entry.sub(constant[i])));
    }
    for(let i = 0; i < vars.length; i++){
      const name = vars[i];
      const doubled = evaluateResidual(problem, valuesWith(problem, { [name]:'2' }), knownMap);
      const expected = vectorAdd(constant, vectorScale(columns[i], Fraction.from(2)));
      if(!sameVector(doubled, expected)) throw 'La condición no es lineal en el parámetro ' + name + '.';
    }
    for(let i = 0; i < vars.length; i++){
      for(let j = i + 1; j < vars.length; j++){
        const mixed = evaluateResidual(problem, valuesWith(problem, { [vars[i]]:'1', [vars[j]]:'1' }), knownMap);
        const expected = vectorAdd(vectorAdd(constant, columns[i]), columns[j]);
        if(!sameVector(mixed, expected)) throw 'La condición produce productos entre parámetros; no es lineal.';
      }
    }
    const equations = [];
    for(let r = 0; r < constant.length; r++){
      const coeffs = columns.map(col => col[r]);
      const rhs = constant[r].neg();
      if(coeffs.some(c => !c.isZero()) || !rhs.isZero()) equations.push({ coeffs, rhs, sourceIndex:r });
    }
    return { variables:vars.slice(), constant, columns, equations };
  }

  function solveLinearSystem(equations, variableNames){
    const m = equations.length, n = variableNames.length;
    const A = equations.map(eq => eq.coeffs.map(Fraction.from).concat([Fraction.from(eq.rhs)]));
    let row = 0;
    const pivotCols = [];
    for(let col = 0; col < n && row < m; col++){
      let pivot = -1;
      for(let r = row; r < m; r++) if(!A[r][col].isZero()){ pivot = r; break; }
      if(pivot === -1) continue;
      if(pivot !== row){ const tmp = A[pivot]; A[pivot] = A[row]; A[row] = tmp; }
      const div = A[row][col];
      for(let c = col; c <= n; c++) A[row][c] = A[row][c].div(div);
      for(let r = 0; r < m; r++){
        if(r === row || A[r][col].isZero()) continue;
        const factor = A[r][col];
        for(let c = col; c <= n; c++) A[r][c] = A[r][c].sub(factor.mul(A[row][c]));
      }
      pivotCols.push(col); row++;
    }
    for(let r = 0; r < m; r++){
      const allZero = A[r].slice(0,n).every(v => v.isZero());
      if(allZero && !A[r][n].isZero()) return { status:'none', rref:A, pivotCols, freeCols:[] };
    }
    const freeCols = [];
    for(let c = 0; c < n; c++) if(!pivotCols.includes(c)) freeCols.push(c);
    const particular = Array.from({length: n}, () => Fraction.zero());
    pivotCols.forEach((col, i) => { particular[col] = A[i][n]; });
    const basis = freeCols.map(freeCol => {
      const vec = Array.from({length: n}, () => Fraction.zero());
      vec[freeCol] = Fraction.one();
      pivotCols.forEach((col, i) => { vec[col] = A[i][freeCol].neg(); });
      return vec;
    });
    return { status:freeCols.length ? 'infinite' : 'unique', rref:A, pivotCols, freeCols, particular, basis };
  }

  function solveProblem(problem, knownMap){
    const linear = linearizeProblem(problem, knownMap);
    const solution = solveLinearSystem(linear.equations, linear.variables);
    const expressions = buildVariableExpressions(linear.variables, solution);
    const matrix = buildSolutionMatrix(problem, expressions);
    return { linear, solution, expressions, matrix };
  }

  // ── Resolución no lineal (condiciones polinómicas como X^2) ──────────────

  function buildSymbolicResidual(problem, knownMap){
    const matMap = {};
    Object.keys(knownMap || {}).forEach(name => { matMap[name] = knownMap[name].map(r => r.map(String)); });
    matMap[problem.unknownName] = problem.entries.map(r => r.map(String));
    const eq = problem.equations[0];
    const L = calcMatrixExpr(eq.lhs, matMap, problem.rows, problem.cols, {});
    const R = calcMatrixExpr(eq.rhs, matMap, problem.rows, problem.cols, {});
    return L.map((row, i) => row.map((cell, j) =>
      simplify('(' + String(cell) + ')-(' + String(R[i][j]) + ')')
    ));
  }

  function collectExprVars(expr, vars){
    const s = String(expr).replace(/\^t/g,'');
    return vars.filter(v => s.includes(v));
  }

  function solveProblemNonLinear(problem, knownMap){
    const residual = buildSymbolicResidual(problem, knownMap);
    const exprs = residual.flat().map(e => simplify(e)).filter(e => e !== '0');
    const vars = problem.variables;
    const candidateMap = {};
    vars.forEach(v => { candidateMap[v] = null; });

    for(const expr of exprs){
      const exprVars = collectExprVars(expr, vars);
      if(exprVars.length === 0)
        throw 'Sin solución: la condición produce una contradicción numérica.';
      if(exprVars.length === 1){
        const v = exprVars[0];
        const analyzed = Resolver.analizarEcuacion(expr);
        if(analyzed.estado === 'sin_soluciones_reales')
          throw 'Sin solución real para el parámetro ' + v + '.';
        if(!analyzed.soluciones || analyzed.soluciones.length === 0)
          throw 'No se pudo resolver automáticamente la ecuación en ' + v + '.';
        const sols = analyzed.soluciones.map(sol => {
          const s = String(sol).replace(/\s+/g,'');
          const idx = s.indexOf('=');
          return idx >= 0 ? s.slice(idx + 1) : s;
        });
        if(candidateMap[v] === null){
          candidateMap[v] = sols;
        } else {
          candidateMap[v] = candidateMap[v].filter(val =>
            sols.some(s2 => simplify('(' + val + ')-(' + s2 + ')') === '0')
          );
          if(candidateMap[v].length === 0)
            throw 'Sin solución: los valores de ' + v + ' son incompatibles.';
        }
      }
    }

    const unconstrained = vars.filter(v => candidateMap[v] === null);
    if(unconstrained.length > 0)
      throw 'No se puede determinar el valor de ' + unconstrained.join(', ') + '. Prueba con una forma más concreta de X.';

    const solutions = [];
    function enumerate(idx, assignment){
      if(idx === vars.length){
        const ok = exprs.every(expr => {
          let s = expr;
          vars.forEach(v => { s = substituteScalarValues(s, {[v]: assignment[v]}); });
          return simplify(s) === '0';
        });
        if(ok) solutions.push(Object.assign({}, assignment));
        return;
      }
      const v = vars[idx];
      for(const val of candidateMap[v]) enumerate(idx + 1, Object.assign({}, assignment, {[v]: val}));
    }
    enumerate(0, {});
    return solutions;
  }

  function buildVariableExpressions(vars, solution){
    const map = {};
    if(solution.status === 'none'){ vars.forEach(v => { map[v] = v; }); return map; }
    const freeNames = solution.freeCols.map(i => vars[i]);
    vars.forEach((name, i) => {
      const terms = [];
      const c = solution.particular[i];
      if(!c.isZero()) terms.push(c.toString());
      solution.basis.forEach((vec, j) => {
        const coeff = vec[i];
        if(coeff.isZero()) return;
        const freeName = freeNames[j];
        if(coeff.equals(Fraction.one())) terms.push(freeName);
        else if(coeff.equals(Fraction.one().neg())) terms.push('-' + freeName);
        else terms.push(coeff.toString() + '*' + freeName);
      });
      map[name] = combineTerms(terms);
    });
    return map;
  }

  function combineTerms(terms){
    if(!terms.length) return '0';
    let out = '';
    terms.forEach((term, i) => {
      if(i === 0) out += term;
      else if(term[0] === '-') out += term;
      else out += '+' + term;
    });
    return simplify(out);
  }

  function substituteSolution(expr, expressions){
    let out = '';
    const s = String(expr || '0');
    for(let i = 0; i < s.length; i++){
      const ch = s[i];
      if(/[a-z]/.test(ch) && Object.prototype.hasOwnProperty.call(expressions, ch))
        out += '(' + expressions[ch] + ')';
      else out += ch;
    }
    return simplify(out || '0');
  }

  function buildSolutionMatrix(problem, expressions){
    return problem.entries.map(row => row.map(cell => substituteSolution(cell, expressions)));
  }

  function scalarToLatex(expr){
    const s = String(expr ?? '0').trim() || '0';
    try { return ExpresionAlgebraica.pasarALatex(s); }
    catch(e){
      const frac = s.match(/^([-+]?\d+)\/(\d+)$/);
      if(frac) return '\\frac{' + frac[1] + '}{' + frac[2] + '}';
      return s.replace(/\*/g,'\\,');
    }
  }

  function matrixToTex(mat){
    return '\\begin{pmatrix}' + mat.map(row => row.map(scalarToLatex).join('&')).join('\\\\') + '\\end{pmatrix}';
  }

  function matrixExprToLatex(expr){
    try { return ExpresionMatricial.pasarALatex(expr); }
    catch(e){
      try { return ExpresionAlgebraica.pasarALatex(expr); }
      catch(_){ return String(expr || '0').replace(/\*/g,'\\cdot '); }
    }
  }

  function problemConditionTex(problem){
    const eq = problem.equations[0];
    return matrixExprToLatex(eq.lhs) + '=' + matrixExprToLatex(eq.rhs);
  }

  function linearEquationTex(eq, vars){
    const parts = [];
    eq.coeffs.forEach((coeff, i) => {
      if(coeff.isZero()) return;
      const negative = coeff.n < 0n;
      const abs = negative ? coeff.neg() : coeff;
      let body = abs.equals(Fraction.one()) ? vars[i] : scalarToLatex(abs.toString()) + '\\,' + vars[i];
      if(!parts.length) parts.push((negative ? '-' : '') + body);
      else parts.push((negative ? ' - ' : ' + ') + body);
    });
    return (parts.join('') || '0') + '=' + scalarToLatex(eq.rhs.toString());
  }

  // ── Matrix input grid ─────────────────────────────────────────────────────
  function createMatrixInputGrid(rows, cols){
    const line = document.createElement('div');
    line.className = 'matrixInputLine';
    const lp = document.createElement('span'); lp.className = 'matrixParen'; lp.textContent = '(';
    const rp = document.createElement('span'); rp.className = 'matrixParen'; rp.textContent = ')';
    const tbl = document.createElement('table');
    const cells = [];
    for(let i = 0; i < rows; i++){
      const tr = document.createElement('tr');
      const row = [];
      for(let j = 0; j < cols; j++){
        const td = document.createElement('td');
        const inp = document.createElement('input');
        inp.type = 'text'; inp.className = 'inputCorto';
        inp.placeholder = ''; inp.autocomplete = 'off';
        td.appendChild(inp); tr.appendChild(td); row.push(inp);
      }
      tbl.appendChild(tr); cells.push(row);
    }
    line.appendChild(lp); line.appendChild(tbl); line.appendChild(rp);
    return { line, cells };
  }

  // Creates grids for known matrices given a fixed dimMap {name: {rows, cols}}
  function createMatrixInputs(names, dimMap, container){
    const widgets = {};
    names.forEach(name => {
      const {rows, cols} = dimMap[name] || {rows: 2, cols: 2};
      const wrap = document.createElement('div');
      wrap.className = 'matrizInputWrap';
      const lbl = document.createElement('span');
      lbl.className = 'matNombreLabel';
      lbl.textContent = name + ' =';
      wrap.appendChild(lbl);
      const {line, cells} = createMatrixInputGrid(rows, cols);
      wrap.appendChild(line);
      container.appendChild(wrap);
      widgets[name] = { readMatrix: () => readMatrixCells(name, cells, rows, cols) };
    });
    return widgets;
  }

  function readMatrixCells(name, cells, rows, cols){
    const mat = [];
    for(let i = 0; i < rows; i++){
      const row = [];
      for(let j = 0; j < cols; j++){
        const v = cells[i][j].value.trim().replace(',','.');
        if(!v) throw 'Falta un valor en ' + name + ' (fila ' + (i+1) + ', columna ' + (j+1) + ').';
        Fraction.from(simplify(v));
        row.push(v);
      }
      mat.push(row);
    }
    return mat;
  }

  // ── initFase1 ─────────────────────────────────────────────────────────────
  function initFase1(){
    clearEl(caja1); clearEl(caja21); gProblem = null;
    const titleDiv = document.createElement('div');
    titleDiv.id = 'tituloCaja1';
    const titleLabel = document.createElement('span');
    titleLabel.textContent = 'INTRODUCCIÓN DE DATOS';
    titleDiv.appendChild(titleLabel);
    const nameControl = document.createElement('div');
    nameControl.className = 'unknownNameControl';
    const nameLbl = document.createElement('label'); nameLbl.textContent = 'Incógnita:';
    const nameInp = document.createElement('input');
    nameInp.type = 'text'; nameInp.className = 'unknownNameInput';
    nameInp.maxLength = 1; nameInp.value = gUnknownName; nameInp.autocomplete = 'off';
    nameInp.title = 'Cambia la letra de la incógnita (por defecto X)';
    nameInp.addEventListener('change', () => {
      const v = nameInp.value.trim().toUpperCase();
      if(!/^[A-Z]$/.test(v) || v === 'I'){ nameInp.value = gUnknownName; return; }
      gUnknownName = v; initFase1();
    });
    nameInp.addEventListener('keydown', ev => { if(ev.key === 'Enter') ev.target.blur(); });
    nameControl.appendChild(nameLbl); nameControl.appendChild(nameInp);
    titleDiv.appendChild(nameControl);
    caja1.appendChild(titleDiv);
    renderModeForm();
  }

  // ── renderModeForm ────────────────────────────────────────────────────────
  function renderModeForm(){
    const form = document.createElement('div');
    form.className = 'condForm';
    caja1.appendChild(form);

    const kindField = document.createElement('div');
    kindField.className = 'condField full';
    kindField.innerHTML = '<label>Forma de X</label>';
    const kindGrid = document.createElement('div');
    kindGrid.className = 'modeGrid compactModeGrid';
    Object.keys(KINDS).forEach(kind => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'modeBtn' + (kind === gKind ? ' active' : '');
      btn.innerHTML = '<strong>' + KINDS[kind].title + '</strong><small>' + KINDS[kind].hint + '</small>';
      btn.addEventListener('click', () => { gKind = kind; initFase1(); });
      kindGrid.appendChild(btn);
    });
    kindField.appendChild(kindGrid);
    form.appendChild(kindField);

    if(!gKind){
      setTimeout(() => { const first = kindGrid.querySelector('button'); if(first) first.focus(); }, 0);
      return;
    }

    // Dimension inputs: rows × cols for X
    const orderField = document.createElement('div');
    orderField.className = 'condField';
    const orderLabel = document.createElement('label');
    orderLabel.textContent = 'Dimensiones de X';
    orderField.appendChild(orderLabel);
    const dimRow = document.createElement('div');
    dimRow.style.cssText = 'display:flex;align-items:center;gap:4px;margin-top:4px;';
    const rowsInp = document.createElement('input');
    rowsInp.type = 'text'; rowsInp.className = 'inputPequeno';
    rowsInp.placeholder = 'm'; rowsInp.autocomplete = 'off';
    rowsInp.style.width = '30px'; rowsInp.title = 'Número de filas de X';
    const dimSep = document.createElement('span');
    dimSep.textContent = '×'; dimSep.style.margin = '0 2px';
    const colsInp = document.createElement('input');
    colsInp.type = 'text'; colsInp.className = 'inputPequeno';
    colsInp.placeholder = 'n'; colsInp.autocomplete = 'off';
    colsInp.style.width = '30px'; colsInp.title = 'Número de columnas de X';
    dimRow.appendChild(rowsInp); dimRow.appendChild(dimSep); dimRow.appendChild(colsInp);
    orderField.appendChild(dimRow);
    form.appendChild(orderField);

    let particularCells = null;
    let conditionInput = null;
    let particularBox = null;
    let particularRows = 0, particularCols = 0;

    const conditionField = document.createElement('div');
    conditionField.className = 'condField equationField';
    conditionField.innerHTML = '<label>Ecuación que debe cumplir X</label>';
    conditionInput = document.createElement('input');
    conditionInput.type = 'text'; conditionInput.className = 'inputEcuacion';
    conditionInput.placeholder = ''; conditionInput.autocomplete = 'off'; conditionInput.spellcheck = false;
    conditionField.appendChild(conditionInput);
    form.appendChild(conditionField);

    const particularField = document.createElement('div');
    particularField.className = 'condField full';
    particularField.innerHTML = '<label>Matriz X con parámetros</label>';
    particularBox = document.createElement('div');
    particularBox.className = 'templateMatrixWrap';
    particularField.appendChild(particularBox);
    if(gKind === 'particular') form.appendChild(particularField);

    if(gKind === 'particular'){
      const tryRebuild = () => {
        if(!rowsInp.value.trim() || !colsInp.value.trim()) return;
        try {
          const {rows, cols} = readDimensions(rowsInp.value, colsInp.value);
          clearEl(particularBox);
          particularCells = buildTemplateInputs(rows, cols, particularBox);
          particularRows = rows; particularCols = cols;
          wireSequentialInputs(particularBox, doContinue);
        } catch(e) {}
      };
      rowsInp.addEventListener('change', tryRebuild);
      colsInp.addEventListener('change', tryRebuild);
    }

    const errDiv = document.createElement('div');
    caja1.appendChild(errDiv);

    function validateAndMaybeRebuild(){
      clearEl(errDiv);
      const {rows, cols} = readDimensions(rowsInp.value, colsInp.value);
      if(gKind === 'particular' && (!particularCells || particularRows !== rows || particularCols !== cols)){
        clearEl(particularBox);
        particularCells = buildTemplateInputs(rows, cols, particularBox);
        particularRows = rows; particularCols = cols;
        wireSequentialInputs(particularBox, doContinue);
      }
      return {rows, cols};
    }

    function doContinue(){
      clearEl(errDiv);
      try {
        const {rows, cols} = validateAndMaybeRebuild();
        if(gKind === 'particular'){
          const entries = readTemplateCells(particularCells, rows, cols);
          gProblem = buildParticularProblem(rows, cols, entries, conditionInput.value);
        } else {
          gProblem = buildGeneralProblem(rows, cols, conditionInput.value);
        }
        renderKnownMatrixPhase(gProblem);
      } catch(e){
        showError(typeof e === 'string' ? e : e.message, errDiv);
      }
    }

    rowsInp.addEventListener('keydown', ev => {
      if(!isValidationKey(ev)) return;
      ev.preventDefault(); colsInp.focus();
    });
    colsInp.addEventListener('keydown', ev => {
      if(!isValidationKey(ev)) return;
      ev.preventDefault();
      try { validateAndMaybeRebuild(); conditionInput.focus(); }
      catch(e){ showError(typeof e === 'string' ? e : e.message, errDiv); }
    });
    conditionInput.addEventListener('keydown', ev => {
      if(!isValidationKey(ev)) return;
      ev.preventDefault();
      if(gKind === 'particular'){
        try { validateAndMaybeRebuild(); if(focusFirstInput(particularBox)) return; }
        catch(e){ showError(typeof e === 'string' ? e : e.message, errDiv); return; }
      }
      doContinue();
    });

    setTimeout(() => rowsInp.focus(), 0);
  }

  function readDimensions(rowsStr, colsStr){
    const rows = parseInt(rowsStr, 10), cols = parseInt(colsStr, 10);
    if(!Number.isInteger(rows) || rows < 1 || rows > 6) throw 'El número de filas debe ser un entero entre 1 y 6.';
    if(!Number.isInteger(cols) || cols < 1 || cols > 6) throw 'El número de columnas debe ser un entero entre 1 y 6.';
    return {rows, cols};
  }

  function buildTemplateInputs(rows, cols, container){
    const lbl = document.createElement('span');
    lbl.className = 'matNombreLabel'; lbl.textContent = gUnknownName + ' =';
    container.appendChild(lbl);
    const {line, cells} = createMatrixInputGrid(rows, cols);
    container.appendChild(line);
    return cells;
  }

  function readTemplateCells(cells, rows, cols){
    if(!cells) throw 'Construye primero la matriz X.';
    const entries = [];
    for(let i = 0; i < rows; i++){
      const row = [];
      for(let j = 0; j < cols; j++) row.push(cells[i][j].value.trim().replace(',','.') || '0');
      entries.push(row);
    }
    return entries;
  }

  // ── renderKnownMatrixPhase ─────────────────────────────────────────────────
  // Entry point: routes to square (original) or non-square (two-phase) flow
  function renderKnownMatrixPhase(problem){
    if(problem.rows === problem.cols)
      renderKnownMatrixPhaseSquare(problem);
    else
      renderKnownMatrixPhaseNonSquare(problem);
  }

  // Builds the shared top part of caja1: title + condition pill + X pill
  function buildPhaseHeader(problem){
    clearEl(caja1);
    const titleDiv = document.createElement('div');
    titleDiv.id = 'tituloCaja1';
    titleDiv.innerHTML = '<span>INTRODUCCIÓN DE DATOS</span>';
    caja1.appendChild(titleDiv);

    const summaryRow = document.createElement('div');
    summaryRow.className = 'problemSummaryRow';

    const condPill = document.createElement('div');
    condPill.className = 'summaryPill conditionSummary';
    condPill.innerHTML = '<div class="summaryPillTitle">CONDICIÓN</div>';
    const condMath = document.createElement('div');
    condMath.className = 'conditionMath';
    renderKatex(problemConditionTex(problem), condMath, false);
    condPill.appendChild(condMath);
    summaryRow.appendChild(condPill);

    const xPill = document.createElement('div');
    xPill.className = 'summaryPill matrixSummary';
    xPill.innerHTML = '<div class="summaryPillTitle">MATRIZ X</div>';
    const xMath = document.createElement('div');
    renderKatex(problem.unknownName + '=' + matrixToTex(problem.entries), xMath, false);
    xPill.appendChild(xMath);
    summaryRow.appendChild(xPill);

    caja1.appendChild(summaryRow);
    return summaryRow;
  }

  // ── Square case: exactly as the original ─────────────────────────────────
  function renderKnownMatrixPhaseSquare(problem){
    const n = problem.rows;
    buildPhaseHeader(problem);

    // Known matrices pill (with grids directly)
    const known = document.createElement('div');
    known.className = 'summaryPill knownInputSummary';
    known.innerHTML = '<div class="summaryPillTitle">MATRICES CONOCIDAS</div>';
    const prompt = document.createElement('p');
    prompt.className = 'knownMatricesPrompt';
    prompt.textContent = problem.matrixNames.length
      ? 'Introduce las matrices conocidas'
      : 'No hay matrices conocidas en la ecuación';
    known.appendChild(prompt);

    const matSection = document.createElement('div');
    matSection.className = 'knownMatricesInputs';
    known.appendChild(matSection);

    // All known matrices are n×n (same as X)
    const dimMap = {};
    problem.matrixNames.forEach(name => { dimMap[name] = {rows: n, cols: n}; });
    const widgets = createMatrixInputs(problem.matrixNames, dimMap, matSection);

    // Append known pill to summaryRow
    const summaryRow = caja1.querySelector('.problemSummaryRow');
    if(summaryRow) summaryRow.appendChild(known);

    const errDiv = document.createElement('div');
    caja1.appendChild(errDiv);

    function doSolve(){
      clearEl(errDiv);
      try {
        const knownMap = {};
        problem.matrixNames.forEach(name => { knownMap[name] = widgets[name].readMatrix(); });
        runSolve(problem, knownMap, errDiv);
      } catch(e){
        showError(typeof e === 'string' ? e : e.message, errDiv);
      }
    }

    wireGridInputs(matSection, doSolve);
    const first = matSection.querySelector('input.inputCorto');
    if(first) setTimeout(() => first.focus(), 0);
    else doSolve();
  }

  // ── Non-square case: Phase A (dimensions) → Phase B (elements) ────────────
  function renderKnownMatrixPhaseNonSquare(problem){
    buildPhaseHeader(problem);
    renderDimensionPhase(problem);
  }

  // Phase A: ask for dimensions of each known matrix, validate, then go to Phase B
  function renderDimensionPhase(problem){
    if(!problem.matrixNames.length){
      // No known matrices — skip straight to element phase with empty dimMap
      renderElementPhase(problem, {});
      return;
    }

    const section = document.createElement('div');
    section.className = 'summaryPill knownInputSummary';
    section.style.marginTop = '10px';
    section.innerHTML = '<div class="summaryPillTitle">DIMENSIONES DE LAS MATRICES CONOCIDAS</div>';

    const prompt = document.createElement('p');
    prompt.className = 'knownMatricesPrompt';
    prompt.textContent = 'Indica el número de filas y columnas de cada matriz conocida:';
    section.appendChild(prompt);

    const dimInputs = {};
    const inputList = []; // for sequential navigation

    problem.matrixNames.forEach(name => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;margin:6px 0;';

      const lbl = document.createElement('span');
      lbl.className = 'matNombreLabel';
      lbl.textContent = name + ':';
      row.appendChild(lbl);

      const rInp = document.createElement('input');
      rInp.type = 'text'; rInp.className = 'inputPequeno';
      rInp.style.width = '32px'; rInp.placeholder = 'm';
      rInp.title = 'Filas de ' + name;
      row.appendChild(rInp);

      const sep = document.createElement('span');
      sep.textContent = '×'; sep.style.margin = '0 2px';
      row.appendChild(sep);

      const cInp = document.createElement('input');
      cInp.type = 'text'; cInp.className = 'inputPequeno';
      cInp.style.width = '32px'; cInp.placeholder = 'n';
      cInp.title = 'Columnas de ' + name;
      row.appendChild(cInp);

      section.appendChild(row);
      dimInputs[name] = {rowsInp: rInp, colsInp: cInp};
      inputList.push(rInp, cInp);
    });

    caja1.appendChild(section);

    const errDiv = document.createElement('div');
    caja1.appendChild(errDiv);

    // Confirm button
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'margin-top:10px;display:flex;gap:10px;align-items:center;';
    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'btn';
    confirmBtn.style.cssText = 'padding:8px 18px;border-radius:8px;background:#3b6ef8;color:#fff;border:none;font-weight:700;cursor:pointer;font-size:.88rem;';
    confirmBtn.textContent = 'Confirmar dimensiones';
    btnRow.appendChild(confirmBtn);
    caja1.appendChild(btnRow);

    function confirmDimensions(){
      clearEl(errDiv);
      const dimMap = {};
      try {
        for(const [name, {rowsInp, colsInp}] of Object.entries(dimInputs)){
          const rows = parseInt(rowsInp.value, 10);
          const cols = parseInt(colsInp.value, 10);
          if(!Number.isInteger(rows) || rows < 1 || rows > 6)
            throw 'Dimensiones incorrectas para ' + name + ': el número de filas debe ser un entero entre 1 y 6.';
          if(!Number.isInteger(cols) || cols < 1 || cols > 6)
            throw 'Dimensiones incorrectas para ' + name + ': el número de columnas debe ser un entero entre 1 y 6.';
          dimMap[name] = {rows, cols};
        }
        const error = validateKnownDimensions(problem, dimMap);
        if(error) throw error;

        // Remove phase A elements and proceed to phase B
        [section, errDiv, btnRow].forEach(el => { if(el.parentNode) el.parentNode.removeChild(el); });
        renderElementPhase(problem, dimMap);
      } catch(e){
        showError(typeof e === 'string' ? e : e.message, errDiv);
        // Focus first invalid input
        const first = inputList.find(inp => !inp.value.trim());
        if(first) first.focus();
      }
    }

    confirmBtn.addEventListener('click', confirmDimensions);

    // Sequential Tab/Enter navigation among dimension inputs
    inputList.forEach((inp, idx) => {
      inp.addEventListener('keydown', ev => {
        if(!isValidationKey(ev)) return;
        ev.preventDefault();
        if(idx < inputList.length - 1) inputList[idx + 1].focus();
        else confirmDimensions();
      });
    });

    setTimeout(() => { if(inputList[0]) inputList[0].focus(); }, 0);
  }

  // Phase B: show element grids for known matrices with confirmed dimensions
  function renderElementPhase(problem, dimMap){
    const known = document.createElement('div');
    known.className = 'summaryPill knownInputSummary';
    known.innerHTML = '<div class="summaryPillTitle">MATRICES CONOCIDAS</div>';

    const prompt = document.createElement('p');
    prompt.className = 'knownMatricesPrompt';
    prompt.textContent = problem.matrixNames.length
      ? 'Introduce los elementos de las matrices conocidas'
      : 'No hay matrices conocidas en la ecuación';
    known.appendChild(prompt);

    const matSection = document.createElement('div');
    matSection.className = 'knownMatricesInputs';
    known.appendChild(matSection);

    const widgets = createMatrixInputs(problem.matrixNames, dimMap, matSection);

    const summaryRow = caja1.querySelector('.problemSummaryRow');
    if(summaryRow) summaryRow.appendChild(known);
    else caja1.appendChild(known);

    const errDiv = document.createElement('div');
    caja1.appendChild(errDiv);

    function doSolve(){
      clearEl(errDiv);
      try {
        const knownMap = {};
        problem.matrixNames.forEach(name => { knownMap[name] = widgets[name].readMatrix(); });
        runSolve(problem, knownMap, errDiv);
      } catch(e){
        showError(typeof e === 'string' ? e : e.message, errDiv);
      }
    }

    wireGridInputs(matSection, doSolve);
    const first = matSection.querySelector('input.inputCorto');
    if(first) setTimeout(() => first.focus(), 0);
    else doSolve();
  }

  // ── renderResolvedSummary ─────────────────────────────────────────────────
  function renderResolvedSummary(problem, knownMap){
    clearEl(caja1);
    const wrap = document.createElement('div');
    wrap.id = 'caja1SummaryRow';
    wrap.className = 'problemSummaryRow';

    const cond = document.createElement('div');
    cond.className = 'summaryPill conditionSummary';
    cond.innerHTML = '<div class="summaryPillTitle">CONDICIÓN</div>';
    const cMath = document.createElement('div'); cMath.className = 'conditionMath';
    renderKatex(problemConditionTex(problem), cMath, false);
    cond.appendChild(cMath); wrap.appendChild(cond);

    const unknown = document.createElement('div');
    unknown.className = 'summaryPill matrixSummary';
    unknown.innerHTML = '<div class="summaryPillTitle">MATRIZ X</div>';
    const unknownMath = document.createElement('div');
    renderKatex(problem.unknownName + '=' + matrixToTex(problem.entries), unknownMath, false);
    unknown.appendChild(unknownMath); wrap.appendChild(unknown);

    const mats = document.createElement('div');
    mats.className = 'summaryPill matrixSummary';
    mats.innerHTML = '<div class="summaryPillTitle">MATRICES CONOCIDAS</div>';
    const row = document.createElement('div');
    row.className = 'knownMatricesValues';
    problem.matrixNames.forEach(name => {
      const box = document.createElement('span');
      renderKatex(name + '=' + matrixToTex(knownMap[name]), box, false);
      row.appendChild(box);
    });
    if(!problem.matrixNames.length) row.textContent = 'No hay matrices conocidas';
    mats.appendChild(row); wrap.appendChild(mats);
    caja1.appendChild(wrap);
  }

  // ── Step rendering ────────────────────────────────────────────────────────
  function addStepAutoButton(titleEl, fn){
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'stepTitleAutoBtn';
    const line1 = document.createElement('span'); line1.textContent = 'Resolución automática';
    const line2 = document.createElement('span'); line2.className = 'stepTitleAutoNote'; line2.textContent = '(No recomendado)';
    btn.appendChild(line1); btn.appendChild(line2);
    btn.addEventListener('click', () => { btn.disabled = true; fn(); });
    titleEl.appendChild(btn);
  }

  function addStep(container, title, result, renderFn){
    const card = document.createElement('div');
    card.className = 'stepCard' + (result ? ' resultCard' : '');
    const h = document.createElement('div'); h.className = 'stepTitle';
    const titleSpan = document.createElement('span'); titleSpan.textContent = title;
    h.appendChild(titleSpan); card.appendChild(h); container.appendChild(card);
    const autoFn = renderFn(card);
    if(typeof autoFn === 'function') addStepAutoButton(h, autoFn);
    return card;
  }

  function buildPasoAPasoMatrices(problem, knownMap){
    const matrices = Object.keys(knownMap).map(name => ({
      nombre: name, matriz: cloneMatrix(knownMap[name])
    }));
    matrices.push({ nombre: problem.unknownName, matriz: cloneMatrix(problem.entries) });
    if(problem.rows === problem.cols && !matrices.some(m => m.nombre === 'I'))
      matrices.push({ nombre:'I', matriz:Matriz.identidad(problem.rows) });
    return matrices;
  }

  function calculateConditionMembers(problem, knownMap){
    const matrices = {};
    Object.keys(knownMap).forEach(name => { matrices[name] = cloneMatrix(knownMap[name]); });
    matrices[problem.unknownName] = cloneMatrix(problem.entries);
    const equation = problem.equations[0];
    return {
      lhs: calcMatrixExpr(equation.lhs, matrices, problem.rows, problem.cols, {}),
      rhs: calcMatrixExpr(equation.rhs, matrices, problem.rows, problem.cols, {})
    };
  }

  function renderCalculationStep(container, problem, knownMap, onComplete){
    const equality = document.createElement('div');
    equality.className = 'conditionEquality'; equality.hidden = true;
    container.appendChild(equality);
    const actions = document.createElement('div');
    actions.className = 'conditionDetailActions'; actions.hidden = true;
    const toggle = document.createElement('button');
    toggle.type = 'button'; toggle.className = 'conditionDetailsToggle';
    toggle.textContent = 'Mostrar cálculos'; toggle.setAttribute('aria-expanded','false');
    actions.appendChild(toggle); container.appendChild(actions);
    const detail = document.createElement('div');
    detail.className = 'conditionMembersDetail'; container.appendChild(detail);
    toggle.addEventListener('click', () => {
      const showing = detail.hidden; detail.hidden = !showing;
      toggle.textContent = showing ? 'Ocultar cálculos' : 'Mostrar cálculos';
      toggle.setAttribute('aria-expanded', String(showing));
    });
    const equation = problem.equations[0];
    const members = [
      { title:'Primer miembro', expr:equation.lhs },
      { title:'Segundo miembro', expr:equation.rhs }
    ];
    const matrices = buildPasoAPasoMatrices(problem, knownMap);
    let done = false;
    function completeStep(){
      if(done) return; done = true;
      try {
        const results = calculateConditionMembers(problem, knownMap);
        renderKatex(matrixToTex(results.lhs) + '=' + matrixToTex(results.rhs), equality, true);
      } catch(e) {}
      equality.hidden = false; detail.hidden = true; actions.hidden = false;
      if(typeof onComplete === 'function') onComplete();
    }
    (async () => {
      try {
        for(const member of members){
          if(done) return;
          const block = document.createElement('div'); block.className = 'conditionMemberCalc';
          const title = document.createElement('div'); title.className = 'conditionMemberTitle'; title.textContent = member.title;
          block.appendChild(title);
          const work = document.createElement('div'); work.className = 'conditionMemberWork';
          block.appendChild(work); detail.appendChild(block);
          await Representar.expresionMatricialPasoaPaso3(member.expr, matrices, work);
          if(done) return;
        }
        completeStep();
      } catch(e){
        if(!done) showError('No se pudo completar el cálculo paso a paso: ' + (typeof e === 'string' ? e : e.message), container);
      }
    })();
    return completeStep;
  }

  function conditionSystemRows(problem, knownMap){
    const results = calculateConditionMembers(problem, knownMap);
    const rows = [];
    for(let i = 0; i < results.lhs.length; i++)
      for(let j = 0; j < results.lhs[i].length; j++)
        rows.push({ lhs:String(results.lhs[i][j]), rhs:String(results.rhs[i][j]) });
    return rows;
  }

  function rawSystemTex(rows){
    const texRows = rows.map(row => scalarToLatex(row.lhs) + '=' + scalarToLatex(row.rhs));
    return '\\begin{cases}' + (texRows.length ? texRows.join('\\\\') : '0=0') + '\\end{cases}';
  }

  function linearSystemTex(equations, variables){
    const rows = equations.map(eq => linearEquationTex(eq, variables));
    return '\\begin{cases}' + (rows.length ? rows.join('\\\\') : '0=0') + '\\end{cases}';
  }

  function scalarResidual(parsed, values){
    const lhs = substituteScalarValues(parsed.lhs, values);
    const rhs = substituteScalarValues(parsed.rhs, values);
    return Fraction.from(simplify('(' + lhs + ')-(' + rhs + ')'));
  }

  function linearizeScalarEquation(raw, variables){
    const parsed = parseMatrixEquation(raw);
    const names = collectScalarNames(parsed.lhs + '+' + parsed.rhs);
    const extras = names.filter(name => !variables.includes(name));
    if(extras.length) throw 'Solo se pueden usar los parámetros de X: ' + variables.join(', ') + '.';
    const zeroValues = {};
    variables.forEach(name => { zeroValues[name] = '0'; });
    const constant = scalarResidual(parsed, zeroValues);
    const coeffs = variables.map(name => {
      const values = Object.assign({}, zeroValues, { [name]:'1' });
      return scalarResidual(parsed, values).sub(constant);
    });
    variables.forEach((name, index) => {
      const values = Object.assign({}, zeroValues, { [name]:'2' });
      const doubled = scalarResidual(parsed, values);
      if(!doubled.equals(constant.add(coeffs[index].mul(Fraction.from(2)))))
        throw 'La ecuación introducida no es lineal en ' + name + '.';
    });
    for(let i = 0; i < variables.length; i++){
      for(let j = i + 1; j < variables.length; j++){
        const values = Object.assign({}, zeroValues, { [variables[i]]:'1', [variables[j]]:'1' });
        const mixed = scalarResidual(parsed, values);
        if(!mixed.equals(constant.add(coeffs[i]).add(coeffs[j])))
          throw 'La ecuación introducida contiene productos entre parámetros.';
      }
    }
    return { coeffs, rhs:constant.neg() };
  }

  function linearizeInputSystem(rawEquations, variables){
    return rawEquations.map(raw => linearizeScalarEquation(raw, variables));
  }

  function nonZeroReducedRows(solution){
    return solution.rref.filter(row => row.some(value => !value.isZero()));
  }

  function systemKey(equations, variables){
    const solved = solveLinearSystem(equations, variables);
    if(solved.status === 'none') return 'none';
    return nonZeroReducedRows(solved).map(row => row.map(v => v.toString()).join(',')).join(';');
  }

  function systemsAreEquivalent(equations, result){
    return systemKey(equations, result.linear.variables) === systemKey(result.linear.equations, result.linear.variables);
  }

  function inputSystemIsNormal(rawEquations, variables){
    return rawEquations.every(raw => {
      let parsed;
      try { parsed = parseMatrixEquation(raw); } catch(e){ return false; }
      return variables.every(name => ((parsed.lhs + parsed.rhs).match(new RegExp(name, 'g')) || []).length <= 1);
    });
  }

  function reducedEquations(result){
    const n = result.linear.variables.length;
    return nonZeroReducedRows(result.solution).map(row => ({ coeffs:row.slice(0,n), rhs:row[n] }));
  }

  function appendEquivalence(container){
    const equiv = document.createElement('span');
    equiv.className = 'systemEquivalence';
    renderKatex('\\Longleftrightarrow', equiv, false);
    container.appendChild(equiv);
  }

  function appendStaticSystem(container, tex){
    const system = document.createElement('span');
    system.className = 'linearStaticSystem';
    renderKatex(tex, system, true);
    container.appendChild(system);
    return system;
  }

  function appendSystemInputs(chain, rowCount, result, errorDiv, onComplete){
    const wrap = document.createElement('span'); wrap.className = 'linearInputSystem';
    const brace = document.createElement('span'); brace.className = 'linearInputBrace'; brace.textContent = '{';
    const fields = document.createElement('span'); fields.className = 'linearEquationFields';
    const inputs = [];
    for(let i = 0; i < rowCount; i++){
      const input = document.createElement('input');
      input.type = 'text'; input.className = 'inputEcuacion linearEquationInput';
      input.placeholder = ''; input.autocomplete = 'off'; input.spellcheck = false;
      fields.appendChild(input); inputs.push(input);
    }
    wrap.appendChild(brace); wrap.appendChild(fields); chain.appendChild(wrap);
    function submitSystem(){
      clearEl(errorDiv);
      const raw = inputs.map(input => input.value.trim());
      if(raw.some(value => !value)){
        showError('Introduce todas las ecuaciones del sistema.', errorDiv);
        const missing = inputs.find(input => !input.value.trim());
        if(missing) missing.focus(); return;
      }
      let equations;
      try { equations = linearizeInputSystem(raw, result.linear.variables); }
      catch(e){ showError(typeof e === 'string' ? e : e.message, errorDiv); inputs[inputs.length-1].focus(); return; }
      if(!systemsAreEquivalent(equations, result)){
        showError('El sistema introducido no es equivalente al anterior.', errorDiv);
        inputs[inputs.length-1].focus(); inputs[inputs.length-1].select(); return;
      }
      const rows = raw.map(value => { const parsed = parseMatrixEquation(value); return { lhs:parsed.lhs, rhs:parsed.rhs }; });
      const accepted = document.createElement('span');
      accepted.className = 'linearStaticSystem';
      renderKatex(rawSystemTex(rows), accepted, true);
      chain.replaceChild(accepted, wrap);
      if(inputSystemIsNormal(raw, result.linear.variables)){
        appendEquivalence(chain);
        appendStaticSystem(chain, linearSystemTex(reducedEquations(result), result.linear.variables));
        if(typeof onComplete === 'function') onComplete(); return;
      }
      appendEquivalence(chain);
      appendSystemInputs(chain, rowCount, result, errorDiv, onComplete);
      caja21.scrollTop = caja21.scrollHeight;
    }
    inputs.forEach((input, index) => {
      input.addEventListener('keydown', event => {
        if(!isValidationKey(event)) return;
        event.preventDefault();
        if(index < inputs.length - 1) inputs[index+1].focus();
        else submitSystem();
      });
    });
    setTimeout(() => { if(inputs[0]) inputs[0].focus(); }, 0);
  }

  function renderLinearSystemStep(card, problem, knownMap, result, onComplete){
    const rows = conditionSystemRows(problem, knownMap);
    const detailActions = document.createElement('div'); detailActions.className = 'conditionDetailActions';
    const detailToggle = document.createElement('button');
    detailToggle.type = 'button'; detailToggle.className = 'conditionDetailsToggle';
    detailToggle.textContent = 'Mostrar cálculos'; detailToggle.setAttribute('aria-expanded','false');
    detailActions.appendChild(detailToggle); card.appendChild(detailActions);
    const detailDiv = document.createElement('div');
    detailDiv.className = 'conditionMembersDetail'; detailDiv.hidden = true;
    result.linear.equations.forEach(eq => {
      const rawRow = rows[eq.sourceIndex]; if(!rawRow) return;
      const block = document.createElement('div'); block.className = 'conditionMemberCalc';
      const mathEl = document.createElement('div'); mathEl.className = 'conditionMemberWork';
      const tex = scalarToLatex(rawRow.lhs) + '=' + scalarToLatex(rawRow.rhs) +
                  '\\quad\\Rightarrow\\quad ' + linearEquationTex(eq, result.linear.variables);
      renderKatex(tex, mathEl, true); block.appendChild(mathEl); detailDiv.appendChild(block);
    });
    card.appendChild(detailDiv);
    detailToggle.addEventListener('click', () => {
      const showing = detailDiv.hidden; detailDiv.hidden = !showing;
      detailToggle.textContent = showing ? 'Ocultar cálculos' : 'Mostrar cálculos';
      detailToggle.setAttribute('aria-expanded', String(showing));
    });
    let done = false;
    function finish(){ if(done) return; done = true; if(typeof onComplete === 'function') onComplete(); }
    const chain = document.createElement('div'); chain.className = 'linearSystemChain';
    appendStaticSystem(chain, rawSystemTex(rows)); appendEquivalence(chain);
    card.appendChild(chain);
    const errorDiv = document.createElement('div'); errorDiv.className = 'linearSystemErrors';
    card.appendChild(errorDiv);
    appendSystemInputs(chain, rows.length, result, errorDiv, finish);
    function autoResolve(){
      if(done) return; done = true; clearEl(chain);
      appendStaticSystem(chain, rawSystemTex(rows)); appendEquivalence(chain);
      appendStaticSystem(chain, linearSystemTex(reducedEquations(result), result.linear.variables));
      clearEl(errorDiv); if(typeof onComplete === 'function') onComplete();
    }
    return autoResolve;
  }

  function scalarVectorForEntries(entries, values){
    return entries.flat().map(cell => {
      const replaced = substituteScalarValues(cell, values);
      if(/[a-z]/.test(replaced.replace(/\^t/g,''))) throw new Error('Falta valor para algún parámetro.');
      return Fraction.from(simplify(replaced || '0'));
    });
  }

  function linearizeMatrixFamily(entries){
    const normalized = entries.map(row => row.map(cell => simplify(String(cell || '0').replace(/,/g,'.'))));
    if(normalized.flat().some(cell => /[A-Z]/.test(cell))) throw 'En la matriz solo se admiten números y parámetros en minúscula.';
    const names = collectScalarNames(normalized.flat().join('+'));
    const zeros = {};
    names.forEach(name => { zeros[name] = '0'; });
    const constant = scalarVectorForEntries(normalized, zeros);
    const columns = names.map(name => {
      const values = Object.assign({}, zeros, { [name]:'1' });
      const evaluated = scalarVectorForEntries(normalized, values);
      return evaluated.map((entry, index) => entry.sub(constant[index]));
    });
    names.forEach((name, index) => {
      const values = Object.assign({}, zeros, { [name]:'2' });
      const evaluated = scalarVectorForEntries(normalized, values);
      const expected = constant.map((value, cell) => value.add(columns[index][cell].mul(Fraction.from(2))));
      if(!sameVector(evaluated, expected)) throw 'La matriz introducida no es lineal en el parámetro ' + name + '.';
    });
    for(let i = 0; i < names.length; i++){
      for(let j = i + 1; j < names.length; j++){
        const values = Object.assign({}, zeros, { [names[i]]:'1', [names[j]]:'1' });
        const evaluated = scalarVectorForEntries(normalized, values);
        const expected = constant.map((value, cell) => value.add(columns[i][cell]).add(columns[j][cell]));
        if(!sameVector(evaluated, expected)) throw 'La matriz introducida contiene productos entre parámetros.';
      }
    }
    return { entries:normalized, names, constant, columns };
  }

  function vectorRank(vectors, dimension){
    if(!vectors.length) return 0;
    const equations = Array.from({length: dimension}, (_, row) => ({
      coeffs: vectors.map(vector => vector[row]), rhs: Fraction.zero()
    }));
    const names = vectors.map((_, index) => 'v' + index);
    return solveLinearSystem(equations, names).pivotCols.length;
  }

  function matrixFamiliesAreEquivalent(candidate, target){
    const dimension = target.constant.length;
    const targetRank = vectorRank(target.columns, dimension);
    if(vectorRank(candidate.columns, dimension) !== targetRank) return false;
    if(vectorRank(target.columns.concat(candidate.columns), dimension) !== targetRank) return false;
    const displacement = candidate.constant.map((value, index) => value.sub(target.constant[index]));
    return vectorRank(target.columns.concat([displacement]), dimension) === targetRank;
  }

  function createBlankParameterMatrix(chain, problem, target, errorDiv, onComplete){
    const wrap = document.createElement('span'); wrap.className = 'parameterMatrixInput';
    const label = document.createElement('span'); label.className = 'parameterMatrixLabel';
    renderKatex(problem.unknownName + '=', label, false); wrap.appendChild(label);
    const matrix = document.createElement('span'); matrix.className = 'parameterInputMatrix';
    const left = document.createElement('span'); left.className = 'matrixParen'; left.textContent = '(';
    const right = document.createElement('span'); right.className = 'matrixParen'; right.textContent = ')';
    const table = document.createElement('table');
    const inputs = [];
    for(let i = 0; i < problem.rows; i++){
      const tr = document.createElement('tr');
      for(let j = 0; j < problem.cols; j++){
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text'; input.className = 'inputCorto parameterMatrixCell';
        input.placeholder = ''; input.autocomplete = 'off'; input.spellcheck = false;
        td.appendChild(input); tr.appendChild(td); inputs.push(input);
      }
      table.appendChild(tr);
    }
    matrix.appendChild(left); matrix.appendChild(table); matrix.appendChild(right);
    wrap.appendChild(matrix); chain.appendChild(wrap);
    function submitMatrix(){
      clearEl(errorDiv);
      const values = inputs.map(input => input.value.trim().replace(/,/g,'.'));
      if(values.some(value => !value)){
        showError('Rellena todas las entradas de la matriz X.', errorDiv);
        const missing = inputs.find(input => !input.value.trim()); if(missing) missing.focus(); return;
      }
      const entries = [];
      for(let i = 0; i < problem.rows; i++) entries.push(values.slice(i * problem.cols, (i+1) * problem.cols));
      let candidate;
      try { candidate = linearizeMatrixFamily(entries); }
      catch(e){ showError(typeof e === 'string' ? e : e.message, errorDiv); inputs[inputs.length-1].focus(); return; }
      if(!matrixFamiliesAreEquivalent(candidate, target)){
        showError('La matriz introducida no representa todas las soluciones de X.', errorDiv);
        inputs[inputs.length-1].focus(); inputs[inputs.length-1].select(); return;
      }
      const accepted = document.createElement('span'); accepted.className = 'parameterStaticMatrix';
      renderKatex(problem.unknownName + '=' + matrixToTex(candidate.entries), accepted, false);
      chain.replaceChild(accepted, wrap);
      const minimum = vectorRank(target.columns, target.constant.length);
      if(candidate.names.length === minimum){ if(typeof onComplete === 'function') onComplete(candidate.entries); return; }
      appendEquivalence(chain);
      createBlankParameterMatrix(chain, problem, target, errorDiv, onComplete);
      caja21.scrollTop = caja21.scrollHeight;
    }
    inputs.forEach((input, index) => {
      input.addEventListener('keydown', event => {
        if(!isValidationKey(event)) return;
        event.preventDefault();
        if(index < inputs.length - 1) inputs[index+1].focus();
        else submitMatrix();
      });
    });
    setTimeout(() => { if(inputs[0]) inputs[0].focus(); }, 0);
  }

  function renderParameterMatrixStep(card, problem, result, onComplete){
    const chain = document.createElement('div'); chain.className = 'parameterMatrixChain'; card.appendChild(chain);
    const errorDiv = document.createElement('div'); errorDiv.className = 'parameterMatrixErrors'; card.appendChild(errorDiv);
    const target = linearizeMatrixFamily(result.matrix);
    let done = false;
    function finish(entries){ if(done) return; done = true; if(typeof onComplete === 'function') onComplete(entries); }
    createBlankParameterMatrix(chain, problem, target, errorDiv, finish);
    function autoResolve(){
      if(done) return; done = true; clearEl(chain); clearEl(errorDiv);
      const solutionEl = document.createElement('span'); solutionEl.className = 'parameterStaticMatrix';
      renderKatex(problem.unknownName + '=' + matrixToTex(result.matrix), solutionEl, false);
      chain.appendChild(solutionEl);
      if(typeof onComplete === 'function') onComplete(result.matrix);
    }
    return autoResolve;
  }

  function appendSolutionSummary(problem, result, entries){
    const wrap = $('caja1SummaryRow'); if(!wrap) return;
    const previous = wrap.querySelector('.solutionSummary'); if(previous) previous.remove();
    const pill = document.createElement('div');
    pill.className = 'summaryPill matrixSummary solutionSummary';
    pill.innerHTML = '<div class="summaryPillTitle">SOLUCIÓN</div>';
    const content = document.createElement('div');
    if(result.solution.status === 'none'){
      content.className = 'solutionKind none summarySolutionStatus'; content.textContent = 'Sin solución';
    } else {
      renderKatex(problem.unknownName + '=' + matrixToTex(entries), content, false);
    }
    pill.appendChild(content); wrap.appendChild(pill);
    wrap.scrollLeft = wrap.scrollWidth;
  }

  function appendNonLinearSummary(problem, solutions){
    const wrap = $('caja1SummaryRow'); if(!wrap) return;
    const previous = wrap.querySelector('.solutionSummary'); if(previous) previous.remove();
    const pill = document.createElement('div');
    pill.className = 'summaryPill matrixSummary solutionSummary';
    pill.innerHTML = '<div class="summaryPillTitle">SOLUCIÓN</div>';
    const content = document.createElement('div');
    if(solutions.length === 0){
      content.className = 'solutionKind none summarySolutionStatus'; content.textContent = 'Sin solución';
    } else if(solutions.length === 1){
      renderKatex(problem.unknownName + '=' + matrixToTex(buildSolutionMatrix(problem, solutions[0])), content, false);
    } else {
      content.className = 'solutionKind infinite summarySolutionStatus';
      content.textContent = solutions.length + ' soluciones';
    }
    pill.appendChild(content); wrap.appendChild(pill);
    wrap.scrollLeft = wrap.scrollWidth;
  }

  function renderNonLinearSolutions(card, problem, solutions){
    if(solutions.length === 0){
      const badge = document.createElement('span');
      badge.className = 'solutionKind none'; badge.textContent = 'Sin solución real';
      card.appendChild(badge);
      appendNonLinearSummary(problem, solutions); return;
    }
    const badge = document.createElement('span');
    badge.className = 'solutionKind' + (solutions.length > 1 ? ' infinite' : '');
    badge.textContent = solutions.length === 1 ? 'Solución única' : solutions.length + ' soluciones';
    card.appendChild(badge);
    const varList = document.createElement('div');
    varList.className = 'varList';
    solutions.forEach(assignment => {
      const matrix = buildSolutionMatrix(problem, assignment);
      const chip = document.createElement('div');
      chip.className = 'varChip';
      renderKatex(problem.unknownName + '=' + matrixToTex(matrix), chip, false);
      varList.appendChild(chip);
    });
    card.appendChild(varList);
    appendNonLinearSummary(problem, solutions);
  }

  function displayNonLinearSolution(problem, knownMap, solutions){
    clearEl(caja21);
    addStep(caja21, 'Paso 1: Calcular los miembros de la condición', false, card => {
      return renderCalculationStep(card, problem, knownMap, () => {
        addStep(caja21, 'Paso 2: Resolución del sistema de ecuaciones', true, solCard => {
          renderNonLinearSolutions(solCard, problem, solutions);
        });
        caja21.scrollTop = caja21.scrollHeight;
      });
    });
  }

  function displayNonLinearWarning(problem, knownMap){
    clearEl(caja21);
    addStep(caja21, 'Paso 1: Calcular los miembros de la condición', false, card => {
      return renderCalculationStep(card, problem, knownMap, () => {
        addStep(caja21, 'Paso 2: Sistema de ecuaciones resultante', false, sysCard => {
          try {
            const rows = conditionSystemRows(problem, knownMap);
            const sysEl = document.createElement('div');
            renderKatex(rawSystemTex(rows), sysEl, true);
            sysCard.appendChild(sysEl);
          } catch(e) {
            showError('No se pudo calcular el sistema: ' + (typeof e === 'string' ? e : e.message), sysCard);
          }
        });
        addStep(caja21, 'Paso 3: Resolución', true, warnCard => {
          const p = document.createElement('p');
          p.className = 'msgError';
          p.textContent = 'El sistema obtenido no es lineal en la incógnita. Esta calculadora no resuelve sistemas no lineales.';
          warnCard.appendChild(p);
        });
        caja21.scrollTop = caja21.scrollHeight;
      });
    });
  }

  function runSolve(problem, knownMap, errDiv){
    let result;
    try {
      result = solveProblem(problem, knownMap);
    } catch(linErr){
      const msg = typeof linErr === 'string' ? linErr : linErr.message;
      if(msg && (msg.includes('no es lineal') || msg.includes('productos entre parámetros'))){
        renderResolvedSummary(problem, knownMap);
        displayNonLinearWarning(problem, knownMap);
        return;
      }
      showError(msg, errDiv); return;
    }
    renderResolvedSummary(problem, knownMap);
    displaySolution(problem, knownMap, result);
  }

  function displaySolution(problem, knownMap, result){
    clearEl(caja21);
    addStep(caja21, 'Paso 1: Calcular los miembros de la condición', false, card => {
      return renderCalculationStep(card, problem, knownMap, () => {
        addStep(caja21, 'Paso 2: Convertir la igualdad de los dos miembros en un sistema lineal', false, linearCard => {
          return renderLinearSystemStep(linearCard, problem, knownMap, result, () => {
            if(result.solution.status === 'none'){
              appendSolutionSummary(problem, result, null);
              caja21.scrollTop = caja21.scrollHeight; return;
            }
            addStep(caja21, 'Paso 3: Escribir la matriz con el menor número de parámetros posible:', false, parameterCard => {
              return renderParameterMatrixStep(parameterCard, problem, result, entries => {
                appendSolutionSummary(problem, result, entries);
                caja21.scrollTop = caja21.scrollHeight;
              });
            });
            caja21.scrollTop = caja21.scrollHeight;
          });
        });
        caja21.scrollTop = caja21.scrollHeight;
      });
    });
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function mostrarCalc(ev){
    if(ev) ev.preventDefault();
    const intro = $('introPrincipal'), calc = $('calculadora');
    if(intro) intro.style.display = 'none';
    if(calc){
      calc.style.display = 'flex'; calc.style.flexDirection = 'column'; calc.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden'; document.body.style.display = 'flex';
      document.body.style.flexDirection = 'column'; window.scrollTo(0,0);
      requestAnimationFrame(() => { const f = calc.querySelector('input'); if(f) try { f.focus(); } catch(e){} });
    }
  }

  function mostrarIntro(ev){
    if(ev) ev.preventDefault();
    const intro = $('introPrincipal'), calc = $('calculadora');
    if(calc) calc.style.display = 'none';
    if(intro){
      intro.style.display = 'block'; document.documentElement.style.overflow = '';
      document.body.style.overflow = 'auto'; document.body.style.display = 'block'; window.scrollTo(0,0);
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    if(window.renderMathInElement){
      renderMathInElement(document.body, {
        delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],
        throwOnError:false
      });
    }
    document.querySelectorAll('.js-show-calc').forEach(btn => btn.addEventListener('click', mostrarCalc));
    caja1 = $('caja1'); caja21 = $('caja21');
    if(!caja1 || !caja21) return;
    const btnVolver = $('btnVolverExplicacion');
    if(btnVolver) btnVolver.addEventListener('click', mostrarIntro);
    const btnReset = $('btnReset');
    if(btnReset) btnReset.addEventListener('click', ev => { ev.preventDefault(); gKind = null; initFase1(); });
    const btnAyuda = $('abreVentana1'), ventana1 = $('ventana1'), cierraV1 = $('cierraVentana1');
    if(btnAyuda && ventana1) btnAyuda.addEventListener('click', ev => { ev.preventDefault(); ventana1.style.display = 'flex'; });
    if(cierraV1 && ventana1) cierraV1.addEventListener('click', () => { ventana1.style.display = 'none'; });
    if(ventana1) ventana1.addEventListener('click', ev => { if(ev.target === ventana1) ventana1.style.display = 'none'; });
    new MutationObserver(() => {
      requestAnimationFrame(() => { caja21.scrollTop = caja21.scrollHeight; });
    }).observe(caja21, { childList:true, subtree:true });
    initFase1();
  });

  window.mostrarCalc = mostrarCalc;
  window.mostrarIntro = mostrarIntro;
  window.CalculoMatricesCondiciones = {
    Fraction, buildGeneralProblem, buildParticularProblem, solveProblem, solveLinearSystem,
    _internals: { linearizeProblem, evaluateResidual, matrixToTex }
  };
})();
