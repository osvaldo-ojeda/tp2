# Clase 9 — Persistencia Intercambiable (Sequelize), Relaciones e Inyección de Dependencias (IoC)

## Objetivos de la clase

- Comprender el **Principio Abierto/Cerrado (OCP)** y la **Inversión de Dependencias (DIP)** al intercambiar bases de datos sin modificar reglas de negocio.
- Introducir **Sequelize** como ORM y **SQLite** como motor de persistencia SQL.
- Definir **Relaciones entre Modelos** (ej. `hasMany`, `belongsTo`) centralizadas en la carpeta `dao/models/`.
- Refactorizar el Composition Root en un **Contenedor de Inyección de Dependencias (IoC Container)** para mantener `index.js` limpio y escalable.

---

## 1. El Principio de Persistencia Intercambiable

En la Clase 8 desacoplamos los Controladores y los Casos de Uso del adaptador DAO. La prueba de fuego para validar que nuestra arquitectura es "Limpia" (Clean Architecture) es poder **cambiar la base de datos sin tocar ni una sola línea de código en la capa HTTP ni en el dominio**.

### ¿Por qué cambiaríamos de persistencia?
- **Desarrollo vs Producción:** Usar SQLite local (o memoria) para testear y PostgreSQL para producción.
- **Evolución del Proyecto:** Iniciar rápido con JSON o Memoria, y migrar luego a bases de datos relacionales robustas sin frenar el desarrollo de nuevas reglas de negocio.
- **Multitenancy o Arquitecturas Nube:** Diferentes clientes podrían requerir distintos motores de almacenamiento bajo el mismo sistema.

---

## 2. Introducción a Sequelize y SQLite

**Sequelize** es un ORM (Object-Relational Mapper) para Node.js. Facilita la interacción con bases de datos SQL mediante métodos de JavaScript en lugar de escribir consultas crudas (ej. `SELECT * FROM books`).

En esta clase utilizaremos **SQLite** (`sqlite3`). A diferencia de MySQL o Postgres, SQLite guarda toda la base de datos en memoria (o en un simple archivo `.sqlite` local). Esto es ideal para practicar, ya que **no requiere instalar ningún motor externo**.

### Modelos basados en Clases (ES6)
A diferencia de usar `sequelize.define()`, la forma moderna y recomendada (especialmente para tener buen tipado y extensibilidad) es utilizar **Clases ES6** que extienden de `Model`.

```js
import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

class BookModel extends Model {}

BookModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    // ... otros campos
  },
  {
    sequelize, // Pasamos la instancia de conexión
    modelName: "Book",
    tableName: "books",
  }
);
```

---

## 3. Validaciones vs Restricciones (Constraints)

Cuando defines tu modelo en Sequelize, verás que puedes agregar tanto restricciones (`allowNull: false`, `unique: true`) como validaciones (`validate: { isEmail: true }`). Es fundamental entender la diferencia:

### Restricciones (Constraints)
- **Dónde actúan:** A nivel de la Base de Datos (en el motor SQL).
- **Ejemplos:** `allowNull: false`, `unique: true`, llaves foráneas (`foreignKey`).
- **Qué pasa si fallan:** La base de datos rechaza la operación y lanza un error de integridad (por ejemplo, `SequelizeUniqueConstraintError`). 
- **Ventaja:** Garantizan la integridad de los datos incluso si alguien inserta datos usando otra aplicación o la terminal SQL directamente.

### Validaciones
- **Dónde actúan:** A nivel de la aplicación Node.js (ORM). Sequelize las ejecuta **antes** de enviar la consulta a la base de datos.
- **Ejemplos:** `isEmail: true`, `len: [2, 10]`, `notEmpty: true`, `min: 0`.
- **Qué pasa si fallan:** Sequelize ni siquiera ejecuta el `INSERT` o `UPDATE`; lanza un error `SequelizeValidationError` inmediatamente en Node.js.
- **Ventaja:** Puedes proveer mensajes de error amigables (`msg: "El email no es válido"`) y evitar viajes innecesarios (round-trips) a la base de datos para consultas que sabemos que van a fallar.

