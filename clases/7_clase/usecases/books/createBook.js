import AppError from "../../errors/AppError.js";

/**
 * Caso de Uso: Crear un nuevo libro.
 * Aplica la regla de negocio: Si se proporciona ISBN, no debe estar duplicado.
 */
async function createBook(data, dao) {
  if (data.isbn) {
    const existingBook = await dao.getByIsbn(data.isbn);
    if (existingBook) {
      throw new AppError("ISBN_DUPLICATE", "Ese ISBN ya está registrado", 409);
    }
  }

  return dao.save(data);
}

export default createBook;
