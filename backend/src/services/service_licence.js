const { licence } = require('../models/model_licence');

const getAllLicence = async () => {
  try {
    const rows = await licence.findAll();
    return rows;
  } catch (e) {
    throw new Error(`Error al recuperar licencias: ${e.message}`);
  }
};

const getLicenceById = async (licenceId) => {
  try {
    const row = await licence.findByPk(licenceId);
    return row;
  } catch (e) {
    throw new Error(`Error al recuperar la licencia con ID ${licenceId}: ${e.message}`);
  }
};

module.exports = {
  getAllLicence,
  getLicenceById,
}
