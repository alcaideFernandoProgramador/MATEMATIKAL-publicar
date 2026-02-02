/*ÍNDICE

FRACCIÓN GENERATRIZ DE UN NúMERO DECIMAL (MÉTODO FRACCION CONTINUA)                           fraccionContinua(decimal,long):resultado string
DIVISORES de UN NÚMERO                                                                        divisores(num): array
mcd DE DOS NÚMEROS                                                                            mcd(a, b): numero
mcd DE UN ARRAY NUMÉRICO                                                                      mcdArray(array): numero
mcm DE DOS NÚMEROS                                                                            mcm(a, b): numero 
mcm DE UN ARRAY NUMÉRICO                                                                      mcmArray(array): numero      
COMPROBAR SI UN NÚMERO ES PRIMO                                                               esPrimo(numero): boolean
FACTORIZAR UN NÚMERO                                                                          factorizarNumero(numero): array [matriz de factores, resultado cadena]        
OBTENER TODAS LAS COMBINACIONES SIN REPETICIÓN CON UNA LONGITUD DADA                          obtenerCombinacionesSinRepeticion(conjunto, n): array con las colecciones

CLASES:

CLASE MONOMIO: Monomio
Constructor: new Monomio(coeficiente:number,variables?:Record<string,number>): instancia
[Métodos de instancia]
  instancia.ordenarVariables(): vacío — modifica this.variables ordenándolas alfabéticamente (in place)
  instancia.obtenerNombresDeVariables(): lista de cadenas
  instancia.toString(): cadena
[Métodos estáticos]
  Monomio.compararVariables(varsA:Record<string,number>,varsB:Record<string,number>): booleano
  Monomio.parseMonomio(cadena:string|Monomio): instancia
  Monomio.dividir(m1:string|Monomio,m2:string|Monomio): cadena
  Monomio.multiplicar(m1:string|Monomio,m2:string|Monomio): cadena
  Monomio.sumar(m1:string|Monomio,m2:string|Monomio): cadena
  Monomio.restar(m1:string|Monomio,m2:string|Monomio): cadena
  Monomio.gradoVariable(cadena:string|Monomio,variableBuscada:string): número
  Monomio.eliminarVariable(cadena:string|Monomio,variableEliminar:string): cadena
  Monomio.grado(monomio:string|Monomio): número
  Monomio.obtenerExponenteVariable(cadena:string|Monomio,variable:string): número
  Monomio.obtenerMonomiosDivisores(monomio:string|Monomio): lista de cadenas
  Monomio.variablesRepetidas(monomio:string|Monomio): lista de cadenas
  Monomio.obtenerCoeficiente(cadena:string|Monomio): número
  Monomio.obtenerVariables(cadena:string|Monomio): lista de cadenas
  Monomio.obtenerParteLiteral(cadena:string|Monomio): cadena


CLASE POLINOMIO: Polinomio
Constructor: new Polinomio(monomios?:Monomio[]): instancia
[Métodos de instancia]
  instancia.simplificarInterno(): vacío — modifica this.monomios combinando monomios semejantes (in place)
  instancia.toString(): cadena
[Métodos estáticos]
  Polinomio.parsePolinomio(cadena:string): instancia
  Polinomio.simplificar(cadena:string): cadena
  Polinomio.ordenarTotal(cadena:string): cadena
  Polinomio.sumar(p1:string,p2:string): cadena
  Polinomio.restar(p1:string,p2:string): cadena
  Polinomio.multiplicar(p1:string,p2:string): cadena
  Polinomio.simplificarFactorComunCoeficientes(cadenaPolinomio:string): cadena
  Polinomio.factorComun(cadenaPolinomio:string): par de cadenas: el factor común y la cadena resultante
  Polinomio.obtenerMonomiosDivisores(cadena:string): lista de cadenas
  Polinomio.ordenarPorVariable(cadena:string,variable:string): cadena
  Polinomio.coeficientesPotenciasDecrecientesVariable(cadena:string,variable:string): lista de cadenas
  Polinomio.coeficientesPotenciasCrecientesVariable(cadena:string,variable:string): lista de cadenas
  Polinomio.grado(polinomio:string): número
  Polinomio.gradoVariable(cadena:string,variable:string): número
  Polinomio.elegirMonomioMayorGrado(cadena:string): cadena
  Polinomio.elegirMonomioMayorGradoVariable(cadena:string,variable:string): cadena
  Polinomio.dividirUnaVariable(polinomio1:string,polinomio2:string): par de cadenas (cociente y resto)
  Polinomio.dividir(polinomio1:string,polinomio2:string): par de cadenas (cociente y resto)
  Polinomio.factorizar(cadena:string): lista de cadenas
  Polinomio.factoresCanonicos(cad:string): lista de cadenas
  Polinomio.mcd(p1:string,p2:string): cadena
  Polinomio.mcdMonico(p1:string,p2:string): cadena
  Polinomio.mcdArray(array:string[]): cadena
  Polinomio.mcm(a:string,b:string): cadena
  Polinomio.mcmArray(array:string[]): cadena
  Polinomio.monomiosDecrecientes(cadena:string): lista de cadenas
  Polinomio.monomiosCrecientes(cadena:string): lista de cadenas
  Polinomio.raicesPolinomioUnaVariable(poli:string): lista de cadenas
  Polinomio.raicesPolinomioUnaVariableValores(poli:string): lista de cadenas
  Polinomio.raices(poli:string): lista de cadenas
  Polinomio.raicesValores(poli:string): lista de cadenas
  Polinomio.variables(poli:string): lista de cadenas
  Polinomio.coeficientes(poli:string): lista de cadenas
  Polinomio.coeficientesCrecientesAExpresion(coef:(string|number)[],letr:string): cadena
  Polinomio.coeficientesDecrecientesAExpresion(coef:(string|number)[],letr:string): cadena
  Polinomio.quitarDenominadores(poli:string): par de cadenas (polinomio resultante y factor por el que se ha multiplicado)
  Polinomio.desarrollarFactores(factores:string[]): cadena
  Polinomio.monomios(pol:string): lista de cadenas
  Polinomio.monomiosMayorGrado(pol:string): lista de cadenas
  Polinomio.ordenarPolinomiosGrado(p1:string,p2:string): par de cadenas (polinomios ordenados)
  Polinomio.ordenarArrayPolinomiosGrado(array:string[]): lista de cadenas


CLASE FRACCION NUMÉRICA: FraccionNumerica
Constructor: new FraccionNumerica(fraccion:string): instancia
[Métodos de instancia]
  (no hay métodos de instancia)
[Métodos estáticos]
  FraccionNumerica.parseFraccion(cadena:string): par de cadenas (numerador y denominador)
  FraccionNumerica.sumar(frac1:string,frac2:string): cadena
  FraccionNumerica.restar(frac1:string,frac2:string): cadena
  FraccionNumerica.multiplicar(frac1:string,frac2:string): cadena
  FraccionNumerica.dividir(frac1:string,frac2:string): cadena
  FraccionNumerica.simplificar(fraccion:string): cadena
  FraccionNumerica.potencia(frac:string,númeroEntero:number): cadena
  FraccionNumerica.numerador(fraccion:string): cadena
  FraccionNumerica.denominador(fraccion:string): cadena


CLASE FRACCIÓN ALGEBRAICA: FraccionAlgebraica
Constructor: new FraccionAlgebraica(fraccion:string): instancia
[Métodos de instancia]
  instancia.toString(): cadena
[Métodos estáticos]
  FraccionAlgebraica.parseFraccion(cadena:string): par de instancias de Polinomio (numerador y denominador)
  FraccionAlgebraica.simplificar(cadena:string): cadena
  FraccionAlgebraica.sumar(frac1:string|FraccionAlgebraica,frac2:string|FraccionAlgebraica): cadena
  FraccionAlgebraica.restar(frac1:string|FraccionAlgebraica,frac2:string|FraccionAlgebraica): cadena
  FraccionAlgebraica.multiplicar(frac1:string|FraccionAlgebraica,frac2:string|FraccionAlgebraica): cadena
  FraccionAlgebraica.dividir(frac1:string|FraccionAlgebraica,frac2:string|FraccionAlgebraica): cadena
  FraccionAlgebraica.esFraccionAlgebraica(cadena:string): booleano
  FraccionAlgebraica.quitarDenominadoresArray(array:string[]): 
           tupla [lista de cadenas sin denominadores resultante, polinomio por el que se multiplica, raíces del común denominador, valores de las raíces]
  FraccionAlgebraica.numerador(frac:string): cadena
  FraccionAlgebraica.denominador(frac:string): cadena


CLASE EXPRESIÓN NUMÉRICA: ExpresionNumerica
Constructor: new ExpresionNumerica(expresion:string): instancia
[Métodos de instancia]
  (no hay métodos de instancia)
[Métodos estáticos]
  ExpresionNumerica.esValida(expresion:string): true ó [false,tipo de error]
  ExpresionNumerica.infijaAPostfija(expresion:string): lista de cadenas
  ExpresionNumerica.postfijaAInfija(salida:string[]): cadena ó [false,tipo de error]
  ExpresionNumerica.calcular(expresion:string): cadena


CLASE EXPRESIÓN ALGEBRAICA: ExpresionAlgebraica
Constructor: new ExpresionAlgebraica(expresion:string): instancia
[Métodos de instancia]
  (no hay métodos de instancia)
[Métodos estáticos]
  ExpresionAlgebraica.esValida(expresion:string): booleano
  ExpresionAlgebraica.pasarADecimal(expres:string): cadena
  ExpresionAlgebraica.pasarAFraccion(expr:string,long?:number): cadena
  ExpresionAlgebraica.sustituir(exp:string,letra:string,valor:string|number): cadena
  ExpresionAlgebraica.infijaAPostfija(expresion:string): lista de cadenas
  ExpresionAlgebraica.postfijaAInfija(salida:string[]): cadena o falso
  ExpresionAlgebraica.simplificar(exp:string): cadena
  ExpresionAlgebraica.obtenerFactores(expresion:string): lista de cadenas
  ExpresionAlgebraica.notacionConProductos(exp:string): cadena
  ExpresionAlgebraica.notacionSinProductos(expre:string): cadena
  ExpresionAlgebraica.restarCadenaRango(cadena:string,ini:number,fin:number): cadena
  ExpresionAlgebraica.pasarALatex(exp:string): cadena
  ExpresionAlgebraica.evaluarGradoPolinomioEPF(expresion:string[]): número
  ExpresionAlgebraica.evaluarGradoPolinomioEIF(expresion:string): número
  ExpresionAlgebraica.eliminarParentesisInnecesarios(exp:string): cadena
  ExpresionAlgebraica.emparejarPrimerParentesis(cadena:string): tupla [número,número]
  ExpresionAlgebraica.emparejarParentesis(cadena:string): lista de tuplas [número,número]


CLASE MATRIZ: Matriz
Constructor: new Matriz(array:any[][]): instancia
[Métodos de instancia]
  (no hay métodos de instancia)
[Métodos estáticos]
  Matriz.sumar(matrizA:string[][],matrizB:string[][]): matriz de cadenas
  Matriz.restar(matrizA:string[][],matrizB:string[][]): matriz de cadenas
  Matriz.multiplicar(matrizA:string[][],matrizB:string[][]): matriz de cadenas
  Matriz.multiplicarEscalar(numero:string|number,matriz:string[][]): matriz de cadenas
  Matriz.trasponer(matriz:any[][]): matriz
  Matriz.filasNulasAbajo(matriz:any[][]): matriz
  Matriz.ordenarFilasPorCeros(mat:any[][]): matriz
  Matriz.reducida(matriz:string[][]): matriz de cadenas
  Matriz.reducidaNoNormalizada(matriz:string[][]): matriz de cadenas
  Matriz.escalonarMatrizNumerica(matriz:(number|string)[][]): matriz de cadenas
  Matriz.escalonarMatriz(matriz:string[][],letra:string): tupla [matriz de cadenas, lista de cadenas]
  Matriz.rangoMatrizNumerica(matriz:(number|string)[][]): número
  Matriz.rango(matriz): array de rango por casos
  Matriz.simplificarFilasMatrizNumerica(matr:number[][]): matriz numérica
  Matriz.simplificarFilas(matr:string[][]): tupla [matriz de cadenas, lista de cadenas, lista de listas de cadenas, lista de listas de cadenas]
  Matriz.simplificarFilasNumericas(matr:(number|string)[][]): matriz de cadenas
  Matriz.compararMatrices(matriz1:any[][],matriz2:any[][]): booleano
  Matriz.eliminarFilasNulas(matri:(number|string)[][]): matriz
  Matriz.simplificarElementosMatriz(matriz:string[][]): matriz de cadenas
  Matriz.sustituir(matriz:string[][],letra:string,valor:string|number): matriz de cadenas
  Matriz.esMatrizEscalonada(matr:string[][]): booleano
  Matriz.menor(mat:any[][],filMenor:number[],colMenor:number[]): matriz
  Matriz.quitarFilayColumna(matriz:any[][],fila:number,columna:number): matriz
  Matriz.determinanteNumerico(det:number[][]): número o nulo
  Matriz.determinante(det:string[][]): cadena o nulo
  Matriz.aString(mat:any[][]): matriz de cadenas
  Matriz.aNumerica(mat:any[][]): matriz numérica
  Matriz.aLatex(mat:string[][]): matriz de cadenas
  Matriz.permutarFilas(matriz:any[][],fila1:number,fila2:number): matriz
  Matriz.permutarColumnas(matriz:any[][],columna1:number,columna2:number): matriz
  Matriz.quitarDenominadores(matr:string[][]): tupla [matriz de cadenas, lista de cadenas, lista de cadenas]
  Matriz.comprobarLineaNula(mat:(number|string)[][]): booleano
  Matriz.buscarLineaCasiNula(mat:(number|string)[][]): lista de cadenas
  Matriz.lineaNula(mat:(number|string)[][]): cadena
  Matriz.comprobarLineasIguales(mat:any[][]): booleano
  Matriz.lineasIguales(mat:any[][]): cadena
  Matriz.sonFilasProporcionales(linea1:number,linea2:number,mat:string[][]): booleano
  Matriz.sonColumnasProporcionales(col1:number,col2:number,mat:string[][]): booleano
  Matriz.comprobarLineasProporcionales(mat:string[][]): booleano
  Matriz.lineasProporcionales(mat:string[][]): cadena
  Matriz.comprobarNumerica(matriz:any[][]): booleano
  Matriz.elegirLineaConMasCeros(det:string[][]): cadena
  Matriz.reducirDeterminante(determinante:string[][],linea:string): tupla [matriz de cadenas, cadena]
  Matriz.cambioGauss(matriz:string[][],linea:string,fP:number,cP:number): matriz de cadenas
  Matriz.inversaGauss(matriz:string[][]): matriz de cadenas
  Matriz.adjunta(matriz:string[][]): matriz de cadenas
  Matriz.inversa(matriz:string[][]): matriz de cadenas
  Matriz.identidad(número:number): matriz de cadenas
  Matriz.opuesta(matriz:string[][]): matriz de cadenas
  Matriz.potencia(matriz:string[][],n:number): matriz de cadenas
  Matriz.pasarAFraccion(matriz:string[][]): matriz de cadenas
  Matriz.pasarADecimal(matriz:string[][]): matriz de cadenas
  Matriz.cambiarFila(matriz,cadena): nueva matriz


CLASE SISTEMA: Sistema
Constructor: new Sistema(matriz:any[][]): instancia
[Métodos de instancia]
  (no hay métodos de instancia)
[Métodos estáticos]
  Sistema.numeroEcuaciones(matriz:any[][]): número
  Sistema.numeroIncognitas(matriz:any[][]): número
  Sistema.discutir(matri:(number|string)[][]): cadena  // "I", "CD" o "CI"
  Sistema.resolverSistemaCD(matri:(number|string)[][]): lista de números
  Sistema.resolverSistemaCI(matri:(number|string)[][]): matriz numérica
  Sistema.resolverSistema(matri:(number|string)[][]): tupla [cadena, "Sin solución" | lista de números | matriz numérica]


CLASE RESOLVER: Resolver
Constructor: new Resolver(ecuacion:cadena): instancia
[Métodos de instancia]
  (no hay métodos de instancia)
[Métodos estáticos]
  Resolver.ecuacion(expresion:cadena): lista de cadenas  // Resuelve f(x)=0 (simplifica, toma numerador) y devuelve raíces simbólicas tipo "x=...".
  Resolver.ecuacionValores(expresion:cadena): lista de cadenas  // Igual que arriba pero devuelve solo los valores (sin "x="), como cadenas.
  Resolver.ecuacionPolinomio(polinomio:cadena): lista de cadenas  // Raíces simbólicas del polinomio dado.
  Resolver.ecuacionPolinomioValores(polinomio:cadena): lista de cadenas  // Valores de las raíces del polinomio dado.
  Resolver.determinante(matriz:(número|cadena)[][]): lista de cadenas  // Calcula det(M), resuelve det(M)=0 y devuelve raíces simbólicas.
  Resolver.determinanteValores(matriz:(número|cadena)[][]): lista de cadenas  // Igual que arriba pero devuelve solo valores de las raíces.

CLASE REPRESENTAR: Representar
Constructor: (no aplica)
[Métodos de instancia]
  (no hay métodos de instancia)
[Métodos estáticos]
  Representar.mostrarError(cajaError:HTMLElement, mensaje:cadena): indefinido  // Muestra el mensaje en rojo en el elemento.
  Representar.imprimeValoresMatriz(val:cadena[][], lug:HTMLElement): indefinido  // Crea una tabla y renderiza cada celda con KaTeX.
  Representar.abrirParentesis(n:número, lugar:HTMLElement): indefinido  // Dibuja en KaTeX un gran paréntesis izquierdo con n filas vacías.
  Representar.cerrarParentesis(n:número, lugar:HTMLElement): indefinido  // Dibuja el paréntesis derecho con n filas vacías.
  Representar.abrirBarra(n:número, lugar:HTMLElement): indefinido  // Dibuja una barra vertical izquierda (determinante) con n filas vacías.
  Representar.abrirLlave(n:número, lugar:HTMLElement): indefinido  // Dibuja una llave izquierda con n filas vacías.
  Representar.simboloEscalonarMatriz(n:número, lugar:HTMLElement): indefinido  // Inserta el símbolo "=̲ escalonar" centrado en altura n.
  Representar.simboloReducirDeterminante(linea:cadena, n:número, lugar:HTMLElement): indefinido  // Inserta "Red F_i / C_j" como operación de reducción.
  Representar.simboloPermutarFilas(a:número, b:número, n:número, lugar:HTMLElement): indefinido  // Muestra F_a ↔ F_b.
  Representar.simboloPermutarColumnas(a:número, b:número, n:número, lugar:HTMLElement): indefinido  // Muestra C_a ↔ C_b.
  Representar.simboloDividirFila(a:número, b:cadena|número, n:número, lugar:HTMLElement): indefinido  // Muestra F_a → (1/b)·F_a.
  Representar.simboloDividirColumna(a:número, b:cadena|número, n:número, lugar:HTMLElement): indefinido  // Muestra C_a → (1/b)·C_a.
  Representar.simboloFilasNulasAbajo(n:número, lugar:HTMLElement): indefinido  // Inserta indicación "Filas↓".
  Representar.simboloEliminarFilasNulas(n:número, lugar:HTMLElement): indefinido  // Inserta indicación de eliminar filas nulas.
  Representar.simboloSimplificarFilas(n:número, lugar:HTMLElement): indefinido  // Inserta indicación de simplificación de filas.
  Representar.simboloCambiarFila(a:número, b:número, m:cadena|número, n:cadena|número, h:número, lugar:HTMLElement): indefinido  
                   // Renderiza operación F_a → m·F_a + n·F_b (KaTeX), con formateo seguro.
  Representar.simboloCambiarColumna(a:número, b:número, m:cadena|número, n:cadena|número, h:número, lugar:HTMLElement): indefinido  // Renderiza operación C_a → m·C_a + n·C_b.
  Representar.simboloLineasIguales(n:número, lugar:HTMLElement): indefinido  // Muestra anotación "Líneas iguales = 0".
  Representar.simboloLineasProporcionales(n:número, lugar:HTMLElement): indefinido  // Muestra anotación "Líneas proporcionales = 0".
  Representar.matriz(mat:(número|cadena)[][], lug:HTMLElement): indefinido  // Renderiza la matriz como LaTeX (paréntesis) aplicando pasarAFraccion y aLatex.
  Representar.determinante(mat:(número|cadena)[][], lug:HTMLElement): indefinido  // Renderiza la matriz entre barras (determinante) en LaTeX.
  Representar.sistemaCompleto(matri:(número|cadena)[][], lugar:HTMLElement): indefinido  // Renderiza el sistema lineal completo en LaTeX { ecuaciones }.
  Representar.matrizGauss(mat:(número|cadena)[][], lug:HTMLElement): indefinido  // Renderiza matriz aumentada con barra vertical.
  Representar.crearTabla(n:número, m:número, lug:HTMLElement): indefinido  // Crea una tabla HTML n×m con celdas vacías (ids colij).
  Representar.solucionesSistemaLineal(mat:número[][], lug:HTMLElement): indefinido  // Discute y muestra soluciones: única (vector) o infinitas (parametrización) en KaTeX.
  Representar.determinanteOrden2(deter:número[][], lug:HTMLElement): indefinido  // Muestra fórmula a·d−b·c y su evaluación/latex.
  Representar.determinanteOrden3(deter:número[][], lug:HTMLElement): indefinido  // Muestra regla de Sarrus en LaTeX y el valor.
  Representar.determinanteOrden3Desarrollo(deter:número[][], lug:HTMLElement): indefinido  // Igual que anterior pero preparado para coeficiente global (usa variable externa).
  Representar.determinanteSarrus(deter:número[][], lug:HTMLElement): indefinido  // Escribe la expansión de Sarrus como texto y el valor numérico.
  Representar.fraccion(frac:cadena, n:número, lugar:HTMLElement): indefinido  // Renderiza una fracción algebraica como \frac{…}{…} con signo separado.
  Representar.coeficienteDeterminante(frac:cadena, n:número, lugar:HTMLElement): indefinido  // Muestra el coeficiente (1, −1 o racional) previo a un det.
  Representar.expresion(exp:cadena, lugar:HTMLElement): indefinido  // Renderiza una expresión en LaTeX.
  Representar.matrizALatex(matriz:cadena[][], tipo:cadena="pmatrix"): cadena  // Devuelve LaTeX de la matriz con el entorno dado.
  Representar.expresionMatricial(exp:cadena, matr:{nombre:cadena,array:cadena[][]}[], lugar:HTMLElement): indefinido  
        // Renderiza una expresión matricial sustituyendo nombres por matrices (transpuesta/potencias) en KaTeX.
  Representar.expresionMatricialIntermedia(exp:cadena, matr:{nombre:cadena,array:cadena[][]}[], lugar:HTMLElement): indefinido  
        // Igual que arriba pero para un paso intermedios (solo la expresión procesada).


CLASE VALIDAR: Validar
Constructor:(no tiene)
[Métodos de instancia](no hay métodos de instancia)
[Métodos estáticos]
  Validar.validarEntradaNumeroEnteroPositivo(valor:any): número. Lanza Error("entradaInvalida") si no es entero positivo.
  Validar.validarExpresionParentesisBalanceados(expresion:string): booleano. Lanza Error si los paréntesis no están balanceados.
  Validar.expresionParentesisBalanceadosYCaracteresValidos(expresion:string): void. Lanza Error si está vacía, si hay paréntesis desbalanceados o caracteres no válidos.
  Validar.expresionNumerica(expr:string): [true, array postFija, infija] Ó [false, error]
  Validar.expresionAlgebraica(expr:string): [true, array postFija, infija] Ó [false, error]
  Validar.expresionMatricial(expresion): : [true, array postFija, infija] Ó [false, error]
  Validar.polinomio(expr:string):[true, cadenaPostfija:string, cadenaInfija:string, polinomio:string] ó [false, cadenaError:string]


CLASE CREAR: Crear
Constructor:(no tiene)
[Métodos de instancia](no hay métodos de instancia)
[Métodos estáticos]
  Crear.matrices(lugar: HTMLElement, matricesCreadas: Array<{nombre:string, matriz:string[][]}>): Promise<void> Procede y guarda los datos en matricesCreadas


CLASE EXPRESIÓN MATRICIAL: ExpresionMatricial
Constructor:(no tiene)
[Métodos de instancia](no hay métodos de instancia)
[Métodos estáticos]
  ExpresionMatricial.esValida(exp: string): boolean
  ExpresionMatricial.obtenerVariables(exp: string): string[]
  ExpresionMatricial.infijaAPostfija(exp: string): string[]
  ExpresionMatricial.postfijaAInfija(array): cadena
  ExpresionMatricial.simplificar(exp: string): string
  ExpresionMatricial.pasarALatex(exp: string): string
  ExpresionMatricial.simplificarExpresionIntermedia(exp: string,matr: Array<{ nombre: string, array: string[][] }>,lugar: HTMLElement): string | string[][]
  ExpresionMatricial.calcular(exp: string,matr: Array<{ nombre: string, matriz: string[][] }>): string | string[][]
  ExpresionMatricial.notacionConProductos(cad: string): string
 
  



*/
const VAR_CHR = "[A-Za-z\\u0370-\\u03FF]";      
const VAR_TOKEN = `${VAR_CHR}(?:_[0-9]+)?`;     
const greek = Object.freeze({
  alpha: '\u03B1', beta: '\u03B2', gamma: '\u03B3', delta: '\u03B4',epsilon: '\u03B5', zeta: '\u03B6', eta: '\u03B7', theta: '\u03B8',
  iota: '\u03B9', kappa: '\u03BA', lambda: '\u03BB', mu: '\u03BC',nu: '\u03BD', xi: '\u03BE', omicron: '\u03BF', pi: '\u03C0',
  rho: '\u03C1', sigmaf: '\u03C2', sigma: '\u03C3', tau: '\u03C4',upsilon: '\u03C5', phi: '\u03C6', chi: '\u03C7', psi: '\u03C8', omega: '\u03C9',
  Alpha: '\u0391', Beta: '\u0392', Gamma: '\u0393', Delta: '\u0394',Epsilon: '\u0395', Zeta: '\u0396', Eta: '\u0397', Theta: '\u0398',
  Iota: '\u0399', Kappa: '\u039A', Lambda: '\u039B', Mu: '\u039C',Nu: '\u039D', Xi: '\u039E', Omicron: '\u039F', Pi: '\u03A0',
  Rho: '\u03A1', Sigma: '\u03A3', Tau: '\u03A4', Upsilon: '\u03A5',Phi: '\u03A6', Chi: '\u03A7', Psi: '\u03A8', Omega: '\u03A9'});
const latexGreek = Object.freeze({alpha: '\\alpha', beta: '\\beta', gamma: '\\gamma', delta: '\\delta',
  epsilon: '\\epsilon', theta: '\\theta', lambda: '\\lambda', mu: '\\mu',pi: '\\pi', sigma: '\\sigma', phi: '\\phi', omega: '\\omega',
  Delta: '\\Delta', Pi: '\\Pi', Sigma: '\\Sigma', Phi: '\\Phi', Omega: '\\Omega'});



// VARIABLES GLOBALES
var matrizObjeto=null;
var matrizIntroducida;
var matricesCreadas=[];
var control="0";
var long=11;
var ordenVariables = ["x","y","z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w"];
var funciones = ["arcsin", "arccos", "arctan", "arcsen", "arctg","sqrt", "sin", "sen", "cos", "tan", "log", "ln", "tg", "abs", "exp"];
    funciones.sort((a, b) => b.length - a.length);

 //FRACCIÓN GENERATRIZ DE UN NúMERO DECIMAL (MÉTODO FRACCION CONTINUA) 
function fraccionContinua(decimal, long) {if(decimal==="Infinity"||decimal===Infinity){return "Error. División por cero"}
  const entero = Math.floor(decimal);let parteDecimal = decimal - entero;
  if (parteDecimal < 0.00000001) {return entero.toString();};const coeficientes = [entero];
  for (let i = 0; i < long; i++) {parteDecimal = 1 / parteDecimal;coeficientes.push(Math.floor(parteDecimal));
    parteDecimal = parteDecimal - Math.floor(parteDecimal);if (parteDecimal < 0.00001) {break;}}
  if (coeficientes.length < 2) {return entero.toString();}
  let resultado = FraccionNumerica.sumar(coeficientes[coeficientes.length - 2].toString(), FraccionNumerica.dividir("1", coeficientes[coeficientes.length - 1].toString()));
  for (let i = coeficientes.length - 2; i > 0; i--) 
    {resultado = FraccionNumerica.dividir("1", resultado);resultado = FraccionNumerica.sumar(coeficientes[i - 1].toString(), resultado);}
  let denomin = FraccionNumerica.denominador(resultado);let numera = FraccionNumerica.numerador(resultado);
  if (denomin === "1") {resultado = numera;}return resultado;}


function _toInt(x){x=Number(x);return Number.isFinite(x)&&Number.isInteger(x)?x:NaN;}

function divisores(num){num=Number(num);if(!Number.isFinite(num)||num%1!==0)return[];num=Math.abs(num);let dp=[],lim=Math.sqrt(num);
  for(let i=1;i<=lim;i++)if(num%i===0){dp.push(i);if(i*i!==num)dp.push(num/i);}dp.sort((a,b)=>a-b);
  return dp.concat(dp.map(d=>-d));}

function mcd(a,b){a=_toInt(a);b=_toInt(b);if(Number.isNaN(a)||Number.isNaN(b))return 1;a=Math.abs(a);b=Math.abs(b);
  if(a===0&&b===0)return 0;if(b===0)return a;return mcd(b,a%b);}

function mcdArray(array){if(array.length===0)return 0;if(array.length===1)return Math.abs(Number(array[0]));
  if(array.every(e=>Number(e)===0))return 0;let mcD=Math.abs(Number(array[0]));
  for(let j=1;j<array.length;j++)mcD=mcd(mcD,array[j]);return Math.abs(mcD);}

function mcm(a,b){a=_toInt(a);b=_toInt(b);if(Number.isNaN(a)||Number.isNaN(b))return NaN;
  if(a===0&&b===0)return 0;return Math.abs(a*b)/mcd(a,b);}

function mcmArray(array){if(!Array.isArray(array)||array.length===0)return 1;let a=Number(array[0]);if(!Number.isFinite(a))return NaN;
  let res=Math.abs(a);for(let i=1;i<array.length;i++){let n=Number(array[i]);if(!Number.isFinite(n))return NaN;res=mcm(res,n);}
  return Math.abs(res);}

function esPrimo(num){num=Number(num);if(!Number.isFinite(num)||!Number.isInteger(num)||num<=1)return false;
  if(num<=3)return true;if(num%2===0||num%3===0)return false;for(let i=5;i*i<=num;i+=6)if(num%i===0||num%(i+2)===0)return false;
  return true;}

function factorizarNumero(num){num=Number(num);if(!Number.isFinite(num)||!Number.isInteger(num))return NaN;
  if(num===0)return[[], "No factorizable"];if(num===1)return[[1], "1"];let neg=num<0;num=Math.abs(num);
  if(esPrimo(num)){let m=[[num,1]],e=(neg?"-1·":"")+num.toString();return[m,e];}
  let dp=[],divs=divisores(num);for(let i=0;i<divs.length;i++)if(divs[i]>1&&divs[i]!==num&&esPrimo(divs[i]))dp.push(divs[i]);
  let md=[];for(let i=0;i<dp.length;i++){md[i]=[dp[i]];let mult=1,pot=dp[i]**2;while(num%pot===0){mult++;pot*=dp[i];}md[i].push(mult);}
  let expr=neg?"-1·":"";for(let i=0;i<md.length;i++){expr+=md[i][0];if(md[i][1]!==1)expr+="^"+md[i][1];expr+="·";}
  expr=expr.slice(0,-1);return[md,expr];}



// OBTENER TODAS LAS COMBINACIONES SIN REPETICIÓN CON UNA LONGITUD DADA
function obtenerCombinacionesSinRepeticion(conjunto, n) {const resultados = [];
    function generarCombinaciones(actual, inicio) {if (actual.length === n) {resultados.push([...actual]);return;}
  for (let i = inicio; i < conjunto.length; i++) {actual.push(conjunto[i]);generarCombinaciones(actual, i + 1);actual.pop();}}
  generarCombinaciones([], 0);return resultados;}



