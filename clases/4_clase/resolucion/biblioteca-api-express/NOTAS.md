# Notas

## Ejercicio 1.5 — versión de Express instalada

- Versión instalada: **5.2.1** (`npm install express` sin fijar versión).
- Símbolo en `package.json`: **`^5.2.1`** (caret).
- Qué significa `^`: npm puede actualizar a cualquier `5.x.x` (MINOR y PATCH nuevos), pero **nunca** salta a `6.0.0` (MAJOR), porque un cambio de MAJOR puede romper compatibilidad.

## Desafío — por qué PATCH no es idempotente y PUT sí

- `PUT /libros/:id` **reemplaza** el recurso completo con el body enviado. Mandarlo 1 vez o 5 veces seguidas deja el libro en el mismo estado final → idempotente.
- `PATCH /libros/:id` aplica una **modificación parcial**. Si la operación es relativa (ej: "sumale 1 al stock"), repetirla cambia el resultado cada vez → no idempotente. Aunque nuestro PATCH acá hace un merge de campos (que sí daría el mismo resultado repetido), la semántica del verbo no lo garantiza en general.
