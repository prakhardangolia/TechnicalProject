# Quick Start Guide

Get the Logistics Management System running in 5 minutes!

## Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)

## Quick Setup

### 1. Install Dependencies
```bash
# Run the setup script (recommended)
node setup.js

# OR manually install dependencies
npm run install-all
```

### 2. Database Setup
```sql
-- Connect to MySQL and run:
CREATE DATABASE logistic_management;
```

### 3. Configure Database
Edit `backend/config1.env` and update your MySQL password:
```env
DB_PASSWORD=your_mysql_password
```

### 4. Initialize Database
```bash
cd backend
npm run init-db
```

### 5. Start the Application
```bash
# Start both frontend and backend
npm run dev

# OR start them separately:
# Terminal 1: npm run backend
# Terminal 2: npm run frontend
```

### 6. Access the Application
- **Frontend**: http://localhost:3500
- **Backend API**: http://localhost:5000

## Troubleshooting

### Database Connection Issues
- Ensure MySQL is running
- Check your password in `backend/config1.env`
- Verify database exists: `SHOW DATABASES;`

### Port Issues
- Backend port: Change `PORT` in `backend/config1.env`
- Frontend port: Change in `frontend/package.json` scripts

### Common Commands
```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev

# Initialize database
cd backend && npm run init-db

# Build for production
npm run build
```

## Need Help?
Check the main [README.md](README.md) for detailed documentation.






