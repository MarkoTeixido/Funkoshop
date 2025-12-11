const { category } = require('../models/model_category');

const getAllCategory = async () => {
  try {
    const rows = await category.findAll();
    return rows;
  } catch (e) {
    throw new Error(`Error al recuperar categorías: ${e.message}`);
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const row = await category.findByPk(categoryId);
    return row;
  } catch (e) {
    throw new Error(`Error al recuperar la categoría con ID ${categoryId}: ${e.message}`);
  }
};

module.exports = {
  getAllCategory,
  getCategoryById,
}
