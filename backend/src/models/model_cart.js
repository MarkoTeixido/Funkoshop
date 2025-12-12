const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const Cart = sequelize.define('Cart', {
    cart_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'cart',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const CartItem = require('./model_cart_item');

Cart.hasMany(CartItem, { foreignKey: 'cart_id' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' }); // Good practice to have both

module.exports = Cart;
