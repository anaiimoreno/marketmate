import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/Manager.css';

const Manager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/manager'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe(); // Clean up on unmount
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome, Manager</h1>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h2>Inventory</h2>
            <p>Manage current store stock</p>
            <button onClick={() => navigate('/manager/inventory')}>Go to Inventory </button>
          </div>

          <div className="dashboard-card">
            <h2>Schedules</h2>
            <p>View or assign employee shifts</p>
            <button onClick={() => navigate('/manager/schedule')}>Go to Schedule</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;
