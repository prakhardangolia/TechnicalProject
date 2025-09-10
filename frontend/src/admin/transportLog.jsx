import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TransportLog.css';
import logo from '../home/logo.png';

const TransportLog = () => {
    const [transportLogs, setTransportLogs] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [selectedFleet, setSelectedFleet] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [activeTab, setActiveTab] = useState('logs');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransportLogs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/transportLogs`);
                const data = await response.json();
                setTransportLogs(data);
            } catch (error) {
                console.error('Error fetching transport logs:', error);
                setErrorMessage('Failed to fetch transport logs. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransportLogs();
    }, []);

    const handleShipmentClick = (shipment) => {
        setSelectedShipment(shipment);
        setSelectedFleet(null);
        setSelectedDriver(null);
        setActiveTab('shipment');
    };

    const handleFleetClick = (fleet) => {
        setSelectedFleet(fleet);
        setSelectedShipment(null);
        setSelectedDriver(null);
        setActiveTab('fleet');
    };

    const handleDriverClick = (driver) => {
        setSelectedDriver(driver);
        setSelectedShipment(null);
        setSelectedFleet(null);
        setActiveTab('driver');
    };

    const getDuration = (startTime, endTime) => {
        if (!startTime || !endTime) return 'N/A';
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}h ${diffMinutes}m`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'status-completed';
            case 'in progress':
                return 'status-in-progress';
            case 'pending':
                return 'status-pending';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    if (isLoading) {
        return (
            <div className="transport-log-loading">
                <div className="loading-spinner"></div>
                <p>Loading transport logs...</p>
            </div>
        );
    }

    return (
        <div className="transport-log-container">
            {/* Header */}
            <header className="transport-log-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <img src={logo} alt="LogiTech Logo" className="header-logo" />
                            <h1 className="header-brand">LogiTech</h1>
                        </div>
                        <div className="page-info">
                            <h2 className="page-title">Transport Logs</h2>
                            <p className="page-subtitle">Track and monitor all transportation activities</p>
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
            <main className="transport-log-main">
                {/* Stats Overview */}
                <section className="stats-overview">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🚛</div>
                            <div className="stat-content">
                                <h3 className="stat-number">{transportLogs.length}</h3>
                                <p className="stat-label">Total Transport Logs</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⏱️</div>
                            <div className="stat-content">
                                <h3 className="stat-number">
                                    {transportLogs.filter(log => log.end_time).length}
                                </h3>
                                <p className="stat-label">Completed Trips</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔄</div>
                            <div className="stat-content">
                                <h3 className="stat-number">
                                    {transportLogs.filter(log => !log.end_time).length}
                                </h3>
                                <p className="stat-label">Active Trips</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Error Message */}
                {errorMessage && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {errorMessage}
                    </div>
                )}

                {/* Content Tabs */}
                <section className="content-section">
                    <div className="tab-navigation">
                        <button 
                            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
                            onClick={() => setActiveTab('logs')}
                        >
                            <span className="tab-icon">📋</span>
                            Transport Logs
                        </button>
                        {selectedShipment && (
                            <button 
                                className={`tab-button ${activeTab === 'shipment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('shipment')}
                            >
                                <span className="tab-icon">📦</span>
                                Shipment Details
                            </button>
                        )}
                        {selectedFleet && (
                            <button 
                                className={`tab-button ${activeTab === 'fleet' ? 'active' : ''}`}
                                onClick={() => setActiveTab('fleet')}
                            >
                                <span className="tab-icon">🚗</span>
                                Vehicle Details
                            </button>
                        )}
                        {selectedDriver && (
                            <button 
                                className={`tab-button ${activeTab === 'driver' ? 'active' : ''}`}
                                onClick={() => setActiveTab('driver')}
                            >
                                <span className="tab-icon">👨‍💼</span>
                                Driver Details
                            </button>
                        )}
                    </div>

                    {/* Transport Logs Tab */}
                    {activeTab === 'logs' && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h3 className="section-title">Transport Activity Logs</h3>
                                <p className="section-subtitle">Monitor all transportation movements and activities</p>
                            </div>
                            
                            <div className="logs-grid">
                                {transportLogs.map(log => (
                                    <div key={log.id} className="log-card">
                                        <div className="log-header">
                                            <div className="log-id">Log #{log.id}</div>
                                            <div className="log-status">
                                                {log.end_time ? 'Completed' : 'Active'}
                                            </div>
                                        </div>
                                        
                                        <div className="log-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Shipment:</span>
                                                <button 
                                                    className="detail-link"
                                                    onClick={() => handleShipmentClick(log.Shipment)}
                                                >
                                                    #{log.shipment_id}
                                                </button>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Vehicle:</span>
                                                <button 
                                                    className="detail-link"
                                                    onClick={() => handleFleetClick(log.Fleet)}
                                                >
                                                    #{log.vehicle_id}
                                                </button>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Driver:</span>
                                                <button 
                                                    className="detail-link"
                                                    onClick={() => handleDriverClick(log.Driver)}
                                                >
                                                    #{log.driver_id}
                                                </button>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Start Time:</span>
                                                <span className="detail-value">
                                                    {new Date(log.start_time).toLocaleString()}
                                                </span>
                                            </div>
                                            {log.end_time && (
                                                <div className="detail-row">
                                                    <span className="detail-label">End Time:</span>
                                                    <span className="detail-value">
                                                        {new Date(log.end_time).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="detail-row">
                                                <span className="detail-label">Duration:</span>
                                                <span className="detail-value">
                                                    {getDuration(log.start_time, log.end_time)}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="log-actions">
                                            <button className="view-details-button">
                                                <span className="button-icon">👁️</span>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {transportLogs.length === 0 && (
                                <div className="empty-state">
                                    <div className="empty-icon">🚛</div>
                                    <h4 className="empty-title">No Transport Logs Found</h4>
                                    <p className="empty-subtitle">Transport logs will appear here as shipments are processed</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Shipment Details Tab */}
                    {activeTab === 'shipment' && selectedShipment && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h3 className="section-title">Shipment Details</h3>
                                <p className="section-subtitle">Complete information about the selected shipment</p>
                            </div>
                            
                            <div className="details-card">
                                <div className="details-header">
                                    <div className="details-icon">📦</div>
                                    <div className="details-title">
                                        <h4>Shipment #{selectedShipment.id}</h4>
                                        <span className={`status-badge ${getStatusColor(selectedShipment.status)}`}>
                                            {selectedShipment.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Order ID:</span>
                                        <span className="detail-value">{selectedShipment.order_id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Shipment Date:</span>
                                        <span className="detail-value">
                                            {new Date(selectedShipment.shipment_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Delivery Date:</span>
                                        <span className="detail-value">
                                            {new Date(selectedShipment.delivery_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Tracking Number:</span>
                                        <span className="detail-value">{selectedShipment.tracking_number}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Created At:</span>
                                        <span className="detail-value">
                                            {new Date(selectedShipment.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Fleet Details Tab */}
                    {activeTab === 'fleet' && selectedFleet && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h3 className="section-title">Vehicle Details</h3>
                                <p className="section-subtitle">Complete information about the selected vehicle</p>
                            </div>
                            
                            <div className="details-card">
                                <div className="details-header">
                                    <div className="details-icon">🚗</div>
                                    <div className="details-title">
                                        <h4>Vehicle #{selectedFleet.id}</h4>
                                        <span className={`status-badge ${getStatusColor(selectedFleet.status)}`}>
                                            {selectedFleet.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Vehicle Number:</span>
                                        <span className="detail-value">{selectedFleet.vehicle_number}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Vehicle Type:</span>
                                        <span className="detail-value">{selectedFleet.vehicle_type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Capacity:</span>
                                        <span className="detail-value">{selectedFleet.capacity} kg</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Status:</span>
                                        <span className="detail-value">{selectedFleet.status}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Created At:</span>
                                        <span className="detail-value">
                                            {new Date(selectedFleet.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Driver Details Tab */}
                    {activeTab === 'driver' && selectedDriver && (
                        <div className="tab-content">
                            <div className="section-header">
                                <h3 className="section-title">Driver Details</h3>
                                <p className="section-subtitle">Complete information about the selected driver</p>
                            </div>
                            
                            <div className="details-card">
                                <div className="details-header">
                                    <div className="details-icon">👨‍💼</div>
                                    <div className="details-title">
                                        <h4>Driver #{selectedDriver.id}</h4>
                                        <span className="status-badge status-active">Active</span>
                                    </div>
                                </div>
                                
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Name:</span>
                                        <span className="detail-value">{selectedDriver.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">License Number:</span>
                                        <span className="detail-value">{selectedDriver.license_number}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Phone:</span>
                                        <span className="detail-value">{selectedDriver.phone}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Assigned Vehicle:</span>
                                        <span className="detail-value">
                                            {selectedDriver.assigned_vehicle_id || 'Not Assigned'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Created At:</span>
                                        <span className="detail-value">
                                            {new Date(selectedDriver.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default TransportLog;
