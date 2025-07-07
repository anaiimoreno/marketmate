    import React from 'react';
    import { Link } from 'react-router-dom';
    import '../styles/Navbar.css';

    const Navbar = () => {
    return (
        <header className="navbar">
        <nav className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/manager/dashboard">Services</Link>
        </nav>
        <div className="navbar-brand">MarketMate</div>
        </header>
    );
    };

    export default Navbar;

