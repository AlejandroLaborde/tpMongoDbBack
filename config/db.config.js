// config.js
const dotenv = require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://root:admin@cluster0.pdirc.mongodb.net/test',
    MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'tpdb'
}