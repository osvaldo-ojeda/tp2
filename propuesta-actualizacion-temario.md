# Propuesta: actualización del temario de Taller de Programación 2

> Documento de consulta para discutir con la cátedra. No es una decisión: son opciones, con sus costos.
> Punto de partida: el temario actual (`temario.md`), dictado por primera vez este cuatrimestre.

---

## 1. el pedido y el problema real

**Lo que se pide sumar:** TypeScript, **NestJS**, Docker, MongoDB y PostgreSQL.

**Las condiciones:**

- **16 clases** de 4 horas (2 de teoría + 2 de práctica). Ya hoy el temario está justo: tiene un plan B para cuando son 12 clases.
- **Niveles muy distintos**: hay quien no sabe JavaScript y quien ya trabaja.
- **Todos programan con IA.** No es algo para prohibir ni para ignorar: cambia qué conviene enseñar y, sobre todo, cómo conviene evaluar.

**El riesgo principal:** que "actualizar" signifique **sumar** cinco tecnologías a un temario que ya está lleno. El resultado sería ver todo por arriba: alumnos que generan un módulo de Nest con `nest g resource` (o con la IA) pero no pueden explicar qué hace `@Injectable()` ni por qué un caso de uso no debería llamar a `new Date()`.

**La buena noticia:** el pedido es **muy coherente** con el temario actual. Todo es backend, y la columna vertebral de hoy (capas, DAO intercambiable, inyección de dependencias, reglas de negocio, testing) es **exactamente lo que Nest formaliza**. No hay que tirar nada: hay que **reubicar**.

---

## 2. qué aporta cada tecnología pedida (y cuánto cuesta)

| Tecnología | ¿Lo pide el mercado? | ¿Encaja en el temario actual? | Costo en clases | Recomendación |
|---|---|---|---|---|
| **TypeScript** | Sí, muchísimo. Es el estándar en backend Node | **Muy bien**: el "puerto" del DAO pasa a ser una `interface` explícita. Zod genera los tipos (`z.infer`) | 1 clase + un poco en cada clase | **Sí, desde temprano** |
| **NestJS** | Sí: es el framework de backend TypeScript más presente en búsquedas de empresas medianas y grandes | **Muy bien**: módulos, providers e inyección de dependencias son lo que hoy hacemos a mano con factories y el `container.js` | 2 clases de introducción + se usa el resto del curso | **Sí, pero después de Express** (ver sección 3) |
| **PostgreSQL** | Sí: es la base relacional más pedida | **Perfecto**: reemplaza a SQLite como adaptador "real" | 0 extra (reemplaza a SQLite) | **Sí** |
| **Docker** | Sí, como herramienta del día a día (no como especialidad) | **Bien**: es la forma más simple de levantar Postgres y Mongo sin instalar nada | 1 clase | **Sí, acotado**: `docker compose` para las bases + dockerizar la app al final |
| **MongoDB** | Sí, aunque menos que SQL | **Perfecto**: es el segundo adaptador del DAO (ya era el estilo del final "hotel": Mongo/JSON intercambiable) | 1 clase | **Sí, como segundo adaptador** |

### TypeScript: sin configuración al principio, con build cuando llega Nest

Las versiones actuales de Node **ejecutan `.ts` directamente** (lo probé con Node 26: `node app.ts` funciona, sin `tsc` ni `ts-node`). Node "borra" los tipos y ejecuta el resto. Solo acepta sintaxis que se puede borrar: **nada de `enum` ni `namespace`**.

**Ojo: tampoco acepta decoradores.** Lo probé: un archivo con `@Injectable()` falla con `SyntaxError` en Node 26. Nest depende de decoradores (y de la metadata que emite el compilador), así que **Nest necesita un paso de compilación** (`nest start`, que usa `tsc` o SWC por detrás).

Esto, lejos de ser un problema, ordena el curso:

- **Fase Express**: TypeScript sin configurar nada (`node --watch app.ts`). Se aprende el lenguaje sin pelear con herramientas.
- **Fase Nest**: el CLI de Nest ya trae todo configurado (`nest new`). Se explica por qué hace falta compilar: los decoradores no son "solo tipos".

