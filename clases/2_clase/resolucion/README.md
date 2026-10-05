# Resolución — Clase 2

Requiere Node 18+ (usa `fetch` global, sin dependencias externas — `npm init -y` si hace falta un `package.json`, pero no hay nada que instalar).

| Ejercicio | Archivo | Cómo correrlo |
|---|---|---|
| 0 — Predecir el Event Loop | `ejercicio0.js` | `node ejercicio0.js` |
| 1.1 — callback | `asincronismo/callback.js` | `node asincronismo/callback.js` |
| 1.2 — promesa | `asincronismo/promesa.js` | `node asincronismo/promesa.js` |
| 1.3 — async/await | `asincronismo/asyncawait.js` | `node asincronismo/asyncawait.js` |
| 2 — Open Library | `asincronismo/openLibrary.js` | `node asincronismo/openLibrary.js` (necesita internet) |
| 3 — secuencial vs paralelo | `asincronismo/secuencialVsParalelo.js` | `node asincronismo/secuencialVsParalelo.js` (necesita internet) |

`data/libros.js` es el mismo array armado en la Clase 1 (Ejercicio 3), reutilizado acá para que el Ejercicio 1 tenga algo sobre qué buscar.

Nota sobre el Ejercicio 3: la consigna sugiere el ISBN `9780393312838` como quinto libro, pero Open Library lo devuelve como 404 al día de hoy (los datos de esa API cambian). Se reemplazó por otro ISBN real — si a alguien le vuelve a fallar un ISBN, no es un bug del código, es la API externa.
