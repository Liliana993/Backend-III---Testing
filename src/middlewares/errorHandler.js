import ERROR_DICTIONARY from "../errors/errorDictionary.js";
import { ERROR_TYPES } from "../constants/index.js";

const errorHandler = (error, req, res, next) => {
  console.error(`[${error.name || "UNKNOWN_ERROR"}]`, error.message);

  // Error de Mongoose: ID con formato inválido
  if (error.name === "CastError") {
    return res.status(400).json({
      status: "error",
      error: ERROR_TYPES.VALIDATION_ERROR,
      message: "El identificador proporcionado no es válido",
      cause: `El valor "${error.value}" no tiene un formato válido para ${error.path}`
    });
  }

  const errorData = ERROR_DICTIONARY[error.name];

  const status = error.status || errorData?.status || 500;

  const message =
    error.message ||
    errorData?.message ||
    "Error interno del servidor";

  return res.status(status).json({
    status: "error",
    error: error.name || "INTERNAL_SERVER_ERROR",
    message,
    cause: error.cause || "No se proporcionó información adicional"
  });
};

export default errorHandler;