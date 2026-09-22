import Product from "../models/producto.model.js";

class ProductRepository {

  async getAll(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.minPrice !== undefined) {
      query.price = {
        ...query.price,
        $gte: Number(filters.minPrice)
      };
    }

    if (filters.maxPrice !== undefined) {
      query.price = {
        ...query.price,
        $lte: Number(filters.maxPrice)
      };
    }

    if (filters.inStock === true) {
      query.stock = {
        $gt: 0
      };
    }

    if (filters.inStock === false) {
      query.stock = 0;
    }

    return Product.find(query)
      .select("-__v")
      .sort({ createdAt: -1 });
  }

  async getById(id) {
    return Product.findById(id)
      .select("-__v");
  }

  async getByName(name) {
    return Product.findOne({
      name: {
        $regex: name,
        $options: "i"
      }
    }).select("-__v");
  }

  async create(data) {
    return Product.create(data);
  }

  async updateById(id, data) {
    return Product.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true
      }
    ).select("-__v");
  }

  async deleteById(id) {
    return Product.findByIdAndDelete(id);
  }
}

// Exportamos una instancia de la clase ProductRepository
export default new ProductRepository();