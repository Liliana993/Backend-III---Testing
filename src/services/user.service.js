import userRepository from "../repositories/user.repository.js";

class UserService {

  async getAllUsers() {
    return await userRepository.getAll();
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }

  async getUserByEmail(email) {
    const user = await userRepository.getByEmail(email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return user;
  }

  async createUser(data) {

    if (!data.firstName) {
      throw new Error("El nombre es obligatorio");
    }

    if (!data.lastName) {
      throw new Error("El apellido es obligatorio");
    }

    if (!data.email) {
      throw new Error("El email es obligatorio");
    }

    if (!data.password) {
      throw new Error("La contraseña es obligatoria");
    }

    const existingUser =
      await userRepository.getByEmail(data.email);

    if (existingUser) {
      throw new Error("El email ya está registrado");
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
        throw new Error("El email ya está registrado");
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