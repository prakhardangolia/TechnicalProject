#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Logistics Management System...\n');

// Check if Node.js is installed
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' });
    console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
    console.error('❌ Node.js is not installed. Please install Node.js first.');
    process.exit(1);
}

// Check if MySQL is running
console.log('\n📊 Checking MySQL connection...');
try {
    execSync('mysql --version', { encoding: 'utf8' });
    console.log('✅ MySQL is installed');
} catch (error) {
    console.log('⚠️  MySQL is not installed or not in PATH.');
    console.log('📝 Please install MySQL and add it to your PATH, or ensure it\'s running.');
    console.log('💡 You can continue with the setup and configure MySQL later.');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
    console.log('Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('Installing backend dependencies...');
    execSync('cd backend && npm install', { stdio: 'inherit' });
    
    console.log('Installing frontend dependencies...');
    execSync('cd frontend && npm install', { stdio: 'inherit' });
    
    console.log('✅ All dependencies installed successfully!');
} catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
}

// Check database configuration
console.log('\n🔧 Checking database configuration...');
const envPath = path.join(__dirname, 'backend', 'config1.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Database configuration file found');
    console.log('📝 Please update the database password in backend/config1.env if needed');
} else {
    console.error('❌ Database configuration file not found');
    process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Update database credentials in backend/config1.env');
console.log('2. Create MySQL database: CREATE DATABASE logistic_management;');
console.log('3. Start the application: npm run dev');
console.log('\n🌐 The application will be available at:');
console.log('   Frontend: http://localhost:3500');
console.log('   Backend API: http://localhost:5000');
