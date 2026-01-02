import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VerifyEmail.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://craftsales-online.onrender.com';

const VerifyCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus('verifying');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid code');
      }
      setStatus('success');
      setMessage('Email verified! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setMessage('Enter your email to resend code');
      return;
    }
    setStatus('resending');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Could not resend');
      }
      setStatus('idle');
      setMessage('Code resent. Check your email.');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="verify-email">
      <div className="verify-email__container">
        <h2>Enter Verification Code</h2>
        <p>We sent a 6-digit code to your email.</p>

        <form onSubmit={handleVerify} className="verify-email__form">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />

          <label>Verification Code</label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            maxLength={6}
            required
          />

          <button type="submit" className="verify-email__primary" disabled={status === 'verifying'}>
            {status === 'verifying' ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="verify-email__actions">
          <button className="verify-email__button" onClick={handleResend} disabled={status === 'resending'}>
            {status === 'resending' ? 'Sending...' : 'Resend Code'}
          </button>
          <button className="verify-email__button secondary" onClick={() => navigate('/login')}>
            Back to Login
          </button>
        </div>

        {message && (
          <p className={`verify-email__message ${status === 'error' ? 'is-error' : 'is-info'}`}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyCode;
