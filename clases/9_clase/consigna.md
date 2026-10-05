# Clase 9 — Consigna de Práctica (Tarea Integradora)

En esta clase has visto cómo migrar la entidad `Libros` (`Books`) hacia un modelo ORM (Sequelize con SQLite) soportando persistencia intercambiable mediante la variable `PERSISTENCE_TYPE` en `.env`. Además, limpiamos nuestro `index.js` trasladando el ensamblado de dependencias a un **Contenedor IoC (`container/container.js`)**.

El objetivo de esta consigna es que pongas todo en práctica construyendo una nueva entidad desde cero y aplicándole las mismas reglas de arquitectura y relaciones relacionales.

---

## Tarea Integrada: Construcción de la Entidad `Usuarios` (`Users`)

Deberás implementar un CRUD completo para gestionar usuarios, estableciendo la relación de que un Libro pertenece a un Usuario (ya definida en `dao/models/index.js`), siguiendo estrictamente la Arquitectura en Capas.

Sigue estos pasos en orden:

### Ejercicio 1: Validaciones (Schemas Zod)
1. Crea el archivo `schemas/userSchema.js`.
2. Define `createUserSchema` requiriendo:
   - `nombre` (string, mínimo 2 caracteres)
   - `email` (string, validación de email válida)
   - `rol` (string, opcional, por defecto 'lector'. Podría ser un enum o validar strings específicos si te animas).
3. Define `updateUserSchema` (todos los campos opcionales) y `userIdParamSchema`.

### Ejercicio 2: Capa de Persistencia (DAO)
1. Revisa el modelo Sequelize ya provisto en `dao/models/UserModel.js` y cómo se asocia en `dao/models/index.js`.
2. Crea `dao/UsersMemoryDao.js` (un array JS para persistencia en memoria, similar a Libros).
3. Crea `dao/UsersSequelizeDao.js` utilizando `UserModel` (métodos: `getAll`, `getById`, `save`, `update`, `delete`). **No olvides incluir el método `init()`** (aunque SQLite ya se sincronice por Libros, es buena práctica si quisieras poblar datos iniciales).
4. Actualiza o crea un archivo equivalente a `daoFactory.js` (ej. `getUsersDao`) para que retorne el DAO en memoria o SQL dependiendo de `PERSISTENCE_TYPE`.

### Ejercicio 3: Capa de Dominio (Casos de Uso)
1. Crea la carpeta `usecases/users/`.
2. Implementa los archivos: `getUsers.js`, `getUserById.js`, `createUser.js`, `updateUser.js`, `deleteUser.js`.
3. Valida en `createUser` que no exista ya un usuario con ese `email` (lanzando AppError "EMAIL_DUPLICATED").
4. Implementa la factory `usecases/users/makeUserUseCases.js` (idéntica en estructura a la de libros).

### Ejercicio 4: Capa HTTP (Controllers y Routes)
1. Crea `controllers/usersController.js` para exponer los métodos manejando `req` y `res`.
2. Crea `routes/usersRoutes.js` e implementa la factory `createUsersRouter(controller)` asegurándote de usar los middlewares `validate` creados en el Ejercicio 1.

### Ejercicio 5: Inyección en el Contenedor
Ve al archivo `container/container.js`.
1. Instancia el DAO de Usuarios (`getUsersDao()`).
2. Crea sus Casos de Uso pasándole el DAO.
3. Instancia su Controlador pasándole los Casos de Uso.
4. Monta su Router en Express: `router.use("/users", createUsersRouter(usersController));`.

### Ejercicio 6: Verificación Funcional
1. Crea o actualiza un bloque en `requests.http` con peticiones de prueba para `/users` (GET, POST, PUT, DELETE).
2. Arranca la aplicación con `PERSISTENCE_TYPE=memory` y pruébalo.
3. Arranca la aplicación con `PERSISTENCE_TYPE=sequelize` y pruébalo.
4. (Opcional Avanzado) Modifica el caso de uso `getBooks` en Sequelize para incluir al usuario propietario en los resultados utilizando la opción `include` de Sequelize.

¡Éxitos! Esta es la culminación arquitectónica del backend antes de pasar a Seguridad (JWT) en próximas clases.
