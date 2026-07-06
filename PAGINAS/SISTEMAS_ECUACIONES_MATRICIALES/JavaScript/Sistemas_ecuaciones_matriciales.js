/* =====================================================================
   SISTEMAS DE ECUACIONES MATRICIALES
   Resuelve sistemas lineales con dos incognitas matriciales:
     a1 X + b1 Y = C1
     a2 X + b2 Y = C2
   donde a1,b1,a2,b2 son escalares numericos y C1,C2 son matrices conocidas.
   ===================================================================== */

(function(){
  'use strict';

  let gAnalysis = null;
  let gRows = 0;
  let gCols = 0;
  let gVar1 = 'X';
  let gVar2 = 'Y';
  let caja1 = null;
  let caja21 = null;
  let matInputCells = {};

  function $(id){ return document.getElementById(id); }
  function clearEl(el){ while(el && el.firstChild) el.removeChild(el.firstChild); }

  function showError(msg, where){
    const p = document.createElement('p');
    p.className = 'msgError';
    p.textContent = 'Atencion: ' + msg;
    where.appendChild(p);
  }

  function renderKatex(tex, el, display){
    try { katex.render(tex, el, { throwOnError:false, displayMode:!!display }); }
    catch(e){ el.textContent = tex; }
  }

  function normalizeMinusZero(s){
    s = String(s ?? '0').trim();
    return (s === '-0' || s === '+0') ? '0' : s;
  }

  function simplifyScalar(expr){
    const val = ExpresionAlgebraica.simplificar(String(expr));
    return normalizeMinusZero(val);
  }

  function addScalar(a,b){ return simplifyScalar('(' + a + ')+(' + b + ')'); }
  function subScalar(a,b){ return simplifyScalar('(' + a + ')-(' + b + ')'); }
  function mulScalar(a,b){ return simplifyScalar('(' + a + ')*(' + b + ')'); }
  function negScalar(a){ return simplifyScalar('-(' + a + ')'); }
  function isZeroScalar(a){ return simplifyScalar(a) === '0'; }

  function scalarToNumber(expr){
    const s = simplifyScalar(expr);
    const frac = s.match(/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\/([+-]?(?:\d+(?:\.\d+)?|\.\d+))$/);
    let num;
    if (frac) {
      const den = Number(frac[2]);
      if (!den) throw 'No se puede dividir por cero.';
      num = Number(frac[1]) / den;
    } else {
      num = Number(s);
    }
    if (!Number.isFinite(num)) throw 'No se pudo convertir el escalar "' + s + '" a decimal.';
    return num;
  }

  function numberToPlainDecimal(num){
    if (!Number.isFinite(num)) throw 'Decimal no valido.';
    const digits = Math.abs(num) > 0 && Math.abs(num) < 1e-14 ? 20 : 16;
    let s = num.toFixed(digits).replace(/0+$/,'').replace(/\.$/,'');
    if (s === '-0' || s === '') s = '0';
    if (/e/i.test(s)) throw 'Decimal demasiado grande o pequeno para el paso a paso.';
    return s;
  }

  function scalarToStepDecimal(expr){
    return numberToPlainDecimal(scalarToNumber(expr));
  }

  function balancedOuterParens(s){
    if (s[0] !== '(' || s[s.length - 1] !== ')') return false;
    let depth = 0;
    for (let i = 0; i < s.length; i++){
      if (s[i] === '(') depth++;
      if (s[i] === ')') depth--;
      if (depth === 0 && i < s.length - 1) return false;
      if (depth < 0) return false;
    }
    return depth === 0;
  }

  function stripOuterParens(s){
    s = String(s || '').trim();
    while (s.length > 1 && balancedOuterParens(s)) s = s.slice(1,-1).trim();
    return s;
  }

  function normalizeCoefficient(raw){
    let s = String(raw || '1').replace(/\s+/g,'').replace(/,/g,'.');
    if (!s) s = '1';
    s = stripOuterParens(s);
    if (/[A-Za-z]/.test(s)) {
      throw 'Los coeficientes de X e Y deben ser escalares numericos. Usa, por ejemplo, 2X, -Y o (1/2)X.';
    }
    if (!/^[0-9+\-*/().]+$/.test(s)) {
      throw 'Coeficiente no valido: "' + raw + '".';
    }
    return simplifyScalar(s);
  }

  function normalizeEquationText(eq){
    return String(eq || '')
      .trim()
      .replace(/\s+/g,'')
      .replace(/,/g,'.')
      .replace(/\^-\s*1/g,'^(-1)')
      .replace(/\^T(?![A-Za-z0-9])/g,'^t');
  }

  function splitTopLevelTerms(side){
    let s = normalizeEquationText(side);
    if (!s) throw 'Cada miembro de la ecuacion debe tener contenido.';
    if (!/^[+\-]/.test(s)) s = '+' + s;

    const out = [];
    let depth = 0;
    let start = 0;
    for (let i = 0; i < s.length; i++){
      const ch = s[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if ((ch === '+' || ch === '-') && depth === 0 && i > start){
        out.push(s.slice(start,i));
        start = i;
      }
      if (depth < 0) throw 'Hay parentesis mal cerrados en la ecuacion.';
    }
    if (depth !== 0) throw 'Hay parentesis sin cerrar en la ecuacion.';
    out.push(s.slice(start));

    return out.map(tok => {
      if (tok.length < 2) throw 'Hay un termino vacio en la ecuacion.';
      return { sign: tok[0] === '-' ? -1 : 1, body: tok.slice(1) };
    });
  }

  function signedMatrixExprFromTerms(terms){
    const parts = [];
    for (const term of terms){
      if (!term.body) continue;
      if (term.sign === -1) parts.push(parts.length ? '-' + term.body : '0-' + term.body);
      else parts.push(parts.length ? '+' + term.body : term.body);
    }
    return parts.join('') || '0';
  }

  function negateMatrixExprText(expr){
    return signedMatrixExprFromTerms(splitTopLevelTerms(expr).map(t => ({ sign:-t.sign, body:t.body })));
  }

  function decimalizeScalarFractions(expr){
    return String(expr || '0').replace(
      /(^|[+\-*/(])([+-]?(?:\d+(?:\.\d+)?|\.\d+)\/[+-]?(?:\d+(?:\.\d+)?|\.\d+))/g,
      (_, prefix, frac) => prefix + scalarToStepDecimal(frac)
    );
  }

  function parseUnknownTerm(body){
    const compact = String(body || '').replace(/\*/g,'');
    const has1 = compact.includes(gVar1);
    const has2 = compact.includes(gVar2);
    if (!has1 && !has2) return null;
    if (has1 && has2) throw 'Un mismo termino no puede contener ' + gVar1 + ' e ' + gVar2 + ' a la vez.';

    const variable = has1 ? gVar1 : gVar2;
    const count = compact.split(variable).length - 1;
    if (count !== 1 || !compact.endsWith(variable)) {
      throw 'Los terminos con incognitas deben tener la forma a' + gVar1 + ' o b' + gVar2 + '. No se admiten productos con matrices.';
    }
    const coefRaw = compact.slice(0, -variable.length);
    const coef = normalizeCoefficient(coefRaw || '1');
    return { variable, coef };
  }

  function signedScalar(coef, sign){
    return sign === -1 ? negScalar(coef) : simplifyScalar(coef);
  }

  function wrapMatrixTerm(expr){
    const e = String(expr || '').trim();
    if (!e) return '0';
    return /[+\-]/.test(e.slice(1)) ? '(' + e + ')' : e;
  }

  function buildFreeExpression(terms){
    const useful = terms.filter(t => String(t.expr || '').trim() && String(t.expr).trim() !== '0');
    if (!useful.length) return '0';
    return useful.map((t, i) => {
      const piece = wrapMatrixTerm(t.expr);
      if (i === 0) return t.sign === -1 ? '-' + piece : piece;
      return (t.sign === -1 ? '-' : '+') + piece;
    }).join('');
  }

  function parseLinearEquation(raw){
    const eq = normalizeEquationText(raw);
    if (!eq) throw 'Introduce las dos ecuaciones del sistema.';
    if ((eq.match(/=/g) || []).length !== 1) {
      throw 'Cada ecuacion debe tener exactamente un signo igual (=).';
    }
    const [lhs, rhs] = eq.split('=');
    if (!lhs || !rhs) throw 'Cada ecuacion debe tener dos miembros no vacios.';

    const acc = { x:'0', y:'0', freeTerms:[] };

    function consume(side, unknownMultiplier, freeMultiplier){
      for (const term of splitTopLevelTerms(side)){
        if (!term.body) throw 'Hay un termino vacio en la ecuacion.';
        const unknown = parseUnknownTerm(term.body);
        const movedSign = term.sign * (unknown ? unknownMultiplier : freeMultiplier);
        if (unknown){
          const signed = signedScalar(unknown.coef, movedSign);
          if (unknown.variable === gVar1) acc.x = addScalar(acc.x, signed);
          else acc.y = addScalar(acc.y, signed);
        } else {
          if (new RegExp('[' + gVar1 + gVar2 + ']').test(term.body)) {
            throw gVar1 + ' e ' + gVar2 + ' estan reservadas para las incognitas matriciales.';
          }
          acc.freeTerms.push({ sign:movedSign, expr:term.body });
        }
      }
    }

    consume(lhs, 1, -1);
    consume(rhs, -1, 1);

    if (isZeroScalar(acc.x) && isZeroScalar(acc.y)) {
      throw 'Alguna ecuacion no contiene ' + gVar1 + ' ni ' + gVar2 + ' de forma lineal.';
    }

    const cExpr = buildFreeExpression(acc.freeTerms);
    return { raw:eq, lhs, rhs, x:acc.x, y:acc.y, cExpr };
  }

  function validateKnownMatrixExpression(expr){
    const clean = String(expr || '0').replace(/\^t/g,'').replace(/\^\(-1\)/g,'');
    const lower = clean.match(/[a-z]/g);
    if (lower && lower.length) {
      throw 'La herramienta no admite parametros escalares en los terminos independientes. Introduce solo matrices conocidas y numeros.';
    }
    if (new RegExp('[' + gVar1 + gVar2 + ']').test(expr)) {
      throw gVar1 + ' e ' + gVar2 + ' no pueden aparecer en los terminos independientes.';
    }
  }

  function collectMatrixNames(exprs){
    const names = new Set();
    for (const expr of exprs){
      validateKnownMatrixExpression(expr);
      const matches = String(expr || '').match(/[A-Z]/g) || [];
      for (const name of matches){
        if (name !== 'I' && name !== gVar1 && name !== gVar2) names.add(name);
      }
    }
    return [...names].sort();
  }

  function analyzeSystem(eq1, eq2){
    const first = parseLinearEquation(eq1);
    const second = parseLinearEquation(eq2);
    const delta = subScalar(mulScalar(first.x, second.y), mulScalar(second.x, first.y));
    if (isZeroScalar(delta)) {
      throw 'El determinante del sistema es 0. No hay solucion unica mediante este metodo.';
    }
    const matrixNames = collectMatrixNames([first.cExpr, second.cExpr]);
    return { first, second, delta, matrixNames };
  }

  function zeroMatrix(rows, cols){
    return Array.from({ length:rows }, () => Array(cols).fill('0'));
  }

  function toMatrList(matMap){
    return Object.entries(matMap).map(([nombre, matriz]) => ({ nombre, matriz }));
  }

  function identityOrScalarMatrix(value, rows, cols){
    const val = simplifyScalar(value);
    if (val === '0') return zeroMatrix(rows, cols);
    if (rows !== cols) {
      throw 'Un termino independiente numerico solo puede interpretarse como multiplo de la identidad si las matrices son cuadradas.';
    }
    return Matriz.multiplicarEscalar(val, Matriz.identidad(rows));
  }

  function calcMatrixExpr(expr, matMap, rows, cols){
    cols = cols || rows;
    const e = String(expr || '0').trim();
    if (!e || e === '0') return zeroMatrix(rows, cols);
    if (rows !== cols && /\bI\b/.test(e)) {
      throw 'La matriz identidad I solo esta disponible cuando la dimension es cuadrada.';
    }
    const matrList = toMatrList(matMap);
    if (rows === cols) matrList.push({ nombre:'I', matriz:Matriz.identidad(rows) });
    if (!/[A-Z]/.test(e)) {
      return identityOrScalarMatrix(e, rows, cols);
    }
    const result = ExpresionMatricial.calcular(e, matrList);
    if (!Array.isArray(result)) {
      return identityOrScalarMatrix(String(result), rows, cols);
    }
    if (result.length !== rows || result.some(row => row.length !== cols)) {
      throw 'Alguna expresion matricial no produce una matriz de la dimension indicada.';
    }
    return Matriz.simplificarElementosMatriz(result);
  }

  function computeSystemSolution(analysis, matMap, rows, cols){
    cols = cols || rows;
    const C1 = calcMatrixExpr(analysis.first.cExpr, matMap, rows, cols);
    const C2 = calcMatrixExpr(analysis.second.cExpr, matMap, rows, cols);
    const a1 = analysis.first.x;
    const b1 = analysis.first.y;
    const a2 = analysis.second.x;
    const b2 = analysis.second.y;
    const delta = analysis.delta;

    const xNum = Matriz.restar(
      Matriz.multiplicarEscalar(b2, C1),
      Matriz.multiplicarEscalar(b1, C2)
    );
    const yNum = Matriz.restar(
      Matriz.multiplicarEscalar(a1, C2),
      Matriz.multiplicarEscalar(a2, C1)
    );
    const invDelta = '1/(' + delta + ')';
    const X = Matriz.simplificarElementosMatriz(Matriz.multiplicarEscalar(invDelta, xNum));
    const Y = Matriz.simplificarElementosMatriz(Matriz.multiplicarEscalar(invDelta, yNum));

    return { C1, C2, X, Y, xNum, yNum };
  }

  function linearCombination(a, X, b, Y){
    return Matriz.simplificarElementosMatriz(Matriz.sumar(
      Matriz.multiplicarEscalar(a, X),
      Matriz.multiplicarEscalar(b, Y)
    ));
  }

  function checkSolution(analysis, sol){
    const left1 = linearCombination(analysis.first.x, sol.X, analysis.first.y, sol.Y);
    const left2 = linearCombination(analysis.second.x, sol.X, analysis.second.y, sol.Y);
    return Matriz.compararMatrices(left1, sol.C1) && Matriz.compararMatrices(left2, sol.C2);
  }

  function scalarToLatex(expr){
    try { return ExpresionAlgebraica.pasarALatex(simplifyScalar(expr)); }
    catch(e){ return String(expr); }
  }

  function matrixExprToLatex(expr){
    if (!expr || expr === '0') return '0';
    try { return ExpresionMatricial.pasarALatex(expr); }
    catch(e){
      try { return ExpresionAlgebraica.pasarALatex(expr); }
      catch(_) { return String(expr); }
    }
  }

  function matrixCellToTex(value){
    const s = String(value ?? '0').trim();
    const frac = s.match(/^([-+]?\d+)\/(\d+)$/);
    if (frac) return '\\frac{' + frac[1] + '}{' + frac[2] + '}';
    try { return ExpresionAlgebraica.pasarALatex(s); }
    catch(e){ return s || '0'; }
  }

  function matrixToTex(mat){
    return '\\begin{pmatrix}' + mat.map(row => row.map(matrixCellToTex).join('&')).join('\\\\') + '\\end{pmatrix}';
  }

  function termTex(coef, variable, isFirst){
    const c = simplifyScalar(coef);
    if (c === '0') return '';
    const negative = c[0] === '-';
    const abs = negative ? negScalar(c) : c;
    const body = abs === '1' ? variable : scalarToLatex(abs) + '\\,' + variable;
    if (isFirst) return negative ? '-' + body : body;
    return (negative ? ' - ' : ' + ') + body;
  }

  function linearLhsTex(eq){
    const parts = [];
    const xTerm = termTex(eq.x, gVar1, true);
    if (xTerm) parts.push(xTerm);
    const yTerm = termTex(eq.y, gVar2, parts.length === 0);
    if (yTerm) parts.push(yTerm);
    return parts.join('') || '0';
  }

  function addStep(container, title, isResult, renderFn){
    const card = document.createElement('div');
    card.className = 'stepCard' + (isResult ? ' resultCard' : '');
    const h = document.createElement('div');
    h.className = 'stepTitle';
    h.textContent = title;
    card.appendChild(h);
    container.appendChild(card);
    renderFn(card);
    return card;
  }

  function collapseStepCard(card){
    const hdr = card.querySelector('.stepTitle'); if (!hdr) return;
    hdr.style.display = 'flex';
    hdr.style.alignItems = 'center';
    hdr.style.justifyContent = 'space-between';
    hdr.style.gap = '8px';
    hdr.style.marginBottom = '0';
    const children = Array.from(card.children).filter(el => el !== hdr);
    const saved = children.map(el => el.style.display);
    children.forEach(el => { el.style.display = 'none'; });
    const btn = document.createElement('button'); btn.type = 'button';
    btn.textContent = 'Mostrar';
    btn.style.cssText = 'padding:2px 10px;font-size:11px;font-weight:700;flex-shrink:0;';
    let vis = false;
    btn.addEventListener('click', () => {
      vis = !vis;
      children.forEach((el, i) => { el.style.display = vis ? saved[i] : 'none'; });
      hdr.style.marginBottom = vis ? '' : '0';
      btn.textContent = vis ? 'No mostrar' : 'Mostrar';
    });
    hdr.appendChild(btn);
  }

  function renderMatrix(labelTex, mat, container){
    const group = document.createElement('div');
    group.style.cssText = 'display:inline-flex;align-items:center;gap:8px;';
    const lbl = document.createElement('span');
    lbl.className = 'matLabel';
    lbl.style.cssText = 'font-size:16px;';
    renderKatex(labelTex + '=', lbl, false);
    group.appendChild(lbl);
    const mDiv = document.createElement('div');
    mDiv.style.cssText = 'display:inline-flex;align-items:center;';
    Representar.matriz(mat, mDiv);
    group.appendChild(mDiv);
    container.appendChild(group);
  }

  // Convierte texto de ecuación a LaTeX sin reordenar miembros (muestra "tal cual")
  function rawTextToLatex(text) {
    return String(text || '')
      .replace(/\^\(-1\)/g, '^{-1}')
      .replace(/\^t\b/g,    '^{t}')
      .replace(/\*/g,       '\\cdot ');
  }

  // Re-parsea y normaliza (muestra forma canónica)
  function rawEqToLatex(rawEq) {
    try {
      const p = parseLinearEquation(rawEq);
      return linearLhsTex(p) + '=' + matrixExprToLatex(p.cExpr);
    } catch(_) { return rawTextToLatex(rawEq); }
  }

  function renderResolvedInputSummary(analysis, matMap){
    clearEl(caja1);
    const wrapper = document.createElement('div');
    wrapper.id = 'caja1SummaryRow';
    wrapper.style.cssText = 'display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;padding:4px 0;';

    // Bocadillo 1: SISTEMA INTRODUCIDO (tal cual lo escribió el usuario)
    const boc1 = document.createElement('div');
    boc1.style.cssText = 'border:1px solid rgba(30,50,150,.1);border-radius:14px;padding:12px 16px;'+
      'background:#fff;box-shadow:0 2px 12px rgba(20,40,120,.06);';
    const lbl1 = document.createElement('div');
    lbl1.style.cssText = 'font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;'+
      'color:#3b6ef8;margin-bottom:8px;';
    lbl1.textContent = 'SISTEMA INTRODUCIDO';
    boc1.appendChild(lbl1);
    const sysDiv = document.createElement('div');
    const sysTex = '\\begin{cases}' + rawTextToLatex(analysis.first.raw) + '\\\\' +
                   rawTextToLatex(analysis.second.raw) + '\\end{cases}';
    renderKatex(sysTex, sysDiv, true);
    boc1.appendChild(sysDiv);
    wrapper.appendChild(boc1);

    // Bocadillo 2: MATRICES CONOCIDAS
    if (analysis.matrixNames.length > 0) {
      const boc2 = document.createElement('div');
      boc2.style.cssText = 'border:1px solid rgba(30,50,150,.1);border-radius:14px;padding:12px 16px;'+
        'background:#fff;box-shadow:0 2px 12px rgba(20,40,120,.06);';
      const lbl2 = document.createElement('div');
      lbl2.style.cssText = 'font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;'+
        'color:#3b6ef8;margin-bottom:8px;';
      lbl2.textContent = 'MATRICES CONOCIDAS';
      boc2.appendChild(lbl2);
      const matsDiv = document.createElement('div');
      matsDiv.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;';
      for (const name of analysis.matrixNames){
        const lbl = document.createElement('span');
        lbl.style.fontSize = '14px';
        renderKatex(name + '=', lbl, false);
        matsDiv.appendChild(lbl);
        const mDiv = document.createElement('div');
        Representar.matriz(matMap[name], mDiv);
        matsDiv.appendChild(mDiv);
      }
      boc2.appendChild(matsDiv);
      wrapper.appendChild(boc2);
    }

    caja1.appendChild(wrapper);
  }

  // Paso 1 interactivo: el usuario rellena la matriz de coeficientes del determinante
  function renderDeterminantStep(container, analysis, onComplete){
    // Fila horizontal con bocadillos: [Δ=|celdas|] [=cálculo] [veredicto CD]
    const mainRow=document.createElement('div');
    mainRow.style.cssText='display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0;';
    container.appendChild(mainRow);
    const errMsg=document.createElement('p');
    errMsg.className='msgError'; errMsg.style.display='none';
    container.appendChild(errMsg);
    const autoWrap=document.createElement('div'); autoWrap.style.cssText='margin-top:8px;';
    const autoBtn=document.createElement('button'); autoBtn.type='button';
    autoBtn.innerHTML='RESOLVER AUTOMÁTICAMENTE<br><small>(no se recomienda)</small>';
    autoWrap.appendChild(autoBtn); container.appendChild(autoWrap);
    const detState={currentInput:null,done:false};
    const coeffs=[[analysis.first.x,analysis.first.y],[analysis.second.x,analysis.second.y]];

    function makeBoc(){ const b=document.createElement('div');
      b.style.cssText='padding:8px 12px;border:1px solid rgba(30,50,150,.1);border-radius:12px;'+
        'background:#fff;box-shadow:0 2px 8px rgba(20,40,120,.05);display:flex;align-items:center;gap:6px;';
      mainRow.appendChild(b); return b; }

    // ── Bocadillo 1: Δ = |celdas| ────────────────────────────
    const boc1=makeBoc();
    const deltaLbl=document.createElement('span'); renderKatex('\\Delta=',deltaLbl,false); boc1.appendChild(deltaLbl);
    const detWrap=document.createElement('span'); detWrap.style.cssText='display:inline-flex;align-items:stretch;gap:3px;';
    const lBar=document.createElement('span'); lBar.style.cssText='display:inline-block;border-top:2px solid #374151;border-bottom:2px solid #374151;border-left:2px solid #374151;width:6px;';
    const rBar=document.createElement('span'); rBar.style.cssText='display:inline-block;border-top:2px solid #374151;border-bottom:2px solid #374151;border-right:2px solid #374151;width:6px;';
    const cellTbl=document.createElement('table'); cellTbl.style.cssText='border-collapse:collapse;';
    const cellInputs=[]; let cellFilled=0;
    for (let i=0;i<2;i++){
      const tr=document.createElement('tr');
      for (let j=0;j<2;j++){
        const td=document.createElement('td'); td.style.cssText='padding:3px 5px;';
        const inp=document.createElement('input'); inp.type='text'; inp.className='inputCorto'; inp.autocomplete='off'; inp.dataset.i=i; inp.dataset.j=j;
        td.appendChild(inp); tr.appendChild(td); cellInputs.push(inp);
      }
      cellTbl.appendChild(tr);
    }
    detWrap.appendChild(lBar); detWrap.appendChild(cellTbl); detWrap.appendChild(rBar); boc1.appendChild(detWrap);
    setTimeout(()=>cellInputs[0].focus(),0);

    function isPlainNumber(s){ const t=s.replace(/\s+/g,'').replace(',','.'); return /^[+\-]?\d+(\.\d+)?$/.test(t)||/^[+\-]?\d+\/\d+$/.test(t); }

    for (let k=0;k<cellInputs.length;k++){
      const inp=cellInputs[k]; const kk=k;
      inp.addEventListener('keydown',e=>{
        if(e.key!=='Enter'&&e.key!=='Tab') return;
        e.preventDefault(); errMsg.style.display='none';
        const i=+inp.dataset.i, j=+inp.dataset.j;
        const exp=simplifyScalar(coeffs[i][j]);
        const val=inp.value.trim().replace(',','.');
        let ok=false;
        try{ok=val!==''&&ExpresionAlgebraica.simplificar('('+val+')-('+exp+')')==='0';}catch(_){}
        if(!ok){inp.style.borderColor='#ef4444';errMsg.textContent='⚠ Valor incorrecto.';errMsg.style.display='block';inp.focus();inp.select();return;}
        inp.style.borderColor='';inp.readOnly=true;cellFilled++;
        if(kk<cellInputs.length-1) cellInputs[kk+1].focus(); else phase2();
      });
    }

    // ── Bocadillo 2: = cálculo ────────────────────────────────
    function phase2(){
      errMsg.style.display='none';
      const boc2=makeBoc();
      function addCalcInp(allowExpansion){
        const eqSp=document.createElement('span'); renderKatex('=',eqSp,false); boc2.appendChild(eqSp);
        const inp=document.createElement('input'); inp.type='text'; inp.className='inputCorto'; inp.placeholder='?'; inp.autocomplete='off';
        boc2.appendChild(inp); detState.currentInput=inp; setTimeout(()=>inp.focus(),0);
        inp.addEventListener('keydown',e=>{
          if(e.key!=='Enter'&&e.key!=='Tab') return;
          e.preventDefault(); errMsg.style.display='none';
          const val=inp.value.trim().replace(',','.');
          if(!val) return;
          let ok=false;
          try{ok=ExpresionAlgebraica.simplificar('('+val+')-('+analysis.delta+')')==='0';}catch(_){}
          if(!ok){inp.style.borderColor='#ef4444';errMsg.textContent='⚠ El valor no es correcto.';errMsg.style.display='block';inp.focus();inp.select();return;}
          errMsg.style.display='none';
          if(isPlainNumber(val)){inp.readOnly=true;inp.style.color='#4a5270';phase3();}
          else if(allowExpansion){inp.readOnly=true;inp.style.color='#4a5270';addCalcInp(false);}
          else{inp.style.borderColor='#ef4444';errMsg.textContent='⚠ Escribe el resultado numérico.';errMsg.style.display='block';inp.focus();inp.select();}
        });
      }
      addCalcInp(true);
    }

    // ── Bocadillo 3: veredicto ────────────────────────────────
    function phase3(){
      autoWrap.remove();
      const boc3=document.createElement('div');
      boc3.style.cssText='padding:8px 14px;border-radius:12px;background:#f0fdf4;'+
        'border:1px solid rgba(34,197,94,.24);color:#15803d;font-weight:600;'+
        'display:flex;align-items:center;gap:10px;align-self:center;';
      const neqSp=document.createElement('span'); renderKatex('\\Delta='+scalarToLatex(analysis.delta)+'\\neq 0',neqSp,false); boc3.appendChild(neqSp);
      const cdSp=document.createElement('span'); cdSp.textContent='✓ COMPATIBLE DETERMINADO'; boc3.appendChild(cdSp);
      mainRow.appendChild(boc3);
      detState.done=true; if(caja21) caja21.scrollTop=caja21.scrollHeight;
      if(typeof onComplete==='function') onComplete();
    }

    autoBtn.addEventListener('click',()=>{
      if(detState.done) return;
      if(detState.currentInput&&!detState.currentInput.readOnly){
        detState.currentInput.value=simplifyScalar(analysis.delta);
        detState.currentInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
      } else if(cellFilled<cellInputs.length){
        for(let k=0;k<cellInputs.length;k++){
          const inp=cellInputs[k]; if(inp.readOnly) continue;
          inp.value=simplifyScalar(coeffs[+inp.dataset.i][+inp.dataset.j]);
          inp.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
        }
      }
    });
  }

  // ── Helpers para el paso de simplificación ──────────────────

  function linearLhsText(eq) {
    const x = simplifyScalar(eq.x), y = simplifyScalar(eq.y);
    let lhs = '';
    if (x !== '0') {
      const neg = x[0] === '-', abs = neg ? x.slice(1) : x;
      lhs += (neg ? '-' : '') + (abs === '1' ? '' : abs) + gVar1;
    }
    if (y !== '0') {
      const neg = y[0] === '-', abs = neg ? y.slice(1) : y;
      if (!lhs) lhs += (neg ? '-' : '') + (abs === '1' ? '' : abs) + gVar2;
      else      lhs += (neg ? '-' : '+') + (abs === '1' ? '' : abs) + gVar2;
    }
    return lhs || '0';
  }

  function normalFormEquations(analysis) {
    return [
      linearLhsText(analysis.first)  + '=' + analysis.first.cExpr,
      linearLhsText(analysis.second) + '=' + analysis.second.cExpr
    ];
  }

  function systemIsNormal(rawEq1, rawEq2) {
    function ok(raw) {
      const eq = normalizeEquationText(raw), idx = eq.indexOf('=');
      if (idx < 0) return false;
      const lhs = eq.slice(0, idx), rhs = eq.slice(idx + 1);
      if ((lhs.match(/[A-Z]/g) || []).some(l => l !== gVar1 && l !== gVar2)) return false;
      if (new RegExp('[' + gVar1 + gVar2 + ']').test(rhs)) return false;
      const v1Count = (lhs.match(new RegExp(gVar1, 'g')) || []).length;
      const v2Count = (lhs.match(new RegExp(gVar2, 'g')) || []).length;
      return v1Count <= 1 && v2Count <= 1;
    }
    try { return ok(rawEq1) && ok(rawEq2); } catch(_) { return false; }
  }

  function matricesNumericallyEqual(A, B) {
    if (!A || !B || A.length !== B.length) return false;
    for (let i = 0; i < A.length; i++) {
      if (!B[i] || A[i].length !== B[i].length) return false;
      for (let j = 0; j < A[i].length; j++) {
        try {
          const d = simplifyScalar('(' + String(A[i][j]) + ')-(' + String(B[i][j]) + ')');
          if (d !== '0') { const v = parseFloat(d); if (isNaN(v) || Math.abs(v) > 1e-9) return false; }
        } catch(_) { return false; }
      }
    }
    return true;
  }

  function checkSystemEquivalence(origSol, rawEq1, rawEq2, matMap, rows, cols) {
    let na, ns;
    try { na = analyzeSystem(rawEq1, rawEq2); }
    catch(e) { return { ok:false, error: typeof e==='string'?e:e.message }; }
    try { ns = computeSystemSolution(na, matMap, rows, cols); }
    catch(e) { return { ok:false, error: typeof e==='string'?e:e.message }; }
    if (!matricesNumericallyEqual(origSol.X, ns.X) || !matricesNumericallyEqual(origSol.Y, ns.Y))
      return { ok:false, error:'El sistema no es equivalente al anterior.' };
    return { ok:true, newAnalysis:na };
  }

  function appendEquivArrow(container) {
    const sp = document.createElement('span');
    sp.style.cssText = 'display:inline-flex;align-items:center;align-self:center;margin:0 6px;';
    renderKatex('\\Longleftrightarrow', sp, false);
    container.appendChild(sp);
  }

  function appendStaticSystem(container, rawEq1, rawEq2) {
    const sp = document.createElement('span');
    sp.style.cssText = 'display:inline-flex;align-items:center;';
    renderKatex(
      '\\begin{cases}' + rawTextToLatex(rawEq1) + '\\\\' + rawTextToLatex(rawEq2) + '\\end{cases}',
      sp, true
    );
    container.appendChild(sp);
  }

  function appendSystemInputPair(chain, state, origSol, matMap, rows, cols, errDiv, autoWrap, onComplete) {
    const wrap = document.createElement('span');
    wrap.style.cssText = 'display:inline-flex;align-items:stretch;';
    const brace = document.createElement('span');
    brace.style.cssText = 'display:inline-flex;align-items:center;font-size:2.8rem;font-family:Georgia,serif;'+
      'line-height:1;padding:0 5px 0 0;color:#1a2b6b;user-select:none;';
    brace.textContent = '{';
    const eqsWrap = document.createElement('span');
    eqsWrap.style.cssText = 'display:inline-flex;flex-direction:column;gap:6px;justify-content:center;';
    const inp1 = document.createElement('input');
    inp1.type='text'; inp1.className='inputEcuacion';
    inp1.placeholder='Ecuación 1'; inp1.autocomplete='off'; inp1.spellcheck=false;
    const inp2 = document.createElement('input');
    inp2.type='text'; inp2.className='inputEcuacion';
    inp2.placeholder='Ecuación 2'; inp2.autocomplete='off'; inp2.spellcheck=false;
    eqsWrap.appendChild(inp1); eqsWrap.appendChild(inp2);
    wrap.appendChild(brace); wrap.appendChild(eqsWrap);
    chain.appendChild(wrap);
    state.currentInputs = [inp1, inp2];

    function submitPair() {
      clearEl(errDiv);
      const r1 = inp1.value.trim(), r2 = inp2.value.trim();
      if (!r1 || !r2) { showError('Introduce las dos ecuaciones.', errDiv); return; }
      const chk = checkSystemEquivalence(origSol, r1, r2, matMap, rows, cols);
      if (!chk.ok) {
        showError((chk.error || 'Sistema no equivalente.'), errDiv);
        inp2.focus(); inp2.select(); return;
      }
      inp1.readOnly=true; inp2.readOnly=true;
      inp1.style.color='#4a5270'; inp2.style.color='#4a5270';
      if (systemIsNormal(r1, r2)) {
        state.completed = true;
        wrap.remove();
        appendStaticSystem(chain, r1, r2);
        autoWrap.remove(); clearEl(errDiv);
        if (typeof onComplete==='function') onComplete();
        return;
      }
      appendEquivArrow(chain);
      appendSystemInputPair(chain, state, origSol, matMap, rows, cols, errDiv, autoWrap, onComplete);
      if (caja21) caja21.scrollTop = caja21.scrollHeight;
    }

    inp1.addEventListener('keydown', ev => {
      if (ev.key==='Enter'||ev.key==='Tab') { ev.preventDefault(); inp2.focus(); }
    });
    inp2.addEventListener('keydown', ev => {
      if (ev.key==='Enter'||ev.key==='Tab') { ev.preventDefault(); submitPair(); }
    });
    setTimeout(() => { try { inp1.focus(); } catch(_) {} }, 0);
  }

  function renderSimplifyStep(container, analysis, matMap, rows, cols, onComplete) {
    // Auto-aceptar si ya está en forma normal
    if (systemIsNormal(analysis.first.raw, analysis.second.raw)) {
      const note = document.createElement('p');
      note.style.cssText='font-size:.93rem;color:#4a5270;margin:4px 0;';
      note.textContent='El sistema ya está en forma normal.';
      container.appendChild(note);
      appendStaticSystem(container, analysis.first.raw, analysis.second.raw);
      onComplete(); return;
    }
    let origSol;
    try { origSol = computeSystemSolution(analysis, matMap, rows, cols); }
    catch(e) {
      const p = document.createElement('p'); p.className='msgError';
      p.textContent='⚠ '+(typeof e==='string'?e:e.message);
      container.appendChild(p); onComplete(); return;
    }
    const chain = document.createElement('div');
    chain.style.cssText='display:flex;align-items:flex-start;flex-wrap:wrap;gap:6px;row-gap:8px;';
    container.appendChild(chain);
    const errDiv = document.createElement('div'); container.appendChild(errDiv);
    const autoWrap = document.createElement('div'); autoWrap.style.cssText='margin-top:8px;';
    const autoBtn = document.createElement('button'); autoBtn.type='button';
    autoBtn.innerHTML='RESOLVER AUTOMÁTICAMENTE<br><small>(no se recomienda)</small>';
    autoWrap.appendChild(autoBtn); container.appendChild(autoWrap);
    const state = { completed:false, currentInputs:null };
    appendStaticSystem(chain, analysis.first.raw, analysis.second.raw);
    appendEquivArrow(chain);
    appendSystemInputPair(chain, state, origSol, matMap, rows, cols, errDiv, autoWrap, onComplete);
    autoBtn.addEventListener('click', () => {
      if (state.completed||!state.currentInputs) return;
      const [eq1,eq2] = normalFormEquations(analysis);
      const [i1,i2] = state.currentInputs;
      i1.value=eq1; i1.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true}));
      i2.value=eq2; i2.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    });
  }

  // ── Cadena automática expr = paso1 = paso2 = ... = resultado ─
  function renderPasoAPasoAuto(pasoExpr, matrList, container, fallbackMat, prefixTex) {
    const baseLocal = new Set(matrList.map(x => x.nombre));
    const sinDec = s => String(s ?? '').replace(
      /(^|[^A-Za-z0-9_])(-?\d*\.\d+)(?![A-Za-z0-9_])/g,
      (m, p, d) => { let f; try { f = fraccionContinua(String(d), long); } catch(_) { return m; }
        if (!f || f === d) return m;
        return p + (String(f).includes('/') ? '(' + f + ')' : f); }
    );
    const linea = document.createElement('div');
    linea.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:.4rem;row-gap:.5rem;margin:4px 0;';
    container.appendChild(linea);
    if (prefixTex) {
      const prefix = document.createElement('span');
      prefix.style.cssText = 'display:inline-flex;align-items:center;';
      renderKatex(prefixTex, prefix, false);
      linea.appendChild(prefix);
    }
    function addEq() {
      const sp = document.createElement('span');
      sp.style.cssText = 'display:inline-flex;align-items:center;padding:0 .15rem;';
      renderKatex('=', sp, false);
      linea.appendChild(sp);
    }
    function addBlock(renderFn, expr) {
      const blk = document.createElement('span');
      blk.style.cssText = 'display:inline-flex;align-items:center;';
      try { renderFn(sinDec(expr), matrList, blk); } catch(_) { blk.textContent = String(expr); }
      linea.appendChild(blk);
    }
    try {
      addBlock(Representar.expresionMatricial, pasoExpr);
      let actual = pasoExpr;
      let lastShown = pasoExpr;
      for (let i = 0; i < 40; i++) {
        const siguiente = ExpresionMatricial.calcularUnPaso(actual, matrList);
        if (!siguiente || siguiente === actual || Array.isArray(siguiente) || typeof siguiente !== 'string') break;
        addEq();
        addBlock(Representar.expresionMatricialIntermedia, siguiente);
        lastShown = siguiente;
        actual = siguiente;
      }
      if (fallbackMat && !matrList.some(m => m.nombre === lastShown)) {
        addEq();
        const d = document.createElement('div');
        d.style.cssText = 'display:inline-flex;align-items:center;';
        try { Representar.matriz(fallbackMat, d); } catch(_) {}
        linea.appendChild(d);
      }
    } catch(e) {
      const err = document.createElement('span');
      err.style.cssText = 'color:#b00;font-size:.9rem;margin-left:.3rem;';
      err.textContent = 'Error: ' + (e && e.message ? e.message : String(e));
      container.appendChild(err);
    } finally {
      for (let i = matrList.length - 1; i >= 0; i--)
        if (!baseLocal.has(matrList[i].nombre)) matrList.splice(i, 1);
    }
  }

  // ── PASO 3: Eliminar una incógnita ──────────────────────────

  function parseRowOperation(raw) {
    const s = raw.replace(/\s+/g,'');
    const eqIdx = s.indexOf('=');
    if (eqIdx < 0) throw 'Escribe: E1=2E1+3E2';
    const target = s.slice(0, eqIdx).toUpperCase();
    if (target!=='E1'&&target!=='E2') throw 'La ecuación a modificar debe ser E1 o E2.';
    let rhs = s.slice(eqIdx+1).toUpperCase();
    if (!rhs) throw 'Escribe el lado derecho.';
    if (!/^[+\-]/.test(rhs)) rhs = '+'+rhs;
    const terms=[];
    let depth=0, start=0;
    for (let i=0;i<rhs.length;i++){
      if (rhs[i]==='(') depth++;
      else if (rhs[i]===')') depth--;
      else if ((rhs[i]==='+'||rhs[i]==='-')&&depth===0&&i>start){ terms.push(rhs.slice(start,i)); start=i; }
    }
    terms.push(rhs.slice(start));
    let c1='0', c2='0';
    for (const term of terms){
      if (!term) continue;
      const sign=term[0]; const body=term.slice(1);
      if (body.endsWith('E1')){
        const coef=body.slice(0,-2)||'1';
        c1=addScalar(c1, sign==='-'?'(-1)*('+coef+')':coef);
      } else if (body.endsWith('E2')){
        const coef=body.slice(0,-2)||'1';
        c2=addScalar(c2, sign==='-'?'(-1)*('+coef+')':coef);
      } else if (body.trim()){
        throw 'Cada término debe ser múltiplo de E1 o E2. Ej: 2E1-3E2';
      }
    }
    if (isZeroScalar(c1)&&isZeroScalar(c2)) throw 'La combinación da ecuación nula.';
    return { target, c1, c2 };
  }

  function applyRowOperation(op, first, second) {
    const newX=addScalar(mulScalar(op.c1,first.x), mulScalar(op.c2,second.x));
    const newY=addScalar(mulScalar(op.c1,first.y), mulScalar(op.c2,second.y));
    function combineExpr(c1,e1,c2,e2){
      const parts=[];
      if (!isZeroScalar(c1)&&e1&&e1!=='0'){
        const w=/[+\-]/.test(e1.slice(1))?'('+e1+')':e1;
        if (c1==='1') parts.push(w); else if (c1==='-1') parts.push('-'+w); else parts.push('('+c1+')*'+w);
      }
      if (!isZeroScalar(c2)&&e2&&e2!=='0'){
        const w=/[+\-]/.test(e2.slice(1))?'('+e2+')':e2;
        let piece; if (c2==='1') piece=w; else if (c2==='-1') piece='-'+w; else piece='('+c2+')*'+w;
        if (!parts.length||piece[0]==='-') parts.push(piece); else parts.push('+'+piece);
      }
      return parts.join('')||'0';
    }
    const newEq={x:newX,y:newY,cExpr:combineExpr(op.c1,first.cExpr,op.c2,second.cExpr)};
    return op.target==='E1'?{first:newEq,second}:{first,second:newEq};
  }

  function eliminationReached(cur){
    return isZeroScalar(cur.first.x)||isZeroScalar(cur.first.y)||
           isZeroScalar(cur.second.x)||isZeroScalar(cur.second.y);
  }

  function appendAnalysisSystem(container, cur){
    const sp=document.createElement('span');
    sp.style.cssText='display:inline-flex;align-items:center;';
    renderKatex(
      '\\begin{cases}'+
      linearLhsTex(cur.first)+'='+matrixExprToLatex(cur.first.cExpr)+'\\\\'+
      linearLhsTex(cur.second)+'='+matrixExprToLatex(cur.second.cExpr)+
      '\\end{cases}', sp, true
    );
    container.appendChild(sp);
  }

  function buildAutoEliminationOp(cur){
    const a1=simplifyScalar(cur.first.x), a2=simplifyScalar(cur.second.x);
    if (!isZeroScalar(a1)&&!isZeroScalar(a2)){
      const neg2=a2[0]==='-'?'+'+a2.slice(1):'-'+a2;
      return 'E2='+(a1==='1'?'':'('+a1+')')+'E2'+neg2+'E1';
    }
    const b1=simplifyScalar(cur.first.y), b2=simplifyScalar(cur.second.y);
    const neg2=b2[0]==='-'?'+'+b2.slice(1):'-'+b2;
    return 'E2='+(b1==='1'?'':'('+b1+')')+'E2'+neg2+'E1';
  }

  // ── PASOS 3, 4, 5: Eliminar + resolver incógnitas ───────────

  function makeBocadillo(container){
    const b=document.createElement('div');
    b.style.cssText='padding:8px 12px;border:1px solid rgba(30,50,150,.1);border-radius:12px;'+
      'background:#fff;box-shadow:0 2px 8px rgba(20,40,120,.05);'+
      'display:flex;flex-direction:column;gap:6px;';
    container.appendChild(b); return b;
  }

  function appendMatrixInputCells(container, varName, expected, rows, cols, onDone){
    const row=document.createElement('div');
    row.style.cssText='display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:8px;';
    const lbl=document.createElement('span'); renderKatex(varName+'=',lbl,false); row.appendChild(lbl);
    const pw=document.createElement('span'); pw.style.cssText='display:inline-flex;align-items:center;gap:2px;';
    const lp=document.createElement('span'); lp.style.cssText='font-size:'+(1+rows*0.4)+'rem;line-height:1;'; lp.textContent='(';
    const rp=document.createElement('span'); rp.style.cssText='font-size:'+(1+rows*0.4)+'rem;line-height:1;'; rp.textContent=')';
    const tbl=document.createElement('table'); tbl.style.cssText='border-collapse:collapse;';
    pw.appendChild(lp); pw.appendChild(tbl); pw.appendChild(rp); row.appendChild(pw);
    container.appendChild(row);
    const errDiv=document.createElement('div'); container.appendChild(errDiv);
    const inputs=[];
    for (let i=0;i<rows;i++){
      const tr=document.createElement('tr');
      for (let j=0;j<cols;j++){
        const td=document.createElement('td'); td.style.cssText='padding:2px 4px;';
        const inp=document.createElement('input');
        inp.type='text'; inp.className='inputCorto'; inp.dataset.i=i; inp.dataset.j=j; inp.autocomplete='off';
        td.appendChild(inp); tr.appendChild(td); inputs.push(inp);
      }
      tbl.appendChild(tr);
    }
    for (let k=0;k<inputs.length;k++){
      const inp=inputs[k]; const kk=k;
      inp.addEventListener('keydown',e=>{
        if(e.key!=='Enter'&&e.key!=='Tab') return;
        e.preventDefault(); clearEl(errDiv);
        const val=inp.value.trim().replace(',','.');
        const ii=+inp.dataset.i, jj=+inp.dataset.j;
        const expVal=String(expected[ii][jj]??'0');
        let ok=false;
        try{ok=val!==''&&ExpresionAlgebraica.simplificar('('+val+')-('+expVal+')')==='0';}catch(_){}
        if(!ok){inp.style.borderColor='#ef4444';showError('⚠ Valor incorrecto.',errDiv);inp.focus();inp.select();return;}
        inp.style.borderColor='';inp.readOnly=true;
        if(kk<inputs.length-1) inputs[kk+1].focus();
        else{clearEl(errDiv);if(caja21)caja21.scrollTop=caja21.scrollHeight;onDone();}
      });
    }
    if(inputs[0]) setTimeout(()=>inputs[0].focus(),0);
  }

  function getElimInfo(cur){
    for (const [key,eq] of [['first',cur.first],['second',cur.second]]){
      if (isZeroScalar(eq.y)) return {solvedVar:gVar1,coeff:eq.x,cExpr:eq.cExpr,otherEq:key==='first'?cur.second:cur.first};
      if (isZeroScalar(eq.x)) return {solvedVar:gVar2,coeff:eq.y,cExpr:eq.cExpr,otherEq:key==='first'?cur.second:cur.first};
    }
    return null;
  }

  function renderEliminationStep(container, initAnalysis, matMap, rows, cols, sol, onComplete){
    const chain=document.createElement('div');
    chain.style.cssText='display:flex;align-items:center;flex-wrap:wrap;gap:8px;';
    container.appendChild(chain);
    const errDiv=document.createElement('div'); container.appendChild(errDiv);
    const autoWrap=document.createElement('div'); autoWrap.style.cssText='margin-top:8px;';
    const autoBtn=document.createElement('button'); autoBtn.type='button';
    autoBtn.innerHTML='RESOLVER AUTOMÁTICAMENTE<br><small>(no se recomienda)</small>';
    autoWrap.appendChild(autoBtn); container.appendChild(autoWrap);
    const state={
      current:{first:initAnalysis.first,second:initAnalysis.second},
      completed:false,
      stepFinished:false,
      currentInput:null,
      autoSkip:false,
      isoAutoFillFn:null,
      finishStepAuto:null
    };
    let titleSkipBtn=null;
    function finishStep(cur){
      if(state.stepFinished) return;
      state.stepFinished=true;
      if(titleSkipBtn&&titleSkipBtn.parentNode) titleSkipBtn.remove();
      onComplete(cur);
    }
    const titleEl=container.querySelector('.stepTitle');
    if(titleEl){
      titleEl.style.display='flex';titleEl.style.alignItems='center';titleEl.style.justifyContent='space-between';titleEl.style.gap='8px';
      const skipBtn=document.createElement('button'); skipBtn.type='button';
      skipBtn.textContent='Resolver automáticamente (no recomendado)';
      skipBtn.style.cssText='font-size:10px;padding:2px 8px;text-transform:none;letter-spacing:0;flex-shrink:0;font-weight:600;';
      titleSkipBtn=skipBtn;
      skipBtn.addEventListener('click',()=>{
        if(state.stepFinished) return;
        state.autoSkip=true;
        if(state.finishStepAuto){ state.finishStepAuto(); return; }
        let cur=state.current; let safety=0;
        while(!eliminationReached(cur)&&safety++<20){
          const raw=buildAutoEliminationOp(cur);
          let op; try{op=parseRowOperation(raw);}catch(e){break;}
          const newCur=applyRowOperation(op,cur.first,cur.second);
          if(isZeroScalar(newCur.first.x)&&isZeroScalar(newCur.first.y)) break;
          if(isZeroScalar(newCur.second.x)&&isZeroScalar(newCur.second.y)) break;
          cur=newCur;
        }
        if(!eliminationReached(cur)) return;
        state.current=cur; state.completed=true; autoWrap.remove(); clearEl(errDiv);
        clearEl(chain);
        const finalBoc=makeBocadillo(chain);
        appendAnalysisSystem(finalBoc,cur);
        addFinalCells(cur);
        if(caja21) caja21.scrollTop=caja21.scrollHeight;
      });
      titleEl.appendChild(skipBtn);
    }

    function addFinalCells(cur){
      const info=getElimInfo(cur);
      if(!info){finishStep(cur);return;}
      const expected=info.solvedVar===gVar1?sol.X:sol.Y;

      function cleanMatrixExprText(expr){
        return String(expr||'0')
          .replace(/\s+/g,'')
          .replace(/\((-?(?:\d+(?:\.\d+)?|\.\d+)(?:\/-?(?:\d+(?:\.\d+)?|\.\d+))?)\)\*/g,'$1*')
          .replace(/\+\-/g,'-');
      }

      function buildCanonicalExpr(){
        const c=simplifyScalar(info.coeff);
        const rhs=cleanMatrixExprText(info.cExpr);
        if(c==='1') return rhs;
        if(c==='-1') return '-('+rhs+')';
        return '('+simplifyScalar('1/('+c+')')+')*('+rhs+')';
      }

      function buildPasoAPasoExpr(){
        const c=simplifyScalar(info.coeff);
        let rhs=cleanMatrixExprText(info.cExpr);
        rhs=decimalizeScalarFractions(rhs);
        if(c==='1') return rhs;
        if(c==='-1') return '-('+rhs+')';
        return scalarToStepDecimal('1/('+c+')')+'*('+rhs+')';
      }

      function runPasoAPaso3(userInputExpr, forceAuto){
        const autoMode = !!forceAuto || state.autoSkip;
        const displayExpr = buildCanonicalExpr();
        const pasoExpr = (!autoMode && userInputExpr !== undefined)
          ? decimalizeScalarFractions(String(userInputExpr).replace(/\s+/g,'').replace(/([0-9A-Z)])\(/g,'$1*('))
          : buildPasoAPasoExpr();
        const finalPasoExpr = buildPasoAPasoExpr();
        const matBoc=makeBocadillo(container);
        const exprDiv=document.createElement('div');
        renderKatex(info.solvedVar+'='+matrixExprToLatex(displayExpr),exprDiv,false);
        matBoc.appendChild(exprDiv);
        const calcDiv=document.createElement('div');
        calcDiv.className='sistEcPasoAPaso';
        matBoc.appendChild(calcDiv);
        const finishAuto=()=>{
          if(state.stepFinished) return;
          clearEl(matBoc);
          const finalDiv=document.createElement('div');
          finalDiv.className='sistEcPasoAPaso';
          matBoc.appendChild(finalDiv);
          renderPasoAPasoAuto(finalPasoExpr, toMatrList(matMap), finalDiv, expected, info.solvedVar+'=');
          if(caja21) caja21.scrollTop=caja21.scrollHeight;
          finishStep(cur);
        };
        state.finishStepAuto=finishAuto;
        if(autoMode){
          finishAuto();
          return;
        }
        const matrList=toMatrList(matMap);
        Representar.expresionMatricialPasoaPaso3(pasoExpr,matrList,calcDiv)
          .then(()=>{
            finishAuto();
          })
          .catch(err=>{
            if(state.stepFinished) return;
            clearEl(calcDiv);
            showError('No se pudo completar el paso a paso: '+(err&&err.message?err.message:err),calcDiv);
          });
        if(caja21) caja21.scrollTop=caja21.scrollHeight;
      }

      if(simplifyScalar(info.coeff)==='1'){
        runPasoAPaso3();
        return;
      }

      const isoWidget=document.createElement('div');
      isoWidget.style.cssText='display:flex;flex-direction:column;align-items:flex-start;gap:4px;align-self:center;';
      const isoRow=document.createElement('div');
      isoRow.style.cssText='display:flex;align-items:center;gap:6px;';
      const isoLbl=document.createElement('span'); renderKatex(info.solvedVar+'=',isoLbl,false);
      isoRow.appendChild(isoLbl);
      const isoInp=document.createElement('input');
      isoInp.type='text'; isoInp.className='inputEcuacion';
      isoInp.placeholder='Expresión en matrices conocidas'; isoInp.autocomplete='off'; isoInp.spellcheck=false;
      isoRow.appendChild(isoInp);
      isoWidget.appendChild(isoRow);
      const isoErr=document.createElement('div'); isoWidget.appendChild(isoErr);
      chain.appendChild(isoWidget);
      setTimeout(()=>isoInp.focus(),0);
      isoInp.addEventListener('keydown',e=>{
        if(e.key!=='Enter'&&e.key!=='Tab') return;
        e.preventDefault(); clearEl(isoErr);
        const userExpr=isoInp.value.trim();
        if(!userExpr) return;
        let computed;
        try{computed=calcMatrixExpr(userExpr,matMap,rows,cols);}
        catch(err){showError(typeof err==='string'?err:err.message,isoErr);isoInp.focus();isoInp.select();return;}
        if(!matricesNumericallyEqual(computed,expected)){
          showError('La expresión no es correcta.',isoErr);isoInp.focus();isoInp.select();return;
        }
        isoInp.readOnly=true; isoInp.style.color='#4a5270'; clearEl(isoErr);
        runPasoAPaso3();
      });
      state.isoAutoFillFn=()=>{
        isoInp.value=buildCanonicalExpr();
        isoInp.readOnly=true; isoInp.style.color='#4a5270'; clearEl(isoErr);
        runPasoAPaso3(undefined,true);
      };
      state.finishStepAuto=state.isoAutoFillFn;
      if(state.autoSkip) state.isoAutoFillFn();
    }

    if(eliminationReached(state.current)){
      autoWrap.remove();
      const boc=makeBocadillo(chain);
      appendAnalysisSystem(boc,state.current);
      addFinalCells(state.current);
      return;
    }

    function addBocadilloWithInput(cur){
      const boc=makeBocadillo(chain);
      appendAnalysisSystem(boc,cur);
      const arrowWidget=document.createElement('div');
      arrowWidget.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;align-self:center;';
      const arrowSpan=document.createElement('span');
      renderKatex('\\Longleftrightarrow',arrowSpan,false);
      arrowWidget.appendChild(arrowSpan);
      const inp=document.createElement('input');
      inp.type='text'; inp.className='inputCorto'; inp.autocomplete='off';
      inp.placeholder='Ej: E2=E2-2E1'; inp.style.cssText='width:150px;';
      arrowWidget.appendChild(inp);
      chain.appendChild(arrowWidget);
      state.currentInput=inp;
      setTimeout(()=>inp.focus(),0);
      inp.addEventListener('keydown',e=>{
        if(e.key!=='Enter'&&e.key!=='Tab') return;
        e.preventDefault(); clearEl(errDiv);
        const raw=inp.value.trim();
        if(!raw){showError('Escribe la operación.',errDiv);return;}
        let op;
        try{op=parseRowOperation(raw);}
        catch(err){showError(typeof err==='string'?err:err.message,errDiv);inp.focus();inp.select();return;}
        const newCur=applyRowOperation(op,state.current.first,state.current.second);
        if(isZeroScalar(newCur.first.x)&&isZeroScalar(newCur.first.y)){showError('La operación produce ecuación 0=C.',errDiv);inp.focus();inp.select();return;}
        if(isZeroScalar(newCur.second.x)&&isZeroScalar(newCur.second.y)){showError('La operación produce ecuación 0=C.',errDiv);inp.focus();inp.select();return;}
        inp.readOnly=true; inp.style.color='#4a5270';
        arrowWidget.removeChild(inp);
        state.current=newCur;
        if(eliminationReached(newCur)){
          state.completed=true; autoWrap.remove(); clearEl(errDiv);
          const finalBoc=makeBocadillo(chain);
          appendAnalysisSystem(finalBoc,newCur);
          addFinalCells(newCur);
          if(caja21) caja21.scrollTop=caja21.scrollHeight;
          return;
        }
        addBocadilloWithInput(newCur);
        if(caja21) caja21.scrollTop=caja21.scrollHeight;
      });
    }

    addBocadilloWithInput(state.current);

    autoBtn.addEventListener('click',()=>{
      if(state.completed||!state.currentInput) return;
      state.currentInput.value=buildAutoEliminationOp(state.current);
      state.currentInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
    });
  }

  function renderSubstitutionStep(container, elimInfo, elimState, analysis, sol, matMap, rows, cols, onComplete){
    const {solvedVar,coeff,cExpr}=elimInfo;
    const otherVar=solvedVar===gVar1?gVar2:gVar1;
    const expected=otherVar===gVar1?sol.X:sol.Y;
    const solvedMatrix=solvedVar===gVar1?sol.X:sol.Y;

    function addMul(s){
      return String(s||'').replace(/\s+/g,'')
        .replace(/(\d)([A-Za-z])/g,'$1*$2')
        .replace(/(\d)\(/g,'$1*(')
        .replace(/\)([A-Za-z(])/g,')*$1');
    }
    function evalSide(expr){
      const ml=toMatrList(matMap);
      ml.push({nombre:solvedVar,matriz:solvedMatrix});
      ml.push({nombre:otherVar,matriz:expected});
      if(rows===cols) ml.push({nombre:'I',matriz:Matriz.identidad(rows)});
      const r=ExpresionMatricial.calcular(addMul(expr),ml);
      if(!Array.isArray(r)) throw 'No es una expresión matricial válida.';
      if(r.length!==rows||r.some(row=>row.length!==cols)) throw 'Dimensión incorrecta.';
      return Matriz.simplificarElementosMatriz(r);
    }
    function checkEquiv(rawEq){
      const eq=String(rawEq||'').replace(/\s+/g,'').replace(/,/g,'.');
      const idx=eq.indexOf('='); if(idx<0) throw 'Falta el signo =.';
      const lhs=eq.slice(0,idx), rhs=eq.slice(idx+1);
      if(!lhs||!rhs) throw 'La ecuación debe tener dos miembros.';
      if(!matricesNumericallyEqual(evalSide(lhs),evalSide(rhs))) throw 'La ecuación no es equivalente.';
      return {lhs,rhs};
    }
    function isIsolated(lhs){
      const s=lhs.replace(/\s+/g,'').replace(/\*/g,'');
      return new RegExp('^[+\\-]?1?'+otherVar+'$').test(s);
    }
    function eqToLatex(eq){
      return linearLhsTex(eq)+'='+matrixExprToLatex(eq.cExpr);
    }

    function cleanMatrixExprText(expr){
      return String(expr||'0')
        .replace(/\s+/g,'')
        .replace(/\((-?(?:\d+(?:\.\d+)?|\.\d+)(?:\/-?(?:\d+(?:\.\d+)?|\.\d+))?)\)\*/g,'$1*')
        .replace(/\+\-/g,'-');
    }

    function appendSubstitutionTerm(base, coef, variable){
      const c=simplifyScalar(coef);
      let left=cleanMatrixExprText(base);
      if(isZeroScalar(c)) return left||'0';
      let piece;
      if(c==='1') piece=variable;
      else if(c==='-1') piece='-'+variable;
      else piece=c+'*'+variable;
      if(!left||left==='0') return piece;
      return piece[0]==='-' ? left+piece : left+'+'+piece;
    }

    function buildSubstitutionExpr(eq){
      const a=simplifyScalar(otherVar===gVar1?eq.x:eq.y);
      if(isZeroScalar(a)) return null;
      const b=simplifyScalar(solvedVar===gVar1?eq.x:eq.y);
      const inner=appendSubstitutionTerm(eq.cExpr,negScalar(b),solvedVar);
      if(a==='1') return cleanMatrixExprText(inner);
      if(a==='-1') return '-('+inner+')';
      return '('+simplifyScalar('1/('+a+')')+')*('+inner+')';
    }

    function buildSubstitutionPasoExpr(eq){
      const a=simplifyScalar(otherVar===gVar1?eq.x:eq.y);
      if(isZeroScalar(a)) return null;
      const b=simplifyScalar(solvedVar===gVar1?eq.x:eq.y);
      const inner=decimalizeScalarFractions(appendSubstitutionTerm(eq.cExpr,negScalar(b),solvedVar));
      if(a==='1') return inner;
      if(a==='-1') return '-('+inner+')';
      return scalarToStepDecimal('1/('+a+')')+'*('+inner+')';
    }

    function chooseAutoSubstitutionEq(){
      const candidates=[analysis.first,analysis.second];
      return candidates.find(eq=>!isZeroScalar(otherVar===gVar1?eq.x:eq.y))||null;
    }

    let titleSkipBtn4=null;
    let step4Finished=false;
    let finishStepAuto4=null;

    function finishStep4(){
      if(step4Finished) return;
      step4Finished=true;
      if(titleSkipBtn4&&titleSkipBtn4.parentNode) titleSkipBtn4.remove();
      onComplete();
    }

    // ── Skip button en el título ────────────────────────
    let _innerAutoBtn=null;
    const titleEl4=container.querySelector('.stepTitle');
    if(titleEl4){
      titleEl4.style.display='flex';titleEl4.style.alignItems='center';titleEl4.style.justifyContent='space-between';titleEl4.style.gap='8px';
      const skipBtn4=document.createElement('button'); skipBtn4.type='button';
      skipBtn4.textContent='Resolver automáticamente (no recomendado)';
      skipBtn4.style.cssText='font-size:10px;padding:2px 8px;text-transform:none;letter-spacing:0;flex-shrink:0;font-weight:600;';
      titleSkipBtn4=skipBtn4;
      skipBtn4.addEventListener('click',()=>{
        if(step4Finished) return;
        if(finishStepAuto4){ finishStepAuto4(); return; }
        if(p1.parentNode) p1.remove();
        const eq=chooseAutoSubstitutionEq();
        const rhsExpr=eq?buildSubstitutionExpr(eq):null;
        if(!rhsExpr) return;
        launchPasoAPaso(rhsExpr,false,true,eq);
      });
      titleEl4.appendChild(skipBtn4);
    }

    // ── Fase 1: elegir ecuación ────────────────────────
    const p1=document.createElement('div'); p1.style.cssText='margin-bottom:10px;';
    const qlbl=document.createElement('p');
    qlbl.style.cssText='font-size:.93rem;color:var(--text-secondary);margin:0 0 8px;';
    qlbl.textContent='¿En qué ecuación quieres sustituir?';
    p1.appendChild(qlbl);
    const btnRow=document.createElement('div'); btnRow.style.cssText='display:flex;gap:10px;flex-wrap:wrap;';
    [[analysis.first,'E1'],[analysis.second,'E2']].forEach(([eq,label])=>{
      const btn=document.createElement('button'); btn.type='button';
      btn.style.cssText='display:inline-flex;align-items:center;gap:6px;padding:6px 12px;cursor:pointer;';
      const lbl=document.createElement('span');
      lbl.style.cssText='font-size:.78rem;font-weight:700;color:#3b6ef8;white-space:nowrap;';
      lbl.textContent=label+':';
      const eqSp=document.createElement('span'); renderKatex(eqToLatex(eq),eqSp,false);
      btn.appendChild(lbl); btn.appendChild(eqSp); btnRow.appendChild(btn);
      btn.addEventListener('click',()=>{ p1.remove(); startPhase2(eq); });
    });
    p1.appendChild(btnRow); container.appendChild(p1);

    // ── Fase 2: cadena de transformaciones ─────────────
    function startPhase2(chosenEq){
      const chain=document.createElement('div');
      chain.style.cssText='display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-top:4px;';
      container.appendChild(chain);
      const errDiv=document.createElement('div'); container.appendChild(errDiv);
      const autoWrap4=document.createElement('div'); autoWrap4.style.cssText='margin-top:8px;';
      const autoBtn=document.createElement('button'); autoBtn.type='button';
      autoBtn.innerHTML='RESOLVER AUTOMÁTICAMENTE<br><small>(no se recomienda)</small>';
      autoWrap4.appendChild(autoBtn); container.appendChild(autoWrap4);
      _innerAutoBtn=autoBtn;
      const state={completed:false,currentInput:null};

      function showStaticEq(eq){
        const sp=document.createElement('span'); sp.style.cssText='display:inline-flex;align-items:center;';
        renderKatex(eqToLatex(eq),sp,false); chain.appendChild(sp);
      }
      function showArrow(){
        const sp=document.createElement('span');
        sp.style.cssText='display:inline-flex;align-items:center;padding:2px 0;';
        renderKatex('\\Longleftrightarrow',sp,false); chain.appendChild(sp);
      }
      function addInput(){
        const inp=document.createElement('input');
        inp.type='text'; inp.className='inputEcuacion';
        inp.placeholder='Ecuación equivalente'; inp.autocomplete='off'; inp.spellcheck=false;
        chain.appendChild(inp); state.currentInput=inp;
        setTimeout(()=>inp.focus(),0);
        inp.addEventListener('keydown',e=>{
          if(e.key!=='Enter'&&e.key!=='Tab') return;
          e.preventDefault(); clearEl(errDiv);
          const raw=inp.value.trim(); if(!raw) return;
          let chk;
          try{chk=checkEquiv(raw);}
          catch(err){showError(typeof err==='string'?err:err.message,errDiv);inp.focus();inp.select();return;}
          inp.readOnly=true; inp.style.color='#4a5270';
          if(isIsolated(chk.lhs)){
            state.completed=true; autoWrap4.remove(); clearEl(errDiv);
            const rhsExpr=buildSubstitutionExpr(chosenEq);
            launchPasoAPaso(rhsExpr||chk.rhs, !rhsExpr&&chk.lhs.replace(/\s+/g,'').startsWith('-'), false, chosenEq);
            return;
          }
          showArrow(); addInput();
          if(caja21) caja21.scrollTop=caja21.scrollHeight;
        });
      }

      function buildAutoEq(eq){
        const expr=buildSubstitutionExpr(eq||chosenEq);
        return otherVar+'='+(expr||'');
      }

      function finishFromChosen(){
        if(step4Finished) return;
        const eqForAuto=buildSubstitutionExpr(chosenEq)?chosenEq:chooseAutoSubstitutionEq();
        const rhsExpr=eqForAuto?buildSubstitutionExpr(eqForAuto):null;
        if(!rhsExpr){ showError('No se ha podido elegir una ecuacion valida para despejar '+otherVar+'.',errDiv); return; }
        if(autoWrap4.parentNode) autoWrap4.remove();
        clearEl(errDiv);
        if(eqForAuto!==chosenEq){
          clearEl(chain);
          showStaticEq(eqForAuto);
          showArrow();
        }
        if(state.currentInput&&!state.currentInput.readOnly){
          state.currentInput.value=buildAutoEq(eqForAuto);
          state.currentInput.readOnly=true;
          state.currentInput.style.color='#4a5270';
        }
        state.completed=true;
        launchPasoAPaso(rhsExpr,false,true,eqForAuto);
      }
      finishStepAuto4=finishFromChosen;

      showStaticEq(chosenEq);
      showArrow(); addInput();
      autoBtn.addEventListener('click',()=>{
        if(state.completed||!state.currentInput||state.currentInput.readOnly) return;
        const autoEq=buildAutoEq();
        if(autoEq===otherVar+'='){ finishFromChosen(); return; }
        state.currentInput.value=autoEq;
        state.currentInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
      });
    }

    // ── Lanzar paso a paso tras despejar ───────────────
    function launchPasoAPaso(rhsExpr, isNeg, forceAuto, chosenEq){
      const finalExpr=cleanMatrixExprText(isNeg?'-('+rhsExpr+')':rhsExpr);
      const pasoExpr=(chosenEq&&buildSubstitutionPasoExpr(chosenEq))||decimalizeScalarFractions(
        finalExpr.replace(/\s+/g,'').replace(/(\d)([A-Z])/g,'$1*$2').replace(/(\d)\(/g,'$1*(').replace(/\)([A-Z(])/g,')*$1')
      );
      const extMatList=toMatrList(matMap);
      extMatList.push({nombre:solvedVar,matriz:solvedMatrix});
      if(rows===cols) extMatList.push({nombre:'I',matriz:Matriz.identidad(rows)});
      const matBoc=makeBocadillo(container);
      const exprDiv=document.createElement('div');
      renderKatex(otherVar+'='+matrixExprToLatex(finalExpr),exprDiv,false);
      matBoc.appendChild(exprDiv);
      const calcDiv=document.createElement('div'); calcDiv.className='sistEcPasoAPaso';
      matBoc.appendChild(calcDiv);
      const finishAuto=()=>{
        if(step4Finished) return;
        clearEl(matBoc);
        const extMatList2=toMatrList(matMap);
        extMatList2.push({nombre:solvedVar,matriz:solvedMatrix});
        const finalDiv=document.createElement('div');
        finalDiv.className='sistEcPasoAPaso';
        matBoc.appendChild(finalDiv);
        renderPasoAPasoAuto(pasoExpr,extMatList2,finalDiv,expected,otherVar+'=');
        if(caja21) caja21.scrollTop=caja21.scrollHeight;
        finishStep4();
      };
      finishStepAuto4=finishAuto;
      if(forceAuto){
        finishAuto();
        return;
      }
      Representar.expresionMatricialPasoaPaso3(pasoExpr,extMatList,calcDiv)
        .then(()=>{
          finishAuto();
        })
        .catch(err=>{
          if(step4Finished) return;
          clearEl(calcDiv);
          showError('No se pudo completar el paso a paso: '+(err&&err.message?err.message:err),calcDiv);
        });
      if(caja21) caja21.scrollTop=caja21.scrollHeight;
    }
  }

  // ── displaySolution ─────────────────────────────────────────

  function displaySolution(analysis, matMap, rows, cols, sol){
    clearEl(caja21);
    const bocStyle='border:1px solid rgba(30,50,150,.1);border-radius:14px;padding:12px 16px;'+
      'background:#fff;box-shadow:0 2px 12px rgba(20,40,120,.06);';
    const lblStyle='font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;'+
      'color:#3b6ef8;margin-bottom:8px;';
    function addSummaryBoc(title, renderFn){
      const row=document.getElementById('caja1SummaryRow'); if(!row) return;
      const boc=document.createElement('div'); boc.style.cssText=bocStyle;
      const lbl=document.createElement('div'); lbl.style.cssText=lblStyle;
      lbl.textContent=title; boc.appendChild(lbl);
      renderFn(boc); row.appendChild(boc);
      if(caja1) caja1.scrollTop=caja1.scrollHeight;
    }
    addStep(caja21,'Paso 1: Simplificar el sistema',false,c1=>{
      renderSimplifyStep(c1,analysis,matMap,rows,cols,()=>{
        collapseStepCard(c1);
        addSummaryBoc('SISTEMA SIMPLIFICADO', boc=>{
          const sysDiv=document.createElement('div');
          renderKatex(
            '\\begin{cases}'+linearLhsTex(analysis.first)+'='+matrixExprToLatex(analysis.first.cExpr)+'\\\\'+
            linearLhsTex(analysis.second)+'='+matrixExprToLatex(analysis.second.cExpr)+'\\end{cases}',
            sysDiv, true
          );
          boc.appendChild(sysDiv);
        });
        if(caja21) caja21.scrollTop=caja21.scrollHeight;
        addStep(caja21,'Paso 2: Calcular el determinante del sistema',false,c2=>{
          renderDeterminantStep(c2,analysis,()=>{
            collapseStepCard(c2);
            if(caja21) caja21.scrollTop=caja21.scrollHeight;
            addStep(caja21,'Paso 3: Eliminar una incógnita en una de las ecuaciones',false,c3=>{
              renderEliminationStep(c3,analysis,matMap,rows,cols,sol,elimState=>{
                const elimInfo=getElimInfo(elimState);
                if(caja21) caja21.scrollTop=caja21.scrollHeight;
                addStep(caja21,'Paso 4: Obtener el valor de la otra incógnita por sustitución',false,c4=>{
                  renderSubstitutionStep(c4,elimInfo,elimState,analysis,sol,matMap,rows,cols,()=>{
                    if(caja21) caja21.scrollTop=caja21.scrollHeight;
                    addSummaryBoc('SOLUCIÓN', boc=>{
                      const srow=document.createElement('div');
                      srow.style.cssText='display:flex;align-items:center;gap:20px;flex-wrap:wrap;';
                      renderMatrix(gVar1,sol.X,srow); renderMatrix(gVar2,sol.Y,srow);
                      boc.appendChild(srow);
                    });
                    caja21.scrollTop=caja21.scrollHeight;
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  function initFase1(){
    clearEl(caja1);
    clearEl(caja21);
    gAnalysis = null;
    gRows = 0; gCols = 0;
    matInputCells = {};

    const titleDiv = document.createElement('div');
    titleDiv.id = 'tituloCaja1';
    titleDiv.innerHTML = '<span>INTRODUCCION DE DATOS</span>';
    caja1.appendChild(titleDiv);

    function addSection(label){
      const sec = document.createElement('div');
      sec.className = 'pasoSection';
      const hdr = document.createElement('div');
      hdr.className = 'fase';
      hdr.innerHTML = '<span><strong>' + label + '</strong></span>';
      sec.appendChild(hdr);
      caja1.appendChild(sec);
      setTimeout(() => sec.scrollIntoView({ behavior:'smooth', block:'nearest' }), 50);
      return sec;
    }

    /* ── Paso 1: Nombres ─────────────────────────────── */
    const sec1 = addSection('1. Nombre de las matrices incógnita');
    const namesInfo = document.createElement('div');
    namesInfo.style.cssText = 'margin:8px 0 4px;font-size:.93rem;color:var(--text-secondary);display:flex;align-items:center;gap:10px;flex-wrap:wrap;';
    const namesText = document.createElement('span');
    namesText.textContent = 'Los nombres son, en principio, ' + gVar1 + ' e ' + gVar2 + '. Puedes cambiarlos a continuación.';
    const btnNames = document.createElement('button');
    btnNames.type = 'button'; btnNames.textContent = 'CAMBIAR NOMBRES';
    namesInfo.appendChild(namesText); namesInfo.appendChild(btnNames);
    sec1.appendChild(namesInfo);

    const namesForm = document.createElement('div');
    namesForm.style.cssText = 'display:none;margin:6px 0 10px;padding:10px 14px;border:1px solid var(--border-card);border-radius:10px;background:#f9fafb;gap:10px;align-items:center;flex-wrap:wrap;';
    const lbN1 = document.createElement('label'); lbN1.textContent='Primera incógnita:'; lbN1.style.fontSize='.9rem';
    const inpN1 = document.createElement('input'); inpN1.type='text'; inpN1.className='inputPequeno'; inpN1.value=gVar1; inpN1.maxLength=1; inpN1.style.width='44px';
    const lbN2 = document.createElement('label'); lbN2.textContent='Segunda incógnita:'; lbN2.style.cssText='font-size:.9rem;margin-left:8px;';
    const inpN2 = document.createElement('input'); inpN2.type='text'; inpN2.className='inputPequeno'; inpN2.value=gVar2; inpN2.maxLength=1; inpN2.style.width='44px';
    const btnCN = document.createElement('button'); btnCN.type='button'; btnCN.textContent='CONFIRMAR';
    namesForm.appendChild(lbN1); namesForm.appendChild(inpN1);
    namesForm.appendChild(lbN2); namesForm.appendChild(inpN2);
    namesForm.appendChild(btnCN);
    sec1.appendChild(namesForm);

    btnNames.addEventListener('click', () => {
      namesForm.style.display = namesForm.style.display==='flex' ? 'none' : 'flex';
    });
    btnCN.addEventListener('click', () => {
      const v1=inpN1.value.trim().toUpperCase().slice(0,1);
      const v2=inpN2.value.trim().toUpperCase().slice(0,1);
      if (!v1||!v2) return;
      if (v1===v2){ alert('Las dos incógnitas deben tener nombres distintos.'); return; }
      if (v1==='I'||v2==='I'){ alert('La letra I está reservada para la identidad.'); return; }
      gVar1=v1; gVar2=v2;
      namesText.textContent='Los nombres son '+gVar1+' e '+gVar2+'. Puedes cambiarlos a continuación.';
      namesForm.style.display='none';
    });

    const btnNext1 = document.createElement('button');
    btnNext1.type='button'; btnNext1.className='primary';
    btnNext1.textContent='ACEPTAR Y CONTINUAR →';
    btnNext1.addEventListener('click', () => { btnNext1.disabled=true; addPaso2(); });
    namesInfo.appendChild(btnNext1);

    /* ── Paso 2: Ecuaciones ──────────────────────────── */
    function addPaso2(){
      const sec2 = addSection('2. Introduce las ecuaciones del sistema');

      const sysWrap = document.createElement('div');
      sysWrap.style.cssText='display:flex;align-items:stretch;margin:10px 0 6px;';
      const brace = document.createElement('div');
      brace.style.cssText='display:flex;align-items:center;font-size:3.6rem;line-height:1;font-family:Georgia,serif;padding-right:10px;color:var(--blue-deep);user-select:none;';
      brace.textContent='{';
      const iWrap = document.createElement('div');
      iWrap.style.cssText='display:flex;flex-direction:column;gap:8px;flex:1;';

      const w1=document.createElement('div'); w1.style.cssText='display:flex;align-items:center;gap:8px;';
      const inp1=document.createElement('input'); inp1.type='text'; inp1.className='inputEcuacion';
      inp1.placeholder='Ej: '+gVar1+' + '+gVar2+' = A'; inp1.autocomplete='off'; inp1.spellcheck=false;
      const e1=document.createElement('span'); e1.className='inlineEqFeedback';
      w1.appendChild(inp1); w1.appendChild(e1);

      const w2=document.createElement('div'); w2.style.cssText='display:flex;align-items:center;gap:8px;';
      const inp2=document.createElement('input'); inp2.type='text'; inp2.className='inputEcuacion';
      inp2.placeholder='Ej: '+gVar1+' - '+gVar2+' = B'; inp2.autocomplete='off'; inp2.spellcheck=false;
      const e2=document.createElement('span'); e2.className='inlineEqFeedback';
      w2.appendChild(inp2); w2.appendChild(e2);

      iWrap.appendChild(w1); iWrap.appendChild(w2);
      sysWrap.appendChild(brace); sysWrap.appendChild(iWrap);
      sec2.appendChild(sysWrap);
      const errDiv2=document.createElement('div'); sec2.appendChild(errDiv2);

      function vEq(inp, errSpan){
        errSpan.textContent=''; inp.style.outlineColor='';
        if (!inp.value.trim()) return false;
        try {
          parseLinearEquation(inp.value);
          inp.style.outlineColor='#22c55e'; errSpan.textContent='✓'; errSpan.style.color='#15803d';
          return true;
        } catch(e){
          inp.style.outlineColor='#ef4444';
          errSpan.textContent=typeof e==='string'?e:e.message;
          errSpan.style.cssText='color:#b91c1c;font-size:.82rem;';
          return false;
        }
      }

      inp1.addEventListener('keydown', ev => {
        if (ev.key!=='Enter'&&ev.key!=='Tab') return;
        ev.preventDefault(); vEq(inp1,e1); inp2.focus();
      });
      inp2.addEventListener('keydown', ev => {
        if (ev.key!=='Enter'&&ev.key!=='Tab') return;
        ev.preventDefault(); clearEl(errDiv2);
        if (!vEq(inp2,e2)) return;
        try {
          gAnalysis=analyzeSystem(inp1.value,inp2.value);
          inp1.disabled=true; inp2.disabled=true;
          addPaso3();
        } catch(e){ showError(typeof e==='string'?e:e.message, errDiv2); }
      });
      setTimeout(()=>inp1.focus(),80);
    }

    /* ── Paso 3: Dimensión ───────────────────────────── */
    function addPaso3(){
      const sec3=addSection('3. Introduce la dimensión de las matrices conocidas');

      const dRow=document.createElement('div');
      dRow.style.cssText='display:flex;align-items:center;gap:10px;margin:8px 0 14px;flex-wrap:wrap;';
      const lbR=document.createElement('label'); lbR.textContent='Número de filas:'; lbR.style.fontSize='.93rem';
      const inpR=document.createElement('input'); inpR.type='text'; inpR.className='inputPequeno'; inpR.style.width='50px'; inpR.placeholder='ej: 2'; inpR.autocomplete='off';
      const lbC=document.createElement('label'); lbC.textContent='Número de columnas:'; lbC.style.cssText='font-size:.93rem;margin-left:10px;';
      const inpC=document.createElement('input'); inpC.type='text'; inpC.className='inputPequeno'; inpC.style.width='50px'; inpC.placeholder='ej: 2'; inpC.autocomplete='off';
      dRow.appendChild(lbR); dRow.appendChild(inpR); dRow.appendChild(lbC); dRow.appendChild(inpC);
      sec3.appendChild(dRow);
      const errDiv3=document.createElement('div'); sec3.appendChild(errDiv3);

      function confirmDim(){
        clearEl(errDiv3);
        const m=parseInt(inpR.value,10), n=parseInt(inpC.value,10);
        if (!Number.isInteger(m)||m<1||m>9){ showError('El número de filas debe ser un entero entre 1 y 9.',errDiv3); return; }
        if (!Number.isInteger(n)||n<1||n>9){ showError('El número de columnas debe ser un entero entre 1 y 9.',errDiv3); return; }
        gRows=m; gCols=n;
        inpR.disabled=true; inpC.disabled=true;
        addPaso4();
      }
      inpR.addEventListener('keydown',ev=>{ if(ev.key==='Enter'||ev.key==='Tab'){ev.preventDefault();inpC.focus();} });
      inpC.addEventListener('keydown',ev=>{ if(ev.key==='Enter'||ev.key==='Tab'){ev.preventDefault();confirmDim();} });
      setTimeout(()=>inpR.focus(),80);
    }

    /* ── Paso 4: Valores de matrices ─────────────────── */
    function addPaso4(){
      const sec4=addSection('4. Introduce los valores de las matrices conocidas');
      const sub=document.createElement('span');
      sub.style.cssText='font-size:.87rem;color:var(--text-secondary);display:block;margin-bottom:8px;';
      sub.textContent='Matrices: '+(gAnalysis.matrixNames.join(', ')||'(ninguna)')+'  ·  Dimensión: '+gRows+'×'+gCols;
      sec4.appendChild(sub);

      const matSection=document.createElement('div');
      matInputCells={};
      for (const name of gAnalysis.matrixNames){
        const wrap=document.createElement('div'); wrap.className='matrizInputWrap';
        const lbl=document.createElement('span'); lbl.className='matNombreLabel'; lbl.textContent=name+' =';
        wrap.appendChild(lbl);
        const ml=document.createElement('div'); ml.className='matrixInputLine';
        const lp=document.createElement('span'); lp.className='matrixParen'; lp.textContent='(';
        const rp=document.createElement('span'); rp.className='matrixParen'; rp.textContent=')';
        const tbl=document.createElement('table'); tbl.style.borderSpacing='6px';
        const cells=[];
        for (let i=0;i<gRows;i++){
          const tr=document.createElement('tr'); const row=[];
          for (let j=0;j<gCols;j++){
            const td=document.createElement('td');
            const inp=document.createElement('input');
            inp.type='text'; inp.className='inputCorto'; inp.placeholder='0'; inp.autocomplete='off';
            inp.addEventListener('keydown',ev=>{
              if(ev.key!=='Enter'&&ev.key!=='Tab') return; ev.preventDefault();
              const all=[...matSection.querySelectorAll('input')];
              const idx=all.indexOf(ev.target);
              if(idx>=0&&idx<all.length-1) all[idx+1].focus(); else doResolve();
            });
            td.appendChild(inp); tr.appendChild(td); row.push(inp);
          }
          tbl.appendChild(tr); cells.push(row);
        }
        matInputCells[name]=cells;
        ml.appendChild(lp); ml.appendChild(tbl); ml.appendChild(rp);
        wrap.appendChild(ml); matSection.appendChild(wrap);
      }
      sec4.appendChild(matSection);

      const actions=document.createElement('div');
      actions.style.cssText='margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;';
      const resolveBtn=document.createElement('button'); resolveBtn.type='button'; resolveBtn.className='primary'; resolveBtn.textContent='RESOLVER SISTEMA';
      const backBtn=document.createElement('button'); backBtn.type='button'; backBtn.textContent='CAMBIAR ECUACIONES';
      actions.appendChild(resolveBtn); actions.appendChild(backBtn);
      sec4.appendChild(actions);
      const errDiv4=document.createElement('div'); sec4.appendChild(errDiv4);

      function doResolve(){
        clearEl(errDiv4);
        const matMap={};
        try {
          for (const name of gAnalysis.matrixNames){
            const cells=matInputCells[name]; const mat=[];
            for (let i=0;i<gRows;i++){
              const row=[];
              for (let j=0;j<gCols;j++){
                const v=cells[i][j].value.trim().replace(',','.');
                if(!v){ showError('Falta un valor en '+name+' (fila '+(i+1)+', columna '+(j+1)+').',errDiv4); return; }
                row.push(v);
              }
              mat.push(row);
            }
            matMap[name]=mat;
          }
          const sol=computeSystemSolution(gAnalysis,matMap,gRows,gCols);
          renderResolvedInputSummary(gAnalysis,matMap);
          displaySolution(gAnalysis,matMap,gRows,gCols,sol);
        } catch(e){ showError(typeof e==='string'?e:e.message,errDiv4); }
      }

      resolveBtn.addEventListener('click',doResolve);
      backBtn.addEventListener('click',initFase1);
      const fi=matSection.querySelector('input');
      if(fi) setTimeout(()=>fi.focus(),80); else setTimeout(()=>resolveBtn.focus(),80);
    }
  }

  function mostrarCalc(ev){
    if (ev) ev.preventDefault();
    const intro = $('introPrincipal');
    const calc = $('calculadora');
    if (intro) intro.style.display = 'none';
    if (calc){
      calc.style.display = 'flex';
      calc.style.flexDirection = 'column';
      calc.style.height = '100vh';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.display = 'flex';
      document.body.style.flexDirection = 'column';
      window.scrollTo(0,0);
      requestAnimationFrame(() => {
        const f = calc.querySelector('input');
        if (f) try { f.focus(); } catch(e) {}
      });
    }
  }

  function mostrarIntro(ev){
    if (ev) ev.preventDefault();
    const intro = $('introPrincipal');
    const calc = $('calculadora');
    if (calc) calc.style.display = 'none';
    if (intro){
      intro.style.display = 'block';
      document.documentElement.style.overflow = '';
      document.body.style.overflow = 'auto';
      document.body.style.display = 'block';
      window.scrollTo(0,0);
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (window.renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters:[
          {left:'\\[', right:'\\]', display:true},
          {left:'\\(', right:'\\)', display:false}
        ],
        throwOnError:false
      });
    }

    document.querySelectorAll('.js-show-calc').forEach(btn => {
      btn.addEventListener('click', mostrarCalc);
    });

    caja1 = $('caja1');
    caja21 = $('caja21');
    if (!caja1 || !caja21) return;

    const btnVolver = $('btnVolverExplicacion');
    if (btnVolver) btnVolver.addEventListener('click', mostrarIntro);

    const btnReset = $('btnReset');
    if (btnReset) btnReset.addEventListener('click', ev => { ev.preventDefault(); initFase1(); });

    const btnAyuda = $('abreVentana1');
    const ventana1 = $('ventana1');
    const cierraV1 = $('cierraVentana1');
    const pdf1 = $('pdf1');
    if (btnAyuda && ventana1) {
      btnAyuda.addEventListener('click', ev => {
        ev.preventDefault();
        if (pdf1 && !pdf1.src.includes('Ayuda.pdf')) pdf1.src = 'INSTRUCCIONES/Ayuda.pdf#view=FitH&navpanes=0&zoom=300';
        ventana1.style.display = 'flex';
      });
    }
    if (cierraV1 && ventana1) cierraV1.addEventListener('click', () => { ventana1.style.display = 'none'; if (pdf1) pdf1.src = ''; });
    if (ventana1) ventana1.addEventListener('click', ev => { if (ev.target === ventana1) { ventana1.style.display = 'none'; if (pdf1) pdf1.src = ''; } });

    new MutationObserver(() => {
      requestAnimationFrame(() => { caja21.scrollTop = caja21.scrollHeight; });
    }).observe(caja21, { childList:true, subtree:true });

    initFase1();
  });

  window.mostrarCalc = mostrarCalc;
  window.mostrarIntro = mostrarIntro;
  window.SistemasEcuacionesMatriciales = {
    analyzeSystem,
    computeSystemSolution,
    parseLinearEquation
  };
})();
