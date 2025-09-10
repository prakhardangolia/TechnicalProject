import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Admin.css'; 
import logo from '../home/logo.png';

const Admin = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/admins/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('adminId', data.adminId); 
                navigate('/AdminDashBoard'); 
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Server error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-background">
                <div className="admin-login-overlay"></div>
            </div>
            
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-logo-container">
                        <img src={logo} alt="LogiTech Logo" className="admin-logo" />
                        <h1 className="admin-brand">LogiTech</h1>
                    </div>
                    <div className="admin-welcome-text">
                        <h2 className="admin-login-heading">Admin Portal</h2>
                        <p className="admin-login-subtitle">Access your logistics management dashboard</p>
                    </div>
                </div>

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            <span className="label-icon">👤</span>
                            Admin Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="form-control"
                            placeholder="Enter your admin name"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            <span className="label-icon">🔒</span>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control"
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Signing In...
                            </>
                        ) : (
                            <>
                                <span className="button-icon">🚀</span>
                                Access Dashboard
                            </>
                        )}
                    </button>
                    
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}
                </form>

                <div className="admin-login-footer">
                    <p className="admin-login-info">
                        <span className="info-icon">ℹ️</span>
                        Secure access to logistics management system
                    </p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="back-home-button"
                    >
                        <span className="button-icon">🏠</span>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Admin;
