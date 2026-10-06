import ERROR_DICTIONARY from "./errorDictionary.js";

class CustomError extends Error {
  constructor(name, cause = null, message = null) {
    const errorData = ERROR_DICTIONARY[name];

    super(message || errorData?.message || "Error interno del servidor");

    this.name = name;
    this.cause = cause;
    this.status = errorData?.status || 500;
  }

  static createError({ name, cause = null, message = null }) {
    return new CustomError(name, cause, message);
  }
}

export default CustomError;