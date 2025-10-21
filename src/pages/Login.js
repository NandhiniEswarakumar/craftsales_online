import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/login', { 
        email: form.email, 
        password: form.password 
      });
      setUser(res.data); // res.data should have username
      localStorage.setItem("crafthub_user", JSON.stringify(res.data));
      
      // Redirect admin users directly to admin page
      if (res.data.email === 'admin@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5001/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  // Fetch login history (assuming an API endpoint exists)
  const fetchLoginHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/login-history');
      setLoginHistory(res.data);
    } catch (err) {
      console.error('Error fetching login history:', err);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
        <div className="google-signin-separator">or</div>
        <button type="button" className="google-signin-btn" onClick={() => alert('Google Sign In (demo)')}> 
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{width:20, marginRight:8, verticalAlign:'middle'}} />
          Sign in with Google
        </button>
      </form>
      <button
        type="button"
        onClick={() => navigate('/forgot-password')}
        style={{
          background: 'none',
          border: 'none',
          color: '#3498db',
          cursor: 'pointer',
          marginTop: '1rem',
          textDecoration: 'underline',
          fontSize: '1rem',
          fontWeight: 'bold'
        }}
      >
        Forgot Password?
      </button>

      {showForgot && (
        <form onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={forgotEmail}
            required
            onChange={(e) => setForgotEmail(e.target.value)}
            style={{ marginTop: '1rem' }}
          />
          <button type="submit">Send Reset Link</button>
        </form>
      )}

      {message && <p>{message}</p>}

      {/* Removed login history table */}
      
    </div>
  );
};

export default Login;
