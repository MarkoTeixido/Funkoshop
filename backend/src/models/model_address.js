const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const Address = sequelize.define('Address', {
    address_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    postal_code: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'address',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Address;
