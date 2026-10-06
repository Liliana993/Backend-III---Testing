import mockService from "../services/mock.service.js";

class MockController {
  // GET /api/mocks/users?qty=10
  async getUsers(req, res, next) {
    try {
      const { qty } = req.query;

      const users = mockService.getMockUsers(qty);

      return res.status(200).json({
        status: "success",
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/mocks/drivers?qty=10
  async getDrivers(req, res, next) {
    try {
      const { qty } = req.query;

      const drivers = mockService.getMockDrivers(qty);

      return res.status(200).json({
        status: "success",
        count: drivers.length,
        data: drivers
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/mocks/seed?qty=10
  async seed(req, res, next) {
    try {
      const { qty } = req.query;

      const result = await mockService.seed(qty);

      return res.status(201).json({
        status: "success",
        message: "Datos de prueba insertados correctamente",
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MockController();