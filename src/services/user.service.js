import userRepository from "../repositories/user.repository.js";
import { ERROR_TYPES } from "../constants/index.js";
import CustomError from "../errors/CustomError.js";

class UserService {

  async getAllUsers() {
    return await userRepository.getAll();
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);

    if (!user) {
      throw CustomError.createError({
        name: ERROR_TYPES.USER_NOT_FOUND,
        cause: `No existe un usuario con id ${id}`
      });
    }

    return user;
  }

  async getUserByEmail(email) {
    const user = await userRepository.getByEmail(email);

    if (!user) {
      throw CustomError.createError({
        name: ERROR_TYPES.USER_NOT_FOUND,
        cause: `No existe un usuario con email ${email}`
      });
    }

    return user;
  }

  async createUser(data) {

    if (!data.firstName) {
      throw CustomError.createError({
        name: ERROR_TYPES.VALIDATION_ERROR,
        cause: "El nombre es obligatorio"
      });
    }

    if (!data.lastName) {
      throw CustomError.createError({
        name: ERROR_TYPES.VALIDATION_ERROR,
        cause: "El apellido es obligatorio"
      });
    }

    if (!data.email) {
      throw CustomError.createError({
        name: ERROR_TYPES.VALIDATION_ERROR,
        cause: "El email es obligatorio"
      });
    }

    if (!data.password) {
      throw CustomError.createError({
        name: ERROR_TYPES.VALIDATION_ERROR,
        cause: "La contraseña es obligatoria"
      });
    }

    const existingUser =
      await userRepository.getByEmail(data.email);

    if (existingUser) {
       throw CustomError.createError({
        name: ERROR_TYPES.VALIDATION_ERROR,
        cause: "El email ya está registrado"
      });
    }

    const userData = {
      ...data,
      email: data.email.toLowerCase().trim()
    };

    return await userRepository.create(userData);
  }

  async updateUser(id, data) {

    await this.getUserById(id);

    if (data.email) {
      const existingUser =
        await userRepository.getByEmail(data.email);

      if (existingUser && existingUser._id.toString() !== id) {
        throw CustomError.createError({
          name: ERROR_TYPES.VALIDATION_ERROR,
          cause: "El email ya está registrado"
        });
      }

      data.email = data.email.toLowerCase().trim();
    }

    return await userRepository.updateById(id, data);
  }

  async deleteUser(id) {

    await this.getUserById(id);

    return await userRepository.deleteById(id);
  }
}

export default new UserService();