### El cambio de ORM

Sequelize funciona con TypeScript, pero mal. Con Nest + Postgres conviene **Prisma** (el esquema genera los tipos y las migraciones) o **Drizzle** (más cerca de SQL, más liviano). **TypeORM** es el "clásico" de la documentación de Nest, pero hoy pierde terreno frente a los otros dos. Para Mongo, **Mongoose** (que tiene integración oficial: `@nestjs/mongoose`).

> Prisma tiene una ventaja didáctica: el `schema.prisma` se lee casi como un diagrama de tablas. Drizzle tiene otra: obliga a pensar en SQL. Cualquiera de los dos es mejor opción que Sequelize para este perfil.

---

## 3. el caso NestJS: ¿de entrada o después de Express?

| Opción | Qué es | A favor | En contra |
|---|---|---|---|
| **A. Nest de entrada** (desde la clase 3) | Nunca se ve Express | Más clases en Nest; se llega más lejos con el framework | Todo es "magia": decoradores, inyección y módulos sin saber qué problema resuelven. Cuando aparece `Nest can't resolve dependencies of LoansService`, el que no sabe JS no tiene de dónde agarrarse. Y la IA genera Nest muy bien, así que es fácil tener un proyecto andando sin entender nada |
| **B. Express primero, Nest a mitad de curso** (Express en 3–6, Nest desde la 7) | Se construye la arquitectura a mano y después se **migra** a Nest | Cada decorador de Nest responde a algo que el alumno ya hizo a mano. La migración demuestra que los casos de uso no dependen del framework | 4 clases de Express que "se tiran" (no se tiran: ver abajo) |
| **C. Express todo el curso, Nest al final** (clases 13–14) | Como hoy, más una migración final a Nest | Máxima profundidad en los fundamentos; la migración es un gran ejercicio integrador | Se usa poco Nest; el alumno sale sabiendo "lo básico" del framework que pide el mercado |

### Recomendación: B

El argumento más fuerte es didáctico: **Nest es la versión industrial de lo que la materia ya enseña a mano.** Si el alumno primero arma el `container.js` con factories, después entiende qué hace Nest en vez de memorizar decoradores. La tabla de equivalencias es casi uno a uno:

| Lo que hicimos a mano en Express | Lo que hace Nest | Lo que se aprende al compararlos |
|---|---|---|
| `container.js` + factories `make*UseCases` | **Módulos y providers** (`@Module`, `@Injectable`) | Qué es un contenedor de inyección: Nest arma el grafo que antes armábamos nosotros |
| DAO como `interface` + elegir implementación por variable de entorno | **Injection tokens** + `useClass` / `useFactory` | Las `interface` no existen en tiempo de ejecución, por eso Nest necesita un token. Muy buena excusa para entender qué es "borrar tipos" |
| Router + controller de Express | **Controllers** (`@Controller`, `@Get`, `@Post`) | Lo mismo con otra sintaxis |
| Validación con Zod en un middleware | **Pipes** (`ZodValidationPipe` o `class-validator`) | La validación sigue siendo una capa aparte |
| Error handler + `AppError` | **Exception filters** | Mismo patrón: traducir errores de dominio a status HTTP |
| Middleware de auth + chequeo de rol | **Guards** + decorador `@Roles()` | Separar "quién sos" de "qué podés hacer" |
| Event bus propio | `@nestjs/event-emitter` | Mismo desacople, ya hecho |
| Reloj y gateways inyectados | Providers con token (`CLOCK`, `HOLIDAYS_GATEWAY`) | Igual: todo lo que cambia o es externo se inyecta |
| Tests de casos de uso con dobles armados a mano | `Test.createTestingModule()` + `overrideProvider` | Cómo reemplazar dependencias en un contenedor |

Y un momento muy potente en clase: **los casos de uso y el dominio se copian a Nest sin tocar una línea.** Solo cambian la capa HTTP y el "pegamento". Es la prueba concreta de que la arquitectura en capas sirvió. Si el alumno no lo vive, "la lógica no tiene que depender del framework" queda como una frase.

