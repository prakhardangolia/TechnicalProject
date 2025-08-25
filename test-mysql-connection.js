#!/usr/bin/env node

const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './backend/config1.env' });

console.log('🔍 Testing Database Connection with Standalone MySQL...\n');

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'logistic_management',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'your_mysql_password_here',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false,
    }
);

async function testConnection() {
    try {
        console.log('📊 Attempting to connect to MySQL...');
        console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
        console.log(`   Port: ${process.env.DB_PORT || 3306}`);
        console.log(`   Database: ${process.env.DB_NAME || 'logistic_management'}`);
        console.log(`   User: ${process.env.DB_USER || 'root'}`);
        console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(not set)'}`);
        
        // Test the connection
        await sequelize.authenticate();
        console.log('\n✅ Successfully connected to MySQL database!');
        
        // Test if database exists
        const [results] = await sequelize.query("SHOW DATABASES LIKE 'logistic_management';");
        if (results.length > 0) {
            console.log('✅ Database "logistic_management" exists');
        } else {
            console.log('⚠️  Database "logistic_management" does not exist');
            console.log('📝 Please create it manually:');
            console.log('   mysql -u root -p');
            console.log('   CREATE DATABASE logistic_management;');
            console.log('   EXIT;');
        }
        
        // Close connection
        await sequelize.close();
        console.log('🔌 Connection closed');
        
    } catch (error) {
        console.error('\n❌ Connection failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Make sure MySQL service is running: net start mysql80');
        console.log('2. Check if password is correct in backend/config1.env');
        console.log('3. Verify database exists: mysql -u root -p');
        console.log('4. Check MySQL error logs');
    }
}

testConnection();






