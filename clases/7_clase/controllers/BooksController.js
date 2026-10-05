import AppError from "../errors/AppError.js";
import dao from "../dao/booksMemoryDao.js";
import getBooks from "../usecases/books/getBooks.js";
import getBookById from "../usecases/books/getBookById.js";
import createBook from "../usecases/books/createBook.js";
import updateBook from "../usecases/books/updateBook.js";
import deleteBook from "../usecases/books/deleteBook.js";

/**
 * Controlador de Libros basado en Clases.
 * Recibe la instancia del DAO a través de Inyección de Dependencias en el constructor.
 * Utiliza propiedades de flecha para preservar la referencia a `this.#dao` al pasarse como middleware en Express.
 */
class BooksController {
  // El prefijo '#' indica un campo privado de clase (ES2020).
  // Solo se puede acceder a `#dao` desde dentro de esta clase (encapsulamiento).
  #dao;

  constructor(daoDependency = dao) {
    this.#dao = daoDependency;
  }

  // GET /books (?autor=...&isbn=...&sort=...)
  list = async (req, res) => {
    const books = await getBooks(req.query, this.#dao);
    res.json(books);
  };

  // GET /books/:id
  get = async (req, res) => {
    const book = await getBookById(Number(req.params.id), this.#dao);
    if (!book) throw new AppError("BOOK_NOT_FOUND", "No existe un libro con ese id", 404);
    res.json(book);
  };

  // POST /books
  create = async (req, res) => {
    const book = await createBook(req.body, this.#dao);
    res.status(201).json(book);
  };

  // PUT /books/:id
  update = async (req, res) => {
    const book = await updateBook(Number(req.params.id), req.body, this.#dao);
    if (!book) throw new AppError("BOOK_NOT_FOUND", "No existe un libro con ese id", 404);
    res.json(book);
  };

  // DELETE /books/:id
  remove = async (req, res) => {
    const deleted = await deleteBook(Number(req.params.id), this.#dao);
    if (!deleted) throw new AppError("BOOK_NOT_FOUND", "No existe un libro con ese id", 404);
    res.status(204).send();
  };
}

export { BooksController };
export default new BooksController(dao);
