#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Setting up MySQL Database for Logistics Management System...\n');

// Check if MySQL is accessible
console.log('📊 Checking MySQL connection...');
try {
    execSync('mysql --version', { encoding: 'utf8' });
    console.log('✅ MySQL is installed and accessible');
} catch (error) {
    console.log('❌ MySQL is not accessible. Please install MySQL first.');
    console.log('\n📋 Installation options:');
    console.log('1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/');
    console.log('2. Use XAMPP: https://www.apachefriends.org/');
    console.log('3. Use Docker: docker run --name mysql-lms -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=logistic_management -p 3306:3306 -d mysql:8.0');
    process.exit(1);
}

// Check database configuration
console.log('\n🔧 Checking database configuration...');
const envPath = path.join(__dirname, 'backend', 'config1.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ Database configuration file not found');
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
console.log('✅ Database configuration file found');

// Extract database info from config
const dbName = envContent.match(/DB_NAME=([^\n]+)/)?.[1] || 'logistic_management';
const dbUser = envContent.match(/DB_USER=([^\n]+)/)?.[1] || 'root';
const dbPassword = envContent.match(/DB_PASSWORD=([^\n]+)/)?.[1] || 'root';

console.log(`📊 Database Name: ${dbName}`);
console.log(`👤 Database User: ${dbUser}`);

// Check if database exists
console.log('\n🔍 Checking if database exists...');
try {
    const checkDbCommand = `mysql -u ${dbUser} -p${dbPassword} -e "SHOW DATABASES LIKE '${dbName}';" 2>/dev/null`;
    const result = execSync(checkDbCommand, { encoding: 'utf8' });
    
    if (result.includes(dbName)) {
        console.log('✅ Database already exists');
    } else {
        console.log('❌ Database does not exist');
        console.log('\n📝 Creating database...');
        
        const createDbCommand = `mysql -u ${dbUser} -p${dbPassword} -e "CREATE DATABASE IF NOT EXISTS ${dbName};"`;
        execSync(createDbCommand, { stdio: 'inherit' });
        console.log('✅ Database created successfully');
    }
} catch (error) {
    console.log('⚠️  Could not check/create database automatically');
    console.log('📝 Please manually create the database:');
    console.log(`   mysql -u ${dbUser} -p`);
    console.log(`   CREATE DATABASE ${dbName};`);
    console.log('   EXIT;');
}

// Initialize database tables
console.log('\n🔄 Initializing database tables...');
try {
    console.log('Running database initialization...');
    execSync('cd backend && npm run init-db', { stdio: 'inherit' });
    console.log('✅ Database tables initialized successfully');
} catch (error) {
    console.error('❌ Error initializing database tables:', error.message);
    console.log('\n📝 Manual steps:');
    console.log('1. cd backend');
    console.log('2. npm run init-db');
}

console.log('\n🎉 Database setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Start the application: npm run dev');
console.log('2. Access frontend: http://localhost:3500');
console.log('3. Access backend API: http://localhost:5000');

console.log('\n🔍 Database connection details:');
console.log(`   Host: localhost`);
console.log(`   Port: 3306`);
console.log(`   Database: ${dbName}`);
console.log(`   User: ${dbUser}`);






