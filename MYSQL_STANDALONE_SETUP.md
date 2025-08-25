# MySQL Standalone Setup Guide

Complete guide to set up standalone MySQL database for the Logistics Management System.

## 🎯 **Quick Start (5 Steps)**

1. **Install MySQL Server**
2. **Start MySQL Service**
3. **Create Database**: `CREATE DATABASE logistic_management;`
4. **Update Password** in `backend/config1.env`
5. **Initialize Tables**: `cd backend && npm run init-db`

## 📥 **Step-by-Step Installation**

### **Step 1: Install MySQL Server**

#### **For Windows:**

1. **Download MySQL Installer:**
   - Go to [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
   - Download "MySQL Installer for Windows"
   - Choose the larger download (includes all tools)

2. **Run the Installer:**
   - Run the downloaded `.msi` file
   - Choose "Developer Default" installation
   - Follow the installation wizard
   - **Important**: Set and remember your root password!

3. **Add MySQL to PATH:**
   - Open System Properties (Win + R, type `sysdm.cpl`)
   - Click "Environment Variables"
   - Under "System Variables", find "Path" and click "Edit"
   - Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Click OK and restart your terminal

#### **For macOS:**
```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Set root password
mysql_secure_installation
```

#### **For Linux (Ubuntu/Debian):**
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

### **Step 2: Start MySQL Service**

#### **Windows:**
```bash
# Check if MySQL service is running
net start mysql80

# If not running, start it
net start mysql80

# To stop MySQL service
net stop mysql80
```

#### **macOS/Linux:**
```bash
# Start MySQL service
sudo systemctl start mysql

# Check status
sudo systemctl status mysql

# Enable auto-start
sudo systemctl enable mysql
```

### **Step 3: Create Database**

Connect to MySQL and create the database:

```bash
# Connect to MySQL as root
mysql -u root -p

# Enter your password when prompted
```

Then in the MySQL prompt:
```sql
-- Create the database
CREATE DATABASE logistic_management;

-- Verify it was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### **Step 4: Update Configuration**

Edit `backend/config1.env` with your MySQL credentials:

```env
DB_NAME=logistic_management
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_HOST=localhost
DB_PORT=3306
PORT=5000
NODE_ENV=development
```

**Important:** Replace `your_actual_mysql_password` with the password you set during MySQL installation.

### **Step 5: Test Connection**

```bash
# Test the database connection
node test-mysql-connection.js
```

### **Step 6: Initialize Database Tables**

```bash
# Navigate to backend directory
cd backend

# Initialize database tables
npm run init-db
```

## 🔍 **Verification Steps**

### **Check MySQL Installation**
```bash
# Check MySQL version
mysql --version

# Connect to MySQL
mysql -u root -p
```

### **Check Database**
```sql
-- Show all databases
SHOW DATABASES;

-- Use the database
USE logistic_management;

-- Show tables (after initialization)
SHOW TABLES;
```

### **Check Application Connection**
```bash
# Start the backend
cd backend
npm run dev

# Check for database connection message
# Should see: "✅ Connected to the local MySQL database successfully."
```

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. MySQL Not Found**
```bash
# Windows: Add MySQL to PATH
# Add: C:\Program Files\MySQL\MySQL Server 8.0\bin

# macOS/Linux: Install MySQL
brew install mysql  # macOS
sudo apt install mysql-server  # Ubuntu
```

#### **2. Access Denied Error**
```sql
-- Reset root password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

#### **3. Port Already in Use**
```bash
# Check what's using port 3306
netstat -an | findstr :3306  # Windows
lsof -i :3306                # macOS/Linux

# Kill the process or change MySQL port
```

#### **4. Database Connection Failed**
- Check if MySQL service is running
- Verify credentials in `backend/config1.env`
- Ensure database exists: `SHOW DATABASES;`

### **Service Management**

#### **Windows**
```bash
# Start MySQL service
net start mysql80

# Stop MySQL service
net stop mysql80

# Check service status
sc query mysql80
```

#### **macOS/Linux**
```bash
# Start MySQL service
sudo systemctl start mysql

# Stop MySQL service
sudo systemctl stop mysql

# Check status
sudo systemctl status mysql
```

## 📊 **Database Schema**

The application will create these tables automatically:

- **admins** - Admin user accounts
- **customers** - Customer information
- **suppliers** - Supplier details
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Individual order items
- **shipments** - Shipment tracking
- **warehouses** - Warehouse locations
- **inventory** - Stock levels
- **fleets** - Vehicle fleet
- **drivers** - Driver information
- **transport_logs** - Transportation activities

## 🎉 **Success Indicators**

You'll know everything is working when:

1. ✅ MySQL service is running
2. ✅ Database `logistic_management` exists
3. ✅ Backend connects successfully
4. ✅ Tables are created automatically
5. ✅ Frontend can communicate with backend

## 🚀 **Start the Application**

After setting up MySQL:

```bash
# Start both frontend and backend
npm run dev

# Access the application
# Frontend: http://localhost:3500
# Backend API: http://localhost:5000
```

## 📚 **Useful Commands**

### **MySQL Commands**
```bash
# Connect to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use database
USE logistic_management;

# Show tables
SHOW TABLES;

# Exit MySQL
EXIT;
```

### **Application Commands**
```bash
# Test database connection
node test-mysql-connection.js

# Initialize database tables
cd backend && npm run init-db

# Start development servers
npm run dev

# Start only backend
npm run backend

# Start only frontend
npm run frontend
```

## 🆘 **Need Help?**

- Check MySQL error logs
- Verify network connectivity
- Ensure firewall allows port 3306
- Review MySQL documentation: https://dev.mysql.com/doc/

---

**Your standalone MySQL database is now ready for the Logistics Management System!** 🎉






