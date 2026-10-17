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
debug: 5,
},
colors: {
fatal: "red",
error: "red",
warning: "yellow",
info: "green",
http: "cyan",
debug: "blue",
},
};

winston.addColors(customLevels.colors);

// Formato legible para la consola
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    const extra =
      Object.keys(metadata).length > 0
        ? " " + JSON.stringify(metadata)
        : "";

    return `${timestamp} [${level}] ${message}${extra}`;
  })
);


// Formato estructurado para los archivos
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.json()
);

const consoleTransport = new winston.transports.Console({
level: config.environment === "development" ? "debug" : "info",
format: consoleFormat,
});

const combinedTransport = new DailyRotateFile({
filename: "logs/combined-%DATE%.log",
datePattern: "YYYY-MM-DD",
maxFiles: "14d",
level: config.environment === "development" ? "debug" : "info",
format: fileFormat,
});

const errorTransport = new DailyRotateFile({
filename: "logs/error-%DATE%.log",
datePattern: "YYYY-MM-DD",
maxFiles: "30d",
level: "error",
format: fileFormat,
});

const logger = winston.createLogger({
levels: customLevels.levels,
level: "debug",
transports: [
consoleTransport,
combinedTransport,
errorTransport,
],
});
export default logger;