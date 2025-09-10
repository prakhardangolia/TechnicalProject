import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Warehouse.css';
import logo from '../home/logo.png';

const Warehouse = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [newWarehouse, setNewWarehouse] = useState({
        name: '',
        location: '',
        capacity: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/warehouses`);
            setWarehouses(response.data);
        } catch (error) {
            console.error('Error fetching the warehouse data:', error);
            setErrorMessage('Failed to fetch warehouses. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWarehouse({ ...newWarehouse, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const warehouseData = {
                ...newWarehouse,
                created_at: new Date().toISOString()
            };
            
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/warehouses`, warehouseData);
            setWarehouses([...warehouses, response.data]);
            setShowForm(false);
            setNewWarehouse({
                name: '',
                location: '',
                capacity: ''
            });
            setSuccessMessage('Warehouse added successfully!');
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error adding the warehouse:', error);
            setErrorMessage('Failed to add warehouse. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this warehouse?')) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/warehouses/${id}`);
                setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
                setSuccessMessage('Warehouse deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error('Error deleting the warehouse:', error);
                setErrorMessage('Failed to delete warehouse. Please try again.');
            }
        }
    };

    const getCapacityColor = (capacity) => {
        const cap = parseInt(capacity);
        if (cap >= 10000) return 'capacity-high';
        if (cap >= 5000) return 'capacity-medium';
        return 'capacity-low';
    };

    const getCapacityIcon = (capacity) => {
        const cap = parseInt(capacity);
        if (cap >= 10000) return '🏭';
        if (cap >= 5000) return '🏢';
        return '🏪';
    };

    if (isLoading) {
        return (
            <div className="warehouse-loading">
                <div className="loading-spinner"></div>
                <p>Loading warehouse data...</p>
            </div>
        );
    }

    return (
        <div className="warehouse-container">
            {/* Header */}
            <header className="warehouse-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <img src={logo} alt="LogiTech Logo" className="header-logo" />
                            <h1 className="header-brand">LogiTech</h1>
                        </div>
                        <div className="page-info">
                            <h2 className="page-title">Warehouse Management</h2>
                            <p className="page-subtitle">Manage your storage facilities and distribution centers</p>
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
            <main className="warehouse-main">
                {/* Action Bar */}
                <section className="action-bar">
                    <div className="action-content">
                        <div className="action-left">
                            <h3 className="action-title">Storage Overview</h3>
                            <p className="action-subtitle">Total Warehouses: {warehouses.length}</p>
                        </div>
                        <div className="action-right">
                            <button 
                                onClick={() => setShowForm(!showForm)} 
                                className={`toggle-form-button ${showForm ? 'cancel' : 'add'}`}
                            >
                                <span className="button-icon">
                                    {showForm ? '✕' : '➕'}
                                </span>
                                {showForm ? 'Cancel' : 'Add New Warehouse'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Add Warehouse Form */}
                {showForm && (
                    <section className="add-warehouse-form">
                        <div className="form-container">
                            <h3 className="form-title">Add New Warehouse</h3>
                            <form onSubmit={handleFormSubmit} className="warehouse-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">
                                            <span className="label-icon">🏢</span>
                                            Warehouse Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter warehouse name (e.g., Main Distribution Center)"
                                            value={newWarehouse.name}
                                            onChange={handleInputChange}
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="location" className="form-label">
                                            <span className="label-icon">📍</span>
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            placeholder="Enter warehouse location (e.g., New York, NY)"
                                            value={newWarehouse.location}
                                            onChange={handleInputChange}
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="capacity" className="form-label">
                                            <span className="label-icon">📦</span>
                                            Storage Capacity
                                        </label>
                                        <input
                                            type="number"
                                            id="capacity"
                                            name="capacity"
                                            placeholder="Enter capacity in cubic meters"
                                            value={newWarehouse.capacity}
                                            onChange={handleInputChange}
                                            required
                                            className="form-control"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label className="form-label">
                                            <span className="label-icon">ℹ️</span>
                                            Capacity Guide
                                        </label>
                                        <div className="capacity-guide">
                                            <div className="guide-item">
                                                <span className="guide-icon">🏪</span>
                                                <span className="guide-text">Small: &lt; 5,000 m³</span>
                                            </div>
                                            <div className="guide-item">
                                                <span className="guide-icon">🏢</span>
                                                <span className="guide-text">Medium: 5,000 - 10,000 m³</span>
                                            </div>
                                            <div className="guide-item">
                                                <span className="guide-icon">🏭</span>
                                                <span className="guide-text">Large: &gt; 10,000 m³</span>
                                            </div>
                                        </div>
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
                                                Adding Warehouse...
                                            </>
                                        ) : (
                                            <>
                                                <span className="button-icon">✅</span>
                                                Add Warehouse
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

                {/* Warehouses Grid */}
                <section className="warehouses-section">
                    <div className="section-header">
                        <h3 className="section-title">Current Warehouses</h3>
                        <p className="section-subtitle">Monitor and manage your storage facilities</p>
                    </div>
                    
                    <div className="warehouses-grid">
                        {warehouses.map((warehouse) => (
                            <div key={warehouse.id} className="warehouse-card">
                                <div className="warehouse-header">
                                    <div className="warehouse-icon">
                                        {getCapacityIcon(warehouse.capacity)}
                                    </div>
                                    <span className={`warehouse-capacity ${getCapacityColor(warehouse.capacity)}`}>
                                        {warehouse.capacity} m³
                                    </span>
                                </div>
                                
                                <div className="warehouse-info">
                                    <h4 className="warehouse-name">{warehouse.name}</h4>
                                    <div className="warehouse-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Location:</span>
                                            <span className="detail-value">{warehouse.location}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Capacity:</span>
                                            <span className="detail-value">{warehouse.capacity} m³</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Added:</span>
                                            <span className="detail-value">
                                                {new Date(warehouse.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="warehouse-actions">
                                    <button className="edit-button">
                                        <span className="button-icon">✏️</span>
                                        Edit
                                    </button>
                                    <button 
                                        className="delete-button"
                                        onClick={() => handleDelete(warehouse.id)}
                                    >
                                        <span className="button-icon">🗑️</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {warehouses.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🏢</div>
                            <h4 className="empty-title">No Warehouses Found</h4>
                            <p className="empty-subtitle">Start building your storage network by adding your first warehouse</p>
                            <button 
                                onClick={() => setShowForm(true)} 
                                className="add-first-warehouse-button"
                            >
                                <span className="button-icon">➕</span>
                                Add Your First Warehouse
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Warehouse;
