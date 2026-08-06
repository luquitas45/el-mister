/**
 * Crea un generador de números aleatorios determinista (mulberry32).
 * @param {number} seed - Semilla inicial (entero de 32 bits)
 * @returns {() => number} Función que devuelve floats entre 0 y 1
 */

 export function createRNG(seed) {
 	let state = seed;
 	return function () {
 		state = (state * 1664525 + 1013904223) | 0;
 		return state;
 	}
 }