//CLASE MONOMIO
class Monomio {
  constructor(coeficiente, variables) {this.coeficiente = Math.abs(coeficiente) < 1e-11 ? 0 :coeficiente;
     if(coeficiente===-0){coeficiente=0};this.variables = variables || {};this.ordenarVariables();}
  ordenarVariables() {const variablesOrdenadas = {};for (const variable of Object.keys(this.variables).sort()) 
    {variablesOrdenadas[variable] = this.variables[variable];};this.variables = variablesOrdenadas;}
  obtenerNombresDeVariables() {return Object.keys(this.variables);}
  toString() {if (this.coeficiente === 0) return "0";const vars = Object.keys(this.variables);let result = "";
    if (this.coeficiente === 1 && vars.length > 0) {} else if (this.coeficiente === -1 && vars.length > 0) {result = "-";} 
    else {result = this.coeficiente.toString();}
    for (const variable of vars) {const exponente = this.variables[variable];result += variable;if (exponente !== 1) result += `^${exponente}`;};
    return result || "1";}
  static compararVariables(varsA, varsB) {const keysA = Object.keys(varsA).sort();const keysB = Object.keys(varsB).sort();
    if (keysA.length !== keysB.length) return false;
    for (let i = 0; i < keysA.length; i++) {if (keysA[i] !== keysB[i]) return false;if (Math.abs(varsA[keysA[i]]-varsB[keysB[i]]) > 1e-11) return false;}
    return true;}
  static parseMonomio(cadena) {cadena = cadena.replace(/\s+/g, "");cadena = cadena.replace(/^\s*\+?/g, '');cadena = cadena.replace(/(\()\s*\+/g, '$1');
    cadena=ExpresionAlgebraica.eliminarParentesisInnecesarios(cadena);cadena=ExpresionAlgebraica.notacionSinProductos(cadena);
    if (cadena instanceof Monomio) return cadena;
    const mGlobal = cadena.match(/^([+\-]?)\(([^()]+)\)$/);if (mGlobal && /^[+\-]?[^+\-]+$/.test(mGlobal[2])) 
      {const signo = mGlobal[1] === '-' ? -1 : 1;const interior = mGlobal[2];const monInt = Monomio.parseMonomio(interior);
        return new Monomio(signo * monInt.coeficiente, monInt.variables);}
    const regexMonomioCompleto = new RegExp(`^[+-]?(?:\\d+(?:\\/\\d+)?|\\d*\\.?\\d+)?(?:${VAR_TOKEN}(?:\\^([()\\d.\\-/]+))?)*$`);
    if (!regexMonomioCompleto.test(cadena)) {throw new Error("Formato de monomio no válido. Se encontraron caracteres inesperados.");}
    let contadorParentesis = 0;for (const c of cadena) {if (c === "(") contadorParentesis++;else if (c === ")") contadorParentesis--;
      if (contadorParentesis < 0) throw new Error("Formato de monomio no válido: paréntesis desbalanceados.");}
      if (contadorParentesis !== 0) throw new Error("Formato de monomio no válido: paréntesis desbalanceados.");
    let coeficiente = 1;let variables = {};let restoCadena = cadena;
    const coeficienteRegex = /^([+-]?(?:\d+(?:\/\d+)?|\d*\.\d+|\d+)?)(?=[a-zA-Z]|$)/;const matchCoeficiente = restoCadena.match(coeficienteRegex);
    if (matchCoeficiente) {const coeficienteStr = matchCoeficiente[1];if (coeficienteStr === "" || coeficienteStr === "+") coeficiente = 1;
      else if (coeficienteStr === "-") coeficiente = -1;else if (coeficienteStr.includes("/")) 
        {const [numerador, denominador] = coeficienteStr.split("/").map(parseFloat);if (denominador !== 0) coeficiente = numerador / denominador;
        else throw new Error("Error: denominador nulo en coeficiente.");} else {coeficiente = parseFloat(coeficienteStr);}
        restoCadena = restoCadena.slice(matchCoeficiente[0].length);}
    const variableRegex = new RegExp(`(${VAR_TOKEN})(?:\\^([()\\d.\\-/]+))?`, 'g');let match;
    while ((match = variableRegex.exec(restoCadena)) !== null) {const variable = match[1];let exponenteStr = match[2];let exponente = 1;
      if (exponenteStr) {exponenteStr = exponenteStr.replace(/[()]/g, "");if (exponenteStr.includes("/")) 
      {const [numerador, denominador] = exponenteStr.split("/").map(parseFloat);if (denominador !== 0) exponente = numerador / denominador;
          else throw new Error("Error: denominador nulo en exponente.");} 
          else {exponente = parseFloat(exponenteStr);if (isNaN(exponente)) throw new Error("Exponente no válido.");}}
      if (Math.abs(exponente) > 1e-11) {variables[variable] = (variables[variable] || 0) + exponente;}}
    return new Monomio(coeficiente, variables);}
  static dividir(m1, m2) {const a = Monomio.parseMonomio(m1);const b = Monomio.parseMonomio(m2);let coef = a.coeficiente / b.coeficiente;
    coef = Math.abs(coef) < 1e-11 ? 0 : coef;const vars = { ...a.variables };
    for (const variable in b.variables) {vars[variable] = (vars[variable] || 0) - b.variables[variable];
      if (Math.abs(vars[variable]) < 1e-11) delete vars[variable];};return new Monomio(coef, vars).toString();}
  static multiplicar(m1, m2) {const a = Monomio.parseMonomio(m1);const b = Monomio.parseMonomio(m2);
    const coef = a.coeficiente * b.coeficiente;const vars = { ...a.variables };
    for (const variable in b.variables) {vars[variable] = (vars[variable] || 0) + b.variables[variable];
      if (Math.abs(vars[variable]) < 1e-11) delete vars[variable];};return new Monomio(coef, vars).toString();}
  static sumar(m1, m2) {const a = Monomio.parseMonomio(m1);const b = Monomio.parseMonomio(m2);
    if (!Monomio.compararVariables(a.variables, b.variables)) {if (typeof m2 === "string" && m2[0] === "-") return `${a.toString()}${m2}`;
      return `${a.toString()}+${b.toString()}`;}
    return new Monomio(a.coeficiente + b.coeficiente, a.variables).toString();}
  static restar(m1, m2) {const a = Monomio.parseMonomio(m1);const b = Monomio.parseMonomio(m2);
    if (!Monomio.compararVariables(a.variables, b.variables)) {if (typeof m2 === "string" && m2[0] === "-") return `${a.toString()}+${m2.slice(1)}`;
      return `${a.toString()}-${b.toString()}`;}
    const coef = a.coeficiente - b.coeficiente;return new Monomio(coef, a.variables).toString();}
  static gradoVariable(cadena, variableBuscada) {const monomio = Monomio.parseMonomio(cadena);
    return monomio.variables.hasOwnProperty(variableBuscada) ? monomio.variables[variableBuscada] : 0;}
  static eliminarVariable(cadena, variableEliminar) {const monomio = Monomio.parseMonomio(cadena);
    if (monomio.variables.hasOwnProperty(variableEliminar)) {delete monomio.variables[variableEliminar];}
    return new Monomio(monomio.coeficiente, monomio.variables).toString();}
  static grado(monomio) {const m = Monomio.parseMonomio(monomio);let sumaGrados = 0;
    for (let variable in m.variables) {sumaGrados += m.variables[variable];}return sumaGrados;}
  static obtenerExponenteVariable(cadena, variable) {const monomio = Monomio.parseMonomio(cadena);
    return monomio.variables.hasOwnProperty(variable) ? monomio.variables[variable] : 0;}
  static obtenerMonomiosDivisores(monomio) {
    function combinarNumerosYLetras(numeros, letras) {let resultado = [];
      function obtenerCombinaciones(letras, combinacionActual, index, letrasUsadas) {
        if (combinacionActual.length > 0) combinacionesDeLetras.push(combinacionActual);
        for (let i = index; i < letras.length; i++) {const letraBase = letras[i].split('^')[0];
          if (!letrasUsadas.has(letraBase)) {letrasUsadas.add(letraBase);
            obtenerCombinaciones(letras, combinacionActual + letras[i], i + 1, letrasUsadas);letrasUsadas.delete(letraBase);}}}
      let combinacionesDeLetras = [];obtenerCombinaciones(letras, '', 0, new Set());
      numeros.forEach(numero => {combinacionesDeLetras.forEach(combinacion => {resultado.push(numero + combinacion);});});
      return resultado;}
    const monomioParsed = Monomio.parseMonomio(monomio);let coefMonomio = monomioParsed.coeficiente;let letrasMonomio = Object.keys(monomioParsed.variables);
    let divisoresNumericos = divisores(coefMonomio); let letrasMonomioConExponentes = [];
    for (let variable of letrasMonomio) {let exponente = monomioParsed.variables[variable];letrasMonomioConExponentes.push(variable);
      for (let j = 2; j <= exponente; j++) {letrasMonomioConExponentes.push(`${variable}^${j}`);}}
    let combinaciones = combinarNumerosYLetras(divisoresNumericos, letrasMonomioConExponentes);combinaciones = [...divisoresNumericos, ...combinaciones];
    let depuracionCombinaciones = combinaciones.map(item => {let str = item.toString();
      str = str.replace(/^1(?=[a-zA-Z])/, '');str = str.replace(/^-1(?=[a-zA-Z])/, '-');return str;});return depuracionCombinaciones;}
  static variablesRepetidas(monomio) {const monomioParsed = Monomio.parseMonomio(monomio);
    let variablesRepetidas = [];
    for (let variable in monomioParsed.variables) {let exponente = monomioParsed.variables[variable];
      for (let i = 0; i < exponente; i++) {variablesRepetidas.push(variable);}};return variablesRepetidas;}
  static obtenerCoeficiente(cadena) {return Monomio.parseMonomio(cadena).coeficiente;}
  static obtenerVariables(cadena) {return Object.keys(Monomio.parseMonomio(cadena).variables);}
  static obtenerParteLiteral(cadena) {const monomioParsed = Monomio.parseMonomio(cadena);let parteLiteral = '';
    for (let variable in monomioParsed.variables) {parteLiteral += `${variable}`;if (monomioParsed.variables[variable] !== 1) 
      {parteLiteral += `^${monomioParsed.variables[variable]}`;}}return parteLiteral || '1';}
  }
  
//CLASE POLINOMIO
class Polinomio {
  constructor(monomios) {this.monomios = monomios || [];}
  simplificarInterno() {let mapaMonomios = {};for (let monomio of this.monomios) {
    let clave = JSON.stringify(Object.keys(monomio.variables).sort().reduce((acc, k) => { acc[k] = monomio.variables[k]; return acc; }, {}));
    if (mapaMonomios[clave]) {mapaMonomios[clave].coeficiente += monomio.coeficiente;} 
    else {mapaMonomios[clave] = new Monomio(monomio.coeficiente, { ...monomio.variables });}}
    this.monomios = Object.values(mapaMonomios).filter(m => Math.abs(m.coeficiente) > 1e-11);}
  toString() {if (this.monomios.length === 0) return '0';return this.monomios.map((monomio, index) => {let strMonomio = monomio.toString();
    return (index > 0 && !strMonomio.startsWith('-') ? '+' : '') + strMonomio;}).join('');}
  static parsePolinomio(cadena) {cadena = String(cadena).replace(/\s+/g, "");let prev;
    do {prev = cadena;cadena = cadena.replace(/^([+\-])\(([^()]+)\)$/,(_, sgn, inside) => {if (!/^[+\-]?[^+\-]+$/.test(inside)) return _;
        return sgn === '-'? (inside[0] === '-' ? inside.slice(1) : '-' + inside): (inside[0] === '+' ? inside.slice(1) : inside);});
        cadena = cadena.replace(/([+\-])\(([^()]+)\)/g,(m, sgn, inside) => {if (!/^[+\-]?[^+\-]+$/.test(inside)) return m;
        if (sgn === '+') return (inside[0] === '+' ? inside.slice(1) : inside);return (inside[0] === '-' ? '+' + inside.slice(1) : '-' + inside);});
      let prevSigns;do {prevSigns = cadena;cadena = cadena.replace(/\+\+/g, "+").replace(/--/g, "+").replace(/\+-/g, "-").replace(/-\+/g, "-");} 
      while (cadena !== prevSigns);} while (cadena !== prev);
    const num = '(?:\\d+(?:\\.\\d+)?(?:\\/\\d+(?:\\.\\d+)?)?)';const pow = '(?:\\^\\d+)';const VAR = `(?:${VAR_TOKEN}(?:${pow})?)`;const VS  = `(?:${VAR}+)`;let anterior;
    do {anterior = cadena;cadena = cadena.replace(new RegExp(`(${num})\\*(${num})`, 'g'),(_, a, b) => String(parseFloat(a) * parseFloat(b)));
      cadena = cadena.replace(new RegExp(`(${num})\\*(${VS})`, 'g'),'$1$2');cadena = cadena.replace(new RegExp(`(${VS})\\*(${num})`, 'g'),'$2$1');
      cadena = cadena.replace(new RegExp(`(${VS})\\*(${VS})`, 'g'),'$1$2');cadena = cadena.replace(new RegExp(`(${num})\\*\\s*([a-zA-Z])`, 'g'), '$1$2');
      cadena = cadena.replace(new RegExp(`([a-zA-Z])\\*\\s*([a-zA-Z])`, 'g'), '$1$2');} while (cadena !== anterior);
    const monomioRegex =new RegExp(`([+\\-]?(?:${num})?${VS})|([+\\-]?${num})`,'g');
    const monomios = [];let match;
    while ((match = monomioRegex.exec(cadena)) !== null) {const token = match[0];
     try {const mon = Monomio.parseMonomio(token);if (Math.abs(mon.coeficiente) > 1e-11) {monomios.push(mon);}} 
     catch (_) {}}
    monomios.sort((a, b) => {const gradoA = ExpresionAlgebraica.evaluarGradoPolinomioEIF(a.toString());
      const gradoB = ExpresionAlgebraica.evaluarGradoPolinomioEIF(b.toString());
      if (gradoA === gradoB) {const va = Object.keys(a.variables).sort().join('');const vb = Object.keys(b.variables).sort().join('');
      return va.localeCompare(vb);}return gradoB - gradoA;});
    return new Polinomio(monomios);}
  static simplificar(cadena) {let polinomio = Polinomio.parsePolinomio(cadena);polinomio.simplificarInterno();return polinomio.toString();}
  static ordenarTotal(cadena) {let polinomio = Polinomio.parsePolinomio(cadena);
    polinomio.monomios.sort((a, b) => {let gradoA = ExpresionAlgebraica.evaluarGradoPolinomioEIF(a.toString());
      let gradoB = ExpresionAlgebraica.evaluarGradoPolinomioEIF(b.toString());
      if (gradoA === gradoB) {let variablesA = Object.keys(a.variables).sort().join('');let variablesB = Object.keys(b.variables).sort().join('');
        return variablesA.localeCompare(variablesB);};return gradoB - gradoA;});return polinomio.toString();}
  static sumar(p1, p2) {let polinomio1 = Polinomio.parsePolinomio(p1);let polinomio2 = Polinomio.parsePolinomio(p2);
    let resultado = new Polinomio([...polinomio1.monomios, ...polinomio2.monomios]);resultado.simplificarInterno();return resultado.toString();}
  static restar(p1, p2) {let polinomio1 = Polinomio.parsePolinomio(p1);let polinomio2 = Polinomio.parsePolinomio(p2);
    let polinomioRestado = polinomio2.monomios.map(m => new Monomio(-m.coeficiente, m.variables));
    let resultado = new Polinomio([...polinomio1.monomios, ...polinomioRestado]);resultado.simplificarInterno();
    resultado.monomios = resultado.monomios.filter(m => Math.abs(m.coeficiente) > 1e-11);let ress = resultado.toString();
    if (ress[ress.length-1] === "-") ress = ress + "1";return ress;}
  static multiplicar(p1, p2) {let polinomio1 = Polinomio.parsePolinomio(p1);let polinomio2 = Polinomio.parsePolinomio(p2);let resultadoMonomios = [];
    for (let m1 of polinomio1.monomios) {for (let m2 of polinomio2.monomios) {let nuevoMonomio = Monomio.multiplicar(m1.toString(), m2.toString());
        resultadoMonomios.push(Monomio.parseMonomio(nuevoMonomio));}}
    let resultado = new Polinomio(resultadoMonomios);(resultado.simplificarInterno()); resultado=resultado.toString();return Polinomio.ordenarTotal(resultado)}
  static simplificarFactorComunCoeficientes(cadenaPolinomio){
    if (Polinomio.parsePolinomio(cadenaPolinomio).monomios.length === 1) 
         {return Monomio.dividir(cadenaPolinomio,Monomio.obtenerCoeficiente(cadenaPolinomio).toString());}
    let polinomio = Polinomio.parsePolinomio(cadenaPolinomio);let coeficienteComun = polinomio.monomios[0].coeficiente;
    for (let i = 1; i < polinomio.monomios.length; i++) {coeficienteComun = mcd(coeficienteComun, polinomio.monomios[i].coeficiente);}
    if (coeficienteComun!==1){cadenaPolinomio=Polinomio.dividir(cadenaPolinomio,coeficienteComun.toString())[0]};return cadenaPolinomio}
  static factorComun(cadenaPolinomio) {
    if (Polinomio.parsePolinomio(cadenaPolinomio).monomios.length === 1) 
      {return [Monomio.obtenerCoeficiente(cadenaPolinomio).toString(),Monomio.obtenerParteLiteral(cadenaPolinomio)];}
    let polinomio = Polinomio.parsePolinomio(cadenaPolinomio);if (polinomio.monomios.length === 0) return [cadenaPolinomio, "0"];
    let coeficienteComun = polinomio.monomios[0].coeficiente;
    for (let i = 1; i < polinomio.monomios.length; i++) {coeficienteComun = mcd(coeficienteComun, polinomio.monomios[i].coeficiente);}
    let variablesComunes = { ...polinomio.monomios[0].variables };
    for (let i = 1; i < polinomio.monomios.length; i++) {let variablesActuales = polinomio.monomios[i].variables;
        for (let variable in variablesComunes) {if (variablesActuales.hasOwnProperty(variable)) {
            variablesComunes[variable] = Math.min(variablesComunes[variable], variablesActuales[variable]);} 
            else {delete variablesComunes[variable];}}}
    let factorComun = new Monomio(coeficienteComun, variablesComunes);
    let nuevosMonomios = polinomio.monomios.map(monomio => {return Monomio.dividir(monomio.toString(), factorComun.toString());});
    let nuevoPolinomio = nuevosMonomios.join('+').replace(/\+\-/g, '-');return [factorComun.toString(), nuevoPolinomio];}
  static obtenerMonomiosDivisores(cadena) {let [factorComun, resto] = Polinomio.factorComun(cadena);
    let factoresSeparados = ExpresionAlgebraica.obtenerFactores(factorComun);let divisoresComunes = [];
    factoresSeparados.forEach(factor => {const numero = parseInt(factor, 10);if (!isNaN(numero)) {let divisoresNumericos = divisores(numero);
            divisoresComunes.push(...divisoresNumericos);} else {divisoresComunes.push(factor);}});
    for (let i=0;i<resto.length;i++){if(!resto.includes("+")&&!resto.includes("-")){factorComun=resto;resto =resto.replace(factorComun,'');break;}}
    let divisoresFactorComun = Monomio.obtenerMonomiosDivisores(factorComun);let divisoresResto = resto ? Polinomio.factorizar(resto) : [];
    let divisoresTotales =[...divisoresComunes,...divisoresFactorComun,...divisoresResto];divisoresTotales=divisoresTotales.map(valor=>valor.toString());
    divisoresTotales = [...new Set(divisoresTotales)];return divisoresTotales;}
  static ordenarPorVariable(cadena, variable) {let polinomio = Polinomio.parsePolinomio(cadena);
    polinomio.monomios.sort((m1, m2) => {let potenciaM1 = m1.variables[variable] || 0;let potenciaM2 = m2.variables[variable] || 0;
        return potenciaM2 - potenciaM1;});
    return polinomio.monomios.map((monomio,index)=>{let strMonomio=monomio.toString();return index>0&&strMonomio[0]!=='-'?'+'+strMonomio:strMonomio;}).join('');}
  static coeficientesPotenciasDecrecientesVariable(cadena, variable) {let polinomio = Polinomio.parsePolinomio(cadena);let coeficientesAgrupados = {};
    for (let monomio of polinomio.monomios) {let gradoVariable = monomio.variables[variable] || 0;
        let monomioSinVariable = Monomio.eliminarVariable(monomio.toString(), variable, gradoVariable);
        if (!coeficientesAgrupados[gradoVariable]) {coeficientesAgrupados[gradoVariable] = monomioSinVariable;} 
          else {coeficientesAgrupados[gradoVariable] += "+" + monomioSinVariable;}}
    let maxGrado = Math.max(...Object.keys(coeficientesAgrupados).map(grado => parseInt(grado, 10)));let resultado = [];
    for (let i = maxGrado; i >= 0; i--) {if (coeficientesAgrupados[i]) {let simplificado = Polinomio.simplificar(coeficientesAgrupados[i].replace(/\+\-/g, '-'));
            resultado.push(simplificado);} else {resultado.push("0");}}return resultado;}
  static coeficientesPotenciasCrecientesVariable(cadena, variable) {let polinomio = Polinomio.parsePolinomio(cadena);let coeficientesAgrupados = {};
    for (let monomio of polinomio.monomios) {let gradoVariable = monomio.variables[variable] || 0;
        let monomioSinVariable = Monomio.eliminarVariable(monomio.toString(), variable, gradoVariable);
        if (!coeficientesAgrupados[gradoVariable]) {coeficientesAgrupados[gradoVariable] = monomioSinVariable;} 
          else {coeficientesAgrupados[gradoVariable] += "+" + monomioSinVariable;}}
    let maxGrado = Math.max(...Object.keys(coeficientesAgrupados).map(grado => parseInt(grado, 10)));let resultado = [];
    for (let i = 0; i <= maxGrado; i++) {if (coeficientesAgrupados[i]) {let simplificado = Polinomio.simplificar(coeficientesAgrupados[i].replace(/\+\-/g, '-'));
            resultado.push(simplificado);} else {resultado.push("0");}}return resultado;}
  static grado(polinomio) {let p = Polinomio.parsePolinomio(polinomio);if(p.toString()==="0"){return 0};
    let gradoMaximo = Math.max(...p.monomios.map(monomio => Monomio.grado(monomio.toString())));return gradoMaximo;}
  static gradoVariable(cadena, variable) {let polinomio = Polinomio.parsePolinomio(cadena);let gradoMaximo = 0;
    for (let monomio of polinomio.monomios) {let gradoActual = monomio.variables[variable] || 0;if (gradoActual > gradoMaximo) {gradoMaximo = gradoActual;}}
    return gradoMaximo;}
  static elegirMonomioMayorGrado(cadena) {let grado = Polinomio.grado(cadena);let solucion = "";
    let monom = Polinomio.parsePolinomio(cadena).monomios;for (let i = 0; i < monom.length; i++) 
      {if (Monomio.grado(monom[i].toString()) === grado) {solucion = monom[i].toString();break;}}return solucion;}
  static elegirMonomioMayorGradoVariable(cadena,variable) {let grado = Polinomio.gradoVariable(cadena,variable);let solucion = "";
    let monom = Polinomio.parsePolinomio(cadena).monomios;for (let i = 0; i < monom.length; i++) 
      {if (Monomio.gradoVariable(monom[i].toString(),variable) === grado) {solucion = monom[i].toString();break;}}return solucion;}
  static dividirUnaVariable(polinomio1, polinomio2) {if (polinomio2 === "0") {throw new Error("División por cero.");}
    polinomio1=ExpresionAlgebraica.eliminarParentesisInnecesarios(polinomio1);polinomio2=ExpresionAlgebraica.eliminarParentesisInnecesarios(polinomio2);
    let dividendo = Polinomio.simplificar(polinomio1);
    let divisor = Polinomio.simplificar(polinomio2);
    if (Polinomio.grado(dividendo) < Polinomio.grado(divisor)) {return ["0", dividendo];}
    let cociente = "";let resto = dividendo;let monomioDivisor = Polinomio.elegirMonomioMayorGrado(divisor);
    while (Polinomio.grado(resto) >= Polinomio.grado(divisor)&&resto!=="0") {
        let monomioDividido = Monomio.dividir(Polinomio.elegirMonomioMayorGrado(resto), monomioDivisor);
        let multiplicacion = Polinomio.multiplicar(monomioDividido, divisor);
        resto = Polinomio.restar(resto, multiplicacion);
        cociente = Polinomio.sumar(cociente, monomioDividido);
        resto = Polinomio.simplificar(resto);}
    return [ExpresionAlgebraica.pasarAFraccion(Polinomio.simplificar(cociente)),ExpresionAlgebraica.pasarAFraccion(Polinomio.simplificar(resto))];}
  static dividir(polinomio1, polinomio2) {const norm = (s) => ExpresionAlgebraica.pasarAFraccion(Polinomio.simplificar(s));
    const cmpMonomiosLex = (m1, m2, variables) => {for (const v of variables) {const e1 = Polinomio.gradoVariable(m1, v);
    const e2 = Polinomio.gradoVariable(m2, v);if (e1 !== e2) return e2 - e1; };if (m1 === m2) return 0;return m1 < m2 ? 1 : -1;};
    const LT = (p, variables) => {const pp = Polinomio.parsePolinomio(p);if (!pp || !pp.monomios || pp.monomios.length === 0) return "0";
    const arr = pp.monomios.map(m => m.toString());arr.sort((a, b) => cmpMonomiosLex(a, b, variables));return arr[0];};
    const divisiblePorLT = (mR, mD) => {if (mR === "0" || mD === "0") return false;
    for (const v of variables) {if (Polinomio.gradoVariable(mR, v) < Polinomio.gradoVariable(mD, v)) {return false;}};return true;};
    polinomio1 = ExpresionAlgebraica.eliminarParentesisInnecesarios(polinomio1);polinomio2 = ExpresionAlgebraica.eliminarParentesisInnecesarios(polinomio2);
    let variables = [...Polinomio.variables(polinomio1), ...Polinomio.variables(polinomio2)];
    variables = [...new Set(variables)].filter(v => ordenVariables.includes(v)).sort((a, b) => ordenVariables.indexOf(a) - ordenVariables.indexOf(b));
    if (variables.length ===0){const expr=`(${polinomio1})/(${polinomio2})`;const val=ExpresionNumerica.calcular(ExpresionAlgebraica.pasarADecimal(expr));return [val, "0"];}
    if (variables.length === 1) {return Polinomio.dividirUnaVariable(polinomio1, polinomio2);}
    let dividendo = norm(polinomio1);let divisor   = norm(polinomio2);
    if (divisor === "0") {throw new Error("División por cero");}
    let q = "0";let r = "0";let trabajo = dividendo;const vistos = [trabajo];const yaVisto = (p) => vistos.some(x => Polinomio.restar(x, p) === "0");
    const LTdiv = LT(divisor, variables); 
    while (trabajo !== "0") {const LTtra = LT(trabajo, variables);if (LTtra === "0") break;
      if (divisiblePorLT(LTtra, LTdiv)) {const t = Monomio.dividir(LTtra, LTdiv);q = Polinomio.sumar(q, t);
      trabajo = Polinomio.restar(trabajo, Polinomio.multiplicar(t, divisor));trabajo = norm(trabajo);} 
      else {r = Polinomio.sumar(r, LTtra);r = norm(r);trabajo = Polinomio.restar(trabajo, LTtra);trabajo = norm(trabajo);}if (yaVisto(trabajo)) break;
    vistos.push(trabajo);};return [norm(q), norm(r)];}
  static factorizar(cadena){const LIM_DIV=40,LIM_COMB=500,LIM_MS=500;let inicio=Date.now();
    if(Polinomio.grado(cadena)===0)return[cadena];cadena=ExpresionAlgebraica.eliminarParentesisInnecesarios(cadena);cadena=Polinomio.quitarDenominadores(cadena)[0];
    let factores=[],pol=Polinomio.parsePolinomio(cadena);
    if(pol.monomios.length===1){let mono=pol.monomios[0],vars=Object.keys(mono.variables);
      if(vars.length===1&&mono.variables[vars[0]]>1){let arr=[];for(let i=0;i<mono.variables[vars[0]];i++)arr.push(vars[0]);
        if(mono.coeficiente!==1)arr.unshift(mono.coeficiente.toString());return arr;}}
    function tratar(exp){let g=Polinomio.grado(exp);
      if(g===0&&exp!=="1"&&exp!=="-1")return[exp,"1"];if(exp==="1")return["1"];if(exp==="--1")return["-1"];if(g===1)return[exp];return null;}
    let fc=Polinomio.factorComun(cadena),factorCom=fc[0],restal1=fc[1];if(factorCom!=="1")factores.push(factorCom);let caso=tratar(restal1);
    if(caso){if(caso[0]==="-1"&&factores.length)factores[0]=Polinomio.multiplicar("-1",factores[0]);
      else if(caso[0]&&caso[0]!=="1")factores.push(caso[0]);return factores.length?factores:[cadena];}
    let letrasRestal1=Polinomio.variables(restal1);
    if(Polinomio.grado(restal1)===2&&letrasRestal1.length===1){
      let coeff=Polinomio.coeficientes(restal1),c=coeff[0],b=coeff[1],a=coeff[2],disc=b*b-4*a*c;
      if(disc<0||!Number.isInteger(Math.sqrt(disc))){factores.push(restal1);return factores;}
      let sqrtDisc=Math.sqrt(disc),LONG_FC=(typeof long!=="undefined")?long:12;
      let ra1=fraccionContinua(((-b+sqrtDisc)/(2*a)).toString(),LONG_FC),ra2=fraccionContinua(((-b-sqrtDisc)/(2*a)).toString(),LONG_FC);
      let variable=letrasRestal1[0];factores.push(a.toString());if(ra1==="0")factores.push(variable);if(ra2==="0")factores.push(variable);
      ra1=Monomio.multiplicar(ra1,"-1");ra2=Monomio.multiplicar(ra2,"-1");
      if(ra1!=="0"&&ra2==="0")factores.push(ra1.startsWith("-")?(variable+ra1):(variable+"+"+ra1));
      if(ra1==="0"&&ra2!=="0")factores.push(ra2.startsWith("-")?(variable+ra2):(variable+"+"+ra2));
      if(ra1!=="0"&&ra2!=="0"){let f1=ra1.startsWith("-")?(variable+ra1):(variable+"+"+ra1),f2=ra2.startsWith("-")?(variable+ra2):(variable+"+"+ra2);
        factores.push(f1,f2);}return factores;}
    for(let v of letrasRestal1){let factorEncontrado=true;while(factorEncontrado){
      if(Date.now()-inicio>LIM_MS)break;caso=tratar(restal1);
      if(caso){if(caso[0]==="-1"&&factores.length)factores[0]=Polinomio.multiplicar("-1",factores[0]);
        else if(caso[0]&&caso[0]!=="1")factores.push(caso[0]);return factores.length?factores:[cadena];}
      factorEncontrado=false;let coefAux=Polinomio.coeficientesPotenciasDecrecientesVariable(restal1,v),coefP=coefAux[0],coefI=coefAux[coefAux.length-1];
      let divP=Polinomio.obtenerMonomiosDivisores(coefP).sort((a,b)=>Math.abs(a)-Math.abs(b)).slice(0,LIM_DIV);
      let divI=Polinomio.obtenerMonomiosDivisores(coefI).sort((a,b)=>Math.abs(a)-Math.abs(b)).slice(0,LIM_DIV);
      for(let a of divP){for(let b of divI){if(Date.now()-inicio>LIM_MS)break;let aS=a.toString(),bS=b.toString(),prueba=Polinomio.sumar(Polinomio.multiplicar(aS,v),bS);
        let division=Polinomio.dividir(restal1,prueba);
        if(division[1]==="0"){factores.push(prueba);restal1=division[0];factorEncontrado=true;inicio=Date.now();break;}}
        if(factorEncontrado||Date.now()-inicio>LIM_MS)break;};if(Date.now()-inicio>LIM_MS)break;}}
    let n=Polinomio.variables(restal1).length;
    if(n===1&&Polinomio.grado(restal1)>1){
      let variable=Polinomio.variables(restal1)[0],coefDec=Polinomio.coeficientesPotenciasDecrecientesVariable(restal1,variable),a=coefDec[0],b=coefDec[coefDec.length-1];
      let divA=Polinomio.obtenerMonomiosDivisores(a).sort((x,y)=>Math.abs(x)-Math.abs(y)).slice(0,LIM_DIV);
      let divB=Polinomio.obtenerMonomiosDivisores(b).sort((x,y)=>Math.abs(x)-Math.abs(y)).slice(0,LIM_DIV);
      cicloCuadraticos:for(let da of divA){for(let db of divB){if(Date.now()-inicio>LIM_MS)break cicloCuadraticos;
        let prueba=Polinomio.sumar(Polinomio.multiplicar(da.toString(),`${variable}^2`),db.toString()),division=Polinomio.dividir(restal1,prueba);
        if(division[1]==="0"){factores.push(prueba);restal1=division[0];inicio=Date.now();
          if(Polinomio.grado(restal1)===1){factores.push(restal1);restal1="1";}
          if(Polinomio.grado(restal1)<=2)break cicloCuadraticos;}}}}
    if(Polinomio.grado(restal1)===2){factores.push(restal1);restal1="1";};let restal2="";
    while(n===1&&Polinomio.grado(restal1)>2&&restal1!==restal2){
      restal2=restal1;let variable=Polinomio.variables(restal1)[0],coef=Polinomio.coeficientesPotenciasCrecientesVariable(restal1,variable);
      let lc=Number(coef[coef.length-1]),ct=Number(coef[0]);if(!Number.isFinite(lc)||lc%1!==0||!Number.isFinite(ct)||ct%1!==0)break;
      let divLc=new Set(divisores(lc).map(Number).filter(x=>Number.isFinite(x)&&x%1===0)),divCt=new Set(divisores(ct).map(Number).filter(x=>Number.isFinite(x)&&x%1===0));
      let cand=[];for(let a=1;a<=6;a++){if(!divLc.has(a))continue;
        for(let b=-6;b<=6;b++)for(let c=-6;c<=6;c++){if(ct===0){if(c!==0&&!divCt.has(c)){}};if(ct!==0&&!divCt.has(c))continue;
          if(c===0&&ct!==0)continue;if(b===0&&c===0)continue;cand.push({a,b,c,peso:a+Math.abs(b)+Math.abs(c)});}}
      cand.sort((u,v)=>u.peso-v.peso);let found=false;
      for(let comb of cand){let a=comb.a,b=comb.b,c=comb.c,pr=(a===1?"":(""+a))+variable+"^2";
        if(b!==0)pr+=(b>0?"+":"")+b+variable;if(c!==0)pr+=(c>0?"+":"")+c;let division=Polinomio.dividir(restal1,pr);
        if(division[1]==="0"){factores.push(pr);restal1=division[0];found=true;break;}};if(!found)break;}
    factores.push(restal1);factores=factores.filter(f=>f!=="1").map(f=>Polinomio.ordenarTotal(f));
    let anadir=[];for(let i=0;i<factores.length;i++){if(!/[+\-]/.test(factores[i])&&factores[i].includes("*")){
      let des=ExpresionAlgebraica.obtenerFactores(factores[i]);anadir.push(...des);factores[i]=null;}}
    factores=[...anadir,...factores.filter(f=>f!==null)];if(factores.length===0)factores=[cadena];return factores;}
  static factoresCanonicos(cad) {const norm = (s) => ExpresionAlgebraica.pasarAFraccion(Polinomio.simplificar(s));
    const mulNum = (a, b) => ExpresionNumerica.calcular("(" + a + ")*(" + b + ")");const esNumero = (s) => {const t = norm(s);
    return /^-?\d+(\/\d+)?$/.test(t);};
    const expandPotencias = (arr) => {for (let i = 0; i < arr.length; i++) {const m = arr[i].match(/^(\(.+\)|[a-zA-Z])\^(\d+)$/);
      if (m) {const base = m[1];const k = parseInt(m[2], 10);const rep = Array(k).fill(base);arr.splice(i, 1, ...rep);i += k - 1;}}};
    const dividirPorCoefLider = (factor) => {const lm = Polinomio.elegirMonomioMayorGrado(factor); 
    const coeStr = Monomio.parseMonomio(lm).coeficiente.toString(); const division = Polinomio.dividir(factor, coeStr);
    const monico = (division[1] === "0") ? norm(division[0]) : norm(factor);
    const coef   = (division[1] === "0") ? norm(coeStr): "1";return [monico, coef];};
    let factores = Polinomio.factorizar(cad).map(norm);expandPotencias(factores);let coefGlobal = "1";
    for (let i = 0; i < factores.length; i++) {const f = factores[i];if (esNumero(f)) {coefGlobal = mulNum(coefGlobal, f);
      factores[i] = "1";continue;};const [monico, coef] = dividirPorCoefLider(f);coefGlobal = mulNum(coefGlobal, coef);factores[i] = monico;}
    factores = factores.filter(x => x !== "1");coefGlobal = norm(coefGlobal);
    if (coefGlobal === "-1") {factores.unshift("-1");} else if (coefGlobal !== "1") {factores.unshift(coefGlobal);} 
    else {if (factores.length && /[a-zA-Z]/.test(factores[0])) {factores.unshift("1");} else if (factores.length === 0) {factores = ["1"];}}
    factores = factores.map(norm);return factores;}
  static mcd(p1, p2) {p1=ExpresionAlgebraica.eliminarParentesisInnecesarios(p1); p2=ExpresionAlgebraica.eliminarParentesisInnecesarios(p2);
    [p1,p2] = Polinomio.ordenarPolinomiosGrado(p1,p2);let resultado;
    if (p2 === "0") {resultado= p1;} else {while (p2 !== "0") {let division = Polinomio.dividir(p1,p2);if (division[0] === "0") {return "1"};  
      let resto = division[1];p1 = p2;p2 = resto;};resultado = p1;}
    resultado = Polinomio.quitarDenominadores(resultado)[0];resultado=Polinomio.simplificarFactorComunCoeficientes(resultado);
    if (resultado[0] === "-") {resultado = Polinomio.multiplicar(resultado,"-1")};return resultado;}
  static mcdMonico(p1, p2) {let g=Polinomio.mcd(p1,p2); if(g==="0"){return "0"}; let lider=Polinomio.monomiosMayorGrado(g)[0];
    let coef=Monomio.obtenerCoeficiente(lider).toString(); let res=Polinomio.dividir(g,coef)[0]; if(res[0]==="-"){res=Polinomio.multiplicar(res,"-1")}; return res}
  static mcdArray(array){array=array.filter(elemento=>elemento!=="0"); if(array.length===0){return "1"}; if(array.length===1){return array[0]};
    let g=Polinomio.mcd(array[0],array[1]); for (let j=2;j<array.length;j++){g=Polinomio.mcd(g,array[j])}; if(g[0]==="-"){g=Polinomio.multiplicar(g,"-1")}; return g}
  static mcm(a, b) {a=ExpresionAlgebraica.eliminarParentesisInnecesarios(a);b=ExpresionAlgebraica.eliminarParentesisInnecesarios(b);
    if(a==="0"||b==="0"){return "0"}; let l=Polinomio.dividir(Polinomio.multiplicar(a,b),Polinomio.mcd(a,b))[0]; if(l[0]==="-"){l=Polinomio.multiplicar(l,"-1")}; return l}
  static mcmArray(array) {for(let value of array){if(value==="0"){return "0"}};let resultado;
    if(array.length>1){resultado=Polinomio.mcm(array[0],array[1]); 
    for (let i=2;i<array.length;i++){resultado=Polinomio.mcm(resultado,array[i])} return resultado}
    else{if(array.length===1){resultado=array[0];return resultado}else{return "1"}}}
  static monomiosDecrecientes(cadena) {const polinomio = Polinomio.parsePolinomio(cadena);
    polinomio.monomios.sort((m1, m2) => {const gradoM1 = Object.values(m1.variables).reduce((acc, exp) => acc + exp, 0);
    const gradoM2 = Object.values(m2.variables).reduce((acc, exp) => acc + exp, 0);return gradoM2 - gradoM1;});
    return polinomio.monomios.map(monomio => monomio.toString());}
  static monomiosCrecientes(cadena) {const polinomio = Polinomio.parsePolinomio(cadena);
    polinomio.monomios.sort((m1, m2) => {const gradoM1 = Object.values(m1.variables).reduce((acc, exp) => acc + exp, 0);
    const gradoM2 = Object.values(m2.variables).reduce((acc, exp) => acc + exp, 0);return gradoM1 - gradoM2;});
    return polinomio.monomios.map(monomio => monomio.toString());} 
  static raicesPolinomioUnaVariable(poli){let letr=poli.match(/[a-z]/);letr=letr[0];
    poli=Polinomio.quitarDenominadores(poli)[0]; let factores=Polinomio.factorizar(poli);let raic=[];    
    for(let i=0; i<factores.length;i++){if(Polinomio.grado(factores[i])===1){let primerM="";let segundoM="";let factorParse=Polinomio.parsePolinomio(factores[i]);
    for (let j=0;j<factorParse.monomios.length;j++){
        if(factorParse.monomios[j].toString().includes(letr)){primerM=primerM+factorParse.monomios[j].toString()}
        else{segundoM=segundoM+factorParse.monomios[j].toString()};}; 
    if(segundoM===""){segundoM="0"};let rai="-("+segundoM+")/("+Monomio.obtenerCoeficiente(primerM).toString()+")"; 
    rai=FraccionAlgebraica.simplificar(rai);
    raic.push(rai);}};for (let i=0;i<raic.length;i++){raic[i]=FraccionNumerica.simplificar(raic[i]);raic[i]=letr+"="+raic[i]};return raic}
  static raicesPolinomioUnaVariableValores(poli){let letr=poli.match(/[a-z]/);letr=letr[0];
    poli=Polinomio.quitarDenominadores(poli)[0]; let factores=Polinomio.factorizar(poli);let raic=[];    
    for(let i=0; i<factores.length;i++){if(Polinomio.grado(factores[i])===1){let primerM="";let segundoM="";let factorParse=Polinomio.parsePolinomio(factores[i]);
    for (let j=0;j<factorParse.monomios.length;j++){
        if(factorParse.monomios[j].toString().includes(letr)){primerM=primerM+factorParse.monomios[j].toString()}
        else{segundoM=segundoM+factorParse.monomios[j].toString()};}; 
    if(segundoM===""){segundoM="0"};let rai="-("+segundoM+")/("+Monomio.obtenerCoeficiente(primerM).toString()+")"; rai=FraccionAlgebraica.simplificar(rai);
    raic.push(rai);}};for (let i=0;i<raic.length;i++){raic[i]=FraccionNumerica.simplificar(raic[i]).toString()};return raic}
  static raices(poli){let factores=Polinomio.factorizar(poli); let raic=[];for (let i=0;i<factores.length;i++){
    if(Polinomio.variables(factores[i]).length===1){let raicAux=Polinomio.raicesPolinomioUnaVariable(factores[i]); raic=[...raic,...raicAux]}
    if(Polinomio.variables(factores[i]).length===2&&Polinomio.grado(factores[i])===1){let primerM="";let segundoM=""; let factor=Polinomio.parsePolinomio(factores[i]);
    for (let j=0;j<factor.monomios.length;j++){if(factor.monomios[j].toString().includes(Polinomio.variables(factores[i])[0]))
    {primerM=primerM+factor.monomios[j].toString()}else{segundoM=segundoM+factor.monomios[j].toString()}}; 
    if(segundoM===""){segundoM="0"}; let auz="-("+segundoM+")/("+Monomio.obtenerCoeficiente(primerM).toString()+")";auz=FraccionAlgebraica.simplificar(auz);
    auz=Polinomio.variables(factores[i])[0]+"="+auz;raic.push(auz)}}return raic}
  static raicesValores(poli){let raices=Polinomio.raices(poli); let resultado=[];for(let i=0;i<raices.length;i++){let pos=raices[i].indexOf("=");
    let segMiem=raices[i].substring(pos+1); resultado.push(segMiem)}; return resultado}
  static variables(poli){const m = poli.match(new RegExp(VAR_CHR, 'g'));return m ? Array.from(new Set(m)) : [];}
  static coeficientes(poli){const m = poli.match(/[a-zA-Z]/);if(!m){ return ["0"]; };const variable = m[0];
    return Polinomio.coeficientesPotenciasCrecientesVariable(poli, variable);}
  static coeficientesCrecientesAExpresion(coef,letr){while(coef[coef.length-1]===0){coef=coef.slice(0,coef.length-1);}
    for(let i=0;i<coef.length;i++){coef[i]=parseFloat(coef[i])};
    let texto="";if(coef[coef.length-1]!==1&&coef[coef.length-1]!==-1&&coef.length>2){texto=texto+coef[coef.length-1]+"{{"+letr+"}^{"+(coef.length-1)+"}}";};
    if(coef[coef.length-1]===1&&coef.length>2){texto=texto+"{{"+letr+"}^{"+(coef.length-1)+"}}";};
    if(coef[coef.length-1]===-1&&coef.length>2){texto=texto+"-"+"{{"+letr+"}^{"+(coef.length-1)+"}}";};for (let i=coef.length-2;i>=2;i--){
    if (coef[i]>0&&coef[i]!==1){texto=texto+"+"+coef[i]+"{{"+letr+"}^{"+(i)+"}}"};if (coef[i]===1){texto=texto+"+"+"{{"+letr+"}^{"+(i)+"}}"};
    if (coef[i]===-1){texto=texto+"-"+"{{"+letr+"}^{"+(i)+"}}"};if (coef[i]<0&&coef[i]!==-1){texto=texto+coef[i]+"{{"+letr+"}^{"+(i)+"}}"};}
    if (coef[1]>0&&coef[1]!==1&&coef.length>2){texto=texto+"+"+coef[1]+"{{"+letr+"}}"};if (coef[1]>0&&coef[1]!==1&&coef.length===2){texto=texto+coef[1]+"{{"+letr+"}}"};
    if (coef[1]===1&&coef.length>2){texto=texto+"+"+"{{"+letr+"}}"};if (coef[1]===1&&coef.length===2){texto=texto+"{{"+letr+"}}"};
    if (coef[1]===-1&&coef.length>2){texto=texto+"-"+"{{"+letr+"}}"};if (coef[1]===-1&&coef.length===2){texto=texto+"-"+"{{"+letr+"}}"};
    if (coef[1]<0&&coef[1]!==-1&&coef.length>2){texto=texto+coef[1]+"{{"+letr+"}}"};if (coef[1]<0&&coef[1]!==-1&&coef.length===2){texto=texto+coef[1]+"{{"+letr+"}}"};
    if (coef[0]>0){texto=texto+"+"+coef[0]};if (coef[0]<0){texto=texto+coef[0]}if (coef[0]===0&&texto===""){texto="0"}if (texto[0]==="+"){texto.slice(1)};
    texto=ExpresionAlgebraica.pasarAFraccion(texto); texto=texto.replace(/[{}]/g, '');if(texto[0]==="+"){texto=texto.slice(1)};return texto;}
  static coeficientesDecrecientesAExpresion(coef,letr){coef=coef.reverse();while(coef[coef.length-1]===0){coef=coef.slice(0,coef.length-1);}
    return Polinomio.coeficientesCrecientesAExpresion(coef,letr);}
  static quitarDenominadores(poli){let denominadores=[];let pol=Polinomio.parsePolinomio(poli); let coefi=[];
    for (let i=0;i<pol.monomios.length;i++){coefi.push(pol.monomios[i].coeficiente)};
    for (let i=0;i<coefi.length;i++){let den=FraccionNumerica.denominador(fraccionContinua(coefi[i].toString(),long));denominadores.push(den)}
    let minComun=mcmArray(denominadores);poli=Polinomio.multiplicar(poli,minComun.toString());return [poli,minComun.toString()];}
  static desarrollarFactores(factores){let resultado="1"; for(let i=0;i<factores.length;i++){resultado=Polinomio.multiplicar(resultado, factores[i])}; return resultado}
  static monomios(pol){let mon=[]; let polParse=Polinomio.parsePolinomio(pol); 
    for(let i=0;i<polParse.monomios.length;i++){mon.push(polParse.monomios[i].toString())} return mon}
  static monomiosMayorGrado(pol){let mono=Polinomio.monomios(pol);let n=Polinomio.grado(pol);let monoMG=[]
    for(let i=0;i<mono.length;i++){if(Monomio.grado(mono[i])===n){monoMG.push(mono[i])}}; return monoMG}
  static ordenarPolinomiosGrado(p1,p2){if(Polinomio.grado(p2) - Polinomio.grado(p1)>0){let aux=p2;p2=p1;p1=aux}; return[p1,p2]}
  static ordenarArrayPolinomiosGrado(array){return array.sort((a, b) => Polinomio.grado(b) - Polinomio.grado(a));}
}
          

class FraccionNumerica {constructor(fraccion) {const [numerador, denominador] = FraccionNumerica.parseFraccion(fraccion);
                        this.numerador = numerador;this.denominador = denominador;}
  static parseFraccion(cadena){
    let frac = FraccionAlgebraica.parseFraccion(cadena);if (frac[1].monomios.length===0){ return ["0","0"];};if (frac[0].monomios.length===0){ return ["0","1"];}
    let numerador = frac[0].monomios[0].coeficiente.toString();let denominador = frac[1].monomios[0].coeficiente.toString();return [numerador, denominador];}
  static sumar(frac1, frac2) {const [num1, den1] = FraccionNumerica.parseFraccion(frac1);const [num2, den2] = FraccionNumerica.parseFraccion(frac2);
    const numerador = num1 * den2 + num2 * den1;const denominador = den1 * den2;return FraccionNumerica.simplificar(numerador+"/("+denominador+")");}
  static restar(frac1, frac2) {const [num1, den1] = FraccionNumerica.parseFraccion(frac1);const [num2, den2] = FraccionNumerica.parseFraccion(frac2);
    const numerador = num1 * den2 - num2 * den1;const denominador = den1 * den2;return FraccionNumerica.simplificar(numerador+"/("+denominador+")");}
  static multiplicar(frac1, frac2) {const [num1, den1] = FraccionNumerica.parseFraccion(frac1);const [num2, den2] = FraccionNumerica.parseFraccion(frac2);
    const numerador = num1 * num2;const denominador = den1 * den2;return FraccionNumerica.simplificar(numerador+"/("+denominador+")");}
  static dividir(frac1, frac2) {const [num1, den1] = FraccionNumerica.parseFraccion(frac1);const [num2, den2] = FraccionNumerica.parseFraccion(frac2);
    if(den1==="0"||num2==="0"||den2==="0"){return "Error: división por 0"}
    const numerador = num1 * den2;const denominador = den1 * num2;return FraccionNumerica.simplificar(numerador+"/("+denominador+")");}
  static simplificar(fraccion){
    fraccion = ExpresionAlgebraica.eliminarParentesisInnecesarios(fraccion);if(fraccion[0]==="-"&&fraccion[1]==="-"){fraccion=fraccion.slice(2);}
    let [num, den] = FraccionNumerica.parseFraccion(fraccion);if (den === "0"){ return "Error: división por 0"; }
    if(num<0&&den<0){num=Math.abs(num); den=Math.abs(den)};let max=mcd(num,den); num=num/max; den=den/max;
    if(num>0&&den<0){num=-num; den=Math.abs(den)}; if(den==1){fraccion=num;}else{if(den<0){fraccion=num+"/("+den+")"}
      else{fraccion=num+"/"+den}};return fraccion.toString();}
  static potencia(frac, n) {n=parseFloat(n);if (!Number.isInteger(n)){return "Error: el exponente debe ser entero"}
    let num= FraccionNumerica.parseFraccion(frac)[0]; let den= FraccionNumerica.parseFraccion(frac)[1];
    if (n<0){let aux=num; num=den;den=aux};n=Math.abs(n);
    const numerador = num ** n;const denominador = den **n;return FraccionNumerica.simplificar(numerador+"/("+denominador+")");}
  static numerador(fraccion){return FraccionNumerica.parseFraccion(fraccion)[0]}
  static denominador(fraccion){return FraccionNumerica.parseFraccion(fraccion)[1]}
}


          




          
class FraccionAlgebraica {constructor(fraccion) {const [numerador, denominador] = FraccionAlgebraica.parseFraccion(fraccion);
                          this.numerador = numerador;this.denominador = denominador;}
  toString() {const numeradorStr = this.numerador.toString();const denominadorStr = this.denominador.toString();
    const requiresParens = (str) => /[\+\-\*\/]/.test(str) || /[a-zA-Z]/.test(str);
    const numeradorFinal = requiresParens(numeradorStr) ? `(${numeradorStr})` : numeradorStr;
    const denominadorFinal = requiresParens(denominadorStr) ? `(${denominadorStr})` : denominadorStr;
    if (denominadorStr === '1') {return numeradorFinal;}return `${numeradorFinal}/${denominadorFinal}`;}
  static parseFraccion(cadena){ if(typeof cadena!=="string") throw new TypeError("parseFraccion espera una cadena."); let s=cadena.trim(); 
    const info=(function(str){ let d=0,f=-1,e=false; for(let i=0;i<str.length;i++){ const ch=str[i]; if(ch==='(') d++; 
       else if(ch===')'){ d--; if(d<0) throw new Error("Paréntesis desbalanceados."); } else if(ch==='/'&&d===0){ if(f===-1) f=i; else e=true; } } 
       if(d!==0) throw new Error("Paréntesis desbalanceados."); return {idx:f,extraSlashAtTopLevel:e}; })(s); 
       if(info.extraSlashAtTopLevel) throw new Error("La fracción contiene más de un '/' al nivel superior."); if(info.idx===-1) s+="/(1)"; 
       const slashPos=(info.idx===-1)?(function(str){ let d=0; for(let i=0;i<str.length;i++){ const ch=str[i]; 
       if(ch==='(') d++; else if(ch===')') d--; else if(ch==='/'&&d===0) return i; } return -1; })(s):info.idx; let numStr=s.slice(0,slashPos).trim(); 
       let denStr=s.slice(slashPos+1).trim(); if(!denStr) throw new Error("Denominador vacío."); const stripOuterParens=(str)=>{ str=str.trim(); 
        while(str.startsWith('(')&&str.endsWith(')')){ let d=0,w=true; 
          for(let i=0;i<str.length-1;i++){ const ch=str[i]; if(ch==='(') d++; else if(ch===')'){ d--; if(d<0) throw new Error("Paréntesis desbalanceados."); 
          if(d===0&&i<str.length-1){ w=false; break; } } } if(!w) break; str=str.slice(1,-1).trim(); } return str; }; numStr=stripOuterParens(numStr); 
          denStr=stripOuterParens(denStr); const numerador=Polinomio.parsePolinomio(numStr); const denominador=Polinomio.parsePolinomio(denStr); 
    return [numerador,denominador]; }
  static simplificar(cadena){
    const strip=s=>{s=(""+s).trim();while(s.startsWith("(")&&s.endsWith(")"))s=s.slice(1,-1).trim();return s};
    const normF=s=>strip(s).replace(/\s+/g,""),haySuma=s=>/[+\-]/.test(strip(s).slice(1));
    const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);return b?gcd(b,a%b):a},lcm=(a,b)=>a/gcd(a,b)*b;
    const esInt=s=>/^-?\d+$/.test(strip(s));
    const parseRat=s=>{s=strip(s);if(esInt(s))return {n:parseInt(s,10),d:1};
      if(/^-?\d+\/-?\d+$/.test(s)){let [a,b]=s.split("/");return {n:parseInt(a,10),d:parseInt(b,10)}}
      if(/^-?\d*\.\d+$/.test(s)){let sign=s.startsWith("-")?-1:1;if(sign<0)s=s.slice(1);
        let [i,f]=s.split(".");if(i==="")i="0";let d=1;for(let k=0;k<f.length;k++)d*=10;
        let n=(parseInt(i,10)*d+parseInt(f,10))*sign;let g=gcd(n,d);return {n:n/g,d:d/g}}
      return null};
    const simpRat=(a,b)=>{let A=parseRat(a),B=parseRat(b);if(!A||!B)return null;
      let n=A.n*B.d,d=A.d*B.n;if(d===0)return {n:1,d:0,str:"∞"};if(n===0)return {n:0,d:1,str:"0"};
      let s=((n<0)^(d<0))?-1:1;n=Math.abs(n);d=Math.abs(d);let g=gcd(n,d);n=(n/g)*s;d/=g;
      return {n,d,str:(d===1?(""+n):n+"/"+d)}};
    const mulRatStr=(a,b)=>{let A=parseRat(a),B=parseRat(b);if(!A||!B)return null;
      let n=A.n*B.n,d=A.d*B.d;if(d===0)return "∞";if(n===0)return "0";
      let s=((n<0)^(d<0))?-1:1;n=Math.abs(n);d=Math.abs(d);let g=gcd(n,d);n=(n/g)*s;d/=g;return d===1?(""+n):n+"/"+d};
    const divRatStr=(a,b)=>{let A=parseRat(a),B=parseRat(b);if(!A||!B)return null;
      let n=A.n*B.d,d=A.d*B.n;if(d===0)return "∞";if(n===0)return "0";
      let s=((n<0)^(d<0))?-1:1;n=Math.abs(n);d=Math.abs(d);let g=gcd(n,d);n=(n/g)*s;d/=g;return d===1?(""+n):n+"/"+d};
    const producto=a=>{let r="1";for(let i=0;i<a.length;i++)r=Polinomio.multiplicar(r,a[i]);return r};
    const denomsEn=s=>{s=(""+s);let m=s.match(/-?\d+\/-?\d+|-?\d*\.\d+|-?\d+/g)||[],L=1;
      for(let i=0;i<m.length;i++){let R=parseRat(m[i]);if(R&&R.d&&Math.abs(R.d)>1)L=lcm(L,Math.abs(R.d))}return L};
    const normalizarFactores=(c,f)=>{c=""+c;
      for(let i=0;i<f.length;i++){let L=denomsEn(f[i]);if(L>1){f[i]=Polinomio.multiplicar(L.toString(),f[i]);
          let nc=divRatStr(c,L.toString());if(nc)c=nc}}return c};
    let numer=FraccionAlgebraica.numerador(cadena).toString(),denom=FraccionAlgebraica.denominador(cadena).toString();
    let fN=Polinomio.factoresCanonicos(numer),fD=Polinomio.factoresCanonicos(denom);
    let cN=(""+fN[0]),cD=(""+fD[0]),nF=fN.slice(1),dF=fD.slice(1);
    cN=normalizarFactores(cN,nF);cD=normalizarFactores(cD,dF);
    for(let i=0;i<nF.length;i++){let k=normF(nF[i]),j=dF.findIndex(x=>normF(x)===k);
      if(j!==-1){nF.splice(i,1);dF.splice(j,1);i--}}
    let nP=producto(nF),dP=producto(dF),coef=simpRat(cN,cD);
    if(coef){if(coef.d===0)return "∞";if(coef.n===0)return "0";
      if(coef.d===1){if(coef.n!==1)nP=Polinomio.multiplicar(coef.n.toString(),nP)}
      else{nP=Polinomio.multiplicar(coef.n.toString(),nP);dP=Polinomio.multiplicar(coef.d.toString(),dP)}
    }else{nP=Polinomio.multiplicar(cN,nP);dP=Polinomio.multiplicar(cD,dP)}
    nP=strip(nP);dP=strip(dP);
    if(dP==="0")return "∞";if(nP==="0")return "0";if(dP==="1")return nP;
    if(dP==="-1")return nP.startsWith("-")?nP.slice(1):"-"+nP;
    let denProd=ExpresionAlgebraica.notacionConProductos(dP).includes("*");
    let pN=haySuma(nP)?"("+nP+")":nP,pD=(haySuma(dP)||denProd)?"("+dP+")":dP;return pN+"/"+pD}
  static sumar(frac1, frac2) {frac1 = frac1 instanceof FraccionAlgebraica ? frac1 : new FraccionAlgebraica(frac1);
    frac2 = frac2 instanceof FraccionAlgebraica ? frac2 : new FraccionAlgebraica(frac2);
    const nuevoNumerador = Polinomio.sumar(Polinomio.multiplicar(frac1.numerador.toString(), frac2.denominador.toString()),
    Polinomio.multiplicar(frac2.numerador.toString(), frac1.denominador.toString()));
    const nuevoDenominador = Polinomio.multiplicar(frac1.denominador.toString(), frac2.denominador.toString());
    let resultado=new FraccionAlgebraica(`(${nuevoNumerador}) / (${nuevoDenominador})`).toString();resultado=FraccionAlgebraica.simplificar(resultado);return resultado}
  static restar(frac1, frac2) {frac1 = frac1 instanceof FraccionAlgebraica ? frac1 : new FraccionAlgebraica(frac1);
    frac2 = frac2 instanceof FraccionAlgebraica ? frac2 : new FraccionAlgebraica(frac2);
    const nuevoNumerador = Polinomio.restar(Polinomio.multiplicar(frac1.numerador.toString(), frac2.denominador.toString()),
    Polinomio.multiplicar(frac2.numerador.toString(), frac1.denominador.toString()));
    const nuevoDenominador = Polinomio.multiplicar(frac1.denominador.toString(), frac2.denominador.toString());
    let resultado= new FraccionAlgebraica(`(${nuevoNumerador}) / (${nuevoDenominador})`).toString();resultado=FraccionAlgebraica.simplificar(resultado);return resultado}
  static multiplicar(frac1, frac2) {frac1 = frac1 instanceof FraccionAlgebraica ? frac1 : new FraccionAlgebraica(frac1);
    frac2 = frac2 instanceof FraccionAlgebraica ? frac2 : new FraccionAlgebraica(frac2);
    const nuevoNumerador = Polinomio.multiplicar(frac1.numerador.toString(), frac2.numerador.toString());
    const nuevoDenominador = Polinomio.multiplicar(frac1.denominador.toString(), frac2.denominador.toString());
    let resultado= new FraccionAlgebraica(`(${nuevoNumerador}) / (${nuevoDenominador})`).toString();resultado=FraccionAlgebraica.simplificar(resultado);return resultado}
  static dividir(frac1, frac2) {frac1 = frac1 instanceof FraccionAlgebraica ? frac1 : new FraccionAlgebraica(frac1);
    frac2 = frac2 instanceof FraccionAlgebraica ? frac2 : new FraccionAlgebraica(frac2);
    const nuevoNumerador = Polinomio.multiplicar(frac1.numerador.toString(), frac2.denominador.toString());
    const nuevoDenominador = Polinomio.multiplicar(frac1.denominador.toString(), frac2.numerador.toString());
    let resultado=new FraccionAlgebraica(`(${nuevoNumerador}) / (${nuevoDenominador})`).toString();resultado=FraccionAlgebraica.simplificar(resultado);return resultado}
  static esFraccionAlgebraica(c){if(!c.includes("/"))return false;c=c.replace(/\s+/g,"");
    function topOps(s,ops){let p=0;for(let i=0;i<s.length;i++){let ch=s[i];if(ch==="(")p++;else if(ch===")")p--;else if(p===0&&ops.includes(ch))return true}return false}
    function unicoSlash0(s){let p=0,pos=-1;for(let i=0;i<s.length;i++){let ch=s[i];if(ch==="(")p++;else if(ch===")")p--;else if(ch==="/"&&p===0){if(pos!==-1)return -1;pos=i}}return pos}
    function envuelto(s){if(s[0]!=="("||s[s.length-1]!==")")return false;let p=0;for(let i=0;i<s.length;i++){let ch=s[i];if(ch==="(")p++;else if(ch===")")p--;if(p===0&&i<s.length-1)return false}return p===0}
    function implicita0(s){let p=0;for(let i=0;i<s.length-1;i++){let a=s[i],b=s[i+1];if(a==="(")p++;else if(a===")")p--;if(p!==0)continue;
    if(/[0-9]/.test(a)&&/[A-Za-z(]/.test(b))return true;
    if(/[A-Za-z\)]/.test(a)&&/[A-Za-z(]/.test(b))return true}return false}
    let pos=unicoSlash0(c);if(pos===-1)return false;let num=c.slice(0,pos),den=c.slice(pos+1);if(!num||!den)return false;
    if(topOps(den,"+-"))return false;
    if(topOps(den,"*/"))return false;
    if(!envuelto(den)&&implicita0(den))return false;
    return true}
  static quitarDenominadoresArray(array){let mcmul="1"; let nuevoArray=array.map(function(arr){return arr.slice()});
    for (let i=0; i<nuevoArray.length;i++){nuevoArray[i]=ExpresionAlgebraica.simplificar(nuevoArray[i])}let denominadores=[];
    for (let i=0; i<nuevoArray.length;i++){denominadores.push(FraccionAlgebraica.denominador(nuevoArray[i]))};mcmul=Polinomio.mcmArray(denominadores);
    for (let i=0; i<nuevoArray.length;i++){let ausss=Polinomio.dividir(mcmul,FraccionAlgebraica.denominador(nuevoArray[i]))[0];
    nuevoArray[i]=Polinomio.multiplicar(ausss,FraccionAlgebraica.numerador(nuevoArray[i]))};
    return [nuevoArray,mcmul,Polinomio.raices(mcmul),Polinomio.raicesValores(mcmul)]}
  static numerador(frac){let nume=FraccionAlgebraica.parseFraccion(frac)[0].toString(); return nume}
  static denominador(frac){let den=FraccionAlgebraica.parseFraccion(frac)[1].toString(); return den}
}
  

