import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/Customer.css';

const Customer = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="customer-container">
        {/* Left-side illustration panel (image background via CSS) */}
        <div className="illustration-panel"></div>

        {/* Right-side content */}
        <div className="customer-content">
          <h2 className="customer-title">Customer</h2>
          <div className="customer-welcome">
            <strong>Welcome!!</strong><br />
            Through our platform, we aim to simplify your shopping experience so shopping in store becomes easier!<br />
            Test one of our services to experience some helpful ways for the next time you go shopping.
          </div>
          <div className="customer-section">
            <p>View store prices and stock of your favorite goods!</p>
            <button onClick={() => navigate('/customer/inventory')}>Get started!</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customer;
