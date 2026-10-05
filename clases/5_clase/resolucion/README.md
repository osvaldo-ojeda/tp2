# Resolución — Clase 5

Refactor del CRUD de la clase 4 (todo en `index.js`) a una estructura con `routes/`, `controllers/` y `middlewares/`, con formato de error estandarizado y query params de orden/paginado.

## Estructura

```
clases/5_clase/resolucion/
├── README.md
└── biblioteca-api-express/
    ├── .gitignore
    ├── package.json
    ├── index.js                      # arma la app, middlewares globales, monta el router
    ├── data/
    │   └── libros.js                  # array en memoria (hasta la clase 8)
    ├── routes/
    │   └── librosRoutes.js            # ruta -> función del controller
    ├── controllers/
    │   └── librosController.js        # la lógica de cada endpoint
    ├── middlewares/
    │   ├── logger.js                  # loguea cada request
    │   └── notFound.js                # 404 estandarizado para rutas sin match
    └── pruebas.http
```

## Cómo ejecutar

```bash
cd clases/5_clase/resolucion/biblioteca-api-express
npm install
npm run dev
```

Probar con `pruebas.http` (extensión REST Client de VSCode).

## Qué cambió respecto a la clase 4

| Antes (clase 4) | Ahora (clase 5) |
|---|---|
| Todo en `index.js` | `index.js` solo arma la app y monta el router |
| Array `libros` inline | `data/libros.js` |
| Lógica de cada ruta inline | `controllers/librosController.js` |
| Rutas con `app.get("/libros/:id", ...)` | `express.Router()` en `routes/librosRoutes.js` |
| Error como `{ error: "texto" }` | `{ error: { code, message } }` en todos lados |
| `GET /libros` con `?autor=` | además `?sort=campo` / `?sort=-campo` y `?page=&limit=` |
| Ruta inexistente → 404 HTML de Express | middleware `notFound` → 404 JSON estandarizado |

## Formato de error

Todos los errores tienen la misma forma:

```json
{ "error": { "code": "LIBRO_NO_ENCONTRADO", "message": "No existe un libro con id 999" } }
```

- `LIBRO_NO_ENCONTRADO` — `:id` inexistente en GET/PUT/DELETE (404)
- `DATOS_INCOMPLETOS` — falta `titulo` o `autor` en POST (400)
- `RUTA_NO_ENCONTRADA` — ninguna ruta matcheó (404)

En la clase 6 esto se centraliza en un error handler `(err, req, res, next)` — acá todavía se arma a mano en cada controller (con el helper `error()`).

## Lo que todavía NO está

El controller habla directo con el array (`libros.find`, `libros.push`). No hay casos de uso ni DAO — eso llega en las clases 7 y 8.
