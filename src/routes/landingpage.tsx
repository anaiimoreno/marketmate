import React from "react";
import '../styles/landingpage.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';


<div className="button-group">
  <button>Manager</button>
  <Link to="/customer">
    <button>Customer</button>
  </Link>
</div>


const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="landing-container">
        <div className="illustration-panel">
            
            </div>
        <div className="content-panel">
          <h1 className="landing-heading">
            An easier way to <br />
            enhance your grocery <br />
            store experience
          </h1>
          <p className="landing-subtext">
            To get started, please select the appropriate log in
          </p>
          <div className="button-group">
        <Link to="/manager">
          <button>Manager</button>
        </Link>
         <Link to="/customer">
           <button>Customer</button>
         </Link>
        </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
