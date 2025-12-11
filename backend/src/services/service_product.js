const { product } = require('../models/model_product');
const { licence } = require('../models/model_licence');
const { category } = require('../models/model_category');

const getAllProducts = async () => {
  try {
    const rows = await product.findAll({
      include: [
        { model: category, attributes: ['category_name'] },
        { model: licence, attributes: ['licence_name'] },
      ],
    });

    const formattedRows = rows.map(row => {
      const rowData = row.get({ plain: true });
      if (row.licence) rowData.licence = row.licence.get({ plain: true });
      if (row.category) rowData.category = row.category.get({ plain: true });
      return rowData;
    });

    return formattedRows;
  } catch (e) {
    throw new Error(`Error al recuperar productos: ${e.message}`);
  }
};

const getProductById = async (productId) => {
  try {
    const row = await product.findByPk(productId, {
      include: [
        { model: category, attributes: ['category_name'] },
        { model: licence, attributes: ['licence_name'] },
      ],
    });

    if (!row) return null;

    const rowData = row.get({ plain: true });
    if (row.licence) rowData.licence = row.licence.get({ plain: true });
    if (row.category) rowData.category = row.category.get({ plain: true });

    return rowData;
  } catch (e) {
    throw new Error(`Error al recuperar el producto con ID ${productId}: ${e.message}`);
  }
};

const createProduct = async (dataProduct) => {
  try {
    const createdProduct = await product.create({
      product_name: dataProduct.product_name,
      product_description: dataProduct.product_description,
      price: dataProduct.price,
      stock: dataProduct.stock,
      discount: dataProduct.discount,
      sku: dataProduct.sku,
      dues: dataProduct.dues,
      image_front: dataProduct.image_front,
      image_back: dataProduct.image_back,
      create_time: new Date(),
      licence_id: dataProduct.licence_id,
      category_id: dataProduct.category_id,
    });

    return createdProduct;
  } catch (error) {
    throw new Error(`Error al crear el producto: ${error.message}`);
  }
}

const updateProductById = async (productId, updatedDataProduct) => {
  try {
    const existingProduct = await product.findByPk(productId);
    if (!existingProduct) return null;

    const updateProduct = await existingProduct.update(updatedDataProduct);
    return updateProduct;
  } catch (e) {
    throw new Error(`Error al actualizar el producto con ID ${productId}: ${e.message}`);
  }
};

const deleteProductById = async (productId) => {
  try {
    const existingProduct = await product.findByPk(productId);
    if (!existingProduct) return null;

    await existingProduct.destroy();
    return true;
  } catch (e) {
    throw new Error(`Error al eliminar el producto con ID ${productId}: ${e.message}`);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById
}