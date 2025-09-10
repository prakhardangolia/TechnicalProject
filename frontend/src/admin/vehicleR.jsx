import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VehicleR.css';
import logo from '../home/logo.png';

const VehicleRecord = () => {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({
    vehicle_number: '',
    vehicle_type: '',
    capacity: '',
    status: 'Available',
    created_at: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/fleets`);
        setVehicles(response.data);
      } catch (error) {
        console.error('There was an error fetching the vehicles!', error);
        setErrorMessage('Failed to fetch vehicles. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle({ ...newVehicle, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Add today's date to the new vehicle data
    const vehicleWithDate = {
      ...newVehicle,
      created_at: new Date().toISOString(),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/fleets`, vehicleWithDate);
      
      setVehicles([...vehicles, response.data]);
      setSuccessMessage('Vehicle added successfully!');

      // Reset the form
      setNewVehicle({
        vehicle_number: '',
        vehicle_type: '',
        capacity: '',
        status: 'Available',
        created_at: '',
      });

      setShowForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('There was an error adding the vehicle!', error);
      setErrorMessage('Failed to add vehicle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'In Use':
        return 'status-in-use';
      case 'Maintenance':
        return 'status-maintenance';
      case 'Out of Service':
        return 'status-out-of-service';
      default:
        return 'status-available';
    }
  };

  const getVehicleTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'truck':
        return '🚛';
      case 'van':
        return '🚐';
      case 'car':
        return '🚗';
      case 'motorcycle':
        return '🏍️';
      case 'bicycle':
        return '🚲';
      default:
        return '🚗';
    }
  };

  if (isLoading) {
    return (
      <div className="vehicle-record-loading">
        <div className="loading-spinner"></div>
        <p>Loading vehicle records...</p>
      </div>
    );
  }

  return (
    <div className="vehicle-record-container">
      {/* Header */}
      <header className="vehicle-record-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-container">
              <img src={logo} alt="LogiTech Logo" className="header-logo" />
              <h1 className="header-brand">LogiTech</h1>
            </div>
            <div className="page-info">
              <h2 className="page-title">Vehicle Management</h2>
              <p className="page-subtitle">Add and manage your fleet vehicles</p>
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
      <main className="vehicle-record-main">
        {/* Action Bar */}
        <section className="action-bar">
          <div className="action-content">
            <div className="action-left">
              <h3 className="action-title">Fleet Overview</h3>
              <p className="action-subtitle">Total Vehicles: {vehicles.length}</p>
            </div>
            <div className="action-right">
              <button 
                onClick={() => setShowForm(!showForm)} 
                className={`toggle-form-button ${showForm ? 'cancel' : 'add'}`}
              >
                <span className="button-icon">
                  {showForm ? '✕' : '➕'}
                </span>
                {showForm ? 'Cancel' : 'Add New Vehicle'}
              </button>
            </div>
          </div>
        </section>

        {/* Add Vehicle Form */}
        {showForm && (
          <section className="add-vehicle-form">
            <div className="form-container">
              <h3 className="form-title">Add New Vehicle</h3>
              <form onSubmit={handleSubmit} className="vehicle-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vehicle_number" className="form-label">
                      <span className="label-icon">🔢</span>
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      id="vehicle_number"
                      name="vehicle_number"
                      placeholder="Enter vehicle number (e.g., ABC-123)"
                      value={newVehicle.vehicle_number}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="vehicle_type" className="form-label">
                      <span className="label-icon">🚗</span>
                      Vehicle Type
                    </label>
                    <select
                      id="vehicle_type"
                      name="vehicle_type"
                      value={newVehicle.vehicle_type}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    >
                      <option value="">Select vehicle type</option>
                      <option value="Truck">Truck</option>
                      <option value="Van">Van</option>
                      <option value="Car">Car</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Bicycle">Bicycle</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="capacity" className="form-label">
                      <span className="label-icon">📦</span>
                      Capacity
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      placeholder="Enter capacity (e.g., 1000 kg)"
                      value={newVehicle.capacity}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="status" className="form-label">
                      <span className="label-icon">📊</span>
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newVehicle.status}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    >
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Out of Service">Out of Service</option>
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
                        Adding Vehicle...
                      </>
                    ) : (
                      <>
                        <span className="button-icon">✅</span>
                        Add Vehicle
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

        {/* Vehicles Grid */}
        <section className="vehicles-section">
          <div className="section-header">
            <h3 className="section-title">Current Fleet</h3>
            <p className="section-subtitle">Manage and monitor your vehicle fleet</p>
          </div>
          
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-header">
                  <div className="vehicle-icon">
                    {getVehicleTypeIcon(vehicle.vehicle_type)}
                  </div>
                  <span className={`vehicle-status ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>
                
                <div className="vehicle-info">
                  <h4 className="vehicle-number">{vehicle.vehicle_number}</h4>
                  <p className="vehicle-type">{vehicle.vehicle_type}</p>
                  <div className="vehicle-details">
                    <div className="detail-item">
                      <span className="detail-label">Capacity:</span>
                      <span className="detail-value">{vehicle.capacity} kg</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Added:</span>
                      <span className="detail-value">
                        {new Date(vehicle.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="vehicle-actions">
                  <button className="edit-button">
                    <span className="button-icon">✏️</span>
                    Edit
                  </button>
                  <button className="view-button">
                    <span className="button-icon">👁️</span>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {vehicles.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h4 className="empty-title">No Vehicles Found</h4>
              <p className="empty-subtitle">Start building your fleet by adding your first vehicle</p>
              <button 
                onClick={() => setShowForm(true)} 
                className="add-first-vehicle-button"
              >
                <span className="button-icon">➕</span>
                Add Your First Vehicle
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default VehicleRecord;
