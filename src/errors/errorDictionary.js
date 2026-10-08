import { ERROR_TYPES } from "../constants/index.js";

const ERROR_DICTIONARY = {
  [ERROR_TYPES.USER_NOT_FOUND]: {
    status: 404,
    message: "Usuario no encontrado"
  },

  [ERROR_TYPES.ORDER_NOT_FOUND]: {
    status: 404,
    message: "Pedido no encontrado"
  },
  
  [ERROR_TYPES.ROUTE_NOT_FOUND]: {
  status: 404,
  message: "Ruta no encontrada"
  },

  [ERROR_TYPES.DELIVERY_NOT_FOUND]: {
    status: 404,
    message: "Delivery no encontrado"
  },

  [ERROR_TYPES.INVALID_STATUS]: {
    status: 400,
    message: "Estado inválido"
  },

  [ERROR_TYPES.INVALID_QUANTITY]: {
    status: 400,
    message: "La cantidad debe ser un número entero positivo entre 1 y 50"
  },

  [ERROR_TYPES.MOCK_GENERATION_ERROR]: {
    status: 500,
    message: "Error al generar los datos de prueba"
  },

  [ERROR_TYPES.MOCK_DATABASE_ERROR]: {
    status: 500,
    message: "Error al guardar los datos de prueba en la base de datos"
  },

  [ERROR_TYPES.VALIDATION_ERROR]: {
    status: 400,
    message: "Error de validación"
  },

  [ERROR_TYPES.DATABASE_ERROR]: {
    status: 500,
    message: "Error de base de datos"
  }
};

export default ERROR_DICTIONARY;