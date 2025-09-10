import React, { useEffect, useState } from 'react';
import './Fleet.css';

const Fleet = () => {
    const [vehicles, setVehicles] = useState([]);
    const [newVehicle, setNewVehicle] = useState({
        vehicle_number: '',
        vehicle_type: '',
        capacity: '',
        status: 'Available'
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/fleets`);
            if (response.ok) {
                const data = await response.json();
                setVehicles(data);
            } else {
                console.error('Failed to fetch vehicles');
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicle(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/fleets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newVehicle)
            });
            if (response.ok) {
                const addedVehicle = await response.json();
                setVehicles(prevVehicles => [...prevVehicles, addedVehicle]);
                setNewVehicle({ vehicle_number: '', vehicle_type: '', capacity: '', status: 'Available' });
                document.getElementById('addVehicleForm').style.display = 'none';
            } else {
                console.error('Failed to add vehicle');
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
        }
    };

    const showForm = () => {
        document.getElementById('addVehicleForm').style.display = 'block';
    };

    const handleDeleteVehicle = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/fleets/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id));
            } else {
                console.error('Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const vehicle = vehicles.find(v => v.id === id);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/fleets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...vehicle,
                    status: newStatus
                })
            });
            if (response.ok) {
                fetchVehicles(); // Refresh the list
            } else {
                console.error('Failed to update vehicle status');
            }
        } catch (error) {
            console.error('Error updating vehicle status:', error);
        }
    };

    return (
        <div className="fleet-container">
            <header className="fleet-header">
                <h1>Fleet Management</h1>
            </header>
            <main className="fleet-main">
                <button className="show-form-button" onClick={showForm}>Add New Vehicle</button>
                
                <form id="addVehicleForm" style={{ display: 'none' }} onSubmit={handleAddVehicle}>
                    <h2>Add New Vehicle</h2>
                    <label>
                        Vehicle Number:
                        <input
                            type="text"
                            name="vehicle_number"
                            value={newVehicle.vehicle_number}
                            onChange={handleChange}
                            placeholder="e.g., TRK-001"
                            required
                        />
                    </label>
                    <label>
                        Vehicle Type:
                        <select
                            name="vehicle_type"
                            value={newVehicle.vehicle_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select vehicle type</option>
                            <option value="Truck">Truck</option>
                            <option value="Van">Van</option>
                            <option value="Car">Car</option>
                            <option value="Motorcycle">Motorcycle</option>
                        </select>
                    </label>
                    <label>
                        Capacity (kg):
                        <input
                            type="number"
                            name="capacity"
                            value={newVehicle.capacity}
                            onChange={handleChange}
                            placeholder="e.g., 5000"
                            required
                        />
                    </label>
                    <label>
                        Status:
                        <select
                            name="status"
                            value={newVehicle.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Available">Available</option>
                            <option value="In Use">In Use</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </label>
                    <button type="submit">Add Vehicle</button>
                </form>

                <table className="fleet-table">
                    <thead>
                        <tr>
                            <th>Vehicle Number</th>
                            <th>Type</th>
                            <th>Capacity (kg)</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.vehicle_number}</td>
                                <td>{vehicle.vehicle_type}</td>
                                <td>{vehicle.capacity}</td>
                                <td>
                                    <select
                                        value={vehicle.status}
                                        onChange={(e) => handleUpdateStatus(vehicle.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="Available">Available</option>
                                        <option value="In Use">In Use</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </td>
                                <td>{new Date(vehicle.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        onClick={() => handleDeleteVehicle(vehicle.id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default Fleet;












