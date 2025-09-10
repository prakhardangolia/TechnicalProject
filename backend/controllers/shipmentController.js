const Shipment = require('./../models/shipmentModel');
const Order = require('./../models/orderModel');
const Fleet = require('./../models/fleetModel');
const Driver = require('./../models/driverModel');
const { Op } = require('sequelize');

exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await Shipment.findAll({
            include: [
                { model: Order },
                { model: Fleet },
                { model: Driver }
            ]
        });
        res.status(200).json(shipments);
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({ error: 'Failed to fetch shipments' });
    }
};

exports.createShipment = async (req, res) => {
    try {
        const { order_id, vehicle_id, driver_id, shipment_date, delivery_date, status, tracking_number } = req.body;
        
        // Generate tracking number if not provided
        const finalTrackingNumber = tracking_number || `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        const newShipment = await Shipment.create({
            order_id,
            vehicle_id,
            driver_id,
            shipment_date: shipment_date || new Date(),
            delivery_date,
            status: status || 'Pending',
            tracking_number: finalTrackingNumber
        });
        
        res.status(201).json(newShipment);
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
};

exports.createShipmentWithAutoAssignment = async (req, res) => {
    try {
        const { order_id, delivery_date, status } = req.body;
        
        // Get order details to determine shipment requirements
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        // Find available vehicles based on capacity
        const availableVehicles = await Fleet.findAll({
            where: {
                status: 'Available'
            },
            order: [['capacity', 'DESC']] // Prefer larger capacity vehicles
        });
        
        if (availableVehicles.length === 0) {
            return res.status(400).json({ error: 'No available vehicles found' });
        }
        
        // Find available drivers
        const availableDrivers = await Driver.findAll({
            where: {
                assigned_vehicle_id: {
                    [Op.or]: [null, availableVehicles.map(v => v.id)]
                }
            }
        });
        
        // Select best vehicle and driver
        const selectedVehicle = availableVehicles[0]; // First available vehicle
        const selectedDriver = availableDrivers.find(driver => 
            driver.assigned_vehicle_id === selectedVehicle.id || driver.assigned_vehicle_id === null
        );
        
        // Generate tracking number
        const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Create shipment
        const newShipment = await Shipment.create({
            order_id,
            vehicle_id: selectedVehicle.id,
            driver_id: selectedDriver ? selectedDriver.id : null,
            shipment_date: new Date(),
            delivery_date,
            status: status || 'Pending',
            tracking_number: trackingNumber
        });
        
        // Update vehicle status to "In Use"
        await selectedVehicle.update({ status: 'In Use' });
        
        // Update driver assignment if driver was selected
        if (selectedDriver) {
            await selectedDriver.update({ assigned_vehicle_id: selectedVehicle.id });
        }
        
        res.status(201).json({
            shipment: newShipment,
            assignedVehicle: selectedVehicle,
            assignedDriver: selectedDriver,
            message: 'Shipment created with automatic vehicle assignment'
        });
    } catch (error) {
        console.error('Error creating shipment with auto assignment:', error);
        res.status(500).json({ error: 'Failed to create shipment' });
    }
};

exports.updateShipment = async (req, res) => {
    try {
        const { vehicle_id, driver_id, status, delivery_date } = req.body;
        const shipment = await Shipment.findByPk(req.params.id);
        
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }
        
        // Update shipment
        await shipment.update({
            vehicle_id,
            driver_id,
            status,
            delivery_date
        });
        
        res.status(200).json(shipment);
    } catch (error) {
        console.error('Error updating shipment:', error);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
};

exports.deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findByPk(req.params.id);

        if (!shipment) {
            return res.status(404).json({ status: 'fail', message: 'Shipment not found' });
        }

        // If vehicle was assigned, make it available again
        if (shipment.vehicle_id) {
            const vehicle = await Fleet.findByPk(shipment.vehicle_id);
            if (vehicle) {
                await vehicle.update({ status: 'Available' });
            }
        }

        await shipment.destroy();

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};

exports.getAvailableVehicles = async (req, res) => {
    try {
        const vehicles = await Fleet.findAll({
            where: {
                status: 'Available'
            },
            order: [['capacity', 'DESC']]
        });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching available vehicles:', error);
        res.status(500).json({ error: 'Failed to fetch available vehicles' });
    }
};

exports.getAvailableDrivers = async (req, res) => {
    try {
        // Get all drivers - we'll filter on the frontend if needed
        const drivers = await Driver.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(drivers);
    } catch (error) {
        console.error('Error fetching available drivers:', error);
        res.status(500).json({ error: 'Failed to fetch available drivers' });
    }
};