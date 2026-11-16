import multer from "multer";
import CustomError from "../errors/CustomError.js";
import { ERROR_TYPES } from "../constants/index.js";
import logger from "../config/logger.config.js";

const ALLOWED_DOCUMENT_TYPES = ["DNI", "LICENSE", "OTHER"];

// Convierte los errores de Multer al formato general de ShipNow
export const handleUploadError = (error, req, res, next) => {
  if (!error) {
    return next();
  }

  let customError;

  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        customError = CustomError.createError({
          name: ERROR_TYPES.FILE_TOO_LARGE,
          cause: "El archivo supera el límite de 5 MB"
        });
        break;

      case "LIMIT_UNEXPECTED_FILE":
        customError = CustomError.createError({
          name: ERROR_TYPES.INVALID_FILE_FIELD,
          cause: `Campo recibido: ${error.field}`
        });
        break;

      case "LIMIT_FILE_COUNT":
        customError = CustomError.createError({
          name: ERROR_TYPES.INVALID_FILE_FIELD,
          cause: "Se permite un máximo de 5 archivos por solicitud"
        });
        break;

      default:
        customError = CustomError.createError({
          name: ERROR_TYPES.FILE_UPLOAD_ERROR,
          cause: error.message
        });
    }
  } else {
    customError = error;
  }

  logger.warning("Error durante la carga de archivos", {
    method: req.method,
    url: req.originalUrl,
    error: customError.name,
    message: customError.message,
    cause: customError.cause
  });

  next(customError);
};

// Comprueba que el archivo haya sido recibido
export const validateUploadedFile = (req, res, next) => {
  if (!req.file) {
    return next(
      CustomError.createError({
        name: ERROR_TYPES.FILE_REQUIRED,
        cause: "No se recibió ningún archivo en la solicitud"
      })
    );
  }

  next();
};

// Valida el tipo de documento
export const validateDocumentType = async (req, res, next) => {
  const { documentType } = req.body;

  if (!ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
    if (req.file?.path) {
      const fs = await import("fs/promises");
      await fs.unlink(req.file.path).catch(() => {});
    }

    return next(
      CustomError.createError({
        name: ERROR_TYPES.INVALID_DOCUMENT_TYPE,
        cause: `Tipo de documento recibido: ${documentType || "no especificado"}`
      })
    );
  }

  next();
};

// Comprueba que se haya recibido al menos un archivo
export const validateUploadedFiles = (req, res, next) => {
  if (!Array.isArray(req.files) || req.files.length === 0) {
    return next(
      CustomError.createError({
        name: ERROR_TYPES.FILE_REQUIRED,
        cause: "No se recibió ningún comprobante en la solicitud"
      })
    );
  }

  next();
};