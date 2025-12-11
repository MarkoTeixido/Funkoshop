const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const SalesByProduct = sequelize.define('SalesByProduct', {
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    product_name: DataTypes.STRING,
    sku: DataTypes.STRING,
    total_orders: DataTypes.INTEGER,
    total_quantity_sold: DataTypes.INTEGER,
    total_revenue: DataTypes.DECIMAL,
    current_stock: DataTypes.INTEGER
}, {
    tableName: 'v_sales_by_product',
    timestamps: false,
    freezeTableName: true
});

module.exports = SalesByProduct;
