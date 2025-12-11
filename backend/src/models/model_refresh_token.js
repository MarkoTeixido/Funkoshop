const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');

const RefreshToken = sequelize.define('RefreshToken', {
    token_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'refresh_token',
    timestamps: true,
    updatedAt: false
});

module.exports = RefreshToken;
