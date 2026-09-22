import User from "../models/user.model.js";

class UserRepository {
  async getAll() {
    return User.find().select("-password");
  }

  async getById(id) {
    return User.findById(id).select("-password");
  }

  async getByEmail(email) {
    return User.findOne({ email }).select("+password");
  }

  async create(data) {
    return User.create(data);
  }

  async updateById(id, data) {
    return User.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  }
}

// Exportamos una instancia de la clase UserRepository
export default new UserRepository();