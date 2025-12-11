const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/conn');
const bcryptjs = require("bcryptjs");

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'user',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

User.beforeCreate(async (user) => {
  if (user.password) {
    const hash = await bcryptjs.hash(user.password, 12);
    user.password = hash;
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const hash = await bcryptjs.hash(user.password, 12);
    user.password = hash;
  }
});

module.exports = User;