/**
 * Caso de Uso: Eliminar un libro.
 * Devuelve `true` si fue eliminado o `false` si no existía.
 */
async function deleteBook(id, dao) {
  return dao.delete(id);
}

export default deleteBook;
