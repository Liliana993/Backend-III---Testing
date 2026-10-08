import loggerService from "../services/logger.service.js";

class LoggerController {
  testLevels(req, res, next) {
    try {
      const result = loggerService.testLevels();

      return res.status(200).json({
        status: "success",
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LoggerController();