require('dotenv').config();

module.exports = {
    username: process.env.USER,
    password: process.env.DBPASS,
    database: process.env.DB,
    host: process.env.HOST,
    dialect: 'mysql',
    logging: false, // Turn off logging for cleaner output, or remove if you want logs
    define: {
        freezeTableName: true,
        timestamps: false
    }
};
