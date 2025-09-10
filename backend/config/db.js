const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './config1.env' });

// ✅ Direct connection to your local MySQL database
const sequelize = new Sequelize(
    process.env.DB_NAME || 'logistic_management',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: process.env.NODE_ENV === 'development',
    }
);

// ✅ Test the connection
sequelize.authenticate()
    .then(() => console.log('✅ Connected to the local MySQL database successfully.'))
    .catch(err => console.error('❌ Unable to connect to the database:', err));

module.exports = sequelize;
