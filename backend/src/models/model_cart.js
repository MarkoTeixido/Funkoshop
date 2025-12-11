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

module.exports = Cart;