Las 4 clases de Express no se pierden: Nest corre **sobre** Express (es su adaptador por defecto). `req`, `res`, middlewares y status codes siguen ahí abajo, y aparecen apenas algo falla.

### Detalles a tener en cuenta con Nest

- **Testing:** Nest trae Jest por defecto. Los tests de casos de uso (clase 6) son de TypeScript puro y siguen con Vitest sin cambios. Para tests que usan el contenedor de Nest con Vitest hace falta un plugin de SWC (`unplugin-swc`) que entienda los decoradores. Alternativa: usar Jest en la fase Nest. Conviene decidirlo y no mezclar.
- **Generadores:** `nest g resource` genera un CRUD completo en segundos, igual que la IA. Sirve, pero en la primera clase de Nest conviene escribir un módulo **a mano**, y recién después mostrar el generador.
- **Validación:** la documentación de Nest usa `class-validator` (DTOs con decoradores), pero se puede seguir con Zod (con un pipe). Recomiendo **Zod**: se reutiliza lo de la clase 4 y es lo que más se ve en proyectos nuevos de TypeScript. Igual conviene mostrar `class-validator`, porque aparece mucho en código existente.
- **Versión:** hoy Nest va por la 12. Fijar la versión en el material, porque los ejemplos de internet (y los de la IA) a veces son de versiones viejas.

---

## 4. propuesta de temario (16 clases)

Criterios:

- Comprimir lo que **no** debería ocupar clases presenciales para quien ya sabe (fundamentos de JS) y moverlo a una **nivelación** previa.
- **TypeScript desde la clase 2**: no como tema aparte al final, sino como el idioma del curso.
- **Express para entender, Nest para trabajar**: la arquitectura se construye a mano y después se migra.
- **Testing antes de migrar** (clase 6, no 14): los tests son la red que dice si la migración a Nest (hecha con IA o no) mantuvo el comportamiento.
- Las bases y Docker entran **cuando hacen falta**, y ya en Nest: cada base es un provider más.

| # | Bloque | Teoría | Práctica | Cambio respecto de hoy |
|---|---|---|---|---|
| 0 | Nivelación (asíncrona, antes de empezar) | JS moderno, asincronismo, módulos, Git | Ejercicios autocorregibles + diagnóstico | **Nuevo**: saca de las clases lo que hoy son la 1, 2 y 3 |
| 1 | Fundamentos | Node, npm, `fetch`, async/await en serio; Git y GitHub (ramas, pull requests). Reglas del uso de IA en la materia | Primer script; repo del proyecto integrador | Fusión de las clases 1 + 2 |
| 2 | Fundamentos | **TypeScript esencial**: tipos, interfaces, uniones, `type` vs `interface`, genéricos básicos, `unknown` vs `any` | Pasar los scripts de la clase 1 a TS; `tsc --noEmit` | **Nuevo** |
| 3 | Express | HTTP, Express con TS, routing, middlewares, diseño REST, status codes | CRUD en memoria (todo en un archivo, a propósito) | Fusión de las clases 4 + 5 |
| 4 | Express | Validación con **Zod** (`z.infer`: el esquema genera el tipo) + error handler | Validación y errores estandarizados | Clase 6, ahora con tipos |
| 5 | Arquitectura | Capas, casos de uso, **el DAO como `interface`**, inyección manual con factories y contenedor | Extraer casos de uso; DAO en memoria; `container.ts` | Fusión de las clases 7 + 8: TS hace explícito el "puerto" |
| 6 | Calidad | **Testing** de casos de uso con Vitest (sin infraestructura) | Tests de los casos de uso existentes | **Se adelanta** desde la clase 14 |
| 7 | NestJS | **Nest I**: por qué un framework; módulos, controllers, providers; el contenedor de Nest vs el nuestro; injection tokens; por qué hace falta compilar | **Migración**: casos de uso y dominio se copian tal cual; se reescriben controllers y "pegamento". Los tests de la clase 6 tienen que seguir pasando | **Nuevo** |
| 8 | NestJS | **Nest II**: pipes (Zod), exception filters, `ConfigModule`, ciclo de vida de un request; tests con `Test.createTestingModule` | Validación y errores en Nest; test de un controller con providers reemplazados | **Nuevo** |
| 9 | Infraestructura | **Docker**: imagen, contenedor, volumen, puertos, `docker compose` | Levantar Postgres y Mongo con un `compose.yaml` | **Nuevo** |
| 10 | Persistencia | **PostgreSQL** + SQL básico + **Prisma/Drizzle**: esquema, migraciones, relaciones | Adaptador Postgres del DAO como provider, elegido por configuración (`useFactory`) | Reemplaza la clase 9 (Sequelize + SQLite) |
| 11 | Persistencia | **MongoDB** + Mongoose: documentos vs tablas, embeber vs referenciar, cuándo cada una | Tercer adaptador: el mismo caso de uso con memoria, Postgres y Mongo | **Nuevo**. Se ve en la práctica la promesa de la arquitectura |
| 12 | Reglas de negocio | Relación N a N, **transacciones**, reglas cruzadas, reloj inyectado, status codes | Módulo de préstamos con sus reglas y sus tests | Fusión de las clases 10 (préstamos) + 13 |
| 13 | Seguridad | JWT, hash de contraseñas, **guards**, decorador `@Roles()`. **Eventos** con `@nestjs/event-emitter` | Proteger endpoints + alertas por evento | Fusión de las clases 10 (eventos) + 11, en versión Nest |
| 14 | Consumo externo | `fetch` a APIs externas, gateway como provider, timeouts, degradación, CSV | Catálogo externo + exportación | Clase 12 en versión Nest |
| 15 | Entrega | Swagger con `@nestjs/swagger`, README, **dockerizar la app**, **CI con GitHub Actions** (tests en cada PR) | Proyecto completo levantable con un solo `docker compose up` | Clase 15 + Docker + CI |
| 16 | Cierre | — | Simulacro de examen | Igual |

