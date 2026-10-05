const {
  listarLibros,
  buscarPorId,
  buscarPorAutor,
  contarConStock,
  agregarLibro,
} = require("./libroService");

async function main() {
  console.log("=== PRUEBAS DE LIBROSERVICE (PERSISTENCIA CON JSON) ===\n");

  // 1. Listar libros iniciales
  console.log("1. Listado inicial de libros:");
  const librosIniciales = await listarLibros();
  console.log(librosIniciales);
  console.log(`Total de libros: ${librosIniciales.length}\n`);

  // 2. Buscar por ID
  console.log("2. Buscar libro con ID 1:");
  const libroId1 = await buscarPorId(1);
  console.log(libroId1);
  console.log("");

  // 3. Buscar por autor
  console.log("3. Buscar libros del autor 'George Orwell':");
  const orwell = await buscarPorAutor("George Orwell");
  console.log(orwell);
  console.log("");

  // 4. Contar con stock
  console.log("4. Libros con stock disponible:");
  const conStock = await contarConStock();
  console.log(`Cantidad con stock > 0: ${conStock}\n`);

  // 5. Agregar un libro nuevo
  console.log("5. Agregando un nuevo libro...");
  const nuevo = await agregarLibro({
    isbn: "9788437604947",
    titulo: "Ficciones",
    autor: "Jorge Luis Borges",
    stock: 4,
    fechaAlta: new Date().toISOString().split("T")[0],
  });
  console.log("Libro creado exitosamente:", nuevo);
  console.log("");

  // 6. Volver a listar para verificar la persistencia
  console.log("6. Listado actualizado luego de agregar (comprobación de persistencia):");
  const librosFinales = await listarLibros();
  console.log(librosFinales);
  console.log(`Total de libros actualizado: ${librosFinales.length}\n`);
}

main().catch((err) => {
  console.error("Error al ejecutar las pruebas:", err);
});
