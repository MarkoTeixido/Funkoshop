const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    order_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    final_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'completed'),
        defaultValue: 'pending'
    },
    payment_method: {
        type: DataTypes.STRING(50),
        defaultValue: 'credit_card'
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    shipping_street: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    shipping_city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    shipping_state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    shipping_postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    shipping_country: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    shipping_phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    promotion_code: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'order',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const OrderItem = require('./model_order_item');
const User = require('./model_user');

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Order;
