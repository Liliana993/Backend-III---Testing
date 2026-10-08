import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "./env.config.js";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "green",
    http: "cyan",
    debug: "blue"
  }
};

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss"
  }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
  })
);

const consoleTransport = new winston.transports.Console({
  level: config.environment === "development" ? "debug" : "info"
});

const combinedTransport = new DailyRotateFile({
  filename: "logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  level: "debug"
});

const errorTransport = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "30d",
  level: "error"
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "debug",
  format: logFormat,
  transports: [
    consoleTransport,
    combinedTransport,
    errorTransport
  ]
});

winston.addColors(customLevels.colors);

export default logger;