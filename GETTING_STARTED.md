# Getting Started - Logistics Management System

## ✅ What's Been Set Up

This project has been configured and is now ready to run! Here's what has been prepared:

### 1. **Dependencies Installed**
- ✅ Root dependencies (concurrently for running both servers)
- ✅ Backend dependencies (Express, Sequelize, MySQL2, etc.)
- ✅ Frontend dependencies (React, Axios, React Router, etc.)

### 2. **Configuration Files Updated**
- ✅ `backend/config1.env` - Database configuration with default values
- ✅ `backend/config/db.js` - Updated to use environment variables
- ✅ `backend/package.json` - Added development and database scripts
- ✅ Root `package.json` - Added scripts to run both servers

### 3. **Database Setup**
- ✅ Database configuration ready
- ✅ Database initialization script created (`backend/init-db.js`)
- ✅ Sequelize models configured

### 4. **Documentation Created**
- ✅ Comprehensive README.md with full setup instructions
- ✅ Quick Start Guide (QUICK_START.md)
- ✅ Setup script for automated installation

## 🚀 How to Run the Application

### Prerequisites
1. **MySQL Database**: You need MySQL installed and running
2. **Create Database**: Run `CREATE DATABASE logistic_management;` in MySQL

### Quick Start (3 Steps)

1. **Configure Database Password**
   ```bash
   # Edit backend/config1.env and update:
   DB_PASSWORD=your_mysql_password
   ```

2. **Initialize Database**
   ```bash
   cd backend
   npm run init-db
   ```

3. **Start the Application**
   ```bash
   # From the root directory:
   npm run dev
   ```

### Access Points
- **Frontend**: http://localhost:3500
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
Logistics-Management-System-main/
├── backend/                 # Node.js/Express backend
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/        # API controllers
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── app.js            # Express app
│   ├── server.js         # Server entry point
│   ├── config1.env       # Environment variables
│   └── init-db.js        # Database initialization
├── frontend/              # React frontend
│   ├── src/
│   │   ├── admin/        # Admin components
│   │   ├── customer/     # Customer components
│   │   ├── supplier/     # Supplier components
│   │   └── home/        # Home page
│   └── public/          # Static files
├── package.json          # Root package.json with scripts
├── setup.js             # Automated setup script
├── README.md            # Full documentation
├── QUICK_START.md       # Quick start guide
└── GETTING_STARTED.md   # This file
```

## 🔧 Available Scripts

### Root Directory
```bash
npm run install-all    # Install all dependencies
npm run dev           # Start both servers in development
npm run start         # Start both servers in production
npm run backend       # Start only backend
npm run frontend      # Start only frontend
npm run build         # Build frontend for production
```

### Backend Directory
```bash
npm run dev           # Start with nodemon (auto-restart)
npm run start         # Start in production mode
npm run init-db       # Initialize database tables
```

### Frontend Directory
```bash
npm start             # Start development server
npm run build         # Build for production
```

## 🐛 Troubleshooting

### Database Issues
- Ensure MySQL is running
- Check password in `backend/config1.env`
- Verify database exists: `SHOW DATABASES;`

### Port Issues
- Backend: Change `PORT` in `backend/config1.env`
- Frontend: Change in `frontend/package.json` scripts

### Common Commands
```bash
# Check if servers are running
netstat -an | findstr :5000  # Backend
netstat -an | findstr :3500  # Frontend

# Kill processes on ports (if needed)
taskkill /F /PID <process_id>
```

## 📚 Next Steps

1. **Start the application** using `npm run dev`
2. **Explore the features**:
   - Customer management
   - Supplier management
   - Order processing
   - Inventory tracking
   - Fleet management
   - Shipment tracking
3. **Customize** the application as needed
4. **Deploy** to production when ready

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [QUICK_START.md](QUICK_START.md) for quick setup
- Run `node setup.js` for automated setup assistance

---

**The project is now fully configured and ready to run!** 🎉






