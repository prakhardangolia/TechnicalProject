const { sequelize } = require('./models');
const Admin = require('./models/adminModel'); // Import Admin model

async function initializeDatabase() {
    try {
        console.log('🔄 Initializing database...');
        
        // Sync all models with the database
        await sequelize.sync({ force: false });
        
        console.log('✅ Database initialized successfully!');
        console.log('📊 All tables have been created/updated');

        // Create a default admin user if one doesn't exist
        const defaultAdminName = 'admin';
        const defaultAdminPassword = 'admin'; // In a real application, hash this password!
        const defaultAdminGmail = 'admin@example.com';

        const existingAdmin = await Admin.findOne({ where: { name: defaultAdminName } });

        if (!existingAdmin) {
            await Admin.create({
                name: defaultAdminName,
                password: defaultAdminPassword,
                gmail: defaultAdminGmail,
            });
            console.log(`✅ Default admin user '${defaultAdminName}' created.`);
        } else {
            console.log(`ℹ️ Default admin user '${defaultAdminName}' already exists.`);
        }
        
        // Close the connection
        await sequelize.close();
        console.log('🔌 Database connection closed');
        
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

// Run the initialization
initializeDatabase();