class ExpresionNumerica{
  constructor(expresion) { this.expresion = expresion; }
  static esValida(expresion) {return Validar.expresionNumerica(expresion)[0];}
  static infijaAPostfija(expresion){let r = Validar.expresionNumerica(expresion)[1];return r;}
  static postfijaAInfija(salida) {const pila = [];const prioridad = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 }; // <- sin "=";const reNumero = /^-?\d+(?:\.\d+)?$/;
    for (const token of salida) {if (reNumero.test(token)) {pila.push({ expr: token, prio: 4 });} 
      else if (funciones.includes(token)) {if (!pila.length) return [false, "Error: argumento faltante para la función."];
        const arg = pila.pop();pila.push({ expr: `${token}(${arg.expr})`, prio: 4 });} 
      else if (token === "pi" || token === "e") {pila.push({ expr: token, prio: 4 });} 
      else if ("+-*/^".includes(token)) {if (pila.length < 2) return [false, "Error: no es una expresión válida"];
      const b = pila.pop(), a = pila.pop();const prio = prioridad[token];if (token === "-" && a.expr === "0") {pila.push({ expr: `-${b.expr}`, prio: 1 });continue;}
      if (token === "+" && a.expr === "0") {pila.push({ expr: `${b.expr}`, prio: 1 });continue;};let aExpr, bExpr;
        if (token === "^") {aExpr = a.prio < prio ? `(${a.expr})` : a.expr;bExpr = b.prio <= prio ? `(${b.expr})` : b.expr; } 
        else {aExpr = a.prio < prio ? `(${a.expr})` : a.expr;bExpr = (b.prio < prio) || ((token === "-" || token === "/") && b.prio === prio)? `(${b.expr})` : b.expr;}
        pila.push({ expr: `${aExpr}${token}${bExpr}`, prio });} 
        else {return [false, `Error: token desconocido '${token}'`];}}
    if (pila.length !== 1) return [false, "Error: no es una expresión válida"];let res = pila[0].expr;
    res = res.replace(/^\+/, "");res = res.replace(/\(\+/g, "(");return res;}
  static calcular(expresion) {const postfija = ExpresionNumerica.infijaAPostfija(expresion);if (!Array.isArray(postfija)) { throw new Error("La expresión no es válida."); }
    const pila = [];for (const token of postfija) {if (/^-?\d+(\.\d+)?$/.test(token)) {pila.push(parseFloat(token));} else if (token === "pi") {pila.push(Math.PI);} 
     else if (token === "e") {pila.push(Math.E);} else if ("+-*/^".includes(token)) {if (pila.length < 2) throw new Error("Expresión inválida: faltan operandos.");
      const b = pila.pop(); const a = pila.pop(); let res;switch (token) {case "+": res = a + b; break;case "-": res = a - b; break;
        case "*": res = a * b; break;case "/": res = a / b; break;case "^": res = Math.pow(a, b); break;}pila.push(res);} 
      else if (funciones.includes(token)) {if (pila.length < 1) throw new Error("Expresión inválida: falta argumento de función.");const a = pila.pop(); let res;
      switch (token) {case "sin": case "sen": res = Math.sin(a); break;case "cos": res = Math.cos(a); break;case "tan": case "tg": res = Math.tan(a); break;
        case "arcsin": case "arcsen": res = Math.asin(a); break;case "arccos": res = Math.acos(a); break;case "arctan": case "arctg": res = Math.atan(a); break;
        case "sqrt": res = Math.sqrt(a); break;case "log": res = Math.log10(a); break;case "ln":  res = Math.log(a); break;case "abs": res = Math.abs(a); break;
        case "exp": res = Math.exp(a); break;default: throw new Error(`Función no soportada: ${token}`);};pila.push(res);} 
        else {throw new Error(`Token desconocido: ${token}`);}}
    if (pila.length !== 1) throw new Error("Expresión inválida: sobran operandos.");return fraccionContinua(pila[0].toString(),long);}
  static calcularUnPaso(expresion){const dec=ExpresionAlgebraica.pasarADecimal(expresion);
    const rpn=ExpresionNumerica.infijaAPostfija(dec);if(!Array.isArray(rpn))throw new Error("La expresión no es válida.");
    const esNum=t=>/^-?\d+(\.\d+)?$/.test(t),esFun=t=>funciones.includes(t);let idx=-1,c=0;
    for(let i=0;i<rpn.length;i++){const t=rpn[i];if(esNum(t))c++;else if(esFun(t)){if(c>=1&&idx<0)idx=i;c=c-1+1;}
      else if("+-*/^".includes(t)){if(c>=2&&idx<0)idx=i;c=c-2+1;} else throw new Error(`Token desconocido: ${t}`);}
    if(idx<0)return ExpresionAlgebraica.pasarAFraccion(dec);let span=null;{const st=[];for(let i=0;i<=idx;i++){const t=rpn[i];
    if(esNum(t))st.push({s:i,e:i});else if(esFun(t)){const a=st.pop();st.push({s:a.s,e:i});if(i===idx)span={s:a.s,e:i};}
      else if("+-*/^".includes(t)){const b=st.pop(),a=st.pop();st.push({s:a.s,e:i});if(i===idx)span={s:a.s,e:i};}}}
    const evalRPN=tks=>{const p=[];for(const t of tks){if(esNum(t))p.push(parseFloat(t));
      else if("+-*/^".includes(t)){const b=p.pop(),a=p.pop();p.push(t==="+"?a+b:t==="-"?a-b:t==="*"?a*b:t==="/"?a/b:Math.pow(a,b));}
      else if(esFun(t)){const a=p.pop();switch(t){case"sin":case"sen":p.push(Math.sin(a));break;case"cos":p.push(Math.cos(a));break;case"tan":case"tg":p.push(Math.tan(a));
      break;case"arcsin":case"arcsen":p.push(Math.asin(a));break;case"arccos":p.push(Math.acos(a));break;case"arctan":case"arctg":p.push(Math.atan(a));break;case"sqrt":p.push(Math.sqrt(a));
      break;case"log":p.push(Math.log10(a));break;case"ln":p.push(Math.log(a));break;case"abs":p.push(Math.abs(a));break;case"exp":p.push(Math.exp(a));
      break;default:throw new Error(`Función no soportada: ${t}`);}}
      else throw new Error(`Token desconocido: ${t}`);}if(p.length!==1)throw new Error("Expresión inválida: sobran operandos.");return p[0];};
    const res=evalRPN(rpn.slice(span.s,span.e+1));const nueva=[...rpn.slice(0,span.s),res.toString(),...rpn.slice(span.e+1)];
    const prec={"+":1,"-":1,"*":2,"/":2,"^":3};const rpnAInfija=tks=>{const p=[];for(const t of tks){
      if(esNum(t))p.push({expr:Number(t).toString(),prec:Infinity});
      else if("+-*/^".includes(t)){const r=p.pop(),l=p.pop(),pr=prec[t],le=l.prec<pr?`(${l.expr})`:l.expr;let rn=r.prec<pr||((t==="-"||t==="/")&&r.prec===pr);
      if(t==="^")rn=r.prec<=pr;const re=rn?`(${r.expr})`:r.expr;p.push({expr:`${le}${t}${re}`,prec:pr});}
      else if(esFun(t)){const a=p.pop(),arg=a.prec===Infinity?a.expr:`(${a.expr})`;p.push({expr:`${t}(${arg})`,prec:Infinity});}
      else throw new Error(`Token desconocido durante conversión: ${t}`);}if(p.length!==1)throw new Error("Conversión inválida: sobran operandos.");return p[0].expr;};
    return ExpresionAlgebraica.pasarAFraccion(rpnAInfija(nueva));}
}


