# Clase 2 — Consigna de práctica

Seguimos en la carpeta `biblioteca-api/` de la clase 1.

## Ejercicio 0 — Predecir el Event Loop

Antes de correrlo: escribir en un comentario, línea por línea, en qué orden creés que se van a imprimir estos `console.log`. Después correrlo y comparar.

```js
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
```

Pista: `await null` también encola su continuación en la microtask queue, igual que un `.then`. Si no coincide tu predicción con el resultado real, anotar por qué no — es la parte más importante del ejercicio.

## Ejercicio 1 — Simular una "base de datos" asíncrona (las tres formas)

En la vida real, consultar una base de datos toma tiempo. Vamos a simularlo con `setTimeout` y reescribir la misma operación de tres formas, para sentir la evolución.

1. Crear `asincronismo/callback.js`. Escribir una función `buscarLibroPorId(id, callback)` que, después de un `setTimeout` de 500ms, busque el libro en el array de `data/libros.js` (de la clase 1) y llame a `callback(error, libro)` — `error` si no lo encuentra, o el libro si lo encuentra. Probarla llamándola con un `console.log` adentro del callback.
2. Crear `asincronismo/promesa.js`. Reescribir la misma función pero devolviendo una `Promise` (usando `new Promise((resolve, reject) => {...})`) en vez de recibir un callback. Consumirla con `.then().catch()`.
3. Crear `asincronismo/asyncawait.js`. Reescribir la función para que sea `async` (puede envolver la misma promesa del punto 2, o usar directamente `await` si la lógica lo permite). Consumirla con `async/await` + `try/catch`.

Al final deberías tener la misma funcionalidad resuelta de 3 formas — comparen cuál código es más fácil de leer.

## Ejercicio 2 — Consumir una API externa

Vamos a usar la API pública de [Open Library](https://openlibrary.org/dev/docs/api/books) (no requiere API key). Endpoint: `https://openlibrary.org/isbn/{ISBN}.json`.

1. Crear `asincronismo/openLibrary.js` con una función `async obtenerLibroPorIsbn(isbn)` que haga `fetch` al endpoint, valide `response.ok`, y devuelva `{ titulo: data.title, cantidadPaginas: data.number_of_pages }`. Si el ISBN no existe, debe lanzar un error descriptivo (no dejar que explote sin mensaje).
2. Probarla con al menos un ISBN real (ej: `"9780307474728"`) y un ISBN inventado que no exista, envolviendo la llamada en `try/catch` y logueando el resultado o el error según corresponda.

## Ejercicio 3 — Secuencial vs paralelo

1. Armar un array con 5 ISBNs reales (buscalos en Open Library o usá estos: `9780307474728`, `9780345391803`, `9780140449136`, `9780061120084`, `9780393312838`).
2. Escribir una función que los busque **secuencialmente** (un `await` adentro de un `for...of`), midiendo el tiempo total con `console.time` / `console.timeEnd`.
3. Escribir otra función que los busque **en paralelo** con `Promise.all`, midiendo el tiempo de la misma forma.
4. Comparar los tiempos y anotar la conclusión en un comentario: ¿por qué una es más rápida que la otra? ¿En qué caso NO convendría usar `Promise.all`?

## Entregable

Carpeta `asincronismo/` con los 5 archivos (`callback.js`, `promesa.js`, `asyncawait.js`, `openLibrary.js`, y el del ejercicio 3), todos corriendo sin errores sin dejar promesas sin atrapar.
