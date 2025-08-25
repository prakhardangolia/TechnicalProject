# Logistics Management System

A full-stack web application for managing logistics operations including customers, suppliers, orders, shipments, inventory, and fleet management.

## Features

- **Customer Management**: Customer registration, profiles, and order tracking
- **Supplier Management**: Supplier registration and management
- **Order Management**: Complete order lifecycle management
- **Inventory Management**: Warehouse and inventory tracking
- **Fleet Management**: Vehicle and driver management
- **Shipment Tracking**: Real-time shipment status updates
- **Transport Logs**: Detailed transport activity logging
- **Admin Dashboard**: Comprehensive administrative interface

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **RESTful API** architecture

### Frontend
- **React.js** with React Router
- **Axios** for API communication
- **CSS** for styling

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Logistics-Management-System-main
```

### 2. Database Setup

1. **Install MySQL** if you haven't already
2. **Create a MySQL database**:
   ```sql
   CREATE DATABASE logistic_management;
   ```
3. **Update database credentials** in `backend/config1.env`:
   ```env
   DB_NAME=logistic_management
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   PORT=5000
   NODE_ENV=development
   ```

### 3. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the backend server**:
   ```bash
   # For development (with auto-restart)
   npm run dev
   
   # For production
   npm start
   ```

   The backend will run on `http://localhost:5000`

### 4. Frontend Setup

1. **Open a new terminal and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the frontend development server**:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3500`

## API Endpoints

The backend provides the following API endpoints:

- **Admins**: `/api/v1/admins`
- **Customers**: `/api/v1/customers`
- **Drivers**: `/api/v1/drivers`
- **Fleets**: `/api/v1/fleets`
- **Inventory**: `/api/v1/inventory`
- **Orders**: `/api/v1/orders`
- **Order Items**: `/api/v1/orderItems`
- **Products**: `/api/v1/products`
- **Shipments**: `/api/v1/shipments`
- **Suppliers**: `/api/v1/suppliers`
- **Transport Logs**: `/api/v1/transportLogs`
- **Warehouses**: `/api/v1/warehouses`

## Usage

1. **Access the application** at `http://localhost:3500`
2. **Navigate through different modules** using the sidebar
3. **Create, view, update, and delete** records as needed
4. **Track shipments** and manage inventory in real-time

## Project Structure

```
Logistics-Management-System-main/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # API controllers
│   ├── models/               # Sequelize models
│   ├── routes/               # API routes
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   └── config1.env          # Environment variables
├── frontend/
│   ├── src/
│   │   ├── admin/           # Admin components
│   │   ├── customer/        # Customer components
│   │   ├── supplier/        # Supplier components
│   │   └── home/           # Home page components
│   └── public/             # Static files
└── README.md
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure MySQL is running
   - Verify database credentials in `config1.env`
   - Check if the database exists

2. **Port Already in Use**:
   - Change the port in `config1.env` for backend
   - Change the port in `frontend/package.json` for frontend

3. **Module Not Found Errors**:
   - Run `npm install` in both backend and frontend directories
   - Clear node_modules and reinstall if needed

### Development Tips

- Use `npm run dev` in backend for auto-restart during development
- Check browser console for frontend errors
- Monitor backend console for API errors
- Use MySQL Workbench or similar tool to verify database operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

Alden Crist Rego