class ExpresionAlgebraica {constructor(expresion) {this.expresion = expresion;}
  static esValida(expresion) {let r=Validar.expresionAlgebraica(expresion)[0];return r};static pasarADecimal(expres) {expres = expres.toString();
  expres = expres.replace(/\(\s*(\d+)\s*\/\s*(\d+)\s*\)\s*\^\s*([0-9]+(?:\.[0-9]+)?|[0-9]+\s*\/\s*[0-9]+)/g,(_, n, d, exp) => {
      const base = Number(d) === 0 ? NaN : Number(n) / Number(d);
      const expo = /\//.test(exp)? (([p, q]) => (Number(q) === 0 ? NaN : p / q))(exp.split('/').map(Number)): Number(exp);return (base ** expo).toString();});
  expres = expres.replace(/(\d+(?:\.\d+)?)\s*\^\s*([0-9]+(?:\.[0-9]+)?|[0-9]+\s*\/\s*[0-9]+)/g,(_, baseStr, exp) => {
      const base = Number(baseStr);const expo = /\//.test(exp)? (([p, q]) => (Number(q) === 0 ? NaN : p / q))(exp.split('/').map(Number)): Number(exp);
      return (base ** expo).toString();});
  expres = expres.replace(/(\d+)\s*\/\s*(\d+)(?!\s*\^)/g,(_, n, d) => (Number(d) === 0 ? 'NaN' : (Number(n) / Number(d)).toString()));
  expres = expres.replace(/(^|[^A-Za-z0-9_])\((\d+(?:\.\d+)?)\)(?![A-Za-z0-9_])/g,(_, pre, num) => pre + num);return expres;}
  static pasarAFraccion(expr, long = 10) {let regexCoeficientes = /(?<!\^)(\d+\.\d+)/g; let numerosDecimalesCoeficientes = expr.match(regexCoeficientes);
    if (numerosDecimalesCoeficientes !== null) {for (let i = 0; i < numerosDecimalesCoeficientes.length; i++) 
    {let fraccion = fraccionContinua(numerosDecimalesCoeficientes[i].toString(), long);expr = expr.replace(numerosDecimalesCoeficientes[i], fraccion);}}
    let regexExponente = /(\^)(\d+\.\d+)/g;expr = expr.replace(regexExponente, (_, caret, exponente) => {let fraccionExponente = fraccionContinua(exponente.toString(), long);
    return `${caret}(${fraccionExponente})`;});return expr;}
  static sustituir (exp,letra,valor){valor=valor.toString();valor=ExpresionAlgebraica.pasarADecimal(valor);let expPostFija=ExpresionAlgebraica.infijaAPostfija(exp);
    let expSustituida=[];
    for (let i=0;i<expPostFija.length;i++){if(expPostFija[i]===letra){expSustituida[i]=valor}else{expSustituida[i]=expPostFija[i]};}
    while(expSustituida.includes("+")||expSustituida.includes("-")||expSustituida.includes("*")||expSustituida.includes("^")||expSustituida.includes("/")){
    for (let i=0;i<expSustituida.length;i++){
      if(expSustituida[i]==="+")
         {let aux1=expSustituida[i-2];let aux2=expSustituida[i-1];expSustituida.splice(i-2,2);expSustituida[i-2]=(parseFloat(aux1)+parseFloat(aux2)).toString();break};
      if(expSustituida[i]==="-")
         {let aux1=expSustituida[i-2];let aux2=expSustituida[i-1];expSustituida.splice(i-2,2);expSustituida[i-2]=(parseFloat(aux1)-parseFloat(aux2)).toString();break};
      if(expSustituida[i]==="*") 
         {let aux1=expSustituida[i-2];let aux2=expSustituida[i-1];expSustituida.splice(i-2,2);expSustituida[i-2]=(parseFloat(aux1)*parseFloat(aux2)).toString();break};
      if(expSustituida[i]==="/")
         {let aux1=expSustituida[i-2];let aux2=expSustituida[i-1];expSustituida.splice(i-2,2);expSustituida[i-2]=(parseFloat(aux1)/parseFloat(aux2)).toString();break};
      if(expSustituida[i]==="^")
         {let aux1=expSustituida[i-2];let aux2=expSustituida[i-1];expSustituida.splice(i-2,2);expSustituida[i-2]=(parseFloat(aux1)**parseFloat(aux2)).toString();break};}}
    return expSustituida.pop();}
  static infijaAPostfija(expresion) {let r=Validar.expresionAlgebraica(expresion)[1];return r}
  static postfijaAInfija(salida) {const pila = [];const prioridad = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };const reNumero = /^\d+\.?\d*$/;
    const reSoloLetras = /^[A-Za-z\u0391-\u03A9\u03B1-\u03C9]+$/;const reLetraSubNum = /^[A-Za-z\u0391-\u03A9\u03B1-\u03C9]_[0-9]+$/;
    for (const token of salida) {
      if (token.startsWith('{\\begin{pmatrix}') && token.endsWith('\\end{pmatrix}}')) {pila.push({ expr: token, prio: 4 });continue;}
      if (reNumero.test(token) ||((reSoloLetras.test(token) || reLetraSubNum.test(token)) && !funciones.includes(token))) {pila.push({ expr: token, prio: 4 });}
      else if (funciones.includes(token)) {if (!pila.length) return false;const arg = pila.pop();pila.push({ expr: `${token}(${arg.expr})`, prio: 4 });}
      else if ("+-*/^".includes(token)) {if (pila.length < 2) return [false, "Error: no es una expresión válida"];const b = pila.pop(), a = pila.pop();
        const prio = prioridad[token];
        if (token === "-" && a.expr === "0") {const necesitaParens = b.prio <= 1;const be = necesitaParens ? `(${b.expr})` : b.expr;
          pila.push({ expr: `-${be}`, prio: 3 });continue;};let aExpr, bExpr;
        if (token === "^") {aExpr = a.prio < prio ? `(${a.expr})` : a.expr;bExpr = b.prio <= prio ? `(${b.expr})` : b.expr;} 
        else {aExpr = a.prio < prio ? `(${a.expr})` : a.expr;const necesitaParensDerecha = b.prio < prio || ((token === "-" || token === "/") && b.prio === prio);
          bExpr = necesitaParensDerecha ? `(${b.expr})` : b.expr;}
        pila.push({ expr: `${aExpr}${token}${bExpr}`, prio });}
      else {return [false, `Error: token no reconocido '${token}'`];}}
    if (pila.length !== 1) return false; return pila[0].expr;}  
  static simplificar (exp){if(exp===""){return "0"};
    let expPostfija=ExpresionAlgebraica.infijaAPostfija(exp);
    while(expPostfija.length!==1){for (let i=0;i<expPostfija.length;i++){
        if(expPostfija[i]==="+"){
          if(expPostfija[i-1].includes("/")||expPostfija[i-2].includes("/")){let frac=FraccionAlgebraica.sumar(expPostfija[i-2],expPostfija[i-1]);
          expPostfija[i]=frac.toString();expPostfija.splice(i-2,2);break;}else{let pol=Polinomio.sumar(expPostfija[i-2],expPostfija[i-1]);
          expPostfija[i]=pol;expPostfija.splice(i-2,2);break;}};
        if(expPostfija[i]==="-"){
          if(expPostfija[i-1].includes("/")||expPostfija[i-2].includes("/")){let frac=FraccionAlgebraica.restar(expPostfija[i-2],expPostfija[i-1]);
          expPostfija[i]=frac.toString();expPostfija.splice(i-2,2);break;}else{let pol=Polinomio.restar(expPostfija[i-2],expPostfija[i-1]);
          expPostfija[i]=pol;expPostfija.splice(i-2,2);break;}};
        if(expPostfija[i]==="*"){
          if(expPostfija[i-1].includes("/")||expPostfija[i-2].includes("/")){let frac=FraccionAlgebraica.multiplicar(expPostfija[i-2],expPostfija[i-1]);
          expPostfija[i]=frac.toString();expPostfija.splice(i-2,2);break;}else{let pol=Polinomio.multiplicar(expPostfija[i-2],expPostfija[i-1]);
          expPostfija[i]=pol;expPostfija.splice(i-2,2);break;}};
        if(expPostfija[i]==="/"){
          if(expPostfija[i-1].includes("/")||expPostfija[i-2].includes("/")){let frac=FraccionAlgebraica.dividir(expPostfija[i-2],expPostfija[i-1]);
          expPostfija[i]=frac.toString();expPostfija.splice(i-2,2);break;}else{let frac=FraccionAlgebraica.parseFraccion(expPostfija[i-2]+"/"+expPostfija[i-1]);
          expPostfija[i]=frac.toString();let antes=""; let despues="";for (let j=0;j<expPostfija[i].length;j++){if (expPostfija[i][j]!==","){antes=antes+expPostfija[i][j]};
          if(expPostfija[i][j]===","){for(let k=j+1;k<expPostfija[i].length;k++){despues=despues+expPostfija[i][k]}break;}}expPostfija[i]="("+antes+")/("+despues+")";
          expPostfija[i]=FraccionAlgebraica.simplificar(expPostfija[i]);expPostfija.splice(i-2,2);break;}};
        if(expPostfija[i]==="^"){
          if(expPostfija[i-2].includes("/")){let aux=expPostfija[i-2];let expo=parseInt(expPostfija[i-1]);let resul=aux;
          for(let i=0;i<expo-1;i++){resul=FraccionAlgebraica.multiplicar(resul,aux)};expPostfija[i]=resul;expPostfija.splice(i-2,2);break;}
          else{let aux=expPostfija[i-2];let expo=parseInt(expPostfija[i-1]);let resul=aux;for(let i=0;i<expo-1;i++){resul=Polinomio.multiplicar(resul,aux)}
          expPostfija[i]=resul;expPostfija.splice(i-2,2);break;}};}}
    expPostfija=expPostfija[0];expPostfija=expPostfija.replace(/\s+/g, "");if(FraccionAlgebraica.esFraccionAlgebraica(expPostfija)){
    let numeradorr=FraccionAlgebraica.parseFraccion(expPostfija)[0].toString();let denominadorr=FraccionAlgebraica.parseFraccion(expPostfija)[1].toString();
    numeradorr=Polinomio.ordenarTotal(numeradorr); denominadorr=Polinomio.ordenarTotal(denominadorr);
    expPostfija="("+numeradorr+")/("+denominadorr+")";expPostfija=FraccionAlgebraica.simplificar(expPostfija)}else{expPostfija=Polinomio.ordenarTotal(expPostfija);};  
    expPostfija=ExpresionAlgebraica.pasarAFraccion(expPostfija,long);return expPostfija;}  
  static obtenerFactores(expresion) {
    function balancear(exp){let parentesisA=0; let parentesisC=0;for (let i=0;i<exp.length;i++){if(exp[i]==="("){parentesisA++};if(exp[i]===")")
    {parentesisC++}}; while(parentesisA!==parentesisC){if(parentesisA<parentesisC){exp="("+exp;parentesisA++};if(parentesisA>parentesisC){exp=exp+")";parentesisC++}}
    return exp;}
    function deshacer(exp){let ress=ExpresionAlgebraica.infijaAPostfija(exp); 
      if(ress[ress.length-1]==="-"){ress=ress.slice(1,ress.length-1); ress[0]="-"+ress[0]}; let anadir=[];ress=ress.filter(el=>el!=="*");
      for (let j=0;j<ress.length;j++){
    if (ress[j]==="^"){for(let k=0;k<parseInt(ress[j-1]);k++){anadir=[...anadir,ress[j-2]]}; ress[j-2]="?";ress[j-1]="?";ress[j]="?";}};
    ress=ress.filter(elemento=>elemento!=="?");ress=[...anadir,...ress];
    return ress}
    let factores = []; let codigos=[]; let factor=expresion[0];if(expresion[0]==="("){codigos[0]=1}else{codigos[0]=0}
    for (let i=1; i<expresion.length;i++){if(expresion[i]==="("&&codigos[i-1]===0){codigos[i]=1};if(expresion[i]==="("&&codigos[i-1]===1){codigos[i]=1};
    if(expresion[i]!=="("&&expresion[i]!==")"){codigos[i]=codigos[i-1]};if(expresion[i]===")"){codigos[i]=0}}
    for (let i=1; i<expresion.length;i++){if(codigos[i]===codigos[i-1]){factor=factor+expresion[i]; if(i===expresion.length-1){factores.push(factor)}}
    else{factores.push(factor);factor=expresion[i]}}
    for (let i=0;i<factores.length;i++){if(factores[i][0]===")"){factores[i]=factores[i].slice(1)}};for (let i=0;i<factores.length;i++){factores[i]=balancear(factores[i])};
    for (let i=0;i<factores.length;i++){while(factores[i][0]==="("){if(factores[i][factores[i].length-1]===")"){factores[i]=factores[i].slice(1, -1);}}}
    factores = factores.filter(function(cadena) {return cadena !== "";});if(factores[0]==="-"){factores[0]="-1"};if(expresion.length===1){factores.push(expresion)}
    for (let i=0;i<factores.length;i++){if (factores[i][0]==="^"){factores[i]="("+factores[i-1]+")"+factores[i]; factores[i-1]="?"}};
    factores=factores.filter(elemento=>elemento!=="?");let anadir=[]
    for (let i=0;i<factores.length;i++){if (!factores[i].includes("+")&&!factores[i].slice(1).includes("-")){let auss=deshacer(factores[i]); 
    anadir=[...anadir,...auss]; factores[i]="?"}}
    factores=factores.filter(elemento=>elemento!=="?");factores=[...anadir,...factores];
    return factores;}
  static notacionConProductos(exp) {const constantes = ["pi", "e"].sort((a, b) => b.length - a.length);let tokens = [];let i = 0;
    while (i < exp.length) {let encontrado = false; for (let func of funciones) {if (exp.slice(i, i + func.length) === func) {tokens.push(func);i += func.length;
          encontrado = true;break;}}if (encontrado) continue;
      for (let c of constantes) {if (exp.slice(i, i + c.length) === c) {tokens.push(c);i += c.length;encontrado = true;break;}}
      if (encontrado) continue;const esInicioDeNumero =(exp[i] === '-' && i + 1 < exp.length && /\d/.test(exp[i + 1]) &&
        (i === 0 || "+-*/(^".includes(exp[i - 1]) || exp[i - 1] === '('))|| /\d/.test(exp[i]);
      if (esInicioDeNumero) {let numero = exp[i];i++;let puntoEncontrado = false;
        while (i < exp.length && (/[\d.]/.test(exp[i]))) {if (exp[i] === '.') {if (puntoEncontrado) break;puntoEncontrado = true;}
          numero += exp[i];i++;};tokens.push(numero);continue;};tokens.push(exp[i]);i++;}
    const esLetra = s => /^[a-zA-Z\u0370-\u03FF]$/.test(s); const esNumero = s => /^-?\d+(\.\d+)?$/.test(s);
    const esConst = s => s === "pi" || s === "e";const esParentesisAbierto = s => s === "(";const esParentesisCerrado = s => s === ")";
    let resultado = [];for (let i = 0; i < tokens.length; i++) {const actual = tokens[i];const siguiente = tokens[i + 1];
      const antactual = tokens[i - 1];const antantactual = tokens[i - 2];resultado.push(actual);if (!siguiente) continue;
      if (funciones.includes(actual) && siguiente === "(") continue;
      const insertar = ((esLetra(actual) && (esLetra(siguiente) || esNumero(siguiente) || esConst(siguiente) || esParentesisAbierto(siguiente) || 
         funciones.includes(siguiente))) ||((esNumero(actual) || esConst(actual)) &&
        (esLetra(siguiente) || esParentesisAbierto(siguiente) || funciones.includes(siguiente) || esConst(siguiente)) &&
        (antactual !== "^" || !funciones.includes(antantactual))) ||
        (esParentesisCerrado(actual) &&(esLetra(siguiente) || esNumero(siguiente) || esConst(siguiente) || esParentesisAbierto(siguiente) || 
        funciones.includes(siguiente))) ||
        (funciones.includes(actual) && (esLetra(siguiente) || funciones.includes(siguiente) || esConst(siguiente))));
      if (insertar) resultado.push("*");};return resultado.join('');}
  static notacionSinProductos(expre){return expre.replace(/(\d|[a-zA-Z)\]])\*(?=[a-zA-Z(\[])/g, "$1").replace(/([a-zA-Z)\]])\*(\d|[a-zA-Z(\[])/g, "$1$2");}
  static restarCadenaRango(cadena, ini, fin) {let resultado=cadena.slice(0,ini)+cadena.slice(fin+1);return resultado;}
  static pasarALatex(exp){
    if(exp==="")return"0";const tokens=ExpresionAlgebraica.infijaAPostfija(exp);
    const fnMap={sin:"\\sin",sen:"\\sin",cos:"\\cos",tan:"\\tan",tg:"\\tan",arcsin:"\\arcsin",
    arcsen:"\\arcsin",arctan:"\\arctan",arctg:"\\arctan",log:"\\log",ln:"\\ln",
    sqrt:"\\sqrt",abs:"abs",exp:"exp"};
    const prec={"+":1,"-":1,"*":2,"/":2,"^":3},isNum=s=>/^-?\d+(?:\.\d+)?$/.test(s);
    const renderFn=(name,arg)=>{if(name==="sqrt")return`\\sqrt{${arg}}`;
    if(name==="abs")return`\\left|${arg}\\right|`;if(name==="exp")return`e^{${arg}}`;
    const macro=fnMap[name]||`\\operatorname{${name}}`;return`${macro}\\left(${arg}\\right)`;};
    const isPlainNumLatex=s=>/^-?\d+(?:\.\d+)?$/.test(s),stack=[];
    for(const t of tokens){
    if(isNum(t))stack.push({expr:String(Number(t)),pr:Infinity});
    else if(t==="pi")stack.push({expr:"\\pi",pr:Infinity});
    else if(t==="e")stack.push({expr:"e",pr:Infinity});
    else if(t in prec){
    if(t==="/"){const b=stack.pop(),a=stack.pop();
    stack.push({expr:`\\dfrac{${a.expr}}{${b.expr}}`,pr:Infinity});continue;}
    const b=stack.pop(),a=stack.pop();
    if(t==="-"&&a.expr==="0"){let R=b.expr,needUR=b.pr<prec["-"]||b.pr===prec["-"];
    if(needUR||R[0]==="-")R=`\\left(${R}\\right)`;stack.push({expr:`-${R}`,pr:prec["*"]});continue;}
    if(t==="^"){const rx=/^((?:\\[A-Za-z]+)|(?:\\operatorname\{[^}]+\}))\\left\((.*)\\right\)$/;
    const m=a.expr.match(rx);
    if(m&&m[1]!=="\\sqrt"){const macro=m[1],arg=m[2];
    stack.push({expr:`${macro}^{${b.expr}}\\left(${arg}\\right)`,pr:prec["^"]});continue;}
    const base=a.pr<prec["^"]?`\\left(${a.expr}\\right)`:a.expr;
    stack.push({expr:`${base}^{${b.expr}}`,pr:prec["^"]});continue;}
    if(t==="*"){const L=a.pr<prec["*"]?`\\left(${a.expr}\\right)`:a.expr;
    const R=b.pr<prec["*"]?`\\left(${b.expr}\\right)`:b.expr;let mul;
    if(isPlainNumLatex(a.expr)&&!isPlainNumLatex(b.expr))mul=`${a.expr}\\,${R}`;
    else if(!isPlainNumLatex(a.expr)&&isPlainNumLatex(b.expr))mul=`${L}\\,${b.expr}`;
    else if(isPlainNumLatex(a.expr)&&isPlainNumLatex(b.expr))mul=`${L}\\cdot ${R}`;
    else mul=`${L}${R}`;stack.push({expr:mul,pr:prec["*"]});continue;}
    const L=a.pr<prec[t]?`\\left(${a.expr}\\right)`:a.expr;
    const needR=b.pr<prec[t]||(t==="-"&&b.pr===prec[t]);
    let R=needR?`\\left(${b.expr}\\right)`:b.expr;
    if(t==="-"&&!needR&&R[0]==="-")R=`\\left(${R}\\right)`;stack.push({expr:`${L}${t}${R}`,pr:prec[t]});
    }else if(Array.isArray(funciones)&&funciones.includes(t)){const a=stack.pop();
    stack.push({expr:renderFn(t,a.expr),pr:Infinity});}
    else stack.push({expr:t,pr:Infinity});}
    let out=stack.length?stack[0].expr:"0";out=out.replace(/\\cdot/g,"\\cdot ");
    out=out.replace(/\\left\(([A-Za-z])\^{-(\d+)}\\right\)/g,"$1^{-{$2}}");return out;}
  static evaluarGradoPolinomioEPF(expresion) {let pila = [];
    for (let i=0;i<expresion.length;i++){if(expresion[i]===" "){expresion.splice(i,1)}};for (let i=0;i<expresion.length;i++){
      if (!isNaN(expresion[i])) {pila.push(0)};
      if (expresion[i].match(/^[a-zA-Z]+$/)){pila.push(1)};
      if (expresion[i]==="^"){pila.pop();let aux=pila[pila.length-1];pila.pop();pila.push(expresion[i-1]*aux)};
      if (expresion[i]==="+"||expresion[i]==="-"){let aux=Math.max(pila[pila.length-1],pila[pila.length-2]);pila.pop();pila.pop();pila.push(aux)};
      if (expresion[i]==="*"){let aux=pila[pila.length-1]+pila[pila.length-2];pila.pop();pila.pop();pila.push(aux)};}return pila.pop();}
  static evaluarGradoPolinomioEIF(expresion) {expresion = ExpresionAlgebraica.infijaAPostfija(expresion);let pila = [];
    for (let i=0;i<expresion.length;i++){if(expresion[i]===" "){expresion.splice(i,1)}};for (let i=0;i<expresion.length;i++){
    if (!isNaN(expresion[i])) {pila.push(0)};
    if (expresion[i].match(/^[a-zA-Z]+$/)){pila.push(1)};
    if (expresion[i]==="^"){pila.pop();let aux=pila[pila.length-1];pila.pop();pila.push(expresion[i-1]*aux)};
    if (expresion[i]==="+"||expresion[i]==="-"){let aux=Math.max(pila[pila.length-1],pila[pila.length-2]);pila.pop();pila.pop();pila.push(aux)};
    if (expresion[i]==="*"){let aux=pila[pila.length-1]+pila[pila.length-2];pila.pop();pila.pop();pila.push(aux)};}return pila.pop();}
  static eliminarParentesisInnecesarios(exp){
    let ex=exp; ex=ExpresionAlgebraica.infijaAPostfija(ex); ex=ExpresionAlgebraica.postfijaAInfija(ex); return ex;}
  static emparejarPrimerParentesis(cadena){let contador=0;let codigos=[];for(let i=0;i<cadena.length;i++){
    if(cadena[i]==="("){contador++}; if(cadena[i]===")"){contador--};codigos.push(contador)}
    let primero=0;for(let i=0;i<cadena.length;i++){if(cadena[i]==="("){primero=i;break}}
    let relacionado=0;for(let i=primero+1;i<cadena.length;i++){if(codigos[i]===0){relacionado=i;break}}
    return[primero,relacionado]}
  static emparejarParentesis(cadena){let contador=0;let parejas=[];while(cadena.includes("(")){
    for(let i=0;i<cadena.length;i++){if(cadena[i]==="("){let pareja=[];pareja.push(i);contador=1;for (let j=i+1;j<cadena.length;j++){
    if (cadena[j]==="("){contador++};if (cadena[j]===")"){contador--};if(cadena[j]===")"&&contador===0){pareja.push(j);
    let array=cadena.split("");array[i]="#";array[j]="#";cadena=array.join("");parejas.push(pareja);break}}}}};return parejas;}                                         
}


