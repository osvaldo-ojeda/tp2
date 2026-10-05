/**
 * Adaptador DAO en memoria para Libros utilizando Clases de ES6.
 * Todos los métodos son `async` para mantener la firma ante futuros adaptadores (ej: Sequelize).
 */
class BooksMemoryDao {
  // Campos privados (ES2020): protegidos de acceso o modificación directa desde fuera
  #books;
  #nextId;

  constructor(initialBooks = [
    { id: 1, titulo: "El principito", autor: "Saint-Exupéry", isbn: null, stock: 3 },
    { id: 2, titulo: "Cien años de soledad", autor: "García Márquez", isbn: null, stock: 1 },
  ]) {
    this.#books = [...initialBooks];
    this.#updateNextId();
  }

  // Recalcula el próximo ID basándose en el ID máximo actual en el arreglo
  #updateNextId() {
    const maxId = this.#books.reduce((max, book) => (book.id > max ? book.id : max), 0);
    this.#nextId = maxId + 1;
  }

  // Devuelve todos los libros utilizando una copia defensiva del array
  async getAll() {
    return [...this.#books];
  }

  // Busca un libro por su ID numérico
  async getById(id) {
    return this.#books.find((book) => book.id === Number(id)) ?? null;
  }

  // Busca un libro por su código ISBN
  async getByIsbn(isbn) {
    return this.#books.find((book) => book.isbn === isbn) ?? null;
  }

  // Guarda un nuevo libro asegurando que el ID sea autoincremental e ignorando IDs externos
  async save(data) {
    const { id: _ignored, ...bookData } = data;
    const maxId = this.#books.reduce((max, book) => (book.id > max ? book.id : max), 0);
    const assignedId = Math.max(this.#nextId, maxId + 1);

    const newBook = { id: assignedId, ...bookData };
    this.#books.push(newBook);
    this.#nextId = assignedId + 1;
    return newBook;
  }

  // Actualiza los campos especificados de un libro ignorando modificaciones al ID
  async update(id, changes) {
    const index = this.#books.findIndex((book) => book.id === Number(id));
    if (index === -1) return null;

    const { id: _ignored, ...allowedChanges } = changes;
    this.#books[index] = { ...this.#books[index], ...allowedChanges };
    return this.#books[index];
  }

  // Elimina un libro por ID
  async delete(id) {
    const index = this.#books.findIndex((book) => book.id === Number(id));
    if (index === -1) return false;

    this.#books.splice(index, 1);
    return true;
  }
}

// Exportamos la instancia por defecto y la clase por si se requiere instanciar nuevamente (ej: en tests)
export { BooksMemoryDao };
export default new BooksMemoryDao();
