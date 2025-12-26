const productRepository = require('../repositories/productRepository');
const orderRepository = require('../repositories/orderRepository');
const { HTTP_CODES } = require('../utils/constants');
const AppError = require('../utils/AppError');

class ProductService {
  async getAllProducts() {
    const products = await productRepository.findAll();
    // Transform data if necessary to match frontend expectations (flattening objects)
    return products.map(p => {
      const plain = p.get({ plain: true });
      return {
        ...plain,
        licence: plain.licence ? plain.licence.licence_name : null, // Flattening
        category: plain.category ? plain.category.category_name : null
      };
    });
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) return null;

    const plain = product.get({ plain: true });
    return {
      ...plain,
      licence: plain.licence ? plain.licence.licence_name : null,
      category: plain.category ? plain.category.category_name : null
    };
  }

  async getRelatedProducts(productId, categoryId) {
    const { Op } = require('sequelize');

    const related = await productRepository.findAll({
      where: {
        category_id: categoryId,
        product_id: { [Op.ne]: productId }, // Exclude current product
        is_active: true
      },
      limit: 10, // Fetch a few
      order: [['created_at', 'DESC']]
    });

    return related.map(p => {
      const plain = p.get({ plain: true });
      return {
        ...plain,
        licence: plain.licence ? plain.licence.licence_name : null, // Flattening
        category: plain.category ? plain.category.category_name : null
      };
    });
  }

  async createProduct(data) {
    return await productRepository.create(data);
  }

  async updateProduct(id, data) {
    return await productRepository.update(id, data);
  }

  async deleteProduct(id) {
    // Check for active orders
    const hasActiveOrders = await orderRepository.hasActiveOrders(id);
    if (hasActiveOrders) {
      throw new AppError('No se puede eliminar el producto porque pertenece a pedidos activos.', HTTP_CODES.CONFLICT); // 409
    }
    return await productRepository.delete(id);
  }
}

module.exports = new ProductService();