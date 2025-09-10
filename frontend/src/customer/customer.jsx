import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Customer.css'; 
import logo from '../home/logo.png';

const Customer = () => {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/customers/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('customerId', data.customerId);
                navigate('/CustomerDashBoard'); 
            } else {
                const data = await response.json();
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Server error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        navigate('/CustomerSignUp'); 
    };

    return (
        <div className="customer-login-container">
            <div className="customer-login-background">
                <div className="customer-login-overlay"></div>
            </div>
            
            <div className="customer-login-card">
                <div className="customer-login-header">
                    <div className="customer-logo-container">
                        <img src={logo} alt="LogiTech Logo" className="customer-logo" />
                        <h1 className="customer-brand">LogiTech</h1>
                    </div>
                    <div className="customer-welcome-text">
                        <h2 className="customer-login-heading">Customer Portal</h2>
                        <p className="customer-login-subtitle">Track your shipments and manage orders</p>
                    </div>
                </div>

                <form className="customer-login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            <span className="label-icon">👤</span>
                            Customer Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="form-control"
                            placeholder="Enter your name (e.g., Alice Smith)"
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
                            placeholder="Enter your password (e.g., 1234565)"
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

                <div className="customer-login-footer">
                    <button 
                        onClick={handleSignUp} 
                        className="signup-button"
                    >
                        <span className="button-icon">✨</span>
                        Create New Account
                    </button>
                    
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

export default Customer;