### Lo que se pierde (hay que decirlo)

- **Fundamentos presenciales**: quien no sabe JS depende de la nivelación. Sin un buen material previo y un diagnóstico, esos alumnos quedan afuera desde la clase 2. Con Nest esto pesa más: es un framework con muchas capas de abstracción.
- **Profundidad en eventos y reglas finas**: pasan a compartir clase con otros temas.
- **Margen para feriados**: hoy hay un plan B para 12 clases; con esta propuesta casi no queda aire. Plan B sugerido: fusionar Nest I y II en una sola clase (la migración queda como tarea), y fusionar Docker con Postgres.

### Alternativa más conservadora (opción C)

Express todo el curso, como hoy, más TypeScript, Docker, Postgres y Mongo. Nest entra en las clases 13–14 como **migración final**: el alumno pasa su proyecto entero a Nest. Es menos Nest, pero es la versión con menos riesgo para el primer año del cambio, y deja el material actual casi intacto. Si se elige esta, conviene igual escribir el código del curso pensando en la migración (casos de uso sin dependencias de Express).

---

## 5. cómo manejar niveles distintos

### Antes de empezar

- **Diagnóstico** en la primera semana: un ejercicio corto de JS (asincronismo, arreglos, objetos). No pone nota: sirve para saber con quién se cuenta.
- **Nivelación asíncrona** (clase 0): material + ejercicios con autocorrección (por ejemplo, con tests ya escritos que el alumno tiene que hacer pasar). Los tests como herramienta de nivelación hacen que la corrección sea instantánea.

### En cada clase: piso, esperado y techo

Las consignas ya tienen un "Opcional avanzado". La propuesta es formalizarlo en tres niveles:

| Nivel | Para quién | Ejemplo (clase de testing) | Ejemplo (clase Nest I) |
|---|---|---|---|
| **Piso** | Lo mínimo para seguir con la clase siguiente. Todos | Tests de las funciones puras y de una regla con sus 4 casos | Un módulo migrado (libros) con su controller y su provider |
| **Esperado** | Lo que pide la evaluación | La consigna completa | Toda la app migrada, con los tests en verde |
| **Techo** | Los que están a full | Test de contrato del DAO, TDD de una regla nueva, CI | Módulo dinámico (`forRoot`) para elegir la persistencia; interceptor de logging |

