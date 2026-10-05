// Ejercicio 2 — Consumir una API externa (Open Library)
async function obtenerLibroPorIsbn(isbn) {
  const response = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);

  if (!response.ok) {
    throw new Error(`No se encontró el ISBN ${isbn} (status ${response.status})`);
  }

  const data = await response.json();
  return {
    titulo: data.title,
    cantidadPaginas: data.number_of_pages,
  };
}

async function main() {
  try {
    const libro = await obtenerLibroPorIsbn("9780307474728"); // ISBN real
    console.log("Encontrado:", libro);
  } catch (error) {
    console.error("Error:", error.message);
  }

  try {
    const libro = await obtenerLibroPorIsbn("0000000000000"); // ISBN inventado
    console.log("Encontrado:", libro);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Solo corre la prueba si el archivo se ejecuta directamente (node openLibrary.js),
// no cuando otro archivo lo importa con require (ver secuencialVsParalelo.js).
if (require.main === module) {
  main();
}

module.exports = obtenerLibroPorIsbn;
