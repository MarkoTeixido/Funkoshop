const { Sequelize } = require('sequelize');
const config = require('./database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('❌ Error al autenticar la conexión:', error);
  }
}

testConnection();

module.exports = { sequelize };