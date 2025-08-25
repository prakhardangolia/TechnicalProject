#!/usr/bin/env node

const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './backend/config1.env' });

console.log('👤 Creating Admin Account...\n');

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME || 'logistic_management',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false,
    }
);

async function createAdmin() {
    try {
        // Test connection
        await sequelize.authenticate();
        console.log('✅ Connected to database successfully');
        
        // Import Admin model
        const Admin = require('./backend/models/adminModel');
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ where: { name: 'admin' } });
        
        if (existingAdmin) {
            console.log('⚠️  Admin account already exists');
            console.log('   Username: admin');
            console.log('   Password: admin123');
            console.log('   Email: admin@logistics.com');
        } else {
            // Create new admin account
            const newAdmin = await Admin.create({
                name: 'admin',
                password: 'admin123',
                gmail: 'admin@logistics.com'
            });
            
            console.log('✅ Admin account created successfully!');
            console.log('📋 Login Credentials:');
            console.log('   Username: admin');
            console.log('   Password: admin123');
            console.log('   Email: admin@logistics.com');
        }
        
        // Close connection
        await sequelize.close();
        console.log('\n🔌 Database connection closed');
        
    } catch (error) {
        console.error('❌ Error creating admin account:', error.message);
    }
}

createAdmin();





