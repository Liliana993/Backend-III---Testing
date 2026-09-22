import productService from "../services/producto.service.js";

class ProductController {  

  async getAll(req, res) {
    try {
      const {
        status,
        minPrice,
        maxPrice,
        inStock
      } = req.query;

      const filters = {
        status,
        minPrice,
        maxPrice
      };

      if (inStock !== undefined) {
        filters.inStock = inStock === "true";
      }

      const products =
        await productService.getAllProducts(filters);

      res.status(200).json({
        status: "success",
        payload: products
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