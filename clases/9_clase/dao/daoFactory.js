import { PERSISTENCE_TYPE } from "../config/config.js";
import booksMemoryDao from "./BooksMemoryDao.js";
import booksSequelizeDao from "./BooksSequelizeDao.js";

/**
 * Factory de DAOs.
 * Retorna la instancia de DAO correcta dependiendo de la variable de entorno.
 */
function getBooksDao() {
  if (PERSISTENCE_TYPE === "sequelize") {
    console.log("[Persistencia] Usando Sequelize (SQLite/SQL)");
    return booksSequelizeDao;
  } else {
    console.log("[Persistencia] Usando Memoria (Array JS)");
    return booksMemoryDao;
  }
}

export { getBooksDao };