class Matriz {constructor(array) {this.matriz = array;}
  static _S(x){let s=(x??"0").toString();if(typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.simplificar)s=ExpresionAlgebraica.simplificar(s);
    return (s==="-0"||s==="−0")?"0":s;}
  static _Z(x){return Matriz._S(x)==="0";}
  static _isNum(x){let s=(x??"").toString().trim().replace(/\s+/g,"").replace(/,/g,".");if(s==="")return false;
    return /^[+\-]?\d+$/.test(s)||/^[+\-]?\d*\.\d+$/.test(s)||/^[+\-]?\d+\/[+\-]?\d+$/.test(s);}
  static sumar(matrizA, matrizB) {return matrizA.map((fila, i) =>fila.map((valor, j) => ExpresionAlgebraica.simplificar("("+valor +")+("+ matrizB[i][j]+")")));}
  static restar(matrizA, matrizB) {return matrizA.map((fila, i) =>fila.map((valor, j) => ExpresionAlgebraica.simplificar("("+valor +")-("+ matrizB[i][j]+")")));}
  static multiplicar(matrizA, matrizB) {const resultado = Array(matrizA.length).fill(0).map(() => Array(matrizB[0].length).fill(0));
    for (let i = 0; i < matrizA.length; i++) {for (let j = 0; j < matrizB[0].length; j++) {for (let k = 0; k < matrizB.length; k++) 
    {resultado[i][j]= ExpresionAlgebraica.simplificar("("+resultado[i][j]+")+("+ExpresionAlgebraica.simplificar("("+matrizA[i][k]+")*("+ matrizB[k][j]+")")+")");}}};
    return resultado;}
  static multiplicarEscalar(numero, matriz) {let matrizN=matriz.map(function(arr){return arr.slice()})
    for (let i = 0; i < matrizN.length; i++) {for (let j = 0; j < matrizN[0].length; j++) {
      matrizN[i][j]=ExpresionAlgebraica.simplificar("("+matriz[i][j]+")*("+numero+")")}}return matrizN}
  static trasponer(matriz) {return matriz[0].map((_, i) => matriz.map(fila => fila[i]));}
  static filasNulasAbajo(matriz){const filasNoNulas=matriz.filter(fila=>!fila.every(e=>Matriz._Z(e)));
    const filasNulas=matriz.filter(fila=>fila.every(e=>Matriz._Z(e)));return [...filasNoNulas,...filasNulas];}
  static ordenarFilasPorCeros(mat){
    let resultado=mat.map(arr=>arr.slice());return resultado.sort((filaA,filaB)=>contar(filaA)-contar(filaB));
    function contar(fila){let c=0;for(let e of fila){if(Matriz._Z(e))c++;else break;}return c;}}
  static reducida(matriz){
    if(!Array.isArray(matriz)||matriz.length===0||!Array.isArray(matriz[0])||matriz[0].length===0)return [];
    const S=s=>ExpresionAlgebraica.simplificar(String(s)),norm=x=>{const y=S(x);return (y==="-0"||y==="−0")?"0":y;};
    const sub=(a,b)=>norm(`(${a})-(${b})`),mul=(a,b)=>norm(`(${a})*(${b})`),div=(a,b)=>norm(`(${a})/(${b})`);
    const isZero=x=>norm(x)==="0",esNula=f=>f.every(v=>isZero(v));
    let aux=matriz.map(f=>f.map(norm));const filas=aux.length,columnas=aux[0].length;
    const pushNulas=()=>{const noN=[],nu=[];for(const f of aux)(esNula(f)?nu:noN).push(f);aux=noN.concat(nu);};
    pushNulas();let filaPiv=0;
    for(let col=0;col<columnas&&filaPiv<filas;col++){let p=filaPiv;while(p<filas&&isZero(aux[p][col]))p++;if(p===filas)continue;
      if(p!==filaPiv)[aux[filaPiv],aux[p]]=[aux[p],aux[filaPiv]];const a=aux[filaPiv][col];
      for(let r=filaPiv+1;r<filas;r++){const b=aux[r][col];if(isZero(b))continue;
        for(let k=col;k<columnas;k++)aux[r][k]=sub(mul(a,aux[r][k]),mul(b,aux[filaPiv][k]));}
      pushNulas();filaPiv++;}
    const pivs=[];for(let i=0;i<filas;i++){if(esNula(aux[i]))continue;let j=0;while(j<columnas&&isZero(aux[i][j]))j++;if(j<columnas)pivs.push({fila:i,col:j});}
    for(let t=pivs.length-1;t>=0;t--){const {fila,col}=pivs[t],a=aux[fila][col];if(isZero(a))continue;
      for(let r=fila-1;r>=0;r--){const b=aux[r][col];if(isZero(b))continue;
        for(let k=col;k<columnas;k++)aux[r][k]=sub(mul(a,aux[r][k]),mul(b,aux[fila][k]));}}pushNulas();
    for(let i=0;i<filas;i++){
      if(esNula(aux[i])){for(let k=0;k<columnas;k++)aux[i][k]="0";continue;}
      let j=0;while(j<columnas&&isZero(aux[i][j]))j++;if(j>=columnas){for(let k=0;k<columnas;k++)aux[i][k]="0";continue;}
      const piv=aux[i][j];for(let k=0;k<columnas;k++)aux[i][k]=div(aux[i][k],piv);aux[i][j]="1";};return aux.map(f=>f.slice());}
  static reducidaNoNormalizada(matriz){
    if(!Array.isArray(matriz)||matriz.length===0||!Array.isArray(matriz[0])||matriz[0].length===0)return [];
    const S=s=>ExpresionAlgebraica.simplificar(String(s)),norm=x=>{const y=S(x);return (y==="-0"||y==="−0")?"0":y;};
    const sub=(a,b)=>norm(`(${a})-(${b})`),mul=(a,b)=>norm(`(${a})*(${b})`);
    const isZero=x=>norm(x)==="0",esNula=f=>f.every(v=>isZero(v));
    let aux=matriz.map(f=>f.map(norm));const filas=aux.length,columnas=aux[0].length;
    const pushNulas=()=>{const noN=[],nu=[];for(const f of aux)(esNula(f)?nu:noN).push(f);aux=noN.concat(nu);};
    pushNulas();let filaPiv=0;
    for(let col=0;col<columnas&&filaPiv<filas;col++){let p=filaPiv;while(p<filas&&isZero(aux[p][col]))p++;if(p===filas)continue;
      if(p!==filaPiv)[aux[filaPiv],aux[p]]=[aux[p],aux[filaPiv]];const a=aux[filaPiv][col];
      for(let r=filaPiv+1;r<filas;r++){const b=aux[r][col];if(isZero(b))continue;
        for(let k=col;k<columnas;k++)aux[r][k]=sub(mul(a,aux[r][k]),mul(b,aux[filaPiv][k]));}
      pushNulas();filaPiv++;}
    const pivs=[];for(let i=0;i<filas;i++){if(esNula(aux[i]))continue;let j=0;while(j<columnas&&isZero(aux[i][j]))j++;if(j<columnas)pivs.push({fila:i,col:j});}
    for(let t=pivs.length-1;t>=0;t--){const {fila,col}=pivs[t],a=aux[fila][col];if(isZero(a))continue;
      for(let r=fila-1;r>=0;r--){ const b=aux[r][col];if(isZero(b))continue;
        for(let k=col;k<columnas;k++)aux[r][k]=sub(mul(a,aux[r][k]),mul(b,aux[fila][k]));}}
    pushNulas();for(let i=0;i<filas;i++)if(esNula(aux[i]))for(let k=0;k<columnas;k++)aux[i][k]="0";return aux.map(f=>f.slice());}
  static escalonarMatrizNumerica(matriz) {let aux=matriz.map(function (arr){return arr.slice()}); 
    for (let i=0;i<aux.length;i++){for (let j=0;j<aux[0].length;j++){aux[i][j]=parseFloat(aux[i][j])}};
    const filas = aux.length;const columnas = aux[0].length;let filaActual = 0;
    for (let col = 0; col < columnas; col++) {let pivote = filaActual;while (pivote < filas && aux[pivote][col] === 0) {pivote++};
    if (pivote === filas) {continue;};if (pivote !== filaActual) {[aux[filaActual], aux[pivote]] = [aux[pivote], aux[filaActual]];}
    for (let f = filaActual + 1; f < filas; f++) {if (aux[f][col] !== 0) {let aux1=aux[filaActual][col]; let aux2=aux[f][col];
    for (let k = col; k < columnas; k++) {aux[f][k]=aux[f][k]*aux1-aux[filaActual][k]*aux2}}};filaActual++;};
    for (let i=0;i<aux.length;i++){for (let j=0;j<aux[0].length;j++){if(aux[i][j]>0){break};if(aux[i][j]<0){aux[i] = aux[i].map(x => -x);break}}};
    aux=Matriz.simplificarFilasMatrizNumerica(aux);
    aux=Matriz.aString(aux); for (let i=0;i<aux.length;i++){for (let j=0;j<aux[0].length;j++){aux[i][j]=ExpresionAlgebraica.pasarAFraccion(aux[i][j],long)}};
    aux=Matriz.quitarDenominadores(aux)[0]; aux=Matriz.simplificarFilasNumericas(aux);
    return aux}
  static escalonarMatriz(matriz,letra){let maAux=matriz.map(r=>r.slice());const filas=maAux.length;
    if(!filas)return[[],[]];const columnas=maAux[0].length,A0=matriz.map(r=>r.slice(0,-1));
    const maxR=Math.min(A0.length,(A0[0]||[]).length);let filaActual=0;const casosCero=new Set();
    const casosRango=new Set();const norm=v=>typeof v==="string"?v.trim():String(v);
    const esNumero=v=>{if(typeof v!=="string")return!Number.isNaN(Number(v));const t=v.trim();if(t==="")return false;
    if(t==="0")return true;if(/^[+-]?\d+(\.\d+)?$/.test(t))return true;if(/^[+-]?\d+\/\d+$/.test(t))return true;
    return false};
    const esCero=v=>{if(!esNumero(v))return false;const t=v.toString().trim();
    if(t==="0"||t==="0.0"||t==="-0")return true;if(/^[+-]?0+\/\d+$/.test(t))return true;return false};
    for(let col=0;col<columnas&&filaActual<filas;col++){let pivote=filaActual;
    while(pivote<filas&&esCero(maAux[pivote][col]))pivote++;if(pivote===filas)continue;
    if(pivote!==filaActual)[maAux[filaActual],maAux[pivote]]=[maAux[pivote],maAux[filaActual]];
    const piv=maAux[filaActual][col];
    if(!esNumero(piv)){for(const v0 of Resolver.ecuacionValores(piv)){const v=norm(v0);casosCero.add(v);
    const Atest=Matriz.sustituir(A0.map(r=>r.slice()),letra,v);if(Matriz.rangoMatrizNumerica(Atest)<maxR)
    casosRango.add(v)}}
    for(let f=filaActual+1;f<filas;f++){if(!esCero(maAux[f][col])){const factor=maAux[f][col];
    for(let k=col;k<columnas;k++)maAux[f][k]=ExpresionAlgebraica.simplificar(
    `((${piv})*(${maAux[f][k]})-(${factor})*(${maAux[filaActual][k]}))`)}}filaActual++}
    maAux=Matriz.eliminarFilasNulas(maAux);
    if(maAux.length){const cols=maAux[0].length;
    for(let i=0;i<maAux.length;i++){for(let j=0;j<cols;j++){const val=maAux[i][j];
    if(!esCero(val)&&!esNumero(val)){for(const v0 of Resolver.ecuacionValores(val))casosCero.add(norm(v0));
    break}}}}
    let casosA=[...new Set([...Array.from(casosCero),...Array.from(casosRango).filter(v=>{
    const Atest=Matriz.sustituir(A0.map(r=>r.slice()),letra,v);return Matriz.rangoMatrizNumerica(Atest)<maxR
    })])];
    return[maAux,casosA];}
  static rangoMatrizNumerica(matriz){let aux=matriz.map(function (arr){return arr.slice()}); 
    let ran=0;aux=Matriz.escalonarMatrizNumerica(aux);aux=Matriz.filasNulasAbajo(aux);aux=Matriz.eliminarFilasNulas(aux);
    ran=aux.length;return ran;}
  static rangoPorCasos(matriz){if(!Matriz._simpCache)Matriz._simpCache=new Map();if(!Matriz._simp)Matriz._simp=function(s){const k=String(s).trim();if(Matriz._simpCache.has(k))return Matriz._simpCache.get(k);const v=ExpresionAlgebraica.simplificar(k);Matriz._simpCache.set(k,v);return v};
    const E=Matriz.escalonarMatriz(matriz)[0];if(!E||!E.length||!E[0]||!E[0].length)return[{condiciones:[],rango:0},[],[]];
    const nFilas=E.length,nCols=E[0].length,rTeor=Math.min(nFilas,nCols);function esCero(x){return Matriz._simp(x)==="0"}function esConst(e){return/^[+\-]?\(?\d+(?:\/\d+)?\)?$/.test(e)}
    const uniq=a=>[...new Set(a)],clone=m=>new Map(m);function addCond(conds,exprRaw,tipo){const e=Matriz._simp(exprRaw);if(e==="0"){if(tipo==="neq0")return{ok:false};return{ok:true,conds}}if(esConst(e)){if(tipo==="eq0")return{ok:false};return{ok:true,conds}}const next=clone(conds),prev=next.get(e);if(prev&&prev!==tipo)return{ok:false};next.set(e,tipo);return{ok:true,conds:next}}
    const candidatos=[];for(let i=0;i<nFilas;i++){const fila=[],seen=new Set();for(let j=0;j<nCols;j++){const aij=E[i][j];if(!esCero(aij)){const e=Matriz._simp(aij);if(!seen.has(e)){seen.add(e);fila.push(e)}}}candidatos.push(fila)}
    const piezasCrudas=[],memo=new Set();function keyEstado(f,conds){const arr=[...conds.entries()].sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0).map(([e,t])=>e+":"+t);return f+"|"+arr.join(",")}
    function dfs(f,conds,r){const k=keyEstado(f,conds);if(memo.has(k))return;memo.add(k);
    if(f===nFilas){const condiciones=[...conds.entries()].map(([e,t])=>t==="eq0"?`${e}=0`:`${e}!=0`).sort();piezasCrudas.push({condiciones,rango:r});return}
    const cand=candidatos[f];if(cand.length===0){dfs(f+1,conds,r);return}
    {const r1=addCond(conds,cand[0],"neq0");if(r1.ok)dfs(f+1,r1.conds,r+1)}
    for(let kk=1;kk<cand.length;kk++){let acc={ok:true,conds};for(let t=0;t<kk&&acc.ok;t++)acc=addCond(acc.conds,cand[t],"eq0");if(!acc.ok)continue;const rk=addCond(acc.conds,cand[kk],"neq0");if(rk.ok)dfs(f+1,rk.conds,r+1)}
    {let acc={ok:true,conds};for(let t=0;t<cand.length&&acc.ok;t++)acc=addCond(acc.conds,cand[t],"eq0");if(acc.ok)dfs(f+1,acc.conds,r)}}
    dfs(0,new Map(),0);
    function parseSols(raw,param){const arr=Array.isArray(raw)?raw:[raw];return arr.map(s=>String(s).replace(/\s+/g,"")).filter(s=>s.startsWith(param+"="))}
    function normEq0(expr,param){if(!expr.includes(param))return[expr+"=0"];const sols=parseSols(Resolver.ecuacion(expr),param);return sols.length?sols:[expr+"=0"]}
    function normNeq0(expr,param){if(!expr.includes(param))return[expr+"!=0"];const sols=parseSols(Resolver.ecuacion(expr),param);if(!sols.length)return[expr+"!=0"];return uniq(sols.map(s=>s.replace("=","!=")))}
    function normalizarCond(cond,param){if(cond.endsWith("!=0"))return normNeq0(cond.slice(0,-3),param);if(cond.endsWith("=0"))return normEq0(cond.slice(0,-2),param);return[cond]}
    function normalizarPieza(pieza,param){let conds=[];for(const c of pieza.condiciones)conds=conds.concat(normalizarCond(c,param));conds=uniq(conds).sort();return{condiciones:conds,rango:pieza.rango}}
    function detectarParam(piezas){const set=new Set();for(const p of piezas)for(const c of p.condiciones){const ms=c.match(/[a-zA-Z]/g);if(ms)for(const ch of ms)set.add(ch)}return set.size===1?[...set][0]:"a"}
    const param=detectarParam(piezasCrudas),piezasNorm=piezasCrudas.map(p=>normalizarPieza(p,param));
    function descomponerEnPiezasFinales(pieza){const eq=new Set(),neq=new Set();for(const c of pieza.condiciones){let m=c.match(/^([a-zA-Z])=(.+)$/);if(m){eq.add(m[1]+"="+m[2]);continue}m=c.match(/^([a-zA-Z])!=(.+)$/);if(m){neq.add(m[1]+"!="+m[2]);continue}}
    const eqArr=[...eq],neqArr=[...neq],res=[];if(eqArr.length===0){res.push({condiciones:(neqArr.length?neqArr.slice().sort():pieza.condiciones.slice()),rango:pieza.rango});return res}
    for(const e of eqArr){const [l,v]=e.split("=");let bad=false;for(const n of neqArr){const [ln,vn]=n.split("!=");if(ln===l&&vn===v){bad=true;break}}if(!bad)res.push({condiciones:[e],rango:pieza.rango})}return res}
    const piezasFinales=[];for(const p of piezasNorm){const fin=descomponerEnPiezasFinales(p);for(const pf of fin)piezasFinales.push(pf)}
    function aplicarSustituciones(m,condsEq){let actual=m;for(const c of condsEq){const mEq=c.match(/^([a-zA-Z])=(.+)$/);if(!mEq)continue;actual=Matriz.sustituir(actual,mEq[1],mEq[2])}return actual}
    function rangoNumericoDeMatriz(m){const Esc=Matriz.escalonarMatriz(m)[0];let r=0;for(const fila of Esc){let z=true;for(const x of fila){if(Matriz._simp(x)!=="0"){z=false;break}}if(!z)r++}return r}
    for(const pf of piezasFinales){const eqs=pf.condiciones.filter(c=>/^[a-zA-Z]=/.test(c));if(eqs.length){const matSub=aplicarSustituciones(matriz,eqs);pf.rango=rangoNumericoDeMatriz(matSub)}}
    const vista=new Map();for(const pf of piezasFinales){const k=pf.condiciones.slice().sort().join("&");if(!vista.has(k))vista.set(k,{condiciones:pf.condiciones.slice(),rango:pf.rango});else vista.get(k).rango=pf.rango}
    const salida=[...vista.values()];let rMax=-Infinity;for(const p of salida)if(p.rango>rMax)rMax=p.rango;
    const target=salida.some(p=>p.rango===rTeor)?rTeor:rMax;
    function extraerValoresEspecificos(conds){const vals=[];for(const c of conds){let m=c.match(new RegExp("^"+param+"=(.+)$"));if(m){vals.push(Matriz._simp(m[1]));continue}
    m=c.match(/^(.+)=0$/);if(m&&m[1].includes(param)){const sols=parseSols(Resolver.ecuacion(m[1]),param);for(const s of sols){const mm=s.match(new RegExp("^"+param+"=(.+)$"));if(mm)vals.push(Matriz._simp(mm[1]))}}}
    return vals}
    const excepciones=salida.filter(p=>p.rango<target);const valoresSet=new Set();for(const p of excepciones){for(const v of extraerValoresEspecificos(p.condiciones))valoresSet.add(v)}
    const valores=[...valoresSet].sort();
    const mapaRangos=new Map();for(const v of valores){const matSub=Matriz.sustituir(matriz,param,v);mapaRangos.set(v,rangoNumericoDeMatriz(matSub))}
    const excObjs=valores.map(v=>({condiciones:[param+"="+v],rango:mapaRangos.get(v)}));
    const casoGeneral={condiciones:valores.map(v=>param+"!="+v),rango:target};
    return[casoGeneral,excObjs,valores]}
  static rangoPorCasosSistema(matrizAmp){const rAmp=Matriz.rangoPorCasos(matrizAmp),matCoef=matrizAmp.map(f=>f.slice(0,-1)),rCoef=Matriz.rangoPorCasos(matCoef);
    const gAmp=rAmp[0]||{condiciones:[],rango:0},gCoef=rCoef[0]||{condiciones:[],rango:0},vals=Array.from(new Set([...(rAmp[2]||[]),...(rCoef[2]||[])])).sort();
    const mPar=s=>{s=String(s);let m=s.match(/^([a-zA-Z])=/);if(m)return m[1];m=s.match(/^([a-zA-Z])!=/);if(m)return m[1];return null};
    let param=null;for(const c of (gAmp.condiciones||[])){param=mPar(c);if(param)break}if(!param)for(const c of (gCoef.condiciones||[])){param=mPar(c);if(param)break}if(!param)param="a";
    const condGen=Array.from(new Set([...(gAmp.condiciones||[]),...(gCoef.condiciones||[])])).sort();
    const casoGeneral={condiciones:condGen,rangoCoef:gCoef.rango,rangoAmpliada:gAmp.rango};
    const casos=vals.map(v=>{const ma=Matriz.sustituir(matrizAmp,param,v),mc=Matriz.sustituir(matCoef,param,v);
    const ra=Matriz.rangoPorCasos(ma)[0].rango,rc=Matriz.rangoPorCasos(mc)[0].rango;
    return{condiciones:[param+"="+v],rangoCoef:rc,rangoAmpliada:ra}}).sort((a,b)=>a.rangoAmpliada-b.rangoAmpliada||a.rangoCoef-b.rangoCoef||a.condiciones[0].localeCompare(b.condiciones[0]));
    return[casoGeneral,casos,vals]}
  static simplificarFilasMatrizNumerica(matr){let aux=matr.map(function (arr){return arr.slice()}); let mcdFilas=[];
    for (let i=0; i<aux.length;i++){if(aux[i].every(elemento => elemento === 0)){mcdFilas[i]=1}
    else{mcdFilas[i]=mcd(aux[i][0],aux[i][1]);for (let j=2;j<aux[0].length;j++){mcdFilas[i]=mcd(mcdFilas[i],aux[i][j]);}mcdFilas[i]=Math.abs(mcdFilas[i]);}}
    for (let i=0; i<aux.length;i++){for (let j=0;j<aux[0].length;j++){aux[i][j]=aux[i][j]/mcdFilas[i]}}for (let i=0; i<aux.length;i++){let control=true;
    for (let j=0;j<aux[0].length;j++){if (aux[i][j]<0&&control===true){control=false;for(let k=0;k<aux[0].length;k++){aux[i][k]=-aux[i][k]}}}};
    aux=aux.map(fila => fila.map(elemento => (Object.is(elemento, -0) ? 0 : elemento)));
    return aux}
  static simplificarFilas(matr){let matr2=matr.map(function(arr) {return arr.slice()});matr2=Matriz.aString(matr2);
    let mcdFilas=[];let raicesmcdFilas=[];let raicesmcdFilasValores=[]
    for (let i = 0; i < matr2.length; i++){let mcD=Polinomio.mcdArray(matr2[i]); let ra=Polinomio.raices(mcD.toString());mcdFilas.push(mcD); raicesmcdFilas.push(ra);
      let raV=Polinomio.raicesValores(mcD.toString()); raicesmcdFilasValores.push(raV);
    for (let j = 0; j < matr2[i].length; j++){matr2[i][j]=Polinomio.dividir(matr2[i][j],mcD)[0]}};
    for (let i = 0; i < matr2.length; i++){matr2[i]=FraccionAlgebraica.quitarDenominadoresArray(matr2[i])[0]}
    return [matr2,mcdFilas,raicesmcdFilas,raicesmcdFilasValores];}
  static simplificarFilasNumericas(matr){
    let m=Matriz.aString(matr.map(r=>r.slice()));m=Matriz.pasarAFraccion(m);m=Matriz.quitarDenominadores(m)[0];
    const norm=s=>(s??"0").toString().trim().replace(/\s+/g,"").replace(/,/g,".");
    const isZero=v=>{let s=norm(v);if(s.includes("/"))s=s.split("/")[0];return /^[+\-]?0+(\.0+)?$/.test(s);};
    const opuesto=s=>{s=norm(s);if(isZero(s))return "0";if(typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.opuesto)return ExpresionAlgebraica.opuesto(s);
      if(s[0]==='-')return s.slice(1);if(s[0]==='+')return '-'+s.slice(1);if(/[+\-]/.test(s.slice(1)))return '-('+s+')';return '-'+s;};
    const normalizarSigno=f=>{for(let j=0;j<f.length;j++){let v=norm(f[j]);if(isZero(v))continue;if(v[0]!=='-')break;for(let k=0;k<f.length;k++)f[k]=opuesto(f[k]);break;}};
    for(let i=0;i<m.length;i++){let fila=m[i],tmp=new Array(fila.length),son=true;
      for(let j=0;j<fila.length;j++){let s=norm(fila[j]),L=(typeof long!=="undefined"?long:10),v=/^[+\-]?\d*\.\d+$/.test(s)?fraccionContinua(s,L):s;
        if(!Matriz._isNum(v)){son=false;break;}tmp[j]=v;}
      if(son){let mcD=mcdArray(tmp).toString();if(!isZero(mcD))for(let j=0;j<tmp.length;j++)tmp[j]=Polinomio.dividir(tmp[j],mcD)[0];
        normalizarSigno(tmp);m[i]=tmp;}else normalizarSigno(fila);};return m;}
  static compararMatrices(matriz1,matriz2){if(matriz1.length!==matriz2.length)return false;if(matriz1[0].length!==matriz2[0].length)return false;
    for(let i=0;i<matriz1.length;i++)for(let j=0;j<matriz1[0].length;j++)
    if(Matriz._S(matriz1[i][j])!==Matriz._S(matriz2[i][j]))return false;return true;}
  static eliminarFilasNulas(matri){if(!Array.isArray(matri)||matri.length===0||!Array.isArray(matri[0]))return [];
    let out=[],nc=matri[0].length;
    for(let i=0;i<matri.length;i++){let nula=true;for(let j=0;j<nc;j++)if(!Matriz._Z(matri[i][j])){nula=false;break;}
      if(!nula)out.push(matri[i]);}
    return out.map(a=>a.slice());}
  static simplificarElementosMatriz(matriz){let aux=matriz.map(function (arr){return arr.slice()}); 
    for (let i=0;i<aux.length;i++){for (let j=0;j<aux[0].length;j++){aux[i][j]=ExpresionAlgebraica.simplificar(aux[i][j])}}; return aux}
  static sustituir(matriz,letra,valor){let mSustituida = matriz.map(function(arr) {return arr.slice();});
    for (let i=0;i<mSustituida.length;i++){for (let j=0;j<mSustituida[0].length;j++){mSustituida[i][j]=ExpresionAlgebraica.sustituir(mSustituida[i][j],letra,valor).toString()}}
    return mSustituida;}
  static esMatrizEscalonada(matr){let aux=matr.map(arr=>arr.slice());aux=Matriz.aString(aux);let escalonada=true;
    const primerNoNulo=fila=>{for(let j=0;j<aux[0].length;j++)if(!Matriz._Z(aux[fila][j]))return j;return aux[0].length+1;};
    const pnn=aux.map((_,i)=>primerNoNulo(i));
    for(let k=0;k<aux.length-1;k++)
      if((pnn[k+1]<=pnn[k])&&((pnn[k+1]!==aux[0].length+1)||(pnn[k]!==aux[0].length+1))){escalonada=false;break;};return escalonada;}
  static menor(mat, filMenor, colMenor) {let n = filMenor.length;let menor = [];for (let i = 0; i < n; i++) {menor[i] = [];
    for (let j = 0; j < n; j++) {menor[i].push(mat[filMenor[i]][colMenor[j]]);}}return menor;}
  static quitarFilayColumna(matriz, fila, columna) {let matrizCopia = matriz.map(function(arr) {return arr.slice();});
    matrizCopia.splice(fila, 1);for (let i = 0; i < matriz.length-1; i++) {matrizCopia[i].splice(columna, 1);}return matrizCopia;}
  static determinanteNumerico(det){if(det.length!==det[0].length){return null};function signo(a,b){if((a+b)%2===0){return 1}else{return -1}};let n=det.length;let resultado=0;
    if(n===1){resultado=det[0][0]};if(n>1){for (let i=0;i<n;i++){resultado=resultado+det[0][i]*signo(0,i)*Matriz.determinanteNumerico(Matriz.quitarFilayColumna(det,0,i));}}
    return resultado}
  static determinante(det){
    let detAux=det.map(a=>a.slice());detAux=Matriz.aString(detAux);if(detAux.length===0){return "0"};if(detAux.length!==detAux[0].length){return null}
    detAux=Matriz.simplificarElementosMatriz(detAux);function det1(d){return d[0][0]}
    function det2(d){let ad=ExpresionAlgebraica.simplificar("("+d[0][0]+")("+d[1][1]+")");let bc=ExpresionAlgebraica.simplificar("("+d[0][1]+")("+d[1][0]+")");
      return ExpresionAlgebraica.simplificar("("+ad+")-("+bc+")");}
    function det3(d){let A00=Matriz.quitarFilayColumna(d,0,0); let A01=Matriz.quitarFilayColumna(d,0,1);let A02=Matriz.quitarFilayColumna(d,0,2);
      return ExpresionAlgebraica.simplificar("("+d[0][0]+")("+det2(A00)+")-("+d[0][1]+")("+det2(A01)+")+("+d[0][2]+")("+det2(A02)+")")}
    function signo(a,b){return (a+b)%2===0?"1":"-1"}
    function determinanteValores(dete){let n=dete.length;if(n===1){return det1(dete)};if(n===2){return det2(dete)};if(n===3){return det3(dete)};let resultado="0";
      for(let i=0;i<n;i++){let coef=dete[0][i];if(coef==="0"||coef===0){continue};let ter=ExpresionAlgebraica.simplificar("("+signo(0,i)+")("+coef+")");
        let sub=Matriz.quitarFilayColumna(dete,0,i);let detSub=determinanteValores(sub);let ter2=ExpresionAlgebraica.simplificar("("+ter+")("+detSub+")");
        resultado=ExpresionAlgebraica.simplificar("("+resultado+")+("+ter2+")");};return resultado}
    let res=determinanteValores(detAux);return res}
  static aString(mat){let aux=mat.map(function (arr){return arr.slice()}); 
  for (let i=0;i<aux.length;i++){for (let j=0;j<aux[0].length;j++){aux[i][j]=aux[i][j].toString()}};return aux}
  static aNumerica(mat){let aux=mat.map(function (arr){return arr.slice()}); 
    if(Matriz.comprobarNumerica(aux)===true){for (let i=0;i<aux.length;i++){for (let j=0;j<aux[0].length;j++){aux[i][j]=parseFloat(aux[i][j])}}};return aux}
  static aLatex(mat){let aux=mat.map(function (arr){return arr.slice()}); 
    for (let i=0;i<aux.length;i++){for (let j=0;j<aux[0].length;j++){aux[i][j]=ExpresionAlgebraica.pasarALatex(aux[i][j])}};return aux}
  static permutarFilas(matriz, fila1, fila2) {
    let matrizPermutada = matriz.map(arr => arr.slice());[matrizPermutada[fila1], matrizPermutada[fila2]] = [matrizPermutada[fila2], matrizPermutada[fila1]];
    return matrizPermutada;}
  static permutarColumnas(matriz, columna1, columna2) {let matrizPermutada = matriz.map(arr => arr.slice());
      for (let i = 0; i < matrizPermutada.length; i++) {
      [matrizPermutada[i][columna1], matrizPermutada[i][columna2]] = [matrizPermutada[i][columna2], matrizPermutada[i][columna1]];};return matrizPermutada;}
  static quitarDenominadores(matr) {let matr2=matr.map(function(arr) {return arr.slice()});matr2=Matriz.simplificarElementosMatriz(matr2); let raicesDenominador=[]; 
    let raicesVal=[];
    for (let i = 0; i < matr.length; i++) {matr2[i]=FraccionAlgebraica.quitarDenominadoresArray(matr[i])[0];
    raicesDenominador=[...raicesDenominador,...FraccionAlgebraica.quitarDenominadoresArray(matr[i])[2]];
    raicesVal=[...raicesVal,...FraccionAlgebraica.quitarDenominadoresArray(matr[i])[3]];}return [matr2,raicesDenominador,raicesVal]}
  static comprobarLineaNula(mat){let lineaNula=false;let contador=0;
    for(let i=0;i<mat.length;i++){contador=0;for(let j=0;j<mat[0].length;j++){if(mat[i][j]===0||mat[i][j]==="0"){contador++}}
    if (contador===mat[0].length){lineaNula=true;return lineaNula}}
    for(let j=0;j<mat[0].length;j++){contador=0;for(let i=0;i<mat.length;i++){if(mat[i][j]===0||mat[i][j]==="0"){contador++}}
    if (contador===mat.length){lineaNula=true;}}return lineaNula}
  static buscarLineaCasiNula(mat){let res = [];
    for (let i = 0; i < mat.length; i++) {let ceros = 0;for (let j = 0; j < mat[0].length; j++) { if (mat[i][j] === 0 || mat[i][j] === "0") ceros++; }
    if (ceros === mat[0].length - 1) res.push("F" + (i + 1));}
    for (let j = 0; j < mat[0].length; j++) {let ceros = 0;for (let i = 0; i < mat.length; i++) { if (mat[i][j] === 0 || mat[i][j] === "0") ceros++; }
    if (ceros === mat.length - 1) res.push("C" + (j + 1));};return res;}
  static lineaNula(mat){let contador=0;let linea="";
    for(let i=0;i<mat.length;i++){contador=0;for(let j=0;j<mat[0].length;j++){if(mat[i][j]===0||mat[i][j]==="0"){contador++}}
    if (contador===mat[0].length){linea="F"+(i+1); return linea}}
    for(let j=0;j<mat[0].length;j++){contador=0;for(let i=0;i<mat.length;i++){if(mat[i][j]===0||mat[i][j]==="0"){contador++}}
    if (contador===mat.length){linea="C"+(j+1);}}return linea}
  static comprobarLineasIguales(mat) {let lineasIguales = false;
    for (let i = 0; i < mat.length; i++) {for (let k = i + 1; k < mat.length; k++) {if (mat[i].every((val, idx) => val === mat[k][idx])) {return true;}}}
    for (let j = 0; j < mat[0].length; j++) {for (let k = j + 1; k < mat[0].length; k++) {let iguales = true;for (let i = 0; i < mat.length; i++) 
    {if (mat[i][j] !== mat[i][k]) {iguales = false;break;}}if (iguales) return true;}};return lineasIguales;}
  static lineasIguales(mat){for (let i = 0; i < mat.length; i++) {for (let k = i + 1; k < mat.length; k++) {
    if (mat[i].every((v, j) => v === mat[k][j])) {return "F" + (i + 1) + " y F" + (k + 1);}}}
    const filas = mat.length, cols = mat[0].length;for (let j = 0; j < cols; j++) {for (let k = j + 1; k < cols; k++) {
    let iguales = true;for (let i = 0; i < filas; i++) {if (mat[i][j] !== mat[i][k]) { iguales = false; break; }}
    if (iguales) return "C" + (j + 1) + " y C" + (k + 1);}};return "";}
  static sonFilasProporcionales(linea1, linea2,mat){
    let matAux=mat.map(function(arr){return arr.slice()}); matAux=Matriz.aString(matAux);
    let pivote=0;for (let j=0;j<matAux[0].length;j++){if(matAux[linea1][j]!=="0"){pivote=j;break}}
    for (let j=0;j<mat[0].length;j++){
      if(ExpresionAlgebraica.simplificar("("+matAux[linea2][j]+")*("+matAux[linea1][pivote]+")-("+matAux[linea2][pivote]+")*("+matAux[linea1][j]+")")!=="0")
        {return false}};return true;}
  static sonColumnasProporcionales(col1, col2, mat){let m = mat.map(arr => arr.slice());m = Matriz.aString(m);m=Matriz.trasponer(m);
    return Matriz.sonFilasProporcionales(col1, col2,m)};
  static comprobarLineasProporcionales(mat){let lineasProporcionales=false;
    for(let i=0;i<mat.length;i++){for(let k=i+1;k<mat.length;k++){if (Matriz.sonFilasProporcionales(i,k,mat)===true){lineasProporcionales=true;
      return lineasProporcionales}}}
    for(let j=0;j<mat[0].length;j++){for(let k=j+1;k<mat[0].length;k++){if (Matriz.sonColumnasProporcionales(j,k,mat)===true){lineasProporcionales=true;}}};
    return lineasProporcionales}
  static lineasProporcionales(mat){let lineas="";
    for(let i=0;i<mat.length;i++){for(let k=i+1;k<mat.length;k++){if (Matriz.sonFilasProporcionales(i,k,mat)===true){lineas="F"+(i+1)+" y F"+(k+1);
      return lineas}}}
    for(let j=0;j<mat[0].length;j++){for(let k=j+1;k<mat[0].length;k++){if (Matriz.sonColumnasProporcionales(j,k,mat)===true){
    lineas="C"+(j+1)+" y C"+(k+1);}}};return lineas}
  static comprobarNumerica(matriz){let resultado=true;
    for (let i=0;i<matriz.length;i++){for (let j=0;j<matriz[0].length;j++){if(isNaN(matriz[i][j])){resultado=false;break}}}return resultado;}
  static elegirLineaConMasCeros(det){let control=0;let linea="";
    for (let i=0;i<det.length;i++){let ceros=0;;for (let j=0;j<det[0].length;j++){if(det[i][j]==="0"){ceros++}}if(ceros>control){control=ceros;linea="F"+(i+1);}};
    for (let j=0;j<det[0].length;j++){let ceros=0;;for (let i=0;i<det.length;i++){if(det[i][j]==="0"){ceros++}}if(ceros>control){control=ceros;linea="C"+(j+1);}};
    if(linea===""){linea="F1"}; return linea;}
  static reducirDeterminante(determinante, linea) {let det=determinante.map(function(arr){return arr.slice()}); let adjunto=[]; let coef="";
    if (linea[0]==="F"){let fila=parseInt(linea.slice(1),10)-1;for(let j=0;j<det[0].length;j++){if(det[fila][j]!=="0"){
          if((fila+j)%2===0){coef=det[fila][j];}else{if(det[fila][j][0]==="-"){coef=det[fila][j].slice(1)}else{coef=ExpresionAlgebraica.simplificar("-("+det[fila][j]+")")}}; 
    adjunto=Matriz.quitarFilayColumna(det,fila,j)}}}
    else{let columna=parseInt(linea[1])-1;for(let i=0;i<det.length;i++){if(det[i][columna]!=="0"){
      if((columna+i)%2===0){coef=det[i][columna];}else{if(det[i][columna][0]==="-"){coef=det[i][columna].slice(1)}
        else{coef=ExpresionAlgebraica.simplificar("-("+det[i][columna]+")")}}; adjunto=Matriz.quitarFilayColumna(det,i,columna)}}}; return [adjunto,coef]}
  static cambioGauss(mat,linea,filaPivote,columnaPivote){let n=mat.length,res=mat.map(r=>r.slice()),t=linea[0],k=parseInt(linea.slice(1))-1;
    if(t==="C"){let piv=res[filaPivote][columnaPivote],a=res[filaPivote][k];
      for(let i=0;i<n;i++){let expr="("+piv+")*("+res[i][k]+")-("+a+")*("+res[i][columnaPivote]+")";res[i][k]=ExpresionAlgebraica.simplificar(expr);}} 
    else {let piv=res[filaPivote][columnaPivote],a=res[k][columnaPivote];
      for(let j=0;j<n;j++){let expr="("+piv+")*("+res[k][j]+")-("+a+")*("+res[filaPivote][j]+")";res[k][j]=ExpresionAlgebraica.simplificar(expr);}}
    return res;}
  static inversaGauss(matriz) {const n = matriz.length;const identidad = Array.from({ length: n }, (_, i) =>Array.from({ length: n }, (_, j) => (i === j ? "1" : "0")));
    let A = matriz.map(fila => fila.slice());let I = identidad.map(fila => fila.slice());
    for (let i = 0; i < n-1; i++) {if (A[i][i] === "0") {let encontrado = false;for (let k = i + 1; k < n; k++) 
      {if (A[k][i] !== "0") {[A[i], A[k]] = [A[k], A[i]];[I[i], I[k]] = [I[k], I[i]];encontrado = true;break;}}}let divisor = A[i][i];
      for (let j = 0; j < n; j++) 
        {A[i][j] = ExpresionAlgebraica.simplificar(`(${A[i][j]})/(${divisor})`);I[i][j] = ExpresionAlgebraica.simplificar(`(${I[i][j]})/(${divisor})`);}
    for (let k = i+1; k < n; k++) {let factor = A[k][i];for (let j = 0; j < n; j++) {
        A[k][j] = ExpresionAlgebraica.simplificar(`(${A[k][j]}) - ((${factor})*(${A[i][j]}))`);
        I[k][j] = ExpresionAlgebraica.simplificar(`(${I[k][j]}) - ((${factor})*(${I[i][j]}))`);}}}
    for (let i = n-1; i>=1; i--) {if (A[i][i] === "0") {let encontrado = false;for (let k = i + 1; k < n; k++) 
      {if (A[k][i] !== "0") {[A[i], A[k]] = [A[k], A[i]];[I[i], I[k]] = [I[k], I[i]];encontrado = true;break;}}};let divisor = A[i][i];for (let j = 0; j < n; j++) 
        {A[i][j] = ExpresionAlgebraica.simplificar(`(${A[i][j]})/(${divisor})`);I[i][j] = ExpresionAlgebraica.simplificar(`(${I[i][j]})/(${divisor})`);}
    for (let k = i-1; k >=0; k--) {let factor = A[k][i];for (let j = 0; j < n; j++) {
        A[k][j] = ExpresionAlgebraica.simplificar(`(${A[k][j]}) - ((${factor})*(${A[i][j]}))`);
        I[k][j] = ExpresionAlgebraica.simplificar(`(${I[k][j]}) - ((${factor})*(${I[i][j]}))`);} } }return I;}
  static adjunta(matriz){let matrizAdjunta=matriz.map(function(arr){return arr.slice()});
    for (let i=0;i<matrizAdjunta.length;i++){for (let j=0;j<matrizAdjunta[0].length;j++){
      if((i+j)%2===0){matrizAdjunta[i][j]=Matriz.determinante(Matriz.quitarFilayColumna(matriz,i,j))}
      else{matrizAdjunta[i][j]=Polinomio.multiplicar(Matriz.determinante(Matriz.quitarFilayColumna(matriz,i,j)),"-1")}}};return matrizAdjunta}
  static inversa(m){if(!Array.isArray(m)||m.length===0)throwOnError("matrizVacia"); 
    if(m.some(r=>!Array.isArray(r)||r.length!==m.length))throwOnError("noCuadrada"); 
    let d=Matriz.determinante(m); d=typeof d==="string"?ExpresionAlgebraica.simplificar(d):d; 
    if(d===0||d==="0")throwOnError("noRegular"); 
    let a=Matriz.adjunta(m),t=Matriz.trasponer(a); 
    for(let i=0;i<t.length;i++){for(let j=0;j<t[0].length;j++){t[i][j]=ExpresionAlgebraica.simplificar("("+t[i][j]+")/("+d+")")}} return t}
  static identidad(n){let matriz = []; for (let i = 0; i < n; i++) {let fila = []; for (let j = 0; j < n; j++) {if (i === j) {fila.push("1");} 
    else {fila.push("0");}}matriz.push(fila);}return matriz; }
  static opuesta(matriz){let matrizN=matriz.map(function(arr){return arr.slice()});
    for (let i=0;i<matrizN.length;i++){for (let j=0;j<matrizN[0].length;j++)
      {matrizN[i][j]=ExpresionAlgebraica.simplificar("-("+matriz[i][j]+")")}}return matrizN}
  static potencia(matriz, n) {const nFil = matriz.length, nCol = matriz[0].length;
    if (nFil !== nCol) { throw new Error("La potencia solo está definida para matrices cuadradas."); }
    if (n === 0) { return Matriz.identidad(nFil); };if (n === 1) { return matriz.map(arr => arr.slice()); };let resultado = matriz.map(arr => arr.slice());
    for (let i = 1; i < n; i++) {resultado = Matriz.multiplicar(resultado, matriz);}return resultado;}
  static pasarAFraccion(matriz){let aux=matriz.map(function (arr){return arr.slice()});
    for (let i = 0; i < aux.length; i++) { for (let j = 0; j < aux[i].length; j++) {aux[i][j]=ExpresionAlgebraica.pasarAFraccion(aux[i][j]) }};return aux}
  static pasarADecimal(matriz){let aux=matriz.map(function (arr){return arr.slice()});
    for (let i = 0; i < aux.length; i++) { for (let j = 0; j < aux[i].length; j++) {aux[i][j]=ExpresionAlgebraica.pasarADecimal(aux[i][j]) }};return aux}
  static cambiarFila(matriz,cadena){
    if(!Array.isArray(matriz)||matriz.length===0||!Array.isArray(matriz[0]))throw new Error("matriz");let nf=matriz.length,nc=matriz[0].length;
    for(let i=0;i<nf;i++)if(!Array.isArray(matriz[i])||matriz[i].length!==nc)throw new Error("rect");
    let raw=(cadena??"").toString(),clean=raw.replace(/\s+/g,"");if(clean==="")throw new Error("vacia");
    let m=clean.match(/^F(\d+)=(.+)$/i);if(!m)throw new Error("formato");
    let objetivo=parseInt(m[1],10),rhs=m[2];if(!Number.isInteger(objetivo)||objetivo<1||objetivo>nf)throw new Error("objetivo");
    rhs=rhs.replace(/,/g,".");let usarFC=typeof fraccionContinua!=="undefined"&&typeof long!=="undefined";
    const isDec=s=>/^[+-]?\d+\.\d+$/.test(s),isInt=s=>/^[+-]?\d+$/.test(s);const isFrac=s=>/^[+-]?\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/.test(s);
    const aFrac=s=>usarFC?fraccionContinua(s.toString(),long):s.toString();const normNum=s=>isDec(s)?aFrac(s):s;
    const normCoefBase=s=>{let b=s===""?"1":s;return isFrac(b)?b:(isInt(b)||isDec(b)?normNum(b):b);};
    const fullCoef=(sign,base)=>{if(base==="1")return sign==="-"?"-1":"1";return sign==="-"?("-"+base):base;};
    const normCell=v=>{let s=(v??"0").toString();return isDec(s)?normNum(s):s;};
    const splitTop=s=>{let out=[],buf="",d=0;for(let i=0;i<s.length;i++){let ch=s[i];if(ch==="(")d++;else if(ch===")"){d--;if(d<0)throw new Error("rhs");}
        if(d===0&&(ch==="+"||ch==="-" )&&buf!==""){out.push(buf);buf=ch;continue;}buf+=ch;}
      if(d!==0)throw new Error("rhs");if(buf!=="")out.push(buf);return out;};
    let chunks=splitTop(rhs).filter(s=>s!=="");let terms=[];
    for(let i=0;i<chunks.length;i++){let part=chunks[i],mm=part.match(/^([+-]?)(.*)F(\d+)$/i);if(!mm)throw new Error("rhs");
      let sign=mm[1]||"",coefS=(mm[2]||""),fila=parseInt(mm[3],10);
      if(!Number.isInteger(fila)||fila<1||fila>nf)throw new Error("fila_1_"+nf);
      let base=normCoefBase(coefS),coef=fullCoef(sign,base);
      if(coef==="0"||coef==="0.0"||coef==="0/1")continue;terms.push({fila,coef});}
    if(terms.length===0)throw new Error("rhs");
    let copia=matriz.map(a=>a.slice()),nueva=new Array(nc).fill("0");
    for(let j=0;j<nc;j++){let sum="";for(let t=0;t<terms.length;t++){let f=terms[t].fila-1,c=terms[t].coef,cell=normCell(copia[f][j]);
        let term=c==="1"?cell:c==="-1"?`-(${cell})`:`(${c})*(${cell})`;
        sum=sum===""?term:sum+"+"+term;}
      sum=sum===""?"0":sum.replace(/\+\-/g,"-");nueva[j]=typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.simplificar?
        ExpresionAlgebraica.simplificar(sum):sum;}
    let res=copia.map(a=>a.slice());res[objetivo-1]=nueva;return res;}
  static cambiarColumna(matriz,cadena){if(!Array.isArray(matriz)||matriz.length===0||!Array.isArray(matriz[0]))throw new Error("matriz");
    let nf=matriz.length,nc=matriz[0].length;
    for(let i=0;i<nf;i++)if(!Array.isArray(matriz[i])||matriz[i].length!==nc)throw new Error("rect");
    let raw=(cadena??"").toString(),clean=raw.replace(/\s+/g,"");if(clean==="")throw new Error("vacia");
    let m=clean.match(/^C(\d+)=(.+)$/i);if(!m)throw new Error("formato");
    let objetivo=parseInt(m[1],10),rhs=m[2];if(!Number.isInteger(objetivo)||objetivo<1||objetivo>nc)throw new Error("objetivo");rhs=rhs.replace(/,/g,".");
    let usarFC=typeof fraccionContinua!=="undefined"&&typeof long!=="undefined";
    const isDec=s=>/^[+-]?\d+\.\d+$/.test(s),isInt=s=>/^[+-]?\d+$/.test(s);const isFrac=s=>/^[+-]?\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/.test(s);
    const aFrac=s=>usarFC?fraccionContinua(s.toString(),long):s.toString();const normNum=s=>isDec(s)?aFrac(s):s;
    const normCoefBase=s=>{let b=s===""?"1":s;return isFrac(b)?b:(isInt(b)||isDec(b)?normNum(b):b);};
    const fullCoef=(sign,base)=>{if(base==="1")return sign==="-"?"-1":"1";return sign==="-"?("-"+base):base;};
    const normCell=v=>{let s=(v??"0").toString();return isDec(s)?normNum(s):s;};
    const splitTop=s=>{let out=[],buf="",d=0;for(let i=0;i<s.length;i++){let ch=s[i];if(ch==="(")d++;else if(ch===")"){d--;if(d<0)throw new Error("rhs");}
        if(d===0&&(ch==="+"||ch==="-")&&buf!==""){out.push(buf);buf=ch;continue;}buf+=ch;}
      if(d!==0)throw new Error("rhs");if(buf!=="")out.push(buf);return out;};
    let chunks=splitTop(rhs).filter(s=>s!=="");let terms=[];
    for(let i=0;i<chunks.length;i++){
      let part=chunks[i],mm=part.match(/^([+-]?)(.*)C(\d+)$/i);if(!mm)throw new Error("rhs");let sign=mm[1]||"",coefS=(mm[2]||""),col=parseInt(mm[3],10);
      if(!Number.isInteger(col)||col<1||col>nc)throw new Error("col_1_"+nc);let base=normCoefBase(coefS),coef=fullCoef(sign,base);
      if(coef==="0"||coef==="0.0"||coef==="0/1")continue;terms.push({col,coef});}
    if(terms.length===0)throw new Error("rhs"); let copia=matriz.map(a=>a.slice()),nuevaCol=new Array(nf).fill("0");
    for(let i=0;i<nf;i++){let sum="";for(let t=0;t<terms.length;t++){
        let cidx=terms[t].col-1,c=terms[t].coef,cell=normCell(copia[i][cidx]);let term=c==="1"?cell:c==="-1"?`-(${cell})`:`(${c})*(${cell})`;
        sum=sum===""?term:sum+"+"+term;}
      sum=sum===""?"0":sum.replace(/\+\-/g,"-");nuevaCol[i]=typeof ExpresionAlgebraica!=="undefined"&&ExpresionAlgebraica.simplificar?
        ExpresionAlgebraica.simplificar(sum):sum;}
    let res=copia.map(a=>a.slice());for(let i=0;i<nf;i++)res[i][objetivo-1]=nuevaCol[i];return res;}
  static eliminarFilas(matriz, filas){if(!Array.isArray(matriz)||!Array.isArray(filas)) return matriz;let idx=new Set();
    for(let f of filas){if(typeof f==="string"){ f=f.trim(); if(/^F\d+$/i.test(f)) f=f.slice(1); };let n=Number(f);
      if(Number.isInteger(n)&&n>=1&&n<=matriz.length) idx.add(n-1);};return matriz.filter((_,i)=>!idx.has(i));}
  static eliminarColumnas(matriz,columnas){if(!Array.isArray(matriz)||!Array.isArray(columnas)||!matriz.length) return matriz;
    let m=0; for(let r of matriz) if(Array.isArray(r)) m=Math.max(m,r.length);let idx=new Set();
    for(let c of columnas){if(typeof c==="string"){ c=c.trim(); if(/^C\d+$/i.test(c)) c=c.slice(1); };let n=Number(c);
      if(Number.isInteger(n)&&n>=1&&n<=m) idx.add(n-1);}
    return matriz.map(r=>{ r=Array.isArray(r)?r:[]; return r.filter((_,j)=>!idx.has(j)); });}
}





class Sistema {constructor(matriz) {this.matriz = matriz;}
  static numeroEcuaciones(matriz) {return matriz.length;}
  static numeroIncognitas(matriz) {return matriz[0].length-1;}
  static discutir(matri){let matri2=matri.map(function(arr){return arr.slice()}); matri2=Matriz.escalonarMatrizNumerica(matri2);matri2=Matriz.eliminarFilasNulas(matri2);
    let tipo="";let numeroCerosIzquierda=[];for (let i=0;i<matri2.length;i++){
    numeroCerosIzquierda[i]=0;for (let j=0;j<matri2[0].length-1;j++){if(matri2[i][j]===0||matri2[i][j]==="0"){numeroCerosIzquierda[i]=numeroCerosIzquierda[i]+1}}}
    let incompatible=false;let compatibleDeterminado=false;for (let i=0;i<matri2.length;i++){
    if(numeroCerosIzquierda[i]===matri2[0].length-1&&matri2[i][matri2[0].length-1]!==0){incompatible=true;break}
    else{if(matri2.length===matri2[0].length-1){compatibleDeterminado=true}}}
    if (incompatible===true){tipo="I";}else{ if(compatibleDeterminado===true){tipo="CD"}else{tipo="CI";}}return tipo;}
  static resolverSistemaCD(matriz){
let simp=e=>ExpresionAlgebraica.simplificar(""+e),esCero=e=>simp(e)==="0",neg=e=>simp("-(("+e+"))");
let mul=(a,b)=>simp("(("+a+"))*(("+b+"))"),res=(a,b)=>simp("(("+a+"))-(("+b+"))"),div=(a,b)=>simp("(("+a+"))/(("+b+"))");
let A=matriz.map(f=>f.slice()),m=A.length,n=A[0].length-1,filas=[];
for(let i=0;i<m;i++){let todo0=true;for(let j=0;j<n;j++)if(!esCero(A[i][j])){todo0=false;break;}
if(todo0){if(!esCero(A[i][n]))return "Sistema incompatible";}else filas.push(A[i]);}
A=filas;m=A.length;if(!m)return [];
for(let k=m-1;k>0;k--)for(let i=k-1;i>=0;i--){let piv=A[k][k],aik=A[i][k];
for(let j=0;j<=n;j++)A[i][j]=res(mul(A[i][j],piv),mul(A[k][j],aik));}
for(let i=0;i<m;i++){let den=A[i][i];for(let j=0;j<=n;j++)A[i][j]=div(A[i][j],den);}
let sol=new Array(n).fill("0");for(let i=0;i<m;i++){let pivCol=-1;for(let j=0;j<n;j++)if(!esCero(A[i][j])){pivCol=j;break;}
if(pivCol>=0)sol[pivCol]=simp(A[i][n]);}
return sol;
}
static resolverSistemaCI(matriz){
let simp=e=>ExpresionAlgebraica.simplificar(""+e),esCero=e=>simp(e)==="0",neg=e=>simp("-(("+e+"))");
let mul=(a,b)=>simp("(("+a+"))*(("+b+"))"),res=(a,b)=>simp("(("+a+"))-(("+b+"))"),div=(a,b)=>simp("(("+a+"))/(("+b+"))");
let matri2=matriz.map(f=>f.slice()),m=matri2.length,n=matri2[0].length-1,filas=[],incompat=false;
for(let i=0;i<m;i++){let todo0=true;for(let j=0;j<n;j++)if(!esCero(matri2[i][j])){todo0=false;break;}
if(todo0){if(!esCero(matri2[i][n])){incompat=true;break;}}else filas.push(matri2[i]);}
if(incompat)return "Sistema incompatible";matri2=filas;m=matri2.length;if(!m)return [];
let variablesPrincipales=[],parametros=[],inc=[];
for(let i=0;i<m;i++){inc[i]=[];for(let j=0;j<n;j++)inc[i][j]=esCero(matri2[i][j])?0:1;}
let sumarFila=f=>f.reduce((a,b)=>a+b,0);for(let i=0;i<m;i++)inc[i].push(sumarFila(inc[i]));
for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(inc[i][j]){variablesPrincipales.push(j+1);break;}
for(let j=0;j<n;j++)if(!variablesPrincipales.includes(j+1))parametros.push(j+1);
let M=matri2.map(f=>f.slice()),nElim=1,p2=parametros.slice();
while(p2.length){let col=p2[0],colElim=M.map(f=>f.splice(col-nElim,1)[0]);M.forEach((f,i)=>f.push(neg(colElim[i])));p2.shift();nElim++;}
let Ms=M.map(f=>f.slice());
for(let k=m-1;k>0;k--)for(let i=k-1;i>=0;i--){let piv=Ms[k][k],aik=Ms[i][k];
for(let j=0;j<M[0].length;j++)M[i][j]=res(mul(Ms[i][j],piv),mul(Ms[k][j],aik));Ms=M.map(f=>f.slice());}
for(let i=0;i<m;i++){let den=M[i][i];for(let j=0;j<M[0].length;j++)M[i][j]=div(M[i][j],den);}
for(let i=0;i<m;i++)M[i][i]=""+variablesPrincipales[i];return M;
}

  static resolverSistema(matri){let matri2=matri.map(function(arr){return arr.slice()});
    matri2=Matriz.escalonarMatrizNumerica(matri2);matri2=Matriz.eliminarFilasNulas(matri2);
    let tipo="";let numeroCerosIzquierda=[];for (let i=0;i<matri2.length;i++){
    numeroCerosIzquierda[i]=0;for (let j=0;j<matri2[0].length-1;j++){if(matri2[i][j]===0||matri2[i][j]==="0"){numeroCerosIzquierda[i]=numeroCerosIzquierda[i]+1}}}
    let incompatible=false;let compatibleDeterminado=false;for (let i=0;i<matri2.length;i++){
    if(numeroCerosIzquierda[i]===matri2[0].length-1&&matri2[i][matri2[0].length-1]!==0){incompatible=true;break}
    else{if(matri2.length===matri2[0].length-1){compatibleDeterminado=true}}}
    if (incompatible===true){tipo="I";}else{ if(compatibleDeterminado===true){tipo="CD"}else{tipo="CI";}}
    if(tipo==="I"){return ["I","Sin solución"]};
    if(tipo==="CD"){return ["CD",Sistema.resolverSistemaCD(matri2)]};
    if(tipo==="CI"){return ["CI",Sistema.resolverSistemaCI(matri2)]}}
}



class Resolver {constructor(ecuacion) {this.ecuacion = ecuacion;}
  static ecuacion(expresion) {let soluciones=[]; expresion=FraccionAlgebraica.numerador(ExpresionAlgebraica.simplificar(expresion));
    soluciones=Polinomio.raices(expresion);return soluciones}
  static ecuacionValores(expresion) {let soluciones=[]; expresion=FraccionAlgebraica.numerador(ExpresionAlgebraica.simplificar(expresion));
    soluciones=Polinomio.raicesValores(expresion);return soluciones}
  static ecuacionPolinomio(polinomio) {let soluciones=[]; soluciones=Polinomio.raices(polinomio);return soluciones}
  static ecuacionPolinomioValores(polinomio) {let soluciones=[]; soluciones=Polinomio.raicesValores(polinomio);return soluciones}
  static determinante(matriz){let soluciones=[];let det=Matriz.determinante(matriz);soluciones=Resolver.ecuacion(det); return soluciones}
  static determinanteValores(matriz){let soluciones=[];let det=Matriz.determinante(matriz);soluciones=Resolver.ecuacionPolinomioValores(det); return soluciones}
}


