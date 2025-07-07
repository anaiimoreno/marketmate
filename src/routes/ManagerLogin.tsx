import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';
import '../styles/ManagerLogin.css';

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, code); // Treat employee code as password
      navigate('/manager/dashboard'); // Redirect to manager view
    } catch (err: any) {
      setError('Invalid login. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="manager-login-container">
        <div className="login-card">
          <h2 className="login-title">Manager Log In</h2>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="code">Employee Code</label>
            <input
              id="code"
              type="password"
              placeholder="Password"
              onChange={(e) => setCode(e.target.value)}
            />

            <button type="submit">Log In</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default ManagerLogin;
