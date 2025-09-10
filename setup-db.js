const mysql = require('mysql2/promise');
require('dotenv').config({ path: './backend/config1.env' });

async function setupDatabase() {
    console.log('🗄️  Setting up MySQL Database for Logistics Management System...\n');

    // Database configuration
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'logistic_management'
    };

    console.log('📊 Database Configuration:');
    console.log(`   Host: ${config.host}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   User: ${config.user}`);
    console.log(`   Database: ${config.database}`);

    try {
        // First, connect without database to create it
        const connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password
        });

        console.log('\n✅ Connected to MySQL server successfully');

        // Create database if it doesn't exist
        console.log('\n📝 Creating database...');
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
        console.log(`✅ Database '${config.database}' created/verified successfully`);

        // Close the connection
        await connection.end();

        // Now initialize the database tables
        console.log('\n🔄 Initializing database tables...');
        const { execSync } = require('child_process');
        execSync('cd backend && node init-db.js', { stdio: 'inherit' });

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Start the backend: cd backend && npm run dev');
        console.log('2. Start the frontend: cd frontend && npm start');
        console.log('3. Or run both: npm run dev (from root directory)');

    } catch (error) {
        console.error('\n❌ Error setting up database:', error.message);
        console.log('\n📋 Troubleshooting:');
        console.log('1. Make sure MySQL server is running');
        console.log('2. Check your database credentials in backend/config1.env');
        console.log('3. Ensure MySQL is accessible on the configured host and port');
        console.log('4. If using XAMPP, make sure MySQL service is started');
        console.log('5. If using Docker, ensure the MySQL container is running');
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Connection refused - MySQL server might not be running');
            console.log('   Try starting MySQL service or check if it\'s running on the correct port');
        }
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Access denied - Check your username and password');
            console.log('   Update backend/config1.env with correct credentials');
        }
    }
}

setupDatabase();
