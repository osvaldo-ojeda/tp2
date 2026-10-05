/**
 * Caso de Uso: Obtener un libro por ID.
 * Devuelve el libro o `null` si no existe.
 * La decisión de lanzar un error 404 es responsabilidad del controlador.
 */
async function getBookById(id, dao) {
  return dao.getById(id);
}

export default getBookById;
