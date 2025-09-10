import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SupplierR.css';
import logo from '../home/logo.png';

const SupplierRecord = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/suppliers`);
                if (response.ok) {
                    const data = await response.json();
                    setSuppliers(data);
                } else {
                    console.error('Failed to fetch suppliers');
                    setErrorMessage('Failed to fetch suppliers. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching suppliers:', error);
                setErrorMessage('Failed to fetch suppliers. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSupplierIcon = (name) => {
        const firstLetter = name.charAt(0).toUpperCase();
        return firstLetter;
    };

    const getSupplierStatus = (supplier) => {
        // You can add logic here to determine supplier status based on activity, orders, etc.
        return 'Active';
    };

    if (isLoading) {
        return (
            <div className="supplier-record-loading">
                <div className="loading-spinner"></div>
                <p>Loading supplier records...</p>
            </div>
        );
    }

    return (
        <div className="supplier-record-container">
            {/* Header */}
            <header className="supplier-record-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <img src={logo} alt="LogiTech Logo" className="header-logo" />
                            <h1 className="header-brand">LogiTech</h1>
                        </div>
                        <div className="page-info">
                            <h2 className="page-title">Supplier Management</h2>
                            <p className="page-subtitle">Manage and monitor your supplier network</p>
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
            <main className="supplier-record-main">
                {/* Stats Overview */}
                <section className="stats-overview">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🏢</div>
                            <div className="stat-content">
                                <h3 className="stat-number">{suppliers.length}</h3>
                                <p className="stat-label">Total Suppliers</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <h3 className="stat-number">
                                    {suppliers.filter(s => getSupplierStatus(s) === 'Active').length}
                                </h3>
                                <p className="stat-label">Active Suppliers</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📧</div>
                            <div className="stat-content">
                                <h3 className="stat-number">
                                    {suppliers.filter(s => s.email).length}
                                </h3>
                                <p className="stat-label">With Email</p>
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

                {/* Search and Actions */}
                <section className="search-section">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search suppliers by name, contact, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <button className="add-supplier-button">
                            <span className="button-icon">➕</span>
                            Add New Supplier
                        </button>
                    </div>
                </section>

                {/* Suppliers Grid */}
                <section className="suppliers-section">
                    <div className="section-header">
                        <h3 className="section-title">Supplier Directory</h3>
                        <p className="section-subtitle">Manage your business relationships and partnerships</p>
                    </div>
                    
                    <div className="suppliers-grid">
                        {filteredSuppliers.map((supplier) => (
                            <div key={supplier.id} className="supplier-card">
                                <div className="supplier-header">
                                    <div className="supplier-avatar">
                                        <span className="avatar-text">{getSupplierIcon(supplier.name)}</span>
                                    </div>
                                    <span className={`supplier-status ${getSupplierStatus(supplier).toLowerCase()}`}>
                                        {getSupplierStatus(supplier)}
                                    </span>
                                </div>
                                
                                <div className="supplier-info">
                                    <h4 className="supplier-name">{supplier.name}</h4>
                                    <div className="supplier-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Contact:</span>
                                            <span className="detail-value">{supplier.contact_name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Phone:</span>
                                            <span className="detail-value">{supplier.phone}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Email:</span>
                                            <span className="detail-value">{supplier.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Address:</span>
                                            <span className="detail-value">{supplier.address}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Added:</span>
                                            <span className="detail-value">
                                                {new Date(supplier.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="supplier-actions">
                                    <button 
                                        className="view-button"
                                        onClick={() => setSelectedSupplier(supplier)}
                                    >
                                        <span className="button-icon">👁️</span>
                                        View Details
                                    </button>
                                    <button className="edit-button">
                                        <span className="button-icon">✏️</span>
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredSuppliers.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🏢</div>
                            <h4 className="empty-title">
                                {searchTerm ? 'No Suppliers Found' : 'No Suppliers Yet'}
                            </h4>
                            <p className="empty-subtitle">
                                {searchTerm 
                                    ? 'Try adjusting your search terms'
                                    : 'Start building your supplier network by adding your first supplier'
                                }
                            </p>
                            {!searchTerm && (
                                <button className="add-first-supplier-button">
                                    <span className="button-icon">➕</span>
                                    Add Your First Supplier
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Supplier Details Modal */}
                {selectedSupplier && (
                    <div className="modal-overlay" onClick={() => setSelectedSupplier(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <div className="modal-title">
                                    <div className="modal-icon">🏢</div>
                                    <h3>Supplier Details</h3>
                                </div>
                                <button 
                                    className="close-button"
                                    onClick={() => setSelectedSupplier(null)}
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Supplier ID:</span>
                                        <span className="detail-value">#{selectedSupplier.id}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Company Name:</span>
                                        <span className="detail-value">{selectedSupplier.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Contact Person:</span>
                                        <span className="detail-value">{selectedSupplier.contact_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Phone Number:</span>
                                        <span className="detail-value">{selectedSupplier.phone}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Email Address:</span>
                                        <span className="detail-value">{selectedSupplier.email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Address:</span>
                                        <span className="detail-value">{selectedSupplier.address}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Registration Date:</span>
                                        <span className="detail-value">
                                            {new Date(selectedSupplier.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-footer">
                                <button className="edit-supplier-button">
                                    <span className="button-icon">✏️</span>
                                    Edit Supplier
                                </button>
                                <button className="close-modal-button">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SupplierRecord;
