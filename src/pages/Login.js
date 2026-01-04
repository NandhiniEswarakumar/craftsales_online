import React, { useEffect, useState } from 'react';
import api from '../utils/apiClient';
import { useLocation, useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://craftsales-online.onrender.com';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || '';
  const justSignedUp = Boolean(location.state?.justSignedUp);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [message, setMessage] = useState('');
  const handleLoginClick = () => {
    const formEl = document.getElementById('login-form');
    if (formEl) formEl.requestSubmit();
  };

  useEffect(() => {
    if (initialEmail) {
      setForm((prev) => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/login', { 
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
      const msg = err?.response?.data?.message || 'Invalid credentials';
      setError(msg);
    }
  };

  const handleSendVerification = async () => {
    setError('');
    if (!form.email) {
      setError('Enter your email to receive the verification code.');
      return;
    }
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Could not send verification email');
      }
      setMessage('Verification code sent. Check your email.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
  const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'https://craftsales-online.onrender.com'}/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {justSignedUp && (
        <div className="info-message" style={{ color: '#8e5c00', background: '#fff5e6', padding: '10px', borderRadius: '6px', marginBottom: '12px', textAlign: 'center', border: '1px solid #ffd89c' }}>
          Account created. Choose an option below: verify your email or continue to login.
        </div>
      )}
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
      {message && !error && <div className="success-message" style={{color: '#1d8f3b', marginBottom: '10px', textAlign: 'center'}}>{message}</div>}
      <form id="login-form" className="login-form" onSubmit={handleSubmit}>
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
      <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleSendVerification}
          style={{ padding: '10px 12px', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Verify email (send code)
        </button>
        <button
          type="button"
          onClick={handleLoginClick}
          style={{ padding: '10px 12px', background: '#2d3436', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Continue to login
        </button>
      </div>
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

      <div style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.95rem'}}>
        Don't have an account? <button onClick={() => navigate('/signup')} style={{background: 'none', border: 'none', color: '#7b5e57', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.95rem'}}>Sign up here</button>
      </div>

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
