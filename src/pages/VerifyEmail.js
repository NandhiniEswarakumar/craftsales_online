import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email/${token}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <div className="verify-email">
      <div className="verify-email__container">
        {status === 'verifying' && (
          <>
            <div className="verify-email__spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="verify-email__success">✓</div>
            <h2>Email Verified Successfully!</h2>
            <p>{message}</p>
            <p>You will be redirected to the login page in a few seconds.</p>
            <button 
              className="verify-email__button"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="verify-email__error">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <button 
              className="verify-email__button"
              onClick={() => navigate('/signup')}
            >
              Back to Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
