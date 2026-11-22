import userRepository from "../repositories/user.repository.js";
import { ERROR_TYPES } from "../constants/index.js";
import CustomError from "../errors/CustomError.js";

class UserService {

  // Método para obtener todos los usuarios con paginación y validación de parámetros
  async getAllUsers({ page = 1, limit = 10 } = {}) {
  const requestedPage = Number(page);
  const requestedLimit = Number(limit);

  const safePage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const safeLimit =
    Number.isInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 100)
      : 10;

  return userRepository.getAll({
    page: safePage,
    limit: safeLimit
  });
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


  // Método para agregar un documento a un usuario
async addUserDocument(id, file, documentType) {
  try {
    const allowedTypes = ["DNI", "LICENSE", "OTHER"];

    if (!allowedTypes.includes(documentType)) {
      throw CustomError.createError({
        name: ERROR_TYPES.INVALID_DOCUMENT_TYPE,
        cause: `Tipo recibido: ${documentType}`
      });
    }

    await this.getUserById(id);

    const documentData = {
      originalName: file.originalname,
      filename: file.filename,
      path: `uploads/users/documents/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
      documentType,
      uploadedAt: new Date()
    };

    const updatedUser = await userRepository.addDocument(
      id,
      documentData
    );

    if (!updatedUser) {
      throw CustomError.createError({
        name: ERROR_TYPES.USER_NOT_FOUND,
        cause: `No existe un usuario con id ${id}`
      });
    }

    return updatedUser;

  } catch (error) {
    // Si falla la validación o el guardado, eliminamos el archivo.
    if (file?.path) {
      const fs = await import("fs/promises");
      await fs.unlink(file.path).catch(() => {});
    }

    throw error;
  }
}

}

export default new UserService();