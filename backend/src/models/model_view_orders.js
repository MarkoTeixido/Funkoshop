const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const OrderSummary = sequelize.define('OrderSummary', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true },
    order_number: DataTypes.STRING,
    customer_name: DataTypes.STRING,
    customer_email: DataTypes.STRING,
    final_amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    total_items: DataTypes.INTEGER
}, {
    tableName: 'v_order_summary',
    timestamps: false,
    freezeTableName: true
});

module.exports = OrderSummary;
