/**
 * Caso de Uso: Obtener todos los libros con soporte para filtros y ordenamiento.
 * Recibe los filtros y el `dao` como dependencia (Inversión de Dependencias).
 */
async function getBooks(filters = {}, dao) {
  // Si solo se pasa el dao como primer argumento por compatibilidad
  if (filters && typeof filters.getAll === "function" && !dao) {
    dao = filters;
    filters = {};
  }

  let books = await dao.getAll();

  const { author, autor, isbn, sort, page, limit } = filters;
  const filterAuthor = autor || author;

  // 1. Filtrar por autor (soporta 'autor' o 'author')
  if (filterAuthor) {
    const term = filterAuthor.toLowerCase();
    books = books.filter((b) => (b.autor || b.author || "").toLowerCase().includes(term));
  }

  // 2. Filtrar por ISBN
  if (isbn) {
    books = books.filter((b) => b.isbn === isbn);
  }

  // 3. Ordenamiento (?sort=titulo o ?sort=-titulo)
  if (sort) {
    const desc = sort.startsWith("-");
    const field = desc ? sort.slice(1) : sort;

    const resolveField = (item, f) => {
      if (f === "author") return item.autor ?? item.author;
      if (f === "title") return item.titulo ?? item.title;
      return item[f];
    };

    books.sort((a, b) => {
      const valA = resolveField(a, field) ?? "";
      const valB = resolveField(b, field) ?? "";
      if (valA < valB) return desc ? 1 : -1;
      if (valA > valB) return desc ? -1 : 1;
      return 0;
    });
  }

  // 4. Paginación (si vienen page y limit)
  if (page && limit) {
    const startIndex = (page - 1) * limit;
    books = books.slice(startIndex, startIndex + limit);
  }

  return books;
}

export default getBooks;
