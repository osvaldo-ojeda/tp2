// Ejercicio 1.3 — la misma búsqueda, con async/await
// async/await es azúcar sintáctica para CONSUMIR una promesa; la Promise de adentro
// es la misma idea de promesa.js.
const libros = require("../data/libros");

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buscarLibroPorId(id) {
  await esperar(500);
  const libro = libros.find((l) => l.id === id);
  if (!libro) {
    throw new Error(`No existe un libro con id ${id}`);
  }
  return libro;
}

async function main() {
  try {
    const libro = await buscarLibroPorId(4);
    console.log("Encontrado (async/await):", libro);
  } catch (error) {
    console.error("Error:", error.message);
  }

  try {
    const libro = await buscarLibroPorId(999);
    console.log("Encontrado (async/await):", libro);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();
