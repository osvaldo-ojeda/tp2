
# Clase 1 — Consigna de práctica

## Ejercicio 1 — Setup

1. Verificar que `node -v` y `npm -v` andan. Si no, instalar Node LTS.
2. Crear una carpeta `biblioteca-api/` (va a ser el proyecto que crece toda la cursada).
3. Adentro, correr `npm init -y`.
4. Crear `index.js` con un `console.log` de saludo. Correrlo con `node index.js`.
5. Instalar `nodemon` como dependencia de desarrollo y agregar un script `dev` en el `package.json` que lo use. Confirmar que al guardar cambios en `index.js`, el proceso se reinicia solo.

## Ejercicio 2 — Repaso de sintaxis moderna

Resolver en `ejercicio2.js`, cada punto es una función chiquita:

1. `formatearLibro(libro)`: recibe un objeto `{ titulo, autor }` y devuelve el string `"<titulo> de <autor>"` usando template literals y destructuring en los parámetros.
2. `titulos(libros)`: recibe un array de libros y devuelve solo los títulos, usando `map`.
3. `conStock(libros)`: recibe un array de libros y devuelve solo los que tienen `stock > 0`, usando `filter`.
4. `totalEjemplares(libros)`: suma el `stock` de todos los libros, usando `reduce`.
5. `actualizarStock(libro, nuevoStock)`: devuelve un **nuevo** objeto libro con el stock actualizado, sin mutar el original (usando spread).
6. Crear un objeto `libro` con un campo anidado, ej: `ubicacion: { estanteria: "A", fila: 3 }`. Hacer una copia con spread y modificar `copia.ubicacion.fila` — comprobar con un `console.log` que el original también cambió. Después repetir usando `structuredClone` y comprobar que esta vez el original queda intacto.

Probar cada función con un array de prueba de 3-4 libros inventados.

## Ejercicio 3 — Semilla del proyecto integrador

Esto no es un ejercicio "de examen", es el arranque del proyecto que vamos a ir haciendo crecer clase a clase.

1. Crear `data/libros.js` que exporte (por ahora con `module.exports`) un array de al menos 5 libros hardcodeados, cada uno con: `id`, `isbn`, `titulo`, `autor`, `stock`, `fechaAlta`.
2. Crear `libroService.js` (sin Express todavía, esto es solo funciones) con:
   - `listarLibros()`: devuelve todos los libros.
   - `buscarPorId(id)`: devuelve un libro o `undefined`.
   - `buscarPorAutor(autor)`: devuelve los libros de ese autor (case-insensitive).
   - `contarConStock()`: devuelve cuántos libros tienen `stock > 0`.
3. Desde `index.js`, importar `libroService.js` y probar las 4 funciones con `console.log`.

**Guardar esta carpeta** — la clase 3 vamos a volver a `data/libros.js` para practicar lectura/escritura de archivos, y a partir de la clase 4 este mismo dominio pasa a vivir detrás de una API con Express.

## Entregable

Carpeta `biblioteca-api/` con: `package.json`, `index.js`, `ejercicio2.js`, `data/libros.js`, `libroService.js`, todo corriendo sin errores.
