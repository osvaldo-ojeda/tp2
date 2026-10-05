# Resolución — Clase 4

Solución de la consigna de la Clase 4 (Express + CRUD in-memory, todo en un archivo, sin capas).

## Estructura

```
clases/4_clase/resolucion/
├── README.md
└── biblioteca-api-express/
    ├── .gitignore
    ├── package.json
    ├── index.js        # app + las 5 rutas del CRUD (+ PATCH opcional)
    ├── pruebas.http
    └── NOTAS.md         # respuestas del Ejercicio 1.5 y del desafío
```

## Cómo ejecutar

```bash
cd clases/4_clase/resolucion/biblioteca-api-express
npm install
npm run dev        # node --watch: reinicia al guardar
```

Probar los endpoints abriendo `pruebas.http` con la extensión **REST Client** de VSCode.

> **Nota de versión**: `npm install express` hoy instala **Express 5.x** (v5 es el `latest` en npm desde marzo 2025). El CRUD de esta clase funciona igual en v4 y v5.

## Endpoints

| Método | Ruta | Descripción | Status |
|---|---|---|---|
| `GET` | `/libros` | Lista todos (acepta `?autor=...`) | `200` |
| `GET` | `/libros/:id` | Uno por ID | `200` / `404` |
| `POST` | `/libros` | Crea (requiere `titulo` y `autor`) | `201` / `400` |
| `PUT` | `/libros/:id` | Reemplaza (mantiene el `id`) | `200` / `404` |
| `DELETE` | `/libros/:id` | Borra | `200` / `404` |
| `PATCH` | `/libros/:id` | Actualiza campos sueltos *(desafío opcional)* | `200` / `404` |

## Notas de implementación

- **`express.json()`** va primero: sin él, `req.body` es `undefined` en el `POST`/`PUT`/`PATCH`. Qué es un middleware se ve en la clase 5.
- **`return` después de responder** en cada rama de error (`404`, `400`) para no seguir ejecutando el handler.
- **Datos en memoria**: al reiniciar el proceso (o al guardar con `--watch`) la lista vuelve al estado inicial. Es esperable en esta clase.
