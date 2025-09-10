import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Shipment.css';
import logo from '../home/logo.png';

const Shipment = () => {
    const [shipments, setShipments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newShipment, setNewShipment] = useState({
        order_id: '',
        vehicle_id: '',
        driver_id: '',
        delivery_date: '',
        status: 'Pending'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);
                await Promise.all([
                    fetchShipments(),
                    fetchOrders(),
                    fetchVehicles(),
                    fetchDrivers()
                ]);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorMessage('Failed to fetch data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const fetchShipments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/shipments`);
            if (response.ok) {
                const data = await response.json();
                setShipments(data);
            }
        } catch (error) {
            console.error('Error fetching shipments:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/orders`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchVehicles = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/shipments/available-vehicles`);
            if (response.ok) {
                const data = await response.json();
                setVehicles(data);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/shipments/available-drivers`);
            if (response.ok) {
                const data = await response.json();
                setDrivers(data);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleCreateShipment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/shipments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newShipment)
            });
            
            if (response.ok) {
                const createdShipment = await response.json();
                setShipments(prev => [...prev, createdShipment]);
                setNewShipment({
                    order_id: '',
                    vehicle_id: '',
                    driver_id: '',
                    delivery_date: '',
                    status: 'Pending'
                });
                setShowCreateForm(false);
                setSuccessMessage('Shipment created successfully!');
                
                // Refresh available vehicles and drivers
                await Promise.all([fetchVehicles(), fetchDrivers()]);
                
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrorMessage('Failed to create shipment. Please try again.');
            }
        } catch (error) {
            console.error('Error creating shipment:', error);
            setErrorMessage('Failed to create shipment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'in transit':
                return 'status-in-transit';
            case 'delivered':
                return 'status-delivered';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    const getOrderInfo = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        return order ? `Order #${order.id} - $${order.total_amount}` : 'Unknown Order';
    };

    const getVehicleInfo = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle ? `${vehicle.vehicle_number} (${vehicle.vehicle_type})` : 'Not Assigned';
    };

    const getDriverInfo = (driverId) => {
        const driver = drivers.find(d => d.id === driverId);
        return driver ? driver.name : 'Not Assigned';
    };

    if (isLoading) {
        return (
            <div className="shipment-loading">
                <div className="loading-spinner"></div>
                <p>Loading shipment data...</p>
            </div>
        );
    }

    return (
        <div className="shipment-container">
            {/* Header */}
            <header className="shipment-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <img src={logo} alt="LogiTech Logo" className="header-logo" />
                            <h1 className="header-brand">LogiTech</h1>
                        </div>
                        <div className="page-info">
                            <h2 className="page-title">Shipment Management</h2>
                            <p className="page-subtitle">Create and track package deliveries</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <button 
                            onClick={() => navigate('/AdminDashBoard')} 
                            className="back-button"
                        >
                            <span className="button-icon">←</span>
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="shipment-main">
                {/* Action Bar */}
                <section className="action-bar">
                    <div className="action-content">
                        <div className="action-left">
                            <h3 className="action-title">Shipment Overview</h3>
                            <p className="action-subtitle">Total Shipments: {shipments.length}</p>
                        </div>
                        <div className="action-right">
                            <button 
                                onClick={() => setShowCreateForm(!showCreateForm)} 
                                className={`toggle-form-button ${showCreateForm ? 'cancel' : 'add'}`}
                            >
                                <span className="button-icon">
                                    {showCreateForm ? '✕' : '➕'}
                                </span>
                                {showCreateForm ? 'Cancel' : 'Create Shipment'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Create Shipment Form */}
                {showCreateForm && (
                    <section className="create-shipment-form">
                        <div className="form-container">
                            <h3 className="form-title">Create New Shipment</h3>
                            <form onSubmit={handleCreateShipment} className="shipment-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="order_id" className="form-label">
                                            <span className="label-icon">📋</span>
                                            Select Order
                                        </label>
                                        <select
                                            id="order_id"
                                            name="order_id"
                                            value={newShipment.order_id}
                                            onChange={(e) => setNewShipment({...newShipment, order_id: e.target.value})}
                                            required
                                            className="form-control"
                                        >
                                            <option value="">Choose an order</option>
                                            {orders
                                                .filter(order => order.status === 'Pending')
                                                .map(order => (
                                                    <option key={order.id} value={order.id}>
                                                        Order #{order.id} - ${order.total_amount}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="delivery_date" className="form-label">
                                            <span className="label-icon">📅</span>
                                            Delivery Date
                                        </label>
                                        <input
                                            type="date"
                                            id="delivery_date"
                                            name="delivery_date"
                                            value={newShipment.delivery_date}
                                            onChange={(e) => setNewShipment({...newShipment, delivery_date: e.target.value})}
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="vehicle_id" className="form-label">
                                            <span className="label-icon">🚛</span>
                                            Assign Vehicle
                                        </label>
                                        <select
                                            id="vehicle_id"
                                            name="vehicle_id"
                                            value={newShipment.vehicle_id}
                                            onChange={(e) => setNewShipment({...newShipment, vehicle_id: e.target.value})}
                                            required
                                            className="form-control"
                                        >
                                            <option value="">Select a vehicle</option>
                                            {vehicles
                                                .filter(vehicle => vehicle.status === 'Available')
                                                .map(vehicle => (
                                                    <option key={vehicle.id} value={vehicle.id}>
                                                        {vehicle.vehicle_number} - {vehicle.vehicle_type}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="driver_id" className="form-label">
                                            <span className="label-icon">👨‍💼</span>
                                            Assign Driver
                                        </label>
                                        <select
                                            id="driver_id"
                                            name="driver_id"
                                            value={newShipment.driver_id}
                                            onChange={(e) => setNewShipment({...newShipment, driver_id: e.target.value})}
                                            required
                                            className="form-control"
                                        >
                                            <option value="">Select a driver</option>
                                            {drivers.map(driver => (
                                                <option key={driver.id} value={driver.id}>
                                                    {driver.name} - {driver.license_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button 
                                        type="submit" 
                                        className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Creating Shipment...
                                            </>
                                        ) : (
                                            <>
                                                <span className="button-icon">✅</span>
                                                Create Shipment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                )}

                {/* Messages */}
                {errorMessage && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="success-message">
                        <span className="success-icon">✅</span>
                        {successMessage}
                    </div>
                )}

                {/* Shipments Grid */}
                <section className="shipments-section">
                    <div className="section-header">
                        <h3 className="section-title">Current Shipments</h3>
                        <p className="section-subtitle">Track and manage all package deliveries</p>
                    </div>
                    
                    <div className="shipments-grid">
                        {shipments.map((shipment) => (
                            <div key={shipment.id} className="shipment-card">
                                <div className="shipment-header">
                                    <div className="shipment-icon">
                                        <span className="icon">📦</span>
                                    </div>
                                    <span className={`shipment-status ${getStatusColor(shipment.status)}`}>
                                        {shipment.status}
                                    </span>
                                </div>
                                
                                <div className="shipment-info">
                                    <h4 className="shipment-id">Shipment #{shipment.id}</h4>
                                    <div className="shipment-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Order:</span>
                                            <span className="detail-value">
                                                {getOrderInfo(shipment.order_id)}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Vehicle:</span>
                                            <span className="detail-value">
                                                {getVehicleInfo(shipment.vehicle_id)}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Driver:</span>
                                            <span className="detail-value">
                                                {getDriverInfo(shipment.driver_id)}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Delivery Date:</span>
                                            <span className="detail-value">
                                                {new Date(shipment.delivery_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="shipment-actions">
                                    <button className="edit-button">
                                        <span className="button-icon">✏️</span>
                                        Edit
                                    </button>
                                    <button className="track-button">
                                        <span className="button-icon">📍</span>
                                        Track
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {shipments.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h4 className="empty-title">No Shipments Found</h4>
                            <p className="empty-subtitle">Start managing deliveries by creating your first shipment</p>
                            <button 
                                onClick={() => setShowCreateForm(true)} 
                                className="create-first-shipment-button"
                            >
                                <span className="button-icon">➕</span>
                                Create Your First Shipment
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Shipment;
