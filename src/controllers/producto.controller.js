import productService from "../services/producto.service.js";
import CustomError from "../errors/CustomError.js";

class ProductController {  

  async getAll(req, res, next) {
  try {
    const {
      status,
      minPrice,
      maxPrice,
      inStock,
      page = "1",
      limit = "10"
    } = req.query;

    // Validar parámetros de paginación
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedPage) ||
      parsedPage < 1 ||
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      throw new CustomError(
        "VALIDATION_ERROR",
         400,
        "Los parámetros page y limit deben ser enteros positivos. El límite máximo es 100."
      );
    }

    const filters = {
      status,
      minPrice,
      maxPrice
    };

    if (inStock !== undefined) {
      filters.inStock = inStock === "true";
    }

    const products = await productService.getAllProducts(
      filters,
      {
        page: parsedPage,
        limit: parsedLimit
      }
    );

    res.status(200).json({
      status: "success",
      payload: products.data,
      pagination: {
        total: products.total,
        page: products.page,
        limit: products.limit,
        totalPages: products.totalPages
      }
    });

  } catch (error) {
    next(error);
  }
 }

  async getById(req, res) {
    try {
      const { id } = req.params;

      const product =
        await productService.getProductById(id);

      res.status(200).json({
        status: "success",
        payload: product
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }

  async getByName(req, res) {
    try {
      const { name } = req.params;

      const product =
        await productService.getProductByName(name);

      res.status(200).json({
        status: "success",
        payload: product
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
      const product =
        await productService.createProduct(req.body);

      res.status(201).json({
        status: "success",
        message: "Producto creado correctamente",
        payload: product
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

      const product =
        await productService.updateProduct(
          id,
          req.body
        );

      res.status(200).json({
        status: "success",
        message: "Producto actualizado correctamente",
        payload: product
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

      await productService.deleteProduct(id);

      res.status(200).json({
        status: "success",
        message: "Producto eliminado correctamente"
      });

    } catch (error) {
      res.status(404).json({
        status: "error",
        message: error.message
      });
    }
  }
}

// Exportamos una instancia de la clase ProductController
export default new ProductController();