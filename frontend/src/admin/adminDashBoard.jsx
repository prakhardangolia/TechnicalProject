import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashBoard.css';
import logo from '../home/logo.png';

const AdminDashboard = () => {
    const [adminName, setAdminName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const adminId = localStorage.getItem('adminId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admins/${adminId}`);
                if (response.ok) {
                    const data = await response.json();
                    setAdminName(data.data.admin.name);
                } else {
                    console.error('Failed to fetch admin name');
                }
            } catch (error) {
                console.error('Error fetching admin name:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (adminId) {
            fetchAdminName();
        } else {
            setIsLoading(false);
        }
    }, [adminId]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.toLowerCase();
        if (query === 'drivers' || query === 'Drivers') {
            navigate('/Driver');
        } else if (query === 'transportlogs' || query === 'Transportlogs') {
            navigate('/TransportLog');
        } else if (query === 'suppliers' || query === 'Suppliers') {
            navigate('/SupplierRecord');
        }else if (query === 'inventory' || query === 'Inventory') {
            navigate('/Inventory');
        }else if (query === 'shipment' || query === 'Shipment') {
            navigate('/Shipment');
        }else if (query === 'warehouse'  || query === 'Warehouse') {
            navigate('/Warehouse');
        } else if (query === 'fleet' || query === 'Fleet') {
            navigate('/Fleet');
        } else if (query === 'Vehicles' || query === 'fleets') {
            navigate('/VehicleRecord');
        } else if (query === 'customer' || query === 'customers') {
            navigate('/CustomerRecord');
        } else if (query === 'product' || query === 'products'|| query === 'Products') {
            navigate('/ProductRecord');
        } else if (query === 'orderitems' || query === 'Orderitems') {
            navigate('/OrderItemsRecord');
        } else if (query === 'orders' || query === 'Orders') {
            navigate('/OrderRecord');
        } 
    };

    const handleLogout = () => {
        localStorage.removeItem('adminId');
        navigate('/'); // Navigate to the home page
    };

    const quickActions = [
        { name: 'Drivers', icon: '🚛', color: '#3b82f6', route: '/Driver' },
        { name: 'Transport Logs', icon: '📋', color: '#10b981', route: '/TransportLog' },
        { name: 'Suppliers', icon: '🏭', color: '#f59e0b', route: '/SupplierRecord' },
        { name: 'Inventory', icon: '📦', color: '#8b5cf6', route: '/Inventory' },
        { name: 'Shipments', icon: '🚢', color: '#ef4444', route: '/Shipment' },
        { name: 'Warehouses', icon: '🏢', color: '#06b6d4', route: '/Warehouse' },
        { name: 'Fleet', icon: '🚗', color: '#84cc16', route: '/Fleet' },
        { name: 'Vehicles', icon: '🚚', color: '#f97316', route: '/VehicleRecord' },
        { name: 'Customers', icon: '👥', color: '#ec4899', route: '/CustomerRecord' },
        { name: 'Products', icon: '🛍️', color: '#6366f1', route: '/ProductRecord' },
        { name: 'Order Items', icon: '📝', color: '#14b8a6', route: '/OrderItemsRecord' },
        { name: 'Orders', icon: '📋', color: '#f43f5e', route: '/OrderRecord' },
        { name: 'Status Updates', icon: '🔄', color: '#8b5cf6', route: '/StatusUpdates' }
    ];

    if (isLoading) {
        return (
            <div className="admin-dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (!adminId) {
        navigate('/Admin');
        return null;
    }

    return (
        <div className="admin-dashboard-container">
            {/* Header */}
            <header className="admin-dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <img src={logo} alt="LogiTech Logo" className="dashboard-logo" />
                            <h1 className="dashboard-brand">LogiTech</h1>
                        </div>
                        <div className="welcome-section">
                            <h2 className="welcome-title">Welcome back, <span className="admin-name">{adminName}</span>!</h2>
                            <p className="welcome-subtitle">Manage your logistics operations with ease</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="logout-button" onClick={handleLogout}>
                            <span className="button-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="admin-dashboard-main">
                {/* Search Section */}
                <section className="search-section">
                    <div className="search-container">
                        <h3 className="search-title">Quick Navigation</h3>
                        <p className="search-subtitle">Search for any section to navigate quickly</p>
                        <form onSubmit={handleSearch} className="search-form">
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search for Drivers, Inventory, Shipments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                <button type="submit" className="search-button">
                                    <span className="search-icon">🔍</span>
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Quick Actions Grid */}
                <section className="quick-actions-section">
                    <div className="section-header">
                        <h3 className="section-title">Quick Actions</h3>
                        <p className="section-subtitle">Access all management sections with one click</p>
                    </div>
                    
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <div 
                                key={index}
                                className="quick-action-card"
                                onClick={() => navigate(action.route)}
                                style={{ '--accent-color': action.color }}
                            >
                                <div className="action-icon">{action.icon}</div>
                                <h4 className="action-name">{action.name}</h4>
                                <div className="action-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Dashboard Info */}
                <section className="dashboard-info-section">
                    <div className="info-card">
                        <div className="info-header">
                            <h3 className="info-title">System Overview</h3>
                            <div className="info-icon">📊</div>
                        </div>
                        <p className="info-description">
                            This is the admin dashboard where you can manage all aspects of your logistics operations. 
                            From driver management to inventory control, shipment tracking to warehouse operations - 
                            everything is accessible through the quick action cards above.
                        </p>
                        <div className="info-features">
                            <div className="feature-item">
                                <span className="feature-icon">✅</span>
                                <span>Add and manage drivers</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✅</span>
                                <span>Check warehouse status</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✅</span>
                                <span>Manage inventory levels</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✅</span>
                                <span>Notify suppliers about low stock</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">✅</span>
                                <span>Assign drivers and vehicles to deliveries</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
