import logger from "../config/logger.config.js";

class LoggerService {
  testLevels() {
    logger.debug("Mensaje de prueba nivel DEBUG");
    logger.http("Mensaje de prueba nivel HTTP");
    logger.info("Mensaje de prueba nivel INFO");
    logger.warning("Mensaje de prueba nivel WARNING");
    logger.error("Mensaje de prueba nivel ERROR");
    logger.fatal("Mensaje de prueba nivel FATAL");

    return {
      message: "Todos los niveles de logging fueron ejecutados correctamente"
    };
  }
}

export default new LoggerService();