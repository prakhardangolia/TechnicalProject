import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CustomerDashBoard.css';
import logo from '../home/logo.png';

const CustomerDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inventory');

  const [showOrders, setShowOrders] = useState(false);
  const [showOrderItems, setShowOrderItems] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedOrderForCancellation, setSelectedOrderForCancellation] = useState(null);

  const customerId = localStorage.getItem('customerId');
  const navigate = useNavigate();
  
  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/inventory`);
      const availableInventory = response.data.filter(item => item.quantity > 0);
      setInventory(availableInventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orders?customer_id=${customerId}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [customerId]);

  // Fetch order items
  const fetchOrderItems = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/orderItems?customer_id=${customerId}`);
      setOrderItems(response.data);
    } catch (error) {
      console.error('Error fetching order items:', error);
    }
  }, [customerId]);

  // Fetch shipments
  const fetchShipments = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/shipments?customer_id=${customerId}`);
      setShipments(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  }, [customerId]);

  // Fetch status updates for customer's orders
  const fetchStatusUpdates = useCallback(async () => {
    try {
      const orderIds = orders.map(order => order.id);
      const statusUpdatesPromises = orderIds.map(orderId =>
        axios.get(`${process.env.REACT_APP_API_URL}/api/v1/statusUpdates/order/${orderId}`)
      );
      const responses = await Promise.all(statusUpdatesPromises);
      const allUpdates = responses.flatMap(response => response.data.data || []);
      setStatusUpdates(allUpdates);
    } catch (error) {
      console.error('Error fetching status updates:', error);
    }
  }, [orders]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchInventory(),
        fetchOrders(),
        fetchOrderItems(),
        fetchShipments()
      ]);
      setIsLoading(false);
    };
    
    if (customerId) {
      fetchAllData();
    } else {
      navigate('/Customer');
      return;
    }
  }, [fetchInventory, fetchOrders, fetchOrderItems, fetchShipments, customerId, navigate]);

  useEffect(() => {
    if (orders.length > 0) {
      fetchStatusUpdates();
    }
  }, [orders, fetchStatusUpdates]);

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
  };

  const handleOrder = async () => {
    if (!selectedProduct) {
      setErrorMessage('Please select a product.');
      return;
    }

    const selectedInventoryItem = inventory.find(item => item.Product.id === parseInt(selectedProduct));

    if (!selectedInventoryItem) {
      setErrorMessage('Selected product is not available in inventory.');
      return;
    }

    if (selectedInventoryItem.quantity === 0) {
      setErrorMessage('Out of stock');
      return;
    }

    if (quantity > selectedInventoryItem.quantity) {
      setErrorMessage(`Only ${selectedInventoryItem.quantity} items in stock.`);
      return;
    }

    const { Product } = selectedInventoryItem;
    const totalAmount = Product.price * quantity;

    try {
      // Create order
      const orderResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/orders`, {
        customer_id: customerId,
        order_date: new Date().toISOString(),
        status: 'Pending',
        total_amount: totalAmount
      });

      const orderId = orderResponse.data.id;

      // Create order item
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/orderItems`, {
        order_id: orderId,
        product_id: Product.id,
        quantity: quantity,
        unit_price: Product.price
      });

      // Update inventory
      await axios.put(`${process.env.REACT_APP_API_URL}/api/v1/inventory/${selectedInventoryItem.id}`, {
        quantity: selectedInventoryItem.quantity - quantity
      });

      alert('Order placed successfully!');
      setSelectedProduct(null);
      setQuantity(1);
      setErrorMessage('');
      
      // Refresh data
      fetchInventory();
      fetchOrders();
      fetchOrderItems();
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage('Failed to place order. Please try again.');
    }
  };

  const handleCancellationRequest = async () => {
    if (!cancellationReason.trim()) {
      setErrorMessage('Please provide a reason for cancellation.');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/statusUpdates/cancel`, {
        order_id: selectedOrderForCancellation.id,
        customer_id: parseInt(customerId),
        cancellation_reason: cancellationReason,
        customer_notes: `Cancellation requested by customer`
      });

      setSuccessMessage('Cancellation request submitted successfully. We will review and get back to you.');
      setShowCancellationModal(false);
      setCancellationReason('');
      setSelectedOrderForCancellation(null);
      setErrorMessage('');

      // Refresh status updates
      fetchStatusUpdates();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting cancellation request:', error);
      setErrorMessage('Failed to submit cancellation request. Please try again.');
    }
  };

  const openCancellationModal = (order) => {
    setSelectedOrderForCancellation(order);
    setShowCancellationModal(true);
    setCancellationReason('');
    setErrorMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('customerId');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="customer-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="customer-dashboard-container">
      {/* Header */}
      <header className="customer-dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <img src={logo} alt="LogiTech Logo" className="dashboard-logo" />
              <h1 className="dashboard-brand">LogiTech</h1>
            </div>
            <div className="welcome-section">
              <h2 className="welcome-title">Customer Dashboard</h2>
              <p className="welcome-subtitle">Track orders, view inventory, and manage shipments</p>
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
      <main className="customer-dashboard-main">
        {/* Navigation Tabs */}
        <section className="navigation-tabs">
          <div className="tabs-container">
            <button 
              className={`tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <span className="tab-icon">📦</span>
              Inventory
            </button>
            <button 
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="tab-icon">📋</span>
              Orders
            </button>
            <button 
              className={`tab-button ${activeTab === 'shipments' ? 'active' : ''}`}
              onClick={() => setActiveTab('shipments')}
            >
              <span className="tab-icon">🚚</span>
              Shipments
            </button>
          </div>
        </section>

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <section className="inventory-section">
            <div className="section-header">
              <h3 className="section-title">Available Products</h3>
              <p className="section-subtitle">Browse and order from our current inventory</p>
            </div>
            
            <div className="inventory-grid">
              {inventory.map((item) => (
                <div key={item.id} className="inventory-card">
                  <div className="product-info">
                    <h4 className="product-name">{item.Product.name}</h4>
                    <p className="product-description">{item.Product.description}</p>
                    <div className="product-details">
                      <span className="product-price">${item.Product.price}</span>
                      <span className="product-stock">Stock: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button 
                      className={`select-button ${selectedProduct === item.Product.id ? 'selected' : ''}`}
                      onClick={() => handleProductSelect(item.Product.id)}
                    >
                      {selectedProduct === item.Product.id ? '✓ Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedProduct && (
              <div className="order-form">
                <h4 className="order-form-title">Place Order</h4>
                <div className="order-form-content">
                  <div className="quantity-input">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="form-control"
                    />
                  </div>
                  <button className="place-order-button" onClick={handleOrder}>
                    <span className="button-icon">🛒</span>
                    Place Order
                  </button>
                </div>
                {errorMessage && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errorMessage}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <section className="orders-section">
            <div className="section-header">
              <h3 className="section-title">Your Orders</h3>
              <p className="section-subtitle">Track the status of your placed orders</p>
            </div>
            
            <div className="orders-grid">
              {orders.map((order) => {
                const orderStatusUpdates = statusUpdates.filter(update => update.order_id === order.id);
                return (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <h4 className="order-id">Order #{order.id}</h4>
                      <span className={`order-status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <p className="order-date">Date: {new Date(order.order_date).toLocaleDateString()}</p>
                      <p className="order-amount">Total: ${order.total_amount}</p>
                    </div>
                    
                    {/* Status Updates */}
                    {orderStatusUpdates.length > 0 && (
                      <div className="status-updates">
                        <h5>Status Updates:</h5>
                        {orderStatusUpdates.map((update, index) => (
                          <div key={index} className="status-update-item">
                            <span className="update-date">
                              {new Date(update.created_at).toLocaleDateString()}
                            </span>
                            <span className="update-status">{update.new_status}</span>
                            {update.customer_notes && (
                              <p className="update-notes">{update.customer_notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Order Actions */}
                    <div className="order-actions">
                      {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                        <button 
                          className="cancel-order-btn"
                          onClick={() => openCancellationModal(order)}
                        >
                          Request Cancellation
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Shipments Tab */}
        {activeTab === 'shipments' && (
          <section className="shipments-section">
            <div className="section-header">
              <h3 className="section-title">Your Shipments</h3>
              <p className="section-subtitle">Track your package deliveries</p>
            </div>
            
            <div className="shipments-grid">
              {shipments.map((shipment) => (
                <div key={shipment.id} className="shipment-card">
                  <div className="shipment-header">
                    <h4 className="shipment-id">Shipment #{shipment.id}</h4>
                    <span className={`shipment-status ${shipment.status.toLowerCase()}`}>
                      {shipment.status}
                    </span>
                  </div>
                  <div className="shipment-details">
                    <p className="shipment-date">Date: {new Date(shipment.shipment_date).toLocaleDateString()}</p>
                    <p className="shipment-route">Route: {shipment.route}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cancellation Modal */}
        {showCancellationModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Request Order Cancellation</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowCancellationModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <p>Order #{selectedOrderForCancellation?.id}</p>
                <div className="form-group">
                  <label htmlFor="cancellation-reason">Reason for Cancellation:</label>
                  <textarea
                    id="cancellation-reason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please provide a reason for cancellation..."
                    rows="4"
                    className="form-control"
                  />
                </div>
                {errorMessage && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowCancellationModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleCancellationRequest}
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
