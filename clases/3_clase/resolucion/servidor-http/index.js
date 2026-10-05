const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = process.env.PORT || 3000;
const LIBROS_PATH = path.join(__dirname, "..", "biblioteca-api", "data", "libros.json");

const server = http.createServer(async (req, res) => {
  // 3. Loggear en consola por cada request el método y la URL
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Configurar header genérico para respuestas JSON
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // 2. Routing de endpoints
  if (req.method === "GET" && req.url === "/") {
    res.statusCode = 200;
    res.end(JSON.stringify({ mensaje: "Biblioteca API" }));
  } else if (req.method === "GET" && req.url === "/libros") {
    try {
      const data = await fs.readFile(LIBROS_PATH, "utf-8");
      const libros = JSON.parse(data);
      res.statusCode = 200;
      res.end(JSON.stringify(libros));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Error al leer el archivo de libros" }));
    }
  } else if (req.method === "POST" && req.url === "/eco") {
    // --------------------------------------------------------------------------
    // Explicación / Pseudocódigo de lectura del Body en Node.js puro:
    //
    // En Node.js puro (sin Express), `req` es un Stream (flujo de datos de red).
    // Los datos no llegan de golpe, sino en trozos ("chunks") a medida que viajan.
    //
    // PSEUDOCÓDIGO:
    // 1. Crear una lista vacía para guardar los trozos: `bodyChunks = []`
    // 2. MIENTRAS lleguen trozos de datos (evento 'data'):
    //       guardar el trozo recibido en la lista
    // 3. CUANDO termine de llegar el cuerpo (evento 'end'):
    //       unir todos los trozos en un solo texto (Buffer -> String)
    //       convertir ese texto a un objeto JavaScript (JSON.parse)
    //       responder al cliente con el objeto procesado
    // --------------------------------------------------------------------------

    // 1. Lista acumuladora de trozos de datos (chunks)
    let bodyChunks = [];

    // 2. Escuchar el evento 'data': se dispara cada vez que llega un fragmento del body
    req.on("data", (chunk) => {
      bodyChunks.push(chunk);
    });

    // 3. Escuchar el evento 'end': se dispara cuando el cliente terminó de enviar la petición
    req.on("end", () => {
      try {
        // Unir todos los trozos (Buffers) y convertirlos a un String JSON
        const bodyBuffer = Buffer.concat(bodyChunks).toString();

        // Convertir la cadena de texto JSON a un Objeto JavaScript
        const parsedBody = bodyBuffer ? JSON.parse(bodyBuffer) : {};

        // Responder con status 200 y el objeto interpretado
        res.statusCode = 200;
        res.end(JSON.stringify({ eco: parsedBody }));
      } catch (error) {
        // Si el JSON estaba mal formado (error de sintaxis)
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON inválido en el cuerpo de la petición" }));
      }
    });
  } else {
    // Cualquier otra ruta o método → 404
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor HTTP iniciado en http://localhost:${PORT}`);
});
