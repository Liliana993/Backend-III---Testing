import User from "../models/user.model.js";

class UserRepository {
  // Método para obtener todos los usuarios con paginación
  async getAll({ page = 1, limit = 10 } = {}) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find()
      .select("-password")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit),

    User.countDocuments()
  ]);

  return {
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
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
        returnDocument: "after",
        runValidators: true
      }
    ).select("-password");
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  }

// Método para agregar un documento a un usuario
async addDocument(userId, documentData) {
  return User.findByIdAndUpdate(
    userId,
    {
      $push: {
        documents: documentData
      }
    },
    {
      returnDocument: "after",
      runValidators: true
    }
  ).select("-password");
}

}

// Exportamos una instancia de la clase UserRepository
export default new UserRepository();