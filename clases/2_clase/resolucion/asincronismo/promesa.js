// Ejercicio 1.2 — la misma búsqueda, devolviendo una Promise
const libros = require("../data/libros");

function buscarLibroPorId(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const libro = libros.find((l) => l.id === id);
      if (!libro) {
        reject(new Error(`No existe un libro con id ${id}`));
        return;
      }
      resolve(libro);
    }, 500);
  });
}

buscarLibroPorId(3)
  .then((libro) => console.log("Encontrado (promesa):", libro))
  .catch((error) => console.error("Error:", error.message));

buscarLibroPorId(999)
  .then((libro) => console.log("Encontrado (promesa):", libro))
  .catch((error) => console.error("Error:", error.message));
