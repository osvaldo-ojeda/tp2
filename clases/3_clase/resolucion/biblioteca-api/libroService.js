const fs = require("fs/promises");
const path = require("path");

const FILE_PATH = path.join(__dirname, "data", "libros.json");

/**
 * Lee el archivo libros.json y lo parsea como un array de objetos.
 * @returns {Promise<Array>} Array de libros
 */
async function listarLibros() {
  try {
    const data = await fs.readFile(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

/**
 * Busca un libro por su ID.
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function buscarPorId(id) {
  const libros = await listarLibros();
  return libros.find((libro) => libro.id === Number(id)) || null;
}

/**
 * Filtra los libros por coincidencia parcial de autor (case-insensitive).
 * @param {string} autor
 * @returns {Promise<Array>}
 */
async function buscarPorAutor(autor) {
  const libros = await listarLibros();
  const termino = autor.toLowerCase();
  return libros.filter((libro) => libro.autor.toLowerCase().includes(termino));
}

/**
 * Cuenta cuántos libros tienen stock mayor a cero.
 * @returns {Promise<number>}
 */
async function contarConStock() {
  const libros = await listarLibros();
  return libros.filter((libro) => libro.stock > 0).length;
}

/**
 * Agrega un nuevo libro asignándole un ID autoincremental y persiste la lista en el JSON.
 * @param {Object} libro - Objeto del libro (sin id)
 * @returns {Promise<Object>} Libro creado con su ID asignado
 */
async function agregarLibro(libro) {
  const libros = await listarLibros();
  
  const ids = libros.map((l) => l.id);
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

  const nuevoLibro = {
    id: nextId,
    ...libro,
  };

  libros.push(nuevoLibro);

  await fs.writeFile(FILE_PATH, JSON.stringify(libros, null, 2), "utf-8");

  return nuevoLibro;
}

module.exports = {
  listarLibros,
  buscarPorId,
  buscarPorAutor,
  contarConStock,
  agregarLibro,
};
