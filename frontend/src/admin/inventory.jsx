import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inventory.css';
import logo from '../home/logo.png';

const Inventory = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterWarehouse, setFilterWarehouse] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/inventory`);
                if (response.ok) {
                    const data = await response.json();
                    setInventoryData(data);
                } else {
                    console.error('Failed to fetch inventory data');
                    setErrorMessage('Failed to fetch inventory data. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching inventory data:', error);
                setErrorMessage('Failed to fetch inventory data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const handleViewDetails = (item) => {
        if (selectedItem && selectedItem.id === item.id) {
            setSelectedItem(null);
        } else {
            setSelectedItem(item);
        }
    };

    const filteredInventory = inventoryData.filter(item => {
        const matchesSearch = 
            item.Product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Warehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesWarehouse = !filterWarehouse || item.warehouse_id.toString() === filterWarehouse;
        const matchesProduct = !filterProduct || item.product_id.toString() === filterProduct;
        
        return matchesSearch && matchesWarehouse && matchesProduct;
    });

    const getStockLevel = (quantity) => {
        if (quantity <= 10) return 'low';
        if (quantity <= 50) return 'medium';
        return 'high';
    };

    const getStockIcon = (quantity) => {
        if (quantity <= 10) return '🔴';
        if (quantity <= 50) return '🟡';
        return '🟢';
    };

    const getStockColor = (quantity) => {
        if (quantity <= 10) return 'stock-low';
        if (quantity <= 50) return 'stock-medium';
        return 'stock-high';
    };

    const totalItems = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockItems = inventoryData.filter(item => item.quantity <= 10).length;
    const uniqueProducts = new Set(inventoryData.map(item => item.product_id)).size;
    const uniqueWarehouses = new Set(inventoryData.map(item => item.warehouse_id)).size;

    if (isLoading) {
        return (
            <div className="inventory-loading">
                <div className="loading-spinner"></div>
                <p>Loading inventory data...</p>
            </div>
        );
    }

    return (
        <div className="inventory-container">
            {/* Header */}
            <header className="inventory-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <img src={logo} alt="LogiTech Logo" className="header-logo" />
                            <h1 className="header-brand">LogiTech</h1>
                        </div>
                        <div className="page-info">
                            <h2 className="page-title">Inventory Management</h2>
                            <p className="page-subtitle">Monitor and manage your product stock levels</p>
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
            <main className="inventory-main">
                {/* Stats Overview */}
                <section className="stats-overview">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-content">
                                <h3 className="stat-number">{totalItems.toLocaleString()}</h3>
                                <p className="stat-label">Total Items in Stock</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏷️</div>
                            <div className="stat-content">
                                <h3 className="stat-number">{uniqueProducts}</h3>
                                <p className="stat-label">Unique Products</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏢</div>
                            <div className="stat-content">
                                <h3 className="stat-number">{uniqueWarehouses}</h3>
                                <p className="stat-label">Warehouses</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-content">
                                <h3 className="stat-number">{lowStockItems}</h3>
                                <p className="stat-label">Low Stock Items</p>
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

                {/* Search and Filters */}
                <section className="search-section">
                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by product name or warehouse..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="filters-container">
                            <select 
                                value={filterWarehouse} 
                                onChange={(e) => setFilterWarehouse(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Warehouses</option>
                                {Array.from(new Set(inventoryData.map(item => item.warehouse_id))).map(id => (
                                    <option key={id} value={id}>
                                        Warehouse #{id}
                                    </option>
                                ))}
                            </select>
                            <select 
                                value={filterProduct} 
                                onChange={(e) => setFilterProduct(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Products</option>
                                {Array.from(new Set(inventoryData.map(item => item.product_id))).map(id => (
                                    <option key={id} value={id}>
                                        Product #{id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="add-inventory-button">
                            <span className="button-icon">➕</span>
                            Add to Inventory
                        </button>
                    </div>
                </section>

                {/* Inventory Grid */}
                <section className="inventory-section">
                    <div className="section-header">
                        <h3 className="section-title">Inventory Overview</h3>
                        <p className="section-subtitle">Track stock levels across all warehouses</p>
                    </div>
                    
                    <div className="inventory-grid">
                        {filteredInventory.map((item) => (
                            <div key={item.id} className="inventory-card">
                                <div className="inventory-header">
                                    <div className="stock-indicator">
                                        <span className="stock-icon">{getStockIcon(item.quantity)}</span>
                                        <span className={`stock-level ${getStockColor(item.quantity)}`}>
                                            {getStockLevel(item.quantity)} Stock
                                        </span>
                                    </div>
                                    <div className="item-id">#{item.id}</div>
                                </div>
                                
                                <div className="inventory-info">
                                    <div className="product-section">
                                        <h4 className="section-subtitle">Product Information</h4>
                                        <div className="detail-item">
                                            <span className="detail-label">Product ID:</span>
                                            <span className="detail-value">#{item.product_id}</span>
                                        </div>
                                        {item.Product && (
                                            <>
                                                <div className="detail-item">
                                                    <span className="detail-label">Name:</span>
                                                    <span className="detail-value">{item.Product.name}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Price:</span>
                                                    <span className="detail-value">${item.Product.price}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="warehouse-section">
                                        <h4 className="section-subtitle">Warehouse Information</h4>
                                        <div className="detail-item">
                                            <span className="detail-label">Warehouse ID:</span>
                                            <span className="detail-value">#{item.warehouse_id}</span>
                                        </div>
                                        {item.Warehouse && (
                                            <>
                                                <div className="detail-item">
                                                    <span className="detail-label">Name:</span>
                                                    <span className="detail-value">{item.Warehouse.name}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Location:</span>
                                                    <span className="detail-value">{item.Warehouse.location}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="stock-section">
                                        <h4 className="section-subtitle">Stock Information</h4>
                                        <div className="detail-item">
                                            <span className="detail-label">Quantity:</span>
                                            <span className={`detail-value stock-quantity ${getStockColor(item.quantity)}`}>
                                                {item.quantity} units
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="inventory-actions">
                                    <button 
                                        className="view-details-button"
                                        onClick={() => handleViewDetails(item)}
                                    >
                                        <span className="button-icon">👁️</span>
                                        {selectedItem && selectedItem.id === item.id ? 'Hide Details' : 'View Details'}
                                    </button>
                                    <button className="edit-button">
                                        <span className="button-icon">✏️</span>
                                        Edit
                                    </button>
                                </div>

                                {/* Expanded Details */}
                                {selectedItem && selectedItem.id === item.id && (
                                    <div className="expanded-details">
                                        <div className="details-grid">
                                            <div className="detail-group">
                                                <h5 className="detail-group-title">Product Details</h5>
                                                <div className="detail-list">
                                                    <div className="detail-row">
                                                        <span className="detail-label">ID:</span>
                                                        <span className="detail-value">#{item.Product?.id}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Name:</span>
                                                        <span className="detail-value">{item.Product?.name}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Description:</span>
                                                        <span className="detail-value">{item.Product?.description}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Price:</span>
                                                        <span className="detail-value">${item.Product?.price}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Stock Quantity:</span>
                                                        <span className="detail-value">{item.Product?.stock_quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="detail-group">
                                                <h5 className="detail-group-title">Warehouse Details</h5>
                                                <div className="detail-list">
                                                    <div className="detail-row">
                                                        <span className="detail-label">ID:</span>
                                                        <span className="detail-value">#{item.Warehouse?.id}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Name:</span>
                                                        <span className="detail-value">{item.Warehouse?.name}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Location:</span>
                                                        <span className="detail-value">{item.Warehouse?.location}</span>
                                                    </div>
                                                    <div className="detail-row">
                                                        <span className="detail-label">Capacity:</span>
                                                        <span className="detail-value">{item.Warehouse?.capacity} m³</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredInventory.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">📦</div>
                            <h4 className="empty-title">
                                {searchTerm || filterWarehouse || filterProduct ? 'No Items Found' : 'No Inventory Yet'}
                            </h4>
                            <p className="empty-subtitle">
                                {searchTerm || filterWarehouse || filterProduct 
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Start building your inventory by adding products to warehouses'
                                }
                            </p>
                            {!searchTerm && !filterWarehouse && !filterProduct && (
                                <button className="add-first-inventory-button">
                                    <span className="button-icon">➕</span>
                                    Add Your First Inventory Item
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Inventory;
