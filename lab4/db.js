const { Sequelize } = require('sequelize');
require('dotenv').config();

// https://medium.com/@uyanhewagetr/building-a-scalable-user-module-in-node-js-with-sequelize-and-mysql-96541ae078c4
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
);

module.exports = sequelize;