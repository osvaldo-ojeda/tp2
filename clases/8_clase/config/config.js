/**
 * Módulo centralizado de configuración de la aplicación.
 * Lee las variables de entorno desde process.env (cargadas vía --env-file)
 * y exporta constantes fuertemente tipadas y con valores por defecto.
 */
const PORT = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

export { PORT, NODE_ENV };

