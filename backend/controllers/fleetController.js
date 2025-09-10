const Fleet = require('./../models/fleetModel');

exports.getAllVehicles = async (req, res) => {
    try {
        const fleets = await Fleet.findAll();
        res.status(200).json(fleets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getVehicleById = async (req, res) => {
    try {
        const vehicle = await Fleet.findByPk(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createFleet = async (req, res) => {
    try {
        const { vehicle_number, vehicle_type, capacity, status } = req.body;
        const newFleet = await Fleet.create({
            vehicle_number,
            vehicle_type,
            capacity,
            status,
            created_at: new Date()
        });
        res.status(201).json(newFleet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateVehicle = async (req, res) => {
    try {
        const { vehicle_number, vehicle_type, capacity, status } = req.body;
        const vehicle = await Fleet.findByPk(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        await vehicle.update({
            vehicle_number,
            vehicle_type,
            capacity,
            status
        });

        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Fleet.findByPk(req.params.id);
        
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        await vehicle.destroy();
        res.status(204).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

