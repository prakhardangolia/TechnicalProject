const { DataTypes } = require('sequelize');
const sequelize = require('./../config/db');
const Order = require('./orderModel');
const Shipment = require('./shipmentModel');
const Customer = require('./customerModel');
const Supplier = require('./supplierModel');
const Driver = require('./driverModel');
const Admin = require('./adminModel');

const StatusUpdate = sequelize.define('StatusUpdate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    shipment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'shipments',
            key: 'id'
        }
    },
    stakeholder_type: {
        type: DataTypes.ENUM('customer', 'supplier', 'driver', 'admin'),
        allowNull: false
    },
    stakeholder_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    previous_status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    new_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    update_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    customer_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    internal_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_cancellation_request: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    requires_approval: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: null
    },
    approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'admins',
            key: 'id'
        }
    },
    approved_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'status_updates',
    timestamps: false
});

// Define relationships
StatusUpdate.belongsTo(Order, { foreignKey: 'order_id' });
StatusUpdate.belongsTo(Shipment, { foreignKey: 'shipment_id' });
StatusUpdate.belongsTo(Customer, { foreignKey: 'stakeholder_id', constraints: false });
StatusUpdate.belongsTo(Supplier, { foreignKey: 'stakeholder_id', constraints: false });
StatusUpdate.belongsTo(Driver, { foreignKey: 'stakeholder_id', constraints: false });
StatusUpdate.belongsTo(Admin, { foreignKey: 'stakeholder_id', constraints: false });
StatusUpdate.belongsTo(Admin, { foreignKey: 'approved_by', as: 'Approver' });

module.exports = StatusUpdate;
