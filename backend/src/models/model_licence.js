const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const Licence = sequelize.define('Licence', {
  licence_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  licence_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  licence_description: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  licence_image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'licence',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = { licence: Licence };