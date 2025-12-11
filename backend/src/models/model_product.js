const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');
const { licence } = require('./model_licence');
const { category } = require('./model_category');

const Product = sequelize.define("Product", {
  product_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  product_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  product_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  discount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discount_end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sku: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  dues: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image_front: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  image_back: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  licence_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  tableName: 'product',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Product.belongsTo(category, { foreignKey: 'category_id' });
Product.belongsTo(licence, { foreignKey: 'licence_id' });

module.exports = { product: Product };
