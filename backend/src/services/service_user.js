const user = require('../models/model_user');

const getAllUser = async () => {
  try {
    const rows = await user.findAll();
    return rows;
  } catch (e) {
    throw new Error(`Error al recuperar usuarios: ${e.message}`);
  }
};

const getUserById = async (userId) => {
  try {
    const row = await user.findByPk(userId);
    if (!row) return null;
    return row;
  } catch (e) {
    throw new Error(`Error al recuperar el usuario con ID ${userId}: ${e.message}`);
  }
};

async function createUser(userData) {
  try {
    const createdUser = await user.create({
      name: userData.name,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password,
      create_time: new Date(),
    });
    return createdUser.toJSON();
  } catch (error) {
    throw new Error(`Error al crear el usuario: ${error.message}`);
  }
}

module.exports = {
  getAllUser,
  getUserById,
  createUser,
};
