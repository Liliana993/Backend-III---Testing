
import ERROR_DICTIONARY from "../errors/errorDictionary.js";
import { ERROR_TYPES } from "../constants/index.js";
import logger from "../config/logger.config.js";

const errorHandler = (error, req, res, next) => {
  // Evita intentar responder si la respuesta ya fue enviada.
  if (res.headersSent) {
    return next(error);
  }

  const isCastError = error.name === "CastError";

  const errorData = ERROR_DICTIONARY[error.name];

  const status = isCastError
    ? 400
    : error.status || errorData?.status || 500;

  const message = isCastError
    ? "El identificador proporcionado no es válido"
    : error.message ||
      errorData?.message ||
      "Error interno del servidor";

  const cause = isCastError
    ? `El valor "${error.value}" no tiene un formato válido para ${error.path}`
    : error.cause ||
      "No se proporcionó información adicional";

  const logContext = {
    method: req.method,
    url: req.originalUrl,
    status,
    errorName: error.name || "UNKNOWN_ERROR",
    message,
    cause,
    stack: error.stack
  };

  if (status >= 500) {
    logger.error("Error del servidor", logContext);
  } else if (status >= 400) {
    logger.warning("Error en la solicitud", logContext);
  }

  return res.status(status).json({
    status: "error",
    error: isCastError
      ? ERROR_TYPES.VALIDATION_ERROR
      : error.name || "INTERNAL_SERVER_ERROR",
    message,
    cause
  });
};

export default errorHandler;
