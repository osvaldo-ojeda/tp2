// Diferencias ESM vs CommonJS: 1) Se usa 'import ... from' y 'export' en vez de 'require()' y 'module.exports'; 2) Es obligatorio incluir la extensión '.js' en la ruta de importación ('./matematica.js'); 3) Requiere `"type": "module"` en package.json.

import { sumar, promedio } from "./matematica.js";

console.log("=== PRUEBA DE ES MODULES (MODULOS-DEMO) ===");
console.log(`Suma de 15 y 27: ${sumar(15, 27)}`);
console.log(`Promedio de [10, 20, 30, 40]: ${promedio([10, 20, 30, 40])}`);
console.log(`Promedio de [8, 9, 7]: ${promedio([8, 9, 7]).toFixed(2)}`);
