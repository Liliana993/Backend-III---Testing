
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

import CustomError from "../errors/CustomError.js";
import { ERROR_TYPES } from "../constants/index.js";
import logger from "./logger.config.js";

// Directorio principal de almacenamiento
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// Tamaño máximo: 5 MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // Tamaño máximo en bytes
export const MAX_FILES = 5; // Número máximo de archivos por solicitud

// Directorios permitidos para cada categoría
export const UPLOAD_DESTINATIONS = Object.freeze({
  userDocuments: path.join(UPLOAD_DIR, "users", "documents"),
  userLicenses: path.join(UPLOAD_DIR, "users", "licenses"),
  deliveryProofs: path.join(UPLOAD_DIR, "deliveries", "proofs")
});

// Extensiones y tipos MIME permitidos
const ALLOWED_FILE_TYPES = {
  ".pdf": ["application/pdf"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"]
};

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const destination = UPLOAD_DESTINATIONS[req.uploadCategory];

    if (!destination) {
      return callback(
        CustomError.createError({
          name: ERROR_TYPES.FILE_UPLOAD_ERROR,
          cause: "No se especificó un directorio de almacenamiento válido"
        })
      );
    }

    try {
      fs.mkdirSync(destination, { recursive: true });
      callback(null, destination);
    } catch (error) {
      callback(
        CustomError.createError({
          name: ERROR_TYPES.FILE_UPLOAD_ERROR,
          cause: error.message
        })
      );
    }
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    // Nombre único para evitar sobrescribir archivos
    const filename = `${Date.now()}-${randomUUID()}${extension}`;

    callback(null, filename);
  }
});

// Validación del tipo de archivo
const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedMimes = ALLOWED_FILE_TYPES[extension];

  if (!allowedMimes || !allowedMimes.includes(file.mimetype)) {
    logger.warning("Intento de carga de archivo no permitido", {
      originalName: file.originalname,
      mimetype: file.mimetype,
      extension
    });

    return callback(
      CustomError.createError({
        name: ERROR_TYPES.INVALID_FILE_TYPE,
        cause: `Archivo rechazado: ${file.originalname} (${file.mimetype})`
      })
    );
  }

  callback(null, true);
};

// Instancia centralizada de Multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES
  }
});

export default upload;
