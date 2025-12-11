const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');
const { product } = require('./model_product');

const CartItem = sequelize.define('CartItem', {
    cart_item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    cart_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
}, {
    tableName: 'cart_item',
    timestamps: true,
    createdAt: 'added_at',
    updatedAt: 'updated_at'
});

CartItem.belongsTo(product, { foreignKey: 'product_id' });

module.exports = CartItem;
