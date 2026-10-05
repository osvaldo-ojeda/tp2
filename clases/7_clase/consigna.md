# Clase 7 — Consigna de práctica

Seguimos con `biblioteca-api-express/` de la clase 6. Hoy sacamos toda la lógica de negocio del controller y la movemos a **casos de uso** independientes. Al final, el controller solo delega.

---

## Ejercicio 1 — DAO en memoria

Crear `dao/booksMemoryDao.js`. Tiene que exportar un objeto con los siguientes métodos, **todos `async`**:

| Método       | Firma                            | Qué hace                                              |
| ------------- | -------------------------------- | ------------------------------------------------------ |
| `getAll`    | `() → book[]`                 | Devuelve todos los libros (copia del array)            |
| `getById`   | `(id) → book \| null`          | Busca por id numérico                                 |
| `getByIsbn` | `(isbn) → book \| null`        | Busca por ISBN exacto                                  |
| `save`      | `(data) → book`               | Asigna un id autoincremental y persiste                |
| `update`    | `(id, changes) → book \| null` | Pisa solo los campos que vienen en`changes`          |
| `delete`    | `(id) → boolean`              | Elimina y devuelve`true`, o `false` si no existía |

Semilla inicial (podés moverla desde `data/books.js` — después ese archivo puede borrarse):

```js
let books = [
  { id: 1, titulo: "El principito",        autor: "Saint-Exupéry",  isbn: null, stock: 3 },
  { id: 2, titulo: "Cien años de soledad", autor: "García Márquez", isbn: null, stock: 1 },
];
let nextId = 3;
```

> **Pista copia defensiva**: en `getAll`, devolvé `[...books]` en lugar de `books`. Así el que llama no puede modificar el array interno accidentalmente.

---

## Ejercicio 2 — Casos de uso

Crear la carpeta `usecases/` con un archivo por caso de uso. Cada uno es una función `async` que recibe datos primitivos y un `dao`, y devuelve datos o lanza `AppError`.

### `usecases/getBooks.js`

```js
async function getBooks(dao) {
  return dao.getAll();
}

export default getBooks;
```

### `usecases/getBookById.js`

Recibe `(id, dao)`. Llama a `dao.getById(id)`. Devuelve el libro o `null` — **no lanza error**: la decisión de si el `null` es un 404 la toma el controller (es una decisión HTTP, no de negocio).

### `usecases/createBook.js`

Recibe `(data, dao)` donde `data` es `{ titulo, autor, isbn, stock }` (ya validado por Zod).

Reglas de negocio a implementar:

1. Si `isbn` viene (no es `null`/`undefined`/`""`), verificar que no exista otro libro con ese ISBN → lanzar `AppError("ISBN_DUPLICATE", "Ese ISBN ya está registrado", 409)`.
2. Llamar a `dao.save(data)` y devolver el libro creado.

### `usecases/updateBook.js`

Recibe `(id, changes, dao)`. Delega directamente a `dao.update(id, changes)`. Devuelve el libro actualizado o `null`.

> ¿No hay reglas de negocio acá? Por ahora no. Si mañana aparece una (ej: "no se puede bajar el stock por debajo de las reservas activas"), va en este caso de uso — sin tocar el controller.

### `usecases/deleteBook.js`

Recibe `(id, dao)`. Delega a `dao.delete(id)`. Devuelve `true` o `false`.

---

## Ejercicio 3 — Refactorizar el controller

Reescribir `controllers/booksController.js` para que **solo delegue**:

- Importar el DAO: `import dao from "../dao/booksMemoryDao.js";`
- Importar los 5 casos de uso.
- Cada función del controller extrae los parámetros de `req`, llama al caso de uso, y forma la respuesta con `res`.
- **Cero lógica de negocio** en el controller: ningún `if` que diga "el ISBN ya existe" o "el stock no puede ser negativo".
- Los handlers son `async` y Express 5 atrapa el rechazo automáticamente.

Manejo del `null` que devuelven los casos de uso:

```js
async function get(req, res) {
  const book = await getBookById(Number(req.params.id), dao);
  if (!book) throw new AppError("BOOK_NOT_FOUND", "No existe un libro con ese id", 404);
  res.json(book);
}
```

Actualizá también `routes/booksRoutes.js` para que use los nuevos nombres de método del controller (`list`, `get`, `create`, `update`, `remove`).

---

## Ejercicio 4 — Verificar que todo sigue funcionando

Reproducir en `requests.http` los mismos tests de la clase 6:

1. `GET /books` → lista los 2 libros de la semilla.
2. `GET /books/1` → detalle.
3. `GET /books/999` → `404 BOOK_NOT_FOUND`.
4. `POST /books` con body incompleto → `400` con `details` (Zod, igual que antes).
5. `POST /books` válido sin ISBN → `201`, `stock: 0`.
6. `POST /books` con ISBN → `201`.
7. `POST /books` con el mismo ISBN → `409 ISBN_DUPLICATE`.
8. `PUT /books/1` con `{ "stock": 10 }` → `200`, `titulo` intacto.
9. `DELETE /books/1` → `204`.
10. `DELETE /books/1` de nuevo → `404`.

> Si todos pasan igual que en la clase 6, el refactor fue exitoso: **el comportamiento externo no cambió** aunque la estructura interna es completamente diferente.

---

## Entregable

```
biblioteca-api-express/
├── index.js
├── package.json
├── errors/AppError.js
├── schemas/bookSchema.js
├── dao/
│   └── booksMemoryDao.js       ← NUEVO
├── usecases/
│   ├── getBooks.js             ← NUEVO
│   ├── getBookById.js          ← NUEVO
│   ├── createBook.js           ← NUEVO
│   ├── updateBook.js           ← NUEVO
│   └── deleteBook.js           ← NUEVO
├── routes/
│   ├── index.js                ← sin cambios (router central)
│   └── booksRoutes.js          ← nombres de método actualizados
├── controllers/
│   └── booksController.js      ← MODIFICADO (solo delega)
├── middlewares/
│   ├── logger.js
│   ├── validate.js
│   ├── notFound.js
│   └── errorHandler.js
└── requests.http
```

**Criterio de éxito**: no existe ningún `if` de negocio en `booksController.js`. Todo el comportamiento de los tests sigue igual.

---

## Desafío opcional

1. **Regla de stock mínimo**: En `updateBook.js`, si `changes.stock` viene y es menor a `0`, lanzar `AppError("INVALID_STOCK", "El stock no puede ser negativo", 400)`. Agregar el caso de prueba en `requests.http`.
2. **Test manual de inyección**: En `index.js`, crear un segundo DAO "falso" que loguee cada operación en consola pero no persista nada. Pasárselo al controller en lugar del real, hacer una request y verificar que funciona con cualquier objeto que cumpla el contrato. Después revertir.
3. **Separar el id de los datos**: En `save`, desestructurar para ignorar un posible `id` entrante: `const { id: _ignored, ...data } = book`. Documentar por qué con un comentario.
