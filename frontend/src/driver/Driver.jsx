import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Driver.css';
import logo from '../home/logo.png';

const Driver = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driverId, setDriverId] = useState('');
  const [driverName, setDriverName] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [assignedShipments, setAssignedShipments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDriverId = localStorage.getItem('driverId');
    if (storedDriverId) {
      setDriverId(storedDriverId);
      setIsLoggedIn(true);
      fetchDriverData(storedDriverId);
      fetchAssignedShipments(storedDriverId);
    }
  }, []);

  const fetchDriverData = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/drivers/${id}`);
      if (response.data) {
        setDriverName(response.data.name);
        setPhone(response.data.phone);
        setLicenseNumber(response.data.license_number);
      }
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  const fetchAssignedShipments = async (id) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/shipments?driver_id=${id}`);
      setAssignedShipments(response.data || []);
    } catch (error) {
      console.error('Error fetching assigned shipments:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/drivers`);
      const drivers = response.data;
      const driver = drivers.find(d => d.phone === phone && d.license_number === licenseNumber);

      if (driver) {
        localStorage.setItem('driverId', driver.id);
        setDriverId(driver.id);
        setDriverName(driver.name);
        setIsLoggedIn(true);
        fetchAssignedShipments(driver.id);
        setSuccessMessage('Login successful!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Invalid phone number or license number.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('driverId');
    setIsLoggedIn(false);
    setDriverId('');
    setDriverName('');
    setPhone('');
    setLicenseNumber('');
    setAssignedShipments([]);
  };

  const updateShipmentStatus = async (shipmentId, newStatus) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/v1/shipments/${shipmentId}`, {
        status: newStatus
      });

      setSuccessMessage(`Shipment status updated to ${newStatus}`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh shipments
      fetchAssignedShipments(driverId);
    } catch (error) {
      console.error('Error updating shipment status:', error);
      setErrorMessage('Failed to update shipment status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'in transit': return '#3b82f6';
      case 'out for delivery': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (isLoggedIn) {
    return (
      <div className="driver-dashboard">
        <header className="driver-header">
          <div className="header-content">
            <div className="logo-section">
              <img src={logo} alt="LogiTech Logo" className="logo-img" />
              <span className="logo-text">Driver Portal</span>
            </div>
            <div className="driver-info">
              <span className="driver-name">Welcome, {driverName}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </header>

        <div className="driver-container">
          <div className="driver-sidebar">
            <div className="driver-profile">
              <h3>Driver Profile</h3>
              <div className="profile-info">
                <p><strong>Name:</strong> {driverName}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>License:</strong> {licenseNumber}</p>
              </div>
            </div>
          </div>

          <div className="driver-main">
            <div className="shipments-section">
              <h2>My Assigned Shipments</h2>
              {successMessage && <div className="success-message">{successMessage}</div>}
              {errorMessage && <div className="error-message">{errorMessage}</div>}

              {assignedShipments.length === 0 ? (
                <div className="no-shipments">
                  <p>No shipments assigned to you at the moment.</p>
                </div>
              ) : (
                <div className="shipments-grid">
                  {assignedShipments.map((shipment) => (
                    <div key={shipment.id} className="shipment-card">
                      <div className="shipment-header">
                        <h3>Shipment #{shipment.tracking_number}</h3>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(shipment.status) }}
                        >
                          {shipment.status}
                        </span>
                      </div>

                      <div className="shipment-details">
                        <p><strong>Order ID:</strong> {shipment.order_id}</p>
                        <p><strong>Shipment Date:</strong> {new Date(shipment.shipment_date).toLocaleDateString()}</p>
                        <p><strong>Delivery Date:</strong> {new Date(shipment.delivery_date).toLocaleDateString()}</p>
                        {shipment.Order && (
                          <p><strong>Total Amount:</strong> ${shipment.Order.total_amount}</p>
                        )}
                      </div>

                      <div className="status-actions">
                        <h4>Update Status:</h4>
                        <div className="status-buttons">
                          <button
                            onClick={() => updateShipmentStatus(shipment.id, 'In Transit')}
                            className="status-btn transit"
                            disabled={shipment.status === 'In Transit'}
                          >
                            In Transit
                          </button>
                          <button
                            onClick={() => updateShipmentStatus(shipment.id, 'Out for Delivery')}
                            className="status-btn delivery"
                            disabled={shipment.status === 'Out for Delivery'}
                          >
                            Out for Delivery
                          </button>
                          <button
                            onClick={() => updateShipmentStatus(shipment.id, 'Delivered')}
                            className="status-btn delivered"
                            disabled={shipment.status === 'Delivered'}
                          >
                            Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-login">
      <div className="login-container">
        <div className="login-header">
          <img src={logo} alt="LogiTech Logo" className="login-logo" />
          <h1>Driver Portal</h1>
          <p>Access your assigned shipments and update delivery status</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="license">License Number</label>
            <input
              type="text"
              id="license"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Enter your license number"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Need help? Contact your supervisor</p>
        </div>
      </div>
    </div>
  );
};

export default Driver;
