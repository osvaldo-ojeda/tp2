# Clase 5 — Consigna de práctica

Seguimos en `biblioteca-api-express/` de la clase 4. Hoy la refactorizamos: sacamos todo de `index.js` y lo repartimos en `routes/`, `controllers/` y `middlewares/`. De paso, estandarizamos el formato de error y agregamos paginación y orden al listado.

**No cambia el comportamiento visible de la API** (salvo el formato de error y los nuevos query params). Es un refactor: las mismas 5 rutas tienen que seguir andando igual.

---

## Ejercicio 1 — Separar los datos

1. Crear `data/libros.js` que exporte el array de libros (mínimo 5, con `id`, `isbn`, `titulo`, `autor`, `stock`).
2. En vez de `let libros = [...]` adentro de `index.js`, ahora se importa desde ahí.

---

## Ejercicio 2 — `controllers/librosController.js`

Mover la lógica de cada endpoint a funciones sueltas en este archivo. Una función por operación: `listar`, `obtener`, `crear`, `actualizar`, `eliminar`. Cada una recibe `(req, res)`.

Exportarlas todas: `module.exports = { listar, obtener, crear, actualizar, eliminar }`.

### Formato de error estandarizado

Todos los errores que devuelva la API tienen que tener **esta forma**:

```json
{ "error": { "code": "CODIGO_ESTABLE", "message": "texto para humanos" } }
```

Aplicarlo en:
- `obtener` / `actualizar` / `eliminar` cuando el `:id` no existe → `404` + `code: "LIBRO_NO_ENCONTRADO"`.
- `crear` cuando falta `titulo` o `autor` → `400` + `code: "DATOS_INCOMPLETOS"`.

### Paginación y orden en `listar`

`GET /libros` ahora soporta estos query params (además del `?autor=` de la clase 4):

- `?page=2&limit=10` — devolver solo esa página. Defaults: `page=1`, `limit=20`.
- `?sort=titulo` — ordenar ascendente por ese campo. `?sort=-stock` — descendente (el `-` adelante).

Recordá que todo lo de `req.query` llega como **string** — hay que convertir con `Number(...)`.

---

## Ejercicio 3 — `routes/librosRoutes.js`

Crear el router con `express.Router()`. Solo mapea ruta → función del controller, nada de lógica acá:

```js
router.get("/", controller.listar);
router.get("/:id", controller.obtener);
// ...
```

Las rutas van sin el prefijo `/libros` (eso lo agrega `index.js` al montar el router).

---

## Ejercicio 4 — `middlewares/`

Ahora que sabés qué es un middleware, escribí dos:

1. **`middlewares/logger.js`** — `(req, res, next)` que loguea `método + url + timestamp` de cada request y llama a `next()`.
2. **`middlewares/notFound.js`** — `(req, res)` que responde `404` + `{ error: { code: "RUTA_NO_ENCONTRADA", message: "..." } }`. Se monta **después** de todos los routers, para atrapar cualquier ruta que no matcheó.

---

## Ejercicio 5 — `index.js` mínimo

Tiene que quedar corto. Solo:
1. Crear la app.
2. `app.use(logger)` y `app.use(express.json())` — en ese orden.
3. `app.use("/libros", librosRoutes)`.
4. `app.use(notFound)` al final.
5. `app.listen(3000, ...)`.

Si `index.js` tiene un `libros.find(...)` o un `res.status(...)` adentro, algo quedó sin mover.

---

## Ejercicio 6 — Probar que nada se rompió

Actualizar `pruebas.http` con:
- Las mismas requests de la clase 4 (tienen que seguir dando lo mismo).
- `GET /libros?page=1&limit=2` — verificar que devuelve solo 2.
- `GET /libros?sort=-stock` — verificar el orden.
- `GET /cualquier-cosa` — verificar el `404` estandarizado del `notFound`.
- Un error viejo (ej: `GET /libros/999`) — verificar que ahora tiene el formato `{ error: { code, message } }`.

---

## Entregable

`biblioteca-api-express/` con esta estructura, las 5 rutas andando igual que en la clase 4, el formato de error unificado, y `index.js` sin lógica de negocio:

```
biblioteca-api-express/
├── index.js
├── package.json
├── data/libros.js
├── routes/librosRoutes.js
├── controllers/librosController.js
├── middlewares/logger.js
├── middlewares/notFound.js
└── pruebas.http
```

---

## Desafío opcional

- Agregar un segundo recurso: `routes/autoresRoutes.js` + `controllers/autoresController.js`, con `GET /autores` y `GET /autores/:id`, montado en `index.js` con `app.use("/autores", autoresRoutes)`. Ver lo poco que hay que tocar cuando la estructura ya está.
- En `listar`, devolver la paginación con metadata: `{ page, limit, total, data: [...] }` en vez del array pelado.
