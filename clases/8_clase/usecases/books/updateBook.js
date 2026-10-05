import AppError from "../../errors/AppError.js";

/**
 * Caso de Uso: Actualizar un libro existente.
 * Regla de negocio opcional: El stock no puede ser menor a 0 si se envía.
 */
async function updateBook(id, changes, dao) {
  if (changes.stock !== undefined && changes.stock < 0) {
    throw new AppError("INVALID_STOCK", "El stock no puede ser negativo", 400);
  }

  return dao.update(id, changes);
}

export default updateBook;
