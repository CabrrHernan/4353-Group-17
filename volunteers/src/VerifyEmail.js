import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      fetch(`/api/verify-email?token=${token}`)
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Email verified successfully') {
            setMessage('Email verified successfully. You can now log in.');
            setTimeout(() => navigate('/login'), 3000);
          } else {
            setMessage(data.message);
          }
        })
        .catch(error => {
          setMessage('An error occurred. Please try again.');
        });
    } else {
      setMessage('Invalid verification link.');
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{message}</p>
    </div>
  );
}

export default VerifyEmail;