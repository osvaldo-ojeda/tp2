# Resolución — Clase 3

Solución completa para las consignas de la Clase 3 del Taller de Programación 2.

## Estructura de Resoluciones

| Ejercicio | Ubicación | Descripción | Comando para ejecutar |
|---|---|---|---|
| **Ejercicio 1** | `biblioteca-api/` | Refactor a `fs/promises` y archivo `data/libros.json` con persistencia. | `node biblioteca-api/index.js` |
| **Ejercicio 2** | `modulos-demo/` | Demostración de ES Modules (`import`/`export`) con `"type": "module"`. | `node modulos-demo/main.js` |
| **Ejercicio 3** | `servidor-http/` | Servidor HTTP nativo de Node.js con rutas `GET /`, `GET /libros` y desafío `POST /eco`. | `node servidor-http/index.js` |

## Detalles de implementación

### Ejercicio 1 — Persistencia en JSON (`biblioteca-api/`)
- `data/libros.json`: Array JSON con 5 libros iniciales.
- `libroService.js`:
  - `listarLibros()`: Lee y convierte el archivo a objeto JS.
  - `buscarPorId(id)`, `buscarPorAutor(autor)`, `contarConStock()`: Operaciones asíncronas sobre la lista devuelta por `listarLibros()`.
  - `agregarLibro(libro)`: Agrega un libro asignándole un ID autoincremental (`Math.max(...ids) + 1`) y reescribe el archivo con `fs.writeFile`.
- `index.js`: Demostración de uso con `async/await`.

### Ejercicio 2 — ES Modules (`modulos-demo/`)
- Muestra las principales diferencias entre CommonJS y ES Modules:
  1. Uso de `import ... from '...'` y `export` en lugar de `require` y `module.exports`.
  2. Es **obligatorio** especificar la extensión del archivo (`./matematica.js`).
  3. Requiere `"type": "module"` en `package.json`.

### Ejercicio 3 — Servidor HTTP Puro (`servidor-http/`)
- Servidor nativo con `http.createServer`.
- Maneja `GET /`, `GET /libros`, `POST /eco` (desafío opcional recibiendo stream del body) y respuesta 404 para otras rutas.
- Incluye `pruebas.http` para probar los endpoints con REST Client en VSCode.
