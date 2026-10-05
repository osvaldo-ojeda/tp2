// Ejercicio 3 — Secuencial vs paralelo
const obtenerLibroPorIsbn = require("./openLibrary");

const isbns = [
  "9780307474728",
  "9780345391803",
  "9780140449136",
  "9780061120084",
  "9780452284234",
];
// Nota: la consigna sugiere "9780393312838" como quinto ISBN, pero al día de escribir
// esta resolución Open Library lo devuelve como 404 (los datos de esa API cambian con
// el tiempo). Se reemplazó por otro ISBN real que sí responde. Si a ustedes también les
// da 404 alguno de estos, no es un bug del código: prueben con otro ISBN válido.

async function buscarSecuencial(isbns) {
  const resultados = [];
  for (const isbn of isbns) {
    const libro = await obtenerLibroPorIsbn(isbn);
    resultados.push(libro);
  }
  return resultados;
}

async function buscarParalelo(isbns) {
  return Promise.all(isbns.map((isbn) => obtenerLibroPorIsbn(isbn)));
}

async function main() {
  console.time("secuencial");
  const secuencial = await buscarSecuencial(isbns);
  console.timeEnd("secuencial");
  console.log(`Secuencial: ${secuencial.length} libros`);

  console.time("paralelo");
  const paralelo = await buscarParalelo(isbns);
  console.timeEnd("paralelo");
  console.log(`Paralelo: ${paralelo.length} libros`);

  // Conclusión:
  // El secuencial tarda aprox. la SUMA de los 5 tiempos de red (uno atrás del otro,
  // porque cada await bloquea el siguiente hasta que termina el anterior).
  // El paralelo tarda aprox. lo que tarda la request MÁS LENTA de las 5, porque las
  // 5 se disparan casi al mismo tiempo y Promise.all espera a que terminen todas.
  //
  // Cuándo NO conviene Promise.all: cuando un paso depende del resultado del anterior
  // (ej: necesito el id de una consulta para poder pedir el siguiente dato), o cuando
  // hacer muchos requests en paralelo puede saturar la API externa (rate limiting) o
  // la propia conexión — ahí conviene secuencial, o paralelo pero limitado (de a lotes).
}

main();
