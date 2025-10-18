import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';


const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    mobile: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!/^\d{10}$/.test(form.mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (!form.address.trim()) {
      setError('Please enter your address.');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        username: form.username,
        email: form.email,
        mobile: form.mobile,
        address: form.address,
        password: form.password
      };
      const response = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        alert('Signup successful! Please check your email and click the verification link to activate your account. You can then login with your credentials.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <h2>Signup</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" value={form.username} onChange={handleChange} required />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
        <label htmlFor="mobile">Mobile Number</label>
        <input type="text" id="mobile" name="mobile" placeholder="Enter your mobile number" value={form.mobile} onChange={handleChange} required maxLength={10} pattern="\d{10}" />
  <label htmlFor="address">Address</label>
  <textarea id="address" name="address" placeholder="Enter the detailed address" value={form.address} onChange={handleChange} required rows={4} style={{resize:'vertical'}} />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <div className="google-signin-separator">or</div>
        <button type="button" className="google-signin-btn" onClick={() => alert('Google Sign In (demo)')}> 
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" style={{width:20, marginRight:8, verticalAlign:'middle'}} />
          Sign up with Google
        </button>
      </form>
    </div>
  );
};

export default Signup;
