# Clase 4 — Consigna de práctica

Hoy damos el salto de Node puro (clase 3) a **Express**, construyendo una API REST con un **CRUD completo en memoria** — a propósito todo en un archivo, sin capas todavía.

Es una carpeta nueva, aparte de `biblioteca-api/` de las clases 1-3. En la clase 5 este mismo CRUD se refactoriza a `routes/` y `controllers/`, entra el tema **middlewares**, y pasa a ser el proyecto integrador.

---

## Ejercicio 1 — Setup e instalación de Express

1. Crear una carpeta `biblioteca-api-express/`.
2. Inicializar el proyecto: `npm init -y`.
3. Instalar Express: `npm install express`.
4. Configurar los scripts en `package.json`:
   ```json
   "scripts": {
     "start": "node index.js",
     "dev": "node --watch index.js"
   }
   ```
5. **Inspeccionar el `package.json` generado** y responder en un archivo `NOTAS.md` (dos líneas):
   - ¿Qué versión de Express se instaló?
   - ¿Con qué símbolo quedó anotada (`^`, `~` o sin símbolo) y qué significa ese símbolo?

   > Ojo: **el `package.json` es JSON y JSON no admite comentarios** — no metas `//` adentro o `npm install` va a fallar. Cuando la consigna dice "anotar en un comentario", es en un archivo `.md` o como comentario `//` en un archivo `.js`, nunca dentro de un `.json`.
6. Crear un `.gitignore` con `node_modules/` adentro.

---

## Ejercicio 2 — CRUD in-memory en un solo archivo (`index.js`)

Todo vive en `index.js` (a propósito, por ahora).

### 2.1 — Setup de la app

1. Importar `express`, crear la app (`const app = express()`).
2. Agregar la línea `app.use(express.json())` para que los `POST`/`PUT` tengan `req.body`. (Qué es exactamente esto lo vemos en la clase 5 — por ahora es "la línea obligatoria para el body".)
3. Definir un array `libros` en memoria con **mínimo 5 libros**, cada uno con: `id`, `isbn`, `titulo`, `autor`, `stock`.

### 2.2 — Las 5 rutas del CRUD

- **`GET /libros`** — devolver la lista completa con status `200`.
  - **Filtro por query param**: si la URL trae `?autor=nombre` (ej: `/libros?autor=orwell`), devolver solo los libros cuyo autor contenga ese texto, sin importar mayúsculas/minúsculas.

- **`GET /libros/:id`** — buscar el libro por `:id`.
  - Si existe → `200` + el objeto.
  - Si no existe → `404` + `{ "error": "Libro no encontrado" }`.

- **`POST /libros`** — crear un libro con los datos de `req.body`.
  - **Validación**: si falta `titulo` o `autor` → `400` + `{ "error": "El título y el autor son obligatorios" }`.
  - Asignar un `id` autoincremental (`Math.max(...ids) + 1`, o `1` si el array está vacío).
  - Agregar al array y responder `201` + el libro creado.

- **`PUT /libros/:id`** — reemplazar un libro.
  - Si no existe → `404`.
  - Si existe → actualizar sus campos con lo que venga en `req.body`, **manteniendo el `id` original**, y responder `200` + el libro actualizado.

- **`DELETE /libros/:id`** — borrar un libro.
  - Si no existe → `404`.
  - Si existe → sacarlo del array y responder `200` + `{ "mensaje": "Libro eliminado correctamente" }`.

### 2.3 — Levantar el servidor

Escuchar en el puerto `3000` con `app.listen(3000, ...)` y loguear la URL al arrancar.

**Cuidá dos cosas** que vimos en la teoría:
- Después de responder dentro de un `if` (ej: el `404`), cortá el flujo con `return`.
- El orden de las rutas: `/libros/:id` no puede taparle el paso a otra ruta más específica.

---

## Ejercicio 3 — Pruebas con REST Client (`pruebas.http`)

Crear `pruebas.http` en la raíz del proyecto, con al menos estas requests:

1. `GET /libros` — listar todos.
2. `GET /libros?autor=Orwell` — filtro por autor.
3. `GET /libros/1` (existe → 200) y `GET /libros/999` (no existe → 404).
4. `POST /libros` con body válido (→ 201) y `POST /libros` sin `titulo` (→ 400).
5. `PUT /libros/1` — actualizar un libro.
6. `DELETE /libros/2` — borrar un libro.
7. `GET /libros` final — para ver cómo quedó la lista.

Al reiniciar el servidor (o al guardar, si usás `npm run dev`), la lista vuelve al estado inicial: es esperable, los datos viven solo en memoria.

---

## Entregable

Carpeta `biblioteca-api-express/` con:
- `package.json` (con los scripts `start` y `dev`) y `.gitignore`
- `index.js` — app + las 5 rutas del CRUD
- `pruebas.http` — corriendo sin errores
- `NOTAS.md` — con las respuestas del Ejercicio 1.5

---

## Desafío opcional

- Agregar `PATCH /libros/:id` que actualice **solo** los campos enviados (a diferencia de `PUT`), y anotar en `NOTAS.md` por qué `PATCH` no es idempotente y `PUT` sí.
