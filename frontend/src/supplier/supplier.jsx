import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Supplier.css'; 
import logo from '../home/logo.png';

const Supplier = () => {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/suppliers/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                
                // Store the supplier ID in local storage
                localStorage.setItem('supplierId', data.supplierId);

                // Navigate to SupplierDashboard
                navigate('/SupplierDashboard');
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

    const handleSignUp = () => {
        navigate('/SupplierSignUp'); 
    };

    return (
        <div className="supplier-login-container">
            <div className="supplier-login-background">
                <div className="supplier-login-overlay"></div>
            </div>
            
            <div className="supplier-login-card">
                <div className="supplier-login-header">
                    <div className="supplier-logo-container">
                        <img src={logo} alt="LogiTech Logo" className="supplier-logo" />
                        <h1 className="supplier-brand">LogiTech</h1>
                    </div>
                    <div className="supplier-welcome-text">
                        <h2 className="supplier-login-heading">Supplier Portal</h2>
                        <p className="supplier-login-subtitle">Manage inventory and fulfill orders</p>
                    </div>
                </div>

                <form className="supplier-login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            <span className="label-icon">🏭</span>
                            Supplier Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="form-control"
                            placeholder="Enter your supplier name"
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

                <div className="supplier-login-footer">
                    <button 
                        onClick={handleSignUp} 
                        className="signup-button"
                    >
                        <span className="button-icon">✨</span>
                        Become a Supplier
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

export default Supplier;
