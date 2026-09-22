import productRepository from "../repositories/producto.repository.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductService {

  async getAllProducts(filters = {}) {
    return await productRepository.getAll(filters);
  }

  async getProductById(id) {
    const product = await productRepository.getById(id);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  }

  async getProductByName(name) {
    const product = await productRepository.getByName(name);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  }

  async createProduct(data) {

    if (!data.name) {
      throw new Error("El nombre del producto es obligatorio");
    }

    if (data.price === undefined || data.price === null) {
      throw new Error("El precio del producto es obligatorio");
    }

    if (data.price < 0) {
      throw new Error("El precio no puede ser negativo");
    }

    if (data.stock === undefined || data.stock === null) {
      throw new Error("El stock del producto es obligatorio");
    }

    if (data.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    const existingProduct =
      await productRepository.getByName(data.name);

    if (existingProduct) {
      throw new Error("Ya existe un producto con ese nombre");
    }

    const productData = {
      ...data,
      status:
        data.stock > 0
          ? PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK
    };

    return await productRepository.create(productData);
  }

  async updateProduct(id, data) {

    const existingProduct =
      await this.getProductById(id);

    if (data.price !== undefined && data.price < 0) {
      throw new Error("El precio no puede ser negativo");
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    const updatedData = {
      ...data
    };

    const newStock =
      data.stock !== undefined
        ? data.stock
        : existingProduct.stock;

    updatedData.status =
      newStock > 0
        ? PRODUCT_STATUS.AVAILABLE
        : PRODUCT_STATUS.OUT_OF_STOCK;

    return await productRepository.updateById(
      id,
      updatedData
    );
  }

  async deleteProduct(id) {

    await this.getProductById(id);

    return await productRepository.deleteById(id);
  }
}

// Exportamos una instancia de la clase ProductService
export default new ProductService();