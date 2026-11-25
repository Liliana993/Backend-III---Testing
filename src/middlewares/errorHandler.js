import ERROR_DICTIONARY from "../errors/errorDictionary.js";
import { ERROR_TYPES } from "../constants/index.js";
import logger from "../config/logger.config.js";

const errorHandler = (error, req, res, next) => {
  // Evita intentar responder si la respuesta ya fue enviada.
  if (res.headersSent) {
    return next(error);
  }

  const isCastError = error.name === "CastError";
  const isValidationError = error.name === "ValidationError";
  const isMongooseValidationError = isCastError || isValidationError;

  const isPayloadTooLarge =
    error.type === "entity.too.large" || error.status === 413;

  const errorData = ERROR_DICTIONARY[error.name];

  const status = isMongooseValidationError
    ? 400
    : isPayloadTooLarge
      ? 413
      : error.status || errorData?.status || 500;

  const message = isCastError
    ? "El identificador proporcionado no es válido"
    : isPayloadTooLarge
      ? ERROR_DICTIONARY[ERROR_TYPES.PAYLOAD_TOO_LARGE].message
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
    errorName: isPayloadTooLarge
      ? ERROR_TYPES.PAYLOAD_TOO_LARGE
      : error.name || "UNKNOWN_ERROR",
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
    error: isPayloadTooLarge
      ? ERROR_TYPES.PAYLOAD_TOO_LARGE
      : isMongooseValidationError
        ? ERROR_TYPES.VALIDATION_ERROR
        : error.name || "INTERNAL_SERVER_ERROR",
    message,
    cause
  });
};

export default errorHandler;
