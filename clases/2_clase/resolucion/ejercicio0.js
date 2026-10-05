// Ejercicio 0 — Predecir el Event Loop
//
// Predicción (antes de correr):
// A, D, F, C, E, B
//
// Por qué:
// 1. "A"      -> síncrono, se imprime al toque.
// 2. setTimeout(..., 0) NO se ejecuta ahora: se delega a las Node APIs y su callback
//    recién se encola en la Macrotask Queue cuando el timer cumple (aunque sea 0ms).
// 3. Promise.resolve().then(...) tampoco corre ahora: su callback se encola en la
//    Microtask Queue, pendiente de que el Call Stack quede vacío.
// 4. saludar() se llama de forma síncrona: como CUALQUIER función, al invocarla arranca
//    a ejecutarse inmediatamente -> imprime "D" ahí mismo, antes de seguir con la línea
//    de abajo. Recién al llegar a "await null" la función se "pausa": el resto
//    (desde "console.log('E')" en adelante) se encola como microtask, y el control
//    vuelve al código que llamó a saludar().
// 5. "F"      -> síncrono, se imprime (después de "D", porque saludar() ya devolvió
//    el control acá antes de que arranque el Event Loop).
// En este punto el Call Stack quedó vacío. El Event Loop vacía PRIMERO toda la
// Microtask Queue, en el orden en que se encoló cada una: el .then de la promesa
// ("C", encolado en el paso 3) y luego la continuación de saludar() ("E", encolado
// en el paso 4). Recién después saca UNA tarea de la Macrotask Queue: el callback
// del setTimeout ("B").

console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

async function saludar() {
  console.log("D");
  await null;
  console.log("E");
}
saludar();

console.log("F");

// Resultado real: A, D, F, C, E, B
