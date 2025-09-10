# 🚛 Fleet Management System

## 📋 Overview

The **Fleet Management System** is a core component of the Logistics Management System that handles all vehicle-related operations, driver assignments, and shipment logistics.

## 🏗️ Fleet Table Structure

### **Database Schema:**
```sql
fleet table:
├── id (INT, Primary Key, Auto Increment)
├── vehicle_number (VARCHAR) - License plate or vehicle ID
├── vehicle_type (VARCHAR) - Type of vehicle (Truck, Van, etc.)
├── capacity (INT) - Weight capacity in kilograms
├── status (VARCHAR) - Current status (Available, In Use, Maintenance)
└── created_at (DATETIME) - Timestamp of creation
```

### **Sample Data:**
```sql
INSERT INTO fleet (vehicle_number, vehicle_type, capacity, status) VALUES
('TRK-001', 'Truck', 5000, 'Available'),
('VAN-001', 'Van', 2000, 'Available'),
('TRK-002', 'Truck', 3000, 'Available'),
('VAN-002', 'Van', 1500, 'Available'),
('TRK-003', 'Truck', 4000, 'Available');
```

## 🔗 Relationships

### **Fleet ↔ Drivers (One-to-Many)**
- **Fleet** can have multiple **Drivers** assigned over time
- **Driver** belongs to one **Fleet** vehicle at a time
- Relationship: `drivers.assigned_vehicle_id` → `fleet.id`

### **Fleet ↔ Shipments (Indirect)**
- **Fleet** vehicles are used for **Shipments**
- **Shipments** can be assigned to specific vehicles
- Enables tracking of vehicle usage and delivery routes

## 🎯 Business Use Cases

### **1. Vehicle Management**
- **Add new vehicles** to the fleet
- **Update vehicle information** (capacity, status, etc.)
- **Remove vehicles** from service
- **Track vehicle availability**

### **2. Driver Assignment**
- **Assign drivers** to specific vehicles
- **Reassign drivers** to different vehicles
- **Track driver-vehicle relationships**
- **Manage driver schedules**

### **3. Capacity Planning**
- **Match shipments** to appropriate vehicles
- **Optimize load distribution**
- **Plan delivery routes** based on vehicle capacity
- **Track vehicle utilization**

### **4. Maintenance & Status**
- **Track vehicle status** (Available, In Use, Maintenance)
- **Schedule maintenance** based on usage
- **Monitor vehicle health** and performance
- **Manage fleet availability**

## 🚀 API Endpoints

### **GET /api/v1/fleets**
- **Purpose**: Get all vehicles in the fleet
- **Response**: Array of vehicle objects
- **Use Case**: Display fleet list, populate dropdowns

### **GET /api/v1/fleets/:id**
- **Purpose**: Get specific vehicle details
- **Response**: Single vehicle object
- **Use Case**: View vehicle details, edit vehicle

### **POST /api/v1/fleets**
- **Purpose**: Add new vehicle to fleet
- **Body**: `{ vehicle_number, vehicle_type, capacity, status }`
- **Use Case**: Admin adds new vehicles

### **PATCH /api/v1/fleets/:id**
- **Purpose**: Update vehicle information
- **Body**: `{ vehicle_number, vehicle_type, capacity, status }`
- **Use Case**: Update vehicle details, change status

### **DELETE /api/v1/fleets/:id**
- **Purpose**: Remove vehicle from fleet
- **Use Case**: Decommission vehicles, remove from service

## 💼 Workflow Examples

### **Adding a New Driver:**
1. **Admin** goes to Driver Management
2. **Selects vehicle** from fleet dropdown
3. **Creates driver** with vehicle assignment
4. **System** links driver to vehicle

### **Planning a Shipment:**
1. **Admin** reviews pending orders
2. **Checks fleet availability** and capacity
3. **Assigns appropriate vehicle** to shipment
4. **Assigns available driver** to vehicle
5. **Creates shipment** with vehicle assignment

### **Vehicle Maintenance:**
1. **Admin** updates vehicle status to "Maintenance"
2. **System** prevents assignment to new shipments
3. **Admin** reassigns drivers to other vehicles
4. **After maintenance**, status changed back to "Available"

## 🔧 Technical Implementation

### **Frontend Integration:**
- **Driver forms** use fleet dropdown for vehicle assignment
- **Shipment forms** can include vehicle selection
- **Admin dashboard** shows fleet status and utilization
- **Real-time updates** when vehicle status changes

### **Database Constraints:**
- **Foreign key** from `drivers.assigned_vehicle_id` to `fleet.id`
- **Cascade rules** for vehicle deletion
- **Indexes** on frequently queried fields

### **Business Rules:**
- **One driver per vehicle** at a time
- **Vehicle must be available** for new assignments
- **Capacity limits** must be respected for shipments
- **Status tracking** prevents conflicts

## 📊 Fleet Analytics

### **Key Metrics:**
- **Fleet utilization rate**
- **Vehicle availability**
- **Driver-vehicle assignments**
- **Capacity utilization**
- **Maintenance schedules**

### **Reports:**
- **Fleet status report**
- **Vehicle utilization report**
- **Driver assignment report**
- **Capacity planning report**

## 🎯 Benefits

1. **Efficient Resource Management**: Optimize vehicle and driver usage
2. **Better Planning**: Match shipments to appropriate vehicles
3. **Cost Control**: Track vehicle utilization and maintenance
4. **Improved Service**: Ensure timely deliveries with proper vehicle assignment
5. **Scalability**: Easy to add new vehicles and manage growing fleet

---

*The Fleet Management System is essential for efficient logistics operations, ensuring that the right vehicles are available for the right shipments at the right time.*