class Representar{
  static mostrarError(cajaError, mensaje) {cajaError.textContent = mensaje;cajaError.style.color = "red";}
  static imprimeValoresMatriz(val,lug) {let matriz = document.createElement("table");lug.appendChild(matriz); 
    for (let i = 0; i < val.length; i++) {let fila = document.createElement("tr"); 
    for (let j = 0; j < val[i].length; j++) { let celda = document.createElement("td");
    let contenido=val[i][j]; katex.render(contenido,celda);fila.appendChild(celda);}matriz.appendChild(fila);}}
  static abrirParentesis(n, lugar) {let p = document.createElement("p");lugar.appendChild(p);let texto="\\left( \\begin{matrix}";
    for (let i=0; i<n; i++) {texto += "{} \\\\";};texto += "\\end{matrix} \\right.";katex.render(texto,p)}
  static cerrarParentesis(n,lugar) {let p = document.createElement("p");lugar.appendChild(p);let texto="\\left) \\begin{matrix}";
    for (let i=0; i<n; i++) {texto += "{} \\\\";};texto += "\\end{matrix} \\right.";katex.render(texto,p)}
  static abrirBarra(n,lugar) {let p = document.createElement("p");lugar.appendChild(p);let texto="\\left| \\begin{matrix}";
    for (let i=0; i<n; i++) {texto += "{} \\\\";};texto += "\\end{matrix} \\right.";katex.render(texto,p)}
  static abrirLlave(n,lugar) {let p = document.createElement("p");lugar.appendChild(p);let texto="\\left\\{ \\begin{matrix}";
    for (let i=0; i<n; i++) {texto += "{} \\\\";};texto += "\\end{matrix} \\right.";katex.render(texto,p)}
  static simboloEscalonarMatriz(n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);cont.style.marginTop="10px";
    let texto="\\underset{escalonar}{\\mathop{=}}";katex.render(texto,p)}
  static simboloMatrizEquivalente(n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);cont.style.marginTop="10px";
    let texto="\\sim";katex.render(texto,p)}
  static simboloCambiarLinea(cadena,n,lugar){let cont=document.createElement("div"),p=document.createElement("p");
    let cad=(cadena??"").toString().replace(/\s+/g,"").replace(/([FC])(\d+)/g,(m,l,num)=>`${l}_{${num}}`).replace(/=/g,"\\rightarrow{}");
    let texto=`\\underset{${cad}}{\\mathop{\\sim}}`;cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";cont.style.marginTop="10px";p.style.margin="0";cont.appendChild(p);lugar.appendChild(cont);katex.render(texto,p);}
  static simboloReducirDeterminante(linea, n, lugar){
    const cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";if(typeof n==="number")cont.style.height=n+"px";
    cont.style.marginTop="4px";lugar.appendChild(cont);
    const p=document.createElement("p");cont.appendChild(p);
    if(typeof linea!=="string"){katex.render("\\underset{\\operatorname{Red}}{\\mathop{=}}",p);return;}
    const s=linea.trim(),m=s.match(/^([FfCc])(\d+)$/);if(!m){katex.render("\\underset{\\operatorname{Red}}{\\mathop{=}}",p);return;}
    const tipo=m[1].toUpperCase(),idx=parseInt(m[2],10),tex=`\\underset{\\operatorname{Red}\\,\\,{{${tipo}}_{${idx}}}}{\\mathop{=}}`;
    katex.render(tex,p);}
  static simboloIgual(lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    lugar.appendChild(cont);let texto=`=`;katex.render(texto,cont)}
  static simboloPermutarFilas(a,b,n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);
    let texto="\\underset{{{F}_{"+a+"}}\\leftrightarrow {{F}_{"+b+"}}}{\\mathop \\approx }";katex.render(texto,p)}
  static simboloPermutarColumnas(a,b,n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);
    let texto="\\underset{{{C}_{"+a+"}}\\leftrightarrow {{C}_{"+b+"}}}{\\mathop \\approx }";katex.render(texto,p)}
  static simboloDividirFila(a,b,n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);
    let texto="\\underset{{{F}_{"+a+"}}\\to \\frac{1}{"+b+"}{{F}_{"+a+"}}}{\\mathop{\\approx }}";katex.render(texto,p);}
  static simboloDividirColumna(a,b,n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);
    let texto="\\underset{{{C}_{"+a+"}}\\to \\frac{1}{"+b+"}{{C}_{"+a+"}}}{\\mathop{\\approx }}";katex.render(texto,p);}
  static simboloFilasNulasAbajo(n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);
    let texto="\\underset{Filas\\downarrow }{\\mathop{\\approx }}";katex.render(texto,p);}
  static simboloEliminarFilasNulas(n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");
    cont.appendChild(p);let texto="\\underset{{F}_{nulas}}{\\mathop{\\approx }}";katex.render(texto,p);}
  static simboloSimplificarFilas(n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";
    cont.style.height=n+"px";lugar.appendChild(cont);let p = document.createElement("p");lugar.appendChild(p);
    let texto="\\underset{Simp}{\\mathop{\\approx }}";katex.render(texto,p);}
  static simboloCambiarFila(a,b,m,n,h,l){
    const d=document.createElement("div");d.style.display="flex";d.style.alignItems="center";if(h!=null)d.style.height=h+"px";l.appendChild(d);
    const p=document.createElement("p");d.appendChild(p);
    const T=x=>String(x??"").trim(),P=s=>{s=T(s);const u=s[0]==="-"?s.slice(1):s;return /[+\-].+/.test(u)?`\\left(${s}\\right)`:s};
    a=T(a);b=T(b);m=T(m);n=T(n);
    if(m==="+1")m="1";if(m==="-1")m="-1";if(m==="+0")m="0";if(m[0]==="+")m=m.slice(1);
    if(n==="+1")n="1";if(n==="-1")n="-1";if(n==="+0")n="0";if(n[0]==="+")n=n.slice(1);
    const A=`{{F}_{${a}}}`,B=`{{F}_{${b}}}`;
    const Aterm=!m||m==="0"?"":m==="1"?A:m==="-1"?`-${A}`:m[0]==="-"?`-${P(m.slice(1))}${A}`:`${P(m)}${A}`;
    const Bterm=!n||n==="0"?"":n==="1"?`+${B}`:n==="-1"?`-${B}`:n[0]==="-"?`-${P(n.slice(1))}${B}`:`+${P(n)}${B}`;
    const expr=(m==="0"||!m)&&(n==="0"||!n)?A:(Aterm?Aterm+(Bterm||""):Bterm.replace(/^\+/,""));
    katex.render(`\\underset{{{F}_{${a}}}\\rightarrow ${expr}}{\\mathop{\\approx }}`,p);}
  static simboloCambiarColumna(a,b,m,n,h,lugar){a=a.toString();b=b.toString();m=m.toString();n=n.toString(); let texto=""
    let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";cont.style.height=h+"px";lugar.appendChild(cont);
    let p = document.createElement("p");cont.appendChild(p);if (m==="+1"){m="1"};if (n==="+1"){n="1"};if (m.includes("+")||m.includes("-")){m="("+m+")"};
    if (n.includes("+")||n.includes("-")){n="("+n+")"};if (m==="(+1)"){m="1"};if (m==="(-1)"){m="-1"};if (n==="(+1)"){n="1"};if (n==="(-1)"){n="-1"};
    m=ExpresionAlgebraica.eliminarParentesisInnecesarios(m); n=ExpresionAlgebraica.eliminarParentesisInnecesarios(n);
    if(m==="1"&&n==="1"){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}+{{C}_{"+b+"}}}{\\mathop{\\approx }}";};
    if(m==="-1"&&n==="1"){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{-{C}_{"+a+"}}+{{C}_{"+b+"}}}{\\mathop{\\approx }}";};
    if(m==="1"&&n==="-1"){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}-{{C}_{"+b+"}}}{\\mathop{\\approx }}";};
    if(m==="-1"&&n==="-1"){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{-{C}_{"+a+"}}-{{C}_{"+b+"}}}{\\mathop{\\approx }}";};
    if(m==="1"&&n!="1"&&n!="-1"){let nAux=n.slice(1);
      if(!isNaN(n)&&parseFloat(n)>0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"};
      if(!isNaN(n)&&parseFloat(n)<0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}-"+Math.abs(n)+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"};
      if(isNaN(n)&&n[0]!=="-"&&!nAux.includes("+")&&!nAux.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
      if(isNaN(n)&&n[0]!=="-"&&(nAux.includes("+")||nAux.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}+("+n+")"+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
      if(isNaN(n)&&n[0]==="-"&&!nAux.includes("+")&&!nAux.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
      if(isNaN(n)&&n[0]==="-"&&(nAux.includes("+")||nAux.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{C}_{"+a+"}}+("+n+")"+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}}
    if(m!=="1"&&m!=="-1"&&n==="1"){
      if(!isNaN(m)){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+{{C}_{"+b+"}}}{\\mathop{\\approx }}";} 
      if(isNaN(m)&&m[0]&&!m.includes("+")&&!m.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+{{C}_{"+b+"}}}{\\mathop{\\approx }}";} 
      if(isNaN(m)&&m[0]&&(m.includes("+")||m.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}("+m+")"+"{{C}_{"+a+"}}+{{C}_{"+b+"}}}{\\mathop{\\approx }}"};}
    if(m==="-1"&&n!="1"&&n!="-1"){let nAux=n.slice(1);
      if(!isNaN(n)&&parseFloat(n)>0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{-C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"};
      if(!isNaN(n)&&parseFloat(n)<0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{-C}_{"+a+"}}-"+Math.abs(n)+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"};
      if(isNaN(n)&&n[0]!=="-"&&!nAux.includes("+")&&!nAux.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{-C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
      if(isNaN(n)&&n[0]!=="-"&&(nAux.includes("+")||nAux.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{-C}_{"+a+"}}+("+n+")"+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
      if(isNaN(n)&&n[0]==="-"&&!nAux.includes("+")&&!nAux.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{-C}_{"+a+"}}"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
      if(isNaN(n)&&n[0]==="-"&&(nAux.includes("+")||nAux.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}{{-C}_{"+a+"}}+("+n+")"+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}}
    if(m!=="1"&&m!=="-1"&&n==="-1"){
      if(!isNaN(m)){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}{{-C}_{"+b+"}}}{\\mathop{\\approx }}";} 
      if(isNaN(m)&&m[0]&&!m.includes("+")&&!m.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}{{-C}_{"+b+"}}}{\\mathop{\\approx }}";} 
      if(isNaN(m)&&m[0]&&(m.includes("+")||m.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}("+m+")"+"{{C}_{"+a+"}}{{-C}_{"+b+"}}}{\\mathop{\\approx }}"};}
    if(m!=="1"&&m!=="-1"&&n!=="1"&&n!=="-1"){let nAux=n.slice(1);
      if(!isNaN(n)&&!isNaN(m)){
        if(parseFloat(m)>0&&parseFloat(n)>0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(parseFloat(m)>0&&parseFloat(n)<0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(parseFloat(m)<0&&parseFloat(n)>0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(parseFloat(m)<0&&parseFloat(n)<0){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}}
      if(!isNaN(n)&&isNaN(m)){
        if(parseFloat(n)>0&&!m.includes("+")&&!m.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(parseFloat(n)<0&&!m.includes("+")&&!m.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(parseFloat(n)>0&&(m.includes("+")||m.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}("+m+"){{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(parseFloat(n)<0&&(m.includes("+")||m.includes("-"))){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}("+m+"){{C}_{"+a+"}}"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}}
      if(!isNaN(m)&&isNaN(n)){
        if(!n.includes("+")&&!n.includes("-")&&nAux[0]!=="-"){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(!n.includes("+")&&!n.includes("-")&&nAux[0]==="-"){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(n.includes("+")||n.includes("-")){texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+("+n+"){{C}_{"+b+"}}}{\\mathop{\\approx }}"}}
      if(isNaN(m)&&isNaN(n)){
        if(!m.includes("+")&&!m.includes("-")&&!n.includes("+")&&!n.includes("-"))
                  {texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if(!m.includes("+")&&!m.includes("-")&&(n.includes("+")||n.includes("-")))
          {texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}"+m+"{{C}_{"+a+"}}+("+n+"){{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if((m.includes("+")||m.includes("-"))&&!n.includes("+")&&!n.includes("-"))
          {texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}("+m+"){{C}_{"+a+"}}+"+n+"{{C}_{"+b+"}}}{\\mathop{\\approx }}"}
        if((m.includes("+")||m.includes("-"))&&(n.includes("+")||n.includes("-")))
          {texto="\\underset{{{C}_{"+a+"}}{\\rightarrow}("+m+"){{C}_{"+a+"}}+("+n+"){{C}_{"+b+"}}}{\\mathop{\\approx }}"}}}
    texto=ExpresionAlgebraica.notacionSinProductos(texto);
    katex.render(texto,p);}
  static simboloLineasIguales(n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";cont.style.height=n+"px";
    lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);let texto="\\underset{Líneas~iguales}{\\mathop{=}}"+"0";;katex.render(texto,p);}
  static simboloLineasProporcionales(n,lugar){let cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";cont.style.height=n+"px";
    lugar.appendChild(cont);let p = document.createElement("p");cont.appendChild(p);let texto="\\underset{Líneas~proporcionales}{\\mathop{=}}"+"0";katex.render(texto,p);}
  static matriz(mat, lug) {mat = Matriz.aString(mat);mat = Matriz.pasarAFraccion(mat);for (let i = 0; i < mat.length; i++) {for (let j = 0; j < mat[0].length; j++) {
    mat[i][j] = ExpresionAlgebraica.pasarAFraccion(mat[i][j]);}};mat = Matriz.aLatex(mat);let columnas = mat[0].length;let alineacion = "{" + "r".repeat(columnas) + "}";
    let latex = `\\left( \\begin{array}${alineacion}`;latex += mat.map(fila => fila.join(" & ")).join(" \\\\[2ex] ");latex += "\\end{array} \\right)";
    let contenedor = document.createElement("div");contenedor.style.display = "inline-block";lug.appendChild(contenedor);katex.render(latex, contenedor, { throwOnError: false });}
  static determinante(mat,lug){let mat2=mat.map(arr=>arr.slice());mat2=Matriz.aString(mat2);mat2=Matriz.pasarAFraccion(mat2);
    for(let i=0;i<mat2.length;i++){for(let j=0;j<mat2[0].length;j++)mat2[i][j]=ExpresionAlgebraica.pasarAFraccion(mat2[i][j]);}
    mat2=Matriz.aLatex(mat2);let columnas=mat2[0].length;let alineacion="{"+ "r".repeat(columnas) +"}";
    let cuerpo=mat2.map(fila=>fila.join(" & ")).join(" \\\\ ");let latex=`{\\def\\arraystretch{1.25}\\small\\left| \\begin{array}${alineacion}`;
    latex+=cuerpo;latex+="\\end{array} \\right|}";let contenedor=document.createElement("div");contenedor.style.display="inline-block";
    lug.appendChild(contenedor);katex.render(latex,contenedor,{throwOnError:false});}
  static sistemaCompleto(matri,lugar){function necesitaParentesis(c){return /[+\-]/.test(c.slice(1));}
    function t1(c,i){if(c==="-1")return`-x_{${i+1}}`;if(c==="1")return`x_{${i+1}}`;return (necesitaParentesis(c)?`(${c})`:`${c}`)+`x_{${i+1}}`;}
    function t(c,i){if(c==="-1")return`-x_{${i+1}}`;if(c==="1")return`+x_{${i+1}}`;if(necesitaParentesis(c))return`+(${c})x_{${i+1}}`;
    return (c[0]!=="-"?`+${c}`:`${c}`)+`x_{${i+1}}`;}; matri=Matriz.aString(matri); matri=Matriz.pasarAFraccion(matri);
    let m=Matriz.aLatex(matri),m2=m.map(r=>r.slice()),aux=document.createElement("div");
    aux.style.position="absolute";aux.style.visibility="hidden";aux.style.pointerEvents="none";
    document.body.appendChild(aux);Representar.imprimeValoresMatriz(m2,aux);let n=Math.max(1,Math.ceil(aux.clientHeight/30));aux.remove();
    lugar.style.display="flex";lugar.style.alignItems="center";let c1=document.createElement("div"),c2=document.createElement("div");
    lugar.appendChild(c1);lugar.appendChild(c2);Representar.abrirLlave(n,c1);
    c2.style.display="flex";c2.style.justifyContent="center";let tabla=document.createElement("table");c2.appendChild(tabla);
    for(let i=0;i<m.length;i++){let fila=document.createElement("tr"),primer=true,row=m[i];let todos=row.slice(0,-1).every(v=>v==="0"),nVars=row.length-1;
    for(let j=0;j<row.length;j++){let celda=document.createElement("td"),tex="",coef=row[j]
    if(j<row.length-1){if(coef!=="0"){tex=primer?t1(coef,j):t(coef,j);primer=false;}}
    else{celda.style.textAlign="left";if(todos)tex=coef==="0"?"0=0":`0x_{${nVars}}=${coef}`;else{tex=coef==="0"?"=0":"="+coef;if(primer)tex="0"+tex;}}
    try{katex.render(tex,celda);}catch(e){celda.textContent=tex;};fila.appendChild(celda);};tabla.appendChild(fila);}}
  static matrizGauss(mat, lug) {mat = Matriz.aString(mat);mat=Matriz.pasarAFraccion(mat);for (let i = 0; i < mat.length; i++) {for (let j = 0; j < mat[0].length; j++) {
    mat[i][j] = ExpresionAlgebraica.pasarAFraccion(mat[i][j], long);}};mat = Matriz.aLatex(mat);let latex = "\\left( \\begin{array}{";
    for (let i = 0; i < mat[0].length - 1; i++) {latex +="r";}latex += "|r}";for (let fila of mat) {
    let filaLatex = fila.slice(0, -1).join(" & ") + " & " + fila[fila.length - 1];latex += filaLatex + " \\\\ ";};latex += "\\end{array} \\right)";
    let contenedor = document.createElement("div");contenedor.style.display = "inline-block";lug.appendChild(contenedor);
    katex.render(latex, contenedor, { throwOnError: false });}
  static matrizGaussCompleta(mat,lug,leyenda,ordenLeyenda){const deep=a=>JSON.parse(JSON.stringify(a));const norm=v=>{if(v==null)return"";
    let s=(""+v).trim();let m=s.match(/^x\s*_\s*\{?\s*(\d+)\s*\}?$/i);if(m)return`x_{${m[1]}}`;if(/^\d+$/.test(s))return`x_{${s}}`;return s};
    let M=Matriz.aLatex(Matriz.pasarAFraccion(Matriz.aString(deep(mat))));
    if(leyenda&&M&&M.length&&M[0].length>1){const c=M[0].length-1;let et=(Array.isArray(ordenLeyenda)?ordenLeyenda.map(norm):[]).slice(0,c);
    while(et.length<c)et.push("");M=M.map(r=>r.slice());M.push([...et,""]);}
    let MB=leyenda?M.slice(0,-1).map(r=>r.slice()):M.map(r=>r.slice());
    let aux=document.createElement("div");aux.style.position="absolute";aux.style.visibility="hidden";aux.style.left="-9999px";lug.appendChild(aux);
    Representar.imprimeValoresMatriz(MB,aux);let nPar=aux.clientHeight/30+1;aux.remove();
    let conten=document.createElement("div");conten.style.display="flex";conten.style.alignItems="flex-start";conten.style.marginBottom="2px";lug.appendChild(conten);
    const mk=()=>{let p=document.createElement("p");p.style.margin="0";p.style.display="inline-block";p.style.verticalAlign="top";p.style.lineHeight="1.2";
    p.style.textAlign="center";return p};
    let p1=mk(),p2=mk(),p3=mk(),p4=mk(),p5=mk();p3.style.margin="0 5px";[p1,p2,p3,p4,p5].forEach(p=>conten.appendChild(p));
    let izq=[],der=[];for(let i=0;i<M.length;i++){izq[i]=[];for(let j=0;j<M[0].length-1;j++)izq[i][j]=M[i][j];der[i]=[M[i][M[0].length-1]];}
    const centerAll=el=>{el.style.textAlign="center";el.querySelectorAll("*").forEach(n=>n.style.textAlign="center")};
    Representar.abrirParentesis(nPar,p1);Representar.imprimeValoresMatriz(izq,p2);centerAll(p2);
    Representar.abrirBarra(nPar,p3);Representar.imprimeValoresMatriz(der,p4);centerAll(p4);Representar.cerrarParentesis(nPar,p5);
    const sync=()=>{const pick=p=>{let r=p.querySelectorAll("tr");if(r.length)return Array.from(r);r=p.querySelectorAll(".mtr");return Array.from(r)};
    let L=pick(p2),R=pick(p4),m=Math.min(L.length,R.length);
    for(let i=0;i<m;i++){const h=Math.max(L[i].getBoundingClientRect().height,R[i].getBoundingClientRect().height);
      L[i].style.height=h+"px";R[i].style.height=h+"px";
      Array.from(L[i].children).forEach(td=>{td.style.height=h+"px";td.style.verticalAlign="middle"});
      Array.from(R[i].children).forEach(td=>{td.style.height=h+"px";td.style.verticalAlign="middle"});}};
    requestAnimationFrame(()=>requestAnimationFrame(sync));}
    static crearTabla(n,m,lug){let tabla=document.createElement('table');tabla.style.borderCollapse="separate";
      tabla.style.borderSpacing="0 6px";tabla.style.fontSize="0.9em";for(let i=0;i<n;i++){let fila=document.createElement('tr');fila.id=`fila${i}`;
      for(let j=0;j<m;j++){let columna=document.createElement('td');columna.id=`col${i}${j}`;columna.textContent="";
      columna.style.padding="4px 8px";fila.appendChild(columna);};tabla.appendChild(fila);};lug.appendChild(tabla);}
  static crearTabla(n, m, lug) {let tabla = document.createElement('table');for (let i = 0; i < n; i++) {let fila = document.createElement('tr');fila.id = `fila${i}`;  
    for (let j = 0; j < m; j++) {let columna = document.createElement('td');columna.id = `col${i}${j}`;  columna.textContent = "";  
    fila.appendChild(columna);}tabla.appendChild(fila);};lug.appendChild(tabla);}
  
static solucionesSistemaLineal(mat,lug,ley,ordLey){
    let simp=e=>ExpresionAlgebraica.simplificar(""+e),esCero=e=>simp(e)==="0";
    let esEnteroCadena=s=>/^[+-]?\d+$/.test(s),esNumeroCadena=s=>/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(s),yaEsLatex=s=>/\\[a-zA-Z]+/.test(s);
    let aFracLatex=s=>{let frac=fraccionContinua(String(s),long),num=FraccionNumerica.numerador(frac),den=FraccionNumerica.denominador(frac);return `\\dfrac{${num}}{${den}}`;};
    let valorALatex=s=>{s=String(s).trim();if(s==="")return "0";if(esEnteroCadena(s))return s;if(esNumeroCadena(s))return aFracLatex(s);if(yaEsLatex(s))return s;
    try{return ExpresionAlgebraica.pasarALatex(s);}catch{return `\\left(${s.replace(/\s+/g,"")}\\right)`;}};    
    let limpiarSignos=s=>s.replace(/\+\-/g,"-").replace(/\-\+/g,"-").replace(/\+\+/g,"+").replace(/\-\-/g,"+").replace(/=\+/g,"=");
    let etq=j=>{let n=Array.isArray(ordLey)?ordLey.length:0;return ley===true&&n>=j?ordLey[j-1]:j;};
    let ordenar=arr=>{arr.sort((a,b)=>(+a.k)-(+b.k));return arr;};

    lug.innerHTML="";let tipo=Sistema.discutir(mat);
    if(tipo==="I"){lug.textContent="SISTEMA INCOMPATIBLE";return;}
    if(tipo==="CD"){
        let sol=Sistema.resolverSistemaCD(mat);if(typeof sol==="string"){lug.textContent=sol;return;}
        let A=sol.map((v,i)=>({k:etq(i+1),v}));ordenar(A);
        let partes=A.map(o=>`x_{${o.k}}=${valorALatex(o.v)}`),latex=`\\text{SISTEMA COMPATIBLE DETERMINADO. Solución\\;única: }\\left[${partes.join(",\\;")}\\right]`;
        let d=document.createElement("div");katex.render(latex,d,{throwOnError:false});lug.appendChild(d);return;
    }
    if(tipo==="CI"){
        let sol=Sistema.resolverSistemaCI(mat);if(typeof sol==="string"){lug.textContent=sol;return;}
        if(!Array.isArray(sol)||!sol.length){let d=document.createElement("div");katex.render("\\varnothing",d,{throwOnError:false});lug.appendChild(d);return;}
        let k=sol.length,cols=sol[0].length,n=cols-1,p=n-k,ind=k,principal=new Map(),libre=new Map(),t=1,hayFrac=false,denoms=new Set();
        let paramName=i=>p===1?"t":`t_{${i}}`;

        let quitarPar=s=>{s=String(s).trim();if(s[0]==="("&&s[s.length-1]===")"){let d=0;for(let i=0;i<s.length;i++){let c=s[i];if(c==="(")d++;else if(c===")"){d--;if(d===0&&i!==s.length-1)return s;}}return s.slice(1,-1).trim();}return s;};
       let addDen=s=>{s=simp(s);if(!s||esCero(s)||esNumeroCadena(s)||esEnteroCadena(s))return;let t=s.replace(/^[+-]?\d+/,"");if(t==="")t=s;denoms.add(t);};

        let extraerDen=s=>{s=String(s).trim();if(!s.includes("/"))return;let t=simp(s),i=t.lastIndexOf("/");if(i<0)return;let den=quitarPar(t.slice(i+1));if(!den)return;addDen(den);};

        for(let i=0;i<k;i++){
            let idx=0;for(let j=0;j<k;j++)if(!esCero(sol[i][j])){idx=parseInt(simp(sol[i][j]),10);break;}
            let out="",b=simp(sol[i][ind]);if(!esCero(b)){extraerDen(b);out+=valorALatex(b);}
            for(let r=0;r<p;r++){
                let c=simp(sol[i][ind+1+r]);if(esCero(c))continue;extraerDen(c);let tn=paramName(r+1);
                if(c==="1")out+=`+${tn}`;else if(c==="-1")out+=`-${tn}`;else out+=`+${valorALatex(c)}\\,${tn}`;
            }
            out=limpiarSignos(out).replace(/^\+/,"");if(out==="")out="0";if(out.includes("\\dfrac")||out.includes("\\frac"))hayFrac=true;principal.set(idx,out);
        }

        for(let j=1;j<=n;j++)if(!principal.has(j))libre.set(j,paramName(t++));
        let A=[];for(let j=1;j<=n;j++){let rhs=principal.get(j)||libre.get(j),kk=etq(j);if(rhs.includes("\\dfrac")||rhs.includes("\\frac"))hayFrac=true;A.push({k:kk,s:limpiarSignos(`x_{${kk}}=${rhs}`)});}
        ordenar(A);let L=A.map(o=>o.s);
        let sep=hayFrac?"\\\\[8pt]":"\\\\",cond="";if(denoms.size){let C=[...denoms].map(d=>`${valorALatex(d)}\\neq 0`);cond=`\\\\[8pt]\\text{Válido\\;si: }${C.join(",\\;")}`;}
        let latex=`\\text{SISTEMA COMPATIBLE INDETERMINADO. Infinitas\\;soluciones:}\\;\\begin{cases}${L.join(sep)}\\end{cases}${cond}`;
        let d=document.createElement("div");katex.render(latex,d,{throwOnError:false});lug.appendChild(d);return;
    }
    lug.textContent="Tipo de sistema no reconocido";
}


  static determinanteOrden2(deter,lug){let deterA=deter.map(function(arr){return arr.slice()}); 
    lug.style.display="flex";let p1=document.createElement("div");lug.appendChild(p1);
    Representar.determinante(deterA,p1);let text="";let textAux="";
    deterA=Matriz.aNumerica(deterA) 
    if(!ExpresionAlgebraica.simplificar("("+deterA[0][1]+")*("+deterA[1][0]+")").includes("+")&&!ExpresionAlgebraica.simplificar("("+deterA[0][1]+")*("+deterA[1][0]+")").includes("-"))
    {textAux=ExpresionAlgebraica.simplificar("("+deterA[0][0]+")*("+deterA[1][1]+")")+"-"+ExpresionAlgebraica.simplificar("("+deterA[0][1]+")*("+deterA[1][0]+")");}
    else{textAux=ExpresionAlgebraica.simplificar("("+deterA[0][0]+")*("+deterA[1][1]+")")+"-("+ExpresionAlgebraica.simplificar("("+deterA[0][1]+")*("+deterA[1][0]+")")+")";}
    let p2=document.createElement("div");p2.style.display="flex"; p2.style.alignItems="center"; lug.appendChild(p2);
    const contieneLetra = (str) => /[a-zA-Z]/.test(str);
    if(!contieneLetra(textAux)){textAux=ExpresionAlgebraica.pasarALatex(textAux);
      text="="+textAux+"="+ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA));katex.render(text,p2);return}
    else{if(ExpresionAlgebraica.simplificar(textAux)===textAux){katex.render("="+textAux,p2);return}
      else{textAux=ExpresionAlgebraica.pasarALatex(textAux);text="="+textAux+"="+ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA));katex.render(text,p2);return}}}
  static determinanteOrden3(deter,lug){let deterA=deter.map(function(arr){return arr.slice()}); 
    lug.style.display="flex";let p1=document.createElement("div");lug.appendChild(p1);
    let p2=document.createElement("div");p2.style.display="flex"; p2.style.alignItems="center"; lug.appendChild(p2);
    Representar.determinante(deterA,p1);let text="";let textAux="";deterA=Matriz.aNumerica(deterA);
    text="("+ExpresionAlgebraica.simplificar("("+deterA[0][0]+")*("+deterA[1][1]+")*("+deterA[2][2]+")")+")+(";
    text=text+ExpresionAlgebraica.simplificar("("+deterA[1][0]+")*("+deterA[2][1]+")*("+deterA[0][2]+")")+")+(";
    text=text+ExpresionAlgebraica.simplificar("("+deterA[0][1]+")*("+deterA[1][2]+")*("+deterA[2][0]+")")+")-(";
    text=text+ExpresionAlgebraica.simplificar("("+deterA[2][0]+")*("+deterA[1][1]+")*("+deterA[0][2]+")")+")-(";
    text=text+ExpresionAlgebraica.simplificar("("+deterA[2][1]+")*("+deterA[1][2]+")*("+deterA[0][0]+")")+")-(";
    text=text+ExpresionAlgebraica.simplificar("("+deterA[1][0]+")*("+deterA[0][1]+")*("+deterA[2][2]+")")+")";
    text=ExpresionAlgebraica.pasarALatex(text);text=text.replace(/\+\-/g,"-")
    text="="+text+"="+ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA));katex.render(text,p2);return}
  static determinanteOrden3Desarrollo(deter, lug, coeficienteDeterminante = "1") {
    let deterA = deter.map(arr => arr.slice());lug.style.display = "flex";let p2 = document.createElement("div");p2.style.display = "flex";
    p2.style.alignItems = "center";lug.appendChild(p2);let text = "";deterA = Matriz.aNumerica(deterA);
    text = "(" + ExpresionAlgebraica.simplificar(`(${deterA[0][0]})*(${deterA[1][1]})*(${deterA[2][2]})`) + ")+(" +
               ExpresionAlgebraica.simplificar(`(${deterA[1][0]})*(${deterA[2][1]})*(${deterA[0][2]})`) + ")+(" +
               ExpresionAlgebraica.simplificar(`(${deterA[0][1]})*(${deterA[1][2]})*(${deterA[2][0]})`) + ")-(" +
               ExpresionAlgebraica.simplificar(`(${deterA[2][0]})*(${deterA[1][1]})*(${deterA[0][2]})`) + ")-(" +
               ExpresionAlgebraica.simplificar(`(${deterA[2][1]})*(${deterA[1][2]})*(${deterA[0][0]})`) + ")-(" +
               ExpresionAlgebraica.simplificar(`(${deterA[1][0]})*(${deterA[0][1]})*(${deterA[2][2]})`) + ")";
    text = ExpresionAlgebraica.pasarALatex(text).replace(/\+\-/g,"-");
    let rhs = ExpresionAlgebraica.pasarALatex(Matriz.determinante(deterA));
    if (coeficienteDeterminante === "1") {katex.render("=" + text + "=" + rhs, p2);} 
      else if (coeficienteDeterminante === "-1") 
        {katex.render("=" + text + "=" + ExpresionAlgebraica.pasarALatex(ExpresionAlgebraica.simplificar(`-(${Matriz.determinante(deterA)})`)), p2);} 
      else {katex.render("=(" + coeficienteDeterminante + ")(" + text + ")=" +ExpresionAlgebraica.pasarALatex(
          ExpresionAlgebraica.simplificar(`(${coeficienteDeterminante})*(${Matriz.determinante(deterA)})`)), p2);};return;}
  static determinanteSarrus(deter, lug) {let A = deter.map(arr => arr.slice());lug.style.display = "flex";
    const cont1 = document.createElement("div");lug.appendChild(cont1);Representar.determinante(A, cont1);
    A = Matriz.aNumerica(A);const t = (i,j) => `(${A[i][j]})`;
    const sum =
      ExpresionAlgebraica.simplificar(`${t(0,0)}*${t(1,1)}*${t(2,2)}`) + "+ " +
      ExpresionAlgebraica.simplificar(`${t(1,0)}*${t(2,1)}*${t(0,2)}`) + "+ " +
      ExpresionAlgebraica.simplificar(`${t(0,1)}*${t(1,2)}*${t(2,0)}`);
    const sub =
      ExpresionAlgebraica.simplificar(`${t(2,0)}*${t(1,1)}*${t(0,2)}`) + "+ " +
      ExpresionAlgebraica.simplificar(`${t(2,1)}*${t(1,2)}*${t(0,0)}`) + "+ " +
      ExpresionAlgebraica.simplificar(`${t(1,0)}*${t(0,1)}*${t(2,2)}`);
    const mid = `(${sum})-(${sub})`;const midLatex = ExpresionAlgebraica.pasarALatex(mid).replace(/\+\-/g,"-");
    const res = Matriz.determinante(A);const resLatex = ExpresionAlgebraica.pasarALatex(res);
    const cont2 = document.createElement("div");cont2.style.display = "flex";cont2.style.alignItems = "center";lug.appendChild(cont2);
    katex.render("=" + midLatex + "=" + resLatex, cont2);}
  static fraccion(frac, n, lugar) {let cont = document.createElement("div");cont.style.display = "flex";cont.style.alignItems = "center";
    cont.style.height = n + "px";cont.style.marginTop = "10px";lugar.appendChild(cont);
    let p = document.createElement("p");cont.appendChild(p);let nu = FraccionAlgebraica.numerador(frac);let de = FraccionAlgebraica.denominador(frac);
    let signo = parseFloat(ExpresionAlgebraica.simplificar(frac)) < 0 ? "-" : "";nu = Math.abs(parseFloat(nu)).toString();de = Math.abs(parseFloat(de)).toString();
    let texto = `${signo}\\frac{${nu}}{${de}}`;katex.render(texto, p);}
  static coeficienteDeterminante(frac,n,lugar){
    let texto="";let cont = document.createElement("div");cont.style.display = "flex";cont.style.alignItems = "center";
    cont.style.height = n + "px";cont.style.marginTop = "10px";lugar.appendChild(cont);
    let p = document.createElement("p");p.style.height="40px";cont.appendChild(p);let nu = FraccionAlgebraica.numerador(frac);let de = FraccionAlgebraica.denominador(frac);
    if(ExpresionAlgebraica.simplificar(frac)==="-1"){texto="-"}else{if(ExpresionAlgebraica.simplificar(frac)!=="1"){
    let signo =""; if(frac[0]==="-"&&!(frac.includes("+")||frac.includes("-"))){signo="-";nu=nu.slice(1) };
    if(de!=="1"){texto = `${signo}\\frac{${nu}}{${de}}\\cdot`;}else{if(nu.includes("+")||nu.includes("-")){texto = `${signo}\\left(${nu}\\right)\\cdot `;}
      else{texto = `${signo}${nu}\\cdot `;}};};};katex.render(texto, p)}
  static expresion(exp,lugar){let expL=ExpresionAlgebraica.pasarALatex(exp); katex.render(expL,lugar)}
  static matrizALatex(matriz, tipo="pmatrix"){const filasLatex = matriz.map(fila => {return fila.join(' & ');});
    const contenidoMatriz = filasLatex.join(' \\\\ ');return `\\begin{${tipo}}\n${contenidoMatriz}\n\\end{${tipo}}`;}
  static expresionMatricial(exp, matr, lugar) {const getArrayLike = (m) => m?.array ?? m?.matriz ?? m?.values ?? m?.data ?? null;
    const entries = (matr || []).map(m => ({ nombre: String(m?.nombre ?? '').trim(), arr: getArrayLike(m) })).filter(e => e.nombre.length > 0);
    const nombre2matriz = new Map(entries.map(e => [e.nombre, e.arr]));const nombres = [...nombre2matriz.keys()];
    lugar.style.display = "flex";lugar.style.alignItems = "center";
    const cont1 = document.createElement("div");cont1.id = "cont1";
    cont1.style.cssText = "width:auto;height:auto;display:flex;align-items:center;margin-bottom:10px;font-size:13px;";lugar.appendChild(cont1);
    if (!ExpresionMatricial.esValida(exp)) {cont1.textContent = "Expresión inválida.";return;}
    const expreLatex = ExpresionAlgebraica.pasarALatex(exp) + "=";katex.render(expreLatex, cont1);
    const cont2 = document.createElement("div");cont2.id = "cont2";
    cont2.style.cssText = "width:auto;height:auto;display:flex;align-items:center;margin-bottom:10px;font-size:13px;";lugar.appendChild(cont2);
    const matrices = nombres.map(nombre => ({nombre,matriz: nombre2matriz.get(nombre)}));
    const latexSustituido = Representar.expresionMatricialSustituida(exp, matrices);katex.render(latexSustituido, cont2);}
  static expresionMatricialIntermedia(exp, matr, lugar) {const getArrayLike = (m) => m?.array ?? m?.matriz ?? m?.values ?? m?.data ?? null;
    const entries = (matr || []).map(m => ({ nombre: String(m?.nombre ?? '').trim(), arr: getArrayLike(m) })).filter(e => e.nombre.length > 0);
    const nombre2matriz = new Map(entries.map(e => [e.nombre, e.arr]));const nombres = [...nombre2matriz.keys()];
    lugar.style.display = "flex";lugar.style.alignItems = "center";const cont2 = document.createElement("div");cont2.id = "cont2";
    cont2.style.cssText = "width:auto;height:auto;display:flex;align-items:center;margin-bottom:10px;font-size:13px;";lugar.appendChild(cont2);
    if (!ExpresionMatricial.esValida(exp)) {cont2.textContent = "Expresión inválida.";return;}
    const matrices = nombres.map(nombre => ({nombre,matriz: nombre2matriz.get(nombre)}));
    const latexSustituido = Representar.expresionMatricialSustituida(exp, matrices);
    katex.render(latexSustituido, cont2);}
  static expresionMatricialPasoaPaso(exp,matr,lugar){
    const baseLocal=new Set(matr.map(x=>x.nombre)),baseGlobal=new Set((window.matrices||[]).map(x=>x.nombre));
    const ensureIdentitiesFromExp=(e,ms)=>{
    const base=new Set(ms.map(x=>x.nombre)),added=[];
    const add=n=>{const nombre=`I_${n}`;if(!base.has(nombre)&&!ms.some(x=>x.nombre===nombre)){ms.push({nombre,matriz:Matriz.identidad(n)});added.push(nombre)}};
    const ids=new Set(Array.from(e.matchAll(/\bI_(\d+)\b/g),m=>+m[1]));ids.forEach(add);return added;};
    const scroll=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{lugar.scrollTop=lugar.scrollHeight}));
    exp=ExpresionMatricial.sustituirIdentidades(exp,matr);
    const added=ensureIdentitiesFromExp(exp,matr);
    while(lugar.firstChild)lugar.removeChild(lugar.firstChild);
    const linea=document.createElement('div');linea.className='exp-linea';lugar.appendChild(linea);scroll();
    if(!document.getElementById('exp-linea-css')){const style=document.createElement('style');style.id='exp-linea-css';
      style.textContent=`.exp-linea{display:flex;flex-wrap:wrap;align-items:center;column-gap:.5rem;row-gap:.5rem}.exp-bloque{display:inline-flex;
      align-items:center;white-space:nowrap}.exp-bloque>*{display:inline-block}.exp-igual{display:inline-flex;align-items:center;padding:0 .25rem}`;
      document.head.appendChild(style);}
    const addBloque=(renderFn,expr)=>{const cont=document.createElement('span');cont.className='exp-bloque';linea.appendChild(cont);renderFn(expr,matr,cont);scroll()};
    const addIgual=()=>{const eq=document.createElement('span');eq.className='exp-igual';eq.textContent='=';linea.appendChild(eq);scroll()};
    addBloque(Representar.expresionMatricial,exp);addIgual();let actual=exp;
    try{while(true){const siguiente=ExpresionMatricial.calcularUnPaso(actual,matr);addBloque(Representar.expresionMatricialIntermedia,siguiente);
      const post=ExpresionMatricial.infijaAPostfija(siguiente);
      if(post.length===1)break;addIgual();actual=siguiente;}} 
    finally {for(let i=matr.length-1;i>=0;i--)if(!baseLocal.has(matr[i].nombre))matr.splice(i,1);
    if(Array.isArray(window.matrices)){for(let i=window.matrices.length-1;i>=0;i--) if(!baseGlobal.has(window.matrices[i].nombre)) window.matrices.splice(i,1);}}}
  static async expresionMatricialPasoaPaso2(exp,matr,lugar){
    const baseLocal=new Set(matr.map(x=>x.nombre)),baseGlobal=new Set((window.matrices||[]).map(x=>x.nombre));
    const ensureIdentitiesFromExp=(e,ms)=>{const base=new Set(ms.map(x=>x.nombre)),added=[];const add=n=>{const nombre=`I_${n}`;
      if(!base.has(nombre)&&!ms.some(x=>x.nombre===nombre)){ms.push({nombre,matriz:Matriz.identidad(n)});added.push(nombre)}}; 
      const ids=new Set(Array.from(e.matchAll(/\bI_(\d+)\b/g),m=>+m[1]));ids.forEach(add);return added};
    const scroll=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{lugar.scrollTop=lugar.scrollHeight}));
    exp=ExpresionMatricial.sustituirIdentidades(exp,matr);const added=ensureIdentitiesFromExp(exp,matr);
    while(lugar.firstChild)lugar.removeChild(lugar.firstChild);const linea=document.createElement('div');linea.className='exp-linea';lugar.appendChild(linea);
    if(!document.getElementById('exp-linea-css')){const style=document.createElement('style');
      style.id='exp-linea-css';style.textContent=`.exp-linea{display:flex;flex-wrap:wrap;align-items:center;
      column-gap:.5rem;row-gap:.5rem}.exp-bloque{display:inline-flex;align-items:center;white-space:nowrap}.exp-bloque>*{display:inline-block}.
            exp-igual{display:inline-flex;align-items:center;padding:0 .25rem}.exp-ctrl{margin-top:.5rem;display:flex;gap:.5rem;align-items:center}.
            exp-btn{cursor:pointer;border:1px solid #ccc;border-radius:.4rem;padding:.25rem .6rem;background:#f7f7f7}.exp-btn:disabled{opacity:.5;
      cursor:not-allowed}`;document.head.appendChild(style)}
    const addBloque=(fn,expr)=>{const cont=document.createElement('span');cont.className='exp-bloque';linea.appendChild(cont);fn(expr,matr,cont);scroll()};
    const addIgual=()=>{const eq=document.createElement('span');eq.className='exp-igual';eq.textContent='=';linea.appendChild(eq);scroll()};
    const ctrl=document.createElement('div');ctrl.className='exp-ctrl';const btn=document.createElement('button');btn.className='exp-btn';
    btn.type='button';btn.textContent='Continuar ▶︎';ctrl.appendChild(btn);lugar.appendChild(ctrl);scroll();
    const waitForClick=()=>new Promise(r=>{const onClick=()=>{cleanup();scroll();r()};const onKey=e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();cleanup();scroll();r()}};
      const cleanup=()=>{btn.removeEventListener('click',onClick);document.removeEventListener('keydown',onKey)};btn.addEventListener('click',onClick);
      document.addEventListener('keydown',onKey)});
    addBloque(Representar.expresionMatricial,exp);addIgual();await waitForClick();let actual=exp;
    try{while(true){const siguiente=ExpresionMatricial.calcularUnPaso(actual,matr);addBloque(Representar.expresionMatricialIntermedia,siguiente);
        const post=ExpresionMatricial.infijaAPostfija(siguiente);if(post.length===1)break;addIgual();await waitForClick();actual=siguiente;}
      btn.remove();ctrl.remove();scroll();} 
    finally {for(let i=matr.length-1;i>=0;i--) if(!baseLocal.has(matr[i].nombre)) matr.splice(i,1);
      if(Array.isArray(window.matrices)){for(let i=window.matrices.length-1;i>=0;i--) if(!baseGlobal.has(window.matrices[i].nombre)) window.matrices.splice(i,1)}}}
  static async expresionMatricialPasoaPaso3(exp,matr,lugar){
    const baseLocal=new Set(matr.map(x=>x.nombre)),baseGlobal=new Set((window.matrices||[]).map(x=>x.nombre));
    const addI=n=>{const nombre=`I_${n}`;if(!baseLocal.has(nombre)&&!matr.some(x=>x.nombre===nombre))matr.push({nombre,matriz:Matriz.identidad(n)})};
    const scroll=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{lugar.scrollTop=lugar.scrollHeight}));
    const safe=(str,fn,into)=>{try{fn(str,matr,into)}catch(_){into.style.fontFamily="monospace";into.textContent=str}};
    const sinDecimales=str=>String(str??"").replace(/(^|[^A-Za-z0-9_])(-?\d*\.\d+)(?![A-Za-z0-9_])/g,(m,p,d)=>{
      let f;try{f=fraccionContinua(String(d),long)}catch(_){return m}
      if(!f||f===d)return m;return p+(String(f).includes("/")?"("+f+")":f)});
    exp=String(exp||"");exp=ExpresionMatricial.sustituirIdentidades(exp,matr); [...new Set((exp.match(/\bI_(\d+)\b/g)||[]).map(s=>+s.slice(2)))].forEach(addI);
    while(lugar.firstChild)lugar.removeChild(lugar.firstChild);
    if(!document.getElementById("emps3-css")){
      const s=document.createElement("style");s.id="emps3-css";s.textContent=
    `#caja21{width:65%}.twrap{width:100%;overflow-x:auto;overflow-y:hidden}
    .tpasos{border-collapse:separate;border-spacing:.4rem .35rem;table-layout:fixed;width:100%;white-space:nowrap}
    .tpasos col.pasoCol{width:6rem;min-width:6rem;max-width:6rem}
    .tpasos>tbody>tr>th,.tpasos>tbody>tr>td{border:1px solid #ccc;padding:.35rem .5rem;vertical-align:middle;text-align:left;background:#fff}
    .tpasos>tbody>tr>th{background:#f7f7f7;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .tpasos>tbody>tr>td.exprCell{width:var(--exprw,auto);min-width:var(--exprw,auto);max-width:var(--exprw,auto);overflow-x:auto;overflow-y:hidden}
    .tpasos>tbody>tr>td.calcCell{text-align:right}.tpasos>tbody>tr>td.calcCell .panelCalc{justify-content:flex-end;width:100%}
    .bloq{display:inline-flex;align-items:baseline;font-size:13px;line-height:1.1}.bloq .katex{vertical-align:middle;line-height:1}
    .msg{font-size:13px;color:#b00;margin-left:.5rem}.btn{cursor:pointer;border:1px solid #bbb;border-radius:.35rem;padding:.12rem .5rem;background:#f7f7f7;font-size:13px;margin-left:.4rem}
    .panelCalc{display:inline-flex;align-items:center;gap:.45rem;flex-wrap:nowrap}
    .tabla{border-collapse:collapse;margin:0;font-size:13px;line-height:1;display:inline-block;table-layout:fixed}
    .tablaRes{border-collapse:separate;border-spacing:0;margin:0;font-size:13px;line-height:1;background:transparent;display:inline-block;table-layout:fixed}
    .td{border:1px solid #000;padding:0 2px;text-align:right;min-width:2.2em}
    .tdRes{border:0!important;padding:0 4px;background:transparent;text-align:right;min-width:2.2em}
    .inp{width:40px;height:18px;line-height:18px;font-size:13px;text-align:right;padding:0 2px}
    .final{font-size:13px;opacity:.85;margin-left:.45rem;display:inline-block;vertical-align:middle}`;
        document.head.appendChild(s);}
    const wrap=document.createElement("div");wrap.className="twrap";
    const cont=document.createElement("table");cont.className="tpasos";
    const cg=document.createElement('colgroup'),c1=document.createElement('col'),c2=document.createElement('col'),c3=document.createElement('col');
    c1.className='pasoCol';c3.className='calcCol';cg.appendChild(c1);cg.appendChild(c2);cg.appendChild(c3);cont.appendChild(cg);
    wrap.appendChild(cont);lugar.appendChild(wrap);scroll();
    const tr0=document.createElement("tr"),th0=document.createElement("th");th0.textContent="";
    const td0=document.createElement("td");td0.className="exprCell";const tdV=document.createElement("td");tdV.className="calcCell";tdV.textContent="";
    tr0.appendChild(th0);tr0.appendChild(td0);tr0.appendChild(tdV);cont.appendChild(tr0);scroll();
    const b=document.createElement("span");b.className="bloq";safe(sinDecimales(exp),Representar.expresionMatricial,b);td0.appendChild(b);scroll();
    requestAnimationFrame(()=>{const w=Math.ceil(td0.getBoundingClientRect().width);if(w>0)cont.style.setProperty("--exprw",w+"px")});
    const pintarMatrizComoExpresion=(M,into)=>{const par=document.createElement("span");par.className="bloq";
      par.style.display="inline-flex";par.style.alignItems="center";const tabla=document.createElement("table");tabla.className="tablaRes";
      try{Representar.abrirParentesis(M.length+1,par)}catch(_){}
      par.appendChild(tabla);try{Representar.cerrarParentesis(M.length+1,par)}catch(_){}
      for(let i=0;i<M.length;i++){const tr=document.createElement("tr");
        for(let j=0;j<M[0].length;j++){const td=document.createElement("td");td.className="tdRes";
          const cel=document.createElement("span");cel.className="bloq";safe(sinDecimales(String(M[i][j])),Representar.expresionMatricialIntermedia,cel);
          td.appendChild(cel);tr.appendChild(td)};tabla.appendChild(tr)}
      into.appendChild(par)};
    const previewPaso=(expAct,ms)=>{const post=ExpresionMatricial.infijaAPostfija(expAct),nom=ms.map(o=>o.nombre);
      const get=n=>(ms.find(o=>o.nombre===n)||{}).matriz;
    const esEscalar=expr=>{if(!expr)return null;for(const n of nom)if(expr.includes(n))return null;try{
    let s=String(ExpresionAlgebraica.simplificar(expr)).trim();if(s[0]==="("&&s[s.length-1]===")")s=s.slice(1,-1).trim();
    if(!isNaN(+s))return s;if(/^-?\d+\s*\/\s*\d+$/.test(s))return s.replace(/\s+/g,"");}catch(_){}return null};
      for(let i=0;i<post.length;i++){const a=post[i-2],b=post[i-1],op=post[i],nx=post[i+1];
        if(op==="+"){if(nom.includes(a)&&nom.includes(b))return{trozo:`${a}+${b}`,mat:Matriz.sumar(get(a),get(b))}}
        if(op==="-"){if(nom.includes(a)&&nom.includes(b))return{trozo:`${a}-${b}`,mat:Matriz.restar(get(a),get(b))};
          if(a==="0"&&nom.includes(b))return{trozo:`0-${b}`,mat:Matriz.opuesta(get(b))};
          if(nom.includes(post[i-3])&&a==="0"&&b==="1"&&nx==="^"){const A=get(post[i-3]);return{trozo:`${post[i-3]}^(-1)`,mat:Matriz.inversa(A)}}}
        if(op==="*"){if(nom.includes(a)&&nom.includes(b))return{trozo:`${a}*${b}`,mat:Matriz.multiplicar(get(a),get(b))};
          const sa=esEscalar(a),sb=esEscalar(b);
          if(nom.includes(b)&&sa!==null)return{trozo:`${a}*${b}`,mat:Matriz.multiplicarEscalar(sa,get(b))};
          if(nom.includes(a)&&sb!==null)return{trozo:`${a}*${b}`,mat:Matriz.multiplicarEscalar(sb,get(a))}}
        if(op==="^"){if(nom.includes(a)&&b==="t")return{trozo:`${a}^(t)`,mat:Matriz.trasponer(get(a))};
          if(nom.includes(a)&&!isNaN(+b))return{trozo:`${a}^(${b})`,mat:Matriz.potencia(get(a),Number(b))};
          if(!nom.includes(a)&&!isNaN(+b)){try{const A=ExpresionMatricial.calcular(a,ms);
            if(Array.isArray(A)&&Array.isArray(A[0]))return{trozo:`${a}^(${b})`,mat:Matriz.potencia(A,Number(b))}
          }catch(_){}}}};return null};let actual=exp,pasoNum=1;
      try{ while(true){const paso=previewPaso(actual,matr);if(!paso){const tr=document.createElement("tr"),th=document.createElement("th");th.textContent="Resultado final";
          const tdExpr=document.createElement("td");tdExpr.className="exprCell";
          const tdCalc=document.createElement("td");tdCalc.className="calcCell";
          cont.appendChild(tr);tr.appendChild(th);tr.appendChild(tdExpr);tr.appendChild(tdCalc);scroll();
          const expr=document.createElement("span");expr.className="bloq";safe(sinDecimales(actual),Representar.expresionMatricialIntermedia,expr);
          tdExpr.appendChild(expr);scroll();break }
        const tr=document.createElement("tr"),th=document.createElement("th");th.textContent=`PASO ${pasoNum++}`;
        const tdExpr=document.createElement("td");tdExpr.className="exprCell";const tdCalc=document.createElement("td");tdCalc.className="calcCell";
        cont.appendChild(tr);tr.appendChild(th);tr.appendChild(tdExpr);tr.appendChild(tdCalc);scroll();
        const expr=document.createElement("span");expr.className="bloq";safe(sinDecimales(actual),Representar.expresionMatricialIntermedia,expr);
        tdExpr.appendChild(expr);scroll();
        const panel=document.createElement("span");panel.className="panelCalc";tdCalc.appendChild(panel);
        const lbl=document.createElement("span");lbl.className="bloq";lbl.style.opacity=".9";lbl.textContent="Calcular:";panel.appendChild(lbl);
        const trozoNorm=String(paso.trozo||"").replace(/·/g,"*").replace(/\^\s*\{\s*([^}]+)\s*\}/g,"^($1)")
          .replace(/\^t\b/g,"^(t)").replace(/\^\s*\(\s*-1\s*\)/g,"^(-1)");
        const trozo=document.createElement("span");trozo.className="bloq";panel.appendChild(trozo);
        safe(sinDecimales(trozoNorm),Representar.expresionMatricialIntermedia,trozo);panel.appendChild(document.createTextNode(" = "));
        const A=Array.isArray(paso.mat)?paso.mat:[[0,0],[0,0]];
        const par=document.createElement("span");par.className="bloq";par.style.display="inline-flex";par.style.alignItems="center";
        const tabla=document.createElement("table");tabla.className="tabla";
        try{Representar.abrirParentesis(A.length+1,par)}catch(_){}
        par.appendChild(tabla);try{Representar.cerrarParentesis(A.length+1,par)}catch(_){};panel.appendChild(par);scroll();
        const msg=document.createElement("span");msg.className="msg";panel.appendChild(msg);
        const btnAuto=document.createElement("button");btnAuto.className="btn";btnAuto.textContent="Resolver (no recomendado)";panel.appendChild(btnAuto);
        const btnCont=document.createElement("button");btnCont.className="btn";btnCont.textContent="Continuar ▶︎";btnCont.style.display="none";
        panel.appendChild(btnCont);scroll();
        const inputs=[];let first=null;
        for(let i=0;i<A.length;i++){const trT=document.createElement("tr");
          for(let j=0;j<A[0].length;j++){const tdT=document.createElement("td");tdT.className="td";
            const inp=document.createElement("input");inp.type="text";inp.className="inp";inp.dataset.i=i;inp.dataset.j=j;
            tdT.appendChild(inp);trT.appendChild(tdT);inputs.push(inp);if(!first)first=inp}
          tabla.appendChild(trT)}scroll();
        const ok=inp=>{const i=+inp.dataset.i,j=+inp.dataset.j,d=inp.value.trim(),esp=A[i][j];
          try{return d!==""&&ExpresionAlgebraica.simplificar("("+d+")-("+esp+")")==="0"}catch(_){return false}};
        let k=0;const foc=()=>{inputs[k]?.focus();inputs[k]?.select()};
        const onEnter=e=>{if(e.key!=="Enter"&&e.key!=="Tab")return;e.preventDefault();const inp=e.currentTarget;
          if(ok(inp)){inp.style.border="";inp.readOnly=true;k++;if(k<inputs.length)foc();else{msg.textContent="";
            btnAuto.style.display="none";btnCont.style.display="inline-block"}scroll()}
          else{inp.style.border="2px solid #d33";msg.textContent="Valor incorrecto.";inp.focus();inp.select();scroll()}};
        inputs.forEach(inp=>inp.addEventListener("keydown",onEnter));
        btnAuto.addEventListener("click",()=>{inputs.forEach(inp=>{const i=+inp.dataset.i,j=+inp.dataset.j;inp.value=A[i][j];
          inp.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter"}))});scroll()});setTimeout(()=>{if(first)first.focus()},0);
        await new Promise(r=>{const on=()=>{btnCont.removeEventListener("click",on);r()};btnCont.addEventListener("click",on)});
        par.remove();msg.textContent="";btnAuto.remove();btnCont.remove();
        const tail=document.createElement("span");tail.className="bloq";pintarMatrizComoExpresion(A,tail);panel.appendChild(tail);scroll();
        const siguiente=ExpresionMatricial.calcularUnPaso(actual,matr);
        if(!siguiente||siguiente===actual){th.textContent="Resultado final";scroll();break};actual=siguiente;scroll() }}
        finally{for(let i=matr.length-1;i>=0;i--)if(!baseLocal.has(matr[i].nombre))matr.splice(i,1);
        if(Array.isArray(window.matrices))for(let i=window.matrices.length-1;i>=0;i--)if(!baseGlobal.has(window.matrices[i].nombre))window.matrices.splice(i,1)} }
  static expresionMatricialSustituida(expresion, matrices) {expresion = ExpresionAlgebraica.notacionConProductos(expresion);
    const postfijo = ExpresionAlgebraica.infijaAPostfija(expresion);
    function matrizALatex(array) {return '\\begin{pmatrix}' +array.map(fila => fila.join('&')).join('\\\\') +'\\end{pmatrix}';}
    const tokensSustituidos = postfijo.map(token => {for (const { nombre, matriz } of matrices) {if (token === nombre) {return `{${matrizALatex(matriz)}}`;}}return token;});
    const infijoSustituido = ExpresionMatricial.postfijaAInfija(tokensSustituidos);
    let resultado = infijoSustituido.replace(/\)\(/g, ')\\cdot (').replace(/\*/g, '\\cdot ');      
    resultado = resultado.replace(/(?<!\^)\(([^()]*[+\-][^()]*)\)/g,'\\left[ $1 \\right]');
    resultado = resultado.replace(/\^\(([^()]+)\)/g, '^{$1}');resultado = resultado.replace(/(?<!\^)\(([^()]*[+\-][^()]*)\)/g,'\\left[ $1 \\right]');return resultado;}
}



class Validar {
  static validarEntradaNumeroEnteroPositivo(valor) {if (!valor || isNaN(valor) || valor <= 0 || !Number.isInteger(Number(valor))) 
              {throw new Error("entradaInvalida");}return Number(valor);}
  static validarExpresionParentesisBalanceados(expresion) {const abrir = (expresion.match(/\(/g) || []).length;const cerrar = (expresion.match(/\)/g) || []).length;
    if (abrir !== cerrar) {throw new Error("Paréntsis no balanceados");} else return true}
  static expresionParentesisBalanceadosYCaracteresValidos(expresion) {const abrir = (expresion.match(/\(/g) || []).length;const cerrar = (expresion.match(/\)/g) || []).length;
    if (abrir !== cerrar) {throw new Error("Parentesis no balanceados");};if (expresion.trim() === "") {throw new Error("Expresion vacía");}
    const caracteresValidos = /^[A-Za-z\u0391-\u03A9\u03B1-\u03C90-9+\-*/^()._·\s]*$/;if (!caracteresValidos.test(expresion)) {throw new Error("Caracteres no válidos");}}
  static expresionNumerica(expresion) {expresion = expresion.replace(/\s+/g, "");expresion=expresion.replace(/(^\s*\+?)|(\()\s*\+/g, '$2');
    expresion = ExpresionAlgebraica.notacionConProductos(expresion);
    for (const f of funciones) {const regex = new RegExp(`${f}\\^([0-9]+(?:\\.[0-9]+)?)\\s*\\(([^()]|\\([^()]*\\))*\\)`, 'g');
    expresion = expresion.replace(regex, (match, num, args) => {const start = match.indexOf('(');const end = match.lastIndexOf(')');
      const funcArgs = match.substring(start + 1, end);return `(${f}(${funcArgs}))^${num}`;});}
    const funcionesRegex = funciones.map(f => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|");
    const validos = new RegExp(`^(${funcionesRegex}|pi|e|[0-9+*/^().\\s-])*$`);
      if (!validos.test(expresion)) return [false, `Error: la expresión contiene caracteres inválidos.`];
    const abrir = (expresion.match(/\(/g) || []).length;const cerrar = (expresion.match(/\)/g) || []).length;
      if (abrir !== cerrar) return [false, `Error: la expresión contiene paréntesis desbalanceados.`];
    const tokenRegex = new RegExp(funciones.join("|") + "|pi|e|\\d+\\.?\\d*|[+\\-*/^()]", "g");let tokens = expresion.match(tokenRegex);
      if (!tokens) return [false, "Error: no se pudo tokenizar la expresión."];
    for (let i = 0; i < tokens.length; i++) {if (funciones.includes(tokens[i]) && tokens[i + 1] !== "(") 
        {return [false, `Error: la función '${tokens[i]}' debe ir seguida de un paréntesis abierto.`];}}
    for (let i = 1; i < tokens.length; i++) {if ("+-*/^".includes(tokens[i]) && "+-*/^".includes(tokens[i - 1])) 
      {if (tokens[i] === "-" && (tokens[i - 1] === "(" || tokens[i - 1] === "-")) continue;
        return [false, `Error: operadores adyacentes '${tokens[i - 1]}${tokens[i]}' no permitidos.`];}}
    if (tokens[0] === "-") {tokens = ["0", "-", tokens[1], ...tokens.slice(2)];}
    for (let i = 0; i < tokens.length - 2; i++) {if (tokens[i] === "(" && tokens[i + 1] === "-") 
      {if (/^\d+\.?\d*$/.test(tokens[i + 2]) || funciones.includes(tokens[i + 2]) || tokens[i + 2] === "(")  
        {tokens.splice(i + 1, 0, "0");i++;}}};
    let newTokens = [];
    for (let i = 0; i < tokens.length; i++) {
      if (funciones.includes(tokens[i]) && tokens[i + 1] === "(") {let funcName = tokens[i];let parCount = 0;let funcExpr = funcName;let j = i + 1;
        while (j < tokens.length) {funcExpr += tokens[j];if (tokens[j] === "(") parCount++;if (tokens[j] === ")") parCount--;
          if (parCount === 0 && tokens[j] === ")") break;j++;};newTokens.push(funcExpr);i = j;} else {newTokens.push(tokens[i]);}}
    expresion=newTokens.join("");tokens = expresion.match(tokenRegex);if (!tokens) return [false, "Error: no se pudo tokenizar la expresión."];
    const salida = [], operadores = [];const prec = { "^": 4, "*": 3, "/": 3, "+": 2, "-": 2 };
    const asoc = { "^": "right", "*": "left", "/": "left", "+": "left", "-": "left" };
    for (const token of tokens) {
      if (/^\d+\.?\d*$/.test(token)||token==="pi"||token === "e") { salida.push(token);} else if (funciones.includes(token)) {operadores.push(token);} 
        else if (token === "(") {operadores.push(token);} else if (token === ")") 
          {while (operadores.length && operadores.at(-1) !== "(") {salida.push(operadores.pop());}
        if (!operadores.length || operadores.at(-1) !== "(") return [false, "Error: paréntesis sin cerrar en la expresión."];
        operadores.pop();if (operadores.length && funciones.includes(operadores.at(-1))) {salida.push(operadores.pop());}} 
        else if ("+-*/^".includes(token)) {while (operadores.length) {const top = operadores.at(-1);
            if ("+-*/^".includes(top) && ((asoc[token] === "left" && prec[token] <= prec[top]) ||(asoc[token] === "right" && prec[token] < prec[top]))) 
              {salida.push(operadores.pop());} else break;}
        operadores.push(token);} else {return [false, "Error: token inválido encontrado durante el procesamiento."];}}
    while (operadores.length) {if (["("].includes(operadores.at(-1))) return [false, "Error: paréntesis sin cerrar en la expresión."];salida.push(operadores.pop())}
    const pila = [];const prioridad = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
    for (const token of salida) {
        if (/^\d+\.?\d*$/.test(token) || token === "pi" || token === "e") {pila.push({ expr: token, prio: 4 });}
          else if (funciones.includes(token)) {if (!pila.length) return [false, "Error: argumento faltante para la función."];
            const arg = pila.pop();pila.push({ expr: `${token}(${arg.expr})`, prio: 4 });} 
          else if ("+-*/^".includes(token)) {
    if (pila.length < 2) return [false,"Error: no es una expresión válida"];
    const b = pila.pop(), a = pila.pop();const prio = prioridad[token];
    if (token === "-" && a.expr === "0") {pila.push({ expr: `-${b.expr}`, prio: 1 });continue;};let aExpr, bExpr;
    if (token === "^") {aExpr = a.prio < prio ? `(${a.expr})` : a.expr;bExpr = b.prio <= prio ? `(${b.expr})` : b.expr;} 
    else {aExpr = a.prio < prio ? `(${a.expr})` : a.expr;bExpr = b.prio < prio ||
            (token === "^" && b.prio === prio) ||((token === "-" || token === "/") && b.prio === prio)? `(${b.expr})`: b.expr;}
    pila.push({ expr: `${aExpr}${token}${bExpr}`, prio });} else {return [false, `Error: token desconocido '${token}'`];}}
    if (pila.length !== 1) return [false,"Error: no es una expresión válida"];
    return [true,salida,pila[0].expr];}
  static expresionAlgebraica(expr) {expr=expr.replace(/(^\s*\+?)|(\()\s*\+/g, '$2');
    if (typeof ExpresionAlgebraica?.notacionConProductos === "function") expr = ExpresionAlgebraica.notacionConProductos(expr);
    expr = String(expr ?? "").replace(/·/g, "*");expr = expr.replace(/\^\s*\{\s*t\s*\}/g, '^t').replace(/\^\s*\{\s*-1\s*\}/g, '^(0-1)').replace(/\^\s*-\s*1\b/g, '^(0-1)');
    funciones.sort((a, b) => b.length - a.length);
    const validos = /^[A-Za-z\u0391-\u03A9\u03B1-\u03C90-9+\-*/^()._·\s]*$/;if (!validos.test(expr)) return [false,"Error: caracteres no válidos"];
    const abrir = (expr.match(/\(/g) || []).length, cerrar = (expr.match(/\)/g) || []).length;if (abrir !== cerrar) return [false,"Error: paréntesis desbalanceados "]
    function reescribirPotenciasDeFuncion(s, fns) {const esId = c => /[A-Za-z\u0391-\u03A9\u03B1-\u03C90-9_]/.test(c);
      let i = 0, out = "";while (i < s.length) {let match = null;for (const fn of fns) {if (s.startsWith(fn, i)) {const prev = i > 0 ? s[i - 1] : "";
        if (!esId(prev)) { match = fn; break; }}};if (!match) { out += s[i++]; continue; }
      const fn = match;let j = i + fn.length;if (s[j] !== "^") { out += s[i++]; continue; };j++;
        const ei = j; while (j < s.length && /[0-9.]/.test(s[j])) j++;if (j === ei) { out += s[i++]; continue; }
        const exp = s.slice(ei, j);while (j < s.length && /\s/.test(s[j])) j++;if (s[j] !== "(") { out += s[i++]; continue; };let k = j, nivel = 0;
        while (k < s.length) { if (s[k] === "(") nivel++; else if (s[k] === ")") { nivel--; if (nivel === 0) break; } k++; }
          if (k >= s.length || nivel !== 0) { out += s[i++]; continue; };const args = s.slice(j + 1, k);out += `(${fn}(${args}))^${exp}`;i = k + 1;}
      const nuevo = out;if (nuevo !== s) return reescribirPotenciasDeFuncion(nuevo, fns);return nuevo;}
    expr = reescribirPotenciasDeFuncion(expr, funciones);
    const tokenRegex = new RegExp(`(${funciones.join("|")})(?=\\()|\\d+\\.?\\d*|[A-Za-z\\u0391-\\u03A9\\u03B1-\\u03C9_][A-Za-z\\u0391-\\u03A9\\u03B1-\\u03C90-9_]*|[+\\-*/^()]`,"g");
    const tokens = expr.match(tokenRegex);if (!tokens) return [false,"Error: No se pudieron obtener tokens"];
    const OPS = "+-*/^";
    for (let i = 1; i < tokens.length; i++) if (OPS.includes(tokens[i]) && OPS.includes(tokens[i - 1])) return [false,"Error: operadores consecutivos"];
    const esIdent = (t) => /^[A-Za-z\u0391-\u03A9\u03B1-\u03C9_][A-Za-z\u0391-\u03A9\u03B1-\u03C90-9_]*$/.test(t);
    const variables = [...new Set(tokens.filter(t => esIdent(t) && !funciones.includes(t)))].sort();
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === "-" && (i === 0 || tokens[i - 1] === "(")) {const s = tokens[i + 1];
        if (/^[A-Za-z\u0391-\u03A9\u03B1-\u03C90-9_(]/.test(s)) tokens.splice(i, 2, "0", "-", s); else return [false,"Error: igno - inválido"];}}
    const salida = [], operadores = [];const prec = { "^": 4, "*": 3, "/": 3, "+": 2, "-": 2 };
    const asoc = { "^": "right", "*": "left", "/": "left", "+": "left", "-": "left" };
    for (const t of tokens) {if (/^\d+\.?\d*$/.test(t) || (esIdent(t) && !funciones.includes(t))) { salida.push(t); }
      else if (funciones.includes(t)) { operadores.push(t); } else if (t === "(") { operadores.push(t); }
      else if (t === ")") {while (operadores.length && operadores.at(-1) !== "(") { const op = operadores.pop(); 
          if (funciones.includes(op) || OPS.includes(op)) salida.push(op); }if (!operadores.length || operadores.at(-1) !== "(") return [false,"Error: paréntesis desbalanceados"];
        operadores.pop();if (operadores.length && funciones.includes(operadores.at(-1))) salida.push(operadores.pop());} 
      else if (OPS.includes(t)) {while (operadores.length) {const top = operadores.at(-1);
          if (OPS.includes(top) && ((asoc[t] === "left" && prec[t] <= prec[top]) || (asoc[t] === "right" && prec[t] < prec[top]))) { salida.push(operadores.pop()); } else break;}
        operadores.push(t);} else return [false,"Error: toen inválido"];}
    while (operadores.length) { if (operadores.at(-1) === "(") return [false,"Error: paréntesis desbalanceados"]; salida.push(operadores.pop()); }
    const pila = [];const prioridad = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
    const reNumero = /^\d+\.?\d*$/;const reSoloLetras = /^[A-Za-z\u0391-\u03A9\u03B1-\u03C9]+$/;const reLetraSubNum = /^[A-Za-z\u0391-\u03A9\u03B1-\u03C9]_[0-9]+$/;
    for (const token of salida) {if (reNumero.test(token) ||((reSoloLetras.test(token) || reLetraSubNum.test(token)) && !funciones.includes(token))) 
    {pila.push({ expr: token, prio: 4 });} else if (funciones.includes(token)) {if (!pila.length) return false;const arg = pila.pop();
      pila.push({ expr: `${token}(${arg.expr})`, prio: 4 });} 
      else if ("+-*/^".includes(token)) { if (pila.length < 2) return [false, "Error: no es una expresión válida"];
      const b = pila.pop(), a = pila.pop();const prio = prioridad[token];
      if (token === "-" && a.expr === "0") {pila.push({ expr: `-${b.expr}`, prio: 1 });continue;};let aExpr, bExpr;
      if (token === "^") {aExpr = a.prio < prio ? `(${a.expr})` : a.expr;bExpr = b.prio <= prio ? `(${b.expr})` : b.expr; } 
      else {aExpr = a.prio < prio ? `(${a.expr})` : a.expr; const necesitaParensDerecha =b.prio < prio || ((token === "-" || token === "/") && b.prio === prio);
        bExpr = necesitaParensDerecha ? `(${b.expr})` : b.expr;}
      pila.push({ expr: `${aExpr}${token}${bExpr}`, prio });} else {return [false, `Error: token no reconocido '${token}'`];}}
    if (pila.length !== 1) return [false,"Error: expresión incompleta"];
    return [true,salida,pila[0].expr,variables];}
  static expresionMatricial(expr) {const r = Validar.expresionAlgebraica(expr);return r;}
  static polinomio(expr){
    if(typeof ExpresionAlgebraica.notacionConProductos==="function"){expr=ExpresionAlgebraica.notacionConProductos(expr);}
    expr=String(expr??"").replace(/·/g,"*");
    const validos=/^[A-Za-z\u0391-\u03A9\u03B1-\u03C90-9+\-*/^()._\s]*$/; if(!validos.test(expr))return[false,"Caracteres no válidos"];
    const abrir=(expr.match(/\(/g)||[]).length; const cerrar=(expr.match(/\)/g)||[]).length; if(abrir!==cerrar)return[false,"Paréntesis no balanceados"];
    const tokenRegex=new RegExp([String.raw`\d+\.?\d*`,String.raw`[A-Za-z\u0391-\u03A9\u03B1-\u03C9_][A-Za-z\u0391-\u03A9\u03B1-\u03C90-9_]*`,String.raw`[+\-*/^()]`].join("|"),"g");
    const tokens=expr.match(tokenRegex); if(!tokens)return[false,"No se pudieron generar tokens"];
    const OPS="+-*/^",esIdent=t=>/^[A-Za-z\u0391-\u03A9\u03B1-\u03C9_][A-Za-z\u0391-\u03A9\u03B1-\u03C90-9_]*$/.test(t),esNumero=t=>/^\d+\.?\d*$/.test(t),esAbrirParen=t=>t==="(";
    for(let i=1;i<tokens.length;i++){if(OPS.includes(tokens[i])&&OPS.includes(tokens[i-1])){if(!((tokens[i]==="+"||tokens[i]==="-")&&tokens[i-1]==="("))
    return[false,"Operadores consecutivos no válidos"];}}
    for(let i=0;i<tokens.length;){if(tokens[i]==="+"&&(i===0||tokens[i-1]==="(")){const s=tokens[i+1]; if(!s)return[false,"Operador unario '+' sin operando"]; 
    if(esNumero(s)||esIdent(s)||esAbrirParen(s)){tokens.splice(i,1); continue;}else return[false,"Uso inválido de '+' unario"]} i++;}
    for(let i=0;i<tokens.length;i++){if(tokens[i]==="-"&&(i===0||tokens[i-1]==="(")){const s=tokens[i+1]; if(!s)return[false,"Operador unario '-' sin operando"]; 
    if(esNumero(s)||esIdent(s)||esAbrirParen(s))tokens.splice(i,2,"0","-",s); else return[false,"Uso inválido de '-' unario"];}}
    const salida=[],operadores=[],prec={"^":4,"*":3,"/":3,"+":2,"-":2},asoc={"^":"right","*":"left","/":"left","+":"left","-":"left"};
    for(const token of tokens){if(esNumero(token)||esIdent(token))salida.push(token); else if(token==="(")operadores.push(token); 
    else if(token===")"){while(operadores.length&&operadores.at(-1)!=="(")salida.push(operadores.pop()); if(!operadores.length||operadores.at(-1)!=="(")
    return[false,"Paréntesis desbalanceados"]; operadores.pop();} else if(OPS.includes(token)){while(operadores.length){const top=operadores.at(-1); 
    if(OPS.includes(top)&&((asoc[token]==="left"&&prec[token]<=prec[top])||(asoc[token]==="right"&&prec[token]<prec[top])))salida.push(operadores.pop()); else break;} 
    operadores.push(token);} else return[false,"Token inválido"];}
    while(operadores.length){if(operadores.at(-1)==="(")return[false,"Paréntesis desbalanceados"]; salida.push(operadores.pop());}
    const pilaRecon=[],prioridad={"+":1,"-":1,"*":2,"/":2,"^":3};
    for(const token of salida){if(esNumero(token)||esIdent(token))pilaRecon.push({expr:token,prio:4}); 
    else if(OPS.includes(token)){if(pilaRecon.length<2)return[false,"Expresión inválida al reconstruir"]; const b=pilaRecon.pop(),a=pilaRecon.pop(),prio=prioridad[token]; 
    if(token==="-"&&a.expr==="0"){pilaRecon.push({expr:`-${b.expr}`,prio:1}); continue;} 
    const aExpr=a.prio<prio?`(${a.expr})`:a.expr; const bExpr=token==="^"?(b.prio<=prio?`(${b.expr})`:b.expr):
             ((b.prio<prio||((token==="-"||token==="/")&&b.prio===prio))?`(${b.expr})`:b.expr); pilaRecon.push({expr:`${aExpr}${token}${bExpr}`,prio});} 
    else return[false,"Token inválido en reconstrucción"];}
    if(pilaRecon.length!==1)return[false,"Reconstrucción incompleta"];
    const infija=pilaRecon[0].expr,pilaPoly=[],esEnteroNoNegativo=s=>/^\d+$/.test(s);
    for(const token of salida){if(esNumero(token))pilaPoly.push({poly:true,numeric:true,literalNum:true,value:token}); 
    else if(esIdent(token))pilaPoly.push({poly:true,numeric:false,literalNum:false}); else if(OPS.includes(token)){if(pilaPoly.length<2)
    return[false,"Verificación inválida"]; const b=pilaPoly.pop(),a=pilaPoly.pop(); if(token==="+"||token==="-"){if(!(a.poly&&b.poly))
    return[false,"No es polinomio"]; pilaPoly.push({poly:true,numeric:a.numeric&&b.numeric,literalNum:false});} 
    else if(token==="*"){if(!(a.poly&&b.poly))return[false,"No es polinomio"]; pilaPoly.push({poly:true,numeric:a.numeric&&b.numeric,literalNum:false});} 
    else if(token==="/"){if(!b.numeric)return[false,"No es polinomio: división por expresión con variables"]; if(b.literalNum&&Number(b.value)===0)
    return[false,"No es polinomio: división por cero"]; pilaPoly.push({poly:a.poly,numeric:a.numeric&&b.numeric,literalNum:false});} 
    else if(token==="^"){if(!b.literalNum)return[false,"No es polinomio: el exponente debe ser un literal numérico"]; 
    if(!esEnteroNoNegativo(b.value))return[false,"No es polinomio: el exponente debe ser entero no negativo"]; 
    if(!a.poly)return[false,"No es polinomio: la base de la potencia no es polinomio"]; pilaPoly.push({poly:true,numeric:a.numeric&&true,literalNum:false});}} 
    else return[false,"Token inválido en verificación"];}
    if(pilaPoly.length!==1)return[false,"Verificación final incompleta"]; if(!pilaPoly[0].poly)return[false,"No es polinomio"];
    const normalizaEnteroStr=s=>/^\d+\.$/.test(s)?s.slice(0,-1):s,decimalAFraccionStr=s0=>{let s=normalizaEnteroStr(s0); if(/^\d+$/.test(s))return s; 
    if(/^\d+\.\d+$/.test(s))return fraccionContinua(s,long); return s;};
    const aFormaFrac=s=>{const f=decimalAFraccionStr(s); return f.includes("/")?f:`${f}/1`;},simplificarFrac=(p_s,q_s)=>{let p=Number(p_s),q=Number(q_s); 
    if(q<0){p=-p;q=-q;} const g=mcd(Math.abs(p),Math.abs(q))||1; p=p/g; q=q/g; return[String(p),String(q)];};
    const invertirFraccionStr=s0=>{let s=s0,sign=""; if(s.startsWith("-")){sign="-";s=s.slice(1);} let[n,d]=aFormaFrac(s).split("/"); 
    if(Number(n)===0)throw new Error("División por cero"); let[p,q]=simplificarFrac(d,n); if(sign==="-")p=String(-Number(p)); return`${p}/${q}`;};
    const esEnteroLiteral=t=>/^\d+$/.test(t),powPolinomio=(basePoly,e)=>{let r="1",b=basePoly,exp=e>>>0; 
    while(exp>0){if(exp&1)r=Polinomio.multiplicar(r,b); exp>>=1; if(exp>0)b=Polinomio.multiplicar(b,b);} return r;};
    const pilaEval=[]; for(const token of salida){if(esNumero(token))pilaEval.push(decimalAFraccionStr(token)); 
    else if(esIdent(token))pilaEval.push(token); else if(OPS.includes(token)){if(pilaEval.length<2)return[false,"RPN inválida en evaluación"]; 
    const b=pilaEval.pop(),a=pilaEval.pop(); if(token==="+")pilaEval.push(Polinomio.sumar(a,b)); else if(token==="-")pilaEval.push(Polinomio.restar(a,b)); 
    else if(token==="*")pilaEval.push(Polinomio.multiplicar(a,b)); else if(token==="/"){const[bn]=aFormaFrac(b).split("/"); if(Number(bn)===0)
    return[false,"No es polinomio: división por cero"]; const inv=invertirFraccionStr(b); pilaEval.push(Polinomio.multiplicar(a,inv));} 
    else if(token==="^"){if(!esEnteroLiteral(b))return[false,"Exponente no entero literal en evaluación"]; const e=Number(b); pilaEval.push(powPolinomio(a,e));} 
    else return[false,"Operador desconocido en evaluación"]} else return[false,"Token inválido en evaluación"];};if(pilaEval.length!==1)return[false,"Evaluación incompleta"];
    const polinomioSimple=pilaEval[0]; return[true,salida.join(" "),infija,polinomioSimple];}
}

class Crear {
static async matrices(lugar) { if (!(lugar instanceof HTMLElement)) { throw new Error("El parámetro 'lugar' debe ser un HTMLElement."); } 
    const clonarMatriz = (m) => m.map(f => [...f]); const nombrePorIndice = (idx) => { const A = "A".charCodeAt(0); let n = idx + 1, s = ""; 
    while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(A + r) + s; n = Math.floor((n - 1) / 26); } return s; }; 
    const pedirNumeroDeMatrices = async () => { lugar.textContent = ""; const panel = document.createElement("div"); panel.style.display = "flex"; 
        panel.style.flexDirection = "column"; panel.style.gap = "10px"; lugar.appendChild(panel); const titulo = document.createElement("div"); 
        titulo.textContent = "¿Cuántas matrices quieres crear?"; titulo.style.fontWeight = "bold"; panel.appendChild(titulo); const linea = document.createElement("div"); 
        linea.style.display = "flex"; linea.style.alignItems = "center"; linea.style.gap = "6px"; panel.appendChild(linea); const label = document.createElement("span"); 
        label.textContent = "Nº de matrices:"; const input = document.createElement("input"); input.type = "text"; input.style.width = "40px"; linea.appendChild(label); 
        linea.appendChild(input); setTimeout(() => input.focus(), 0); const cajaError = document.createElement("div"); lugar.appendChild(cajaError); 
        return await new Promise((ok) => { input.addEventListener("keydown", (e) => { if(e.key==="Enter"||e.key==="Tab") { e.preventDefault(); 
          try { const n = Validar.validarEntradaNumeroEnteroPositivo(input.value); ok(n); } 
          catch (err) { Representar.mostrarError(cajaError, "Entrada inválida: introduce un entero positivo."); input.select(); } } }); }); }; 
    const pedirNombres = async (numero) => { lugar.textContent = ""; const nombresPorDefecto = Array.from({ length: numero }, (_, i) => nombrePorIndice(i)); 
        let nombresElegidos = [...nombresPorDefecto]; const panel = document.createElement("div"); 
        panel.style.display = "flex"; panel.style.flexDirection = "column"; panel.style.gap = "10px"; lugar.appendChild(panel); 
        const titulo = document.createElement("div"); titulo.textContent = `Vas a crear ${numero} ${numero === 1 ? "matriz" : "matrices"}.`; titulo.style.fontWeight = "bold"; 
        panel.appendChild(titulo); const vistaNombres = document.createElement("div"); vistaNombres.textContent = `Nombres por defecto: ${nombresPorDefecto.join(", ")}`; 
        panel.appendChild(vistaNombres); const botones = document.createElement("div"); botones.style.display = "flex"; botones.style.gap = "10px"; panel.appendChild(botones); 
        const btnCambiar = document.createElement("button"); btnCambiar.textContent = "Cambiar nombres (opcional)"; const btnUsarDefecto = document.createElement("button"); 
        btnUsarDefecto.textContent = "Usar nombres por defecto"; botones.appendChild(btnCambiar); botones.appendChild(btnUsarDefecto); const formNombres = document.createElement("div"); 
        formNombres.style.display = "none"; formNombres.style.flexDirection = "column"; formNombres.style.gap = "6px"; panel.appendChild(formNombres); const inputs = []; 
        for (let i = 0; i < numero; i++) { const fila = document.createElement("div"); fila.style.display = "flex"; fila.style.alignItems = "center"; fila.style.gap = "8px"; 
          const label = document.createElement("span"); label.textContent = `Nombre ${i + 1}:`; const input = document.createElement("input"); 
          input.type = "text"; input.value = nombresPorDefecto[i]; input.maxLength = 12; inputs.push(input); fila.appendChild(label); fila.appendChild(input); 
          formNombres.appendChild(fila); } 
        const acciones = document.createElement("div"); acciones.style.display = "flex"; acciones.style.gap = "10px"; 
        acciones.style.marginTop = "6px"; formNombres.appendChild(acciones); const btnEmpezar = document.createElement("button"); btnEmpezar.textContent = "Empezar"; 
        const btnCancelar = document.createElement("button"); btnCancelar.textContent = "Cancelar cambios"; acciones.appendChild(btnEmpezar); acciones.appendChild(btnCancelar); 
        btnCambiar.addEventListener("click", () => { formNombres.style.display = "flex"; }); 
        btnCancelar.addEventListener("click", () => { formNombres.style.display = "none"; 
          inputs.forEach((inp, i) => (inp.value = nombresPorDefecto[i])); nombresElegidos = [...nombresPorDefecto]; }); 
        await new Promise((ok) => { btnUsarDefecto.onclick = () => { nombresElegidos = [...nombresPorDefecto]; ok(); }; 
          btnEmpezar.onclick = () => { const propuestos = inputs.map((inp) => inp.value.trim()); if (propuestos.some(n => n.length === 0)) { alert("Los nombres no pueden estar vacíos."); 
          return; } nombresElegidos = propuestos; ok(); }; }); return nombresElegidos; }; 
    const crearUnaMatriz = async (nombre) => { lugar.textContent = ""; 
      return await new Promise((resolve) => { let filas, columnas; const matrizCreada = []; const caj1 = document.createElement("div"); caj1.id = "caj1"; 
          caj1.style.display = "flex"; caj1.style.flexDirection = "column"; caj1.style.alignItems = "flex-start"; caj1.style.gap = "10px"; caj1.style.marginBottom = "10px"; 
          lugar.appendChild(caj1); const labelMatriz = document.createElement("div"); labelMatriz.textContent = `Matriz ${nombre}`; labelMatriz.style.textAlign = "center"; 
          labelMatriz.style.fontWeight = "bold"; caj1.appendChild(labelMatriz); const filaContainer = document.createElement("div"); 
          filaContainer.style.display = "flex"; filaContainer.style.alignItems = "center"; filaContainer.style.gap = "5px"; caj1.appendChild(filaContainer); 
          const labelFilas = document.createElement("span"); labelFilas.textContent = "Nº de filas:"; filaContainer.appendChild(labelFilas); 
          const inputFilas = document.createElement("input"); inputFilas.type = "text"; inputFilas.min = "1"; inputFilas.style.width = "30px"; filaContainer.appendChild(inputFilas); 
          inputFilas.focus(); const columnaContainer = document.createElement("div"); columnaContainer.style.display = "flex"; columnaContainer.style.alignItems = "center"; 
          columnaContainer.style.gap = "5px"; caj1.appendChild(columnaContainer); const labelColumnas = document.createElement("span"); labelColumnas.textContent = "Nº de columnas:"; 
          columnaContainer.appendChild(labelColumnas); const inputColumnas = document.createElement("input"); inputColumnas.type = "text"; inputColumnas.min = "1"; 
          inputColumnas.style.width = "30px"; columnaContainer.appendChild(inputColumnas); const cajaError = document.createElement("div"); lugar.appendChild(cajaError); 
          inputFilas.addEventListener("keydown", (e1) => { if(e1.key==="Enter"||e1.key==="Tab") { e1.preventDefault(); try { filas = Validar.validarEntradaNumeroEnteroPositivo(inputFilas.value); 
          inputColumnas.focus(); } catch { Representar.mostrarError(cajaError, "Entrada de filas inválida."); } } }); 
          inputColumnas.addEventListener("keydown", (e2) => { if(e2.key==="Enter"||e2.key==="Tab") { e2.preventDefault(); 
          try { columnas = Validar.validarEntradaNumeroEnteroPositivo(inputColumnas.value); inputColumnas.disabled = true; 
          const tabla = document.createElement("table"); tabla.style.borderCollapse = "collapse"; const contenedor = document.createElement("div"); 
          contenedor.style.display = "flex"; contenedor.style.alignItems = "center"; lugar.appendChild(contenedor); Representar.abrirParentesis(filas * 1.25, contenedor); 
          for (let i = 0; i < filas; i++) { const fila = document.createElement("tr"); const filaDatos = []; 
          for (let j = 0; j < columnas; j++) { const celda = document.createElement("td"); celda.style.border = "1px solid #ccc"; celda.style.padding = "2px"; 
          const input = document.createElement("input"); input.type = "text"; input.style.width = "40px"; filaDatos.push(null); 
          input.addEventListener("keydown", (ev) => { if(ev.key==="Enter"||ev.key==="Tab") { ev.preventDefault(); const filaIdx = input.parentNode.parentNode.rowIndex; 
          const colIdx = input.parentNode.cellIndex; try { Validar.expresionParentesisBalanceadosYCaracteresValidos(input.value); 
          matrizCreada[filaIdx][colIdx] = input.value; const idxPlano = filaIdx * columnas + colIdx; const total = filas * columnas; 
          if (idxPlano < total - 1) { const inputs = tabla.querySelectorAll("input"); inputs[idxPlano + 1].focus(); } 
          else { resolve(clonarMatriz(matrizCreada)); } } 
          catch (err) { const errores = { errorC: "Se ha introducido una expresión errónea.", errorB: "No has introducido nada.", 
                          errorA: "Los paréntesis no están balanceados." }; Representar.mostrarError(cajaError, errores[err.message] || "Error desconocido"); 
          input.value = ""; input.focus(); } } }); celda.appendChild(input); fila.appendChild(celda); } 
          matrizCreada.push(filaDatos); tabla.appendChild(fila); } 
          contenedor.appendChild(tabla); Representar.cerrarParentesis(filas * 1.25, contenedor); const first = tabla.querySelector("input"); if (first) first.focus(); 
          const botonReset = document.createElement("button"); botonReset.textContent = "RESET"; botonReset.style.marginTop = "10px"; lugar.appendChild(botonReset); 
          botonReset.addEventListener("click", () => { contenedor.remove(); botonReset.remove(); inputFilas.disabled = false; inputColumnas.disabled = false; inputFilas.focus(); 
          matrizCreada.length = 0; cajaError.textContent = ""; }); } catch { Representar.mostrarError(cajaError, "Entrada de columnas inválida."); } } }); }); }; 
    const numero = await pedirNumeroDeMatrices(); const nombres = await pedirNombres(numero); 
    matricesCreadas.length = matricesCreadas.length || 0; for (let i = 0; i < numero; i++) { const matriz = await crearUnaMatriz(nombres[i]); 
    matricesCreadas.push({ nombre: nombres[i], matriz }); if (i < numero - 1) lugar.textContent = ""; } lugar.textContent = ""; 
    const linea = document.createElement("div"); linea.style.display = "flex"; linea.style.flexWrap = "nowrap"; linea.style.alignItems = "center"; linea.style.gap = "16px"; 
    linea.style.overflowX = "auto"; lugar.appendChild(linea); const ultimas = matricesCreadas.slice(-numero); 
    ultimas.forEach(({ nombre, matriz }) => { const bloque = document.createElement("div"); bloque.style.display = "inline-flex"; 
        bloque.style.alignItems = "center"; const etiqueta = document.createElement("span"); etiqueta.textContent = `${nombre}=`; etiqueta.style.fontWeight = "bold"; 
        etiqueta.style.marginRight = "6px"; bloque.appendChild(etiqueta); const sublugar = document.createElement("span"); sublugar.style.display = "inline-block"; 
        bloque.appendChild(sublugar); Representar.matriz(matriz, sublugar); linea.appendChild(bloque); }); }
  static async unaMatriz(lugar){
    const clonarMatriz=m=>m.map(f=>[...f]);lugar.textContent="";
    return await new Promise(resolve=>{
      let filas,columnas,nombreActual="A",editando=false;const matrizCreada=[];
      const caj1=document.createElement("div");caj1.style.display="flex";caj1.style.flexDirection="column";caj1.style.gap="10px";lugar.appendChild(caj1);
      const nombreC=document.createElement("div");nombreC.style.display="flex";nombreC.style.alignItems="center";nombreC.style.gap="5px";caj1.appendChild(nombreC);
      const labelNombre=document.createElement("span");labelNombre.textContent="Nombre de la matriz:";nombreC.appendChild(labelNombre);
      const spanNombre=document.createElement("span");spanNombre.textContent=nombreActual;nombreC.appendChild(spanNombre);
      const btnCambiar=document.createElement("button");btnCambiar.textContent="Cambiar nombre";btnCambiar.style.marginLeft="36px";nombreC.appendChild(btnCambiar);
      const filaC=document.createElement("div");filaC.innerHTML=`Nº de filas: <input type="text" style="width:30px;">`;caj1.appendChild(filaC);
      const colC=document.createElement("div");colC.innerHTML=`Nº de columnas: <input type="text" style="width:30px;">`;caj1.appendChild(colC);
      const [inputFilas]=filaC.getElementsByTagName("input");const [inputCols]=colC.getElementsByTagName("input");
      const cajaError=document.createElement("div");lugar.appendChild(cajaError);inputFilas.focus();
      btnCambiar.addEventListener("click",()=>{if(!editando){
          const inputTemp=document.createElement("input");inputTemp.type="text";inputTemp.style.width="30px";inputTemp.value=nombreActual;
          nombreC.replaceChild(inputTemp,spanNombre);inputTemp.focus();btnCambiar.textContent="Aceptar";editando=true;
          const finalizar=()=>{if(!inputTemp.value.trim())return;nombreActual=inputTemp.value.trim();spanNombre.textContent=nombreActual;
          nombreC.replaceChild(spanNombre,inputTemp);btnCambiar.textContent="Cambiar nombre";btnCambiar.style.marginLeft="36px";editando=false};
          inputTemp.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();finalizar()}});btnCambiar.addEventListener("click",finalizar,{once:true});}});
      inputFilas.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();
          try{filas=Validar.validarEntradaNumeroEnteroPositivo(inputFilas.value);inputFilas.disabled=true;inputCols.focus()}
          catch{Representar.mostrarError(cajaError,"Entrada de filas inválida.")}}});
      inputCols.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();
          try{columnas=Validar.validarEntradaNumeroEnteroPositivo(inputCols.value);inputCols.disabled=true;
            const tabla=document.createElement("table");tabla.style.borderCollapse="collapse";
            const cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";lugar.appendChild(cont);
            Representar.abrirParentesis(filas*1.25,cont);
            for(let i=0;i<filas;i++){const tr=document.createElement("tr"),filaDatos=[];for(let j=0;j<columnas;j++){
                const td=document.createElement("td"),inp=document.createElement("input");td.style.border="1px solid #ccc";inp.style.width="40px";filaDatos.push(null);
                inp.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key==="Tab"){ev.preventDefault();const fi=inp.parentNode.parentNode.rowIndex,co=inp.parentNode.cellIndex;
                    try{Validar.expresionParentesisBalanceadosYCaracteresValidos(inp.value);
                      matrizCreada[fi][co]=inp.value;const inputs=tabla.querySelectorAll("input"),idx=fi*columnas+co;
                      if(idx<inputs.length-1)inputs[idx+1].focus();else resolve({nombre:nombreActual,matriz:clonarMatriz(matrizCreada)});}
                    catch(err){const e={errorC:"Expresión errónea",errorB:"Entrada vacía",errorA:"Paréntesis no balanceados"};
                      if(err?.message&&e[err.message])Representar.mostrarError(cajaError,e[err.message]);inp.value="";inp.focus();}}});
                td.appendChild(inp);tr.appendChild(td);};matrizCreada.push(filaDatos);tabla.appendChild(tr);}
            cont.appendChild(tabla);Representar.cerrarParentesis(filas*1.25,cont);tabla.querySelector("input")?.focus();}
          catch{Representar.mostrarError(cajaError,"Entrada de columnas inválida.")}}});});}
  static async unaMatrizNumerica(lugar){
      const clonarMatriz=m=>m.map(f=>[...f]),esNumeroCadena=v=>{v=(v??"").toString().trim();if(!v)throw new Error("errorB");
        v=v.replace(/\s+/g,"");if(/^[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?$/i.test(v)){const n=Number(v);if(!Number.isFinite(n))throw new Error("noNumero");return v;}
        const m=v.match(/^([-+]?\d+)\/(\d+)$/);if(m){const a=Number(m[1]),b=Number(m[2]);if(!Number.isFinite(a)||!Number.isFinite(b)||b===0)throw new Error("noNumero");return v;}
        throw new Error("noNumero");};lugar.textContent="";
      return await new Promise(resolve=>{
        let filas,columnas,nombreActual="A",editando=false;const matrizCreada=[];
        const caj1=document.createElement("div");caj1.style.display="flex";caj1.style.flexDirection="column";caj1.style.gap="10px";lugar.appendChild(caj1);
        const nombreC=document.createElement("div");nombreC.style.display="flex";nombreC.style.alignItems="center";nombreC.style.gap="5px";caj1.appendChild(nombreC);
        const labelNombre=document.createElement("span");labelNombre.textContent="Nombre de la matriz:";nombreC.appendChild(labelNombre);
        const spanNombre=document.createElement("span");spanNombre.textContent=nombreActual;nombreC.appendChild(spanNombre);
        const btnCambiar=document.createElement("button");btnCambiar.textContent="Cambiar nombre";btnCambiar.style.marginLeft="36px";nombreC.appendChild(btnCambiar);
        const filaC=document.createElement("div");filaC.innerHTML=`Nº de filas: <input type="text" style="width:30px;">`;caj1.appendChild(filaC);
        const colC=document.createElement("div");colC.innerHTML=`Nº de columnas: <input type="text" style="width:30px;">`;caj1.appendChild(colC);
        const [inputFilas]=filaC.getElementsByTagName("input"),[inputCols]=colC.getElementsByTagName("input");
        const cajaError=document.createElement("div");lugar.appendChild(cajaError);inputFilas.focus();
        btnCambiar.addEventListener("click",()=>{if(!editando){
          const inputTemp=document.createElement("input");inputTemp.type="text";inputTemp.style.width="30px";inputTemp.value=nombreActual;
          nombreC.replaceChild(inputTemp,spanNombre);inputTemp.focus();btnCambiar.textContent="Aceptar";editando=true;
          const finalizar=()=>{if(!inputTemp.value.trim())return;nombreActual=inputTemp.value.trim();spanNombre.textContent=nombreActual;
            nombreC.replaceChild(spanNombre,inputTemp);btnCambiar.textContent="Cambiar nombre";btnCambiar.style.marginLeft="36px";editando=false;};
          inputTemp.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();finalizar()};});btnCambiar.addEventListener("click",finalizar,{once:true});}});
        inputFilas.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();
          try{filas=Validar.validarEntradaNumeroEnteroPositivo(inputFilas.value);inputFilas.disabled=true;inputCols.focus();}
          catch{Representar.mostrarError(cajaError,"Entrada de filas inválida.");}}});
        inputCols.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key==="Tab"){e.preventDefault();
          try{columnas=Validar.validarEntradaNumeroEnteroPositivo(inputCols.value);inputCols.disabled=true;
            const tabla=document.createElement("table");tabla.style.borderCollapse="collapse";
            const cont=document.createElement("div");cont.style.display="flex";cont.style.alignItems="center";lugar.appendChild(cont);
            Representar.abrirParentesis(filas*1.25,cont);
            for(let i=0;i<filas;i++){const tr=document.createElement("tr"),filaDatos=[];
              for(let j=0;j<columnas;j++){const td=document.createElement("td"),inp=document.createElement("input");
                td.style.border="1px solid #ccc";inp.style.width="40px";filaDatos.push(null);
                inp.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key==="Tab"){ev.preventDefault();const fi=inp.parentNode.parentNode.rowIndex,co=inp.parentNode.cellIndex;
                  try{const val=esNumeroCadena(inp.value);matrizCreada[fi][co]=val;
                    const inputs=tabla.querySelectorAll("input"),idx=fi*columnas+co;
                    if(idx<inputs.length-1)inputs[idx+1].focus();else resolve({nombre:nombreActual,matriz:clonarMatriz(matrizCreada)});
                  }catch(err){const e={errorB:"Entrada vacía",noNumero:"Solo se admiten números (enteros, decimales o fracciones a/b)."};
                    if(err?.message&&e[err.message])Representar.mostrarError(cajaError,e[err.message]);else Representar.mostrarError(cajaError,"Entrada inválida.");
                    inp.value="";inp.focus();}}});
                td.appendChild(inp);tr.appendChild(td);}
              matrizCreada.push(filaDatos);tabla.appendChild(tr);}
            cont.appendChild(tabla);Representar.cerrarParentesis(filas*1.25,cont);tabla.querySelector("input")?.focus();}
            catch{Representar.mostrarError(cajaError,"Entrada de columnas inválida.");}}});});}
}


