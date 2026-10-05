# Clase 8 — Consigna de práctica

En esta clase llevamos la arquitectura un paso más lejos: eliminamos la necesidad de pasar el `dao` en cada llamada a los casos de uso creando una **Factory de Casos de Uso**. Al terminar, el controlador no importará ningún DAO ni se preocupará por dependencias de almacenamiento.

---

## Ejercicio 1 — Factory de Casos de Uso

Crear el archivo `usecases/books/makeBookUseCases.js`.

Debe exportar por defecto una función `makeBookUseCases(dao)` que reciba el adaptador DAO y devuelva un objeto con los 5 casos de uso ya "preconectados" o con el `dao` inyectado:

```js
import getBooks from "./getBooks.js";
import getBookById from "./getBookById.js";
import createBook from "./createBook.js";
import updateBook from "./updateBook.js";
import deleteBook from "./deleteBook.js";

function makeBookUseCases(dao) {
  return {
    getBooks: (filters) => getBooks(filters, dao),
    getBookById: (id) => getBookById(id, dao),
    createBook: (data) => createBook(data, dao),
    updateBook: (id, changes) => updateBook(id, changes, dao),
    deleteBook: (id) => deleteBook(id, dao),
  };
}

export default makeBookUseCases;
```

---

## Ejercicio 2 — Refactorizar el Controller

Modificar `controllers/booksController.js`:

1. Eliminar cualquier `import` que haga referencia a `booksMemoryDao.js` o a casos de uso individuales.
2. Hacer que la clase `BooksController` reciba en su constructor el objeto `useCases` producido por la Factory.
3. Actualizar los métodos del controlador para que llamen a `this.#useCases.getBooks(req.query)`, `this.#useCases.createBook(req.body)`, etc., **sin pasar el DAO como argumento**.
4. Cambiar el `export` final: en la clase 7 el archivo exportaba una instancia ya armada (`export default new BooksController(dao)`), porque el propio archivo conocía el DAO. Ahora que el controller no conoce ninguna dependencia concreta, exportá la **clase** (`export default BooksController;`). Quien la instancia (con los casos de uso ya inyectados) es el Composition Root, no el archivo del controller.

---

## Ejercicio 3 — Ensamblado en el Composition Root (`index.js`)

Como vimos en el teórico (sección 5), el **Composition Root es el único lugar de la aplicación donde se instancian y conectan los componentes concretos** — y ese lugar es `index.js`, no `routes/`. Ni `routes/booksRoutes.js` ni `controllers/booksController.js` deben importar el DAO.

1. En `index.js`, importar el DAO (`booksMemoryDao.js`), la Factory (`makeBookUseCases.js`) y la clase `BooksController`.
2. Instanciar los casos de uso: `const bookUseCases = makeBookUseCases(dao);`
3. Instanciar el controlador pasándole los casos de uso: `const booksController = new BooksController(bookUseCases);`
4. Convertir `routes/booksRoutes.js` en una función que recibe el controlador ya armado y devuelve el router, en vez de importar un controlador singleton:

   ```js
   // routes/booksRoutes.js
   import express from "express";
   import validate from "../middlewares/validate.js";
   import { createBookSchema, updateBookSchema } from "../schemas/bookSchema.js";

   function createBooksRouter(controller) {
     const router = express.Router();

     router.get("/", controller.list);
     router.get("/:id", controller.get);
     router.post("/", validate(createBookSchema), controller.create);
     router.put("/:id", validate(updateBookSchema), controller.update);
     router.delete("/:id", controller.remove);

     return router;
   }

   export default createBooksRouter;
   ```
5. Actualizar `routes/index.js` para que reciba el controlador desde afuera y se lo pase a `createBooksRouter`:

   ```js
   // routes/index.js
   import { Router } from "express";
   import createBooksRouter from "./booksRoutes.js";

   function createRouter(booksController) {
     const router = Router();
     router.use("/books", createBooksRouter(booksController));
     return router;
   }

   export default createRouter;
   ```
6. En `index.js`, pasar el `booksController` ya armado a `createRouter(booksController)` y montar el resultado con `app.use(...)`, tal como muestra el diagrama de la sección 5 del teórico.

---

## Ejercicio 4 — Verificación

Ejecutar las pruebas en `requests.http`:

1. `GET /books`
2. `GET /books/1`
3. `POST /books` con body incompleto (400)
4. `POST /books` válido (201)
5. `POST /books` duplicado (409)
6. `PUT /books/1` parcial (200)
7. `PUT /books/1` con stock negativo (400)
8. `DELETE /books/1` (204)

**Criterio de éxito:** Todas las peticiones deben responder exactamente igual que en la Clase 7. El comportamiento externo es idéntico, pero el controlador ahora está 100% desacoplado de la infraestructura.

---

## Desafío opcional

1. **Decorador de Logger en Factory**: En `makeBookUseCases.js`, agregar un `console.log` dentro de cada función que indique qué caso de uso se está ejecutando (ejemplo: `console.log("[UseCase] Executing createBook...")`). Probar realizar peticiones HTTP y observar el log en consola.
2. **DAO Falso Intercambiable**: En `index.js`, crear un DAO falso provisional y pasárselo a la factory en lugar de `booksMemoryDao`. Verificar que la aplicación arranca e interactúa con el nuevo adaptador sin tocar controladores.
