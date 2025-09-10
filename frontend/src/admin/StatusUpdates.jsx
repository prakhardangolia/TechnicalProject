import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StatusUpdates.css';
import logo from '../home/logo.png';

const StatusUpdates = () => {
  const [statusUpdates, setStatusUpdates] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    if (!adminId) {
      navigate('/Admin');
      return;
    }
    fetchStatusUpdates();
    fetchPendingApprovals();
  }, [adminId, navigate]);

  const fetchStatusUpdates = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/statusUpdates`);
      setStatusUpdates(response.data.data || []);
    } catch (error) {
      console.error('Error fetching status updates:', error);
      setErrorMessage('Failed to fetch status updates');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/statusUpdates/pending-approvals`);
      setPendingApprovals(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  const handleApproval = async (updateId, isApproved) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/v1/statusUpdates/${updateId}/approve`, {
        is_approved: isApproved,
        admin_id: parseInt(adminId)
      });

      setSuccessMessage(`Status update ${isApproved ? 'approved' : 'rejected'} successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Refresh data
      fetchStatusUpdates();
      fetchPendingApprovals();
    } catch (error) {
      console.error('Error updating approval status:', error);
      setErrorMessage('Failed to update approval status');
    }
  };

  const getStakeholderName = (update) => {
    if (update.Customer) return update.Customer.name;
    if (update.Supplier) return update.Supplier.name;
    if (update.Driver) return update.Driver.name;
    if (update.Admin) return update.Admin.name;
    return 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'cancellation requested': return '#dc2626';
      case 'in transit': return '#3b82f6';
      case 'delivered': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStakeholderTypeColor = (type) => {
    switch (type) {
      case 'customer': return '#ec4899';
      case 'supplier': return '#f59e0b';
      case 'driver': return '#3b82f6';
      case 'admin': return '#10b981';
      default: return '#6b7280';
    }
  };

  const filteredUpdates = activeTab === 'pending' ? pendingApprovals : statusUpdates;

  if (isLoading) {
    return (
      <div className="status-updates-loading">
        <div className="loading-spinner"></div>
        <p>Loading status updates...</p>
      </div>
    );
  }

  return (
    <div className="status-updates-container">
      <header className="status-updates-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={logo} alt="LogiTech Logo" className="logo-img" />
            <span className="logo-text">Status Updates Management</span>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/AdminDashBoard')} className="back-btn">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="status-updates-main">
        <div className="status-updates-sidebar">
          <div className="sidebar-section">
            <h3>Navigation</h3>
            <div className="nav-tabs">
              <button 
                className={`nav-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Updates ({statusUpdates.length})
              </button>
              <button 
                className={`nav-tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Approval ({pendingApprovals.length})
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{statusUpdates.length}</span>
                <span className="stat-label">Total Updates</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{pendingApprovals.length}</span>
                <span className="stat-label">Pending Approval</span>
              </div>
            </div>
          </div>
        </div>

        <div className="status-updates-content">
          <div className="content-header">
            <h2>
              {activeTab === 'pending' ? 'Pending Approvals' : 'All Status Updates'}
            </h2>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>

          <div className="updates-grid">
            {filteredUpdates.length === 0 ? (
              <div className="no-updates">
                <p>No {activeTab === 'pending' ? 'pending approvals' : 'status updates'} found.</p>
              </div>
            ) : (
              filteredUpdates.map((update) => (
                <div key={update.id} className="update-card">
                  <div className="update-header">
                    <div className="update-info">
                      <span 
                        className="stakeholder-type"
                        style={{ backgroundColor: getStakeholderTypeColor(update.stakeholder_type) }}
                      >
                        {update.stakeholder_type}
                      </span>
                      <span className="update-id">#{update.id}</span>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(update.new_status) }}
                    >
                      {update.new_status}
                    </span>
                  </div>

                  <div className="update-details">
                    <p><strong>Stakeholder:</strong> {getStakeholderName(update)}</p>
                    <p><strong>Previous Status:</strong> {update.previous_status || 'N/A'}</p>
                    <p><strong>New Status:</strong> {update.new_status}</p>
                    <p><strong>Date:</strong> {new Date(update.created_at).toLocaleDateString()}</p>
                    
                    {update.order_id && (
                      <p><strong>Order ID:</strong> {update.order_id}</p>
                    )}
                    {update.shipment_id && (
                      <p><strong>Shipment ID:</strong> {update.shipment_id}</p>
                    )}
                    
                    {update.update_reason && (
                      <p><strong>Reason:</strong> {update.update_reason}</p>
                    )}
                    
                    {update.cancellation_reason && (
                      <p><strong>Cancellation Reason:</strong> {update.cancellation_reason}</p>
                    )}
                    
                    {update.customer_notes && (
                      <p><strong>Customer Notes:</strong> {update.customer_notes}</p>
                    )}
                    
                    {update.internal_notes && (
                      <p><strong>Internal Notes:</strong> {update.internal_notes}</p>
                    )}
                  </div>

                  {update.requires_approval && update.is_approved === null && (
                    <div className="approval-actions">
                      <h4>Approval Required</h4>
                      <div className="approval-buttons">
                        <button 
                          className="approve-btn"
                          onClick={() => handleApproval(update.id, true)}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="reject-btn"
                          onClick={() => handleApproval(update.id, false)}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {update.is_approved !== null && (
                    <div className="approval-status">
                      <span className={`approval-badge ${update.is_approved ? 'approved' : 'rejected'}`}>
                        {update.is_approved ? '✓ Approved' : '✗ Rejected'}
                      </span>
                      {update.Approver && (
                        <p>by {update.Approver.name}</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdates;
