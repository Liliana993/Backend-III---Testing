import userService from "../services/user.service.js";
class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        status: "success",
        payload: users
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      return res.status(200).json({
        status: "success",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }

  async getByEmail(req, res, next) {
    try {
      const { email } = req.params;

      const user = await userService.getUserByEmail(email);

      return res.status(200).json({
        status: "success",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);

      return res.status(201).json({
        status: "success",
        message: "Usuario creado correctamente",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.updateUser(
        id,
        req.body
      );

      return res.status(200).json({
        status: "success",
        message: "Usuario actualizado correctamente",
        payload: user
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await userService.deleteUser(id);

      return res.status(200).json({
        status: "success",
        message: "Usuario eliminado correctamente"
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();