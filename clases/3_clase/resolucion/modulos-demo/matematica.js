/**
 * Suma dos números.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function sumar(a, b) {
  return a + b;
}

/**
 * Calcula el promedio de un array de números.
 * @param {number[]} numeros
 * @returns {number}
 */
export function promedio(numeros) {
  if (!Array.isArray(numeros) || numeros.length === 0) {
    return 0;
  }
  const sumaTotal = numeros.reduce((acc, num) => sumar(acc, num), 0);
  return sumaTotal / numeros.length;
}