Así nadie se aburre y nadie se queda atrás sin saber qué es lo imprescindible.

### En la práctica

- **Programación en pares que mezclen niveles**, rotando los roles (uno escribe, el otro dirige). El avanzado aprende explicando, que es justamente lo que la IA no le exige.
- **Alumnos avanzados como mentores** en la nivelación (puede sumar algo en la nota de concepto). Los que ya saben Nest suelen saberlo "de memoria": pedirles que expliquen la tabla de equivalencias de la sección 3 es un buen desafío para ellos.
- **El proyecto integrador sigue siendo uno solo, y crece**: es lo que mejor funcionó este cuatrimestre, y le da a cada uno un lugar concreto donde ver su avance. La migración a Nest pasa sobre ese mismo proyecto.

---

## 6. la IA: asumirla y cambiar la evaluación

Prohibirla no funciona, y además el mercado espera que se sepa usar. Lo que sí cambia es **qué evaluar**: si el código lo puede escribir una IA, lo que vale es **entenderlo, decidir y verificar**.

Con Nest esto pesa más: es un framework muy convencional, con mucho código público, y la IA lo genera muy bien. Un proyecto Nest "que anda" no demuestra nada por sí solo.

### En las clases

| Etapa | Uso de IA | Por qué |
|---|---|---|
| Nivelación y clases 1–5 | **Limitado**: autocompletar sí, pedirle el ejercicio entero no | Sin fundamentos (y sin haber armado la inyección a mano) no se puede revisar lo que la IA genera |
| Clases 6–8 | **Guiado**: con `AGENTS.md`, specs (SDD) y tests como red (como en `clases/14_clase/prompt-agente.md`). La migración a Nest es el caso ideal: "migrá esto; los tests tienen que seguir pasando" | Aprender a usarla bien es parte del contenido |
| Clases 9–15 | **Libre**, con revisión obligatoria | Así se trabaja |

Y un contenido explícito, repartido en varias clases: **cómo revisar código ajeno** (generado o no). Leer un diff, encontrar el bug, preguntar "¿por qué esta línea?". Es la habilidad que más sube de valor cuando el código es barato.

### En la evaluación

- **Defensa oral individual del trabajo integrador**: "explicame esta línea", "¿qué pasa si saco este `@Injectable()`?", "¿por qué acá hay un token y no la interfaz?", "agregá esta regla ahora, delante mío". Diez minutos por alumno alcanzan para saber si lo entiende.
- **Parcial / simulacro presencial** con un enunciado nuevo y un tiempo acotado, como el que ya está previsto. Se puede permitir la IA y evaluar el resultado con tests ocultos, o no permitirla. Hay que decidirlo y avisarlo desde el primer día.
- **Ejercicios de lectura**: se entrega código (hecho con IA, a propósito) con bugs sutiles, y el alumno tiene que encontrarlos y escribir el test que los demuestra.
- **El proceso también cuenta**: historial de commits, specs aprobadas y tests. Un proyecto que aparece completo en un solo commit dice mucho.

---

## 7. qué pide el mercado (junior backend Node / TypeScript)

Lo que más se repite en las búsquedas, ordenado de más a menos, y si la propuesta lo cubre:

| Habilidad | ¿Cubierto? |
|---|---|
| JavaScript / **TypeScript** | Sí (clases 0–2 y en todo el curso) |
| Node.js + **NestJS** o Express + APIs REST | Sí, los dos (Express 3–6, Nest 7–15) |
| **SQL** + PostgreSQL + un ORM | Sí (clase 10) |
| **Git** y flujo de pull requests | Sí (clase 1 y en todo el curso) |
| **Testing** | Sí (clase 6 y en todo el curso) |
| **Docker** | Sí, a nivel de uso (clases 9 y 15) |
| Autenticación (JWT) y autorización (roles) | Sí (clase 13) |
| NoSQL / MongoDB | Sí (clase 11) |
| Documentación de APIs (OpenAPI/Swagger) | Sí (clase 15) |
| CI/CD | Lo básico (clase 15) |
| Uso de asistentes de IA, con criterio | Sí, como contenido transversal |
| Frontend (React / Next.js) | **No**: queda para otra materia (o un track optativo, si no hay otra materia que lo vea) |
| Cloud (AWS, GCP), Kubernetes, microservicios | **No**, y no conviene: es para más adelante |