class ExpresionMatricial {
  static esValida(exp){let r=Validar.expresionMatricial(exp)[0];return r}
  static obtenerVariables(exp){if(!this.esValida(exp)){return[]};let expresionProcesada=ExpresionAlgebraica.notacionConProductos(exp);
    const tokens=expresionProcesada.match(/(\d+\.?\d*|[a-zA-Z\u0391-\u03A9\u03B1-\u03C9]+|[+\-*/^()])/g);if(!tokens){return[]}
    const modificadoresNoVariables=['t','T'];const variablesEncontradas=tokens.filter(token=>/^[a-zA-Z\u0391-\u03A9\u03B1-\u03C9]+$/.test(token)
      &&!modificadoresNoVariables.includes(token));const varsUnicas=new Set(variablesEncontradas);return[...varsUnicas].sort()}
  static infijaAPostfija(exp){let r=Validar.expresionMatricial(exp)[1];return r}
  static postfijaAInfija(array){let r=ExpresionAlgebraica.postfijaAInfija(array);return r}
  static sinProductosNiParentesisInnecesarios(exp){let resultado=Validar.expresionMatricial(exp)[2];
    resultado=ExpresionAlgebraica.eliminarParentesisInnecesarios(resultado);resultado=ExpresionAlgebraica.notacionSinProductos(resultado);return resultado}
  static calcular(exp,matr){
    let nomMatrices=matr.map(obj=>obj.nombre);let expPostfija=ExpresionMatricial.infijaAPostfija(exp);
    while(expPostfija.length!==1){nomMatrices=matr.map(obj=>obj.nombre);
      for(let i=0;i<expPostfija.length;i++){
        if(expPostfija[i]==="+"){
          if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="I"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
            let ress=Matriz.sumar(mat1,Matriz.identidad(mat1.length));let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
            matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-1])&&expPostfija[i-2]==="I"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
            let ress=Matriz.sumar(Matriz.identidad(mat1.length),mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
            matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-2])&&nomMatrices.includes(expPostfija[i-1])){
            let mat1=[];let mat2=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}
              if(matr[j].nombre===expPostfija[i-1]){mat2=matr[j].matriz}}
            let ress=Matriz.sumar(mat1,mat2);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
            let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")+("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}}
        if(expPostfija[i]==="-"){
          if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="I"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
            let ress=Matriz.restar(mat1,Matriz.identidad(mat1.length));let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
            matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-1])&&expPostfija[i-2]==="I"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
            let ress=Matriz.restar(Matriz.identidad(mat1.length),mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
            matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-2])&&nomMatrices.includes(expPostfija[i-1])){
            let matA=[];let matB=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){matA=matr[j].matriz}
              if(matr[j].nombre===expPostfija[i-1]){matB=matr[j].matriz}}
            let ress=Matriz.restar(matA,matB);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(expPostfija[i-2]==="0"&&nomMatrices.includes(expPostfija[i-1])){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
            let ress=Matriz.opuesta(mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-3])&&expPostfija[i-2]==="0"&&expPostfija[i-1]==="1"&&expPostfija[i+1]==="^"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-3]){mat1=matr[j].matriz}}
            let ress=Matriz.inversa(mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i+1]=ressObj.nombre;expPostfija.splice(i-3,4);break}
          if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
            let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")-("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}}
        if(expPostfija[i]==="*"){
          if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="I"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
            let ress=mat1;let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-1])&&expPostfija[i-2]==="I"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
            let ress=mat1;let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-2])&&nomMatrices.includes(expPostfija[i-1])){
            let mat1=[];let mat2=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}
              if(matr[j].nombre===expPostfija[i-1]){mat2=matr[j].matriz}}
            let ress=Matriz.multiplicar(mat1,mat2);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
            let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-1])&&!nomMatrices.includes(expPostfija[i-2])){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
            let ress=Matriz.multiplicarEscalar(expPostfija[i-2],mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
            matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(!nomMatrices.includes(expPostfija[i-1])&&nomMatrices.includes(expPostfija[i-2])){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
            let ress=Matriz.multiplicarEscalar(expPostfija[i-1],mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
            matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}}
        if(expPostfija[i]==="/"){
          if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
            let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")/("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}}
        if(expPostfija[i]==="^"){
          if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="t"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
            let ress=Matriz.trasponer(mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
            expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}
          if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]!=="t"){
            let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
            let ress=Matriz.potencia(mat1,expPostfija[i-1]);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
            matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);break}}}}
    for(let i=0;i<matr.length;i++){if(matr[i].nombre===expPostfija[0]){return matr[i].matriz}}}
  static calcularUnPaso(exp,matr){let nomMatrices=matr.map(obj=>obj.nombre);let expPostfija=ExpresionMatricial.infijaAPostfija(exp);
    while(expPostfija.length!==1){for(let i=0;i<expPostfija.length;i++){
      if(expPostfija[i]==="+"){
        if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="I"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
          let ress=Matriz.sumar(mat1,Matriz.identidad(mat1.length));let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
          matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-1])&&expPostfija[i-2]==="I"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
          let ress=Matriz.sumar(Matriz.identidad(mat1.length),mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
          matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-2])&&nomMatrices.includes(expPostfija[i-1])){
          let mat1=[];let mat2=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}
            if(matr[j].nombre===expPostfija[i-1]){mat2=matr[j].matriz}}
          let ress=Matriz.sumar(mat1,mat2);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
          let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")+("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}}
      if(expPostfija[i]==="-"){
        if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="I"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
          let ress=Matriz.restar(mat1,Matriz.identidad(mat1.length));let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
          matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-1])&&expPostfija[i-2]==="I"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
          let ress=Matriz.restar(Matriz.identidad(mat1.length),mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
          matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-2])&&nomMatrices.includes(expPostfija[i-1])){
          let matA=[];let matB=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){matA=matr[j].matriz}
            if(matr[j].nombre===expPostfija[i-1]){matB=matr[j].matriz}}
          let ress=Matriz.restar(matA,matB);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(expPostfija[i-2]==="0"&&nomMatrices.includes(expPostfija[i-1])){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
          let ress=Matriz.opuesta(mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-3])&&expPostfija[i-2]==="0"&&expPostfija[i-1]==="1"&&expPostfija[i+1]==="^"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-3]){mat1=matr[j].matriz}}
          let ress=Matriz.inversa(mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i+1]=ressObj.nombre;expPostfija.splice(i-3,4);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
          let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")-("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}}
      if(expPostfija[i]==="*"){
        if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="I"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
          let ress=mat1;let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-1])&&expPostfija[i-2]==="I"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
          let ress=mat1;let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-2])&&nomMatrices.includes(expPostfija[i-1])){
          let mat1=[];let mat2=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}
            if(matr[j].nombre===expPostfija[i-1]){mat2=matr[j].matriz}}
          let ress=Matriz.multiplicar(mat1,mat2);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
          let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}
        if(nomMatrices.includes(expPostfija[i-1])&&!nomMatrices.includes(expPostfija[i-2])){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-1]){mat1=matr[j].matriz}}
          let ress=Matriz.multiplicarEscalar(expPostfija[i-2],mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
          matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(!nomMatrices.includes(expPostfija[i-1])&&nomMatrices.includes(expPostfija[i-2])){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
          let ress=Matriz.multiplicarEscalar(expPostfija[i-1],mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
          matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}}
      if(expPostfija[i]==="/"){
        if(!nomMatrices.includes(expPostfija[i-2])&&!nomMatrices.includes(expPostfija[i-1])){
          let ress=ExpresionAlgebraica.simplificar("("+expPostfija[i-2]+")/("+expPostfija[i-1]+")");expPostfija[i]=ress;expPostfija.splice(i-2,2);break}}
      if(expPostfija[i]==="^"){
        if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]==="t"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
          let ress=Matriz.trasponer(mat1);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};matr.push(ressObj);control++;
          expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}
        if(nomMatrices.includes(expPostfija[i-2])&&expPostfija[i-1]!=="t"){
          let mat1=[];for(let j=0;j<matr.length;j++){if(matr[j].nombre===expPostfija[i-2]){mat1=matr[j].matriz}}
          let ress=Matriz.potencia(mat1,expPostfija[i-1]);let ressObj={nombre:"\u0393"+"_"+control,matriz:ress};
          matr.push(ressObj);control++;expPostfija[i]=ressObj.nombre;expPostfija.splice(i-2,2);return ExpresionMatricial.postfijaAInfija(expPostfija)}}}}
    return ExpresionMatricial.postfijaAInfija(expPostfija)}
  static notacionConProductos(cad){return ExpresionAlgebraica.notacionConProductos(cad)}
  static sustituirIdentidades(expr,matrices){
    expr=ExpresionMatricial.notacionConProductos(expr);const dims={};for(const{nombre,matriz}of matrices){
      if(!Array.isArray(matriz)||!Array.isArray(matriz[0]))throw new Error(`La propiedad "matriz" de ${nombre} debe ser un array de arrays.`);
      dims[nombre]=[matriz.length,matriz[0].length]}
    const pf=ExpresionMatricial.infijaAPostfija(expr);if(!Array.isArray(pf)||pf.length===0)throw new Error(`Expresión inválida: ${expr}`);
    const RE_N=/^[A-Z](?:_\d+)?$/,esNum=t=>!isNaN(+t);
    const pila=[];const eq=(A,B)=>A.filas===B.filas&&A.columnas===B.columnas,cuad=M=>M.filas===M.columnas,toS=x=>{if(!x||x.tipo!=='E')
      throw new Error(`Se esperaba escalar y llegó ${x?.tipo??'∅'}.`);return x.valor},pushS=n=>pila.push({tipo:'E',valor:n});
    const textISizes=[];const bindI=(o,n)=>{if(o.filas==null){o.filas=n;o.columnas=n;if(o.text){const t=textISizes[o.tid];
      if(t!=null&&t!==n)throw new Error(`La misma identidad aparece con tamaños incompatibles (${t} y ${n}). Especifícala como I_${t} o I_${n}.`);
      textISizes[o.tid]=n}}else if(o.filas!==n)throw new Error(`La misma identidad aparece con tamaños incompatibles (${o.filas} y ${n}).`)};
    for(const t of pf){if(RE_N.test(t)){
        if(t==='I'){const tid=textISizes.length;textISizes.push(undefined);pila.push({tipo:'I',text:true,tid,filas:null,columnas:null})}
        else{const d=dims[t];if(!d)throw new Error(`No se han proporcionado dimensiones para la matriz ${t}.`);
          pila.push({tipo:'M',nombre:t,filas:d[0],columnas:d[1]})};continue}
      if(esNum(t)){pushS(+t);continue};if(t==='t'){pila.push({tipo:'T'});continue}
      if(t==='+'||t==='-'||t==='*'){const B=pila.pop(),A=pila.pop();if(!A||!B)throw new Error(`Expresión inválida cerca de '${t}'.`);
        if(A.tipo==='E'&&B.tipo==='E'){pushS(t==='+'?toS(A)+toS(B):t==='-'?toS(A)-toS(B):toS(A)*toS(B));continue}
        if(t==='*'){if(A.tipo==='E'&&(B.tipo==='M'||B.tipo==='I')){
            pila.push(B.tipo==='I'?{tipo:'I',text:B.text,tid:B.tid,filas:B.filas,columnas:B.columnas}:{tipo:'M',filas:B.filas,columnas:B.columnas});continue}
          if((A.tipo==='M'||A.tipo==='I')&&B.tipo==='E'){
            pila.push(A.tipo==='I'?{tipo:'I',text:A.text,tid:A.tid,filas:A.filas,columnas:A.columnas}:{tipo:'M',filas:A.filas,columnas:A.columnas});continue}
          let A_=A,B_=B;
          if(A_.tipo==='I'&&A_.filas==null&&(B_.tipo==='M'||B_.tipo==='I')&&B_.filas!=null)bindI(A_,B_.filas);
          if(B_.tipo==='I'&&B_.filas==null&&(A_.tipo==='M'||A_.tipo==='I')&&A_.columnas!=null)bindI(B_,A_.columnas);
          if(A_.tipo==='I'&&(B_.tipo==='M'||B_.tipo==='I')){
            if(A_.filas==null)throw new Error(`No se puede determinar el tamaño de I en 'I * ?'.`);
            if(B_.tipo==='M'&&A_.columnas!==B_.filas)throw new Error(`Dimensiones no conformes en I*${B_.nombre??'M'}: 
                 (${A_.filas}×${A_.columnas})·(${B_.filas}×${B_.columnas}).`);
            pila.push({tipo:'M',filas:B_.filas,columnas:B_.columnas});continue}
          if((A_.tipo==='M'||A_.tipo==='I')&&B_.tipo==='I'){
            if(B_.filas==null)throw new Error(`No se puede determinar el tamaño de I en '? * I'.`);
            if(A_.tipo==='M'&&A_.columnas!==B_.filas)throw new Error(`Dimensiones no conformes en ${A_.nombre??'M'}*I: 
              (${A_.filas}×${A_.columnas})·(${B_.filas}×${B_.columnas}).`);
            pila.push(A_.tipo==='M'?{tipo:'M',filas:A_.filas,columnas:A_.columnas}:{tipo:'M',filas:B_.filas,columnas:B_.columnas});continue}
          if(A_.tipo==='M'&&B_.tipo==='M'){
            if(A_.columnas!==B_.filas)throw new Error(`Dimensiones no conformes en producto: (${A_.filas}×${A_.columnas})·(${B_.filas}×${B_.columnas}).`);
            pila.push({tipo:'M',filas:A_.filas,columnas:B_.columnas});continue}
          throw new Error(`Producto no soportado entre tipos ${A.tipo} y ${B.tipo}.`)}
        if(t==='+'||t==='-'){let A2=A,B2=B;
          if(A2.tipo==='E'&&(B2.tipo==='M'||B2.tipo==='I')){
            if(B2.filas==null)throw new Error(`No se puede determinar el tamaño de I para sumar escalar con identidad desconocida.`);
            A2={tipo:'I',text:false,filas:B2.filas,columnas:B2.columnas}}
          if(B2.tipo==='E'&&(A2.tipo==='M'||A2.tipo==='I')){
            if(A2.filas==null)throw new Error(`No se puede determinar el tamaño de I para sumar escalar con identidad desconocida.`);
            B2={tipo:'I',text:false,filas:A2.filas,columnas:A2.columnas}}
          if(A2.tipo==='I'&&A2.filas==null&&(B2.tipo==='M'||B2.tipo==='I')&&B2.filas!=null)bindI(A2,B2.filas);
          if(B2.tipo==='I'&&B2.filas==null&&(A2.tipo==='M'||A2.tipo==='I')&&A2.filas!=null)bindI(B2,A2.filas);
          if(A2.tipo==='M'&&B2.tipo==='I'&&B2.filas==null)bindI(B2,A2.filas);
          if(B2.tipo==='M'&&A2.tipo==='I'&&A2.filas==null)bindI(A2,B2.filas);
          const dA=A2.tipo==='M'||A2.tipo==='I',dB=B2.tipo==='M'||B2.tipo==='I';if(!(dA&&dB))
            throw new Error(`Suma/resta no soportada entre tipos ${A.tipo} y ${B.tipo}.`);
          if(!eq(A2,B2))throw new Error(`Dimensiones incompatibles en suma/resta: (${A2.filas}×${A2.columnas}) y (${B2.filas}×${B2.columnas}).`);
          pila.push({tipo:'M',filas:A2.filas,columnas:A2.columnas});continue}}
      if(t==="/"){
        const B=pila.pop(),A=pila.pop();if(!A||!B)throw new Error(`Expresión inválida cerca de '/'.`);
        if(A.tipo==='E'&&B.tipo==='E'){pushS(toS(A)/toS(B));continue}
        throw new Error(`División no soportada entre tipos ${A.tipo} y ${B.tipo}.`)}
      if(t==='^'){
        const e=pila.pop(),b=pila.pop();if(!b||!e)throw new Error(`Potencia '^' sin suficientes operandos.`);
        if(e.tipo==='T'){
          if(b.tipo==='E')pila.push({tipo:'E',valor:b.valor});
          else if(b.tipo==='I')pila.push({tipo:'I',text:b.text,tid:b.tid,filas:b.filas,columnas:b.columnas});
          else pila.push({tipo:'M',filas:b.columnas,columnas:b.filas});continue}
        if(e.tipo!=='E')throw new Error(`Exponente no válido para potencia: tipo ${e.tipo}.`);
        const k=Number(toS(e));if(!Number.isInteger(k))throw new Error(`Solo se permiten exponentes enteros (o 't').`);
        if(b.tipo==='E'){pila.push({tipo:'E',valor:b.valor})}
        else{
          if(b.filas==null||b.columnas==null)throw new Error(`No se puede elevar: tamaño de la identidad aún no determinado.`);
          if(k===0){
            if(!cuad(b))throw new Error(`No se puede elevar a 0 una matriz no cuadrada${b.nombre?`: ${b.nombre}`:''}.`);
            pila.push({tipo:'I',text:false,filas:b.filas,columnas:b.columnas})}
          else{
            if(!cuad(b))throw new Error(`No se puede elevar matriz no cuadrada${b.nombre?`: ${b.nombre}`:''}.`);
            pila.push({tipo:'M',filas:b.filas,columnas:b.columnas})}}
        continue}
      throw new Error(`Token postfijo no reconocido: ${t}`)}
    if(pila.length!==1)throw new Error(`Expresión inválida: quedaron ${pila.length} elementos en la pila.`);
    const reI=/I(?!_\d+)/g;if(!reI.test(expr))return expr;reI.lastIndex=0;
    let idx=0;return expr.replace(reI,()=>{const n=textISizes[idx++];return n==null?'I':`I_${n}`})}
}
