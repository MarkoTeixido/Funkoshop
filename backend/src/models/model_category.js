const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  category_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  category_description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'category',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = { category: Category };