**Buenas Prácticas:** Se deben usar ambas juntas. Las validaciones mejoran la experiencia del desarrollador/usuario (errores claros), y las restricciones blindan la consistencia de los datos en disco.

---

## 4. Estructura de Modelos y Relaciones (`dao/models/index.js`)

A medida que el proyecto crece, no solo tenemos `Libros`, sino `Usuarios`, `Préstamos`, etc. Las tablas en bases de datos relacionales se asocian entre sí mediante claves foráneas (Foreign Keys).

Para mantener el orden, agrupamos todos los modelos en `dao/models/` y utilizamos un archivo `index.js` dentro de esa carpeta para **centralizar y definir las relaciones**. Esto evita problemas de dependencias circulares al importar modelos.

```js
// dao/models/index.js
import sequelize from "../sequelize.js";
import BookModel from "./BookModel.js";
import UserModel from "./UserModel.js";

// Relación 1:N -> Un Usuario puede tener muchos Libros asociados (ej. prestados o creados)
UserModel.hasMany(BookModel, { foreignKey: "userId", as: "libros" });

// Relación N:1 -> Un Libro pertenece a un Usuario
BookModel.belongsTo(UserModel, { foreignKey: "userId", as: "usuario" });

export { sequelize, BookModel, UserModel };
```
*Si quieres explorar relaciones más complejas (`belongsToMany` para tablas intermedias), visita la [documentación oficial de Sequelize](https://sequelize.org/docs/v6/core-concepts/assocs/).*

---

## 5. Adaptador DAO SQL (`BooksSequelizeDao.js`)

Creamos un nuevo adaptador que cumple con **la misma interfaz** que `BooksMemoryDao`, pero usa comandos SQL bajo el capó.

Un punto crítico: los Casos de Uso esperan **objetos planos JavaScript**, no instancias mágicas de Sequelize (que vienen llenas de metadatos y métodos ocultos). Por eso usamos `raw: true` o `get({ plain: true })`.

```js
async getAll() {
  // Retorna objetos planos en lugar de instancias de modelo ORM
  return await BookModel.findAll({ raw: true });
}
```

---

## 6. El Contenedor de Inyección de Dependencias (IoC Container)

En la clase anterior hacíamos la inicialización de DAOs y UseCases en `index.js`.
Pero ahora tenemos configuración de base de datos, múltiples DAOs (Books y Users), y lógica asíncrona (como `sequelize.sync()`). Si dejamos todo en `index.js`, se volverá ilegible.

Movemos todo el **Composition Root** a `container/container.js`:

```js
// container/container.js
async function buildContainer() {
  const booksDao = getBooksDao(); // Factory elige memoria o sequelize
  if (booksDao.init) await booksDao.init(); // Inicializa SQLite

  const bookUseCases = makeBookUseCases(booksDao);
  const booksController = new BooksController(bookUseCases);

  const router = Router();
  router.use("/books", createBooksRouter(booksController));
  
  return router; // Retorna el router completo y listo
}
```

Ahora, en nuestro punto de entrada `index.js`, **el código queda ultra limpio**:

```js
// index.js
import buildContainer from "./container/container.js";

const app = express();
const router = await buildContainer();
app.use(router);
app.listen(8000);
```

---

## Cierre

Lo que logramos hoy es el corazón de la Arquitectura Limpia: la infraestructura (Base de datos, Framework, Router) actúa como un simple plugin externo alrededor de nuestras reglas de negocio. Intercambiamos Memory por SQL simplemente cambiando la variable `PERSISTENCE_TYPE` en nuestro `.env`.

**En la consigna práctica, pondremos todo esto a prueba creando nosotros mismos la nueva entidad de `Usuarios` de inicio a fin.**
