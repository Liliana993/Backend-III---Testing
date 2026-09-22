import userService from "../services/user.service.js";

class UserController {

  async getAll(req, res) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        status: "success",
        payload: users
      });

    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      res.status(200).json({
        status: "success",
        payload: user
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getByEmail(req, res) {
    try {
      const { email } = req.params;

      const user = await userService.getUserByEmail(email);

      res.status(200).json({
        status: "success",
        payload: user
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const user = await userService.createUser(req.body);

      res.status(201).json({
        status: "success",
        message: "Usuario creado correctamente",
        payload: user
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const user = await userService.updateUser(
        id,
        req.body
      );

      res.status(200).json({
        status: "success",
        message: "Usuario actualizado correctamente",
        payload: user
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await userService.deleteUser(id);

      res.status(200).json({
        status: "success",
        message: "Usuario eliminado correctamente"
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

export default new UserController();