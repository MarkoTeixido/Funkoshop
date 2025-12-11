const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const OrderItem = sequelize.define('OrderItem', {
    order_item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    product_sku: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_item',
    timestamps: false
});

module.exports = OrderItem;
