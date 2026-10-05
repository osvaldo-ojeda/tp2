// Ejercicio 1.1 — buscarLibroPorId con callback
const libros = require("../data/libros");

function buscarLibroPorId(id, callback) {
  setTimeout(() => {
    const libro = libros.find((l) => l.id === id);
    if (!libro) {
      callback(new Error(`No existe un libro con id ${id}`));
      return;
    }
    callback(null, libro);
  }, 500);
}

buscarLibroPorId(2, (error, libro) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log("Encontrado (callback):", libro);
});

buscarLibroPorId(999, (error, libro) => {
  if (error) {
    console.error("Error:", error.message);
    return;
  }
  console.log("Encontrado (callback):", libro);
});
