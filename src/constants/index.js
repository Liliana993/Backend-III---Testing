// Order constants
export const ORDER_STATUS = Object.freeze({
  CREATED: "created",
  ASSIGNED: "assigned",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
});

export const ORDER_PRIORITY = Object.freeze({
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high"
});


// Delivery constants
export const DELIVERY_STATUS = Object.freeze({
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered"
});

export const DELIVERY_PRIORITY = Object.freeze({
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high"
});

// Product constants
export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
  DISCONTINUED: "discontinued"
});

// User constants
export const USER_ROLE = Object.freeze({
  ADMIN: "admin",
  CUSTOMER: "customer",
  DRIVER: "driver",
  STORE: "store"
});

// Mocking parameters
export const MOCKING_PARAMETERS = Object.freeze({
  MAX: 50,
  DEFAULT: 10,
  DEFAULT_PASSWORD: "coder123"
});

// Tipos de errores
export const ERROR_TYPES = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  DELIVERY_NOT_FOUND: "DELIVERY_NOT_FOUND",
  INVALID_STATUS: "INVALID_STATUS",
  INVALID_QUANTITY: "INVALID_QUANTITY",
  MOCK_GENERATION_ERROR: "MOCK_GENERATION_ERROR",
  MOCK_DATABASE_ERROR: "MOCK_DATABASE_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
};