### Lo que conviene NO meter (aunque lo pidan)

Nest invita a sumar cosas porque "ya vienen":

- **Microservicios** (`@nestjs/microservices`), **CQRS** (`@nestjs/cqrs`), colas de mensajes: demasiado para este nivel. Mejor una sola app bien hecha.
- **GraphQL** (`@nestjs/graphql`): aparece en las búsquedas, pero REST bien hecho sigue siendo la base.
- **Kubernetes y despliegue en la nube**: con `docker compose` alcanza. Si sobra tiempo, un deploy a un servicio con capa gratuita, como techo.

---

## 8. preguntas para la cátedra antes de decidir

1. ¿**Nest desde la clase 7** (opción B) o **solo al final** (opción C)? Define cuánto del material actual se reescribe.
2. ¿El **final** se rinde en Nest o en Express? (O "en cualquiera de los dos, con la arquitectura en capas", que es lo que de verdad se evalúa.) Hay que definirlo antes, porque cambia los finales modelo ("sensores", "hotel").
3. ¿Se puede pedir **nivelación previa obligatoria** con un diagnóstico, o tiene que entrar todo en las 16 clases?
4. ¿Las máquinas del laboratorio (o las de los alumnos) pueden correr **Docker**? En Windows hace falta WSL2 y bastante memoria: hay que probarlo antes. Como plan B, Postgres y Mongo en la nube con capa gratuita (Neon / Supabase, MongoDB Atlas).
5. ¿**Jest o Vitest**? Nest trae Jest; Vitest es más moderno pero necesita un plugin para los decoradores. Lo importante es elegir uno para todo el curso.
6. ¿Qué **política de IA** se adopta, y cómo cambia la evaluación? Conviene definirla por escrito y comunicarla el primer día.
7. ¿Se mantiene un solo **proyecto integrador** que crece clase a clase? (Recomendado: sí, y la migración a Nest pasa sobre ese proyecto.)

---

## 9. cómo hacer la transición sin rehacer todo

El material de este cuatrimestre se aprovecha casi entero:

| Material actual | Qué hacer |
|---|---|
| Clases 1–3 (fundamentos) | Se convierten en la **nivelación**, con ejercicios autocorregibles |
| Clases 4–8 | Se pasan a **TypeScript**: el contenido conceptual queda igual. Siguen en Express |
| Clase 9 (Sequelize + SQLite) | Se reescribe con **Postgres + Prisma/Drizzle + Docker**, ya en Nest |
| Clases 10–13 | Se reagrupan (préstamos + reglas, eventos + seguridad) y se pasan a Nest. **Los casos de uso casi no cambian**: cambian el contenedor, los controllers y los middlewares (que pasan a ser guards, pipes y filters) |
| Clase 14 (testing) | Se adelanta a la clase 6, antes de la migración |
| Clases 15–16 | Se suman Swagger de Nest, Docker de la app y CI |
| **Nuevo** | Clase de TypeScript, 2 clases de Nest, clase de Docker, clase de Mongo |

**Orden sugerido para preparar el material:** TypeScript (afecta a todo) → testing temprano → migración a Nest (clases 7–8) → Docker + Postgres → Mongo → pasar a Nest las clases de reglas, seguridad y consumo externo.

Un orden de magnitud del trabajo: migrar el proyecto integrador a TypeScript + Nest + Prisma es un trabajo de días, no de semanas, y es el tipo de trabajo donde un agente de IA ayuda mucho, **siempre que haya tests que digan si el resultado se sigue comportando igual**. Por eso los tests de la clase 14 conviene tenerlos **antes** de migrar: son exactamente lo que se le va a pedir a los alumnos en la clase 7.
