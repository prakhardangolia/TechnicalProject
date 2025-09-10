import React, { useState } from 'react';
import './Home.css';
import logo from './logo.png'; 
import { NavLink, useNavigate } from 'react-router-dom';

const Home = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleTrack = () => {
    if (trackingNumber) {
      navigate('/ShipmentDetails', { state: { trackingNumber } });
    } else {
      setErrorMessage('Please enter a valid tracking number.');
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo-container">
              <img src={logo} alt="Logistics Logo" className="logo-img" />
              <span className="logo-text">LogiTech</span>
            </div>
            <div className="nav-items-container">
              <ul className="nav-links">
                <li><NavLink to="/" className="nav-link active">Home</NavLink></li>
                <li><NavLink to="/Admin" className="nav-link">Admin</NavLink></li>
                <li><NavLink to="/Customer" className="nav-link">Customer</NavLink></li>
                <li><NavLink to="/Supplier" className="nav-link">Supplier</NavLink></li>
                <li><NavLink to="/Driver" className="nav-link">Driver</NavLink></li>
                <li><button onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })} className="nav-link">Services</button></li>
                <li><button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} className="nav-link">Contact</button></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span>🚀 Leading Logistics Solutions</span>
            </div>
            <h1 className="hero-title">
              Transform Your 
              <span className="highlight"> Supply Chain</span>
            </h1>
            <p className="hero-subtitle">
              Experience seamless logistics management with AI-powered visibility, 
              real-time tracking, and intelligent optimization for your business.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Countries</div>
              </div>
            </div>
            <div className="tracking-section">
              <div className="tracking-container">
                <div className="tracking-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Enter your tracking number" 
                    className="tracking-input" 
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <div className="tracking-icon">📦</div>
                </div>
                <button className="tracking-button" onClick={handleTrack}>
                  <span>Track Package</span>
                  <div className="button-arrow">→</div>
                </button>
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-illustration">
              <div className="floating-card card-1">
                <div className="card-icon">🏭</div>
                <div className="card-text">Warehouse</div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🚛</div>
                <div className="card-text">Delivery</div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">🌐</div>
                <div className="card-text">Global</div>
              </div>
              <div className="floating-card card-4">
                <div className="card-icon">📊</div>
                <div className="card-text">Analytics</div>
              </div>
              <div className="center-logo">
                <div className="logo-circle">
                  <div className="logo-icon">📦</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Services</div>
            <h2 className="section-title">
              Comprehensive Solutions for 
              <span className="highlight"> Every Need</span>
            </h2>
            <p className="section-subtitle">
              From freight management to real-time tracking, we provide end-to-end 
              logistics solutions that drive your business forward.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon-wrapper">
                <div className="service-icon">🚢</div>
              </div>
              <h3>Freight Management</h3>
              <p>End-to-end freight solutions across all transportation modes with real-time visibility and optimization.</p>
              <div className="service-features">
                <span>• Multi-modal transport</span>
                <span>• Route optimization</span>
                <span>• Cost management</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <div className="service-icon">🔗</div>
              </div>
              <h3>Supply Chain Solutions</h3>
              <p>Intelligent supply chain optimization with predictive analytics and automated decision-making.</p>
              <div className="service-features">
                <span>• Predictive analytics</span>
                <span>• Risk management</span>
                <span>• Performance metrics</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <div className="service-icon">📱</div>
              </div>
              <h3>Real-time Tracking</h3>
              <p>Live shipment tracking with instant notifications, ETAs, and comprehensive delivery insights.</p>
              <div className="service-features">
                <span>• Live updates</span>
                <span>• Smart notifications</span>
                <span>• Delivery insights</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <div className="service-icon">📦</div>
              </div>
              <h3>Inventory Management</h3>
              <p>Advanced inventory control with automated reordering, stock optimization, and warehouse management.</p>
              <div className="service-features">
                <span>• Auto reordering</span>
                <span>• Stock optimization</span>
                <span>• Warehouse control</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <div className="service-icon">🚗</div>
              </div>
              <h3>Fleet Management</h3>
              <p>Complete fleet and driver management with route optimization, maintenance scheduling, and performance tracking.</p>
              <div className="service-features">
                <span>• Route optimization</span>
                <span>• Maintenance alerts</span>
                <span>• Performance tracking</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon-wrapper">
                <div className="service-icon">🔄</div>
              </div>
              <h3>Order Management</h3>
              <p>Seamless order processing from creation to fulfillment with automated workflows and real-time updates.</p>
              <div className="service-features">
                <span>• Automated workflows</span>
                <span>• Real-time updates</span>
                <span>• Fulfillment tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Why Choose Us</div>
            <h2 className="section-title">
              The <span className="highlight">Smart Choice</span> for Logistics
            </h2>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Real-time processing and instant updates keep you ahead of the competition.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Reliable</h3>
              <p>Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h3>Global Reach</h3>
              <p>Connect with partners and customers worldwide through our extensive network.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <h3>Scalable Growth</h3>
              <p>Grow your business with our flexible solutions that adapt to your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <div className="section-header">
                <div className="section-badge">Get In Touch</div>
                <h2 className="section-title">
                  Ready to <span className="highlight">Transform</span> Your Operations?
                </h2>
                <p className="section-subtitle">
                  Let's discuss how our logistics solutions can drive your business forward.
                </p>
              </div>
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div className="contact-details">
                    <h4>Email Us</h4>
                    <p>info@logitech.com</p>
                    <span>We'll respond within 2 hours</span>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <h4>Call Us</h4>
                    <p>+1 (555) 123-4567</p>
                    <span>Available 24/7 for support</span>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📍</div>
                  <div className="contact-details">
                    <h4>Visit Us</h4>
                    <p>123 Logistics Way, Tech City</p>
                    <span>Schedule a meeting anytime</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <div className="form-header">
                <h3>Send us a Message</h3>
                <p>We'd love to hear from you</p>
              </div>
              <form className="contact-form-fields">
                <div className="form-row">
                  <div className="form-group">
                    <input type="text" placeholder="First Name" className="form-input" />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Last Name" className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Email Address" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Company" className="form-input" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Tell us about your logistics needs..." className="form-textarea" rows="4"></textarea>
                </div>
                <button type="submit" className="submit-button">
                  <span>Send Message</span>
                  <div className="button-arrow">→</div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <img src={logo} alt="LogiTech Logo" className="footer-logo-img" />
                <span className="footer-logo-text">LogiTech</span>
              </div>
              <p className="footer-description">
                Transforming logistics through cutting-edge technology and innovative solutions. 
                Your success is our mission.
              </p>
              <div className="social-links">
                <a href="#" className="social-link">📘</a>
                <a href="#" className="social-link">🐦</a>
                <a href="#" className="social-link">💼</a>
                <a href="#" className="social-link">📷</a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/Admin">Admin Portal</NavLink></li>
                <li><NavLink to="/Customer">Customer Portal</NavLink></li>
                <li><NavLink to="/Supplier">Supplier Portal</NavLink></li>
                <li><NavLink to="/Driver">Driver Portal</NavLink></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Our Services</h4>
              <ul className="footer-links">
                <li>Freight Management</li>
                <li>Supply Chain Solutions</li>
                <li>Real-time Tracking</li>
                <li>Inventory Management</li>
                <li>Fleet Management</li>
                <li>Order Management</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul className="footer-links">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Contact Support</li>
                <li>Status Page</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2024 LogiTech Logistics Management System. All rights reserved.</p>
              <div className="footer-bottom-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
