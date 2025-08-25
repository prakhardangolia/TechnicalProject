# MySQL Database Setup Guide

Complete guide to set up MySQL database for the Logistics Management System.

## 🎯 **Quick Start (3 Steps)**

1. **Install MySQL** (choose your method below)
2. **Create Database**: `CREATE DATABASE logistic_management;`
3. **Run Setup**: `node setup-database.js`

## 📥 **Installation Methods**

### **Method 1: MySQL Installer (Recommended for Windows)**

#### **Step 1: Download MySQL**
- Go to [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
- Download "MySQL Installer for Windows"
- Choose the larger download (includes all tools)

#### **Step 2: Install MySQL**
1. Run the downloaded `.msi` file
2. Choose "Developer Default" installation
3. Follow the installation wizard
4. **Important**: Remember your root password!

#### **Step 3: Add to PATH**
1. Open System Properties (Win + R, type `sysdm.cpl`)
2. Click "Environment Variables"
3. Under "System Variables", find "Path" and click "Edit"
4. Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
5. Click OK and restart your terminal

### **Method 2: XAMPP (Easiest for Beginners)**

#### **Step 1: Download XAMPP**
- Go to [Apache Friends](https://www.apachefriends.org/)
- Download XAMPP for your OS

#### **Step 2: Install and Start**
1. Install XAMPP
2. Open XAMPP Control Panel
3. Start Apache and MySQL services
4. Click "Admin" next to MySQL (opens phpMyAdmin)

#### **Step 3: Create Database**
1. In phpMyAdmin, click "New" on the left sidebar
2. Enter database name: `logistic_management`
3. Click "Create"

### **Method 3: Docker (Advanced Users)**

```bash
# Pull MySQL image
docker pull mysql:8.0

# Run MySQL container
docker run --name mysql-lms \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=logistic_management \
  -p 3306:3306 \
  -d mysql:8.0

# Check if container is running
docker ps
```

### **Method 4: Package Managers**

#### **macOS (Homebrew)**
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Set root password
mysql_secure_installation
```

#### **Ubuntu/Debian**
```bash
# Update package list
sudo apt update

# Install MySQL
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

#### **CentOS/RHEL**
```bash
# Install MySQL
sudo yum install mysql-server

# Start MySQL service
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Get temporary password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure installation
sudo mysql_secure_installation
```

## 🔧 **Database Configuration**

### **Step 1: Create Database**

Connect to MySQL and create the database:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create the database
CREATE DATABASE logistic_management;

-- Verify it was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

### **Step 2: Update Configuration**

Edit `backend/config1.env` with your MySQL credentials:

```env
DB_NAME=logistic_management
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_HOST=localhost
DB_PORT=3306
PORT=5000
NODE_ENV=development
```

### **Step 3: Initialize Tables**

```bash
# Navigate to backend directory
cd backend

# Initialize database tables
npm run init-db
```

## 🚀 **Automated Setup**

Use the provided setup script for automatic database setup:

```bash
# Run the database setup script
node setup-database.js
```

This script will:
- Check if MySQL is installed
- Verify database configuration
- Create the database if it doesn't exist
- Initialize all tables

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

-- Show tables
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

## 📚 **Next Steps**

After setting up MySQL:

1. **Start the application**: `npm run dev`
2. **Access frontend**: http://localhost:3500
3. **Test API endpoints**: http://localhost:5000
4. **Explore the features** of the Logistics Management System

## 🆘 **Need Help?**

- Check MySQL error logs
- Verify network connectivity
- Ensure firewall allows port 3306
- Review MySQL documentation: https://dev.mysql.com/doc/

---

**Your MySQL database is now ready for the Logistics Management System!** 🎉






