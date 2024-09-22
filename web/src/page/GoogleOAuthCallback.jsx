import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeGoogleToken } from '../api/requests';

const GoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      
      if (!code) {
        setStatus('Error: No authorization code found');
        return;
      }

      try {
        const result = await exchangeGoogleToken(code);
        
        if (localStorage.getItem('auth')) {
          setStatus('Authentication successful. Redirecting...');
          setTimeout(() => navigate('/panel'), 2000);
        } else {
          throw new Error('Failed to store authentication tokens');
        }
      } catch (error) {
        console.error('Error in Google sign-in:', error);
        setStatus(`Error: ${error.message || 'An error occurred during Google sign-in'}`);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Google Sign-In</h2>
        <p>{status}</p>
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;