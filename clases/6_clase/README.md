# Resolución — Clase 6

Sobre el refactor de la clase 5, se agrega: **error handler central** + **validación con Zod** vía middleware reutilizable.

## Estructura

```
clases/6_clase/
├── README.md
├── consigna.md
├── material-teorico.md
├── .gitignore
├── package.json                  # + zod
├── index.js                      # errorHandler va ÚLTIMO
├── data/books.js
├── errors/
│   └── AppError.js               # error esperado: code + statusCode + details
├── schemas/
│   └── bookSchema.js             # create / update / pagination
├── routes/
│   └── booksRoutes.js            # validate(schema) antes del controller
├── controllers/
│   └── booksController.js        # throw / next(new AppError(...)), sin res.status(4xx)
├── middlewares/
│   ├── logger.js
│   ├── validate.js               # validate(schema) para body, validateQuery(schema) para query
│   ├── notFound.js               # deriva un AppError 404 al errorHandler
│   └── errorHandler.js           # (err, req, res, next) — 4 params
└── pruebas.http
```

## Cómo ejecutar

```bash
cd clases/6_clase
npm install
npm run dev
```

## Qué cambió respecto a la clase 5

| Antes (clase 5) | Ahora (clase 6) |
|---|---|
| Cada controller arma su error con un helper `error(res, ...)` | Los controllers hacen `next(new AppError(...))` |
| El formato de error se escribe en 5 lugares | Lo arma solo `errorHandler.js` |
| Validación con `if (!title || !author)` | `validate(createBookSchema)` como middleware de ruta |
| Sin distinción bug / error de negocio | `errorHandler`: `AppError` → status propio; otro → `500` genérico + log |
| — | `POST` con ISBN mal formado → `400`; ISBN repetido → `409` |

## El flujo de un error

1. Un controller (o `validate`, o `notFound`) llama a `next(err)`, o un handler `async` lanza.
2. Express saltea el resto de la fila y entra a `errorHandler(err, req, res, next)`.
3. `errorHandler` mira si es `AppError`:
   - **sí** → `res.status(err.statusCode).json({ error: { code, message, details? } })`
   - **no** → `console.error(err)` completo + `500` genérico (no se filtran detalles internos).

## Formato de error (sin cambios respecto a clase 5, pero centralizado)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid data",
    "details": [
      { "field": "title", "message": "Title is required" },
      { "field": "author", "message": "Author cannot be empty" }
    ]
  }
}
```

## Notas de Zod

- `createBookSchema` usa `.default(0)` en `stock`; `updateBookSchema` **no** (un update sin `stock` no debe pisarlo con 0). Por eso no se usa `createBookSchema.partial()` — el default se aplicaría igual.
- `safeParse` no tira: devuelve `{ success, data | error }`. `error.issues` es el array de reglas incumplidas.
- `validate` reemplaza `req.body` por `result.data` (con defaults ya aplicados).
- `paginationSchema` usa `z.coerce.number()` porque `req.query` llega como string. En Express 5 `req.query` es de solo lectura, así que `validateQuery` guarda el resultado en `req.pagination` en vez de reasignar `req.query`. Está enchufado en `GET /books` — el desafío opcional de paginación de la consigna ya está resuelto.

## Convención de nombres

El **código** está en inglés: archivos (`booksController.js`), funciones (`controller.create/get/update/remove`), `code` de error (`BOOK_NOT_FOUND`), mensajes de respuesta, y las **keys** de los objetos de dominio (`title`, `author`). Lo que queda en **español** son los **valores** de esos campos (los títulos y autores reales de los libros) y los **comentarios** dentro del código — son datos de negocio y texto explicativo, no identificadores. El **material teórico y la consigna** están en español; sus bloques de código siguen esta misma convención para que coincidan con este proyecto.

## Lo que todavía NO está

El controller sigue hablando directo con el array (`books.find`, `books.push`). Casos de uso y DAO: clases 7 y 8.
